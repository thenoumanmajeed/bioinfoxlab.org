document.documentElement.classList.add('js');

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
    var cx=-100,cy=-100,tx=-100,ty=-100;
    window.addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;c.classList.add('on');},{passive:true});
    document.addEventListener('mouseleave',function(){c.classList.remove('on');});
    document.addEventListener('pointerover',function(e){c.classList.toggle('big',!!e.target.closest('a,button,input,select,textarea,label'));});
    (function loop(){cx+=(tx-cx)*0.22;cy+=(ty-cy)*0.22;c.style.transform='translate3d('+cx+'px,'+cy+'px,0)';requestAnimationFrame(loop);})();
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
      li.addEventListener('pointerenter',function(){peek.style.backgroundImage='url('+li.getAttribute('data-peek')+')';peek.classList.add('on');on=true;});
      li.addEventListener('pointerleave',function(){peek.classList.remove('on');on=false;});
    });
    window.addEventListener('pointermove',function(e){qx=e.clientX+190;qy=e.clientY;},{passive:true});
    (function loop(){px+=(qx-px)*0.14;py+=(qy-py)*0.14;peek.style.left=px+'px';peek.style.top=py+'px';requestAnimationFrame(loop);})();
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
    window.addEventListener('scroll',function(){requestAnimationFrame(move);},{passive:true});move();
  }else if(reel){reel.parentNode.style.overflowX='auto';}

  /* the live scene */
  var stage=document.querySelector('canvas.stage, canvas.matter');
  var loader=document.querySelector('.loader');
  function done(){if(loader){loader.classList.add('done');setTimeout(function(){loader.remove();},1200);}
    var hero=document.querySelector('[data-intro]');if(hero)hero.classList.add('in');}
  if(loader){
    var n=loader.querySelector('.loader-n'),v=0,target=0;
    (function count(){v+=(target-v)*0.12+0.4;if(v>target)v=target;if(n)n.textContent=String(Math.round(v)).padStart(3,'0');if(v<100)requestAnimationFrame(count);else setTimeout(done,180);})();
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

/* project brief composer (contact page) */
(function(){
var form=document.getElementById('brief');if(!form)return;
  var SIM=['Molecular docking','Molecular dynamics','DFT and quantum chemistry'];
  function val(id){var el=document.getElementById(id);return el?el.value.trim():'';}
  function compose(){
    var svc=val('f-service');
    var to=svc==='Training and consulting'?'trainings@bioinfoxlab.org':(SIM.indexOf(svc)>-1?'simulation@bioinfoxlab.org':'info@bioinfoxlab.org');
    var subject='Project enquiry: '+svc;
    var body=['Name: '+val('f-name'),'Email: '+val('f-email'),'Service: '+svc,'',val('f-msg')].join('\n');
    return {to:to,subject:subject,body:body};
  }
  function update(){var m=compose();document.getElementById('send').setAttribute('href','mailto:'+m.to+'?subject='+encodeURIComponent(m.subject)+'&body='+encodeURIComponent(m.body));document.getElementById('to-addr').textContent=m.to;}
  form.addEventListener('input',update);form.addEventListener('change',update);form.addEventListener('submit',function(e){e.preventDefault();});update();
  var st=document.getElementById('brief-status');
  document.getElementById('copy-brief').addEventListener('click',function(){
    var m=compose();copyText('To: '+m.to+'\nSubject: '+m.subject+'\n\n'+m.body).then(function(){st.textContent='Message copied. Paste it into an email to '+m.to+'.';},function(){var ta=document.getElementById('f-msg');ta.focus();ta.select();st.textContent='Copying is blocked here. Send your details to '+m.to+'.';});
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
