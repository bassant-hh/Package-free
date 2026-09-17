const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

const main = document.getElementById('product-details');

fetch(`https://iti-group-project-server.vercel.app/${productId}`)
  .then(res => res.json())
  .then(product => {
    console.log(product);
    const imagesArray = [product.image, ...(product.additional_images || [])];
    const carouselItems = imagesArray.map((img, index) => `
      <div class="carousel-item ${index === 0 ? 'active' : ''}">
        <img src="${img}" alt="${product.name}" class="img-fluid"
             style="width:400px; height:300px; object-fit:cover; border:2px solid #1d3a24; border-radius:18px; padding:20px;">
      </div>
    `).join('');


    main.innerHTML = `
      <div class="row">
        <div class="col-md-6">
           <div id="productCarousel" class="carousel slide" data-bs-ride="false">
            <div class="carousel-inner">
              ${carouselItems}
            </div>
            <button class="carousel-control-prev" type="button" data-target="#productCarousel" data-slide="prev">
              <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-target="#productCarousel" data-slide="next">
              <span class="carousel-control-next-icon"></span>
            </button>
          </div>
          <span data-id='${product.id}' class='heart' style='${wishlist.find(item => item == product.id) ? "color:#611111" : "color:#4c4848"}'>
            <i class='bi ${wishlist.find(item => item == product.id) ? "bi-heart-fill" : "bi-heart"}'></i>
          </span>
        </div>

        <div class="col-md-6">
          <h2>${product.name}</h2>
          <p>Brand: ${product.brand}</p>
          <p>Price: $${product.price.toFixed(2)} ${product.currency}</p>
          <p>${product.description}</p>
          <p>${product.usage}</p>
          <p>${product.ingredients}</p>

          <button class="btn btn-primary mb-3 add-to-cart" data-id="${product.id}" id="mainBtn">Add to Cart</button>

          <div class="quantity-wrapper">
            <button class="qty-btn" id="decrease-single-product">−</button>
            <input type="number" value="1" id="quantity" />
            <button class="qty-btn" id="increase-single-product">+</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('increase-single-product').addEventListener('click', event => {
      const newAmount = increaseQuantity(event);
      updateAddToCartAmount(newAmount);
    });

    document.getElementById('decrease-single-product').addEventListener('click', event => {
      const newAmount = decreaseQuantity(event);
      updateAddToCartAmount(newAmount);
    });

    function updateAddToCartAmount(newAmount) {
      const addToCartButton = document.getElementById('mainBtn');
      addToCartButton.dataset['amount'] = newAmount;
    }

  })
  .catch(err => {
    main.innerHTML = `<p class="text-danger">Failed to load product</p>`;
    console.error(err);
  });
