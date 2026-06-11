import { useCallback, useEffect, useMemo, useState } from "react";
import { getLatestProfileMedia } from "../utils/profileMediaStorage";

function ProfileMedia() {
  const [photo, setPhoto] = useState(null);
  const [voice, setVoice] = useState(null);

  const loadProfileMedia = useCallback(async () => {
    const [latestPhoto, latestVoice] = await Promise.all([
      getLatestProfileMedia("photo"),
      getLatestProfileMedia("voice"),
    ]);

    setPhoto(latestPhoto);
    setVoice(latestVoice);
  }, []);

  const photoUrl = useMemo(
    () => (photo?.blob ? URL.createObjectURL(photo.blob) : ""),
    [photo]
  );

  const voiceUrl = useMemo(
    () => (voice?.blob ? URL.createObjectURL(voice.blob) : ""),
    [voice]
  );

  useEffect(() => {
    queueMicrotask(loadProfileMedia);

    window.addEventListener("profile-media-saved", loadProfileMedia);
    return () => {
      window.removeEventListener("profile-media-saved", loadProfileMedia);
    };
  }, [loadProfileMedia]);

  useEffect(() => () => {
    if (photoUrl) {
      URL.revokeObjectURL(photoUrl);
    }
  }, [photoUrl]);

  useEffect(() => () => {
    if (voiceUrl) {
      URL.revokeObjectURL(voiceUrl);
    }
  }, [voiceUrl]);

  return (
    <section className="card profile-media-card">
      <div className="icon">👤</div>
      <h3>Profile Media</h3>
      <p>Your latest saved camera and voice check-ins appear here.</p>

      <div className="profile-media-grid">
        <div className="profile-media-panel">
          <h4>Latest Photo</h4>
          {photoUrl ? (
            <>
              <img src={photoUrl} alt="Latest saved profile" />
              <FeedbackList items={photo.feedback} />
            </>
          ) : (
            <p>No photo saved yet.</p>
          )}
        </div>

        <div className="profile-media-panel">
          <h4>Latest Voice</h4>
          {voiceUrl ? (
            <>
              <audio src={voiceUrl} controls />
              {voice.transcript && <p className="profile-transcript">{voice.transcript}</p>}
              <FeedbackList items={voice.feedback} />
            </>
          ) : (
            <p>No voice recording saved yet.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function FeedbackList({ items = [] }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="feedback-list">
      {items.map((item) => (
        <p key={item}>{item}</p>
      ))}
    </div>
  );
}

export default ProfileMedia;
