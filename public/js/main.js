
// TODO: Create instances of all charts

// Load the data corresponding to all the years.
d3.csv("data/yearwiseDropouts.csv").then(yearlyDropouts => {
    let yearChart = new YearChart(yearlyDropouts);// TODO: pass chart instances 
    yearChart.update();
  
    let s = d3.select('#y2018');
    yearChart.selectYear(s, s.data()[0]);
  });
  