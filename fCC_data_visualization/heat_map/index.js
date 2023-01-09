const dataUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

// fetch data
const response = await fetch(dataUrl);
const data = await response.json();
const { baseTemperature: baseTemp, monthlyVariance: monthVar } = data;
console.log(baseTemp, monthVar);

// canvas variables
const chart = {
  title: "Monthly Global Land-Surface Temperature",
  description: `${monthVar[0].year} - ${
    monthVar[monthVar.length - 1].year
  }: base temperature: ${baseTemp}`,
  monthVarMax: d3.max(monthVar, (d) => {
    return baseTemp + d.variance;
  }),
  monthVarMin: d3.min(monthVar, (d) => {
    return baseTemp + d.variance;
  }),
  width: 1500,
  height: 600,
  padding: 90,
  yLabel: "Months",
  xLabel: "Years",
};

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
const svg = d3
  .select("#container")
  .append("svg")
  .attr("id", "canvas")
  .attr("width", chart.width)
  .attr("height", chart.height);
// .style("background-color", "gray");

// chart tittle
svg
  .append("text")
  .attr("id", "title")
  .attr("x", chart.width / 2)
  .attr("y", chart.padding - 40)
  .style("font-size", "1.5rem")
  .style("text-anchor", "middle")
  .text(chart.title);

// chart subtitle
svg
  .append("text")
  .attr("id", "description")
  .attr("x", chart.width / 2)
  .attr("y", chart.padding - 10)
  .style("font-size", "1.25rem")
  .style("text-anchor", "middle")
  .text(chart.description);

// set chart xScale
const xScale = d3
  .scaleBand()
  .domain(
    monthVar.map((d) => {
      return d.year;
    })
  )
  .range([chart.padding, chart.width - chart.padding]);

// set x-axis
svg
  .append("g")
  .call(
    d3.axisBottom(xScale).tickValues(
      xScale.domain().filter((d) => {
        return d % 10 === 0;
      })
    )
  )
  .attr("id", "x-axis")
  .attr("transform", `translate(0, ${chart.height - chart.padding})`);

// set x-label
svg
  .append("text")
  .attr("class", "x-label")
  .style("text-anchor", "middle")
  .attr("x", chart.width / 2)
  .attr("y", chart.height - chart.padding / 4)
  .text(chart.xLabel);

// set chart yScale
const yScale = d3
  .scaleBand()
  .domain([
    ...Array(12)
      .fill(0)
      .map((v, i) => new Date(0, i, 1)),
  ])
  .range([chart.padding, chart.height - chart.padding]);

// set y-axis
svg
  .append("g")
  .call(d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B")))
  .attr("id", "y-axis")
  .attr("transform", `translate(${chart.padding}, 0)`);

// set y-label
svg
  .append("text")
  .attr("class", "y-label")
  .style("text-anchor", "middle")
  .attr("x", 0 - chart.height / 2)
  .attr("y", chart.padding / 4)
  .attr("dy", ".75em")
  .attr("transform", "rotate(-90)")
  .text(chart.yLabel);

// set colour scale
const colorScale = d3.scaleSequential(d3.interpolateSpectral).domain([
  d3.max(monthVar, (d) => {
    return d.variance;
  }),
  d3.min(monthVar, (d) => {
    return d.variance;
  }),
]);

// set tooltip
let tooltip = d3
  .select("#container")
  .append("div")
  .attr("id", "tooltip")
  .attr("style", "visibility:hidden;");

// set chart cells
svg
  .selectAll("rect")
  .data(monthVar)
  .enter()
  .append("rect")
  .attr("class", "cell")
  .attr("data-year", (d) => {
    return d.year;
  })
  .attr("data-month", (d) => {
    return d.month - 1;
  })
  .attr("data-temp", (d) => {
    return baseTemp + d.variance;
  })
  // .attr("height", (chart.height - 2 * chart.padding) / yScale.domain().length)
  .attr("height", (d) => {
    return yScale.bandwidth(d.month);
  })
  .attr("y", (d) => {
    return yScale(new Date(0, d.month - 1, 1));
  })
  // .attr("width", (chart.width - 2 * chart.padding) / xScale.domain().length)
  .attr("width", (d) => {
    return xScale.bandwidth(d.year);
  })
  .attr("x", (d) => {
    return xScale(d.year);
  })
  .attr("fill", (d) => {
    return colorScale(d.variance);
  })
  .on("mouseover", (e, d) => {
    let date = new Date(d.year, d.month);
    tooltip
      .attr(
        "style",
        `position:absolute;left:${e.pageX + 10}px;top:${
          e.pageY
        }px;visibility:visible;`
      )
      .attr("data-year", d.year)
      .html(
        `${d3.utcFormat("%Y - %B")(date)}<br/>${d3.format(".1f")(
          baseTemp + d.variance
        )}&#8451<br/>${d3.format("+.1f")(d.variance)}&#8451`
      );
  })
  .on("mouseout", () => {
    tooltip.style("visibility", "hidden");
  });

// legend ticks
const legendTicks = d3.ticks(chart.monthVarMin, chart.monthVarMax, 12);

// legend color scale
const legendColors = d3
  .scaleSequential(d3.interpolateSpectral)
  .domain([d3.max(legendTicks), d3.min(legendTicks)]);

// legend x-scale
const legendXScale = d3
  .scaleLinear()
  .domain([d3.min(legendTicks), d3.max(legendTicks) + 1])
  .range([chart.padding, legendTicks.length * 30]);

// legend x-axis
svg
  .append("g")
  .call(d3.axisBottom(legendXScale))
  .attr("id", "legend-xaxis")
  .attr("transform", `translate(0, ${chart.height - chart.padding / 4})`);

// legend color-label
svg
  .append("g")
  .attr("id", "legend")
  .selectAll("rect")
  .data(legendTicks)
  .enter()
  .append("rect")
  .attr("x", (d) => legendXScale(d))
  .attr("y", chart.height - chart.padding / 4 - 30)
  .attr("width", (legendTicks.length * 30 - chart.padding) / legendTicks.length)
  .attr("height", 30)
  .attr("fill", (d) => legendColors(d));
