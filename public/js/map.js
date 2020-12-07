class Map {
    /**
       * Constructor for the Year Chart
       * @param line instance of the Line Chart
       */
    constructor(line){
        this.lineChart = line;
    }

    update(data) {
        // d3.selectAll('path').remove();
        this.data = data;

        let States = {
            "02": "AK",
            "01": "AL",
            "05": "AR",
            "04": 'AZ',
            "06": 'CA',
            "08": 'CO',
            "09": 'CT',
            "10": 'DE',
            "12": 'FL',
            "13": 'GA',
            "15": 'HI',
            "19": 'IA',
            "16": 'ID',
            "17": 'IL',
            "18": 'IN',
            "20": 'KS',
            "21": 'KY',
            "22": 'LA',
            "25": 'MA',
            "24": 'MD',
            "23": 'ME',
            "26": 'MI',
            "27": 'MN',
            "29": 'MO',
            "28": 'MS',
            "30": 'MT',
            "37": 'NC',
            "38": 'ND',
            "31": 'NE',
            "33": 'NH',
            "34": 'NJ',
            "35": 'NM',
            "32": 'NV',
            "36": 'NY',
            "39": 'OH',
            "40": 'OK',
            "41": 'OR',
            "42": 'PA',
            "44": 'RI',
            "45": 'SC',
            "46": 'SD',
            "47": 'TN',
            "48": 'TX',
            "49": 'UT',
            "51": 'VA',
            "50": 'VT',
            "53": 'WA',
            "55": 'WI',
            "54": 'WV',
            "56": 'WY'
        }

        var svg = d3.select("#map");

        var path = d3.geoPath();

        d3.json("https://d3js.org/us-10m.v1.json").then(us => {
            // console.log(topojson.feature(us, us.objects.states).features)

            const legend_width = 300;
            const legend_height = 50;
            const min = 0;
            const max = .8;

            let range = d3.interpolateBlues
            // console.log('BLUES', d3.interpolateBlues)
            // let range = ['#063e78', '#d3e3eb']
            let stateList = this.createStateList(data);

            //ColorScale be used consistently by all the charts
            // let colorScale = d3.scaleLinear()
            let colorScale = d3.scaleSequential()
                .domain([0.8, 0])
                .interpolator(range);
            // .range(range)

            this.createMap(svg, us, States, path, colorScale, stateList);

            // this.createLegend(legend_width, legend_height);
            // var svg = d3.select("#legend");

            // var quantize = d3.scaleQuantize()
            //     .domain([0, 0.15])
            //     .range(d3.range(9).map(function (i) { return "q" + i + "-9"; }));

            // svg.append("g")
            //     .attr("class", "legendQuant")
            //     .attr("transform", "translate(20,20)");

            // var colorLegend = d3.legendColor()
            //     .labelFormat(d3.format(".2f"))
            //     .useClass(true)
            //     .scale(quantize);

            // svg.select(".legendQuant")
            //     .call(colorLegend);
            svg.append("path")
                .attr("class", "state-borders")
                .attr("d", path(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; })));
        });
    }

    createLegend(legend_width, legend_height) {
        var key = d3.select("#legend")
            .append("svg")
            .attr("width", legend_width)
            .attr("height", legend_height);

        var legend = key.append("defs")
            .append("svg:linearGradient")
            .attr("id", "gradient")
            .attr("x1", "0%")
            .attr("y1", "100%")
            .attr("x2", "100%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");

        legend.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#f7fcf0")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "33%")
            .attr("stop-color", "#bae4bc")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "66%")
            .attr("stop-color", "#7bccc4")
            .attr("stop-opacity", 1);

        legend.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#084081")
            .attr("stop-opacity", 1);

        key.append("rect")
            .attr("width", w)
            .attr("height", h - 30)
            .style("fill", "url(#gradient)")
            .attr("transform", "translate(0,10)");

        var y = d3.scaleLinear()
            .range([300, 0])
            .domain([68, 12]);

        var yAxis = d3.axisBottom()
            .scale(y)
            .ticks(5);

        key.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(0,30)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("axis title");
    }

    createMap(svg, us, States, path, colorScale, stateList) {
        svg.append("g")
            .attr("class", "states")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            .enter().append("path")
            .attr('id', d => States[d.id])
            .attr("d", path)
            .attr('stroke', 'black')
            .attr('fill', function (d) {
                if (d.id in States) {
                    let stateCode = States[d.id]
                    let stateInfo = stateList[stateCode]
                    let gradRate = stateInfo[2]
                    return colorScale(gradRate);
                }
            })
            .on('click',d => this.lineChart.update(States[d.id]))
            ;
    }

    createStateList(data) {
        let stateList = {};
        // console.log(data[0]);
        data.forEach(element => {
            if (!(element.STABBR in stateList)) {
                stateList[element.STABBR] = [0, 0, 0];
            }
            else {
                // console.log(element.C150_4)
                if (element.C150_4 != 'NULL' && element.C150_4 != null) {

                    stateList[element.STABBR][0] += parseFloat(element.C150_4);
                    stateList[element.STABBR][1] += 1;
                }
            }
        });

        for (const [key, value] of Object.entries(stateList)) {
            value[2] = value[0] / value[1];
            if (value[1] == 0) {
                value[2] = 0;
            }
        }
        // console.log(stateList['UT'][2]);
        return stateList;
    }
}
