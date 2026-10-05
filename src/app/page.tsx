import Image from "next/image";
import QuipuViewer from "@/components/3d/QuipuViewer";

const whatsappUrl = `https://wa.me/51943526621?text=${encodeURIComponent("Hola, Quipu Systems. Me gustaría conversar sobre un proyecto para mi empresa.")}`;

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const services = [
  { number: "01", title: "Quipu Software", description: "Aplicaciones a medida e integraciones que conectan tus herramientas con la forma de trabajar de tu equipo.", type: "software" },
  { number: "02", title: "Quipu Web & Presencia Digital", description: "Sitios web y canales digitales para presentar tu empresa y facilitar el contacto con tus clientes.", type: "web" },
  { number: "03", title: "Quipu Data & Analytics", description: "Datos organizados, indicadores claros y tableros que te ayudan a tomar decisiones con información.", type: "data" },
  { number: "04", title: "Quipu IA & Automatización", description: "Asistentes y flujos que simplifican tareas repetitivas, con inteligencia artificial donde aporta valor.", type: "intelligence" },
  { number: "05", title: "Quipu Cloud & Infraestructura", description: "Despliegue, operación y respaldo de los entornos que mantienen tus soluciones en funcionamiento.", type: "cloud" },
  { number: "06", title: "Quipu Ciberseguridad", description: "Protección de accesos, configuración segura y controles para cuidar la continuidad de tu operación.", type: "security" },
] as const;

const useCases = [
  { label: "OPERACIÓN CONECTADA", title: "Del campo a la oficina.", description: "Registra actividades desde una aplicación y conecta a tu equipo con la oficina, incluso con trabajo sin conexión cuando el proyecto lo requiere.", connection: ["Campo", "Sistema", "Oficina"] },
  { label: "DATOS CON SENTIDO", title: "De hojas sueltas a decisiones.", description: "Reúne tus hojas de cálculo y fuentes de datos en un tablero con indicadores claros para entender qué está pasando en tu negocio.", connection: ["Datos", "Indicadores", "Decisiones"] },
  { label: "AUTOMATIZACIÓN ÚTIL", title: "De tareas repetidas a tiempo libre.", description: "Extrae información de documentos y conecta aprobaciones y notificaciones en un flujo, con revisión humana donde hace falta.", connection: ["Documentos", "Flujo", "Revisión"] },
];

const steps = [
  { number: "01", title: "Entendemos tu proceso.", description: "Escuchamos a tu equipo y el resultado que necesita antes de elegir la tecnología." },
  { number: "02", title: "Acordamos los entregables.", description: "Definimos el alcance, las etapas y cómo comprobaremos que la solución funciona." },
  { number: "03", title: "Validamos contigo.", description: "Probamos la solución y acompañamos a tu equipo en su puesta en marcha según el alcance acordado." },
];

function ServiceIcon({ type }: { type: (typeof services)[number]["type"] }) {
  const paths = {
    software: <path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-12-2 14" />,
    web: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01m1 6 4 2-4 2" /></>,
    data: <><ellipse cx="12" cy="5" rx="7" ry="3" /><path d="M5 5v7c0 4 14 4 14 0V5M5 12v7c0 4 14 4 14 0v-7" /></>,
    intelligence: <path d="m13 2-9 12h7l-1 8 10-13h-8l1-7Z" />,
    cloud: <path d="M7 18a4 4 0 0 1-1-7.87A6 6 0 0 1 17.65 8.2 5 5 0 0 1 18 18H7Zm2-5 3-3 3 3m-3-3v11" />,
    security: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></>,
  };
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[type]}
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
          <a className="nav-vision" href="#servicios">Qué hacemos</a>
          <a className="nav-vision" href="#enfoque">Cómo trabajamos</a>
          <a className="contact-link" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Hablemos por WhatsApp (abre una nueva pestaña)">Hablemos <Arrow diagonal /></a>
        </nav>
      </header>
      <main id="contenido">
        <section className="hero container" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="launch-label"><span className="status-dot" /> NUESTRA NUEVA WEB ESTÁ EN CAMINO</div>
            <h1 id="hero-title">El futuro se<br />construye<br /><span>conectando.</span></h1>
            <p className="hero-description">Creamos software a medida, conectamos tus datos y automatizamos procesos con inteligencia artificial.</p>
            <p className="hero-invitation">Estamos preparando nuestra nueva web.<br />Mientras tanto, construyamos algo que le sirva a tu empresa.</p>
            <div className="hero-actions">
              <a className="primary-link" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Conversemos sobre tu proyecto por WhatsApp (abre una nueva pestaña)">Conversemos sobre tu proyecto <Arrow diagonal /></a>
              <a className="secondary-link" href="#servicios">Explora lo que hacemos <Arrow /></a>
            </div>
            <p className="meeting-note"><span className="status-dot" /> Primera reunión exploratoria gratuita.</p>
          </div>
          <div className="hero-visual">
            <div className="visual-grid" aria-hidden="true" />
            <QuipuViewer />
            <div className="visual-topline" aria-hidden="true"><span>QUIPU — CONEXIONES QUE TRANSFORMAN</span><span className="crosshair">+</span></div>
            <div className="visual-caption"><span className="caption-line" /><span>Todo empieza con una conexión.</span><span className="crosshair">+</span></div>
          </div>
          <div className="hero-baseline"><span>RAÍCES PROFUNDAS. VISIÓN HACIA ADELANTE.</span><a href="#servicios" aria-label="Explorar nuestras especialidades"><span>EXPLORA LO QUE HACEMOS</span><span className="scroll-arrow">↓</span></a></div>
        </section>
        <section className="vision container" id="servicios" aria-labelledby="services-title">
          <div className="vision-heading">
            <p className="eyebrow"><span className="small-cross">+</span> NUESTRAS ESPECIALIDADES</p>
            <h2 id="services-title">Las piezas correctas.<br /><span>Para lo que necesitas.</span></h2>
            <p>El quipu conectaba hilos para dar sentido a la información. Hoy conectamos seis especialidades para convertir tus necesidades en soluciones digitales.</p>
          </div>
          <div className="pillars">
            {services.map((service) => (
              <article className="pillar" key={service.number}>
                <div className="pillar-top"><ServiceIcon type={service.type} /><span>{service.number} /</span></div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="possibilities container" aria-labelledby="possibilities-title">
          <div className="vision-heading">
            <p className="eyebrow"><span className="small-cross">+</span> LO QUE PODEMOS CONECTAR</p>
            <h2 id="possibilities-title">Problemas cotidianos.<br /><span>Nuevas posibilidades.</span></h2>
            <p>La tecnología tiene sentido cuando mejora una parte concreta de tu trabajo. Estas son algunas de las conexiones que podemos construir.</p>
          </div>
          <div className="use-cases">
            {useCases.map((useCase) => (
              <article className="use-case" key={useCase.label}>
                <p className="case-label">{useCase.label}</p>
                <h3>{useCase.title}</h3>
                <p className="case-description">{useCase.description}</p>
                <div className="connection-flow" aria-hidden="true">
                  {useCase.connection.map((item, index) => (
                    <span key={item}>{index > 0 && <span className="flow-arrow">→</span>}{item}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="approach container" id="enfoque" aria-labelledby="approach-title">
          <div className="vision-heading">
            <p className="eyebrow"><span className="small-cross">+</span> NUESTRA FORMA DE TRABAJAR</p>
            <h2 id="approach-title">Primero, tu necesidad.<br /><span>Después, la tecnología.</span></h2>
            <p>Un responsable de proyecto coordina las especialidades y mantiene el contacto contigo, con entregables claros y validaciones durante el trabajo.</p>
          </div>
          <ol className="process-steps">
            {steps.map((step) => (
              <li key={step.number}>
                <span className="step-number" aria-hidden="true">{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.description}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="contact-section container" id="contacto" aria-labelledby="contact-title">
          <div className="contact-copy">
            <p className="eyebrow"><span className="status-dot" /> CONECTEMOS</p>
            <h2 id="contact-title">Tu próximo proyecto empieza<br /><span>con una conversación.</span></h2>
            <p>Cuéntanos qué quieres mejorar. La primera reunión exploratoria es gratuita y nos permite entender tu necesidad y definir el siguiente paso.</p>
          </div>
          <div className="contact-actions">
            <a className="primary-link" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp (abre una nueva pestaña)">Escríbenos por WhatsApp <Arrow diagonal /></a>
            <span className="contact-number">+51 943 526 621</span>
            <a className="email-link" href="mailto:contacto@quipusystems.dev">contacto@quipusystems.dev <Arrow diagonal /></a>
          </div>
          <div className="closing-note"><span className="status-dot" /><p>Nuestra nueva web está en construcción. Las buenas conexiones empiezan hoy.</p><span className="closing-tag">PRÓXIMAMENTE</span></div>
        </section>
      </main>
      <footer className="site-footer container">
        <p>© {new Date().getFullYear()} QUIPU SYSTEMS S.A.C.S.</p>
        <p className="footer-focus">Software · Datos · Inteligencia artificial</p>
        <a href="#contenido">Volver al inicio <span aria-hidden="true">↑</span></a>
      </footer>
    </div>
  );
}
