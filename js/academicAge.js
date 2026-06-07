let groupedData = null;
let detailedData = null;
let currentView = 'grouped';
let ageRange = { start: 0, end: 60 };

document.addEventListener('DOMContentLoaded', () => {
    const groupedBtn = document.getElementById('view-grouped');
    const detailedBtn = document.getElementById('view-detailed');
    const applyRangeBtn = document.getElementById('apply-range');

    if (groupedBtn) {
        groupedBtn.addEventListener('click', () => {
            currentView = 'grouped';
            updateButtons();
            if (groupedData) renderChart(groupedData, 'grouped');
        });
    }

    if (detailedBtn) {
        detailedBtn.addEventListener('click', () => {
            currentView = 'detailed';
            updateButtons();
            if (detailedData) {
                const filteredData = filterByAgeRange(detailedData);
                renderChart(filteredData, 'detailed');
            }
        });
    }

    if (applyRangeBtn) {
        applyRangeBtn.addEventListener('click', () => {
            const startInput = document.getElementById('age-start');
            const endInput = document.getElementById('age-end');
            const start = parseInt(startInput.value) || 0;
            const end = parseInt(endInput.value) || 60;
            
            ageRange.start = Math.max(0, Math.min(60, start));
            ageRange.end = Math.max(0, Math.min(60, end));
            
            if (ageRange.start > ageRange.end) {
                [ageRange.start, ageRange.end] = [ageRange.end, ageRange.start];
            }
            
            startInput.value = ageRange.start;
            endInput.value = ageRange.end;
            
            if (detailedData && currentView === 'detailed') {
                const filteredData = filterByAgeRange(detailedData);
                renderChart(filteredData, 'detailed');
            }
        });
    }

    d3.json('data/processed/academic_age_detailed.json').then(data => {
        detailedData = data;
        if (currentView === 'detailed' && detailedData) {
            const filteredData = filterByAgeRange(detailedData);
            renderChart(filteredData, 'detailed');
        }
    }).catch(err => {
        console.error('Failed to load detailed age data:', err);
    });
});

function updateButtons() {
    const groupedBtn = document.getElementById('view-grouped');
    const detailedBtn = document.getElementById('view-detailed');
    const rangeControls = document.getElementById('range-controls');
    
    if (groupedBtn) {
        groupedBtn.classList.toggle('active', currentView === 'grouped');
    }
    if (detailedBtn) {
        detailedBtn.classList.toggle('active', currentView === 'detailed');
    }
    if (rangeControls) {
        rangeControls.style.display = currentView === 'detailed' ? 'flex' : 'none';
    }
}

function filterByAgeRange(data) {
    return data.filter(d => {
        const age = parseInt(d.age_group);
        return age >= ageRange.start && age <= ageRange.end;
    });
}

function showTooltip(event, content) {
    const tooltip = d3.select('#tooltip');
    tooltip.style('opacity', 1)
        .html(content)
        .style('left', (event.clientX + 16) + 'px')
        .style('top', (event.clientY - 10) + 'px');
}

function hideTooltip() {
    d3.select('#tooltip').style('opacity', 0);
}

function renderAcademicAge(data) {
    groupedData = data;
    if (currentView === 'grouped') {
        renderChart(groupedData, 'grouped');
    } else if (currentView === 'detailed' && detailedData) {
        const filteredData = filterByAgeRange(detailedData);
        renderChart(filteredData, 'detailed');
    } else {
        renderChart(groupedData, 'grouped');
    }
}

function prepareData(data, viewType) {
    return data;
}

function renderChart(data, viewType) {
    const container = document.getElementById('chart-age');
    if (!container) return;

    d3.select(container).selectAll('svg').remove();

    const chartData = prepareData(data, viewType);

    const width = container.clientWidth || 640;
    const height = 480;
    const margin = { top: 50, right: 60, bottom: 100, left: 75 };

    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;
    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const groups = ['domestic', 'overseas'];
    const colors = { domestic: '#b33636', overseas: '#2b6f9f' };

    const x = d3.scaleBand()
        .domain(chartData.map(d => d.age_group))
        .range([0, innerW])
        .padding(viewType === 'detailed' ? 0.35 : 0.25);

    const subBand = d3.scaleBand()
        .domain(groups)
        .range([0, x.bandwidth()])
        .padding(0.12);

    const y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => Math.max(d.domestic, d.overseas)) * 1.15])
        .range([innerH, 0])
        .nice();

    const y2 = d3.scaleLinear()
        .domain([0, Math.max(60, d3.max(chartData, d => d.overseas_pct) * 1.1)])
        .range([innerH, 0]);

    const barGroups = g.selectAll('.bar-group')
        .data(chartData)
        .join('g')
        .attr('class', 'bar-group')
        .attr('transform', d => `translate(${x(d.age_group)},0)`);

    groups.forEach(group => {
        barGroups.append('rect')
            .attr('x', subBand(group))
            .attr('y', innerH)
            .attr('width', subBand.bandwidth())
            .attr('height', 0)
            .attr('fill', colors[group])
            .attr('opacity', 0.88)
            .attr('rx', 3)
            .style('cursor', 'pointer')
            .on('mouseenter', (event, d) => {
                d3.select(event.currentTarget).attr('opacity', 1);
                const count = group === 'domestic' ? d.domestic : d.overseas;
                const label = group === 'domestic' ? '本土科学家' : '海外科学家';
                showTooltip(event, '<strong>' + label + '</strong><br>学术年龄: ' + d.age_group + '岁<br>数量: ' + d3.format(',')(Math.round(count)));
            })
            .on('mousemove', (event) => {
                const tooltip = d3.select('#tooltip');
                tooltip.style('left', (event.clientX + 16) + 'px')
                    .style('top', (event.clientY - 10) + 'px');
            })
            .on('mouseleave', (event) => {
                d3.select(event.currentTarget).attr('opacity', 0.88);
                hideTooltip();
            })
            .transition()
            .duration(800)
            .attr('y', d => y(group === 'domestic' ? d.domestic : d.overseas))
            .attr('height', d => innerH - y(group === 'domestic' ? d.domestic : d.overseas));
    });

    const line = d3.line()
        .x(d => x(d.age_group) + x.bandwidth() / 2)
        .y(d => y2(d.overseas_pct || 0))
        .curve(d3.curveMonotoneX);

    g.append('path')
        .datum(chartData)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', '#1f8a8a')
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', 0)
        .transition()
        .delay(600)
        .duration(800)
        .attr('opacity', 1);

    g.selectAll('.dot')
        .data(chartData)
        .join('circle')
        .attr('class', 'dot')
        .attr('cx', d => x(d.age_group) + x.bandwidth() / 2)
        .attr('cy', d => y2(d.overseas_pct || 0))
        .attr('r', 0)
        .attr('fill', '#1f8a8a')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', (event, d) => {
            d3.select(event.currentTarget).attr('r', viewType === 'detailed' ? 6 : 8);
            showTooltip(event, '<strong>海外占比</strong><br>学术年龄: ' + d.age_group + '岁<br>海外占比: ' + d.overseas_pct.toFixed(1) + '%<br>总人数: ' + d3.format(',')(Math.round(d.total)));
        })
        .on('mousemove', (event) => {
            const tooltip = d3.select('#tooltip');
            tooltip.style('left', (event.clientX + 16) + 'px')
                .style('top', (event.clientY - 10) + 'px');
        })
        .on('mouseleave', (event) => {
            d3.select(event.currentTarget).attr('r', viewType === 'detailed' ? 4 : 5);
            hideTooltip();
        })
        .transition()
        .delay(1000)
        .duration(600)
        .attr('r', viewType === 'detailed' ? 4 : 5);

    const axisStyle = axis => axis.selectAll('text')
        .attr('fill', '#6b7a8a')
        .attr('font-size', viewType === 'detailed' ? '9px' : '11px');

    g.append('g')
        .call(d3.axisLeft(y).ticks(6))
        .call(axisStyle);

    g.append('g')
        .attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', viewType === 'detailed' ? 'rotate(-45)' : 'rotate(-20)')
        .style('text-anchor', 'end')
        .attr('fill', '#6b7a8a')
        .attr('font-size', viewType === 'detailed' ? '9px' : '11px');

    g.append('g')
        .attr('transform', `translate(${innerW + 8},0)`)
        .call(d3.axisRight(y2).ticks(5).tickFormat(d => d + '%'))
        .call(axisStyle);

    g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', -58)
        .attr('x', -innerH / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', '13px')
        .attr('fill', '#6b7a8a')
        .text('科学家数量');

    g.append('text')
        .attr('transform', 'rotate(90)')
        .attr('y', innerW + 66)
        .attr('x', innerH / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', '13px')
        .attr('fill', '#1f8a8a')
        .text('海外占比 (%)');

    g.append('text')
        .attr('x', innerW / 2)
        .attr('y', innerH + 75)
        .attr('text-anchor', 'middle')
        .attr('font-size', '13px')
        .attr('fill', '#6b7a8a')
        .text(viewType === 'detailed' ? '学术年龄 (岁)' : '学术年龄分组');

    const legend = svg.append('g').attr('transform', `translate(${innerW - 145}, ${margin.top - 5})`);
    legend.append('rect').attr('width', 14).attr('height', 14).attr('fill', '#b33636').attr('opacity', 0.88).attr('rx', 3);
    legend.append('text').attr('x', 22).attr('y', 11).attr('font-size', '12px').attr('fill', '#6b7a8a').text('本土科学家');
    legend.append('rect').attr('y', 24).attr('width', 14).attr('height', 14).attr('fill', '#2b6f9f').attr('opacity', 0.88).attr('rx', 3);
    legend.append('text').attr('x', 22).attr('y', 35).attr('font-size', '12px').attr('fill', '#6b7a8a').text('海外科学家');
    legend.append('line').attr('x1', 0).attr('y1', 52).attr('x2', 14).attr('y2', 52).attr('stroke', '#1f8a8a').attr('stroke-width', 2.5).attr('stroke-dasharray', '4,4');
    legend.append('text').attr('x', 22).attr('y', 56).attr('font-size', '12px').attr('fill', '#6b7a8a').text('海外占比');
}