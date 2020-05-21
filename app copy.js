function buildPlot(id) {
    // getting data from the json file
    d3.json("samples.json").then((data) => {
        console.log(data)
        var WFREQ = data.metadata.filter(d => d.id.toString() === id)[0]["wfreq"];
        // console.log(WFREQ)

        // filter sample values by id 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];

        // console.log(samples);

        // Getting the top 10 
        var samplevalues = samples.sample_values.slice(0, 10).reverse();

        // get only top 10 otu ids for the plot OTU and reversing it. 
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();

        // get the otu id's
        var OTU_id = OTU_top.map(d => "OTU " + d)

        //   console.log(`OTU IDS: ${OTU_id}`)

        // get the top 10 labels
        var labels = samples.otu_labels.slice(0, 10).reverse();

        //   console.log(`Sample Values: ${samplevalues}`)
        //   console.log(`Id Values: ${OTU_top}`)
        // create trace 
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
                color: 'rgb(42,24,95)'
            },
            type: "bar",
            orientation: "h",
        };

        // create data variable
        var data = [trace];

        // create layout 
        var layout = {
            title: "Top 10 OTU",
            yaxis: {
                tickmode: "linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };

        // create the bar plot
        Plotly.newPlot("bar", data, layout);

        //console.log(`ID: ${samples.otu_ids}`)

        // The bubble chart
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels


        };

        // set the layout for the bubble plot
        var layout_b = {
            xaxis: { title: "OTU ID" },
            height: 600,
            width: 1000
        };

        // creating data variable 
        var data1 = [trace1];

        // create the bubble plot
        Plotly.newPlot("bubble", data1, layout_b);

        // The gauge chart

        var data_g = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: WFREQ,
            title: {
                text: `Belly Button Washing Frequency`
            },
            type: "indicator",
            mode: "gauge+number+range",
            gauge: {
                axis: { range: [null, 9], tickwidth: 1, tickcolor: "purple" },
                bar: { color: "gray" },
                steps: [
                    { range: [0, 1], color: "White" },
                    { range: [1, 2], color: "AliceBlue" },
                    { range: [2, 3], color: "LightSkyBlue" },
                    { range: [3, 4], color: "DeepSkyBlue" },
                    { range: [4, 5], color: "Blue" },
                    { range: [5, 6], color: "MediumBlue" },
                    { range: [6, 7], color: "DarkBlue" },
                    { range: [7, 8], color: "Navy" },
                    { range: [8, 9], color: "Indigo" },
                ]
            }

        }];
        var layout_g = {
            width: 700,
            height: 600,
            margin: { t: 20, b: 40, l: 100, r: 100 },
            font: { color: "purple" }
        };
        Plotly.newPlot("gauge", data_g, layout_g);
    });
}


// create the function to get the necessary data
function dropdowninfo(id) {
    // Reading JSON File
    d3.json("samples.json").then((data) => {

        // Data for Demogrphic Panel
        var metadata = data.metadata;

        console.log(metadata)

        // filtering data by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // select demographic panel to load data
        var demographicInfo = d3.select("#sample-metadata");

        // var gaugeinfo = d3.select("#gauge");

        // Refresh demographic info panel
        demographicInfo.html("");
        // gaugeinfo.html("");
        // - thought this might refresh the gauge values and update with new selected ID.

        // grab the necessary demographic data for the id and append to the panel
        Object.entries(result).forEach((key) => {
            demographicInfo.append("h5").text(key[0] + ": " + key[1] + "\n");
            // gaugeinfo.append("")

        });
    });
}

// create the function for the change event
function optionChanged(id) {
    buildPlot(id);
    dropdowninfo(id);
    // buildGauge(data.wfreq);
}

// create the function to get initial data
function init() {
    // select dropdown menu 
    var dropdown = d3.select("#selDataset");
    // var gaugevalue = d3.select("#gauge")

    // read the data 
    d3.json("samples.json").then((data) => {
        console.log(data)

        // get the id data to the dropdwown menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");

        });

        // call the functions
        buildPlot(data.names[0]);
        dropdowninfo(data.names[0]);

    });
}

init();