/*import { useEffect, useState } from "react";
import axios from "axios";
import Statistics from "./Statistics";
import BarChartComponent from "./Barchart";


const months = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const Transactions = () => {
  const [transactionlist, settransactionList] = useState([]);
  const [selectedMonth, setselectedMonth] = useState(months[new Date().getMonth()]);
  const [searchInput, setsearchInput] = useState("");
  const [page, setPage] = useState(1);
 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  




  useEffect(() => {
    const getTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/transactions?month=${selectedMonth}&page=${page}&search=${searchInput}&perPage=10`,
          
        );

        if (response) {
        console.log(response)
        settransactionList(response.data.transactions)
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

  
  

  return (
    <div className="h-auto w-full font-mono ">
         <div className="flex-col items-center justify-between">
          <div className="text-center ">

            <h1 className="text-2xl font-bold font-serif  bg-gradient-to-r from-teal-900 to-slate-800 bg-clip-text text-transparent ">Dashboard</h1>
          </div>
          <div className="items-center justify-center flex gap-4">
            <input placeholder="Search Transactions" value={searchInput} onChange={(e)=> setsearchInput(e.target.value)} className="max-w-full justify-center items-center" />
             <select value={selectedMonth} onChange={(e)=> setselectedMonth(e.target.value)} className="w-20">
              {months.map( m => (
                <option value=""></option>
              ) )}

             </select>
          </div>
          <table>
           <tr>
               <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Sold</th>
                <th>Image</th>

           </tr>
          </table>
          <tbody>
            {
              
            }
          </tbody>


          <div>
            <Statistics selectedMonth={selectedMonth}></Statistics>
          </div>
            <div>
              <BarChartComponent selectedMonth={selectedMonth}></BarChartComponent>
            </div>
         </div>
    </div>
  );
};





export default Transactions;
*/

import { useEffect, useState } from "react";
import axios from "axios";
import {Statistics} from "./Statistics";
import BarChartComponent from "./Barchart";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const Transactions = () => {
  const [transactionlist, settransactionList] = useState([]);
  const [selectedMonth, setselectedMonth] = useState(
    months[new Date().getMonth()]
  );
  const [searchInput, setsearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getTransactions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/transactions?month=${selectedMonth}&page=${page}&search=${searchInput}&perPage=10`
        );

        if (response) {
          settransactionList(response.data.transactions);
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

  return (
    <div className="h-auto w-full font-mono p-4 bg-gradient-to-r from-amber-300 to-amber-600">
      <div className="flex flex-col items-center">
  
        <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-800 to-rose-950 bg-clip-text text-transparent mb-4">
          Dashboard
        </h1>

   
        <div className="flex items-center justify-center gap-4 mb-4">
          <input
            placeholder="Search Transactions"
            value={searchInput}
            onChange={(e) => setsearchInput(e.target.value)}
            className="border border-gray-300  px-2 py-1 rounded-lg "
          />
          <select
            value={selectedMonth}
            onChange={(e) => setselectedMonth(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

 
        <div className="overflow-x-auto w-full">
          <table className="table-auto border-collapse border border-gray-200 w-full text-left">
            <thead className="bg-gradient-to-r from-yellow-100 to-amber-200">
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
              {transactionlist.length > 0 ? (
                transactionlist.map((transaction) => (
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
                      ${transaction.price}
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
                  <td
                    colSpan="7"
                    className="text-center text-gray-500 py-4"
                  >
                    {loading
                      ? "Loading..."
                      : error || "No transactions available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Statistics and BarChart */}
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
