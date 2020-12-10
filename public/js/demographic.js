class Demographic {
    constructor(map) {
        this.map = map;
    }

    update(map, data, line, list) {
        let button_data = [['Overall', 'C150_4'], ['Pell Grant', 'PELL_COMP_ORIG_YR4_RT'], ['Federal Loan', 'LOAN_COMP_ORIG_YR4_RT']]

        // Create the shape selectors
        var form = d3.select("#buttons");
        let labels = form.selectAll("#button")
            .data(button_data)
            .enter()
            .append("label")
            .attr('id', 'button')
            .text(function (d) { return d[0]; })
            .append("input")
            .attr('type', 'radio')
            .attr('name', 'demo')
            .attr('value', function (d) { return d[1] })
            .attr('class', 'grad_rate')
            .attr('id', 'demo_buttons')
            .on('click', d => {
                let fil = [...document.getElementsByClassName('grad_rate')].filter(x => x.checked == true)[0].value
                line.update(null,fil)
                map.update(data)
                list.update(data)
            })
            .property("checked", function (d, i) { return i === 0; })
            ;
    }

    addOnClick(data) {
        d3.selectAll('#demo_buttons')
        // .attr('onclick', this.map.update(data))
    }
}