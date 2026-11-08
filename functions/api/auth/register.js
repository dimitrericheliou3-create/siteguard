import {json,readJson,randomId,passwordHash,setSessionCookie,sha256,sameOrigin} from "../_lib.js";

export async function onRequestPost({request,env}){
  if(!sameOrigin(request))return json({error:"Cross-origin request blocked."},403);
  let stage="request";
  try{
    stage="parse_request";
    const{email,password}=await readJson(request);
    const e=String(email||"").trim().toLowerCase();
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)||e.length>254)return json({error:"Enter a valid email address."},400);
    if(typeof password!=="string"||password.length<12||password.length>128)return json({error:"Use a password between 12 and 128 characters."},400);
    stage="check_database_binding";
    if(!env.DB)throw new Error("D1 binding env.DB is unavailable");
    stage="check_existing_user";
    if(await env.DB.prepare("SELECT id FROM users WHERE email=?").bind(e).first())return json({error:"An account with that email already exists."},409);
    stage="hash_password";
    const id=randomId(),salt=randomId()+randomId(),hash=await passwordHash(password,salt);
    stage="insert_user_and_subscription";
    await env.DB.batch([
      env.DB.prepare("INSERT INTO users(id,email,password_hash,password_salt) VALUES(?,?,?,?)").bind(id,e,hash,salt),
      env.DB.prepare("INSERT INTO subscriptions(id,user_id,status,plan_key) VALUES(?,?,'INACTIVE','free')").bind(randomId(),id)
    ]);
    stage="create_session";
    const token=randomId()+randomId();
    await env.DB.prepare("INSERT INTO sessions(id,user_id,token_hash,expires_at) VALUES(?,?,?,datetime('now','+14 days'))").bind(randomId(),id,await sha256(token)).run();
    stage="return_response";
    return json({user:{id,email:e}},201,{"Set-Cookie":setSessionCookie(token)});
  }catch(error){
    console.error("SiteGuard registration failed",{
      stage,
      name:error?.name||"Error",
      message:error?.message||String(error)
    });
    const diagnosticStage=error?.code?stage+":"+error.code:stage;
    return json({error:"Could not create account. Please try again shortly.",debug_stage:diagnosticStage},500);
  }
}
