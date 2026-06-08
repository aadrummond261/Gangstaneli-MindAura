const searchMedication = async () => {
  const response = await fetch(
    `https://api.fda.gov/drug/label.json?search=openfda.brand_name:${medName}&limit=1`
  );

  const data = await response.json();
  const result = data.results[0];

  setMedicationInfo({
    name: medName,
    usedFor: result.indications_and_usage?.[0] || "Not available",
    dosage: result.dosage_and_administration?.[0] || "Not available",
    sideEffects: result.adverse_reactions?.[0] || "Not available",
  });
};