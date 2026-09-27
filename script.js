const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];

const progress=$('.progress');
const root=document.documentElement;
const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Scroll progress */
function updateProgress(){
  if(!progress) return;
  const h=root.scrollHeight-innerHeight;
  progress.style.width=(h>0?Math.min(100,scrollY/h*100):0)+'%';
}
addEventListener('scroll',updateProgress,{passive:true});
addEventListener('resize',updateProgress,{passive:true});
updateProgress();

/* Mobile navigation */
const menu=$('#menu'), nav=$('#nav');
function closeMenu(){
  if(!nav) return;
  nav.classList.remove('open');
  menu?.setAttribute('aria-expanded','false');
}
menu?.addEventListener('click',()=>{
  const open=nav?.classList.toggle('open');
  menu?.setAttribute('aria-expanded',String(!!open));
});
$$('#nav a').forEach(a=>a.addEventListener('click',closeMenu));
addEventListener('resize',()=>{if(innerWidth>720) closeMenu()});

/* Scroll reveal */
if(!prefersReduced){
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}
  }),{threshold:.12});
  $$('.reveal').forEach(x=>io.observe(x));
}else{
  $$('.reveal').forEach(x=>x.classList.add('visible'));
}

/* Typing headline */
const roles={
  en:['ICT Professional & Software Developer','Web Development & Database Administration','Security, CCTV & Communication Systems'],
  am:['የአይሲቲ ባለሙያ እና ሶፍትዌር ገንቢ','የዌብ ልማት እና ዳታቤዝ አስተዳደር','ደህንነት፣ CCTV እና የኮሙኒኬሽን ስርዓቶች']
};
let lang=localStorage.getItem('wgd-lang')||'en',ri=0,ci=0,back=false,typingTimer;
function typeLoop(){
  const el=$('#typing'); if(!el) return;
  const arr=roles[lang]||roles.en;
  const word=arr[ri%arr.length];
  el.textContent=word.slice(0,ci);
  if(!back){
    ci++;
    if(ci>word.length){back=true;typingTimer=setTimeout(typeLoop,1300);return}
  }else{
    ci--;
    if(ci===0){back=false;ri++}
  }
  typingTimer=setTimeout(typeLoop,back?45:70);
}
function applyLang(){
  root.lang=lang;
  $$('[data-en][data-am]').forEach(el=>{
    const value=el.dataset[lang] ?? el.dataset.en ?? '';
    if(value.includes('<')) el.innerHTML=value;
    else el.textContent=value;
  });
  const langBtn=$('#lang');
  if(langBtn){
    langBtn.textContent=lang==='en'?'አማ':'EN';
    langBtn.setAttribute('aria-label',lang==='en'?'Switch to Amharic':'Switch to English');
  }
  ri=0;ci=0;back=false;
  clearTimeout(typingTimer);typeLoop();
}
$('#lang')?.addEventListener('click',()=>{
  lang=lang==='en'?'am':'en';
  localStorage.setItem('wgd-lang',lang);
  applyLang();
});
applyLang();

/* Theme */
const theme=$('#theme');
function setTheme(dark){
  document.body.classList.toggle('darkmode',dark);
  if(theme){
    theme.innerHTML=`<svg class="icon"><use href="#${dark?'i-sun':'i-moon'}"/></svg>`;
    theme.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');
  }
  localStorage.setItem('wgd-theme',dark?'dark':'light');
}
const savedTheme=localStorage.getItem('wgd-theme');
setTheme(savedTheme?savedTheme==='dark':matchMedia('(prefers-color-scheme: dark)').matches);
theme?.addEventListener('click',()=>setTheme(!document.body.classList.contains('darkmode')));

/* Animated metrics */
$$('[data-count]').forEach(counter=>{
  const target=Number(counter.dataset.count)||0;
  const render=()=>{
    if(prefersReduced){counter.textContent=target+'+';return}
    let n=0;
    const step=()=>{
      n=Math.min(target,n+1);
      counter.textContent=n+'+';
      if(n<target) setTimeout(step,110);
    };
    step();
  };
  const cio=new IntersectionObserver(es=>{
    if(es[0].isIntersecting){render();cio.disconnect()}
  },{threshold:.6});
  cio.observe(counter);
});

/* Lightbox */
const box=$('#lightbox'), img=$('#lightbox-img');
$$('[data-lightbox]').forEach(el=>el.addEventListener('click',()=>{
  if(!box||!img) return;
  img.src=el.dataset.lightbox;
  img.alt=el.querySelector('img')?.alt||'Portfolio image';
  box.classList.add('open');
  document.body.style.overflow='hidden';
}));
function closeBox(){
  if(!box||!img) return;
  box.classList.remove('open');img.src='';document.body.style.overflow='';
}
$('#close')?.addEventListener('click',closeBox);
box?.addEventListener('click',e=>{if(e.target===box)closeBox()});
addEventListener('keydown',e=>{if(e.key==='Escape')closeBox()});

/* Active nav link */
const navLinks=$$('#nav a');
const sections=navLinks.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
if(sections.length){
  const navIo=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){
      const id='#'+e.target.id;
      navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')===id));
    }
  }),{rootMargin:'-40% 0px -50% 0px'});
  sections.forEach(s=>navIo.observe(s));
}

/* Project showcase slideshow */
const showcase=$('#showcase');
if(showcase){
  const track=$('#showcaseTrack',showcase);
  const slides=track?$$('.slide',track):[];
  const dotsWrap=$('#scDots',showcase);
  const prevBtn=$('#scPrev',showcase),nextBtn=$('#scNext',showcase),playBtn=$('#scPlay',showcase);
  const DURATION=6000;
  let idx=0,playing=true,timer=null;
  if(track&&slides.length&&dotsWrap){
    slides.forEach((_,i)=>{
      const b=document.createElement('button');
      b.type='button';b.setAttribute('aria-label',`Go to slide ${i+1}`);
      b.innerHTML='<span></span>';
      b.addEventListener('click',()=>{goTo(i);restart()});
      dotsWrap.appendChild(b);
    });
    const dots=$$('button',dotsWrap);
    function render(){
      track.style.transform=`translateX(-${idx*100}%)`;
      slides.forEach((s,i)=>s.classList.toggle('is-active',i===idx));
      dots.forEach((d,i)=>{
        d.classList.toggle('active',i===idx);
        d.style.setProperty('--sc-duration',DURATION+'ms');
      });
    }
    function goTo(i){idx=(i+slides.length)%slides.length;render()}
    function stop(){clearInterval(timer);timer=null}
    function start(){if(prefersReduced)return;stop();timer=setInterval(()=>goTo(idx+1),DURATION)}
    function restart(){playing?start():stop()}
    nextBtn?.addEventListener('click',()=>{goTo(idx+1);restart()});
    prevBtn?.addEventListener('click',()=>{goTo(idx-1);restart()});
    playBtn?.addEventListener('click',()=>{
      playing=!playing;
      playBtn.innerHTML=`<svg class="icon"><use href="#${playing?'i-pause':'i-play'}"/></svg>`;
      playBtn.setAttribute('aria-label',playing?'Pause slideshow':'Play slideshow');
      restart();
    });
    showcase.addEventListener('mouseenter',stop);
    showcase.addEventListener('mouseleave',restart);
    showcase.addEventListener('focusin',stop);
    showcase.addEventListener('focusout',restart);
    let sx=0;
    track.addEventListener('pointerdown',e=>{sx=e.clientX;stop()});
    track.addEventListener('pointerup',e=>{const dx=e.clientX-sx;if(Math.abs(dx)>40){dx<0?goTo(idx+1):goTo(idx-1)}restart()});
    render();start();
  }
}

/* Intro video */
const introVideo=$('#introVideo'),videoPlay=$('#videoPlay');
if(introVideo&&videoPlay){
  videoPlay.addEventListener('click',async()=>{
    try{await introVideo.play();videoPlay.classList.add('hidden');introVideo.setAttribute('controls','')}
    catch(_){videoPlay.querySelector('span')?.classList.add('video-error')}
  });
  introVideo.addEventListener('pause',()=>videoPlay.classList.remove('hidden'));
  introVideo.addEventListener('ended',()=>{videoPlay.classList.remove('hidden');introVideo.removeAttribute('controls')});
}

/* Colorful 3D card tilt — disabled on touch/reduced-motion */
if(!prefersReduced&&matchMedia('(hover:hover)').matches){
  $$('.skill,.service').forEach(card=>{
    card.style.transformStyle='preserve-3d';
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(700px) rotateX(${(-py*5).toFixed(2)}deg) rotateY(${(px*5).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform=''});
  });
}

/* Subtle particle field */
const field=$('#particles');
if(field&&!prefersReduced){
  const frag=document.createDocumentFragment();
  for(let i=0;i<26;i++){
    const p=document.createElement('span');
    p.style.cssText=`position:absolute;left:${Math.random()*100}%;top:${Math.random()*100}%;width:${1+Math.random()*2}px;height:${1+Math.random()*2}px;border-radius:50%;background:rgba(105,233,226,.45);animation:float ${7+Math.random()*10}s ease-in-out ${Math.random()*5}s infinite alternate`;
    frag.appendChild(p);
  }
  field.appendChild(frag);
  const st=document.createElement('style');
  st.textContent='@keyframes float{from{transform:translate3d(0,0,0);opacity:.2}to{transform:translate3d(18px,-24px,0);opacity:.8}}';
  document.head.appendChild(st);
}
