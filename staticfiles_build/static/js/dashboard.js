let username = document.getElementById('username').textContent.trim()
const fetchChartData = async() => {
    const response = await fetch('/dashboard/' + `${username}/chart/`)
    const data = await response.json()
    console.log(data)
    return data
  }

let chart;
const drawChart = async() => {
  
  const data = await fetchChartData()
  const {chartData, chartLabel} = data
  
  const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;
  const down = (ctx, value) => ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
  

// let data = [10, 20, 30, 40, 50, 70, 40, 30, 50, 100, 57, 101] ;
var ctx = document.getElementById('hisChart').getContext('2d');
chart = new Chart(ctx, {
    type: 'line',
    data: {
      // labels: [...100],
      labels: chartLabel,
      datasets: [{
          label: `${username} trades`,
          data: chartData,
          borderColor: 'green',
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
      }]
  },
  options: {
      scales: {
// x: {
//   type: "linear",
//   position: "bottom",
//   min: 0,
//   max: 7
// },
y: {
  type: "linear",
  position: "left",
  // min: 0,
  // max: 100
}
},
fill: false,
lineTension: 0,
interaction: {
  intersect: false
},
radius: 0,


}
});

console.log(y.min)
function onYAxisChange() {
// Get the new minimum and maximum values of the y-axis.
let min = chart.scales["y-axis-0"].min;
let max = chart.scales["y-axis-0"].max;

console.log(min)
// If the new values are outside of the old range, update the range.
if (min < data[0].y || max > data[data.length - 1].y) {
chart.scales["y-axis-0"].min = min;
chart.scales["y-axis-0"].max = max;
}
}
//------------------------------------------------------------------------
function onxAxisChange() {
// Get the new minimum and maximum values of the x-axis.
let min = chart.scales["x-axis-0"].min;
let max = chart.scales["x-axis-0"].max;

// If the new values are outside of the old range, update the range.
if (min < data[0].x || max > data[data.length - 1].x) {
chart.scales["x-axis-0"].min = min;
chart.scales["x-axis-0"].max = max;
}
}

// Listen for changes to the x-axis.
chart.scales["x-axis-0"].on("change", onxAxisChange);
// Listen for changes to the y-axis.
chart.scales["y-axis-0"].on("change", onYAxisChange);


//--------------------------------------------------------------------------


// Get the current point that the cursor is hovering over.
var currentPoint = document.getElementById("hisChart").getPointAt(event.clientX);

// Get the previous point.
var previousPoint = currentPoint.prev();

// Calculate the difference between the two points.
var difference = currentPoint.y - previousPoint.y;

// Display the difference.
document.getElementById("difference").innerHTML = difference;


// =======================================================================================
// Add event listener to the line graph.
document.getElementById("hisChart").addEventListener("mousemove", function(event) {
// Get the current point that the cursor is hovering over.
var currentPoint = this.getPointAt(event.clientX);

// Get the previous point.
var previousPoint = currentPoint.prev();

// Calculate the difference between the two points.
var difference = currentPoint.y - previousPoint.y;

// Create a text element.
var textElement = document.createElement("text");

// Set the text element's text content.
textElement.textContent = difference;

// Set the text element's position.
textElement.style.left = currentPoint.x + "px";
textElement.style.top = currentPoint.y + "px";

// Append the text element to the graph canvas.
document.getElementById("myChart").appendChild(textElement);
});
}

const updatedrawChart = async() => {
  if (chart) {
      chart.destroy()
  }
  await drawChart()
}

drawChart()