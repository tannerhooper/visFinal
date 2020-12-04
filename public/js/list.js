class List {
    /** 
    *@param list 
    */

    update(data) {
        let ct = 0;

        var topData = data.sort(function (a, b) {
            if (a.C150_4 != 'NULL' && b.C150_4) {
                // return d3.descending(+a.C150_4, +b.C150_4);
                return b.C150_4 - a.C150_4;
            }
        }).slice(0, 5);//top 10 here

        d3.selectAll("national")
            .data(topData)
            .enter()
            .append("p")
            .text(function (d) {
                ct += 1
                return ct + ".  School: " + d.INSTNM + "   Graduation Rate: " + d.C150_4;
            });
    }

}