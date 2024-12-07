const express = require('express');
const bodyParser = require('body-parser');
const ReservationService = require('./services/ReservationService.js');

const app = express();
app.use(bodyParser.json());

const reservationService = new ReservationService("./reservations.json");

app.get('/reservations', (req, res) => {
    res.json(reservationService.getAllReservations());
});

app.get('/reservations/:id', (req, res) => {
    const reservation = reservationService.getReservationByPassengerId(parseInt(req.params.id));
    if (reservation) {
        res.json(reservation);
    } else {
        res.status(404).json({ message: 'Reservation not found' });
    }
});

app.get('/passengers', (req, res) => {
    res.json(reservationService.getAllPassengers());
});

app.get('/passengers/:id', (req, res) => {
    const passenger = reservationService.getAllPassengers().find(p => p.id === parseInt(req.params.id));
    if (passenger) {
        res.json(passenger);
    } else {
        res.status(404).json({ message: 'Passenger not found' });
    }
});

app.get('/flights', (req, res) => {
    res.json(reservationService.getAllFlights());
});

app.get('/flights/:id', (req, res) => {
    const flight = reservationService.getAllFlights().find(f => f.arrivalAirport === req.params.id);
    if (flight) {
        res.json(flight);
    } else {
        res.status(404).json({ message: 'Flight not found' });
    }
});

app.get('/passports', (req, res) => {
    res.json(reservationService.getPassengerPassports());
});

app.listen(3000, () => {
    console.log('REST API running on http://localhost:3000');
});
