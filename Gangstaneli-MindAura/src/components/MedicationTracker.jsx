import { useState } from "react";

function MedicationTracker() {
  const [medication, setMedication] = useState("");
  const [medications, setMedications] = useState([]);

  const addMedication = () => {
    if (medication.trim() === "") {
      return;
    }

    setMedications([...medications, medication]);
    setMedication("");
  };

  return (
    <section className="card">
      <h3>Medication Tracker</h3>

      <input
        type="text"
        placeholder="Example: Take vitamins at 8 AM"
        value={medication}
        onChange={(event) => setMedication(event.target.value)}
      />

      <button onClick={addMedication}>Add Medication</button>

      <ul>
        {medications.map((med, index) => (
          <li key={index}>{med}</li>
        ))}
      </ul>
    </section>
  );
}

export default MedicationTracker;