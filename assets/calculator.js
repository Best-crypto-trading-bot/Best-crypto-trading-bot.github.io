(()=>{
const form=document.getElementById('grid-form'),fields=[...form.querySelectorAll('input')],error=document.getElementById('calc-error');
const ids=['net-percent','net-caption','spacing','per-order','cycle-fee','range-width','fee-share'];
const fmt=(v,d=2)=>v.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
let settings=null;
function update(){
fields.forEach(f=>f.removeAttribute('aria-invalid'));
const bad=fields.find(f=>!f.validity.valid||!Number.isFinite(f.valueAsNumber));
let message=bad?'Enter a value within the allowed range in every field.':'';
const [budget,levels,lower,upper,buyFee,sellFee]=fields.map(f=>f.valueAsNumber);
if(!message&&upper<=lower){message='Upper price must be greater than lower price.';document.getElementById('upper').setAttribute('aria-invalid','true')}
if(bad)bad.setAttribute('aria-invalid','true');
error.textContent=message;
if(message){settings=null;ids.forEach(id=>document.getElementById(id).textContent='—');document.getElementById('net-caption').textContent='Update the highlighted input to calculate your grid.';document.getElementById('margin-bar').style.width='0%';return}
const spacing=Math.expm1(Math.log(upper/lower)/levels),order=budget/levels,fees=buyFee/100+(1+spacing)*sellFee/100,net=spacing-fees;
document.getElementById('net-percent').textContent=fmt(net*100)+'%';
document.getElementById('net-caption').textContent=fmt(net*order)+' USDT on a '+fmt(order)+' USDT buy order';
document.getElementById('spacing').textContent=fmt(spacing*100)+'%';
document.getElementById('per-order').textContent=fmt(order);
document.getElementById('cycle-fee').textContent=fmt(fees*order)+' USDT';
document.getElementById('range-width').textContent=fmt((upper/lower-1)*100)+'%';
document.getElementById('fee-share').textContent=fmt(fees/spacing*100)+'% of gross margin spent on fees';
document.getElementById('margin-bar').style.width=Math.max(0,Math.min(100,net/spacing*100))+'%';
if(net<=0)error.textContent='Trading fees consume the grid spacing. Widen the range, reduce intervals or enter a lower fee tier.';
settings={budget,levels,lower,upper,buyFee,sellFee};
}
form.addEventListener('input',update);
form.addEventListener('submit',e=>e.preventDefault());
document.getElementById('use-grid').addEventListener('click',()=>{try{sessionStorage.setItem('crypto-strategy','grid');if(settings)sessionStorage.setItem('crypto-grid-settings',JSON.stringify(settings));else sessionStorage.removeItem('crypto-grid-settings')}catch{}});
document.querySelectorAll('[data-strategy]').forEach(link=>link.addEventListener('click',()=>{try{sessionStorage.setItem('crypto-strategy',link.dataset.strategy)}catch{}}));
update();
})();
