document.addEventListener('DOMContentLoaded', function () {
	const checkbox = document.getElementById('accettazione');
	const registratiBtn = document.getElementById('registrati-btn');

	checkbox.addEventListener('change', function () {
		registratiBtn.disabled = !this.checked;
	});
});