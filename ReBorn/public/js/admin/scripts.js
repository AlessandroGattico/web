window.addEventListener('DOMContentLoaded', event => {
	const sidebarToggle = document.body.querySelector('#sidebarToggle');
	if (sidebarToggle) {
		// Uncomment Below to persist sidebar toggle between refreshes
		// if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
		//     document.body.classList.toggle('sb-sidenav-toggled');
		// }
		sidebarToggle.addEventListener('click', event => {
			event.preventDefault();
			document.body.classList.toggle('sb-sidenav-toggled');
			localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
		});
	}

});

window.addEventListener('DOMContentLoaded', event => {
	const datatablesSimple = document.getElementById('datatablesSimple');
	if (datatablesSimple) {
		new simpleDatatables.DataTable(datatablesSimple);
	}
});

function getLast30Days() {
	const dates = [];
	for (let i = 29; i >= 0; i--) {
		let date = new Date();
		date.setDate(date.getDate() - i);
		dates.push(date.toLocaleDateString('en-US'));  // Modifica il locale se necessario
	}
	return dates;
}


Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

const labels = getLast30Days()
const sessionData = []
const nome = ""

const ctx = document.getElementById("myAreaChart");
const myLineChart = new Chart(ctx, {
	type: 'line',
	data: {
		labels: labels,
		datasets: [{
			label: nome,
			lineTension: 0.3,
			backgroundColor: "rgba(2,117,216,0.2)",
			borderColor: "rgba(2,117,216,1)",
			pointRadius: 5,
			pointBackgroundColor: "rgba(2,117,216,1)",
			pointBorderColor: "rgba(255,255,255,0.8)",
			pointHoverRadius: 5,
			pointHoverBackgroundColor: "rgba(2,117,216,1)",
			pointHitRadius: 50,
			pointBorderWidth: 2,
			data: sessionData,
		}],
	},
	options: {
		scales: {
			xAxes: [{
				time: {
					unit: 'date'
				},
				gridLines: {
					display: false
				},
				ticks: {
					maxTicksLimit: 7
				}
			}],
			yAxes: [{
				ticks: {
					min: 0,
					max: 40000,
					maxTicksLimit: 5
				},
				gridLines: {
					color: "rgba(0, 0, 0, .125)",
				}
			}],
		},
		legend: {
			display: false
		}
	}
});
