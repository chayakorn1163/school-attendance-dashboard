    import React, { useState } from "react";
    import axios from "axios";

    const AttendanceForm = ({ onAddAttendance }) => {
    const [formData, setFormData] = useState({
        studentName: "",
        className: "",
        date: "",
        status: "",
        startTime: new Date().toISOString().split("T")[0],
        endTime: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post(
            "http://localhost:5000/api/attendance",
            formData
        );
        if (typeof onAddAttendance === "function") {
            onAddAttendance(response.data);
        } else {
            console.error("onAddAttendance is not a function");
        }
        setFormData({
            studentName: "",
            className: "",
            date: "",
            status: "",
            startTime: new Date().toISOString().split("T")[0],
            endTime: "",
        });
        } catch (error) {
        console.error(
            "Error adding attendance: ",
            error.response?.data || error.message
        );
        }
    };

    return (
        <form
        onSubmit={handleSubmit}
        className="mb-6 p-4 bg-white border border-gray-200 rounded"
        >
        <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            placeholder="Student Name"
            required
            className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
            type="text"
            name="className"
            value={formData.className}
            onChange={handleChange}
            placeholder="Class"
            required
            className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="mb-4 p-2 border border-gray-300 rounded w-full"
        >
            <option value="">สถานะ</option>
            <option value="present">เข้าเรียน</option>
            <option value="absent">ลาป่วย</option>
            <option value="late">มาสาย</option>
            <option value="leave">ขาด</option>
        </select>
        <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add Attendance
        </button>
        </form>
    );
    };

    export default AttendanceForm;
