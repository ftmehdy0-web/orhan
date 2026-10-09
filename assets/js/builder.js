/**
 * Orhan Custom Burger Alchemist Engine (Burger King India Style)
 * Live visual stack layering, ingredient toggling, macro/price tracking, presets & bag integration.
 */

class BurgerBuilderEngine {
  constructor() {
    this.data = window.ORHAN_BUILDER_DATA || {};
    this.currentStack = {
      bun: 'sesame-crown',
      patty: 'flame-chicken',
      cheese: 'cheddar-slice',
      toppings: ['grilled-onions', 'jalapenos'],
      sauces: ['tandoori-mayo']
    };

    this.presets = {
      'royal-carnivore': {
        name: "The Sultan Chicken Whopper®",
        bun: 'sesame-crown',
        patty: 'flame-chicken',
        cheese: 'cheddar-slice',
        toppings: ['fresh-tomatoes', 'crunchy-gherkins'],
        sauces: ['tandoori-mayo']
      },
      'black-truffle-dream': {
        name: "Double Crispy Veg Whopper®",
        bun: 'brioche-deluxe',
        patty: 'crispy-veg',
        cheese: 'cheddar-slice',
        toppings: ['grilled-onions', 'jalapenos'],
        sauces: ['mint-mayo']
      },
      'firecracker-rebel': {
        name: "Fiery Hell Mutton Melt",
        bun: 'sesame-crown',
        patty: 'royal-mutton',
        cheese: 'cheesy-lava-sauce',
        toppings: ['jalapenos', 'grilled-onions'],
        sauces: ['fiery-hell', 'hickory-bbq']
      }
    };

    this.init();
  }

  init() {
    this.renderSelectors();
    this.bindEvents();
    this.updateStackDisplay();
  }

  renderSelectors() {
    // Render Bun options
    const bunContainer = document.getElementById('builder-buns');
    if (bunContainer && this.data.buns) {
      bunContainer.innerHTML = this.data.buns.map(b => `
        <div class="ingredient-card ${this.currentStack.bun === b.id ? 'active' : ''}" data-type="bun" data-id="${b.id}">
          <span class="ingredient-icon">${b.icon}</span>
          <div class="ingredient-info">
            <div class="ingredient-title">${b.name}</div>
            <div class="ingredient-meta">+₹${b.price} • ${b.cal} kcal</div>
          </div>
        </div>
      `).join('');
    }

    // Render Patty options
    const pattyContainer = document.getElementById('builder-patties');
    if (pattyContainer && this.data.patties) {
      pattyContainer.innerHTML = this.data.patties.map(p => `
        <div class="ingredient-card ${this.currentStack.patty === p.id ? 'active' : ''}" data-type="patty" data-id="${p.id}">
          <span class="ingredient-icon">${p.icon}</span>
          <div class="ingredient-info">
            <div class="ingredient-title">${p.name}</div>
            <div class="ingredient-meta">+₹${p.price} • ${p.cal} kcal</div>
          </div>
        </div>
      `).join('');
    }

    // Render Cheese options
    const cheeseContainer = document.getElementById('builder-cheeses');
    if (cheeseContainer && this.data.cheeses) {
      cheeseContainer.innerHTML = this.data.cheeses.map(c => `
        <div class="ingredient-card ${this.currentStack.cheese === c.id ? 'active' : ''}" data-type="cheese" data-id="${c.id}">
          <span class="ingredient-icon">${c.icon}</span>
          <div class="ingredient-info">
            <div class="ingredient-title">${c.name}</div>
            <div class="ingredient-meta">+₹${c.price} • ${c.cal} kcal</div>
          </div>
        </div>
      `).join('');
    }

    // Render Topping options (multi-select)
    const toppingsContainer = document.getElementById('builder-toppings');
    if (toppingsContainer && this.data.toppings) {
      toppingsContainer.innerHTML = this.data.toppings.map(t => {
        const isSel = this.currentStack.toppings.includes(t.id);
        return `
          <div class="ingredient-card ${isSel ? 'active' : ''}" data-type="topping" data-id="${t.id}">
            <span class="ingredient-icon">${t.icon}</span>
            <div class="ingredient-info">
              <div class="ingredient-title">${t.name}</div>
              <div class="ingredient-meta">+₹${t.price} • ${t.cal} kcal</div>
            </div>
            <span class="check-indicator">${isSel ? '✓' : '+'}</span>
          </div>
        `;
      }).join('');
    }

    // Render Sauces options (multi-select)
    const saucesContainer = document.getElementById('builder-sauces');
    if (saucesContainer && this.data.sauces) {
      saucesContainer.innerHTML = this.data.sauces.map(s => {
        const isSel = this.currentStack.sauces.includes(s.id);
        return `
          <div class="ingredient-card ${isSel ? 'active' : ''}" data-type="sauce" data-id="${s.id}">
            <span class="ingredient-icon">${s.icon}</span>
            <div class="ingredient-info">
              <div class="ingredient-title">${s.name}</div>
              <div class="ingredient-meta">+₹${s.price} • ${s.cal} kcal</div>
            </div>
            <span class="check-indicator">${isSel ? '✓' : '+'}</span>
          </div>
        `;
      }).join('');
    }
  }

  bindEvents() {
    // Ingredient selection delegates
    const section = document.getElementById('custom-builder');
    if (section) {
      section.addEventListener('click', (e) => {
        const card = e.target.closest('.ingredient-card');
        if (!card) return;

        const type = card.dataset.type;
        const id = card.dataset.id;
        if (!type || !id) return;

        if (window.orhanAudio) {
          window.orhanAudio.playClick();
          window.orhanAudio.playIngredientDrop();
        }

        if (type === 'bun') {
          this.currentStack.bun = id;
        } else if (type === 'patty') {
          this.currentStack.patty = id;
        } else if (type === 'cheese') {
          this.currentStack.cheese = (this.currentStack.cheese === id) ? null : id;
        } else if (type === 'topping') {
          const idx = this.currentStack.toppings.indexOf(id);
          if (idx > -1) {
            this.currentStack.toppings.splice(idx, 1);
          } else {
            this.currentStack.toppings.push(id);
          }
        } else if (type === 'sauce') {
          const idx = this.currentStack.sauces.indexOf(id);
          if (idx > -1) {
            this.currentStack.sauces.splice(idx, 1);
          } else {
            this.currentStack.sauces.push(id);
          }
        }

        this.renderSelectors();
        this.updateStackDisplay();
      });

      // Presets buttons
      const presetButtons = section.querySelectorAll('[data-preset]');
      presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const presetKey = btn.dataset.preset;
          if (this.presets[presetKey]) {
            presetButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const p = this.presets[presetKey];
            this.currentStack.bun = p.bun;
            this.currentStack.patty = p.patty;
            this.currentStack.cheese = p.cheese;
            this.currentStack.toppings = [...p.toppings];
            this.currentStack.sauces = [...p.sauces];
            
            if (window.orhanAudio) {
              window.orhanAudio.playSizzleBurst(1.2);
            }
            this.renderSelectors();
            this.updateStackDisplay();
          }
        });
      });

      // Add custom burger to bag button
      const addCustomBtn = document.getElementById('btn-add-custom-burger');
      if (addCustomBtn) {
        addCustomBtn.addEventListener('click', () => {
          this.addCustomToCart();
        });
      }
    }
  }

  calculateTotals() {
    let totalPrice = 0;
    let totalCal = 0;

    const bunObj = (this.data.buns || []).find(b => b.id === this.currentStack.bun);
    if (bunObj) { totalPrice += bunObj.price; totalCal += bunObj.cal; }

    const pattyObj = (this.data.patties || []).find(p => p.id === this.currentStack.patty);
    if (pattyObj) { totalPrice += pattyObj.price; totalCal += pattyObj.cal; }

    const cheeseObj = (this.data.cheeses || []).find(c => c.id === this.currentStack.cheese);
    if (cheeseObj) { totalPrice += cheeseObj.price; totalCal += cheeseObj.cal; }

    this.currentStack.toppings.forEach(tId => {
      const topObj = (this.data.toppings || []).find(t => t.id === tId);
      if (topObj) { totalPrice += topObj.price; totalCal += topObj.cal; }
    });

    this.currentStack.sauces.forEach(sId => {
      const sauceObj = (this.data.sauces || []).find(s => s.id === sId);
      if (sauceObj) { totalPrice += sauceObj.price; totalCal += sauceObj.cal; }
    });

    return { totalPrice, totalCal };
  }

  updateStackDisplay() {
    const { totalPrice, totalCal } = this.calculateTotals();

    // Update summary counters in ₹
    const priceEl = document.getElementById('builder-total-price');
    const calEl = document.getElementById('builder-total-cal');
    const layersCountEl = document.getElementById('builder-layer-count');

    if (priceEl) priceEl.textContent = `₹${totalPrice}`;
    if (calEl) calEl.textContent = `${totalCal} kcal`;

    const totalLayers = 2 + (this.currentStack.patty ? 1 : 0) + (this.currentStack.cheese ? 1 : 0) +
      this.currentStack.toppings.length + this.currentStack.sauces.length;
    if (layersCountEl) layersCountEl.textContent = `${totalLayers} Layers`;

    // Render Visual Burger Layers in the Preview Box
    const stackContainer = document.getElementById('burger-visual-stack');
    if (!stackContainer) return;

    const bunObj = (this.data.buns || []).find(b => b.id === this.currentStack.bun);
    const pattyObj = (this.data.patties || []).find(p => p.id === this.currentStack.patty);
    const cheeseObj = (this.data.cheeses || []).find(c => c.id === this.currentStack.cheese);

    let html = ``;

    // Top Bun
    html += `
      <div class="visual-layer layer-bun-top bun-gold" data-label="${bunObj ? bunObj.name : 'Top Bun'}">
        <div class="bun-gloss"></div>
        <div class="sesame-seeds"></div>
      </div>
    `;

    // Sauces Top
    this.currentStack.sauces.forEach(sId => {
      const s = (this.data.sauces || []).find(x => x.id === sId);
      html += `
        <div class="visual-layer layer-sauce ${sId}" data-label="${s ? s.name : 'Sauce'}">
          <div class="sauce-drip"></div>
        </div>
      `;
    });

    // Toppings
    this.currentStack.toppings.forEach(tId => {
      const t = (this.data.toppings || []).find(x => x.id === tId);
      html += `
        <div class="visual-layer layer-topping ${tId}" data-label="${t ? t.name : 'Topping'}">
          <span class="layer-pill">${t ? t.name : ''}</span>
        </div>
      `;
    });

    // Melted Cheese
    if (cheeseObj) {
      html += `
        <div class="visual-layer layer-cheese ${cheeseObj.id}" data-label="${cheeseObj.name}">
          <div class="cheese-melt-drips"></div>
        </div>
      `;
    }

    // Patty
    if (pattyObj) {
      const isChicken = pattyObj.id === 'flame-chicken';
      const isMutton = pattyObj.id === 'royal-mutton';
      const pattyStyle = isChicken ? 'patty-chicken' : (isMutton ? 'patty-wagyu' : 'patty-portobello');
      html += `
        <div class="visual-layer layer-patty ${pattyStyle}" data-label="${pattyObj.name}">
          <div class="grill-marks"></div>
        </div>
      `;
    }

    // Bottom Bun
    html += `
      <div class="visual-layer layer-bun-bottom bun-gold" data-label="${bunObj ? bunObj.name + ' Heel' : 'Bottom Bun'}"></div>
    `;

    stackContainer.innerHTML = html;

    const layers = stackContainer.querySelectorAll('.visual-layer');
    layers.forEach((l, index) => {
      l.style.animationDelay = `${index * 0.04}s`;
    });
  }

  addCustomToCart() {
    const { totalPrice, totalCal } = this.calculateTotals();
    const bunObj = (this.data.buns || []).find(b => b.id === this.currentStack.bun);
    const pattyObj = (this.data.patties || []).find(p => p.id === this.currentStack.patty);

    const customTitle = `Custom ${pattyObj ? pattyObj.name.split('Patty')[0] : 'Whopper'} Burger`;

    const summaryParts = [];
    if (bunObj) summaryParts.push(bunObj.name);
    if (pattyObj) summaryParts.push(pattyObj.name);
    if (this.currentStack.cheese) {
      const c = (this.data.cheeses || []).find(x => x.id === this.currentStack.cheese);
      if (c) summaryParts.push(c.name);
    }
    this.currentStack.toppings.forEach(tId => {
      const t = (this.data.toppings || []).find(x => x.id === tId);
      if (t) summaryParts.push(t.name);
    });
    this.currentStack.sauces.forEach(sId => {
      const s = (this.data.sauces || []).find(x => x.id === sId);
      if (s) summaryParts.push(s.name);
    });

    const customItem = {
      id: `custom-${Date.now()}`,
      name: customTitle,
      price: totalPrice,
      calories: `${totalCal} kcal`,
      description: summaryParts.join(' • '),
      image: 'assets/images/orhan-hero-burger.jpg',
      isCustom: true,
      isVeg: pattyObj ? pattyObj.id === 'crispy-veg' || pattyObj.id === 'paneer-slab' : false
    };

    if (window.orhanCart) {
      window.orhanCart.addItem(customItem);
      if (window.orhanAudio) {
        window.orhanAudio.playAddToCart();
      }
    }
  }
}

window.BurgerBuilderEngine = BurgerBuilderEngine;
