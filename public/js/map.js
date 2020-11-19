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

        //Domain definition for global color scale
        let domain = [0, .05, .1, .15, .2, .25, .3, .35, .4, .45, .5, .55, .6, .65, .7, .75, .8, .85, .9, .95, .1]
        //Color range for global color scale
        let range = ["#FF0000", "#FE1616", "#FD2D2D", "#FC4343", "#FB5A5A", "#FB7070", "#FA8787",
            "#F99D9D", "#F8B4B4", "#F7CACA", "#F7E1E1",
            "#E6FFEA", "#CEEFD2", "#B6E0BA", "#9ED1A2", "#86C18A", "#6EB271", "#56A359",
            "#3E9342", "#268429", "#0E7512"]

        //ColorScale be used consistently by all the charts
        this.colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);

        let stateList = {};
        console.log(data[0])
        data.forEach(element => {
            if (!(element.STABBR in stateList)) {
                stateList[element.STABBR] = [0, 0, 0]
            }
            else {
                // console.log(element.C150_4)
                if (element.C150_4 != 'NULL' && element.C150_4 != null) {

                    stateList[element.STABBR][0] += parseFloat(element.C150_4)
                    stateList[element.STABBR][1] += 1
                }

            }
        });

        for (const [key, value] of Object.entries(stateList)) {
            value[2] = value[0] / value[1];
            if (value[1] == 0) {
                value[2] = 0
            }
            // if (value[2] == null || value[2] == 'NaN' || value[2] == NaN || value[2] == 'NULL') {
            //     value[2] = 0
            // }
            // console.log(value[2])
        }

        // stateList.forEach(element => {
        //     element[2] = element[0] / element[1];
        // });

        console.log(stateList['UT'][2])
        console.log(this.colorScale(stateList['UT'][2]))



        d3.json("https://d3js.org/us-10m.v1.json").then(us => {
            // console.log(topojson.feature(us, us.objects.states).features[0].id)

            svg.append("g")
                .attr("class", "states")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                .attr('id', d => States[d.id])
                .attr("d", path)
                .attr('fill', d => {
                    if (d.id in stateList) {
                        console.log('color', this.colorScale(stateList[d.id][2]))
                        return this.colorScale(stateList[d.id][2]);
                    }
                }
                )
                .attr('stroke', 'black')

            svg.append("path")
                .attr("class", "state-borders")
                .attr("d", path(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; })));
        });
    }
}


