/* ==========================================================================
   HK OPTENTRA CO., LIMITED — Global Corporate Site
   Single JavaScript file for the entire site. [复用-B]
   Responsibilities: shared header/footer injection, SEO configuration,
   JSON-LD, scroll observers, SVG sprite loading, navigation, form
   validation, news filtering, back-to-top.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     0. SITE CONFIGURATION  — single source of truth for company data
     ------------------------------------------------------------------ */
  var SITE = {
    company: 'HK OPTENTRA CO., LIMITED',
    companyShort: 'OPTENTRA',
    address: 'Room 701 (Unit 127), 7/F, Tower B, New Mandarin Plaza, 14 Science Museum Road, Tsim Sha Tsui East, Hong Kong',
    website: 'youyuance.com',
    url: 'https://youyuance.com/',
    emailSupport: 'support@youyuance.com',
    emailAccount: 'shiguoqing@youyuance.com',
    scope: 'Business strategy planning, management consultancy, brand advisory, general trading and e-commerce consultation',
    scopeItems: [
      'Business strategy planning',
      'Management consultancy',
      'Brand advisory',
      'General trading',
      'E-commerce consultation'
    ]
  };

  var NAV_ITEMS = [
    { label: 'Home', href: './', key: 'home' },
    { label: 'Services', href: 'services.html', key: 'services' },
    { label: 'Culture', href: 'culture.html', key: 'culture' },
    { label: 'News', href: 'news.html', key: 'news' },
    { label: 'Contact', href: 'contact.html', key: 'contact' }
  ];

  /* Home link behaves differently under file:// (directory index) vs http(s).
     See site note: href="./" resolves to a folder listing under file://. */
  var IS_FILE_PROTOCOL = (window.location.protocol === 'file:');
  var HOME_HREF = IS_FILE_PROTOCOL ? './index.html' : './';

  var ICONS = {
    logo: '<path d="M12 2.6 21.4 7v10L12 21.4 2.6 17V7L12 2.6Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 7.4 17 10v4.4L12 17l-5-2.6V10l5-2.6Z" fill="currentColor" opacity=".9"/><circle cx="12" cy="12" r="1.6" fill="#fff"/>',
    arrowRight: '<path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
    arrowUp: '<path d="M12 20V5M6 11l6-6 6 6" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
    mail: '<rect x="2.6" y="4.8" width="18.8" height="14.4" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="m3.4 6.6 8.6 6 8.6-6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    phone: '<path d="M7.2 3.6h3l1.5 3.8-2 1.4a11 11 0 0 0 5.5 5.5l1.4-2 3.8 1.5v3a1.8 1.8 0 0 1-2 1.8A15.4 15.4 0 0 1 5.4 5.6a1.8 1.8 0 0 1 1.8-2Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    mapPin: '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="10" r="2.6" fill="currentColor"/>',
    globe: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.2 12h17.6M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    chart: '<path d="M4 20V4M4 20h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="7.5" y="11" width="3.2" height="6" rx="1" fill="currentColor"/><rect x="13" y="7.5" width="3.2" height="9.5" rx="1" fill="currentColor" opacity=".75"/>',
    cart: '<circle cx="9.5" cy="19" r="1.6" fill="currentColor"/><circle cx="17.5" cy="19" r="1.6" fill="currentColor"/><path d="M3 4h2.6l2.3 10.4h9.6L20 7.4H6.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    truck: '<rect x="1.8" y="6.6" width="11.4" height="9" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M13.2 9.6h3.7l3.3 3.2v2.8h-7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="6.4" cy="18" r="1.8" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="16.6" cy="18" r="1.8" fill="none" stroke="currentColor" stroke-width="1.7"/>',
    shield: '<path d="M12 2.8 20 6v6c0 4.4-3.2 7.9-8 9.2C7.2 19.9 4 16.4 4 12V6l8-3.2Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m8.6 12 2.4 2.4 4.4-4.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    star: '<path d="m12 3.4 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6L3.2 9.8l6.1-.9L12 3.4Z" fill="currentColor"/>',
    check: '<path d="m4.5 12.5 5 5 10-11" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>',
    play: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10 8.4 16 12l-6 3.6V8.4Z" fill="currentColor"/>',
    download: '<path d="M12 3.6v11M7.5 10.2 12 14.7l4.5-4.5M4.4 19.4h15.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    apple: '<path d="M16.3 12.6c0-2.6 2.1-3.9 2.2-4-1.2-1.8-3.1-2-3.8-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.4-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.2-2.5 1-1.5 1.4-2.9 1.4-3-.1 0-2.7-1-2.9-3.8ZM13.9 4.8c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.2 1.1.1 2.3-.6 3-1.5Z" fill="currentColor"/>',
    googlePlay: '<path d="M4 3.4v17.2c0 .5.6.8 1 .5l9.4-9.1L5 2.9c-.4-.3-1 0-1 .5Z" fill="currentColor"/><path d="m14.4 12 2.6-2.5L6.2 3.3c-.3-.2-.6-.2-.9 0l9.1 8.7Z" fill="currentColor" opacity=".72"/><path d="m6.2 20.7 10.8-6.2L14.4 12 5.3 20.7c.3.2.6.2.9 0Z" fill="currentColor" opacity=".45"/><path d="m17.8 10.3 2.3-1.3c1-.6 1-.5 1.4-.2.4.3.4.9 0 1.2l-2.2 1.5-1.5-1.2Z" fill="currentColor" opacity=".9"/>',
    mobileApp: '<rect x="6.4" y="2.6" width="11.2" height="18.8" rx="2.6" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10.4 5.4h3.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="17.6" r="1.3" fill="currentColor"/>',
    settings: '<circle cx="12" cy="12" r="3.1" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M19.2 14.4a1.6 1.6 0 0 0 .3 1.8l.1.1a1.9 1.9 0 1 1-2.7 2.7l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5v.2a1.9 1.9 0 1 1-3.8 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a1.9 1.9 0 1 1-2.7-2.7l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3.3a1.9 1.9 0 1 1 0-3.8h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a1.9 1.9 0 1 1 2.7-2.7l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5V3.3a1.9 1.9 0 1 1 3.8 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a1.9 1.9 0 1 1 2.7 2.7l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1h.2a1.9 1.9 0 1 1 0 3.8h-.1a1.6 1.6 0 0 0-1.5 1Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    users: '<circle cx="9" cy="8" r="3.6" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M2.8 20.4a6.2 6.2 0 0 1 12.4 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M16 4.8a3.6 3.6 0 0 1 0 6.9M17.6 14.6a6.2 6.2 0 0 1 3.6 5.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    briefcase: '<rect x="2.6" y="7" width="18.8" height="13" rx="2.4" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M8.4 7V5.4a2 2 0 0 1 2-2h3.2a2 2 0 0 1 2 2V7M2.6 12.6h18.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m3.6 12.4 8.4 4.7 8.4-4.7M3.6 16.8l8.4 4.7 8.4-4.7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
    close: '<path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>'
  };

  function icon(name, cls) {
    var body = ICONS[name];
    if (!body) { return ''; }
    return '<svg class="' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + body + '</svg>';
  }

  /* ------------------------------------------------------------------
     1. UTILITIES
     ------------------------------------------------------------------ */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ------------------------------------------------------------------
     2. ACTIVE PAGE DETECTION
     ------------------------------------------------------------------ */
  function currentKey() {
    var path = window.location.pathname.replace(/\\/g, '/');
    var file = path.substring(path.lastIndexOf('/') + 1).toLowerCase();
    if (!file || file === 'index.html' || file === '') { return 'home'; }
    return file.replace('.html', '');
  }

  /* ------------------------------------------------------------------
     3. SHARED HEADER  [复用-C]
     ------------------------------------------------------------------ */
  function buildHeader() {
    var host = $('#site-header');
    if (!host) { return; }
    var active = currentKey();

    var navHtml = NAV_ITEMS.map(function (item) {
      var href = item.key === 'home' ? HOME_HREF : item.href;
      var cls = 'nav-link' + (item.key === active ? ' is-active' : '');
      var aria = item.key === active ? ' aria-current="page"' : '';
      return '<a class="' + cls + '" href="' + href + '"' + aria + '>' + esc(item.label) + '</a>';
    }).join('');

    var drawerHtml = NAV_ITEMS.map(function (item) {
      var href = item.key === 'home' ? HOME_HREF : item.href;
      var cls = 'm-link' + (item.key === active ? ' is-active' : '');
      var aria = item.key === active ? ' aria-current="page"' : '';
      return '<a class="' + cls + '" href="' + href + '"' + aria + '>' + esc(item.label) + icon('arrowRight') + '</a>';
    }).join('');

    host.className = 'site-header';
    host.innerHTML =
      '<div class="header-inner">' +
        '<a class="brand" href="' + HOME_HREF + '" aria-label="' + esc(SITE.company) + ' home">' +
          '<span class="brand-mark">' + icon('logo') + '</span>' +
          '<span class="brand-text">' + esc(SITE.companyShort) + '<small>Hong Kong</small></span>' +
        '</a>' +
        '<nav class="nav" aria-label="Primary">' + navHtml + '</nav>' +
        '<div class="header-actions">' +
          '<a class="btn btn--accent btn--sm" href="contact.html">Talk to an advisor</a>' +
          '<button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-drawer">' +
            icon('menu') + icon('close') +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="mobile-drawer" id="mobile-drawer">' +
        '<div class="mobile-drawer__inner">' + drawerHtml +
          '<a class="btn btn--accent" href="contact.html">Talk to an advisor</a>' +
        '</div>' +
      '</div>';

    /* Toggle icon swap */
    var toggle = $('.nav-toggle', host);
    var iconMenu = toggle.querySelector('svg:nth-of-type(1)');
    var iconClose = toggle.querySelector('svg:nth-of-type(2)');
    if (iconClose) { iconClose.style.display = 'none'; }

    var drawer = $('#mobile-drawer', host);
    toggle.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (iconMenu) { iconMenu.style.display = open ? 'none' : ''; }
      if (iconClose) { iconClose.style.display = open ? '' : 'none'; }
      document.body.classList.toggle('is-locked', open);
    });

    $$('.m-link', drawer).forEach(function (link) {
      link.addEventListener('click', function () {
        drawer.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        if (iconMenu) { iconMenu.style.display = ''; }
        if (iconClose) { iconClose.style.display = 'none'; }
        document.body.classList.remove('is-locked');
      });
    });
  }

  /* ------------------------------------------------------------------
     4. SHARED FOOTER  [复用-D]
     ------------------------------------------------------------------ */
  function buildFooter() {
    var host = $('#site-footer');
    if (!host) { return; }

    var year = new Date().getFullYear();

    host.className = 'site-footer';
    host.innerHTML =
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div class="footer-col footer-brand">' +
            '<a class="brand" href="' + HOME_HREF + '">' +
              '<span class="brand-mark">' + icon('logo') + '</span>' +
              '<span class="brand-text">' + esc(SITE.companyShort) + '<small>Hong Kong</small></span>' +
            '</a>' +
            '<p>' + esc(SITE.scope) + '.</p>' +
            '<p class="mt-4"><strong>Business support:</strong> <a href="mailto:' + SITE.emailSupport + '">' + SITE.emailSupport + '</a></p>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Company</h4>' +
            '<ul>' +
              NAV_ITEMS.map(function (item) {
                var href = item.key === 'home' ? HOME_HREF : item.href;
                return '<li><a href="' + href + '">' + esc(item.label) + '</a></li>';
              }).join('') +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Services</h4>' +
            '<ul>' +
              SITE.scopeItems.map(function (item) {
                return '<li><a href="services.html">' + esc(item) + '</a></li>';
              }).join('') +
            '</ul>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Contact</h4>' +
            '<ul class="footer-contact">' +
              '<li>' + icon('mapPin') + '<span><strong>Office</strong>' + esc(SITE.address) + '</span></li>' +
              '<li>' + icon('mail') + '<span><strong>Business support</strong><a href="mailto:' + SITE.emailSupport + '">' + SITE.emailSupport + '</a></span></li>' +
              '<li>' + icon('users') + '<span><strong>Key accounts</strong><a href="mailto:' + SITE.emailAccount + '">' + SITE.emailAccount + '</a></span></li>' +
              '<li>' + icon('globe') + '<span><strong>Website</strong><a href="' + SITE.url + '" rel="noopener">' + SITE.website + '</a></span></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<div>&copy; ' + year + ' ' + esc(SITE.company) + '. All rights reserved.</div>' +
          '<nav class="footer-legal" aria-label="Legal">' +
            '<a href="privacy.html">Privacy Policy</a><span class="dot">&bull;</span>' +
            '<a href="terms.html">Terms of Service</a><span class="dot">&bull;</span>' +
            '<a href="news.html">Newsroom</a>' +
          '</nav>' +
        '</div>' +
      '</div>' +
      '<div class="footer-mascot" data-mascot="cat" aria-hidden="true"></div>';
  }

  /* ------------------------------------------------------------------
     5. SEO CONFIGURATION  [复用-F]
     ------------------------------------------------------------------ */
  var SEO = {
    'home': {
      title: 'HK OPTENTRA CO., LIMITED | Business Strategy, Consultancy, Trading & E-commerce',
      description: 'HK OPTENTRA CO., LIMITED is a Hong Kong consultancy delivering business strategy planning, management consultancy, brand advisory, general trading and e-commerce consultation through a unified mobile management app.',
      canonical: 'https://youyuance.com/',
      og: 'https://youyuance.com/images/hero.png',
      twitter: 'summary_large_image'
    },
    'services': {
      title: 'Services | HK OPTENTRA CO., LIMITED',
      description: 'Explore the full service portfolio of HK OPTENTRA CO., LIMITED: business strategy planning, management consultancy, brand advisory, general trading and e-commerce consultation — plus the mobile management app for Google Play and the Apple App Store.',
      canonical: 'https://youyuance.com/services.html',
      og: 'https://youyuance.com/images/hero.png',
      twitter: 'summary_large_image'
    },
    'culture': {
      title: 'Our Culture | HK OPTENTRA CO., LIMITED',
      description: 'The mission, vision and values behind HK OPTENTRA CO., LIMITED — a Hong Kong team building accountable, technology-led business partnerships across markets.',
      canonical: 'https://youyuance.com/culture.html',
      og: 'https://youyuance.com/images/hero.png',
      twitter: 'summary_large_image'
    },
    'news': {
      title: 'Newsroom | HK OPTENTRA CO., LIMITED',
      description: 'Company news, market briefings, service announcements and app updates from HK OPTENTRA CO., LIMITED.',
      canonical: 'https://youyuance.com/news.html',
      og: 'https://youyuance.com/images/news-1.png',
      twitter: 'summary_large_image'
    },
    'contact': {
      title: 'Contact | HK OPTENTRA CO., LIMITED',
      description: 'Talk to HK OPTENTRA CO., LIMITED. Visit our Hong Kong office, email our business support team or send an enquiry through the online form.',
      canonical: 'https://youyuance.com/contact.html',
      og: 'https://youyuance.com/images/map.png',
      twitter: 'summary_large_image'
    },
    'privacy': {
      title: 'Privacy Policy | HK OPTENTRA CO., LIMITED',
      description: 'How HK OPTENTRA CO., LIMITED collects, uses, shares and protects personal data across its website and mobile applications, including advertising and analytics practices.',
      canonical: 'https://youyuance.com/privacy.html',
      og: 'https://youyuance.com/images/hero.png',
      twitter: 'summary'
    },
    'terms': {
      title: 'Terms of Service | HK OPTENTRA CO., LIMITED',
      description: 'The terms governing access to and use of the HK OPTENTRA CO., LIMITED website and mobile management applications, including licensing, payments, third-party services and dispute resolution.',
      canonical: 'https://youyuance.com/terms.html',
      og: 'https://youyuance.com/images/hero.png',
      twitter: 'summary'
    }
  };

  function applySEO() {
    var key = currentKey();
    var cfg = SEO[key];
    if (!cfg) { return; }

    var page = document.body.getAttribute('data-page');

    function set(selector, attr, value) {
      var el = $(selector);
      if (el) { el.setAttribute(attr, value); }
    }

    document.title = cfg.title;
    set('meta[name="description"]', 'content', cfg.description);
    set('meta[name="keywords"]', 'content', 'business strategy planning, management consultancy, brand advisory, general trading, e-commerce consultation, Hong Kong, mobile management app');
    set('link[rel="canonical"]', 'href', cfg.canonical);
    set('meta[property="og:title"]', 'content', cfg.title);
    set('meta[property="og:description"]', 'content', cfg.description);
    set('meta[property="og:url"]', 'content', cfg.canonical);
    set('meta[property="og:type"]', 'content', page === 'home' ? 'website' : 'article');
    set('meta[property="og:image"]', 'content', cfg.og);
    set('meta[property="og:site_name"]', 'content', SITE.company);
    set('meta[name="twitter:card"]', 'content', cfg.twitter);
    set('meta[name="twitter:title"]', 'content', cfg.title);
    set('meta[name="twitter:description"]', 'content', cfg.description);
    set('meta[name="twitter:image"]', 'content', cfg.og);
  }

  /* ------------------------------------------------------------------
     6. JSON-LD ORGANIZATION
     ------------------------------------------------------------------ */
  function injectJSONLD() {
    var data = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE.company,
      legalName: SITE.company,
      url: SITE.url,
      email: SITE.emailSupport,
      description: SITE.scope,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Room 701 (Unit 127), 7/F, Tower B, New Mandarin Plaza',
        addressLocality: 'Tsim Sha Tsui East',
        addressRegion: 'Hong Kong',
        addressCountry: 'HK'
      },
      contactPoint: [{
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: SITE.emailSupport,
        availableLanguage: ['English', 'Chinese']
      }],
      sameAs: [
        'https://youyuance.com/',
        'https://youyuance.com/services.html',
        'https://youyuance.com/news.html'
      ],
      knowsAbout: SITE.scopeItems
    };

    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(script);
  }

  /* ------------------------------------------------------------------
     7. SVG SPRITE LOADER  [复用-E]
     ------------------------------------------------------------------ */
  function injectSprite() {
    var hosts = $$('[data-mascot]');
    if (!hosts.length) { return Promise.resolve(false); }

    function load() {
      if (typeof fetch === 'function') {
        return fetch('images/sprite.svg')
          .then(function (res) {
            if (!res.ok) { throw new Error('HTTP ' + res.status); }
            return res.text();
          })
          .catch(function () { return loadViaXHR(); });
      }
      return loadViaXHR();
    }

    function loadViaXHR() {
      return new Promise(function (resolve, reject) {
        try {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', 'images/sprite.svg', true);
          xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) { return; }
            if (xhr.status === 200 || (xhr.status === 0 && xhr.responseText)) {
              resolve(xhr.responseText);
            } else {
              reject(new Error('HTTP ' + xhr.status));
            }
          };
          xhr.onerror = function () { reject(new Error('XHR failed')); };
          xhr.send(null);
        } catch (err) {
          reject(err);
        }
      });
    }

    return load()
      .then(function (text) {
        var holder = document.createElement('div');
        holder.style.display = 'none';
        holder.innerHTML = text;
        document.body.insertBefore(holder, document.body.firstChild);
        var svg = holder.querySelector('svg');
        if (svg) {
          svg.setAttribute('aria-hidden', 'true');
          svg.setAttribute('focusable', 'false');
          svg.style.position = 'absolute';
          svg.style.width = '0';
          svg.style.height = '0';
          svg.style.overflow = 'hidden';
          svg.style.visibility = 'hidden';
        }
        replaceMascots();
        return true;
      })
      .catch(function () {
        /* Graceful degradation: replace placeholders with a neutral badge */
        hosts.forEach(function (host) {
          host.innerHTML = '<span class="mascot mascot--' + (host.getAttribute('data-mascot-size') || '') +
            '" aria-hidden="true" style="display:block;border-radius:50%;background:' +
            'linear-gradient(140deg,#2f63dd,#133c9b)"></span>';
        });
        return false;
      });
  }

  function replaceMascots() {
    $$('[data-mascot]').forEach(function (host) {
      if (host.getAttribute('data-mascot-done') === '1') { return; }
      var id = host.getAttribute('data-mascot');
      if (!id) { return; }
      var size = host.getAttribute('data-mascot-size') || '';
      var cls = 'mascot' + (size ? ' mascot--' + size : '');
      var existing = document.getElementById(id);
      if (!existing) { return; }
      host.innerHTML = '<svg class="' + cls + '" viewBox="0 0 64 64" aria-hidden="true" focusable="false">' +
        '<use href="#' + id + '"></use></svg>';
      host.setAttribute('data-mascot-done', '1');
    });
  }

  /* ------------------------------------------------------------------
     8. SCROLL REVEAL OBSERVER  [复用-G]
     ------------------------------------------------------------------ */
  function initReveal() {
    var items = $$('.reveal, .stagger');
    if (!items.length) { return; }

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------
     9. STAT COUNTERS
     ------------------------------------------------------------------ */
  function initCounters() {
    var counters = $$('[data-count]');
    if (!counters.length) { return; }

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      var decimals = (el.getAttribute('data-decimals') || '0') | 0;
      var dur = 1400;
      var start = null;

      function step(ts) {
        if (start === null) { start = ts; }
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var value = target * eased;
        el.textContent = value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
        if (p < 1) { window.requestAnimationFrame(step); }
      }
      window.requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(run);
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          run(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { obs.observe(el); });
  }

  /* ------------------------------------------------------------------
     10. HEADER SCROLL STATE + BACK TO TOP
     ------------------------------------------------------------------ */
  function initScrollUI() {
    var header = $('#site-header');
    var toTop = document.createElement('button');
    toTop.className = 'to-top';
    toTop.type = 'button';
    toTop.setAttribute('aria-label', 'Back to top');
    toTop.innerHTML = icon('arrowUp');
    document.body.appendChild(toTop);

    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    var ticking = false;
    function onScroll() {
      if (ticking) { return; }
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.pageYOffset || document.documentElement.scrollTop;
        if (header) { header.classList.toggle('is-scrolled', y > 24); }
        toTop.classList.toggle('is-visible', y > 520);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------------------------------------------------------------------
     11. SMOOTH ANCHOR SCROLL
     ------------------------------------------------------------------ */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!link) { return; }
      var id = link.getAttribute('href');
      if (!id || id === '#') { return; }
      var target = document.querySelector(id);
      if (!target) { return; }
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 78;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     12. NEWS FILTER  (data-filter)
     ------------------------------------------------------------------ */
  function initNewsFilter() {
    var filters = $$('[data-filter]');
    if (!filters.length) { return; }

    var cards = $$('[data-category]');

    function apply(value) {
      var shown = 0;
      cards.forEach(function (card) {
        var match = (value === 'all') || (card.getAttribute('data-category') === value);
        card.classList.toggle('is-hidden', !match);
        if (match) { shown++; }
      });
      filters.forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-filter') === value);
      });
      var counter = $('[data-filter-count]');
      if (counter) { counter.textContent = String(shown); }
      var empty = $('[data-filter-empty]');
      if (empty) { empty.classList.toggle('hide', shown !== 0); }
    }

    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        apply(btn.getAttribute('data-filter'));
      });
    });

    apply('all');
  }

  /* ------------------------------------------------------------------
     13. CONTACT FORM VALIDATION
     ------------------------------------------------------------------ */
  function initForm() {
    var form = $('#contact-form');
    if (!form) { return; }

    var status = $('[data-form-status]', form);

    function setError(field, message) {
      var wrap = field.closest('.field');
      if (!wrap) { return; }
      var box = $('.field__error', wrap);
      if (message) {
        wrap.classList.add('has-error');
        field.setAttribute('aria-invalid', 'true');
        if (box) { box.textContent = message; }
      } else {
        wrap.classList.remove('has-error');
        field.removeAttribute('aria-invalid');
      }
    }

    function validate() {
      var ok = true;
      var name = $('#cf-name', form);
      var email = $('#cf-email', form);
      var company = $('#cf-company', form);
      var message = $('#cf-message', form);
      var consent = $('#cf-consent', form);

      if (!name.value.trim()) { setError(name, 'Please tell us your name.'); ok = false; } else { setError(name, ''); }
      if (!email.value.trim()) {
        setError(email, 'We need an email address to reply.');
        ok = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        setError(email, 'That email address does not look right.');
        ok = false;
      } else { setError(email, ''); }
      if (!company.value.trim()) { setError(company, 'Please add your company name.'); ok = false; } else { setError(company, ''); }
      if (message.value.trim().length < 10) { setError(message, 'A little more detail helps us route your enquiry.'); ok = false; } else { setError(message, ''); }
      if (!consent.checked) {
        setError(consent, 'Please accept the privacy and terms to continue.');
        ok = false;
      } else { setError(consent, ''); }
      return ok;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) {
        if (status) { status.classList.remove('is-visible'); }
        var firstError = $('.field.has-error .input, .field.has-error .textarea, .field.has-error input', form);
        if (firstError) { firstError.focus(); }
        return;
      }
      if (status) {
        status.classList.add('is-visible');
        status.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });

    $$('.input, .textarea, input[type="checkbox"]', form).forEach(function (el) {
      el.addEventListener('blur', function () {
        if (el.closest('.field').classList.contains('has-error')) { validate(); }
      });
    });
  }

  /* ------------------------------------------------------------------
     14. HOME LINK SAFETY UNDER file://
     ------------------------------------------------------------------ */
  function fixHomeLinks() {
    if (!IS_FILE_PROTOCOL) { return; }
    $$('a[href="./"]').forEach(function (a) {
      a.setAttribute('href', HOME_HREF);
    });
  }

  /* ------------------------------------------------------------------
     15. BOOT
     ------------------------------------------------------------------ */
  function boot() {
    buildHeader();
    buildFooter();
    applySEO();
    injectJSONLD();
    fixHomeLinks();

    initReveal();
    initCounters();
    initScrollUI();
    initSmoothScroll();
    initNewsFilter();
    initForm();

    injectSprite().then(function () {
      fixHomeLinks();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
