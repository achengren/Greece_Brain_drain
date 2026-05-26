/**
 * 树图：学科结构
 * 矩形面积 = 科学家人数，颜色 = 海外占比
 */
function renderTreemap(data) {
    const container = document.getElementById('chart-treemap');
    const width = container.clientWidth || 600;
    const height = 450;

    d3.select(container).selectAll('*').remove();

    // 构建层级数据
    const root = d3.stratify()
        .id(d => d.subfield || d.field)
        .parentId(d => d.parent || null)(
            [{ field: 'root', subfield: null, parent: null, scientist_count: 0 }]
            // ...实际需从 by_subfield.json 构建
        );

    // TODO: 从 by_subfield.json 构建完整树图
    d3.select(container).append('div')
        .style('display', 'flex').style('align-items', 'center')
        .style('justify-content', 'center').style('height', '100%')
        .style('color', '#999')
        .text('树图 — 加载 by_subfield.json 后渲染');
}

/**
 * 热力矩阵：国家 × 学科
 */
function renderHeatmap(matrixData) {
    const container = document.getElementById('chart-treemap');
    // 可选：用热力图替代树图
}
