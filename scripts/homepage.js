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
		if( document.body.offsetWidth >= 768 ) {
			slide.dataset['limit'] = Math.ceil(slide.dataset['count'] / 2);
		}else {
			slide.dataset['limit'] = Math.ceil(slide.dataset['count'] / 5);
		}

		slide.getElementsByClassName('carousel-limit')[0].innerText = slide.dataset['limit'];

		container[0].style.width = Number(slide.dataset['limit']) * 100 +'%';
	};


	//Drag & Slide Effect On Slider + Touching
	var anchorPosition = undefined;
	const eventDownFunc = downEvent => {
		anchorPosition = downEvent.__proto__.constructor.name == 'TouchEvent' ? downEvent.changedTouches[0].clientX:downEvent.clientX;
	};

	const eventMoveFunc = moveEvent => {
		if( anchorPosition == undefined ) return;

		let currentPosition = 0;
		
		if( moveEvent.__proto__.constructor.name === 'TouchEvent' ) currentPosition = moveEvent.changedTouches[0].clientX;
		else currentPosition = moveEvent.clientX;

		if( Math.abs(anchorPosition - currentPosition) <= 150 ) {
			container[0].style.marginLeft = ((currentPosition - anchorPosition) / 1.75) + 'px';
		}
	}

	const eventUpFunc = upEvent => {

		container[0].style.marginLeft = '0px';
		let diff = 0;
		if( upEvent.__proto__.constructor.name === 'TouchEvent' ) diff = anchorPosition - upEvent.changedTouches[0].clientX;
		else diff = anchorPosition - upEvent.clientX;
		
		anchorPosition = undefined;
		if( diff >= 100 ) {
			changeSlide(container[0].parentElement,1);
		}else if( diff <= -100 ) {
			changeSlide(container[0].parentElement,-1);
		}
	};

	container[0].addEventListener('mousedown',eventDownFunc);
	container[0].addEventListener('mouseup',eventUpFunc);
	container[0].addEventListener('mousemove',eventMoveFunc);

	//container[0].addEventListener('touchstart',eventDownFunc);
	//container[0].addEventListener('touchmove',eventMoveFunc);
	//container[0].addEventListener('touchend',eventUpFunc);

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
	fillSlider(data.data.slice(0,9),section);
	const slide = section.getElementsByClassName('products-carousel')[0];
	if( document.body.offsetWidth >= 768 ) {
		slide.dataset['limit'] = Math.ceil(slide.dataset['count'] / 2);
	}else {
		slide.dataset['limit'] = Math.ceil(slide.dataset['count'] / 5);
	}

	slide.getElementsByClassName('carousel-limit')[0].innerText = slide.dataset['limit'];

	slide.getElementsByClassName('carousel-container')[0].style.width = Number(slide.dataset['limit']) * 100 +'%';
},document.getElementById('best-sellers'));

//Laundry Category Only
getCategoryProducts(
	'Laundry',
	function(data,section){
		fillSlider(data.data,section);
		const slide = section.getElementsByClassName('products-carousel')[0];
		if( document.body.offsetWidth >= 768 ) {
			slide.dataset['limit'] = Math.ceil(slide.dataset['count'] / 2);
		}else {
			slide.dataset['limit'] = Math.ceil(slide.dataset['count'] / 5);
		}

		slide.getElementsByClassName('carousel-limit')[0].innerText = slide.dataset['limit'];

		slide.getElementsByClassName('carousel-container')[0].style.width = Number(slide.dataset['limit']) * 100 +'%';
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