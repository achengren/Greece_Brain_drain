Promise.all([
  d3.json("data/processed/country_field_specialization.json"),
  d3.json("data/processed/country_field_diversity.json"),
  d3.json("data/processed/country_field_portfolio_metadata.json")
]).then(([specialization, diversity, metadata]) => {
  console.log("Specialization data:", specialization);
  console.log("Diversity data:", diversity);
  console.log("Metadata:", metadata);

  d3.select("#status")
    .append("div")
    .attr("class", "status")
    .html(`
      <strong>Data loaded successfully.</strong><br>
      Specialization records: ${specialization.length}<br>
      Diversity records: ${diversity.length}<br>
      Diaspora scientists included: ${metadata.overall_diaspora_total}<br>
      Minimum cell size for reliable interpretation: ${metadata.min_cell_n}
    `);

  d3.select("#heatmap")
    .append("p")
    .text("Heatmap will be drawn here after data loading is confirmed.");

  d3.select("#diversity")
    .append("p")
    .text("Diversity scatter plot will be drawn here after data loading is confirmed.");
}).catch(error => {
  console.error("Error loading Section 6 data:", error);

  d3.select("#status")
    .append("div")
    .style("padding", "12px 16px")
    .style("background", "#fdeeee")
    .style("border", "1px solid #e0aaaa")
    .style("color", "#7a1f1f")
    .style("border-radius", "6px")
    .html(`
      <strong>Data loading failed.</strong><br>
      Check the browser console for details.
    `);
});