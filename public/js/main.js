
// TODO: Create instances of all charts
let spendChart = new SpendChart();
let usLine = new LineChart('us-line-chart');
let stLine = new LineChart('st-line-chart');
// Load the data corresponding to all the years.
d3.csv("data/yearwiseDropouts.csv", function (yearlyDropouts) {
  let yearChart = new YearChart(spendChart, yearlyDropouts,usLine,stLine);// TODO: pass chart instances 
  yearChart.update();

  let s = d3.select('#y2018');
  yearChart.selectYear(s, s.data()[0]);
});
