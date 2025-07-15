import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import customAxios from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const Orders = () => {
    const tableHeadings = ["Order ID", "Customer Name", "Product", "Quantity", "Date", "Status"];
    const [filter, setFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
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
                    headers: {
                        Authorization: token
                    }
                });
                setSales(response.data.orders)
            } catch (error) {
                console.log(error);
            }
        }
        fetchOrders();
    }, []);

    const filteredSales = filter === "All"
        ? sales
        : sales.filter(sale => sale.Status === filter);

    const totalPages = Math.ceil(filteredSales.length / itemsPerPage);

    const paginatedSales = filteredSales.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    const handleFilterChange = (value) => {
        setFilter(value);
        setCurrentPage(1);
    };


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
                            <select
                                onChange={(e) => handleFilterChange(e.target.value)}
                                className="rounded w-[180px] bg-gray-200 hover:bg-gray-300 text-center text-xl"
                            >
                                <option value="All">All Orders</option>
                                <option value="Pending">Pending</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
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
                                {paginatedSales && paginatedSales.map((sale, index) => {
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
                                                    className={`py-1 px-2 rounded text-white ${sale.Status === 'Delivered' ? 'bg-green-500' :
                                                        sale.Status === 'Pending' ? 'bg-blue-500' :
                                                            sale.Status === 'Cancelled' ? 'bg-red-500' : ''
                                                        }`}
                                                >
                                                    <option className='bg-white text-black' value="Pending">Pending</option>
                                                    <option className='bg-white text-black' value="Delivered">Delivered</option>
                                                    <option className='bg-white text-black' value="Cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end mt-4 gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span className="px-2 py-1">{currentPage} / {totalPages}</span>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;
