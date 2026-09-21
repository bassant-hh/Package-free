var is_home = true; //For Search Script

//On-Scroll Effect
const elements = Array.from(document.getElementsByClassName('show-on-scroll'));
function onScroll(event) {
	if( (elements[0].offsetTop - (elements[0].offsetHeight / 2)) <= (window.scrollY + (window.innerHeight / 1.5)) ) {
		elements[0].classList.add('show');
		elements.shift();
	}

	if( elements.length == 0 ) {
		window.removeEventListener('scroll',onScroll);
	}
}

window.addEventListener('scroll',onScroll);

//Product Carousel
function changeSlide(slide,changeBy) {
	let newPos = Number(slide.dataset['current']) + changeBy;
	const limit = Number(slide.dataset['limit']);

	if( newPos >= limit ) {
		newPos = 0;
	}else if( newPos < 0 ) {
		newPos = limit - 1;
	}

	slide.dataset['current'] = newPos;

	slide.getElementsByClassName('carousel-current')[0].innerText = newPos + 1;
	slide.getElementsByClassName('carousel-container')[0].style.left = '-'+ (newPos * 100) +'%';
}

Array.from(document.getElementsByClassName('products-carousel')).forEach(slide => {

	const container = slide.getElementsByClassName('carousel-container');
	if( container.length == 0 ) return;

	slide.dataset['count'] = container[0].children.length;
	slide.dataset['current'] = 0;

	const assignSlideProps = () => {
		const count = container[0].children.length;
		slide.dataset['count'] = count;
		const perPage = document.body.offsetWidth >= 768 ? 5 : 2;
		const limit = Math.max(1, Math.ceil(count / perPage));
		slide.dataset['limit'] = limit;

		let current = Number(slide.dataset['current'] || 0);
		if (current >= limit) {
			current = 0;
			slide.dataset['current'] = 0;
		}

		const currentEl = slide.getElementsByClassName('carousel-current')[0];
		if (currentEl) currentEl.innerText = current + 1;

		const limitEl = slide.getElementsByClassName('carousel-limit')[0];
		if (limitEl) limitEl.innerText = limit;

		container[0].style.width = (limit * 100) + '%';
		container[0].style.left = '-' + (current * 100) + '%';
	};

	slide.assignSlideProps = assignSlideProps;


	//Drag & Slide Effect On Slider + Touching
	var anchorPosition = undefined;
	const getClientX = ev => {
		if (ev.changedTouches && ev.changedTouches.length > 0) return ev.changedTouches[0].clientX;
		if (ev.touches && ev.touches.length > 0) return ev.touches[0].clientX;
		return ev.clientX;
	};

	const eventDownFunc = downEvent => {
		anchorPosition = getClientX(downEvent);
	};

	const eventMoveFunc = moveEvent => {
		if( anchorPosition == undefined ) return;

		let currentPosition = getClientX(moveEvent);
		if( moveEvent.type && moveEvent.type.startsWith('touch') ) {
			moveEvent.preventDefault();
		}

		container[0].style.marginLeft = ((currentPosition - anchorPosition) / 1.75) + 'px';
	};

	const eventUpFunc = upEvent => {
		if( anchorPosition == undefined ) return;

		container[0].style.marginLeft = '0px';
		let diff = anchorPosition - getClientX(upEvent);
		
		anchorPosition = undefined;
		if( diff >= 40 ) {
			changeSlide(slide, 1);
		}else if( diff <= -40 ) {
			changeSlide(slide, -1);
		}
	};

	container[0].addEventListener('mousedown',eventDownFunc);
	container[0].addEventListener('mouseup',eventUpFunc);
	container[0].addEventListener('mousemove',eventMoveFunc);

	container[0].addEventListener('touchstart',eventDownFunc, { passive: true });
	container[0].addEventListener('touchmove',eventMoveFunc, { passive: false });
	container[0].addEventListener('touchend',eventUpFunc);



	window.addEventListener('resize',assignSlideProps);
	window.addEventListener('load',assignSlideProps);

	slide.getElementsByClassName('prev-slide')[0].addEventListener('click',() => {
		changeSlide(slide,-1);
	});

	slide.getElementsByClassName('next-slide')[0].addEventListener('click',() => {
		changeSlide(slide,1);
	});
});

//Load Products
getAllProducts(function(data,section) {
	if (!section) return;
	fillSlider(data.data.slice(0,9),section);
	const slide = section.getElementsByClassName('products-carousel')[0];
	if (slide && slide.assignSlideProps) {
		slide.assignSlideProps();
	}
},document.getElementById('best-sellers'));

//Laundry Category Only
getCategoryProducts(
	'Laundry',
	function(data,section){
		if (!section) return;
		fillSlider(data.data,section);
		const slide = section.getElementsByClassName('products-carousel')[0];
		if (slide && slide.assignSlideProps) {
			slide.assignSlideProps();
		}
	},
document.getElementById('laundry-category'));

// Hero Slider Interactivity
(function initHeroSlider() {
	const slider = document.getElementById('fold-slider');
	if (!slider) return;

	const slides = Array.from(slider.getElementsByClassName('fold-slider-slide'));
	const prevBtn = document.getElementById('fold-slider-nav-prev');
	const nextBtn = document.getElementById('fold-slider-nav-next');
	const placeholderNav = document.getElementById('fold-slider-placeholders');
	const placeholders = placeholderNav ? Array.from(placeholderNav.getElementsByClassName('fold-slider-single-placeholder')) : [];

	function goToHeroSlide(slideIndex) {
		const totalSlides = slides.length || 4;
		let targetIndex = Number(slideIndex);

		if (targetIndex > totalSlides) {
			targetIndex = 1;
		} else if (targetIndex < 1) {
			targetIndex = totalSlides;
		}

		slider.dataset['current'] = targetIndex;
		slider.style.left = '-' + ((targetIndex - 1) * 100) + 'vw';

		slides.forEach((slide, idx) => {
			if (idx === targetIndex - 1) {
				slide.classList.add('active');
			} else {
				slide.classList.remove('active');
			}
		});

		placeholders.forEach((btn, idx) => {
			if (idx === targetIndex - 1) {
				btn.classList.add('active');
			} else {
				btn.classList.remove('active');
			}
		});
	}

	if (nextBtn) {
		nextBtn.addEventListener('click', () => {
			const current = Number(slider.dataset['current'] || 1);
			goToHeroSlide(current + 1);
		});
	}

	if (prevBtn) {
		prevBtn.addEventListener('click', () => {
			const current = Number(slider.dataset['current'] || 1);
			goToHeroSlide(current - 1);
		});
	}

	placeholders.forEach(btn => {
		btn.addEventListener('click', () => {
			const slideId = Number(btn.dataset['slide']);
			if (slideId) {
				goToHeroSlide(slideId);
			}
		});
	});

	// Set initial state
	goToHeroSlide(Number(slider.dataset['current'] || 1));
})();