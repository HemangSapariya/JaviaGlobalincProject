import React, { useEffect, useMemo, useRef, useState } from 'react';
import { products } from './products';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebookF,
  faLinkedinIn
} from "@fortawesome/free-brands-svg-icons";

const tabs = [
  ['all', 'All Products'],
  ['construction', 'Construction Materials'],
  ['tile', 'Tile & Stone'],
  ['wall', 'Wall & Finish'],
  ['water', 'Waterproofing'],
  ['concrete', 'Concrete & Repair'],
];

function Reveal({ children, className = '' }) {
  return <div className={`reveal ${className}`.trim()}>{children}</div>;
}

function CountUp({ end, suffix = '', duration = 1100 }) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    let frame = 0;
    let startTime = 0;

    const run = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(end * eased));
      if (progress < 1) frame = requestAnimationFrame(run);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          cancelAnimationFrame(frame);
          startTime = 0;
          setValue(0);
          frame = requestAnimationFrame(run);
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(node);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [end, duration]);

  return <strong ref={ref}>{value}{suffix}</strong>;
}


function App() {
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [flippedProduct, setFlippedProduct] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const productsPerPage = 6;
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    product: '',
    message: '',
  });

  useEffect(() => {
    // Re-trigger premium reveal animations while scrolling DOWN and UP.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          } else {
            entry.target.classList.remove('show');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '6% 0px -8% 0px',
      }
    );

    const observeAll = () => {
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    };

    observeAll();
    const timer = window.setTimeout(observeAll, 120);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [filter, currentPage]);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const updateScrollMotion = () => {
      const y = window.scrollY;
      const direction = y >= lastY ? 'down' : 'up';

      document.documentElement.dataset.scrollDirection = direction;
      document.documentElement.style.setProperty('--hero-shift', `${Math.min(y * 0.11, 72)}px`);
      document.documentElement.style.setProperty('--hero-ring-shift', `${Math.min(y * 0.035, 24)}px`);
      document.body.classList.toggle('is-scrolled', y > 24);

      lastY = y;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollMotion);
        ticking = true;
      }
    };

    updateScrollMotion();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const visibleProducts = useMemo(
    () => products.filter((p) => filter === 'all' || p.cat === filter),
    [filter]
  );

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / productsPerPage));

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return visibleProducts.slice(start, start + productsPerPage);
  }, [visibleProducts, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const changeFilter = (value) => {
    setFilter(value);
    setCurrentPage(1);
    setFlippedProduct(null);
  };

  const changePage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    if (nextPage === currentPage) return;

    setFlippedProduct(null);
    setCurrentPage(nextPage);

    window.requestAnimationFrame(() => {
      document.getElementById('productGrid')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  const toggleProductFlip = (productKey) => {
    setFlippedProduct((current) => current === productKey ? null : productKey);
  };

  const handleProductKeyDown = (e, productKey) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleProductFlip(productKey);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent('Product Enquiry - Javia Global Inc.');
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nProduct: ${form.product}\n\nRequirement:\n${form.message}`
    );
    window.location.href = `mailto:javiaglobalinc@gmail.com?subject=${subject}&body=${body}`;
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header>
        <div className="container nav">
          <a className="logo" href="#home" onClick={closeMenu}>
            JAVIA <span>GLOBAL INC.</span>
          </a>

          <nav className={menuOpen ? 'open' : ''}>
            <a href="#home" onClick={closeMenu}>Home</a>
            <a href="#about" onClick={closeMenu}>About</a>
            <a href="#services" onClick={closeMenu}>Services</a>
            <a href="#products" onClick={closeMenu}>Products</a>
            <a href="#process" onClick={closeMenu}>How We Work</a>
            <a href="#contact" onClick={closeMenu}>Contact</a>
          </nav>

          <button
            type="button"
            className="menu"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="container hero-content">
            <div className="eyebrow hero-animate hero-delay-1">Import • Export • Global Supply • Building Materials</div>
            <h1 className="hero-animate hero-delay-2">Construction Chemicals and Building Materials That Move Beyond Borders.</h1>
            <p className="hero-animate hero-delay-3">
              Javia Global Inc. connects quality construction-chemical and building-material products with international buyers,
              distributors and project requirements through professional sourcing, export coordination and
              dependable trade support.
            </p>
            <div className="hero-actions hero-animate hero-delay-4">
              <a className="btn primary" href="#products">Explore Products</a>
              <a className="btn outline" href="#contact">Request a Quote</a>
            </div>
            <a className="scroll-cue hero-animate hero-delay-5" href="#about" aria-label="Scroll to About section">
              <span className="scroll-mouse"><i /></span>
              <em>Scroll to explore</em>
            </a>
          </div>
        </section>

        <div className="container trustbar">
          <div className="trustgrid">
            <Reveal className="trust reveal-scale reveal-delay-1"><strong>28+</strong><span>Product Categories</span></Reveal>
            <Reveal className="trust reveal-scale reveal-delay-2"><strong>Global</strong><span>Trade Focus</span></Reveal>
            <Reveal className="trust reveal-scale reveal-delay-3"><strong>Quality</strong><span>Focused Supply</span></Reveal>
            <Reveal className="trust reveal-scale reveal-delay-4"><strong>Direct</strong><span>Business Enquiries</span></Reveal>
          </div>
        </div>

        <section id="about">
          <div className="container about">
            <Reveal className="about-image reveal-left"><img src="/logo-javia.png" alt="Javia Global Inc." style={{maxWidth:'75%',height:'auto'}} /></Reveal>
            <Reveal className="reveal-right">
              <div className="eyebrow">About Javia Global Inc.</div>
              <h2>Building Reliable Global Trade Connections.</h2>
              <p>
                Javia Global Inc. is focused on import, export and global business development for construction
                chemicals and related building solutions.
              </p>
              <p>
                We support buyers, distributors and project companies looking for tile adhesives, grouts,
                waterproofing products, wall finishes, repair products and related construction solutions.
              </p>
              <div className="bullets">
                <div className="bullet"><b>✓</b> Product-focused sourcing</div>
                <div className="bullet"><b>✓</b> Export enquiries</div>
                <div className="bullet"><b>✓</b> Buyer coordination</div>
                <div className="bullet"><b>✓</b> Long-term partnerships</div>
              </div>
              <a className="btn primary" href="#contact">Start a Business Enquiry</a>
            </Reveal>
          </div>
        </section>

        <section className="dark" id="services">
          <div className="container">
            <Reveal className="section-head reveal-up">
              <div className="eyebrow">Our Services</div>
              <h2>From Product Selection To Global Delivery Coordination.</h2>
              <p>Trade support designed around construction-chemical and building-material products and international business enquiries.</p>
            </Reveal>

            <div className="services">
              {[
                ['🌍', 'Export Solutions', 'Support for international buyers seeking construction-chemical and building-material products, product information and commercial enquiries.'],
                ['📦', 'Product Sourcing', 'Product-focused sourcing and coordination across tile adhesives, grouts, waterproofing, repair and finishing categories.'],
                ['🤝', 'Buyer & Supplier Coordination', 'Clear communication between buyers, suppliers and trade partners to make enquiries easier to manage.'],
                ['🚢', 'Import Support', 'Support for businesses exploring construction-chemical and building-material products for import and distribution opportunities.'],
                ['📋', 'Product Information', 'Product descriptions, application areas, available packs and key features can be shared according to the selected product.'],
                ['🏗️', 'Project-Oriented Supply', 'Solutions for tile, stone, flooring, wall-finishing, waterproofing and concrete-related requirements.'],
              ].map(([icon, title, text], index) => (
                <Reveal
                  className={`service motion-card ${index % 2 === 0 ? 'reveal-left' : 'reveal-right'} reveal-delay-${(index % 3) + 1}`}
                  key={title}
                >
                  <div className="icon">{icon}</div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="products">
          <div className="container">
            <Reveal className="section-head reveal-up">
              <div className="eyebrow">Product Portfolio</div>
              <h2>Construction Chemical & Building Material Products</h2>
              <p>
                Product names, visuals and technical highlights are based on the supplied Extra Power
                construction-chemicals and building-materials brochure and organized into a Javia Global Inc. product catalogue.
              </p>
            </Reveal>

            <div className="category-tabs reveal reveal-scale">
              {tabs.map(([value, label]) => (
                <button
                  type="button"
                  className={`tab ${filter === value ? 'active' : ''}`}
                  key={value}
                  onClick={() => changeFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="products" id="productGrid">
              {paginatedProducts.map((product, index) => {
                const productKey = `${product.cat}-${product.name}`;
                const isFlipped = flippedProduct === productKey;

                return (
                  <article
                    className={`product product-animate motion-card flip-product ${isFlipped ? 'is-flipped' : ''}`}
                    key={`${filter}-${currentPage}-${productKey}`}
                    style={{ animationDelay: `${index * 85}ms` }}
                    onClick={() => toggleProductFlip(productKey)}
                    onKeyDown={(e) => handleProductKeyDown(e, productKey)}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isFlipped}
                    aria-label={`${product.name}. ${isFlipped ? 'Click to show product image' : 'Click to show product details'}`}
                  >
                    <div className="flip-card-inner">
                      <div className="flip-card-face flip-card-front">
                        <div className="product-img flip-front-img">
                          <img src={product.img} alt={product.name} loading="lazy" />
                          <span className="product-shine" aria-hidden="true" />
                          <span className="flip-corner-icon" aria-hidden="true">↻</span>
                        </div>

                        <div className="flip-front-body">
                          <span className="tag">{product.tag}</span>
                          <h3>{product.name}</h3>
                          <div className="flip-hint">
                            <span>Click to view details</span>
                            <b aria-hidden="true">→</b>
                          </div>
                        </div>
                      </div>

                      <div className="flip-card-face flip-card-back">
                        <div className="flip-back-glow" aria-hidden="true" />
                        <span className="flip-back-label">Product Details</span>
                        <span className="tag">{product.tag}</span>
                        <h3>{product.name}</h3>
                        <p>{product.desc}</p>
                        <ul>
                          {product.bullets.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                        <div className="flip-back-footer">
                          <span>Click to return</span>
                          <b aria-hidden="true">↺</b>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {visibleProducts.length > 0 && totalPages > 1 && (
              <div className="premium-pagination pagination-enter" aria-label="Product pagination">
                <div className="pagination-summary">
                  Showing <strong>{(currentPage - 1) * productsPerPage + 1}</strong>–
                  <strong>{Math.min(currentPage * productsPerPage, visibleProducts.length)}</strong> of{' '}
                  <strong>{visibleProducts.length}</strong> products
                </div>

                <div className="pagination-controls">
                  <button
                    type="button"
                    className="pagination-btn pagination-nav"
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous product page"
                  >
                    <span aria-hidden="true">←</span> Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      type="button"
                      className={`pagination-btn ${currentPage === page ? 'page-active' : ''}`}
                      key={page}
                      onClick={() => changePage(page)}
                      aria-current={currentPage === page ? 'page' : undefined}
                      aria-label={`Go to product page ${page}`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="pagination-btn pagination-nav"
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next product page"
                  >
                    Next <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="stats">
          <div className="container stats-grid">
            <Reveal className="stat reveal-scale reveal-delay-1"><CountUp end={products.length} /><span>Featured Products</span></Reveal>
            <Reveal className="stat reveal-scale reveal-delay-2"><CountUp end={5} /><span>Major Product Groups</span></Reveal>
            <Reveal className="stat reveal-scale reveal-delay-3"><CountUp end={100} suffix="%" /><span>Product-Catalogue Focus</span></Reveal>
            <Reveal className="stat reveal-scale reveal-delay-4"><strong className="stat-global">Global</strong><span>Import & Export Vision</span></Reveal>
          </div>
        </section>

        <section id="process">
          <div className="container">
            <Reveal className="section-head reveal-up">
              <div className="eyebrow">How We Work</div>
              <h2>A Simple, Professional Trade Process.</h2>
              <p>Designed to make international product enquiries straightforward from first contact to commercial coordination.</p>
            </Reveal>
            <Reveal className="process reveal-process">
              {[
                ['01', 'Requirement', 'Share the product, quantity, destination and application requirement.'],
                ['02', 'Product Selection', 'We identify the relevant product from the construction-chemical and building-material portfolio.'],
                ['03', 'Commercial Enquiry', 'Discuss packing, quantity, pricing and other business requirements.'],
                ['04', 'Trade Coordination', 'Coordinate the next steps with the relevant buyer, supplier and logistics partners.'],
              ].map(([number, title, text], index) => (
                <Reveal className={`step motion-card reveal-up reveal-delay-${index + 1}`} key={number}>
                  <div className="step-number">{number}</div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Reveal>
              ))}
            </Reveal>
          </div>
        </section>

        <section className="cta">
          <Reveal className="container reveal-scale">
            <h2>Looking For Construction Chemicals & Building Materials?</h2>
            <p>Tell us what you need and let Javia Global Inc. help you explore the right product and export-import opportunity.</p>
            <a className="btn primary" href="#contact">Send Your Requirement</a>
          </Reveal>
        </section>

        <section id="contact">
          <div className="container contact">
            <Reveal className="reveal-left">
              <div className="eyebrow">Contact Us</div>
              <h2 className="contact-title">Let's Build a Global Business Connection.</h2>
              <p className="contact-intro">
                For product enquiries, export opportunities, import requirements and distribution discussions,
                contact Javia Global Inc.
              </p>
              <div className="contact-box">
                <div className="contact-item"><b>Company</b>Javia Global Inc.</div>
                <div className="contact-item"><b>Email</b><a href="mailto:javiaglobalinc@gmail.com" style={{color:"var(--blue)"}}>javiaglobalinc@gmail.com</a></div>
                <div className="contact-item">
  <b>Phone</b>
  <a href="tel:+917016170203" style={{ color: "var(--blue)" }}>
    +91 70161 70203
  </a>
  ,{" "}
  <a href="tel:+919316401305" style={{ color: "var(--blue)" }}>
    +91 93164 01305
  </a>
</div>
                <div className="contact-item"><b>Location</b>Rajkot, Gujarat, India.</div>
              </div>
            </Reveal>

            <Reveal className="contact-box reveal-right">
              <h3>Request a Product Quote</h3>
              <form onSubmit={handleSubmit}>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Your Name" />
                <input name="email" value={form.email} onChange={handleChange} type="email" required placeholder="Email Address" />
                <input name="company" value={form.company} onChange={handleChange} placeholder="Company / Organization" />
                <input name="product" value={form.product} onChange={handleChange} placeholder="Product / Category" />
                <textarea name="message" value={form.message} onChange={handleChange} required placeholder="Quantity, destination and your requirement" />
                <button className="btn primary" type="submit">Send Enquiry</button>
              </form>
            </Reveal>
          </div>
        </section>
      </main>

     <footer>
  <div className="container footer">
    
    <div className="footer-company">
      <strong>JAVIA GLOBAL INC.</strong>
      <br />
      Import • Export • Construction Chemicals & Building Materials
    </div>

    <div className="footer-links">
      <a href="#about">About</a>
      <a href="#products">Products</a>
      <a href="#contact">Contact</a>
    </div>
<div className="footer-social">

  <a
    className="instagram"
    href="https://www.instagram.com/javia_globle_inc/"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FontAwesomeIcon icon={faInstagram} />
  </a>

  <a
    className="facebook"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FontAwesomeIcon icon={faFacebookF} />
  </a>

  <a
    className="linkedin"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FontAwesomeIcon icon={faLinkedinIn} />
  </a>

</div>

    <div className="footer-copyright">
      © 2026 Javia Global Inc. All Rights Reserved.
    </div>

  </div>
</footer>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919316401305?text=Hello!%20I%27m%20interested%20in%20your%20construction%20chemicals%20and%20building%20materials.%20Please%20share%20more%20details%20about%20your%20products."
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 32 32" width="28" height="28" fill="#fff">
          <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958a15.907 15.907 0 008.832 2.67C24.826 31.998 32 24.822 32 16.004 32 7.176 24.826 0 16.004 0zm9.334 22.622c-.396 1.114-1.95 2.04-3.198 2.31-.854.182-1.968.326-5.72-1.23-4.802-1.988-7.894-6.862-8.134-7.182-.23-.318-1.932-2.574-1.932-4.908s1.224-3.482 1.658-3.96c.434-.478.948-.598 1.264-.598.316 0 .632.002.908.016.292.016.682-.11 1.068.814.396.948 1.344 3.282 1.462 3.52.118.24.198.518.04.834-.158.318-.238.516-.476.794-.238.278-.5.622-.714.834-.238.238-.486.496-.208.972.278.476 1.236 2.04 2.654 3.306 1.822 1.628 3.358 2.132 3.834 2.37.476.238.754.198 1.032-.118.278-.318 1.186-1.382 1.504-1.858.316-.476.632-.396 1.068-.238.434.158 2.768 1.304 3.242 1.542.476.238.792.356.91.554.116.198.116 1.148-.28 2.262z"/>
        </svg>
      </a>
    </>
  );
}

export default App;
