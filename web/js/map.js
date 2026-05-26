/**
 * 世界地图（等值区域图）
 * 颜色深浅表示科学家数量
 */
function renderMap(data, filterState) {
    const width = document.getElementById('map').clientWidth;
    const height = 450;

    // 清空
    d3.select('#map').selectAll('*').remove();

    const svg = d3.select('#map').append('svg')
        .attr('width', width)
        .attr('height', height);

    const projection = d3.geoNaturalEarth1()
        .fitSize([width - 20, height - 20], { type: 'Sphere' });

    const path = d3.geoPath().projection(projection);

    // 颜色比例尺
    const maxVal = d3.max(data, d => d.total) || 1;
    const color = d3.scaleSequentialLog(d3.extent(data, d => d.total))
        .interpolator(d3.interpolateBlues);

    // 加载世界地图 TopoJSON
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        .then(r => r.json())
        .then(world => {
            const countries = topojson.feature(world, world.objects.countries);

            // 国家名到 ISO 的映射 (简化版，实际需更完整)
            const nameToId = {};
            world.objects.countries.geometries.forEach(g => {
                nameToId[g.properties.name] = g.id;
            });

            // 建立数据查询
            const dataMap = {};
            data.forEach(d => { dataMap[d.country] = d; });

            svg.append('g')
                .selectAll('path')
                .data(countries.features)
                .join('path')
                .attr('d', path)
                .attr('fill', d => {
                    const row = dataMap[d.properties.name];
                    return row ? color(row.total) : '#eee';
                })
                .attr('stroke', '#fff')
                .attr('stroke-width', 0.5)
                .on('mouseenter', function (event, d) {
                    const row = dataMap[d.properties.name];
                    d3.select(this).attr('stroke', '#333').attr('stroke-width', 1.5);
                    showTooltip(event, row ? `${d.properties.name}: ${row.total} 人` : d.properties.name);
                })
                .on('mouseleave', function () {
                    d3.select(this).attr('stroke', '#fff').attr('stroke-width', 0.5);
                    hideTooltip();
                });
        });
}

let tooltipDiv;

function showTooltip(event, text) {
    if (!tooltipDiv) {
        tooltipDiv = d3.select('body').append('div').attr('class', 'tooltip');
    }
    tooltipDiv.style('opacity', 1)
        .html(text)
        .style('left', (event.pageX + 12) + 'px')
        .style('top', (event.pageY - 28) + 'px');
}

function hideTooltip() {
    if (tooltipDiv) tooltipDiv.style('opacity', 0);
}
