
class SpendChart {

    /**
     * Constructor for the Year Chart
     * TODO: add chart vars
     * @param electionInfo instance of ElectionInfo
     * @param dropouts over years
     */
    constructor (dropouts) {
  
      //Todo: Create Chart instances
  
      // the data
      this.dropouts = dropouts;
      
      // Initializes the svg elements required for this chart
      this.margin = {top: 10, right: 20, bottom: 30, left: 50};
      let divspendChart = d3.select("#spend-chart").classed("fullView", true);
  
      //fetch the svg bounds
      this.svgBounds = divspendChart.node().getBoundingClientRect();
      this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
      this.svgHeight = 100;
  
      //add the svg to the div
      this.svg = divspendChart.append("svg")
        .attr("width", this.svgWidth)
        .attr("height", this.svgHeight);
  
      this.selected = null;
    }
  
    /**
     * Creates a chart with circles to filter a range of spending, populates text content and other required elements for the Spend Chart
     */
    update () {
       
  
    }
  
    selectSpending(selected, d) {
      if (this.selected) {
        this.selected.classed('highlighted', false);
      }
      this.selected = selected;
      this.selected.classed('highlighted', true);
  
      d3.csv(lower <= d.INEXPFTE >= upper).then(year => {
        // TODO: update charts here
      });
      
    }
  
  }
  