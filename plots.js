function init(sample) {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
    
    optionChanged(sample);
  })}
  
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select("#sample-metadata");
  
        PANEL.html("");
      
        // Iterate through the metadata properties and print to our table
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(key + ": " + value);
        })
    });
}

function buildCharts(sample, wash) {
    d3.json("samples.json").then((data) => {
        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0]
        
        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;

        // Create the "Top Ten" bar chart arrays
        var id_10 = ids.slice(0,10).map(id => "OTU " + id).reverse();
        var label_10 = labels.slice(0,10).reverse();
        var values_10 = values.slice(0,10).reverse();

        var wash_freq = data.metadata.filter(sampleObj => sampleObj.id == sample)[0].wfreq;

        //Initialize the three charts
        //var BAR = d3.select("bar");
        //var GAUGE = d3.select("gauge");
        //var BUBBLE = d3.select("bubble");

        //Create the charts
        var bar_trace = [{
            x: values_10,
            y: id_10,
            text: label_10,
            name: 'Top 10 Bacteria',
            type: "bar",
            orientation: 'h'
        }];

        var bar_layout = {
            title: "Top Ten Bacteria Samples",
            xaxis: {title: "Sample Size"},
            yaxis: {title: "OTU ID"}
        }

        Plotly.newPlot("bar", bar_trace, bar_layout);

        var bubble_trace = [{
            x: ids,
            y: values,
            text: labels,
            mode: 'markers',
            marker: {
                color: ids,
                size: values,
                sizeref: 1.3
            },
        }];

        var bubble_layout = {
            title: 'Relative Size of Bacterial Samples',
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Size"}
        }

        Plotly.newPlot("bubble", bubble_trace, bubble_layout);

        var gauge_trace = [{
            domain: { x: [0, 1], y: [0, 1] },
            value: wash_freq,
            title: {text: "Belly Button Washing Frequency<br>Scrubs Per Week"},
            type: "indicator",
            mode: "gauge+number"
        }];

        var gauge_layout = {
            
        }

        Plotly.newPlot("gauge", gauge_trace, gauge_layout);


    })

}

init("940");