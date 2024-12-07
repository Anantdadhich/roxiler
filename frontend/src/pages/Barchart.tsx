import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, Tooltip } from "recharts";
import axios from "axios";

const BarChartComponent = ({ selectedMonth }: { selectedMonth: string }) => {
  const [barchartdata, setBarchartData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/bar-chart?month=${selectedMonth}`
        );

       

        setBarchartData(response.data);
      } catch (error) {
        console.error("Error fetching bar chart data", error);
      }
    };

    fetchChartData();
  }, [selectedMonth]);

  const formatData = (number: number) => {
    if (number > 1000) {
      return `${(number / 1000).toString()}k`;
    }
    return number.toString();
  };

  return (
    <div className="p-4 bg-gradient-to-r from-yellow-200 to-amber-300">
      <h2 className="text-lg font-bold mb-4 bg-gradient-to-r from-stone-500 to-stone-800 bg-clip-text text-transparent">Bar Chart Distribution</h2>
        <BarChart
        width={600}
        height={300}
        data={barchartdata}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="range"
          
          label={{ value: "Price Range", position: "insideBottom", offset: -10 }}
        />
        <YAxis
           tickFormatter={formatData}
          label={{
            value: "Count",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip />
        <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </div>
  
  );
};

export default BarChartComponent;
