class List {
    /** 
    *@param list 
    */

    extractStateData(data, state, el) {
        let stateList = []

        data.forEach(element => {
            if (element.STABBR == state) {
                if (eval(el) != "NULL" && eval(el) != 'PrivacySuppressed')
                    stateList.push(element)
            }
        });
        return stateList;

    }

    update(ogData, state) {
        let data = [];
        let ct = 0;
        let ctState = 0;
        if (state == null) { state = "UT" }
        let buttons = document.getElementsByClassName('grad_rate');
        let aDataset = 'a.';
        let bDataset = 'b.';
        let elDataset = 'element.';
        let dDataset = 'd.';
        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].checked == true) {
                aDataset = aDataset + buttons[i].value;
                bDataset = bDataset + buttons[i].value;
                elDataset = elDataset + buttons[i].value;
                dDataset = dDataset + buttons[i].value;
            }
        }

        ogData.forEach(element => {
            if (eval(elDataset) !== 'NULL' && eval(elDataset) !== 'PrivacySuppressed') {
                data.push(element);
            }
        });

        // let data = ogData.map(d => {
        //     if (eval(dDataset) !== 'NULL' && eval(dDataset) !== 'PrivacySuppressed') {
        //         return d;
        //     }
        // })

        var topData = data.sort(function (a, b) {
            if (eval(aDataset) != 'NULL' && eval(bDataset) != 'NULL'
                && eval(aDataset) != 'PrivacySuppressed' && eval(bDataset) != 'PrivacySuppressed') {
                // console.log(typeof eval(bDataset), eval(bDataset), typeof eval(aDataset), eval(aDataset))

                return eval(bDataset) - eval(aDataset);
            }
        }).slice(0, 5);//top 10 here

        let stateData = this.extractStateData(data, state, elDataset);

        var topStateData = stateData.sort(function (a, b) {
            if (eval(aDataset) != 'NULL' && eval(bDataset) != 'NULL'
                && eval(aDataset) != 'PrivacySuppressed' && eval(bDataset) != 'PrivacySuppressed') {
                if (a.STABBR == state && b.STABBR == state) {
                    return eval(bDataset) - eval(aDataset);
                }
            }
        }).slice(0, 5);

        let list = d3.select("#national")
            .html("")
            .append("h3")
            .text("Top 5 US Schools");



        let topFive = list.selectAll('#national')
            .data(topData)
            .enter()
            .append("p")
            .text(function (d) {
                ct += 1
                // console.log(typeof eval(dDataset), eval(dDataset))
                let percentage = parseFloat(eval(dDataset)).toFixed(2);
                if (eval(dDataset) == '1') {
                    return ct + ".   " + d.INSTNM + "  - : 100%";
                }
                // console.log('')
                percentage = percentage.substring(2);
                return ct + ".   " + d.INSTNM + "   - " + percentage + '%';
            })
            .attr("align", "right");



        let stateList = d3.select("#state")
            .html("")
            .append("h3")
            .text("Top 5 " + Tools.stateMapping[state] + " Schools")

        let topStateSchools = stateList.selectAll('#state')
            .data(topStateData)
            .enter()
            .append("p")
            .text(function (d) {
                ctState += 1
                // console.log(typeof eval(dDataset), eval(dDataset))
                if (eval(dDataset) == '1') {
                    return ctState + ".   " + d.INSTNM + "  - : 100%";
                }
                else {
                    let percentage = parseFloat(eval(dDataset)).toFixed(2);
                    if (percentage == '1.00') {
                        return ctState + ".   " + d.INSTNM + "   -  100%";
                    }
                    percentage = percentage.substring(2);
                    return ctState + ".   " + d.INSTNM + "   -  " + percentage + '%';
                }
            })




    }



}