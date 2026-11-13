import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform, useSpring, useReducedMotion, useMotionValueEvent, useAnimationFrame, useInView, animate as animateElement } from 'framer-motion';
import { ArrowUpRight, ArrowDown, ArrowRight, Play, X, Menu, Mail, Phone, MapPin, Instagram, Youtube, Download, Pause, Search, Plus, Minus, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import archive from './data/projects.json';
import brands from './data/brands.json';
import './styles.css';

const MotionContext = createContext(true);
const EASE = [0.22, 1, 0.36, 1];
const categories = ['Semua', 'Website'];
const featured = archive.slice(0, 3);
const experiences = [];
const certificates = [];
const awards = [];

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const enabled = useContext(MotionContext);
  const Component = motion[as];
  return <Component className={className} initial={enabled ? { opacity: 0, y: 32 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.12 }} transition={{ duration: enabled ? 0.75 : 0, delay, ease: EASE }}>{children}</Component>;
}

function MediaImage({ src, alt, className = '', priority = false, ...props }) {
  const [state, setState] = useState('loading');
  const imgRef = useRef(null);
  useEffect(() => {
    const img = imgRef.current;
    // Cached images can finish before React attaches onLoad.
    setState(img?.complete ? (img.naturalWidth ? 'loaded' : 'error') : 'loading');
  }, [src]);
  return <span className={`media-image ${state} ${className}`}>
    {state === 'error' && <span className="image-fallback"><span className="display">R.</span><span>Pratinjau tidak tersedia</span></span>}
    <img ref={imgRef} src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} width="960" height="600" onLoad={() => setState('loaded')} onError={e => {
      if (e.currentTarget.src.includes('maxresdefault.jpg')) e.currentTarget.src = e.currentTarget.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
      else setState('error');
    }} {...props} />
  </span>;
}

function Magnetic({ children, className = '', ...props }) {
  const enabled = useContext(MotionContext);
  const x = useSpring(0, { stiffness: 220, damping: 20 });
  const y = useSpring(0, { stiffness: 220, damping: 20 });
  return <motion.a className={className} style={{ x, y }} onPointerMove={e => {
    if (!enabled || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.12); y.set((e.clientY - r.top - r.height / 2) * 0.2);
  }} onPointerLeave={() => { x.set(0); y.set(0); }} {...props}>{children}</motion.a>;
}

function Header({ enabled, onToggle }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main > section[id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);
  return <header className="site-header">
    <a className="wordmark" href="#home" aria-label="Faris, beranda">FARIS<span>®</span></a>
    <nav className="desktop-nav" aria-label="Navigasi utama">{[['portfolio', 'Karya'], ['capabilities', 'Layanan'], ['about', 'Tentang'], ['principles', 'Prinsip'], ['questions', 'FAQ'], ['contact', 'Kontak']].map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>)}</nav>
    <div className="header-actions"><button className="motion-toggle" onClick={onToggle} aria-label={enabled ? 'Jeda animasi' : 'Aktifkan animasi'} aria-pressed={!enabled}>{enabled ? <Pause size={13} /> : <Play size={13} />}<span>Motion {enabled ? 'on' : 'off'}</span></button><a className="header-contact" href="#contact">Let’s talk <ArrowUpRight size={16} /></a><button className="menu-toggle icon-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Tutup menu' : 'Buka menu'}>{open ? <X /> : <Menu />}</button></div>
    <AnimatePresence>{open && <motion.nav id="mobile-menu" className="mobile-menu" aria-label="Navigasi mobile" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>{[['home', 'Beranda'], ['portfolio', 'Karya'], ['capabilities', 'Layanan'], ['about', 'Tentang'], ['principles', 'Prinsip'], ['questions', 'FAQ'], ['contact', 'Kontak']].map(([id, label], i) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}><span>0{i + 1}</span>{label}<ArrowUpRight size={18} /></a>)}</motion.nav>}</AnimatePresence>
  </header>;
}

function Hero({ onProject }) {
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 85]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -55]);
  return <section id="home" className="hero" ref={ref}>
    <div className="hero-top"><span>FULL-STACK DEVELOPER<br/><span className="muted">WEB DEVELOPER</span></span><span className="availability"><i />AVAILABLE FOR COLLABORATION</span></div>
    <motion.div className="hero-title display" aria-hidden="true" style={enabled ? { y: titleY } : {}} initial={enabled ? { clipPath: 'inset(0 0 100% 0)' } : false} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 1.4, ease: EASE }}>PORTFOLIO</motion.div>
    <motion.div className="hero-portrait" style={enabled ? { y: portraitY, scale: portraitScale } : {}} initial={enabled ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.2 }}><img src="./Asset/img/hero-transparent.png" alt="Ilustrasi sosok berpakaian jas" width="1280" height="1280" fetchPriority="high" /></motion.div>
    <motion.div className="hero-intro" style={enabled ? { y: copyY } : {}} initial={enabled ? { opacity: 0, x: -35 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.35, ease: EASE }}>
      <p className="handwriting">Hello, I’m</p><h1 className="display">FARIS<span>.</span></h1><p className="hero-role">FULL-STACK<br />DEVELOPER</p><p className="hero-description">Membangun pengalaman digital.<br />Saya Faris, full-stack developer dari Yogyakarta.</p>
      <Magnetic href="#portfolio" className="primary-link">Lihat karya saya <ArrowDown size={17}/></Magnetic>
      <span className="hero-location"><MapPin size={12} /> YOGYAKARTA, INDONESIA</span>
    </motion.div>
    <motion.div className="hero-side" initial={enabled ? { opacity: 0, x: 30 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.55, ease: EASE }}>
      <div className="hero-manifesto"><span className="crosshair" aria-hidden="true">✳</span><p>Ideas into code.<br />Built for people.</p></div>
      <div className="hero-stats"><div><span className="display">—</span><p>PENGALAMAN<br/>BELUM DIISI</p></div><div><span className="display">—</span><p>PROYEK<br/>BELUM DIISI</p></div><div className="hero-award-stat"><span className="display">—</span><a href="#portfolio" aria-label="Lihat karya Faris">PENGHARGAAN BELUM DIISI<ArrowUpRight size={12}/></a></div><a href="#contact"><Download size={16}/><span>CV BELUM TERSEDIA</span></a></div>
    </motion.div>
    <div className="hero-bottom"><button className="reel-button" onClick={() => onProject(featured[0])}><span className="play-circle"><Play size={12} fill="currentColor" /></span>LIHAT PROYEK<span className="muted">PLACEHOLDER</span></button><span className="hero-scroll">SCROLL TO DISCOVER <ArrowDown size={13}/></span><span className="edition">SELECTED WORK / PLACEHOLDER</span></div>
  </section>;
}

function ProjectCard({ project, index, onOpen }) {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const video = ['youtube', 'drive'].includes(project.type);
  return <motion.article ref={ref} className="project-card" layout initial={enabled ? { opacity: 0, y: 32 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.08 }} transition={{ duration: enabled ? 0.6 : 0, delay: (index % 3) * 0.06, ease: EASE }} exit={{ opacity: 0, scale: 0.96 }}>
    <button className="project-open" onClick={() => onOpen(project)} aria-label={`Lihat ${project.title}`}><motion.div className="project-picture" style={enabled ? { y } : {}}><MediaImage src={project.image} alt={project.title}/></motion.div><span className="project-type">{project.type === 'render' ? '3D BREAKDOWN' : video ? 'FILM / VIDEO' : project.type === 'website' ? 'WEBSITE' : 'STILL / IMAGE'}</span><span className="project-hover">{video ? <Play fill="currentColor" size={18}/> : <ArrowUpRight size={22}/>}</span><span className="project-frame" aria-hidden="true" /></button>
    <button className="project-caption" onClick={() => onOpen(project)}><span className="project-number display">{String(index + 1).padStart(2, '0')}</span><span><h3>{project.title}</h3><span className="project-category">{project.category}{project.year ? ` / ${project.year}` : ''}</span></span><ArrowUpRight size={20}/></button>
  </motion.article>;
}

function BrandStrip() {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const loopWidth = useRef(0);
  const inView = useInView(ref);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    if (!ref.current || showAll) return;
    const update = () => { loopWidth.current = ref.current?.querySelector('.brand-set')?.getBoundingClientRect().width || 0; };
    const observer = new ResizeObserver(update);
    observer.observe(ref.current); update();
    return () => observer.disconnect();
  }, [showAll]);
  useAnimationFrame((time, delta) => {
    if (!enabled || paused || interacting || !inView || showAll || !ref.current || !loopWidth.current) return;
    const el = ref.current;
    el.scrollLeft += Math.min(delta, 40) * 0.038;
    if (el.scrollLeft >= loopWidth.current) el.scrollLeft -= loopWidth.current;
  });
  const move = direction => { setPaused(true); ref.current?.scrollBy({ left: direction * ref.current.clientWidth * .7, behavior: enabled ? 'smooth' : 'instant' }); };
  return <Reveal className="brand-section"><div className="brand-heading"><p>BEEN PART OF<br/><strong>THE BIGGER PICTURE.</strong></p><div><button className="brand-all" onClick={() => setShowAll(v => !v)} aria-expanded={showAll} aria-controls="brand-collection">{showAll ? 'TAMPILKAN DERET' : `LIHAT SEMUA (${brands.length})`}{showAll ? <Minus size={14}/> : <Plus size={14}/>}</button>{!showAll && <><button className="icon-button brand-pause" aria-label={paused ? 'Putar animasi logo' : 'Jeda animasi logo'} aria-pressed={paused} onClick={() => setPaused(v => !v)}>{paused ? <Play size={13}/> : <Pause size={13}/>}</button><button className="icon-button" onClick={() => move(-1)} aria-label="Logo sebelumnya"><ChevronLeft size={17}/></button><button className="icon-button" onClick={() => move(1)} aria-label="Logo selanjutnya"><ChevronRight size={17}/></button></>}</div></div><div id="brand-collection" className={showAll ? 'brand-full-grid' : 'brand-viewport'} ref={ref} onPointerEnter={e => { if(e.pointerType==='mouse') setInteracting(true); }} onPointerLeave={() => setInteracting(false)} onPointerDown={() => setPaused(true)} onFocusCapture={() => setInteracting(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setInteracting(false); }} tabIndex={showAll ? undefined : 0} role={showAll ? 'list' : 'region'} aria-label="Logo brand dan institusi, geser untuk melihat semuanya">
      {showAll ? brands.map(b => <div className="brand-logo" key={b.file} role="listitem"><img src={`./Asset/svg/brand/${b.file}`} alt={b.name} title={b.name} width="150" height="60" loading="lazy"/><span>{b.name}</span></div>) : <div className="brand-rail">{[0,1].map(copy => <div className="brand-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>{brands.map(b => <div className="brand-logo" key={b.file}><img src={`./Asset/svg/brand/${b.file}`} alt={copy ? '' : b.name} title={b.name} width="150" height="60" loading="lazy" draggable="false"/></div>)}</div>)}</div>}
    </div></Reveal>;
}

function Portfolio({ onProject }) {
  const [category, setCategory] = useState('Semua');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [limit, setLimit] = useState(9);
  const results = archive.filter(p => (category === 'Semua' || p.category === category) && `${p.title} ${p.category} ${p.role}`.toLowerCase().includes(query.toLowerCase()));
  const projects = expanded || category !== 'Semua' || query ? results.slice(0, limit) : featured;
  return <section id="portfolio" className="portfolio section-wrap">
    <Reveal className="section-heading"><div><span className="eyebrow">01 / SELECTED WORK</span><h2>KARYA YANG BICARA<span className="accent">.</span></h2></div><button className="text-link" onClick={() => { if (expanded) { setExpanded(false); setCategory('Semua'); setQuery(''); } else { setExpanded(true); setLimit(9); } }}>{expanded ? 'KARYA PILIHAN' : 'SEMUA KARYA'}<ArrowRight size={21}/></button></Reveal>
    <Reveal className="portfolio-toolbar">
      <div className="filters" role="group" aria-label="Kategori karya">
        {categories.map(c => <button key={c} className={category === c ? 'selected' : ''} aria-pressed={category === c} onClick={() => { setCategory(c); setExpanded(true); setLimit(9); }}>{c}{c === category && <motion.span className="filter-line" layoutId="filter-line"/>}</button>)}
      </div>
      <label className="search-box"><Search size={15}/><span>Cari</span><input aria-label="Cari karya" type="search" placeholder="Judul atau kategori…" value={query} onChange={e => { setQuery(e.target.value); setExpanded(true); setLimit(9); }}/></label>
    </Reveal>
    <motion.div className="project-grid" layout><AnimatePresence mode="popLayout">{projects.map((p, i) => <ProjectCard key={p.category + p.title + p.media} project={p} index={i} onOpen={onProject}/>)}</AnimatePresence></motion.div>
    {projects.length === 0 && <div className="empty-state"><p>Tidak ada karya untuk “{query}”.</p><button className="text-link" onClick={() => { setQuery(''); setCategory('Semua'); }}>Reset pencarian <X size={15}/></button></div>}
    {expanded && results.length > limit && <div className="load-more"><button className="outline-button" onClick={() => setLimit(v => v + 9)}>Tampilkan karya lainnya <Plus size={16}/></button><span>{projects.length} dari {results.length} karya</span></div>}
    
  </section>;
}

const processSteps = [
  ['01', 'THE IDEA', 'Mendengar ide dan memahami kebutuhan proyek.'],
  ['02', 'THE PLAN', 'Menentukan kebutuhan dan rencana pengerjaan.'],
  ['03', 'THE CRAFT', 'Membangun pengalaman digital dari rencana yang disepakati.'],
  ['04', 'THE POLISH', 'Meninjau dan menyempurnakan hasil pekerjaan.'],
  ['05', 'THE DELIVERY', 'Review bersama dan persiapan hasil akhir.'],
];
function Awards({onProject}) {
  const [expanded,setExpanded] = useState(false);
  const laurelPath = 'M48 94C8 68 9 30 35 5M22 61C8 60 3 49 3 44c12 0 19 6 19 17zm-5-19C5 35 6 23 8 19c11 5 13 14 9 23zm7-20C15 12 20 3 24 0c7 8 6 16 0 22zM31 79C17 79 8 70 7 64c13-2 22 4 24 15zm-3-18c-5-10-2-19 7-25 5 11 1 20-7 25zm10 24c-6-11-4-20 5-27 6 9 5 20-5 27z';
  return <section id="awards" className={`recognition section-wrap ${expanded ? 'awards-expanded' : ''}`}>
    <Reveal className="recognition-intro">
      <span className="eyebrow">RECOGNITION & AWARDS</span>
      <h2 className="display">THE WORK.<br/><span className="accent">THE RECOGNITION.</span></h2>
      <div className="award-total">
        <svg viewBox="0 0 60 100" aria-hidden="true"><path d={laurelPath} fill="currentColor"/></svg>
        <span className="display">—</span>
        <svg viewBox="0 0 60 100" aria-hidden="true"><g transform="translate(60 0) scale(-1 1)"><path d={laurelPath} fill="currentColor"/></g></svg>
        <span className="award-total-label">PENGHARGAAN BELUM DIISI</span>
      </div>
      <p>Cerita yang dibuat dengan sepenuh hati.<br/>Penghargaan yang jadi alasan untuk terus berkarya.</p>
      <button className="text-link award-proof" onClick={()=>onProject({...certificates[0],type:'image',media:certificates[0].image,category:'Award',description:'Juara 1 Movie Event, 2025.'})}>LIHAT SERTIFIKAT<ArrowUpRight size={18}/></button>
    </Reveal>
    <div className="recognition-list">
      <div className="recognition-list-head"><span>SELECTED RECOGNITION</span><span>2020 – 2025</span></div>
      <ol id="recognition-list">{awards.map((award,i)=><Reveal as="li" className={`recognition-row ${i>2?'additional-award':''}`} key={award.year} delay={i*.045}>
        <span className="award-index">0{i+1}</span>
        <div><h3>{award.title}</h3><p>{award.event}</p></div>
        <span className="award-year display">{award.year}</span>
      </Reveal>)}</ol>
      <button className="award-expand" aria-expanded={expanded} aria-controls="recognition-list" onClick={()=>setExpanded(v=>!v)}>{expanded?'Ringkas penghargaan':'Lihat penghargaan lainnya'}{expanded?<Minus size={16}/>:<Plus size={16}/>}</button>
    </div>
  </section>;
}
function Breakdown() {
  const scene = featured.find(p => p.type === 'render');
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const [manual, setManual] = useState(false);
  const [cut, setCut] = useState(65);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  useMotionValueEvent(scrollYProgress, 'change', v => { if (!manual && enabled) setCut(Math.round(90 - v * 80)); });
  const titleX = useTransform(scrollYProgress, [0, 1], [30, -30]);
  if (!scene) return null;
  const resize = url => url.replace('/upload/', '/upload/c_scale,w_1200,q_auto,f_auto/');
  return <section className="breakdown section-wrap" ref={ref} aria-labelledby="breakdown-title"><Reveal className="breakdown-copy"><span className="eyebrow">A LOOK UNDER THE SURFACE</span><motion.h2 id="breakdown-title" className="display" style={enabled ? { x: titleX } : {}}>FROM RAW.<br/><span className="accent">TO REAL.</span></motion.h2><p>Satu scene. Berlapis proses.<br/>Lihat bagaimana sebuah 3D environment berubah dari bentuk dasar menjadi dunia yang hidup.</p><span className="breakdown-credit">CYBERPUNK ENVIRONMENT / 2025<br/>3D ARTIST · LIGHTING · RENDERING</span></Reveal><Reveal className="comparison"><div className="comparison-stage" style={{'--cut': `${enabled || manual ? cut : 50}%`}}><MediaImage src={resize(scene.renders[0].solid)} alt="Cyberpunk environment sebelum material dan pencahayaan"/><div className="comparison-final"><MediaImage src={resize(scene.renders[0].final)} alt="Cyberpunk environment hasil render akhir"/></div><span className="comparison-label raw-label">SOLID VIEW</span><span className="comparison-label final-label">FINAL RENDER</span><div className="comparison-divider"><span><ChevronLeft size={14}/><ChevronRight size={14}/></span></div><input aria-label="Perbandingan sebelum dan sesudah render" aria-valuetext={`${cut}% solid, ${100-cut}% final render`} type="range" min="0" max="100" value={cut} onChange={e => { setManual(true); setCut(Number(e.target.value)); }}/></div><div className="comparison-caption"><span>GESER UNTUK MELIHAT PROSESNYA</span><span>DRAG / SCROLL</span></div></Reveal></section>;
}

function Capabilities() {
  const items = [
    ['01', 'FRONTEND', 'Tampilan yang terasa hidup.', 'Membangun antarmuka yang nyaman digunakan, responsif, dan memiliki perhatian pada detail interaksi.'],
    ['02', 'BACKEND', 'Fondasi di balik layar.', 'Merangkai bagian server dan alur data agar ide di layar memiliki dasar yang jelas.'],
    ['03', 'FULL-STACK', 'Dari ide sampai terhubung.', 'Menghubungkan tampilan dan logika menjadi pengalaman web yang utuh.'],
  ];
  return <section id="capabilities" className="capabilities section-wrap">
    <Reveal className="section-heading"><div><span className="eyebrow">02 / WHAT I DO</span><h2>IDE BESAR, DETAIL KECIL<span className="accent">.</span></h2></div><a className="text-link" href="#contact">MULAI PROYEK <ArrowUpRight size={18}/></a></Reveal>
    <div className="capabilities-grid">{items.map(([number, title, subtitle, text], i) => <Reveal className="capability-card" key={number} delay={i * .06}><span className="capability-number display">{number}</span><span className="capability-symbol" aria-hidden="true">✳</span><h3 className="display">{title}<span className="accent">.</span></h3><strong>{subtitle}</strong><p>{text}</p><span className="capability-foot">FARIS / DEVELOPMENT <ArrowUpRight size={16}/></span></Reveal>)}</div>
  </section>;
}

function Principles() {
  const items = [
    ['01', 'RASA ITU PENTING', 'Saya suka ketika sebuah website tidak hanya berfungsi, tetapi juga punya suasana dan karakter.'],
    ['02', 'DETAIL MEMBUAT BEDANYA', 'Gerakan, jarak, dan respons kecil membantu sebuah pengalaman terasa lebih utuh.'],
    ['03', 'TERUS DISEMPURNAKAN', 'Ide yang baik bisa menjadi lebih baik lewat percobaan, masukan, dan perbaikan.'],
  ];
  return <section id="principles" className="principles section-wrap">
    <Reveal className="principles-heading"><span className="eyebrow">04 / THE WAY I THINK</span><h2 className="display">CODE WITH<br/><span className="accent">CHARACTER.</span></h2><p>Logika yang rapi, visual yang punya rasa. Saya menikmati proses menemukan titik temu di antara keduanya.</p></Reveal>
    <div className="principles-list">{items.map(([number, title, text], i) => <Reveal className="principle" key={number} delay={i * .05}><span className="display">{number}</span><div><h3>{title}</h3><p>{text}</p></div><span className="principle-mark" aria-hidden="true">↗</span></Reveal>)}</div>
  </section>;
}

function Questions() {
  const items = [
    ['Apa yang bisa kita buat bersama?', 'Kita bisa mulai dari ide website atau aplikasi web, lalu membahas kebutuhan, fungsi, dan pengalaman yang ingin dibuat.'],
    ['Bagaimana kalau ide saya belum lengkap?', 'Tidak masalah. Ceritakan saja apa yang ingin Anda capai; detailnya bisa dibahas bersama.'],
    ['Bagaimana cara memulai percakapan?', 'Gunakan tombol WhatsApp atau isi brief singkat di bagian kontak. Pesannya akan terbuka sebagai draft sebelum Anda mengirimnya.'],
    ['Apakah proyek di halaman ini sudah final?', 'Belum. Gambar dan deskripsi proyek saat ini masih berupa placeholder dan akan diganti dengan karya asli.'],
  ];
  return <section id="questions" className="questions section-wrap">
    <Reveal className="questions-intro"><span className="eyebrow">05 / A LITTLE MORE INFO</span><h2 className="display">GOOD QUESTIONS<span className="accent">.</span><br/>BETTER IDEAS.</h2><p>Hal-hal kecil sebelum kita mulai membuat sesuatu bersama.</p></Reveal>
    <div className="questions-list">{items.map(([question, answer], i) => <Reveal className="question-item" key={question} delay={i * .04}><details><summary><span className="question-number">0{i + 1}</span><span>{question}</span><Plus size={18}/></summary><p>{answer}</p></details></Reveal>)}</div>
  </section>;
}

function About() {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 75%'] });
  return <section id="about" className="about section-wrap" ref={ref}>
    <Reveal className="about-lead"><div><span className="eyebrow">03 / ABOUT FARIS</span><h2 className="display">MEMBANGUN IDE.<br/>MENJADI <span className="accent">DIGITAL.</span></h2></div><p>Saya Faris, full-stack developer dari Yogyakarta.</p></Reveal>
    <div className="studio-grid">
      <Reveal className="education-panel"><h3 className="panel-heading">EDUCATION & SKILLS</h3><p className="eyebrow accent">PENDIDIKAN</p><div className="education-row"><strong>Belum diisi</strong><span></span><p>Pendidikan belum diisi.</p></div><div className="education-row"><strong>Pendidikan lainnya</strong><span></span><p>Belum diisi.</p></div><div className="education-row"><strong>Courses & Workshops</strong><p>Belum diisi.</p></div><p className="eyebrow accent skills-heading">CREATIVE TOOLKIT</p><div className="skill-tags">{['Full-stack Development'].map(s => <span key={s}>{s}</span>)}</div><div className="software-row">{[].map(([file, name]) => <img key={file} src={`./Asset/svg/${file}.svg`} alt={name} title={name} loading="lazy" width="28" height="28"/>)}</div></Reveal>
      <div className="process-panel"><Reveal><h3 className="panel-heading">FROM IDEA TO LAUNCH</h3></Reveal><div className="process-list"><div className="process-track"><motion.div style={{ scaleY: enabled ? scrollYProgress : 1 }}/></div>{processSteps.map(([num, title, text], i) => <Reveal key={num} className="process-row" delay={i * 0.035}><span className="process-num display">{num}</span><span className="process-node"/><div><h4>{title}</h4><p>{text}</p></div></Reveal>)}</div></div>
      <Reveal className="quote-panel"><span className="quote-mark display">“</span><blockquote>Dari ide<br/>dan kebutuhan,<br/><em>menjadi pengalaman<br/>digital.</em></blockquote><span className="handwriting">Faris</span><div className="quote-bottom">LET’S BUILD<br/>SOMETHING TOGETHER.<span className="quote-symbol" aria-hidden="true">✳</span></div></Reveal>
    </div>
  </section>;
}

function Journey({ onProject }) {
  const [open, setOpen] = useState(0);
  return <section id="experience" className="journey section-wrap">
    <Reveal className="section-heading"><div><span className="eyebrow">03 / THE JOURNEY</span><h2>TERUS BERGERAK. TERUS BERKARYA<span className="accent">.</span></h2></div><a className="text-link" href="./Asset/cv/Faris_Editor_VFX.pdf.pdf" download>RESUME<Download size={16}/></a></Reveal>
    <div className="journey-grid"><div className="experience-list">{experiences.map((job, i) => <Reveal className={`experience-row ${open === i ? 'is-open' : ''}`} key={job.title}><button aria-expanded={open === i} aria-controls={`job-${i}`} onClick={() => setOpen(open === i ? null : i)}><span className="experience-date">{job.date}</span><span><h3>{job.title}</h3><span className="experience-place">{job.place}</span></span>{open === i ? <Minus size={18}/> : <Plus size={18}/>}</button><AnimatePresence initial={false}>{open === i && <motion.div id={`job-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}><p>{job.text}</p></motion.div>}</AnimatePresence></Reveal>)}</div>
    <Reveal className="awards-panel"><p className="eyebrow">A FEW MILESTONES</p><h3 className="display">LITTLE WINS.<br/><span className="accent">BIG MEANING.</span></h3><div className="award-list">{certificates.map((cert, i) => <button key={cert.title} onClick={() => onProject({ ...cert, type: 'image', media: cert.image, category: 'Certificate', description: 'Sertifikat dan penghargaan dari arsip Faris.' })}><span>{String(i + 1).padStart(2, '0')}</span><span>{cert.title}<small>{cert.year}</small></span><ArrowUpRight size={19}/></button>)}</div></Reveal></div>
  </section>;
}

function Contact({ onProject }) {
  const [sent, setSent] = useState(false);
  const send = e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = `Halo Faris, saya ${data.get('name')}.\n\nJenis proyek: ${data.get('type')}\n${data.get('message')}`;
    window.open(`https://wa.me/6287827659025?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setSent(true);
  };
  return <section id="contact" className="contact section-wrap">
    <div className="contact-grid"><Reveal className="contact-intro"><span className="eyebrow">06 / YOUR NEXT STORY</span><h2 className="display">LET’S WORK<br/>TOGETHER<span className="accent">.</span></h2><p>Punya cerita yang ingin diwujudkan?<br/>Mari buat sesuatu yang layak ditonton.</p><Magnetic href="https://wa.me/6287827659025" target="_blank" rel="noopener noreferrer" className="contact-cta"><span className="round-arrow"><ArrowUpRight size={21}/></span>MULAI PERCAKAPAN</Magnetic></Reveal>
    <Reveal className="contact-links" delay={0.1}><a href="#contact"><Mail/><span><small>EMAIL</small>Belum diisi</span><ArrowUpRight size={16}/></a><a href="#contact" target="_blank" rel="noopener noreferrer"><Instagram/><span><small>INSTAGRAM</small>Belum diisi</span><ArrowUpRight size={16}/></a><a href="tel:+6287827659025"><Phone/><span><small>PHONE / WHATSAPP</small>+62 878-2765-9025</span><ArrowUpRight size={16}/></a><div><MapPin/><span><small>BASED IN</small>Yogyakarta, Indonesia</span></div></Reveal>
    <Reveal className="contact-reel" delay={0.2}><button onClick={() => onProject(featured[0])} aria-label="Putar placeholder proyek Faris"><div className="reel-screen"><span className="reel-screen-top">FARIS®<span>PROJECT / PLACEHOLDER</span></span><MediaImage src={featured[0]?.image} alt="placeholder proyek Faris"/><span className="reel-screen-title display">BUILD IT<br/><span>TOGETHER.</span></span><span className="play-circle"><Play size={18} fill="currentColor"/></span></div><span className="reel-caption">PROYEK AKAN DITAMBAHKAN.</span></button></Reveal></div>
    <Reveal><details className="project-brief"><summary>Ceritakan proyek Anda <Plus size={19}/></summary><form onSubmit={send}><label>Nama Anda<input name="name" required placeholder="Nama atau brand" autoComplete="name" maxLength="100"/></label><label>Jenis proyek<select name="type"><option>Web Development</option><option>Full-stack Development</option><option>Web Application</option><option>Website</option><option>Kolaborasi lainnya</option></select></label><label className="brief-message">Tentang proyek<textarea name="message" required rows="3" placeholder="Ceritakan ide, kebutuhan, dan perkiraan waktunya…" maxLength="3000"/></label><button className="solid-button" type="submit">Lanjut ke WhatsApp <ArrowUpRight size={18}/></button><p className="form-note" role="status">{sent ? 'Draft pesan siap di WhatsApp. Tekan Kirim di sana untuk memulai percakapan.' : 'Brief akan dibuka sebagai draft pesan di WhatsApp.'}</p></form></details></Reveal>
  </section>;
}

function ProjectDialog({ project, onClose }) {
  const ref = useRef(null);
  const [renderMode, setRenderMode] = useState('final');
  const [shot, setShot] = useState(0);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [retried, setRetried] = useState(0);
  const enabled = useContext(MotionContext);
  const activeShot = project.type === 'render' ? project.renders[shot] : null;
  const embedType = activeShot?.video ? 'youtube' : activeShot?.drive ? 'drive' : project.type;
  const embedMedia = activeShot?.video || activeShot?.drive?.match(/\/d\/([^/]+)/)?.[1] || project.media;
  const isVideo = ['youtube', 'drive'].includes(embedType);
  const availableModes = [['layout', 'Layout'], ['solid', 'Solid'], ['material', 'Material'], ['lighting', 'Lighting'], ['final', 'Final render']].filter(([mode]) => activeShot?.[mode] && !(mode === 'solid' && activeShot.hideSolidMode));
  const effectiveMode = activeShot?.[renderMode] ? renderMode : availableModes[0]?.[0];
  const rendered = activeShot?.[effectiveMode] || activeShot?.image || project.image;
  const sourceUrl = embedType === 'youtube' ? `https://www.youtube.com/watch?v=${embedMedia}` : embedType === 'drive' ? `https://drive.google.com/file/d/${embedMedia}/view` : project.type === 'render' ? rendered : project.media || project.image;
  const changeShot = next => { setMediaLoaded(false); setMediaFailed(false); setShot(next); };
  useEffect(() => {
    const previous = document.activeElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    const listener = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const nodes = [...ref.current.querySelectorAll('button, a[href], input, select, textarea, iframe')].filter(n => !n.disabled && n.getClientRects().length);
        const first = nodes[0]; const last = nodes.at(-1);
        if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', listener);
    return () => { document.body.style.overflow = old; window.removeEventListener('keydown', listener); previous?.focus(); };
  }, [onClose]);
  useEffect(() => {
    if (!isVideo) return;
    const timer = setTimeout(() => { if (!mediaLoaded) setMediaFailed(true); }, 14000);
    return () => clearTimeout(timer);
  }, [mediaLoaded, retried, isVideo, embedMedia]);
  return <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div ref={ref} className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabIndex="-1" initial={enabled ? { y: 45, scale: 0.97 } : false} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
      <div className="dialog-heading"><span className="eyebrow">{project.category} {project.year && ` / ${project.year}`}</span><button onClick={onClose} className="icon-button" aria-label="Tutup karya"><X/></button></div>
      <div className={`dialog-media ${!isVideo ? 'still' : ''}`}>
        {isVideo ? <>{!mediaLoaded && <div className="media-loading" role="status">{mediaFailed ? <><p>Preview belum bisa dimuat. Buka sumber aslinya untuk menonton.</p><button className="outline-button" onClick={() => { setMediaFailed(false); setMediaLoaded(false); setRetried(v => v + 1); }}>Coba lagi</button></> : <><span className={enabled ? 'loading-ring' : 'loading-ring paused'}/><p>Memuat film…</p></>}</div>}<iframe key={`${embedMedia}-${retried}`} src={embedType === 'youtube' ? `https://www.youtube-nocookie.com/embed/${embedMedia}?autoplay=1&rel=0` : `https://drive.google.com/file/d/${embedMedia}/preview`} title={project.title} width="1280" height="720" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen onLoad={() => { setMediaLoaded(true); setMediaFailed(false); }} onError={() => setMediaFailed(true)}/></> : <MediaImage src={rendered} alt={project.title} priority/>}
      </div>
      {project.type === 'render' && (availableModes.length > 0 || project.renders.length > 1) && <div className="render-controls"><div role="group" aria-label="Tahap render">{availableModes.map(([mode, label]) => <button key={mode} className={effectiveMode === mode ? 'selected' : ''} onClick={() => setRenderMode(mode)} aria-pressed={effectiveMode === mode}>{label}</button>)}</div>{project.renders.length > 1 && <div className="shot-controls"><button className="icon-button" aria-label="Shot sebelumnya" onClick={() => changeShot((shot - 1 + project.renders.length) % project.renders.length)}><ChevronLeft/></button><span>SHOT {shot + 1} / {project.renders.length}</span><button className="icon-button" aria-label="Shot selanjutnya" onClick={() => changeShot((shot + 1) % project.renders.length)}><ChevronRight/></button></div>}</div>}
      <div className="dialog-description"><div><h2 id="dialog-title">{project.title}</h2>{project.role && <span className="accent">{project.role}</span>}<p>{project.description}</p></div>{sourceUrl && <a className="outline-button" href={sourceUrl} target="_blank" rel="noopener noreferrer">{project.type === 'website' ? 'Kunjungi website' : 'Buka sumber asli'}<ExternalLink size={15}/></a>}</div>
      {isVideo && <p className="embed-note">Jika video dibatasi oleh pemiliknya, gunakan “Buka sumber asli”.</p>}
    </motion.div>
  </motion.div>;
}


function AssemblyPiece({ piece, scrollX, scrollY }) {
  const offsetX = useTransform(scrollX, value => piece.fixed ? 0 : piece.scrollX - value);
  const offsetY = useTransform(scrollY, value => piece.fixed ? 0 : piece.scrollY - value);
  return <motion.div className="assembly-layer" style={{ x: offsetX, y: offsetY }}>
    <motion.div className="assembly-frame" style={{ left: piece.left, top: piece.top }} initial={{ width: 3, height: 3, opacity: 0 }} animate={{ width: [3, 3, piece.width, piece.width, piece.width, piece.width], height: [3, 3, piece.height, piece.height, piece.height, piece.height], opacity: [0, 1, 1, 1, 1, 0] }} transition={{ duration: 1.55, times: [0, .08, .2, .28, .8, 1], ease: 'linear' }}><span className="assembly-corner top-left"/><span className="assembly-corner top-right"/><span className="assembly-corner bottom-left"/><span className="assembly-corner bottom-right"/><span className="assembly-measure">{Math.round(piece.width)} × {Math.round(piece.height)}</span><motion.span className="assembly-scan" initial={{ left: 0, opacity: 0 }} animate={{ left: [0, 0, piece.width, piece.width], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.55, times: [0, .28, .8, 1], ease: 'linear' }}/></motion.div>
    <motion.div className="assembly-cursor" initial={{ x: piece.left - 20, y: piece.top - 20, opacity: 0 }} animate={{ x: [piece.left - 20, piece.left, piece.left + piece.width, piece.left, piece.left + piece.width, piece.left + piece.width], y: [piece.top - 20, piece.top, piece.top + piece.height, piece.top + piece.height / 2, piece.top + piece.height / 2, piece.top + piece.height / 2], opacity: [0, 1, 1, 1, 1, 0] }} transition={{ duration: 1.55, times: [0, .08, .2, .28, .8, 1], ease: 'linear' }}><svg viewBox="0 0 20 24" width="20" height="24"><path d="M2 1 18 14l-7 1-3 7z" fill="currentColor" stroke="#090909" strokeWidth="1.5"/></svg><span>{piece.name}</span></motion.div>
  </motion.div>;
}

// Each cursor draws a measured grid before revealing the piece it is assembling.
function AssemblyCursors() {
  const enabled = useContext(MotionContext);
  const [pieces, setPieces] = useState([]);
  const { scrollX, scrollY } = useScroll();
  useEffect(() => {
    if (!enabled) { setPieces([]); return; }
    const names = ['Ari', 'Naya', 'Raka', 'Mika', 'Dara', 'Rafi', 'Luna', 'Bima', 'Sora', 'Tara', 'Niko', 'Kirana'];
    const selector = '.wordmark, .desktop-nav a, .header-actions > *, .hero-top > *, .hero-title, .hero-portrait img, .hero-intro > *, .hero-manifesto, .hero-stats > div, .hero-stats > a, .hero-bottom > *, .section-heading > *, .filters button, .search-box, .project-open, .project-caption, .about-lead > *, .panel-heading, .education-row, .skills-heading, .skill-tags > span, .process-row, .quote-panel > *, .contact-intro > *, .contact-links > *, .contact-reel, .project-brief, .capability-card > *, .principles-heading > *, .principle > *, .questions-intro > *, .question-item summary, .question-item p, .footer > *';
    const seen = new WeakSet();
    const observed = new WeakSet();
    const waiting = [];
    const hidden = new Map();
    const timers = new Set();
    const animations = new Set();
    let nextId = 0;
    let active = 0;
    const restore = element => {
      if (hidden.has(element)) { element.style.opacity = hidden.get(element); hidden.delete(element); }
    };
    const later = (fn, delay) => {
      const timer = window.setTimeout(() => { timers.delete(timer); fn(); }, delay);
      timers.add(timer);
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        const element = entry.target;
        seen.add(element);
        observer.unobserve(element);
        hidden.set(element, element.style.opacity);
        element.style.opacity = '0';
        waiting.push(element);
      });
    }, { rootMargin: '0px 0px -2% 0px', threshold: 0.03 });
    const register = () => document.querySelectorAll(selector).forEach(element => {
      if (!observed.has(element)) { observed.add(element); observer.observe(element); }
    });
    register();
    const mutations = new MutationObserver(register);
    const main = document.querySelector('main');
    if (main) mutations.observe(main, { childList: true, subtree: true });
    const pruneWaiting = () => {
      for (let i = waiting.length - 1; i >= 0; i--) {
        const element = waiting[i];
        const rect = element.getBoundingClientRect();
        if (!element.isConnected || rect.bottom < 0 || rect.top > window.innerHeight) {
          waiting.splice(i, 1); restore(element);
        }
      }
    };
    window.addEventListener('scroll', pruneWaiting, { passive: true });
    const tick = window.setInterval(() => {
      if (active >= 8 || !waiting.length) return;
      const element = waiting.shift();
      const rect = element.getBoundingClientRect();
      if (!element.isConnected || rect.bottom < 0 || rect.top > window.innerHeight || !rect.width || !rect.height) { restore(element); return; }
      const left = rect.left;
      const top = rect.top;
      const width = Math.max(4, rect.width);
      const height = Math.max(4, rect.height);
      const id = nextId++;
      active++;
      setPieces(current => [...current, { id, name: names[id % names.length], left, top, width, height, scrollX: window.scrollX, scrollY: window.scrollY, fixed: Boolean(element.closest('.site-header')) }]);
      later(() => {
        if (!element.isConnected) { restore(element); return; }
        const animation = animateElement(element, { opacity: [1, 1], clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'] }, { duration: .806, ease: 'linear' });
        animations.add(animation);
        later(() => { restore(element); animation.cancel(); animations.delete(animation); }, 815);
      }, 434);
      later(() => { setPieces(current => current.filter(piece => piece.id !== id)); active--; }, 1550);
    }, 70);
    return () => {
      observer.disconnect(); mutations.disconnect(); window.clearInterval(tick); window.removeEventListener('scroll', pruneWaiting);
      timers.forEach(window.clearTimeout); animations.forEach(animation => animation.cancel());
      hidden.forEach((opacity, element) => { element.style.opacity = opacity; });
      setPieces([]);
    };
  }, [enabled]);
  return <div className="assembly-cursors" aria-hidden="true">{pieces.map(piece => <AssemblyPiece key={piece.id} piece={piece} scrollX={scrollX} scrollY={scrollY}/>)}</div>;
}

function App() {
  const reduced = useReducedMotion();
  const [motionOn, setMotionOn] = useState(() => { try { return localStorage.getItem('renando-motion') !== 'off'; } catch { return true; } });
  const enabled = motionOn && !reduced;
  const [project, setProject] = useState(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, restDelta: 0.001 });
  useEffect(() => { document.documentElement.dataset.motion = enabled ? 'on' : 'off'; }, [enabled]);
  const toggle = () => { setMotionOn(!motionOn); try { localStorage.setItem('renando-motion', motionOn ? 'off' : 'on'); } catch {} };
  const close = React.useCallback(() => setProject(null), []);
  return <MotionContext.Provider value={enabled}>
    <MotionConfig reducedMotion={enabled ? 'user' : 'always'} transition={{ ease: EASE }}>
      <a className="skip-link" href="#portfolio">Lewati ke karya</a>
      <motion.div className="reading-progress" style={{ scaleX: enabled ? progress : scrollYProgress }}/>
      <AssemblyCursors/>
      <Header enabled={enabled} onToggle={toggle}/>
      <main>
        <Hero onProject={setProject}/>
        <Portfolio onProject={setProject}/>
        <Capabilities/>
        <About/>
        <Principles/>
        <Questions/>
        <Contact onProject={setProject}/>
      </main>
      <footer className="footer">
        <a className="wordmark" href="#home">FARIS<span>®</span></a>
        <span>© {new Date().getFullYear()} FARIS. FULL-STACK DEVELOPER.</span>
        <div>
          
          
          <a href="#home" aria-label="Kembali ke atas"><ArrowUpRight size={18}/></a>
        </div>
      </footer>
      <AnimatePresence>{project && <ProjectDialog key={project.title} project={project} onClose={close}/>}</AnimatePresence>
    </MotionConfig>
  </MotionContext.Provider>;
}

createRoot(document.getElementById('root')).render(<App/>);
