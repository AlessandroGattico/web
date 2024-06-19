function createChart(canvasId, chartData) {
	return new Chart(document.getElementById(canvasId), {
		type: 'line',
		data: chartData,
		options: {
			scales: {
				y: {
					beginAtZero: true,
					precision: 0
				},
				x: {
					type: 'time',
					time: {
						unit: 'day'
					}
				}
			}
		}
	});
}

const utentiRegistratiChart = createChart('utentiRegistratiChart', {
	labels: JSON.stringify(users.labels),
	datasets: [{
		label: 'Utenti registrati',
		data: JSON.stringify(users.data),
		fill: true,
		borderColor: 'rgb(75, 192, 192)',
		tension: 0.1
	}]
});

const prodottiVendutiChart = createChart('prodottiVendutiChart', {
	labels: <- JSON.stringify(listed.labels) ->,
	datasets: JSON.stringify(listed.datasets)
});

const prodottiAcquistatiChart = createChart('prodottiAcquistatiChart', {
	labels: JSON.stringify(products.labels),
	datasets: JSON.stringify(products.datasets)
});

function updateChartData(chart, newData) {
	chart.data.labels = newData.labels;
	chart.data.datasets = newData.datasets;
	chart.update();
}

document.getElementById('categoriaVenduti').addEventListener('change', async (event) => {
	const selectedCategory = event.target.value;
	try {
		const response = await fetch(`/admin/prodotti-venduti?categoria=${selectedCategory}`);
		const newData = await response.json();
		updateChartData(prodottiVendutiChart, newData);
	} catch (error) {
		console.error('Errore durante il recupero dei dati:', error);
	}
});

document.getElementById('categoriaAcquistati').addEventListener('change', async (event) => {
	const selectedCategory = event.target.value;
	try {
		const response = await fetch(`/admin/prodotti-acquistati?categoria=${selectedCategory}`);
		const newData = await response.json();
		updateChartData(prodottiAcquistatiChart, newData);
	} catch (error) {
		console.error('Errore durante il recupero dei dati:', error);
	}
});