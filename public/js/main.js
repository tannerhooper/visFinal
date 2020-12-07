// Create instances of all charts
let list = new List();
let spendChart = new SpendChart();
let allYears = {};
calls = [];
for (let i = 1997; i < 2019; i++) {
  calls.push(d3.csv(`data/${i}.csv`));
}

// Using a Promise instead for reading multiple CSVs
Promise.all(calls).then(data => {
  for (let yr in data) {
    allYears[parseInt(data[yr][0].YEAR)] = data[yr];
  }

  // Load the data corresponding to all the years.
  d3.csv("data/yearwiseDropouts.csv").then(yearlyDropouts => {
    let data = yearlyDropouts.map(d => { return parseFloat(d.Completion) });
    let years = yearlyDropouts.map(d => { return parseInt(d.YEAR) });

    // const usLine = new LineChart('us',null,years);
    const lineChart = new LineChart(data,allYears,years);
    const map = new Map(lineChart);

    let yearChart = new YearChart(map,lineChart,spendChart,yearlyDropouts);// TODO: pass chart instances 
    yearChart.update();

    // usLine.update(data,true);
    lineChart.update();

    let yr = 2018;
    let s = d3.select(`#y${yr}`);
    yearChart.selectYear(s, s.data()[0]);
  });
});
