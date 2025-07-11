import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import customAxios from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const Customers = () => {
    const headline = ["Sl. No", "Name", "Email", "Mobile", "Location", "Action"]
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [customers, setCustomers] = useState([]);
    
    const token = localStorage.getItem("token");


    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchCustomers = async () => {
            await customAxios.get('/api/customer/customers')
                .then((result) => {
                    setCustomers(result.data.customers)
                }).catch((error) => {
                    console.log(error);
                })
        }
        fetchCustomers();
    }, []);

    const toggleBlock = async (id) => {
        try {
            const response = await customAxios.patch(`/api/customer/block/${id}`);
            toast.success(response.data.message);
            setCustomers((prevCustomers) =>
                prevCustomers.map((customer) =>
                    customer._id === id
                        ? { ...customer, isBlocked: !customer.isBlocked }
                        : customer
                )
            );
        } catch (error) {
            console.log(error)
        }
    };
   
    return (
        <div className="flex">
            <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex flex-col flex-grow">
                <Navbar />
                <div className="p-4">

                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className='flex justify-between'>
                            <h3 className="text-xl font-bold mb-4">Customers</h3>
                        </div>
                        <table className="min-w-full table-auto border-collapse text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    {headline.map((title, index) => (
                                        <th key={index} className="py-3 px-4 border-b font-semibold text-gray-700">{title}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {customers && customers.map((user, index) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 border-b">{index + 1}</td>
                                        <td className="py-3 px-4 border-b">{user.name}</td>
                                        <td className="py-3 px-4 border-b">{user.email}</td>
                                        <td className="py-3 px-4 border-b">{user.mobileNumber}</td>
                                        <td className="py-3 px-4 border-b">{user.address.city},{user.address.state}</td>
                                        <td className="py-3 px-4 border-b">
                                            <button
                                                onClick={() => toggleBlock(user._id)}
                                                className={`py-1 px-3 rounded ml-4 ${user.isBlocked ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'
                                                    } text-white`}
                                            >
                                                {user.isBlocked ? 'Unblock' : 'Block'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Customers;