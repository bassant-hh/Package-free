const wishlistTable = document.getElementById('wishlist-contents');

if( wishlist.length == 0 ) {
	wishlistTable.innerHTML = '<tr><td colspan = "4">Not Products In Your Wishlist Yet</td></tr>';
}else {
	wishlistTable.innerHTML = '';

	getAllProducts((products) => {
		let counter = 0;
		for(let product of products.data) {
			if( wishlist.find(item => item == product.id) == undefined )
				continue;

			wishlistTable.innerHTML += `<tr>
			<td>${++counter}</td>
			<td><a href = 'single-product.html?id=${product.id}'>${product.name}</a></td>
			<td>$${product.price} USD</td>
			<td>
				<button type = 'button' class = 'bg-transparent border-0 text-danger remove-wishlist' data-id = '${product.id}'>
					<i class = 'bi bi-trash'></i>
				</button>
			</td>
		</tr>`;
		}
	},null);
}

window.addEventListener('click',event => {
	if( event.target.classList.contains('remove-wishlist') || event.target.classList.contains('bi-trash') ) {
		const row = event.target.classList.contains('remove-wishlist') ? event.target:event.target.parentElement;
		const productId = row.dataset['id'];
		newWishlist = wishlist.filter(item => item != productId);
		
		localStorage.setItem('wishlist',JSON.stringify(newWishlist));
		wishlist = [...newWishlist];

		window.location.reload();
	}
});