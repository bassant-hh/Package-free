const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

const main = document.getElementById('product-details');

fetch(`https://iti-group-project-server.vercel.app/${productId}`)
  .then(res => res.json())
  .then(product => {
main.innerHTML = `
  <div class="row">
    <div class="col-md-6">
      <img src="${product.image}" alt="${product.name}" class="img-fluid">
      <span data-id = '${product.id}' class = 'heart' style='${wishlist.find(item => item == product.id) ? "color:#611111":"color:#4c4848"}'><i class = 'bi ${wishlist.find(item => item == product.id) ? "bi-heart-fill":"bi-heart"}'></i></span>
    </div>

    <div class="col-md-6">
      <h2>${product.name}</h2>
      <p>Brand: ${product.brand}</p>
      <p>Price: $${product.price.toFixed(2)} ${product.currency}</p>
      <p>${product.description}</p>

      <button class="btn btn-primary mb-3 add-to-cart" data-id = "${product.id}"  id="mainBtn">Add to Cart</button>

      <div class="quantity-wrapper">
        <button class="qty-btn" id="decrease-single-product">−</button>
        <input type = "number" value = "1" id="quantity" />
        <button class="qty-btn" id="increase-single-product">+</button>
      </div>
    </div>
  </div>
`;
    document.getElementById('increase-single-product').addEventListener('click',event => {
      const newAmount = increaseQuantity(event);
      updateAddToCartAmount(newAmount);
    });

    document.getElementById('decrease-single-product').addEventListener('click',event => {
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
