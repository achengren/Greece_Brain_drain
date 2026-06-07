const DATA_PATH = 'data/processed';

// Store for cross-module access (overviewCards.js checks window.__filteredCountryData)
window.__filteredCountryData = null;

async function loadJson(fileName, fallback = []) {
    try {
        const response = await fetch(`${DATA_PATH}/${fileName}`);
        if (!response.ok) throw new Error(`Failed to load ${fileName}`);
        return response.json();
    } catch (error) {
        console.warn(error.message);
        return fallback;
    }
}

function getFilteredByCountry(allData, state) {
    let data = allData;
    if (state.field !== 'all') data = data.filter(d => d['sm-field'] === state.field);
    if (state.percentile !== 'all') data = data.filter(d => d.percentile_group === state.percentile);

    // Group and aggregate by country
    const map = new Map();
    const fieldCounts = new Map();

    data.forEach(d => {
        const key = d.cntry;
        if (!map.has(key)) {
            map.set(key, {
                total: 0, overseas: 0, domestic: 0,
                vals: []
            });
            fieldCounts.set(key, {});
        }
        const g = map.get(key);
        g.total += d.total;
        if (d.is_diaspora === 1) g.overseas += d.total;
        else g.domestic += d.total;
        g.vals.push(d);

        const fc = fieldCounts.get(key);
        fc[d['sm-field']] = (fc[d['sm-field']] || 0) + d.total;
    });

    return Array.from(map.entries()).map(([country, g]) => {
        const overseasPct = g.total > 0 ? Math.round((g.overseas / g.total) * 10000) / 100 : 0;
        const medianCitation = d3.median(g.vals, d => d.median_citation);
        const medianHindex = d3.median(g.vals, d => d.median_hindex);

        const fc = fieldCounts.get(country);
        const entries = Object.entries(fc).sort((a, b) => b[1] - a[1]);
        const topField = entries.length ? entries[0][0] : '';

        // top_1_count sums only rows where percentile_group is 'top_1'
        const top1Count = d3.sum(g.vals, d => d.percentile_group === 'top_1' ? d.total : 0);

        return {
            country,
            total: g.total,
            overseas: g.overseas,
            domestic: g.domestic,
            overseas_pct: overseasPct,
            median_citation: medianCitation,
            median_hindex: medianHindex,
            top_1_count: top1Count,
            top_field: topField,
            scientist_count: g.total
        };
    }).sort((a, b) => b.total - a.total);
}

async function loadAllData() {
    const [byCountry, top10, byField, diasporaComp, authorRole, topTalent, academicAge, overview, byCountryAll, scatterSample, influenceAll] = await Promise.all([
        loadJson('by_country.json'),
        loadJson('top10_countries.json'),
        loadJson('by_field.json'),
        loadJson('diaspora_comparison.json'),
        loadJson('author_role.json', {}),
        loadJson('top_talent_by_country.json'),
        loadJson('academic_age.json'),
        loadJson('overview_stats.json', {}),
        loadJson('by_country_all.json', []),
        loadJson('scatter_sample.json', []),
        // influence_all_countries 只在 web/data/ 下，单独加载
        fetch('web/data/influence_all_countries.json').then(r => r.json()).catch(() => null)
    ]);
    window.__overviewStats = overview;
    return { byCountry, top10, byField, diasporaComp, authorRole, topTalent, academicAge, overview, byCountryAll, scatterSample, influenceAll };
}

async function init() {
    initFilters();
    await loadOverviewCardsData();

    const data = await loadAllData();

    if (!data.byCountryAll.length) {
        console.warn('by_country_all.json not loaded — filters will use static data');
    }

    function renderWithFilters(state) {
        const filtered = data.byCountryAll.length
            ? getFilteredByCountry(data.byCountryAll, state)
            : data.byCountry;

        window.__filteredCountryData = filtered;
        renderMap(filtered);
        renderBarChart(filtered);
        renderCards(getSelectedCountry());
    }

    // Register filter & country listeners before setting defaults
    onFilterChange(state => {
        renderWithFilters(state);
    });

    onCountryChange(country => {
        renderCards(country);
    });

    // Initial render using whatever data we have
    renderWithFilters(FilterState);

    // Default to Greece — triggers onCountryChange listener registered above
    setSelectedCountry('grc', 'Greece');

    // 滚动触发渲染：用户滚到对应步骤时再画图
    onStepEnter(1, () => {
        if (data.scatterSample.length) renderScatterPlot(data.scatterSample);
    });
    onStepEnter(2, () => {
        if (data.diasporaComp.length) renderBoxPlot(data.diasporaComp);
    });
    onStepEnter(3, () => {
        if (data.byField.length) {
            renderTreemap(data.byField);
        } else {
            renderTreemap(null);
        }
    });
    onStepEnter(4, () => {
        if (data.authorRole && data.authorRole.rows) renderAuthorRole(data.authorRole);
    });
    onStepEnter(5, () => {
        if (data.academicAge.length) renderAcademicAge(data.academicAge);
    });

    onStepEnter(6, () => {
        if (data.influenceAll) renderInfluenceCharts(data.influenceAll);
    });

    if (window.location.hash === '#author-role' && data.authorRole && data.authorRole.rows) {
        renderAuthorRole(data.authorRole);
    }

    initScrollytelling();
}

document.addEventListener('DOMContentLoaded', init);
