const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "/", "reservations.json");

// Function to add unique IDs
function addIdsToReservations() {
  try {
    // Read the reservations file
    const data = fs.readFileSync(filePath, "utf8");
    const reservations = JSON.parse(data);

    // Add an `id` to each reservation
    reservations.forEach((reservation, index) => {
      reservation.id = index + 1; // IDs start from 1
    });

    // Write the updated reservations back to the file
    fs.writeFileSync(filePath, JSON.stringify(reservations, null, 2), "utf8");
    console.log("IDs added successfully!");
  } catch (error) {
    console.error("Error updating reservations:", error.message);
  }
}

// Run the function
addIdsToReservations();