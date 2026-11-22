const fs=require('fs'),path=require('path');
const types={'.html':'text/html','.webp':'image/webp','.mp3':'audio/mpeg','.png':'image/png'};
module.exports=async(page,root)=>{await page.route('http://game.local/**',r=>{const f=path.join(root,new URL(r.request().url()).pathname);
  if(fs.existsSync(f))r.fulfill({status:200,contentType:types[path.extname(f)]||'application/octet-stream',body:fs.readFileSync(f)});else r.fulfill({status:404,body:''})})};
