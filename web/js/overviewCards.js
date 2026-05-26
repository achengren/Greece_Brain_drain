/**
 * 概览信息卡片
 */
function renderOverviewCards() {
    fetch('data/overview_stats.json')
        .then(r => r.json())
        .then(d => {
            document.getElementById('card-total').textContent = d.total_scientists.toLocaleString();
            document.getElementById('card-countries').textContent = d.total_countries;
            document.getElementById('card-overseas-pct').textContent = d.overseas_pct + '%';
            document.getElementById('card-top1').textContent = d.top_1_count.toLocaleString();
            document.getElementById('card-median-citation').textContent = d.median_citation;
            document.getElementById('card-median-h').textContent = d.median_hindex;
        });
}
