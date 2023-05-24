/**
 * Dashboard Analytics
 */

// 'use strict';

(function () {
  let cardColor, headingColor, axisColor, shadeColor, borderColor;

  cardColor = config.colors.white;
  headingColor = config.colors.headingColor;
  axisColor = config.colors.axisColor;
  borderColor = config.colors.borderColor;

  // Total Revenue Report Chart - Bar Chart
  // --------------------------------------------------------------------
  
  const card = document.querySelector('#transactions');

    
  function generateRandomNumber() {
  let min = -100;
  let max = 100;
  let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
  }

  console.log('hello world')
 
  value = generateRandomNumber()
  let username = document.getElementById('username').textContent.trim()
  let tradebtn = document.getElementById('start-trade')
  // console.log(username)
  // Create a new WebSocket connection to the specified URL 
  // num += generateRandomNumber() 
  const socket = new WebSocket(`ws://${window.location.host}/ws/${username}/`);
  console.log(socket)
  /* Add a 'message' event listener to the socket to handle messages from the server */
  socket.onmessage = function(e) {
          // console.log('Server: ' + e.data);
          const {sender, message} = JSON.parse(e.data)
          
          card.innerHTML += `<li class="d-flex mb-4 pb-1">
          <div class="avatar flex-shrink-0 me-3">
            <img src="{% static 'assets/img/icons/unicons/paypal.png' %}" alt="User" class="rounded" />
          </div>
          <div class="d-flex w-100 flex-wrap align-items-center justify-content-between gap-2">
            <div class="me-2">
              <small class="text-muted d-block mb-1">Trade Result</small>
              <h6 class="mb-0">{{stat.stock.name}}</h6>
            </div>
            <div class="user-progress d-flex align-items-center gap-1">
              <h6 class="mb-0">${message}</h6>
              <span class="text-muted">USD</span>
            </div>
          </div>
        </li>`
          $(document).ready(function() {
            // Get the number of li tags in the ul tag with id 'transaction'
            var liCount = $("#transaction li").length;
          
            // If the li tags are more than 10, only show the last 10
            if (liCount > 10) {
              $("#transaction li:lt(10)").show();
              $("#transaction li:gt(9)").hide();
            }
          });
          checker()
          updatedrawChart()

      };
      /* Add an 'open' event listener to the socket to handle the connection being established */
      
      socket.onopen = (function(e) {console.log('connected')})
      

      // tradebtn.onclick = setInterval (function(e) {
      //   socket.send(JSON.stringify({
      //       'message': generateRandomNumber(),
      //       'sender': username,
      //       }));
      //   }, 6000)
      let intervalId = null;

      // Function to be executed every minute
      const executeCode = () => {
        console.log('clicked');
        socket.send(JSON.stringify({
          'message': generateRandomNumber(),
          'sender': username
        }));
      };
      
      // Start the timer when the 'start-trade' button is clicked
      tradebtn.addEventListener('click', () => {
        intervalId = setInterval(executeCode, 6000);
      });
      
      // Stop the timer when the 'stop-trade' button is clicked
      document.getElementById('stop-trade').addEventListener('click', () => {
        clearInterval(intervalId);
        console.log('stopped')
      });
      
const fetchChartData = async() => {
  const response = await fetch(window.location.href + `/chart/`)
  const data = await response.json()
  // console.log(data)
  return data
}


const checker = async() => {
const data = await fetchChartData()
const {chartData, chartLabel} = data
// console.log('this is data', data)
console.log(chartData.slice(-1))
if (chartData.slice(-1) <= 1) {
  clearInterval(intervalId);
        console.log('stopped')
}
}

// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
// \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

let chart;
const drawChart = async() => {
  
  const data = await fetchChartData()
  const {chartData, chartLabel} = data
  
  const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;
  const down = (ctx, value) => ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
  

// let data = [10, 20, 30, 40, 50, 70, 40, 30, 50, 100, 57, 101] ;
var ctx = document.getElementById('myChart').getContext('2d');
chart = new Chart(ctx, {
    type: 'line',
    data: {
      // labels: [...100],
      labels: chartLabel,
      datasets: [{
          label: 'My Dataset',
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
//   // min: 0,
//   // max: 100
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
var currentPoint = document.getElementById("myChart").getPointAt(event.clientX);

// Get the previous point.
var previousPoint = currentPoint.prev();

// Calculate the difference between the two points.
var difference = currentPoint.y - previousPoint.y;

// Display the difference.
document.getElementById("difference").innerHTML = difference;


// =======================================================================================
// Add event listener to the line graph.
document.getElementById("myChart").addEventListener("mousemove", function(event) {
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


  // Profit Report Line Chart
  // --------------------------------------------------------------------
  const profileReportChartEl = document.querySelector('#profileReportChart'),
    profileReportChartConfig = {
      chart: {
        height: 80,
        type: 'line',
        toolbar: {
          show: true
        },
        sparkline: {
          enabled: true
        }
      },
      grid: {
        show: true,
        padding: {
          right: 8
        }
      },

      colors: function(context) {
        var index = context.dataIndex;
        var value = context.dataset.data[index];
        return value > context.dataset.data[index - 1] ? ['#FF0000'] : ['#00FF00'];
    },//['#FF0000'], // Red color for downward points
      dataLabels: {
        enabled: true
      },
      stroke: {
        width: 5,
        // curve: 'smooth',
        lineTension: 0,
        colors: ['#00FF00']  // Green color for upward points
      },
      series: [{
        data: [110, 270, 145, 245, 205, 285]
      }],
      xaxis: {
        show: true,
        lines: {
          show: true
        },
        labels: {
          show: true
        },
        axisBorder: {
          show: true
        }
      },
      yaxis: {
        show: true,
        min: 0, // Adjust minimum value as needed
        max: 300 // Adjust maximum value as needed
      },
      tooltip: {
        enabled: false
      }
    };      
  if (typeof profileReportChartEl !== undefined && profileReportChartEl !== null) {
    const profileReportChart = new ApexCharts(profileReportChartEl, profileReportChartConfig);
    profileReportChart.render();
  }

  // Order Statistics Chart
  // --------------------------------------------------------------------
  const chartOrderStatistics = document.querySelector('#orderStatisticsChart'),
    orderChartConfig = {
      chart: {
        height: 165,
        width: 130,
        type: 'donut'
      },
      labels: ['Electronic', 'Sports', 'Decor', 'Fashion'],
      series: [85, 15, 50, 50],
      colors: [config.colors.primary, config.colors.secondary, config.colors.info, config.colors.success],
      stroke: {
        width: 5,
        colors: cardColor
      },
      dataLabels: {
        enabled: false,
        formatter: function (val, opt) {
          return parseInt(val) + '%';
        }
      },
      legend: {
        show: false
      },
      grid: {
        padding: {
          top: 0,
          bottom: 0,
          right: 15
        }
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: true,
              value: {
                fontSize: '1.5rem',
                fontFamily: 'Public Sans',
                color: headingColor,
                offsetY: -15,
                formatter: function (val) {
                  return parseInt(val) + '%';
                }
              },
              name: {
                offsetY: 20,
                fontFamily: 'Public Sans'
              },
              total: {
                show: true,
                fontSize: '0.8125rem',
                color: axisColor,
                label: 'Weekly',
                formatter: function (w) {
                  return '38%';
                }
              }
            }
          }
        }
      }
    };
  if (typeof chartOrderStatistics !== undefined && chartOrderStatistics !== null) {
    const statisticsChart = new ApexCharts(chartOrderStatistics, orderChartConfig);
    statisticsChart.render();
  }

  // Income Chart - Area chart
  // --------------------------------------------------------------------
  const incomeChartEl = document.querySelector('#incomeChart'),
    incomeChartConfig = {
      series: [
        {
          data: [24, 21, 30, 22, 42, 26, 35, 29]
        }
      ],
      chart: {
        height: 215,
        parentHeightOffset: 0,
        parentWidthOffset: 0,
        toolbar: {
          show: false
        },
        type: 'area'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 2,
        curve: 'smooth'
      },
      legend: {
        show: false
      },
      markers: {
        size: 6,
        colors: 'transparent',
        strokeColors: 'transparent',
        strokeWidth: 4,
        discrete: [
          {
            fillColor: config.colors.white,
            seriesIndex: 0,
            dataPointIndex: 7,
            strokeColor: config.colors.primary,
            strokeWidth: 2,
            size: 6,
            radius: 8
          }
        ],
        hover: {
          size: 7
        }
      },
      colors: [config.colors.primary],
      fill: {
        type: 'gradient',
        gradient: {
          shade: shadeColor,
          shadeIntensity: 0.6,
          opacityFrom: 0.5,
          opacityTo: 0.25,
          stops: [0, 95, 100]
        }
      },
      grid: {
        borderColor: borderColor,
        strokeDashArray: 3,
        padding: {
          top: -20,
          bottom: -8,
          left: -10,
          right: 8
        }
      },
      xaxis: {
        categories: ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: true,
          style: {
            fontSize: '13px',
            colors: axisColor
          }
        }
      },
      yaxis: {
        labels: {
          show: false
        },
        min: 10,
        max: 50,
        tickAmount: 4
      }
    };
  if (typeof incomeChartEl !== undefined && incomeChartEl !== null) {
    const incomeChart = new ApexCharts(incomeChartEl, incomeChartConfig);
    incomeChart.render();
  }

  // Expenses Mini Chart - Radial Chart
  // --------------------------------------------------------------------
  const weeklyExpensesEl = document.querySelector('#expensesOfWeek'),
    weeklyExpensesConfig = {
      series: [65],
      chart: {
        width: 60,
        height: 60,
        type: 'radialBar'
      },
      plotOptions: {
        radialBar: {
          startAngle: 0,
          endAngle: 360,
          strokeWidth: '8',
          hollow: {
            margin: 2,
            size: '45%'
          },
          track: {
            strokeWidth: '50%',
            background: borderColor
          },
          dataLabels: {
            show: true,
            name: {
              show: false
            },
            value: {
              formatter: function (val) {
                return '$' + parseInt(val);
              },
              offsetY: 5,
              color: '#697a8d',
              fontSize: '13px',
              show: true
            }
          }
        }
      },
      fill: {
        type: 'solid',
        colors: config.colors.primary
      },
      stroke: {
        lineCap: 'round'
      },
      grid: {
        padding: {
          top: -10,
          bottom: -15,
          left: -10,
          right: -10
        }
      },
      states: {
        hover: {
          filter: {
            type: 'none'
          }
        },
        active: {
          filter: {
            type: 'none'
          }
        }
      }
    };
  if (typeof weeklyExpensesEl !== undefined && weeklyExpensesEl !== null) {
    const weeklyExpenses = new ApexCharts(weeklyExpensesEl, weeklyExpensesConfig);
    weeklyExpenses.render();
  }
})();
