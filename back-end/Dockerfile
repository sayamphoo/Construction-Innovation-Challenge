# ระบุภาพฐานของ Golang ที่คุณต้องการใช้
FROM golang:latest

# ติดตั้ง git เพื่อให้สามารถดาวน์โหลด dependencies ของโปรเจกต์ได้
RUN apt-get update && apt-get install -y git

# ตั้งค่าตัวแปรแวดล้อม GOPATH
ENV GOPATH /go

# สร้างโฟลเดอร์ของโปรเจกต์และเป็นไดเร็กทอรีทำงาน
RUN mkdir -p $GOPATH/src/my-golang-app
WORKDIR $GOPATH/src/my-golang-app

# คัดลอกไฟล์โปรเจกต์ไปยัง Docker container
COPY . .

# ดาวน์โหลดและเพิ่มรายการ go.sum สำหรับโมดูล golang.org/x/net@v0.8.0
RUN go mod download golang.org/x/net

# สร้างไบนารีของโปรเจกต์ของคุณใน Docker container
RUN go build -o main .

# เปิดพอร์ตที่คุณต้องการให้ Docker container เปิดเผย
EXPOSE 6700

# รันโปรแกรม Go lang ที่ใช้ Gin framework เมื่อ Docker container ถูกเรียกใช้งาน
CMD ["./main"]
