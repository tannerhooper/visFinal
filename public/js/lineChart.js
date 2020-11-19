class LineChart {
    //US:
    //ST:
    constructor(type){
        this.chart = d3.select(`#${type}-line-chart`).classed("sideBar",true);

        // set the dimensions and margins of the graph
        this.margin = {top: 10, right: 30, bottom: 30, left: 80},

        this.svgBounds = this.chart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 300;

        this.svg = this.chart.append('svg')
            .attr('width',this.svgWidth).attr('height',this.svgHeight)
    }

    update(data,years){
        let avg = [];
        avg.push( (d3.sum(data.map(d => {return d.C150_4})) / data.length ) )
        let mapping = avg.map((a,i) => {return {avg:a,yr:years[i]}})
        console.log(mapping)

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(avg, d => d))
            .range([ 0, this.svgWidth ]);
        this.svg.append("g")
            .attr("transform", "translate(0," + this.svgHeight + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(years, d => d)])
            .range([ this.svgHeight, 0 ]);
        this.svg.append("g")
            .call(d3.axisLeft(y));

        // Add the line
        this.svg.append("path")
            .datum(mapping)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(function(d) { return x(d.avg) })
            .y(function(d) { return y(d.yr) })
            )
    }
}