import { useEffect, useState } from "react";
import axios from "axios";

interface Stats {
  totalSales: number;
  totalSoldItems: number;
  totalUnsoldItems: number;
}

export const Statistics = ({ selectedMonth }: { selectedMonth: string }) => {
    const [stats, setStats] = useState<Stats | null>(null);
    //@ts-ignore
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const  res = await axios.get(
          `http://localhost:3000/statistics?month=${selectedMonth}`
        );
       
        setStats(res.data)
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [selectedMonth]);

  return (
    <div className="p-4 bg-gray-100">
      <h2 className="text-lg font-bold mb-2">Statistics for {selectedMonth}</h2>
       <div className='statitics-container'>
            <div className='element'><span>Total Sale</span> <span>{stats?.totalSales}</span></div>
            <div className='element'><span>Total sold item</span> <span>{stats?.totalSoldItems}</span></div>
            <div className='element'><span>Total not sold item</span> <span>{stats?.totalUnsoldItems}</span></div>
        </div>
      
    </div>
  );
};
