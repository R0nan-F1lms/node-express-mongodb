# Use official Node image
FROM node:22

# Set working directory
WORKDIR /usr/src/app

# Copy package files first (cache layer)
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app source
COPY . .

# Expose app port
EXPOSE 8080

# Start the app
CMD ["node", "server.js"]
