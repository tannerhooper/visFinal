class Map {

    /**
       * Constructor for the Year Chart
       * TODO: add chart vars
       * @param data over years
       */
    constructor(data) {
        this.data = data;
    }

    update() {
        var svg = d3.select("#map");

        var path = d3.geoPath();

        d3.json("https://d3js.org/us-10m.v1.json").then(us => {
            console.log(us)

            svg.append("g")
                .attr("class", "states")
                .selectAll("path")
                .data(topojson.feature(us, us.objects.states).features)
                .enter().append("path")
                .attr("d", path)
                .attr('fill', 'white')
                .attr('stroke', 'black')

            svg.append("path")
                .attr("class", "state-borders")
                .attr("d", path(topojson.mesh(us, us.objects.states, function (a, b) { return a !== b; })));
        });
    }
}


