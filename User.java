package com.example.spring_cap;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String name;

    @Enumerated(EnumType.STRING)
    private UserType type;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "user")
    private Set<Favorite> favorites = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "user")
    private Set<Booking> bookings = new HashSet<>();

    // Constructors, getters, and setters
    public User() {}

    public User(String name, String email, String password, UserType type) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.type = type;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getName() { return name; }
    public UserType getType() { return type; }

    public void setId(Long id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setName(String name) { this.name = name; }
    public void setType(UserType type) { this.type = type; }

    public Set<Favorite> getFavorites() { return favorites; }
    public Set<Booking> getBookings() { return bookings; }

    public void addFavorite(Favorite favorite) {
        favorites.add(favorite);
        favorite.setUser(this);
    }

    public void addBooking(Booking booking) {
        bookings.add(booking);
        booking.setUser(this);
    }
}