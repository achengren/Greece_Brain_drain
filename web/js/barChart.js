/**
 * Top 10 国家横向柱状图
 */
function renderBarChart(data) {
    const container = document.getElementById('barchart');
    const width = container.clientWidth;
    const height = 450;
    const margin = { top: 20, right: 30, bottom: 40, left: 100 };

    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container).append('svg')
        .attr('width', width)
        .attr('height', height);

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const top10 = data.slice(0, 10).reverse();

    const x = d3.scaleLinear()
        .domain([0, d3.max(top10, d => d.total)])
        .range([0, innerW]);

    const y = d3.scaleBand()
        .domain(top10.map(d => d.country))
        .range([0, innerH])
        .padding(0.2);

    // 柱
    g.selectAll('rect')
        .data(top10)
        .join('rect')
        .attr('y', d => y(d.country))
        .attr('width', d => x(d.total))
        .attr('height', y.bandwidth())
        .attr('fill', d => d.country === 'Greece' ? '#e63946' : '#1a759f')
        .attr('rx', 2);

    // 数值标签
    g.selectAll('text.bar-label')
        .data(top10)
        .join('text')
        .attr('class', 'bar-label')
        .attr('x', d => x(d.total) + 4)
        .attr('y', d => y(d.country) + y.bandwidth() / 2)
        .attr('dy', '0.35em')
        .attr('font-size', '12px')
        .attr('fill', '#333')
        .text(d => d.total.toLocaleString());

    // y轴
    g.append('g').call(d3.axisLeft(y)).attr('font-size', '12px');

    // x轴
    g.append('g')
        .attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(x).ticks(5));
}
