/**
 * Brain Drain Project - Section 5: Triple Threat Influence Analysis System
 * Charts: Scatter Bubble, Box Plot, Stacked Percentage Bar
 *
 * Refactored: now called by main.js instead of self-initializing.
 */

// ==========================================
// 辅助函数：安全提取国家英文全称
// ==========================================
function getCountryFullName(code) {
    if (!code) return "";
    const lowerCode = code.toLowerCase();
    if (typeof COUNTRY_LABELS !== "undefined" && COUNTRY_LABELS[lowerCode]) {
        return COUNTRY_LABELS[lowerCode];
    }
    return code.toUpperCase();
}

// ==========================================
// 主入口：由 main.js 在数据加载完成后调用
// ==========================================
function renderInfluenceCharts(data) {
    if (!data || !data.country_details) return;

    const allCountries = data.country_details;
    const reliableDataset = allCountries.filter(d => d.is_reliable === true);

    // 1. 提取希腊本土 & 前10大目的地
    const localData = allCountries.find(d => d.country.toLowerCase() === 'grc');
    const trueDestinations = allCountries.filter(d => d.country.toLowerCase() !== 'grc').slice(0, 10);
    const comparisonDataset = localData ? [localData, ...trueDestinations] : trueDestinations;

    const localMedian = data.macro_summary.local.median;

    const tooltip = d3.select("#tooltip");

    // 解读文案
    const INFLUENCE_INSIGHTS = {
        scatter: {
            title: "规模与质量的宏观博弈",
            body: "流向不同国家的希腊科学家是否拥有不同的学术影响力呢？答案似乎是肯定的。<strong>美国、英国、加拿大等主要目的地不仅聚集了数量庞大的希腊科学家，其学术影响力中位数也普遍高于希腊本土基准线。</strong>这意味着，吸引最多人才的国家，往往也能够提供更高水平的科研生态。<br><br>值得注意的是，希腊本土虽然拥有最大的科学家群体，但整体影响力仍处于国际比较的基准位置。换言之，希腊面临的或许并非单纯的人才短缺，而是<strong>顶尖科研资源、合作网络与学术回报的外部虹吸效应</strong>。<br><br>因此，这场“脑流失”不仅是地理意义上的迁徙，更可能是一场围绕学术卓越展开的主动选择：许多科学家离开，并非只是为了离开，而是为了抵达更广阔的学术舞台。"
        },
        box: {
            title: "个体影响力的分布域值",
            body: "第一张图展示的是国家层面的整体差异，那么下面的箱线图则揭示了<strong>个体层面的机会结构</strong>。以希腊本土为基准，大多数海外目的地的影响力中位数均高于本土水平，其中美国、加拿大、澳大利亚等国家尤为明显。<br><br>更重要的是，这种优势并非仅来自少数顶尖学者。海外科研环境普遍拥有更高的上四分位数（Q3）和更长的影响力上尾，意味着科学家不仅更容易取得较高水平的学术表现，也拥有突破自身“学术天花板”的更大可能。对于追求卓越的研究者而言，<strong>迁移所获得的并不仅是地理位置的改变，更是一套能够持续放大学术影响力的发展生态。</strong>"
        },
        stacked: {
            title: "科学家内部的梯队群体结构",
            body: "这不仅是人才数量的迁移，更是顶尖人才的重新配置。<br><br><strong>希腊本土科学家群体中，Top 1%领军人才与Top 5%顶尖学者占比相对有限；而美国、加拿大、澳大利亚等主要流向国家，其“金字塔顶端”群体明显更厚。</strong>这意味着，海外科研中心吸引的不只是更多希腊科学家，更是其中最具影响力与成长潜力的一批人。<br><br>因此，希腊面临的或许并非单纯的数量流失，而是一种<strong>高影响力人才的选择性外流</strong>：越接近学术巅峰的研究者，越倾向于流向能够提供更优资源与更强网络的科研生态。"
        }
    };

    // 状态锁：避免切换到同一tab时重复渲染
    let rendered = { scatter: false, box: false, stacked: false };

    // === 渲染默认（散点图）===
    renderScatterPlot(reliableDataset, localMedian, tooltip);
    rendered.scatter = true;
    d3.select("#inf-insight-title").html(INFLUENCE_INSIGHTS.scatter.title);
    d3.select("#inf-insight-body").html(INFLUENCE_INSIGHTS.scatter.body);

    // === Tab 切换 ===
    d3.selectAll(".inf-tab-btn").on("click", function () {
        d3.selectAll(".inf-tab-btn").classed("active", false);
        d3.select(this).classed("active", true);

        const targetId = d3.select(this).attr("data-target");

        d3.selectAll(".influence-chart-view").style("display", "none");
        d3.select(`#${targetId}`).style("display", "block");

        if (targetId === "influence-scatter-plot") {
            d3.select("#inf-insight-title").html(INFLUENCE_INSIGHTS.scatter.title);
            d3.select("#inf-insight-body").html(INFLUENCE_INSIGHTS.scatter.body);
            if (!rendered.scatter) {
                renderScatterPlot(reliableDataset, localMedian, tooltip);
                rendered.scatter = true;
            }
        } else if (targetId === "influence-box-plot") {
            d3.select("#inf-insight-title").html(INFLUENCE_INSIGHTS.box.title);
            d3.select("#inf-insight-body").html(INFLUENCE_INSIGHTS.box.body);
            if (!rendered.box) {
                renderBoxPlot(comparisonDataset, tooltip);
                rendered.box = true;
            }
        } else if (targetId === "influence-stacked-bar") {
            d3.select("#inf-insight-title").html(INFLUENCE_INSIGHTS.stacked.title);
            d3.select("#inf-insight-body").html(INFLUENCE_INSIGHTS.stacked.body);
            if (!rendered.stacked) {
                renderStackedBar(comparisonDataset, tooltip);
                rendered.stacked = true;
            }
        }
    });
}

// ==========================================
// 1. 散点气泡图
// ==========================================
function renderScatterPlot(dataset, localMedian, tooltip) {
    const container = d3.select("#influence-scatter-plot");
    container.selectAll("*").remove();

    const margin = { top: 35, right: 30, bottom: 75, left: 70 };
    const parentWidth = d3.select("#chart-influence-analysis").node().getBoundingClientRect().width;
    const width = (parentWidth > 0 ? parentWidth : 600) - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleLog()
        .domain([d3.min(dataset, d => d.count), d3.max(dataset, d => d.count) * 1.5])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([d3.min(dataset, d => d.median) * 0.95, d3.max(dataset, d => d.median) * 1.05])
        .range([height, 0]);

    const rScale = d3.scaleSqrt()
        .domain([0, d3.max(dataset, d => d.top_5_count)])
        .range([4, 24]);

    svg.append("g").attr("transform", `translate(0, ${height})`).call(d3.axisBottom(xScale).ticks(5, ",d"));
    svg.append("g").call(d3.axisLeft(yScale));

    svg.append("text")
        .attr("x", width / 2).attr("y", height + 50)
        .attr("text-anchor", "middle").attr("fill", "var(--text-muted)")
        .style("font-size", "12px").text("该国希腊科学家总规模");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2).attr("y", -52)
        .attr("text-anchor", "middle").attr("fill", "var(--text-muted)")
        .style("font-size", "12px").text("学术影响力中位数 (综合指数)");

    // 本土基准线
    svg.append("line")
        .attr("x1", 0).attr("x2", width)
        .attr("y1", yScale(localMedian)).attr("y2", yScale(localMedian))
        .attr("stroke", "var(--red)").attr("stroke-width", 1.5).attr("stroke-dasharray", "4,4");

    svg.append("text")
        .attr("x", width - 50).attr("y", yScale(localMedian) + 15)
        .attr("text-anchor", "end").attr("fill", "var(--red)")
        .style("font-size", "11px").style("font-weight", "500")
        .text(`希腊本土学术水平基准线 (${localMedian.toFixed(2)})`);

    svg.selectAll(".scatter-dot")
        .data(dataset).enter().append("circle").attr("class", "scatter-dot")
        .attr("cx", d => xScale(d.count)).attr("cy", d => yScale(d.median)).attr("r", d => rScale(d.top_5_count))
        .attr("fill", d => d.country === 'grc' ? 'var(--navy)' : 'var(--blue)')
        .attr("fill-opacity", d => d.country === 'grc' ? 0.95 : 0.6).attr("stroke", "#fff")
        .on("mouseover", (e, d) => {
            tooltip.transition().duration(100).style("opacity", 1);
            tooltip.html(`<strong>${getCountryFullName(d.country)}</strong><br/>科学家总数: ${d.count}人<br/>影响力中位数: ${d.median.toFixed(2)}<br/>前5%大牛数: ${d.top_5_count}人`);
        })
        .on("mousemove", e => tooltip.style("left", (e.clientX + 15) + "px").style("top", (e.clientY - 15) + "px"))
        .on("mouseout", () => tooltip.transition().duration(100).style("opacity", 0));

    const labels = ['grc', 'usa', 'gbr', 'deu', 'can'];
    svg.selectAll(".dot-lbl").data(dataset.filter(d => labels.includes(d.country))).enter().append("text")
        .attr("x", d => xScale(d.count)).attr("y", d => yScale(d.median) - rScale(d.top_5_count) - 5)
        .attr("text-anchor", "middle").style("font-size", "11px").style("font-weight", "600")
        .attr("fill", "var(--navy)")
        .text(d => d.country === 'grc' ? `希腊本土 (${getCountryFullName(d.country)})` : getCountryFullName(d.country));

    const legendGroup = svg.append("g").attr("transform", `translate(${width - 220}, ${10})`);
    legendGroup.append("circle").attr("cx", 0).attr("cy", 2).attr("r", 6).attr("fill", "none").attr("stroke", "var(--text-subtle)");
    legendGroup.append("text").attr("x", 14).attr("y", 6).attr("fill", "var(--text-muted)").style("font-size", "11px").text("气泡面积代表前 5% 顶尖高产学者数量");
}

// ==========================================
// 2. 箱线图
// ==========================================
function renderBoxPlot(dataset, tooltip) {
    const container = d3.select("#influence-box-plot");
    container.selectAll("svg").remove();

    const margin = { top: 35, right: 30, bottom: 75, left: 70 };
    const parentWidth = d3.select("#chart-influence-analysis").node().getBoundingClientRect().width;
    const width = (parentWidth > 0 ? parentWidth : 600) - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleBand().domain(dataset.map(d => d.country.toUpperCase())).range([0, width]).padding(0.4);
    const y = d3.scaleLinear().domain([0, d3.max(dataset, d => d.upper_whisker) * 1.05]).range([height, 0]);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickFormat(d => d === 'GRC' ? 'Greece (本土)' : getCountryFullName(d)));
    svg.selectAll("text")
        .attr("transform", "rotate(-15)")
        .style("text-anchor", "start").attr("dx", "-30px").attr("dy", "15px");

    svg.append("g").call(d3.axisLeft(y));

    svg.append("text")
        .attr("x", width / 2).attr("y", height + 50)
        .attr("text-anchor", "middle").attr("fill", "var(--text-muted)")
        .style("font-size", "12px").text("希腊本土 vs 移居前 10 大核心目的地");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2).attr("y", -52)
        .attr("text-anchor", "middle").attr("fill", "var(--text-muted)")
        .style("font-size", "12px").text("个别学术影响力分布域值");

    svg.selectAll(".vertLine").data(dataset).enter().append("line")
        .attr("x1", d => x(d.country.toUpperCase()) + x.bandwidth()/2)
        .attr("x2", d => x(d.country.toUpperCase()) + x.bandwidth()/2)
        .attr("y1", d => y(d.lower_whisker)).attr("y2", d => y(d.upper_whisker))
        .attr("stroke", "var(--text-muted)");

    svg.selectAll(".box-rect").data(dataset).enter().append("rect").attr("class", "box-rect")
        .attr("x", d => x(d.country.toUpperCase())).attr("y", d => y(d.q3))
        .attr("width", x.bandwidth()).attr("height", d => y(d.q1) - y(d.q3))
        .attr("fill", d => d.country.toLowerCase() === 'grc' ? '#2f6ca1' : 'var(--bg-cool)')
        .attr("stroke-width", d => d.country.toLowerCase() === 'grc' ? 2 : 1)
        .attr("fill-opacity", d => d.country.toLowerCase() === 'grc' ? 0.9 : 0.7)
        .on("mouseover", (e, d) => {
            tooltip.transition().duration(100).style("opacity", 1);
            tooltip.html(`<strong>${d.country.toLowerCase() === 'grc' ? 'Greece (本土)' : getCountryFullName(d.country)} 影响分布明细</strong><br/>上边缘(Max): ${d.upper_whisker.toFixed(2)}<br/>上四分位(Q3): ${d.q3.toFixed(2)}<br/>中位数(Median): ${d.median.toFixed(2)}<br/>下四分位(Q1): ${d.q1.toFixed(2)}<br/>下边缘(Min): ${d.lower_whisker.toFixed(2)}`);
        })
        .on("mousemove", e => tooltip.style("left", (e.clientX + 15) + "px").style("top", (e.clientY - 15) + "px"))
        .on("mouseout", () => tooltip.transition().duration(100).style("opacity", 0));

    svg.selectAll(".medLine").data(dataset).enter().append("line")
        .attr("x1", d => x(d.country.toUpperCase())).attr("x2", d => x(d.country.toUpperCase()) + x.bandwidth())
        .attr("y1", d => y(d.median)).attr("y2", d => y(d.median))
        .attr("stroke", "var(--red)").attr("stroke-width", 2.5);

    const localData = dataset.find(d => d.country.toLowerCase() === 'grc');
    if (localData) {
        svg.append("line")
            .attr("x1", 0).attr("x2", width)
            .attr("y1", y(localData.median)).attr("y2", y(localData.median))
            .attr("stroke", "#f4c348").attr("stroke-width", 1).attr("stroke-dasharray", "3,3");
    }

    const boxLegend = svg.append("g").attr("transform", `translate(${width - 250}, ${5})`);
    boxLegend.append("line").attr("x1", 0).attr("x2", 15).attr("y1", 5).attr("y2", 5)
        .attr("stroke", "var(--red)").attr("stroke-width", 2);
    boxLegend.append("text").attr("x", 22).attr("y", 9).attr("fill", "var(--text-muted)")
        .style("font-size", "11px").text("红色粗线代表该国希腊科学家影响力中位数");
}

// ==========================================
// 3. 堆叠条形图
// ==========================================
function renderStackedBar(dataset, tooltip) {
    const container = d3.select("#influence-stacked-bar");
    container.selectAll("svg").remove();

    const margin = { top: 50, right: 30, bottom: 75, left: 70 };
    const parentWidth = d3.select("#chart-influence-analysis").node().getBoundingClientRect().width;
    const width = (parentWidth > 0 ? parentWidth : 600) - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const processedData = dataset.map(d => {
        const p1 = (d.top_1_count / d.count) * 100;
        const p5 = ((d.top_5_count - d.top_1_count) / d.count) * 100;
        return { country: d.country.toUpperCase(), raw: d, top_1: p1, top_5: p5, other: 100 - p1 - p5 };
    });

    const stack = d3.stack().keys(['top_1', 'top_5', 'other']);
    const layers = stack(processedData);

    const x = d3.scaleBand().domain(processedData.map(d => d.country)).range([0, width]).padding(0.4);
    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    const color = d3.scaleOrdinal().domain(['top_1', 'top_5', 'other']).range(['#10325c', '#2b6f9f', '#e8eff5']);

    svg.append("g").attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickFormat(d => d === 'GRC' ? 'Greece (本土)' : getCountryFullName(d)));
    svg.selectAll("text")
        .attr("transform", "rotate(-15)").style("text-anchor", "start")
        .attr("dx", "-30px").attr("dy", "15px");

    svg.append("g").call(d3.axisLeft(y).tickFormat(d => d + "%"));

    svg.append("text").attr("x", width / 2).attr("y", height + 50)
        .attr("text-anchor", "middle").attr("fill", "var(--text-muted)")
        .style("font-size", "12px").text("希腊本土 vs 移居前 10 大核心目的地");

    svg.append("text").attr("transform", "rotate(-90)")
        .attr("x", -height / 2).attr("y", -52)
        .attr("text-anchor", "middle").attr("fill", "var(--text-muted)")
        .style("font-size", "12px").text("科学家内部梯队群体结构占比 (%)");

    svg.selectAll(".layer").data(layers).enter().append("g").attr("class", "layer").attr("fill", d => color(d.key))
        .selectAll("rect").data(d => d).enter().append("rect").attr("class", "bar-layer")
        .attr("x", d => x(d.data.country)).attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1])).attr("width", x.bandwidth())
        .attr("stroke-width", d => d.data.country === 'GRC' ? 1.5 : 0)
        .on("mouseover", function(e, d) {
            const key = d3.select(this.parentNode).datum().key;
            let title = key === 'top_1' ? '全球 Top 1% 极尖科研学阀' : (key === 'top_5' ? '全球 Top 5% 顶尖科学家' : '中坚科研力量');
            let percentage = (d[1] - d[0]).toFixed(1);
            tooltip.transition().duration(100).style("opacity", 1);
            tooltip.html(`<strong>${d.data.country === 'GRC' ? 'Greece (本土)' : getCountryFullName(d.data.country)} - ${title}</strong><br/>梯队占比: ${percentage}%<br/>该群体真实人数: ${key==='top_1'? d.data.raw.top_1_count : (key==='top_5'? (d.data.raw.top_5_count - d.data.raw.top_1_count) : (d.data.raw.count - d.data.raw.top_5_count))}人`);
        })
        .on("mousemove", e => tooltip.style("left", (e.clientX + 15) + "px").style("top", (e.clientY - 15) + "px"))
        .on("mouseout", () => tooltip.transition().duration(100).style("opacity", 0));

    const legendItems = [
        { label: "Top 1% 领军人才", color: "#10325c" },
        { label: "Top 5% 顶尖学者", color: "#2b6f9f" },
        { label: "其他中坚学者", color: "#e8eff5" }
    ];
    const barLegendGroup = svg.append("g").attr("transform", `translate(${width / 2 - 170}, ${-30})`);
    legendItems.forEach((item, index) => {
        const itemGroup = barLegendGroup.append("g").attr("transform", `translate(${index * 130}, 0)`);
        itemGroup.append("rect").attr("width", 14).attr("height", 14).attr("rx", 2)
            .attr("fill", item.color).attr("stroke", "#d6dee8");
        itemGroup.append("text").attr("x", 22).attr("y", 11)
            .attr("fill", "var(--text-muted)").style("font-size", "11px").style("font-weight", "500")
            .text(item.label);
    });
}
