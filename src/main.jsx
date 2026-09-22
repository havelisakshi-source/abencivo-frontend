import React, {useEffect, useRef, useState} from "react";
import {createRoot} from "react-dom/client";
import {COMPANY, API_BASE} from "./config";
import {CERTIFICATIONS, MILESTONES, VALUES, TESTIMONIALS, CAPABILITIES, PROCESS_STEPS, FAQS, RESEARCH_STAGES, GMP_STAGES, NUMBER_STATS} from "./content";
import {DnaHelix, FloatingCapsules, CursorGlow, ParticleField, TiltCard, Magnetic, Counter, ResearchPipeline} from "./effects";
import "./styles.css";

/* ---------- Splash Screen ---------- */
function SplashScreen({onFinish}) {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => { setHide(true); setTimeout(onFinish, 600); }, 3000);
    return () => clearTimeout(timer);
  }, [onFinish]);
  return (
    <div className={`splashScreen ${hide ? "hide" : ""}`}>
      <div className="splashContainer">
        <img src="/images/logo.png" alt="Abencivo Biotech" className="splashLogo" />
      </div>
    </div>
  );
}

/* ---------- Scroll-reveal ---------- */
function useReveal(threshold = 0.15) {
  const ref = useRef(null); const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.unobserve(el); } }, {threshold});
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return [ref, visible];
}
function Reveal({children, delay = 0, className = "", as: Tag = "div", ...rest}) {
  const [ref, visible] = useReveal();
  return <Tag ref={ref} className={`reveal ${visible ? "in" : ""} ${className}`} style={{transitionDelay: `${delay}ms`}} {...rest}>{children}</Tag>;
}

/* ---------- API Status ---------- */
function useApiStatus() {
  const [status, setStatus] = useState("checking");
  useEffect(() => {
    let cancelled = false;
    fetch(API_BASE + "/health").then(r => { if (!cancelled) setStatus(r.ok ? "online" : "offline"); }).catch(() => { if (!cancelled) setStatus("offline"); });
    return () => { cancelled = true; };
  }, []);
  return status;
}
function ApiStatusBadge() {
  const status = useApiStatus();
  if (status === "checking") return null;
  return <span className={`apiStatus ${status}`}><i></i>{status === "online" ? "Live data connected" : "Demo preview — backend offline"}</span>;
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <button className={`toTop ${show ? "show" : ""}`} onClick={() => window.scrollTo({top: 0, behavior: "smooth"})} aria-label="Back to top">↑</button>;
}

/* ---------- Reusable Components ---------- */
function BadgeStrip({items = CERTIFICATIONS}) {
  return <Reveal className="badgeStrip">{items.map(b => <span className="badge" key={b}>{b}</span>)}</Reveal>;
}
function ProcessSteps({steps = PROCESS_STEPS}) {
  return <div className="processGrid">{steps.map((s, i) => (<Reveal delay={i * 100} className="processStep" key={s.t}><span className="processNum">{String(i + 1).padStart(2, "0")}</span><h3>{s.t}</h3><p>{s.d}</p></Reveal>))}</div>;
}
function Timeline({items = MILESTONES}) {
  return <div className="timeline">{items.map((m, i) => (<Reveal delay={i * 80} className="timelineItem" key={m.year}><span className="timelineYear">{m.year}</span><p>{m.text}</p></Reveal>))}</div>;
}
function FAQ({items = FAQS}) {
  const [open, setOpen] = useState(0);
  return <div className="faqList">{items.map((f, i) => (<Reveal delay={i * 60} className={`faqItem ${open === i ? "openFaq" : ""}`} key={f.q}><button className="faqQ" onClick={() => setOpen(open === i ? -1 : i)}><span>{f.q}</span><span className="faqIcon">{open === i ? "−" : "+"}</span></button>{open === i && <p className="faqA">{f.a}</p>}</Reveal>))}</div>;
}

/* ============================================================
   REAL PRODUCT CATALOGUE — from PRICE LIST ABENCIVO PDF
   ============================================================ */
const REAL_PRODUCTS = [
  {id:"t1", name:"ETOABN-TH", composition:"Etoricoxib 60mg + Thiocolchicoside 4mg", dosage_form:"Tablet", category:"Tablets", packing:"10x10 Alu-Alu", mrp:1850.00},
  {id:"t2", name:"ETOABN-120", composition:"Etoricoxib 120mg", dosage_form:"Tablet", category:"Tablets", packing:"10x10 Alu-Alu", mrp:1450.00},
  {id:"t3", name:"UROABN-300", composition:"Ursodeoxycholic acid 300mg", dosage_form:"Tablet", category:"Tablets", packing:"10x1x10 Alu", mrp:3500.00},
  {id:"t4", name:"ABC-500", composition:"Levofloxacin 500mg", dosage_form:"Tablet", category:"Tablets", packing:"10x10 Alu-Alu", mrp:840.00},
  {id:"t5", name:"ABCNET-FX", composition:"Montelukast 10mg + Fexofenadine 120mg", dosage_form:"Tablet", category:"Tablets", packing:"10x10 Alu-Alu", mrp:1500.00},
  {id:"t6", name:"ABNZID-600", composition:"Linezolid 600mg", dosage_form:"Tablet", category:"Tablets", packing:"10x1x10 Alu", mrp:3320.00},
  {id:"t7", name:"ABNCOLD-PLUS", composition:"Paracetamol 325mg + Levocetirizine 2.5mg", dosage_form:"Tablet", category:"Tablets", packing:"20x10 Blister", mrp:1600.00},
  {id:"t8", name:"ABNFER-XT", composition:"Ferrous Ascorbate 100mg + Folic Acid 1.5mg + Zinc", dosage_form:"Tablet", category:"Tablets", packing:"10x10", mrp:1100.00},
  {id:"t9", name:"ABQ10", composition:"Ubidecarenone (Coenzyme Q10) 300mg", dosage_form:"Tablet", category:"Tablets", packing:"10x1x10", mrp:7500.00},
  {id:"t10", name:"ABC", composition:"Cinnarizine 20mg + Domperidone 15mg", dosage_form:"Tablet", category:"Tablets", packing:"10x10 Alu-Alu", mrp:650.00},
  {id:"t11", name:"ABNPLEX-S", composition:"Silymarin 70mg + L-Ornithine", dosage_form:"Tablet", category:"Tablets", packing:"10x10 Alu-Alu", mrp:1680.00},
  {id:"t12", name:"ABC (Enzyme)", composition:"Trypsin-48 + Bromelain-90 + Rutoside-100 + Diclofenac", dosage_form:"Tablet", category:"Tablets", packing:"10x10 Alu-Alu", mrp:2120.00},
  {id:"t13", name:"ABNSVIT", composition:"Vitamin-C 500mg + Vitamin D3 1000 IU + Zinc Sulphate", dosage_form:"Tablet", category:"Tablets", packing:"10x10 Alu-Alu", mrp:950.00},
  {id:"t14", name:"ABNFINE-250", composition:"Terbinafine 250mg", dosage_form:"Tablet", category:"Tablets", packing:"10x1x7 Blister", mrp:1650.00},

  {id:"c1", name:"PENCIV-DSR", composition:"Pantoprazole 40mg + Domperidone 30mg", dosage_form:"Capsule", category:"Capsules", packing:"10x10 Alu-Alu", mrp:1200},
  {id:"c2", name:"REBCIV-DSR", composition:"Rabeprazole 20mg + Domperidone 30mg", dosage_form:"Capsule", category:"Capsules", packing:"10x10 Alu-Alu", mrp:1250},
  {id:"c3", name:"ABNRAB-LSR", composition:"Rabeprazole 20mg + Levosulpride 75mg", dosage_form:"Capsule", category:"Capsules", packing:"10x10 Alu-Alu", mrp:1450},
  {id:"c4", name:"ESOABN-DSR", composition:"Esomeprazole 40mg + Domperidone 30mg", dosage_form:"Capsule", category:"Capsules", packing:"10x10 Alu-Alu", mrp:1100},
  {id:"c5", name:"ABNMOX-250", composition:"Amoxycillin 250mg", dosage_form:"Capsule", category:"Capsules", packing:"10x10 Blister", mrp:550},
  {id:"c6", name:"ABNMOX-500", composition:"Amoxycillin 500mg", dosage_form:"Capsule", category:"Capsules", packing:"10x10 Blister", mrp:720},
  {id:"c7", name:"ABZOLE-D", composition:"Omeprazole 20mg + Domperidone 30mg", dosage_form:"Capsule", category:"Capsules", packing:"15x10 Strip", mrp:950},
  {id:"c8", name:"ABZOLE-20", composition:"Omeprazole 20mg", dosage_form:"Capsule", category:"Capsules", packing:"15x10 Strip", mrp:800},
  {id:"c9", name:"ABNSVIT-L", composition:"Lycopene + Multivitamin + Multimineral", dosage_form:"Capsule", category:"Capsules", packing:"10x10 Blister", mrp:145},
  {id:"c10", name:"ABNSVIT-G", composition:"Multivitamin + Multimineral + Antioxidant + Ginseng", dosage_form:"Capsule", category:"Capsules", packing:"10x10", mrp:145},
  {id:"c11", name:"ABNSVIT-5G", composition:"Omega-3 + Green Tea Extract + Ginseng", dosage_form:"Capsule", category:"Capsules", packing:"10x1x10 Blister", mrp:1990},
  {id:"c12", name:"ABNSVIT-9G", composition:"Ginseng + Grape Seed Extract + Green Tea", dosage_form:"Capsule", category:"Capsules", packing:"10x1x10 Blister", mrp:2800},
  {id:"c13", name:"ABNCAL-500", composition:"Calcitriol 0.25mcg + Calcium", dosage_form:"Capsule", category:"Capsules", packing:"10x1x15 Blister", mrp:1000},
  {id:"c14", name:"ABNCAL-K27", composition:"Calcitriol 0.25mcg + Calcium Carbonate 625mg", dosage_form:"Capsule", category:"Capsules", packing:"10x1x10 Blister", mrp:210},
  {id:"c15", name:"ABNCAL-K27 DS", composition:"Calcium Citrate Malate 1250mg + Cyanocobalamin", dosage_form:"Capsule", category:"Capsules", packing:"10x1x10 Blister", mrp:2400},
  {id:"c16", name:"ABNEURO-PLUS", composition:"Mecobalamin 1500mcg + Alpha Lipoic Acid", dosage_form:"Capsule", category:"Capsules", packing:"10x10 Alu-Alu", mrp:1580},
  {id:"c17", name:"ITRABEN-100", composition:"Itraconazole 100mg", dosage_form:"Capsule", category:"Capsules", packing:"10x10 Alu", mrp:1800},
  {id:"c18", name:"ITRABEN-200", composition:"Itraconazole 200mg", dosage_form:"Capsule", category:"Capsules", packing:"10x10 Alu", mrp:2400},
  {id:"c19", name:"ABNFER-XT", composition:"Ferrous Ascorbate 100mg", dosage_form:"Capsule", category:"Capsules", packing:"10x10", mrp:1350},
  {id:"c20", name:"ABNCAL-D3", composition:"Cholecalciferol", dosage_form:"Capsule", category:"Capsules", packing:"10x1x4 Alu-Alu", mrp:1150},
  {id:"c21", name:"ABNPLEX-LB", composition:"Vitamin B Complex + Lactobacillus", dosage_form:"Capsule", category:"Capsules", packing:"10x15 Blister", mrp:750},
  {id:"c22", name:"ABNPRO", composition:"Prebiotic & Probiotic", dosage_form:"Capsule", category:"Capsules", packing:"10x10 Alu-Alu", mrp:1100},

  {id:"d1", name:"ABNMOX-CV-457", composition:"Amoxycillin 400mg + Clavulanic Acid 57mg", dosage_form:"Dry Syrup", category:"Dry Syrup", packing:"30 ML", mrp:135},
  {id:"d2", name:"ABNMOX", composition:"Amoxycillin 200mg + Clavulanic Acid 28.5mg", dosage_form:"Dry Syrup", category:"Dry Syrup", packing:"30 ML", mrp:60.61},
  {id:"d3", name:"FIXOBEN-DS", composition:"Cefixime 100mg", dosage_form:"Dry Syrup", category:"Dry Syrup", packing:"30 ML", mrp:70},
  {id:"d4", name:"FIXOBEN-50", composition:"Cefixime 50mg", dosage_form:"Dry Syrup", category:"Dry Syrup", packing:"30 ML", mrp:48.72},
  {id:"d5", name:"FIXOBEN-50-LB", composition:"Cefixime 50mg + Lactobacillus", dosage_form:"Dry Syrup", category:"Dry Syrup", packing:"30 ML", mrp:75},
  {id:"d6", name:"FIXOBEN-O", composition:"Cefixime 50mg + Ofloxacin 125mg", dosage_form:"Dry Syrup", category:"Dry Syrup", packing:"30 ML", mrp:105},
  {id:"d7", name:"FIXOPOD-DS", composition:"Cefpodoxime 100mg", dosage_form:"Dry Syrup", category:"Dry Syrup", packing:"30 ML", mrp:112},
  {id:"d8", name:"FIXOPOD-50", composition:"Cefpodoxime 50mg", dosage_form:"Dry Syrup", category:"Dry Syrup", packing:"30 ML", mrp:85},
  {id:"d9", name:"FIXOPOD-CV", composition:"Cefpodoxime 50mg + Clavulanic Acid 28.5mg", dosage_form:"Dry Syrup", category:"Dry Syrup", packing:"30 ML", mrp:155},
  {id:"d10", name:"ABNZID", composition:"Linezolid 100mg", dosage_form:"Dry Syrup", category:"Dry Syrup", packing:"30 ML", mrp:145},

  {id:"dr1", name:"ABNSVIT-L", composition:"Multivitamin & Multimineral Drop", dosage_form:"Drops", category:"Drops", packing:"30 ML", mrp:55},
  {id:"dr2", name:"ABNZYME", composition:"Digestive Enzyme Drop", dosage_form:"Drops", category:"Drops", packing:"30 ML", mrp:55},
  {id:"dr3", name:"ABNTONE", composition:"Ondansetron 2mg", dosage_form:"Drops", category:"Drops", packing:"30 ML", mrp:60},
  {id:"dr4", name:"Vitamin D3", composition:"Vitamin D3 with Multivitamins", dosage_form:"Drops", category:"Drops", packing:"30 ML", mrp:110},

  {id:"o1", name:"ABNDAC-GEL", composition:"Diclofenac Gel", dosage_form:"Ointment", category:"Ointment", packing:"30 GM", mrp:95},
  {id:"o2", name:"ABNCON", composition:"Luliconazole 1% + Benzyl Alcohol 1%", dosage_form:"Ointment", category:"Ointment", packing:"20 GM", mrp:135},
  {id:"o3", name:"ABNCORT-K5", composition:"Clobetasol Propionate 0.05% + Neomycin Sulphate", dosage_form:"Ointment", category:"Ointment", packing:"15 GM", mrp:125},
  {id:"o4", name:"KETOABN", composition:"Ketoconazole 2%", dosage_form:"Ointment", category:"Ointment", packing:"15 GM", mrp:125},
  {id:"o5", name:"ITRABEN", composition:"Itraconazole 1% + Ofloxacin 0.75% + Ornidazole", dosage_form:"Ointment", category:"Ointment", packing:"15 GM", mrp:125},

  {id:"e1", name:"ABNCIVO-ORS", composition:"ORS Drink", dosage_form:"Energy Drink", category:"Energy Drink", packing:"200 ML", mrp:55},
  {id:"e2", name:"ABNCIVO POWDER", composition:"Energy Drink Powder", dosage_form:"Energy Drink", category:"Energy Drink", packing:"105 GM", mrp:70},

  {id:"h1", name:"ABNLIV-DS", composition:"Herbal Liver Tonic", dosage_form:"Herbal", category:"Herbal", packing:"225 ML", mrp:145},
  {id:"h2", name:"UROBEN", composition:"Herbal Uterine Tonic", dosage_form:"Herbal", category:"Herbal", packing:"200 ML", mrp:135},
  {id:"h3", name:"ABNPURE", composition:"Blood Purifier Tonic", dosage_form:"Herbal", category:"Herbal", packing:"200 ML", mrp:130},
  {id:"h4", name:"ALKABEN", composition:"Alkaliser", dosage_form:"Herbal", category:"Herbal", packing:"200 ML", mrp:150},
  {id:"h5", name:"ORTHOABN-OIL", composition:"Pain Killer Oil", dosage_form:"Herbal", category:"Herbal", packing:"60 ML", mrp:124},
  {id:"h6", name:"ABNCOF-H", composition:"Complete Ayurvedic Cough Syrup", dosage_form:"Herbal", category:"Herbal", packing:"100 ML", mrp:110},
  {id:"h7", name:"MINDSET", composition:"Complete Mind Health Solution", dosage_form:"Herbal", category:"Herbal", packing:"200 ML", mrp:195},
  {id:"h8", name:"ABNLIV-PLUS", composition:"Ayurvedic Liver Tonic with Enzymes", dosage_form:"Herbal", category:"Herbal", packing:"200 ML", mrp:135},
  {id:"h9", name:"ABNLIV", composition:"Liver Alkaliser Enzyme & Antacid", dosage_form:"Herbal", category:"Herbal", packing:"225 ML", mrp:180},
  {id:"h10", name:"ABNLIV-PLUS Caps", composition:"Liver & Enzyme Capsule", dosage_form:"Herbal", category:"Herbal", packing:"1 x 30 Bottle", mrp:390},
  {id:"h11", name:"PLETOABN-GROW", composition:"Carica Papaya Leaf + Neem + Tulsi + Giloy + Goat Milk", dosage_form:"Herbal", category:"Herbal", packing:"200 ML", mrp:185},

  {id:"l1", name:"ABNSVIT", composition:"Lycopene 6% + Multivitamin & Multimineral", dosage_form:"Liquid", category:"Liquid", packing:"100 ML", mrp:90},
  {id:"l2", name:"ABNSVIT-L", composition:"Lycopene 6% + Multivitamin & Multimineral", dosage_form:"Liquid", category:"Liquid", packing:"200 ML", mrp:145},
  {id:"l3", name:"ABNSVIT-PLUS", composition:"Lycopene 6% + Multivitamin", dosage_form:"Liquid", category:"Liquid", packing:"300 ML", mrp:195},
  {id:"l4", name:"ABNZYME", composition:"Ginseng + Ginkgo Biloba + Green Tea Extract", dosage_form:"Liquid", category:"Liquid", packing:"300 ML", mrp:225},
  {id:"l5", name:"ABNZYME", composition:"Fungal Diastase 50mg + Pepsin 10mg", dosage_form:"Liquid", category:"Liquid", packing:"100 ML", mrp:90},
  {id:"l6", name:"ABNZYME", composition:"Fungal Diastase 50mg + Pepsin 10mg", dosage_form:"Liquid", category:"Liquid", packing:"200 ML", mrp:150},
  {id:"l7", name:"ABNPLEX-L", composition:"B-Complex with L-Lysine", dosage_form:"Liquid", category:"Liquid", packing:"100 ML", mrp:90},
  {id:"l8", name:"ABNPLEX-L", composition:"B-Complex with L-Lysine", dosage_form:"Liquid", category:"Liquid", packing:"200 ML", mrp:160},
  {id:"l9", name:"ABNPLEX-S", composition:"Silymarin with B-Complex", dosage_form:"Liquid", category:"Liquid", packing:"200 ML", mrp:145},
  {id:"l10", name:"APPICIV-T", composition:"Cyproheptadine 2mg + Tricholine Citrate 275mg", dosage_form:"Liquid", category:"Liquid", packing:"200 ML", mrp:145},
  {id:"l11", name:"ABNFER-XT", composition:"Ferrous Ascorbate 30mg + Folic Acid 550mg", dosage_form:"Liquid", category:"Liquid", packing:"200 ML", mrp:180},
  {id:"l12", name:"ABNFER-XT", composition:"Ferrous Ascorbate 30mg + Folic Acid 550mg + Zinc 72mg", dosage_form:"Liquid", category:"Liquid", packing:"300 ML", mrp:210},
  {id:"l13", name:"ABNCAL-200", composition:"Calcium Carbonate 250mg", dosage_form:"Liquid", category:"Liquid", packing:"200 ML", mrp:150},
  {id:"l14", name:"SUCABN", composition:"Sucralfate 1000mg + Oxetacaine 20mg", dosage_form:"Liquid", category:"Liquid", packing:"200 ML", mrp:205},
  {id:"l15", name:"ABNCID-MPS", composition:"Magaldrate 400mg + Simethicone 60mg", dosage_form:"Liquid", category:"Liquid", packing:"170 ML", mrp:70},
  {id:"l16", name:"ABNTOSE", composition:"Lactulose Solution 10gm", dosage_form:"Liquid", category:"Liquid", packing:"100 ML", mrp:114},
  {id:"l17", name:"COFRIBS-AM", composition:"Terbutaline 1.25mg + Ambroxol 15mg + Guaiphenesin", dosage_form:"Liquid", category:"Liquid", packing:"60 ML", mrp:65},
  {id:"l18", name:"ABNCOF-AM", composition:"Terbutaline 1.25mg + Ambroxol 15mg + Guaiphenesin", dosage_form:"Liquid", category:"Liquid", packing:"100 ML", mrp:110},
  {id:"l19", name:"ABNCOF-DX", composition:"Dextromethorphan 10mg + Chlorpheniramine Maleate", dosage_form:"Liquid", category:"Liquid", packing:"60 ML", mrp:65},
  {id:"l20", name:"ABNCOF-DX", composition:"Dextromethorphan 10mg + Chlorpheniramine Maleate", dosage_form:"Liquid", category:"Liquid", packing:"100 ML", mrp:112},
  {id:"l21", name:"ABNCOF-LS", composition:"Levosalbutamol 1mg + Ambroxol 15mg + Guaiphenesin", dosage_form:"Liquid", category:"Liquid", packing:"60 ML", mrp:85},
  {id:"l22", name:"ABNCOF-LS", composition:"Levosalbutamol 1mg + Ambroxol 15mg + Guaiphenesin", dosage_form:"Liquid", category:"Liquid", packing:"100 ML", mrp:115},
  {id:"l23", name:"ABNCOF-BS", composition:"Bromhexine HCl 8mg + Terbutaline Sulphate 2.5mg", dosage_form:"Liquid", category:"Liquid", packing:"100 ML", mrp:75},
  {id:"l24", name:"ABNFLOX-MZS", composition:"Ofloxacin 50mg", dosage_form:"Liquid", category:"Liquid", packing:"60 ML", mrp:85},
  {id:"l25", name:"ABNVACE-P", composition:"Aceclofenac 50mg + Paracetamol 125mg", dosage_form:"Liquid", category:"Liquid", packing:"60 ML", mrp:60},
  {id:"l26", name:"ABNMEF-P", composition:"Mefenamic Acid 50mg + Paracetamol 125mg", dosage_form:"Liquid", category:"Liquid", packing:"60 ML", mrp:70},
  {id:"l27", name:"ABNMEF-PLUS", composition:"Mefenamic Acid 100mg", dosage_form:"Liquid", category:"Liquid", packing:"60 ML", mrp:85},
  {id:"l28", name:"ABNCET-M", composition:"Levocetirizine 2.5mg + Montelukast 4mg", dosage_form:"Liquid", category:"Liquid", packing:"60 ML", mrp:80},
  {id:"l29", name:"ABNCOLD", composition:"Paracetamol 125mg + Chlorpheniramine 0.50mg", dosage_form:"Liquid", category:"Liquid", packing:"60 ML", mrp:52},
  {id:"l30", name:"ABNCOLD-PLUS", composition:"Paracetamol 250mg + Phenylephrine HCl 5mg", dosage_form:"Liquid", category:"Liquid", packing:"60 ML", mrp:65},
  {id:"l31", name:"ABNVACE-125", composition:"Paracetamol 125mg", dosage_form:"Liquid", category:"Liquid", packing:"60 ML", mrp:21.50},
  {id:"l32", name:"ABNVACE-250", composition:"Paracetamol 250mg", dosage_form:"Liquid", category:"Liquid", packing:"60 ML", mrp:40},
  {id:"l33", name:"ABNZITH", composition:"Azithromycin 100mg", dosage_form:"Liquid", category:"Liquid", packing:"15 ML", mrp:40},
  {id:"l34", name:"ABNZITH", composition:"Azithromycin 200mg", dosage_form:"Liquid", category:"Liquid", packing:"15 ML", mrp:50},

  {id:"i1", name:"ABNCEFT-250", composition:"Ceftriaxone 250mg", dosage_form:"Injection", category:"Injection", packing:"1x1 Vial", mrp:27},
  {id:"i2", name:"ABNCEFT-500", composition:"Ceftriaxone 500mg", dosage_form:"Injection", category:"Injection", packing:"1x1 Vial", mrp:49},
  {id:"i3", name:"ABNCEFT-1GM", composition:"Ceftriaxone 1gm", dosage_form:"Injection", category:"Injection", packing:"1x1 Vial", mrp:69},
  {id:"i4", name:"ABNCEFT-1.5GM", composition:"Ceftriaxone 1gm + Sulbactam 500mg", dosage_form:"Injection", category:"Injection", packing:"1x1 Vial", mrp:185},
  {id:"i5", name:"ABNTROX-1GM", composition:"Cefoperazone 500mg + Sulbactam 500mg", dosage_form:"Injection", category:"Injection", packing:"1x1 Vial", mrp:205},
  {id:"i6", name:"ABNTROX-1.5", composition:"Cefoperazone 1000mg + Sulbactam 500mg", dosage_form:"Injection", category:"Injection", packing:"1x1 Vial", mrp:305},
  {id:"i7", name:"MEROABN-500", composition:"Meropenem 500mg", dosage_form:"Injection", category:"Injection", packing:"1x1 Vial", mrp:925},
  {id:"i8", name:"MEROABN-1GM", composition:"Meropenem 1gm", dosage_form:"Injection", category:"Injection", packing:"1x1 Vial", mrp:1850},
  {id:"i9", name:"ABNRAB-20", composition:"Rabeprazole 20mg", dosage_form:"Injection", category:"Injection", packing:"1x1 Vial", mrp:95},
  {id:"i10", name:"PENCIV-40", composition:"Pantoprazole 40mg", dosage_form:"Injection", category:"Injection", packing:"1x1 Vial", mrp:55},
  {id:"i11", name:"ABNEURO-1500", composition:"Methylcobalamin 1500mcg", dosage_form:"Injection", category:"Injection", packing:"1x2 ML", mrp:80},
  {id:"i12", name:"ABNEURO-2500", composition:"Methylcobalamin 2500mcg", dosage_form:"Injection", category:"Injection", packing:"1x2 ML", mrp:85},
  {id:"i13", name:"ABNEURO-FORTE", composition:"Methylcobalamin 1500mcg + Pyridoxine 100mg", dosage_form:"Injection", category:"Injection", packing:"5x2 ML", mrp:55},
  {id:"i14", name:"ABNDRON-25", composition:"Nandrolone Decanoate 25mg", dosage_form:"Injection", category:"Injection", packing:"1x1 Vial", mrp:160},
  {id:"i15", name:"ABNDRON-50", composition:"Nandrolone Decanoate 50mg", dosage_form:"Injection", category:"Injection", packing:"1x1 Vial", mrp:300},
  {id:"i16", name:"ABNDAC-AQ", composition:"Diclofenac 75mg + Benzyl Alcohol 4%", dosage_form:"Injection", category:"Injection", packing:"10x1 Ampul", mrp:190},
  {id:"i17", name:"ABC α-8", composition:"Arteether 150mg", dosage_form:"Injection", category:"Injection", packing:"3x2 ML", mrp:75},
];

const demoProducts = REAL_PRODUCTS;

const FALLBACK_CATEGORIES = [
  {id:"f1", name:"Tablets", icon:"💊"},
  {id:"f2", name:"Capsules", icon:"💊"},
  {id:"f3", name:"Syrups", icon:"🧴"},
  {id:"f4", name:"Dry Syrup", icon:"🥤"},
  {id:"f5", name:"Drops", icon:"💧"},
  {id:"f6", name:"Injections", icon:"💉"},
  {id:"f7", name:"Topical", icon:"🧴"},
];

const NAV_PAGES = ["home","about","products","pcd","quality","contact"];

function Layout({children, setPage, page}) {
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      if (y > lastY && y > 140) setNavHidden(true); else setNavHidden(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (p) => { setPage(p); setMenuOpen(false); };

  return (
    <>
      <CursorGlow />
      <header className={`nav ${scrolled ? "scrolled" : ""} ${navHidden ? "navHidden" : ""}`}>
        <div className="brand" onClick={() => handleNavClick("home")}>
          <img src="/images/logo.png" alt="Abencivo Biotech" className="headerLogo" />
        </div>
        <div className="menuContainer">
          <button className="hamburgerBtn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
          {menuOpen && (
            <div className="dropdownMenu">
              {NAV_PAGES.map(p => (
                <button key={p} className={page === p ? "activeLink" : ""} onClick={() => handleNavClick(p)}>
                  {p === "pcd" ? "PCD Franchise" : p.replace(/^\w/, c => c.toUpperCase())}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {children}
      <BackToTop />

      <footer>
        <div className="footBrand">
          <h3>{COMPANY.name}</h3><p>{COMPANY.tagline}</p><p>{COMPANY.address}</p>
          <div className="footSocial">
            <a href={COMPANY.social.linkedin} target="_blank">in</a>
            <a href={COMPANY.social.instagram} target="_blank">ig</a>
            <a href={COMPANY.social.facebook} target="_blank">fb</a>
          </div>
        </div>
        <div><h4>Contact</h4><p>{COMPANY.phone}</p><p>{COMPANY.email}</p></div>
        <div>
          <h4>Quick Links</h4>
          {["products","pcd","quality"].map(p => (
            <p key={p} className="footLink" onClick={() => setPage(p)}>{p === "pcd" ? "PCD Franchise" : p.replace(/^\w/, c => c.toUpperCase())}</p>
          ))}
        </div>
        <div className="footNewsletter">
          <h4>Stay Updated</h4><p>Get updates on new products and franchise openings.</p>
          <form className="newsletterForm" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Your email" required /><button className="primary">Join</button>
          </form>
        </div>
      </footer>
    </>
  );
}

/* ---------- HOME PAGE ---------- */
function Home({setPage}) {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

  useEffect(() => {
    fetch(API_BASE + "/categories")
      .then(r => r.ok ? r.json() : [])
      .then(x => { if (Array.isArray(x) && x.length) setCategories(x); })
      .catch(() => {});
  }, []);

  return (
    <main>
      <section className="hero">
        <ParticleField count={16} />
        <FloatingCapsules count={5} />
        <div className="heroText">
          <span className="eyebrow">PHARMACEUTICAL PARTNER</span>
          <h1>Building trusted healthcare partnerships.</h1>
          <p>Premium pharmaceutical solutions, franchise opportunities and manufacturing partnerships—presented in a clean, modern platform.</p>
          <div className="actions">
            <Magnetic className="primary" onClick={() => setPage("products")}>Explore Products</Magnetic>
            <Magnetic className="secondary" onClick={() => setPage("contact")}>Send Enquiry</Magnetic>
          </div>
          <a className="brochureLink" href={COMPANY.brochure} target="_blank">↓ Download company brochure (PDF)</a>
        </div>
        <div className="heroCard">
          <DnaHelix size={230} />
          <span>QUALITY</span>
          <strong>Carefully presented.<br/>Easy to manage.</strong>
          <small>Replace demo content with your verified company information.</small>
        </div>
      </section>

      <section className="section categorySection">
        <span className="eyebrow">BROWSE BY TYPE</span>
        <h2 className="categoryHeading">Product Categories</h2>
        <div className="marqueeWrapper">
          <div className="marqueeTrack">
            {[...categories, ...categories].map((c, i) => (
              <button className="categoryCard" onClick={() => setPage("products")} key={`${c.id}-${i}`}>
                <div className="categoryIcon">
                  {c.icon_url
                    ? <img src={c.icon_url} alt={c.name} />
                    : <span className="categoryEmoji">{c.icon || "💊"}</span>
                  }
                </div>
                <span className="categoryName">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Reveal as="section" className="stats">
        <div><b>01</b><span>Product catalogue</span></div>
        <div><b>02</b><span>PCD franchise</span></div>
        <div><b>03</b><span>Manufacturing</span></div>
        <div><b>04</b><span>Lead management</span></div>
      </Reveal>

      <section className="section numberStats">
        {NUMBER_STATS.map(s => <Counter key={s.label} to={s.to} suffix={s.suffix} label={s.label} />)}
      </section>

      <section className="section">
        <Reveal><span className="eyebrow">R&D PIPELINE</span></Reveal>
        <Reveal delay={80}><h2>From discovery to approval.</h2></Reveal>
        <ResearchPipeline stages={RESEARCH_STAGES} />
      </section>

      <section className="section trustSection">
        <Reveal><span className="eyebrow">COMPLIANCE</span></Reveal>
        <Reveal delay={80}><h2>Standards we build every batch around.</h2></Reveal>
        <BadgeStrip />
      </section>

      <section className="section altBg">
        <Reveal><span className="eyebrow">MANUFACTURING CAPABILITY</span></Reveal>
        <Reveal delay={80}><h2>What we bring to a manufacturing partnership.</h2></Reveal>
        <div className="grid4">
          {CAPABILITIES.map((c, i) => (<Reveal delay={120 + i * 80} className="card" key={c.t}><h3>{c.t}</h3><p>{c.d}</p></Reveal>))}
        </div>
      </section>

      <section className="section">
        <Reveal><span className="eyebrow">HOW IT WORKS</span></Reveal>
        <Reveal delay={80}><h2>From first enquiry to onboarded partner.</h2></Reveal>
        <ProcessSteps />
      </section>

      <Reveal as="section" className="ctaBanner">
        <div>
          <span className="eyebrow" style={{color:"#f5d7da"}}>READY TO PARTNER?</span>
          <h2>Start a PCD franchise or manufacturing enquiry today.</h2>
        </div>
        <div className="actions">
          <button className="primary" onClick={() => setPage("contact")}>Send Enquiry</button>
          <a className="secondary ctaWhatsapp" href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank">Chat on WhatsApp</a>
        </div>
      </Reveal>
    </main>
  );
}
function Card({t,d}){return <article className="card"><div className="icon">✦</div><h3>{t}</h3><p>{d}</p></article>}

/* ---------- ABOUT PAGE ---------- */
function About({setPage}) {
  return (
    <main className="aboutPage">
      <section className="aboutHeroRefined">
        <div className="aboutHeroInner">
          <Reveal><span className="eyebrowRed">WHO WE ARE</span></Reveal>
          <Reveal delay={80}>
            <h1 className="aboutHeroTitle">
              Building a <span className="aboutUnderline">Healthier Future</span>,<br/>Responsibly.
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="aboutHeroLead">
              Abencivo Biotech is built with a clear purpose — to contribute to a healthier future through responsible pharmaceutical solutions. We focus on quality, reliability, and long-term partnerships across the healthcare ecosystem.
            </p>
          </Reveal>
        </div>
        <div className="aboutDecorShape shapeA"></div>
        <div className="aboutDecorShape shapeB"></div>
      </section>

      <section className="aboutScienceSection">
        <div className="aboutScienceGrid">
          <Reveal className="aboutScienceImageWrap">
            <div className="aboutScienceImageFrame">
              <img src="/images/about-science.jpg" alt="Scientific research at Abencivo Biotech" className="aboutScienceImage" />
            </div>
          </Reveal>

          <div className="aboutScienceText">
            <Reveal><span className="eyebrowRed">OUR APPROACH</span></Reveal>
            <Reveal delay={80}>
              <h2 className="aboutSectionTitle">Scientific thinking.<br/>Professional standards.</h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="aboutParagraph">
                Our approach combines scientific thinking with a strong commitment to professional standards. From our growing product portfolio to our expanding capabilities, every step reflects our focus on sustainable growth.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <p className="aboutParagraph">
                We continue to move forward with one goal: to create meaningful value for healthcare professionals, partners, and communities.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <button className="primary aboutCtaBtn" onClick={() => setPage("contact")}>
                Partner with us →
              </button>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="aboutMilestoneSectionRefined">
        <div className="aboutMilestoneGrid">
          <div className="aboutMilestoneLeft">
            <Reveal><span className="eyebrowRed">OUR JOURNEY</span></Reveal>
            <Reveal delay={80}><h2 className="aboutSectionTitle">Our Milestone</h2></Reveal>
            <Reveal delay={150}>
              <p className="aboutParagraph">
                From establishing our foundation to building a growing pharmaceutical presence, Abencivo Biotech continues to expand its capabilities, product portfolio, and partnerships.
              </p>
            </Reveal>
            <Reveal delay={220}>
              <p className="aboutParagraph">
                Our journey is driven by progress, trust, and a commitment to building a stronger healthcare future.
              </p>
            </Reveal>
          </div>
          <div className="aboutMilestoneRight">
            <Timeline />
          </div>
        </div>
      </section>

      <section className="aboutMissionSectionRefined">
        <div className="aboutMissionHeader">
          <Reveal><span className="eyebrowRed">OUR PURPOSE</span></Reveal>
          <Reveal delay={80}><h2 className="aboutSectionTitle">Our Mission</h2></Reveal>
          <Reveal delay={150}>
            <p className="aboutMissionIntro">
              To develop and deliver reliable pharmaceutical solutions while maintaining a strong focus on quality, responsibility, and customer trust. We aim to build lasting partnerships and continuously improve our capabilities to serve the evolving needs of healthcare.
            </p>
          </Reveal>
        </div>

        <div className="aboutBentoGrid">
          {VALUES.slice(0, 4).map((v, i) => (
            <Reveal key={v.t} delay={i * 100} className={`aboutBentoCard bento${i + 1}`}>
              <span className="bentoNumber">0{i + 1}</span>
              <h3>{v.t}</h3>
              <p>{v.d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal as="section" className="ctaBanner">
        <div><h2>Want to know more before partnering with us?</h2></div>
        <div className="actions"><button className="primary" onClick={()=>setPage("contact")}>Get in touch</button></div>
      </Reveal>
    </main>
  );
}

/* ---------- PCD FRANCHISE PAGE ---------- */
function PCDFranchise({setPage}) {
  return (
    <main className="franchisePage">
      <section className="franchiseHero">
        <div className="franchiseHeroBg"></div>
        <div className="franchiseHeroOverlay"></div>
        <div className="franchiseHeroInner">
          <Reveal><span className="eyebrowRed">PCD FRANCHISE</span></Reveal>
          <Reveal delay={80}>
            <h1 className="franchiseHeroTitle">
              Build Your Pharma Business with Abencivo
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="franchiseHeroLead">
              Join a growing pharmaceutical franchise network with a focus on reliable supply, marketing support, and long-term partnership. A structured PCD franchise designed for distributors and medical representatives across India.
            </p>
          </Reveal>
          <Reveal delay={240} className="franchiseHeroActions">
            <button className="primary" onClick={() => setPage("contact")}>Apply for Franchise</button>
            <a className="secondary" href={COMPANY.brochure} target="_blank">Download Brochure</a>
          </Reveal>
        </div>
      </section>

      <div className="franchiseTicker">
        <div className="franchiseTickerTrack">
          {[
            "5+ YEARS OF EXPERIENCE",
            "200+ PRODUCTS",
            "MARKETING SUPPORT",
            "PAN-INDIA SUPPLY",
            "FRANCHISE OPPORTUNITIES",
            "5+ YEARS OF EXPERIENCE",
            "200+ PRODUCTS",
            "MARKETING SUPPORT",
            "PAN-INDIA SUPPLY",
            "FRANCHISE OPPORTUNITIES"
          ].map((item, i) => (
            <span key={i} className="franchiseTickerItem">
              <i className="franchiseTickerDot"></i>
              {item}
            </span>
          ))}
        </div>
      </div>

      <section className="section franchiseBenefitsSection">
        <div className="franchiseSectionHeader">
          <Reveal><span className="eyebrowRed">WHY PARTNER WITH US</span></Reveal>
          <Reveal delay={80}><h2>Franchise benefits.</h2></Reveal>
          <Reveal delay={150}>
            <p className="franchiseSectionIntro">
              A franchise structure designed to support distributors and medical representatives with clarity, structure, and ongoing assistance.
            </p>
          </Reveal>
        </div>

        <div className="franchiseBenefitsGrid">
          <Reveal delay={120} className="franchiseBenefitCard">
            <div className="franchiseBenefitIcon">📍</div>
            <h3>Territory Rights</h3>
            <p>Structured territory-based distribution to help partners operate with clarity in their assigned region.</p>
          </Reveal>
          <Reveal delay={200} className="franchiseBenefitCard">
            <div className="franchiseBenefitIcon">📣</div>
            <h3>Marketing Support</h3>
            <p>Access to promotional material, product information, and marketing assistance to support your sales efforts.</p>
          </Reveal>
          <Reveal delay={280} className="franchiseBenefitCard">
            <div className="franchiseBenefitIcon">💊</div>
            <h3>Wide Product Range</h3>
            <p>A growing portfolio across multiple therapeutic segments and dosage forms to serve diverse customer needs.</p>
          </Reveal>
          <Reveal delay={360} className="franchiseBenefitCard">
            <div className="franchiseBenefitIcon">🚚</div>
            <h3>Timely Delivery</h3>
            <p>Focused logistics and dispatch coordination to help maintain reliable supply to franchise partners.</p>
          </Reveal>
        </div>
      </section>

      <section className="section altBg franchiseProcessSection">
        <div className="franchiseSectionHeader">
          <Reveal><span className="eyebrowRed">GETTING STARTED</span></Reveal>
          <Reveal delay={80}><h2>Franchise process.</h2></Reveal>
          <Reveal delay={150}>
            <p className="franchiseSectionIntro">
              A straightforward onboarding path — from initial enquiry to becoming an active franchise partner.
            </p>
          </Reveal>
        </div>
        <ProcessSteps />
      </section>

      <section className="section franchiseFaqSection">
        <div className="franchiseSectionHeader">
          <Reveal><span className="eyebrowRed">QUESTIONS</span></Reveal>
          <Reveal delay={80}><h2>Franchise FAQs.</h2></Reveal>
        </div>
        <FAQ />
      </section>

      <Reveal as="section" className="ctaBanner">
        <div>
          <span className="eyebrow" style={{color:"#f5d7da"}}>START TODAY</span>
          <h2>Ready to open a franchise in your territory?</h2>
        </div>
        <div className="actions">
          <button className="primary" onClick={()=>setPage("contact")}>Apply for Franchise</button>
        </div>
      </Reveal>
    </main>
  );
}

/* ---------- QUALITY PAGE ---------- */
function Quality({setPage}) {
  return (
    <main className="qualityPage">
      <section className="qualityHero">
        <div className="qualityHeroBg"></div>
        <div className="qualityHeroOverlay"></div>
        <div className="qualityHeroInner">
          <Reveal><span className="eyebrow">QUALITY</span></Reveal>
          <Reveal delay={80}><h1>Quality at Every Step</h1></Reveal>
          <Reveal delay={160}>
            <p>
              At Abencivo Biotech, quality is built into every stage of our pharmaceutical journey. We focus on consistency, reliability, responsible processes, and continuous improvement to deliver products that meet defined quality expectations.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section qualityCardsSection">
        <div className="qualityCardsGrid">
          <Reveal className="qualityCard">
            <div className="qualityCardIcon">🛡️</div>
            <h2>Quality Policy</h2>
            <p>
              Our quality approach is centered on consistency, responsibility, and continuous improvement. We aim to maintain clear processes, careful documentation, and strong quality practices across our operations while building long-term trust with our customers and partners.
            </p>
          </Reveal>

          <Reveal delay={150} className="qualityCard">
            <div className="qualityCardIcon">✅</div>
            <h2>Quality Control</h2>
            <p>
              Quality control supports our commitment to reliable pharmaceutical products. We emphasize appropriate checks, documentation, process monitoring, and evaluation at relevant stages to help maintain consistency and product quality.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section qualityPrinciplesSection">
        <div className="qualityPrinciplesHeader">
          <Reveal><span className="eyebrow">OUR PRINCIPLES</span></Reveal>
          <Reveal delay={80}><h2>What Guides Our Quality</h2></Reveal>
        </div>

        <div className="qualityPrinciplesGrid">
          <Reveal delay={120} className="qualityPrinciple">
            <div className="principleNumber">01</div>
            <h3>Consistency</h3>
            <p>Maintaining reliable and well-defined processes.</p>
          </Reveal>

          <Reveal delay={220} className="qualityPrinciple">
            <div className="principleNumber">02</div>
            <h3>Continuous Improvement</h3>
            <p>Reviewing and improving processes over time.</p>
          </Reveal>

          <Reveal delay={320} className="qualityPrinciple">
            <div className="principleNumber">03</div>
            <h3>Customer Trust</h3>
            <p>Building confidence through responsible quality practices.</p>
          </Reveal>
        </div>
      </section>

      <Reveal as="section" className="ctaBanner">
        <div>
          <span className="eyebrow" style={{color:"#f5d7da"}}>LEARN MORE</span>
          <h2>Have a question about our quality approach?</h2>
        </div>
        <div className="actions">
          <button className="primary" onClick={()=>setPage("contact")}>Get in touch</button>
        </div>
      </Reveal>
    </main>
  );
}

/* ============================================================
   PRODUCTS PAGE
   ============================================================ */
function Products({setPage}) {
  const [items, setItems] = useState(demoProducts);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  useEffect(() => {
    fetch(API_BASE + "/products")
      .then(r => r.ok ? r.json() : [])
      .then(x => { if (Array.isArray(x) && x.length) setItems(x); })
      .catch(() => {});
  }, []);
  useEffect(() => {
    fetch(API_BASE + "/categories")
      .then(r => r.ok ? r.json() : [])
      .then(x => { if (Array.isArray(x)) setCategories(x.map(c => c.name)); })
      .catch(() => {});
  }, []);

  const cats = ["All", ...new Set([...items.map(x => x.category).filter(Boolean), ...categories])];
  const filtered = items.filter(x =>
    (cat === "All" || x.category === cat) &&
    (`${x.name} ${x.composition} ${x.category} ${x.dosage_form || ""}`.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <main className="productsPage">
      <section className="productsHero">
        <div className="productsHeroInner">
          <Reveal><span className="eyebrowRed">OUR CATALOGUE</span></Reveal>
          <Reveal delay={80}>
            <h1 className="productsHeroTitle">
              Explore Our <span className="aboutUnderline">Pharmaceutical Range</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="productsHeroLead">
              Over 200+ products across tablets, capsules, syrups, injectables, ointments, herbal tonics, and more. Search or filter to find what you need.
            </p>
          </Reveal>
          <Reveal delay={220} className="productsHeroStats">
            <span><b>{items.length}+</b> Products</span>
            <span><b>{cats.length - 1}</b> Categories</span>
            <span><b>Pan-India</b> Supply</span>
          </Reveal>
        </div>
      </section>

      <section className="section productsGridSection">
        <Reveal className="productsFiltersRow">
          <input
            className="productsSearch"
            placeholder="🔍  Search by name, composition, or category..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </Reveal>

        <Reveal delay={100} className="productsCategoryRow">
          {cats.map(c => (
            <button
              key={c}
              className={`productsCatBtn ${cat === c ? "active" : ""}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </Reveal>

        {filtered.length === 0 ? (
          <Reveal className="productsEmpty">
            <div className="productsEmptyIcon">🔍</div>
            <h3>No products found</h3>
            <p>Try a different search term or category.</p>
          </Reveal>
        ) : (
          <div className="productsGridNew">
            {filtered.map((p, i) => (
              <Reveal as="div" key={p.id} delay={(i % 12) * 50} className="productCardNew">
                <div className="productCardTop">
                  <span className="productCardCat">{p.category}</span>
                  <span className="productCardForm">{p.dosage_form}</span>
                </div>

                <h3 className="productCardName">{p.name}</h3>
                <p className="productCardComposition">{p.composition}</p>

                {p.packing && (
                  <div className="productCardMeta">
                    <span className="productCardMetaLabel">Pack</span>
                    <span className="productCardMetaValue">{p.packing}</span>
                  </div>
                )}

                {p.mrp && (
                  <div className="productCardPrice">
                    <span className="productCardPriceLabel">MRP</span>
                    <span className="productCardPriceValue">₹{Number(p.mrp).toFixed(2)}</span>
                  </div>
                )}

                <div className="productCardActions">
                  <a
                    href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("Hello, I am interested in " + p.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="productCardBtn productCardBtnWa"
                  >
                    WhatsApp
                  </a>
                  <button
                    className="productCardBtn productCardBtnEnquire"
                    onClick={() => setPage("contact")}
                  >
                    Enquire
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

/* ============================================================
   CONTACT PAGE — Modern two-column layout with animations
   ============================================================ */
function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    setMsg("Sending...");
    try {
      const r = await fetch(API_BASE + "/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "General", city: "" }),
      });
      const d = await r.json();
      setMsg(r.ok ? (d.message || "Enquiry submitted successfully.") : "Unable to submit. Please check your details.");
      if (r.ok) setForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      setMsg("Backend not reachable. Please try again.");
    }
    setSending(false);
  }

  return (
    <section className="contactModern">
      {/* Ambient animated gradient orbs */}
      <div className="contactOrb contactOrbA"></div>
      <div className="contactOrb contactOrbB"></div>

      <div className="contactModernGrid">
        {/* LEFT — Text + Form */}
        <Reveal className="contactLeft">
          <span className="contactAccent">GET IN TOUCH</span>
          <h2 className="contactTitle">
            Let&apos;s talk<span className="contactDot">.</span>
          </h2>
          <p className="contactLead">
            Use the form below. Submissions are saved in the database and can be emailed when SMTP
            is configured. Our team is ready to assist you with your biotechnology inquiries.
          </p>

          <form onSubmit={submit} className="contactForm">
            <div className="contactFormRow">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                required
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                required
              />
            </div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Message"
              rows={5}
              required
            />
            <button type="submit" disabled={sending} className="primary contactSubmit">
              {sending ? "Sending..." : "Submit Enquiry →"}
            </button>
            {msg && <p className="contactMsg">{msg}</p>}
          </form>
        </Reveal>

        {/* RIGHT — Floating widget */}
        <Reveal delay={200} className="contactRight">
          <div className="contactWidget">
            <div className="contactWidgetBadge">✦</div>

            <h3 className="contactWidgetTitle">Reach us directly</h3>
            <p className="contactWidgetLead">
              Our team typically responds within one business day.
            </p>

            <div className="contactInfoList">
              <div className="contactInfoRow">
                <span className="contactInfoIcon">✉</span>
                <div>
                  <div className="contactInfoLabel">Email</div>
                  <div className="contactInfoValue">{COMPANY?.email || "info@abencivo.com"}</div>
                </div>
              </div>
              <div className="contactInfoRow">
                <span className="contactInfoIcon">☎</span>
                <div>
                  <div className="contactInfoLabel">Phone</div>
                  <div className="contactInfoValue">{COMPANY?.phone || "+91 XXXXXXXXXX"}</div>
                </div>
              </div>
              <div className="contactInfoRow">
                <span className="contactInfoIcon">📍</span>
                <div>
                  <div className="contactInfoLabel">Address</div>
                  <div className="contactInfoValue">{COMPANY?.address || "Bilaspur, Haryana, India"}</div>
                </div>
              </div>
              <div className="contactInfoRow">
                <span className="contactInfoIcon">⏱</span>
                <div>
                  <div className="contactInfoLabel">Hours</div>
                  <div className="contactInfoValue">Mon – Sat · 9:00 – 18:00 IST</div>
                </div>
              </div>
            </div>

            <div className="contactLiveRow">
              <span className="contactLivePulse"></span>
              <span className="contactLiveText">AVAILABLE TO HELP</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- ADMIN PANEL ---------- */
const EMPTY_PRODUCT = {name:"",composition:"",dosage_form:"Tablet",category:"General",image_url:"/products/product-placeholder.svg",description:""};
const EMPTY_CATEGORY = {name:"",icon:"💊",icon_url:"",sort_order:0};
const ENQUIRY_STATUSES = ["New","Contacted","Follow-up","Converted","Closed"];
const STATUS_COLORS = {New:"#c51f2b",Contacted:"#a15b00",Followup:"#8f1620","Follow-up":"#8f1620",Converted:"#1a7a3c",Closed:"#6b6b6b"};

function Admin(){
 const [token,setToken]=useState(localStorage.getItem("ab_token")||"");
 const [login,setLogin]=useState({email:"",password:""});
 const [loginError,setLoginError]=useState("");
 const [tab,setTab]=useState("dashboard");
 const [data,setData]=useState({products:[],enquiries:[],logs:[],categories:[]});
 const [loadError,setLoadError]=useState("");
 const [form,setForm]=useState(EMPTY_PRODUCT);
 const [editingId,setEditingId]=useState(null);
 const [catForm,setCatForm]=useState(EMPTY_CATEGORY);
 const [editingCatId,setEditingCatId]=useState(null);
 const [uploading,setUploading]=useState(false);
 const [toast,setToast]=useState("");
 const [productQuery,setProductQuery]=useState("");
 const [enquiryQuery,setEnquiryQuery]=useState("");
 const [confirmDeleteId,setConfirmDeleteId]=useState(null);
 const [confirmDeleteCatId,setConfirmDeleteCatId]=useState(null);

 const headers={"Content-Type":"application/json","Authorization":"Bearer "+token};
 function flash(msg){setToast(msg);setTimeout(()=>setToast(""),2600)}

 async function load(){
   if(!token)return;
   setLoadError("");
   try{
     const [p,e,l,c]=await Promise.all([
       fetch(API_BASE+"/admin/products",{headers}),
       fetch(API_BASE+"/admin/enquiries",{headers}),
       fetch(API_BASE+"/admin/audit-logs",{headers}),
       fetch(API_BASE+"/admin/categories",{headers})
     ]);
     if(p.status===401){localStorage.removeItem("ab_token");setToken("");return}
     setData({products:await p.json(),enquiries:await e.json(),logs:await l.json(),categories:await c.json()});
   }catch(err){setLoadError(`Can't reach the backend at ${API_BASE}.`)}
 }
 useEffect(()=>{load()},[token]);

 async function doLogin(e){
   e.preventDefault();setLoginError("");
   try{
     const r=await fetch("https://abencivo-bio.onrender.com/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(login)});
     const d=await r.json();
     if(r.ok){localStorage.setItem("ab_token",d.token);setToken(d.token)}
     else setLoginError(d.message||"Login failed");
   }catch{setLoginError(`Can't reach the backend.`)}
 }

 async function handleFile(e){
   const file=e.target.files[0];if(!file)return;
   setUploading(true);
   try{
     const fd=new FormData();fd.append("file",file);
     const r=await fetch(API_BASE+"/admin/upload",{method:"POST",headers:{"Authorization":"Bearer "+token},body:fd});
     const d=await r.json();
     if(r.ok)setForm(f=>({...f,image_url:d.url}));else flash(d.message||"Upload failed");
   }catch{flash("Upload failed.")}
   setUploading(false);
 }

 function startEdit(p){setEditingId(p.id);setForm({name:p.name,composition:p.composition||"",dosage_form:p.dosage_form||"Tablet",category:p.category||"General",image_url:p.image_url||"/products/product-placeholder.svg",description:p.description||""});setTab("products");window.scrollTo({top:0,behavior:"smooth"})}
 function cancelEdit(){setEditingId(null);setForm(EMPTY_PRODUCT)}

 async function save(e){
   e.preventDefault();
   if(editingId){
     await fetch(API_BASE+"/admin/products/"+editingId,{method:"PUT",headers,body:JSON.stringify({...form,active:1})});flash("Product updated");
   }else{
     await fetch(API_BASE+"/admin/products",{method:"POST",headers,body:JSON.stringify(form)});flash("Product added");
   }
   cancelEdit();load();
 }

 async function del(id){
   await fetch(API_BASE+"/admin/products/"+id,{method:"DELETE",headers});
   setConfirmDeleteId(null);flash("Product removed");load();
 }

 async function status(id,status){await fetch(API_BASE+"/admin/enquiries/"+id,{method:"PATCH",headers,body:JSON.stringify({status})});load()}

 function startEditCat(c){setEditingCatId(c.id);setCatForm({name:c.name,icon:c.icon||"💊",icon_url:c.icon_url||"",sort_order:c.sort_order||0});setTab("categories");window.scrollTo({top:0,behavior:"smooth"})}
 function cancelEditCat(){setEditingCatId(null);setCatForm(EMPTY_CATEGORY)}

 async function saveCat(e){
   e.preventDefault();
   if(editingCatId){
     await fetch(API_BASE+"/admin/categories/"+editingCatId,{method:"PUT",headers,body:JSON.stringify({...catForm,active:1})});flash("Category updated");
   }else{
     await fetch(API_BASE+"/admin/categories",{method:"POST",headers,body:JSON.stringify(catForm)});flash("Category added");
   }
   cancelEditCat();load();
 }

 async function delCat(id){
   await fetch(API_BASE+"/admin/categories/"+id,{method:"DELETE",headers});
   setConfirmDeleteCatId(null);flash("Category removed");load();
 }

 if(!token)return(
   <main className="adminLogin">
     <form className="form adminLoginForm" onSubmit={doLogin}>
       <span className="eyebrow">ABENCIVO CONTROL CENTRE</span><h1>Admin Login</h1>
       <p>Use the credentials from your server .env file.</p>
       <input placeholder="Email" type="email" value={login.email} onChange={e=>setLogin({...login,email:e.target.value})}/>
       <input placeholder="Password" type="password" value={login.password} onChange={e=>setLogin({...login,password:e.target.value})}/>
       {loginError&&<p className="notice adminLoginError">{loginError}</p>}
       <button className="primary">Login</button>
     </form>
   </main>
 );

 const filteredProducts=data.products.filter(p=>(p.name+p.category+p.dosage_form).toLowerCase().includes(productQuery.toLowerCase()));
 const filteredEnquiries=data.enquiries.filter(x=>(x.name+x.type+x.city+x.assigned_to).toLowerCase().includes(enquiryQuery.toLowerCase()));
 const statusCounts=ENQUIRY_STATUSES.map(s=>({s,n:data.enquiries.filter(x=>x.status===s).length}));

 const TABS=[["dashboard","Dashboard","◆"],["products","Products","💊"],["categories","Categories","🗂"],["enquiries","Enquiries","✉"],["logs","Activity Log","▤"]];

 return(
   <main className="admin">
     <aside>
       <h2>ABENCIVO</h2>
       {TABS.map(([id,label,icon])=>(<button className={tab===id?"sel":""} onClick={()=>setTab(id)} key={id}><i>{icon}</i>{label}</button>))}
       <button className="logoutBtn" onClick={()=>{localStorage.removeItem("ab_token");setToken("")}}>Logout</button>
     </aside>
     <section className="adminMain">
       <div className="adminTop"><div><span className="eyebrow">CONTROL CENTRE</span><h1>{TABS.find(t=>t[0]===tab)[1]}</h1></div>{toast&&<span className="adminToast">{toast}</span>}</div>
       {loadError&&<div className="errorBanner">{loadError} <button onClick={load}>Retry</button></div>}
       {tab==="dashboard"&&(<><div className="grid3"><div className="counterCard"><b>{data.products.length}</b><span>Active products</span></div><div className="counterCard"><b>{data.enquiries.length}</b><span>Total enquiries</span></div><div className="counterCard"><b>{data.logs.length}</b><span>Audit events</span></div></div><h3 className="adminSubhead">Enquiries by status</h3><div className="statusBreakdown">{statusCounts.map(({s,n})=>(<div className="statusBarRow" key={s}><span className="statusBarLabel"><i className="statusDot" style={{background:STATUS_COLORS[s]}}></i>{s}</span><div className="statusBarTrack"><div className="statusBarFill" style={{width:`${data.enquiries.length?Math.max(4,(n/data.enquiries.length)*100):0}%`,background:STATUS_COLORS[s]}}></div></div><span className="statusBarCount">{n}</span></div>))}</div></>)}
       {tab==="products"&&(<><form className="adminForm productForm" onSubmit={save}>{editingId&&<div className="editingBanner">Editing product #{editingId} <button type="button" onClick={cancelEdit}>Cancel</button></div>}<div className="productFormGrid"><div className="uploadBox"><img src={form.image_url.startsWith("/uploads")?API_BASE.replace("/api","")+form.image_url:form.image_url} alt="" /><label className="uploadLabel">{uploading?"Uploading...":"Change image"}<input type="file" accept="image/*" hidden onChange={handleFile} disabled={uploading}/></label></div><div className="productFields"><input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><input placeholder="Composition" value={form.composition} onChange={e=>setForm({...form,composition:e.target.value})}/><div className="fieldRow"><input placeholder="Dosage form" value={form.dosage_form} onChange={e=>setForm({...form,dosage_form:e.target.value})}/><input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}/></div><textarea placeholder="Description" rows="3" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div></div><button className="primary">{editingId?"Save changes":"Add Product"}</button></form><input className="adminSearch" placeholder="Search products..." value={productQuery} onChange={e=>setProductQuery(e.target.value)}/><div className="table">{filteredProducts.map(p=>(<div className="row productRow" key={p.id}><img className="rowThumb" src={p.image_url.startsWith("/uploads")?API_BASE.replace("/api","")+p.image_url:p.image_url} alt=""/><span><b>{p.name}</b><small>{p.category} · {p.dosage_form}</small></span><div className="rowActions"><button onClick={()=>startEdit(p)}>Edit</button>{confirmDeleteId===p.id?<span className="confirmInline">Delete? <button className="dangerBtn" onClick={()=>del(p.id)}>Yes</button><button onClick={()=>setConfirmDeleteId(null)}>No</button></span>:<button onClick={()=>setConfirmDeleteId(p.id)}>Delete</button>}</div></div>))}{filteredProducts.length===0&&<div className="row emptyRow">No products match your search.</div>}</div></>)}
       {tab==="categories"&&(<><form className="adminForm" onSubmit={saveCat}>{editingCatId&&<div className="editingBanner">Editing category #{editingCatId} <button type="button" onClick={cancelEditCat}>Cancel</button></div>}<div className="fieldRow"><input placeholder="Category name (e.g. Tablets)" value={catForm.name} onChange={e=>setCatForm({...catForm,name:e.target.value})} required/><input placeholder="Icon (emoji, e.g. 💊)" value={catForm.icon} onChange={e=>setCatForm({...catForm,icon:e.target.value})}/></div><input placeholder="Sort order (0 = first)" type="number" value={catForm.sort_order} onChange={e=>setCatForm({...catForm,sort_order:Number(e.target.value)})}/><button className="primary">{editingCatId?"Save changes":"Add Category"}</button></form><div className="table">{data.categories.map(c=>(<div className="row" key={c.id}><span style={{fontSize:"28px"}}>{c.icon||"💊"}</span><span><b>{c.name}</b><small>Sort: {c.sort_order} · {c.active?"Active":"Hidden"}</small></span><div className="rowActions"><button onClick={()=>startEditCat(c)}>Edit</button>{confirmDeleteCatId===c.id?<span className="confirmInline">Delete? <button className="dangerBtn" onClick={()=>delCat(c.id)}>Yes</button><button onClick={()=>setConfirmDeleteCatId(null)}>No</button></span>:<button onClick={()=>setConfirmDeleteCatId(c.id)}>Delete</button>}</div></div>))}{data.categories.length===0&&<div className="row emptyRow">No categories yet. Add one above!</div>}</div></>)}
       {tab==="enquiries"&&(<><input className="adminSearch" placeholder="Search enquiries..." value={enquiryQuery} onChange={e=>setEnquiryQuery(e.target.value)}/><div className="table">{filteredEnquiries.map(x=>(<div className="row" key={x.id}><span><b>{x.name} <em className="typeBadge">{x.type}</em></b><small>{x.phone} · {x.email} · {x.message}</small><small className="assignedTo">Assigned to: {x.assigned_to||"Unassigned"} {x.emailed?"· emailed":"· not emailed"}</small></span><select className="statusSelect" style={{color:STATUS_COLORS[x.status]||"#4b0d12"}} value={x.status} onChange={e=>status(x.id,e.target.value)}>{ENQUIRY_STATUSES.map(s=><option key={s}>{s}</option>)}</select></div>))}{filteredEnquiries.length===0&&<div className="row emptyRow">No enquiries match your search.</div>}</div></>)}
       {tab==="logs"&&(<div className="table">{data.logs.map(x=>(<div className="row" key={x.id}><span>{x.action} · {x.entity} · #{x.entity_id}</span><small>{x.created_at}</small></div>))}</div>)}
     </section>
   </main>
 );
}

/* ---------- APP ---------- */
function App() {
  const [page, setPage] = useState(location.hash.slice(1) || "home");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const f = () => setPage(location.hash.slice(1) || "home");
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, []);

  const go = p => { location.hash = p; setPage(p); };

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  let content = page === "home" ? <Home setPage={go} /> :
                page === "products" ? <Products setPage={go} /> :
                page === "contact" ? <Contact /> :
                page === "admin" ? <Admin /> :
                page === "about" ? <About setPage={go} /> :
                page === "pcd" ? <PCDFranchise setPage={go} /> :
                page === "quality" ? <Quality setPage={go} /> :
                <Home setPage={go} />;

  return page === "admin" ? content : (
    <Layout setPage={go} page={page}>
      <div key={page} className="pageTransition">{content}</div>
    </Layout>
  );
}

createRoot(document.getElementById("root")).render(<App />);