import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TOOLTIP_STYLE = {
  background: "rgba(15, 30, 40, 0.85)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "10px",
  backdropFilter: "blur(12px)",
};

const CHARTS_CONFIG = [
  {
    id: "soil",
    title: "Humedad del suelo / tiempo",
    dataKey: "soilMoisture",
    yLabel: "Humedad suelo (%)",
    unit: "%",
    domain: [0, 100],
    stroke: "#69f0ae",
    tooltipName: "Humedad del suelo",
  },
  {
    id: "temp",
    title: "Temperatura / tiempo",
    dataKey: "temperatureC",
    yLabel: "Temperatura (°C)",
    unit: "°C",
    domain: ["auto", "auto"],
    stroke: "#ff5252",
    tooltipName: "Temperatura",
  },
  {
    id: "air",
    title: "Humedad del aire / tiempo",
    dataKey: "airHumidity",
    yLabel: "Humedad aire (%)",
    unit: "%",
    domain: [0, 100],
    stroke: "#40c4ff",
    tooltipName: "Humedad del aire",
  },
];

function renderYAxisTitle(text) {
  return ({ viewBox }) => {
    if (!viewBox || viewBox.height == null) return null;
    const x = viewBox.x - 10;
    const y = viewBox.y + viewBox.height / 2;
    return (
      <text
        x={x}
        y={y}
        fill="rgba(255, 255, 255, 0.88)"
        fontSize={11}
        fontWeight={600}
        textAnchor="middle"
        dominantBaseline="middle"
        transform={`rotate(-90, ${x}, ${y})`}
      >
        {text}
      </text>
    );
  };
}

function SingleMetricChart({ config, chartData, expanded }) {
  const height = expanded ? 300 : 240;
  const tickSuffix = config.unit === "°C" ? "°C" : "%";

  return (
    <article className={`metric-chart ${expanded ? "metric-chart--expanded" : ""}`}>
      <h3 className="metric-chart__title">{config.title}</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={chartData}
            margin={{ top: 16, right: 24, left: 64, bottom: 28 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: expanded ? 13 : 11, fill: "rgba(255,255,255,0.85)" }}
              interval="preserveStartEnd"
              minTickGap={32}
              label={{
                value: "Tiempo",
                position: "insideBottom",
                offset: -6,
                fill: "rgba(255,255,255,0.75)",
                fontSize: 12,
              }}
            />
            <YAxis
              width={48}
              domain={config.domain}
              tick={{ fontSize: 11, fill: "rgba(255,255,255,0.85)" }}
              tickFormatter={(value) => `${value}${tickSuffix}`}
              label={renderYAxisTitle(config.yLabel)}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(value) => [`${value} ${config.unit}`, config.tooltipName]}
              labelFormatter={(label) => `Momento: ${label}`}
            />
            <Line
              type="monotone"
              dataKey={config.dataKey}
              name={config.tooltipName}
              stroke={config.stroke}
              strokeWidth={expanded ? 3 : 2}
              dot={false}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

function TelemetryLineChart({ history, expanded = false }) {
  if (!history.length) {
    return (
      <p className="section-empty">Aún no hay datos para las gráficas.</p>
    );
  }

  const chartData = history.map((row, index) => ({
    ...row,
    label: row.timeLabel || `${row.fecha} ${row.hora}` || `#${index + 1}`,
  }));

  return (
    <div className={`charts-stack ${expanded ? "charts-stack--expanded" : ""}`}>
      {CHARTS_CONFIG.map((config) => (
        <SingleMetricChart
          key={config.id}
          config={config}
          chartData={chartData}
          expanded={expanded}
        />
      ))}
    </div>
  );
}

export default TelemetryLineChart;
