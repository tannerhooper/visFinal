class Tooltip {

  constructor() {
    //----------------------------------------
    // Constructor for the tooltip
    //----------------------------------------
    this.tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
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
    var cols = [ "C150_4_AIAN", "C150_4_ASIAN", "C150_4_BLACK", "C150_4_HISP", "C150_4_NHPI", "C150_4_NRA", "C150_4_WHITE", "C150_4_2MOR", "C150_4_UNKN"];
    var colMapping = {
      "C150_4_2MOR": "2 or More \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0", 
      "C150_4_AIAN": "Native American \xa0",
      "C150_4_ASIAN": "Asian \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
      "C150_4_BLACK": "Black \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0", 
      "C150_4_HISP": "Hispanic \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
      "C150_4_NHPI": "Pacific Islander \xa0\xa0\xa0",
      "C150_4_NRA": "Nonresident Alien", 
      "C150_4_UNKN": "Unknown \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0", 
      "C150_4_WHITE": "White \xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"
    };
    var perct = 0;
    let text = "<h2>" + `${Tools.stateMapping[d]}` + "</h2>";
    cols.forEach(function(race) {
      var dta = data.filter(dt => {
        return dt.STABBR === d && dt[race] !== 'NULL'});
        perct = dta.map(dt => {
            return dt[race];
          }).reduce((p, c) => +p + +c, 0) / dta.length;
          if(Number.isNaN(perct)){
            return ;
          }
          perct *= 100;
          perct = perct.toFixed(0);
          text += `<table>  
          <tr>
            <td>`+`${colMapping[race]}`+ `</td> 
            <td>
              <div style="width:` + `${1.3*perct}` + `px; 
                  height:15px; background-color:#BFA817; color:white; 
                  padding:4px 4px 0px 4px; vertical-align:bottom;
                  display:inline-block;">
              </div> 
              <div style="width: `+ `${130-(1.3*perct)}` + ` px;
                    height:15px; background-color:#F2F2F2; color:#a69214; 
                    vertical-align:bottom; padding:4px 4px 0px 4px;
                    font-weight:bold; display:inline-block;"> `+ `${perct}` + `% 
              </div>
            </td>
          </tr>  
          </table>`; 
        });
    return text;
  };


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
