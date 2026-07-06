const STORAGE_KEY = 'yueGardenDiary.v3';
const today = new Date();
const fmt = new Intl.DateTimeFormat('zh-CN',{year:'numeric',month:'2-digit',day:'2-digit',weekday:'long'});
const iso = d => d.toISOString().slice(0,10);
const daysSince = date => date ? Math.floor((today - new Date(date+'T00:00:00'))/86400000) : 999;
const state = loadState();
let selectedGroup = '全部';

document.getElementById('todayText').textContent = fmt.format(today).replace(/\//g,'-');

function seedPlants(){return [
{id:'jasmine-xiaomo',name:'小茉',species:'Jasmine',group:'前院',count:1,water:'高',light:'全日照～半日照',lastWatered:'2026-07-05',health:96,cat:'safe',notes:'已开花5朵，开花期保持微湿，花后再摘残花。'},
{id:'star-jasmine-xiaoli',name:'小莉',species:'Star Jasmine',group:'前院',count:1,water:'中',light:'下午西晒',lastWatered:'2026-07-05',health:94,cat:'caution',notes:'西晒位置，晴天后优先检查土壤。'},
{id:'hydrangea',name:'绣球',species:'Hydrangea',group:'前院',count:2,water:'高',light:'半日照',lastWatered:'2026-07-05',health:92,cat:'caution',notes:'新种，最怕缺水，保持微湿但不积水。'},
{id:'passionfruit-yellow',name:'小黄',species:'Passionfruit',group:'果园',count:1,water:'中',light:'全日照',lastWatered:'2026-07-05',health:94,cat:'caution',notes:'已开始自主攀爬，大风后检查支撑。'},
{id:'passionfruit-red',name:'小红',species:'Passionfruit',group:'果园',count:1,water:'中',light:'全日照',lastWatered:'2026-07-05',health:92,cat:'caution',notes:'卷须还在探索，不用强行缠网。'},
{id:'dragon-fruit',name:'火龙果',species:'Dragon Fruit',group:'果园',count:1,water:'低',light:'全日照',lastWatered:'2026-06-29',health:93,cat:'safe',notes:'冬季控水，偏干管理。'},
{id:'lawn',name:'新铺草皮',species:'Lawn',group:'草坪',count:1,water:'高',light:'全日照',lastWatered:'2026-07-05',health:88,cat:'safe',notes:'若已扎根可逐渐减少频率。'},
{id:'marguerite',name:'玛格丽特',species:'Marguerite Daisy',group:'前院',count:2,water:'中',light:'全日照',lastWatered:'2026-06-25',health:94,cat:'caution',notes:'花后摘残花。'},
{id:'lavender',name:'薰衣草',species:'Lavender',group:'前院',count:2,water:'低',light:'全日照',lastWatered:'2026-06-25',health:88,cat:'caution',notes:'宁干勿湿，避免积水。'},
{id:'kalanchoe',name:'长寿花',species:'Kalanchoe',group:'前院',count:1,water:'低',light:'全日照～半日照',lastWatered:'2026-06-25',health:95,cat:'caution',notes:'正在开花，花后剪花梗。'},
{id:'alyssum',name:'香雪球',species:'Sweet Alyssum',group:'前院',count:2,water:'中',light:'全日照～半日照',lastWatered:'2026-06-25',health:96,cat:'safe',notes:'盛花期，暂不修剪。'},
{id:'blue-eyes',name:'Blue Eyes',species:'Brachyscome',group:'前院',count:8,water:'中',light:'全日照～半日照',lastWatered:'2026-06-25',health:91,cat:'safe',notes:'花谢后摘残花或轻剪。'},
{id:'silver-falls',name:'Silver Falls',species:'Dichondra',group:'前院',count:12,water:'低',light:'全日照～半日照',lastWatered:'2026-06-29',health:90,cat:'safe',notes:'前三个月先建立根系，暂不修剪。'},
{id:'rhoeo',name:'Rhoeo Dwarf',species:'Tradescantia spathacea',group:'前院',count:1,water:'低',light:'全日照～半日照',lastWatered:'2026-06-25',health:92,cat:'toxic',notes:'观赏叶，猫狗勿啃。'},
{id:'silver-mist',name:'Silver Mist',species:'Helichrysum',group:'前院',count:1,water:'低',light:'全日照',lastWatered:'2026-06-25',health:91,cat:'safe',notes:'偏干管理。'},
{id:'speckled-blob',name:'Speckled Blob',species:'Sedum',group:'前院',count:1,water:'低',light:'全日照',lastWatered:'2026-06-25',health:95,cat:'safe',notes:'多肉，完全干透再浇。'},
{id:'gold-mound',name:'Gold Mound Sedum',species:'Sedum',group:'前院',count:2,water:'低',light:'全日照',lastWatered:'2026-06-25',health:95,cat:'safe',notes:'观赏为主，不建议食用。'},
{id:'pink-babysbreath',name:'粉色满天星',species:'Gypsophila / Dianthus type',group:'前院',count:1,water:'中',light:'全日照～半日照',lastWatered:'2026-06-25',health:94,cat:'caution',notes:'盛花期，底部少量黄叶和花色变浅暂属正常。'},
{id:'aloe',name:'芦荟',species:'Aloe',group:'前院',count:3,water:'低',light:'全日照～半日照',lastWatered:'2026-06-25',health:78,cat:'toxic',notes:'黄化恢复观察，继续控水。'},
{id:'cactus',name:'大仙人掌',species:'Cactus',group:'前院',count:1,water:'低',light:'全日照',lastWatered:'2026-06-29',health:95,cat:'caution',notes:'冬季可2～3周不浇。'},
{id:'succulents',name:'拟石莲花/多肉',species:'Succulents',group:'前院',count:2,water:'低',light:'全日照',lastWatered:'2026-06-25',health:94,cat:'caution',notes:'完全干透再浇。'},
{id:'areca-side',name:'黄金椰子',species:'Areca Palm',group:'侧院',count:3,water:'中',light:'约4小时西晒',lastWatered:'2026-07-01',health:92,cat:'safe',notes:'新种缓苗期，土干后浇透。'},
{id:'bird-paradise',name:'天堂鸟',species:'Bird of Paradise',group:'侧院',count:1,water:'中',light:'明亮光～半日照',lastWatered:'2026-07-01',health:93,cat:'toxic',notes:'叶片被风撕裂属正常。'},
{id:'cordyline',name:'粉叶朱蕉',species:'Cordyline fruticosa',group:'侧院',count:1,water:'中',light:'半日照～散射光',lastWatered:'2026-07-01',health:95,cat:'toxic',notes:'对猫狗轻度有毒，剪除完全枯黄底叶。'},
{id:'dracaena-marginata',name:'龙血树',species:'Dracaena marginata',group:'侧院',count:1,water:'低',light:'明亮散射光～半日照',lastWatered:'2026-07-06',health:98,cat:'toxic',notes:'2026-07-06种下，首次需浇透8–10L。'},
{id:'variegated-side',name:'斑叶植物',species:'Variegated foliage plant',group:'侧院',count:3,water:'中',light:'半日照',lastWatered:'2026-07-01',health:92,cat:'caution',notes:'保持微湿，避免积水。'},
{id:'areca-indoor',name:'室内散尾葵',species:'Areca Palm',group:'室内',count:1,water:'中',light:'明亮散射光',lastWatered:'2026-06-24',health:90,cat:'safe',notes:'深层干再缓慢浇透，倒掉托盘积水。'},
{id:'corkscrew-rush',name:'螺旋灯心草',species:'Juncus spiralis',group:'室内',count:1,water:'高',light:'明亮散射光',lastWatered:'2026-07-06',health:88,cat:'safe',notes:'保持持续湿润，剪除外围全黄老叶。'}
];}
function seedLogs(){return [
{date:'2026-07-06',title:'新增龙血树',text:'侧院新增龙血树，建议首次浇透8–10L。'},
{date:'2026-07-06',title:'主人名称更新',text:'Garden Diary 改为 by Yue。'},
{date:'2026-07-05',title:'小黄小红大风观察',text:'百香果经历大风，已临时挡风。'},
{date:'2026-07-01',title:'小茉开花5朵',text:'小茉进入第一波盛花期。'},
{date:'2026-07-01',title:'长寿花开花',text:'长寿花正式进入花期。'},
{date:'2026-06-29',title:'香雪球确认',text:'前院香雪球×2进入档案。'},
{date:'2026-06-29',title:'Silver Falls记录',text:'前院Silver Falls共12株。'}
];}
function loadState(){const saved=localStorage.getItem(STORAGE_KEY); if(saved){try{return JSON.parse(saved)}catch(e){}} return {plants:seedPlants(),logs:seedLogs(),photos:{},niania:[{date:'2026-07-01',text:'Niania首次在草地尿尿，尿完直接离开。'}]};}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function renderAll(){renderWeather();renderDashboard();renderFilters();renderPlants();renderMap();renderTimeline();renderNiania();}
async function renderWeather(){const box=document.getElementById('weatherBox'); box.innerHTML='正在获取天气...'; try{const url='https://api.open-meteo.com/v1/forecast?latitude=-27.68&longitude=152.78&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Australia%2FBrisbane'; const r=await fetch(url); const data=await r.json(); const c=data.current,d=data.daily; box.innerHTML=`<div class="weather-item"><div class="weather-temp">${Math.round(c.temperature_2m)}°C</div><div>当前温度</div></div><div class="weather-item"><strong>${Math.round(d.temperature_2m_min[0])}–${Math.round(d.temperature_2m_max[0])}°C</strong><div>今日范围</div></div><div class="weather-item"><strong>${c.wind_speed_10m} km/h</strong><div>风速</div></div><div class="weather-item"><strong>${d.precipitation_probability_max[0]}%</strong><div>降雨概率</div></div>`; }catch(e){box.innerHTML='<div class="weather-item">天气获取失败。可稍后刷新。</div>'}}
function plantTask(p){const d=daysSince(p.lastWatered); let due=false, level='观察'; if(p.water==='高'&&d>=2) due=true; if(p.water==='中'&&d>=4) due=true; if(p.water==='低'&&d>=9) due=true; if(d<=1) level='不用浇'; else if(d>=7) level='优先检查'; return {p,d,due,level};}
function renderDashboard(){const tasks=state.plants.map(plantTask).filter(x=>x.due||['小茉','小莉','绣球','小黄','小红','龙血树','螺旋灯心草','室内散尾葵','芦荟','粉色满天星'].includes(x.p.name)); document.getElementById('taskList').innerHTML=tasks.slice(0,12).map(({p,d,due,level})=>`<div class="task"><strong>${p.name}${p.count>1?' ×'+p.count:''}</strong><span class="muted">上次浇水：${p.lastWatered||'未记录'}（${d>100?'未记录':d+'天前'}）</span><br>${due?'💧 今日建议检查并按需浇水':'✅ 今日通常不用浇'}｜${p.notes}</div>`).join(''); document.getElementById('highlights').innerHTML=['小茉持续开花，记录已更新为5朵。','龙血树已加入侧院档案，今天为新栽后重点观察。','百香果大风后继续检查主藤和支撑。','粉色满天星仍盛花，花色变浅暂属正常。','Niania 巡园栏目已保留。'].map(x=>`<li>${x}</li>`).join(''); document.getElementById('fertilizerTips').innerHTML='<p>当前为昆州冬季，绝大多数植物暂停施肥。百香果、绣球、Silver Falls、龙血树等建议等9月春季恢复生长后再开始少量追肥。</p>'; document.getElementById('pruneTips').innerHTML='<p>本周只做清理型修剪：通心草剪全黄老叶；满天星、香雪球只摘明显残花；小茉、小莉、百香果、龙血树暂不修剪。</p>';}
function groups(){return ['全部',...Array.from(new Set(state.plants.map(p=>p.group)))]}
function renderFilters(){document.getElementById('groupFilters').innerHTML=groups().map(g=>`<button class="filter ${g===selectedGroup?'active':''}" data-group="${g}">${g}</button>`).join(''); document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{selectedGroup=b.dataset.group;renderFilters();renderPlants();});}
function renderPlants(){const list=selectedGroup==='全部'?state.plants:state.plants.filter(p=>p.group===selectedGroup); document.getElementById('plantCards').innerHTML=list.map(p=>`<article class="plant-card" data-id="${p.id}"><h3>${p.name}${p.count>1?' ×'+p.count:''}</h3><p class="muted">${p.species||''}</p><span class="badge">${p.group}</span><span class="badge">需水：${p.water}</span><span class="badge health">健康 ${p.health||90}%</span><p>${p.notes||''}</p><div class="actions"><button data-action="water" data-id="${p.id}">浇水</button><button data-action="fert" data-id="${p.id}">施肥</button><button data-action="prune" data-id="${p.id}">修剪</button></div></article>`).join(''); document.querySelectorAll('.plant-card').forEach(card=>{card.onclick=e=>{if(e.target.tagName==='BUTTON')return;openDetail(card.dataset.id)}}); document.querySelectorAll('[data-action]').forEach(btn=>btn.onclick=e=>{e.stopPropagation();recordAction(btn.dataset.id,btn.dataset.action)});}
function renderMap(){const by={}; state.plants.forEach(p=>(by[p.group]??=[]).push(p)); document.getElementById('gardenMap').innerHTML=Object.entries(by).map(([g,items])=>`<div class="map-zone"><h3>${g}</h3>${items.map(p=>`<button class="map-pill" onclick="openDetail('${p.id}')">${p.name}${p.count>1?' ×'+p.count:''}</button>`).join('')}</div>`).join('')}
function renderTimeline(){document.getElementById('timelineList').innerHTML=state.logs.sort((a,b)=>b.date.localeCompare(a.date)).map(l=>`<div class="log"><strong>${l.date}｜${l.title}</strong><p>${l.text||''}</p></div>`).join('')}
function renderNiania(){document.getElementById('nianiaReport').innerHTML='<p>今日巡园重点：检查百香果支撑、确认没有偷啃龙血树和粉叶朱蕉、监督园长浇水。</p>'+state.niania.slice().reverse().map(l=>`<div class="log"><strong>${l.date}</strong><p>${l.text}</p></div>`).join('')}
function recordAction(id,action){const p=state.plants.find(x=>x.id===id); const map={water:'浇水',fert:'施肥',prune:'修剪'}; if(action==='water')p.lastWatered=iso(today); if(action==='fert')p.lastFertilized=iso(today); if(action==='prune')p.lastPruned=iso(today); state.logs.push({date:iso(today),title:`${p.name}：${map[action]}`,text:`已记录${map[action]}。`}); save();renderAll();}
window.openDetail=function(id){const p=state.plants.find(x=>x.id===id); const photos=state.photos[id]||[]; document.getElementById('plantDetail').innerHTML=`<h2>${p.name}${p.count>1?' ×'+p.count:''}</h2><p class="muted">${p.species||''}</p><span class="badge">${p.group}</span><span class="badge">需水：${p.water}</span><span class="badge">光照：${p.light||'未记录'}</span><span class="badge">猫友好：${p.cat==='safe'?'较安全':p.cat==='toxic'?'需避开':'谨慎'}</span><h3>养护记录</h3><p>上次浇水：${p.lastWatered||'未记录'}</p><p>上次施肥：${p.lastFertilized||'未记录'}</p><p>上次修剪：${p.lastPruned||'未记录'}</p><p>${p.notes||''}</p><div class="actions"><button onclick="recordAction('${p.id}','water')">记录浇水</button><button onclick="recordAction('${p.id}','fert')">记录施肥</button><button onclick="recordAction('${p.id}','prune')">记录修剪</button></div><h3>成长照片</h3><input type="file" accept="image/*" id="photoInput"><div class="photo-preview">${photos.map(src=>`<img src="${src}">`).join('')}</div>`; document.getElementById('detailDialog').showModal(); document.getElementById('photoInput').onchange=e=>{const file=e.target.files[0]; if(!file)return; const reader=new FileReader(); reader.onload=()=>{(state.photos[id]??=[]).push(reader.result); state.logs.push({date:iso(today),title:`${p.name}新增照片`,text:'已添加成长照片。'}); save();openDetail(id);}; reader.readAsDataURL(file);};}
document.getElementById('closeDetail').onclick=()=>document.getElementById('detailDialog').close();
document.getElementById('addPlantBtn').onclick=()=>{document.getElementById('plantForm').reset();document.getElementById('plantId').value='';document.getElementById('plantDialog').showModal();}
document.getElementById('plantForm').onsubmit=e=>{e.preventDefault(); const id=document.getElementById('plantId').value||('plant-'+Date.now()); const p={id:id,name:document.getElementById('plantName').value,species:document.getElementById('plantSpecies').value,group:document.getElementById('plantGroup').value,count:+document.getElementById('plantCount').value||1,water:document.getElementById('plantWater').value,light:document.getElementById('plantLight').value,notes:document.getElementById('plantNotes').value,lastWatered:null,health:90,cat:'caution'}; state.plants.push(p); state.logs.push({date:iso(today),title:`新增植物：${p.name}`,text:`已加入${p.group}。`}); save();document.getElementById('plantDialog').close();renderAll();}
document.getElementById('addLogBtn').onclick=()=>document.getElementById('logDialog').showModal();
document.getElementById('logForm').onsubmit=e=>{e.preventDefault();state.logs.push({date:iso(today),title:document.getElementById('logTitle').value,text:document.getElementById('logText').value});save();document.getElementById('logDialog').close();renderTimeline();}
document.getElementById('addNianiaLog').onclick=()=>{state.niania.push({date:iso(today),text:'Niania 今日完成巡园。'});save();renderNiania();}
document.getElementById('markDiary').onclick=()=>{state.logs.push({date:iso(today),title:'今日巡园完成',text:'已查看天气、浇水、施肥和修剪提醒。'});save();renderTimeline();alert('已记录今日巡园。')}
document.getElementById('exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='garden-diary-backup-'+iso(today)+'.json'; a.click();}
document.getElementById('refreshWeather').onclick=renderWeather;

function switchView(view){
  document.querySelectorAll('.view').forEach(function(section){
    section.classList.toggle('active', section.id === view);
  });
  document.querySelectorAll('.tab').forEach(function(tab){
    tab.classList.toggle('active', tab.dataset.view === view);
  });
  window.scrollTo({top:0, behavior:'smooth'});
}
document.querySelectorAll('.tab').forEach(function(tab){
  tab.addEventListener('click', function(){
    switchView(tab.dataset.view);
  });
});

renderAll();
