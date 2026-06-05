/* ============================================================
   treemap.js
   Top level : treemap (top 12) + collapsible small panel
   Drill-down: diverging bar chart, fixed full-screen overlay
   Data: data/processed/by_field.json + by_subfield.json
   ============================================================ */
(function () {

  const MAIN_CUTOFF = 10;
  const MIN_SHOW    = 10;

  const COLOR_LOW  = '#bdd7ee';
  const COLOR_MID  = '#2b6f9f';
  const COLOR_HIGH = '#10325c';
  const DOM_COLOR  = '#A0B4C8';
  const OVS_COLOR  = '#10325c';

  function drainColor(pct) {
    const t = Math.max(0, Math.min(1, (pct - 25) / 65));
    return t < 0.5 ? lerpColor(COLOR_LOW, COLOR_MID, t*2)
                   : lerpColor(COLOR_MID, COLOR_HIGH, (t-0.5)*2);
  }
  function lerpColor(a, b, t) {
    const p  = s => parseInt(s,16);
    const rn = (a,b,t) => Math.round(a+(b-a)*t);
    const hr = c => [c.slice(1,3),c.slice(3,5),c.slice(5,7)].map(p);
    const [ar,ag,ab]=hr(a),[br,bg,bb]=hr(b);
    return '#'+[rn(ar,br,t),rn(ag,bg,t),rn(ab,bb,t)].map(v=>v.toString(16).padStart(2,'0')).join('');
  }
  function textColor(pct){ return pct>55?'#e8f2fa':'#10325c'; }

  /* ── Singleton tooltip on body, always above everything ── */
  function _getTooltip() {
    let t = document.getElementById('tm-tip');
    if (!t) {
      t = document.createElement('div');
      t.id = 'tm-tip';
      Object.assign(t.style, {
        position:'fixed', zIndex:'99999', maxWidth:'280px',
        padding:'10px 14px', color:'#fff', background:'#10325c',
        borderRadius:'6px', fontSize:'13px', lineHeight:'1.5',
        pointerEvents:'none', opacity:'0', transition:'opacity 0.1s',
        boxShadow:'0 8px 24px rgba(16,50,92,0.25)', fontFamily:'Inter,sans-serif',
      });
      document.body.appendChild(t);
    }
    return t;
  }
  function showTip(event, html) {
    const t = _getTooltip();
    t.innerHTML = html;
    t.style.opacity = '1';
    moveTip(event);
  }
  function moveTip(event) {
    const t  = _getTooltip();
    const tw = t.offsetWidth  || 280;
    const th = t.offsetHeight || 80;
    let x = event.clientX + 16, y = event.clientY - 10;
    if (x + tw > window.innerWidth  - 8) x = event.clientX - tw - 16;
    if (y + th > window.innerHeight - 8) y = event.clientY - th - 10;
    t.style.left = x+'px'; t.style.top = y+'px';
  }
  function hideTip() { _getTooltip().style.opacity = '0'; }

  let _fieldData    = null;
  let _subfieldData = null;
  let _panelOpen    = false;
  let _container    = null;
  let _drillSort    = 'ovs';
  let _ro           = null;

  /* ── Public entry ── */
  window.renderTreemap = function (data) {
    _container = document.getElementById('chart-treemap');
    if (!_container) return;
    if (data && data.length) {
      _fieldData = data; _panelOpen = false;
      _attachRO(); _drawTreemap(); return;
    }
    Promise.all([
      fetch('data/processed/by_field.json').then(r=>r.json()),
      fetch('data/processed/by_subfield.json').then(r=>r.json()),
    ]).then(([fields, subfields]) => {
      _fieldData = fields; _subfieldData = subfields;
      _panelOpen = false; _attachRO(); _drawTreemap();
    }).catch(() => _showPlaceholder());
  };

  function _attachRO() {
    if (_ro || !_container) return;
    _ro = new ResizeObserver(() => {
      if (document.getElementById('tm-drill-overlay')) return;
      _drawTreemap();
    });
    _ro.observe(_container);
  }

  /* ════════════════════════════════
     TREEMAP
  ════════════════════════════════ */
  function _sorted() {
    return (_fieldData||[]).slice().sort((a,b)=>b.scientist_count-a.scientist_count);
  }
  function _mkNode(d) {
    return {
      field:           d.field,
      scientist_count: +d.scientist_count,
      overseas_pct:    +d.overseas_pct,
      top_1_count:     +(d.top_1_count||0),
      median_citation: +(d.median_citation||0),
      median_hindex:   +(d.median_hindex||0),
      _has_sub: !!(_subfieldData && _subfieldData.some(s=>s.field===d.field)),
    };
  }

  function _drawTreemap() {
    if (!_container) return;
    d3.select(_container).selectAll('*').remove();

    const topNodes   = _sorted().slice(0, MAIN_CUTOFF).map(_mkNode);
    const smallNodes = _sorted().slice(MAIN_CUTOFF).map(_mkNode);
    if (!topNodes.length) { _showPlaceholder(); return; }

    /* Walk up to find the nearest ancestor with padding (the .step-chart wrapper),
       then use clientWidth minus its horizontal padding as the true available width. */
    function _availW(el) {
      let node = el;
      while (node && node !== document.body) {
        const st = window.getComputedStyle(node);
        const pl = parseFloat(st.paddingLeft)  || 0;
        const pr = parseFloat(st.paddingRight) || 0;
        if (pl + pr > 0) return Math.floor(node.clientWidth - pl - pr);
        node = node.parentElement;
      }
      return el.offsetWidth || 640;
    }
    const cW = Math.max(200, _availW(_container) - 2);
    const cH  = Math.max(200, _container.offsetHeight || 420);

    const HEADER_H = 44;
    const TOGGLE_H = smallNodes.length ? 26 : 0;
    const PANEL_H  = (_panelOpen && smallNodes.length)
      ? Math.min(smallNodes.length*26+10, Math.round(cH*0.32)) : 0;
    const tmH = Math.max(80, cH - HEADER_H - TOGGLE_H - PANEL_H);

    const wrap = d3.select(_container).append('div')
      .style('display','flex').style('flex-direction','column')
      .style('width', cW+'px').style('height', cH+'px').style('overflow','hidden');

    const hSvg = wrap.append('svg').attr('width',cW).attr('height',HEADER_H).style('flex-shrink','0');
    _drawLegend(hSvg, cW, HEADER_H);

    const tmSvg = wrap.append('svg').attr('width',cW).attr('height',tmH)
      .style('flex-shrink','0').style('display','block').style('overflow','hidden');
    _drawCells(tmSvg, topNodes, cW, tmH);

    if (smallNodes.length) {
      wrap.append('div')
        .style('display','flex').style('align-items','center').style('gap','8px')
        .style('padding','4px 8px').style('cursor','pointer').style('user-select','none')
        .style('flex-shrink','0').style('height',TOGGLE_H+'px')
        .style('border-top','1px solid #d6dee8')
        .on('click', ()=>{ _panelOpen=!_panelOpen; _drawTreemap(); })
        .call(div=>{
          div.append('span').style('font-size','11px').style('font-weight','600')
            .style('color','#6b7a8a').style('text-transform','uppercase')
            .style('letter-spacing','0.05em').text(`${smallNodes.length} 个较小学科领域`);
          div.append('span').style('font-size','10px').style('color','#94a3b3')
            .text(_panelOpen?'▲ 收起':'▼ 展开全部');
        });
      if (_panelOpen) {
        const pd = wrap.append('div').style('overflow-y','auto').style('padding','2px 0')
          .style('flex-shrink','0').style('height',PANEL_H+'px');
        _drawSmallPanel(pd, smallNodes, cW);
      }
    }
  }

  function _drawLegend(svg, W, H) {
    const barW=120,barH=6,barX=W-barW-80,barY=Math.round((H-barH)/2)-1;
    const gid='tmg'+Math.random().toString(36).slice(2);
    const grad=svg.append('defs').append('linearGradient').attr('id',gid).attr('x1','0%').attr('x2','100%');
    [0,0.33,0.66,1].forEach(t=>grad.append('stop').attr('offset',`${t*100}%`).attr('stop-color',drainColor(25+t*65)));
    svg.append('rect').attr('x',barX).attr('y',barY).attr('width',barW).attr('height',barH).attr('rx',3).attr('fill',`url(#${gid})`);
    svg.append('text').attr('x',barX-5).attr('y',barY+barH/2).attr('text-anchor','end').attr('dominant-baseline','middle').attr('font-size',10).attr('fill','#6b7a8a').text('低流失');
    svg.append('text').attr('x',barX+barW+5).attr('y',barY+barH/2).attr('text-anchor','start').attr('dominant-baseline','middle').attr('font-size',10).attr('fill','#6b7a8a').text('高流失');
    svg.append('text').attr('x',0).attr('y',H/2).attr('dominant-baseline','middle').attr('font-size',10).attr('fill','#6b7a8a')
      .text('面积 = 科学家人数 · 颜色 = 海外占比 · 点击查看子领域');
  }

  function _drawCells(svg, nodes, W, H) {
    const cid='tmc'+Math.random().toString(36).slice(2);
    svg.append('defs').append('clipPath').attr('id',cid)
      .append('rect').attr('x',0).attr('y',0).attr('width',W).attr('height',H);

    const root=d3.hierarchy({children:nodes})
      .sum(d=>Math.sqrt(d.scientist_count))   /* sqrt scale: moderate compression */
      .sort((a,b)=>b.value-a.value);
    d3.treemap().size([W,H]).padding(3).paddingOuter(2).round(true)(root);

    const maxTop1=d3.max(nodes,n=>n.top_1_count)||1;
    const g=svg.append('g').attr('clip-path',`url(#${cid})`);

    root.leaves().forEach(d=>{
      const bw=Math.round(d.x1-d.x0), bh=Math.round(d.y1-d.y0);
      if (bw<=0||bh<=0) return;

      const cell=g.append('g')
        .attr('transform',`translate(${Math.round(d.x0)},${Math.round(d.y0)})`)
        .style('cursor',d.data._has_sub?'pointer':'default');

      /* coloured bg rect — pointer-events none, hit area handles everything */
      const bgRect=cell.append('rect')
        .attr('width',bw).attr('height',bh).attr('rx',4)
        .attr('fill',drainColor(d.data.overseas_pct))
        .attr('stroke','#fff').attr('stroke-width',2).attr('opacity',0.88)
        .attr('pointer-events','none');

      /* top-1% strip */
      if (d.data.top_1_count>0&&bw>40)
        cell.append('rect').attr('x',6).attr('y',6).attr('height',3).attr('rx',1.5)
          .attr('fill','rgba(255,255,255,0.5)').attr('pointer-events','none')
          .attr('width',Math.max(4,(d.data.top_1_count/maxTop1)*(bw-12)));

      /* text labels */
      if (bw>46&&bh>22) {
        const tc=textColor(d.data.overseas_pct);
        const fs=Math.min(12,Math.max(9,bw/10));
        const cpl=Math.max(4,Math.floor(bw/(fs*0.62)));
        const words=d.data.field.split(' ');
        let line1='',line2='',cur='',broke=false;
        for (const w of words) {
          const next=cur?cur+' '+w:w;
          if (!broke&&next.length<=cpl){cur=next;}
          else if (!broke){line1=cur||next;cur=cur?w:'';broke=true;}
          else{cur+=(cur?' ':'')+w;}
        }
        if (!broke) line1=cur;
        else line2=cur.length>cpl?cur.slice(0,cpl-1)+'…':cur;

        const hasPct=bh>(line2?58:44);
        const nLines=(line2?2:1)+(hasPct?1:0);
        const lh=fs*1.3,blockH=nLines*lh;
        let sy=(bh-blockH)/2+lh*0.5;
        if (d.data.top_1_count>0&&bh>40) sy=Math.max(sy,14);

        const ccid='cc'+Math.random().toString(36).slice(2);
        cell.append('defs').append('clipPath').attr('id',ccid)
          .append('rect').attr('width',bw).attr('height',bh);
        const tg=cell.append('g').attr('clip-path',`url(#${ccid})`).attr('pointer-events','none');

        tg.append('text').attr('x',bw/2).attr('y',sy)
          .attr('text-anchor','middle').attr('dominant-baseline','middle')
          .attr('font-size',fs).attr('font-weight','700').attr('fill',tc).text(line1);
        if (line2) tg.append('text').attr('x',bw/2).attr('y',sy+lh)
          .attr('text-anchor','middle').attr('dominant-baseline','middle')
          .attr('font-size',fs).attr('font-weight','700').attr('fill',tc).text(line2);
        if (hasPct) tg.append('text').attr('x',bw/2).attr('y',sy+lh*(line2?2:1)+2)
          .attr('text-anchor','middle').attr('dominant-baseline','middle')
          .attr('font-size',9).attr('fill',tc).attr('opacity',0.7)
          .text(`海外占比 ${d.data.overseas_pct.toFixed(1)}%`);
      }

      /* drill hint */
      if (d.data._has_sub&&bw>52&&bh>32)
        cell.append('text').attr('x',bw-7).attr('y',bh-7)
          .attr('text-anchor','end').attr('font-size',9)
          .attr('fill',textColor(d.data.overseas_pct)).attr('opacity',0.4)
          .attr('pointer-events','none').text('▸');

      /* full-cell hit area — on top of everything else */
      cell.append('rect')
        .attr('width',bw).attr('height',bh).attr('fill','transparent')
        .on('mouseenter',function(event){
          bgRect.attr('opacity',1).attr('stroke','#10325c').attr('stroke-width',2.5);
          showTip(event,
            `<strong>${d.data.field}</strong>`+
            `${d.data.scientist_count.toLocaleString()} 位科学家<br>`+
            `海外占比：<b>${d.data.overseas_pct.toFixed(1)}%</b><br>`+
            (d.data.top_1_count    ?`顶尖1%：${d.data.top_1_count.toLocaleString()}<br>`:'')+
            (d.data.median_citation?`中位引用数：${d.data.median_citation.toFixed(0)}<br>`:'')+
            (d.data.median_hindex  ?`中位h指数：${d.data.median_hindex.toFixed(1)}`:'')+
            (d.data._has_sub?'<br><span style="opacity:0.65;font-size:11px">Click to explore subfields →</span>':'')
          );
        })
        .on('mousemove',moveTip)
        .on('mouseleave',function(){
          bgRect.attr('opacity',0.88).attr('stroke','#fff').attr('stroke-width',2);
          hideTip();
        })
        .on('click',function(){ if(d.data._has_sub) _openDrill(d.data.field); });
    });
  }

  function _drawSmallPanel(div, nodes, W) {
    const LABEL_W=178,BAR_AREA=W-LABEL_W-72;
    const maxCount=d3.max(nodes,d=>d.scientist_count)||1;
    const svg=div.append('svg').attr('width',W).attr('height',nodes.length*26+4);
    nodes.forEach((d,i)=>{
      const y=i*26+2,bw=Math.max(4,(d.scientist_count/maxCount)*BAR_AREA);
      const grp=svg.append('g').attr('transform',`translate(0,${y})`).style('cursor',d._has_sub?'pointer':'default');
      grp.append('text').attr('x',LABEL_W-6).attr('y',10).attr('text-anchor','end').attr('dominant-baseline','middle')
        .attr('font-size',10).attr('fill','#2a2a2a').text(d.field.length>26?d.field.slice(0,25)+'…':d.field);
      grp.append('rect').attr('x',LABEL_W).attr('y',3).attr('width',BAR_AREA).attr('height',14).attr('rx',3).attr('fill','#e8eff5');
      const bar=grp.append('rect').attr('x',LABEL_W).attr('y',3).attr('width',bw).attr('height',14).attr('rx',3)
        .attr('fill',drainColor(d.overseas_pct)).attr('opacity',0.85).attr('pointer-events','none');
      grp.append('text').attr('x',LABEL_W+bw+5).attr('y',10).attr('dominant-baseline','middle')
        .attr('font-size',9).attr('fill','#6b7a8a').attr('pointer-events','none')
        .text(`${d.scientist_count.toLocaleString()} 人 · ${d.overseas_pct.toFixed(1)}%`);
      grp.append('rect').attr('x',0).attr('y',0).attr('width',W).attr('height',24).attr('fill','transparent')
        .on('mouseenter',function(event){ bar.attr('opacity',1); showTip(event,`<strong>${d.field}</strong>${d.scientist_count.toLocaleString()} 位科学家<br>海外占比：<b>${d.overseas_pct.toFixed(1)}%</b>`+(d._has_sub?'<br><span style="opacity:0.65;font-size:11px">Click to explore →</span>':'')); })
        .on('mousemove',moveTip)
        .on('mouseleave',function(){ bar.attr('opacity',0.85); hideTip(); })
        .on('click',function(){ if(d._has_sub) _openDrill(d.field); });
    });
  }

  /* ════════════════════════════════
     DRILL-DOWN OVERLAY
  ════════════════════════════════ */
  function _openDrill(fieldName) {
    _drillSort='ovs';
    const old=document.getElementById('tm-drill-overlay');
    if (old) old.remove();
    const ov=document.createElement('div');
    ov.id='tm-drill-overlay';
    Object.assign(ov.style,{
      position:'fixed',inset:'64px 0 0 0',background:'#f5f8fc',
      zIndex:'9998',display:'flex',flexDirection:'column',
      boxShadow:'0 -4px 24px rgba(0,0,0,0.10)',
    });
    document.body.appendChild(ov);
    _renderDrill(ov,fieldName);
  }

  function _closeDrill() {
    const ov=document.getElementById('tm-drill-overlay');
    if (ov) ov.remove();
  }

  function _renderDrill(ov, fieldName) {
    ov.innerHTML='';

    const raw=(_subfieldData||[])
      .filter(d=>d.field===fieldName)
      .map(d=>({f:d.subfield||d.field, dom:+(d.domestic_count||0), ovs:+(d.overseas_count||0)}))
      .filter(d=>d.dom+d.ovs>=MIN_SHOW);

    const ovsPct=d=>(d.dom+d.ovs)>0?d.ovs/(d.dom+d.ovs):0;
    if (_drillSort==='ovs')   raw.sort((a,b)=>ovsPct(b)-ovsPct(a));
    if (_drillSort==='total') raw.sort((a,b)=>(b.dom+b.ovs)-(a.dom+a.ovs));
    if (_drillSort==='name')  raw.sort((a,b)=>a.f.localeCompare(b.f));

    const totalSci=(_fieldData||[]).find(d=>d.field===fieldName);
    const totalStr=totalSci?`${(+totalSci.scientist_count).toLocaleString()} 位科学家`:'';

    /* top bar */
    const topBar=document.createElement('div');
    Object.assign(topBar.style,{display:'flex',alignItems:'center',gap:'12px',padding:'12px 28px',background:'#fff',borderBottom:'1px solid #d6dee8',flexShrink:'0',flexWrap:'wrap'});
    const back=document.createElement('button');
    back.innerHTML='&#8592; 返回总览';
    Object.assign(back.style,{fontSize:'12px',fontWeight:'600',color:'#2b6f9f',cursor:'pointer',padding:'5px 14px',border:'1.5px solid #2b6f9f',borderRadius:'20px',background:'transparent',fontFamily:'inherit'});
    back.onmouseenter=()=>{back.style.background='#e8f2fa';};
    back.onmouseleave=()=>{back.style.background='transparent';};
    back.onclick=()=>_closeDrill();
    topBar.appendChild(back);
    const bc=document.createElement('span');
    bc.innerHTML=`<span style="color:#94a3b3;font-size:13px">学科大类 &nbsp;›&nbsp;</span><span style="color:#10325c;font-size:13px;font-weight:700">${fieldName}</span>`;
    topBar.appendChild(bc);
    if (totalStr){
      const badge=document.createElement('span');
      badge.textContent=totalStr;
      Object.assign(badge.style,{marginLeft:'auto',fontSize:'12px',color:'#6b7a8a',background:'#e8eff5',padding:'3px 10px',borderRadius:'20px'});
      topBar.appendChild(badge);
    }
    ov.appendChild(topBar);

    /* controls */
    const ctrl=document.createElement('div');
    Object.assign(ctrl.style,{display:'flex',alignItems:'center',gap:'20px',flexWrap:'wrap',padding:'10px 28px',background:'#fff',borderBottom:'1px solid #d6dee8',flexShrink:'0'});
    const leg=document.createElement('div');
    Object.assign(leg.style,{display:'flex',alignItems:'center',gap:'14px',fontSize:'11px',color:'#6b7a8a',flexWrap:'wrap'});
    leg.innerHTML=
      `<span style="display:flex;align-items:center;gap:5px"><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${DOM_COLOR}"></span>本土科学家</span>`+
      `<span style="display:flex;align-items:center;gap:5px"><span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${OVS_COLOR}"></span>海外科学家</span>`+
      `<span style="border-left:1px solid #d6dee8;padding-left:12px;color:#94a3b3">条形长度 = 科学家人数 · 悬停查看详情</span>`;
    ctrl.appendChild(leg);
    const sw=document.createElement('div');
    Object.assign(sw.style,{display:'flex',alignItems:'center',gap:'6px',marginLeft:'auto',fontSize:'11px'});
    sw.innerHTML='<span style="color:#6b7a8a">排序：</span>';
    [['ovs','海外占比 ↓'],['total','总人数'],['name','名称']].forEach(([k,label])=>{
      const btn=document.createElement('button'),active=_drillSort===k;
      btn.textContent=label;
      Object.assign(btn.style,{padding:'4px 10px',border:'1px solid '+(active?'#10325c':'#d6dee8'),borderRadius:'4px',cursor:'pointer',fontSize:'11px',fontFamily:'inherit',background:active?'#10325c':'#fff',color:active?'#fff':'#6b7a8a'});
      btn.onclick=()=>{_drillSort=k;_renderDrill(ov,fieldName);};
      sw.appendChild(btn);
    });
    ctrl.appendChild(sw);
    ov.appendChild(ctrl);

    /* scroll area */
    const scroll=document.createElement('div');
    Object.assign(scroll.style,{flex:'1',overflowY:'auto',padding:'16px 28px 32px'});
    ov.appendChild(scroll);

    if (!raw.length){
      const msg=document.createElement('div');
      msg.textContent='暂无子领域数据。';
      Object.assign(msg.style,{color:'#94a3b3',fontSize:'13px',padding:'24px 0'});
      scroll.appendChild(msg);
      return;
    }

    /* layout — two-pass to prevent domestic label overlapping subfield name */
    const OVS_LBL  = 70;
    const GAP       = 8;    /* gap between subfield name and domestic label */
    const totalW    = Math.max(600, Math.floor(ov.getBoundingClientRect().width) - 56);
    const ROW_H     = 40;
    const PAD_TOP   = 24;
    const svgH      = raw.length * ROW_H + PAD_TOP + 12;

  /* 强行调大基础学科标签宽度，给左侧腾出更多安全空间（从180调大到220） */
    const LABEL_W_MIN = 180; 
    const maxVal    = d3.max(raw, d => Math.max(d.dom, d.ovs)) || 1;

    const maxDomFrac = d3.max(raw, d => d.dom) / maxVal;
    const BAR_AREA   = totalW - LABEL_W_MIN - OVS_LBL;
    const halfW0     = BAR_AREA / 2;
    const maxDomPx   = maxDomFrac * halfW0;

    /* 碰撞预警：确保最长条形拉满加上数字宽度（约45px）后，依然大于 LABEL_W 的边界 */
    const needed     = 60 + 2 * GAP + maxDomPx; 
    const LABEL_W    = Math.max(LABEL_W_MIN, Math.ceil(LABEL_W_MIN + needed - halfW0 + 10));
    const BAR_AREA2  = totalW - LABEL_W - OVS_LBL;
    const halfW      = BAR_AREA2 / 2;
    const midX       = LABEL_W + halfW;
    const scale      = v => (v / maxVal) * halfW;

    const svg=d3.select(scroll).append('svg').attr('width',totalW).attr('height',svgH);

    svg.append('line').attr('x1',midX).attr('x2',midX).attr('y1',0).attr('y2',svgH)
      .attr('stroke','#c8d4de').attr('stroke-width',1).attr('stroke-dasharray','4,3');
    svg.append('text').attr('x',midX-10).attr('y',13).attr('text-anchor','end')
      .attr('font-size',10).attr('fill',DOM_COLOR).attr('font-weight','600').text('← 本土科学家');
    svg.append('text').attr('x',midX+10).attr('y',13).attr('text-anchor','start')
      .attr('font-size',10).attr('fill',OVS_COLOR).attr('font-weight','600').text('海外科学家 →');

    raw.forEach((_,i)=>{
      if (i%2===0) svg.append('rect').attr('x',0).attr('y',i*ROW_H+PAD_TOP)
        .attr('width',totalW).attr('height',ROW_H).attr('fill','rgba(0,0,0,0.018)');
    });

    raw.forEach((d,i)=>{
      const y=i*ROW_H+PAD_TOP, cy=y+ROW_H/2;
      const dw=scale(d.dom), ow=scale(d.ovs);
      const pct=Math.round(ovsPct(d)*100);
      const ratio=d.dom>0?`${(d.ovs/d.dom).toFixed(1)}× 倍（海外 vs 本土）`:(d.ovs>0?'本土：0':'');
      const row=svg.append('g');

      /* 1. 本土条形 */
      if (dw >= 1) row.append('rect').attr('x', midX - dw).attr('y', cy - 9)
        .attr('width', dw).attr('height', 18).attr('rx', 3)
        .attr('fill', DOM_COLOR).attr('opacity', 0.82).attr('pointer-events', 'none');

      /* 2. 本土人数标签 — 彻底角逐重叠！拿掉 dw > 30 限制，永远精准贴在条形最左侧结尾 */
      row.append('text')
        .attr('x', midX - dw - GAP) // 动态坐标：条形最左侧再往左错开一个 GAP
        .attr('y', cy)
        .attr('text-anchor', 'end') // 右对齐，让数字往左边长，绝对不碰条形
        .attr('dominant-baseline', 'middle')
        .attr('font-size', 9).attr('font-weight', '600')
        .attr('fill', DOM_COLOR)
        .attr('pointer-events', 'none')
        .text(d.dom.toLocaleString());

      /* 3. 海外条形 */
      if (ow >= 1) row.append('rect').attr('x', midX).attr('y', cy - 9)
        .attr('width', ow).attr('height', 18).attr('rx', 3)
        .attr('fill', OVS_COLOR).attr('opacity', 0.88).attr('pointer-events', 'none');

      /* 4. 海外人数标签 — 放在海外条形最右侧结尾 */
      row.append('text')
        .attr('x', midX + ow + GAP) // 动态坐标：始终在海外条形最右侧
        .attr('y', cy)
        .attr('text-anchor', 'start') // 左对齐
        .attr('dominant-baseline', 'middle')
        .attr('font-size', 9).attr('font-weight', '600').attr('fill', OVS_COLOR)
        .attr('pointer-events', 'none')
        .text(d.ovs.toLocaleString());

      /* subfield name */
      row.append('text').attr('x',LABEL_W-50).attr('y',cy)
        .attr('text-anchor','end').attr('dominant-baseline','middle')
        .attr('font-size',11).attr('fill','#2a2a2a').attr('pointer-events','none')
        .text(d.f.length>28?d.f.slice(0,27)+'…':d.f);

      /* full-row hit area — must be last so it's on top */
      row.append('rect').attr('x',0).attr('y',y).attr('width',totalW).attr('height',ROW_H)
        .attr('fill','transparent')
        .on('mouseenter',function(event){
          d3.select(this).attr('fill','rgba(43,111,159,0.07)');
          showTip(event,
            `<strong>${d.f}</strong><br>`+
            `学科大类：${fieldName}<br>`+
            `本土：<b>${d.dom.toLocaleString()}</b><br>`+
            `海外：<b>${d.ovs.toLocaleString()}</b><br>`+
            `海外占比：${pct}%`+
            (ratio?`<br>${ratio}`:'')
          );
        })
        .on('mousemove',moveTip)
        .on('mouseleave',function(){
          d3.select(this).attr('fill','transparent');
          hideTip();
        });
    });
  }

  function _showPlaceholder() {
    if (!_container) return;
    d3.select(_container).selectAll('*').remove();
    d3.select(_container).append('div').attr('class','chart-placeholder')
      .html('<strong>学科面积图</strong><span>面积 = 科学家人数 · 颜色 = 海外占比 · 点击查看子领域</span>');
  }

})();

