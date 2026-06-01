function renderTopTalent(data) {
    const container = document.getElementById('chart-top-talent');
    const width = container.clientWidth || 640;
    const height = 420;
    const margin = { top: 22, right: 112, bottom: 44, left: 116 };

    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container).append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const topN = data.slice(0, 15).reverse();

    const x = d3.scaleLinear().domain([0, d3.max(topN, d => d.total) || 1]).range([0, innerW]).nice();
    const y = d3.scaleBand().domain(topN.map(d => d.country)).range([0, innerH]).padding(0.3);

    g.selectAll('rect.domestic')
        .data(topN)
        .join('rect')
        .attr('class', 'domestic')
        .attr('y', d => y(d.country))
        .attr('width', d => x(d.domestic || 0))
        .attr('height', y.bandwidth() / 2)
        .attr('fill', '#b33636');

    g.selectAll('rect.overseas')
        .data(topN)
        .join('rect')
        .attr('class', 'overseas')
        .attr('y', d => y(d.country) + y.bandwidth() / 2)
        .attr('width', d => x(d.overseas || 0))
        .attr('height', y.bandwidth() / 2)
        .attr('fill', '#2b6f9f');

    g.append('g')
        .call(d3.axisLeft(y).tickFormat(d => COUNTRY_LABELS[d] || String(d).toUpperCase()))
        .call(axis => axis.select('.domain').remove())
        .call(axis => axis.selectAll('text').attr('fill', '#4a4a4a').attr('font-size', '12px'));

    g.append('g')
        .attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(x).ticks(5))
        .call(axis => axis.selectAll('text').attr('fill', '#6e6e6e').attr('font-size', '12px'));

    const legend = svg.append('g').attr('transform', `translate(${width - margin.right + 8},${margin.top})`);
    legend.append('rect').attr('width', 12).attr('height', 12).attr('fill', '#b33636').attr('rx', 2);
    legend.append('text').attr('x', 18).attr('y', 10).attr('font-size', 12).attr('fill', '#6e6e6e').text('Domestic');
    legend.append('rect').attr('y', 22).attr('width', 12).attr('height', 12).attr('fill', '#2b6f9f').attr('rx', 2);
    legend.append('text').attr('x', 18).attr('y', 32).attr('font-size', 12).attr('fill', '#6e6e6e').text('Overseas');
}
