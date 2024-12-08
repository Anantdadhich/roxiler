import { useEffect, useState } from "react";
import axios from "axios";
import {Statistics} from "./Statistics";
import BarChartComponent from "./Barchart";


const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface Transaction {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  sold: boolean;
  image: string;
}

const Transactions = () => {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [searchInput, setSearchInput] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  
  useEffect(() => {
    const getTransactions = async () => {
      setLoading(true);
      setError(""); 
      try {
        const response = await axios.get(
          `http://localhost:3000/transactions?month=${selectedMonth}&page=${page}&search=${searchInput}&limit=10`
        );

        if (response) {
          setTransactionList(response.data.transactions);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to fetch transactions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getTransactions();
  }, [page, searchInput, selectedMonth]);


  const handlePageChange = (newPage: number) => {
    if (newPage > 0) setPage(newPage);
  };

  return (
    <div className="h-screen w-full font-mono p-4 bg-gradient-to-r from-violet-400 to-violet-600">
      <div className="flex flex-col items-center">

        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-rose-950 bg-clip-text text-transparent mb-4">
          Dashboard
        </h1>

       
        <div className="flex items-center justify-center gap-4 mb-4">
          <input
            placeholder="Search Transactions"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-gray-300 px-2 py-1 rounded-lg"
          />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="">All Months</option>
            {months.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

       
        <div className="overflow-x-auto w-full">
          <table className="table-auto border-collapse border border-gray-200 w-full text-left">
            <thead className="bg-gradient-to-r from-neutral-100 to-slate-200">
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">Description</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Category</th>
                <th className="border border-gray-300 px-4 py-2">Sold</th>
                <th className="border border-gray-300 px-4 py-2">Image</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-4">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="text-center text-red-500 py-4">
                    {error}
                  </td>
                </tr>
              ) : transactionList.length > 0 ? (
                transactionList.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.id}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.title}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.description}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      ${transaction.price.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.category}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {transaction.sold ? "Yes" : "No"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <img
                        src={transaction.image}
                        alt={transaction.title}
                        className="h-10 w-10 object-cover rounded"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center text-black py-4">
                    No transactions available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      
        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-slate-200 rounded  "
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 bg-slate-200 rounded "
          >
            Next
          </button>
        </div>

     
        <div className="w-full mt-6">
          
          <Statistics selectedMonth={selectedMonth} />
        </div>
        <div className="w-full mt-6">
          <BarChartComponent selectedMonth={selectedMonth} />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
