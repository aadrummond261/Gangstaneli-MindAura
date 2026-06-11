import { useState } from "react";
import { useCachedState } from "../utils/cacheStorage";

const OPENFDA_LABEL_URL = "https://api.fda.gov/drug/label.json";

function cleanLabelText(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}

function previewText(items, fallback) {
  if (!items?.length) {
    return fallback;
  }

  const text = cleanLabelText(items.join(" "));
  return text.length > 520 ? `${text.slice(0, 520)}...` : text;
}

function getFrequencyClues(text) {
  const patterns = [
    /\bonce daily\b/gi,
    /\btwice daily\b/gi,
    /\bthree times daily\b/gi,
    /\bfour times daily\b/gi,
    /\bevery \d+\s?(to|-)?\s?\d* hours?\b/gi,
    /\bevery \d+\s?(to|-)?\s?\d* hrs?\b/gi,
    /\b\d+ times (a|per) day\b/gi,
    /\b\d+ times daily\b/gi,
    /\bat bedtime\b/gi,
    /\bin the morning\b/gi,
    /\bwith meals\b/gi,
  ];

  const matches = patterns.flatMap((pattern) => text.match(pattern) || []);
  return [...new Set(matches.map((match) => match.toLowerCase()))].slice(0, 4);
}

async function searchOpenFdaByField(field, medicationName) {
  const params = new URLSearchParams({
    search: `${field}:"${medicationName}"`,
    limit: "1",
  });
  const response = await fetch(`${OPENFDA_LABEL_URL}?${params}`);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.results?.[0] || null;
}

async function fetchMedicationInfo(medicationName) {
  const fields = [
    "openfda.brand_name",
    "openfda.generic_name",
    "openfda.substance_name",
  ];

  for (const field of fields) {
    const label = await searchOpenFdaByField(field, medicationName);

    if (label) {
      const dosageText = previewText(
        label.dosage_and_administration || label.directions,
        "No dosage instructions were found in the FDA label result."
      );
      const sideEffectsText = previewText(
        label.adverse_reactions || label.warnings || label.when_using,
        "No side-effect section was found in the FDA label result."
      );

      return {
        sourceName:
          label.openfda?.brand_name?.[0] ||
          label.openfda?.generic_name?.[0] ||
          medicationName,
        dosage: dosageText,
        sideEffects: sideEffectsText,
        frequencyClues: getFrequencyClues(dosageText),
      };
    }
  }

  return {
    sourceName: medicationName,
    dosage: "No FDA label result was found for this name. Check spelling or try the generic name.",
    sideEffects: "No side-effect information found.",
    frequencyClues: [],
  };
}

function MedicationTracker() {
  const [medication, setMedication] = useState("");
  const [doseTime, setDoseTime] = useState("");
  const [medications, setMedications] = useCachedState("medications", [], {
    maxItems: 12,
  });
  const [loading, setLoading] = useState(false);

  async function addMedication() {
    const medicationName = medication.trim();

    if (!medicationName) {
      return;
    }

    const pendingMedication = {
      id: Date.now(),
      name: medicationName,
      times: doseTime ? [doseTime] : [],
      taken: {},
      info: null,
      error: "",
    };

    setMedications((current) => [pendingMedication, ...current]);
    setMedication("");
    setDoseTime("");
    setLoading(true);

    try {
      const info = await fetchMedicationInfo(medicationName);
      setMedications((current) =>
        current.map((item) =>
          item.id === pendingMedication.id ? { ...item, info } : item
        )
      );
    } catch (error) {
      console.error(error);
      setMedications((current) =>
        current.map((item) =>
          item.id === pendingMedication.id
            ? {
                ...item,
                error:
                  "Medication lookup failed. You can still add dose times and mark them taken.",
              }
            : item
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function addDoseTime(medicationId, time) {
    if (!time) {
      return;
    }

    setMedications((current) =>
      current.map((item) =>
        item.id === medicationId && !item.times.includes(time)
          ? { ...item, times: [...item.times, time].sort() }
          : item
      )
    );
  }

  function markTaken(medicationId, time) {
    const takenAt = new Date().toLocaleString();

    setMedications((current) =>
      current.map((item) =>
        item.id === medicationId
          ? { ...item, taken: { ...item.taken, [time]: takenAt } }
          : item
      )
    );
  }

  return (
    <section className="card medication-card">
      <div className="icon">💊</div>
      <h3>Medication Tracker</h3>
      <p>
        Enter a medication name to look up FDA label guidance and track when you
        take it.
      </p>

      <div className="medication-entry">
        <input
          type="text"
          placeholder="Example: ibuprofen"
          value={medication}
          onChange={(event) => setMedication(event.target.value)}
        />
        <input
          type="time"
          value={doseTime}
          onChange={(event) => setDoseTime(event.target.value)}
          aria-label="First dose time"
        />
        <button onClick={addMedication} disabled={loading}>
          {loading ? "Looking Up..." : "Add Medication"}
        </button>
      </div>

      <p className="medication-disclaimer">
        FDA labels are for reference only. Always follow your prescription label
        and ask your doctor or pharmacist before changing how you take medicine.
      </p>

      <div className="medication-list">
        {medications.map((item) => (
          <MedicationItem
            item={item}
            key={item.id}
            addDoseTime={addDoseTime}
            markTaken={markTaken}
          />
        ))}
      </div>
    </section>
  );
}

function MedicationItem({ item, addDoseTime, markTaken }) {
  const [newTime, setNewTime] = useState("");

  function handleAddTime() {
    addDoseTime(item.id, newTime);
    setNewTime("");
  }

  return (
    <article className="medication-item">
      <div className="medication-item-header">
        <div>
          <h4>{item.name}</h4>
          {item.info?.sourceName && <small>FDA label match: {item.info.sourceName}</small>}
        </div>
      </div>

      {item.error && <p className="medication-error">{item.error}</p>}

      {item.info ? (
        <div className="medication-info">
          <h5>How often / dosage guidance</h5>
          {item.info.frequencyClues.length > 0 && (
            <p>
              <strong>Possible frequency found:</strong>{" "}
              {item.info.frequencyClues.join(", ")}
            </p>
          )}
          <p>{item.info.dosage}</p>

          <h5>Side effects / warnings</h5>
          <p>{item.info.sideEffects}</p>
        </div>
      ) : (
        <p className="medication-loading">Looking up FDA label information...</p>
      )}

      <div className="dose-time-entry">
        <input
          type="time"
          value={newTime}
          onChange={(event) => setNewTime(event.target.value)}
          aria-label={`Add dose time for ${item.name}`}
        />
        <button onClick={handleAddTime}>Add Time</button>
      </div>

      <div className="dose-times">
        {item.times.length === 0 ? (
          <p>No dose times added yet.</p>
        ) : (
          item.times.map((time) => (
            <div className="dose-row" key={time}>
              <span>{time}</span>
              {item.taken[time] ? (
                <strong>Taken at {item.taken[time]}</strong>
              ) : (
                <button onClick={() => markTaken(item.id, time)}>I Took It</button>
              )}
            </div>
          ))
        )}
      </div>
    </article>
  );
}

export default MedicationTracker;
