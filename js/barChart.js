const COUNTRY_LABELS = {
    grc: 'Greece',
    usa: 'United States',
    gbr: 'United Kingdom',
    deu: 'Germany',
    cyp: 'Cyprus',
    aus: 'Australia',
    fra: 'France',
    can: 'Canada',
    che: 'Switzerland',
    nld: 'Netherlands'
};

let _barSvg = null;
let _barBuilt = false;

function buildBarChart(container, width, height) {
    const margin = { top: 8, right: 16, bottom: 28, left: 98 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    _barSvg = d3.select(container).append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = _barSvg.append('g')
        .attr('class', 'bar-group')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Grid lines
    g.append('g')
        .attr('class', 'bar-grid')
        .attr('transform', `translate(0,${innerH})`);

    // Bars
    g.append('g').attr('class', 'bar-rects');

    // Value labels
    g.append('g').attr('class', 'bar-labels');

    // Y axis
    g.append('g').attr('class', 'bar-yaxis');

    // X axis
    g.append('g')
        .attr('class', 'bar-xaxis')
        .attr('transform', `translate(0,${innerH})`);

    _barSvg.innerW = innerW;
    _barSvg.innerH = innerH;
    _barSvg.margin = margin;
}

function updateBarChart(data) {
    const g = _barSvg.select('g.bar-group');
    const innerW = _barSvg.innerW;
    const innerH = _barSvg.innerH;
    const top10 = data.slice(0, 10);
    const tooltip = d3.select('#tooltip');

    const x = d3.scaleLinear()
        .domain([0, d3.max(top10, d => d.total) || 1])
        .range([0, innerW])
        .nice();

    const y = d3.scaleBand()
        .domain(top10.map(d => d.country))
        .range([0, innerH])
        .padding(0.3);

    // Grid
    g.select('g.bar-grid')
        .transition()
        .duration(300)
        .call(d3.axisBottom(x).ticks(4).tickSize(-innerH).tickFormat(''))
        .call(axis => axis.select('.domain').remove())
        .call(axis => axis.selectAll('line').attr('stroke', '#e8e8e8'));

    // Bars - use keyed data join for smooth updates
    const bars = g.select('g.bar-rects')
        .selectAll('rect')
        .data(top10, d => d.country);

    bars.exit()
        .transition()
        .duration(200)
        .attr('width', 0)
        .remove();

    const barsEnter = bars.enter()
        .append('rect')
        .attr('class', 'bar-rect')
        .attr('x', 0)
        .attr('y', d => y(d.country))
        .attr('width', 0)
        .attr('height', y.bandwidth())
        .attr('fill', d => d.country === 'grc' ? '#b33636' : '#2b6f9f')
        .attr('rx', 2)
        .on('mouseenter', function (event, d) {
            tooltip.style('opacity', 1)
                .html(`<strong>${COUNTRY_LABELS[d.country] || d.country.toUpperCase()}</strong><br>${d.total.toLocaleString()} scientists<br>Top field: ${d.top_field || 'N/A'}${d.median_citation ? '<br>Median citations: ' + d.median_citation.toLocaleString() : ''}<br><span style="color:#8899aa;font-size:11px">Click for details</span>`);
        })
        .on('mousemove', function (event) {
                const left = event.clientX > window.innerWidth / 2
                    ? event.clientX - 200
                    : event.clientX + 16;
                tooltip.style('left', left + 'px').style('top', (event.clientY - 10) + 'px');
            })
        .on('mouseleave', function () {
            tooltip.style('opacity', 0);
        })
        .on('click', function (event, d) {
            setSelectedCountry(d.country, COUNTRY_LABELS[d.country] || d.country.toUpperCase());
        });

    bars.merge(barsEnter)
        .transition()
        .duration(350)
        .attr('y', d => y(d.country))
        .attr('width', d => x(d.total))
        .attr('height', y.bandwidth())
        .attr('fill', d => d.country === 'grc' ? '#b33636' : '#2b6f9f');

    // Value labels
    const labels = g.select('g.bar-labels')
        .selectAll('text')
        .data(top10, d => d.country);

    labels.exit().remove();

    const labelsEnter = labels.enter()
        .append('text')
        .attr('class', 'bar-label')
        .attr('dy', '0.33em')
        .attr('font-size', '11px')
        .attr('font-weight', '700');

    labels.merge(labelsEnter)
        .transition()
        .duration(350)
        .attr('x', d => x(d.total) > 60 ? x(d.total) - 8 : x(d.total) + 6)
        .attr('y', d => y(d.country) + y.bandwidth() / 2)
        .attr('text-anchor', d => x(d.total) > 60 ? 'end' : 'start')
        .attr('fill', d => x(d.total) > 60 ? '#fff' : '#6e6e6e')
        .text(d => d.total.toLocaleString());

    // Y axis
    g.select('g.bar-yaxis')
        .transition()
        .duration(300)
        .call(d3.axisLeft(y).tickFormat(d => COUNTRY_LABELS[d] || String(d).toUpperCase()))
        .call(axis => axis.select('.domain').remove())
        .call(axis => axis.selectAll('line').remove())
        .call(axis => axis.selectAll('text')
            .attr('font-size', '12px')
            .attr('fill', '#4a4a4a')
            .attr('font-weight', d => d === 'grc' ? '700' : '400')
        );

    // X axis
    g.select('g.bar-xaxis')
        .transition()
        .duration(300)
        .call(d3.axisBottom(x).ticks(4).tickFormat(d3.format('~s')))
        .call(axis => axis.select('.domain').attr('stroke', '#ccc'))
        .call(axis => axis.selectAll('text').attr('fill', '#9a9a9a').attr('font-size', '11px'));
}

function renderBarChart(data) {
    const container = document.getElementById('barchart');

    if (!_barBuilt) {
        d3.select(container).selectAll('*').remove();
        const rect = container.getBoundingClientRect();
        const width = rect.width || 300;
        const height = rect.height || 400;
        buildBarChart(container, width, height);
        _barBuilt = true;
        updateBarChart(data);
        return;
    }

    updateBarChart(data);
}
