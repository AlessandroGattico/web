let currentSlide = 0;
const slides = document.getElementsByClassName('carousel-item');
const totalSlides = slides.length;
let slideInterval;

function showSlide(index) {
	if (slides[currentSlide]) {
		slides[currentSlide].classList.remove('active');
	}
	currentSlide = (index + totalSlides) % totalSlides;
	slides[currentSlide].classList.add('active');
}

function moveSlide(step) {
	showSlide(currentSlide + step);
}

function startSlideShow() {
	slideInterval = setInterval(() => {
		moveSlide(1);
	}, 2000); // Change slides every 3000 milliseconds (3 seconds)
}

function stopSlideShow() {
	clearInterval(slideInterval);
}

document.addEventListener('DOMContentLoaded', function() {
	showSlide(currentSlide);
	startSlideShow();

	// Optional: Stops the slideshow when user hovers over the carousel
	document.querySelector('.carousel').addEventListener('mouseover', stopSlideShow);
	document.querySelector('.carousel').addEventListener('mouseout', startSlideShow);
});
