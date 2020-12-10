class Map {
    /**
       * Constructor for the Year Chart
       * @param line instance of the Line Chart
       */
    constructor(line, tooltip, list) {
        this.lineChart = line;
        this.tooltip = tooltip;
        this.list = list
    }

    isAlpha(ch) {
        return /^[A-Z]$/i.test(ch);
    }

    update(data) {
        // d3.selectAll('path').remove();
        this.data = data;

        if (data.length <= 1) { return; }

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

        data.forEach(element => {
            // console.log('h')
            // if (element.LOAN_COMP_ORIG_YR4_RT != 'NULL' && element.LOAN_COMP_ORIG_YR4_RT != 'PrivacySuppressed') {
            //     console.log(element.INSTNM, element.LOAN_COMP_ORIG_YR4_RT)
            // }
        });

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
            this.createLegend();

            svg.append("path")
                .attr("class", "state-borders")
                .attr("d", path(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; })));
        });
    }


    createLegend() {
        // Remove contents
        // d3.select('#legend').html("")


        let defs = d3.select('#legend')
            // .remove()
            .append("svg")
            .attr('id', 'legend-svg')
            .append("defs");

        //Append a linearGradient element to the defs and give it a unique id
        var linearGradient = defs.append("linearGradient")
            .attr("id", "linear-gradient");

        // var linearGradient = d3.select('#map')
        //     .append("linearGradient")
        // .attr("x", "100")
        // .attr("y", "100")

        //Horizontal gradient
        linearGradient
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

        //Vertical gradient
        linearGradient
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%");

        //Diagonal gradient
        linearGradient
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "100%");

        //Diagonal gradient where the start and end point have been pulled in
        linearGradient
            .attr("x1", "30%")
            .attr("y1", "30%")
            .attr("x2", "70%")
            .attr("y2", "70%");

        //Set the color for the start (0%)
        linearGradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#08306b"); //light blue

        //Set the color for the end (100%)
        linearGradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#bedaed"); //dark blue

        //Draw the rectangle and fill with gradient
        d3.selectAll('#map').append("rect")
            .attr("width", 202)
            .attr("height", 20)
            .attr('transform', 'rotate(-90) translate(-590, 930)')
            .style("fill", "url(#linear-gradient)");

        // Create scale
        let legendScale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, 200]);

        // Add scales to axis
        let x_axis = d3.axisBottom()
            .scale(legendScale);

        //Append group and insert axis
        d3.select('#map')
            .append("svg")
            .append("g")
            .attr('transform', 'rotate(-90) translate(-590, 925)')
            .call(x_axis)
            // .selectAll('g')
            .selectAll('text')
            .attr('transform', 'rotate(90) translate(-18, -12)')
            .exit()
            .selectAll('line')
            .attr('transform', 'translate(0, -5)')

        // transform="rotate(-90) translate(-12,-10)"
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
            .on('click', d => {
                this.lineChart.update(States[d.id], null, null);
                this.list.update(this.data, States[d.id])
            })
            .on("mouseover", d => {
                this.tooltip.mouseover(this.data, States[d.id]);
            })
            .on("mousemove", () => {
                this.tooltip.mousemove();
            })
            .on("mouseout", () => {
                this.tooltip.mouseout();
            })
            ;
    }

    createStateList(data) {
        let stateList = {};
        let datasetList = { 'C150_4': 'C150_4', 'PELL_COMP_ORIG_YR4_RT': 'PELL_COMP_ORIG_YR4_RT', 'LOAN_COMP_ORIG_YR4_RT': 'LOAN_COMP_ORIG_YR4_RT' }
        let isRadioButton = false
        if (data.length > 10) {
            data.forEach(element => {
                if (!(element.STABBR in stateList)) {
                    stateList[element.STABBR] = [0, 0, 0];
                }
                else {
                    // add eval statement based on selected radio parameter.
                    let buttons = document.getElementsByClassName('grad_rate');
                    let dataset = 'element.';
                    for (var i = 0; i < buttons.length; i++) {
                        if (buttons[i].checked == true && (buttons[i].value == 'PELL_COMP_ORIG_YR4_RT' || buttons[i].value == 'LOAN_COMP_ORIG_YR4_RT')) {
                            // appends column name to dataset. 
                            dataset = dataset + buttons[i].value;
                            isRadioButton = true
                        }
                    }
                    if (!isRadioButton) { dataset = 'element.C150_4' }
                    if (isRadioButton) {

                        if (!this.isAlpha(eval(dataset)) && eval(dataset) != 'NULL' && eval(dataset) != 'PrivacySuppressed') {

                            stateList[element.STABBR][0] += parseFloat(eval(dataset));
                            stateList[element.STABBR][1] += 1;
                        }
                    }
                    else {
                        // if (element.C150_4 != 'NULL' && element.C150_4 != 'PrivacySuppressed') {
                        if (!this.isAlpha(element.C150_4) && element.C150_4 != 'NULL') {
                            stateList[element.STABBR][0] += parseFloat(element.C150_4);
                            stateList[element.STABBR][1] += 1;
                        }
                    }
                }
            }
            );
        }

        for (const [key, value] of Object.entries(stateList)) {
            value[2] = value[0] / value[1];
            if (value[1] == 0) {
                value[2] = 0;
            }
        }
        return stateList;
    }
}
