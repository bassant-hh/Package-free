// Image URL pre-validation helper
function validateImageUrl(url) {
  return new Promise((resolve) => {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return resolve(null);
    }
    // Filter out known non-image product page links (e.g., iStock HTML page URLs)
    if (url.includes('www.istockphoto.com/photo/')) {
      return resolve(null);
    }
    const img = new Image();
    let timer = setTimeout(() => {
      img.onload = null;
      img.onerror = null;
      resolve(null);
    }, 2000);

    img.onload = () => {
      clearTimeout(timer);
      resolve(url.trim());
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    img.src = url.trim();
  });
}

// Fallback SVG placeholder data URI for products with no valid images
const SVG_FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><rect width='400' height='400' fill='%23f4f6ee'/><g transform='translate(150, 140)' fill='%231d3a24' opacity='0.35'><path d='M50 0 C22.4 0 0 22.4 0 50 C0 85 50 120 50 120 C50 120 100 85 100 50 C100 22.4 77.6 0 50 0 Z'/><text x='50' y='145' font-family='sans-serif' font-size='16' text-anchor='middle' font-weight='bold'>Package Free</text></g></svg>";

function Product(data, validImages) {
  this.id = data.id;
  this.name = data.name || "Eco Product";
  this.brand = data.brand || "Package Free";
  this.price = typeof data.price === 'number' ? data.price : Number(data.price) || 0;
  this.currency = data.currency || "USD";
  this.category = data.category || "";
  this.eco = Boolean(data.eco);
  this.usage = data.usage || "";
  this.ingredients = data.ingredients || "";
  this.description = data.description || "";

  // Ensure validImages array is populated
  this.validImages = (validImages && validImages.length > 0) ? validImages : [];
  this.currentImageIndex = 0;

  this.render = function () {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const isWishlisted = wishlist.some(item => item == this.id);
    const primaryImg = this.validImages.length > 0 ? this.validImages[0] : SVG_FALLBACK_IMAGE;

    return `
      <div class="product-grid-item" data-id="${this.id}">
        <div class="product-card h-100">
          <span data-id="${this.id}" class="heart" style="${isWishlisted ? 'color:#611111' : 'color:#4c4848'}">
            <i class="bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}"></i>
          </span>

          <div class="product-img-wrapper">
            <a href="single-product.html?id=${this.id}" class="product-img-link" tabIndex="-1">
              <img
                src="${primaryImg}"
                class="product-img"
                alt="${this.name}"
                id="product-img-${this.id}"
                onerror="this.onerror=null; this.src='${SVG_FALLBACK_IMAGE}';"
              />
            </a>

            ${this.validImages.length > 1 ? `
              <button type="button" class="img-nav-btn prev-img-btn" data-id="${this.id}" title="Previous image" aria-label="Previous image">
                <i class="bi bi-chevron-left"></i>
              </button>
              <button type="button" class="img-nav-btn next-img-btn" data-id="${this.id}" title="Next image" aria-label="Next image">
                <i class="bi bi-chevron-right"></i>
              </button>
              <div class="img-dots-indicator" id="img-dots-${this.id}">
                ${this.validImages.map((_, idx) => `<span class="img-dot ${idx === 0 ? 'active' : ''}" data-id="${this.id}" data-idx="${idx}"></span>`).join('')}
              </div>
            ` : ''}
          </div>

          <div class="product-content">
            <div class="product-meta d-flex align-items-center justify-content-between mb-1">
              <span class="product-brand">${this.brand}</span>
              ${this.eco ? `<span class="eco-badge"><i class="bi bi-leaf"></i> ECO</span>` : ''}
            </div>

            <a class="product-title-link" href="single-product.html?id=${this.id}">
              <h6 class="product-title" title="${this.name}">${this.name}</h6>
            </a>

            ${this.description ? `<p class="product-description" title="${this.description}">${this.description}</p>` : ''}

            <div class="product-price-row mt-auto pt-2 mb-2">
              <span class="product-price">$${this.price.toFixed(2)}</span>
              <span class="product-currency">${this.currency}</span>
            </div>
            <button class="product-btn add-to-cart" data-id="${this.id}">Add to cart</button>
          </div>
        </div>
      </div>
    `;
  };
}

// Store product image state map: productId -> { validImages, currentIndex }
const productStateMap = new Map();

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');

  const titleEl = document.getElementById('category-title');
  const subtitleEl = document.getElementById('category-subtitle');

  if (category) {
    if (titleEl) titleEl.textContent = `${category} Products`;
    if (subtitleEl) subtitleEl.textContent = `Browse our sustainable & eco-friendly ${category.toLowerCase()} collection`;
    document.title = `${category} - Free Package Shop`;
  } else {
    if (titleEl) titleEl.textContent = 'All Products';
    if (subtitleEl) subtitleEl.textContent = 'Discover our full range of eco-friendly products';
    document.title = 'All Products - Free Package Shop';
  }

  let fetchUrl = API_BASE_URL;
  if (category) {
    fetchUrl += '?category=' + encodeURIComponent(category);
  }

  const container = document.querySelector('.product-grid') || document.querySelector('main');

  if (container) {
    container.innerHTML = `
      <div class="text-center w-100 py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading products...</span>
        </div>
        <p class="mt-2 text-muted">Loading products...</p>
      </div>
    `;
  }

  fetch(fetchUrl)
    .then(res => {
      if (!res.ok) throw new Error('Problem in response: ' + res.status);
      return res.json();
    })
    .then(async result => {
      const rawProducts = result.data || result.products || [];

      if (!container) return;

      if (rawProducts.length === 0) {
        container.innerHTML = `
          <div class="text-center w-100 py-5">
            <i class="bi bi-box-seam display-4 text-muted d-block mb-3"></i>
            <h5>No products found</h5>
            <p class="text-muted">There are no products available in this category.</p>
            <a href="collection.html" class="btn btn-outline-primary mt-2">Browse All Products</a>
          </div>
        `;
        return;
      }

      // Pre-validate images for each product
      const processedProducts = await Promise.all(
        rawProducts.map(async item => {
          const candidates = [];
          if (item.image) candidates.push(item.image);
          if (item.hover_image_url) candidates.push(item.hover_image_url);
          if (Array.isArray(item.additional_images)) {
            item.additional_images.forEach(u => candidates.push(u));
          }

          const uniqueCandidates = Array.from(new Set(candidates));
          const validated = await Promise.all(uniqueCandidates.map(validateImageUrl));
          const validImages = validated.filter(url => url !== null);

          productStateMap.set(String(item.id), {
            validImages: validImages,
            currentIndex: 0
          });

          return {
            item: item,
            validImages: validImages
          };
        })
      );

      let html = '';
      processedProducts.forEach(({ item, validImages }) => {
        const prod = new Product(item, validImages);
        html += prod.render();
      });

      container.innerHTML = html;
    })
    .catch(err => {
      console.error('Error loading products:', err);
      if (container) {
        container.innerHTML = `
          <div class="text-center w-100 py-5 text-danger">
            <i class="bi bi-exclamation-circle display-4 d-block mb-3"></i>
            <h5>Failed to load products</h5>
            <p>${err.message}</p>
          </div>
        `;
      }
    });

  // Image Navigation Event Delegation
  document.addEventListener('click', (event) => {
    const prevBtn = event.target.closest('.prev-img-btn');
    const nextBtn = event.target.closest('.next-img-btn');
    const dotBtn = event.target.closest('.img-dot');

    if (prevBtn || nextBtn || dotBtn) {
      event.preventDefault();
      event.stopPropagation();

      const targetBtn = prevBtn || nextBtn || dotBtn;
      const productId = targetBtn.dataset.id;
      const state = productStateMap.get(String(productId));

      if (!state || !state.validImages || state.validImages.length <= 1) return;

      if (prevBtn) {
        state.currentIndex = (state.currentIndex - 1 + state.validImages.length) % state.validImages.length;
      } else if (nextBtn) {
        state.currentIndex = (state.currentIndex + 1) % state.validImages.length;
      } else if (dotBtn) {
        const idx = Number(dotBtn.dataset.idx);
        if (!isNaN(idx)) state.currentIndex = idx;
      }

      const imgEl = document.getElementById(`product-img-${productId}`);
      if (imgEl) {
        imgEl.style.opacity = '0.4';
        setTimeout(() => {
          imgEl.src = state.validImages[state.currentIndex];
          imgEl.style.opacity = '1';
        }, 100);
      }

      const dotsContainer = document.getElementById(`img-dots-${productId}`);
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.img-dot');
        dots.forEach((d, i) => {
          if (i === state.currentIndex) d.classList.add('active');
          else d.classList.remove('active');
        });
      }
    }
  });
});