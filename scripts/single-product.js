// Image URL pre-validation helper
function validateImageUrl(url) {
  return new Promise((resolve) => {
    if (!url || typeof url !== 'string' || url.trim() === '') {
      return resolve(null);
    }
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

const SVG_FALLBACK_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'><rect width='500' height='500' fill='%23f4f6ee'/><g transform='translate(200, 190)' fill='%231d3a24' opacity='0.35'><path d='M50 0 C22.4 0 0 22.4 0 50 C0 85 50 120 50 120 C50 120 100 85 100 50 C100 22.4 77.6 0 50 0 Z'/><text x='50' y='145' font-family='sans-serif' font-size='18' text-anchor='middle' font-weight='bold'>Package Free</text></g></svg>";

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

const main = document.getElementById('product-details');

if (!productId) {
  if (main) {
    main.innerHTML = `
      <div class="text-center py-5">
        <h4 class="text-muted">No product specified</h4>
        <a href="collection.html" class="btn btn-outline-primary mt-3">Browse Products</a>
      </div>
    `;
  }
} else {
  fetch(`${API_BASE_URL}/${productId}`)
    .then(res => {
      if (!res.ok) throw new Error('Product not found: ' + res.status);
      return res.json();
    })
    .then(async data => {
      // Handle response formats: direct product object or { data: product }
      const product = data.data || data.product || data;

      if (!product || !product.id) {
        throw new Error('Invalid product data');
      }

      // Collect image candidates
      const candidateUrls = [];
      if (product.image) candidateUrls.push(product.image);
      if (product.hover_image_url) candidateUrls.push(product.hover_image_url);
      if (Array.isArray(product.additional_images)) {
        product.additional_images.forEach(u => candidateUrls.push(u));
      }

      const uniqueCandidates = Array.from(new Set(candidateUrls));
      const validated = await Promise.all(uniqueCandidates.map(validateImageUrl));
      const validImages = validated.filter(url => url !== null);

      let currentImgIdx = 0;
      const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      const isWishlisted = wishlist.some(item => item == product.id);

      const mainImgSrc = validImages.length > 0 ? validImages[0] : SVG_FALLBACK_IMAGE;

      main.innerHTML = `
        <div class="row sp-container align-items-start">
          <!-- Left Column: Image Gallery -->
          <div class="col-12 col-md-6 mb-4 mb-md-0">
            <div class="sp-gallery-card">
              <div class="sp-main-img-wrapper">
                <span data-id="${product.id}" class="heart" style="${isWishlisted ? 'color:#611111' : 'color:#4c4848'}">
                  <i class="bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}"></i>
                </span>

                <img
                  src="${mainImgSrc}"
                  alt="${product.name}"
                  id="sp-main-image"
                  class="sp-main-img"
                  onerror="this.onerror=null; this.src='${SVG_FALLBACK_IMAGE}';"
                />

                ${validImages.length > 1 ? `
                  <button type="button" class="sp-img-nav-btn sp-prev-btn" id="sp-prev-img" title="Previous image">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                  <button type="button" class="sp-img-nav-btn sp-next-btn" id="sp-next-img" title="Next image">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                ` : ''}
              </div>

              ${validImages.length > 1 ? `
                <div class="sp-thumbs-wrapper mt-3">
                  ${validImages.map((imgUrl, idx) => `
                    <button type="button" class="sp-thumb-btn ${idx === 0 ? 'active' : ''}" data-idx="${idx}">
                      <img src="${imgUrl}" alt="Thumbnail ${idx + 1}" class="sp-thumb-img" onerror="this.onerror=null; this.src='${SVG_FALLBACK_IMAGE}';" />
                    </button>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Right Column: Product Details & Hierarchy -->
          <div class="col-12 col-md-6">
            <div class="sp-details-box pl-md-3">
              <div class="sp-breadcrumbs mb-2">
                <span class="sp-brand">${product.brand || 'PACKAGE FREE'}</span>
                ${product.category ? `<span class="sp-divider">/</span><span class="sp-category">${product.category}</span>` : ''}
                ${product.eco ? `<span class="eco-badge ml-2"><i class="bi bi-leaf"></i> ECO</span>` : ''}
              </div>

              <h1 class="sp-title">${product.name}</h1>

              <div class="sp-price-box my-3">
                <span class="sp-price">$${(Number(product.price) || 0).toFixed(2)}</span>
                <span class="sp-currency">${product.currency || 'USD'}</span>
              </div>

              ${product.description ? `
                <div class="sp-section mb-4">
                  <h6 class="sp-section-heading">Description</h6>
                  <p class="sp-description-text">${product.description}</p>
                </div>
              ` : ''}

              ${product.usage ? `
                <div class="sp-section mb-4">
                  <h6 class="sp-section-heading">How to Use</h6>
                  <p class="sp-info-text">${product.usage}</p>
                </div>
              ` : ''}

              ${product.ingredients ? `
                <div class="sp-section mb-4">
                  <h6 class="sp-section-heading">Ingredients / Materials</h6>
                  <p class="sp-info-text">${product.ingredients}</p>
                </div>
              ` : ''}

              <!-- Actions Box -->
              <div class="sp-action-box pt-3 border-top">
                <div class="form-group mb-3">
                  <label for="quantity" class="sp-qty-label">Quantity</label>
                  <div class="quantity-wrapper">
                    <button type="button" class="qty-btn" id="decrease-single-product">−</button>
                    <input type="number" value="1" min="1" id="quantity" readOnly />
                    <button type="button" class="qty-btn" id="increase-single-product">+</button>
                  </div>
                </div>

                <button class="btn product-btn add-to-cart w-100" data-id="${product.id}" data-amount="1" id="mainBtn">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Event listeners for Quantity controls
      const decBtn = document.getElementById('decrease-single-product');
      const incBtn = document.getElementById('increase-single-product');

      if (incBtn) {
        incBtn.addEventListener('click', event => {
          if (typeof increaseQuantity === 'function') {
            const newAmount = increaseQuantity(event);
            updateAddToCartAmount(newAmount);
          } else {
            const qtyInput = document.getElementById('quantity');
            let val = Number(qtyInput.value) || 1;
            val++;
            qtyInput.value = val;
            updateAddToCartAmount(val);
          }
        });
      }

      if (decBtn) {
        decBtn.addEventListener('click', event => {
          if (typeof decreaseQuantity === 'function') {
            const newAmount = decreaseQuantity(event);
            updateAddToCartAmount(newAmount);
          } else {
            const qtyInput = document.getElementById('quantity');
            let val = Number(qtyInput.value) || 1;
            if (val > 1) val--;
            qtyInput.value = val;
            updateAddToCartAmount(val);
          }
        });
      }

      function updateAddToCartAmount(newAmount) {
        const addToCartButton = document.getElementById('mainBtn');
        if (addToCartButton) {
          addToCartButton.dataset['amount'] = newAmount;
        }
      }

      // Event listeners for Image Gallery
      if (validImages.length > 1) {
        const mainImg = document.getElementById('sp-main-image');
        const prevBtn = document.getElementById('sp-prev-img');
        const nextBtn = document.getElementById('sp-next-img');
        const thumbBtns = document.querySelectorAll('.sp-thumb-btn');

        function updateGalleryImage(newIdx) {
          currentImgIdx = (newIdx + validImages.length) % validImages.length;
          if (mainImg) {
            mainImg.style.opacity = '0.3';
            setTimeout(() => {
              mainImg.src = validImages[currentImgIdx];
              mainImg.style.opacity = '1';
            }, 100);
          }
          thumbBtns.forEach((btn, idx) => {
            if (idx === currentImgIdx) btn.classList.add('active');
            else btn.classList.remove('active');
          });
        }

        if (prevBtn) {
          prevBtn.addEventListener('click', () => updateGalleryImage(currentImgIdx - 1));
        }

        if (nextBtn) {
          nextBtn.addEventListener('click', () => updateGalleryImage(currentImgIdx + 1));
        }

        thumbBtns.forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = Number(btn.dataset.idx);
            if (!isNaN(idx)) updateGalleryImage(idx);
          });
        });
      }
    })
    .catch(err => {
      console.error(err);
      if (main) {
        main.innerHTML = `
          <div class="text-center py-5 text-danger">
            <i class="bi bi-exclamation-triangle display-4 mb-3 d-block"></i>
            <h4>Failed to load product</h4>
            <p class="text-muted">${err.message}</p>
            <a href="collection.html" class="btn btn-outline-primary mt-2">Return to Shop</a>
          </div>
        `;
      }
    });
}
