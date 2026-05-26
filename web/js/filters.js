/**
 * 全局筛选器状态与事件
 * 所有图表通过订阅 onFilterChange 来响应筛选变化
 */
const FilterState = {
    field: 'all',
    percentile: 'all',
    diaspora: 'all'
};

const listeners = [];

function notifyListeners() {
    listeners.forEach(fn => fn({ ...FilterState }));
}

function onFilterChange(fn) {
    listeners.push(fn);
}

function initFilters() {
    // 从 data/processed 加载学科列表填充下拉
    fetch('data/by_field.json')
        .then(r => r.json())
        .then(fields => {
            const sel = document.getElementById('filter-field');
            fields.forEach(f => {
                const opt = document.createElement('option');
                opt.value = f.field;
                opt.textContent = f.field;
                sel.appendChild(opt);
            });
        });

    // 绑定事件
    document.getElementById('filter-field').addEventListener('change', e => {
        FilterState.field = e.target.value;
        notifyListeners();
    });
    document.getElementById('filter-percentile').addEventListener('change', e => {
        FilterState.percentile = e.target.value;
        notifyListeners();
    });
    document.getElementById('filter-diaspora').addEventListener('change', e => {
        FilterState.diaspora = e.target.value;
        notifyListeners();
    });
    document.getElementById('filter-reset').addEventListener('click', () => {
        ['filter-field', 'filter-percentile', 'filter-diaspora'].forEach(id => {
            document.getElementById(id).value = 'all';
        });
        FilterState.field = 'all';
        FilterState.percentile = 'all';
        FilterState.diaspora = 'all';
        notifyListeners();
    });
}
