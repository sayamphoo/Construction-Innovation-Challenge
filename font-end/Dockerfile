# ใช้ Node.js ที่เป็นเวอร์ชันล่าสุดเป็นฐาน
FROM node:latest

# ตั้งค่าไดเร็กทอรีทำงานใน Docker container
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json ไปยังไดเร็กทอรีทำงาน
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install --legacy-peer-deps

# คัดลอกไฟล์และโฟลเดอร์ทั้งหมดในโปรเจกต์ React ไปยังไดเร็กทอรีทำงาน
COPY . .

# สร้างและรัน build ของแอปพลิเคชัน React
RUN npm run build

# เปิดพอร์ต 80 สำหรับการเข้าถึงแอปพลิเคชัน
EXPOSE 3000

# รันคำสั่งที่ใช้ในการเริ่มต้นแอปพลิเคชัน
CMD ["npm", "start"]