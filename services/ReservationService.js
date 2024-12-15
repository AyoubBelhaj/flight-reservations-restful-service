const fs = require('fs');
const Reservation = require("../models/Reservation");
const Passenger = require('../models/Passenger');
const Airport = require('../models/Airport');
const Flight = require('../models/Flight');

class ReservationService {
    reservations = [];
    filePath = "/reservations.json";
    constructor(filePath) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        this.reservations = data.map(entry => {
            const passenger = new Passenger(
                entry['Passenger ID'],
                entry['First Name'],
                entry['Last Name'],
                entry['Gender'],
                entry['Age'],
                entry['Nationality']
            );

            const airport = new Airport(
                entry['Airport Name'],
                entry['Airport Country Code'],
                entry['Country Name'],
                entry['Airport Continent'],
                entry['Arrival Airport']
            );

            const flight = new Flight(
                entry['Departure Date'],
                entry['Arrival Airport'],
                entry['Pilot Name'],
                entry['Flight Status']
            );

            return new Reservation(entry["id"],passenger, flight, airport);
        });
    }

    createReservation(data) {
        const newReservation = {
            id: this.reservations.length + 1,
            ...data,
        };
        this.reservations.push(newReservation);
        this._saveToFile();
        return newReservation;
    }

    updateReservation(id, data) {
        const reservationIndex = this.reservations.findIndex((r) => r.id === id);
        if (reservationIndex === -1) {
            throw new Error("Reservation not found");
        }
        const updatedReservation = {
            ...this.reservations[reservationIndex],
            ...data,
        };
        this.reservations[reservationIndex] = updatedReservation;
        this._saveToFile();
        return updatedReservation;
    }

    deleteReservation(id) {
        console.log("Reservations before deletion:", this.reservations);
        const updatedReservations = this.reservations.filter((r) => r.id !== id);
        console.log("Reservations after deletion:", updatedReservations);

        if (updatedReservations.length === this.reservations.length) {
            console.error("No reservation found with ID:", id);
            throw new Error("Reservation not found");
        }

        this.reservations = updatedReservations;
        this._saveToFile();
        console.log("Reservations successfully updated in JSON file.");
        return "Reservation deleted successfully";
    }

    getAllReservations() {
        return this.reservations;
    }

    getReservationById(id) {
        return this.reservations.find(res => res.id === id);
    }

    getAllPassengers() {
        return this.reservations.map(res => res.passenger);
    }

    getPassengerById(id) {
        const passengers = this.getAllPassengers();
        return passengers.map(res => res.id === id);
    }

    getAllFlights() {
        return this.reservations.map(res => res.flight);
    }

    getPassengerPassports() {
        return this.reservations.reduce((passports, res) => {
            passports[res.passenger.id] = res.passenger.passport || "Not Available";
            return passports;
        }, {});
    }

    _saveToFile() {
        fs.writeFileSync(this.filePath, JSON.stringify(this.reservations, null, 2));
    }
}

module.exports = ReservationService;