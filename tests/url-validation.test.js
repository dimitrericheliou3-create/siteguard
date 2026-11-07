import test from "node:test";
import assert from "node:assert/strict";
import {validateSiteUrl} from "../functions/api/_lib.js";

test("accepts public HTTPS domains",()=>assert.equal(validateSiteUrl("https://example.com").host,"example.com"));
test("accepts public HTTP domains",()=>assert.equal(validateSiteUrl("http://example.org").host,"example.org"));
test("normalizes host casing and trailing dot",()=>assert.equal(validateSiteUrl("https://EXAMPLE.COM.").host,"example.com"));
test("rejects localhost and private-use hostnames",()=>{
  for(const url of ["http://localhost","http://printer.local","http://server.internal","http://app.example","http://router.lan"])assert.throws(()=>validateSiteUrl(url));
});
test("rejects IP literals",()=>assert.throws(()=>validateSiteUrl("http://127.0.0.1")));
test("rejects non-HTTP protocols",()=>assert.throws(()=>validateSiteUrl("ftp://example.com")));
test("rejects URL credentials",()=>assert.throws(()=>validateSiteUrl("https://user:pass@example.com")));
test("rejects nonstandard ports",()=>assert.throws(()=>validateSiteUrl("https://example.com:3000")));
test("rejects malformed domain labels",()=>{
  for(const url of ["https://bad_name.example.com","https://-bad.example.com","https://bad..example.com"])assert.throws(()=>validateSiteUrl(url));
});
