# Use official Node.js base image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN npm install

# Expose port (change if your app uses another port)
EXPOSE 3000

# Run the app
CMD ["node", "app.js"]
