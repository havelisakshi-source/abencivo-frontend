// =============================
// EDIT YOUR COMPANY DETAILS HERE — RED & WHITE THEME
// =============================
export const COMPANY = {
  name: "Abencivo Biotech",
  tagline: "Quality Healthcare. Trusted Partnerships.",
  phone: "+91 7027008065",
  whatsapp: "917027008065",
  email: "abencivobiotech@gmail.com",
  address: "Opp. Ganpati Covent School, Chhachhrauli Road, Bilaspur, Distt.-Yamunanagar, Haryana (H.R)-135102",
  website: "https://example.com",
  logo: "/images/logo.svg",
  brochure: "/downloads/company-brochure.pdf",
  social: {
    instagram: "#",
    linkedin: "#",
    facebook: "#"
  }
};

// In production the same server serves both the site and the API, so a
// relative path always works. In local dev (vite dev server on a different
// port than the API), it falls back to localhost:4000. Override with
// VITE_API_BASE at build time if the API is ever hosted on a separate domain.
export const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.PROD ? "/api" : "http://localhost:4000/api");
