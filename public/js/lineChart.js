class LineChart {
    /**
     * Constructor for the Line Chart
     * @param type: the type of the chart
     * @param allYears: optional parameter that contains the data for all the years
     */
    constructor(type,allYears = null){
        this.chart = d3.select(`#${type}-line-chart`).classed("sideBar",true);
        this.type = type;
        this.allYears = allYears
        // set the dimensions and margins of the graph
        this.margin = {top: 10, right: 30, bottom: 20, left: 40},

        this.svgBounds = this.chart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 300;

        this.svg = this.chart.append('svg')
            .attr('width',this.svgWidth).attr('height',this.svgHeight)
    }

    update(data,years,init = false,curSt = 'UT'){
        this.svg.selectAll("*").remove();
        let avg = [];
        let mapping;
        if (!init){
            if (this.type === 'st'){
                for (let t in this.allYears){
                    let tmp = this.allYears[t].filter(d => d.STABBR === curSt && d.C150_4 !== "NULL")
                    let s = d3.sum(tmp.map(d => {return d.C150_4}))
                    avg.push( ((s / tmp.length)*100).toFixed(2) )
                }
                mapping = avg.map((a,i) => {return {avg:parseFloat(a),yr:years[i]}})
            }
        }
        else {
            mapping = data.map((a,i) => {return {avg:parseFloat(a),yr:years[i]}})
        }

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(mapping, d => d.yr))
            .range([ 0, this.svgWidth- this.margin.left - this.margin.right ]);
        this.svg.append("g")
            .attr("transform", `translate(${this.margin.left},${this.svgHeight-this.margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat(d3.format('d')));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(mapping, d => d.avg)])
            .range([ this.svgHeight-this.margin.bottom, this.margin.top ]);
        this.svg.append("g")
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(d3.axisLeft(y));

        // Add the line
        this.svg.append("path")
            .datum(mapping)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(d => x(d.yr)+this.margin.left)
            .y(d => y(d.avg))
            )
    }
}