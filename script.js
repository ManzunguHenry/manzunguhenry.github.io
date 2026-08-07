
document.body.classList.add('page-ready');

const themeBtn=document.querySelector('[data-theme-toggle]');
if(themeBtn){
  const saved=localStorage.getItem('portfolio-theme');
  if(saved)document.documentElement.dataset.theme=saved;
  themeBtn.addEventListener('click',()=>{
    const next=document.documentElement.dataset.theme==='dark'?'light':'dark';
    document.documentElement.dataset.theme=next;
    localStorage.setItem('portfolio-theme',next);
  });
}
const menu=document.querySelector('.menu'),links=document.querySelector('.navlinks');
menu?.addEventListener('click',()=>links?.classList.toggle('open'));

window.addEventListener('scroll',()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  document.querySelector('.progress').style.width=(max>0?(scrollY/max)*100:0)+'%';
});

const rotate=document.getElementById('rotating-professional-title');
if(rotate){
  const items=['Civil Engineer','Contracts Manager','Project Manager','Infrastructure Delivery','Programme Leadership','Research & Innovation'];
  let i=0;
  setInterval(()=>{
    rotate.classList.add('out');
    setTimeout(()=>{i=(i+1)%items.length;rotate.textContent=items[i];rotate.classList.remove('out')},280);
  },2500);
}

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:.08});
document.querySelectorAll('.reveal, main>section:not(.hero):not(.page-hero):not(.project-hero-v5)').forEach(el=>{
  el.classList.add('motion-section');observer.observe(el);
});

document.querySelectorAll('[data-count]').forEach(el=>{
  let done=false;
  const o=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting&&!done){
      done=true;
      const target=+el.dataset.count,startVal=+(el.dataset.start||0),prefix=el.dataset.prefix||'',suffix=el.dataset.suffix||'';
      const start=performance.now(),dur=1300;
      const tick=now=>{
        const p=Math.min((now-start)/dur,1);
        el.textContent=prefix+Math.round(startVal+(target-startVal)*p)+suffix;
        if(p<1)requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  },{threshold:.6});o.observe(el);
});

if(window.L && document.getElementById('professional-map')){
  const map=L.map('professional-map',{scrollWheelZoom:false}).setView([-28.7,27.2],5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);
  (window.PORTFOLIO_MARKERS||[]).forEach(p=>{
    const marker=L.circleMarker([p.lat,p.lng],{radius:7,color:'#c9a227',weight:3,fillColor:'#071827',fillOpacity:1}).addTo(map);
    marker.bindPopup(`<strong>${p.title}</strong><br><a href="${p.url}">View Project →</a>`);
  });
}

const lb=document.getElementById('project-lightbox');
if(lb){
  const target=lb.querySelector('img');
  document.querySelectorAll('.project-photo').forEach(btn=>btn.addEventListener('click',()=>{
    target.src=btn.querySelector('img').src;lb.classList.add('open');lb.setAttribute('aria-hidden','false');
  }));
  const close=()=>{lb.classList.remove('open');target.src='';lb.setAttribute('aria-hidden','true')};
  lb.querySelector('.lightbox-close')?.addEventListener('click',close);
  lb.addEventListener('click',e=>{if(e.target===lb)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
}

document.querySelectorAll('a[href]').forEach(a=>{
  const h=a.getAttribute('href');
  if(!h||h.startsWith('#')||h.startsWith('mailto:')||h.startsWith('tel:')||a.target==='_blank'||/^https?:/i.test(h))return;
  a.addEventListener('click',e=>{
    if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    e.preventDefault();document.body.classList.add('page-leaving');setTimeout(()=>location.href=h,150);
  });
});
