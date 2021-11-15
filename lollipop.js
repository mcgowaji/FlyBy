var l_width = window.innerWidth / 6,
  l_height = 0.3 * window.innerHeight,
  margin = {
    top: l_height / 30,
    right: l_width / 4,
    bottom: l_height / 10,
    left: l_width / 3,
  };
// margin = {top: 10, right: 40, bottom: 40, left: 60};

function Counter(array) {
  var count = {};
  array.forEach((val) => (count[val] = (count[val] || 0) + 1));
  return count;
}

// append the svg object to the body of the page
var svg = d3
  .select("#wordcloud")
  .append("svg")
  .attr("width", l_width + margin.left + margin.right)
  .attr("height", l_height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add X axis
var x = d3.scaleLinear().range([0, l_width]);
var xAxis = svg.append("g").attr("class", "myXaxis").style("display", "none");

// Y axis
var y = d3.scaleBand().range([0, 300]).padding(1);

var yAxis = svg.append("g").attr("class", "myYaxis");

function createFrequencies(data) {
  var newArray = [];
  const maxCluster = d3.max(data, (d) => d.cluster);
  console.log("calculated max cluster is ", maxCluster);
  for (var i = 0; i <= maxCluster; i++) {
    var section = data.filter((d) => d.cluster == i);
    long_string = section.map((d) => d.body).join("");
    var top20 = Counter(long_string.split(" "));

    const sorted = Object.entries(top20)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    //   console.log(`sorted top 20 for cluster ${i}:`, sorted);
    sorted.reduce(function (result, item) {
      newArray.push({ cluster: i, text: item[0], frequency: item[1] });
    }, {});
  }
  return newArray;
}

function update(cluster_num, frequencies) {
  console.log(`reading from cluster ${cluster_num}.`);
  if (typeof frequencies === "undefined" || !frequencies) {
    console.log("Missing frequencies. Reading from backup file.");
    d3.csv("embeddings_sample_word_counts.csv", d3.autoType).then((data) => {
      var data = data.filter((d) => d.cluster == cluster_num);
      // v5 sorting if necessary
      // data = data.sort((a, b) => d3.descending(a.frequency, b.frequency))

      // Add X axis
      x.domain([0, d3.max(data, (d) => d.frequency)]);
      xAxis.transition().duration(1000).call(d3.axisBottom(x));

      // Y axis
      y.domain(
        data.map(function (d) {
          return d.text;
        })
      );
      yAxis.transition().duration(1000).call(d3.axisLeft(y));

      svg.select("g").call(d3.axisLeft(y)).selectAll("text");

      // X axis
      x.domain([0, d3.max(data, (d) => d.frequency)]);
      xAxis.transition().duration(1000).call(d3.axisBottom(x));

      // Add Y axis
      y.domain(
        data.map(function (d) {
          return d.text;
        })
      );

      yAxis
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y))
        .style("text-anchor", "end")
        .style("color", "#fff")
        .style("font-size", "15");

      // variable j: map data to existing lines
      var j = svg.selectAll(".myLine").data(data);

      // update lines
      j.enter()
        .append("line")
        .attr("class", "myLine")
        .merge(j)
        .transition()
        .duration(1000)
        .attr("x1", function (d) {
          return x(d.frequency);
        })
        .attr("x2", x(0))
        .attr("y1", function (d) {
          return y(d.text);
        })
        .attr("y2", function (d) {
          return y(d.text);
        })
        .attr("stroke", "grey");

      // variable u: map data to existing circles
      var u = svg.selectAll("circle").data(data);

      // update circles
      u.enter()
        .append("circle")
        .merge(u)
        .transition()
        .duration(1000)
        .attr("cx", function (d) {
          return x(d.frequency);
        })
        .attr("cy", function (d) {
          return y(d.text);
        })
        .attr("r", 6)
        .attr("fill", "#69b3a2");
    });
    console.log("Loading complete. trying to exit function.");
    return true;
  } else {
    console.log("Frequencies found. Generating lollipop chart...");
    var data = frequencies.filter((d) => d.cluster == cluster_num);
    console.log("filtered data for lollipop: ", data);
    // Add X axis
    x.domain([0, d3.max(data, (d) => d.frequency)]);
    xAxis.transition().duration(1000).call(d3.axisBottom(x));

    // Y axis
    y.domain(
      data.map(function (d) {
        return d.text;
      })
    );
    yAxis.transition().duration(1000).call(d3.axisLeft(y));

    svg.select("g").call(d3.axisLeft(y)).selectAll("text");

    // X axis
    x.domain([0, d3.max(data, (d) => d.frequency)]);
    xAxis.transition().duration(1000).call(d3.axisBottom(x));

    // Add Y axis
    y.domain(
      data.map(function (d) {
        return d.text;
      })
    );

    yAxis
      .transition()
      .duration(1000)
      .call(d3.axisLeft(y))
      .style("text-anchor", "end")
      .style("color", "#fff")
      .style("font-size", "15");

    // variable j: map data to existing lines
    var j = svg.selectAll(".myLine").data(data);

    // update lines
    j.enter()
      .append("line")
      .attr("class", "myLine")
      .merge(j)
      .transition()
      .duration(1000)
      .attr("x1", function (d) {
        return x(d.frequency);
      })
      .attr("x2", x(0))
      .attr("y1", function (d) {
        return y(d.text);
      })
      .attr("y2", function (d) {
        return y(d.text);
      })
      .attr("stroke", "grey");

    // variable u: map data to existing circles
    var u = svg.selectAll("circle").data(data);

    // update circles
    u.enter()
      .append("circle")
      .merge(u)
      .transition()
      .duration(1000)
      .attr("cx", function (d) {
        return x(d.frequency);
      })
      .attr("cy", function (d) {
        return y(d.text);
      })
      .attr("r", 6)
      .attr("fill", "#69b3a2");
  }
}

update(0);
