
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


// Back to top
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  const toggleBackToTop = () => {
    const visible = window.scrollY > 600;
    backToTop.classList.toggle('show', visible);
    backToTop.style.opacity = visible ? '1' : '0';
    backToTop.style.pointerEvents = visible ? 'auto' : 'none';
  };
  window.addEventListener('scroll', toggleBackToTop, {passive:true});
  toggleBackToTop();
  backToTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
}

// Enhanced project lightbox with navigation + swipe
const v52Lightbox = document.getElementById('project-lightbox');
if (v52Lightbox && !v52Lightbox.dataset.v52) {
  v52Lightbox.dataset.v52 = 'true';
  const lightboxImg = v52Lightbox.querySelector('img');
  const photos = [...document.querySelectorAll('.project-photo img')];
  let currentIndex = 0;
  let touchStartX = 0;

  if (photos.length) {
    const prev = document.createElement('button');
    prev.type='button'; prev.className='lightbox-nav lightbox-prev'; prev.setAttribute('aria-label','Previous image'); prev.textContent='‹';
    const next = document.createElement('button');
    next.type='button'; next.className='lightbox-nav lightbox-next'; next.setAttribute('aria-label','Next image'); next.textContent='›';
    const count = document.createElement('div');
    count.className='lightbox-count';
    v52Lightbox.append(prev,next,count);

    const show = index => {
      currentIndex = (index + photos.length) % photos.length;
      lightboxImg.src = photos[currentIndex].src;
      lightboxImg.alt = photos[currentIndex].alt || '';
      count.textContent = `${currentIndex + 1} / ${photos.length}`;
      v52Lightbox.classList.add('open');
      v52Lightbox.setAttribute('aria-hidden','false');
    };

    photos.forEach((img,index) => {
      img.closest('.project-photo')?.addEventListener('click', event => {
        event.preventDefault();
        event.stopImmediatePropagation();
        show(index);
      }, true);
    });

    prev.addEventListener('click', e => { e.stopPropagation(); show(currentIndex - 1); });
    next.addEventListener('click', e => { e.stopPropagation(); show(currentIndex + 1); });

    document.addEventListener('keydown', e => {
      if (!v52Lightbox.classList.contains('open')) return;
      if (e.key === 'ArrowLeft') show(currentIndex - 1);
      if (e.key === 'ArrowRight') show(currentIndex + 1);
    });

    v52Lightbox.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, {passive:true});

    v52Lightbox.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(dx) > 45) {
        show(dx > 0 ? currentIndex - 1 : currentIndex + 1);
      }
    }, {passive:true});
  }
}
