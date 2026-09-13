import Image from "next/image";
import QuipuViewer from "@/components/3d/QuipuViewer";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const pillars = [
  { number: "01", title: "Software con propósito", description: "Ideas que se convierten en herramientas. Sistemas diseñados para resolver lo que realmente importa.", type: "software" },
  { number: "02", title: "Datos que conectan", description: "Información que deja de estar aislada y se convierte en claridad para tomar mejores decisiones.", type: "data" },
  { number: "03", title: "Inteligencia que impulsa", description: "Automatización e IA para simplificar procesos y abrir espacio a lo que sigue.", type: "intelligence" },
];

function PillarIcon({ type }: { type: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {type === "software" ? <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-12-2 14" /> : type === "data" ? <><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v7c0 4 14 4 14 0V5M5 12v7c0 4 14 4 14 0v-7" /></> : <path d="m13 2-9 12h7l-1 8 10-13h-8l1-7Z" />}
    </svg>
  );
}

export default function Home() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="site-header container">
        <a className="brand" href="#" aria-label="Quipu Systems, inicio">
          <Image src="/logos/isotipo_quipu_nobg.png" width={40} height={40} alt="" className="brand-symbol" />
          <span>quipu<span className="brand-secondary">systems</span><span className="brand-dot">.</span></span>
        </a>
        <nav aria-label="Navegación principal">
          <a className="nav-vision" href="#vision">Nuestra visión</a>
          <a className="contact-link" href="mailto:contacto@quipusystems.dev">Hablemos <Arrow diagonal /></a>
        </nav>
      </header>
      <main id="contenido">
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="launch-label"><span className="status-dot" /> ALGO NUEVO ESTÁ TOMANDO FORMA</div>
            <h1 id="hero-title">El futuro se<br />construye<br /><span>conectando.</span></h1>
            <p className="hero-description">Software, datos e inteligencia artificial.<br className="desktop-break" /> Estamos conectando las piezas para transformar<br className="desktop-break" /> lo que tu organización puede hacer.</p>
            <div className="hero-actions">
              <a className="primary-link" href="#vision">Descubre lo que viene <Arrow /></a>
              <span className="coming-soon">PRÓXIMAMENTE</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-grid" aria-hidden="true" />
            <QuipuViewer />
            <div className="visual-topline" aria-hidden="true"><span>QUIPU — CONEXIONES QUE TRANSFORMAN</span><span className="crosshair">+</span></div>
            <div className="visual-caption"><span className="caption-line" /><span>Todo empieza con una conexión.</span><span className="crosshair">+</span></div>
          </div>
          <div className="hero-baseline"><span>RAÍCES PROFUNDAS. VISIÓN HACIA ADELANTE.</span><a href="#vision" aria-label="Explorar nuestra visión"><span>SCROLL PARA EXPLORAR</span><span className="scroll-arrow">↓</span></a></div>
        </section>
        <section className="vision container" id="vision" aria-labelledby="vision-title">
          <div className="vision-heading">
            <p className="eyebrow"><span className="small-cross">+</span> LO QUE NOS MUEVE</p>
            <h2 id="vision-title">Cada conexión abre<br /><span>una nueva posibilidad.</span></h2>
            <p>El quipu unía hilos para dar sentido a la información. Esa idea inspira lo que estamos construyendo hoy.</p>
          </div>
          <div className="pillars">
            {pillars.map((pillar) => (
              <article className="pillar" key={pillar.number}>
                <div className="pillar-top"><PillarIcon type={pillar.type} /><span>{pillar.number} /</span></div>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
          <div className="closing-note"><span className="status-dot" /><p>Estamos construyendo el siguiente capítulo de Quipu Systems.</p><span className="closing-tag">BUILDING WHAT’S NEXT</span></div>
        </section>
      </main>
      <footer className="site-footer container">
        <p>© {new Date().getFullYear()} Quipu Systems</p>
        <p className="footer-origin"><span className="origin-mark" aria-hidden="true">↗</span> Desde Perú. Con visión global.</p>
        <a href="mailto:contacto@quipusystems.dev">contacto@quipusystems.dev <Arrow diagonal /></a>
      </footer>
    </div>
  );
}
