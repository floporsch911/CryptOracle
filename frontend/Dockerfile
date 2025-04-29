# For production only
# Use official Node.js image
FROM node:23-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source
COPY . .

# Expose React dev server port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
