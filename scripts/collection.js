// ==============================
// Constructor Function
// ==============================
function Product(data) {
  this.id = data.id;
  this.name = data.name;
  this.brand = data.brand;
  this.price = data.price;
  this.currency = data.currency || "USD";
  this.category = data.category;
  this.image = data.image;
  this.hoverImage = data.hover_image_url || data.image;
  this.description = data.description || "";

  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

  this.render = function () {
    return `
      <a href = "single-product.html?id=${this.id}" class="product-grid-item">
        <div class="product-card">
        <span data-id = '${this.id}' class = 'heart' style='${wishlist.find(item => item == this.id) ? "color:#611111":"color:#4c4848"}'><i class = 'bi ${wishlist.find(item => item == this.id) ? "bi-heart-fill":"bi-heart"}'></i></span>
          <div class="product-img-wrapper">
            <img
              src="${this.image}"
              class="product-img"
              alt="${this.name}"
              data-hover="${this.hoverImage}"
            />
          </div>

          <div class="product-content">
            <div>
              <h6 class="product-title">${this.name}</h6>
              <p class="product-brand">${this.brand}</p>
              <p class="product-price">$${this.price.toFixed(2)} ${this.currency}</p>
            </div>
            <button class="add-to-cart product-btn" data-id = "${this.id}">Add to cart</button>
          </div>
        </div>
      </a>
    `;
  };
}

const container = document.querySelector(".product-grid");

fetch(API_BASE_URL)
  .then(res => res.json())
  .then(result => {
    
    const productsArray = result.products || result.data || [];

    if (!productsArray || !productsArray.length) {
      container.innerHTML = "<p>No products found</p>";
      return;
    }

    // =========================
    // Group products by category
    // =========================
    const categoriesMap = {};

    productsArray.forEach(item => {
      const category = item.category || "Other";

      if (!categoriesMap[category]) {
        categoriesMap[category] = [];
      }

      categoriesMap[category].push(item);
    });

    // =========================
    // Render categories + products
    // =========================
   let finalHTML = "";

for (const category in categoriesMap) {
  finalHTML += `
    <section class="category-section">
     <a href="category.html?category=${encodeURIComponent(category)}"
         class="category-title d-block text-decoration-none">
        ${category}
      </a>

      <div class="product-grid">
  `;

  categoriesMap[category].forEach(item => {
    const product = new Product(item);
    finalHTML += product.render();
  });
  

  finalHTML += `
      </div>
    </section>
  `;
}

container.innerHTML = finalHTML;

    // =========================
    // Hover image handling
    // =========================
    document.querySelectorAll(".product-img").forEach(img => {
      const originalSrc = img.src;
      const hoverSrc = img.dataset.hover;

      if (hoverSrc && hoverSrc !== originalSrc) {
        img.addEventListener("mouseenter", () => img.src = hoverSrc);
        img.addEventListener("mouseleave", () => img.src = originalSrc);
      }
    });
  })
  .catch(err => {
    console.error("Error fetching products:", err);
    container.innerHTML = "<p> error in loading product</p>";
  });


















  