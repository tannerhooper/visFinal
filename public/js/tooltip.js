class Tooltip {

  constructor() {
    //----------------------------------------
    // tooltip
    //----------------------------------------
    this.tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      // .attr("opacity", 0)
      .style("background", "#FFFFFF")
      .attr('id', 'tooltip')
      .classed('tooltipDiv', true)
    ;
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
  };

  /**
   * Gets the HTML content for a tool tip.
   */
  tooltip_html(data, d) {
    let text = "<h2>" + `${this.stateMapping[d]}` + "</h2>";
    // text +=  "Total Crimes: " + d.Index;
    // text += "<ul>"
    // // Murder
    // text += "<li class = murder>" + "Murder:\t\t"+d.Murder+"</li>"
   // Auto
    // text += "<li class = independent>" + "Auto:\t\t"+d.Auto+"</li>"
    
    // text += "</ul>";
    return text;
  }

  mouseover(data, d) {
    this.tooltip
      .html(this.tooltip_html(data, d))
    ;
    this.tooltip.style("visibility", "visible");
  }

  mousemove(d) {
    this.tooltip.style("top", (d3.event.pageY-10)+"px")
      .style("left",(d3.event.pageX+10)+"px");
  }

  mouseout(d) {
    this.tooltip.style("visibility", "hidden");
  }
};
