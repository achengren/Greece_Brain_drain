/**
 * 顶尖人才迁移图
 * 展示 Top 1%/5% 科学家的国家分布
 */
function renderTopTalent(data) {
    const container = document.getElementById('chart-top-talent');
    const width = container.clientWidth || 600;
    const height = 400;
    const margin = { top: 20, right: 120, bottom: 50, left: 100 };

    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container).append('svg')
        .attr('width', width).attr('height', height);

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const topN = data.slice(0, 15).reverse();

    const x = d3.scaleLinear()
        .domain([0, d3.max(topN, d => d.total)])
        .range([0, innerW]);

    const y = d3.scaleBand()
        .domain(topN.map(d => d.country))
        .range([0, innerH])
        .padding(0.3);

    // 分组柱状图：国内(红色) + 海外(蓝色)
    g.selectAll('rect.domestic')
        .data(topN)
        .join('rect')
        .attr('class', 'domestic')
        .attr('y', d => y(d.country))
        .attr('x', d => x(0))
        .attr('width', d => x(d.domestic))
        .attr('height', y.bandwidth() / 2)
        .attr('fill', '#e63946');

    g.selectAll('rect.overseas')
        .data(topN)
        .join('rect')
        .attr('class', 'overseas')
        .attr('y', d => y(d.country) + y.bandwidth() / 2)
        .attr('x', d => x(0))
        .attr('width', d => x(d.overseas))
        .attr('height', y.bandwidth() / 2)
        .attr('fill', '#1a759f');

    g.append('g').call(d3.axisLeft(y));
    g.append('g').call(d3.axisBottom(x).ticks(5))
        .attr('transform', `translate(0,${innerH})`);

    // 图例
    const legend = svg.append('g').attr('transform', `translate(${innerW + margin.left + 10},${margin.top})`);
    legend.append('rect').attr('width', 12).attr('height', 12).attr('fill', '#e63946');
    legend.append('text').attr('x', 18).attr('y', 10).attr('font-size', 12).text('本土');
    legend.append('rect').attr('y', 20).attr('width', 12).attr('height', 12).attr('fill', '#1a759f');
    legend.append('text').attr('x', 18).attr('y', 30).attr('font-size', 12).text('海外');
}
