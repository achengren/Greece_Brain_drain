/**
 * 学术年龄分析：分组柱状图/面积图
 * 展示各年龄段的本土/海外分布及海外占比趋势
 */
function renderAcademicAge(data) {
    const container = document.getElementById('chart-age');
    const width = container.clientWidth || 600;
    const height = 350;
    const margin = { top: 20, right: 20, bottom: 50, left: 60 };

    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container).append('svg')
        .attr('width', width).attr('height', height);

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
        .domain(data.map(d => d.age_group))
        .range([0, innerW])
        .padding(0.3);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.total)])
        .range([innerH, 0]);

    const color = d3.scaleOrdinal()
        .domain(['domestic', 'overseas'])
        .range(['#e63946', '#1a759f']);

    // 分组柱状图
    const groups = ['domestic', 'overseas'];
    const subBand = d3.scaleBand()
        .domain(groups)
        .range([0, x.bandwidth()])
        .padding(0.1);

    data.forEach(d => {
        groups.forEach(grp => {
            const val = grp === 'domestic' ? d.domestic : d.overseas;
            g.append('rect')
                .attr('x', x(d.age_group) + subBand(grp))
                .attr('y', y(val))
                .attr('width', subBand.bandwidth())
                .attr('height', innerH - y(val))
                .attr('fill', color(grp))
                .attr('rx', 2);
        });
    });

    // 海外占比折线 (右侧轴)
    const y2 = d3.scaleLinear().domain([0, 100]).range([innerH, 0]);

    const line = d3.line()
        .x(d => x(d.age_group) + x.bandwidth() / 2)
        .y(d => y2(d.overseas_pct));

    g.append('path')
        .datum(data)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', '#2a9d8f')
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', '4,4');

    g.append('g').call(d3.axisLeft(y).ticks(5));
    g.append('g').call(d3.axisBottom(x)).attr('transform', `translate(0,${innerH})`)
        .selectAll('text').attr('transform', 'rotate(-20)').style('text-anchor', 'end');
}
