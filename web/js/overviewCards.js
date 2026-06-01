let byCountryData = [];
let overviewStats = null;
let byFieldData = [];

function loadOverviewCardsData() {
    // When world map data finishes loading, retry the country mini-map
    if (typeof onWorldReady === 'function') {
        onWorldReady(() => {
            const c = getSelectedCountry();
            if (c) renderCountryPanel(c.code, c.name);
        });
    }
    return Promise.all([
        fetch('../data/processed/overview_stats.json').then(r => r.json()).catch(() => ({})),
        fetch('../data/processed/by_country.json').then(r => r.json()).catch(() => []),
        fetch('../data/processed/by_field.json').then(r => r.json()).catch(() => [])
    ]).then(([overview, byCountry, byField]) => {
        overviewStats = overview;
        byCountryData = byCountry;
        byFieldData = byField;
        renderCards(null);
    });
}

function renderCountryPanel(countryCode, countryName) {
    const nameEl = document.getElementById('selected-country-name');
    const subEl = document.getElementById('selected-country-sub');
    const mapContainer = document.getElementById('country-map');
    if (!nameEl) return;

    d3.select(mapContainer).selectAll('*').remove();

    if (!countryCode) {
        nameEl.textContent = 'Select a country';
        subEl.textContent = 'Click on the map to explore';
        return;
    }

    nameEl.textContent = countryName;
    subEl.textContent = 'Country details';

    // Mini country map
    const worldData = typeof getWorldData === 'function' ? getWorldData() : null;
    if (!worldData) return;

    const numericCode = ISO3_TO_NUMERIC[String(countryCode).toLowerCase()];
    if (!numericCode) return;

    const feature = worldData.find(f => String(f.id) === numericCode);
    if (!feature) return;

    const width = mapContainer.clientWidth || 220;
    const height = 90;

    const projection = d3.geoEquirectangular()
        .fitExtent([[8, 6], [width - 8, height - 6]], feature);

    const svg = d3.select(mapContainer).append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`);

    svg.append('path')
        .datum(feature)
        .attr('d', d3.geoPath().projection(projection))
        .attr('fill', '#10325c')
        .attr('stroke', '#10325c')
        .attr('stroke-width', 0.5);
}

function renderCards(country) {
    renderCountryPanel(country ? country.code : null, country ? country.name : null);

    const els = {
        total: document.getElementById('card-total'),
        totalSub: document.getElementById('card-total-sub'),
        share: document.getElementById('card-share'),
        shareSub: document.getElementById('card-share-sub'),
        top1: document.getElementById('card-top1'),
        top1Sub: document.getElementById('card-top1-sub'),
        citation: document.getElementById('card-median-citation'),
        hindex: document.getElementById('card-median-h'),
        topField: document.getElementById('card-top-field')
    };
    if (!els.total) return;

    const fd = window.__filteredCountryData;

    // If a country is selected, find it in filtered data (or fallback to byCountryData)
    if (country) {
        const row = (fd || byCountryData).find(d => d.country === country.code);
        if (row) {
            const globalTotal = fd
                ? d3.sum(fd, d => d.total)
                : (overviewStats.total_scientists || byCountryData.reduce((s, d) => s + d.total, 0));
            const share = globalTotal > 0 ? ((row.total / globalTotal) * 100).toFixed(1) : '0.0';
            els.total.textContent = row.total.toLocaleString();
            els.totalSub.textContent = `in ${country.name}`;
            els.share.textContent = `${share}%`;
            els.shareSub.textContent = 'of filtered scientists';
            els.top1.textContent = (row.top_1_count || 0).toLocaleString();
            els.top1Sub.textContent = row.top_1_count === 1 ? 'scientist' : 'scientists';
            els.citation.textContent = row.median_citation != null ? row.median_citation.toLocaleString() : '--';
            els.hindex.textContent = row.median_hindex != null ? row.median_hindex.toString() : '--';
            els.topField.textContent = row.top_field || '--';
            return;
        }
    }

    // No country selected — show filtered global stats (or full overview)
    if (fd && fd.length) {
        const total = d3.sum(fd, d => d.total);
        const top1 = d3.sum(fd, d => d.top_1_count || 0);
        const medCit = d3.median(fd, d => d.median_citation);
        const medH = d3.median(fd, d => d.median_hindex);

        els.total.textContent = total.toLocaleString();
        els.totalSub.textContent = 'filtered total';
        els.share.textContent = '100%';
        els.shareSub.textContent = 'of filtered view';
        els.top1.textContent = top1.toLocaleString();
        els.top1Sub.textContent = 'scientists';
        els.citation.textContent = medCit != null ? medCit.toLocaleString() : '--';
        els.hindex.textContent = medH != null ? medH.toString() : '--';
        els.topField.textContent = '--';
        return;
    }

    // Final fallback: overview_stats
    const t = overviewStats.total_scientists || byCountryData.reduce((s, d) => s + d.total, 0);
    els.total.textContent = t.toLocaleString();
    els.totalSub.textContent = 'worldwide total';
    els.share.textContent = '100%';
    els.shareSub.textContent = 'all Greek scientists';
    els.top1.textContent = (overviewStats.top_1_count || 0).toLocaleString();
    els.top1Sub.textContent = 'scientists';
    els.citation.textContent = overviewStats.median_citation != null ? overviewStats.median_citation.toLocaleString() : '--';
    els.hindex.textContent = overviewStats.median_hindex != null ? overviewStats.median_hindex.toString() : '--';

    const topField = byFieldData.length
        ? byFieldData.reduce((a, b) => (a.scientist_count > b.scientist_count) ? a : b).field
        : '--';
    els.topField.textContent = topField;
}
