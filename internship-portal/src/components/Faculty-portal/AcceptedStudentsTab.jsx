import { useEffect, useState } from "react";
import axios from "axios"; // ✅ This was missing

export default function AcceptedStudentsTab({ facultyEmail }) {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingJoined, setMarkingJoined] = useState({});
  const [nameFilter, setNameFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    if (!facultyEmail) return;
    fetch(`http://localhost:5000/api/faculty/finalized-students?facultyEmail=${encodeURIComponent(facultyEmail)}`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setFilteredStudents(data);
        setLoading(false);
      });
  }, [facultyEmail]);

  const handleMarkJoined = async (studentEmail) => {
    setMarkingJoined((prev) => ({ ...prev, [studentEmail]: true }));
    try {
      const res = await axios.patch("http://localhost:5000/api/applications/mark-joined", {
        studentEmail,
        facultyEmail,
      });

      // ✅ Update UI immediately
      setStudents((prev) =>
        prev.map((s) =>
          s.email === studentEmail ? { ...s, hasJoined: true } : s
        )
      );
    } catch (error) {
      console.error("Error marking joined:", error);
    } finally {
      setMarkingJoined((prev) => ({ ...prev, [studentEmail]: false }));
    }
  };

  useEffect(() => {
    const filtered = students.filter((s) =>
      (s.name || "").toLowerCase().includes(nameFilter.toLowerCase()) &&
      (s.email || "").toLowerCase().includes(emailFilter.toLowerCase()) &&
      (s.department || "").toLowerCase().includes(deptFilter.toLowerCase()) &&
      (s.currentYear?.toString() || "").includes(yearFilter) &&
      (!dateFilter || (s.finalizedAt && new Date(s.finalizedAt).toLocaleDateString().includes(dateFilter)))
    );
    setFilteredStudents(filtered);
  }, [nameFilter, emailFilter, deptFilter, yearFilter, dateFilter, students]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-3 text-black">Accepted Students</h2>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
        <input type="text" placeholder="Filter by Name" value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} className="p-2 border rounded" />
        <input type="text" placeholder="Filter by Email" value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)} className="p-2 border rounded" />
        <input type="text" placeholder="Filter by Department" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="p-2 border rounded" />
        <input type="text" placeholder="Filter by Year" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="p-2 border rounded" />
        <input type="text" placeholder="Filter by Date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="p-2 border rounded" />
      </div>

      {/* Table */}
      <table className="min-w-full border rounded bg-white text-black">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Year</th>
            <th className="border p-2">Finalized At</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((s) => (
            <tr key={s.email}>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.email}</td>
              <td className="border p-2">{s.department}</td>
              <td className="border p-2">{s.currentYear}</td>
              <td className="border p-2">{s.finalizedAt ? new Date(s.finalizedAt).toLocaleDateString() : ""}</td>
              <td className="border p-2">
                {s.hasJoined ? (
                  <span className="text-green-600 font-semibold">Joined</span>
                ) : (
                  <button
                    onClick={() => handleMarkJoined(s.email)}
                    disabled={markingJoined[s.email]}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                  >
                    {markingJoined[s.email] ? "Marking..." : "Mark Joined"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
