class List {
    /** 
    *@param list 
    */

    update(data) {
        let ct = 0;

        let buttons = document.getElementsByClassName('grad_rate');
        let aDataset = 'a.';
        let bDataset = 'b.';
        let dDataset = 'd.';
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].checked == true) {
                aDataset = aDataset + buttons[i].value;
                bDataset = bDataset + buttons[i].value;
                dDataset = dDataset + buttons[i].value;
            }
        }

        var topData = data.sort(function (a, b) {
            if (eval(aDataset) != 'NULL' && eval(bDataset)) {
                // return d3.descending(+a.C150_4, +b.C150_4);
                return eval(bDataset) - eval(aDataset);
            }
        }).slice(0, 5);//top 10 here

        let list = d3.select("#national")
            .html("")
            // .enter()
            .append("h3")
            .text("Top 5 US Schools");



        let topTen = list.selectAll('#national')
            .data(topData)
            .enter()
            .append("p")
            .text(function (d) {
                ct += 1
                return ct + ".   " + d.INSTNM + "   - : " + parseFloat(eval(dDataset)).toFixed(2) + '%';
            })
            .attr("align", "right");

    }

}