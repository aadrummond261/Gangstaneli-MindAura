import { useCallback, useEffect, useRef, useState } from "react";
import { saveProfileMedia } from "../utils/profileMediaStorage";

function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition;
}

function getRecorderMimeType() {
  const options = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  return options.find((type) => window.MediaRecorder?.isTypeSupported(type)) || "";
}

function buildVoiceFeedback({ duration, averageVolume, transcript }) {
  const words = transcript.trim().split(/\s+/).filter(Boolean).length;
  const feedback = [];

  if (duration < 4) {
    feedback.push("The recording is short. Try speaking for at least 10 seconds for a fuller check-in.");
  } else {
    feedback.push("Recording length is enough for a useful profile voice note.");
  }

  if (averageVolume < 8) {
    feedback.push("Your voice is coming through quietly. Move closer to the mic or speak a little louder.");
  } else if (averageVolume > 55) {
    feedback.push("Your voice is very strong. If it sounds distorted, move slightly farther from the mic.");
  } else {
    feedback.push("Your voice level sounds clear and balanced.");
  }

  if (words < 8) {
    feedback.push("Add a few more words about what is happening so your reflection has more context.");
  } else {
    feedback.push("Your spoken reflection has enough detail to revisit later.");
  }

  return feedback;
}

function VoiceInput() {
  const [text, setText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [listening, setListening] = useState(false);
  const [status, setStatus] = useState("Ready to record.");
  const [volume, setVolume] = useState(0);
  const [supportsSpeech, setSupportsSpeech] = useState(() => Boolean(getSpeechRecognition()));
  const [audioUrl, setAudioUrl] = useState("");
  const [feedback, setFeedback] = useState([]);

  const recognitionRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const animationRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const finalTextRef = useRef("");
  const volumeSamplesRef = useRef([]);

  const stopAudioResources = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setVolume(0);
  }, []);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }

      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }

      stopAudioResources();
    };
  }, [stopAudioResources]);

  useEffect(() => () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  }, [audioUrl]);

  function startMicMeter(stream) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      return;
    }

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    const data = new Uint8Array(analyser.frequencyBinCount);

    analyser.fftSize = 256;
    source.connect(analyser);
    audioContextRef.current = audioContext;

    function updateMeter() {
      analyser.getByteFrequencyData(data);
      const average = data.reduce((sum, value) => sum + value, 0) / data.length;
      const normalized = Math.min(100, Math.round(average * 1.9));
      volumeSamplesRef.current.push(normalized);
      setVolume(normalized);
      animationRef.current = requestAnimationFrame(updateMeter);
    }

    updateMeter();
  }

  function startSpeechRecognition() {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      setSupportsSpeech(false);
      setStatus("Recording audio. Speech-to-text is not available in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    finalTextRef.current = text.trim();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let finalTranscript = finalTextRef.current;
      let liveTranscript = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0].transcript;

        if (event.results[index].isFinal) {
          finalTranscript = `${finalTranscript} ${transcript}`.trim();
        } else {
          liveTranscript += transcript;
        }
      }

      finalTextRef.current = finalTranscript;
      setText(finalTranscript);
      setInterimText(liveTranscript.trim());
      setStatus("Recording voice and transcript.");
    };

    recognition.onerror = (event) => {
      console.error("Voice recognition error:", event.error);
      setStatus("Audio is still recording, but transcript paused. Keep speaking or stop to save.");
    };

    recognition.onend = () => {
      recognitionRef.current = null;
    };

    recognition.start();
  }

  async function startVoiceInput() {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setStatus("This browser cannot record microphone audio.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getRecorderMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

      streamRef.current = stream;
      recorderRef.current = recorder;
      chunksRef.current = [];
      volumeSamplesRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = saveRecording;
      recorder.start();
      startMicMeter(stream);
      startSpeechRecognition();
      setListening(true);
      setStatus("Recording... speak naturally.");
    } catch (error) {
      console.error("Microphone error:", error);
      setStatus("Microphone permission was blocked. Allow mic access and try again.");
    }
  }

  async function saveRecording() {
    const mimeType = recorderRef.current?.mimeType || "audio/webm";
    const blob = new Blob(chunksRef.current, { type: mimeType });
    const samples = volumeSamplesRef.current;
    const duration = Math.round(samples.length / 60);
    const averageVolume = samples.length
      ? Math.round(samples.reduce((sum, sample) => sum + sample, 0) / samples.length)
      : 0;
    const transcript = finalTextRef.current;
    const voiceFeedback = buildVoiceFeedback({
      duration,
      averageVolume,
      transcript,
    });

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    const previewUrl = URL.createObjectURL(blob);
    setAudioUrl(previewUrl);
    setFeedback(voiceFeedback);

    await saveProfileMedia({
      type: "voice",
      blob,
      mimeType,
      transcript,
      feedback: voiceFeedback,
      metrics: {
        duration,
        averageVolume,
      },
    });

    setStatus("Voice recording saved to profile.");
    stopAudioResources();
  }

  function stopVoiceInput() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    } else {
      stopAudioResources();
    }

    setListening(false);
    setInterimText("");
  }

  function clearReflection() {
    finalTextRef.current = "";
    setText("");
    setInterimText("");
    setFeedback([]);
    setStatus("Ready to record.");

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl("");
    }
  }

  return (
    <div className="card voice-card">
      <div className="icon">🎙️</div>
      <h3>Voice Profile Capture</h3>
      <p>Record a voice note, save it to your profile, and get feedback on clarity.</p>

      <div className="voice-status">
        <span className={listening ? "voice-dot active" : "voice-dot"} />
        <p>{status}</p>
      </div>

      <div className="voice-meter" aria-label="Microphone input level">
        <span style={{ width: `${volume}%` }} />
      </div>

      {!supportsSpeech && (
        <p className="voice-warning">
          Speech-to-text is not available in this browser, but the audio will
          still be saved to your profile.
        </p>
      )}

      <div className="voice-actions">
        {!listening ? (
          <button onClick={startVoiceInput}>Start Recording</button>
        ) : (
          <button onClick={stopVoiceInput}>Stop & Save</button>
        )}
        <button className="text-button" onClick={clearReflection}>
          Clear
        </button>
      </div>

      {interimText && <p className="interim-text">{interimText}</p>}

      {audioUrl && (
        <div className="saved-media-preview">
          <audio src={audioUrl} controls />
          <div className="feedback-list">
            {feedback.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      )}

      <textarea
        value={text}
        onChange={(e) => {
          finalTextRef.current = e.target.value;
          setText(e.target.value);
        }}
        placeholder="Your transcript or typed reflection will appear here..."
      />
    </div>
  );
}

export default VoiceInput;
