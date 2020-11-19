
// Create instances of all charts
let map = new Map();
// let USlineChart = new LineChart('us');
// let STlineChart = new LineChart('st');
let spendChart = new SpendChart();
let usLine = new LineChart('us');
let stLine = new LineChart('st');
// Load the data corresponding to all the years.
d3.csv("data/yearwiseDropouts.csv").then(yearlyDropouts => {
  let yearChart = new YearChart(map, spendChart, yearlyDropouts,usLine,stLine);// TODO: pass chart instances 
  yearChart.update();

  let s = d3.select('#y2018');
  yearChart.selectYear(s, s.data()[0]);

  d3.csv(`data/${s.data()[0].YEAR}.csv`).then(data => {
    map.update(data);
  })
});
