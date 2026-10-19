document.documentElement.classList.add('js');

/* date-driven text: [data-phases] and [data-phases-href] switch on the dates given, so deadlines never look stale */
(function(){
  var now=Date.now();
  function pick(list){var out=null;list.forEach(function(p){if(Date.parse(p.from)<=now)out=p;});return out;}
  [].forEach.call(document.querySelectorAll('[data-phases]'),function(el){try{var p=pick(JSON.parse(el.getAttribute('data-phases')));if(p)el.innerHTML=p.html;}catch(e){}});
  [].forEach.call(document.querySelectorAll('[data-phases-href]'),function(el){try{var p=pick(JSON.parse(el.getAttribute('data-phases-href')));if(p){el.setAttribute('href',p.href);if(p.href.indexOf('mailto:')===0){el.removeAttribute('target');}}}catch(e){}});
})();

/* site motion: menu, nav state, Lahore clock, reveals, cursor, magnetic buttons, the live scene */
(function(){
  var root=document.documentElement,body=document.body;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine=window.matchMedia&&window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* full-screen menu */
  var mb=document.querySelector('.menu-btn'),menu=document.getElementById('menu');
  function setMenu(open){
    root.classList.toggle('menu-open',open);
    if(mb){mb.setAttribute('aria-expanded',open?'true':'false');var l=mb.querySelector('.menu-label');if(l)l.textContent=open?'Close':'Menu';}
    if(menu){if(open){menu.removeAttribute('inert');menu.setAttribute('aria-hidden','false');}else{menu.setAttribute('inert','');menu.setAttribute('aria-hidden','true');}}
    if(open&&menu){var f=menu.querySelector('a');if(f)setTimeout(function(){f.focus({preventScroll:true});},300);}
  }
  if(mb&&menu){
    setMenu(false);
    mb.addEventListener('click',function(){setMenu(!root.classList.contains('menu-open'));});
    menu.addEventListener('click',function(e){if(e.target.closest('a'))setMenu(false);});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&root.classList.contains('menu-open')){setMenu(false);mb.focus();}});
  }

  /* nav: solid after the first screen of scroll, hides while scrolling down */
  var nav=document.querySelector('.nav'),lastY=window.scrollY,ticking=false;
  function onScroll(){
    var y=window.scrollY;
    if(nav){nav.classList.toggle('scrolled',y>40);nav.classList.toggle('away',y>lastY&&y>480&&!root.classList.contains('menu-open'));}
    lastY=y;ticking=false;
  }
  window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll);}},{passive:true});
  onScroll();

  /* Lahore time (PKT, UTC+5) */
  var clock=document.querySelector('[data-clock]');
  function tick(){
    if(!clock)return;
    var d=new Date(Date.now()+5*3600000);
    var h=d.getUTCHours(),m=d.getUTCMinutes();
    clock.textContent=(h<10?'0':'')+h+':'+(m<10?'0':'')+m;
  }
  tick();setInterval(tick,15000);

  /* split headings into words for the mask reveal */
  [].forEach.call(document.querySelectorAll('[data-split]'),function(el){
    var i=0;
    (function walk(node){
      [].slice.call(node.childNodes).forEach(function(n){
        if(n.nodeType===3){
          var frag=document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function(part){
            if(!part)return;
            if(/^\s+$/.test(part)){frag.appendChild(document.createTextNode(part));return;}
            var w=document.createElement('span');w.className='w';
            var wi=document.createElement('span');wi.className='wi';wi.style.setProperty('--i',i++);wi.textContent=part;
            w.appendChild(wi);frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag,n);
        }else if(n.nodeType===1&&n.tagName!=='BR'){walk(n);}
      });
    })(el);
  });

  /* reveal on entry */
  var targets=document.querySelectorAll('[data-reveal],[data-split]');
  if('IntersectionObserver' in window&&!reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:0.08});
    [].forEach.call(targets,function(t){io.observe(t);});
  }else{[].forEach.call(targets,function(t){t.classList.add('in');});}

  /* cursor and magnetic buttons */
  if(fine&&!reduce){
    var c=document.createElement('div');c.className='cursor';c.setAttribute('aria-hidden','true');body.appendChild(c);
    var cx=-100,cy=-100,tx=-100,ty=-100,moving=false;
    function cloop(){cx+=(tx-cx)*0.22;cy+=(ty-cy)*0.22;c.style.transform='translate3d('+cx+'px,'+cy+'px,0)';
      if(Math.abs(tx-cx)+Math.abs(ty-cy)>0.3)requestAnimationFrame(cloop);else moving=false;}
    window.addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;c.classList.add('on');if(!moving){moving=true;requestAnimationFrame(cloop);}},{passive:true});
    document.addEventListener('mouseleave',function(){c.classList.remove('on');});
    document.addEventListener('pointerover',function(e){c.classList.toggle('big',!!e.target.closest('a,button,input,select,textarea,label'));});
    [].forEach.call(document.querySelectorAll('.btn'),function(b){
      b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();var x=(e.clientX-r.left-r.width/2)*0.18,y=(e.clientY-r.top-r.height/2)*0.3;b.style.transform='translate('+x+'px,'+y+'px)';});
      b.addEventListener('pointerleave',function(){b.style.transform='';});
    });
  }

  /* service peek: a picture follows the pointer over the service index */
  var peek=document.querySelector('.peek');
  if(peek&&fine){
    var px=0,py=0,qx=0,qy=0,on=false;
    [].forEach.call(document.querySelectorAll('[data-peek]'),function(li){
      li.addEventListener('pointerenter',function(){peek.style.backgroundImage='url('+li.getAttribute('data-peek')+')';peek.classList.add('on');if(!on){on=true;requestAnimationFrame(ploop);}});
      li.addEventListener('pointerleave',function(){peek.classList.remove('on');on=false;});
    });
    var ox=parseFloat(peek.getAttribute('data-ox'))||190;
    window.addEventListener('pointermove',function(e){qx=e.clientX+ox;qy=e.clientY;},{passive:true});
    function ploop(){px+=(qx-px)*0.14;py+=(qy-py)*0.14;peek.style.transform='translate3d('+(px)+'px,'+(py)+'px,0) translate(-50%,-50%)'+(peek.classList.contains('on')?'':' scale(.85)');
      if(on||Math.abs(qx-px)+Math.abs(qy-py)>0.5)requestAnimationFrame(ploop);}
  }

  /* MD reel moves sideways with the page */
  var reel=document.querySelector('.reel-track');
  if(reel&&!reduce){
    var sec=reel.closest('.reel');
    var move=function(){
      var r=sec.getBoundingClientRect(),vh=window.innerHeight;
      var p=Math.min(1,Math.max(0,(vh-r.top)/(vh+r.height)));
      var max=Math.max(0,reel.scrollWidth-sec.clientWidth+40);
      reel.style.transform='translate3d('+(-p*max)+'px,0,0)';
    };
    var rq=false;window.addEventListener('scroll',function(){if(!rq){rq=true;requestAnimationFrame(function(){rq=false;move();});}},{passive:true});move();
  }else if(reel){reel.parentNode.style.overflowX='auto';}

  /* the live scene */
  var stage=document.querySelector('canvas.stage, canvas.matter');
  var loader=document.querySelector('.loader');
  function done(){if(loader){loader.classList.add('done');setTimeout(function(){loader.remove();},1200);}
    var hero=document.querySelector('[data-intro]');if(hero)hero.classList.add('in');}
  if(loader){
    var bar=loader.querySelector('.loader-bar i'),v=0,target=0,t0=performance.now();
    (function count(){v+=(target-v)*0.1+0.35;if(v>target)v=target;if(bar)bar.style.transform='scaleX('+(v/100)+')';
      if(v<100||performance.now()-t0<1600)requestAnimationFrame(count);else setTimeout(done,260);})();
    target=72;setTimeout(function(){target=100;},2600);
  }
  if(stage&&window.BioMatter){
    var chapters=stage.classList.contains('stage')?document.querySelectorAll('[data-matter]'):null;
    window.BioMatter.mount(stage,{
      url:stage.getAttribute('data-src')||'assets/data/matter.bin',
      chapters:chapters,
      state:stage.getAttribute('data-matter'),
      config:{mx:parseFloat(stage.getAttribute('data-mx'))||0,my:parseFloat(stage.getAttribute('data-my'))||0,ms:parseFloat(stage.getAttribute('data-ms'))||1},
      onReady:function(){if(loader){target=100;}}
    });
  }else if(loader){target=100;}
})();

/* copy buttons */
(function(){
  function flash(el,msg){if(!el.dataset.label){el.dataset.label=el.textContent;}el.textContent=msg;clearTimeout(el._t);el._t=setTimeout(function(){el.textContent=el.dataset.label;},1800);}
  function copyText(t){return (navigator.clipboard&&navigator.clipboard.writeText)?navigator.clipboard.writeText(t):Promise.reject(new Error('no clipboard'));}
  window.copyText=copyText;
  document.addEventListener('click',function(e){
    var b=e.target.closest('[data-copy]');if(!b)return;var t=b.getAttribute('data-copy');
    copyText(t).then(function(){flash(b,'Copied');},function(){
      var v=b.parentElement.querySelector('.v');
      if(v){var r=document.createRange();r.selectNodeContents(v);var s=window.getSelection();s.removeAllRanges();s.addRange(r);flash(b,'Selected');}else{flash(b,t);}
    });
  });
})();

/* project brief (contact page): direct submit when a Web3Forms key is set, otherwise the visitor's email app; WhatsApp alongside */
(function(){
  var form=document.getElementById('brief');if(!form)return;
  var SIM=['Molecular docking','Molecular dynamics','DFT and quantum chemistry','Reviewer revision'];
  var st=document.getElementById('brief-status'),send=document.getElementById('send');
  function val(id){var el=document.getElementById(id);return el?el.value.trim():'';}
  function route(svc){return svc==='Training and consulting'?'trainings@bioinfoxlab.org':(SIM.indexOf(svc)>-1?'simulations@bioinfoxlab.org':'info@bioinfoxlab.org');}
  function brief(){var svc=val('f-service');return {to:route(svc),svc:svc,subject:'Project brief: '+svc,
    text:['Name: '+val('f-name'),'Email: '+val('f-email'),'WhatsApp/phone: '+(val('f-phone')||'not given'),'Service: '+svc,'Deadline: '+val('f-when'),'',val('f-msg')].join('\n')};}
  function update(){document.getElementById('to-addr').textContent=route(val('f-service'));}
  form.addEventListener('change',update);update();
  function check(){
    var bad=[];[['f-name','your name'],['f-email','your email'],['f-msg','the project details']].forEach(function(f){
      var el=document.getElementById(f[0]),ok=el.value.trim()&&(f[0]!=='f-email'||/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(el.value.trim()));
      el.setAttribute('aria-invalid',ok?'false':'true');if(!ok)bad.push(f[1]);});
    if(bad.length){st.className='status err';st.textContent='Please add '+bad.join(', ')+'.';var first=form.querySelector('[aria-invalid="true"]');if(first)first.focus();return false;}
    return true;
  }
  function viaEmail(b){window.location.href='mailto:'+b.to+'?subject='+encodeURIComponent(b.subject)+'&body='+encodeURIComponent(b.text);
    st.className='status ok';st.textContent='Your email app has opened with the brief, addressed to '+b.to+'. Press send there, or use WhatsApp.';}
  form.addEventListener('submit',function(e){
    e.preventDefault();if(!check())return;
    var b=brief(),key=form.getAttribute('data-web3forms-key');
    if(window.gtag)window.gtag('event','generate_lead',{method:'contact_form',service:b.svc});
    if(!key){viaEmail(b);return;}
    send.disabled=true;st.className='status';st.textContent='Sending your brief...';
    var fd=new FormData(form);fd.append('access_key',key);fd.append('subject',b.subject);fd.append('from_name','BioInfoX website');fd.append('replyto',val('f-email'));
    fetch('https://api.web3forms.com/submit',{method:'POST',body:fd,headers:{Accept:'application/json'}})
      .then(function(r){return r.json().then(function(j){return {ok:r.ok&&j.success,j:j};});})
      .then(function(res){if(res.ok){st.className='status ok';st.textContent='Thank you. Your brief has reached '+b.to+'; we will reply with the scope, timeline and quote. Send any structure files by email or WhatsApp.';form.reset();update();}else{viaEmail(b);}})
      .catch(function(){viaEmail(b);})
      .then(function(){send.disabled=false;});
  });
  document.getElementById('send-wa').addEventListener('click',function(){
    if(!check())return;var b=brief();
    if(window.gtag)window.gtag('event','generate_lead',{method:'whatsapp_form',service:b.svc});
    window.open('https://wa.me/923092529763?text='+encodeURIComponent('Hello BioInfoX, here is my project brief.\n\n'+b.text),'_blank','noopener');
  });
})();

/* publication search (founder page) */
(function(){
var q=document.getElementById('pub-q');if(!q)return;
  var items=[].slice.call(document.querySelectorAll('.pubs li'));
  var years=[].slice.call(document.querySelectorAll('.year'));
  var count=document.getElementById('pub-count'),none=document.getElementById('no-results'),total=items.length;
  items.forEach(function(li){li._txt=li.textContent.toLowerCase().replace(/\s+/g,' ');});
  q.addEventListener('input',function(){
    var terms=q.value.toLowerCase().trim().split(/\s+/).filter(Boolean),shown=0;
    items.forEach(function(li){var hit=terms.every(function(t){return li._txt.indexOf(t)>-1;});li.hidden=!hit;if(hit)shown++;});
    years.forEach(function(y){y.hidden=!y.querySelector('.pubs li:not([hidden])');});
    count.textContent=terms.length?('Showing '+shown+' of '+total):('Showing all '+total);
    none.hidden=shown>0;
  });

})();

/* contact: pre-select the service named in the link (from the services page) */
(function(){
  var sel=document.getElementById('f-service');if(!sel)return;
  var want=new URLSearchParams(location.search).get('service');if(!want)return;
  [].forEach.call(sel.options,function(o){if(o.text===want){sel.value=o.value;sel.dispatchEvent(new Event('change',{bubbles:true}));}});
})();

/* lead events for the site's Google Analytics tag: WhatsApp, email and phone clicks */
(function(){
  document.addEventListener('click',function(e){
    var a=e.target.closest('a[href]');if(!a||!window.gtag)return;
    var h=a.getAttribute('href')||'';
    if(h.indexOf('wa.me')>-1)window.gtag('event','whatsapp_lead_click',{link_url:h.split('?')[0],page_path:location.pathname});
    else if(h.indexOf('mailto:')===0)window.gtag('event','email_lead_click',{email:h.slice(7).split('?')[0],page_path:location.pathname});
    else if(h.indexOf('tel:')===0)window.gtag('event','phone_lead_click',{page_path:location.pathname});
  });
})();
