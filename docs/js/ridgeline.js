let _rlDiasporaData = null;
let _rlMetric = 'nc';

function loadRidgelineData() {
    const path = '../data/processed/diaspora_comparison.json';
    console.log('Ridgeline: fetching', path);
    fetch(path)
        .then(r => {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        })
        .then(data => {
            console.log('Ridgeline: loaded', data.length, 'groups');
            _rlDiasporaData = data;
            renderRidgeline();
        })
        .catch(err => {
            console.warn('Ridgeline:', err.message);
            // show fallback message in the container
            const el = document.getElementById('ridgeline');
            if (el) el.innerHTML = '<div style="padding:30px;text-align:center;color:#94a3b3;font-size:12px">Data not available</div>';
        });
}

function setRidgelineMetric(metric) {
    if (metric === _rlMetric) return;
    _rlMetric = metric;
    document.querySelectorAll('.rl-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.metric === metric);
    });
    renderRidgeline();
}

function renderRidgeline() {
    if (!_rlDiasporaData || !_rlDiasporaData.length) {
        console.warn('Ridgeline: no data');
        return;
    }

    const container = document.getElementById('ridgeline');
    if (!container) { console.warn('Ridgeline: container missing'); return; }
    const width = container.clientWidth || 400;
    const height = 90;

    d3.select(container).selectAll('*').remove();

    const svg = d3.select(container).append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);

    const metricKey = _rlMetric === 'nc' ? 'nc_percentiles' : 'h_percentiles';
    const groups = [
        { key: 'domestic', color: '#b33636', baseY: height * 0.72 },
        { key: 'overseas', color: '#2b6f9f', baseY: height * 0.22 }
    ];

    // Find x domain from data
    let minX = Infinity, maxX = 0;
    groups.forEach(g => {
        const row = _rlDiasporaData.find(d => d.group === g.key);
        if (row && row[metricKey]) {
            row[metricKey].forEach(v => {
                if (v > 0) { minX = Math.min(minX, v); maxX = Math.max(maxX, v); }
            });
        }
    });
    if (!isFinite(minX)) {
        console.warn('Ridgeline: no valid x domain');
        return;
    }

    const xScale = _rlMetric === 'nc'
        ? d3.scaleLog().domain([minX, maxX]).range([6, width - 6])
        : d3.scaleLinear().domain([0, maxX]).range([6, width - 6]).nice();

    const peakH = 22;

    groups.forEach(({ key, color, baseY }) => {
        const row = _rlDiasporaData.find(d => d.group === key);
        if (!row || !row[metricKey]) {
            console.warn('Ridgeline: no row for', key);
            return;
        }

        const p = row[metricKey].filter(v => v > 0);
        if (p.length < 2) {
            console.warn('Ridgeline: not enough points for', key, p.length);
            return;
        }

        // Build histogram bins from percentile pairs
        const bins = [];
        for (let i = 0; i < p.length - 1; i++) {
            const x0 = p[i];
            const x1 = p[i + 1];
            if (x1 <= x0) continue;
            bins.push({ x0, x1, density: 5 / (x1 - x0) });
        }
        if (!bins.length) return;

        // Normalize densities to [0, 1]
        const maxD = d3.max(bins, b => b.density) || 1;
        bins.forEach(b => b.density /= maxD);

        // Build step-like points for area fill
        const pts = [];
        bins.forEach(b => {
            const cx = (b.x0 + b.x1) / 2;
            const h = b.density * peakH;
            pts.push({ x: xScale(b.x0), y: baseY, baseY });
            pts.push({ x: xScale(cx), y: baseY - h, baseY });
            pts.push({ x: xScale(b.x1), y: baseY, baseY });
        });

        if (pts.length < 3) return;

        // Filled area
        svg.append('path')
            .datum(pts)
            .attr('d', d3.area()
                .x(d => d.x)
                .y0(d => d.baseY)
                .y1(d => d.y)
                .curve(d3.curveBasis))
            .attr('fill', color)
            .attr('opacity', 0.25);

        // Top outline — sample peak points, then smooth
        const topPts = [];
        for (let i = 1; i < pts.length; i += 3) {
            topPts.push(pts[i]);
        }
        if (topPts.length > 1) {
            svg.append('path')
                .datum(topPts)
                .attr('d', d3.line()
                    .x(d => d.x)
                    .y(d => d.y)
                    .curve(d3.curveBasis))
                .attr('fill', 'none')
                .attr('stroke', color)
                .attr('stroke-width', 1.5)
                .attr('opacity', 0.8);
        }
    });

    console.log('Ridgeline: rendered', metricKey);
}

document.addEventListener('DOMContentLoaded', () => {
    const sw = document.querySelector('.ridgeline-switch');
    if (sw) {
        sw.addEventListener('click', function (e) {
            const btn = e.target.closest('.rl-btn');
            if (btn) setRidgelineMetric(btn.dataset.metric);
        });
    }
});
