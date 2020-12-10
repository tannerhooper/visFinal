class LineChart {
    /**
     * Constructor for the Line Chart
     * @param allYears: optional parameter that contains the data for all the years
     * @param years: all the data from all the CSV files
     */
    constructor(allYears = null,years){
        this.chart = d3.select(`#line-chart`).classed("sideBar",true);
        this.allYears = allYears;
        this.years = years;

        this.stateMapping = {
            "AL": "Alabama","AK": "Alaska","AZ": "Arizona","AR": "Arkansas","CA": "California",
            "CO": "Colorado","CT": "Connecticut","DE": "Delaware","FL": "Florida","GA": "Georgia",
            "HI": "Hawaii","ID": "Idaho","IL": "Illinois","IN": "Indiana","IA": "Iowa","KS": "Kansas",
            "KY": "Kentucky","LA": "Louisiana","ME": "Maine","MD": "Maryland","MA": "Massachusetts",
            "MI": "Michigan","MN": "Minnesota","MS": "Mississippi","MO": "Missouri","MT": "Montana",
            "NE": "Nebraska","NV": "Nevada","NH": "New Hampshire","NJ": "New Jersey","NM": "New Mexico",
            "NY": "New York","NC": "North Carolina","ND": "North Dakota","OH": "Ohio","OK": "Oklahoma",
            "OR": "Oregon","PA": "Pennsylvania","RI": "Rhode Island","SC": "South Carolina","SD": "South Dakota",
            "TN": "Tennessee","TX": "Texas","UT": "Utah","VT": "Vermont","VA": "Virginia","WA": "Washington",
            "WV": "West Virginia","WI": "Wisconsin","WY": "Wyoming"
          }

        this.selState = '';
        this.bounds = [];
        this.demoFilter = '';
        this.curYr = '';

        // set the dimensions and margins of the graph
        this.margin = {top: 10, right: 30, bottom: 20, left: 40};

        this.svgBounds = this.chart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 300;

        this.svg = this.chart.append('svg')
            .attr('width',this.svgWidth).attr('height',this.svgHeight);
        this.legend();
    }

    legend(){
        let legs = [{y:0,fill:'red',text:'US'},{y:20,fill:'steelblue',text:'State'}]
        this.svg.selectAll('rect').data(legs).enter().append('rect')
            .attr('x',this.svgWidth-this.margin.right-40)
            .attr('y',d => this.margin.top+d.y)
            .attr('width',10).attr('height',10)
            .attr('fill',d => d.fill);
        this.svg.selectAll('text')
            .data(legs).enter().append('text')
            .attr('x',this.svgWidth-this.margin.right-25)
            .attr('y',d => this.margin.top+d.y+9)
            .text(d => d.text);
    }

    /**
     * @param {state selected from map} curSt 
     * @param {filter selected from demographic filter} demoFilter 
     * @param {lower and upper bounds selected from spend chart} bounds 
     */
    update(curSt='UT',demoFilter='C150_4',bounds=[0,9990],curYr='2018'){
        this.svg.selectAll("path.avgline").remove();
        this.svg.selectAll("circle").remove();
        let stAvg = [];
        let usTots = [];
        let stMapping;
        if (curSt !== null) this.selState = curSt;
        if (demoFilter !== null) this.demoFilter = demoFilter;
        if (bounds !== null) this.bounds = bounds;
        if (curYr !== null) this.curYr = curYr;

        // Sets line chart title
        d3.select('#stAvg').text(`State Average: ${this.stateMapping[this.selState]}`)
        
        // Computes avg per state
        for (let t in this.allYears){
            let demo = this.allYears[t].filter(d => {
                return d.STABBR === this.selState && d[this.demoFilter] !== 'NULL'
            });
            let exp = demo.filter(d => {
                    if (this.bounds[1] == 9990) return d.INEXPFTE !== 'NULL' && (parseFloat(d.INEXPFTE) > this.bounds[0])
                    else return d.INEXPFTE !== 'NULL' && (parseFloat(d.INEXPFTE) > this.bounds[0]
                        && parseFloat(d.INEXPFTE) < this.bounds[1])
                }
            );
            if (exp.length === 0) { stAvg.push(0); }
            else {
                let s = d3.sum(exp.map(d => { return parseFloat(d[this.demoFilter]) }));
                stAvg.push( ((s / exp.length)*100).toFixed(2) );
            }
            // Separate filter for US, since it doesn't filter out states
            let usDemo = this.allYears[t].filter(d => d[this.demoFilter] !== 'NULL');
            let usExp = usDemo.filter(d => {
                if (this.bounds[1] == 9990) return d.INEXPFTE !== 'NULL' && (parseFloat(d.INEXPFTE) > this.bounds[0])
                else return d.INEXPFTE !== 'NULL' && (parseFloat(d.INEXPFTE) > this.bounds[0]
                    && parseFloat(d.INEXPFTE) < this.bounds[1])
            });
            usTots.push(usExp.map(d => d[this.demoFilter]));
        }
        let usAvg = usTots.map((d,i) => {
            let tmp = ((d3.sum(d)/d.length)*100).toFixed(2);
            return {avg:parseFloat(tmp),yr:this.years[i]}
        })
        
        stMapping = stAvg.map((a,i) => {return { avg:parseFloat(a),yr:this.years[i] }});
        
        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(this.years, d => d))
            .range([ 0, this.svgWidth- this.margin.left - this.margin.right ]);
        this.svg.append("g")
            .attr("transform",`translate(${this.margin.left},${this.svgHeight-this.margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat(d3.format('d')));
        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0,75])
            .range([ this.svgHeight-this.margin.bottom, this.margin.top ]);
        this.svg.append("g")
            .attr("transform",`translate(${this.margin.left},0)`)
            .call(d3.axisLeft(y));
        // Add ST line
        this.svg.append("path").datum(stMapping)
            .attr('class','avgline')
            .attr("stroke", "steelblue")
            .attr("d", d3.line()
                .x(d => x(d.yr)+this.margin.left)
                .y(d => y(d.avg)));
        // Add US line
        this.svg.append("path").datum(usAvg)
            .attr('class','avgline')
            .attr("stroke", "red")
            .attr("d", d3.line()
                .x(d => x(d.yr)+this.margin.left)
                .y(d => y(d.avg)));
        
        let circs = [{y:stMapping.filter(d => d.yr == this.curYr)[0].avg},
                    {y:usAvg.filter(d => d.yr == this.curYr)[0].avg}]
        // Adds current year circles
        this.svg.selectAll('circle').data(circs).enter().append('circle')
            .attr("transform",`translate(${this.margin.left},0)`)
            .attr('cx',x(this.curYr)).attr('cy',d => y(d.y))
            .attr('r',5).attr('class','curYrCircle')
    }
}