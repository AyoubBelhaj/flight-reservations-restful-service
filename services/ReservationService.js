const fs = require('fs');
const Reservation = require("../models/Reservation");
const Passenger = require('../models/Passenger');
const Airport = require('../models/Airport');
const Flight = require('../models/Flight');

class ReservationService {
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

            return new Reservation(passenger, flight, airport);
        });
    }

    getAllReservations() {
        return this.reservations;
    }

    getReservationByPassengerId(id) {
        return this.reservations.find(res => res.passenger.id === id);
    }

    getAllPassengers() {
        return this.reservations.map(res => res.passenger);
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
}

module.exports = ReservationService;