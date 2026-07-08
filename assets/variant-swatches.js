/**
 * Color switching for the product card and product page.
 * Swatch radios carry data-variant-* attributes (see snippets/color-swatches.liquid),
 * price hooks live in snippets/product-price.liquid.
 */

function onSwatchChange(root, handler) {
  root.addEventListener('change', (event) => {
    const swatch = event.target.closest('[data-swatch]');
    if (swatch) handler(swatch);
  });
}

function syncPrice(root, swatch) {
  const priceEl = root.querySelector('[data-current-price]');
  const compareEl = root.querySelector('[data-compare-at-price]');
  if (!priceEl || !compareEl) return false;

  const onSale = Boolean(swatch.dataset.variantCompareAtPrice);
  root.querySelector('[data-current-amount]').textContent = swatch.dataset.variantPrice;
  priceEl.classList.toggle('text-sale', onSale);
  priceEl.classList.toggle('text-ink', !onSale);
  root.querySelector('[data-compare-at-amount]').textContent = swatch.dataset.variantCompareAtPrice || '';
  compareEl.classList.toggle('hidden', !onSale);
  root.querySelector('[data-sale-label]').classList.toggle('hidden', !onSale);
  return onSale;
}

function eagerLoadImages(panel) {
  for (const img of panel.querySelectorAll('img[loading="lazy"]')) {
    img.removeAttribute('loading');
  }
}

class ProductCard extends HTMLElement {
  connectedCallback() {
    onSwatchChange(this, (swatch) => this.#select(swatch));

    for (const slides of this.querySelectorAll('[data-slides]')) {
      slides.addEventListener('scroll', () => this.#syncDots(slides), { passive: true });
    }
  }

  #syncDots(slides) {
    const dots = slides.parentElement.querySelectorAll('[data-dot]');
    if (!dots.length) return;
    const index = Math.round(slides.scrollLeft / slides.clientWidth);
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  }

  #select(swatch) {
    const color = swatch.value;
    this.dataset.selectedColor = color;

    for (const panel of this.querySelectorAll('.card-media')) {
      panel.classList.toggle('is-active', panel.dataset.color === color);
      if (panel.dataset.color === color) {
        eagerLoadImages(panel);
        // Reset the touch carousel to the front image
        const slides = panel.querySelector('[data-slides]');
        if (slides) {
          slides.scrollTo({ left: 0 });
          this.#syncDots(slides);
        }
      }
    }

    const onSale = syncPrice(this, swatch);
    this.querySelector('[data-sale-badge]')?.classList.toggle('hidden', !onSale);

    for (const link of this.querySelectorAll('[data-card-link]')) {
      link.href = swatch.dataset.variantUrl;
    }
  }
}

class ProductPage extends HTMLElement {
  connectedCallback() {
    onSwatchChange(this, (swatch) => this.#select(swatch));
  }

  #select(swatch) {
    const color = swatch.value;

    for (const panel of this.querySelectorAll('[data-media-panel]')) {
      panel.classList.toggle('hidden', panel.dataset.color !== color);
      if (panel.dataset.color === color) eagerLoadImages(panel);
    }

    const idInput = this.querySelector('[data-variant-id-input]');
    if (idInput) idInput.value = swatch.dataset.variantId;

    const label = this.querySelector('[data-selected-color-label]');
    if (label) label.textContent = swatch.getAttribute('aria-label');

    syncPrice(this, swatch);

    if (swatch.dataset.variantUrl) {
      history.replaceState({}, '', swatch.dataset.variantUrl);
    }
  }
}

if (!customElements.get('product-card')) {
  customElements.define('product-card', ProductCard);
}
if (!customElements.get('product-page')) {
  customElements.define('product-page', ProductPage);
}
