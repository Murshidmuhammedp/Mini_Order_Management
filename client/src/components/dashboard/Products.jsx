import React, { useEffect, useState } from 'react'
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import customAxios from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const Products = () => {
    const headline = ["Sl. No", "Product Name", "Description", "Quantity", "Price", "Action"]
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [products, setProducts] = useState([]);
    var currentPage = 1
    var totalPages = 1

    const token = localStorage.getItem("token");


    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            await customAxios.get('/api/product/products', {
                headers: {
                    Authorization: token
                }
            })
                .then((result) => {
                    setProducts(result.data.products)
                }).catch((error) => {
                    console.log(error);
                })
        }
        fetchProducts();
    }, []);

    const toggleBlock = async (id) => {
        try {
            const response = await customAxios.patch(`/api/product/islisted/${id}`, { headers: { Authorization: token } })
            toast.success(response.data.message);
            setProducts((prevCustomers) =>
                prevCustomers.map((product) =>
                    product._id == id
                        ? { ...product, isListed: !product.isListed } : product
                )
            )
        } catch (error) {
            console.log(error);
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
                            <h3 className="text-xl font-bold mb-4">Products</h3>
                        </div>
                        <table className="min-w-full table-auto border-collapse text-left">
                            <thead className="bg-gray-100">
                                <tr>
                                    {headline.map((title, index) => (
                                        <th key={index} className="py-2 px-4 border-b font-semibold text-gray-700">{title}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {products && products.map((product, index) => (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="py-3 px-4 border-b">{index + 1}</td>
                                        <td className="py-3 px-4 border-b">{product.productName}</td>
                                        <td className="py-3 px-4 border-b">{product.description}</td>
                                        <td className="py-3 px-4 border-b">{product.quantity}</td>
                                        <td className="py-3 px-4 border-b">{product.price}</td>
                                        <td className="py-3 px-4 border-b">
                                            <button
                                                onClick={() => toggleBlock(product._id)}
                                                className={`py-1 px-3 rounded ml-4 ${product.isListed ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'
                                                    } text-white`}
                                            >
                                                {product.isListed ? 'Unlisted' : 'Listed'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                disabled={currentPage === 1}
                                className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <span className="px-2 py-1">{currentPage} / {totalPages}</span>
                            <button
                                disabled={currentPage === totalPages}
                                className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products;