import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import customAxios from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const SalesInvoice = () => {
    const tableHeadings = ["Order ID", "Customer Name", "Product", "Quantity", "Date", "Status"];
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [sales, setSales] = useState([]);

    const token = localStorage.getItem("token");

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await customAxios.get('/api/order/listorders', {
                    params: { page: 1, limit: 10 },
                    headers: {
                        Authorization: token
                    }
                })
                setSales(response.data.orders)
            } catch (error) {
                console.log(error);
            }
        }
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await customAxios.put(`/api/order/${orderId}/status`, { Status: newStatus });

            setSales((prevSales) =>
                prevSales.map((sale) =>
                    sale._id === orderId ? { ...sale, Status: newStatus } : sale
                )
            );
            toast.success(newStatus)
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    return (

        <div className="flex relative h-screen">
            <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`flex flex-col flex-grow ${showForm ? 'blur-sm pointer-events-none transition-all duration-300' : ''}`}>
                <Navbar />
                <div className="p-4">
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className='flex justify-between'>
                            <h3 className="text-xl font-bold mb-4">Orders</h3>
                            <button
                                // onClick={handleAddInvoice}
                                className='bg-green-500 rounded text-white w-[150px] hover:bg-green-600'>
                                Filter
                            </button>
                        </div>
                        <table className="min-w-full table-auto border-collapse text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    {tableHeadings.map((title, index) => (
                                        <th key={index} className="py-3 px-4 border-b font-semibold text-gray-700">{title}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {sales && sales.map((sale, index) => {
                                    const dateOnly = sale.createdAt?.split('T')[0];
                                    return (
                                        <tr key={sale._id} className="hover:bg-gray-50">
                                            <td className="py-3 px-4 border-b">{sale._id}</td>
                                            <td className="py-3 px-4 border-b">{sale.customerId.name}</td>
                                            <td className="py-3 px-4 border-b">{sale.products}</td>
                                            <td className="py-3 px-4 border-b">{sale.quantity}</td>
                                            <td className="py-3 px-4 border-b">{dateOnly}</td>
                                            <td className="py-3 px-4 border-b">
                                                <select
                                                    value={sale.Status}
                                                    onChange={(e) => handleStatusChange(sale._id, e.target.value)}
                                                    className={`
      py-1 px-2 rounded
      text-white
      ${sale.Status === 'Delivered' ? 'bg-green-500' : ''}
      ${sale.Status === 'Pending' ? 'bg-blue-500' : ''}
      ${sale.Status === 'Cancelled' ? 'bg-red-500' : ''}
    `}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default SalesInvoice;
