import { useCallback, useEffect, useRef, useState } from "react";
import { saveProfileMedia } from "../utils/profileMediaStorage";

function analyzePhoto(canvas) {
  const context = canvas.getContext("2d");
  const { data, width, height } = context.getImageData(0, 0, canvas.width, canvas.height);
  let brightnessTotal = 0;
  let contrastTotal = 0;
  let previousBrightness = null;

  for (let index = 0; index < data.length; index += 16) {
    const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3;
    brightnessTotal += brightness;

    if (previousBrightness !== null) {
      contrastTotal += Math.abs(brightness - previousBrightness);
    }

    previousBrightness = brightness;
  }

  const sampleCount = Math.max(1, data.length / 16);
  const averageBrightness = Math.round(brightnessTotal / sampleCount);
  const contrast = Math.round(contrastTotal / sampleCount);
  const feedback = [];

  if (averageBrightness < 75) {
    feedback.push("The photo is pretty dim. Try facing a window or turning on more light.");
  } else if (averageBrightness > 205) {
    feedback.push("The photo is very bright. Try reducing glare or stepping away from direct light.");
  } else {
    feedback.push("Lighting looks balanced enough for a profile check-in.");
  }

  if (contrast < 12) {
    feedback.push("The image may be soft or low-detail. Hold the camera steady and retake if needed.");
  } else {
    feedback.push("The image has enough visual detail for a saved profile snapshot.");
  }

  if (width < height) {
    feedback.push("Portrait framing is good for profile photos.");
  } else {
    feedback.push("Landscape framing works, but a centered portrait may fit your profile better.");
  }

  return {
    brightness: averageBrightness,
    contrast,
    feedback,
  };
}

function CameraInput() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [status, setStatus] = useState("Ready to open camera.");

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  useEffect(() => () => {
    if (photoUrl) {
      URL.revokeObjectURL(photoUrl);
    }
  }, [photoUrl]);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setCameraOn(true);
      setStatus("Camera is on. Capture when your face and lighting are clear.");
    } catch (error) {
      console.error(error);
      setStatus("Camera permission was denied or camera is not available.");
    }
  }

  async function capturePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !video.videoWidth) {
      setStatus("Camera is not ready yet.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const analysis = analyzePhoto(canvas);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setStatus("Could not save photo. Try again.");
        return;
      }

      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }

      const previewUrl = URL.createObjectURL(blob);
      setPhotoUrl(previewUrl);
      setFeedback(analysis.feedback);

      await saveProfileMedia({
        type: "photo",
        blob,
        mimeType: blob.type,
        feedback: analysis.feedback,
        metrics: {
          brightness: analysis.brightness,
          contrast: analysis.contrast,
        },
      });

      setStatus("Photo saved to profile.");
    }, "image/jpeg", 0.88);
  }

  return (
    <div className="card camera-card">
      <div className="icon">📷</div>
      <h3>Camera Profile Capture</h3>
      <p>Take a profile snapshot and get feedback on lighting and framing.</p>

      <p className="media-status">{status}</p>

      <video ref={videoRef} autoPlay playsInline muted />
      <canvas ref={canvasRef} className="hidden-canvas" />

      <div className="voice-actions">
        {!cameraOn ? (
          <button onClick={startCamera}>Start Camera</button>
        ) : (
          <>
            <button onClick={capturePhoto}>Capture Photo</button>
            <button className="text-button" onClick={stopCamera}>
              Stop Camera
            </button>
          </>
        )}
      </div>

      {photoUrl && (
        <div className="saved-media-preview">
          <img src={photoUrl} alt="Saved profile capture" />
          <div className="feedback-list">
            {feedback.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CameraInput;
