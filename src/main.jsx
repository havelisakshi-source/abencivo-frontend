import React, {useEffect, useRef, useState} from "react";
import {createRoot} from "react-dom/client";
import {COMPANY, API_BASE} from "./config";
import {CERTIFICATIONS, MILESTONES, VALUES, TESTIMONIALS, CAPABILITIES, PROCESS_STEPS, FAQS, FRANCHISE_FAQS, RESEARCH_STAGES, GMP_STAGES, NUMBER_STATS} from "./content";
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

/* ---------- Category Image helper ---------- */
function getCategoryImage(name = "") {
  const key = name.toLowerCase();
  if (key.includes("tablet")) return "/images/categories/cat-tablets.png";
  if (key.includes("capsule")) return "/images/categories/cat-capsules.png";
  if (key.includes("dry syrup")) return "/images/categories/cat-dry-syrup.png";
  if (key.includes("syrup")) return "/images/categories/cat-syrups.png";
  if (key.includes("liquid")) return "/images/categories/cat-syrups.png";
  if (key.includes("drop")) return "/images/categories/cat-drops.png";
  if (key.includes("inject")) return "/images/categories/cat-injections.png";
  if (key.includes("ointment") || key.includes("topical")) return "/images/categories/cat-topical.png";
  if (key.includes("herbal")) return "/images/categories/cat-syrups.png";
  if (key.includes("energy")) return "/images/categories/cat-syrups.png";
  return "/images/categories/cat-tablets.png";
}
function getProductImage(category) { return getCategoryImage(category); }

/* ============================================================
   REAL PRODUCT CATALOGUE — fallback
   ============================================================ */
const REAL_PRODUCTS = [
  {id:"t1", name:"ETOABN-TH", composition:"Etoricoxib 60mg + Thiocolchicoside 4mg", dosage_form:"Tablet", category:"Tablets", packing:"10x10 Alu-Alu", mrp:1850.00},
  {id:"t2", name:"ETOABN-120", composition:"Etoricoxib 120mg", dosage_form:"Tablet", category:"Tablets", packing:"10x10 Alu-Alu", mrp:1450.00},
  {id:"t3", name:"UROABN-300", composition:"Ursodeoxycholic acid 300mg", dosage_form:"Tablet", category:"Tablets", packing:"10x1x10 Alu", mrp:3500.00},
  {id:"t4", name:"ABC-500", composition:"Levofloxacin 500mg", dosage_form:"Tablet", category:"Tablets", packing:"10x10 Alu-Alu", mrp:840.00},
  {id:"t5", name:"ABCNET-FX", composition:"Montelukast 10mg + Fexofenadine 120mg", dosage_form:"Tablet", category:"Tablets", packing:"10x10 Alu-Alu", mrp:1500.00},
  {id:"t6", name:"ABNZID-600", composition:"Linezolid 600mg", dosage_form:"Tablet", category:"Tablets", packing:"10x1x10 Alu", mrp:3320.00},
  {id:"c1", name:"PENCIV-DSR", composition:"Pantoprazole 40mg + Domperidone 30mg", dosage_form:"Capsule", category:"Capsules", packing:"10x10 Alu-Alu", mrp:1200},
  {id:"c2", name:"REBCIV-DSR", composition:"Rabeprazole 20mg + Domperidone 30mg", dosage_form:"Capsule", category:"Capsules", packing:"10x10 Alu-Alu", mrp:1250},
  {id:"c3", name:"ABNRAB-LSR", composition:"Rabeprazole 20mg + Levosulpride 75mg", dosage_form:"Capsule", category:"Capsules", packing:"10x10 Alu-Alu", mrp:1450},
  {id:"c4", name:"ESOABN-DSR", composition:"Esomeprazole 40mg + Domperidone 30mg", dosage_form:"Capsule", category:"Capsules", packing:"10x10 Alu-Alu", mrp:1100},
  {id:"d1", name:"ABNMOX-CV-457", composition:"Amoxycillin 400mg + Clavulanic Acid 57mg", dosage_form:"Dry Syrup", category:"Dry Syrup", packing:"30 ML", mrp:135},
  {id:"d3", name:"FIXOBEN-DS", composition:"Cefixime 100mg", dosage_form:"Dry Syrup", category:"Dry Syrup", packing:"30 ML", mrp:70},
  {id:"dr1", name:"ABNSVIT-L", composition:"Multivitamin & Multimineral Drop", dosage_form:"Drops", category:"Drops", packing:"30 ML", mrp:55},
  {id:"dr3", name:"ABNTONE", composition:"Ondansetron 2mg", dosage_form:"Drops", category:"Drops", packing:"30 ML", mrp:60},
  {id:"o1", name:"ABNDAC-GEL", composition:"Diclofenac Gel", dosage_form:"Ointment", category:"Ointment", packing:"30 GM", mrp:95},
  {id:"o4", name:"KETOABN", composition:"Ketoconazole 2%", dosage_form:"Ointment", category:"Ointment", packing:"15 GM", mrp:125},
  {id:"h1", name:"ABNLIV-DS", composition:"Herbal Liver Tonic", dosage_form:"Herbal", category:"Herbal", packing:"225 ML", mrp:145},
  {id:"h7", name:"MINDSET", composition:"Complete Mind Health Solution", dosage_form:"Herbal", category:"Herbal", packing:"200 ML", mrp:195},
  {id:"l2", name:"ABNSVIT-L", composition:"Lycopene 6% + Multivitamin & Multimineral", dosage_form:"Liquid", category:"Liquid", packing:"200 ML", mrp:145},
  {id:"l17", name:"COFRIBS-AM", composition:"Terbutaline 1.25mg + Ambroxol 15mg + Guaiphenesin", dosage_form:"Liquid", category:"Liquid", packing:"60 ML", mrp:65},
  {id:"i1", name:"ABNCEFT-250", composition:"Ceftriaxone 250mg", dosage_form:"Injection", category:"Injection", packing:"1x1 Vial", mrp:27},
  {id:"i8", name:"MEROABN-1GM", composition:"Meropenem 1gm", dosage_form:"Injection", category:"Injection", packing:"1x1 Vial", mrp:1850},
  {id:"e1", name:"ABNCIVO-ORS", composition:"ORS Drink", dosage_form:"Energy Drink", category:"Energy Drink", packing:"200 ML", mrp:55},
];
const demoProducts = REAL_PRODUCTS;

const FALLBACK_CATEGORIES = [
  {id:"f1", name:"Tablets",     image:"/images/categories/cat-tablets.png"},
  {id:"f2", name:"Capsules",    image:"/images/categories/cat-capsules.png"},
  {id:"f3", name:"Syrups",      image:"/images/categories/cat-syrups.png"},
  {id:"f4", name:"Dry Syrup",   image:"/images/categories/cat-dry-syrup.png"},
  {id:"f5", name:"Drops",       image:"/images/categories/cat-drops.png"},
  {id:"f6", name:"Injections",  image:"/images/categories/cat-injections.png"},
  {id:"f7", name:"Topical",     image:"/images/categories/cat-topical.png"},
];

const NAV_PAGES = ["home","about","products","pcd","quality","contact"];

/* ============================================================
   LAYOUT — Responsive header
   ============================================================ */
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

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 900 && menuOpen) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen]);

  const handleNavClick = (p) => { setPage(p); setMenuOpen(false); };

  return (
    <>
      <CursorGlow />
      <header className={`nav ${scrolled ? "scrolled" : ""} ${navHidden ? "navHidden" : ""}`}>
        <div className="brand" onClick={() => handleNavClick("home")}>
          <img src="/images/logo.png" alt="Abencivo Biotech" className="headerLogo" />
        </div>

        <nav className="desktopNav">
          {NAV_PAGES.map(p => (
            <button
              key={p}
              className={page === p ? "activeLink" : ""}
              onClick={() => handleNavClick(p)}
            >
              {p === "pcd" ? "PCD Franchise" : p.replace(/^\w/, c => c.toUpperCase())}
            </button>
          ))}
        </nav>

        <div className="menuContainer">
          <button
            className="hamburgerBtn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            <span></span><span></span><span></span>
          </button>
          {menuOpen && (
            <div className="dropdownMenu">
              {NAV_PAGES.map(p => (
                <button
                  key={p}
                  className={page === p ? "activeLink" : ""}
                  onClick={() => handleNavClick(p)}
                >
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
          <strong>Trusted. Tested. Verified.</strong>
          <small>Where every batch meets uncompromising standards.</small>
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
                  <img
                    src={c.image_url || c.image || getCategoryImage(c.name)}
                    alt={c.name}
                    loading="lazy"
                    onError={(e) => { e.target.src = getCategoryImage(c.name); }}
                  />
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
        <FAQ items={FRANCHISE_FAQS} />
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

/* ---------- PRODUCTS PAGE ---------- */
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
        <div className="productsBlob productsBlob1"></div>
        <div className="productsBlob productsBlob2"></div>
        <div className="productsBlob productsBlob3"></div>

        <div className="catalogueFloat catalogueFloat1">
          <img src="/images/categories/cat-tablets.png" alt="Tablets" />
          <span className="catalogueFloatTag">Tablets</span>
        </div>
        <div className="catalogueFloat catalogueFloat2">
          <img src="/images/categories/cat-syrups.png" alt="Syrups" />
          <span className="catalogueFloatTag">Syrups</span>
        </div>
        <div className="catalogueFloat catalogueFloat3">
          <img src="/images/categories/cat-injections.png" alt="Injections" />
          <span className="catalogueFloatTag">Injections</span>
        </div>
        <div className="catalogueFloat catalogueFloat4">
          <img src="/images/categories/cat-capsules.png" alt="Capsules" />
          <span className="catalogueFloatTag">Capsules</span>
        </div>

        <div className="pharmaFloat pharmaFloat1">💊</div>
        <div className="pharmaFloat pharmaFloat2">🧪</div>
        <div className="pharmaFloat pharmaFloat3">💉</div>
        <div className="pharmaFloat pharmaFloat4">🧬</div>

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

/* ---------- CONTACT PAGE ---------- */
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
      <div className="contactOrb contactOrbA"></div>
      <div className="contactOrb contactOrbB"></div>

      <div className="contactModernGrid">
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
              <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
            </div>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" />
            <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" rows={5} required />
            <button type="submit" disabled={sending} className="primary contactSubmit">
              {sending ? "Sending..." : "Submit Enquiry →"}
            </button>
            {msg && <p className="contactMsg">{msg}</p>}
          </form>
        </Reveal>

        <Reveal delay={200} className="contactRight">
          <div className="contactWidget">
            <div className="contactWidgetBadge">✦</div>
            <h3 className="contactWidgetTitle">Reach us directly</h3>
            <p className="contactWidgetLead">Our team typically responds within one business day.</p>

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

 // ---- RESILIENT LOAD: never fails if one endpoint is missing ----
 async function load(){
   if(!token)return;
   setLoadError("");

   // Safe fetch that always resolves to either JSON data or an empty array
   async function safeFetch(url){
     try {
       const r = await fetch(url, {headers});
       if(r.status === 401){
         // Auth failed — force logout
         localStorage.removeItem("ab_token");
         setToken("");
         return { unauthorized: true, data: [] };
       }
       if(!r.ok) return { unauthorized: false, data: [] };
       const text = await r.text();
       if(!text) return { unauthorized: false, data: [] };
       try { return { unauthorized: false, data: JSON.parse(text) }; }
       catch { return { unauthorized: false, data: [] }; }
     } catch {
       return { unauthorized: false, data: [], networkError: true };
     }
   }

   const [p, e, l, c] = await Promise.all([
     safeFetch(API_BASE + "/admin/products"),
     safeFetch(API_BASE + "/admin/enquiries"),
     safeFetch(API_BASE + "/admin/audit-logs"),
     safeFetch(API_BASE + "/admin/categories"),
   ]);

   // If any returned 401, the setToken("") call inside safeFetch already ran
   if(p.unauthorized || e.unauthorized || l.unauthorized || c.unauthorized) return;

   // Only show the "cannot reach" error if everything failed (real network issue)
   const allFailed =
     p.data.length === 0 && e.data.length === 0 && l.data.length === 0 && c.data.length === 0 &&
     (p.networkError || e.networkError || l.networkError || c.networkError);

   if(allFailed){
     setLoadError(`Can't reach the backend at ${API_BASE}. The server may be waking up — click Retry.`);
   }

   setData({
     products: Array.isArray(p.data) ? p.data : [],
     enquiries: Array.isArray(e.data) ? e.data : [],
     logs: Array.isArray(l.data) ? l.data : [],
     categories: Array.isArray(c.data) ? c.data : [],
   });
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