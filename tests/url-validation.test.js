import test from "node:test";import assert from "node:assert/strict";
function validate(input){let u;try{u=new URL(input)}catch{throw Error("invalid")}if(!["http:","https:"].includes(u.protocol))throw Error("protocol");if(u.username||u.password)throw Error("credentials");if(u.port&&!["80","443"].includes(u.port))throw Error("port");const h=u.hostname.toLowerCase().replace(/\.$/,"");if(!h||h==="localhost"||h.endsWith(".localhost")||h.endsWith(".local")||h.endsWith(".internal")||h.endsWith(".test")||h.endsWith(".invalid"))throw Error("host");if(/^\d{1,3}(\.\d{1,3}){3}$/.test(h)||h.includes(":"))throw Error("ip");if(!h.includes(".")||h.length>253)throw Error("domain");return h}
test("accepts public HTTPS domain",()=>assert.equal(validate("https://example.com"),"example.com"));
test("accepts public HTTP domain",()=>assert.equal(validate("http://example.org"),"example.org"));
test("rejects localhost",()=>assert.throws(()=>validate("http://localhost")));
test("rejects IP literal",()=>assert.throws(()=>validate("http://127.0.0.1")));
test("rejects non-HTTP protocol",()=>assert.throws(()=>validate("ftp://example.com")));
test("rejects URL credentials",()=>assert.throws(()=>validate("https://u:p@example.com")));
test("rejects unusual port",()=>assert.throws(()=>validate("https://example.com:3000")));
