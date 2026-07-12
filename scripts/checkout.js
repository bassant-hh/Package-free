
        // Current payment method
        let currentPaymentMethod = 'creditcard';
        let currentBillingMethod = 'same';

        var products = [];

        const productsList = document.getElementById('productsList');

        // Function to render products
        function renderProducts(p = null) {
            
            const cart = getCart();
            const cartProducts = Object.keys(cart).map(Math.abs);

            if( p == null ) p = products;

            let inCartProducts = [];

            for(let product of p ) {

                if( cartProducts.indexOf(product.id) == -1 ) continue;

                product.quantity = cart[product.id];
                inCartProducts.push(product);
                productsList.innerHTML += `<div class="product-item">
                    <div class="product-image-wrapper">
                        <img src="${product.image}" alt="${product.name}" class="product-image">
                        <div class="product-quantity">${cart[product.id]}</div>
                    </div>
                    <div class="product-details">
                        <div class="product-name">${product.name}</div>
                        <div class="product-variant">${product.brand}</div>
                    </div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                </div>
            `;}
            
            updateTotals(inCartProducts);
            updateCartBadge();
        }

        // Function to calculate and update totals
        function updateTotals(products) {
            const subtotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
            document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('total').textContent = `$${subtotal.toFixed(2)}`;
        }

        // Function to update cart badge
        function updateCartBadge() {
            const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
            document.getElementById('cartBadge').textContent = totalItems;
        }

        // Function to add product
        function addProduct(product) {
            const existingProduct = products.find(p => p.id === product.id);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                products.push(product);
            }
            renderProducts();
        }

        // Function to remove product
        function removeProduct(productId) {
            products = products.filter(p => p.id !== productId);
            renderProducts();
        }

        // Function to update product quantity
        function updateQuantity(productId, newQuantity) {
            const product = products.find(p => p.id === productId);
            if (product) {
                product.quantity = Math.max(1, newQuantity);
                renderProducts();
            }
        }

        // Function to select payment method
        function selectPayment(method) {
            // Remove active class from all payment options
            document.querySelectorAll('.payment-option').forEach(option => {
                option.classList.remove('active');
            });
            
            // Add active class to selected option
            const selectedOption = document.querySelector(`.payment-option[data-payment="${method}"]`);
            if (selectedOption) {
                selectedOption.classList.add('active');
            }
            
            // Update radio button
            const radio = document.querySelector(`input[value="${method}"]`);
            if (radio) {
                radio.checked = true;
            }
            
            currentPaymentMethod = method;
            updateSubmitButton();
        }

        // Function to select billing method
        function selectBilling(method) {
            // Remove active class from all billing options
            document.querySelectorAll('.billing-option').forEach(option => {
                option.classList.remove('active');
            });
            
            // Add active class to selected option
            const selectedOption = document.querySelector(`.billing-option[data-billing="${method}"]`);
            if (selectedOption) {
                selectedOption.classList.add('active');
            }
            
            // Update radio button
            const radio = document.querySelector(`input[value="${method}"]`);
            if (radio) {
                radio.checked = true;
            }
            
            currentBillingMethod = method;
        }

        // Function to update submit button text based on payment method
        function updateSubmitButton() {
            const submitBtn = document.getElementById('submitBtn');
            
            if (currentPaymentMethod === 'paypal') {
                submitBtn.style.display = 'none';
            } else if (currentPaymentMethod === 'shoppay') {
                submitBtn.textContent = 'Continue to Shop Pay';
                submitBtn.style.display = 'block';
            } else {
                submitBtn.textContent = 'Pay now';
                submitBtn.style.display = 'block';
            }
        }

        // Apply discount code
        function applyDiscount() {
            const code = document.getElementById('discountCode').value.trim();
            if (code) {
                alert('Discount code applied: ' + code);
                // هنا يمكن إضافة منطق تطبيق الخصم الفعلي
            }
        }

        // Form submission
        document.getElementById('checkoutForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                email: document.getElementById('email').value,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                address: document.getElementById('address').value,
                apartment: document.getElementById('apartment').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                postal: document.getElementById('postal').value,
                phone: document.getElementById('phone').value,
                paymentMethod: currentPaymentMethod,
                billingAddress: currentBillingMethod,
                products: products,
                total: document.getElementById('total').textContent
            };
            
            if (currentPaymentMethod === 'creditcard') {
                formData.cardNumber = document.getElementById('cardNumber').value;
                formData.expiry = document.getElementById('expiry').value;
                formData.cvv = document.getElementById('cvv').value;
                formData.cardName = document.getElementById('cardName').value;
            }
            
            console.log('Order submitted:', formData);
            alert('Order submitted successfully! Check console for details.');
        });

        // Initialize
        const agent = new XMLHttpRequest();
        agent.open('GET','https://iti-group-project-server.vercel.app');
        agent.send();

        agent.addEventListener('readystatechange',() => {
            if(agent.readyState === 4) {
                productsList.classList.remove('is-loading');
                renderProducts(JSON.parse(agent.response).data);
            }
        });