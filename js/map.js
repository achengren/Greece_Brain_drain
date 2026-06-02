const ISO3_TO_NUMERIC = {
    grc: '300', usa: '840', gbr: '826', deu: '276', cyp: '196', aus: '036', fra: '250',
    can: '124', che: '756', nld: '528', swe: '752', ita: '380', bel: '056', esp: '724',
    aut: '040', dnk: '208', nor: '578', irl: '372', zaf: '710', fin: '246', are: '784',
    bra: '076', chn: '156', cze: '203', sau: '682', sgp: '702', isr: '376', lux: '442',
    rus: '643', jpn: '392', prt: '620', qat: '634', tur: '792', pol: '616', nzl: '554',
    hun: '348', kwt: '414', hkg: '344', kor: '410', chl: '152', kaz: '398', ind: '356',
    mex: '484', rou: '642', svn: '705', hrv: '191', bgr: '100', est: '233', ltu: '440',
    lva: '428', ukr: '804', egy: '818', mar: '504', tun: '788', tha: '764', mys: '458',
    idn: '360', vnm: '704', arg: '032', col: '170', per: '604', ury: '858', ven: '862'
};

let _mapWorldData = null;
let _mapBuilt = false;
let _mapProjection = null;
let _mapPath = null;
let _mapSvg = null;

function buildMapBase(container, width, height) {
    _mapProjection = d3.geoEquirectangular()
        .fitExtent([[10, 20], [width - 10, height - 20]], { type: 'Sphere' });
    _mapPath = d3.geoPath().projection(_mapProjection);

    _mapSvg = d3.select(container).append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('preserveAspectRatio', 'xMidYMid meet');

    _mapSvg.append('path')
        .datum({ type: 'Sphere' })
        .attr('d', _mapPath)
        .attr('fill', '#dce5ef');

    const tooltip = d3.select('#tooltip');

    _mapSvg.append('g')
        .attr('class', 'countries')
        .selectAll('path')
        .data(_mapWorldData)
        .join('path')
        .attr('d', _mapPath)
        .attr('class', 'country-path')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 0.5)
        .on('mouseenter', function (event, d) {
            d3.select(this).attr('stroke', '#10325c').attr('stroke-width', 1.2);
            const id = String(d.id).padStart(3, '0');
            const dataMap = _mapSvg.dataMap || new Map();
            const row = dataMap.get(id);
            if (row) {
                tooltip.style('opacity', 1)
                    .html(`<strong>${d.properties.name}</strong><br>${row.total.toLocaleString()} scientists${row.top_field ? '<br>Top field: ' + row.top_field : ''}<br><span style="color:#8899aa;font-size:11px">Click for details</span>`);
            } else {
                tooltip.style('opacity', 1)
                    .html(`<strong>${d.properties.name}</strong><br><span style="color:#8899aa">No Greek scientists recorded</span>`);
            }
        })
        .on('mousemove', function (event) {
            tooltip
                .style('left', (event.clientX + 16) + 'px')
                .style('top', (event.clientY - 10) + 'px');
        })
        .on('mouseleave', function () {
            d3.select(this).attr('stroke', '#ffffff').attr('stroke-width', 0.5);
            tooltip.style('opacity', 0);
        })
        .on('click', function (event, d) {
            const id = String(d.id).padStart(3, '0');
            const dataMap = _mapSvg.dataMap || new Map();
            const row = dataMap.get(id);
            if (row) {
                const name = d.properties.name;
                setSelectedCountry(name.toLowerCase() === 'greece' ? 'grc' : row.country, name);
            }
        });
}

function updateMapColors(data) {
    const values = data.map(d => d.total).filter(Boolean);
    const maxVal = d3.max(values) || 1;
    const minVal = Math.max(1, d3.min(values) || 1);
    const colorScale = d3.scaleLog()
        .domain([minVal, maxVal])
        .range([0.15, 0.95])
        .clamp(true);

    const dataMap = new Map();
    data.forEach(d => {
        const key = ISO3_TO_NUMERIC[String(d.country).toLowerCase()];
        if (key) dataMap.set(key, d);
    });
    _mapSvg.dataMap = dataMap;

    _mapSvg.select('g.countries').selectAll('path')
        .transition()
        .duration(300)
        .attr('fill', d => {
            const row = dataMap.get(String(d.id).padStart(3, '0'));
            if (!row) return '#edf0f3';
            return d3.interpolateBlues(colorScale(row.total));
        });
}

function renderMap(data) {
    const container = document.getElementById('map');
    const rect = container.getBoundingClientRect();
    const width = rect.width || 600;
    const height = rect.height || 400;

    // First time: fetch world data, build base SVG
    if (!_mapBuilt) {
        d3.select(container).selectAll('*').remove();
        _mapWorldData = null;

        fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
            .then(r => r.json())
            .then(world => {
                _mapWorldData = topojson.feature(world, world.objects.countries).features;
                buildMapBase(container, width, height);
                _mapBuilt = true;
                updateMapColors(data);
                if (_onWorldReady) _onWorldReady();
            })
            .catch(() => {
                d3.select(container).append('div')
                    .attr('class', 'chart-placeholder')
                    .html('<strong>Map failed to load</strong><span>Check your internet connection or the TopoJSON CDN.</span>');
            });
        return;
    }

    // Subsequent calls: just update fills with transition
    const svg = d3.select(container).select('svg');
    if (svg.empty()) {
        _mapBuilt = false;
        renderMap(data);
        return;
    }
    _mapSvg = svg;
    updateMapColors(data);
}

function getWorldData() { return _mapWorldData; }

// Called by overviewCards to re-render mini-map when world data arrives late
let _onWorldReady = null;
function onWorldReady(fn) { _onWorldReady = fn; }
