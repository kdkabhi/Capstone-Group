import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getPackages, createPackage, updatePackage, deletePackage } from '../apiService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserContext } from '../UserContext';

const AdminDashboard = () => {
    const [packages, setPackages] = useState([]);
    const [newPackage, setNewPackage] = useState({
        name: "",
        price: "",
        days: "",
        date: "",
        description: "",
        itinerary: "",
        images: [],
    });

    const [editPackage, setEditPackage] = useState(null);
    const { user } = useContext(UserContext); // Access user state

    useEffect(() => {
        fetchPackages();
    }, []);

    const fetchPackages = async () => {
        try {
            const data = await getPackages();
            setPackages(data);
        } catch (error) {
            console.error('Error fetching packages:', error);
        }
    };

    const handleAddPackage = async () => {
        try {
            const formData = new FormData();
            formData.append('name', newPackage.name);
            formData.append('description', newPackage.description);
            formData.append('price', newPackage.price);
            formData.append('days', newPackage.days);
            formData.append('date', newPackage.date);
            formData.append('itinerary', newPackage.itinerary);

            newPackage.images.forEach((image) => {
                formData.append('images', image);
            });

            const createdPackage = await createPackage(formData);
            setPackages([...packages, createdPackage]);
            setNewPackage({
                name: "",
                price: "",
                days: "",
                date: "",
                description: "",
                itinerary: "",
                images: [],
            });
        } catch (error) {
            console.error('Error adding package:', error);
        }
    };

    const handleDeletePackage = async (id) => {
        try {
            await deletePackage(id);
            setPackages(packages.filter(pkg => pkg.id !== id));
        } catch (error) {
            console.error('Error deleting package:', error);
        }
    };

    const handleEditPackage = (pkg) => {
        setEditPackage(pkg);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h2 className="text-center fw-bold">Admin Dashboard - Manage Packages</h2>

                <div className="mb-4">
                    <h4>Add New Package</h4>
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Package Name"
                        value={newPackage.name}
                        onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                    />
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Price"
                        value={newPackage.price}
                        onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                    />
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Duration"
                        value={newPackage.days}
                        onChange={(e) => setNewPackage({ ...newPackage, days: e.target.value })}
                    />
                    <input
                        type="date"
                        className="form-control mb-2"
                        value={newPackage.date}
                        onChange={(e) => setNewPackage({ ...newPackage, date: e.target.value })}
                    />
                    <textarea
                        className="form-control mb-2"
                        placeholder="Description"
                        value={newPackage.description}
                        onChange={(e) => setNewPackage({ ...newPackage, description: e.target.value })}
                        style={{ height: "50px" }}
                    ></textarea>
                    <textarea
                        className="form-control mb-2"
                        placeholder="Itinerary (e.g., hotel, flights, places to visit)"
                        value={newPackage.itinerary}
                        onChange={(e) => setNewPackage({ ...newPackage, itinerary: e.target.value })}
                    ></textarea>
                    <input
                        type="file"
                        className="form-control mb-2"
                        onChange={(e) => setNewPackage({ ...newPackage, images: Array.from(e.target.files) })}
                        multiple
                    />
                    <button className="btn btn-success" onClick={handleAddPackage}>
                        Add Package
                    </button>
                </div>

                <table className="table table-striped mt-4">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Duration</th>
                            <th>Date</th>
                            <th style={{ width: "150px" }}>Description</th>
                            <th>Itinerary</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.map((pkg) => (
                            <tr key={pkg.id}>
                                <td>{pkg.name}</td>
                                <td>{pkg.price}</td>
                                <td>{pkg.days}</td>
                                <td>{formatDate(pkg.date)}</td>
                                <td style={{ maxWidth: "150px", wordWrap: "break-word", whiteSpace: "normal" }}>{pkg.description}</td>
                                <td style={{ maxWidth: "150px", wordWrap: "break-word", whiteSpace: "normal" }}>{pkg.itinerary}</td>
                                <td><img src={`http://localhost:8080/uploads/${pkg.imageUrls[0]}`} alt={pkg.name} style={{ width: "100px" }} /></td>
                                <td>
                                    <button className="btn btn-danger btn-sm me-2" onClick={() => handleDeletePackage(pkg.id)}>Delete</button>
                                    <button className="btn btn-primary btn-sm" onClick={() => handleEditPackage(pkg)}>Update</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    );
};

export default AdminDashboard;                  