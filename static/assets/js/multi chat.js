const fetchChartData = async() => {
    const response = await fetch(window.location.href + `/chart/`)
    const data = await response.json()
    console.log(data)
    return data
  }

let chart;

const drawChart = async () => {
  const data = await fetchChartData();
  const { chartData, chartLabels } = data;

  const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;
  const down = (ctx, value) => ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;

  var ctx = document.getElementById('myChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: 'Dataset 1',
          data: chartData[0],
          borderColor: 'green',
          segment: {
            borderColor: ctx => skipped(ctx, 'rgb(0,0,0,0.2)') || down(ctx, 'rgb(192,75,75)'),
            borderDash: ctx => skipped(ctx, [6, 6]),
          },
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: function (context) {
            var index = context.dataIndex;
            var value = context.dataset.data[index];
            return value > context.dataset.data[index - 1] ? 'green' : 'red';
          },
          spanGaps: true,
          yAxisID: 'y-axis-1' // Assign the dataset to the second y-axis
        },
        {
          label: 'Dataset 2',
          data: chartData[1],
          borderColor: 'blue',
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: function (context) {
            var index = context.dataIndex;
            var value = context.dataset.data[index];
            return value > context.dataset.data[index - 1] ? 'blue' : 'orange';
          },
          spanGaps: true,
          yAxisID: 'y-axis-2' // Assign the dataset to the third y-axis
        }
        // Add more datasets for additional axes as needed
      ]
    },
    options: {
      scales: {
        x: {
          type: 'category',
          labels: chartLabels
        },
        y: {
          id: 'y-axis-1',
          type: 'linear',
          position: 'left',
          // min: 0,
          // max: 100
        },
        'y-axis-2': {
          type: 'linear',
          position: 'right',
          // min: 0,
          // max: 100
        }
        // Add more y-axes configurations as needed
      },
      fill: false,
      lineTension: 0,
      interaction: {
        intersect: false
      },
      radius: 0
    }
  });
};

const updatedrawChart = async () => {
  if (chart) {
    chart.destroy();
  }
  await drawChart();
};

drawChart();
