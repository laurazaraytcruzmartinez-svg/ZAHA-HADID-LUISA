import { useEffect, useRef, useState } from "react";
import { editorialPhotos, projectPhotos } from "./photos";

type Photo = { src: string; creditUrl: string; alt: string };
type ProjectKey = keyof typeof projectPhotos;
type Project = {
  key: ProjectKey;
  number: string;
  title: string;
  location: string;
  year: string;
  typology: string;
  description: string;
  feature: string;
  note?: string;
};

const projects: Project[] = [
  {
    key: "vitra",
    number: "01",
    title: "Vitra Fire Station",
    location: "Weil am Rhein, Alemania",
    year: "1993",
    typology: "Estación de bomberos",
    description:
      "Una pieza de hormigón que parece capturada en pleno desplazamiento. La estación transforma la urgencia en una composición espacial tensa y precisa.",
    feature:
      "Geometrías angulares, planos fragmentados y una marcada sensación de movimiento.",
  },
  {
    key: "maxxi",
    number: "02",
    title: "MAXXI — National Museum of 21st Century Arts",
    location: "Roma, Italia",
    year: "2009",
    typology: "Museo de arte contemporáneo",
    description:
      "Un museo pensado como una ciudad interior: recorridos que se cruzan, se separan y vuelven a encontrarse en una secuencia abierta.",
    feature:
      "Recorridos fluidos, líneas curvas y espacios interconectados.",
  },
  {
    key: "guangzhou",
    number: "03",
    title: "Guangzhou Opera House",
    location: "Guangzhou, China",
    year: "2010",
    typology: "Ópera y centro cultural",
    description:
      "Dos volúmenes erosionados parecen emerger del paisaje urbano como piedras modeladas por el agua y el tiempo.",
    feature:
      "Volúmenes inspirados en formaciones geológicas y una geometría escultórica.",
  },
  {
    key: "london",
    number: "04",
    title: "London Aquatics Centre",
    location: "Londres, Reino Unido",
    year: "2011",
    typology: "Centro acuático deportivo",
    description:
      "Una gran cubierta unifica piscinas, graderías y ciudad bajo una sola línea ondulante, suspendida sobre el parque olímpico.",
    feature: "Cubierta ondulante inspirada en el movimiento del agua.",
  },
  {
    key: "heydar",
    number: "05",
    title: "Heydar Aliyev Center",
    location: "Bakú, Azerbaiyán",
    year: "2012",
    typology: "Centro cultural",
    description:
      "El edificio se eleva desde la plaza y se pliega hacia el interior en una continuidad espacial sin interrupciones bruscas.",
    feature:
      "Superficies curvas continuas y ausencia de límites geométricos rígidos.",
  },
  {
    key: "galaxy",
    number: "06",
    title: "Galaxy SOHO",
    location: "Pekín, China",
    year: "2012",
    typology: "Complejo comercial y de oficinas",
    description:
      "Cuatro volúmenes redondeados se enlazan en altura y forman un paisaje urbano continuo, abierto a patios y pasarelas.",
    feature:
      "Cuatro volúmenes conectados mediante puentes y formas orgánicas.",
  },
  {
    key: "ddp",
    number: "07",
    title: "Dongdaemun Design Plaza (DDP)",
    location: "Seúl, Corea del Sur",
    year: "2014",
    typology: "Centro cultural y de diseño",
    description:
      "Una topografía construida, de superficies casi ininterrumpidas, convierte el espacio público en parte del edificio.",
    feature:
      "Envolvente metálica continua y superficies curvas de carácter futurista.",
  },
  {
    key: "wangjing",
    number: "08",
    title: "Wangjing SOHO",
    location: "Pekín, China",
    year: "2014",
    typology: "Complejo de oficinas y uso mixto",
    description:
      "Tres torres esbeltas se inclinan y giran con el viento; su silueta cambia a medida que se recorre la ciudad.",
    feature: "Tres torres escultóricas de formas fluidas y dinámicas.",
  },
  {
    key: "portHouse",
    number: "09",
    title: "Port House",
    location: "Amberes, Bélgica",
    year: "2016",
    typology: "Edificio administrativo",
    description:
      "Una ampliación facetada y elevada corona una antigua estación de bomberos, haciendo visible el encuentro entre dos épocas.",
    feature:
      "Estructura histórica restaurada bajo un volumen contemporáneo elevado de geometría facetada.",
  },
  {
    key: "alJanoub",
    number: "10",
    title: "Al Janoub Stadium",
    location: "Al Wakrah, Catar",
    year: "2019",
    typology: "Estadio deportivo",
    description:
      "Un estadio de líneas aerodinámicas cuya cubierta evoca las velas de las embarcaciones dhow de la costa catarí.",
    feature:
      "Cubierta inspirada en las embarcaciones tradicionales dhow y formas aerodinámicas.",
    note:
      "Completado en 2019, después del fallecimiento de Zaha Hadid, por Zaha Hadid Architects.",
  },
];

const photoFor = (project: Project, index = 0): Photo =>
  projectPhotos[project.key][index] as Photo;
const imageSrc = (photo: Photo) => photo.src.replace("/1600px-", "/1280px-");

export function Exhibition() {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [heroOffset, setHeroOffset] = useState(0);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openProject = (index: number) => {
    setGalleryIndex(0);
    setActiveProject(index);
  };

  const closeProject = () => setActiveProject(null);
  const moveProject = (direction: number) => {
    setActiveProject((current) => {
      if (current === null) return current;
      return (current + direction + projects.length) % projects.length;
    });
    setGalleryIndex(0);
  };

  useEffect(() => {
    const updateScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0);
      setHeroOffset(Math.min(window.scrollY * 0.11, 90));
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(
      ".zaha-exhibition .zh-reveal",
    );
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeProject === null) return;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeProject();
      if (event.key === "ArrowLeft") moveProject(-1);
      if (event.key === "ArrowRight") moveProject(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeProject]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const selected = activeProject === null ? null : projects[activeProject];
  const selectedPhotos = selected
    ? (projectPhotos[selected.key] as readonly Photo[])
    : [];
  const activePhoto = selectedPhotos[galleryIndex];
  const alternatePhotos = selectedPhotos.filter((_, index) => index !== galleryIndex);

  return (
    <main className="zaha-exhibition">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700;800&display=swap');
        .zaha-exhibition {
          --paper: #fff;
          --ink: #111;
          --soft: #eaeaea;
          --muted: #777;
          --line: #d8d8d8;
          --mono: 'DM Mono', 'Courier New', monospace;
          --sans: 'Manrope', 'Helvetica Neue', sans-serif;
          background: var(--paper);
          color: var(--ink);
          font-family: var(--sans);
          min-height: 100dvh;
          overflow: clip;
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
        }
        .zaha-exhibition * { box-sizing: border-box; }
        .zh-progress { position: fixed; inset: 0 auto auto 0; height: 2px; width: 100%; z-index: 90; pointer-events: none; }
        .zh-progress span { display: block; height: 100%; background: var(--ink); transition: width 90ms linear; }
        .zh-nav {
          position: fixed; z-index: 50; inset: 0 0 auto; height: 72px; padding: 0 5.2vw;
          display: flex; justify-content: space-between; align-items: center;
          color: var(--ink); mix-blend-mode: difference; color: white;
        }
        .zh-logo, .zh-nav button {
          font: 500 11px/1 var(--mono); letter-spacing: .07em; text-transform: uppercase;
          color: inherit; border: 0; background: transparent; padding: 10px 0; cursor: pointer;
          text-decoration: none;
        }
        .zh-logo { font-size: 12px; letter-spacing: .1em; }
        .zh-nav-links { display: flex; gap: clamp(20px, 3.2vw, 54px); align-items: center; }
        .zh-nav button { position: relative; }
        .zh-nav button::after { content: ''; position: absolute; left: 0; bottom: 5px; height: 1px; width: 100%; background: currentColor; transform: scaleX(0); transform-origin: right; transition: transform .28s ease; }
        .zh-nav button:hover::after, .zh-nav button:focus-visible::after { transform: scaleX(1); transform-origin: left; }
        .zh-hero { min-height: min(940px, 100svh); height: 850px; max-height: 1080px; position: relative; background: #777; color: white; isolation: isolate; }
        .zh-hero-image { position: absolute; inset: -3% 0 0; z-index: -2; background-size: cover; background-position: center 44%; will-change: transform; }
        .zh-hero::before { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(90deg, rgba(0,0,0,.38), transparent 72%), linear-gradient(0deg, rgba(0,0,0,.5), transparent 57%); }
        .zh-hero-copy { position: absolute; inset: auto 5.2vw 56px; }
        .zh-eyebrow, .zh-overline { font: 400 10px/1.5 var(--mono); letter-spacing: .12em; text-transform: uppercase; }
        .zh-hero h1 { font-size: clamp(4.6rem, 15.4vw, 15rem); line-height: .76; letter-spacing: -.105em; font-weight: 500; margin: 24px 0 24px -0.07em; }
        .zh-hero-subtitle { font: 400 clamp(11px, 1.05vw, 14px)/1.4 var(--mono); letter-spacing: .16em; margin: 0; }
        .zh-hero-bottom { margin-top: 58px; display: flex; justify-content: space-between; align-items: end; gap: 20px; }
        .zh-hero-intro { font-size: clamp(14px, 1.45vw, 19px); max-width: 410px; line-height: 1.5; margin: 0; }
        .zh-hero-meta { font: 10px/1.5 var(--mono); letter-spacing: .08em; text-transform: uppercase; white-space: nowrap; }
        .zh-scroll-cue { position: absolute; right: 5.2vw; top: 48%; writing-mode: vertical-rl; font: 10px/1 var(--mono); letter-spacing: .14em; display: flex; align-items: center; gap: 14px; }
        .zh-scroll-cue::after { content: ''; display: block; width: 1px; height: 54px; background: currentColor; transform-origin: top; animation: zh-pulse 1.8s ease-in-out infinite; }
        @keyframes zh-pulse { 0%,100% { transform: scaleY(.35); opacity: .45; } 50% { transform: scaleY(1); opacity: 1; } }
        .zh-intro { padding: 148px 10vw 150px; display: grid; grid-template-columns: 1fr 1.25fr; gap: 10vw; align-items: start; }
        .zh-intro .zh-overline { color: var(--muted); margin-top: 10px; }
        .zh-intro-copy { max-width: 670px; }
        .zh-intro-copy p { font-size: clamp(23px, 3vw, 42px); line-height: 1.28; letter-spacing: -.055em; margin: 0; }
        .zh-intro-copy p + p { color: var(--muted); margin-top: 28px; font-size: clamp(14px, 1.45vw, 18px); line-height: 1.7; letter-spacing: -.02em; max-width: 520px; }
        .zh-section-head { padding: 0 5.2vw 30px; display: flex; justify-content: space-between; align-items: end; border-bottom: 1px solid var(--line); margin: 0 5.2vw 54px; }
        .zh-section-head h2 { font-weight: 500; font-size: clamp(42px, 7.6vw, 106px); line-height: .9; letter-spacing: -.09em; margin: 0 0 0 -0.06em; }
        .zh-section-head p { font: 10px/1.6 var(--mono); color: var(--muted); text-transform: uppercase; letter-spacing: .07em; text-align: right; margin: 0 0 5px; }
        .zh-projects { padding-bottom: 148px; }
        .zh-project-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 94px 2.1vw; padding: 0 5.2vw; }
        .zh-project { border: 0; background: none; padding: 0; color: inherit; text-align: left; cursor: pointer; min-width: 0; }
        .zh-project:nth-child(6n + 1) { grid-column: 1 / span 7; }
        .zh-project:nth-child(6n + 2) { grid-column: 9 / span 4; margin-top: 145px; }
        .zh-project:nth-child(6n + 3) { grid-column: 2 / span 5; margin-top: -15px; }
        .zh-project:nth-child(6n + 4) { grid-column: 8 / span 5; margin-top: 130px; }
        .zh-project:nth-child(6n + 5) { grid-column: 1 / span 6; }
        .zh-project:nth-child(6n) { grid-column: 8 / span 5; margin-top: 105px; }
        .zh-project-image-wrap { position: relative; overflow: hidden; background: #e7e7e7; display: block; }
        .zh-project:nth-child(6n + 1) .zh-project-image-wrap { aspect-ratio: 1.27 / 1; }
        .zh-project:nth-child(6n + 2) .zh-project-image-wrap { aspect-ratio: .79 / 1; }
        .zh-project:nth-child(6n + 3) .zh-project-image-wrap { aspect-ratio: 1 / 1.17; }
        .zh-project:nth-child(6n + 4) .zh-project-image-wrap { aspect-ratio: 1.18 / 1; }
        .zh-project:nth-child(6n + 5) .zh-project-image-wrap { aspect-ratio: 1.18 / 1; }
        .zh-project:nth-child(6n) .zh-project-image-wrap { aspect-ratio: .95 / 1; }
        .zh-project-image-wrap img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .8s cubic-bezier(.2,.65,.25,1), opacity .5s ease; }
        .zh-project:hover .zh-project-image-wrap img, .zh-project:focus-visible .zh-project-image-wrap img { transform: scale(1.035); }
        .zh-project-image-wrap::after { content: 'VIEW PROJECT ↗'; position: absolute; inset: auto 14px 14px auto; background: var(--paper); color: var(--ink); padding: 10px 12px; font: 9px var(--mono); letter-spacing: .07em; opacity: 0; transform: translateY(5px); transition: opacity .25s ease, transform .25s ease; }
        .zh-project:hover .zh-project-image-wrap::after, .zh-project:focus-visible .zh-project-image-wrap::after { opacity: 1; transform: translateY(0); }
        .zh-project-caption { display: grid; grid-template-columns: 48px 1fr auto; gap: 13px; align-items: start; padding-top: 15px; }
        .zh-project-number { font: 11px var(--mono); color: var(--muted); padding-top: 4px; }
        .zh-project-title { font-size: clamp(16px, 1.65vw, 22px); font-weight: 500; line-height: 1.2; letter-spacing: -.045em; }
        .zh-project-place { font: 9px/1.6 var(--mono); color: var(--muted); text-align: right; text-transform: uppercase; letter-spacing: .04em; }
        .zh-project-desc { grid-column: 2 / 4; font-size: 12px; line-height: 1.55; color: var(--muted); max-width: 360px; margin-top: 2px; }
        .zh-index { background: #f5f5f5; padding: 125px 5.2vw 140px; }
        .zh-index-top { display: flex; justify-content: space-between; align-items: end; margin-bottom: 56px; }
        .zh-index h2, .zh-about h2 { margin: 0; font-size: clamp(48px, 8vw, 112px); line-height: .86; letter-spacing: -.095em; font-weight: 500; }
        .zh-index-top p { color: var(--muted); font: 10px/1.5 var(--mono); text-transform: uppercase; max-width: 180px; text-align: right; }
        .zh-index-list { border-top: 1px solid #cfcfcf; }
        .zh-index-row { width: 100%; display: grid; grid-template-columns: 60px 1.2fr 1fr 100px 30px; gap: 18px; align-items: center; text-align: left; padding: 21px 0; border: 0; border-bottom: 1px solid #cfcfcf; background: transparent; color: var(--ink); cursor: pointer; }
        .zh-index-row:hover .zh-index-title { transform: translateX(7px); }
        .zh-index-row > span { font: 10px/1.5 var(--mono); color: var(--muted); }
        .zh-index-number { color: var(--ink) !important; }
        .zh-index-title { font-size: clamp(15px, 1.8vw, 23px); letter-spacing: -.04em; transition: transform .3s ease; }
        .zh-index-arrow { text-align: right; font-size: 16px !important; color: var(--ink) !important; }
        .zh-about { padding: 145px 10vw 150px; display: grid; grid-template-columns: 1fr 1fr; gap: 8vw; }
        .zh-about h2 { font-size: clamp(46px, 6.8vw, 88px); max-width: 620px; }
        .zh-about-copy { padding-top: 6px; }
        .zh-about-copy .zh-overline { color: var(--muted); margin-bottom: 28px; }
        .zh-about-copy p { max-width: 530px; font-size: 15px; line-height: 1.75; color: #444; margin: 0 0 22px; }
        .zh-legacy { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid var(--line); margin-top: 50px; padding-top: 18px; gap: 20px; }
        .zh-legacy b { display: block; font: 17px var(--mono); margin-bottom: 10px; }
        .zh-legacy span { display: block; color: var(--muted); font: 10px/1.6 var(--mono); text-transform: uppercase; }
        .zh-closing { position: relative; height: min(760px, 75vw); min-height: 500px; background: #555; color: white; overflow: hidden; isolation: isolate; display: flex; flex-direction: column; justify-content: end; padding: 6vw 5.2vw; }
        .zh-closing-image { position: absolute; inset: 0; z-index: -2; background-size: cover; background-position: center 47%; }
        .zh-closing::after { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(0deg, rgba(0,0,0,.67), rgba(0,0,0,.04) 74%); }
        .zh-closing .zh-overline { opacity: .8; }
        .zh-closing h2 { max-width: 900px; font-size: clamp(45px, 9vw, 128px); font-weight: 500; letter-spacing: -.09em; line-height: .88; margin: 20px 0 22px -0.06em; }
        .zh-closing-copy { max-width: 550px; font-size: 14px; line-height: 1.7; margin: 0; }
        .zh-closing-signature { align-self: flex-end; font: 10px var(--mono); letter-spacing: .09em; margin-top: -27px; text-transform: uppercase; }
        .zh-footer { padding: 54px 5.2vw 36px; }
        .zh-footer-top { display: flex; align-items: start; justify-content: space-between; gap: 24px; padding-bottom: 54px; }
        .zh-footer-brand { font-size: 20px; letter-spacing: .05em; font-weight: 600; }
        .zh-footer-tagline { font-size: 12px; color: var(--muted); margin-top: 9px; }
        .zh-footer-link { color: var(--ink); font: 10px var(--mono); text-transform: uppercase; text-decoration: none; border-bottom: 1px solid var(--ink); padding-bottom: 5px; }
        .zh-credit-title { font: 10px var(--mono); text-transform: uppercase; color: var(--muted); margin-bottom: 13px; }
        .zh-credits { border-top: 1px solid var(--line); padding: 20px 0; display: grid; grid-template-columns: 90px 1fr; gap: 15px; }
        .zh-credits-name { font: 10px var(--mono); }
        .zh-credits-links { display: flex; flex-wrap: wrap; gap: 8px 16px; }
        .zh-credits-links a { font: 9px/1.6 var(--mono); color: var(--muted); text-decoration: underline; text-underline-offset: 3px; }
        .zh-footer-bottom { display: flex; justify-content: space-between; gap: 20px; padding-top: 23px; border-top: 1px solid var(--line); font: 9px var(--mono); text-transform: uppercase; color: var(--muted); }
        .zh-detail-backdrop { position: fixed; inset: 0; z-index: 100; background: rgba(17,17,17,.56); display: flex; justify-content: flex-end; }
        .zh-detail { position: relative; width: min(100%, 1180px); height: 100%; overflow-y: auto; background: var(--paper); color: var(--ink); animation: zh-panel-in .42s cubic-bezier(.2,.7,.2,1) both; overscroll-behavior: contain; }
        @keyframes zh-panel-in { from { transform: translateX(5%); opacity: .65; } to { transform: translateX(0); opacity: 1; } }
        .zh-detail-nav { position: sticky; top: 0; z-index: 5; height: 66px; background: rgba(255,255,255,.94); backdrop-filter: blur(12px); border-bottom: 1px solid var(--line); padding: 0 4.6vw; display: flex; justify-content: space-between; align-items: center; }
        .zh-detail-nav span { font: 10px var(--mono); color: var(--muted); text-transform: uppercase; }
        .zh-detail-nav button, .zh-detail-pager button { font: 10px var(--mono); letter-spacing: .05em; background: transparent; border: 0; padding: 10px 0; cursor: pointer; color: var(--ink); text-transform: uppercase; }
        .zh-detail-hero { padding: 65px 7vw 0; }
        .zh-detail-kicker { font: 10px var(--mono); color: var(--muted); letter-spacing: .1em; }
        .zh-detail h2 { font-size: clamp(42px, 8vw, 102px); line-height: .91; letter-spacing: -.085em; font-weight: 500; margin: 22px 0 26px -0.06em; max-width: 950px; }
        .zh-detail-meta { display: flex; flex-wrap: wrap; gap: 12px 30px; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 15px 0; }
        .zh-detail-meta span { font: 10px var(--mono); color: var(--muted); text-transform: uppercase; }
        .zh-detail-meta strong { color: var(--ink); font-weight: 400; }
        .zh-detail-intro { display: grid; grid-template-columns: .8fr 1.2fr; gap: 6vw; padding: 55px 7vw 60px; }
        .zh-detail-feature-label { font: 10px var(--mono); color: var(--muted); text-transform: uppercase; }
        .zh-detail-feature { font-size: clamp(19px, 2.25vw, 29px); line-height: 1.4; letter-spacing: -.04em; margin: 12px 0 0; }
        .zh-detail-description { font-size: 15px; line-height: 1.75; color: #444; margin: 0; }
        .zh-detail-note { font-size: 12px; line-height: 1.6; color: var(--muted); margin: 18px 0 0; }
        .zh-detail-gallery { padding: 0 4.6vw; display: grid; grid-template-columns: 1.45fr .8fr; grid-template-rows: minmax(230px, 44vw); gap: 10px; }
        .zh-detail-photo { min-width: 0; min-height: 0; position: relative; overflow: hidden; background: #e9e9e9; margin: 0; }
        .zh-detail-photo-main { height: 100%; }
        .zh-detail-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .zh-detail-photo a { position: absolute; right: 10px; bottom: 10px; padding: 8px 10px; background: rgba(255,255,255,.92); color: var(--ink); font: 8px var(--mono); text-decoration: none; text-transform: uppercase; }
        .zh-detail-thumbs { display: grid; grid-template-rows: 1fr 1fr; gap: 10px; min-height: 0; }
        .zh-detail-thumb { margin: 0; position: relative; min-height: 0; overflow: hidden; background: #e9e9e9; }
        .zh-detail-thumb button { width: 100%; height: 100%; min-height: 0; padding: 0; border: 0; position: relative; display: block; cursor: pointer; background: transparent; color: white; text-align: left; }
        .zh-detail-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .5s ease; }
        .zh-detail-thumb button:hover img { transform: scale(1.035); }
        .zh-detail-thumb button span { position: absolute; inset: auto 8px 8px; color: white; font: 8px var(--mono); text-transform: uppercase; text-shadow: 0 1px 5px rgba(0,0,0,.8); }
        .zh-detail-thumb a { position: absolute; right: 8px; top: 8px; background: rgba(255,255,255,.9); color: var(--ink); padding: 6px 7px; font: 8px var(--mono); text-decoration: none; }
        .zh-detail-pager { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); margin: 60px 4.6vw 36px; padding: 20px 0; }
        .zh-detail-pager button:hover, .zh-detail-nav button:hover { text-decoration: underline; text-underline-offset: 4px; }
        .zh-gallery-controls { display: none; }
        .zh-reveal { opacity: 0; transform: translateY(18px); transition: opacity .8s ease, transform .8s cubic-bezier(.2,.65,.25,1); }
        .zh-reveal.is-visible { opacity: 1; transform: translateY(0); }
        .zh-exhibition button:focus-visible, .zh-exhibition a:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }
        @media (max-width: 760px) {
          .zh-nav { height: 60px; padding: 0 20px; }
          .zh-logo { font-size: 10px; }
          .zh-nav-links { gap: 17px; }
          .zh-nav button { font-size: 9px; }
          .zh-hero { min-height: 760px; height: 100svh; max-height: 900px; }
          .zh-hero-image { background-position: 58% center; }
          .zh-hero-copy { inset: auto 20px 29px; }
          .zh-hero h1 { font-size: clamp(4.1rem, 19vw, 8rem); margin-top: 19px; }
          .zh-hero-subtitle { font-size: 9px; }
          .zh-hero-bottom { align-items: start; flex-direction: column; margin-top: 38px; gap: 23px; }
          .zh-hero-intro { font-size: 15px; max-width: 300px; }
          .zh-hero-meta { font-size: 9px; }
          .zh-scroll-cue { right: 21px; top: 33%; font-size: 8px; }
          .zh-intro { padding: 90px 22px 98px; display: block; }
          .zh-intro .zh-overline { margin: 0 0 34px; }
          .zh-intro-copy p { font-size: 27px; }
          .zh-intro-copy p + p { font-size: 14px; margin-top: 22px; }
          .zh-section-head { margin: 0 20px 34px; padding: 0 0 18px; }
          .zh-section-head h2 { font-size: 54px; }
          .zh-section-head p { font-size: 8px; }
          .zh-projects { padding-bottom: 90px; }
          .zh-project-grid { display: flex; flex-direction: column; gap: 48px; padding: 0 20px; }
          .zh-project:nth-child(n) { margin: 0; }
          .zh-project-image-wrap { aspect-ratio: 1.12 / 1 !important; }
          .zh-project:nth-child(2n) .zh-project-image-wrap { aspect-ratio: .88 / 1 !important; }
          .zh-project-caption { grid-template-columns: 34px 1fr auto; gap: 8px; padding-top: 12px; }
          .zh-project-title { font-size: 17px; }
          .zh-project-place { font-size: 8px; }
          .zh-project-desc { font-size: 11px; }
          .zh-index { padding: 88px 20px 94px; }
          .zh-index-top { display: block; margin-bottom: 35px; }
          .zh-index h2, .zh-about h2 { font-size: 66px; }
          .zh-index-top p { text-align: left; max-width: 220px; margin: 18px 0 0; }
          .zh-index-row { grid-template-columns: 33px 1fr 24px; gap: 8px; padding: 17px 0; }
          .zh-index-row > span:nth-child(3), .zh-index-row > span:nth-child(4) { display: none; }
          .zh-index-title { font-size: 15px; }
          .zh-about { padding: 94px 22px 95px; display: block; }
          .zh-about-copy { margin-top: 40px; }
          .zh-about-copy p { font-size: 14px; }
          .zh-legacy { gap: 8px; margin-top: 36px; }
          .zh-legacy b { font-size: 13px; }
          .zh-legacy span { font-size: 8px; }
          .zh-closing { min-height: 610px; height: 78svh; padding: 24px 21px; }
          .zh-closing-image { background-position: 60% center; }
          .zh-closing h2 { font-size: clamp(47px, 13vw, 82px); }
          .zh-closing-copy { font-size: 12px; max-width: 330px; }
          .zh-closing-signature { margin-top: 22px; align-self: start; font-size: 8px; }
          .zh-footer { padding: 38px 20px 26px; }
          .zh-footer-top { display: block; padding-bottom: 36px; }
          .zh-footer-link { display: inline-block; margin-top: 25px; }
          .zh-credits { grid-template-columns: 1fr; gap: 8px; padding: 15px 0; }
          .zh-credits-links { gap: 6px 12px; }
          .zh-footer-bottom { font-size: 8px; flex-wrap: wrap; }
          .zh-detail-backdrop { display: block; }
          .zh-detail { width: 100%; }
          .zh-detail-nav { height: 58px; padding: 0 20px; }
          .zh-detail-hero { padding: 55px 22px 0; }
          .zh-detail h2 { font-size: 48px; }
          .zh-detail-meta { gap: 10px 18px; }
          .zh-detail-meta span { font-size: 8px; }
          .zh-detail-intro { display: block; padding: 35px 22px 40px; }
          .zh-detail-feature { font-size: 22px; margin: 9px 0 30px; }
          .zh-detail-description { font-size: 13px; }
          .zh-detail-gallery { padding: 0 10px; grid-template-columns: 1fr; grid-template-rows: 66vw auto; gap: 7px; }
          .zh-detail-thumbs { grid-template-columns: 1fr 1fr; grid-template-rows: 36vw; gap: 7px; }
          .zh-detail-photo a { right: 6px; bottom: 6px; padding: 6px 7px; font-size: 7px; }
          .zh-detail-pager { margin: 36px 20px 24px; }
          .zh-detail-pager button { font-size: 8px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .zaha-exhibition *, .zaha-exhibition *::before, .zaha-exhibition *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
          .zh-reveal { opacity: 1; transform: none; }
        }
      `}</style>

      <div className="zh-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      <header className="zh-nav" aria-label="Navegación principal">
        <button className="zh-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Zaha Hadid
        </button>
        <nav className="zh-nav-links">
          <button onClick={() => scrollTo("works")}>Works</button>
          <button onClick={() => scrollTo("index")}>Index</button>
          <button onClick={() => scrollTo("about")}>About</button>
        </nav>
      </header>

      <section className="zh-hero" aria-labelledby="zh-title">
        <div
          className="zh-hero-image"
          role="img"
          aria-label={editorialPhotos.cover.alt}
          style={{
            backgroundImage: `url("${editorialPhotos.cover.src}")`,
            transform: `translateY(${heroOffset}px) scale(1.04)`,
          }}
        />
        <div className="zh-scroll-cue" aria-hidden="true">EXPLORE HER WORK</div>
        <div className="zh-hero-copy">
          <div className="zh-eyebrow">An architectural exhibition · 1950—2016</div>
          <h1 id="zh-title">ZAHA<br />HADID</h1>
          <p className="zh-hero-subtitle">THE ARCHITECTURE OF FLUIDITY</p>
          <div className="zh-hero-bottom">
            <p className="zh-hero-intro">
              Una nueva visión de la arquitectura a través del movimiento, la geometría y las formas orgánicas.
            </p>
            <span className="zh-hero-meta">1950 — 2016&nbsp; | &nbsp;Architect &amp; Visionary</span>
          </div>
        </div>
      </section>

      <section className="zh-intro zh-reveal" aria-label="Introducción">
        <span className="zh-overline">01 / Una arquitectura en movimiento</span>
        <div className="zh-intro-copy">
          <p>El espacio no es estático. Puede fluir, plegarse y abrir nuevas maneras de habitar.</p>
          <p>
            Esta exposición recorre diez obras que hicieron visible una nueva gramática arquitectónica: líneas que se desplazan, geometrías que se liberan y edificios que transforman su entorno.
          </p>
        </div>
      </section>

      <section className="zh-projects" id="works" aria-labelledby="works-heading">
        <div className="zh-section-head zh-reveal">
          <div>
            <span className="zh-overline">Archivo de obras / 1993—2019</span>
            <h2 id="works-heading">Selected<br />works</h2>
          </div>
          <p>10 proyectos<br />seleccionados<br />01 — 10</p>
        </div>
        <div className="zh-project-grid">
          {projects.map((project, index) => (
            <button
              className="zh-project zh-reveal"
              key={project.key}
              onClick={() => openProject(index)}
              aria-label={`Abrir proyecto ${project.number}: ${project.title}`}
            >
              <span className="zh-project-image-wrap">
                <img
                  src={imageSrc(photoFor(project))}
                  alt={photoFor(project).alt}
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className="zh-project-caption">
                <span className="zh-project-number">{project.number}</span>
                <span className="zh-project-title">{project.title}</span>
                <span className="zh-project-place">{project.year}<br />{project.location}</span>
                <span className="zh-project-desc">{project.typology} · {project.feature}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="zh-index" id="index" aria-labelledby="index-heading">
        <div className="zh-index-top zh-reveal">
          <div>
            <span className="zh-overline">Índice cronológico</span>
            <h2 id="index-heading">The index</h2>
          </div>
          <p>Diez proyectos, una práctica en constante transformación.</p>
        </div>
        <div className="zh-index-list">
          {projects.map((project, index) => (
            <button className="zh-index-row" key={project.key} onClick={() => openProject(index)}>
              <span className="zh-index-number">{project.number}</span>
              <span className="zh-index-title">{project.title}</span>
              <span>{project.location}</span>
              <span>{project.year}</span>
              <span className="zh-index-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </section>

      <section className="zh-about zh-reveal" id="about" aria-labelledby="about-heading">
        <div>
          <span className="zh-overline">02 / Sobre la arquitecta</span>
          <h2 id="about-heading">Una visión sin límites fijos.</h2>
        </div>
        <div className="zh-about-copy">
          <p>
            Zaha Hadid (Bagdad, 1950 — Miami, 2016) fue una arquitecta iraquí-británica que amplió las posibilidades de la arquitectura contemporánea. Sus dibujos y proyectos exploraron el movimiento, la geometría y formas orgánicas más allá de los límites convencionales.
          </p>
          <p>
            Primera mujer en recibir el Premio Pritzker, en 2004, su obra influyó profundamente en la arquitectura del siglo XXI. En este archivo, cada edificio muestra una forma distinta de llevar esa exploración al espacio construido.
          </p>
          <div className="zh-legacy" aria-label="Fechas clave">
            <div><b>1950</b><span>Nacimiento<br />Bagdad, Irak</span></div>
            <div><b>2004</b><span>Primera mujer<br />Premio Pritzker</span></div>
            <div><b>2016</b><span>Fallecimiento<br />Miami, Estados Unidos</span></div>
          </div>
        </div>
      </section>

      <section className="zh-closing" aria-labelledby="legacy-title">
        <div
          className="zh-closing-image"
          role="img"
          aria-label={editorialPhotos.closing.alt}
          style={{ backgroundImage: `url("${editorialPhotos.closing.src}")` }}
        />
        <span className="zh-overline">Un legado que sigue abriendo posibilidades</span>
        <h2 id="legacy-title">BEYOND THE LIMITS OF ARCHITECTURE</h2>
        <p className="zh-closing-copy">
          Su influencia permanece en una arquitectura contemporánea que se atreve a explorar geometrías no convencionales. Zaha Hadid transformó la manera de imaginar y construir el espacio, y dejó una de las huellas más influyentes del siglo XXI.
        </p>
        <span className="zh-closing-signature">ZAHA HADID (1950–2016)</span>
      </section>

      <footer className="zh-footer">
        <div className="zh-footer-top">
          <div>
            <div className="zh-footer-brand">ZAHA HADID</div>
            <div className="zh-footer-tagline">An exploration of architectural vision and form</div>
          </div>
          <a className="zh-footer-link" href="https://www.zaha-hadid.com/" target="_blank" rel="noreferrer">
            Zaha Hadid Architects ↗
          </a>
        </div>
        <div className="zh-credit-title">Fuentes fotográficas · Wikimedia Commons</div>
        {projects.map((project) => (
          <div className="zh-credits" key={`credit-${project.key}`}>
            <span className="zh-credits-name">{project.number} / {project.title}</span>
            <div className="zh-credits-links">
              {(projectPhotos[project.key] as readonly Photo[]).map((photo, photoIndex) => (
                <a
                  key={photo.creditUrl}
                  href={photo.creditUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Fuente de la fotografía ${photoIndex + 1} de ${project.title} en Wikimedia Commons`}
                >
                  Fotografía {photoIndex + 1} ↗
                </a>
              ))}
            </div>
          </div>
        ))}
        <div className="zh-credits">
          <span className="zh-credits-name">Portada / cierre</span>
          <div className="zh-credits-links">
            <a href={editorialPhotos.cover.creditUrl} target="_blank" rel="noreferrer">
              Fotografía de portada ↗
            </a>
            <a href={editorialPhotos.closing.creditUrl} target="_blank" rel="noreferrer">
              Fotografía de cierre ↗
            </a>
          </div>
        </div>
        <div className="zh-footer-bottom">
          <span>© Zaha Hadid — archivo editorial</span>
          <span>Créditos enlazados a cada fuente original</span>
          <span>1950 — 2016</span>
        </div>
      </footer>

      {selected && (
        <div className="zh-detail-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeProject();
        }}>
          <section
            className="zh-detail"
            role="dialog"
            aria-modal="true"
            aria-labelledby="zh-detail-title"
            aria-describedby="zh-detail-description"
          >
            <div className="zh-detail-nav">
              <span>Archivo / {selected.number} de 10</span>
              <button ref={closeButtonRef} onClick={closeProject} aria-label="Cerrar detalle y volver a la exposición">
                Cerrar ×
              </button>
            </div>
            <div className="zh-detail-hero">
              <span className="zh-detail-kicker">PROYECTO {selected.number} / {selected.year}</span>
              <h2 id="zh-detail-title">{selected.title}</h2>
              <div className="zh-detail-meta">
                <span><strong>Ubicación</strong> · {selected.location}</span>
                <span><strong>Tipología</strong> · {selected.typology}</span>
                <span><strong>Finalización</strong> · {selected.year}</span>
              </div>
            </div>
            <div className="zh-detail-intro">
              <div>
                <span className="zh-detail-feature-label">Rasgo arquitectónico</span>
                <p className="zh-detail-feature">{selected.feature}</p>
              </div>
              <div>
                <p className="zh-detail-description" id="zh-detail-description">{selected.description}</p>
                {selected.note && <p className="zh-detail-note">{selected.note}</p>}
              </div>
            </div>
            <div className="zh-detail-gallery" aria-label={`Galería de fotografías de ${selected.title}`}>
              {activePhoto && (
                <figure className="zh-detail-photo zh-detail-photo-main">
                  <img src={imageSrc(activePhoto)} alt={activePhoto.alt} loading="eager" decoding="async" />
                  <a href={activePhoto.creditUrl} target="_blank" rel="noreferrer">
                    Fuente fotografía {galleryIndex + 1} ↗
                  </a>
                </figure>
              )}
              <div className="zh-detail-thumbs" aria-label="Seleccionar fotografía">
                {alternatePhotos.map((photo) => {
                  const photoIndex = selectedPhotos.findIndex((item) => item.src === photo.src);
                  return (
                    <figure className="zh-detail-thumb" key={photo.src}>
                      <button
                        type="button"
                        onClick={() => setGalleryIndex(photoIndex)}
                        aria-label={`Mostrar fotografía ${photoIndex + 1}: ${photo.alt}`}
                        aria-pressed={galleryIndex === photoIndex}
                      >
                        <img src={imageSrc(photo)} alt="" loading="lazy" decoding="async" />
                        <span>0{photoIndex + 1} / Ver imagen</span>
                      </button>
                      <a href={photo.creditUrl} target="_blank" rel="noreferrer">
                        Fuente ↗
                      </a>
                    </figure>
                  );
                })}
              </div>
            </div>
            <div className="zh-detail-pager">
              <button onClick={() => moveProject(-1)}>← Obra anterior</button>
              <span className="zh-detail-kicker">{selected.number} / 10</span>
              <button onClick={() => moveProject(1)}>Siguiente obra →</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Exhibition;
