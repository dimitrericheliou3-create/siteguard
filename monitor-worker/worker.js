const MAX_CHECKS=20,TIMEOUT=10000;
const BLOCKED_SUFFIXES=[".localhost",".local",".internal",".test",".invalid",".example",".onion",".arpa",".lan",".home",".corp"];
function safeHost(h){
  h=h.toLowerCase().replace(/\.$/,"");
  if(!h||h.length>253||!h.includes(".")||h.includes(":")||/^\d{1,3}(\.\d{1,3}){3}$/.test(h))return false;
  if(BLOCKED_SUFFIXES.some(s=>h===s.slice(1)||h.endsWith(s)))return false;
  const labels=h.split(".");
  if(labels.some(x=>!x||x.length>63||! /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(x)))return false;
  if(/^\d+$/.test(labels.at(-1)))return false;
  return true;
}
async function check(site){
  const start=Date.now();
  try{
    const u=new URL(site.url);
    if(!["http:","https:"].includes(u.protocol)||!safeHost(u.hostname)||u.username||u.password||(u.port&&!["80","443"].includes(u.port)))throw Error("blocked");
    const c=new AbortController(),timer=setTimeout(()=>c.abort(),TIMEOUT);
    let r;
    try{r=await fetch(u,{method:"GET",redirect:"manual",signal:c.signal,headers:{"User-Agent":"SiteGuardBot/1.0"}})}
    finally{clearTimeout(timer)}
    return{status:r.status>=200&&r.status<400?"up":"down",code:r.status,ms:Date.now()-start,error:r.status>=400?"HTTP "+r.status:null};
  }catch(e){return{status:"down",code:null,ms:Date.now()-start,error:e.name==="AbortError"?"Request timed out":"Connection failed"}}
}
async function run(env){
  // Keep stored intervals aligned with the current plan, including sites created before plan changes.
  await env.DB.prepare("UPDATE sites SET interval_minutes=CASE WHEN EXISTS (SELECT 1 FROM subscriptions sub WHERE sub.user_id=sites.user_id AND sub.status='ACTIVE' AND sub.plan_key IN ('starter','pro','agency')) THEN 5 ELSE 30 END WHERE is_active=1").run();
  const q=await env.DB.prepare("SELECT id,url,interval_minutes FROM sites WHERE is_active=1 AND (last_checked_at IS NULL OR datetime(last_checked_at,'+'||interval_minutes||' minutes')<=datetime('now')) ORDER BY last_checked_at ASC LIMIT ?").bind(MAX_CHECKS).all();
  for(const s of q.results||[]){
    const r=await check(s);
    await env.DB.batch([
      env.DB.prepare("INSERT INTO checks(site_id,status,status_code,response_ms,error_message) VALUES(?,?,?,?,?)").bind(s.id,r.status,r.code,r.ms,r.error),
      env.DB.prepare("UPDATE sites SET last_status=?,last_checked_at=datetime('now'),last_status_code=?,last_response_ms=?,consecutive_failures=CASE WHEN ?='down' THEN consecutive_failures+1 ELSE 0 END WHERE id=?").bind(r.status,r.code,r.ms,r.status,s.id)
    ]);
  }
  await env.DB.prepare("DELETE FROM checks WHERE id IN (SELECT id FROM checks c WHERE (SELECT COUNT(*) FROM checks n WHERE n.site_id=c.site_id AND (n.checked_at>c.checked_at OR (n.checked_at=c.checked_at AND n.id>c.id)))>=500)").run();
}
export default{async scheduled(_e,env,ctx){ctx.waitUntil(run(env))},async fetch(){return new Response("SiteGuard monitor worker is running.")}}
