class LineChart {
    /**
     * Constructor for the Line Chart
     * @param usData: data for the US average chart
     * @param allYears: optional parameter that contains the data for all the years
     * @param years: all the data from all the CSV files
     */
    constructor(usData,allYears = null,years){
        this.chart = d3.select(`#st-line-chart`).classed("sideBar",true);
        this.usData = usData;
        this.allYears = allYears;
        this.years = years;

        this.selState = '';
        this.bounds = [];
        this.demoFilter = '';

        // set the dimensions and margins of the graph
        this.margin = {top: 10, right: 30, bottom: 20, left: 40};

        this.svgBounds = this.chart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 300;

        this.svg = this.chart.append('svg')
            .attr('width',this.svgWidth).attr('height',this.svgHeight)
            ;
    }

    /**
     * @param {state selected from map} curSt 
     * @param {filter selected from demographic filter} demoFilter 
     * @param {lower and upper bounds selected from spend chart} bounds 
     */
    update(curSt='UT',demoFilter='C150_4',bounds=[0,9990]){
        this.svg.selectAll("*").remove();
        let stAvg = [];
        let stMapping;
        let usMapping;

        if (curSt !== null) this.selState = curSt;
        if (bounds !== null) this.bounds = bounds;
        if (demoFilter !== null) this.demoFilter = demoFilter;

        d3.select('#stAvg').text(`State Average: ${this.selState}`)

        // Computes avg per state
        for (let t in this.allYears){
            // let tmp = this.allYears[t].filter(d => d.STABBR === this.selState && d.C150_4 !== "NULL");
            let demo = this.allYears[t].filter(d => {
                // if (this.selState == 'WY') console.log(d[this.demoFilter])
                return d.STABBR === this.selState && d[this.demoFilter] !== 'NULL'
            });
            let exp = demo.filter(d => {
                    if (this.bounds[1] == 9990) return d.INEXPFTE !== 'NULL' && (parseFloat(d.INEXPFTE) > this.bounds[0])
                    else return d.INEXPFTE !== 'NULL' && (parseFloat(d.INEXPFTE) > this.bounds[0]
                        && parseFloat(d.INEXPFTE) < this.bounds[1])
                }
            );
            if (exp.length === 0) { stAvg.push(0) }
            else {
                let s = d3.sum(exp.map(d => { return parseFloat(d[this.demoFilter]) }));
                stAvg.push( ((s / exp.length)*100).toFixed(2) );
            }
        }
        stMapping = stAvg.map((a,i) => {return {avg:parseFloat(a),yr:this.years[i]}});
        // if (this.selState == 'WY') console.log(stMapping)
        usMapping = this.usData.map((a,i) => {return {avg:parseFloat(a),yr:this.years[i]}});

        // Code to determine min/max of each state, then min/max of all those together
        let minmax = {
            // States: {
            //     "02": "AK",
            //     "01": "AL",
            //     "05": "AR",
            //     "04": 'AZ',
            //     "06": 'CA',
            //     "08": 'CO',
            //     "09": 'CT',
            //     "10": 'DE',
            //     "12": 'FL',
            //     "13": 'GA',
            //     "15": 'HI',
            //     "19": 'IA',
            //     "16": 'ID',
            //     "17": 'IL',
            //     "18": 'IN',
            //     "20": 'KS',
            //     "21": 'KY',
            //     "22": 'LA',
            //     "25": 'MA',
            //     "24": 'MD',
            //     "23": 'ME',
            //     "26": 'MI',
            //     "27": 'MN',
            //     "29": 'MO',
            //     "28": 'MS',
            //     "30": 'MT',
            //     "37": 'NC',
            //     "38": 'ND',
            //     "31": 'NE',
            //     "33": 'NH',
            //     "34": 'NJ',
            //     "35": 'NM',
            //     "32": 'NV',
            //     "36": 'NY',
            //     "39": 'OH',
            //     "40": 'OK',
            //     "41": 'OR',
            //     "42": 'PA',
            //     "44": 'RI',
            //     "45": 'SC',
            //     "46": 'SD',
            //     "47": 'TN',
            //     "48": 'TX',
            //     "49": 'UT',
            //     "51": 'VA',
            //     "50": 'VT',
            //     "53": 'WA',
            //     "55": 'WI',
            //     "54": 'WV',
            //     "56": 'WY'
            // },
            // totals: [],
            // boundes: [],
            // bavg: [],
            // compute: function(stuff,cur) {
            //     for (let state in this.States){
            //         for (let t in stuff){
            //             let tmp = stuff[t].filter(d => d.STABBR === this.States[state] && d.C150_4 !== "NULL")
            //             let s = d3.sum(tmp.map(d => {return d.C150_4}))
            //             this.bavg.push( ((s / tmp.length)*100).toFixed(2) )
            //         }
            //         this.boundes = this.bavg.map((a,i) => {return {avg:parseFloat(a),yr:years[i]}})
            //         this.bavg = []
            //         // if (this.States[state] == 'UT') console.log(this.boundes)
            //         this.totals.push( {abr:this.States[state],max:d3.max(this.boundes,d => d.avg),min:d3.min(this.boundes,d => d.avg)} )
            //         // console.log(d3.max(this.boundes,d => d.avg),d3.min(this.boundes,d => d.avg))
            //         this.boundes = []
            //     }
            //     console.log(this.totals.filter(t => t.abr == cur)[0])
            //     console.log(d3.max(this.totals,d => d.max),d3.min(this.totals,d => d.min))
            // }
        }
        // if (this.type === 'st') minmax.compute(this.allYears,curSt)
        
        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(this.years, d => d))
            .range([ 0, this.svgWidth- this.margin.left - this.margin.right ])
            ;
        this.svg.append("g")
            .attr("transform", `translate(${this.margin.left},${this.svgHeight-this.margin.bottom})`)
            .call(d3.axisBottom(x).tickFormat(d3.format('d')))
            ;

        // Add Y axis
        var y = d3.scaleLinear()
            // .domain([0, d3.max(mapping, d => d.avg)])
            .domain([0,75])
            .range([ this.svgHeight-this.margin.bottom, this.margin.top ])
            ;;
        this.svg.append("g")
            .attr("transform", `translate(${this.margin.left},0)`)
            .call(d3.axisLeft(y))
            ;
        // console.log(stMapping,usMapping)
        // Add ST line
        this.svg.append("path")
            .datum(stMapping)
            .attr('class','stline')
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .x(d => x(d.yr)+this.margin.left)
                .y(d => y(d.avg)))
            ;
        // Add US line
        this.svg.append("path")
            .datum(usMapping)
            .attr('class','usline')
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .x(d => x(d.yr)+this.margin.left)
                .y(d => y(d.avg)))
            ;
    }
}