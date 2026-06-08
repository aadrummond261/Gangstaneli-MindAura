from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel

app = FastAPI(title="Gangstaneli MindAura AI Service")


class TextMoodRequest(BaseModel):
    text: str


@app.get("/")
def home():
    return {
        "message": "Gangstaneli MindAura Python AI Service is running."
    }


@app.post("/analyze-text")
def analyze_text(request: TextMoodRequest):
    text = request.text.lower()

    if "happy" in text or "good" in text or "excited" in text:
        mood = "Happy"
        aura = "gold"
        support = "Keep protecting your peace and enjoy this moment."
    elif "sad" in text or "down" in text or "lonely" in text:
        mood = "Sad"
        aura = "blue"
        support = "Take things one step at a time. Your feelings matter."
    elif "angry" in text or "mad" in text or "frustrated" in text:
        mood = "Angry"
        aura = "red"
        support = "Pause, breathe, and give yourself room before reacting."
    elif "anxious" in text or "stressed" in text or "worried" in text:
        mood = "Anxious"
        aura = "purple"
        support = "Try grounding yourself with slow breathing or a calming routine."
    elif "grief" in text or "miss" in text or "lost" in text:
        mood = "Grieving"
        aura = "soft blue"
        support = "Grief comes in waves. It is okay to miss someone and still keep going."
    else:
        mood = "Neutral"
        aura = "green"
        support = "Check in with yourself and be gentle with your mind today."

    return {
        "detectedMood": mood,
        "auraColor": aura,
        "supportMessage": support
    }


@app.post("/analyze-voice")
async def analyze_voice(file: UploadFile = File(...)):
    return {
        "filename": file.filename,
        "detectedMood": "Neutral",
        "auraColor": "green",
        "message": "Voice file received. Real voice analysis can be added later."
    }


@app.post("/analyze-face")
async def analyze_face(file: UploadFile = File(...)):
    return {
        "filename": file.filename,
        "detectedMood": "Calm",
        "auraColor": "teal",
        "message": "Face image received. Real facial-expression analysis can be added later."
    }


@app.post("/grief-support")
def grief_support(request: TextMoodRequest):
    return {
        "supportMessage": "Your love for them still matters. Take your time, write a memory, and give yourself grace today.",
        "journalPrompt": "What is one memory with your loved one that still brings you comfort?",
        "auraColor": "soft blue"
    }