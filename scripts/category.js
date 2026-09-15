function Product(data) {
    this.id = data.id;
    this.name = data.name;
    this.brand = data.brand;
    this.price = data.price;
    this.currency = data.currency || "USD";
    this.category = data.category;
    this.image = data.image;
    this.usage = data.usage;
    this.ingredients = data.ingredients;
    this.additional_images = data.additional_images;


    this.hoverImage = data.hover_image_url || data.image;
    this.description = data.description || "";

    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    this.render = function () {
      return `
        <a class="product-grid-item" href = "single-product.html?id=${this.id}">
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
              <button class="product-btn add-to-cart" data-id = "${this.id}">Add to cart</button>
            </div>
          </div>
        </a>
      `;
    };
  }



const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');

  // page adress
  const pageTitle = document.querySelector('h1') || document.createElement('h1');
  if (category) {
    pageTitle.textContent = ` ${category}`;
  } else {
    pageTitle.textContent = 'all category';
  }

  // build url 
  let fetchUrl = 'http://localhost:8000';
  if (category) {
    fetchUrl += '?category=' + encodeURIComponent(category);
  }

  console.log(' url that reqest from it :', fetchUrl);

  fetch(fetchUrl)
    .then(res => {
      console.log('  response from server :', res.status, res.statusText);
      if (!res.ok) throw new Error('  proplem in response : ' + res.status);
      return res.json();
    })
    .then(result => {
      console.log(' all data that come  :', result);

    
      // { count: ..., products: [...] } أو { count: ..., data: [...] }
const products = result.data || result.products || [];
      console.log('number of product that come after filtring :', products.length);
      console.log('first product (if exist)', products[0] || 'is not here ');

      const container = document.querySelector('.product-grid') || document.body;

      if (products.length === 0) {
        container.innerHTML = '<p class="text-center py-5">there  is no prioduct in this catrgory</p>';
        return;
      }

      let html = '';
      products.forEach(item => {
        const prod = new Product(item);
        html += prod.render();
      });

      container.innerHTML = html;

      // hover effect
      document.querySelectorAll('.product-img').forEach(img => {
        const orig = img.src;
        const hov = img.dataset.hover;
        if (hov && hov !== orig) {
          img.addEventListener('mouseenter', () => img.src = hov);
          img.addEventListener('mouseleave', () => img.src = orig);
        }
      });
    })
    .catch(err => {
      console.error('  error in fetching :', err);
      document.body.innerHTML += '<p style="color:red; text-align:center;">Failed to load products: ' + err.message + '</p>';
    });