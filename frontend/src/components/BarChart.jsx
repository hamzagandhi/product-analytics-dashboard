import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function BarChart({ data, onBarClick }) {
  const handleClick = (state) => {
    if (state?.activePayload?.length > 0) {
      const featureName = state.activePayload[0].payload.feature_name;
      onBarClick(featureName);
    }
  };

  if (!data || data.length === 0) {
    return <p style={{ padding: "1rem" }}>No data for selected filters.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsBarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
        onClick={handleClick}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis
          type="category"
          dataKey="feature_name"
          width={140}
          tick={{ fontSize: 12 }}
        />
        <Tooltip formatter={(value) => [`${value} clicks`, "Clicks"]} />
        <Bar
          dataKey="total_clicks"
          fill="#667eea"
          radius={[0, 6, 6, 0]}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export default BarChart;
