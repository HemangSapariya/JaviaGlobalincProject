import React, { useEffect, useMemo, useState } from 'react';
import { products } from './products';

const tabs = [
  ['all', 'All Products'],
  ['tile', 'Tile & Stone'],
  ['wall', 'Wall & Finish'],
  ['water', 'Waterproofing'],
  ['concrete', 'Concrete & Repair'],
];

function Reveal({ children, className = '' }) {
  return <div className={`reveal ${className}`.trim()}>{children}</div>;
}

function App() {
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filter]);

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
  };

  const changePage = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    if (nextPage === currentPage) return;

    setCurrentPage(nextPage);

    window.requestAnimationFrame(() => {
      document.getElementById('productGrid')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
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
    window.location.href = `mailto:info@javiaglobalinc.com?subject=${subject}&body=${body}`;
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
            <div className="eyebrow">Import • Export • Global Supply</div>
            <h1>Construction Chemicals That Move Beyond Borders.</h1>
            <p>
              Javia Global Inc. connects quality construction-chemical products with international buyers,
              distributors and project requirements through professional sourcing, export coordination and
              dependable trade support.
            </p>
            <a className="btn primary" href="#products">Explore Products</a>
            <a className="btn outline" href="#contact">Request a Quote</a>
          </div>
        </section>

        <div className="container trustbar">
          <div className="trustgrid">
            <div className="trust"><strong>28+</strong><span>Product Categories</span></div>
            <div className="trust"><strong>Global</strong><span>Trade Focus</span></div>
            <div className="trust"><strong>Quality</strong><span>Focused Supply</span></div>
            <div className="trust"><strong>Direct</strong><span>Business Enquiries</span></div>
          </div>
        </div>

        <section id="about">
          <div className="container about">
            <Reveal className="about-image" />
            <Reveal>
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
            <div className="section-head">
              <div className="eyebrow">Our Services</div>
              <h2>From Product Selection To Global Delivery Coordination.</h2>
              <p>Trade support designed around construction-chemical products and international business enquiries.</p>
            </div>

            <div className="services">
              {[
                ['🌍', 'Export Solutions', 'Support for international buyers seeking construction-chemical products, product information and commercial enquiries.'],
                ['📦', 'Product Sourcing', 'Product-focused sourcing and coordination across tile adhesives, grouts, waterproofing, repair and finishing categories.'],
                ['🤝', 'Buyer & Supplier Coordination', 'Clear communication between buyers, suppliers and trade partners to make enquiries easier to manage.'],
                ['🚢', 'Import Support', 'Support for businesses exploring construction-chemical products for import and distribution opportunities.'],
                ['📋', 'Product Information', 'Product descriptions, application areas, available packs and key features can be shared according to the selected product.'],
                ['🏗️', 'Project-Oriented Supply', 'Solutions for tile, stone, flooring, wall-finishing, waterproofing and concrete-related requirements.'],
              ].map(([icon, title, text]) => (
                <Reveal className="service" key={title}>
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
            <div className="section-head">
              <div className="eyebrow">Product Portfolio</div>
              <h2>Construction Chemical Products</h2>
              <p>
                Product names, visuals and technical highlights are based on the supplied Extra Power
                construction-chemicals brochure and organized into a Javia Global Inc. product catalogue.
              </p>
            </div>

            <div className="category-tabs">
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
              {paginatedProducts.map((product, index) => (
                <article
                  className="product product-animate"
                  key={`${filter}-${currentPage}-${product.cat}-${product.name}`}
                  style={{ animationDelay: `${index * 85}ms` }}
                >
                  <div className="product-img">
                    <img src={product.img} alt={product.name} loading="lazy" />
                    <span className="product-shine" aria-hidden="true" />
                  </div>
                  <div className="product-body">
                    <span className="tag">{product.tag}</span>
                    <h3>{product.name}</h3>
                    <p>{product.desc}</p>
                    <ul>
                      {product.bullets.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </article>
              ))}
            </div>

            {visibleProducts.length > 0 && (
              <div className="product-pagination" aria-label="Product pagination">
                <div className="pagination-info">
                  Showing {(currentPage - 1) * productsPerPage + 1}–
                  {Math.min(currentPage * productsPerPage, visibleProducts.length)} of {visibleProducts.length} products
                </div>

                <div className="pagination-controls">
                  <button
                    type="button"
                    className="page-btn page-nav"
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous product page"
                  >
                    ‹ <span>Prev</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      type="button"
                      className={`page-btn ${currentPage === page ? 'active' : ''}`}
                      key={page}
                      onClick={() => changePage(page)}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="page-btn page-nav"
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next product page"
                  >
                    <span>Next</span> ›
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="stats">
          <div className="container stats-grid">
            <Reveal className="stat"><strong>{products.length}</strong><span>Featured Products</span></Reveal>
            <Reveal className="stat"><strong>5</strong><span>Major Product Groups</span></Reveal>
            <Reveal className="stat"><strong>100%</strong><span>Product-Catalogue Focus</span></Reveal>
            <Reveal className="stat"><strong>Global</strong><span>Import & Export Vision</span></Reveal>
          </div>
        </section>

        <section id="process">
          <div className="container">
            <div className="section-head">
              <div className="eyebrow">How We Work</div>
              <h2>A Simple, Professional Trade Process.</h2>
              <p>Designed to make international product enquiries straightforward from first contact to commercial coordination.</p>
            </div>
            <div className="process">
              {[
                ['01', 'Requirement', 'Share the product, quantity, destination and application requirement.'],
                ['02', 'Product Selection', 'We identify the relevant product from the construction-chemical portfolio.'],
                ['03', 'Commercial Enquiry', 'Discuss packing, quantity, pricing and other business requirements.'],
                ['04', 'Trade Coordination', 'Coordinate the next steps with the relevant buyer, supplier and logistics partners.'],
              ].map(([number, title, text]) => (
                <Reveal className="step" key={number}>
                  <div className="step-number">{number}</div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="container">
            <h2>Looking For Construction Chemicals?</h2>
            <p>Tell us what you need and let Javia Global Inc. help you explore the right product and export-import opportunity.</p>
            <a className="btn primary" href="#contact">Send Your Requirement</a>
          </div>
        </section>

        <section id="contact">
          <div className="container contact">
            <div>
              <div className="eyebrow">Contact Us</div>
              <h2 className="contact-title">Let's Build a Global Business Connection.</h2>
              <p className="contact-intro">
                For product enquiries, export opportunities, import requirements and distribution discussions,
                contact Javia Global Inc.
              </p>
              <div className="contact-box">
                <div className="contact-item"><b>Company</b>Javia Global Inc.</div>
                <div className="contact-item"><b>Email</b>info@javiaglobalinc.com</div>
                <div className="contact-item"><b>Phone</b>+91 XXXXX XXXXX</div>
                <div className="contact-item"><b>Location</b>Gujarat, India</div>
              </div>
            </div>

            <div className="contact-box">
              <h3>Request a Product Quote</h3>
              <form onSubmit={handleSubmit}>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Your Name" />
                <input name="email" value={form.email} onChange={handleChange} type="email" required placeholder="Email Address" />
                <input name="company" value={form.company} onChange={handleChange} placeholder="Company / Organization" />
                <input name="product" value={form.product} onChange={handleChange} placeholder="Product / Category" />
                <textarea name="message" value={form.message} onChange={handleChange} required placeholder="Quantity, destination and your requirement" />
                <button className="btn primary" type="submit">Send Enquiry</button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer">
          <div><strong>JAVIA GLOBAL INC.</strong><br />Import • Export • Construction Chemicals</div>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#products">Products</a>
            <a href="#contact">Contact</a>
          </div>
          <div>© 2026 Javia Global Inc. All Rights Reserved.</div>
        </div>
      </footer>
    </>
  );
}

export default App;
