/**
 * 盒须图：本土 vs 海外 的引用 / h-index 分布
 */
function renderBoxPlot(diasporaData) {
    const container = document.getElementById('chart-boxplot');
    const width = container.clientWidth || 600;
    const height = 350;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };

    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container).append('svg')
        .attr('width', width).attr('height', height);

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const groups = ['domestic', 'overseas'];
    const colors = { domestic: '#e63946', overseas: '#1a759f' };

    // 用百分位数数据模拟箱线图
    const x = d3.scaleBand().domain(groups).range([0, innerW]).padding(0.4);
    const y = d3.scaleLinear()
        .domain([0, d3.max(diasporaData, d => d.nc_percentiles ? d.nc_percentiles[20] : 0)])
        .range([innerH, 0]);

    g.append('g').call(d3.axisLeft(y));
    g.append('g').call(d3.axisBottom(x)).attr('transform', `translate(0,${innerH})`);

    diasporaData.forEach(d => {
        const p = d.nc_percentiles;
        if (!p) return;
        const cx = x(d.group) + x.bandwidth() / 2;
        const iqrMin = p[5],  // 25th
              median = p[10], // 50th
              iqrMax = p[15]; // 75th

        // 须
        g.append('line').attr('x1', cx).attr('x2', cx)
            .attr('y1', y(p[0])).attr('y2', y(p[20]))
            .attr('stroke', '#333').attr('stroke-width', 1);
        // 箱
        g.append('rect').attr('x', x(d.group) + x.bandwidth() * 0.2)
            .attr('y', y(iqrMax)).attr('width', x.bandwidth() * 0.6)
            .attr('height', y(iqrMin) - y(iqrMax))
            .attr('fill', colors[d.group]).attr('opacity', 0.6).attr('rx', 3);
        // 中位线
        g.append('line').attr('x1', x(d.group) + x.bandwidth() * 0.2)
            .attr('x2', x(d.group) + x.bandwidth() * 0.8)
            .attr('y1', y(median)).attr('y2', y(median))
            .attr('stroke', '#333').attr('stroke-width', 2);
    });
}
