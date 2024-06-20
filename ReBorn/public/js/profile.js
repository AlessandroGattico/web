document.addEventListener('DOMContentLoaded', (event) => {
	const tabLinks = document.querySelectorAll('.nav-link');
	const tabPanes = document.querySelectorAll('.tab-pane');

	tabLinks.forEach(link => {
		link.addEventListener('click', (event) => {
			event.preventDefault();

			tabLinks.forEach(link => link.classList.remove('active'));

			link.classList.add('active');

			tabPanes.forEach(pane => pane.classList.remove('active', 'show'));

			const targetTab = document.querySelector(link.getAttribute('href'));
			targetTab.classList.add('active', 'show');
		});
	});
});


function renderTabContent(tabId, data) {
	const tabPane = document.getElementById(tabId);
	tabPane.innerHTML = '';

	if (data.length > 0) {
		data.forEach(item => {
			const itemDiv = document.createElement('div');
			itemDiv.classList.add('media', 'mt-25');
			tabPane.appendChild(itemDiv);
		});
	} else {
		tabPane.innerHTML = '<p>Nessun elemento trovato.</p>';
	}
}
