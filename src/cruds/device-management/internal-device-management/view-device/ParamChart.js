import React from 'react';
import ReportsLineChart from 'examples/Charts/LineCharts/ReportsLineChart';
import MDBox from 'components/MDBox';

const ParamValuesChart = ({ paramValues }) => {
  // Extract and sort the data based on the 'created_at' timestamp
  const sortedValues = paramValues.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  const uniqueDates = [...new Set(sortedValues.map(item => new Date(item.created_at).toISOString().split('T')[0]))];

  // Get the last 7 unique dates
  const last7UniqueDates = uniqueDates.slice(-7);

  // Filter the sortedValues to include only the values for the last 7 unique dates
  const filteredValues = sortedValues.filter(item => {
    const itemDate = new Date(item.created_at).toISOString().split('T')[0];
    return last7UniqueDates.includes(itemDate);
  });

  const chartData = {
    labels: last7UniqueDates,
    datasets: {
      label: "Percent Level",
      data: filteredValues.map(item => parseInt(item?.value?.percent_level))
    }
  };

  return (
    <MDBox mt={5}>
      <ReportsLineChart
        color="success"
        chart={chartData}
      />
    </MDBox>
  );
};

export default ParamValuesChart;