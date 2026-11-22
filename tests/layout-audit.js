// Przegląd układu: każdy ekran, oba języki, kilka rozmiarów okna. Wypisuje elementy wychodzące poza ramkę.
const {chromium}=require('playwright');
const SIZES=process.argv[2]==='quick'?[[1440,900]]:[[1440,900],[1280,680],[390,800],[360,640]];
(async()=>{const b=await chromium.launch();const out=[];let shots=0;
for(const lang of ['en','pl'])for(const [vw,vh] of SIZES){
  const c=await b.newContext({viewport:{width:vw,height:vh}});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await require('./serve.js')(p,require('path').join(__dirname,'..'));
  await p.addInitScript(l=>{if(!localStorage.getItem('kto-to-zrobil-v2'))localStorage.setItem('kto-to-zrobil-v2',JSON.stringify({lang:l,name:'Maksymilian123',tutDone:true,rounds:4,coins:12345,xp:900,acc:['bow','bell','hat'],trophies:{star:2,mouse:1},lv:{salon:[3,2,3,1,2,1,1,1],kuchnia:[1,1,1,1,1,1,1],biuro:[]},rooms:{salon:{best:12345,stars:2},kuchnia:{best:0,stars:0},biuro:{best:0,stars:0}}}))},lang);
  await p.goto('http://game.local/index.html');await p.waitForTimeout(900);
  const check=async name=>{const r=await p.evaluate(()=>{const st=document.getElementById('stage').getBoundingClientRect(),bad=[];
      const vis=el=>{const s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&el.getClientRects().length};
      for(const el of document.querySelectorAll('#stage *, #coach, #coach *')){if(!vis(el)||el.tagName==='CANVAS')continue;const r=el.getBoundingClientRect();const tx=(el.textContent||'').trim().slice(0,40);
        const host=el.closest('#coach')?document.getElementById('coach').getBoundingClientRect():st;
        if(r.width&&(r.left<host.left-1||r.right>host.right+1))bad.push('outside-x: <'+el.tagName+'.'+el.className+'> "'+tx+'" '+Math.round(r.left-host.left)+'..'+Math.round(r.right-host.left)+' of '+Math.round(host.width));
        if(el.scrollWidth>el.clientWidth+1&&getComputedStyle(el).overflowX!=='visible'&&el.children.length===0)bad.push('clipped-x: <'+el.tagName+'.'+el.className+'> "'+tx+'"');
        if(el.id==='coach'&&el.scrollHeight>el.clientHeight+1)bad.push('coach clipped: "'+tx+'" '+el.scrollHeight+'>'+el.clientHeight)}
      for(const row of document.querySelectorAll('#stage .row, #stage .list li, #stage .hud-row, #stage .hud-sub, #stage .tabs, #stage .up, #stage .lv, #stage .lv-grid')){if(!vis(row))continue;const ks=[...row.children].filter(vis).map(k=>[k,k.getBoundingClientRect()]);
        for(let a=0;a<ks.length;a++)for(let b=a+1;b<ks.length;b++){const A=ks[a][1],B=ks[b][1];const ox=Math.min(A.right,B.right)-Math.max(A.left,B.left),oy=Math.min(A.bottom,B.bottom)-Math.max(A.top,B.top);
          if(ox>2&&oy>2)bad.push('overlap: "'+(ks[a][0].textContent||'').trim().slice(0,24)+'" / "'+(ks[b][0].textContent||'').trim().slice(0,24)+'"')}}
      for(const el of document.querySelectorAll('#stage .lv')){const r=el.getBoundingClientRect();if(vis(el)&&r.height>r.width)bad.push('level pips stacked vertically')}
      const sw=document.documentElement.scrollWidth,cw=document.documentElement.clientWidth;if(sw>cw+1)bad.push('page scrolls sideways '+sw+'>'+cw);
      const c=document.getElementById('coach').getBoundingClientRect();if(c.height&&c.bottom>innerHeight+1)bad.push('coach below the window: '+Math.round(c.bottom)+'>'+innerHeight);
      if(st.bottom>innerHeight+1)bad.push('stage below the window: '+Math.round(st.bottom)+'>'+innerHeight);return bad});
    for(const x of [...new Set(r)])out.push(`[${lang} ${vw}x${vh}] ${name}: ${x}`);
    if(vw===1440||vw===390){if(process.env.SHOTS){await p.screenshot({path:`${process.env.SHOTS}/${lang}_${vw}_${name}.png`})}shots++}};
  await check('home');
  for(const tb of ['ulepszenia','kryjowka','album']){await p.click(`[data-act=tab][data-k=${tb}]`);await p.waitForTimeout(150);await check(tb)}
  await p.click('[data-act=tab][data-k=pokoje]');await p.click('[data-act=tst]');await p.waitForTimeout(1000);await check('test');
  await p.click('[data-act=play][data-k=salon][data-l="7"]');await p.waitForTimeout(250);await check('brief');
  await p.click('[data-act=go]');await p.waitForTimeout(500);await check('play-intro');
  // wszystkie podpowiedzi pod sceną i napisy na scenie, po kolei
  const texts=await p.evaluate(()=>window.__game.texts());
  let worst=0,worstT='';
  for(const tx of texts.coach){const o=await p.evaluate(t=>window.__game.coachTest(t),tx);if(o>worst){worst=o;worstT=tx}}
  if(worst>0)out.push(`[${lang} ${vw}x${vh}] coach text clipped by ${worst}px: "${worstT.slice(0,60)}"`);
  const cv=await p.evaluate(ts=>window.__game.sayTest(ts),texts.say);
  for(const x of cv.bad)out.push(`[${lang} ${vw}x${vh}] canvas text outside: ${x}`);
  if(vw===1440)console.log(`[${lang}] napisy na scenie: przed poprawką ${cv.before} z ${cv.total} ustawień wychodziło poza scenę, po poprawce ${cv.bad.length}`);
  await p.waitForTimeout(250);await check('play-texts');
  await p.evaluate(()=>{window.__game.time=0.3});await p.waitForTimeout(1500);await check('result');
  await p.click('[data-act=open]');await p.waitForTimeout(200);await check('result-open');
  if(errs.length)out.push(`[${lang} ${vw}x${vh}] JS errors: ${errs.join(' | ')}`);await c.close()}
console.log(out.length?out.join('\n'):'NO LAYOUT PROBLEMS FOUND');console.log('screens checked, shots:',shots);await b.close()})();
