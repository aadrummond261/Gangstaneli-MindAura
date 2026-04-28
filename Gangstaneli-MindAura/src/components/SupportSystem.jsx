import { useState } from "react";

function SupportSystem() {
  const [contact, setContact] = useState("");
  const [contacts, setContacts] = useState([]);

  const addContact = () => {
    if (contact.trim() === "") {
      return;
    }

    setContacts([...contacts, contact]);
    setContact("");
  };

  return (
    <section className="card" id="support">
      <h3>Support System</h3>

      <p>
        Save trusted people you can contact when you need encouragement,
        accountability, or emotional support.
      </p>

      <input
        type="text"
        placeholder="Example: Mom - 302-555-1234"
        value={contact}
        onChange={(event) => setContact(event.target.value)}
      />

      <button onClick={addContact}>Save Contact</button>

      <ul>
        {contacts.map((person, index) => (
          <li key={index}>{person}</li>
        ))}
      </ul>
    </section>
  );
}

export default SupportSystem;