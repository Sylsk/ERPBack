# Usar Node.js versión LTS
FROM node:18-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias (incluyendo devDependencies para desarrollo)
RUN npm install

# Instalar nodemon globalmente para hot reload
RUN npm install -g nodemon

# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto de la aplicación
EXPOSE 3002

# Comando para ejecutar la aplicación en modo desarrollo con nodemon
CMD ["npm", "run", "dev"]