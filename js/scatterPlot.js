function renderQualityScatterPlot(rawData) {
    if (!rawData || !rawData.scatter) {
        renderLegacyScatterPlot(rawData || []);
        return;
    }

    const container = document.getElementById('chart-scatter');
    container.innerHTML = '';

    const metrics = Array.isArray(rawData.metrics) ? rawData.metrics : [];
    const points = rawData.scatter && Array.isArray(rawData.scatter.points)
        ? rawData.scatter.points.filter(d => Number(d.np) > 0)
        : [];
    const paperBins = rawData.paper_bins && rawData.paper_bins.metrics ? rawData.paper_bins.metrics : {};
    const colors = { domestic: '#b33636', overseas: '#2b6f9f' };
    const labels = { domestic: '本土', overseas: '海外' };
    let selectedMetric = metrics.find(d => d.key === 'c_ns') || metrics[0];

    if (!points.length || !selectedMetric) {
        container.innerHTML = '<div class="chart-placeholder"><strong>产出与影响力散点图</strong><span>quality_comparison.json 中没有可用散点数据。</span></div>';
        return;
    }

    const header = document.createElement('div');
    header.className = 'quality-chart-head';
    header.innerHTML = `
        <div>
            <h3>同等产出下，海外影响力更高吗？</h3>
            <p class="quality-chart-note">淡色点显示个体分布，粗线显示每个论文产出区间的中位数；这样可以避免散点重叠掩盖趋势。</p>
        </div>
    `;

    const control = document.createElement('label');
    control.className = 'quality-control';
    const controlText = document.createElement('span');
    controlText.textContent = '指标';
    const select = document.createElement('select');
    select.className = 'quality-metric-select';
    metrics.forEach(metric => {
        const option = document.createElement('option');
        option.value = metric.key;
        option.textContent = metric.label;
        option.selected = metric.key === selectedMetric.key;
        select.appendChild(option);
    });
    select.addEventListener('change', () => {
        selectedMetric = metrics.find(d => d.key === select.value) || selectedMetric;
        draw();
    });
    control.appendChild(controlText);
    control.appendChild(select);
    header.appendChild(control);
    container.appendChild(header);

    const kpis = document.createElement('div');
    kpis.className = 'quality-kpi-row';
    container.appendChild(kpis);

    const chart = document.createElement('div');
    chart.className = 'quality-scatter-canvas quality-bin-canvas';
    container.appendChild(chart);

    const insight = document.createElement('div');
    insight.className = 'quality-insight';
    container.appendChild(insight);

    const svgNS = 'http://www.w3.org/2000/svg';

    function svgEl(name, attrs) {
        const el = document.createElementNS(svgNS, name);
        Object.entries(attrs || {}).forEach(([key, value]) => el.setAttribute(key, value));
        return el;
    }

    function displayValue(metric, value) {
        const n = Number(value);
        if (!Number.isFinite(n)) return null;
        if (metric.transform === 'percent') return n;
        if (metric.transform === 'log1p') return Math.log1p(Math.max(0, n));
        return n;
    }

    function rawFromDisplay(metric, value) {
        if (metric.transform === 'log1p') return Math.expm1(value);
        return value;
    }

    function formatValue(metric, value) {
        if (value == null || !Number.isFinite(Number(value))) return '--';
        const n = Number(value);
        if (metric.transform === 'percent' || metric.key === 'top_percentile_ns') {
            return `${n.toFixed(n < 1 ? 2 : 1)}%`;
        }
        if (Math.abs(n) >= 100000) return d3.format('.2s')(n).replace('G', 'B');
        if (Math.abs(n) >= 1000) return d3.format(',.0f')(n);
        if (Math.abs(n) >= 10) return d3.format(',.1f')(n);
        return d3.format(',.2f')(n);
    }

    function formatPercentLift(value) {
        if (value == null || !Number.isFinite(Number(value))) return '--';
        return `${(Number(value) * 100).toFixed(0)}%`;
    }

    function drawText(parent, text, x, y, attrs) {
        const el = svgEl('text', { x, y, ...attrs });
        el.textContent = text;
        parent.appendChild(el);
        return el;
    }

    function makeLinePath(points) {
        return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join('');
    }

    function getXTicks(maxValue) {
        const ticks = [1, 10, 100, 1000].filter(t => t <= maxValue);
        if (!ticks.includes(maxValue)) ticks.push(maxValue);
        return ticks;
    }

    function getYTicks(yMax, metric) {
        if (metric.transform === 'percent') return [0, 25, 50, 75, 100];
        const ticks = [];
        const step = yMax / 4 || 1;
        for (let i = 0; i <= 4; i += 1) ticks.push(i * step);
        return ticks;
    }

    function updateKpis() {
        const facts = rawData.narrative_facts || {};
        kpis.innerHTML = `
            <div class="quality-kpi-card">
                <span>Top 1% 占比</span>
                <strong>海外 ${facts.top1_ratio_overseas_to_domestic || '--'} 倍</strong>
                <em>2.48% vs 0.74%</em>
            </div>
            <div class="quality-kpi-card">
                <span>引用数中位数</span>
                <strong>海外高 ${formatPercentLift(facts.median_citation_lift)}</strong>
                <em>206 vs 147</em>
            </div>
            <div class="quality-kpi-card">
                <span>学科排名中位数</span>
                <strong>海外靠前 ${facts.median_percentile_advantage_points || '--'}pp</strong>
                <em>36.57% vs 45.63%</em>
            </div>
        `;
    }

    function updateInsight(metric, bins) {
        const usableBins = bins
            .map(bin => {
                const domestic = bin.groups.find(d => d.group === 'domestic');
                const overseas = bin.groups.find(d => d.group === 'overseas');
                if (!domestic || !overseas || domestic.median == null || overseas.median == null) return null;
                const overseasBetter = metric.higher_is_better
                    ? overseas.median > domestic.median
                    : overseas.median < domestic.median;
                return { bin, domestic, overseas, overseasBetter };
            })
            .filter(Boolean);
        const betterCount = usableBins.filter(d => d.overseasBetter).length;
        const total = usableBins.length || 1;
        const last = usableBins[usableBins.length - 1];
        const direction = metric.higher_is_better ? '更高' : '更靠前';
        const highBinText = last
            ? `在 ${last.bin.label} 篇论文区间，海外中位数为 ${formatValue(metric, last.overseas.median)}，本土为 ${formatValue(metric, last.domestic.median)}。`
            : '';

        insight.innerHTML = `
            <strong>${metric.label}</strong>
            <span>海外组在 ${betterCount}/${total} 个产出区间中位数${direction}。${highBinText}</span>
        `;
    }

    function makeLinePath(points) {
        return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join('');
    }

    function draw() {
        chart.innerHTML = '';
        updateKpis();

        const bins = paperBins[selectedMetric.key] || [];
        if (!bins.length) {
            chart.innerHTML = '<div class="chart-placeholder"><strong>分箱统计缺失</strong><span>quality_comparison.json 中没有 paper_bins。</span></div>';
            return;
        }
        updateInsight(selectedMetric, bins);

        const width = container.clientWidth || 680;
        const height = Math.max(420, Math.min(540, width * 0.58));
        const margin = { top: 28, right: 30, bottom: 72, left: 74 };
        const innerW = width - margin.left - margin.right;
        const innerH = height - margin.top - margin.bottom;

        const xMax = Math.max(1, ...points.map(d => Number(d.np) || 1));
        const logXMax = Math.max(1, Math.log10(xMax));

        const displayStats = [];
        bins.forEach(bin => {
            bin.groups.forEach(group => {
                ['q1', 'median', 'q3'].forEach(stat => {
                    const value = displayValue(selectedMetric, group[stat]);
                    if (value != null) displayStats.push(value);
                });
            });
        });
        const pointDisplayValues = points.map(d => displayValue(selectedMetric, d[selectedMetric.key])).filter(d => d != null);
        const yMax = selectedMetric.transform === 'percent'
            ? 100
            : Math.max(1, d3.quantile(pointDisplayValues.sort((a, b) => a - b), 0.98) || Math.max(...displayStats, 1));

        function xScale(value) {
            const v = Math.max(1, Number(value) || 1);
            return margin.left + (Math.log10(v) / logXMax) * innerW;
        }

        function yScale(value) {
            const v = Math.max(0, Math.min(yMax, Number(value) || 0));
            if (selectedMetric.higher_is_better) {
                return margin.top + innerH - (v / yMax) * innerH;
            }
            return margin.top + (v / yMax) * innerH;
        }

        function binCenter(bin) {
            const meta = (rawData.paper_bins.bins || []).find(d => d.key === bin.key);
            if (!meta) return margin.left;
            const min = meta.min;
            const max = meta.max || xMax;
            return xScale(Math.sqrt(min * max));
        }

        const svg = svgEl('svg', {
            width,
            height,
            viewBox: `0 0 ${width} ${height}`,
            role: 'img',
            'aria-label': '同等论文产出下的本土与海外影响力对比'
        });
        chart.appendChild(svg);

        // Bin bands make the x-axis readable even though it is log-scaled.
        (rawData.paper_bins.bins || []).forEach((bin, index) => {
            const x1 = xScale(bin.min);
            const x2 = xScale(bin.max || xMax);
            svg.appendChild(svgEl('rect', {
                x: x1,
                y: margin.top,
                width: Math.max(1, x2 - x1),
                height: innerH,
                fill: index % 2 ? '#f8fafc' : '#ffffff',
                opacity: 0.86
            }));
            drawText(svg, bin.label, (x1 + x2) / 2, margin.top + innerH + 38, {
                'text-anchor': 'middle',
                'font-size': 12,
                fill: '#6e6e6e'
            });
        });

        getYTicks(yMax, selectedMetric).forEach(tick => {
            const y = yScale(tick);
            svg.appendChild(svgEl('line', {
                x1: margin.left,
                x2: margin.left + innerW,
                y1: y,
                y2: y,
                stroke: '#e2e9f1',
                'stroke-dasharray': '2 3'
            }));
            const raw = rawFromDisplay(selectedMetric, tick);
            drawText(svg, selectedMetric.transform === 'percent' ? `${Math.round(tick)}%` : formatValue(selectedMetric, raw),
                margin.left - 12, y + 4, {
                    'text-anchor': 'end',
                    'font-size': 12,
                    fill: '#6e6e6e'
                });
        });

        getXTicks(xMax).forEach(tick => {
            const x = xScale(tick);
            svg.appendChild(svgEl('line', {
                x1: x,
                x2: x,
                y1: margin.top + innerH,
                y2: margin.top + innerH + 5,
                stroke: '#c8d2df'
            }));
        });

        svg.appendChild(svgEl('line', {
            x1: margin.left,
            x2: margin.left + innerW,
            y1: margin.top + innerH,
            y2: margin.top + innerH,
            stroke: '#c8d2df'
        }));
        svg.appendChild(svgEl('line', {
            x1: margin.left,
            x2: margin.left,
            y1: margin.top,
            y2: margin.top + innerH,
            stroke: '#c8d2df'
        }));

        drawText(svg, '论文数 np 区间（log 缩放）', margin.left + innerW / 2, margin.top + innerH + 62, {
            'text-anchor': 'middle',
            'font-size': 13,
            fill: '#6e6e6e'
        });
        drawText(svg,
            selectedMetric.transform === 'percent' ? '学科内排名百分位（越低越靠前）' : `${selectedMetric.label}（轴为 log(1+x)，标签显示原值）`,
            -(margin.top + innerH / 2), 20, {
                'text-anchor': 'middle',
                'font-size': 13,
                fill: '#6e6e6e',
                transform: 'rotate(-90)'
            });

        // Faint individual points remain as context, but the reading focus is the median line.
        const tooltip = document.getElementById('tooltip');
        points.forEach(point => {
            const yv = displayValue(selectedMetric, point[selectedMetric.key]);
            if (yv == null || !Number.isFinite(yv)) return;
            const circle = svgEl('circle', {
                cx: xScale(point.np),
                cy: yScale(yv),
                r: 1.6,
                fill: colors[point.group] || '#6b7a8a',
                opacity: 0.12,
                stroke: 'transparent',
                'stroke-width': 1.4
            });
            svg.appendChild(circle);
        });

        ['domestic', 'overseas'].forEach(group => {
            const linePoints = [];
            bins.forEach(bin => {
                const groupData = bin.groups.find(d => d.group === group);
                if (!groupData || groupData.median == null) return;
                const median = displayValue(selectedMetric, groupData.median);
                const q1 = displayValue(selectedMetric, groupData.q1);
                const q3 = displayValue(selectedMetric, groupData.q3);
                const x = binCenter(bin);
                const y = yScale(median);
                linePoints.push({ x, y });

                if (q1 != null && q3 != null) {
                    svg.appendChild(svgEl('line', {
                        x1: x,
                        x2: x,
                        y1: yScale(q1),
                        y2: yScale(q3),
                        stroke: colors[group],
                        'stroke-width': 2.2,
                        opacity: 0.42
                    }));
                }

                const dot = svgEl('circle', {
                    cx: x,
                    cy: y,
                    r: 5,
                    fill: colors[group],
                    stroke: '#ffffff',
                    'stroke-width': 1.8
                });
                svg.appendChild(dot);
            });

            if (linePoints.length > 1) {
                svg.appendChild(svgEl('path', {
                    d: makeLinePath(linePoints),
                    fill: 'none',
                    stroke: colors[group],
                    'stroke-width': 3,
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round'
                }));
            }
        });

        ['domestic', 'overseas'].forEach((group, i) => {
            const x = margin.left + i * 78;
            svg.appendChild(svgEl('circle', { cx: x, cy: margin.top - 8, r: 5, fill: colors[group], opacity: 0.9 }));
            drawText(svg, `${labels[group]}中位数`, x + 10, margin.top - 4, {
                'font-size': 12,
                fill: '#526273'
            });
        });
    }

    draw();
}

function renderLegacyScatterPlot(rawData) {
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
            .html('<strong>产出与影响力散点图</strong><span>等待 scatter_sample.json 数据。</span>');
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

    g.selectAll('circle')
        .data(sampled)
        .join('circle')
        .attr('cx', d => x(d.np))
        .attr('cy', d => y(d.nc9619))
        .attr('r', 2.2)
        .attr('fill', d => color(d.is_diaspora))
        .attr('opacity', 0.4);
}
