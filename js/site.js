(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
var hdr=$('.hdr');

/* preloader */
var pre=$('#pre');
function hidePre(){if(pre){pre.classList.add('off');setTimeout(function(){pre&&pre.remove()},700)}}
if(document.readyState==='complete')setTimeout(hidePre,500);else window.addEventListener('load',function(){setTimeout(hidePre,500)});
setTimeout(hidePre,3000);

/* header */
function onScroll(){hdr&&hdr.classList.toggle('solid',window.scrollY>40)}
onScroll();window.addEventListener('scroll',onScroll,{passive:true});

/* mobile menu */
var bg=$('.burger'),menu=$('.menu');
function setMenu(o){if(!bg||!menu)return;menu.classList.toggle('open',o);bg.setAttribute('aria-expanded',o);document.body.classList.toggle('mo',o);if(hdr){hdr.classList.toggle('solid',o||window.scrollY>40)}}
if(bg){bg.addEventListener('click',function(){setMenu(bg.getAttribute('aria-expanded')!=='true')});
 $$('a',menu).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});}

/* hero slider */
var hero=$('.hero');
if(hero){
 var sl=$$('.sl',hero),word=$('.hero-w span',hero),bars=$('.hero-bar',hero),cur=0,timer,dur=5500;
 sl.forEach(function(s,i){var b=document.createElement('i');b.addEventListener('click',function(){go(i,true)});bars.appendChild(b)});
 var bi=$$('i',bars);
 function lazy(i){$$('img',sl[i]).forEach(function(im){if(im.dataset.src){im.src=im.dataset.src;delete im.dataset.src}})}
 function go(i,manual){
  cur=(i+sl.length)%sl.length;lazy(cur);lazy((cur+1)%sl.length);
  sl.forEach(function(s,k){s.classList.toggle('on',k===cur)});
  bi.forEach(function(b,k){b.className=k<cur?'done':k===cur?'cur':'';b.style.setProperty('--d',dur+'ms')});
  var w=sl[cur].dataset.word;word.textContent=w;word.style.animation='none';void word.offsetWidth;word.style.animation='';
  var lnk=$('.hero-more',hero);if(lnk){lnk.href=sl[cur].dataset.href||'#portfolio'}
  clearTimeout(timer);timer=setTimeout(function(){go(cur+1)},dur);
 }
 $('.hero-prev',hero).addEventListener('click',function(){go(cur-1,true)});
 $('.hero-next',hero).addEventListener('click',function(){go(cur+1,true)});
 var x0=null;hero.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
 hero.addEventListener('touchend',function(e){if(x0===null)return;var d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>50)go(cur+(d<0?1:-1),true);x0=null},{passive:true});
 document.addEventListener('visibilitychange',function(){if(document.hidden)clearTimeout(timer);else go(cur)});
 go(0);
 window.addEventListener('load',function(){setTimeout(function(){sl.forEach(function(s,i){lazy(i)})},1500)});
}

/* reveal */
if('IntersectionObserver' in window){
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
 $$('.rv').forEach(function(el){io.observe(el)});
}else $$('.rv').forEach(function(el){el.classList.add('in')});

/* portfolio filter */
var gal=$('#gal');
if(gal){
 var items=$$('.gi',gal),chips=$$('.chip'),more=$('#more'),per=3;
 function apply(g){
  chips.forEach(function(c){c.classList.toggle('on',c.dataset.g===g)});
  var shown={};items.forEach(function(it){
   var k=it.dataset.g,ok;
   if(g==='all'){shown[k]=(shown[k]||0)+1;ok=shown[k]<=per}else ok=(k===g);
   it.classList.toggle('hide',!ok)});
  if(more){more.style.display=g==='all'?'flex':'none'}
 }
 chips.forEach(function(c){c.addEventListener('click',function(){apply(c.dataset.g)})});
 if(more)$('button',more).addEventListener('click',function(){per+=3;apply('all');if(per>=12)more.style.display='none'});
 apply('all');
 $$('[data-filter]').forEach(function(a){a.addEventListener('click',function(){apply(a.dataset.filter)})});
}

/* lightbox */
var lb=$('#lb');
if(lb){
 var lbi=$('img',lb),lbc=$('.lb-c',lb),lbn=$('.lb-cnt',lb),list=[],idx=0;
 function show(i){idx=(i+list.length)%list.length;var a=list[idx];lbi.src=a.href;lbi.alt=$('img',a).alt;lbc.textContent=$('img',a).alt;lbn.textContent=(idx+1)+' / '+list.length;
  var nx=list[(idx+1)%list.length];if(nx){var pi=new Image();pi.src=nx.href}}
 function open(a){var box=a.closest('[data-gal]')||document;list=$$('.gi:not(.hide)',box);idx=list.indexOf(a);show(idx);lb.classList.add('on');document.body.style.overflow='hidden';$('.lb-x',lb).focus()}
 function close(){lb.classList.remove('on');document.body.style.overflow='';lbi.src=''}
 document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('.gi');if(a){e.preventDefault();open(a)}});
 $('.lb-x',lb).addEventListener('click',close);
 $('.lb-n.p',lb).addEventListener('click',function(){show(idx-1)});
 $('.lb-n.n',lb).addEventListener('click',function(){show(idx+1)});
 lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('lb-st'))close()});
 document.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1)});
 var tx=null;lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});
 lb.addEventListener('touchend',function(e){if(tx===null)return;var d=e.changedTouches[0].clientX-tx;if(Math.abs(d)>50)show(idx+(d<0?1:-1));tx=null},{passive:true});
}

/* contact form -> messengers */
var form=$('#form');
if(form){
 var P='79268542333';
 function build(){
  var f=function(n){return (form.elements[n]&&form.elements[n].value||'').trim()};
  var l=['Здравствуйте! Хочу заказать фотосъёмку.'];
  if(f('name'))l.push('Имя: '+f('name'));
  if(f('tel'))l.push('Телефон: '+f('tel'));
  if(f('genre'))l.push('Съёмка: '+f('genre'));
  if(f('date'))l.push('Дата: '+f('date'));
  if(f('msg'))l.push('Комментарий: '+f('msg'));
  var t=l.join('\n'),e=encodeURIComponent(t);
  $('#sWa').href='https://wa.me/'+P+'?text='+e;
  $('#sTg').href='https://t.me/i_s_moscow?text='+e;
  window.__msg=t;
 }
 form.addEventListener('input',build);build();
 form.addEventListener('submit',function(e){e.preventDefault()});
 var mx=$('#sMx');if(mx)mx.addEventListener('click',function(){build();try{navigator.clipboard&&navigator.clipboard.writeText(window.__msg)}catch(_){}});
}
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a||!window.ym)return;var h=a.getAttribute('href'),g=h.indexOf('tel:')===0?'call':h.indexOf('wa.me')>-1?'whatsapp':h.indexOf('t.me')>-1?'telegram':h.indexOf('max.ru')>-1?'max':null;if(g)try{ym(113881875,'reachGoal',g)}catch(_){}},true);
$$('[data-copy]').forEach(function(b){b.addEventListener('click',function(){try{navigator.clipboard.writeText(b.dataset.copy);var t=b.textContent;b.textContent='Скопировано';setTimeout(function(){b.textContent=t},1600)}catch(_){}})});
})();
