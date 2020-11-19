
class YearChart {

  /**
   * Constructor for the Year Chart
   * TODO: add chart vars
   * @param map
   * @param spendChart
   * @param electionInfo instance of ElectionInfo
   * @param yearlyDropouts over years
   */
  constructor(map, spendChart, yearlyDropouts) {

    //Todo: Create YearChart instance
    this.spendChart = spendChart;
    this.map = map;

    // the data
    this.yearlyDropouts = yearlyDropouts;

    // Initializes the svg elements required for this chart
    this.margin = { top: 10, right: 20, bottom: 30, left: 50 };
    let divyearChart = d3.select("#year-chart").classed("fullView", true);

    //fetch the svg bounds
    this.svgBounds = divyearChart.node().getBoundingClientRect();
    this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
    this.svgHeight = 100;

    //add the svg to the div
    this.svg = divyearChart.append("svg")
      .attr("width", this.svgWidth)
      .attr("height", this.svgHeight);

    this.selected = null;
  }

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
        return this.colorScale(+d.Completion)
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

  selectYear(selected, d) {
    if (this.selected) {
      this.selected.classed('highlighted', false);
    }
    this.selected = selected;
    this.selected.classed('highlighted', true);

    d3.csv(`data/${d.YEAR}.csv`).then(year => {
      this.spendChart.update(map, year); //TODO send chart instances
    });

  }

}
