// ===========================================
// Wishlist setup
// ===========================================
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
const wishlistCounter = document.getElementById("wishlist-cont");

window.addEventListener("click", e => {
  if( (e.target.id != 'wishlist-cont' && e.target.classList.contains('wishlist-main-counter') == false) && (e.target.classList.contains('wishlist') || e.target.classList.contains('bi-heart-fill') || e.target.classList.contains('bi-heart')) ) {

    e.stopPropagation();
    e.preventDefault();

    const prdId = (e.target.classList.contains('bi') ? e.target.parentElement.dataset['id']:e.target.dataset['id']);
    const mainElement = (e.target.classList.contains('bi') ? e.target.parentElement:e.target);
    const icon = (e.target.classList.contains('bi') ? e.target:e.target.getElementsByClassName('bi')[0]);

    if (wishlist.includes(prdId)) {
      wishlist = wishlist.filter(id => id !== prdId);
      icon.classList.replace("bi-heart-fill", "bi-heart");
      mainElement.style.color = "#4c4848";
    } else {
      wishlist.push(prdId);
      icon.classList.replace("bi-heart", "bi-heart-fill");
      mainElement.style.color = "#611111";
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistCount();
  }
});

function updateWishlistCount() {
  if (wishlistCounter) wishlistCounter.dataset['count'] = wishlist.length;
}
updateWishlistCount();

// ===========================================
// Product constructor
// ===========================================
/*function Product(data) {
  this.id = data.id;
  this.name = data.name;
  this.brand = data.brand;
  this.price = data.price;
  this.currency = data.currency || "USD";
  this.category = data.category;
  this.image = data.image;
  this.hoverImage = data.hover_image_url || data.image;

  this.render = function () {
    return `
      <a href="single-product.html?id=${this.id}" class="product-grid-item">
        <div class="product-card">
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
            <button class="add-to-cart product-btn" data-id="${this.id}">Add to cart</button>
          </div>
        </div>
      </a>
    `;
  };
}

// ===========================================
// Add hearts to each product card
// ===========================================
function addHearts() {  
  document.querySelectorAll(".product-card").forEach(card => {
    if (card.querySelector(".heart")) return; 
    const heart = document.createElement("span");
    heart.className = "heart";
    heart.innerHTML = `<i class="fa-regular fa-heart"></i>`;
    card.insertBefore(heart, card.firstChild); 

    const icon = heart.querySelector("i");
    const addToCartBtn = card.querySelector(".add-to-cart");
    const prdId = addToCartBtn ? addToCartBtn.dataset.id : null;
    if (!prdId) return;

    if (wishlist.includes(prdId)) {
      icon.classList.replace("fa-regular", "fa-solid");
      heart.style.color = " #611111";
    } else {
      heart.style.color = "#4c4848";
    }
  });
}

// ===========================================
// Fetch products and render
// ===========================================
const container = document.querySelector(".product-grid");

fetch("http://localhost:8000")
  .then(res => res.json())
  .then(result => {
    const productsArray = result.products || result.data || [];
    if (!productsArray || !productsArray.length) {
      container.innerHTML = "<p>No products found</p>";
      return;
    }

    const categoriesMap = {};
    productsArray.forEach(item => {
      const category = item.category || "Other";
      if (!categoriesMap[category]) categoriesMap[category] = [];
      categoriesMap[category].push(item);
    });

    let finalHTML = "";
    for (const category in categoriesMap) {
      finalHTML += `
        <section class="category-section">
          <a href="category.html?category=${encodeURIComponent(category)}" class="category-title d-block text-decoration-none">
            ${category}
          </a>
          <div class="product-grid">
      `;
      categoriesMap[category].forEach(item => {
        const product = new Product(item);
        finalHTML += product.render();
      });
      finalHTML += `</div></section>`;
    }

    container.innerHTML = finalHTML;

    addHearts();

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
    container.innerHTML = "<p> error in adding wishlist </p>";
  });
*/