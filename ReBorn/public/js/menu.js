document.querySelectorAll('.menu-item').forEach(item => {
	item.addEventListener('mouseover', () => {
		let submenu = item.querySelector('.sub-menu');
		if (submenu) {
			let itemCount = submenu.children.length;
			let itemHeight = 48;
			let maxHeight = itemHeight * Math.min(itemCount, 8);
			submenu.style.maxHeight = maxHeight + 'px';
		}
	});
});