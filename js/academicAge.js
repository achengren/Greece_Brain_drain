function renderAcademicAge(data) {
    const container = document.getElementById('chart-age');
    const width = container.clientWidth || 640;
    const height = 380;
    const margin = { top: 22, right: 30, bottom: 58, left: 62 };

    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container).append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const groups = ['domestic', 'overseas'];
    const barColors = { domestic: '#b33636', overseas: '#2b6f9f' };

    const x = d3.scaleBand().domain(data.map(d => d.age_group)).range([0, innerW]).padding(0.3);
    const subBand = d3.scaleBand().domain(groups).range([0, x.bandwidth()]).padding(0.1);
    const y = d3.scaleLinear().domain([0, d3.max(data, d => d.total) || 1]).range([innerH, 0]).nice();
    const y2 = d3.scaleLinear().domain([0, 100]).range([innerH, 0]);

    data.forEach(d => {
        groups.forEach(group => {
            const value = group === 'domestic' ? d.domestic : d.overseas;
            g.append('rect')
                .attr('x', x(d.age_group) + subBand(group))
                .attr('y', y(value || 0))
                .attr('width', subBand.bandwidth())
                .attr('height', innerH - y(value || 0))
                .attr('fill', barColors[group])
                .attr('opacity', 0.75)
                .attr('rx', 3);
        });
    });

    const line = d3.line()
        .x(d => x(d.age_group) + x.bandwidth() / 2)
        .y(d => y2(d.overseas_pct || 0));

    g.append('path')
        .datum(data)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', '#1f8a8a')
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', '4,4');

    const axisStyle = axis => axis.selectAll('text').attr('fill', '#6e6e6e').attr('font-size', '12px');

    g.append('g').call(d3.axisLeft(y).ticks(5)).call(axisStyle);
    g.append('g')
        .attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-20)')
        .style('text-anchor', 'end')
        .attr('fill', '#6e6e6e')
        .attr('font-size', '11px');

    const legend = svg.append('g').attr('transform', `translate(${innerW - 100}, ${margin.top + 8})`);
    legend.append('rect').attr('width', 12).attr('height', 12).attr('fill', '#b33636').attr('opacity', 0.75).attr('rx', 2);
    legend.append('text').attr('x', 18).attr('y', 10).attr('font-size', 12).attr('fill', '#6e6e6e').text('Domestic');
    legend.append('rect').attr('y', 22).attr('width', 12).attr('height', 12).attr('fill', '#2b6f9f').attr('opacity', 0.75).attr('rx', 2);
    legend.append('text').attr('x', 18).attr('y', 32).attr('font-size', 12).attr('fill', '#6e6e6e').text('Overseas');
    legend.append('line').attr('x1', 0).attr('y1', 48).attr('x2', 12).attr('y2', 48).attr('stroke', '#1f8a8a').attr('stroke-width', 2.5).attr('stroke-dasharray', '4,4');
    legend.append('text').attr('x', 18).attr('y', 52).attr('font-size', 12).attr('fill', '#6e6e6e').text('% overseas');
}
