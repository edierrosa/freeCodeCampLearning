<<<<<<< HEAD
const dataUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

// fetch data
const response = await fetch(dataUrl);
const data = await response.json();

// canvas variables
const width = 800;
const height = 600;
const padding = 60;
const radius = 5;
const color = d3.scaleOrdinal(d3.schemeTableau10);
const legendX = width + 100;
const legendY = height / 2;

// create container
const container = d3
  .select("body")
  .append("div")
  .attr("id", "container")
  .attr(
    "style",
    "height:100vh;display:flex;align-items:center;justify-content:center;"
  );

// create svg
const svg = d3.select("#container").append("svg").attr("id", "canvas");

svg.attr("width", width);
svg.attr("height", height);

// chart tittle
svg
  .append("text")
  .attr("id", "title")
  .attr("x", width / 2)
  .attr("y", padding - 15)
  .style("fill", "#1e1e24")
  .style("font-size", "1.5rem")
  .style("text-anchor", "middle")
  .text("Doping in Professional Bicycle Racing");
=======
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
>>>>>>> 3f2e69a4cfddc22853d8e823e40c0c30b97543fa

// set chart xScale
const xScale = d3
  .scaleLinear()
<<<<<<< HEAD
  .domain([
    d3.min(data, (d) => {
      return d.Year;
    }) - 1,
    d3.max(data, (d) => {
      return d.Year;
    }) + 1,
  ])
  .range([padding, width - padding]);

// set chart yScale
const yScale = d3
  .scaleTime()
  .domain([
    d3.min(data, (d) => {
      return new Date(d.Seconds * 1000);
    }),
    d3.max(data, (d) => {
      return new Date(d.Seconds * 1000);
    }),
  ])
  .range([padding, height - padding]);

// set x-axis
svg
  .append("g")
  .call(d3.axisBottom(xScale).tickFormat(d3.format("d")))
  .attr("id", "x-axis")
  .attr("transform", `translate(0, ${height - padding})`);

// set y-axis
svg
  .append("g")
  .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S")))
  .attr("id", "y-axis")
  .attr("transform", `translate(${padding}, 0)`);

// set y-label
svg
  .append("text")
  .attr("class", "y-label")
  .style("text-anchor", "middle")
  .attr("x", 0 - height / 2)
  .attr("y", 5)
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .text("Time (minutes)");

// set x-label
svg
  .append("text")
  .attr("class", "x-label")
  .style("text-anchor", "middle")
  .attr("x", width / 2)
  .attr("y", height - 20)
  .text("Year");

// set tooltip
=======
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

>>>>>>> 3f2e69a4cfddc22853d8e823e40c0c30b97543fa
let tooltip = d3
  .select(".container")
  .append("div")
  .attr("id", "tooltip")
  .attr("style", "visibility:hidden;");

<<<<<<< HEAD
// set chart dots
svg
  .selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "dot")
  .attr("r", radius)
  .attr("data-xvalue", (d) => {
    return d.Year;
  })
  .attr("data-yvalue", (d) => {
    return new Date(d.Seconds * 1000);
  })
  .attr("cx", (d) => {
    return xScale(d.Year);
  })
  .attr("cy", (d) => {
    return yScale(new Date(d.Seconds * 1000));
  })
  .attr("fill", (d) => {
    return color(d.Doping != "");
  })
  .on("mouseover", (e, d) => {
    tooltip
      .attr(
        "style",
        `position:absolute;left:${e.pageX + 10}px;top:${
          e.pageY
        }px;visibility:visible;`
      )
      .attr("data-year", d.Year)
      .html(
        `${d.Name}, ${d.Nationality}<br/>Year: ${d.Year}, Time: ${d.Time}<br/>${d.Doping}`
      );
  })
  .on("mouseout", () => {
    tooltip.style("visibility", "hidden");
  });

// set legend
container
  .append("div")
  .attr("id", "legend")
  .attr(
    "style",
    `display:flex;flex-direction:column;position:absolute;left:${legendX}px;top:${legendY}px`
  );

d3.map(color.domain(), (d, i, n) => {
  d3.select("#legend")
    .append("div")
    .attr("class", "legend-label")
    .attr("style", "display:flex;justify-content:right;")
    .html(
      `<p>${
        n[i] ? "Riders with doping allegations" : "No doping allegations"
      }</p><div class="legend-color" style="height:20px;width:20px;margin:3px;background-color:${color(
        d
      )}"></div>`
    );
});
=======
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
>>>>>>> 3f2e69a4cfddc22853d8e823e40c0c30b97543fa
