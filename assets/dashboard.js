(()=>{
const form=document.getElementById('strategy-form'),strategy=document.getElementById('strategy'),market=document.getElementById('market'),status=document.getElementById('save-status'),error=document.getElementById('dashboard-error'),summary=document.getElementById('config-summary');
const defaults={budget:3000,lower:60000,upper:72000,levels:12,buyFee:.1,sellFee:.1,amount:100,frequency:'weekly',btc:50,eth:30,sol:20,drift:5};
const get=k=>document.getElementById('dash-'+k),num=k=>get(k).valueAsNumber,fmt=v=>v.toLocaleString('en-US',{maximumFractionDigits:2});
function data(){return Object.fromEntries(Object.keys(defaults).map(k=>[k,k==='frequency'?get(k).value:num(k)]))}
function apply(values){for(const k of Object.keys(defaults)){const v=values[k];get(k).value=(k==='frequency'?['daily','weekly','monthly'].includes(v):typeof v==='number'&&Number.isFinite(v))?v:defaults[k]}}
function restore(){let saved;try{saved=JSON.parse(localStorage.getItem('crypto-config-'+strategy.value))}catch{}apply(saved&&saved.parameters?saved.parameters:defaults);market.value=saved&&['BTC / USDT','ETH / USDT','SOL / USDT'].includes(saved.market)?saved.market:'BTC / USDT';status.textContent=saved?'Saved parameters restored.':'';update()}
function update(){
document.querySelectorAll('[data-fields]').forEach(section=>{section.hidden=section.dataset.fields!==strategy.value;section.querySelectorAll('input,select').forEach(field=>field.disabled=section.hidden)});
market.disabled=strategy.value==='rebalance';
get('upper').setCustomValidity('');get('amount').setCustomValidity('');get('btc').setCustomValidity('');
let message='';const invalid=[...form.querySelectorAll('input')].find(f=>!f.disabled&&!f.validity.valid);
if(invalid)message='Complete every field with a value within its allowed range.';
if(!message&&strategy.value==='grid'&&num('upper')<=num('lower')){message='Upper price must be greater than lower price.';get('upper').setCustomValidity(message)}
if(!message&&strategy.value==='dca'&&num('amount')>num('budget')){message='Purchase amount must fit within the strategy budget.';get('amount').setCustomValidity(message)}
if(!message&&strategy.value==='rebalance'&&num('btc')+num('eth')+num('sol')!==100){message='Asset allocations must add up to 100%.';get('btc').setCustomValidity(message)}
error.textContent=message;summary.replaceChildren();
if(message)return false;
const rows=[['Strategy',strategy.options[strategy.selectedIndex].text],['Market',strategy.value==='rebalance'?'BTC / ETH / SOL':market.value],['Budget',fmt(num('budget'))+' USDT']];
if(strategy.value==='grid'){const spacing=Math.expm1(Math.log(num('upper')/num('lower'))/num('levels'));rows.push(['Price range',fmt(num('lower'))+' to '+fmt(num('upper'))+' USDT'],['Grid intervals',fmt(num('levels'))],['Gross spacing',fmt(spacing*100)+'%'],['Net cycle margin',fmt((spacing-num('buyFee')/100-(1+spacing)*num('sellFee')/100)*100)+'%'],['Budget per interval',fmt(num('budget')/num('levels'))+' USDT'])}
if(strategy.value==='dca')rows.push(['Purchase amount',fmt(num('amount'))+' USDT'],['Frequency',get('frequency').value],['Funded purchases',fmt(Math.floor(num('budget')/num('amount')))],['Unallocated balance',fmt(num('budget')%num('amount'))+' USDT']);
if(strategy.value==='rebalance')rows.push(['Bitcoin',fmt(num('btc'))+'% / '+fmt(num('budget')*num('btc')/100)+' USDT'],['Ethereum',fmt(num('eth'))+'% / '+fmt(num('budget')*num('eth')/100)+' USDT'],['Solana',fmt(num('sol'))+'% / '+fmt(num('budget')*num('sol')/100)+' USDT'],['Drift threshold',fmt(num('drift'))+' percentage points']);
rows.forEach(([label,value])=>{const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;row.append(dt,dd);summary.append(row)});return true;
}
try{const chosen=sessionStorage.getItem('crypto-strategy');if(['grid','dca','rebalance'].includes(chosen))strategy.value=chosen;sessionStorage.removeItem('crypto-strategy')}catch{}
restore();
try{const carried=JSON.parse(sessionStorage.getItem('crypto-grid-settings'));if(carried&&strategy.value==='grid'){apply({...data(),...carried});market.value='BTC / USDT';status.textContent='Grid parameters loaded from the calculator.';sessionStorage.removeItem('crypto-grid-settings');update()}}catch{}
strategy.addEventListener('change',restore);
form.addEventListener('input',()=>{status.textContent='Unsaved changes';update()});
form.addEventListener('submit',e=>{e.preventDefault();if(!update()||!form.reportValidity())return;try{localStorage.setItem('crypto-config-'+strategy.value,JSON.stringify({market:market.value,parameters:data()}));status.textContent='Configuration saved in this browser.'}catch{status.textContent='Browser storage is unavailable. Keep this page open to retain your current configuration.'}});
document.getElementById('reset-config').addEventListener('click',()=>{apply(defaults);market.value='BTC / USDT';status.textContent='Default parameters restored. Save to replace your saved configuration.';update()});
})();
