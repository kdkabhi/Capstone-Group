import React, { useEffect, useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { UserContext } from '../UserContext'; // Import UserContext

const Profile = () => {
    const [favorites, setFavorites] = useState([]);
    const [bookings, setBookings] = useState([]);
    const { user } = useContext(UserContext); // Access user state

    useEffect(() => {
        if (user) {
            // Fetch favorites
            fetch(`http://localhost:8080/api/favorites?userId=${user.id}`)
                .then(response => response.json())
                .then(data => setFavorites(data));

            // Fetch bookings
            fetch(`http://localhost:8080/api/bookings?userId=${user.id}`)
                .then(response => response.json())
                .then(data => setBookings(data));
        }
    }, [user]);

    return (
        <div>
            <Navbar />
            <div className="container mt-5">
                <h2 className="text-center">Profile</h2>
                <div className="row">
                    <div className="col-md-6">
                        <h4>Favorites</h4>
                        {favorites.length > 0 ? (
                            <ul>
                                {favorites.map(favorite => (
                                    <li key={favorite.id}>{favorite.name}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No favorites selected.</p>
                        )}
                    </div>
                    <div className="col-md-6">
                        <h4>Bookings</h4>
                        {bookings.length > 0 ? (
                            <ul>
                                {bookings.map(booking => (
                                    <li key={booking.id}>{booking.name} - {booking.date}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>No bookings made.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;
