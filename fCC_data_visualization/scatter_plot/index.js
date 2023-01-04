// fetch data
const dataUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
const resp = await fetch(dataUrl);
const data = await resp.json();
const gdpData = data.data;

// chart variables
const height = 600;
const width = 800;
const padding = 45;

// set chart yScale
const yScale = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(gdpData, (d) => {
      return d[1];
    }),
  ])
  .range([0, height - 2 * padding]);

// set chart xScale
const xScale = d3
  .scaleLinear()
  .domain([0, gdpData.length - 1])
  .range([padding, width - padding]);

// set chart xAxis
const xAxis = d3
  .scaleTime()
  .domain([
    d3.min(gdpData, (d) => {
      return new Date(d[0]);
    }),
    d3.max(gdpData, (d) => {
      return new Date(d[0]);
    }),
  ])
  .range([padding, width - padding]);

// set chart yAxis
const yAxis = d3
  .scaleLinear()
  .domain([
    0,
    d3.max(gdpData, (d) => {
      return d[1];
    }),
  ])
  .range([height - padding, padding]);

// create chart
const svg = d3.select("svg");

svg.attr("width", width);
svg.attr("height", height);

// chart title
svg
  .append("text")
  .attr("id", "title")
  .attr("x", width / 2)
  .attr("y", 40)
  .style("fill", "#1e1e24")
  .style("font-size", "2rem")
  .style("text-anchor", "middle")
  .text("United States GDP´s");

svg
  .append("g")
  .attr("id", "x-axis")
  .call(d3.axisBottom(xAxis))
  .attr("transform", `translate(0, ${height - padding})`);

svg
  .append("g")
  .attr("id", "y-axis")
  .call(d3.axisLeft(yAxis))
  .attr("transform", `translate(${padding}, 0)`);

let tooltip = d3
  .select(".container")
  .append("div")
  .attr("id", "tooltip")
  .attr("style", "visibility:hidden;");

svg
  .selectAll("rect")
  .data(gdpData)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .style("fill", "#508AA8")
  .attr("width", (width - 2 * padding) / (gdpData.length * 2))
  .attr("data-date", (d) => {
    return d[0];
  })
  .attr("data-gdp", (d) => {
    return d[1];
  })
  .attr("height", (d) => {
    return yScale(d[1]);
  })
  .attr("x", (d, i) => {
    return xScale(i);
  })
  .attr("y", (d) => {
    return height - padding - yScale(d[1]);
  })
  .on("mouseover", (e) => {
    let date = e.target.__data__[0];
    let gdp = e.target.__data__[1];
    d3.select(e.target).style("fill", "#EF767A");
    tooltip
      .attr("data-date", `${date}`)
      .attr("data-gdp", `${gdp}`)
      .attr(
        "style",
        `left:${e.pageX + 10}px;top:${e.pageY}px;visibility:visible;`
      )
      .html(`${date}<br/> ${gdp}`);
  })
  .on("mouseout", (e) => {
    d3.select(e.target).style("fill", "#508AA8");
    return tooltip.style("visibility", "hidden");
  });
