function renderTreemap(data) {
    const container = document.getElementById('chart-treemap');
    d3.select(container).selectAll('*').remove();

    if (data) {
        drawTreemap(container, data);
        return;
    }

    fetch('data/processed/by_field.json')
        .then(r => r.json())
        .then(fields => {
            if (fields.length) drawTreemap(container, fields);
            else showPlaceholder(container);
        })
        .catch(() => showPlaceholder(container));
}

function showPlaceholder(container) {
    d3.select(container).append('div')
        .attr('class', 'chart-placeholder')
        .html('<strong>Field treemap</strong><span>Area = scientist count. Color = overseas share.</span>');
}

function drawTreemap(container, fields) {
    const width = container.clientWidth || 640;
    const height = 420;
    const margin = { top: 16, right: 16, bottom: 16, left: 16 };

    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container).append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const root = d3.hierarchy({ children: fields })
        .sum(d => d.scientist_count)
        .sort((a, b) => b.value - a.value);

    d3.treemap()
        .size([innerW, innerH])
        .padding(3)
        .round(true)(root);

    const color = d3.scaleSequential(d3.interpolateReds)
        .domain([0, d3.max(fields, d => d.overseas_pct) || 100]);

    const tooltip = d3.select('#tooltip');

    g.selectAll('rect')
        .data(root.leaves())
        .join('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => Math.max(0, d.x1 - d.x0))
        .attr('height', d => Math.max(0, d.y1 - d.y0))
        .attr('fill', d => color(d.data.overseas_pct))
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .attr('rx', 3)
        .attr('opacity', 0.88)
        .on('mouseenter', function (event, d) {
            d3.select(this).attr('opacity', 1).attr('stroke', '#10325c');
            tooltip.style('opacity', 1).html(
                `<strong>${d.data.field}</strong>` +
                `${d.data.scientist_count.toLocaleString()} scientists` +
                `<br>Overseas: ${d.data.overseas_pct}%` +
                (d.data.top_1_count ? `<br>Top 1%: ${d.data.top_1_count}` : '')
            );
        })
        .on('mousemove', function (event) {
            tooltip.style('left', (event.clientX + 16) + 'px').style('top', (event.clientY - 10) + 'px');
        })
        .on('mouseleave', function () {
            d3.select(this).attr('opacity', 0.88).attr('stroke', '#fff');
            tooltip.style('opacity', 0);
        });

    g.selectAll('text')
        .data(root.leaves().filter(d => (d.x1 - d.x0) > 50 && (d.y1 - d.y0) > 30))
        .join('text')
        .attr('x', d => (d.x0 + d.x1) / 2)
        .attr('y', d => (d.y0 + d.y1) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-weight', '600')
        .attr('fill', '#1a1a1a')
        .text(d => {
            const short = d.data.field.replace(/ & .*$/, '').replace(/ Sciences?$/, '');
            return short.length > 14 ? short.substring(0, 14) + '…' : short;
        });
}
