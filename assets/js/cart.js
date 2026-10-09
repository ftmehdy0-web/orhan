/**
 * Orhan India - VIP Cart Drawer & Live Order Tracking Engine (Burger King India Style)
 */

class OrhanCartEngine {
  constructor() {
    this.items = [];
    this.tipAmount = 30; // ₹30 default rider tip
    this.promoDiscount = 0;
    this.appliedPromoCode = null;
    this.deliveryFee = 39; // ₹39 delivery
    this.freeDeliveryThreshold = 299; // Free above ₹299
    
    this.loadFromStorage();
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateUI();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('orhan_cart_in');
      if (saved) {
        this.items = JSON.parse(saved);
      }
    } catch (e) {
      this.items = [];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('orhan_cart_in', JSON.stringify(this.items));
    } catch (e) {}
  }

  bindEvents() {
    // Open cart drawer triggers
    const cartToggles = document.querySelectorAll('.cart-toggle-btn');
    cartToggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });

    // Close cart drawer
    const closeBtn = document.getElementById('close-cart-btn');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeDrawer());
    if (overlay) overlay.addEventListener('click', () => this.closeDrawer());

    // Tip selection buttons
    const tipBtns = document.querySelectorAll('.tip-chip');
    tipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tipBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.tipAmount = parseInt(btn.dataset.tip || 0);
        if (window.orhanAudio) window.orhanAudio.playClick();
        this.updateUI();
      });
    });

    // Promo code apply
    const promoBtn = document.getElementById('apply-promo-btn');
    const promoInput = document.getElementById('promo-input');
    if (promoBtn && promoInput) {
      promoBtn.addEventListener('click', () => {
        this.applyPromo(promoInput.value.trim().toUpperCase());
      });
      promoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.applyPromo(promoInput.value.trim().toUpperCase());
        }
      });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.items.length === 0) {
          this.showToast('Your cart is empty. Add delicious flame-grilled burgers!');
          return;
        }
        this.closeDrawer();
        this.openCheckoutModal();
      });
    }

    // Modal close & backdrop
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout-btn');
    if (closeCheckoutBtn && checkoutModal) {
      closeCheckoutBtn.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
      });
    }

    // Confirm Order submit
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.processOrder();
      });
    }
  }

  addItem(product, qty = 1) {
    const existingIndex = this.items.findIndex(item => item.id === product.id);
    if (existingIndex > -1) {
      this.items[existingIndex].quantity += qty;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        isVeg: !!product.isVeg,
        description: product.description || '',
        quantity: qty
      });
    }

    this.saveToStorage();
    this.updateUI();
    this.openDrawer();
    this.showToast(`Added ${product.name} to cart.`);
  }

  updateQuantity(id, change) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
      this.items = this.items.filter(i => i.id !== id);
    }

    if (window.orhanAudio) window.orhanAudio.playClick();
    this.saveToStorage();
    this.updateUI();
  }

  removeItem(id) {
    this.items = this.items.filter(i => i.id !== id);
    if (window.orhanAudio) window.orhanAudio.playClick();
    this.saveToStorage();
    this.updateUI();
  }

  applyPromo(code) {
    const msgEl = document.getElementById('promo-status-msg');
    if (!code) return;

    if (code === 'KING50' || code === 'ORHAN50') {
      this.promoDiscount = 100; // Flat ₹100 discount
      this.appliedPromoCode = `${code} (Flat ₹100 King Deal)`;
      if (msgEl) {
        msgEl.textContent = '✓ King Deal applied! ₹100 discount granted.';
        msgEl.className = 'promo-status-msg success';
      }
      if (window.orhanAudio) window.orhanAudio.playAddToCart();
    } else if (code === 'ORHANVIP') {
      this.promoDiscount = 0.20; // 20% off
      this.appliedPromoCode = 'ORHANVIP (20% Flat Privilege)';
      if (msgEl) {
        msgEl.textContent = '✓ VIP code applied! 20% discount granted.';
        msgEl.className = 'promo-status-msg success';
      }
      if (window.orhanAudio) window.orhanAudio.playAddToCart();
    } else if (code === 'FREEFRIES') {
      this.promoDiscount = 119; // Free Peri Peri Fries ₹119 credit
      this.appliedPromoCode = 'FREEFRIES (Free Peri Peri Fries ₹119)';
      if (msgEl) {
        msgEl.textContent = '✓ FREEFRIES applied! ₹119 complimentary fries credit.';
        msgEl.className = 'promo-status-msg success';
      }
      if (window.orhanAudio) window.orhanAudio.playAddToCart();
    } else {
      if (msgEl) {
        msgEl.textContent = 'Invalid code. Try "KING50" or "ORHANVIP".';
        msgEl.className = 'promo-status-msg error';
      }
      return;
    }

    this.updateUI();
  }

  openDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (window.orhanAudio) window.orhanAudio.playClick();
    }
  }

  closeDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-drawer-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  calculateTotals() {
    const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let discount = 0;
    if (this.promoDiscount > 0) {
      if (this.promoDiscount < 1) {
        discount = Math.round(subtotal * this.promoDiscount);
      } else {
        discount = Math.min(subtotal, this.promoDiscount);
      }
    }

    // Free delivery above threshold
    const delivery = (subtotal >= this.freeDeliveryThreshold || subtotal === 0) ? 0 : this.deliveryFee;
    const gstTaxes = subtotal > 0 ? Math.round(subtotal * 0.05) : 0; // 5% GST
    const tip = subtotal > 0 ? this.tipAmount : 0;
    const total = Math.max(0, (subtotal - discount) + delivery + gstTaxes + tip);
    const crownsEarned = Math.round(total / 10);

    return { subtotal, discount, delivery, gstTaxes, tip, total, crownsEarned };
  }

  updateUI() {
    const count = this.items.reduce((sum, i) => sum + i.quantity, 0);
    const badgeEls = document.querySelectorAll('.cart-count-badge');
    badgeEls.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
      if (count > 0) {
        badge.classList.add('pulse');
        setTimeout(() => badge.classList.remove('pulse'), 400);
      }
    });

    // Mobile / Floating Quick Cart preview
    const floatingBar = document.getElementById('floating-cart-bar');
    const floatingTotal = document.getElementById('floating-cart-total');
    const floatingCount = document.getElementById('floating-cart-count');
    const { subtotal, discount, delivery, gstTaxes, tip, total, crownsEarned } = this.calculateTotals();

    if (floatingBar && floatingTotal && floatingCount) {
      if (count > 0) {
        floatingBar.style.display = 'flex';
        floatingTotal.textContent = `₹${total}`;
        floatingCount.textContent = `${count} ITEM${count > 1 ? 'S' : ''}`;
      } else {
        floatingBar.style.display = 'none';
      }
    }

    // Render items list in drawer
    const listContainer = document.getElementById('cart-items-list');
    if (listContainer) {
      if (this.items.length === 0) {
        listContainer.innerHTML = `
          <div class="empty-cart-state">
            <div class="empty-cart-icon">🍔</div>
            <h4>Your Cart Is Empty</h4>
            <p>Good food is just a click away. Add from our Whopper® range or combos!</p>
          </div>
        `;
      } else {
        listContainer.innerHTML = this.items.map(item => `
          <div class="cart-item-card" data-id="${item.id}">
            <span class="diet-icon ${item.isVeg ? 'veg' : 'non-veg'}"></span>
            <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" onerror="this.src='assets/images/orhan-hero-burger.jpg'"/>
            <div class="cart-item-details">
              <h5 class="cart-item-name">${item.name}</h5>
              <div class="cart-item-bottom">
                <span class="cart-item-price">₹${item.price * item.quantity}</span>
                <div class="cart-stepper">
                  <button class="step-btn" onclick="orhanCart.updateQuantity('${item.id}', -1)">-</button>
                  <span class="step-val">${item.quantity}</span>
                  <button class="step-btn" onclick="orhanCart.updateQuantity('${item.id}', 1)">+</button>
                </div>
              </div>
            </div>
            <button class="cart-remove-btn" title="Remove" onclick="orhanCart.removeItem('${item.id}')">✕</button>
          </div>
        `).join('');
      }
    }

    // Update figures in drawer
    const subtotalEl = document.getElementById('cart-subtotal');
    const discountEl = document.getElementById('cart-discount');
    const discountRow = document.getElementById('cart-discount-row');
    const deliveryEl = document.getElementById('cart-delivery');
    const gstEl = document.getElementById('cart-gst');
    const tipEl = document.getElementById('cart-tip');
    const totalEl = document.getElementById('cart-total');
    const crownsEl = document.getElementById('cart-crowns-earned');

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    if (discountRow) {
      discountRow.style.display = discount > 0 ? 'flex' : 'none';
      if (discountEl) discountEl.textContent = `-₹${discount}`;
    }
    if (deliveryEl) deliveryEl.textContent = delivery === 0 ? 'FREE' : `₹${delivery}`;
    if (gstEl) gstEl.textContent = `₹${gstTaxes}`;
    if (tipEl) tipEl.textContent = `₹${tip}`;
    if (totalEl) totalEl.textContent = `₹${total}`;
    if (crownsEl) crownsEl.textContent = `${crownsEarned} Crowns`;
  }

  openCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    const { subtotal, discount, delivery, gstTaxes, tip, total } = this.calculateTotals();
    const sumTotalEl = document.getElementById('modal-summary-total');
    const itemsPreview = document.getElementById('modal-items-summary');

    if (sumTotalEl) sumTotalEl.textContent = `₹${total}`;
    if (itemsPreview) {
      itemsPreview.innerHTML = this.items.map(i => `
        <div class="modal-summary-row" style="display:flex; justify-content:space-between; margin-bottom: 0.3rem;">
          <span>${i.isVeg ? '🟢' : '🔴'} ${i.quantity}x ${i.name}</span>
          <span>₹${i.price * i.quantity}</span>
        </div>
      `).join('');
    }

    modal.classList.add('active');
    if (window.orhanAudio) window.orhanAudio.playClick();
  }

  processOrder() {
    const name = document.getElementById('order-cust-name')?.value || 'Guest';
    const address = document.getElementById('order-cust-address')?.value || 'Connaught Place, New Delhi';
    const orderNum = 'BK-ORH-' + Math.floor(100000 + Math.random() * 900000);

    // Audio & Confetti
    if (window.orhanAudio) {
      window.orhanAudio.playOrderSuccess();
    }
    this.launchConfetti();

    // Show Live Tracking Screen
    const modalContent = document.getElementById('checkout-modal-content');
    if (modalContent) {
      modalContent.innerHTML = `
        <div class="order-success-screen">
          <div class="order-success-badge">🔥 ORDER PLACED SUCCESSFULLY</div>
          <h2 class="order-success-title">Thank You, ${name}!</h2>
          <p class="order-code-badge">Order ID: #${orderNum}</p>
          <p class="order-dest">Delivering to: <strong>${address}</strong></p>

          <div class="live-tracker-container">
            <div class="tracker-progress-bar">
              <div class="tracker-progress-fill" id="tracker-fill" style="width: 25%;"></div>
            </div>

            <div class="tracker-steps-grid">
              <div class="track-step active" id="step-1">
                <div class="step-dot">📋</div>
                <div class="step-name">Order Confirmed</div>
                <div class="step-sub">Kitchen received order</div>
              </div>
              <div class="track-step" id="step-2">
                <div class="step-dot">🔥</div>
                <div class="step-name">Flame-Grilling</div>
                <div class="step-sub">Patties on 800°F grill</div>
              </div>
              <div class="track-step" id="step-3">
                <div class="step-dot">📦</div>
                <div class="step-name">Packed Hot</div>
                <div class="step-sub">Bagged with sides</div>
              </div>
              <div class="track-step" id="step-4">
                <div class="step-dot">🛵</div>
                <div class="step-name">Rider Dispatched</div>
                <div class="step-sub">On the way to you</div>
              </div>
            </div>
          </div>

          <div class="tracker-time-card">
            <span class="est-label">Estimated Delivery Time</span>
            <span class="est-countdown" id="tracker-countdown">24:50 mins</span>
          </div>

          <button class="btn-primary" onclick="location.reload()" style="margin-top: 1.5rem; width: 100%;">
            Place Another Order
          </button>
        </div>
      `;

      this.animateTrackerSteps();
    }

    // Clear cart
    this.items = [];
    this.saveToStorage();
    this.updateUI();
  }

  animateTrackerSteps() {
    let currentStep = 1;
    const fill = document.getElementById('tracker-fill');

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep > 4) {
        clearInterval(interval);
        return;
      }

      if (fill) fill.style.width = `${currentStep * 25}%`;
      const stepEl = document.getElementById(`step-${currentStep}`);
      if (stepEl) stepEl.classList.add('active');

      if (window.orhanAudio) {
        window.orhanAudio.playSizzleBurst(0.8);
      }
    }, 4500);

    let secondsLeft = 24 * 60 + 50;
    const cdEl = document.getElementById('tracker-countdown');
    setInterval(() => {
      if (secondsLeft > 0 && cdEl) {
        secondsLeft--;
        const m = Math.floor(secondsLeft / 60);
        const s = secondsLeft % 60;
        cdEl.textContent = `${m}:${s < 10 ? '0' : ''}${s} mins`;
      }
    }, 1000);
  }

  launchConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#d62300', '#f5a800', '#502314', '#ffffff']
      });
    }
  }

  showToast(message) {
    let toast = document.getElementById('orhan-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'orhan-toast';
      toast.className = 'orhan-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3000);
  }
}

window.OrhanCartEngine = OrhanCartEngine;
