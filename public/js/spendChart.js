
class SpendChart {
    /**
     * Constructor for the Spend Chart
     */
    constructor () {
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
    }
  
    /**
     * Creates a chart with circles to filter a range of spending, populates text content and other required elements for the Spend Chart
     */
    update (map, dropouts,lineChart) {
        this.svg.selectAll("*").remove();

      var spendData = dropouts.filter(function(k){return !isNaN(+k.INEXPFTE);}).map(function(d){ return d.INEXPFTE });
      var v1 = (d3.min(spendData));
      var v2 = (d3.max(spendData));
        var sliderVals=[v1, v2];
        
        var x = d3.scaleLinear()
            .domain([0, v2]) //10
            .range([0, this.svgWidth - 30])
            .clamp(true);
        
        var xMin=x(0),
            xMax=x(v2) //10
        
        var slider = this.svg.append("g")
            .attr("class", "slider")
            .attr("transform", "translate(5,20)");
        
        slider.append("line")
            .attr("class", "track")
            .attr("x1", 10+x.range()[0])
            .attr("x2", 10+x.range()[1])
        
        var selRange = slider.append("line")
            .attr("class", "sel-range")
            .attr("x1", 10+x(sliderVals[0]))
            .attr("x2", 10+x(sliderVals[1]))
        
        slider.insert("g", ".track-overlay")
            .attr("class", "ticks")
            .attr("transform", "translate(10,24)")
            .selectAll("text")
            .data(x.ticks(10))
            .enter().append("text")
            .attr("x", x)
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .text(d => '$' + d.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
        
        var handle = slider.selectAll("rect")
            .data([0, 1])
            .enter().append("rect", ".track-overlay")
            .attr("class", "handle")
            .attr("y", -8)
            .attr("x", d => x(sliderVals[d]))
            .attr("rx", 3)
            .attr("height", 16)
            .attr("width", 20)
            .call(
                d3.drag()
                    .on("start", startDrag)
                    .on("drag", drag)
                    .on("end", endDrag)
            );
        
        function startDrag(){
            d3.select(this).raise().classed("active", true);
        }
        
        function drag(d){
            var x1=d3.event.x;
            if(x1>xMax){
            x1=xMax
            }else if(x1<xMin){
            x1=xMin
            }
            d3.select(this).attr("x", x1);
            var x2=x(sliderVals[d==0?1:0])
            selRange
                .attr("x1", 10+x1)
                .attr("x2", 10+x2)
        }
        
        function endDrag(d){
            var v=Math.round(x.invert(d3.event.x))
            var elem=d3.select(this)
            sliderVals[d] = v
            var v1=Math.min(sliderVals[0], sliderVals[1]),
                v2=Math.max(sliderVals[0], sliderVals[1]);
            elem.classed("active", false)
            .attr("x", x(v));
            selRange
                .attr("x1", 10+x(v1))
                .attr("x2", 10+x(v2))
        
          selectSpending(v1, v2); 
        }
        function selectSpending(lower, upper) {
            var data = dropouts.filter(function(k){return !isNaN(+k.INEXPFTE);})
                .filter(function(k){return (+k.INEXPFTE > lower && +k.INEXPFTE < upper);});
            map.update(data);
            lineChart.update(null,null,[lower,upper])
        }
    }
  }
  