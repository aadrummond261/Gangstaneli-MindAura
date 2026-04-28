function AuraCard({ mood, aura }) {
  return (
    <section className="card aura-card">
      <h2>Your Aura Feedback</h2>

      <p>
        <strong>Mood:</strong> {mood || "Not checked in yet"}
      </p>

      <p>
        <strong>Aura Color:</strong> {aura.color}
      </p>

      <p>
        <strong>Energy Level:</strong> {aura.energy}
      </p>

      <p>{aura.message}</p>
    </section>
  );
}

export default AuraCard;