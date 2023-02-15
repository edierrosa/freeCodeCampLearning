const dataUrls = [
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json",
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json",
];

// fetch data
const fetchData = async (url) => {
  const response = await fetch(url);
  return await response.json();
};

// chart function
const choroplethMap = (data) => {
  const educationData = data[0];
  const countyData = data[1];

  // canvas variables
  const chart = {
    title: "United States Educational Attainment",
    description:
      "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)",
    source: "USDA Economic Research Service",
    sourceLink:
      "https://www.ers.usda.gov/data-products/county-level-data-sets/county-level-data-sets-download-data/",
    width: 1000,
    height: 600,
    padding: 90,
    legendY: 40,
    legendX: 650,
    legendWidth: 25,
  };

  // create container
  const container = d3
    .select("body")
    .append("div")
    .attr("id", "container")
    .attr(
      "style",
      "height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;"
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
    .text(chart.description);

  // chart subtitle
  container
    .append("div")
    .attr("id", "source")
    .html(`<p>Source: <a href=${chart.sourceLink}>${chart.source}</a></p>`);

  // create svg
  const svg = d3
    .select("#container")
    .append("svg")
    .attr("id", "canvas")
    .attr("width", chart.width)
    .attr("height", chart.height);

  // bin data
  const bin = d3.bin().thresholds(7);
  const values = educationData.map((d) => {
    return d.bachelorsOrHigher;
  });
  const binValues = bin(values);

  // set colour scale
  const colorScale = d3.scaleSequential(d3.interpolateYlGnBu).domain([
    d3.min(educationData, (d) => {
      return d.bachelorsOrHigher;
    }),
    d3.max(educationData, (d) => {
      return d.bachelorsOrHigher;
    }),
  ]);

  // set tooltip
  let tooltip = d3
    .select("#container")
    .append("div")
    .attr("id", "tooltip")
    .attr("style", "visibility:hidden;");

  // chart counties
  svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(countyData, countyData.objects.counties).features)
    .enter()
    .append("path")
    .attr("class", "county")
    .attr("data-fips", (d) => d.id)
    .attr("data-education", (d) => {
      return educationData.find((county) => {
        return county.fips === d.id;
      }).bachelorsOrHigher;
    })
    .attr("d", d3.geoPath())
    .attr("fill", (d) => {
      return colorScale(
        educationData.find((county) => {
          return county.fips === d.id;
        }).bachelorsOrHigher
      );
    })
    .on("mouseover", (e, d) => {
      let county = educationData.find((county) => {
        return county.fips === d.id;
      });
      tooltip
        .attr(
          "style",
          `position:absolute;left:${e.pageX + 10}px;top:${
            e.pageY
          }px;visibility:visible;`
        )
        .attr("data-education", county.bachelorsOrHigher)
        .html(
          `${county.area_name} - ${county.state}<br/>${county.bachelorsOrHigher}%`
        );
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });

  // legend color-label
  svg
    .append("g")
    .attr("id", "legend")
    .selectAll("rect")
    .data(binValues.filter((d) => d[0]))
    .enter()
    .append("rect")
    .attr("x", (d, i) => {
      return d[0] ? chart.legendX + i * chart.legendWidth : null;
    })
    .attr("y", chart.legendY)
    .attr("width", chart.legendWidth)
    .attr("height", 10)
    .attr("fill", (d) => {
      return colorScale(d[0]);
    });

  // set legend
  svg
    .append("g")
    .attr("id", "legend")
    .selectAll("text")
    .data(binValues.filter((d) => d[0]))
    .enter()
    .append("text")
    .attr("x", (d, i) => {
      return d[0] ? chart.legendX + i * chart.legendWidth : null;
    })
    .attr("y", chart.legendY - 4)
    .style("font-size", "0.8rem")
    .style("text-anchor", "middle")
    .text((d, i) => {
      return i > 0 ? Math.floor(d[0]) : null;
    });
};

Promise.all(
  dataUrls.map((url) => {
    return fetchData(url);
  })
).then((data) => choroplethMap(data));
