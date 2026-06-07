// =========================
// Section 6 entrance tabs
// =========================

function initSection6Tabs() {
  const textPages = {
    map: [
      {
        readingTitle: "",
        title: "全球承接结构：被哪些国家和学科体系吸收？",
        subtitle: "",
        body: `
          <p>
            前面已经讨论了希腊科学家在海外的数量和影响力。第七部分换一个角度：这些科学家离开希腊之后，进入了怎样的全球承接网络？
          </p>
          <p>
            如果只看总人数，我们只能知道美国、英国等国家承接了很多希腊科学家；但把国家和学科放在一起看，会发现不同国家吸收的人才类型并不相同。有些国家覆盖面很广，有些国家则集中在少数几个学科上。
          </p>
        `,
        reading: "",
        connection: ""
      },
      {
        readingTitle: "阅读指南",
        title: "全球承接结构：被哪些国家和学科体系吸收？",
        subtitle: "",
        body: `
          <p>
            第一张图展示希腊科学家的海外承接网络。整体来看，这种分布不是平均铺开的，而是集中在少数主要国家。美国、英国、德国、塞浦路斯、澳大利亚、加拿大等国家占据了重要位置。
          </p>
          <p>
            欧洲局部图说明，欧洲内部也不是一个整体。英国、德国、法国等国家各自构成节点。其中塞浦路斯尤其值得注意，它提示我们：希腊科学家的海外承接不只和大型科研中心有关，也可能和地理接近、区域联系、语言文化背景有关。
          </p>
          <p>
            这张图还可以按学科筛选。切换学科后，国家颜色和连线强度会变化，说明不同学科的希腊科学家并不一定流向同一批国家。
          </p>
        `,
        reading: `
          <li><strong>连线颜色：</strong>表示该国在当前学科中的相对集中程度，不只是人数多少。</li>
          <li><strong>欧洲局部地图：</strong>重点看英国、德国、法国、瑞士、荷兰、塞浦路斯等欧洲节点之间的差异。</li>
          <li><strong>学科筛选：</strong>用来比较不同学科是否形成不同的海外路径。</li>
        `,
        connection: ""
      }
    ],
    matrix: [
      {
        readingTitle: "阅读指南",
        title: "全球承接结构：被哪些国家和学科体系吸收？",
        subtitle: "",
        body: `
          <p>
            只看地图我们很难了解这些国家承接的学科结构。于是第二张图便把国家和学科放在同一个矩阵里，用来观察不同国家到底吸收了哪些类型的希腊科学家。
          </p>
          <p>
            从图中可以看出，临床医学是许多国家中最主要的学科之一，信息通信、工程、物理与天文等也占有重要位置。但不同国家的组合方式并不相同。美国和英国规模大、覆盖广；德国、法国、瑞士在物理与天文方向更突出；荷兰在战略技术和信息通信方向更明显；塞浦路斯除了临床医学外，在社会科学、信息通信、工程等方向也有较强存在。
          </p>
          <p>
            这张图的重点不是比较哪个国家人数最多，而是看“国家—学科”的匹配关系。有些国家人数多，是因为多个学科都有积累；有些国家总人数没那么大，但在某些学科上更集中。
          </p>
        `,
        reading: `
          <li><strong>气泡大小 + 颜色要一起看：</strong>大气泡代表人数多，深色代表该学科在该国更有结构性特点。</li>
          <li><strong>SI：</strong>可以理解为“该学科在这个国家内部的占比 ÷ 该学科在整体中的占比”。SI 大于 1，说明这个国家在该学科上相对更集中。</li>
          <li><strong>log2(SI)：</strong>是把 SI 转成更容易比较的颜色值。大于 0 偏红，表示高于整体平均；小于 0 偏蓝，表示低于整体平均。</li>
          <li><strong>灰色格子：</strong>样本量较小，适合参考，不适合过度解释。</li>
        `,
        connection: ""
      }
    ],
    role: [
      {
        readingTitle: "阅读指南",
        title: "全球承接结构：被哪些国家和学科体系吸收？",
        subtitle: "",
        body: `
          <p>
            第三张图把前两张图的信息压缩成“国家角色”。每个国家都是一个点，用来比较它们在整个承接网络中的位置。
          </p>
          <p>
            美国和英国承接规模较大，更接近大型综合承接中心。它们不仅人数多，学科覆盖也比较广。塞浦路斯、法国、荷兰等国家虽然规模不如美国和英国，但学科多样性较高，说明它们的承接结构比较分散。澳大利亚、意大利、德国等国家的第一大学科占比较高，说明它们更依赖某些主导学科。
          </p>
          <p>
            下方的国家画像卡片可以查看具体国家的内部结构，包括人数、学科多样性、第一大学科、前三大学科占比，以及最突出的专业化学科。
          </p>
          <p>
            这张图的作用是收束第七部分：不同国家在希腊科学家的全球网络中并不只是人数多少的区别，而是扮演了不同角色。
          </p>
        `,
        reading: `
          <li><strong>位置比单个数值更重要：</strong>右上更像大型综合中心，右下更像规模较大的专业化节点。</li>
          <li><strong>学科多样性：</strong>用来表示一个国家的学科分布是否分散。越高说明学科越均衡、越综合；越低说明更集中在少数领域。</li>
          <li><strong>圆点大小：</strong>点越大，说明该国越依赖某个主导学科。</li>
          <li><strong>SI：</strong>国家画像中的 SI 用来判断某个学科在该国是否相对突出。SI 大于 1 表示该学科在该国占比高于整体平均。</li>
          <li><strong>国家画像卡片：</strong>用来补充解释某个国家为什么会落在图中的那个位置。</li>
        `,
        connection: ""
      }
    ]
  };

  const tabs = Array.from(document.querySelectorAll("[data-section6-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-section6-panel]"));

  const title = document.getElementById("section6-left-title");
  const subtitle = document.getElementById("section6-left-subtitle");
  const body = document.getElementById("section6-left-body");
  const readingTitle = document.getElementById("section6-reading-title");
  const reading = document.getElementById("section6-left-reading");
  const readingBox = document.querySelector(".section6-reading-box");
  const connection = document.getElementById("section6-left-connection");
  const pager = document.getElementById("section6-copy-pager");
  const prevBtn = document.getElementById("section6-copy-prev");
  const nextBtn = document.getElementById("section6-copy-next");
  const pageLabel = document.getElementById("section6-copy-page-label");

  let currentView = "map";
  let currentPage = 0;

  function renderText() {
    const pages = textPages[currentView] || textPages.map;
    const item = pages[currentPage] || pages[0];

    if (title) title.textContent = item.title;
    if (subtitle) {
      subtitle.textContent = item.subtitle || "";
      subtitle.style.display = item.subtitle ? "" : "none";
    }
    if (body) body.innerHTML = item.body;
    if (readingTitle) readingTitle.textContent = item.readingTitle || "阅读指南";
    if (reading) reading.innerHTML = item.reading || "";
    if (readingBox) readingBox.style.display = item.reading ? "" : "none";
    if (connection) {
      connection.textContent = item.connection || "";
      connection.style.display = item.connection ? "" : "none";
    }

    const showPager = currentView === "map" && pages.length > 1;
    if (pager) pager.style.display = showPager ? "flex" : "none";
    if (pageLabel) pageLabel.textContent = `${currentPage + 1} / ${pages.length}`;
    if (prevBtn) prevBtn.disabled = currentPage === 0;
    if (nextBtn) nextBtn.disabled = currentPage === pages.length - 1;
  }

  function activate(view) {
    currentView = view;
    currentPage = 0;

    tabs.forEach(tab => {
      const active = tab.dataset.section6Tab === view;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    });

    panels.forEach(panel => {
      panel.classList.toggle("active", panel.dataset.section6Panel === view);
    });

    renderText();
  }

  tabs.forEach(tab => {
    tab.addEventListener("click", () => activate(tab.dataset.section6Tab));
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentPage > 0) {
        currentPage -= 1;
        renderText();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const pages = textPages[currentView] || textPages.map;
      if (currentPage < pages.length - 1) {
        currentPage += 1;
        renderText();
      }
    });
  }

  activate("map");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSection6Tabs);
} else {
  initSection6Tabs();
}


/* Section 6 visualization: heatmap + scatter/card + zoomable flow map */

Promise.all([
  d3.json("data/processed/country_field_specialization.json?v=section7_text_metrics_explained_001"),
  d3.json("data/processed/country_field_diversity.json?v=section7_text_metrics_explained_001"),
  d3.json("data/processed/country_field_portfolio_metadata.json?v=section7_text_metrics_explained_001")
]).then(([specialization, diversity, metadata]) => {
  const cleanSpecialization = specialization.map(d => ({
    ...d,
    cntry: String(d.cntry).trim().toLowerCase(),
    "sm-field": String(d["sm-field"]).trim()
  }));

  const cleanDiversity = diversity.map(d => ({
    ...d,
    cntry: String(d.cntry).trim().toLowerCase(),
    total: +d.total,
    field_diversity: +d.field_diversity
  }));

  const hasGreeceInSpecialization = cleanSpecialization.some(d => d.cntry === "grc");
  const hasGreeceInDiversity = cleanDiversity.some(d => d.cntry === "grc");
  const hasGreeceInMetadata = metadata.top_countries && metadata.top_countries.includes("grc");

  const includedTotal =
    metadata.total_scientists_included ||
    metadata.overall_diaspora_total ||
    "未知";

  // Data status panel intentionally hidden in the final integrated layout.

  drawBubbleHeatmap(cleanSpecialization);
  drawDiversityScatter(cleanDiversity, cleanSpecialization);
  drawFieldFlowMap(cleanSpecialization);
}).catch(error => {
  console.error("第六部分数据读取失败：", error);
  d3.select("#status")
    .append("div")
    .attr("class", "error")
    .html(`<strong>数据读取失败。</strong><br>请检查浏览器 Console 报错信息。`);
});


function drawBubbleHeatmap(data) {
  d3.select("#heatmap").selectAll("*").remove();

  const formatCountry = code => getCountryNameMap()[code] || String(code).toUpperCase();
  const formatField = field => getFieldNameMap()[field] || field;
  const tooltip = d3.select("#tooltip");

  const hasGreece = data.some(d => d.cntry === "grc");

  const countryTotals = d3.rollups(
    data,
    rows => d3.max(rows, d => +d.country_total || 0),
    d => d.cntry
  )
    .map(([cntry, total]) => ({ cntry, total }))
    .filter(d => d.cntry !== "grc")
    .sort((a, b) => d3.descending(a.total, b.total))
    .map(d => d.cntry);

  const countries = hasGreece
    ? ["grc", ...countryTotals].slice(0, 10)
    : countryTotals.slice(0, 10);

  const fields = d3.rollups(
    data,
    rows => d3.max(rows, d => +d.field_total || 0),
    d => d["sm-field"]
  )
    .map(([field, total]) => ({ field, total }))
    .sort((a, b) => d3.descending(a.total, b.total))
    .slice(0, 10)
    .map(d => d.field);

  const mainData = data.filter(d => countries.includes(d.cntry) && fields.includes(d["sm-field"]));

  const margin = { top: 60, right: 30, bottom: 96, left: 108 };
  const cellW = 80;
  const cellH = 48;
  const width = margin.left + margin.right + fields.length * cellW;
  const height = margin.top + margin.bottom + countries.length * cellH;

  const svg = d3.select("#heatmap")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMinYMin meet");

  const x = d3.scaleBand()
    .domain(fields)
    .range([margin.left, margin.left + fields.length * cellW])
    .paddingInner(0.16)
    .paddingOuter(0.04);

  const y = d3.scaleBand()
    .domain(countries)
    .range([margin.top, margin.top + countries.length * cellH])
    .paddingInner(0.18)
    .paddingOuter(0.04);

  const maxN = d3.max(mainData, d => +d.n || 0);
  const radiusReferenceN = d3.quantile(
    mainData.map(d => +d.n || 0).sort(d3.ascending),
    0.90
  ) || maxN;

  // 使用 90% 分位数作为半径上限，并开启 clamp。
  // 这样可以避免少数超大国家把其他气泡都压得太小，从而让中等差异更明显。
  const r = d3.scaleSqrt()
    .domain([0, radiusReferenceN])
    .range([3.5, Math.min(cellW, cellH) * 0.46])
    .clamp(true);

  const COLOR_MIN = -1.5;
  const COLOR_MAX = 1.5;
  const color = d3.scaleDiverging()
    .domain([COLOR_MIN, 0, COLOR_MAX])
    .interpolator(d3.interpolateRgbBasis(["#2166ac", "#f7f7f7", "#b2182b"]));

  svg.append("g")
    .selectAll("rect")
    .data(crossJoin(countries, fields))
    .join("rect")
    .attr("class", d => `heatmap-cell heatmap-country-${safeClass(d.country)}`)
    .attr("x", d => d.country === "grc" ? x(d.field) - 3 : x(d.field))
    .attr("y", d => d.country === "grc" ? y(d.country) - 4 : y(d.country))
    .attr("width", d => d.country === "grc" ? x.bandwidth() + 6 : x.bandwidth())
    .attr("height", d => d.country === "grc" ? y.bandwidth() + 8 : y.bandwidth())
    .attr("rx", d => d.country === "grc" ? 8 : 6)
    .attr("ry", d => d.country === "grc" ? 8 : 6)
    .attr("fill", d => d.country === "grc" ? "rgba(255, 229, 168, 0.45)" : "#f3efe8")
    .attr("stroke", d => d.country === "grc" ? "rgba(198, 151, 54, 0.55)" : "#e6ded2")
    .attr("stroke-width", d => d.country === "grc" ? 1.1 : 0.8);

  svg.append("g")
    .selectAll("circle")
    .data(mainData)
    .join("circle")
    .attr("class", d => `heatmap-bubble heatmap-country-${safeClass(d.cntry)}`)
    .attr("cx", d => x(d["sm-field"]) + x.bandwidth() / 2)
    .attr("cy", d => y(d.cntry) + y.bandwidth() / 2)
    .attr("r", d => r(+d.n || 0))
    .attr("fill", d => d.reliable ? color(clamp(+d.log2_si, COLOR_MIN, COLOR_MAX)) : "#bfb8ae")
    .attr("stroke", d => d.reliable ? "rgba(60,40,35,0.7)" : "#888")
    .attr("stroke-width", d => d.cntry === "grc" ? 1.3 : 0.75)
    .attr("opacity", d => d.reliable ? 0.95 : 0.42)
    .on("mousemove", function(event, d) {
      highlightCountry(d.cntry);

      tooltip
        .style("opacity", 1)
        .style("left", `${event.clientX + 12}px`)
        .style("top", `${event.clientY + 12}px`)
        .html(`
          <strong>${formatCountry(d.cntry)} × ${formatField(d["sm-field"])}</strong><br>
          科学家人数：<strong>${d.n}</strong><br>
          该学科在该国中的占比：${d3.format(".1%")(d.share_in_country)}<br>
          该学科在总体中的占比：${d3.format(".1%")(d.share_overall)}<br>
          SI：${d3.format(".2f")(d.specialization_index)}<br>
          log2(SI)：${d3.format(".2f")(d.log2_si)}
        `);
    })
    .on("mouseleave", function() {
      resetHighlight();
      tooltip.style("opacity", 0);
    });

  svg.append("g")
    .selectAll("text")
    .data(countries)
    .join("text")
    .attr("class", d => `heatmap-country-label heatmap-country-${safeClass(d)}`)
    .attr("x", margin.left - 14)
    .attr("y", d => y(d) + y.bandwidth() / 2)
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "middle")
    .attr("font-size", 13)
    .attr("font-weight", d => d === "grc" ? 700 : 400)
    .attr("fill", d => d === "grc" ? "#a51c30" : "#2a2928")
    .text(d => formatCountry(d));

  svg.append("g")
    .selectAll("text")
    .data(fields)
    .join("text")
    .attr("x", d => x(d) + x.bandwidth() / 2)
    .attr("y", margin.top + countries.length * cellH + 26)
    .attr("text-anchor", "middle")
    .attr("font-size", 12)
    .attr("fill", "#2a2928")
    .text(d => formatField(d))
    .call(wrapText, x.bandwidth());

  svg.append("text")
    .attr("x", margin.left + fields.length * cellW / 2)
    .attr("y", height - 22)
    .attr("text-anchor", "middle")
    .attr("font-size", 13)
    .attr("font-weight", 600)
    .attr("fill", "#4a4038")
    .text("学科");

  svg.append("text")
    .attr("x", -margin.top - countries.length * cellH / 2)
    .attr("y", 24)
    .attr("text-anchor", "middle")
    .attr("font-size", 13)
    .attr("font-weight", 600)
    .attr("fill", "#4a4038")
    .attr("transform", "rotate(-90)")
    .text("希腊本土 / 海外目的地");

  drawHeatmapLegendRow(color, COLOR_MIN, COLOR_MAX, r, radiusReferenceN);
}


function drawDiversityScatter(diversityData, specializationData) {
  d3.select("#diversity").selectAll("*").remove();

  const formatCountry = code => getCountryNameMap()[code] || String(code).toUpperCase();
  const formatField = field => getFieldNameMap()[field] || field;
  const tooltip = d3.select("#tooltip");

  const specializationByCountry = d3.group(specializationData, d => d.cntry);

  const data = diversityData
    .map(d => {
      const topFields = Array.isArray(d.top_fields) ? d.top_fields : [];
      const topField = topFields.length > 0 ? topFields[0].field : "Unknown";
      const topFieldShare = topFields.length > 0 ? +topFields[0].share : 0;
      const specRows = specializationByCountry.get(d.cntry) || [];

      const mostSpecialized = specRows
        .filter(row => row.reliable && Number.isFinite(+row.log2_si))
        .sort((a, b) => d3.descending(+a.log2_si, +b.log2_si))
        .slice(0, 3)
        .map(row => ({
          field: row["sm-field"],
          log2_si: +row.log2_si,
          si: +row.specialization_index,
          n: +row.n
        }));

      return {
        ...d,
        cntry: String(d.cntry).trim().toLowerCase(),
        total: +d.total,
        field_diversity: +d.field_diversity,
        top_fields: topFields,
        top_field: topField,
        top_field_share: topFieldShare,
        most_specialized: mostSpecialized
      };
    })
    .filter(d => Number.isFinite(d.total) && Number.isFinite(d.field_diversity) && d.total > 0);

  populateCountrySelector(data, formatCountry, country => {
    const selected = data.find(d => d.cntry === country);
    if (selected) {
      updatePortfolioCard(selected, formatCountry, formatField);
      highlightCountry(country);
    } else {
      resetHighlight();
      updatePortfolioCard(null, formatCountry, formatField);
    }
  });

  d3.select("#reset-country-focus").on("click", () => {
    d3.select("#country-focus-select").property("value", "");
    resetHighlight();
    updatePortfolioCard(null, formatCountry, formatField);
  });

  d3.select("#toggle-labels").on("change", function() {
    d3.selectAll(".scatter-label").style("display", this.checked ? "block" : "none");
  });

  const margin = { top: 55, right: 42, bottom: 72, left: 82 };
  const width = 920;
  const height = 560;

  const svg = d3.select("#diversity")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMinYMin meet");

  const minTotal = d3.min(data, d => d.total);
  const maxTotal = d3.max(data, d => d.total);
  const minDiversity = d3.min(data, d => d.field_diversity);
  const maxDiversity = d3.max(data, d => d.field_diversity);

  const x = d3.scaleLog()
    .domain([Math.max(1, minTotal * 0.75), maxTotal * 1.35])
    .range([margin.left, width - margin.right])
    .nice();

  const y = d3.scaleLinear()
    .domain([Math.max(0, minDiversity - 0.04), Math.min(1, maxDiversity + 0.04)])
    .range([height - margin.bottom, margin.top])
    .nice();

  const medianTotal = d3.median(data, d => d.total);
  const medianDiversity = d3.median(data, d => d.field_diversity);

  const minTopFieldShare = d3.min(data, d => d.top_field_share) || 0;
  const maxTopFieldShare = d3.max(data, d => d.top_field_share) || 1;

  // 用实际最小值—最大值作为半径 domain，并扩大 range。
  // 这样第一大学科占比的差异会更明显。
  const radius = d3.scaleSqrt()
    .domain([minTopFieldShare, maxTopFieldShare])
    .range([7, 30])
    .clamp(true);

  const topFieldCategories = Array.from(new Set(data.map(d => d.top_field)));

  const fieldColorOverrides = {
    "Clinical Medicine": "#2f78a8",
    "Enabling & Strategic Technologies": "#d88a2d"
  };

  const fallbackFieldColor = d3.scaleOrdinal()
    .domain(topFieldCategories.filter(d => !fieldColorOverrides[d]))
    .range([
      "#a51c30", "#2a7f62", "#7f6d9a", "#b05a2a", "#6f8f3a",
      "#c68b2c", "#8c564b", "#3d7f8f", "#b55d8c", "#5b6f9e"
    ]);

  const fieldColor = field => fieldColorOverrides[field] || fallbackFieldColor(field);

  drawQuadrants(svg, x, y, medianTotal, medianDiversity, margin, width, height);

  svg.append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(6, "~s").tickSize(-(height - margin.top - margin.bottom)))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll("line").attr("stroke", "#eadfd3"))
    .call(g => g.selectAll("text").attr("font-size", 11).attr("fill", "#6b6258"));

  svg.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(y).ticks(6).tickSize(-(width - margin.left - margin.right)))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll("line").attr("stroke", "#eadfd3"))
    .call(g => g.selectAll("text").attr("font-size", 11).attr("fill", "#6b6258"));

  svg.append("line")
    .attr("x1", x(medianTotal))
    .attr("x2", x(medianTotal))
    .attr("y1", margin.top)
    .attr("y2", height - margin.bottom)
    .attr("stroke", "#9a8f82")
    .attr("stroke-dasharray", "5,5");

  svg.append("line")
    .attr("x1", margin.left)
    .attr("x2", width - margin.right)
    .attr("y1", y(medianDiversity))
    .attr("y2", y(medianDiversity))
    .attr("stroke", "#9a8f82")
    .attr("stroke-dasharray", "5,5");

  svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("class", d => `scatter-point scatter-country-${safeClass(d.cntry)}`)
    .attr("cx", d => x(d.total))
    .attr("cy", d => y(d.field_diversity))
    .attr("r", d => d.cntry === "grc" ? radius(d.top_field_share) + 3 : radius(d.top_field_share))
    .attr("fill", d => fieldColor(d.top_field))
    .attr("stroke", d => d.cntry === "grc" ? "#5b0b16" : "#fff")
    .attr("stroke-width", d => d.cntry === "grc" ? 2.5 : 1.2)
    .attr("opacity", 0.88)
    .on("mousemove", function(event, d) {
      highlightCountry(d.cntry);
      updatePortfolioCard(d, formatCountry, formatField);

      d3.select(this).attr("stroke", "#111").attr("stroke-width", 2.2);

      tooltip
        .style("opacity", 1)
        .style("left", `${event.clientX + 12}px`)
        .style("top", `${event.clientY + 12}px`)
        .html(`
          <strong>${formatCountry(d.cntry)}</strong><br>
          希腊科学家人数：${d3.format(",")(d.total)}<br>
          学科多样性指数：${d3.format(".3f")(d.field_diversity)}<br>
          第一大学科：${formatField(d.top_field)}（${d3.format(".1%")(d.top_field_share)}）
        `);
    })
    .on("mouseleave", function(event, d) {
      d3.select(this)
        .attr("stroke", d.cntry === "grc" ? "#5b0b16" : "#fff")
        .attr("stroke-width", d.cntry === "grc" ? 2.5 : 1.2);
      tooltip.style("opacity", 0);
      resetHighlight();
    })
    .on("click", function(event, d) {
      d3.select("#country-focus-select").property("value", d.cntry);
      highlightCountry(d.cntry);
      updatePortfolioCard(d, formatCountry, formatField);
    });

  const labelCountries = new Set(["grc", "usa", "gbr", "deu", "cyp", "aus", "can", "fra", "che", "nld"]);

  svg.append("g")
    .selectAll("text")
    .data(data.filter(d => labelCountries.has(d.cntry)))
    .join("text")
    .attr("class", d => `scatter-label scatter-country-${safeClass(d.cntry)}`)
    .attr("x", d => x(d.total) + 12)
    .attr("y", d => y(d.field_diversity) - 9)
    .attr("font-size", 11)
    .attr("font-weight", d => d.cntry === "grc" ? 700 : 500)
    .attr("fill", d => d.cntry === "grc" ? "#a51c30" : "#3d3833")
    .text(d => formatCountry(d.cntry));

  svg.append("text")
    .attr("x", margin.left + (width - margin.left - margin.right) / 2)
    .attr("y", height - 28)
    .attr("text-anchor", "middle")
    .attr("font-size", 13)
    .attr("font-weight", 600)
    .attr("fill", "#4a4038")
    .text("该国希腊科学家人数（log scale）");

  svg.append("text")
    .attr("x", -margin.top - (height - margin.top - margin.bottom) / 2)
    .attr("y", 28)
    .attr("text-anchor", "middle")
    .attr("font-size", 13)
    .attr("font-weight", 600)
    .attr("fill", "#4a4038")
    .attr("transform", "rotate(-90)")
    .text("学科多样性指数");

  drawDiversityLegendRow(topFieldCategories, fieldColor, formatField, radius);

  const defaultCountry = data.find(d => d.cntry === "grc") || data[0];
  updatePortfolioCard(defaultCountry, formatCountry, formatField);
}


function drawFieldFlowMap(specializationData) {
  d3.select("#flow-map").selectAll("*").remove();

  const formatCountry = code => getCountryNameMap()[code] || String(code).toUpperCase();
  const formatField = field => getFieldNameMap()[field] || field;
  const tooltip = d3.select("#tooltip");

  // Custom black cursors.
  // The default browser cursor is often white; these SVG data cursors make the map cursor black with a light outline.
  const BLACK_POINTER_CURSOR =
    'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'%3E%3Cpath d=\'M6 3 L6 27 L13 20 L18 30 L22 28 L17 18 L27 18 Z\' fill=\'%23000000\' stroke=\'%23ffffff\' stroke-width=\'2\' stroke-linejoin=\'round\'/%3E%3C/svg%3E") 6 3, pointer';

  const BLACK_GRAB_CURSOR =
    'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'%3E%3Cpath d=\'M10 14 V9 a3 3 0 0 1 6 0 v4 V8 a3 3 0 0 1 6 0 v6 V10 a3 3 0 0 1 6 0 v8 c0 7-5 11-11 11 h-2 c-5 0-9-4-9-10 v-2 a3 3 0 0 1 4-3 z\' fill=\'%23000000\' stroke=\'%23ffffff\' stroke-width=\'2\' stroke-linejoin=\'round\'/%3E%3C/svg%3E") 12 12, grab';

  const BLACK_GRABBING_CURSOR =
    'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'%3E%3Cpath d=\'M9 15 V9 a3 3 0 0 1 6 0 v5 V8 a3 3 0 0 1 6 0 v6 V11 a3 3 0 0 1 6 0 v8 c0 7-5 10-11 10 h-2 c-5 0-9-4-9-10 v-1 a3 3 0 0 1 4-3 z\' fill=\'%23000000\' stroke=\'%23ffffff\' stroke-width=\'2\' stroke-linejoin=\'round\'/%3E%3C/svg%3E") 12 12, grabbing';

  const countryCoords = {
    grc: [21.8243, 39.0742],
    usa: [-98.5795, 39.8283],
    gbr: [-3.4360, 55.3781],
    deu: [10.4515, 51.1657],
    cyp: [33.4299, 35.1264],
    aus: [133.7751, -25.2744],
    can: [-106.3468, 56.1304],
    fra: [2.2137, 46.2276],
    che: [8.2275, 46.8182],
    nld: [5.2913, 52.1326],
    ita: [12.5674, 41.8719],
    swe: [18.6435, 60.1282],
    esp: [-3.7492, 40.4637],
    bel: [4.4699, 50.5039],
    aut: [14.5501, 47.5162],
    dnk: [9.5018, 56.2639],
    nor: [8.4689, 60.4720],
    fin: [25.7482, 61.9241],
    irl: [-8.2439, 53.4129],
    isr: [34.8516, 31.0461],
    tur: [35.2433, 38.9637],
    chn: [104.1954, 35.8617],
    jpn: [138.2529, 36.2048],
    sgp: [103.8198, 1.3521],
    bra: [-51.9253, -14.2350],
    zaf: [22.9375, -30.5595]
  };

  const data = specializationData
    .map(d => ({
      ...d,
      cntry: String(d.cntry).trim().toLowerCase(),
      field: String(d["sm-field"]).trim(),
      n: +d.n,
      specialization_index: +d.specialization_index,
      log2_si: +d.log2_si
    }))
    .filter(d => d.cntry && d.field && Number.isFinite(d.n) && d.n > 0 && countryCoords[d.cntry]);

  function getGreeceCount(selectedField) {
    const rows = data.filter(d => {
      if (d.cntry !== "grc") return false;
      if (selectedField !== "__all__" && d.field !== selectedField) return false;
      return true;
    });

    return d3.sum(rows, d => d.n);
  }

  const fields = Array.from(new Set(data.map(d => d.field)))
    .sort((a, b) => d3.ascending(formatField(a), formatField(b)));

  const fieldSelect = d3.select("#flow-field-select");
  fieldSelect.selectAll("option.dynamic-field").remove();

  fields.forEach(field => {
    fieldSelect.append("option")
      .attr("class", "dynamic-field")
      .attr("value", field)
      .text(formatField(field));
  });

  const topNInput = d3.select("#flow-topn");
  const minCountInput = d3.select("#flow-min-count");
  const topNValue = d3.select("#flow-topn-value");
  const minCountValue = d3.select("#flow-min-count-value");

  const width = 760;
  const height = 520;

  const svg = d3.select("#flow-map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMinYMin meet")
    .style("cursor", BLACK_GRAB_CURSOR);

  const projection = d3.geoNaturalEarth1()
    .scale(132)
    // Move the world map upward after removing the internal title text,
    // so the map visually fills the upper chart area more naturally.
    .translate([width / 2, height / 2 - 18]);

  const path = d3.geoPath(projection);

  const gZoomRoot = svg.append("g").attr("class", "flow-zoom-root");
  const gMap = gZoomRoot.append("g").attr("class", "world-map-layer");
  const gLinks = gZoomRoot.append("g").attr("class", "flow-link-layer");
  const gCountryOverlay = gZoomRoot.append("g").attr("class", "flow-country-overlay-layer");
  const gNodes = gZoomRoot.append("g").attr("class", "flow-node-layer");
  const gLabels = gZoomRoot.append("g").attr("class", "flow-label-layer");

  const zoom = d3.zoom()
    .scaleExtent([1, 8])
    .translateExtent([[-width * 0.7, -height * 0.7], [width * 1.7, height * 1.7]])
    .on("start", () => svg.style("cursor", BLACK_GRABBING_CURSOR))
    .on("zoom", event => {
      gZoomRoot.attr("transform", event.transform);
    })
    .on("end", () => svg.style("cursor", BLACK_GRAB_CURSOR));

  svg.call(zoom);

  d3.select("#flow-zoom-in").on("click", () => {
    svg.transition().duration(350).call(zoom.scaleBy, 1.35);
  });

  d3.select("#flow-zoom-out").on("click", () => {
    svg.transition().duration(350).call(zoom.scaleBy, 1 / 1.35);
  });

  d3.select("#flow-zoom-reset").on("click", () => {
    svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
  });

  const greeceCoord = countryCoords.grc;
  const greeceProjected = projection(greeceCoord);

  const color = d3.scaleDiverging()
    .domain([-1.5, 0, 1.5])
    // Darker midpoint so average-SI links are still visible.
    .interpolator(d3.interpolateRgbBasis(["#0b4f8a", "#7b625f", "#9b1028"]));

  // 默认不显示任何国家标签。
  // 用户点击某个目标国家节点后，该国家的“国家名 + 人数”标签显示；
  // 再次点击同一节点则隐藏标签。
  const visibleFlowLabels = new Set();
  let latestCountryFlows = [];
  let countriesGeoCache = [];
  let latestSelectedField = "__all__";
  let latestLinkWidth = null;
  let latestNodeRadius = null;
  let latestOpacity = null;
  let latestColor = color;

  let worldLoaded = false;

  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(world => {
    const countriesGeo = topojson.feature(world, world.objects.countries).features;
    countriesGeo.forEach(feature => {
      feature.__countryCode = getFeatureCountryCode(feature);
    });
    countriesGeoCache = countriesGeo;

    gMap.selectAll("path")
      .data(countriesGeo)
      .join("path")
      .attr("d", path)
      .attr("fill", "#eee6dc")
      .attr("stroke", "#cabdab")
      .attr("stroke-width", 0.55)
      .attr("vector-effect", "non-scaling-stroke");

    worldLoaded = true;
    updateFlowMap();
  }).catch(error => {
    console.error("世界地图底图加载失败：", error);

    d3.select("#flow-map")
      .append("div")
      .attr("class", "warning")
      .html(`
        <strong>世界地图底图加载失败。</strong><br>
        这通常是网络或 CDN 问题。流向线和国家节点仍可以显示，但不会有地图背景。
      `);

    worldLoaded = true;
    updateFlowMap();
  });

  fieldSelect.on("change", updateFlowMap);
  topNInput.on("input", updateFlowMap);
  minCountInput.on("input", updateFlowMap);

  d3.select("#flow-reset").on("click", () => {
    fieldSelect.property("value", "__all__");
    topNInput.property("value", 12);
    minCountInput.property("value", 10);
    visibleFlowLabels.clear();
    renderFlowLabels();
    updateFlowNodeSelection();
    svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity);
    updateFlowMap();
  });

  function updateFlowMap() {
    if (!worldLoaded) return;

    const selectedField = fieldSelect.property("value");
    const topN = +topNInput.property("value");
    const minCount = +minCountInput.property("value");

    topNValue.text(topN);
    minCountValue.text(minCount);

    const filtered = data.filter(d => {
      if (d.cntry === "grc") return false;
      if (selectedField !== "__all__" && d.field !== selectedField) return false;
      return true;
    });

    let countryFlows;

    if (selectedField === "__all__") {
      countryFlows = Array.from(
        d3.rollup(
          filtered,
          rows => ({
            cntry: rows[0].cntry,
            n: d3.sum(rows, r => r.n),
            weighted_log2_si: d3.sum(rows, r => r.n * r.log2_si) / d3.sum(rows, r => r.n),
            top_field: d3.rollups(rows, v => d3.sum(v, r => r.n), r => r.field)
              .sort((a, b) => d3.descending(a[1], b[1]))[0][0]
          }),
          d => d.cntry
        ).values()
      );
    } else {
      countryFlows = Array.from(
        d3.rollup(
          filtered,
          rows => ({
            cntry: rows[0].cntry,
            n: d3.sum(rows, r => r.n),
            weighted_log2_si: d3.sum(rows, r => r.n * r.log2_si) / d3.sum(rows, r => r.n),
            top_field: selectedField,
            si: d3.sum(rows, r => r.n * r.specialization_index) / d3.sum(rows, r => r.n)
          }),
          d => d.cntry
        ).values()
      );
    }

    countryFlows = countryFlows
      .filter(d => countryCoords[d.cntry])
      .filter(d => d.n >= minCount)
      .sort((a, b) => d3.descending(a.n, b.n))
      .slice(0, topN)
      .map((d, i) => ({
        ...d,
        rank: i + 1,
        coord: countryCoords[d.cntry],
        projected: projection(countryCoords[d.cntry])
      }))
      .filter(d => d.projected);

    const maxN = d3.max(countryFlows, d => d.n) || 1;

    // Flow lines are now deliberately strengthened:
    // the country polygon color still shows volume, but links must remain clearly visible.
    const linkWidth = d3.scaleSqrt().domain([0, maxN]).range([0.75, 5.8]);
    const nodeRadius = d3.scaleSqrt().domain([0, maxN]).range([4, 18]);
    const opacity = d3.scaleSqrt().domain([0, maxN]).range([0.42, 0.88]);

    const countryFill = d3.scaleSequential()
      .domain([0, maxN])
      .interpolator(t => d3.interpolateRgb("#dcecf3", "#165a86")(Math.sqrt(t)));

    latestSelectedField = selectedField;
    latestLinkWidth = linkWidth;
    latestNodeRadius = nodeRadius;
    latestOpacity = opacity;
    latestColor = color;

    const flowLinkSelection = gLinks.selectAll("path")
      .data(countryFlows, d => d.cntry)
      .join(
        enter => enter.append("path")
          .attr("fill", "none")
          .attr("stroke-linecap", "round")
          .attr("stroke", d => color(clamp(d.weighted_log2_si, -1.5, 1.5)))
          .attr("stroke-width", d => linkWidth(d.n))
          .attr("opacity", d => opacity(d.n))
          .attr("vector-effect", "non-scaling-stroke")
          .style("mix-blend-mode", "normal")
          .attr("d", d => makeGeoCurve(greeceCoord, d.coord, projection)),
        update => update
          .transition()
          .duration(650)
          .attr("stroke", d => color(clamp(d.weighted_log2_si, -1.5, 1.5)))
          .attr("stroke-width", d => linkWidth(d.n))
          .attr("opacity", d => opacity(d.n))
          .attr("vector-effect", "non-scaling-stroke")
          .style("mix-blend-mode", "normal")
          .attr("d", d => makeGeoCurve(greeceCoord, d.coord, projection)),
        exit => exit.transition().duration(300).attr("opacity", 0).remove()
      );

    flowLinkSelection
      .on("mousemove", function(event, d) {
        d3.select(this)
          .attr("opacity", 1)
          .attr("stroke-width", Math.min(linkWidth(d.n) + 0.8, 6.8));

        tooltip
          .style("opacity", 1)
          .style("left", `${event.clientX + 12}px`)
          .style("top", `${event.clientY + 12}px`)
          .html(flowTooltipHtml(d, selectedField));
      })
      .on("mouseleave", function(event, d) {
        d3.select(this)
          .attr("opacity", opacity(d.n))
          .attr("stroke-width", linkWidth(d.n));
        tooltip.style("opacity", 0);
      });

    const flowByCountry = new Map(countryFlows.map(d => [d.cntry, d]));

    const targetCountryFeatures = countriesGeoCache
      .filter(feature => feature.__countryCode && flowByCountry.has(feature.__countryCode));

    const targetCountrySelection = gCountryOverlay.selectAll("path.target-country-shape")
      .data(targetCountryFeatures, d => d.__countryCode)
      .join(
        enter => enter.append("path")
          .attr("class", "target-country-shape")
          .attr("d", path)
          .attr("fill", d => {
            const flow = flowByCountry.get(d.__countryCode);
            return countryFill(flow ? flow.n : 0);
          })
          .attr("stroke", d => visibleFlowLabels.has(d.__countryCode) ? "#111" : "#3c5968")
          .attr("stroke-width", d => visibleFlowLabels.has(d.__countryCode) ? 1.2 : 0.42)
          .attr("vector-effect", "non-scaling-stroke")
          .attr("opacity", 0)
          .style("cursor", BLACK_POINTER_CURSOR)
          .call(enter => enter.transition()
            .duration(450)
            .attr("opacity", 0.88)),
        update => update
          .attr("d", path)
          .attr("fill", d => {
            const flow = flowByCountry.get(d.__countryCode);
            return countryFill(flow ? flow.n : 0);
          })
          .attr("stroke", d => visibleFlowLabels.has(d.__countryCode) ? "#111" : "#3c5968")
          .attr("stroke-width", d => visibleFlowLabels.has(d.__countryCode) ? 1.2 : 0.42)
          .attr("vector-effect", "non-scaling-stroke")
          .attr("opacity", 0.88),
        exit => exit.transition()
          .duration(250)
          .attr("opacity", 0)
          .remove()
      );

    targetCountrySelection
      .style("cursor", BLACK_POINTER_CURSOR)
      .on("mousemove", function(event, feature) {
        const flow = flowByCountry.get(feature.__countryCode);
        if (!flow) return;

        d3.select(this)
          .attr("stroke", "#111")
          .attr("stroke-width", 1.35)
          .attr("opacity", 1);

        tooltip
          .style("opacity", 1)
          .style("left", `${event.clientX + 12}px`)
          .style("top", `${event.clientY + 12}px`)
          .html(flowTooltipHtml(flow, selectedField));
      })
      .on("mouseleave", function(event, feature) {
        const selected = visibleFlowLabels.has(feature.__countryCode);
        d3.select(this)
          .attr("stroke", selected ? "#111" : "#3c5968")
          .attr("stroke-width", selected ? 1.2 : 0.42)
          .attr("opacity", selected ? 1 : 0.88);
        tooltip.style("opacity", 0);
      })
      .on("click", function(event, feature) {
        event.stopPropagation();
        const flow = flowByCountry.get(feature.__countryCode);
        if (flow) toggleFlowLabel(flow);
      });

    const greeceCount = getGreeceCount(selectedField);
    const greeceFeature = countriesGeoCache.find(feature => feature.__countryCode === "grc");

    gCountryOverlay.selectAll("path.greece-source-country")
      .data(greeceFeature ? [greeceFeature] : [], d => d.__countryCode)
      .join("path")
      .attr("class", "greece-source-country")
      .attr("d", path)
      .attr("fill", "#a51c30")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1.4)
      .attr("vector-effect", "non-scaling-stroke")
      .attr("opacity", 0.78);

    gNodes.selectAll("circle.greece-node")
      .data(greeceFeature ? [] : [{ cntry: "grc", coord: greeceCoord, projected: greeceProjected, n: greeceCount }])
      .join(
        enter => enter.append("circle")
          .attr("class", "greece-node")
          .attr("cx", greeceProjected[0])
          .attr("cy", greeceProjected[1])
          .attr("r", 12)
          .attr("fill", "#a51c30")
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 2.2),
        update => update
          .attr("cx", greeceProjected[0])
          .attr("cy", greeceProjected[1])
          .attr("r", 12),
        exit => exit.remove()
      );

    gLabels.selectAll("text.greece-permanent-label")
      .data([{ cntry: "grc", x: greeceProjected[0], y: greeceProjected[1], n: greeceCount }])
      .join("text")
      .attr("class", "greece-permanent-label")
      .attr("x", d => d.x + 14)
      .attr("y", d => d.y + 4)
      .attr("font-size", 13)
      .attr("font-weight", 800)
      .attr("fill", "#a51c30")
      .attr("paint-order", "stroke")
      .attr("stroke", "rgba(255,253,249,0.96)")
      .attr("stroke-width", 3.2)
      .attr("stroke-linejoin", "round")
      .text(d => `希腊 ${d3.format(",")(d.n)}`);

    latestCountryFlows = countryFlows;
    renderFlowLabels();
    updateFlowNodeSelection();

    drawFlowMapTitle(svg, selectedField, countryFlows.length, formatField);
    drawFlowMapLegendPanel(color, linkWidth, countryFill, maxN);
    drawEuropeNetwork(countryFlows, selectedField, linkWidth, nodeRadius, opacity, color, countryFill);
  }

  function drawEuropeNetwork(countryFlows, selectedField, linkWidth, nodeRadius, opacity, color, countryFill) {
    d3.select("#europe-network").selectAll("*").remove();

    const europeCountryCodes = new Set([
      "gbr", "deu", "cyp", "fra", "che", "nld", "ita", "swe", "esp",
      "bel", "aut", "dnk", "nor", "fin", "irl", "tur"
    ]);

    const europeFlows = countryFlows.filter(d => europeCountryCodes.has(d.cntry));

    const w = 255;
    const h = 235;

    const svgEurope = d3.select("#europe-network")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    svgEurope.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", w)
      .attr("height", h)
      .attr("rx", 10)
      .attr("fill", "#fffdf9");

    // 欧洲局部地图范围：
    // 这里特意把视野向南、向东移动，让希腊和塞浦路斯都落在小地图中，
    // 同时仍保留英国、法国、德国、北欧等主要欧洲承接国。
    const europeProjection = d3.geoMercator()
      // Shift the regional map slightly south-east and reduce zoom
      // so Cyprus is included together with Greece and major European destinations.
      .center([20, 45])
      .scale(250)
      .translate([w / 2, h / 2 + 5]);

    const europePath = d3.geoPath(europeProjection);

    const clipId = "europe-panel-clip";

    svgEurope.append("defs")
      .append("clipPath")
      .attr("id", clipId)
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", w)
      .attr("height", h)
      .attr("rx", 10)
      .attr("ry", 10);

    const clipped = svgEurope.append("g")
      .attr("clip-path", `url(#${clipId})`);

    if (countriesGeoCache.length > 0) {
      clipped.selectAll("path.europe-base-country")
        .data(countriesGeoCache)
        .join("path")
        .attr("class", "europe-base-country")
        .attr("d", europePath)
        .attr("fill", "#eee6dc")
        .attr("stroke", "#d3c8ba")
        .attr("stroke-width", 0.28)
        .attr("opacity", 0.95);
    }

    const greeceEuropeProjected = europeProjection(greeceCoord);

    const europeFlowData = europeFlows
      .map(d => ({
        ...d,
        europeProjected: europeProjection(d.coord)
      }))
      .filter(d => d.europeProjected);

    clipped.selectAll("path.europe-flow-link")
      .data(europeFlowData, d => d.cntry)
      .join("path")
      .attr("class", "europe-flow-link")
      .attr("fill", "none")
      .attr("stroke-linecap", "round")
      .attr("stroke", d => color(clamp(d.weighted_log2_si, -1.5, 1.5)))
      .attr("stroke-width", d => {
        const selected = visibleFlowLabels.has(d.cntry);
        return selected
          ? Math.min(Math.max(1.5, linkWidth(d.n) * 1.08), 7.2)
          : Math.max(0.65, linkWidth(d.n) * 0.62);
      })
      .attr("opacity", d => {
        const anySelected = visibleFlowLabels.size > 0;
        const selected = visibleFlowLabels.has(d.cntry);

        if (!anySelected) {
          return Math.max(0.45, opacity(d.n));
        }

        return selected ? 1 : 0.18;
      })
      .attr("vector-effect", "non-scaling-stroke")
      .style("mix-blend-mode", "normal")
      .attr("d", d => makeGeoCurve(greeceCoord, d.coord, europeProjection))
      .each(function(d) {
        if (visibleFlowLabels.has(d.cntry)) {
          d3.select(this).raise();
        }
      })
      .on("mousemove", function(event, d) {
        d3.select(this)
          .raise()
          .attr("opacity", 1)
          .attr("stroke-width", Math.min(Math.max(1.7, linkWidth(d.n) * 1.12), 7.8));

        tooltip
          .style("opacity", 1)
          .style("left", `${event.clientX + 12}px`)
          .style("top", `${event.clientY + 12}px`)
          .html(flowTooltipHtml(d, selectedField));
      })
      .on("mouseleave", function(event, d) {
        const selected = visibleFlowLabels.has(d.cntry);

        d3.select(this)
          .attr("opacity", selected ? 1 : Math.max(0.45, opacity(d.n)))
          .attr("stroke-width", selected
            ? Math.min(Math.max(1.5, linkWidth(d.n) * 1.08), 7.2)
            : Math.max(0.65, linkWidth(d.n) * 0.62)
          );

        tooltip.style("opacity", 0);
      });

    const europeFlowByCountry = new Map(europeFlowData.map(d => [d.cntry, d]));

    const europeTargetFeatures = countriesGeoCache
      .filter(feature => feature.__countryCode && europeFlowByCountry.has(feature.__countryCode));

    clipped.selectAll("path.europe-target-country")
      .data(europeTargetFeatures, d => d.__countryCode)
      .join("path")
      .attr("class", "europe-target-country")
      .attr("d", europePath)
      .attr("fill", feature => {
        const flow = europeFlowByCountry.get(feature.__countryCode);
        return countryFill(flow ? flow.n : 0);
      })
      .attr("stroke", feature => visibleFlowLabels.has(feature.__countryCode) ? "#111" : "#3c5968")
      .attr("stroke-width", feature => visibleFlowLabels.has(feature.__countryCode) ? 1.1 : 0.38)
      .attr("vector-effect", "non-scaling-stroke")
      .attr("opacity", 0.9)
      .style("cursor", BLACK_POINTER_CURSOR)
      .on("mousemove", function(event, feature) {
        const flow = europeFlowByCountry.get(feature.__countryCode);
        if (!flow) return;

        d3.select(this)
          .attr("stroke", "#111")
          .attr("stroke-width", 1.2)
          .attr("opacity", 1);

        tooltip
          .style("opacity", 1)
          .style("left", `${event.clientX + 12}px`)
          .style("top", `${event.clientY + 12}px`)
          .html(flowTooltipHtml(flow, selectedField));
      })
      .on("mouseleave", function(event, feature) {
        const selected = visibleFlowLabels.has(feature.__countryCode);
        d3.select(this)
          .attr("stroke", selected ? "#111" : "#3c5968")
          .attr("stroke-width", selected ? 1.1 : 0.38)
          .attr("opacity", 0.9);
        tooltip.style("opacity", 0);
      })
      .on("click", function(event, feature) {
        event.stopPropagation();
        const flow = europeFlowByCountry.get(feature.__countryCode);
        if (flow) toggleFlowLabel(flow);
      });

    const europeGreeceFeature = countriesGeoCache.find(feature => feature.__countryCode === "grc");

    clipped.selectAll("path.europe-greece-country")
      .data(europeGreeceFeature ? [europeGreeceFeature] : [], d => d.__countryCode)
      .join("path")
      .attr("class", "europe-greece-country")
      .attr("d", europePath)
      .attr("fill", "#a51c30")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1.2)
      .attr("opacity", 0.82);

    clipped.selectAll("circle.europe-greece-node")
      .data(europeGreeceFeature ? [] : [{ projected: greeceEuropeProjected }])
      .join("circle")
      .attr("class", "europe-greece-node")
      .attr("cx", d => d.projected[0])
      .attr("cy", d => d.projected[1])
      .attr("r", 6.8)
      .attr("fill", "#a51c30")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 1.0);

    clipped.selectAll("text.europe-selected-label")
      .data(europeFlowData.filter(d => visibleFlowLabels.has(d.cntry)), d => d.cntry)
      .join("text")
      .attr("class", "europe-selected-label")
      .attr("x", d => d.europeProjected[0] + 6)
      .attr("y", d => d.europeProjected[1] - 5)
      .attr("font-size", 9.5)
      .attr("font-weight", 700)
      .attr("fill", "#2f3a44")
      .attr("paint-order", "stroke")
      .attr("stroke", "rgba(255,253,249,0.96)")
      .attr("stroke-width", 2.5)
      .attr("stroke-linejoin", "round")
      .text(d => `${formatCountry(d.cntry)} ${d.n}`);

    clipped.append("text")
      .attr("x", greeceEuropeProjected[0] + 7)
      .attr("y", greeceEuropeProjected[1] + 3)
      .attr("font-size", 9.5)
      .attr("font-weight", 800)
      .attr("fill", "#a51c30")
      .attr("paint-order", "stroke")
      .attr("stroke", "rgba(255,253,249,0.95)")
      .attr("stroke-width", 2.4)
      .text("希腊");

    svgEurope.append("text")
      .attr("x", 12)
      .attr("y", 20)
      .attr("font-size", 10.5)
      .attr("font-weight", 800)
      .attr("fill", "#2a2928")
      .text("欧洲局部地图");


  }

  function toggleFlowLabel(d) {
    if (visibleFlowLabels.has(d.cntry)) {
      visibleFlowLabels.delete(d.cntry);
    } else {
      visibleFlowLabels.add(d.cntry);
    }

    renderFlowLabels();
    updateFlowNodeSelection();

    if (latestLinkWidth && latestNodeRadius && latestOpacity && latestColor) {
      const maxVisibleN = d3.max(latestCountryFlows, d => d.n) || 1;
      const latestCountryFill = d3.scaleSequential()
        .domain([0, maxVisibleN])
        .interpolator(t => d3.interpolateRgb("#dcecf3", "#165a86")(Math.sqrt(t)));

      drawEuropeNetwork(
        latestCountryFlows,
        latestSelectedField,
        latestLinkWidth,
        latestNodeRadius,
        latestOpacity,
        latestColor,
        latestCountryFill
      );
    }
  }

  function renderFlowLabels() {
    const labelData = latestCountryFlows.filter(d => visibleFlowLabels.has(d.cntry));

    gLabels.selectAll("text.target-label")
      .data(labelData, d => d.cntry)
      .join(
        enter => enter.append("text")
          .attr("class", "target-label")
          .attr("x", d => d.projected[0] + 10)
          .attr("y", d => d.projected[1] - 8)
          .attr("font-size", 11)
          .attr("font-weight", 700)
          .attr("fill", "#2f3a44")
          .attr("paint-order", "stroke")
          .attr("stroke", "rgba(255,253,249,0.92)")
          .attr("stroke-width", 3)
          .attr("stroke-linejoin", "round")
          .attr("opacity", 0)
          .style("cursor", BLACK_POINTER_CURSOR)
          .text(d => `${formatCountry(d.cntry)} ${d.n}`)
          .on("click", function(event, d) {
            event.stopPropagation();
            toggleFlowLabel(d);
          })
          .transition()
          .duration(250)
          .attr("opacity", 1),
        update => update
          .transition()
          .duration(450)
          .attr("x", d => d.projected[0] + 10)
          .attr("y", d => d.projected[1] - 8)
          .text(d => `${formatCountry(d.cntry)} ${d.n}`),
        exit => exit
          .transition()
          .duration(200)
          .attr("opacity", 0)
          .remove()
      );
  }

  function updateFlowNodeSelection() {
    gCountryOverlay.selectAll("path.target-country-shape")
      .attr("stroke", d => visibleFlowLabels.has(d.__countryCode) ? "#111" : "#3c5968")
      .attr("stroke-width", d => visibleFlowLabels.has(d.__countryCode) ? 1.2 : 0.42)
      .attr("vector-effect", "non-scaling-stroke")
      .attr("opacity", d => visibleFlowLabels.has(d.__countryCode) ? 1 : 0.88);

    gLinks.selectAll("path")
      .attr("opacity", function(d) {
        const anySelected = visibleFlowLabels.size > 0;
        if (!anySelected) return null;
        return visibleFlowLabels.has(d.cntry) ? 0.95 : 0.18;
      });
  }

  function flowTooltipHtml(d, selectedField) {
    const fieldLabel = selectedField === "__all__" ? "全部学科" : formatField(selectedField);
    const specializationText = Number.isFinite(d.weighted_log2_si)
      ? d3.format(".2f")(d.weighted_log2_si)
      : "NA";

    const siText = Number.isFinite(d.si)
      ? `<br>专业化指数 SI：${d3.format(".2f")(d.si)}`
      : "";

    const topFieldLine = selectedField === "__all__"
      ? `<br>主要学科：${formatField(d.top_field)}`
      : "";

    return `
      <strong>希腊 → ${formatCountry(d.cntry)}</strong><br>
      学科：${fieldLabel}<br>
      科学家人数：<strong>${d3.format(",")(d.n)}</strong><br>
      排名：第 ${d.rank}${topFieldLine}<br>
      log2(SI)：${specializationText}
      ${siText}
    `;
  }
}


function drawQuadrants(svg, x, y, medianTotal, medianDiversity, margin, width, height) {
  const left = margin.left;
  const right = width - margin.right;
  const top = margin.top;
  const bottom = height - margin.bottom;
  const midX = x(medianTotal);
  const midY = y(medianDiversity);

  const quadrants = [
    { x: left, y: top, w: midX - left, h: midY - top, label: "小型综合型节点", lx: left + 12, ly: top + 20, anchor: "start" },
    { x: midX, y: top, w: right - midX, h: midY - top, label: "大型综合型中心", lx: right - 12, ly: top + 20, anchor: "end" },
    { x: left, y: midY, w: midX - left, h: bottom - midY, label: "小型专业化节点", lx: left + 12, ly: bottom - 14, anchor: "start" },
    { x: midX, y: midY, w: right - midX, h: bottom - midY, label: "大型专业化中心", lx: right - 12, ly: bottom - 14, anchor: "end" }
  ];

  svg.append("g")
    .selectAll("rect")
    .data(quadrants)
    .join("rect")
    .attr("x", d => d.x)
    .attr("y", d => d.y)
    .attr("width", d => Math.max(0, d.w))
    .attr("height", d => Math.max(0, d.h))
    .attr("fill", (d, i) => i % 2 === 0 ? "#fbf7f0" : "#f6efe6")
    .attr("opacity", 0.7);

  svg.append("g")
    .selectAll("text")
    .data(quadrants)
    .join("text")
    .attr("x", d => d.lx)
    .attr("y", d => d.ly)
    .attr("text-anchor", d => d.anchor)
    .attr("font-size", 12)
    .attr("fill", "#b8aa9a")
    .attr("font-weight", 600)
    .text(d => d.label);
}


function drawDominantFieldLegend(svg, categories, colorScale, formatField, x, y) {
  const shown = categories.slice(0, 10);
  const colW = 78;
  const rowH = 18;
  const rows = Math.ceil(shown.length / 2);
  const legendW = 168;
  const legendH = 42 + rows * rowH + 8;

  const legend = svg.append("g")
    .attr("class", "dominant-field-legend compact-legend")
    .attr("transform", `translate(${x - 8}, ${y})`);

  legend.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", legendW)
    .attr("height", legendH)
    .attr("rx", 12)
    .attr("fill", "rgba(255, 253, 249, 0.94)")
    .attr("stroke", "#e2d0bb")
    .attr("stroke-width", 1);

  legend.append("text")
    .attr("x", 12)
    .attr("y", 19)
    .attr("font-size", 12)
    .attr("font-weight", 800)
    .attr("fill", "#2a2928")
    .text("颜色");

  legend.append("text")
    .attr("x", 48)
    .attr("y", 19)
    .attr("font-size", 10)
    .attr("fill", "#7b7168")
    .text("第一大学科");

  const items = legend.selectAll(".dominant-field-item")
    .data(shown)
    .join("g")
    .attr("class", "dominant-field-item")
    .attr("transform", (d, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      return `translate(${12 + col * colW}, ${38 + row * rowH})`;
    });

  items.append("circle")
    .attr("cx", 5)
    .attr("cy", 5)
    .attr("r", 5)
    .attr("fill", d => colorScale(d))
    .attr("stroke", "#fff")
    .attr("stroke-width", 1);

  items.append("text")
    .attr("x", 14)
    .attr("y", 9)
    .attr("font-size", 10)
    .attr("fill", "#5f554d")
    .text(d => {
      const label = formatField(d);
      return label.length > 5 ? label.slice(0, 5) + "…" : label;
    });
}

function drawRadiusLegend(svg, radius, x, y) {
  const domain = radius.domain ? radius.domain() : [0.2, 0.6];
  const minV = domain[0];
  const maxV = domain[1];
  const midV = (minV + maxV) / 2;
  const values = [minV, midV, maxV];

  const legendW = 168;
  const legendH = 116;
  const legend = svg.append("g")
    .attr("class", "share-size-legend compact-legend")
    .attr("transform", `translate(${x - 8}, ${y})`);

  legend.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", legendW)
    .attr("height", legendH)
    .attr("rx", 12)
    .attr("fill", "rgba(255, 253, 249, 0.94)")
    .attr("stroke", "#e2d0bb")
    .attr("stroke-width", 1);

  legend.append("text")
    .attr("x", 12)
    .attr("y", 19)
    .attr("font-size", 12)
    .attr("font-weight", 800)
    .attr("fill", "#2a2928")
    .text("大小");

  legend.append("text")
    .attr("x", 48)
    .attr("y", 19)
    .attr("font-size", 10)
    .attr("fill", "#7b7168")
    .text("第一大学科占比");

  const cx = 42;
  const baseY = 96;
  const labelX = 92;
  const labelYs = [51, 72, 93];

  values
    .slice()
    .sort((a, b) => d3.descending(a, b))
    .forEach(value => {
      const rr = radius(value);
      legend.append("circle")
        .attr("cx", cx)
        .attr("cy", baseY - rr)
        .attr("r", rr)
        .attr("fill", "rgba(47, 120, 168, 0.13)")
        .attr("stroke", "#2f78a8")
        .attr("stroke-width", 1.1);
    });

  values
    .slice()
    .sort((a, b) => d3.descending(a, b))
    .forEach((value, i) => {
      const rr = radius(value);
      const circleY = baseY - rr;
      const labelY = labelYs[i];

      legend.append("line")
      .attr("x1", cx + rr)
      .attr("x2", labelX - 8)
      .attr("y1", circleY)
      .attr("y2", labelY - 3)
      .attr("stroke", "#d6c9bb")
      .attr("stroke-width", 0.8)
      .attr("stroke-dasharray", "2,2");

    legend.append("text")
      .attr("x", labelX)
      .attr("y", labelY)
      .attr("font-size", 10)
      .attr("fill", "#5f554d")
      .attr("font-weight", 600)
      .text(d3.format(".0%")(value));
    });
}

function populateCountrySelector(data, formatCountry, onChange) {
  const select = d3.select("#country-focus-select");
  select.selectAll("option.dynamic-option").remove();

  data
    .slice()
    .sort((a, b) => d3.ascending(formatCountry(a.cntry), formatCountry(b.cntry)))
    .forEach(d => {
      select.append("option")
        .attr("class", "dynamic-option")
        .attr("value", d.cntry)
        .text(formatCountry(d.cntry));
    });

  select.on("change", function() {
    onChange(this.value);
  });
}


function updatePortfolioCard(d, formatCountry, formatField) {
  const card = d3.select("#portfolio-card");

  if (!d) {
    card.html(`
      <div class="portfolio-card-section portfolio-overview">
        <div class="card-title">国家画像</div>
        <p>将鼠标悬停在图 3 的国家点上，或从下拉菜单选择国家，这里会显示该国的学科组合、主导学科和专业化学科。</p>
      </div>
      <div class="portfolio-card-section portfolio-top-fields">
        <div class="card-section-title">前三大学科占比</div>
        <p>暂无国家数据。</p>
      </div>
      <div class="portfolio-card-section portfolio-specialized-fields">
        <div class="card-section-title">最突出的专业化学科</div>
        <p>暂无专业化数据。</p>
      </div>
    `);
    return;
  }

  const topFieldsHtml = Array.isArray(d.top_fields)
    ? d.top_fields.map(item => {
      const share = +item.share || 0;
      return `
        <div class="mini-bar-row">
          <div class="mini-bar-label">
            <span>${formatField(item.field)}</span>
            <span>${d3.format(".1%")(share)}</span>
          </div>
          <div class="mini-bar-track">
            <div class="mini-bar-fill" style="width:${Math.min(100, share * 100)}%;"></div>
          </div>
        </div>
      `;
    }).join("")
    : "<p>暂无前三大学科数据。</p>";

  const specializedHtml = Array.isArray(d.most_specialized) && d.most_specialized.length > 0
    ? d.most_specialized.map(item => `
        <div class="card-metric">
          ${formatField(item.field)}：SI=${d3.format(".2f")(item.si)}，log2(SI)=${d3.format(".2f")(item.log2_si)}
        </div>
      `).join("")
    : "<p>暂无可靠专业化数据。</p>";

  card.html(`
    <div class="portfolio-card-section portfolio-overview">
      <div class="card-title">${formatCountry(d.cntry)}</div>
      <div class="card-metric"><strong>希腊科学家人数：</strong>${d3.format(",")(d.total)}</div>
      <div class="card-metric"><strong>学科多样性：</strong>${d3.format(".3f")(d.field_diversity)}</div>
      <div class="card-metric"><strong>第一大学科：</strong>${formatField(d.top_field)}（${d3.format(".1%")(d.top_field_share)}）</div>
    </div>

    <div class="portfolio-card-section portfolio-top-fields">
      <div class="card-section-title">前三大学科占比</div>
      ${topFieldsHtml}
    </div>

    <div class="portfolio-card-section portfolio-specialized-fields">
      <div class="card-section-title">最突出的专业化学科</div>
      ${specializedHtml}
    </div>
  `);
}

function highlightCountry(country) {
  d3.selectAll(".heatmap-bubble")
    .style("opacity", function(d) {
      if (d.cntry === country) return 0.98;
      if (d.cntry === "grc") return 0.90;
      return 0.12;
    });

  d3.selectAll(".heatmap-cell")
    .style("opacity", function(d) {
      if (d.country === country) return 1;
      if (d.country === "grc") return 0.95;
      return 0.25;
    });

  d3.selectAll(".heatmap-country-label")
    .style("font-weight", function(d) {
      return (d === country || d === "grc") ? 800 : 400;
    })
    .style("fill", function(d) {
      return (d === country || d === "grc") ? "#a51c30" : "#2a2928";
    });

  d3.selectAll(".scatter-point")
    .style("opacity", function(d) {
      return d.cntry === country ? 1 : 0.18;
    });

  d3.selectAll(".scatter-label")
    .style("opacity", function(d) {
      return d.cntry === country ? 1 : 0.25;
    });
}


function resetHighlight() {
  d3.selectAll(".heatmap-bubble")
    .style("opacity", function(d) {
      return d.reliable ? 0.95 : 0.42;
    });

  d3.selectAll(".heatmap-cell").style("opacity", 1);

  d3.selectAll(".heatmap-country-label")
    .style("font-weight", function(d) {
      return d === "grc" ? 700 : 400;
    })
    .style("fill", function(d) {
      return d === "grc" ? "#a51c30" : "#2a2928";
    });

  d3.selectAll(".scatter-point").style("opacity", 0.88);
  d3.selectAll(".scatter-label").style("opacity", 1);
}



function drawHeatmapLegendRow(color, colorMin, colorMax, r, maxN) {
  const container = d3.select("#heatmap-legend-row");
  if (container.empty()) return;

  container.selectAll("*").remove();

  const colorBlock = container.append("div")
    .attr("class", "legend-inline-block legend-color-block");

  colorBlock.append("div")
    .attr("class", "legend-title")
    .text("颜色：相对专业化程度 log2(SI)");

  const gradientId = "heatmap-bottom-gradient";
  const svgColor = colorBlock.append("svg")
    .attr("width", 280)
    .attr("height", 48)
    .attr("viewBox", "0 0 280 48");

  const defs = svgColor.append("defs");
  const gradient = defs.append("linearGradient")
    .attr("id", gradientId)
    .attr("x1", "0%")
    .attr("x2", "100%");

  d3.range(0, 1.01, 0.1).forEach(t => {
    gradient.append("stop")
      .attr("offset", `${t * 100}%`)
      .attr("stop-color", color(colorMin + t * (colorMax - colorMin)));
  });

  svgColor.append("rect")
    .attr("x", 0)
    .attr("y", 8)
    .attr("width", 260)
    .attr("height", 12)
    .attr("rx", 6)
    .attr("fill", `url(#${gradientId})`);

  const scale = d3.scaleLinear().domain([colorMin, colorMax]).range([0, 260]);

  svgColor.append("g")
    .attr("transform", "translate(0, 20)")
    .call(d3.axisBottom(scale).tickValues([colorMin, 0, colorMax]).tickSize(4).tickFormat(d => d))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll("line").attr("stroke", "#8b8178"))
    .call(g => g.selectAll("text").attr("fill", "#6b6258").attr("font-size", 10));

  colorBlock.append("div")
    .attr("class", "legend-caption")
    .text("蓝色 = 相对低集中；红色 = 相对高集中");

  const sizeBlock = container.append("div")
    .attr("class", "legend-inline-block legend-size-block");

  sizeBlock.append("div")
    .attr("class", "legend-title")
    .text("气泡大小：科学家人数");

  const values = [
    Math.max(5, Math.round(maxN * 0.18)),
    Math.max(10, Math.round(maxN * 0.45)),
    Math.max(15, Math.round(maxN * 0.85))
  ].sort((a, b) => d3.ascending(a, b));

  const svgSize = sizeBlock.append("svg")
    .attr("width", 240)
    .attr("height", 58)
    .attr("viewBox", "0 0 240 58");

  const x = d3.scalePoint()
    .domain(values)
    .range([42, 198])
    .padding(0.5);

  values.forEach(value => {
    const rr = r(value);

    svgSize.append("circle")
      .attr("cx", x(value))
      .attr("cy", 24)
      .attr("r", rr)
      .attr("fill", "rgba(165, 28, 48, 0.10)")
      .attr("stroke", "#a51c30")
      .attr("stroke-width", 1);

    svgSize.append("text")
      .attr("x", x(value))
      .attr("y", 52)
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .attr("font-weight", 600)
      .attr("fill", "#5f554d")
      .text(d3.format(",")(value));
  });
}


function drawDiversityLegendRow(categories, colorScale, formatField, radius) {
  const container = d3.select("#diversity-legend-row");
  if (container.empty()) return;

  container.selectAll("*").remove();

  const shown = categories.slice(0, 10);

  const colorBlock = container.append("div")
    .attr("class", "legend-inline-block legend-field-block");

  colorBlock.append("div")
    .attr("class", "legend-title")
    .text("颜色：第一大学科");

  const colorItems = colorBlock.append("div")
    .attr("class", "legend-chip-row");

  shown.forEach(field => {
    const item = colorItems.append("div")
      .attr("class", "legend-chip");

    item.append("span")
      .attr("class", "legend-chip-dot")
      .style("background", colorScale(field));

    item.append("span")
      .attr("class", "legend-chip-label")
      .text(() => {
        const label = formatField(field);
        return label.length > 8 ? label.slice(0, 8) + "…" : label;
      });
  });

  const sizeBlock = container.append("div")
    .attr("class", "legend-inline-block legend-role-size-block");

  sizeBlock.append("div")
    .attr("class", "legend-title")
    .text("圆点大小：第一大学科占比");

  const domain = radius.domain ? radius.domain() : [0.2, 0.6];
  const minV = domain[0];
  const maxV = domain[1];
  const midV = (minV + maxV) / 2;
  const values = [minV, midV, maxV];

  const svgSize = sizeBlock.append("svg")
    .attr("width", 190)
    .attr("height", 46)
    .attr("viewBox", "0 0 190 46");

  const x = d3.scalePoint()
    .domain(values)
    .range([32, 158])
    .padding(0.5);

  values.forEach(value => {
    const rr = Math.min(radius(value) * 0.55, 12);

    svgSize.append("circle")
      .attr("cx", x(value))
      .attr("cy", 18)
      .attr("r", rr)
      .attr("fill", "rgba(47, 120, 168, 0.13)")
      .attr("stroke", "#2f78a8")
      .attr("stroke-width", 1);

    svgSize.append("text")
      .attr("x", x(value))
      .attr("y", 42)
      .attr("text-anchor", "middle")
      .attr("font-size", 9.5)
      .attr("font-weight", 600)
      .attr("fill", "#5f554d")
      .text(d3.format(".0%")(value));
  });
}


function drawColorLegend(svg, color, colorMin, colorMax, x, y, width, height) {
  const defs = svg.append("defs");

  const gradient = defs.append("linearGradient")
    .attr("id", "specialization-gradient-cn")
    .attr("x1", "0%")
    .attr("x2", "100%");

  d3.range(0, 1.01, 0.1).forEach(t => {
    gradient.append("stop")
      .attr("offset", `${t * 100}%`)
      .attr("stop-color", color(colorMin + t * (colorMax - colorMin)));
  });

  svg.append("text")
    .attr("x", x)
    .attr("y", y - 12)
    .attr("font-size", 12)
    .attr("font-weight", 700)
    .attr("fill", "#2a2928")
    .text("颜色：log2(SI)");

  svg.append("rect")
    .attr("x", x)
    .attr("y", y)
    .attr("width", width)
    .attr("height", height)
    .attr("rx", 4)
    .attr("fill", "url(#specialization-gradient-cn)");

  const scale = d3.scaleLinear()
    .domain([colorMin, colorMax])
    .range([x, x + width]);

  svg.append("g")
    .attr("transform", `translate(0, ${y + height})`)
    .call(d3.axisBottom(scale).tickValues([colorMin, 0, colorMax]).tickFormat(d => d))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll("line").attr("stroke", "#8b8178"))
    .call(g => g.selectAll("text").attr("font-size", 10).attr("fill", "#6b6258"));

  svg.append("text").attr("x", x).attr("y", y + height + 34).attr("font-size", 10).attr("fill", "#2166ac").text("蓝：低于平均");
  svg.append("text").attr("x", x).attr("y", y + height + 50).attr("font-size", 10).attr("fill", "#6b6258").text("白：接近平均");
  svg.append("text").attr("x", x).attr("y", y + height + 66).attr("font-size", 10).attr("fill", "#b2182b").text("红：高于平均");
}


function drawSizeLegend(svg, r, maxN, x, y) {
  const values = [
    Math.max(5, Math.round(maxN * 0.18)),
    Math.max(10, Math.round(maxN * 0.45)),
    Math.max(15, Math.round(maxN * 0.85))
  ].sort((a, b) => d3.ascending(a, b));

  const legendW = 138;
  const legendH = 142;
  const legend = svg.append("g")
    .attr("class", "bubble-size-legend")
    .attr("transform", `translate(${x - 10}, ${y - 24})`);

  legend.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", legendW)
    .attr("height", legendH)
    .attr("rx", 12)
    .attr("fill", "rgba(255, 253, 249, 0.94)")
    .attr("stroke", "#e2d0bb")
    .attr("stroke-width", 1);

  legend.append("text")
    .attr("x", 12)
    .attr("y", 19)
    .attr("font-size", 12)
    .attr("font-weight", 800)
    .attr("fill", "#2a2928")
    .text("气泡大小");

  legend.append("text")
    .attr("x", 12)
    .attr("y", 37)
    .attr("font-size", 10)
    .attr("fill", "#7b7168")
    .text("科学家人数");

  // 左侧展示嵌套圆，右侧用固定行距排列数字，避免文字重叠。
  const cx = 40;
  const baseY = 115;
  const labelX = 82;
  const labelYs = [72, 95, 118];

  values
    .slice()
    .sort((a, b) => d3.descending(a, b))
    .forEach(value => {
      const rr = r(value);

      legend.append("circle")
        .attr("cx", cx)
        .attr("cy", baseY - rr)
        .attr("r", rr)
        .attr("fill", "rgba(165, 28, 48, 0.10)")
        .attr("stroke", "#a51c30")
        .attr("stroke-width", 1.05);
    });

  values
    .slice()
    .sort((a, b) => d3.descending(a, b))
    .forEach((value, i) => {
      const rr = r(value);
      const circleY = baseY - rr;
      const labelY = labelYs[i];

      legend.append("line")
      .attr("x1", cx + rr)
      .attr("x2", labelX - 8)
      .attr("y1", circleY)
      .attr("y2", labelY - 3)
      .attr("stroke", "#d6c9bb")
      .attr("stroke-width", 0.8)
      .attr("stroke-dasharray", "2,2");

    legend.append("text")
      .attr("x", labelX)
      .attr("y", labelY)
      .attr("font-size", 10)
      .attr("fill", "#5f554d")
      .attr("font-weight", 600)
      .text(d3.format(",")(value));
    });
}

function drawFlowMapTitle(svg, selectedField, visibleCount) {
  // Title and explanatory text intentionally removed to keep the map clean.
}

function drawFlowMapLegendPanel(color, linkWidth, countryFill, maxN) {
  const container = d3.select("#flow-legend-panel");
  container.selectAll("*").remove();

  const wrap = container.append("div")
    .attr("class", "flow-legend-split");

  const colorPart = wrap.append("div")
    .attr("class", "flow-legend-part flow-legend-color-part");

  colorPart.append("div")
    .attr("class", "flow-legend-part-title")
    .text("国家版图颜色 / 连线颜色");

  const colorSvg = colorPart.append("svg")
    .attr("width", 205)
    .attr("height", 110)
    .attr("viewBox", "0 0 205 110");

  const defs = colorSvg.append("defs");

  const countryGradient = defs.append("linearGradient")
    .attr("id", "country-fill-gradient-panel")
    .attr("x1", "0%")
    .attr("x2", "100%");

  d3.range(0, 1.01, 0.1).forEach(t => {
    countryGradient.append("stop")
      .attr("offset", `${t * 100}%`)
      .attr("stop-color", countryFill(t * maxN));
  });

  const linkGradient = defs.append("linearGradient")
    .attr("id", "flow-link-gradient-panel")
    .attr("x1", "0%")
    .attr("x2", "100%");

  d3.range(0, 1.01, 0.1).forEach(t => {
    linkGradient.append("stop")
      .attr("offset", `${t * 100}%`)
      .attr("stop-color", color(-1.5 + t * 3));
  });

  colorSvg.append("text")
    .attr("x", 0)
    .attr("y", 12)
    .attr("font-size", 10.5)
    .attr("font-weight", 700)
    .attr("fill", "#2a2928")
    .text("国家版图颜色：人数");

  colorSvg.append("rect")
    .attr("x", 0)
    .attr("y", 22)
    .attr("width", 170)
    .attr("height", 11)
    .attr("rx", 5.5)
    .attr("fill", "url(#country-fill-gradient-panel)");

  colorSvg.append("text").attr("x", 0).attr("y", 50).attr("font-size", 9.5).attr("fill", "#7b7168").text("少");
  colorSvg.append("text").attr("x", 170).attr("y", 50).attr("text-anchor", "end").attr("font-size", 9.5).attr("fill", "#165a86").text("多");

  colorSvg.append("text")
    .attr("x", 0)
    .attr("y", 70)
    .attr("font-size", 10.5)
    .attr("font-weight", 700)
    .attr("fill", "#2a2928")
    .text("连线颜色：log2(SI)");

  colorSvg.append("rect")
    .attr("x", 0)
    .attr("y", 80)
    .attr("width", 170)
    .attr("height", 11)
    .attr("rx", 5.5)
    .attr("fill", "url(#flow-link-gradient-panel)");

  colorSvg.append("text").attr("x", 0).attr("y", 106).attr("font-size", 9.5).attr("fill", "#2166ac").text("低");
  colorSvg.append("text").attr("x", 170).attr("y", 106).attr("text-anchor", "end").attr("font-size", 9.5).attr("fill", "#b2182b").text("高");

  const widthPart = wrap.append("div")
    .attr("class", "flow-legend-part flow-legend-width-part");

  widthPart.append("div")
    .attr("class", "flow-legend-part-title")
    .text("连线粗细 / 深浅：人数");

  const widthSvg = widthPart.append("svg")
    .attr("width", 150)
    .attr("height", 110)
    .attr("viewBox", "0 0 150 110");

  const values = [
    Math.max(1, Math.round(maxN * 0.18)),
    Math.max(2, Math.round(maxN * 0.45)),
    Math.max(3, Math.round(maxN * 0.85))
  ];

  values.forEach((value, i) => {
    const y = 24 + i * 27;
    const w = Math.max(1.1, linkWidth(value) * 0.9);

    widthSvg.append("line")
      .attr("x1", 4)
      .attr("x2", 70)
      .attr("y1", y)
      .attr("y2", y)
      .attr("stroke", "#8bb4cc")
      .attr("stroke-width", w)
      .attr("stroke-linecap", "round")
      .attr("opacity", 0.82);

    widthSvg.append("text")
      .attr("x", 84)
      .attr("y", y + 3.5)
      .attr("font-size", 9.5)
      .attr("fill", "#5f554d")
      .text(`${d3.format(",")(value)} 人`);
  });
}


function drawFlowMapLegend(gLegend, color, linkWidth, nodeRadius, maxN, width) {
  gLegend.selectAll("*").remove();

  const x = width - 245;
  const y = 96;

  const legend = gLegend.append("g").attr("transform", `translate(${x}, ${y})`);

  legend.append("rect")
    .attr("x", -14)
    .attr("y", -22)
    .attr("width", 215)
    .attr("height", 250)
    .attr("rx", 10)
    .attr("fill", "rgba(255,253,249,0.88)")
    .attr("stroke", "#e2d0bb");

  legend.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .attr("font-size", 12)
    .attr("font-weight", 700)
    .attr("fill", "#2a2928")
    .text("图例");

  const values = [
    Math.max(1, Math.round(maxN * 0.15)),
    Math.max(2, Math.round(maxN * 0.45)),
    Math.max(3, Math.round(maxN * 0.85))
  ];

  legend.append("text")
    .attr("x", 0)
    .attr("y", 30)
    .attr("font-size", 11)
    .attr("font-weight", 700)
    .attr("fill", "#5f554d")
    .text("线宽 / 节点大小：人数");

  values.forEach((v, i) => {
    const yy = 55 + i * 32;

    legend.append("line")
      .attr("x1", 0)
      .attr("x2", 46)
      .attr("y1", yy)
      .attr("y2", yy)
      .attr("stroke", "#7aa6c2")
      .attr("stroke-width", linkWidth(v))
      .attr("stroke-linecap", "round")
      .attr("opacity", 0.75);

    legend.append("circle")
      .attr("cx", 68)
      .attr("cy", yy)
      .attr("r", nodeRadius(v))
      .attr("fill", "#7aa6c2")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1);

    legend.append("text")
      .attr("x", 94)
      .attr("y", yy + 4)
      .attr("font-size", 10)
      .attr("fill", "#5f554d")
      .text(`${v} 人`);
  });

  legend.append("text")
    .attr("x", 0)
    .attr("y", 160)
    .attr("font-size", 11)
    .attr("font-weight", 700)
    .attr("fill", "#5f554d")
    .text("颜色：log2(SI)");

  const defs = gLegend.append("defs");

  const gradient = defs.append("linearGradient")
    .attr("id", "flow-color-gradient")
    .attr("x1", "0%")
    .attr("x2", "100%");

  d3.range(0, 1.01, 0.1).forEach(t => {
    gradient.append("stop")
      .attr("offset", `${t * 100}%`)
      .attr("stop-color", color(-1.5 + t * 3));
  });

  legend.append("rect")
    .attr("x", 0)
    .attr("y", 176)
    .attr("width", 150)
    .attr("height", 10)
    .attr("rx", 5)
    .attr("fill", "url(#flow-color-gradient)");

  legend.append("text").attr("x", 0).attr("y", 202).attr("font-size", 10).attr("fill", "#2166ac").text("低于平均");
  legend.append("text").attr("x", 73).attr("y", 202).attr("text-anchor", "middle").attr("font-size", 10).attr("fill", "#6b6258").text("平均");
  legend.append("text").attr("x", 150).attr("y", 202).attr("text-anchor", "end").attr("font-size", 10).attr("fill", "#b2182b").text("高于平均");
}


function makeGeoCurve(startLonLat, endLonLat, projection) {
  const interpolate = d3.geoInterpolate(startLonLat, endLonLat);
  const points = d3.range(0, 1.001, 0.04).map(t => projection(interpolate(t)));

  return d3.line()
    .x(d => d[0])
    .y(d => d[1])
    .curve(d3.curveBasis)(points);
}


function crossJoin(countries, fields) {
  const result = [];
  countries.forEach(country => {
    fields.forEach(field => {
      result.push({ country, field });
    });
  });
  return result;
}


function wrapText(textSelection, width) {
  textSelection.each(function() {
    const text = d3.select(this);
    const words = text.text().split("");
    let line = [];
    let lineNumber = 0;
    const lineHeight = 1.15;
    const y = text.attr("y");
    const x = text.attr("x");
    const dy = 0;

    text.text(null);

    let tspan = text.append("tspan")
      .attr("x", x)
      .attr("y", y)
      .attr("dy", `${dy}em`);

    words.forEach(char => {
      line.push(char);
      tspan.text(line.join(""));

      if (tspan.node().getComputedTextLength() > width && line.length > 1) {
        line.pop();
        tspan.text(line.join(""));
        line = [char];
        tspan = text.append("tspan")
          .attr("x", x)
          .attr("y", y)
          .attr("dy", `${++lineNumber * lineHeight}em`)
          .text(char);
      }
    });
  });
}


function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}


function safeClass(value) {
  return String(value).replace(/[^a-zA-Z0-9_-]/g, "-");
}



function getFeatureCountryCode(feature) {
  const numericToCode = {
    "300": "grc",
    "840": "usa",
    "826": "gbr",
    "276": "deu",
    "196": "cyp",
    "036": "aus",
    "36": "aus",
    "124": "can",
    "250": "fra",
    "756": "che",
    "528": "nld",
    "380": "ita",
    "752": "swe",
    "724": "esp",
    "056": "bel",
    "56": "bel",
    "040": "aut",
    "40": "aut",
    "208": "dnk",
    "578": "nor",
    "246": "fin",
    "372": "irl",
    "376": "isr",
    "792": "tur",
    "156": "chn",
    "392": "jpn",
    "702": "sgp",
    "076": "bra",
    "76": "bra",
    "710": "zaf"
  };

  const rawId = feature && feature.id != null ? String(feature.id) : "";
  const paddedId = rawId.padStart(3, "0");

  if (numericToCode[rawId]) return numericToCode[rawId];
  if (numericToCode[paddedId]) return numericToCode[paddedId];

  const name = feature && feature.properties && feature.properties.name
    ? String(feature.properties.name).toLowerCase()
    : "";

  const nameToCode = {
    "greece": "grc",
    "united states of america": "usa",
    "united states": "usa",
    "united kingdom": "gbr",
    "england": "gbr",
    "germany": "deu",
    "cyprus": "cyp",
    "australia": "aus",
    "canada": "can",
    "france": "fra",
    "switzerland": "che",
    "netherlands": "nld",
    "italy": "ita",
    "sweden": "swe",
    "spain": "esp",
    "belgium": "bel",
    "austria": "aut",
    "denmark": "dnk",
    "norway": "nor",
    "finland": "fin",
    "ireland": "irl",
    "israel": "isr",
    "turkey": "tur",
    "china": "chn",
    "japan": "jpn",
    "singapore": "sgp",
    "brazil": "bra",
    "south africa": "zaf"
  };

  return nameToCode[name] || null;
}


function getCountryNameMap() {
  return {
    grc: "希腊本土",
    usa: "美国",
    gbr: "英国",
    deu: "德国",
    cyp: "塞浦路斯",
    aus: "澳大利亚",
    can: "加拿大",
    fra: "法国",
    che: "瑞士",
    nld: "荷兰",
    ita: "意大利",
    swe: "瑞典",
    esp: "西班牙",
    bel: "比利时",
    aut: "奥地利",
    dnk: "丹麦",
    nor: "挪威",
    fin: "芬兰",
    irl: "爱尔兰",
    isr: "以色列",
    tur: "土耳其",
    chn: "中国",
    jpn: "日本",
    sgp: "新加坡",
    bra: "巴西",
    zaf: "南非",
    are: "阿联酋",
    cze: "捷克"
  };
}


function getFieldNameMap() {
  return {
    "Clinical Medicine": "临床医学",
    "Engineering": "工程学",
    "Physics & Astronomy": "物理与天文",
    "Chemistry": "化学",
    "Information & Communication Technologies": "信息通信",
    "Biology": "生物学",
    "Social Sciences": "社会科学",
    "Psychology & Cognitive Sciences": "心理与认知",
    "Economics & Business": "经济与商业",
    "Philosophy & Theology": "哲学与神学",
    "Biomedical Research": "生物医学",
    "Earth & Environmental Sciences": "地球与环境",
    "Mathematics & Statistics": "数学统计",
    "Agriculture, Fisheries & Forestry": "农业林业",
    "Built Environment & Design": "建筑与设计",
    "Communication & Textual Studies": "传播文本",
    "Enabling & Strategic Technologies": "战略技术",
    "Historical Studies": "历史研究",
    "Visual & Performing Arts": "视觉表演艺术",
    "Public Health & Health Services": "公共卫生"
  };
}
