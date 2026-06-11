import { useState } from "react";
import { useCachedState } from "../utils/cacheStorage";

function SupportSystem() {
  const [contact, setContact] = useState("");
  const [contacts, setContacts] = useCachedState("support-contacts", [], {
    maxItems: 30,
  });

  const addContact = () => {
    if (contact.trim() === "") {
      return;
    }

    setContacts([contact, ...contacts]);
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
