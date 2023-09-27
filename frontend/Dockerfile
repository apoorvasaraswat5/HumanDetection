FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the app's source code
COPY . .

# Build the app
RUN npm run build

# Set the command to start the app
CMD ["npm", "start"]
