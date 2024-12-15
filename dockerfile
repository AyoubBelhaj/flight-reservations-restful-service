# Use the Node.js LTS version as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application source code
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Command to start the application
CMD ["node", "server.js"]
