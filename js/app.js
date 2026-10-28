const T = window.MAPLE_TABLES;
const NEED = T.need, HOURLY = T.hourly;
const API = 'https://open.api.nexon.com/maplestory/v1';

/* ---------- 게임 데이터 ---------- */
const ARC = [ // 아케인: 이름, 최소레벨, 일퀘 경험치
  {key:'소멸의 여로', min:200, dq:732130000},
  {key:'츄츄 아일랜드', min:210, dq:2141650000},
  {key:'레헬른', min:220, dq:3189090000},
  {key:'아르카나', min:225, dq:3305180000},
  {key:'모라스', min:230, dq:4398260000},
  {key:'에스페라', min:235, dq:4530840000},
];
const AUT = [
  {key:'세르니움', min:260, dq:16455682080},
  {key:'아르크스', min:265, dq:19372782409},
  {key:'오디움', min:270, dq:23246151120},
  {key:'도원경', min:275, dq:32127015480},
  {key:'아르테리아', min:280, dq:38593450000},
  {key:'카르시온', min:285, dq:45635220000},
  {key:'탈라하트', min:290, dq:89730910000},
  {key:'기어드락', min:295, dq:105641070000},
];
const TEN = [
  {key:'문브릿지', min:245, dq:8397548775},
  {key:'고통의 미궁', min:250, dq:9057690000},
  {key:'리멘', min:255, dq:10225741680},
];
const MP = [ // 몬스터파크 1회 (7회 합계 ÷ 7, 보너스 미적용)
  [200,359914286],[210,1285078571],[220,3217660000],[225,4707572857],[230,5993510000],[235,6919667143],[240,8712814286],[245,11716615714],[250,14058900000],[255,15552557143],[260,37474604286],[265,44435445714],[270,52818834286],[275,76639837143],[280,107204031429],[285,156017855714],[290,218575315714],[295,316934207143]
];
// 익스트림 몬스터파커(주간, 260+, 몬파 5회) — 레벨 대비 %
const XMP = [[260,15.31],[270,10.48],[275,6.51],[280,2.6],[285,1.04],[290,0.42],[299,0.07]];
const EPIC = [ // 에픽던전 1회 경험치 = 레벨 필요 경험치 대비 % [기본, EXP 1단계, EXP 2단계]
  {key:'하이마운틴', min:260, pct:{"260":[15.064,60.257,120.514],"261":[15.132,60.529,121.058],"262":[15.198,60.79,121.58],"263":[15.254,61.018,122.035],"264":[15.342,61.368,122.736],"265":[13.278,53.113,106.227],"266":[13.324,53.297,106.595],"267":[13.372,53.489,106.979],"268":[13.443,53.772,107.543],"269":[13.486,53.945,107.89],"270":[6.832,27.33,54.659],"271":[6.864,27.454,54.908],"272":[6.884,27.537,55.074],"273":[6.904,27.616,55.232],"274":[6.935,27.74,55.481],"275":[3.859,15.434,30.869],"276":[3.552,14.207,28.414],"277":[3.275,13.099,26.197],"278":[3.014,12.056,24.112],"279":[2.778,11.111,22.222],"280":[1.544,6.177,12.354],"281":[1.423,5.692,11.384],"282":[1.309,5.237,10.473],"283":[1.206,4.824,9.648],"284":[1.109,4.437,8.875],"285":[0.617,2.47,4.939],"286":[0.568,2.271,4.542],"287":[0.523,2.092,4.183],"288":[0.481,1.926,3.852],"289":[0.443,1.771,3.542],"290":[0.246,0.985,1.97],"291":[0.226,0.906,1.811],"292":[0.208,0.834,1.667],"293":[0.192,0.767,1.535],"294":[0.176,0.705,1.41],"295":[0.098,0.392,0.784],"296":[0.09,0.361,0.722],"297":[0.083,0.332,0.664],"298":[0.076,0.305,0.61],"299":[0.051,0.206,0.412]}},
  {key:'앵글러 컴퍼니', min:270, pct:{"270":[10.249,40.994,81.989],"271":[10.295,41.181,82.362],"272":[10.326,41.306,82.612],"273":[10.356,41.424,82.848],"274":[10.403,41.61,83.221],"275":[5.788,23.152,46.303],"276":[5.328,21.311,42.621],"277":[4.912,19.648,39.296],"278":[4.521,18.084,36.167],"279":[4.167,16.667,33.333],"280":[2.316,9.265,18.531],"281":[2.135,8.538,17.076],"282":[1.964,7.855,15.71],"283":[1.809,7.236,14.472],"284":[1.664,6.656,13.312],"285":[0.926,3.704,7.409],"286":[0.852,3.407,6.813],"287":[0.784,3.137,6.275],"288":[0.722,2.889,5.778],"289":[0.664,2.656,5.312],"290":[0.369,1.478,2.955],"291":[0.34,1.358,2.717],"292":[0.313,1.25,2.501],"293":[0.288,1.151,2.302],"294":[0.264,1.058,2.115],"295":[0.147,0.588,1.176],"296":[0.136,0.543,1.086],"297":[0.124,0.498,0.995],"298":[0.115,0.459,0.918],"299":[0.077,0.308,0.617]}},
  {key:'악몽선경', min:280, pct:{"280":[3.088,12.354,24.708],"281":[2.846,11.384,22.769],"282":[2.618,10.473,20.946],"283":[2.412,9.648,19.296],"284":[2.219,8.875,17.749],"285":[1.235,4.939,9.879],"286":[1.136,4.542,9.084],"287":[1.046,4.183,8.366],"288":[0.963,3.852,7.703],"289":[0.885,3.542,7.083],"290":[0.493,1.97,3.94],"291":[0.453,1.811,3.622],"292":[0.417,1.667,3.334],"293":[0.384,1.535,3.069],"294":[0.353,1.41,2.821],"295":[0.196,0.786,1.572],"296":[0.181,0.723,1.446],"297":[0.166,0.665,1.329],"298":[0.153,0.611,1.222],"299":[0.103,0.412,0.824]}},
  {key:'아우룸 레기스', min:290, pct:{"290":[0.739,2.955,5.911],"291":[0.679,2.717,5.433],"292":[0.625,2.501,5.001],"293":[0.575,2.302,4.604],"294":[0.529,2.115,4.231],"295":[0.294,1.176,2.353],"296":[0.271,1.083,2.165],"297":[0.249,0.996,1.992],"298":[0.229,0.915,1.83],"299":[0.154,0.617,1.235]}}
];
const UNION_GRADE = [[12500,'슈프림 유니온 5',45],[12000,'슈프림 유니온 4',44],[11500,'슈프림 유니온 3',43],[11000,'슈프림 유니온 2',42],[10500,'슈프림 유니온 1',41],
  [10000,'그랜드 마스터 유니온 5',40],[9500,'그랜드 마스터 유니온 4',39],[9000,'그랜드 마스터 유니온 3',38],[8500,'그랜드 마스터 유니온 2',37],[8000,'그랜드 마스터 유니온 1',36],
  [7500,'마스터 유니온 5',31],[7000,'마스터 유니온 4',30],[6500,'마스터 유니온 3',29],[6000,'마스터 유니온 2',28],[5500,'마스터 유니온 1',27],
  [5000,'베테랑 유니온 5',22],[4500,'베테랑 유니온 4',21],[4000,'베테랑 유니온 3',20],[3500,'베테랑 유니온 2',19],[3000,'베테랑 유니온 1',18],
  [2500,'노비스 유니온 5',13],[2000,'노비스 유니온 4',12],[1500,'노비스 유니온 3',11],[1000,'노비스 유니온 2',10],[500,'노비스 유니온 1',9]];
const UNION_COUNT = 42;
const ARC_MAX = 20, AUT_MAX = 11;
const arcReq = L => L*L+11;
const autReq = L => 9*L*L+20*L;

/* ---------- 설정 ---------- */
const DEF_COMMON = {weeks:13, mp:14, mpMain:7, sym:28, ten:6, tenMax:299, symW:12, epic:3, resortTo:'', linkFocus:'',
  dqCap:2, wSss:10, wLink:10, arcD:40, arcD12:40, autD1:30, autD:15, arcW:240, epTier:'0', epMode:'focus', bArc:0, bGra:0, bMp:0, bSun:0};
const DEFS = { base:{...DEF_COMMON, resort:0, maxChars:12}, black:{...DEF_COMMON, resort:20, maxChars:0} };
let MODE = 'base';
let DEF = DEFS.base;
const LS = {
  get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
};
MODE = LS.get('bqp:mode','base')==='black'?'black':'base';
const SM = { base:Object.assign({}, DEFS.base, LS.get('bqp:settings:base', {})), black:Object.assign({}, DEFS.black, LS.get('bqp:settings:black', LS.get('bqp:settings', {}))) };
SM.base.resort=0;
for(const m of ['base','black']){ if(SM[m].tenMax===259) SM[m].tenMax=299; } // v2.1: 테네브리스 상한 기본값 변경
let S = SM[MODE]; DEF = DEFS[MODE];
const $ = id => document.getElementById(id);
const SKEYS = ['weeks','maxChars','wSss','wLink','mp','mpMain','sym','ten','tenMax','symW','epic','resort','dqCap','arcD','arcD12','autD1','autD','arcW','bArc','bGra','bMp','bSun'];
function fillSettings(){ SKEYS.forEach(k=>$('s_'+k).value=S[k]); $('s_epTier').value=S.epTier; $('s_epMode').value=S.epMode; }
function readSettings(){ SKEYS.forEach(k=>{const v=parseFloat($('s_'+k).value); S[k]=isFinite(v)?v:DEF[k]}); S.resortTo=$('s_resortTo').value; S.linkFocus=$('s_linkFocus').value; SM.base.linkFocus=SM.black.linkFocus=S.linkFocus; S.epTier=$('s_epTier').value; S.epMode=$('s_epMode').value; S.epPick=[0,1,2,3].map(i=>$('s_ep_'+i).value||'auto'); SM.base.epPick=SM.black.epPick=S.epPick; if(MODE==='base') S.resort=0; LS.set('bqp:settings:'+MODE,S); }
function applyModeUI(){ document.body.classList.toggle('m-base',MODE==='base'); document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-selected',b.dataset.mode===MODE)); $('setTitle').textContent = MODE==='base'?'계산 설정 · 기본 (직접 클리어)':'계산 설정 · MVP 블랙 (퀵패스)'; }
function setMode(m){ readSettings(); MODE=m; LS.set('bqp:mode',m); S=SM[m]; DEF=DEFS[m]; fillSettings(); applyModeUI(); if(ACC){ buildSelectors(); render(); } }
fillSettings(); applyModeUI();
$('qKey').value = LS.get('bqp:key','');
$('qName').value = LS.get('bqp:name','');

/* ---------- 유틸 ---------- */
const fmtEok = v => { const e=v/1e8; if(e>=10000) return (e/10000).toFixed(e>=100000?0:1)+'조'; return (e>=100?Math.round(e):e.toFixed(1)).toLocaleString('ko-KR')+'억'; };
const fmtPct = v => (v*100).toFixed(v<0.01?3:1)+'%';
const need = L => L>=300?Infinity:(NEED[L]||Infinity);
const CUM = (()=>{ const c={200:0}; for(let L=200;L<300;L++) c[L+1]=c[L]+(NEED[L]||0); return c; })();
const remTo = (lv, exp, t) => lv>=t ? Infinity : CUM[t]-CUM[lv]-exp;
// 우선순위 점수: 레벨 대비 경험치(=유니온 레벨 +1 기준) + 목표(250·285)까지 남은 경험치 대비 진척 × 가중치
function score(s, ex){ let v = ex/need(s.lv); if(s.lv>=200&&s.lv<250) v += ex/remTo(s.lv,s.exp,250)*S.wSss; else if(s.lv>=250&&s.lv<285) v += ex/remTo(s.lv,s.exp,285)*S.wLink; return v; }
const esc = s => String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function raiderGrade(lv, cls){
  if(cls==='제로'){ if(lv>=250)return'SSS'; if(lv>=200)return'SS'; if(lv>=180)return'S'; if(lv>=160)return'A'; if(lv>=130)return'B'; return'-'; }
  if(lv>=250)return'SSS'; if(lv>=200)return'SS'; if(lv>=140)return'S'; if(lv>=100)return'A'; if(lv>=60)return'B'; return'-';
}
function unionGrade(sum){ for(const g of UNION_GRADE) if(sum>=g[0]) return {name:g[1], raiders:g[2], at:g[0]}; return {name:'-',raiders:0,at:0}; }
function nextGrade(sum){ let n=null; for(const g of UNION_GRADE) if(g[0]>sum) n=g; return n; }
function dqExp(area){ return area.dq * (1 + (area.min>=260 ? S.bGra : S.bArc)/100); }
let SUNDAY=false;
function mpExp(lv){ let v=0; for(const [m,x] of MP) if(lv>=m) v=x; return v*(1+S.bMp/100+(SUNDAY?S.bSun/100:0)); }
function xmpExp(lv){
  if(lv<260) return 0;
  let a=XMP[0],b=XMP[XMP.length-1];
  for(let i=0;i<XMP.length-1;i++) if(lv>=XMP[i][0] && lv<=XMP[i+1][0]){a=XMP[i];b=XMP[i+1];break}
  const t = b[0]===a[0]?0:(lv-a[0])/(b[0]-a[0]);
  const pct = Math.exp(Math.log(a[1])*(1-t)+Math.log(b[1])*t);
  return pct/100*need(lv);
}
function epicExp(d, lv){ const r=d.pct[Math.min(299,lv)]; return r ? r[+S.epTier||0]/100*need(lv) : 0; }
function parseSymbols(list){
  const sym={};
  (list||[]).forEach(s=>{
    const m = s.symbol_name.match(/(아케인|어센틱|그랜드 어센틱)심볼\s*:\s*(.+)$/);
    if(!m) return;
    let key=m[2].trim(); if(key.includes('아르크스')) key='아르크스';
    const type = m[1]==='아케인'?'arc':'aut';
    sym[key]={type, lv:+s.symbol_level, g:+s.symbol_growth_count, force:+s.symbol_force};
  });
  return sym;
}
function symTotals(sym){ // 남은 성장치 기준 완성도
  const tot={arc:{have:0,need:0,n:0,max:0},aut:{have:0,need:0,n:0,max:0}};
  for(const [k,s] of Object.entries(sym)){
    const isA = s.type==='arc', MX = isA?ARC_MAX:AUT_MAX, rq = isA?arcReq:autReq;
    let full=0, have=0; for(let L=1;L<MX;L++){ full+=rq(L); if(L<s.lv) have+=rq(L); }
    have=Math.min(full, have+s.g);
    const t=tot[s.type]; t.have+=have; t.need+=full; t.n++; const pl=pendingLv(s).lv; if(pl>=MX) t.max++; if(pl>=MX && s.lv<MX) t.wait=(t.wait||0)+1;
  }
  return tot;
}
function pendingLv(s){ // 보유 성장치로 올릴 수 있는 레벨
  const MX = s.type==='arc'?ARC_MAX:AUT_MAX, rq = s.type==='arc'?arcReq:autReq;
  let L=s.lv, g=s.g; while(L<MX && g>=rq(L)){ g-=rq(L); L++; } return {lv:L, left:g};
}

/* ---------- API ---------- */
async function api(path, key, tries=3){
  for(let i=0;i<tries;i++){
    const r = await fetch(API+path,{headers:{'x-nxopen-api-key':key}});
    if(r.ok) return r.json();
    if(r.status===429){ await new Promise(s=>setTimeout(s,800*(i+1))); continue; }
    let msg=''; try{ const j=await r.json(); msg=j?.error?.message||j?.error?.name||''; }catch(e){}
    throw new Error(`API ${r.status} ${msg}`.trim());
  }
  throw new Error('요청이 너무 많아요(429). 잠시 뒤 다시 시도하세요.');
}
async function pool(items, n, fn, onTick){
  let i=0, done=0; const out=new Array(items.length);
  await Promise.all(Array.from({length:n},async()=>{ while(i<items.length){ const k=i++; out[k]=await fn(items[k]).catch(e=>({__err:e.message})); done++; onTick(done,items.length);} }));
  return out;
}
function setStatus(t, err){ const s=$('status'); s.textContent=t; s.className='status'+(err?' err':''); }

let ACC = null; // {world, chars:[...], union}
async function load(force){
  const key=$('qKey').value.trim(), name=$('qName').value.trim();
  if(!key){ setStatus('API 키를 넣어주세요. 넥슨 Open API 사이트에서 발급한 키예요.', true); return; }
  if(!name){ setStatus('캐릭터 이름을 넣어주세요.', true); return; }
  LS.set('bqp:key',key); LS.set('bqp:name',name);
  $('btnGo').disabled=$('btnRefresh').disabled=true; $('prog').style.width='0';
  try{
    setStatus('계정 캐릭터 목록을 불러오는 중…');
    const list = await api('/character/list', key);
    let acct=null, me=null;
    for(const a of list.account_list||[]) for(const c of a.character_list) if(c.character_name===name){acct=a;me=c;}
    if(!me){ setStatus(`'${name}'을(를) 이 API 키의 계정에서 찾지 못했어요. Open API는 키를 발급한 넥슨 계정의 캐릭터만 전체 조회할 수 있어요.`, true); return; }
    const world=me.world_name;
    const chars = acct.character_list.filter(c=>c.world_name===world);
    const cacheKey='bqp:cache:'+acct.account_id+':'+world;
    const cache = force?null:LS.get(cacheKey,null);
    let detail;
    if(cache && Date.now()-cache.t < 30*60*1000 && cache.d.length===chars.length){ detail=cache.d; setStatus('최근 30분 안에 불러온 데이터를 썼어요. 최신값은 새로고침을 누르세요.'); }
    else{
      setStatus(`${world} 캐릭터 ${chars.length}명의 정보와 심볼을 불러오는 중…`);
      detail = await pool(chars, 6, async c=>{
        const [b,s] = await Promise.all([api('/character/basic?ocid='+c.ocid,key), api('/character/symbol-equipment?ocid='+c.ocid,key)]);
        return {ocid:c.ocid, name:b.character_name, cls:b.character_class, lv:b.character_level, exp:b.character_exp, rate:parseFloat(b.character_exp_rate), img:b.character_image, sym:parseSymbols(s.symbol)};
      }, (d,n)=>$('prog').style.width=(d/n*100)+'%');
      const bad = detail.filter(x=>x.__err);
      if(bad.length){ setStatus(`${bad.length}명은 불러오지 못했어요 (${bad[0].__err}). 나머지로 계산했어요.`, true); }
      detail = detail.map((x,i)=>x.__err?{ocid:chars[i].ocid,name:chars[i].character_name,cls:chars[i].character_class,lv:chars[i].character_level,exp:0,rate:0,img:'',sym:{},partial:true}:x);
      LS.set(cacheKey,{t:Date.now(),d:detail});
      if(!bad.length) setStatus(`${world} ${detail.length}명을 불러왔어요.`);
    }
    detail.sort((a,b)=>b.lv-a.lv || b.exp-a.exp);
    let union=null; try{ union = await api('/user/union?ocid='+detail[0].ocid,key); }catch(e){}
    ACC = {world, chars:detail, union, searched:name};
    buildSelectors(); render();
  }catch(e){ setStatus('불러오지 못했어요: '+e.message+' — 키가 맞는지, 인터넷 연결을 확인하세요.', true); }
  finally{ $('btnGo').disabled=$('btnRefresh').disabled=false; $('prog').style.width='100%'; }
}

/* ---------- 유니온 ---------- */
function unionSum(levels, chars){ // levels: map name->lv
  let zeroBest=-1, arr=[];
  chars.forEach(c=>{ const lv=levels[c.name]; if(c.cls==='제로'){ zeroBest=Math.max(zeroBest,lv);} else arr.push(lv); });
  if(zeroBest>=0) arr.push(zeroBest);
  arr.sort((a,b)=>b-a); const top=arr.slice(0,UNION_COUNT);
  return {sum:top.reduce((a,b)=>a+b,0), cut:top[top.length-1]||0};
}
function inUnion(c, levels, chars){
  if(c.cls==='제로'){ const zs=chars.filter(x=>x.cls==='제로').sort((a,b)=>levels[b.name]-levels[a.name]); if(zs[0]!==c) return false; }
  const u=unionSum(levels,chars); const lv=levels[c.name];
  const higher = chars.filter(x=>x!==c && levels[x.name]>lv && !(x.cls==='제로' && x!==chars.filter(z=>z.cls==='제로').sort((a,b)=>levels[b.name]-levels[a.name])[0])).length;
  return higher < UNION_COUNT && lv>=u.cut;
}

/* ---------- 시뮬레이션 ---------- */
function goalsOf(lv){ const g=[]; if(lv>=200&&lv<250) g.push('sss'); if(lv>=250&&lv<285) g.push('link'); return g; }
function simulate(){
  const chars = ACC.chars, main = chars[0];
  const st = chars.map(c=>({c, lv:c.lv, exp:c.exp, sym:JSON.parse(JSON.stringify(c.sym)), week:{}, total:{}, gain:0}));
  const byName = Object.fromEntries(st.map(s=>[s.c.name,s]));
  const resortTo = byName[S.resortTo] || byName[main.name];
  const linkFocus = byName[S.linkFocus] || null;
  const weeks = Math.max(1,Math.min(52,Math.round(S.weeks)));
  const weekly=[], day1=[], week1={};
  const levelsNow = () => Object.fromEntries(st.map(s=>[s.c.name,s.lv]));
  const startU = unionSum(levelsNow(),chars);
  weekly.push({w:0, levels:levelsNow(), union:startU});
  const milestones=[];
  const addExp = (s, x, tag) => {
    if(s.lv>=300||x<=0) return;
    s.exp+=x; s.gain+=x; s.total[tag]=(s.total[tag]||0)+x;
    while(s.lv<300 && s.exp>=need(s.lv)){ s.exp-=need(s.lv); s.lv++; if(s.lv===250||s.lv===285) milestones.push({name:s.c.name, lv:s.lv, w:curW}); }
  };
  const addSym = (s, key, n) => {
    const y=s.sym[key]; if(!y) return; const MX=y.type==='arc'?ARC_MAX:AUT_MAX, rq=y.type==='arc'?arcReq:autReq;
    y.g+=n; while(y.lv<MX && y.g>=rq(y.lv)){ y.g-=rq(y.lv); y.lv++; } if(y.lv>=MX) y.g=0;
  };
  const log = (s, kind, what, val=0) => { if(curW===1){ const k=s.c.name; (week1[k]=week1[k]||{}); week1[k][kind]=(week1[k][kind]||0)+1; } if(curW===1&&curD===1) day1.push({kind, name:s.c.name, lv:s.lv, what, val}); };
  // 하루 플레이 캐릭터 수 제한
  let active=new Set(); const canUse = s => !S.maxChars || active.has(s.c.name) || active.size < S.maxChars; const use = s => active.add(s.c.name);
  const isMaxSym = (s,key) => { const y=s.sym[key]; return !y || pendingLv(y).lv >= (y.type==='arc'?ARC_MAX:AUT_MAX); }; // 보유 성장치로 만렙이 되면 만렙으로 본다
  let curW=0, curD=0;
  for(let w=1; w<=weeks; w++){
    curW=w; const mpWeek={};
    // 주간: 에픽던전
    // 던전별 계정 주 1회(4개 중 최대 3개). 링크 집중 우선이면 그 캐릭에 먼저, 나머지는 레벨 대비 % 순
    { const used=new Set(); curD=1; let cnt=0; const cap=Math.min(3,S.epic); const pick=S.epPick||['auto','auto','auto','auto'];
      EPIC.forEach((d,i)=>{ if(pick[i]==='none') used.add(d.key); });
      EPIC.forEach((d,i)=>{ const nm=pick[i]; if(cnt>=cap||nm==='auto'||nm==='none') return; const sx=byName[nm]; used.add(d.key); if(!sx||sx.lv<d.min||sx.lv>=300) return;
        const lv0=sx.lv, ex=epicExp(d,lv0); addExp(sx,ex,'epic'); cnt++; log(sx,'에픽던전',`${d.key} ${(d.pct[lv0]||[0])[+S.epTier||0]}% (지정)`, ex/need(lv0)); });
      for(let i=cnt;i<cap;i++){
        let best=null, bv=-1;
        st.forEach(s=>EPIC.forEach(d=>{
          if(s.lv<d.min||s.lv>=300||used.has(d.key)) return;
          let v=(d.pct[s.lv]||[0])[+S.epTier||0];
          if(S.epMode==='focus' && s===linkFocus) v+=1000;
          if(v>bv){bv=v;best={s,d};}
        }));
        if(!best) break;
        used.add(best.d.key);
        const lv0=best.s.lv, ex=epicExp(best.d,best.s.lv); addExp(best.s, ex, 'epic');
        log(best.s,'에픽던전', `${best.d.key} ${(best.d.pct[lv0]||[0])[+S.epTier||0]}%`, ex/need(lv0));
      }
    }
    // 주간: 심볼 주간퀘 (아케인, 미만렙만)
    curD=1;
    { const wqUsed={}; const wqDone=new Set(); // 지역별 주 2회 (월드 기준)
      for(let i=0;i<S.symW;i++){
        let best=null, bv=-Infinity;
        st.forEach(s=>ARC.forEach(a=>{ if(s.lv<a.min||isMaxSym(s,a.key)) return; if((wqUsed[a.key]||0)>=2||wqDone.has(s.c.name+a.key)) return;
          const y=s.sym[a.key]; let left=0; for(let L=y.lv;L<ARC_MAX;L++) left+=arcReq(L); left-=y.g;
          const v = Math.min(S.arcW,left)/Math.max(1,left) + (s.lv<250?0.01:0); // 만렙에 가까울수록, 덜 남은 캐릭 우선(낭비 최소)
          if(v>bv){bv=v;best={s,a};} }));
        if(!best) break; wqUsed[best.a.key]=(wqUsed[best.a.key]||0)+1; wqDone.add(best.s.c.name+best.a.key);
        addSym(best.s,best.a.key,S.arcW); log(best.s,'심볼 주간', best.a.key, 0);
      }
    }
    for(let d=1; d<=7; d++){
      curD=d; SUNDAY = (d===7); active=new Set();
      // 리조트
      if(MODE==='black' && resortTo && S.resort>0) addExp(resortTo, HOURLY[Math.min(299,resortTo.lv)]*S.resort/7, 'resort');
      const cutNow = unionSum(levelsNow(),chars).cut; const uw = s => s.lv>=cutNow ? 1 : 0.5; // 유니온 밖 캐릭은 절반 가중
      const slots={}; [...ARC,...AUT,...TEN].forEach(a=>slots[a.key]=S.dqCap);
      const done=new Set(); const mpToday={};
      let left={sym:S.sym, ten:S.ten, mp:Math.max(0,S.mp-S.mpMain)};
      // 본캐 몬파 몫
      if(S.mpMain>0){ const m=byName[main.name]; active.add(main.name);
        for(let i=0;i<Math.min(7,S.mpMain);i++){ const v=mpExp(m.lv)/need(m.lv); addExp(m, mpExp(m.lv),'mp'); mpWeek[m.c.name]=(mpWeek[m.c.name]||0)+1; if(mpWeek[m.c.name]===5) addExp(m,xmpExp(m.lv),'xmp'); log(m,'몬파 (본캐 몫)','',v); } }
      // 링크 집중 캐릭터: 주 5회 확보 (익스트림 몬파커)
      if(linkFocus && linkFocus.lv>=260 && linkFocus.lv<300){ active.add(linkFocus.c.name);
        if(linkFocus!==byName[main.name] && (mpWeek[linkFocus.c.name]||0)<5 && left.mp>0){
          const rest=5-(mpWeek[linkFocus.c.name]||0), take=Math.min(left.mp, Math.ceil(rest/(8-d)), 7);
          for(let i=0;i<take;i++){ left.mp--; mpToday[linkFocus.c.name]=(mpToday[linkFocus.c.name]||0)+1; mpWeek[linkFocus.c.name]=(mpWeek[linkFocus.c.name]||0)+1; const fv=mpExp(linkFocus.lv)/need(linkFocus.lv); addExp(linkFocus,mpExp(linkFocus.lv),'mp'); if(mpWeek[linkFocus.c.name]===5) addExp(linkFocus,xmpExp(linkFocus.lv),'xmp'); log(linkFocus,'몬파','익스트림 몬파커용',fv); }
        } }
      // 한 캐릭터가 오늘 할 수 있는 일 목록 (점수 포함)
      const symAmt = a => a.min>=260?(a.min===260?S.autD1:S.autD):(a.min<220?S.arcD12:S.arcD);
      const tasksOf = (s, sl, lf) => {
        const out=[]; if(s.lv<200||s.lv>=300) return out;
        if(lf.sym>0) for(const a of [...ARC,...AUT]){ if(s.lv<a.min||isMaxSym(s,a.key)||done.has(s.c.name+a.key)||sl[a.key]<=0) continue; const ex=dqExp(a);
          out.push({t:'sym', a, ex, v: score(s,ex)*uw(s)}); }
        if(lf.ten>0) for(const a of TEN){ if(s.lv<a.min||s.lv>S.tenMax||sl[a.key]<=0||done.has(s.c.name+a.key)) continue; out.push({t:'ten', a, ex:dqExp(a), v:score(s,dqExp(a))*uw(s)}); }
        if(lf.mp>0 && s.c.name!==main.name){ const n=Math.min(7-(mpToday[s.c.name]||0), lf.mp); const wk=mpWeek[s.c.name]||0;
          for(let i=0;i<n;i++){ let v=score(s,mpExp(s.lv)); if(s.lv>=260 && wk+i<5) v=score(s,(mpExp(s.lv)*5+xmpExp(s.lv))/5); out.push({t:'mp', v:v*uw(s)}); } }
        return out;
      };
      // 1단계: 하루 캐릭터 수 제한이 있으면, 오늘 할 일 묶음 가치가 큰 캐릭터부터 고른다
      if(S.maxChars>0){
        const vs={...slots}, vl={...left};
        while(active.size < S.maxChars){
          let best=null, bv=0, bt=null;
          st.forEach(s=>{ if(active.has(s.c.name)) return; const ts=tasksOf(s,vs,vl).sort((a,b)=>b.v-a.v); const cnt={sym:0,ten:0,mp:0}; let sum=0; const pick=[];
            for(const t of ts){ if(cnt[t.t]>=vl[t.t]) continue; if(t.a && vs[t.a.key]-(pick.filter(p=>p.a===t.a).length)<=0) continue; cnt[t.t]++; sum+=t.v; pick.push(t); }
            if(sum>bv){bv=sum;best=s;bt=pick;} });
          if(!best) break;
          active.add(best.c.name); bt.forEach(t=>{ vl[t.t]--; if(t.a) vs[t.a.key]--; });
        }
      }
      // 2단계: 고른 캐릭터(제한 없으면 전체) 안에서 점수 높은 일부터 하나씩 배정
      for(let guard=0; guard<500; guard++){
        let best=null, bv=0, bs=null;
        st.forEach(s=>{ if(S.maxChars>0 && !active.has(s.c.name)) return; for(const t of tasksOf(s,slots,left)){ if(t.v>bv){bv=t.v;best=t;bs=s;} } });
        if(!best) break;
        const s0=bs, lv0=s0.lv; active.add(s0.c.name);
        if(best.t==='sym'){ left.sym--; done.add(s0.c.name+best.a.key); slots[best.a.key]--; addExp(s0,best.ex,'symd'); addSym(s0,best.a.key,symAmt(best.a)); log(s0,'심볼 일퀘', best.a.key, best.ex/need(lv0)); }
        else if(best.t==='ten'){ left.ten--; done.add(s0.c.name+best.a.key); slots[best.a.key]--; addExp(s0,best.ex,'ten'); log(s0,'테네브리스 일퀘',best.a.key,best.ex/need(lv0)); }
        else { left.mp--; mpToday[s0.c.name]=(mpToday[s0.c.name]||0)+1; mpWeek[s0.c.name]=(mpWeek[s0.c.name]||0)+1; const mx=mpExp(lv0); addExp(s0,mx,'mp'); if(lv0>=260 && mpWeek[s0.c.name]===5) addExp(s0,xmpExp(lv0),'xmp'); log(s0,'몬파','',mx/need(lv0)); }
      }
    }
    weekly.push({w, levels:levelsNow(), union:unionSum(levelsNow(),chars)});
  }
  return {st, weekly, day1, week1, milestones, resortTo, linkFocus, weeks};
}

/* ---------- 렌더 ---------- */
function buildSelectors(){
  const opts = ACC.chars.map(c=>`<option value="${esc(c.name)}">${esc(c.name)} · ${c.lv}</option>`).join('');
  $('s_resortTo').innerHTML = opts;
  const cand = ACC.chars.filter(c=>c.lv>=250&&c.lv<285);
  $('s_linkFocus').innerHTML = '<option value="">없음</option>'+cand.map(c=>`<option value="${esc(c.name)}">${esc(c.name)} · ${c.lv}</option>`).join('');
  const best = cand.length? [...cand].sort((a,b)=>b.lv-a.lv||b.exp-a.exp)[0].name : '';
  for(const m of ['base','black']){ const X=SM[m]; if(!ACC.chars.find(c=>c.name===X.resortTo)) X.resortTo = ACC.chars[0].name; if(X.linkFocus!=='' && !cand.find(c=>c.name===X.linkFocus)) X.linkFocus = best; if(X.linkFocus===undefined) X.linkFocus=best; }
  if(!SM.base.linkFocus && !SM.black.linkFocus){ SM.base.linkFocus=SM.black.linkFocus=best; }
  $('s_resortTo').value=S.resortTo; $('s_linkFocus').value=S.linkFocus;
  const pick = S.epPick || SM.base.epPick || SM.black.epPick || ['auto','auto','auto','auto'];
  EPIC.forEach((d,i)=>{ const el=$('s_ep_'+i); const el2=ACC.chars.filter(c=>c.lv>=d.min);
    el.innerHTML='<option value="auto">자동</option><option value="none">안 감</option>'+el2.map(c=>`<option value="${esc(c.name)}">${esc(c.name)} · ${c.lv}</option>`).join('');
    el.value = (pick[i]==='auto'||pick[i]==='none'||el2.find(c=>c.name===pick[i])) ? pick[i] : 'auto'; });
  SM.base.epPick=SM.black.epPick=S.epPick=EPIC.map((d,i)=>$('s_ep_'+i).value);
}
let SIM=null, OTHER=null, TAB='route';
function render(){
  const out=$('out'); out.className=''; SIM = simulate();
  { const keep=S, km=MODE, om=MODE==='base'?'black':'base'; MODE=om; S=SM[om]; try{ OTHER=simulate(); } finally { MODE=km; S=keep; } }
  const chars=ACC.chars, levels0=Object.fromEntries(chars.map(c=>[c.name,c.lv]));
  const u0 = unionSum(levels0,chars), g0=unionGrade(u0.sum), ng=nextGrade(u0.sum);
  const uEnd = SIM.weekly[SIM.weekly.length-1].union, gEnd=unionGrade(uEnd.sum);
  const sss0 = chars.filter(c=>raiderGrade(c.lv,c.cls)==='SSS').length;
  const sssE = SIM.st.filter(s=>s.lv>=250).length;
  const l0 = chars.filter(c=>c.lv>=285).length, lE = SIM.st.filter(s=>s.lv>=285).length;
  const apiU = ACC.union?.union_level;
  const main = chars[0], ms=SIM.st[0];

  let h='';
  h+=`<section class="panel"><h2>${esc(ACC.world)} · 계정 요약</h2><div class="kpis">
    <div class="kpi"><span>유니온 레벨</span><b>${u0.sum.toLocaleString()}</b><small>${esc(g0.name)} · 공격대원 ${g0.raiders}명${apiU&&apiU!==u0.sum?` · API ${apiU.toLocaleString()}`:''}</small></div>
    <div class="kpi"><span>다음 등급까지</span><b>${ng?('+'+(ng[0]-u0.sum).toLocaleString()):'최고 등급'}</b><small>${ng?esc(ng[1])+' ('+ng[2]+'명)':''}</small></div>
    <div class="kpi"><span>${SIM.weeks}주 후 유니온 · ${MODE==='base'?'기본':'MVP 블랙'}</span><b>${uEnd.sum.toLocaleString()}</b><small class="up">+${(uEnd.sum-u0.sum).toLocaleString()} · ${esc(gEnd.name)}</small><small>${MODE==='base'?'MVP 블랙이면':'기본이면'} ${OTHER.weekly[OTHER.weekly.length-1].union.sum.toLocaleString()}</small></div>
    <div class="kpi"><span>SSS (250+)</span><b>${sss0} → ${sssE}</b><small>${SIM.weeks}주 예측</small></div>
    <div class="kpi"><span>링크 3렙 증거 (285+)</span><b>${l0} → ${lE}</b><small>${SIM.weeks}주 예측</small></div>
    <div class="kpi"><span>유니온 커트라인</span><b>${u0.cut} → ${uEnd.cut}</b><small>상위 ${UNION_COUNT}캐릭 기준</small></div>
  </div></section>`;

  // hero
  const t0=symTotals(main.sym);
  h+=`<section class="panel hero"><div class="hpic"><img src="${esc(main.img)}" alt="${esc(main.name)} 캐릭터 외형"></div>
    <div style="display:flex;flex-direction:column;gap:6px;min-width:0"><div class="meta">대표 캐릭터 · 계정 최고 레벨</div>
      <div class="nm">${esc(main.name)}</div><div class="meta">${esc(main.cls)} · <span class="lv">Lv.${main.lv}</span> · ${main.rate.toFixed(3)}%</div>
      <div class="expbar"><i style="width:${main.rate}%"></i></div>
      <div class="badges"><span class="bdg g-${raiderGrade(main.lv,main.cls)}">${raiderGrade(main.lv,main.cls)}</span>${main.lv>=285?'<span class="bdg t-link">증거 보유</span>':''}</div></div>
    <div class="heroside">
      <div>아케인 ${t0.arc.max}/${t0.arc.n} 만렙 · 어센틱 ${t0.aut.max}/${t0.aut.n} 만렙</div>
      <div class="blackonly">리조트 사용: <b>${esc(SIM.resortTo?.c.name||'-')}</b>${SIM.resortTo&&SIM.resortTo.c.lv>=290?` <span class="est">(주 ${(HOURLY[Math.min(299,SIM.resortTo.c.lv)]*S.resort/need(SIM.resortTo.c.lv)*100).toFixed(2)}%)</span>`:''}</div>
      <div>링크 집중: <b>${esc(SIM.linkFocus?.c.name||'없음')}</b>${SIM.linkFocus?` (${SIM.linkFocus.c.lv} → ${SIM.linkFocus.lv})`:''}</div>
      <div class="proj">${SIM.weeks}주 후 <b>Lv.${ms.lv}</b> (${(ms.exp/need(ms.lv)*100).toFixed(2)}%)</div>
      <div><button data-d="${esc(main.name)}">상세보기</button></div>
    </div></section>`;

  // grid
  const gridOpen = LS.get('bqp:gridOpen', true);
  h+=`<section class="panel"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h2>캐릭터 ${chars.length-1}명</h2><button id="gridToggle" aria-expanded="${gridOpen}">${gridOpen?'접기':'펼치기'}</button></div><div class="grid" id="charGrid"${gridOpen?'':' hidden'}>`;
  SIM.st.slice(1).forEach(s=>{
    const c=s.c, gr=raiderGrade(c.lv,c.cls), t=symTotals(c.sym), inU=inUnion(c,levels0,chars);
    const tags=[]; if(c.lv>=240&&c.lv<250) tags.push('<span class="bdg t-sss">SSS 임박</span>'); if(c.lv>=275&&c.lv<285) tags.push('<span class="bdg t-link">285 후보</span>');
    if(!inU) tags.push('<span class="bdg t-out">유니온 제외</span>');
    const arcP=t.arc.need?t.arc.have/t.arc.need:0, autP=t.aut.need?t.aut.have/t.aut.need:0;
    h+=`<div class="card"><div class="top"><div class="pic">${c.img?`<img src="${esc(c.img)}" alt="${esc(c.name)}" loading="lazy">`:''}</div>
      <div class="who"><b>${esc(c.name)}</b><span>${esc(c.cls)}</span><span class="lv" style="color:var(--ink)">Lv.${c.lv} <small style="color:var(--muted)">${c.rate.toFixed(1)}%</small></span></div></div>
      <div class="badges"><span class="bdg g-${gr}">${gr}</span>${tags.join('')}</div>
      <div class="mini">${t.arc.n?`<div>아케인 ${t.arc.max}/${t.arc.n} 만렙${t.arc.wait?` <span class="est">(강화 대기 ${t.arc.wait})</span>`:''}</div><div class="bar"><i class="arc" style="width:${arcP*100}%"></i></div>`:'<div>아케인 없음</div>'}
      ${t.aut.n?`<div>어센틱 ${t.aut.max}/${t.aut.n} 만렙${t.aut.wait?` <span class="est">(강화 대기 ${t.aut.wait})</span>`:''}</div><div class="bar"><i class="aut" style="width:${autP*100}%"></i></div>`:''}</div>
      <div class="proj">${SIM.weeks}주 후 <b>Lv.${s.lv}</b>${s.lv>c.lv?` <span class="up">+${s.lv-c.lv}</span>`:''}</div>
      <button data-d="${esc(c.name)}">상세보기</button></div>`;
  });
  h+=`</div></section>`;

  // plan
  h+=`<section class="panel"><h2>투자 계획</h2>
    <div class="tabs" role="tablist">
      <button role="tab" data-tab="route" aria-selected="${TAB==='route'}">오늘 진행 순서</button>
      <button role="tab" data-tab="day" aria-selected="${TAB==='day'}">오늘 배분</button>
      <button role="tab" data-tab="week" aria-selected="${TAB==='week'}">1주차 캐릭터별</button>
      <button role="tab" data-tab="proj" aria-selected="${TAB==='proj'}">주차별 레벨 예측</button>
      <button role="tab" data-tab="ms" aria-selected="${TAB==='ms'}">달성 시점</button>
    </div><div id="tabBody"></div></section>`;
  out.innerHTML=h;
  out.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>openDetail(b.dataset.d));
  $('gridToggle').onclick=()=>{ const g=$('charGrid'); g.hidden=!g.hidden; LS.set('bqp:gridOpen',!g.hidden); $('gridToggle').textContent=g.hidden?'펼치기':'접기'; $('gridToggle').setAttribute('aria-expanded',!g.hidden); };
  out.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{TAB=b.dataset.tab; out.querySelectorAll('[data-tab]').forEach(x=>x.setAttribute('aria-selected',x.dataset.tab===TAB)); renderTab();});
  renderTab();
}
function renderTab(){
  const body=$('tabBody'); const chars=ACC.chars;
  if(TAB==='route'){
    const by={}; SIM.day1.forEach(x=>{ const r=(by[x.name]=by[x.name]||{name:x.name,lv:x.lv,val:0,items:[]}); r.val+=x.val||0; r.items.push(x); });
    const rows=Object.values(by).sort((a,b)=>b.val-a.val);
    const kOrd={'에픽던전':0,'심볼 주간':1,'심볼 일퀘':2,'테네브리스 일퀘':3,'몬파 (본캐 몫)':4,'몬파':4};
    const totalSteps=SIM.day1.length;
    let h=`<p class="hint">${MODE==='base'?'직접 클리어 기준이에요. 캐릭터를 바꾸는 횟수를 줄이려고 캐릭터 단위로 묶었고, 오늘 얻는 경험치(레벨 대비)가 큰 캐릭터부터 적었어요.':'퀵패스는 클릭만으로 끝나니 순서는 상관없어요. 캐릭터별로 묶어서 보여드려요.'} <span class="step wk" style="display:inline-block">주간</span> 표시는 이번 주에 한 번만 하면 되는 항목이에요. 오늘 ${rows.length}캐릭 · ${totalSteps}회.</p><ol class="route">`;
    rows.forEach(r=>{
      const agg={}; r.items.sort((a,b)=>(kOrd[a.kind]??9)-(kOrd[b.kind]??9)).forEach(x=>{ const label = x.kind.startsWith('몬파')?'몬파':x.kind==='심볼 일퀘'||x.kind==='테네브리스 일퀘'?x.what+' 일퀘':x.kind==='심볼 주간'?x.what+' 주간 미니게임':x.what; const wk=x.kind==='에픽던전'||x.kind==='심볼 주간'; const k=label+wk; agg[k]=agg[k]||{label,wk,n:0}; agg[k].n++; });
      const lvNow=ACC.chars.find(c=>c.name===r.name)?.lv;
      h+=`<li><b>${esc(r.name)}</b> <span class="lv">Lv.${lvNow}</span> <span class="meta">${r.val>0.0005?`오늘 +${(r.val*100).toFixed(1)}%`:r.items.every(x=>x.kind==='심볼 주간'||x.kind==='에픽던전')?'주간 항목만':'심볼 위주'}</span><div class="steps">${Object.values(agg).map(a=>`<span class="step${a.wk?' wk':''}">${esc(a.label)}${a.n>1?' ×'+a.n:''}</span>`).join('')}</div></li>`;
    });
    if(MODE==='black') h+=`<li><b>리조트</b> <span class="meta">${esc(SIM.resortTo?.c.name||'-')} · 하루 약 ${(S.resort/7).toFixed(1)}시간</span></li>`;
    h+=`</ol>`; body.innerHTML=h; return;
  }
  if(TAB==='day'){
    const groups={}; SIM.day1.forEach(x=>{ (groups[x.kind]=groups[x.kind]||[]).push(x); });
    const order=['에픽던전','심볼 주간','심볼 일퀘','테네브리스 일퀘','몬파 (본캐 몫)','몬파'];
    let h=`<p class="hint">1주차 1일 기준이에요. 주간 항목(에픽던전·심볼 주간)은 주 첫날에 몰아서 표시해요. 만렙 심볼 지역에는 ${MODE==='base'?'일퀘를':'퀵패스를'} 배정하지 않아요.${MODE==='base'?'':''}</p><div class="alloc">`;
    order.forEach(k=>{ const g=groups[k]; if(!g) return;
      const agg={}; g.forEach(x=>{ const key=x.name+'|'+x.what; agg[key]=agg[key]||{...x,n:0}; agg[key].n++; });
      const items=Object.values(agg);
      h+=`<div class="blk"><h3>${k}<span>${g.length}회</span></h3><ul>${items.map(x=>`<li><b>${esc(x.name)}</b> <span class="lv">${x.lv}</span>${x.what?' · '+esc(x.what):''}${x.n>1?` ×${x.n}`:''}</li>`).join('')}</ul></div>`;
    });
    if(MODE==='black') h+=`<div class="blk"><h3>리조트<span>${S.resort}h/주</span></h3><ul><li><b>${esc(SIM.resortTo?.c.name||'-')}</b> · 하루 약 ${(S.resort/7).toFixed(1)}시간</li></ul></div></div>`;
    body.innerHTML=h; return;
  }
  if(TAB==='week'){
    const kinds=['심볼 일퀘','테네브리스 일퀘','몬파','심볼 주간','에픽던전'];
    const rows=SIM.st.filter(s=>SIM.week1[s.c.name] || s===SIM.resortTo);
    let h=`<div class="scroll"><table><thead><tr><th>캐릭터</th><th class="n">현재</th>${kinds.map(k=>`<th class="n">${k}</th>`).join('')}<th class="n">리조트</th><th class="n">${SIM.weeks}주 후</th><th>목표</th></tr></thead><tbody>`;
    rows.sort((a,b)=>a.c.lv-b.c.lv).forEach(s=>{ const w=SIM.week1[s.c.name]||{};
      const goal = s.c.lv<250?'SSS 250':s.c.lv<285?'링크 285':'유니온';
      h+=`<tr${s===SIM.linkFocus?' class="hl"':''}><td><b>${esc(s.c.name)}</b> <span class="meta">${esc(s.c.cls)}</span></td><td class="n">${s.c.lv}</td>${kinds.map(k=>`<td class="n">${w[k]||''}</td>`).join('')}<td class="n">${s===SIM.resortTo?S.resort+'h':''}</td><td class="n">${s.lv}${s.lv>s.c.lv?` <span class="up">+${s.lv-s.c.lv}</span>`:''}</td><td>${goal}</td></tr>`;
    });
    h+=`</tbody></table></div><p class="hint">1주차에 퀵패스를 받는 캐릭터만 보여요. 레벨이 오르면 2주차부터 배분이 달라질 수 있어요.</p>`;
    body.innerHTML=h; return;
  }
  if(TAB==='proj'){
    const ws=SIM.weekly; const step = ws.length>14?Math.ceil((ws.length-1)/13):1;
    const cols=ws.filter((w,i)=>i===0||i===ws.length-1||w.w%step===0);
    const moved=SIM.st.filter(s=>s.lv>s.c.lv).sort((a,b)=>b.c.lv-a.c.lv);
    let h=`<div class="scroll"><table><thead><tr><th>캐릭터</th>${cols.map(w=>`<th class="n">${w.w===0?'현재':w.w+'주'}</th>`).join('')}</tr></thead><tbody>`;
    h+=`<tr class="hl"><td><b>유니온 레벨</b></td>${cols.map(w=>`<td class="n">${w.union.sum.toLocaleString()}</td>`).join('')}</tr>`;
    moved.forEach(s=>{ h+=`<tr><td>${esc(s.c.name)}</td>${cols.map(w=>{const l=w.levels[s.c.name]; const mark=(l>=250&&s.c.lv<250)||(l>=285&&s.c.lv<285); return `<td class="n${mark?' up':''}">${l}</td>`}).join('')}</tr>`; });
    h+=`</tbody></table></div>`;
    body.innerHTML=h; return;
  }
  if(TAB==='ms'){
    const firsts={}; SIM.milestones.forEach(m=>{const k=m.name+m.lv; if(!firsts[k]) firsts[k]=m;});
    const list=Object.values(firsts).sort((a,b)=>a.w-b.w);
    const gradeHits=[]; let prev=unionGrade(SIM.weekly[0].union.sum).name;
    SIM.weekly.forEach(w=>{ const g=unionGrade(w.union.sum).name; if(g!==prev){gradeHits.push({w:w.w,g}); prev=g;} });
    let h=`<div class="ms">`;
    if(!list.length && !gradeHits.length) h+=`<div class="meta">${SIM.weeks}주 안에 새로 달성하는 SSS·285·유니온 등급이 없어요. 기간을 늘리거나 리조트·집중 캐릭터를 바꿔보세요.</div>`;
    gradeHits.forEach(x=>h+=`<div><b>${x.w}주차</b> · 유니온 <b>${esc(x.g)}</b> 달성</div>`);
    list.forEach(m=>h+=`<div><b>${m.w}주차</b> · ${esc(m.name)} <b>${m.lv}</b> 달성 ${m.lv===250?'(SSS)':'(링크 3렙 증거)'}</div>`);
    const focus=SIM.linkFocus; if(focus && focus.lv<285){ const per=focus.gain/SIM.weeks; let rem=need(focus.lv)-focus.exp; for(let L=focus.lv+1;L<285;L++) rem+=need(L); h+=`<div class="meta">${esc(focus.c.name)}: ${SIM.weeks}주 뒤 Lv.${focus.lv}. 같은 속도면 285까지 약 ${per>0?Math.ceil(rem/per):'∞'}주 더 필요해요 (주 ${fmtEok(per)}).</div>`; }
    h+=`</div>`; body.innerHTML=h;
  }
}
function openDetail(name){
  const c=ACC.chars.find(x=>x.name===name), s=SIM.st.find(x=>x.c.name===name); if(!c) return;
  const levels0=Object.fromEntries(ACC.chars.map(x=>[x.name,x.lv]));
  const gr=raiderGrade(c.lv,c.cls), inU=inUnion(c,levels0,ACC.chars);
  const remain = need(c.lv)-c.exp;
  const to = t=>{ if(c.lv>=t) return 0; let r=remain; for(let L=c.lv+1;L<t;L++) r+=need(L); return r; };
  const known=new Set([...ARC,...AUT].map(a=>a.key)); const extra=Object.keys(c.sym).filter(k=>!known.has(k)).map(k=>({key:k,min:999}));
  const symRows=[...ARC,...AUT,...extra].map(a=>{ const y=c.sym[a.key]; if(!y) return c.lv>=a.min?`<tr><td>${a.key}</td><td colspan="5" class="meta">미장착 (지역 미해금 가능성)</td></tr>`:'';
    const MX=y.type==='arc'?ARC_MAX:AUT_MAX, rq=y.type==='arc'?arcReq:autReq; const p=pendingLv(y);
    let left=0; for(let L=y.lv;L<MX;L++) left+=rq(L); left=Math.max(0,left-y.g);
    return `<tr><td>${a.key}</td><td class="n">${y.lv}/${MX}</td><td class="n">${y.lv>=MX?'-':y.g.toLocaleString()}</td><td class="n">${p.lv>y.lv?`<span class="up">→ ${p.lv}</span>`:'-'}</td><td class="n">${y.lv>=MX?'<span class="bdg t-max">만렙</span>':p.lv>=MX?'<span class="bdg t-max">만렙 (강화 대기)</span>':left.toLocaleString()}</td><td class="n">${y.force}</td></tr>`; }).join('');
  const w=SIM.week1[name]||{};
  const totals=Object.entries(s.total).map(([k,v])=>`${({symd:'심볼 일퀘',ten:'테네브리스',mp:'몬파',xmp:'익스트림 몬파커',epic:'에픽던전',resort:'리조트'})[k]||k} ${fmtEok(v)}`).join(' · ');
  $('dlg').innerHTML=`<div class="mhead">${c.img?`<div class="mpic"><img src="${esc(c.img)}" alt=""></div>`:''}<div><h3 style="font-size:20px">${esc(c.name)}</h3><div class="meta">${esc(c.cls)} · Lv.${c.lv} · ${c.rate.toFixed(3)}%</div>
    <div class="badges" style="margin-top:6px"><span class="bdg g-${gr}">${gr}</span>${inU?'<span class="bdg t-link">유니온 포함</span>':'<span class="bdg t-out">유니온 제외</span>'}</div></div><button class="close" id="dlgClose">닫기</button></div>
    <div class="mbody">
      <div class="expbar"><i style="width:${c.rate}%"></i></div>
      <div class="dl">
        <div><span>현재 경험치</span><b>${fmtEok(c.exp)}</b></div>
        <div><span>이번 레벨 필요</span><b>${fmtEok(need(c.lv))}</b></div>
        <div><span>다음 레벨까지</span><b>${fmtEok(remain)}</b></div>
        ${c.lv<250?`<div><span>250까지</span><b>${fmtEok(to(250))}</b></div>`:''}
        ${c.lv<285?`<div><span>285까지</span><b>${fmtEok(to(285))}</b></div>`:''}
        <div><span>${SIM.weeks}주 후 예측</span><b>Lv.${s.lv} (${(s.exp/need(s.lv)*100).toFixed(1)}%)</b></div>
      </div>
      <div><h2 style="margin-bottom:6px">심볼</h2><div class="scroll"><table><thead><tr><th>지역</th><th class="n">레벨</th><th class="n">보유 성장치</th><th class="n">즉시 강화</th><th class="n">만렙까지</th><th class="n">포스</th></tr></thead><tbody>${symRows||'<tr><td colspan="6" class="meta">장착한 심볼이 없어요</td></tr>'}</tbody></table></div>
      <p class="hint">'즉시 강화'는 이미 모은 성장치로 메소만 내면 올릴 수 있는 레벨이에요.</p></div>
      <div><h2 style="margin-bottom:6px">1주차 배분</h2><div>${Object.keys(w).length?Object.entries(w).map(([k,v])=>`${k} ${v}회`).join(' · '):'배분 없음'}${s===SIM.resortTo?` · 리조트 ${S.resort}h`:''}</div>
      <div class="meta" style="margin-top:4px">${SIM.weeks}주 누적: ${totals||'없음'}</div></div>
    </div>`;
  $('dlg').showModal(); $('dlgClose').onclick=()=>$('dlg').close();
}
$('dlg').addEventListener('click',e=>{ if(e.target===$('dlg')) $('dlg').close(); });
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
$('btnGo').onclick=()=>load(false);
$('btnRefresh').onclick=()=>load(true);
$('qName').addEventListener('keydown',e=>{ if(e.key==='Enter') load(false); });
$('btnRecalc').onclick=()=>{ readSettings(); if(ACC) render(); };
$('btnReset').onclick=()=>{ SM[MODE]=Object.assign({},DEFS[MODE]); S=SM[MODE]; fillSettings(); if(ACC){buildSelectors();} readSettings(); if(ACC) render(); };
['s_resortTo','s_linkFocus','s_ep_0','s_ep_1','s_ep_2','s_ep_3'].forEach(id=>$(id).addEventListener('change',()=>{ readSettings(); if(ACC) render(); }));
