function renderQualityBoxPlot(rawData) {
    if (!rawData || !rawData.distribution) {
        renderLegacyBoxPlot(rawData || []);
        return;
    }

    const container = document.getElementById('chart-boxplot');
    container.innerHTML = '';

    const metric = (rawData.metrics || []).find(d => d.key === 'top_percentile_ns');
    const dist = rawData.distribution.top_percentile_ns;
    if (!metric || !dist || !Array.isArray(dist.groups)) {
        container.innerHTML = '<div class="chart-placeholder"><strong>排名分布缺失</strong><span>quality_comparison.json 中没有 top percentile 数据。</span></div>';
        return;
    }

    const colors = { domestic: '#b33636', overseas: '#2b6f9f' };
    const labels = { domestic: '本土', overseas: '海外' };
    const domestic = dist.groups.find(d => d.group === 'domestic');
    const overseas = dist.groups.find(d => d.group === 'overseas');

    const header = document.createElement('div');
    header.className = 'quality-chart-head';
    header.innerHTML = `
        <div>
            <h3>海外科学家更集中在学科前列</h3>
            <p class="quality-chart-note">固定使用学科内排名百分位：数值越低、位置越靠上，代表在本学科中排名越靠前。</p>
        </div>
    `;
    container.appendChild(header);

    const summary = document.createElement('div');
    summary.className = 'quality-summary-row quality-impact-summary';
    container.appendChild(summary);

    const topBars = document.createElement('div');
    topBars.className = 'quality-top-bars';
    container.appendChild(topBars);

    const chart = document.createElement('div');
    chart.className = 'quality-violin-canvas quality-impact-canvas';
    container.appendChild(chart);

    const footnote = document.createElement('div');
    footnote.className = 'quality-footnote';
    footnote.textContent = `样本量：本土 ${d3.format(',')(domestic.count)} 人，海外 ${d3.format(',')(overseas.count)} 人。分布图中的淡点为抽样个体，箱线和小提琴形状展示整体排名分布。`;
    container.appendChild(footnote);

    const svgNS = 'http://www.w3.org/2000/svg';

    function svgEl(name, attrs) {
        const el = document.createElementNS(svgNS, name);
        Object.entries(attrs || {}).forEach(([key, value]) => el.setAttribute(key, value));
        return el;
    }

    function drawText(parent, text, x, y, attrs) {
        const el = svgEl('text', { x, y, ...attrs });
        el.textContent = text;
        parent.appendChild(el);
        return el;
    }

    function formatPercent(value, digits = 1) {
        if (value == null || !Number.isFinite(Number(value))) return '--';
        return `${Number(value).toFixed(digits)}%`;
    }

    function formatShare(value) {
        const pct = Number(value) * 100;
        if (pct < 1) return `${pct.toFixed(2)}%`;
        return `${pct.toFixed(1)}%`;
    }

    function stableJitter(text, width) {
        let hash = 0;
        for (let i = 0; i < text.length; i += 1) {
            hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
        }
        const unit = (Math.abs(hash) % 1000) / 1000;
        return (unit - 0.5) * width;
    }

    function getTopTalentRows() {
        const domesticTalent = (rawData.top_talent || []).find(d => d.group === 'domestic');
        const overseasTalent = (rawData.top_talent || []).find(d => d.group === 'overseas');
        if (!domesticTalent || !overseasTalent) return [];

        return overseasTalent.thresholds.map(item => {
            const domesticItem = domesticTalent.thresholds.find(d => d.key === item.key) || { count: 0, share: 0 };
            return {
                key: item.key,
                label: item.label,
                domesticCount: domesticItem.count,
                overseasCount: item.count,
                domesticShare: domesticItem.share,
                overseasShare: item.share
            };
        });
    }

    function updateSummary() {
        const topRows = getTopTalentRows();
        const top1 = topRows.find(d => d.key === 'top1');
        const top10 = topRows.find(d => d.key === 'top10');
        const medianGap = domestic.raw.median - overseas.raw.median;

        summary.innerHTML = `
            <div class="quality-stat">
                <span>中位排名</span>
                <strong>海外靠前 ${medianGap.toFixed(1)}pp</strong>
                <em>海外 ${formatPercent(overseas.raw.median)} ｜ 本土 ${formatPercent(domestic.raw.median)}</em>
            </div>
            <div class="quality-stat">
                <span>Top 1% 占比</span>
                <strong>海外 ${formatShare(top1.overseasShare)}</strong>
                <em>本土 ${formatShare(top1.domesticShare)}</em>
            </div>
            <div class="quality-stat">
                <span>Top 10% 占比</span>
                <strong>海外 ${formatShare(top10.overseasShare)}</strong>
                <em>本土 ${formatShare(top10.domesticShare)}</em>
            </div>
        `;
    }

    function updateTopBars() {
        const rows = getTopTalentRows();
        const maxShare = Math.max(...rows.flatMap(d => [d.domesticShare, d.overseasShare]), 0.01);

        topBars.innerHTML = `
            <div class="quality-top-bars-note">
                <strong>顶尖人才比例</strong>
                <span>横条越长，表示该组进入对应学科排名阈值的人才占比越高。</span>
            </div>
            ${rows.map(row => `
                <div class="quality-top-bar-row">
                    <span class="quality-top-bar-label">${row.label}</span>
                    <div class="quality-top-bar-pair">
                        <div class="quality-top-bar-line">
                            <span>本土</span>
                            <div class="quality-top-bar-track">
                                <i style="width:${Math.max(2, row.domesticShare / maxShare * 100)}%; background:${colors.domestic};"></i>
                            </div>
                            <em>${formatShare(row.domesticShare)}</em>
                        </div>
                        <div class="quality-top-bar-line">
                            <span>海外</span>
                            <div class="quality-top-bar-track">
                                <i style="width:${Math.max(2, row.overseasShare / maxShare * 100)}%; background:${colors.overseas};"></i>
                            </div>
                            <em>${formatShare(row.overseasShare)}</em>
                        </div>
                    </div>
                </div>
            `).join('')}
        `;
    }

    function drawChart() {
        chart.innerHTML = '';

        const width = container.clientWidth || 680;
        const height = Math.max(410, Math.min(520, width * 0.52));
        const margin = { top: 42, right: 36, bottom: 54, left: 78 };
        const innerW = width - margin.left - margin.right;
        const innerH = height - margin.top - margin.bottom;
        const groups = ['domestic', 'overseas'];
        const band = innerW / groups.length;
        const boxW = Math.min(64, band * 0.28);
        const maxBinCount = Math.max(1, Number(dist.max_bin_count) || 1);

        function groupCenter(group) {
            const index = groups.indexOf(group);
            return margin.left + band * index + band / 2;
        }

        function yScale(value) {
            const v = Math.max(0, Math.min(100, Number(value) || 0));
            return margin.top + (v / 100) * innerH;
        }

        function widthScale(value) {
            return (Number(value) / maxBinCount) * Math.min(128, band * 0.34);
        }

        const svg = svgEl('svg', {
            width,
            height,
            viewBox: `0 0 ${width} ${height}`,
            role: 'img',
            'aria-label': '本土与海外科学家学科排名百分位分布'
        });
        chart.appendChild(svg);

        drawText(svg, '越靠上 = 学科排名越靠前', margin.left, 20, {
            'font-size': 13,
            'font-weight': 700,
            fill: '#10325c'
        });
        svg.appendChild(svgEl('line', {
            x1: margin.left + 156,
            x2: margin.left + 156,
            y1: 25,
            y2: 9,
            stroke: '#10325c',
            'stroke-width': 1.5
        }));
        svg.appendChild(svgEl('path', {
            d: `M${margin.left + 151},14L${margin.left + 156},8L${margin.left + 161},14`,
            fill: 'none',
            stroke: '#10325c',
            'stroke-width': 1.5,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round'
        }));

        [0, 25, 50, 75, 100].forEach(tick => {
            const y = yScale(tick);
            svg.appendChild(svgEl('line', {
                x1: margin.left,
                x2: margin.left + innerW,
                y1: y,
                y2: y,
                stroke: '#e2e9f1',
                'stroke-dasharray': '2 3'
            }));
            drawText(svg, `${tick}%`, margin.left - 12, y + 4, {
                'text-anchor': 'end',
                'font-size': 12,
                fill: '#6e6e6e'
            });
        });

        groups.forEach(group => {
            const cx = groupCenter(group);
            drawText(svg, labels[group], cx, margin.top + innerH + 28, {
                'text-anchor': 'middle',
                'font-size': 13,
                fill: '#6e6e6e'
            });
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

        drawText(svg, '学科内排名百分位', 18, margin.top + innerH / 2, {
            'text-anchor': 'middle',
            'font-size': 13,
            fill: '#6e6e6e',
            transform: `rotate(-90 18 ${margin.top + innerH / 2})`
        });

        dist.groups.forEach(groupData => {
            const cx = groupCenter(groupData.group);
            const bins = (groupData.bins || []).map(bin => ({
                mid: (Number(bin.x0) + Number(bin.x1)) / 2,
                count: Number(bin.count) || 0
            }));
            const right = bins.map(bin => [cx + widthScale(bin.count), yScale(bin.mid)]);
            const left = bins.slice().reverse().map(bin => [cx - widthScale(bin.count), yScale(bin.mid)]);
            const pathPoints = right.concat(left);
            if (pathPoints.length) {
                svg.appendChild(svgEl('path', {
                    d: `M${pathPoints.map(p => `${p[0]},${p[1]}`).join('L')}Z`,
                    fill: colors[groupData.group],
                    opacity: 0.16,
                    stroke: colors[groupData.group],
                    'stroke-width': 1.2
                }));
            }

            const q = groupData.display;
            const yQ1 = yScale(q.q1);
            const yQ3 = yScale(q.q3);
            const yMedian = yScale(q.median);

            svg.appendChild(svgEl('rect', {
                x: cx - boxW / 2,
                y: Math.min(yQ1, yQ3),
                width: boxW,
                height: Math.max(2, Math.abs(yQ1 - yQ3)),
                rx: 4,
                fill: '#ffffff',
                stroke: colors[groupData.group],
                'stroke-width': 1.8
            }));
            svg.appendChild(svgEl('line', {
                x1: cx - boxW / 2,
                x2: cx + boxW / 2,
                y1: yMedian,
                y2: yMedian,
                stroke: '#1a1a1a',
                'stroke-width': 2.4
            }));

            drawText(svg, `${labels[groupData.group]}中位数 ${formatPercent(groupData.raw.median)}`,
                cx + boxW / 2 + 10, yMedian + (groupData.group === 'domestic' ? 18 : -10), {
                    'font-size': 12,
                    'font-weight': 700,
                    fill: colors[groupData.group]
                });
        });

        const jitterData = Array.isArray(rawData.jitter_points) ? rawData.jitter_points : [];
        jitterData.forEach((point, index) => {
            if (index % 2 !== 0) return;
            if (!groups.includes(point.group)) return;
            const value = Number(point.top_percentile_ns);
            if (!Number.isFinite(value)) return;
            const cx = groupCenter(point.group) + stableJitter(`${point.authfull}-${index}`, band * 0.38);
            svg.appendChild(svgEl('circle', {
                cx,
                cy: yScale(value),
                r: 1.35,
                fill: colors[point.group],
                opacity: 0.10
            }));
        });
    }

    updateSummary();
    updateTopBars();
    drawChart();
}

function renderLegacyBoxPlot(diasporaData) {
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
    const labels = { domestic: '本土', overseas: '海外' };
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
