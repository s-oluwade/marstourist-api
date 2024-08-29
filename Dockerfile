# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and tsconfig.json
COPY package*.json tsconfig.json ./

# Install all dependencies, including devDependencies
RUN npm install

# Copy the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port
EXPOSE 4000

# Command to run the application
CMD ["node", "dist/server.js"]
