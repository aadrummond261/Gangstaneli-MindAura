import { useRef, useState } from "react";

function CameraInput() {
  const videoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch (error) {
      console.error(error);
      alert("Camera permission was denied or camera is not available.");
    }
  }

  function stopCamera() {
    const stream = videoRef.current?.srcObject;

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setCameraOn(false);
  }

  return (
    <div className="card">
      <div className="icon">📷</div>
      <h3>Camera Input</h3>
      <p>Turn on your camera for a future emotion check-in feature.</p>

      <video ref={videoRef} autoPlay playsInline />

      {!cameraOn ? (
        <button onClick={startCamera}>Start Camera</button>
      ) : (
        <button onClick={stopCamera}>Stop Camera</button>
      )}
    </div>
  );
}

export default CameraInput;