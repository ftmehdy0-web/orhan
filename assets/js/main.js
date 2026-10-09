/**
 * Orhan India - Main Interaction Engine (Burger King India Style)
 */

document.addEventListener('DOMContentLoaded', () => {
  window.orhanParticles = new EmberCanvasEngine('ember-canvas');
  window.orhanBuilder = new BurgerBuilderEngine();
  window.orhanCart = new OrhanCartEngine();

  initNavigation();
  initOrderModeToggle();
  initLocationSelector();
  initPromoBannerCarousel();
  initCategoryStrip();
  initMenuRenderer();
  initHeroExplodedBurger();
  initGrillSimulator();
  initReservationModal();
});

/* -------------------------------------------------------------
 * 1. Navigation & Header
 * ------------------------------------------------------------- */
function initNavigation() {
  const header = document.getElementById('main-header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const backdrop = document.getElementById('nav-backdrop');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  function closeMobileNav() {
    if (mobileToggle) mobileToggle.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMobileNav() {
    if (mobileToggle) mobileToggle.classList.add('active');
    if (navMenu) navMenu.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.orhanAudio) window.orhanAudio.playClick();
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', () => {
        closeMobileNav();
        if (window.orhanAudio) window.orhanAudio.playClick();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => {
        closeMobileNav();
      });
    }

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });
  }
}

/* -------------------------------------------------------------
 * 2. Order Mode Toggle (Delivery / Dine-in / Takeaway)
 * ------------------------------------------------------------- */
function initOrderModeToggle() {
  const modeBtns = document.querySelectorAll('.order-mode-btn');
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.mode;
      const label = document.getElementById('selected-order-mode-label');
      if (label) label.textContent = mode.toUpperCase();
      if (window.orhanAudio) window.orhanAudio.playClick();
    });
  });
}

/* -------------------------------------------------------------
 * 3. Location Selector Dropdown
 * ------------------------------------------------------------- */
function initLocationSelector() {
  const locSelect = document.getElementById('location-dropdown');
  const locDisplay = document.getElementById('current-location-text');
  const drawerLoc = document.getElementById('mobile-drawer-loc');
  const cartLoc = document.getElementById('cart-deliv-loc');

  if (locSelect) {
    locSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (locDisplay) locDisplay.textContent = selected;
      if (drawerLoc) drawerLoc.textContent = selected;
      if (cartLoc) cartLoc.textContent = selected;
      if (window.orhanCart) {
        window.orhanCart.showToast(`Delivery location set to: ${selected}`);
      }
      if (window.orhanAudio) window.orhanAudio.playClick();
    });
  }
}

/* -------------------------------------------------------------
 * 4. Promotional Banners Carousel
 * ------------------------------------------------------------- */
function initPromoBannerCarousel() {
  const track = document.getElementById('promo-banners-track');
  const slides = document.querySelectorAll('.promo-banner-slide');
  const prevBtn = document.getElementById('banner-prev-btn');
  const nextBtn = document.getElementById('banner-next-btn');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const total = slides.length;

  function updateSlide(index) {
    currentIndex = (index + total) % total;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateSlide(currentIndex + 1);
      if (window.orhanAudio) window.orhanAudio.playClick();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateSlide(currentIndex - 1);
      if (window.orhanAudio) window.orhanAudio.playClick();
    });
  }

  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        updateSlide(currentIndex + 1);
      } else {
        updateSlide(currentIndex - 1);
      }
      if (window.orhanAudio) window.orhanAudio.playClick();
    }
  }, { passive: true });

  // Auto rotate banners every 6 seconds
  setInterval(() => {
    updateSlide(currentIndex + 1);
  }, 6000);
}

/* -------------------------------------------------------------
 * 5. Category Strip Navigation
 * ------------------------------------------------------------- */
function initCategoryStrip() {
  const strip = document.getElementById('bk-categories-strip');
  const cats = window.ORHAN_CATEGORIES || [];
  if (!strip || cats.length === 0) return;

  strip.innerHTML = cats.map(c => `
    <button class="cat-pill-btn ${c.id === 'all' ? 'active' : ''}" data-cat="${c.id}">
      <span class="cat-pill-icon">${c.icon}</span>
      <span class="cat-pill-name">${c.name}</span>
    </button>
  `).join('');

  strip.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-pill-btn');
    if (!btn) return;

    strip.querySelectorAll('.cat-pill-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Auto-scroll the active pill into horizontal view on mobile
    btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

    const catId = btn.dataset.cat;
    if (window.setMenuCategory) {
      window.setMenuCategory(catId);
    }
    if (window.orhanAudio) window.orhanAudio.playClick();
  });
}

/* -------------------------------------------------------------
 * 6. Curated Menu Renderer (BK India Format with Veg/Non-Veg)
 * ------------------------------------------------------------- */
function initMenuRenderer() {
  const grid = document.getElementById('menu-items-grid');
  const searchInput = document.getElementById('menu-search-input');
  const vegToggleBtns = document.querySelectorAll('.diet-filter-btn');
  const products = window.ORHAN_PRODUCTS || [];

  let currentCategory = 'all';
  let currentDiet = 'all'; // 'all', 'veg', 'non-veg'
  let searchQuery = '';

  window.setMenuCategory = function(catId) {
    currentCategory = catId;
    render();
  };

  function render() {
    if (!grid) return;

    const filtered = products.filter(p => {
      const matchCat = currentCategory === 'all' || p.category === currentCategory;
      const matchDiet = currentDiet === 'all' || 
        (currentDiet === 'veg' && p.isVeg) || 
        (currentDiet === 'non-veg' && !p.isVeg);
      const matchSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery) ||
        p.description.toLowerCase().includes(searchQuery);

      return matchCat && matchDiet && matchSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-menu-message">
          <p>No delicious items match your search. Try switching Veg/Non-Veg filter or searching for Whopper®.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(item => {
      const cartItem = (window.orhanCart?.items || []).find(ci => ci.id === item.id);
      const inCartQty = cartItem ? cartItem.quantity : 0;

      return `
        <div class="menu-card" data-id="${item.id}" data-category="${item.category}">
          <div class="menu-card-media">
            <span class="diet-icon-badge ${item.isVeg ? 'veg' : 'non-veg'}" title="${item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}">
              <span class="diet-dot"></span>
            </span>
            ${item.tag ? `<span class="menu-card-tag">${item.tag}</span>` : ''}
            <img src="${item.image}" alt="${item.name}" loading="lazy" class="menu-card-img" onerror="this.src='assets/images/orhan-hero-burger.jpg'"/>
            ${item.customisable ? `<span class="custom-available-tag">Customisable</span>` : ''}
          </div>
          <div class="menu-card-body">
            <div class="menu-card-header">
              <h3 class="menu-card-title">${item.name}</h3>
              <span class="menu-card-price">₹${item.price}</span>
            </div>
            <p class="menu-card-desc">${item.description}</p>
            <div class="menu-card-meta-line">
              <span>🔥 ${item.calories}</span>
              <span>⭐ ${item.rating} (${item.reviewsCount}+)</span>
            </div>
            <div class="menu-card-footer">
              <button class="menu-detail-btn" onclick="openProductModal('${item.id}')">View Details</button>
              
              <div class="card-action-container" id="action-container-${item.id}">
                ${inCartQty > 0 ? `
                  <div class="card-stepper-btn">
                    <button class="step-ctrl" onclick="handleCardQtyChange('${item.id}', -1)">-</button>
                    <span class="step-num">${inCartQty}</span>
                    <button class="step-ctrl" onclick="handleCardQtyChange('${item.id}', 1)">+</button>
                  </div>
                ` : `
                  <button class="btn-bk-add" onclick="handleMenuAddToCart('${item.id}')">
                    <span>+ ADD</span>
                  </button>
                `}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Veg / Non-Veg Switcher
  vegToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      vegToggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDiet = btn.dataset.diet;
      if (window.orhanAudio) window.orhanAudio.playClick();
      render();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      render();
    }, { passive: true });
  }

  // Re-render when cart changes so button counters stay in sync
  window.refreshMenuGrid = render;

  render();
}

window.handleMenuAddToCart = function(productId) {
  const product = (window.ORHAN_PRODUCTS || []).find(p => p.id === productId);
  if (!product) return;

  if (window.orhanCart) {
    window.orhanCart.addItem(product);
  }
  if (window.orhanAudio) {
    window.orhanAudio.playAddToCart();
  }
  if (window.refreshMenuGrid) {
    window.refreshMenuGrid();
  }
};

window.handleCardQtyChange = function(productId, change) {
  if (window.orhanCart) {
    window.orhanCart.updateQuantity(productId, change);
  }
  if (window.refreshMenuGrid) {
    window.refreshMenuGrid();
  }
};

window.openProductModal = function(productId) {
  const product = (window.ORHAN_PRODUCTS || []).find(p => p.id === productId);
  if (!product) return;

  const modal = document.getElementById('product-detail-modal');
  const modalBody = document.getElementById('product-modal-body');
  if (!modal || !modalBody) return;

  modalBody.innerHTML = `
    <div class="modal-product-layout">
      <div class="modal-product-image-wrap">
        <span class="diet-icon-badge ${product.isVeg ? 'veg' : 'non-veg'}" style="position:absolute; top:12px; left:12px; z-index:3;">
          <span class="diet-dot"></span>
        </span>
        <img src="${product.image}" alt="${product.name}" class="modal-product-image" onerror="this.src='assets/images/orhan-hero-burger.jpg'"/>
        <span class="modal-product-badge">${product.tag || 'Specialty'}</span>
      </div>
      <div class="modal-product-info">
        <div class="modal-header-line">
          <h2>${product.name}</h2>
          <span class="modal-price">₹${product.price}</span>
        </div>
        <p class="modal-desc">${product.description}</p>
        
        <div class="modal-spec-grid">
          <div class="spec-box">
            <span class="spec-label">Dietary</span>
            <span class="spec-val">${product.isVeg ? '🟢 100% Pure Veg' : '🔴 Non-Veg (Poultry/Meat)'}</span>
          </div>
          <div class="spec-box">
            <span class="spec-label">Energy</span>
            <span class="spec-val">${product.calories}</span>
          </div>
          <div class="spec-box">
            <span class="spec-label">Rating</span>
            <span class="spec-val">⭐ ${product.rating} / 5</span>
          </div>
        </div>

        <div class="modal-pairing-card" style="margin-top: 1rem;">
          <span class="pairing-icon">🍟</span>
          <div>
            <strong>Chef's Meal Pairing Suggestion:</strong>
            <p>Upgrade to a King Meal with Peri Peri Fries and Chilled Coke for complete satisfaction.</p>
          </div>
        </div>

        <button class="btn-primary" style="width: 100%; margin-top: 1.5rem;" onclick="handleMenuAddToCart('${product.id}'); document.getElementById('product-detail-modal').classList.remove('active');">
          Add To Order — ₹${product.price}
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
  if (window.orhanAudio) window.orhanAudio.playClick();
};

document.addEventListener('click', (e) => {
  if (e.target.id === 'close-product-modal' || e.target.closest('#close-product-modal')) {
    const modal = document.getElementById('product-detail-modal');
    if (modal) modal.classList.remove('active');
  }
});

/* -------------------------------------------------------------
 * 7. Anatomy Exploded Burger Showcase
 * ------------------------------------------------------------- */
function initHeroExplodedBurger() {
  const slider = document.getElementById('explosion-slider');
  if (!slider) return;
  const layers = document.querySelectorAll('.anatomy-layer');
  const hotspotPills = document.querySelectorAll('.hotspot-pill');
  const infoTitle = document.getElementById('anatomy-layer-title');
  const infoDesc = document.getElementById('anatomy-layer-desc');
  const infoBadge = document.getElementById('anatomy-layer-badge');

  const layerData = {
    'bun-top': {
      title: "5-Inch Toasted Sesame Seed Bun",
      badge: "Signature Softness",
      desc: "Toasted golden brown with crunchy roasted sesame seeds, soft crumb that holds all sauces and meat juices."
    },
    'sauce-truffle': {
      title: "Creamy Signature Flame Mayo",
      badge: "Secret House Emulsion",
      desc: "Whipped creamy emulsion with subtle garlic, cracked black pepper, and vinegar tang."
    },
    'greens': {
      title: "Fresh Hand-Cut Iceberg Lettuce",
      badge: "Farm Crisp",
      desc: "Cold crisp shredded iceberg lettuce providing the ultimate refreshing crunch."
    },
    'cheese': {
      title: "American Cheddar Melt",
      badge: "Gooey Cheddar",
      desc: "Melted over the flame-grilled patty for a rich savory finish."
    },
    'pancetta': {
      title: "Crispy Grilled Onion Rings & Pickles",
      badge: "Zesty Crunch",
      desc: "Fresh sliced white onions and sour dill pickle slices balancing the rich grilled patty."
    },
    'patty': {
      title: "100% Flame-Grilled Patty",
      badge: "Flame-Grilled at 800°F",
      desc: "Seared over white Binchotan fire so fat drips onto the embers, infusing authentic smoky barbecue flavor."
    },
    'bun-bottom': {
      title: "Toasted Bun Heel",
      badge: "Sturdy Foundation",
      desc: "Toasted flat to seal against sauces and maintain structural integrity to the last bite."
    }
  };

  function updateExplosion(val) {
    const factor = val / 100;
    layers.forEach(layer => {
      const spread = parseFloat(layer.dataset.spread || 0);
      const translateY = spread * factor;
      layer.style.transform = `translateY(${translateY}px)`;
    });
  }

  if (slider) {
    slider.addEventListener('input', (e) => {
      updateExplosion(e.target.value);
    }, { passive: true });
    updateExplosion(slider.value);
  }

  hotspotPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const targetLayer = pill.dataset.layer;
      if (layerData[targetLayer]) {
        const d = layerData[targetLayer];
        if (infoTitle) infoTitle.textContent = d.title;
        if (infoBadge) infoBadge.textContent = d.badge;
        if (infoDesc) infoDesc.textContent = d.desc;
      }
      hotspotPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      layers.forEach(l => {
        if (l.dataset.layer === targetLayer) {
          l.classList.add('highlight');
        } else {
          l.classList.remove('highlight');
        }
      });

      if (window.orhanAudio) window.orhanAudio.playClick();
    });
  });
}

/* -------------------------------------------------------------
 * 8. Secret Flame Grill Simulator
 * ------------------------------------------------------------- */
function initGrillSimulator() {
  const tempSlider = document.getElementById('grill-temp-slider');
  const tempDisplay = document.getElementById('grill-temp-val');
  const statusDisplay = document.getElementById('grill-sear-status');
  const flipBtn = document.getElementById('btn-flip-patty');
  const pattyElem = document.getElementById('sim-grill-patty');
  const sizzleVisual = document.getElementById('sim-grill-flames');

  let isFlipped = false;

  if (tempSlider) {
    tempSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      if (tempDisplay) tempDisplay.textContent = `${val}°F`;

      let status = "Mild Warmth";
      if (val < 450) {
        status = "Gentle Warmth (350°F - 450°F)";
      } else if (val < 700) {
        status = "Whopper Flame Sear (450°F - 700°F)";
      } else {
        status = "MAX FLAME CHARCOAL (700°F - 950°F)";
      }

      if (statusDisplay) statusDisplay.textContent = status;
      if (sizzleVisual) sizzleVisual.style.opacity = (val / 950);

      if (window.orhanAudio) {
        window.orhanAudio.playSizzleBurst(val / 700);
      }
    }, { passive: true });
  }

  if (flipBtn && pattyElem) {
    flipBtn.addEventListener('click', () => {
      isFlipped = !isFlipped;
      pattyElem.classList.add('flipping');
      
      if (window.orhanAudio) {
        window.orhanAudio.playSizzleBurst(1.5);
      }

      setTimeout(() => {
        pattyElem.classList.toggle('flipped', isFlipped);
        pattyElem.classList.remove('flipping');
      }, 350);
    });
  }
}

/* -------------------------------------------------------------
 * 9. VIP Table Reservation Modal
 * ------------------------------------------------------------- */
function initReservationModal() {
  const openBtns = document.querySelectorAll('.open-reserve-btn');
  const modal = document.getElementById('reserve-modal');
  const closeBtn = document.getElementById('close-reserve-btn');
  const form = document.getElementById('reserve-form');

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('active');
      if (window.orhanAudio) window.orhanAudio.playClick();
    });
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (window.orhanAudio) window.orhanAudio.playOrderSuccess();
      const guestName = document.getElementById('reserve-name')?.value || 'Guest';
      const loungeCity = document.getElementById('reserve-city')?.value || 'Connaught Place, New Delhi';
      const guests = document.getElementById('reserve-guests')?.value || '2';

      modal.innerHTML = `
        <div class="reserve-success-box" style="text-align:center; padding: 2rem 1rem;">
          <div style="font-size:3rem; margin-bottom: 0.5rem;">👑</div>
          <h3 style="font-family: var(--font-display); font-size: 1.6rem; margin-bottom: 0.5rem;">Dine-In Table Confirmed</h3>
          <p style="color: var(--text-secondary); margin-bottom: 1rem;">We are delighted to welcome you, <strong>${guestName}</strong>.</p>
          <div style="background: var(--bg-tertiary); padding: 1rem; border-radius: var(--radius-md); text-align: left; margin-bottom: 1.5rem;">
            <div><strong>Restaurant:</strong> Orhan ${loungeCity}</div>
            <div><strong>Guests:</strong> ${guests} Persons</div>
            <div><strong>Mode:</strong> Dine-in Fast-Track Table</div>
          </div>
          <button class="btn-primary" onclick="location.reload()" style="width: 100%;">Back to Menu</button>
        </div>
      `;
    });
  }
}
