const $=id=>document.getElementById(id),GOAL=[1,2,3,4,5,6,7,8,0];
const NB=[[1,3],[0,2,4],[1,5],[0,4,6],[1,3,5,7],[2,4,8],[3,7],[4,6,8],[5,7]];
const fmt=s=>(s.slice(0,3)+'·'+s.slice(3,6)+'·'+s.slice(6)).replace(/0/g,'_');
const parse=s=>[...s].map(Number);
const inv=a=>{const b=a.filter(x=>x);let c=0;for(let i=0;i<b.length;i++)for(let j=i+1;j<b.length;j++)if(b[i]>b[j])c++;return c%2};
const dirName=(b,n)=>{const d=n-b;return d==-3?'Up':d==3?'Down':d==-1?'Left':'Right'};
function mini(a,sz=84){let h=`<svg viewBox="0 0 90 90" width="${sz}" height="${sz}" class="mini">`;a.forEach((v,i)=>{const x=(i%3)*30+1,y=Math.floor(i/3)*30+1;h+=v?`<rect x="${x}" y="${y}" width="28" height="28" rx="5" fill="var(--tile)"/><text x="${x+14}" y="${y+20}" text-anchor="middle" font-size="16" font-weight="700" fill="var(--tt)">${v}</text>`:`<rect x="${x}" y="${y}" width="28" height="28" rx="5" fill="none" stroke="var(--mut)" stroke-dasharray="3"/>`});return h+'</svg>'}
// ---------- navigation
function go(p){document.querySelectorAll('.page').forEach(e=>e.classList.toggle('on',e.id===p));document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('on',b.dataset.p===p));window.scrollTo(0,0)}
document.querySelectorAll('.nav button').forEach(b=>b.onclick=()=>go(b.dataset.p));
$('heroBoards').innerHTML=mini([2,8,3,1,6,4,7,0,5],110)+'<span class="text-3xl mut">→</span>'+mini(GOAL,110);
// ---------- UCS
function hPush(h,v){h.push(v);let i=h.length-1;while(i>0){const p=(i-1)>>1;if(h[p]<=h[i])break;[h[p],h[i]]=[h[i],h[p]];i=p}}
function hPop(h){const t=h[0],l=h.pop();if(h.length){h[0]=l;let i=0;for(;;){const a=2*i+1,b=a+1;let m=i;if(a<h.length&&h[a]<h[m])m=a;if(b<h.length&&h[b]<h[m])m=b;if(m===i)break;[h[m],h[i]]=[h[i],h[m]];i=m}}return t}
function ucs(init,goal){
 const t0=performance.now(),gk=goal.join(''),i0=init.join('');
 const st=[i0],par=[-1],g=[0],mv=[''],seen=new Set([i0]),heap=[0],ga=[],md=[];let m=0,goalId=-1;
 while(heap.length){
  const id=hPop(heap)%1e7,s=st[id];
  if(s===gk){goalId=id;ga.push(st.length);md.push(m);break}
  const b=s.indexOf('0');
  for(const n of NB[b]){const a=[...s];a[b]=a[n];a[n]='0';const t=a.join('');if(seen.has(t))continue;seen.add(t);
   const nid=st.length,ng=g[id]+1;st.push(t);par.push(id);g.push(ng);mv.push(dirName(b,n));if(ng>m)m=ng;hPush(heap,ng*1e7+nid)}
  ga.push(st.length);md.push(m)}
 return{st,par,g,mv,ga,md,goalId,found:goalId>=0,ms:performance.now()-t0}
}
// ---------- board
$('tiles').innerHTML=[1,2,3,4,5,6,7,8].map(n=>`<g class="tile" id="t${n}"><rect x="5" y="5" width="90" height="90" rx="14" fill="var(--tile)"/><text x="50" y="66" text-anchor="middle" font-size="44" font-weight="800" fill="var(--tt)">${n}</text></g>`).join('');
function setBoard(a){for(let n=1;n<=8;n++){const i=a.indexOf(n);$('t'+n).style.transform=`translate(${(i%3)*100}px,${Math.floor(i/3)*100}px)`}}
// ---------- inputs
let mode='manual';
function grid(el,vals,cls){el.innerHTML=vals.map((v,i)=>`<input class="gi ${cls}" maxlength="1" inputmode="numeric" value="${v}">`).join('');el.querySelectorAll('input').forEach(i=>i.oninput=()=>{resetAll();preview()})}
const readG=c=>[...document.querySelectorAll('.'+c)].map(i=>i.value.trim()===''?-1:+i.value);
const valid=a=>a.length===9&&[0,1,2,3,4,5,6,7,8].every(x=>a.includes(x));
function preview(){const a=readG('ii'),b=readG('ig');$('miniInit').innerHTML=valid(a)?mini(a,120):'<div class="mut text-xs text-center">invalid</div>';$('miniGoal').innerHTML=valid(b)?mini(b,120):'<div class="mut text-xs text-center">invalid</div>';if(valid(a))setBoard(a)}
function setMode(m){mode=m;$('mManual').classList.toggle('pri',m=='manual');$('mRandom').classList.toggle('pri',m=='random');$('shuffle').style.display=m=='random'?'block':'none';document.querySelectorAll('.ig').forEach(i=>i.disabled=m=='random');if(m=='random')randomize();}
function randomize(){resetAll();grid($('gGoal'),GOAL,'ig');document.querySelectorAll('.ig').forEach(i=>i.disabled=true);
 let a=[...GOAL],prev=-1;for(let i=0;i<60;i++){const b=a.indexOf(0),o=NB[b].filter(x=>x!==prev),n=o[Math.random()*o.length|0];a[b]=a[n];a[n]=0;prev=b}
 if(a.join('')===GOAL.join(''))return randomize();grid($('gInit'),a,'ii');preview()}
$('mManual').onclick=()=>{setMode('manual');document.querySelectorAll('.ig').forEach(i=>i.disabled=false)};$('mRandom').onclick=()=>setMode('random');$('shuffle').onclick=randomize;
grid($('gInit'),[2,8,3,1,6,4,7,0,5],'ii');grid($('gGoal'),GOAL,'ig');preview();
// ---------- state & playback
const S={T:null,k:-1,timer:null,playing:false,rt:null};
const last=()=>S.T.ga.length-1;
function say(t,c){$('msg').innerHTML=t?`<span style="color:var(--${c||'bad'})">${t}</span>`:''}
function ensure(){
 if(S.T)return true;const a=readG('ii'),b=readG('ig');
 if(!valid(a)||!valid(b)){say('Each state must use every digit 0–8 exactly once.');return false}
 if(inv(a)!==inv(b))say('Parity differs: this puzzle is unsolvable. UCS will exhaust all 181,440 reachable states — use “Skip to end”.','bad');else say('');
 S.init=a;S.goal=b;$('status').textContent='Searching…';S.T=ucs(a,b);S.k=-1;return true}
function pause(){clearTimeout(S.timer);S.timer=null;S.playing=false;ui()}
function play(){if(S.playing||!S.T||S.k>=last())return;stopReplay();S.playing=true;ui();
 const loop=()=>{const sp=+$('speed').value,batch=sp<8?1:Math.pow(4,sp-7);S.k=Math.min(last(),S.k+batch);render();
  if(S.k>=last()){S.playing=false;S.timer=null;ui();return}S.timer=setTimeout(loop,Math.round(1000/Math.pow(1.6,sp-1)))};S.timer=setTimeout(loop,0)}
function stopReplay(){clearTimeout(S.rt);S.rt=null}
function resetAll(){pause();stopReplay();S.T=null;S.k=-1;say('');$('status').textContent='Idle — set a puzzle and press Run.';render()}
$('bRun').onclick=()=>{if(!ensure())return;pause();S.k=-1;play()};
$('bPause').onclick=pause;$('bResume').onclick=play;
$('bNext').onclick=()=>{if(!ensure())return;pause();stopReplay();if(S.k<last()){S.k++;render()}ui()};
$('bPrev').onclick=()=>{pause();stopReplay();if(S.T&&S.k>=0){S.k--;render()}ui()};
$('bEnd').onclick=()=>{if(!ensure())return;pause();S.k=last();render()};
$('bReset').onclick=()=>{resetAll();preview()};
$('speed').oninput=e=>$('spv').textContent=e.target.value;
function ui(){const T=S.T,l=T?last():0;
 $('bRun').disabled=S.playing;$('bPause').disabled=!S.playing;$('bResume').disabled=S.playing||!T||S.k>=l||S.k<0;
 $('bPrev').disabled=!T||S.k<0;$('bNext').disabled=T&&S.k>=l;$('bEnd').disabled=T&&S.k>=l;$('bReplay').disabled=!!S.rt}
// ---------- render
const set=(id,v)=>$(id).textContent=v;
function render(){
 const T=S.T;$('result').style.display='none';$('pathCard').style.display='none';
 if(!T||S.k<0){['sGen','sExp','sDepth','sCost','sFr','sEx'].forEach(i=>set(i,0));set('sGen',T?1:0);set('sNode','—');set('sPar','—');$('kids').innerHTML='<span class="mut text-sm">—</span>';$('fr').innerHTML='';$('ex').innerHTML='';
  if(T){setBoard(S.init);$('status').textContent='Ready — start node in frontier.'}ui();return}
 const k=S.k,s=T.st[k],gen=T.ga[k],isGoal=T.found&&k===T.goalId,exp=isGoal?k:k+1,p=T.par[k];
 setBoard(parse(s));
 set('sGen',gen);set('sExp',exp);set('sDepth',T.g[k]);set('sCost',T.g[k]);set('sFr',gen-1-k);set('sEx',exp);
 set('sNode',`#${k} ${fmt(s)}`);set('sPar',p<0?'none (root)':`#${p} ${fmt(T.st[p])}`);
 const from=k?T.ga[k-1]:1,kids=[];for(let i=from;i<gen;i++)kids.push(`<div class="text-center">${mini(parse(T.st[i]),70)}<div class="text-xs mut">${T.mv[i]} · g=${T.g[i]}</div></div>`);
 $('kids').innerHTML=kids.length?kids.join(''):`<span class="mut text-sm">${isGoal?'Goal test passed — no expansion.':'No new successors (all already seen).'}</span>`;
 let f='';const fe=Math.min(gen-1,k+12);for(let i=k+1;i<=fe;i++)f+=`<span class="chip">${fmt(T.st[i])} g=${T.g[i]}</span>`;
 $('fr').innerHTML=f+(gen-1-k>12?`<div class="mut text-xs mt-1">+ ${gen-1-k-12} more…</div>`:f?'':'<span class="mut text-sm">empty</span>');
 let e='';const ee=isGoal?k-1:k;for(let i=ee;i>=Math.max(0,ee-11);i--)e+=`<span class="chip">${fmt(T.st[i])}</span>`;
 $('ex').innerHTML=e+(ee>11?`<div class="mut text-xs mt-1">+ ${ee-11} older…</div>`:'');
 $('status').textContent=`Expanding node #${k} at depth ${T.g[k]}`;
 if(k===last()){
  const mem=gen*70/1024,path=[];if(T.found)for(let i=T.goalId;i>=0;i=T.par[i])path.unshift(i);
  const R=(l,v)=>`<div class="stat"><div class="lbl">${l}</div><div class="val text-base">${v}</div></div>`;
  $('result').style.display='block';$('status').textContent=T.found?'Goal reached ✔':'Search exhausted ✘';
  $('result').innerHTML=`<h2 style="color:var(--${T.found?'ok':'bad'})">${T.found?'✔ Solution Found':'✘ Solution Not Found (puzzle is unsolvable)'}</h2><div class="grid grid-cols-2 sm:grid-cols-4 gap-2">`+
   R('Total moves',T.found?T.g[T.goalId]:'—')+R('Nodes generated',gen.toLocaleString())+R('Nodes expanded',exp.toLocaleString())+R('Max search depth',T.md[k])+
   R('Execution time',T.ms.toFixed(2)+' ms')+R('Path cost',T.found?T.g[T.goalId]:'—')+R('Memory (approx.)',mem>1024?(mem/1024).toFixed(2)+' MB':mem.toFixed(0)+' KB')+R('Frontier left',gen-1-k)+'</div>';
  if(T.found){$('pathCard').style.display='block';S.path=path.map(i=>T.st[i]);
   $('path').innerHTML=path.map((id,i)=>`<div class="text-center shrink-0">${mini(parse(T.st[id]),84)}<div class="text-xs mut">${i?T.mv[id]+' ('+i+')':'Start'}</div></div>`).join('<div class="self-center mut">→</div>')}}
 ui()}
$('bReplay').onclick=()=>{if(!S.path)return;stopReplay();let i=0;const step=()=>{setBoard(parse(S.path[i]));$('status').textContent=`Solution replay: move ${i}/${S.path.length-1}`;i++;if(i<S.path.length)S.rt=setTimeout(step,Math.max(300,700-$('speed').value*50));else{S.rt=null;ui()}};ui();step()};
render();ui();
