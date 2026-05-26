/**
 * 散点图：发文量 vs 引用量
 * 颜色区分本土/海外，气泡大小表示 Top percentile
 */
function renderScatterPlot(rawData) {
    const container = document.getElementById('chart-scatter');
    const width = container.clientWidth || 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };

    d3.select(container).selectAll('*').remove();

    // 采样（全量 6 万点绘制压力大，取子集）
    const sample = rawData.filter(d => d.np > 0 && d.nc9619 > 0);
    const sampled = sample.length > 5000
        ? sample.sort(() => Math.random() - 0.5).slice(0, 5000)
        : sample;

    const svg = d3.select(container).append('svg')
        .attr('width', width).attr('height', height);

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLog().domain([1, d3.max(sampled, d => d.np)]).range([0, innerW]);
    const y = d3.scaleLog().domain([1, d3.max(sampled, d => d.nc9619)]).range([innerH, 0]);

    const color = d3.scaleOrdinal()
        .domain([0, 1])
        .range(['#e63946', '#1a759f']);

    g.append('g').call(d3.axisBottom(x).ticks(5)).attr('transform', `translate(0,${innerH})`);
    g.append('g').call(d3.axisLeft(y).ticks(5));

    g.append('text').attr('x', innerW / 2).attr('y', innerH + 40)
        .attr('text-anchor', 'middle').attr('font-size', '13px').attr('fill', '#666')
        .text('论文数 (log)');
    g.append('text').attr('x', -innerH / 2).attr('y', -45)
        .attr('text-anchor', 'middle').attr('font-size', '13px').attr('fill', '#666')
        .attr('transform', 'rotate(-90)').text('引用量 (log)');

    g.selectAll('circle')
        .data(sampled)
        .join('circle')
        .attr('cx', d => x(d.np))
        .attr('cy', d => y(d.nc9619))
        .attr('r', 2.5)
        .attr('fill', d => color(d.is_diaspora))
        .attr('opacity', 0.5);
}
