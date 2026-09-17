/* Menu & Submenus */
Array.from(document.getElementsByClassName('menu-toggle')).forEach(element => {
	element.addEventListener('click',event => {
		event.currentTarget.classList.toggle('active');
		document.getElementById(event.currentTarget.dataset.toggle).classList.toggle('active');
		if( event.currentTarget.dataset.original ) {
			document.getElementById(event.currentTarget.dataset.original).classList.remove('active');
		}
	});
});

/* Toggle Main Menu (Phone Only) */
document.getElementById('toggle-main-menu').addEventListener("click",event => {
	event.currentTarget.classList.toggle('active');
	document.documentElement.style.overflow = document.documentElement.style.overflow == 'hidden' ? 'auto':'hidden';
});

/* Toggle Mini Cart */
const cartPanel = document.getElementById('cart-panel');

document.getElementById('open-cart-panel').addEventListener('click',() => {
	cartPanel.classList.add('active');
});

const closeCart = () => {
	cartPanel.classList.remove('active');
};

document.getElementById('close-cart-panel').addEventListener('click',closeCart);
cartPanel.getElementsByClassName('layout')[0].addEventListener('click',closeCart);

//Dynamic Cart
const getProductUrl = id => (window.location.pathname.includes('/pages/') ? '' : 'pages/') + 'single-product.html?id=' + id;
const updateCartCounter = () => cartCounter.dataset['count'] = Object.keys(getCart()).length;

function getCart() {
	const data = JSON.parse(localStorage.getItem('cart'));

	return data == null ? {}:data;
}

//Add, Remove & Change Cart Quantity
document.body.addEventListener('click',event => {
	if( event.target.classList.contains('add-to-cart') ) {
		const cart = getCart();
		const productId = Number(event.target.dataset['id']);
		
		if( cart[productId] == undefined ) cart[productId] = 0;

		cart[productId] += (event.target.dataset['amount'] == undefined ? 1:Math.abs(event.target.dataset['amount']));;

		localStorage.setItem('cart',JSON.stringify(cart));

		event.preventDefault();

		getSingleProduct(productId,data => {
			insertProductIntoCart(data);
		});

		cartPanel.classList.add('active');
	}
	if( event.target.classList.contains('remove-from-cart') || event.target.classList.contains('bi-trash') ) {
		const cart = getCart();
		const productId = event.target.nodeName == 'BUTTON' ? event.target.dataset['id']:event.target.parentElement.dataset['id'];
		delete cart[productId];
		
		localStorage.setItem('cart',JSON.stringify(cart));

		document.getElementById('cart-item-'+ productId).remove();
	}
});

//Get Data
const cartAjaxAgent = new XMLHttpRequest();
cartAjaxAgent.open("GET","https://iti-group-project-server.vercel.app");
cartAjaxAgent.send();

const cartCounter = document.getElementById('open-cart-panel');

const emptyCartCond = document.getElementById('empty-cart');
const cartTable = document.getElementById('cart-products-table');
const cartList = cartTable.getElementsByTagName('tbody')[0];
const cartTotals = document.getElementById('cart-totals-summary');

function fillCart(data) {
	const currentCart = getCart();

	if( Object.keys(currentCart).length == 0 ) {

		emptyCartCond.classList.replace('d-none','d-flex');
		cartTable.style.display = 'none';
	
		return;
	}

	emptyCartCond.classList.replace('d-flex','d-none');
	cartTable.style.display = 'block';

	let totalCart = 0;
	cartList.innerHTML = '';

	for( let product in currentCart ) {
		const productData = data.filter(prod => prod.id == product)[0];
		if( productData == undefined ) continue;

		totalCart += insertProductIntoCart(productData,currentCart);
	}

	cartTotals.innerText = '$'+ totalCart + ' USD';
}

function insertProductIntoCart(data,currentCart = undefined) {
		if( currentCart == undefined ) {
			currentCart = getCart();
		}

		const tr = document.createElement('tr');
		tr.id = 'cart-item-'+ data.id;

		const dataField = document.createElement('td');
		dataField.classList = 'cart-grid-field';

		const img = document.createElement('img');
		img.src = data.image;
		img.alt = data.name + " Image";
		img.width = 100;

		const brand = document.createElement('small');
		brand.innerText = data.brand;
		brand.className = 'text-primary cart-product-brand';

		const title = document.createElement('a');
		title.innerText = data.name;
		title.className = 'cart-product-name';
		title.href = getProductUrl(data.id);
		
		const price = document.createElement('span');
		price.innerText = "$"+ data.price;
		price.className = 'cart-product-price';

		const quantity = document.createElement('div');
		quantity.className = 'quantity-wrapper';

		const increaseQuantityButton = document.createElement('button');
		increaseQuantityButton.className = 'qty-btn decrease';
		increaseQuantityButton.innerText = '-';
		increaseQuantityButton.dataset['id'] = data.id;

		const quantityInput = document.createElement('input');
		quantityInput.type = 'number';
		quantityInput.value = currentCart[data.id];
		quantityInput.id = 'quantity';

		const decreaseQuantityButton = document.createElement('button');
		decreaseQuantityButton.className = 'qty-btn increase';
		decreaseQuantityButton.innerText = '+';
		decreaseQuantityButton.dataset['id'] = data.id;

		quantity.appendChild(increaseQuantityButton);
		quantity.appendChild(quantityInput);
		quantity.appendChild(decreaseQuantityButton);

		const remove = document.createElement('button');
		remove.dataset['id'] = data.id;
		remove.className = 'remove-from-cart';
		remove.innerHTML = "<i class = 'bi bi-trash'></i>";

		dataField.appendChild(img);
		dataField.appendChild(brand);
		dataField.appendChild(title);
		dataField.appendChild(price);
		dataField.appendChild(quantity);
		dataField.appendChild(remove);

		tr.appendChild(dataField);

		const total = document.createElement('td');
		total.innerText = "$"+ (data.price * currentCart[data.id]);

		tr.appendChild(total);

		cartList.appendChild(tr);

		return (data.price * currentCart[data.id]);
}

cartAjaxAgent.addEventListener('readystatechange',() => {
	if( cartAjaxAgent.readyState == 4 ) {
		fillCart(JSON.parse(cartAjaxAgent.response).data);
	}
});

//Initial Cart Counter
window.addEventListener('load',updateCartCounter);

//Header Show on Scroll Down
let lastScrollArea = 0;
const headerElement = document.getElementById('main-site-header');
window.addEventListener('scroll',() => {
	const currentScrollArea = window.scrollY;
	if( currentScrollArea >= window.innerHeight && currentScrollArea > lastScrollArea ) {
		headerElement.style.top = "0";
		headerElement.style.position = 'sticky';
		headerElement.style.boxShadow = '0 0 10px #000';
	}else if ( lastScrollArea > currentScrollArea ) {
		headerElement.style.top = "-100px";
		if( currentScrollArea < window.innerHeight ) {
			headerElement.style.position = 'static';
			headerElement.style.boxShadow = 'none';
		}	
	}
	lastScrollArea = currentScrollArea;
});

//Quantity
const increaseQuantity = function(event) {
	const quantity = event.target.previousElementSibling;
	quantity.value = Number(quantity.value) + 1;
	return quantity.value;
}

const decreaseQuantity = function(event) {
	const quantity = event.target.nextElementSibling;
	const value = Number(quantity.value);
	if( value <= 1 ) return;

	quantity.value = Number(quantity.value) - 1;
	return quantity.value;
}

//Quantity In Mini Cart
window.addEventListener('click',event => {
	if( event.target.classList.contains('qty-btn') ) {
		const cart = getCart();
		const productId = event.target.dataset['id'];

		if( event.target.classList.contains('increase') ) {
			increaseQuantity(event);
			cart[productId]++;
		}else {
			decreaseQuantity(event);
			cart[productId]--;

			if( cart[productId] <= 0 ) {
				delete cart[productId];
				document.getElementById('cart-item-'+ productId).remove();
			}
		}

		localStorage.setItem('cart',JSON.stringify(cart));
	}
});

//Fill Products In Slider
function fillSlider(data,section) {

	const slider = section.getElementsByClassName('products-carousel')[0];
	const container = slider.getElementsByClassName('carousel-container')[0];

	slider.dataset['current'] = 0;
	slider.dataset['count'] = data.length;

	container.innerHTML = '';

	const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

	for(let product of data) {

		container.innerHTML += `<a class="text-decoration-none product-card h-100" href = '${getProductUrl(product.id)}'>
              <img
                src="${product.image}"
                class="product-img"
                alt="product"
              />

							<span data-id = '${product.id}' class = 'heart' style='${wishlist.find(item => item == product.id) ? "color:#611111":"color:#4c4848"}'><i class = 'bi ${wishlist.find(item => item == product.id) ? "bi-heart-fill":"bi-heart"}'></i></span>

              <div class="product-body">
                <h6 class="product-title">${product.name}</h6>
                <p class="product-brand">${product.brand}</p>
                <p class="product-price">$${product.price} USD</p>
              </div>

              <button class="btn product-btn w-100 add-to-cart" data-id = "${product.id}">Add to cart</button>
            </a>`;
	}
}

function insertProducts(data,container,maximum) {
	container.innerHTML = '';
	const total = maximum;

	for(let product of data) {
		maximum--;
		if( maximum < 0 ) break;

		container.innerHTML += `<a class="col-12 col-md-${12 / total} text-decoration-none h-100" href = '${getProductUrl(product.id)}'>
            <div class="product-card h-100">  
				<img
					src="${product.image}"
					class="product-img"
					alt="product"
				/>

              <div class="product-body">
                <h6 class="product-title">${product.name}</h6>
                <p class="product-brand">${product.brand}</p>
                <p class="product-price">$${product.price} USD</p>
              </div>

              <button class="glass-btn product-btn w-100 add-to-cart" data-id = "${product.id}">Add to cart</button>
			</div>
		</a>`;
	}
}

//Ajax Get Products
function getSingleProduct(id,cb) {
	const agent = new XMLHttpRequest();

	agent.open('GET','https://iti-group-project-server.vercel.app/'+ id);
	agent.send();

	agent.addEventListener('readystatechange',() => {
		if( agent.readyState === 4 ) {
			cb(JSON.parse(agent.response));
		}
	});
}

function getCategoryProducts(category,callback,section) {
	let agent = new XMLHttpRequest();

	agent.open('GET','https://iti-group-project-server.vercel.app?category='+ category);
	agent.send();

	agent.addEventListener('readystatechange',() => {
		if( agent.readyState === 4 )
			callback(JSON.parse(agent.response),section);
	});
}

function getAllProducts(callback,section) {
	let agent = new XMLHttpRequest();
	agent.open("GET","https://iti-group-project-server.vercel.app");
	agent.send();

	//Start Loading
	if( section != null ) {
		section.classList.add('is-loading');
	}

	agent.addEventListener('readystatechange',() => {
		if( agent.readyState === 4 ) {
			//Stop Loading
		if( section != null ) {
			section.classList.remove('is-loading');
		}

			callback(JSON.parse(agent.response),section);
		}
	});
}