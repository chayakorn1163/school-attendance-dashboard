    // เชื่อมต่อ mongoose DB
    const mongoose = require("mongoose");
    const express = require("express");
    const app = express();
    const cors = require("cors");

    app.use(cors());
    app.use(express.json());

    mongoose.connect("mongodb://localhost:27017/schoolAttendance", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });

    mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
    });

    mongoose.connection.on("error", (err) => {
    console.log("Error connecting to MongoDB", err);
    });

    // สร้าง Schema สำหรับ Attendance
    const attendanceSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    className: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, required: true },
    startTime: { type: Date, required: false },
    endTime: { type: Date, required: false },
    totalHours: { type: Number, required: false },
    });

    const Attendance = mongoose.model("Attendance", attendanceSchema);

    // สร้าง API สำหรับดึงข้อมูลเช็คชื่อ
    app.get("/api/attendance", async (req, res) => {
    try {
        const attendance = await Attendance.find();
        res.json(attendance);
    } catch (error) {
        res.status(500).json({
        message: "Error fetching attendance data",
        error: error.message,
        });
    }
    });

    // สร้าง API สำหรับบันทึกข้อมูลเช็คชื่อ
    app.post("/api/attendance", async (req, res) => {
  const { studentName, className, date, status, startTime, endTime } = req.body;

  if (!studentName || !className || !date || !status) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newAttendance = new Attendance({
      studentName,
      className,
      date,
      status,
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
      totalHours: startTime && endTime ? (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60) : undefined,
    });
    await newAttendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    console.error("Error saving attendance data:", error);
    res.status(500).json({ message: "Error saving attendance data", error: error.message });
  }
});


    // API สำหรับบันทึกเวลาเริ่มต้น
app.post("/api/attendance/start", async (req, res) => {
    const { studentName } = req.body;
    if (!studentName) {
        return res.status(400).json({ message: "Student name is required" });
    }

    try {
        const attendance = await Attendance.findOne({
            studentName,
            date: new Date().toISOString().split('T')[0], // ใช้ ISO format สำหรับวันที่
        });
        if (attendance) {
            attendance.startTime = new Date(); // ใช้ Date object
            await attendance.save();
            res.status(200).json(attendance);
        } else {
            res.status(404).json({ message: "Attendance record not found" });
        }
    } catch (error) {
        console.error("Error recording start time:", error);
        res.status(500).json({ message: "Error recording start time", error: error.message });
    }
});

    // API สำหรับบันทึกเวลาสิ้นสุด
app.post("/api/attendance/end", async (req, res) => {
    const { studentName } = req.body;
    if (!studentName) {
        return res.status(400).json({ message: "Student name is required" });
    }

    try {
        const attendance = await Attendance.findOne({
            studentName,
            date: new Date().toISOString().split('T')[0], 
        });
        if (attendance) {
            attendance.endTime = new Date(); 
            if (attendance.startTime) {
                const start = new Date(attendance.startTime);
                const end = new Date(attendance.endTime);
                const totalHours = (end - start) / (1000 * 60 * 60); // คำนวณจำนวนชั่วโมง
                attendance.totalHours = totalHours;
            }
            await attendance.save();
            res.status(200).json(attendance);
        } else {
            res.status(404).json({ message: "Attendance record not found" });
        }
    } catch (error) {
        console.error("Error recording end time:", error);
        res.status(500).json({ message: "Error recording end time", error: error.message });
    }
});

    app.listen(5000, () => {
    console.log("Server is running on port 5000");
    });
