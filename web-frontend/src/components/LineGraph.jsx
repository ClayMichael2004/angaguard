import React, { useState, useRef } from 'react';
import { Activity, ArrowUpRight, ArrowDownRight, DollarSign, Flame, Wallet, Maximize2 } from 'lucide-react';

export const LineGraph = ({
  data = [],
  title = "Kenyan Biochar Carbon Credit Spot Index",
  height = 300,
}) => {
  const containerRef = useRef(null);
  const [metricMode, setMetricMode] = useState('price'); // 'price', 'volume', 'mpesa'
  const [timeframe, setTimeframe] = useState('1D');
  const [hoverIndex, setHoverIndex] = useState(null);

  // Realistic Market Volatility Datasets (Eliminating Flatness with Authentic Trading Swings)
  const metricDatasets = {
    price: {
      unitPrefix: '$',
      unitSuffix: '/tCO2e',
      label: 'Spot Price ($)',
      color: '#10b981', // Eco Emerald
      data: [
        { x: '08:00 AM', y: 35.20, vol: 45 },
        { x: '09:00 AM', y: 48.80, vol: 88 },
        { x: '10:00 AM', y: 41.50, vol: 62 },
        { x: '11:00 AM', y: 69.40, vol: 145 },
        { x: '12:00 PM', y: 58.10, vol: 110 },
        { x: '01:00 PM', y: 98.30, vol: 240 },
        { x: '02:00 PM', y: 86.00, vol: 190 },
        { x: '03:00 PM', y: 142.50, vol: 410 },
        { x: '04:00 PM', y: 128.20, vol: 320 },
        { x: '05:00 PM', y: 139.80, vol: 280 },
        { x: '06:00 PM', y: 131.40, vol: 210 },
        { x: 'Now', y: 135.50, vol: 250 },
      ]
    },
    volume: {
      unitPrefix: '',
      unitSuffix: ' KG',
      label: 'Biochar Harvest (KG)',
      color: '#f97316', // Terracotta Amber
      data: [
        { x: '08:00 AM', y: 80, vol: 80 },
        { x: '09:00 AM', y: 210, vol: 210 },
        { x: '10:00 AM', y: 160, vol: 160 },
        { x: '11:00 AM', y: 450, vol: 450 },
        { x: '12:00 PM', y: 390, vol: 390 },
        { x: '01:00 PM', y: 780, vol: 780 },
        { x: '02:00 PM', y: 690, vol: 690 },
        { x: '03:00 PM', y: 1250, vol: 1250 },
        { x: '04:00 PM', y: 1180, vol: 1180 },
        { x: '05:00 PM', y: 1360, vol: 1360 },
        { x: '06:00 PM', y: 1390, vol: 1390 },
        { x: 'Now', y: 1420, vol: 1420 },
      ]
    },
    mpesa: {
      unitPrefix: 'KSh ',
      unitSuffix: '',
      label: 'M-Pesa Disbursed (KSh)',
      color: '#16a34a', // Forest Green
      data: [
        { x: '08:00 AM', y: 1800, vol: 1800 },
        { x: '09:00 AM', y: 5200, vol: 5200 },
        { x: '10:00 AM', y: 4100, vol: 4100 },
        { x: '11:00 AM', y: 12400, vol: 12400 },
        { x: '12:00 PM', y: 10800, vol: 10800 },
        { x: '01:00 PM', y: 21500, vol: 21500 },
        { x: '02:00 PM', y: 19200, vol: 19200 },
        { x: '03:00 PM', y: 31800, vol: 31800 },
        { x: '04:00 PM', y: 29500, vol: 29500 },
        { x: '05:00 PM', y: 33400, vol: 33400 },
        { x: '06:00 PM', y: 34100, vol: 34100 },
        { x: 'Now', y: 34500, vol: 34500 },
      ]
    }
  };

  const currentConfig = metricDatasets[metricMode] || metricDatasets.price;
  const rawData = data && data.length >= 2 ? data : currentConfig.data;

  // Tight Financial Auto-Scaling Math (Expands volatile price swings to 85% of chart height)
  const yValues = rawData.map((d) => Number(d.y));
  const rawMin = Math.min(...yValues);
  const rawMax = Math.max(...yValues);

  const span = rawMax - rawMin || 1;
  const yMinScale = rawMin - span * 0.05; // 5% tight headroom margin
  const yMaxScale = rawMax + span * 0.05;
  const yRange = yMaxScale - yMinScale;

  const paddingLeft = 65;
  const paddingRight = 70;
  const paddingTop = 35;
  const paddingBottom = 45;
  const svgWidth = 680;
  const svgHeight = height;

  const graphWidth = svgWidth - paddingLeft - paddingRight;
  const graphHeight = svgHeight - paddingTop - paddingBottom;

  // Dynamic 1:1 Pixel Mapping
  const points = rawData.map((item, i) => {
    const x = paddingLeft + (i / (rawData.length - 1)) * graphWidth;
    const y = paddingTop + (1 - (Number(item.y) - yMinScale) / yRange) * graphHeight;
    return { x, y, label: item.x, value: Number(item.y), vol: Number(item.vol || 0) };
  });

  // Natural Monotone Cubic Spline Generator (Non-flat, smooth market curves)
  const createVolatileSpline = (pts) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const dx = p1.x - p0.x;
      const cp1x = (p0.x + dx * 0.4).toFixed(1);
      const cp1y = p0.y.toFixed(1);
      const cp2x = (p0.x + dx * 0.6).toFixed(1);
      const cp2y = p1.y.toFixed(1);
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }
    return d;
  };

  const linePathD = createVolatileSpline(points);
  const areaPathD = `${linePathD} L ${points[points.length - 1].x.toFixed(1)} ${svgHeight - paddingBottom} L ${points[0].x.toFixed(1)} ${svgHeight - paddingBottom} Z`;

  // Dynamic Y-Axis Ticks (5 precise levels mapped to exact data range)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const val = yMinScale + (i / 4) * yRange;
    const y = paddingTop + (1 - (val - yMinScale) / yRange) * graphHeight;
    const labelVal = val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(metricMode === 'price' ? 2 : 0);
    return { val: labelVal, y };
  });

  // Interactive Crosshair Handler
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const chartLeft = (paddingLeft / svgWidth) * rect.width;
    const chartRight = ((svgWidth - paddingRight) / svgWidth) * rect.width;

    if (mouseX < chartLeft || mouseX > chartRight) {
      setHoverIndex(null);
      return;
    }

    const pct = (mouseX - chartLeft) / (chartRight - chartLeft);
    const idx = Math.min(
      points.length - 1,
      Math.max(0, Math.round(pct * (points.length - 1)))
    );
    setHoverIndex(idx);
  };

  const activePoint = hoverIndex !== null ? points[hoverIndex] : points[points.length - 1];
  const firstVal = points[0].value;
  const currVal = activePoint.value;
  const pctChange = (((currVal - firstVal) / firstVal) * 100).toFixed(2);
  const isPositive = Number(pctChange) >= 0;

  return (
    <div className="w-full font-mono text-xs space-y-4 animate-fadeIn">
      
      {/* Top Controls: Metric Mode & Ticker Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-[#120e0c]/95 light:bg-[#e2e8f0] p-4 rounded-2xl border border-[#443028] light:border-[#cbd5e1] text-xs gap-4 shadow-lg">
        
        {/* Metric Selector Tabs */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMetricMode('price')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              metricMode === 'price'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-[#1c1512] light:bg-[#edf2f7] text-stone-400 light:text-stone-700 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Spot Price</span>
          </button>

          <button
            onClick={() => setMetricMode('volume')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              metricMode === 'volume'
                ? 'bg-orange-600 text-white shadow-md'
                : 'bg-[#1c1512] light:bg-[#edf2f7] text-stone-400 light:text-stone-700 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Biochar KG</span>
          </button>

          <button
            onClick={() => setMetricMode('mpesa')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              metricMode === 'mpesa'
                ? 'bg-emerald-800 text-white shadow-md'
                : 'bg-[#1c1512] light:bg-[#edf2f7] text-stone-400 light:text-stone-700 hover:text-white'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>M-Pesa (KSh)</span>
          </button>
        </div>

        {/* Dynamic Metric Ticker & Timeframe Tabs */}
        <div className="flex items-center justify-between md:justify-end space-x-4 w-full md:w-auto">
          <div className="flex items-center space-x-2 font-bold text-stone-200 light:text-stone-900">
            <span className="hidden sm:inline text-stone-400">{currentConfig.label}:</span>
            <span style={{ color: currentConfig.color }} className="text-sm font-extrabold">
              {currentConfig.unitPrefix}{currVal.toLocaleString('en-US', { minimumFractionDigits: metricMode === 'price' ? 2 : 0 })}{currentConfig.unitSuffix}
            </span>
            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] flex items-center ${
              isPositive ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
            }`}>
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              <span>{isPositive ? `+${pctChange}%` : `${pctChange}%`}</span>
            </span>
          </div>

          <div className="flex items-center space-x-1 bg-[#1c1512] light:bg-[#cbd5e1] p-1 rounded-xl border border-[#443028] light:border-[#cbd5e1]">
            {['1D', '1W', '1M', '1Y'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-emerald-700 text-white shadow-md'
                    : 'text-stone-400 light:text-stone-700 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Dynamic Non-Flat Volatile Chart Viewport */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIndex(null)}
        className="relative w-full overflow-hidden bg-[#1c1512]/90 light:bg-[#edf2f7]/95 backdrop-blur-md rounded-2xl border border-[#443028] light:border-[#cbd5e1] p-4 cursor-crosshair shadow-xl"
      >
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="volatilityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={currentConfig.color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={currentConfig.color} stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Dynamic Gridlines & Scaled Y-Axis Price Labels */}
          {yTicks.map((tick, i) => (
            <g key={i}>
              <line
                x1={paddingLeft}
                y1={tick.y}
                x2={svgWidth - paddingRight}
                y2={tick.y}
                stroke="#443028"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.45"
              />
              <text
                x={svgWidth - paddingRight + 8}
                y={tick.y + 3}
                fill="#786c65"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {currentConfig.unitPrefix}{tick.val}
              </text>
            </g>
          ))}

          {/* Area Gradient Fill Under Curve */}
          <path d={areaPathD} fill="url(#volatilityGrad)" />

          {/* Dynamic Non-Flat Line Curve (2.2px stroke) */}
          <path
            d={linePathD}
            fill="none"
            stroke={currentConfig.color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points Node Anchors */}
          {points.map((pt, i) => (
            <circle
              key={`node-${i}`}
              cx={pt.x}
              cy={pt.y}
              r={hoverIndex === i ? "5" : "2.5"}
              fill={currentConfig.color}
              stroke="#120e0c"
              strokeWidth="1.5"
              className="transition-all"
            />
          ))}

          {/* Live Continuous Pulse Indicator at Market Head */}
          {points.length > 0 && (
            <g>
              <circle
                cx={points[points.length - 1].x}
                cy={points[points.length - 1].y}
                r="8"
                fill={currentConfig.color}
                opacity="0.4"
                className="animate-ping"
              />
              <circle
                cx={points[points.length - 1].x}
                cy={points[points.length - 1].y}
                r="4.5"
                fill={currentConfig.color}
                stroke="#120e0c"
                strokeWidth="1.8"
              />
            </g>
          )}

          {/* X-Axis Timeline Labels */}
          {points.map((pt, i) => {
            if (i % Math.ceil(points.length / 6) !== 0 && i !== points.length - 1) return null;
            return (
              <text
                key={`xlabel-${i}`}
                x={pt.x}
                y={svgHeight - 12}
                textAnchor="middle"
                fill="#786c65"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
              >
                {pt.label}
              </text>
            );
          })}

          {/* Crosshair HUD Overlay */}
          {hoverIndex !== null && activePoint && (
            <g>
              <line
                x1={activePoint.x}
                y1={paddingTop}
                x2={activePoint.x}
                y2={svgHeight - paddingBottom}
                stroke="#f97316"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <line
                x1={paddingLeft}
                y1={activePoint.y}
                x2={svgWidth - paddingRight}
                y2={activePoint.y}
                stroke="#f97316"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="5"
                fill="#f97316"
                stroke="#120e0c"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {/* Floating Financial Crosshair Tooltip */}
        {hoverIndex !== null && activePoint && (
          <div
            style={{
              left: `${(activePoint.x / svgWidth) * 100}%`,
              top: `${(activePoint.y / svgHeight) * 100}%`,
            }}
            className="absolute transform -translate-x-1/2 -translate-y-14 bg-[#120e0c] light:bg-[#e2e8f0] border border-orange-500/80 px-3 py-2 rounded-xl shadow-2xl text-[11px] text-white light:text-stone-900 pointer-events-none z-30 space-y-0.5 whitespace-nowrap font-mono"
          >
            <div className="flex justify-between items-center space-x-3 border-b border-[#443028] light:border-[#cbd5e1] pb-1">
              <span className="text-stone-400 light:text-stone-700 font-bold">{activePoint.label}</span>
              <span style={{ color: currentConfig.color }} className="font-bold">
                {currentConfig.unitPrefix}{activePoint.value.toLocaleString('en-US', { minimumFractionDigits: metricMode === 'price' ? 2 : 0 })}{currentConfig.unitSuffix}
              </span>
            </div>
            <div className="flex justify-between items-center space-x-3 text-[10px]">
              <span className="text-stone-300 light:text-stone-800">{currentConfig.label}</span>
              <span className={isPositive ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                {isPositive ? `+${pctChange}%` : `${pctChange}%`}
              </span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
