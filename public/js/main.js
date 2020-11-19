
// TODO: Create instances of all charts
let spendChart = new SpendChart();
// Load the data corresponding to all the years.
d3.csv("data/yearwiseDropouts.csv").then(yearlyDropouts => {
  let yearChart = new YearChart(spendChart, yearlyDropouts);// TODO: pass chart instances 
  yearChart.update();

  let s = d3.select('#y2018');
  yearChart.selectYear(s, s.data()[0]);

  d3.csv(`data/${s.data()[0].YEAR}.csv`).then(data => {
    let map = new Map(data)
    map.update();
  })
});
