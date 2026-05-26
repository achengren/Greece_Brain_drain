/**
 * 主入口：加载数据，初始化各模块
 */

// ===== 数据加载 =====
async function loadAllData() {
    const [byCountry, top10, byField, diasporaComp, topTalent, academicAge, overview] = await Promise.all([
        fetch('data/by_country.json').then(r => r.json()),
        fetch('data/top10_countries.json').then(r => r.json()),
        fetch('data/by_field.json').then(r => r.json()),
        fetch('data/diaspora_comparison.json').then(r => r.json()),
        fetch('data/top_talent_by_country.json').then(r => r.json()),
        fetch('data/academic_age.json').then(r => r.json()),
        fetch('data/overview_stats.json').then(r => r.json())
    ]);

    return { byCountry, top10, byField, diasporaComp, topTalent, academicAge, overview };
}

// ===== 初始化 =====
async function init() {
    // 先加载概览卡片（不依赖筛选）
    renderOverviewCards();

    // 初始化筛选器
    initFilters();

    // 加载全量数据（仅做演示用，大数据量时需按需加载）
    const data = await loadAllData();

    // 初始渲染（默认全量数据）
    renderMap(data.byCountry, FilterState);
    renderBarChart(data.byCountry);

    // 绑定筛选联动（示例：仅联动地图和柱状图，其余图表演示略）
    onFilterChange(state => {
        // 根据筛选条件过滤数据（demo 阶段先直接传全部）
        renderMap(data.byCountry, state);
        renderBarChart(data.byCountry);
    });

    // 滚动叙事各章节注册
    onStepEnter(1, () => {
        // 散点图（从聚合后的 JSON 采样，避免加载 6 万行 CSV）
        fetch('data/scatter_sample.json').then(r => r.json()).then(data => {
            renderScatterPlot(data);
        });
    });

    onStepEnter(2, () => {
        renderBoxPlot(data.diasporaComp);
    });

    onStepEnter(3, () => {
        // 树图占位（实际需加载 by_subfield.json）
        renderTreemap(null);
    });

    onStepEnter(4, () => {
        renderTopTalent(data.topTalent);
    });

    onStepEnter(5, () => {
        renderAcademicAge(data.academicAge);
    });

    // 启动滚动叙事
    initScrollytelling();
}

// ===== 启动 =====
document.addEventListener('DOMContentLoaded', init);
