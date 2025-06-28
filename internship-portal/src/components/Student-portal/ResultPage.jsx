import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ResultPage({ studentId, email }) {
  const location = useLocation();
  const em = location.state?.email || email;

  const [loading, setLoading] = useState(true);
  const [showResultWindow, setShowResultWindow] = useState(false);
  const [acceptedChoices, setAcceptedChoices] = useState([]);
  const [error, setError] = useState("");
  const [finalized, setFinalized] = useState(false);
  const [finalizedFaculty, setFinalizedFaculty] = useState(null);

  // Check if already finalized
  useEffect(() => {
    async function checkFinalized() {
      try {
        const res = await fetch(`http://localhost:5000/api/applications/finalized?email=${em}`);
        const data = await res.json();
        if (data && data.faculty) {
          setFinalized(true);
          setFinalizedFaculty(data);
        }
      } catch {}
    }
    if (em) checkFinalized();
  }, [em]);

  useEffect(() => {
    async function fetchResultWindow() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:5000/api/result-window");
        const data = await res.json();
        setShowResultWindow(data.showResult);
        if (data.showResult && em) {
            const res2 = await fetch(
            `http://localhost:5000/api/applications/accepted?email=${encodeURIComponent(em)}`
            );
            setAcceptedChoices(await res2.json());
        }
      } catch {
        setError("Could not load result status.");
      } finally {
        setLoading(false);
      }
    }
    fetchResultWindow();
  }, [em, finalized]); // re-fetch if finalized state changes

  // Finalize application
  async function handleFinalize(appId) {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `http://localhost:5000/api/applications/${appId}/finalize`,
        { method: "POST" }
      );
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to finalize.");
        setLoading(false);
        return;
      }
      // Success: set finalized state and refetch
      const finalizedChoice = acceptedChoices.find(a => a._id === appId);
      setFinalized(true);
      setFinalizedFaculty(finalizedChoice);
    } catch (err) {
      setError("Failed to finalize.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-6 text-center">Loading result...</div>;

  if (!showResultWindow)
    return (
      <div className="p-8 text-center text-gray-700 text-lg">
        Result window is closed. Please check back later.
      </div>
    );

  if (finalized && finalizedFaculty)
    return (
      <div className="p-8 max-w-2xl mx-auto bg-white rounded shadow text-center">
        <h2 className="text-2xl font-bold mb-6 text-black">Internship Finalized!</h2>
        <div className="mb-4 text-green-700 font-semibold">
          You have finalized your internship with:
        </div>
        <div className="p-4 border border-green-300 rounded inline-block">
          <p className="font-semibold text-black">
            {finalizedFaculty.faculty} ({finalizedFaculty.facultyDepartment})
          </p>
          <p className="text-sm text-gray-700">{finalizedFaculty.facultyEmail}</p>
        </div>
        <div className="mt-6 text-gray-600">
          Your selection has been submitted to the admin.
        </div>
      </div>
    );

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-black">Result</h2>
      {acceptedChoices.length === 0 ? (
        <div className="text-gray-700">No faculty have accepted your applications yet.</div>
      ) : (
        <div className="space-y-4">
          {acceptedChoices.map((choice, idx) => (
            <div
              key={choice._id}
              className="p-4 border border-gray-200 rounded flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-black">
                  {choice.faculty} ({choice.facultyDepartment})
                </p>
                <p className="text-sm text-gray-700">{choice.facultyEmail}</p>
              </div>
              <button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded disabled:bg-gray-300"
                onClick={() => handleFinalize(choice._id)}
                disabled={loading || finalized}
              >
                Finalize
              </button>
            </div>
          ))}
        </div>
      )}
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
}
