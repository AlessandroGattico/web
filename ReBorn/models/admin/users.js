const ctx = document.getElementById('usersChart').getContext('2d');
const usersChart = new Chart(ctx, {
	type: 'line',
	data: {
		labels: [],
		datasets: [{
			label: 'Registered Users',
			data: [], // Data goes here
			backgroundColor: 'rgba(54, 162, 235, 0.2)',
			borderColor: 'rgba(54, 162, 235, 1)',
			borderWidth: 1
		}]
	},
	options: {
		scales: {
			y: {
				beginAtZero: true
			}
		}
	}
});

// Fetch data and update chart
fetch('/api/stats/registered-users?startDate=2021-01-01&endDate=2021-12-31')
	.then(response => response.json())
	.then(data => {
		usersChart.data.labels = data.map(item => item.date);
		usersChart.data.datasets.forEach((dataset) => {
			dataset.data = data.map(item => item.count);
		});
		usersChart.update();
	});