document.addEventListener('DOMContentLoaded', function () {
	const carouselItems = document.querySelectorAll('.carousel-item');
	let currentIndex = 0;

	function updateCarousel(newIndex) {
		carouselItems[currentIndex].classList.remove('active');
		carouselItems[newIndex].classList.add('active');
		currentIndex = newIndex;
	}

	document.querySelector('.carousel-control-prev').addEventListener('click', function (e) {
		e.preventDefault();
		let newIndex = currentIndex - 1;
		if (newIndex < 0) newIndex = carouselItems.length - 1;
		updateCarousel(newIndex);
	});

	document.querySelector('.carousel-control-next').addEventListener('click', function (e) {
		e.preventDefault();
		let newIndex = currentIndex + 1;
		if (newIndex >= carouselItems.length) newIndex = 0;
		updateCarousel(newIndex);
	});
});