
class YearChart {

  /**
   * Constructor for the Year Chart
   * @param map
   * @param line
   * @param spendChart
   * @param electionInfo instance of ElectionInfo
   * @param yearlyDropouts over years
   */
  constructor(map, line, spendChart, yearlyDropouts, demographic, list) {
    //Create Chart instances
    this.spendChart = spendChart;
    this.map = map;
    this.line = line;
    // the data
    this.yearlyDropouts = yearlyDropouts;
    // Demographic filter instance
    this.demographic = demographic
    // Top 5 state and country list instance
    this.list = list

    // Initializes the svg elements required for this chart
    this.margin = { top: 10, right: 20, bottom: 30, left: 50 };
    let divyearChart = d3.select("#year-chart").classed("fullView", true);

    //fetch the svg bounds
    this.svgBounds = divyearChart.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 40;

    //add the svg to the div
    this.svg = divyearChart.append("svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight);

    this.selected = null;
  }

  // Future work: add keybinding
  //   move(x) {
  //     return function(event) {
  //         event.preventDefault();
  //         momentum = [momentum[0] + x, momentum[1] + y];
  //     };
  //   }

  // this.svg.call(d3.keybinding()
  //     .on('←', move(-1))
  //     .on('↑', move(1))
  //     .on('→', move(1))
  //     .on('↓', move(-1)));

  /**
   * Creates a chart with circles representing each year, populates text content and other required elements for the Year Chart
   */
  update() {
    //Color range for global color scale
    let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef"];

    let domain = [47, 51];
    this.colorScale = d3.scaleQuantile()
      .domain(domain)
      .range(range);

    // Create the chart by adding circle elements representing each election year
    let r = 10;
    let xscale = d3.scaleLinear()
      .domain([0, this.yearlyDropouts.length])
      .range([3 * r, this.svgWidth - 3 * r]);

    this.svg.selectAll('line')
      .data(this.yearlyDropouts)
      .enter()
      .append('line')
      .attr('x1', (d, i) => xscale(i))
      .attr('y1', r + 4)
      .attr('x2', (d, i) => i > 0 ? xscale(i - 1) : xscale(i))
      .attr('y2', r + 4)
      .classed('dots', true)
      ;

    this.svg.selectAll('circle')
      .data(this.yearlyDropouts)
      .enter()
      .append('circle')
      .attr('cx', (d, i) => xscale(i))
      .attr('cy', r + 4)
      .attr('r', r)
      .attr('fill', d => {
        return this.colorScale(+d.C150_4)
      })
      .classed('yearChart', true)
      .attr('id', d => `y${d.YEAR}`)
      .on('click', d => {
        this.selectYear(d3.select(d3.event.target), d);
      })
      .on('mouseover', function (d) {
        d3.select(this).transition()
          .duration('100')
          .attr("r", 12);
      })
      .on('mouseout', function (d) {
        d3.select(this).transition()
          .duration('200')
          .attr("r", 10);
      })
      ;

    this.svg.selectAll('text')
      .data(this.yearlyDropouts)
      .enter()
      .append('text')
      .attr('x', (d, i) => xscale(i))
      .attr('y', r + 8)
      .attr('dy', '1.3em')
      .text(d => d.YEAR)
      .classed('yeartext', true)
      ;
  }
  // updates the yearchart and subcharts with selected year
  selectYear(selected, d) {
    if (this.selected) {
      this.selected.classed('highlighted', false);
    }
    this.selected = selected;
    this.selected.classed('highlighted', true);

    d3.csv(`data/${d.YEAR}.csv`).then(year => {
      this.line.update(null, null, null, d.YEAR)
      this.spendChart.update(this.map, year, this.line);
      this.demographic.update(this.map, year, this.line, this.list)
      this.map.update(year); // send chart instances
      this.list.update(year, null)
    });
  }
}
