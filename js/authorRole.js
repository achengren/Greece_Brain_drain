function renderAuthorRole(authorRoleData) {
    const container = document.getElementById('chart-author-role');
    if (!container || !authorRoleData || !authorRoleData.rows) return;

    const rowMap = new Map(authorRoleData.rows.map(d => [`${d.tier}|||${d.field}`, d]));
    const distMap = new Map(authorRoleData.distributions.map(d => [`${d.tier}|||${d.field}|||${d.metric}|||${d.group}`, d]));
    const colors = { domestic: '#b33636', overseas: '#2b6f9f' };
    const labels = { domestic: '本土', overseas: '海外' };
    const metricLabels = {
        lead: '主导作者占比',
        first: '第一作者占比',
        single: '单作者占比'
    };
    const tierLabels = { all: '全部科学家', top_1: 'Top 1%', top_5: 'Top 5%', top_10: 'Top 10%' };
    const state = { metric: 'lead', tier: 'all', sort: 'gap', selectedField: 'All fields' };

    d3.select(container).selectAll('*').remove();

    const root = d3.select(container).append('div').attr('class', 'author-role-explorer');
    const controls = root.append('div').attr('class', 'author-role-controls');
    const body = root.append('div').attr('class', 'author-role-body');
    const mainPanel = body.append('div').attr('class', 'author-role-main');
    const sidePanel = body.append('div').attr('class', 'author-role-side');
    const dumbbellHost = mainPanel.append('div').attr('class', 'author-role-chart-host');
    const visualPanel = sidePanel.append('div').attr('class', 'author-role-side-visuals');
    const distributionHost = visualPanel.append('div').attr('class', 'author-role-distribution');
    const compositionHost = visualPanel.append('div').attr('class', 'author-role-composition');
    const summaryHost = sidePanel.append('div').attr('class', 'author-role-summary');

    addSelect(controls, '指标', 'author-role-metric', [
        { value: 'lead', label: metricLabels.lead },
        { value: 'first', label: metricLabels.first },
        { value: 'single', label: metricLabels.single }
    ], state.metric, value => {
        state.metric = value;
        update();
    });

    addSelect(controls, '人才层级', 'author-role-tier', [
        { value: 'all', label: tierLabels.all },
        { value: 'top_1', label: tierLabels.top_1 },
        { value: 'top_5', label: tierLabels.top_5 },
        { value: 'top_10', label: tierLabels.top_10 }
    ], state.tier, value => {
        state.tier = value;
        state.selectedField = 'All fields';
        update();
    });

    addSelect(controls, '排序', 'author-role-sort', [
        { value: 'gap', label: '按海外-本土差距' },
        { value: 'overseas', label: '按海外中位数' },
        { value: 'count', label: '按科学家人数' },
        { value: 'field', label: '按学科名称' }
    ], state.sort, value => {
        state.sort = value;
        update();
    });

    controls.append('div')
        .attr('class', 'author-role-hint')
        .text('点击左侧学科名查看对应分布');

    update();

    function addSelect(parent, label, id, options, selected, onChange) {
        const wrap = parent.append('label').attr('class', 'author-role-control');
        wrap.append('span').text(label);
        const select = wrap.append('select').attr('id', id);
        select.selectAll('option')
            .data(options)
            .join('option')
            .attr('value', d => d.value)
            .text(d => d.label);
        select.property('value', selected);
        select.on('change', event => onChange(event.target.value));
        return select;
    }

    function update() {
        const rows = getVisibleRows();
        if (!rowMap.has(`${state.tier}|||${state.selectedField}`)) state.selectedField = 'All fields';
        drawDumbbell(rows);
        drawDistribution();
        drawComposition();
        drawSummary();
    }

    function getVisibleRows() {
        const allRow = rowMap.get(`${state.tier}|||All fields`);
        let fieldRows = authorRoleData.rows
            .filter(d => d.tier === state.tier && d.field !== 'All fields' && d.field !== 'Unknown')
            .filter(hasMetric)
            .filter(d => d.domestic_count >= minCount() && d.overseas_count >= minCount());

        fieldRows = fieldRows.sort((a, b) => {
            const am = a.metrics[state.metric];
            const bm = b.metrics[state.metric];
            if (state.sort === 'overseas') return bm.overseas.median - am.overseas.median;
            if (state.sort === 'count') return b.total_count - a.total_count;
            if (state.sort === 'field') return d3.ascending(a.field, b.field);
            return bm.gap - am.gap;
        });

        return [allRow, ...fieldRows.slice(0, 14)].filter(Boolean).filter(hasMetric);
    }

    function minCount() {
        if (state.tier === 'top_1') return 8;
        if (state.tier === 'top_5') return 16;
        if (state.tier === 'top_10') return 24;
        return 80;
    }

    function hasMetric(row) {
        const metric = row.metrics[state.metric];
        return metric && metric.domestic.median !== null && metric.overseas.median !== null && metric.gap !== null;
    }

    function drawDumbbell(rows) {
        dumbbellHost.selectAll('*').remove();

        const hostWidth = dumbbellHost.node().clientWidth || 660;
        const margin = { top: 36, right: 64, bottom: 34, left: hostWidth < 680 ? 196 : 220 };
        const rowHeight = 52;
        const width = Math.max(560, hostWidth);
        const height = Math.max(440, rows.length * rowHeight + margin.top + margin.bottom);
        const innerW = width - margin.left - margin.right;
        const innerH = height - margin.top - margin.bottom;

        const svg = dumbbellHost.append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`);

        svg.append('text')
            .attr('x', margin.left)
            .attr('y', 18)
            .attr('class', 'author-chart-title')
            .text(`各学科${metricLabels[state.metric]}中位数`);

        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
        const x = d3.scaleLinear().domain([0, 1]).range([0, innerW]);
        const y = d3.scaleBand().domain(rows.map(d => d.field)).range([0, innerH]).padding(0.22);

        g.append('g')
            .attr('class', 'author-x-grid')
            .call(d3.axisTop(x).ticks(5).tickSize(-innerH).tickFormat(d => `${Math.round(d * 100)}%`));

        const row = g.selectAll('.author-role-row')
            .data(rows, d => d.field)
            .join('g')
            .attr('class', d => [
                'author-role-row',
                d.field === 'All fields' ? 'all-fields' : '',
                d.field === state.selectedField ? 'selected' : ''
            ].filter(Boolean).join(' '))
            .attr('transform', d => `translate(0,${y(d.field) + y.bandwidth() / 2})`)
            .attr('tabindex', 0)
            .attr('role', 'button')
            .attr('aria-label', d => `查看 ${fieldLabel(d.field)}`)
            .on('click', (_, d) => selectField(d.field))
            .on('keydown', (event, d) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    selectField(d.field);
                }
            });

        row.append('rect')
            .attr('class', 'author-row-hit')
            .attr('x', -margin.left)
            .attr('y', -y.bandwidth() / 2 - 5)
            .attr('width', width)
            .attr('height', y.bandwidth() + 10);

        row.append('line')
            .attr('class', 'author-gap-line')
            .attr('x1', d => x(d.metrics[state.metric].domestic.median))
            .attr('x2', d => x(d.metrics[state.metric].overseas.median))
            .attr('y1', 0)
            .attr('y2', 0);

        row.append('circle')
            .attr('class', 'author-point domestic')
            .attr('cx', d => x(d.metrics[state.metric].domestic.median))
            .attr('r', 5.5)
            .attr('fill', colors.domestic);

        row.append('circle')
            .attr('class', 'author-point overseas')
            .attr('cx', d => x(d.metrics[state.metric].overseas.median))
            .attr('r', 5.5)
            .attr('fill', colors.overseas);

        row.append('text')
            .attr('class', 'author-field-label')
            .attr('x', -14)
            .attr('dy', '-0.1em')
            .text(d => fieldLabel(d.field))
            .call(wrapText, margin.left - 30);

        row.append('text')
            .attr('class', 'author-gap-label')
            .attr('x', innerW + 12)
            .attr('dy', '0.34em')
            .text(d => signedPct(d.metrics[state.metric].gap));

        const legend = svg.append('g').attr('class', 'author-legend').attr('transform', `translate(${margin.left},${height - 12})`);
        drawLegend(legend);

    }

    function selectField(field) {
        state.selectedField = field;
        update();
    }

    function drawDistribution() {
        distributionHost.selectAll('*').remove();

        const selectedRow = rowMap.get(`${state.tier}|||${state.selectedField}`) || rowMap.get(`${state.tier}|||All fields`);
        const width = distributionHost.node().clientWidth || 420;
        const height = 260;
        const margin = { top: 32, right: 22, bottom: 26, left: 48 };
        const innerW = width - margin.left - margin.right;
        const innerH = height - margin.top - margin.bottom;

        const svg = distributionHost.append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`);

        svg.append('text')
            .attr('x', margin.left)
            .attr('y', 18)
            .attr('class', 'author-chart-title')
            .text('作者主导性分布');

        const distributions = ['domestic', 'overseas'].map(group => {
            const item = distMap.get(`${state.tier}|||${selectedRow.field}|||${state.metric}|||${group}`);
            return { group, bins: item ? item.bins : [] };
        });
        const maxShare = d3.max(distributions, d => d3.max(d.bins, b => b.share)) || 0.1;
        const y = d3.scaleLinear().domain([0, 1]).range([innerH, 0]);
        const x = d3.scaleLinear().domain([-maxShare, maxShare]).range([0, innerW]).nice();
        const binHeight = Math.max(3, innerH / 40 - 1);
        const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

        g.append('g')
            .attr('transform', `translate(0,${innerH})`)
            .call(d3.axisBottom(x).ticks(5).tickFormat(d => `${Math.abs(Math.round(d * 100))}%`))
            .call(axis => axis.selectAll('text').attr('class', 'author-axis-text'));

        g.append('g')
            .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${Math.round(d * 100)}%`))
            .call(axis => axis.selectAll('text').attr('class', 'author-axis-text'));

        g.append('line')
            .attr('class', 'author-pyramid-center')
            .attr('x1', x(0))
            .attr('x2', x(0))
            .attr('y1', 0)
            .attr('y2', innerH);

        distributions.forEach(dist => {
            g.selectAll(`.author-pyramid-bar.${dist.group}`)
                .data(dist.bins)
                .join('rect')
                .attr('class', `author-pyramid-bar ${dist.group}`)
                .attr('x', bin => dist.group === 'domestic' ? x(-bin.share) : x(0))
                .attr('y', bin => y(bin.x) - binHeight / 2)
                .attr('width', bin => Math.abs(x(bin.share) - x(0)))
                .attr('height', binHeight)
                .attr('fill', colors[dist.group]);

            const stats = selectedRow.metrics[state.metric][dist.group];
            if (stats.median !== null) {
                g.append('line')
                    .attr('class', 'author-median-line')
                    .attr('x1', dist.group === 'domestic' ? 0 : x(0))
                    .attr('x2', dist.group === 'domestic' ? x(0) : innerW)
                    .attr('y1', y(stats.median))
                    .attr('y2', y(stats.median));
                g.append('text')
                    .attr('class', 'author-median-label')
                    .attr('x', dist.group === 'domestic' ? 4 : innerW - 4)
                    .attr('y', y(stats.median) - 5)
                    .attr('text-anchor', dist.group === 'domestic' ? 'start' : 'end')
                    .text(formatPct(stats.median));
            }
        });

        const splitLabel = g.append('g').attr('class', 'author-pyramid-sides').attr('transform', `translate(${x(0)},-8)`);
        splitLabel.append('text').attr('x', -10).attr('text-anchor', 'end').text(labels.domestic);
        splitLabel.append('text').attr('x', 10).attr('text-anchor', 'start').text(labels.overseas);

    }

    function drawComposition() {
        compositionHost.selectAll('*').remove();

        const selectedRow = rowMap.get(`${state.tier}|||${state.selectedField}`) || rowMap.get(`${state.tier}|||All fields`);
        const data = [
            { group: 'domestic', label: labels.domestic, count: selectedRow.domestic_count },
            { group: 'overseas', label: labels.overseas, count: selectedRow.overseas_count }
        ];
        const total = d3.sum(data, d => d.count);
        const width = compositionHost.node().clientWidth || 190;
        const height = 150;
        const radius = Math.min(width * 0.18, 48);

        const svg = compositionHost.append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`);

        svg.append('text')
            .attr('x', 14)
            .attr('y', 18)
            .attr('class', 'author-chart-title')
            .text('科学家构成');

        const g = svg.append('g')
            .attr('transform', `translate(${Math.min(width * 0.3, 112)},${76})`);
        const pie = d3.pie().sort(null).value(d => d.count);
        const arc = d3.arc().innerRadius(radius * 0.58).outerRadius(radius);
        const labelArc = d3.arc().innerRadius(radius * 0.78).outerRadius(radius * 0.78);

        g.selectAll('path')
            .data(pie(data))
            .join('path')
            .attr('d', arc)
            .attr('fill', d => colors[d.data.group])
            .attr('class', d => `author-composition-slice ${d.data.group}`);

        g.selectAll('text')
            .data(pie(data).filter(d => d.data.count > 0))
            .join('text')
            .attr('class', 'author-pie-label')
            .attr('transform', d => `translate(${labelArc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .attr('dy', '0.34em')
            .text(d => `${Math.round((d.data.count / total) * 100)}%`);

        g.append('text')
            .attr('class', 'author-pie-total-label')
            .attr('text-anchor', 'middle')
            .attr('dy', '-0.18em')
            .text('总人数');
        g.append('text')
            .attr('class', 'author-pie-total')
            .attr('text-anchor', 'middle')
            .attr('dy', '1.05em')
            .text(d3.format(',')(total));

        const legendX = Math.min(width * 0.56, 210);
        const legend = svg.append('g').attr('transform', `translate(${legendX},50)`);
        legend.selectAll('g')
            .data(data)
            .join('g')
            .attr('class', 'author-pie-legend-item')
            .attr('transform', (_, i) => `translate(0,${i * 24})`)
            .each(function (d) {
                const item = d3.select(this);
                item.append('rect')
                    .attr('width', 8)
                    .attr('height', 8)
                    .attr('rx', 1.5)
                    .attr('fill', colors[d.group]);
                item.append('text')
                    .attr('x', 14)
                    .attr('y', 7)
                    .attr('class', 'author-pie-legend-label')
                    .text(`${d.label} ${formatPct(d.count / total)}`);
                item.append('text')
                    .attr('x', 14)
                    .attr('y', 21)
                    .attr('class', 'author-pie-legend-count')
                    .text(`${d3.format(',')(d.count)} 位`);
            });
    }

    function drawSummary() {
        summaryHost.selectAll('*').remove();
        const selectedRow = rowMap.get(`${state.tier}|||${state.selectedField}`) || rowMap.get(`${state.tier}|||All fields`);
        const metric = selectedRow.metrics[state.metric];
        const direction = metric.gap >= 0 ? '更高' : '更低';

        summaryHost.append('div')
            .attr('class', 'author-summary-kicker')
            .text(`${tierLabels[state.tier]} / ${metricLabels[state.metric]}`);
        summaryHost.append('h3').text(fieldLabel(selectedRow.field));

        const statGrid = summaryHost.append('div').attr('class', 'author-summary-grid');
        addStat(statGrid, '本土中位数', formatPct(metric.domestic.median));
        addStat(statGrid, '海外中位数', formatPct(metric.overseas.median));
        addStat(statGrid, '差距', signedPct(metric.gap));
        addStat(statGrid, '科学家人数', d3.format(',')(selectedRow.total_count));

        summaryHost.append('p')
            .attr('class', 'author-summary-reading')
            .text(`在当前选择下，海外科学家的该指标比本土科学家${direction} ${Math.abs(metric.gap * 100).toFixed(1)}%。`);
    }

    function addStat(parent, label, value) {
        const item = parent.append('div').attr('class', 'author-summary-stat');
        item.append('span').text(label);
        item.append('strong').text(value);
    }

    function drawLegend(g) {
        const items = [{ group: 'domestic', label: '本土' }, { group: 'overseas', label: '海外' }];
        const item = g.selectAll('g')
            .data(items)
            .join('g')
            .attr('transform', (_, i) => `translate(${i * 96},0)`);
        item.append('circle').attr('r', 5).attr('fill', d => colors[d.group]);
        item.append('text').attr('x', 12).attr('dy', '0.34em').text(d => d.label);
    }

    function wrapText(textSelection, width) {
        textSelection.each(function () {
            const text = d3.select(this);
            const rawText = text.text();
            const x = text.attr('x');
            if (rawText === 'Information & Communication Technologies') {
                text.text(null);
                text.append('tspan').attr('x', x).attr('dy', '0em').text('Information & Communication');
                text.append('tspan').attr('x', x).attr('dy', '1.05em').text('Technologies');
                return;
            }
            const words = rawText.split(/\s+/).filter(Boolean);
            let line = [];
            let lineNumber = 0;
            text.text(null);
            let tspan = text.append('tspan').attr('x', x).attr('dy', '0em');
            words.forEach(word => {
                line.push(word);
                tspan.text(line.join(' '));
                if (tspan.node().getComputedTextLength() > width && line.length > 1) {
                    line.pop();
                    tspan.text(line.join(' '));
                    line = [word];
                    tspan = text.append('tspan').attr('x', x).attr('dy', `${++lineNumber * 1.05}em`).text(word);
                }
            });
        });
    }

    function formatPct(value) {
        if (value === null || Number.isNaN(value)) return '--';
        return `${Math.round(value * 1000) / 10}%`;
    }

    function signedPct(value) {
        if (value === null || Number.isNaN(value)) return '--';
        const sign = value >= 0 ? '+' : '';
        return `${sign}${(value * 100).toFixed(1)}%`;
    }

    function fieldLabel(field) {
        return field === 'All fields' ? '全部学科' : field;
    }
}
