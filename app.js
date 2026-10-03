'use strict';
const menu = [
 {id:'chop',name:'Chopped Cheese',category:'Grill classics',price:850,description:'Chopped beef, American cheese, grilled onions, lettuce, tomato, mayo & ketchup.',tag:'THE NEIGHBORHOOD FAVORITE',kind:'sandwich',defaults:['Lettuce','Tomato','Grilled onions','Mayo','Ketchup']},
 {id:'cutlet',name:'Chicken Cutlet',category:'Grill classics',price:900,description:'Crispy chicken cutlet, American cheese, lettuce, tomato & mayo.',kind:'sandwich',defaults:['Lettuce','Tomato','Mayo']},
 {id:'philly',name:'Philly Cheesesteak',category:'Grill classics',price:1000,description:'Grilled steak, melted American cheese, peppers & onions.',kind:'sandwich',defaults:['Grilled onions','Peppers']},
 {id:'buffalo',name:'Buffalo Chicken',category:'Grill classics',price:950,description:'Crispy chicken, buffalo sauce, lettuce & ranch.',kind:'sandwich',defaults:['Lettuce','Buffalo sauce','Ranch']},
 {id:'bec',name:'Bacon, Egg & Cheese',category:'Breakfast',price:600,description:'Crispy bacon, two eggs & American cheese. A New York morning, any time.',kind:'breakfast',defaults:[]},
 {id:'sec',name:'Sausage, Egg & Cheese',category:'Breakfast',price:600,description:'Griddled sausage, two eggs & melted American cheese.',kind:'breakfast',defaults:[]},
 {id:'ec',name:'Egg & Cheese',category:'Breakfast',price:450,description:'Two eggs & American cheese on a warm roll. Simple for a reason.',kind:'breakfast',defaults:[]},
 {id:'bagel',name:'Bagel & Cream Cheese',category:'Breakfast',price:350,description:'Your choice of bagel, toasted or soft, with a generous schmear.',kind:'bagel',defaults:[]},
 {id:'turkey',name:'Turkey & Swiss',category:'Deli sandwiches',price:850,description:'Sliced turkey, Swiss, lettuce, tomato & mayo.',kind:'sandwich',cheese:'Swiss',defaults:['Lettuce','Tomato','Mayo']},
 {id:'italian',name:'Italian Hero',category:'Deli sandwiches',price:1000,description:'Ham, salami, provolone, lettuce, tomato, onion, oil & vinegar.',kind:'sandwich',cheese:'Provolone',defaults:['Lettuce','Tomato','Raw onions','Oil & vinegar']},
 {id:'tuna',name:'Tuna Salad',category:'Deli sandwiches',price:800,description:'House-style tuna salad, crisp lettuce & tomato.',kind:'sandwich',cheese:'No cheese',defaults:['Lettuce','Tomato']},
 {id:'veggie',name:'Garden Veggie',category:'Deli sandwiches',price:750,description:'Provolone, lettuce, tomato, peppers, onion & oil and vinegar.',kind:'sandwich',cheese:'Provolone',defaults:['Lettuce','Tomato','Peppers','Raw onions','Oil & vinegar']},
 {id:'fries',name:'French Fries',category:'Sides & drinks',price:350,description:'Golden, crispy fries. Ketchup on the side.',kind:'side',defaults:[]},
 {id:'hash',name:'Hash Brown',category:'Sides & drinks',price:200,description:'Crisp outside, soft inside. The breakfast sidekick.',kind:'side',defaults:[]},
 {id:'chips',name:'Potato Chips',category:'Sides & drinks',price:200,description:'A classic bag of chips for the walk home.',kind:'chips',defaults:[]},
 {id:'soda',name:'Can of Soda',category:'Sides & drinks',price:175,description:'Coke, Diet Coke, Sprite or ginger ale.',kind:'soda',defaults:[]},
 {id:'tea',name:'Iced Tea',category:'Sides & drinks',price:200,description:'A chilled can of lemon or green tea.',kind:'tea',defaults:[]},
 {id:'water',name:'Bottled Water',category:'Sides & drinks',price:150,description:'Cold bottled water. Keep it simple.',kind:'plain',defaults:[]}
];
const categories=['Grill classics','Breakfast','Deli sandwiches','Sides & drinks'];
const $=id=>document.getElementById(id);
const money=cents=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(cents/100);
const escapeHTML=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let bag=[], activeItem=null, quantity=1, editIndex=null, activeCategory=categories[0];
const toppings=['Lettuce','Tomato','Grilled onions','Raw onions','Pickles','Peppers','Jalapeños'];
const sauces=['Mayo','Ketchup','Mustard','Hot sauce','BBQ sauce','Ranch','Buffalo sauce','Oil & vinegar'];
const extras=[['Extra cheese',100],['Bacon',200],['Avocado',150],['Hash brown',150],['Extra meat',300]];
function notify(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('toast').classList.remove('show'),2500);}
function renderMenu(){
 $('categories').innerHTML=categories.map(c=>`<button aria-pressed="${c===activeCategory}" data-category="${c}">${c}</button>`).join('');
 $('menu-grid').innerHTML=menu.filter(i=>i.category===activeCategory).map(i=>`<article class="item">${i.tag?`<div class="badge">${i.tag}</div>`:''}<div class="item-top"><h3>${i.name}</h3><span class="item-number">${String(menu.indexOf(i)+1).padStart(2,'0')}</span></div><p>${i.description}</p><div class="item-bottom"><span class="price">${money(i.price)}</span><button class="item-add" data-customize="${i.id}" aria-label="${i.kind==='plain'?'Add':'Customize'} ${i.name}">${i.kind==='plain'?'Add +':'Customize +'}</button></div></article>`).join('');
}
function group(title,name,values,type='radio',selected=[]){return `<fieldset class="option-group"><legend>${title}</legend><div class="options">${values.map(v=>{const [label,price]=Array.isArray(v)?v:[v,0];return `<label class="choice"><input type="${type}" name="${name}" value="${escapeHTML(label)}" data-price="${price}" ${selected.includes(label)?'checked':''}>${escapeHTML(label)}${price?` +${money(price)}`:''}</label>`}).join('')}</div></fieldset>`;}
function openCustomizer(id,index=null){
 const item=menu.find(i=>i.id===id);if(!item)return;
 if(item.kind==='plain'&&index===null){bag.push({id:item.id,name:item.name,unit:item.price,quantity:1,options:[],notes:'',selections:{}});renderBag();notify('Added to your bag');return;}
 activeItem=item;editIndex=index;const prior=index!==null?bag[index]:null;quantity=prior?.quantity||1;
 const selected=prior?.selections||{};const defaults=item.defaults;
 $('custom-title').textContent=item.name;$('custom-description').textContent=item.description;
 let fields='';
 if(['sandwich','breakfast'].includes(item.kind)){
 const bread=item.kind==='breakfast'?['Roll',['Hero',150],['Everything bagel',100],['Plain bagel',100],['Wrap',100]]:['Hero',['Roll',-100],'Wrap'];
 fields+=group('Bread','bread',bread,'radio',selected.bread||[item.kind==='breakfast'?'Roll':'Hero']);
 fields+=group('Cheese','cheese',['American','Cheddar','Pepper jack','Swiss','Provolone','No cheese'],'radio',selected.cheese||[item.cheese||'American']);
 fields+=group('Toppings','toppings',toppings,'checkbox',selected.toppings||defaults.filter(v=>toppings.includes(v)));
 fields+=group('Sauces','sauces',sauces,'checkbox',selected.sauces||defaults.filter(v=>sauces.includes(v)));
 if(item.kind==='breakfast')fields+=group('Eggs','eggs',['Scrambled','Over easy','Over hard'],'radio',selected.eggs||['Scrambled']);
 fields+=group('Extras','extras',extras,'checkbox',selected.extras||[]);
 fields+=group('Bread prep','prep',['Toasted','Not toasted'],'radio',selected.prep||['Toasted']);
 }else if(item.kind==='bagel'){
 fields+=group('Bagel','bread',['Everything','Plain','Sesame'],'radio',selected.bread||['Everything']);
 fields+=group('Cream cheese','spread',['Plain','Scallion'],'radio',selected.spread||['Plain']);
 fields+=group('Bread prep','prep',['Toasted','Not toasted'],'radio',selected.prep||['Toasted']);
 }else if(item.kind==='soda')fields+=group('Pick a soda','flavor',['Coke','Diet Coke','Sprite','Ginger ale'],'radio',selected.flavor||['Coke']);
 else if(item.kind==='tea')fields+=group('Pick a tea','flavor',['Lemon tea','Green tea'],'radio',selected.flavor||['Lemon tea']);
 else if(item.kind==='chips')fields+=group('Pick your chips','flavor',['Classic','BBQ','Sour cream & onion'],'radio',selected.flavor||['Classic']);
 else if(item.kind==='side')fields+=group('Sauce on the side','sauces',['Ketchup','Mayo','Hot sauce'],'checkbox',selected.sauces||['Ketchup']);
 $('custom-fields').innerHTML=fields;$('custom-form').elements.notes.value=prior?.notes||'';updateCustomPrice();$('customizer').showModal();
}
function readCustom(){const selections={};let unit=activeItem.price;
 for(const input of $('custom-fields').querySelectorAll('input:checked')){(selections[input.name]??=[]).push(input.value);unit+=Number(input.dataset.price);}
 let options=[];
 for(const [key,values] of Object.entries(selections)){if(values.length)options.push(`${({bread:'Bread',cheese:'Cheese',toppings:'Toppings',sauces:'Sauces',extras:'Extras',prep:'Prep',eggs:'Eggs',spread:'Spread',flavor:'Choice'})[key]}: ${values.join(', ')}`);else options.push(`${key}: none`);}
 if(['sandwich','breakfast'].includes(activeItem.kind))for(const key of ['toppings','sauces'])if(!selections[key]){selections[key]=[];options.push(`${key==='toppings'?'Toppings':'Sauces'}: none`);}
 return {id:activeItem.id,name:activeItem.name,unit,quantity,options,notes:$('custom-form').elements.notes.value.trim(),selections};
}
function updateCustomPrice(){$('quantity-value').textContent=quantity;$('quantity-minus').disabled=quantity<=1;$('quantity-plus').disabled=quantity>=20;$('add-to-bag').textContent=`${editIndex===null?'Add to bag':'Save changes'} · ${money(readCustom().unit*quantity)}`;}
function subtotal(){return bag.reduce((s,i)=>s+i.unit*i.quantity,0);}function count(){return bag.reduce((s,i)=>s+i.quantity,0);}
function renderBag(){const n=count();$('bag-count').textContent=n;$('mobile-total').textContent=n?`${n} ${n===1?'item':'items'} · ${money(subtotal())}`:'0 items';
 $('bag-items').innerHTML=bag.length?bag.map((i,index)=>`<div class="bag-line"><div class="bag-line-head"><span>${escapeHTML(i.name)}</span><span>${money(i.unit*i.quantity)}</span></div><p>${escapeHTML(i.options.join(' · '))}${i.notes?`<br>Note: ${escapeHTML(i.notes)}`:''}</p><div class="bag-line-controls"><div class="stepper"><button data-adjust="${index}" data-delta="-1" aria-label="Decrease ${escapeHTML(i.name)} quantity">−</button><output>${i.quantity}</output><button data-adjust="${index}" data-delta="1" ${i.quantity>=20?'disabled':''} aria-label="Increase ${escapeHTML(i.name)} quantity">+</button></div><button class="edit-button" data-edit="${index}">Edit</button><button class="edit-button" data-remove="${index}" aria-label="Remove ${escapeHTML(i.name)}">Remove</button></div></div>`).join(''):`<div class="bag-empty"><div class="empty-icon" aria-hidden="true">＋</div><h3>Your usual goes here.</h3><p>Pick something good.<br>We’ll make it just how you like it.</p></div>`;
 $('bag-bottom').innerHTML=`<div class="subtotal"><span>Subtotal</span><span>${money(subtotal())}</span></div><p class="tax-note">Before applicable tax. Pay at pickup.</p><button class="primary" id="start-checkout" ${bag.length?'':'disabled'}>Review & text order</button>`;
}
function orderMessage(){let lines=[`${window.STORE.name.toUpperCase()} — PICKUP ORDER`,`Name: ${$('pickup-name').value.trim()||'[your name]'}`,`Pickup: ${$('pickup-time').value}`,''];
 bag.forEach((i,index)=>{lines.push(`${index+1}. ${i.quantity} × ${i.name} — ${money(i.unit*i.quantity)}`,...i.options.map(v=>`   ${v}`));if(i.notes)lines.push(`   Note: ${i.notes}`);lines.push('');});
 lines.push(`Subtotal: ${money(subtotal())} (before tax)`,`Payment: at pickup`);if($('order-note').value.trim())lines.push(`Order note: ${$('order-note').value.trim()}`);lines.push('','Please confirm total & pickup time. Thank you!');return lines.join('\n');
}
function updateSMS(){const body=orderMessage();$('sms-preview').textContent=body;const apple=/iPhone|iPad|iPod/.test(navigator.userAgent)||navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1;
 $('sms-link').href=`sms:${window.STORE.phone}${apple?'&':'?'}body=${encodeURIComponent(body)}`;
}
function openBag(){if(matchMedia('(max-width:760px)').matches){$('bag-panel').classList.add('open');$('bag-panel').setAttribute('role','dialog');$('bag-panel').setAttribute('aria-modal','true');$('bag-panel').setAttribute('aria-label','Your bag');document.body.style.overflow='hidden';$('close-bag').focus();}else $('bag-panel').scrollIntoView({behavior:'smooth',block:'center'});}
function closeBag(){$('bag-panel').classList.remove('open');$('bag-panel').removeAttribute('role');$('bag-panel').removeAttribute('aria-modal');document.body.style.overflow='';$('mobile-bag').focus();}
document.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;
 if(button.dataset.category){activeCategory=button.dataset.category;renderMenu();$('categories').querySelector(`[data-category="${activeCategory}"]`).focus();}
 if(button.dataset.customize)openCustomizer(button.dataset.customize);
 if(button.dataset.close)$(button.dataset.close).close();
 if(button.dataset.adjust!==undefined){const index=Number(button.dataset.adjust);bag[index].quantity+=Number(button.dataset.delta);if(bag[index].quantity<=0)bag.splice(index,1);renderBag();}
 if(button.dataset.edit!==undefined){const index=Number(button.dataset.edit);openCustomizer(bag[index].id,index);}
 if(button.dataset.remove!==undefined){bag.splice(Number(button.dataset.remove),1);renderBag();}
 if(button.id==='start-checkout'){updateSMS();$('checkout').showModal();}
});
$('custom-fields').addEventListener('change',updateCustomPrice);
$('quantity-minus').onclick=()=>{quantity=Math.max(1,quantity-1);updateCustomPrice();};$('quantity-plus').onclick=()=>{quantity=Math.min(20,quantity+1);updateCustomPrice();};
$('custom-form').onsubmit=event=>{event.preventDefault();const item=readCustom();if(editIndex===null)bag.push(item);else bag[editIndex]=item;renderBag();$('customizer').close();notify(editIndex===null?'Added to your bag':'Your sandwich, updated');};
$('header-bag').onclick=openBag;$('mobile-bag').onclick=openBag;$('close-bag').onclick=closeBag;
$('pickup-form').addEventListener('input',updateSMS);$('pickup-form').onsubmit=event=>event.preventDefault();
$('sms-link').onclick=event=>{if(!$('pickup-form').reportValidity()){event.preventDefault();return;}updateSMS();};
$('copy-order').onclick=async()=>{if(!$('pickup-form').reportValidity())return;try{await navigator.clipboard.writeText(orderMessage());notify('Order copied. Paste it into a text.');}catch{notify('Select and copy the message preview.');}};
$('store-phone').textContent=window.STORE.displayPhone;$('placeholder-note').textContent=window.STORE.placeholder?'Demo store number: 800-555-5555. Replace it with your store’s number before accepting orders.':'';
document.addEventListener('keydown',event=>{if($('bag-panel').classList.contains('open')&&!$('customizer').open&&!$('checkout').open){if(event.key==='Escape')closeBag();if(event.key==='Tab'){const focusable=[...$('bag-panel').querySelectorAll('button:not(:disabled),a,input')];const first=focusable[0],last=focusable.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}}});
matchMedia('(max-width:760px)').addEventListener('change',()=>{if($('bag-panel').classList.contains('open'))closeBag();});
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
renderMenu();renderBag();
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'read_order_bag',description:'Read the staged pickup order and subtotal. Does not send a message.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({items:bag.map(i=>({...i})),subtotal:subtotal(),currency:'USD'})})).catch(()=>{});}catch{}}
