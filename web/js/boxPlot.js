function renderBoxPlot(diasporaData) {
    const container = document.getElementById('chart-boxplot');
    const width = container.clientWidth || 640;
    const height = 380;
    const margin = { top: 30, right: 30, bottom: 50, left: 62 };

    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container).append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const groups = ['domestic', 'overseas'];
    const labels = { domestic: 'Domestic', overseas: 'Overseas' };
    const colors = { domestic: '#b33636', overseas: '#2b6f9f' };

    const x = d3.scaleBand().domain(groups).range([0, innerW]).padding(0.46);
    const yMax = d3.max(diasporaData, d => d.nc_percentiles ? d.nc_percentiles[d.nc_percentiles.length - 1] : 0) || 1;
    const y = d3.scaleLinear().domain([0, yMax]).range([innerH, 0]).nice();

    const axisStyle = axis => axis.selectAll('text').attr('fill', '#6e6e6e').attr('font-size', '12px');

    g.append('g').call(d3.axisLeft(y).ticks(5)).call(axisStyle);
    g.append('g')
        .attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(x).tickFormat(d => labels[d] || d))
        .call(axisStyle);

    diasporaData.forEach(d => {
        const p = d.nc_percentiles;
        if (!p || !x(d.group)) return;

        const cx = x(d.group) + x.bandwidth() / 2;
        const q1 = p[5] || 0;
        const median = p[10] || 0;
        const q3 = p[15] || 0;
        const min = p[0] || 0;
        const max = p[p.length - 1] || 0;

        g.append('line')
            .attr('x1', cx)
            .attr('x2', cx)
            .attr('y1', y(min))
            .attr('y2', y(max))
            .attr('stroke', '#888');

        g.append('rect')
            .attr('x', x(d.group))
            .attr('y', y(q3))
            .attr('width', x.bandwidth())
            .attr('height', Math.max(1, y(q1) - y(q3)))
            .attr('fill', colors[d.group])
            .attr('opacity', 0.6)
            .attr('rx', 4);

        g.append('line')
            .attr('x1', x(d.group))
            .attr('x2', x(d.group) + x.bandwidth())
            .attr('y1', y(median))
            .attr('y2', y(median))
            .attr('stroke', '#1a1a1a')
            .attr('stroke-width', 2);
    });
}
