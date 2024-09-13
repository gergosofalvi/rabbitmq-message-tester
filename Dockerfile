# Alap image
FROM node:20

# Alkalmazás könyvtár létrehozása
WORKDIR /usr/src/app

# Csomagok telepítése
COPY package*.json ./
RUN npm install

# Alkalmazás másolása
COPY . .

# Port kiexponálása
EXPOSE 3999

# Alkalmazás indítása
CMD ["node", "server.js"]

