const dataUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

// fetch data
const fetchData = async (url) => {
  const response = await fetch(url);
  return await response.json();
};

// chart function
const treeMap = (data) => {
  // canvas variables
  const chart = {
    title: "Movie Sales",
    description: "Top 100 Highest Grossing Movies Grouped By Genre",
    width: 1000,
    height: 700,
    legendWidth: 1000,
    legendHeight: 80,
  };

  // create container
  const container = d3
    .select("body")
    .append("div")
    .attr("id", "container")
    .attr(
      "style",
      "height:100vh;display:flex;flex-direction:column;justify-content: flex-start;align-items:center;justify-content:center;"
    );

  // chart tittle
  container
    .append("text")
    .attr("id", "title")
    .style("font-size", "2rem")
    .style("text-anchor", "middle")
    .text(chart.title);

  // chart subtitle
  container
    .append("text")
    .attr("id", "description")
    .style("font-size", "1.2rem")
    .style("text-anchor", "middle")
    .style("padding", "5px")
    .text(chart.description);

  // create svg
  const svg = d3
    .select("#container")
    .append("svg")
    .attr("id", "canvas")
    .attr("width", chart.width)
    .attr("height", chart.height);

  // movie hierarchy
  const moviesHierarchy = d3
    .hierarchy(data, (d) => d.children)
    .sum((d) => d.value)
    .sort((d1, d2) => {
      return d2.value - d1.value;
    });

  // movie chart tree
  const chartTree = d3
    .treemap()
    .size([1000, 589.5])
    .paddingInner(1)
    .paddingOuter(0.5)(moviesHierarchy);

  // set colour scale
  const colorScale = d3.scaleOrdinal(d3.schemePastel2);

  // set tooltip
  let tooltip = d3
    .select("#container")
    .append("div")
    .attr("id", "tooltip")
    .attr("style", "visibility:hidden;");

  // chart tile blocks
  const tileBlocks = svg
    .selectAll("g")
    .data(moviesHierarchy.leaves())
    .enter()
    .append("g")
    .attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

  // chart tiles
  tileBlocks
    .append("rect")
    .attr("class", "tile")
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("fill", (d) => colorScale(d.data.category))
    .on("mouseover", (e, d) => {
      tooltip
        .attr(
          "style",
          `position:absolute;left:${e.pageX + 10}px;top:${
            e.pageY
          }px;visibility:visible;`
        )
        .attr("data-value", d.data.value)
        .html(
          `${d.data.name} - ${d.data.category}<br/> $ ${d.data.value.replace(
            /(\d)(?=(\d{3})+$)/g,
            "$1,"
          )}`
        );
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });

  // tile text
  tileBlocks
    .append("text")
    .attr("class", "tile-text")
    .text((d) => d.data.name)
    .attr("x", 5)
    .attr("y", 25)
    .style("font-size", "0.8rem");

  // set legend
  const legendSvg = d3
    .select("#container")
    .append("svg")
    .attr("id", "legend")
    .attr("width", chart.legendWidth)
    .attr("height", chart.legendHeight);

  // movie categories
  const movieCategories = moviesHierarchy.children.map((d) => d.data.name);

  // legend color-label
  legendSvg
    .selectAll("rect")
    .data(movieCategories)
    .enter()
    .append("rect")
    .attr("class", "legend-item")
    .attr("x", (d, i) => {
      return (i * chart.legendWidth) / movieCategories.length;
    })
    .attr("y", 23)
    .attr("width", 15)
    .attr("height", 15)
    .attr("fill", (d) => {
      return colorScale(d);
    });

  // legend text
  legendSvg
    .selectAll("text")
    .data(movieCategories)
    .enter()
    .append("text")
    .attr("class", "legend-text")
    .attr("x", (d, i) => {
      return (i * chart.legendWidth) / movieCategories.length + 20;
    })
    .attr("y", 35)
    .style("font-size", "0.8rem")
    .text((d) => d);
};

fetchData(dataUrl).then((data) => treeMap(data));
