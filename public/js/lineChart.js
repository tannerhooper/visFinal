class LineChart {
    //US:
    //ST:
    constructor(type){
        this.chart = d3.select(`#${type}-line-chart`).classed("sideBar",true);

        // set the dimensions and margins of the graph
        this.margin = {top: 10, right: 30, bottom: 20, left: 40},

        this.svgBounds = this.chart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 300;

        this.svg = this.chart.append('svg')
            .attr('width',this.svgWidth).attr('height',this.svgHeight)
    }

    update(data,years){
        
        this.svg.selectAll("*").remove();
        let avg = [];
        // let avg = [50,40,90,80,200,20];
        // years = [2012,2013,2014,2015,2016,2017];
        for (let t in data){
            avg.push( parseFloat(((d3.sum(data[t].map(d => {return d.C150_4}))/data[t].length)*100).toFixed(2)) )
        }
        let mapping = avg.map((a,i) => {return {avg:a,yr:years[i]}})
        // console.log(mapping)

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(years, d => { return d }))
            .range([ 0, this.svgWidth ]);
        this.svg.append("g")
            .attr("transform", `translate(${this.margin.left},${this.svgHeight-this.margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat(d3.format('d')));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(avg, d => { return d })])
            .range([ this.svgHeight-this.margin.bottom, this.margin.top ]);
        this.svg.append("g")
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(d3.axisLeft(y));

        // Add the line
        var line = this.svg.append("path")
            .datum(mapping)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
            .x(d => { return x(d.yr)+this.margin.left })
            .y(d => { return y(d.avg) })
            )

        line.selectAll('path')
            .datum(mapping)
            .enter()
            .transition()
            .duration(1000)
            .attr("d", d3.line()
            .x(d => { return x(d.yr)+this.margin.left })
            .y(d => { return y(d.avg) })
            )
    }
}