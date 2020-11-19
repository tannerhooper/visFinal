
// Create instances of all charts
let map = new Map();
// let USlineChart = new LineChart('us');
// let STlineChart = new LineChart('st');
let spendChart = new SpendChart();
let usLine = new LineChart('us');
let stLine = new LineChart('st');
// Load the data corresponding to all the years.
d3.csv("data/yearwiseDropouts.csv").then(yearlyDropouts => {
<<<<<<< HEAD
  let yearChart = new YearChart(map, spendChart, yearlyDropouts,usLine,stLine);// TODO: pass chart instances 
=======
  let yearChart = new YearChart(map, spendChart, yearlyDropouts);// TODO: pass USlineChart, STlineChart 
>>>>>>> 6225f0e4eaf977edac2b8f1afa04d67973e4be6a
  yearChart.update();

  let s = d3.select('#y2018');
  yearChart.selectYear(s, s.data()[0]);

  d3.csv(`data/${s.data()[0].YEAR}.csv`).then(data => {
    map.update(data);
  })
});
