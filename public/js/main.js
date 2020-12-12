// Create instances of all charts
let tooltip = new Tooltip();
let list = new List();
let spendChart = new SpendChart();
let allYears = {};
let calls = [];
for (let i = 1997; i < 2019; i++) {
  calls.push(d3.csv(`data/${i}.csv`));
}
let buttons = document.getElementsByClassName('grad_rate');
for (var i = 0; i < buttons.length; i++) {
  if (buttons[i].value == 'C150_4') {
    buttons[i].checked = true;
  }
}
// Using a Promise instead for reading multiple CSVs
Promise.all(calls).then(data => {
  for (let yr in data) {
    allYears[parseInt(data[yr][0].YEAR)] = data[yr];
  }

  // Load the data corresponding to all the years.
  d3.csv("data/yearwiseDropouts.csv").then(yearlyDropouts => {
    // let data = yearlyDropouts.map(d => { return parseFloat(d.Completion) });
    let years = yearlyDropouts.map(d => { return parseInt(d.YEAR) });

    // const usLine = new LineChart('us',null,years);
    const lineChart = new LineChart(allYears, years);
    const map = new Map(lineChart, tooltip, list);
    let demographic = new Demographic(map);

    let yearChart = new YearChart(map, lineChart, spendChart, yearlyDropouts, demographic, list);// TODO: pass chart instances 
    lineChart.update(null,null,null,null);
    yearChart.update();

    let yr = 2018;
    let s = d3.select(`#y${yr}`);
    yearChart.selectYear(s, s.data()[0]);
  });
});

modal = function(){
   // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("results");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
      modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
      modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
}
