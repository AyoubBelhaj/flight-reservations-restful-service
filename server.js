const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const ReservationService = require('./services/ReservationService.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const reservationService = new ReservationService("./reservations.json");

app.get('/reservations', (req, res) => {
    res.json(reservationService.getAllReservations());
});

app.get('/reservations/:id', (req, res) => {
    const reservation = reservationService.getReservationById(parseInt(req.params.id));
    if (reservation) {
        res.json(reservation);
    } else {
        res.status(404).json({ message: 'Reservation not found' });
    }
});

app.post('/reservations', (req, res) => {
    try {
        const newReservation = reservationService.createReservation(req.body);
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.put('/reservations/:id', (req, res) => {
    const reservationId = parseInt(req.params.id, 10);
    try {
        const updatedReservation = reservationService.updateReservation(reservationId, req.body);
        res.json(updatedReservation);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.delete('/reservations/:id', (req, res) => {
    const reservationId = parseInt(req.params.id, 10);
    try {
        const message = reservationService.deleteReservation(reservationId);
        res.json({ message });
    } catch (error) {
        res.status(500).send({ error: error.message });
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

app.get('/airports', (req, res) => {
    res.json(reservationService.getAirports());
});

app.listen(3000, () => {
    console.log('REST API running on http://localhost:3000');
});
