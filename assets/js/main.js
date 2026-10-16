(function(){

  var mb=document.querySelector('.menu-btn'),nl=document.getElementById('nav-links');
  if(mb&&nl){
    mb.addEventListener('click',function(){var o=nl.classList.toggle('open');mb.setAttribute('aria-expanded',o?'true':'false');});
    nl.addEventListener('click',function(e){if(e.target.closest('a')){nl.classList.remove('open');mb.setAttribute('aria-expanded','false');}});
  }
  function flash(el,msg){if(!el.dataset.label){el.dataset.label=el.textContent;}el.textContent=msg;clearTimeout(el._t);el._t=setTimeout(function(){el.textContent=el.dataset.label;},1800);}
  function copyText(t){return (navigator.clipboard&&navigator.clipboard.writeText)?navigator.clipboard.writeText(t):Promise.reject(new Error('no clipboard'));}
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
