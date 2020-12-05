// Create instances of all charts
let list = new List();
let spendChart = new SpendChart();
let allYears = {}
calls = []
for (let i = 1997; i < 2019; i++){
  calls.push(d3.csv(`data/${i}.csv`))
}

// Using a Promise instead for reading multiple CSVs
Promise.all(calls).then(data => {
  for (let yr in data){
    allYears[parseInt(data[yr][0].YEAR)] = data[yr];
  }

  let usLine = new LineChart('us');
  let stLine = new LineChart('st',allYears);
  let map = new Map(stLine);

  // Load the data corresponding to all the years.
  d3.csv("data/yearwiseDropouts.csv").then(yearlyDropouts => {
    let yearChart = new YearChart(map, spendChart, yearlyDropouts, usLine, stLine);// TODO: pass chart instances 
    yearChart.update();

    let data = yearlyDropouts.map(d => { return parseFloat(d.Completion) });
    let years = yearlyDropouts.map(d => { return parseInt(d.YEAR) });

    usLine.update(data, years, true);
    stLine.update(null, years, false);

    yr = 2018
    let s = d3.select(`#y${yr}`);
    yearChart.selectYear(s, s.data()[0]);
  });
});
