import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from "recharts";
import axios from "axios";

const BarChartComponent = ({ selectedMonth }: { selectedMonth: number }) => {
  const [barchartdata, setBarchartData] = useState<
    { range: string; count: number }[]
  >([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChartData = async () => {
      setError(""); 
      try {
        const response = await axios.get(
          `http://localhost:3000/bar-chart?month=${selectedMonth}`
        );
        console.log("Bar chart data:", response.data); 
        setBarchartData(response.data);
      } catch (error) {
        console.error("Error fetching bar chart data", error);
        setError("Failed to load bar chart data.");
      }
    };

    fetchChartData();
  }, [selectedMonth]);

  const formatData = (number: number) => {
    if (number > 1000) {
      return `${(number / 1000).toFixed(1)}k`; // Ensures a decimal point for thousands
    }
    return number.toString();
  };

  return (
    <div className="p-4 bg-slate-100 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-4">Bar Chart Distribution</h2>
      {error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <BarChart
          width={600}
          height={300}
          data={barchartdata}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="range"
            label={{
              value: "Price Range",
              position: "insideBottom",
              offset: -10,
            }}
          />
          <YAxis
            tickFormatter={formatData}
            label={{
              value: "Count",
             
              position: "insideLeft",
            }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      )}
    </div>
  );
};

export default BarChartComponent;
