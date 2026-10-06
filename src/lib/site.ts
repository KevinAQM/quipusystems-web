export const site = {
  name: "Quipu Systems",
  url: "https://www.quipusystems.dev",
  title: "Quipu Systems | Software, datos e inteligencia artificial",
  description: "Software a medida, datos e inteligencia artificial para conectar y mejorar los procesos de tu empresa. Conversemos sobre tu proyecto. Primera reunión gratuita.",
  socialTitle: "Quipu Systems | El futuro se construye conectando",
  socialDescription: "Software a medida, datos e inteligencia artificial para tu empresa. Nuestra nueva web está en camino. Las buenas conexiones empiezan hoy.",
  email: "contacto@quipusystems.dev",
  phone: "+51943526621",
} as const;

export const whatsappUrl = `https://wa.me/${site.phone.slice(1)}?text=${encodeURIComponent("Hola, Quipu Systems. Me gustaría conversar sobre un proyecto para mi empresa.")}`;
