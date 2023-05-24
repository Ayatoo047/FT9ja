const card = document.querySelector('.card');

    
    function generateRandomNumber() {
    let min = -100;
    let max = 100;
    let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
    }
    // let num = '';

    // randomNum = () => Math.floor(Math.random() * 10 + 1);
    console.log('hello world')
   
    value = generateRandomNumber()
    let username = document.getElementById('username').textContent.trim()
    // console.log(username)
    // Create a new WebSocket connection to the specified URL 
    // num += generateRandomNumber() 
    const socket = new WebSocket(`ws://${window.location.host}/ws/${username}/`);
    console.log(socket)
    /* Add a 'message' event listener to the socket to handle messages from the server */
    socket.onmessage = function(e) {
            console.log('Server: ' + e.data);
            const {sender, message} = JSON.parse(e.data)
            card.innerHTML += `<p>${sender} trade result in ${message}</p>`
            updatedrawChart()

        };
        /* Add an 'open' event listener to the socket to handle the connection being established */
        socket.onopen = 
        setInterval (function(e) {
        socket.send(JSON.stringify({
            'message': generateRandomNumber(),
            'sender': username,
            }));
        }, 6000)

const fetchChartData = async() => {
    const response = await fetch(window.location.href + 'chart/')
    const data = await response.json()
    console.log(data)
    return data
}


// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

let chart;
const drawChart = async () => {
  const data = await fetchChartData();
  const { chartData, chartLabels } = data;

  const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;
  const down = (ctx, value) => ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;

  const colors = [
    'red',
    'blue',
    'green',
    'orange',
    'purple',
    'cyan',
    'magenta',
    'yellow',
    'brown',
    'gray'
  ];

  const datasets = chartData.map((data, index) => ({
    label: `Line ${index + 1}`,
    data: [[1,23,24],[1,23,24]],
    borderColor: colors[index],
    segment: {
      borderColor: ctx => skipped(ctx, 'rgb(0,0,0,0.2)') || down(ctx, 'rgb(192,75,75)'),
      borderDash: ctx => skipped(ctx, [6, 6]),
    },
    backgroundColor: 'transparent',
    tension: 0.4,
    pointRadius: 5,
    pointBackgroundColor: function(context) {
      var index = context.dataIndex;
      var value = context.dataset.data[index];
      return value > context.dataset.data[index - 1] ? 'green' : 'red';
    },
    spanGaps: true
  }));

  var ctx = document.getElementById('myChart').getContext('2d');
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartLabels,
      datasets: datasets
    },
    options: {
      scales: {
        y: {
          type: 'linear',
          position: 'left'
        }
      },
      fill: false,
      lineTension: 0,
      interaction: {
        intersect: false
      },
      radius: 0
    }
  });

  console.log(chart.scales['y'].min);

  function onYAxisChange() {
    // Get the new minimum and maximum values of the y-axis.
    let min = chart.scales['y-axis-0'].min;
    let max = chart.scales['y-axis-0'].max;

    console.log(min);
    // If the new values are outside of the old range, update the range.
    if (min < data[0].y || max > data[data.length - 1].y) {
      chart.scales['y-axis-0'].min = min;
      chart.scales['y-axis-0'].max = max;
    }
  }

  function onxAxisChange() {
    // Get the new minimum and maximum values of the x-axis.
    let min = chart.scales['x-axis-0'].min;
    let max = chart.scales['x-axis-0'].max;

    // If the new values are outside of the old range, update the range.
    if (min < data[0].x || max > data[data.length - 1].x) {
      chart.scales['x-axis-0'].min = min;
      chart.scales['x-axis-0'].max = max;
    }
  }

  // Listen for changes to the x-axis.
  chart.scales['x-axis-0'].on('change', onxAxisChange);
  // Listen for changes to the y-axis.
  chart.scales['y-axis-0'].on('change', onYAxisChange);

  // Get the current point that the cursor is hovering over.
  var currentPoint = document.getElementById('myChart').getPointAt(event.clientX);

  // Get the previous point.
  var previousPoint = currentPoint.prev();

  // Calculate the difference between the two points.
  var difference = currentPoint.y - previousPoint.y;

  // Display the difference.
  document.getElementById('difference').innerHTML = difference;

  // Add event listener to the line graph.
  document.getElementById('myChart').addEventListener('mousemove', function (event) {
    // Get the current point that the cursor is hovering over.
    var currentPoint = this.getPointAt(event.clientX);

    // Get the previous point.
    var previousPoint = currentPoint.prev();

    // Calculate the difference between the two points.
    var difference = currentPoint.y - previousPoint.y;

    // Create a text element.
    var textElement = document.createElement('text');

    // Set the text element's text content.
    textElement.textContent = difference;

    // Set the text element's position.
    textElement.style.left = currentPoint.x + 'px';
    textElement.style.top = currentPoint.y + 'px';

    // Append the text element to the graph canvas.
    document.getElementById('myChart').appendChild(textElement);
  });
};

const updatedrawChart = async () => {
  if (chart) {
    chart.destroy();
  }

  await drawChart();
};

drawChart();

