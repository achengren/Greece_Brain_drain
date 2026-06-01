function renderScatterPlot(rawData) {
    const container = document.getElementById('chart-scatter');
    const width = container.clientWidth || 640;
    const height = 420;
    const margin = { top: 24, right: 24, bottom: 54, left: 64 };

    d3.select(container).selectAll('*').remove();

    const sample = rawData.filter(d => d.np > 0 && d.nc9619 > 0);
    const sampled = sample.length > 5000
        ? sample.sort(() => Math.random() - 0.5).slice(0, 5000)
        : sample;

    if (!sampled.length) {
        d3.select(container).append('div')
            .attr('class', 'chart-placeholder')
            .html('<strong>Impact scatter plot</strong><span>Awaiting scatter_sample.json data.</span>');
        return;
    }

    const svg = d3.select(container).append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLog().domain([1, d3.max(sampled, d => d.np) || 1]).range([0, innerW]);
    const y = d3.scaleLog().domain([1, d3.max(sampled, d => d.nc9619) || 1]).range([innerH, 0]);
    const color = d3.scaleOrdinal().domain([0, 1]).range(['#b33636', '#2b6f9f']);

    const axisStyle = axis => axis.selectAll('text').attr('fill', '#6e6e6e').attr('font-size', '12px');

    g.append('g').attr('transform', `translate(0,${innerH})`).call(d3.axisBottom(x).ticks(5)).call(axisStyle);
    g.append('g').call(d3.axisLeft(y).ticks(5)).call(axisStyle);

    g.append('text')
        .attr('x', innerW / 2)
        .attr('y', innerH + 42)
        .attr('text-anchor', 'middle')
        .attr('font-size', 13)
        .attr('fill', '#6e6e6e')
        .text('Number of papers (log)');

    g.append('text')
        .attr('x', -innerH / 2)
        .attr('y', -46)
        .attr('text-anchor', 'middle')
        .attr('font-size', 13)
        .attr('fill', '#6e6e6e')
        .attr('transform', 'rotate(-90)')
        .text('Citations (log)');

    g.selectAll('circle')
        .data(sampled)
        .join('circle')
        .attr('cx', d => x(d.np))
        .attr('cy', d => y(d.nc9619))
        .attr('r', 2.2)
        .attr('fill', d => color(d.is_diaspora))
        .attr('opacity', 0.4);

    const legend = svg.append('g').attr('transform', `translate(${innerW - 100}, ${margin.top + 8})`);
    legend.append('circle').attr('cx', 0).attr('cy', -3).attr('r', 5).attr('fill', '#b33636').attr('opacity', 0.6);
    legend.append('text').attr('x', 12).attr('y', 1).attr('font-size', 12).attr('fill', '#6e6e6e').text('Domestic');
    legend.append('circle').attr('cx', 0).attr('cy', 16).attr('r', 5).attr('fill', '#2b6f9f').attr('opacity', 0.6);
    legend.append('text').attr('x', 12).attr('y', 20).attr('font-size', 12).attr('fill', '#6e6e6e').text('Overseas');
}
