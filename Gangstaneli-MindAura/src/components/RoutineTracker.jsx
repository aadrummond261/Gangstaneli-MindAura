import { useState } from "react";
import { useCachedState } from "../utils/cacheStorage";

function RoutineTracker() {
  const [routine, setRoutine] = useState("");
  const [routines, setRoutines] = useCachedState("routines", [], {
    maxItems: 50,
  });

  const addRoutine = () => {
    if (routine.trim() === "") {
      return;
    }

    setRoutines([routine, ...routines]);
    setRoutine("");
  };

  return (
    <section className="card" id="routine">
      <h3>Daily Routine Tracker</h3>

      <input
        type="text"
        placeholder="Example: Drink water, journal, walk"
        value={routine}
        onChange={(event) => setRoutine(event.target.value)}
      />

      <button onClick={addRoutine}>Add Routine</button>

      <ul>
        {routines.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default RoutineTracker;
