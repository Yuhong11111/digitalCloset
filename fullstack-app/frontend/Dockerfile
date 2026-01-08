# fullstack-app/frontend/Dockerfile

# Build stage
FROM node:16 AS build

WORKDIR /app

ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage - serve with Nginx
FROM nginx:alpine

# Copy built React files
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose Nginx HTTP port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
