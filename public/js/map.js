class Map {

    /**
       * Constructor for the Year Chart
       * TODO: add chart vars
       * @param data over years
       */

    update(data) {
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
            console.log(topojson.feature(us, us.objects.states).features)


            let range = d3.interpolateBlues

            // let range = ['white', 'blue']
            let stateList = this.createStateList(data);


            //ColorScale be used consistently by all the charts
            let colorScale = d3.scaleSequential()
                .domain([0, 0.7])
                .interpolator(range);

            this.createMap(svg, us, States, path, colorScale, stateList);


            svg.append("path")
                .attr("class", "state-borders")
                .attr("d", path(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; })));
        });
    }

    createMap(svg, us, States, path, colorScale, stateList) {
        svg.append("g")
            .attr("class", "states")
            .selectAll("path")
            .data(topojson.feature(us, us.objects.states).features)
            // .data(stateArray)
            .enter().append("path")
            .attr('id', d => States[d.id])
            .attr("d", path)
            .attr('stroke', 'black')
            .attr('fill', function (d) {
                console.log(d);
                if (d.id in States) {
                    let stateCode = States[d.id]
                    let stateInfo = stateList[stateCode]
                    let gradRate = stateInfo[2]
                    return colorScale(gradRate);
                }
            }
            );
    }

    createStateList(data) {
        let stateList = {};
        console.log(data[0]);
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

        console.log(stateList['UT'][2]);
        return stateList;
    }
}


