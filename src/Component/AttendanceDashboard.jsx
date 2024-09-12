    import React, { useState, useEffect } from "react";
    import axios from "axios";
    import AttendanceForm from "./AttendanceForm";

    const AttendanceDashboard = () => {
    const [attendanceData, setAttendanceData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // Fetch attendance data from the API
        axios
        .get("http://localhost:5000/api/attendance")
        .then((response) => {
            console.log("Fetched data: ", response.data);
            setAttendanceData(response.data);
        })
        .catch((error) => {
            console.error("Error fetching data: ", error);
        });
    }, []);

    const addAttendance = (newRecord) => {
        setAttendanceData([...attendanceData, newRecord]);
    };

    const filteredData = attendanceData.filter((record) =>
        record.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">School Attendance Dashboard</h1>
        <AttendanceForm onAddAttendance={addAttendance} />{" "}
        <input
            type="text"
            placeholder="Search by name..."
            className="mb-4 p-2 border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Attendance Table */}
        <table className="min-w-full bg-white border border-gray-200">
            <thead>
            <tr className="bg-gray-200">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Class</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Date</th>
            </tr>
            </thead>
            <tbody>
            {filteredData.map((record, index) => (
                <tr
                key={index}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                <td className="border px-4 py-2">{record.studentName}</td>
                <td className="border px-4 py-2">{record.className}</td>
                <td className="border px-4 py-2">{record.status}</td>
                <td className="border px-4 py-2">
                    {new Date(record.date).toLocaleDateString()}
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
    };

    export default AttendanceDashboard;
