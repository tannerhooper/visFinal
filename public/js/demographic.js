class Demographic {

    // constructor(data, map) {
    //     this.data = data;
    //     this.map = map;
    // }

    update(yearChart) {

        let button_data = [['Overall', 'C150_4'], ['Pell Grant', 'PELL_COMP_ORIG_YR4_RT'], ['Federal Loan', 'LOAN_COMP_ORIG_YR4_RT']]

        // Create the shape selectors
        var form = d3.select("#buttons").append("form");

        let labels = form.selectAll("#button")
            .data(button_data)
            .enter()
            .append("label")
            .text(function (d) { return d[0]; })
            .append("input")
            .attr('type', 'radio')
            .attr('name', function (d) { return d[0] })
            .attr('value', function (d) { return d[1] })
            // .attr({
            //     type: "radio",
            //     class: "shape",
            //     name: "mode",
            //     value: function (d) { return d[1]; }
            // })
            .attr('id', 'button')
            .property("checked", function (d, i) { return i === 0; })
            .attr('onclick', yearChart.update());
    }
}