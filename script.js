let navItem = document.querySelector(".nav-item");
const ctx = document.getElementById("revenueChart");
const periodSelect = document.getElementById("revenue-period");
const categoryPeriodSelect = document.getElementById("category-period");

navItem.addEventListener("click", () => {
  // alert('Dashboard clicked! This would navigate to dashboard page.');

  this.style.background = "#e6f0ff";
  this.style.color = "#0066ff";
});

// Sample data for the chart
const chartData = {
  7: [65, 59, 80, 81, 56, 55, 40],
  30: [
    45, 60, 75, 70, 68, 62, 58, 61, 64, 69, 72, 74, 76, 73, 71, 68, 67, 66, 64,
    63, 62, 60, 59, 58, 57, 55, 53, 52, 51, 50,
  ],
  90: Array.from({ length: 90 }, () => Math.floor(Math.random() * 100)), //generates random data for 90 days
};

//Function to generate labels
function generateLabels(count) {
  const labels = [];
  for (let i = 1; i <= count; i++) {
    labels.push(`Day ${i}`);
  }
  return labels;
}

// function to update chart data
function updateChart(period) {
  revenueChart.data.labels = generateLabels(period);
  revenueChart.data.datasets[0].data = chartData[period];
  revenueChart.update();
}

// initial chart setup default 7 days
const data = {
  labels: generateLabels(7),
  datasets: [
    {
      label: "Revenue",
      data: chartData[7],
      backgroundColor: "rgba(54, 162, 235, 0.5)",
       backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
    ],borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
      borderWidth: 1,
    },
  ],
};

const config = {
  type: 'bar',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Revenue Overview' }
    },
    scales: { y: { beginAtZero: true } }
  },
};

const revenueChart = new Chart(ctx, config);

// Listen for dropdown changes
periodSelect.addEventListener('change', (e) => {
  const selectedPeriod = e.target.value;
  updateChart(selectedPeriod);
});

