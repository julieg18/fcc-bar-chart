const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"
let xMargin = 50;
let yMargin = 30;
let chartWidth = 700;
let chartHeight = 400;
let width = chartWidth + xMargin * 2;
let height = chartHeight + yMargin * 2;
let barWidth = chartWidth/275;
let tooltip = d3.select("#tooltip");

const svg = d3.select("svg")
  .attr("height", height)
  .attr("width", width);

let req = new XMLHttpRequest();
req.open('GET', url, true);
req.send();
req.onload = function() {
  json = JSON.parse(req.responseText);
  const dataset = json.data;

  const xScale = d3.scaleTime()
    .domain([
      d3.min(dataset, (d) => new Date(d[0])),
      d3.max(dataset, (d) => new Date(d[0]))
    ]).range([xMargin, chartWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .range([chartHeight, yMargin]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis);

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${xMargin}, 0)`)
    .call(yAxis);

  svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .attr("x", (d) => xScale(new Date(d[0])))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", barWidth)
    .attr("height", (d) => height - yScale(d[1]) - yMargin * 2)
    .on("mouseover", (d) => {
      tooltip
        .style("visibility", "visible")
        .html(d[0] + "<br/>" + d[1] + " (in billions)")
        .attr("data-date", d[0])
        .style("top", (event.pageY-10) + "px")
        .style("left", (event.pageX + 10) + "px");
    })
    .on("mouseout", () => {
      tooltip
      .style("visibility", "hidden");
    });
}





