let navItems = document.querySelectorAll(".nav-item");
const ctx = document.getElementById("revenueChart");
const periodSelect = document.getElementById("revenue-period");
const categoryCtx = document.getElementById("categoryChart").getContext("2d");
const dashboard = document.querySelector(".dashboard");
const sidebar = document.querySelector(".nav-rail");
const transactionBody = document.getElementById("transaction-body");
const transactionFilter = document.querySelector(".transaction-filter");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
  });
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
const revenueData = {
  labels: generateLabels(7),
  datasets: [
    {
      label: "Revenue",
      data: chartData[7],
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(255, 205, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(201, 203, 207, 0.2)",
      ],
      borderColor: [
        "rgb(255, 99, 132)",
        "rgb(255, 159, 64)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
        "rgb(54, 162, 235)",
        "rgb(153, 102, 255)",
        "rgb(201, 203, 207)",
      ],
      borderWidth: 1,
    },
  ],
};

const config = {
  type: "bar",
  data: revenueData,
  options: {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Revenue Overview" },
    },
    scales: { y: { beginAtZero: true } },
  },
};

const revenueChart = new Chart(ctx, config);

// Listen for dropdown changes
periodSelect.addEventListener("change", (e) => {
  const selectedPeriod = e.target.value;
  updateChart(selectedPeriod);
});

// Sample data for doughnut chart
const categoryDataSets = {
  "this-month": {
    labels: ["Electronics", "Clothing", "Home Goods"],
    data: [300, 150, 100],
  },
  "last-month": {
    labels: ["Electronics", "Clothing", "Home Goods"],
    data: [200, 250, 180],
  },
  "this-quarter": {
    labels: ["Electronics", "Clothing", "Home Goods"],
    data: [700, 500, 400],
  },
};

// Initial chart setup
let currentPeriod = "this-month";
const chartColors = [
  "rgb(255, 99, 132)",
  "rgb(54, 162, 235)",
  "rgb(255, 205, 86)",
];

let categoryChart = new Chart(categoryCtx, {
  type: "doughnut",
  data: {
    labels: categoryDataSets[currentPeriod].labels,
    datasets: [
      {
        label: "Sales by Category",
        data: categoryDataSets[currentPeriod].data,
        backgroundColor: chartColors,
        hoverOffset: 4,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  },
});

//Handle dropdown change
document.getElementById("category-period").addEventListener("change", (e) => {
  const period = e.target.value;
  const dataset = categoryDataSets[period];

  categoryChart.data.labels = dataset.labels;
  categoryChart.data.datasets[0].data = dataset.data;
  categoryChart.update();
});

// TRANSACTION SECTION
document.addEventListener("DOMContentLoaded", () => {
  const transactions = [
    {
      date: "2025-10-10",
      description: "Product Sale",
      type: "income",
      amount: 450,
      status: "Completed",
    },
    {
      date: "2025-10-11",
      description: "Office Rent",
      type: "expense",
      amount: -200,
      status: "Pending",
    },
    {
      date: "2025-10-12",
      description: "Subscription Fee",
      type: "expense",
      amount: -50,
      status: "Completed",
    },
    {
      date: "2025-10-13",
      description: "Affiliate Income",
      type: "income",
      amount: 300,
      status: "Completed",
    },
    {
      date: "2025-10-13",
      description: "Electronics",
      type: "income",
      amount: 300,
      status: "Failed",
    },
  ];

  function renderTransactions(filter = "all") {
    transactionBody.innerHTML = "";

    transactions
      .filter((txn) => filter === "all" || txn.type === filter)
      .forEach((txn) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${txn.date}</td>
          <td>${txn.description}</td>
          <td class="${txn.type}">${
          txn.type.charAt(0).toUpperCase() + txn.type.slice(1)
        }</td>
          <td>${
            txn.amount > 0 ? `$${txn.amount}` : `-$${Math.abs(txn.amount)}`
          }</td>
         <td><span class="status-badge ${txn.status.toLowerCase()}">${
          txn.status
        }</span></td>

        `;
        transactionBody.appendChild(row);
      });
  }

  transactionFilter.addEventListener("change", (e) =>
    renderTransactions(e.target.value)
  );

  // Initial render
  renderTransactions();
});

// highlight rows on hover
document.querySelectorAll(".transaction-table tbody tr").forEach((row) => {
  row.addEventListener("mouseenter", () => row.classList.add("hover"));
  row.addEventListener("mouseleave", () => row.classList.remove("hover"));
});

// === THEME TOGGLER ===
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Load saved theme from localStorage (if any)
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark-mode");
    themeToggle.innerHTML = `<i class="fas fa-sun"></i>`;
  }

  themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
      themeToggle.innerHTML = `<i class="fas fa-sun"></i>`;
      localStorage.setItem("theme", "dark");
    } else {
      themeToggle.innerHTML = `<i class="fas fa-moon"></i>`;
      localStorage.setItem("theme", "light");
    }
  });
});
