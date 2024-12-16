const fs = require('fs');
const Reservation = require('../models/Reservation');
const Passenger = require('../models/Passenger');
const Airport = require('../models/Airport');
const Flight = require('../models/Flight');

class ReservationService {
    constructor(filePath = '../reservations.json') {
        this.filePath = filePath;
        const data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));

        this.reservations = data.map(entry => {
            const passenger = new Passenger(
                entry['passenger'].id,
                entry['passenger'].firstName,
                entry['passenger'].lastName,
                entry['passenger'].gender,
                entry['passenger'].age,
                entry['passenger'].nationality
            );

            const airport = new Airport(
                entry['airport'].name,
                entry['airport'].countryCode,
                entry['airport'].countryName,
                entry['airport'].continent,
                entry['airport'].airportCode
            );

            const flight = new Flight(
                entry['flight'].departureDate,
                entry['flight'].arrivalAirport,
                entry['flight'].pilotName,
                entry['flight'].status
            );

            return new Reservation(entry['id'], passenger, flight, airport);
        });
    }

    // Create a new reservation
    createReservation(data) {
        const newPassengerId = this.getAllPassengers().length + 1;

        const newPassenger = new Passenger(
            newPassengerId,
            data.passenger.firstName,
            data.passenger.lastName,
            data.passenger.gender,
            data.passenger.age,
            data.passenger.nationality
        );

        const newAirport = new Airport(
            data.airport.name,
            data.airport.countryCode,
            data.airport.countryName,
            data.airport.continent,
            data.airport.arrivalCode
        );

        const newFlight = new Flight(
            data.flight.departureDate,
            data.flight.arrivalAirport,
            data.flight.pilotName,
            data.flight.flightStatus
        );

        const newReservation = new Reservation(
            this.reservations.length + 1,
            newPassenger,
            newFlight,
            newAirport
        );

        this.reservations.push(newReservation);
        this._saveToFile();
        return newReservation;
    }

    // Update an existing reservation
    updateReservation(id, data) {
        const reservationIndex = this.reservations.findIndex((r) => r.id === id);
        if (reservationIndex === -1) {
            throw new Error("Reservation not found");
        }
    
        // Deep merge nested objects
        const updatedReservation = {
            ...this.reservations[reservationIndex],
            passenger: {
                ...this.reservations[reservationIndex].passenger,
                ...data.passenger,
            },
            flight: {
                ...this.reservations[reservationIndex].flight,
                ...data.flight,
            },
            airport: {
                ...this.reservations[reservationIndex].airport,
                ...data.airport,
            },
        };
    
        this.reservations[reservationIndex] = updatedReservation;
        this._saveToFile();
        return updatedReservation;
    }
    

    // Delete a reservation
    deleteReservation(id) {
        const updatedReservations = this.reservations.filter((r) => r.id !== id);
        if (updatedReservations.length === this.reservations.length) {
            throw new Error('Reservation not found');
        }

        this.reservations = updatedReservations;
        this._saveToFile();
        return 'Reservation deleted successfully';
    }

    // Get all reservations
    getAllReservations() {
        return this.reservations;
    }

    // Get a reservation by ID
    getReservationById(id) {
        const reservation = this.reservations.find((res) => res.id === id);
        if (!reservation) throw new Error('Reservation not found');
        return reservation;
    }

    // Get all passengers
    getAllPassengers() {
        return this.reservations.map((res) => res.passenger);
    }

    // Get a passenger by ID
    getPassengerById(id) {
        const passenger = this.getAllPassengers().find((p) => p.id === id);
        if (!passenger) throw new Error('Passenger not found');
        return passenger;
    }

    // Get all flights
    getAllFlights() {
        return this.reservations.map((res) => res.flight);
    }

    // Get passenger passports
    getAirports() {
        return this.reservations.map((res) => res.airport);
    }

    // Save reservations to file
    _saveToFile() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.reservations, null, 2));
    }
}

module.exports = ReservationService;