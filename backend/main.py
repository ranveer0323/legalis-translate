from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS so React can talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your React App URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Configuration

HF_MODEL_ID = "https://huggingface.co/ranveer0323/legalis-nllb-hindi-v1"
HF_API_URL = f"https://api-inference.huggingface.co/models/{HF_MODEL_ID}"
HF_TOKEN = os.getenv("HF_TOKEN") 

class TranslationRequest(BaseModel):
    text: str

@app.get("/")
def home():
    return {"message": "Legalis API is running"}

@app.post("/translate")
def translate_text(request: TranslationRequest):
    if not request.text:
        return {"translated_text": ""}

    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    payload = {"inputs": request.text}

    # Call Hugging Face API
    try:
        response = requests.post(HF_API_URL, headers=headers, json=payload)
        output = response.json()
        
        # Hugging Face returns a list like [{'generated_text': '...'}]
        if isinstance(output, list) and "generated_text" in output[0]:
            return {"translated_text": output[0]["generated_text"]}
        else:
            # If the model is loading, it might return an error initially
            return {"error": "Model is loading, please try again in 20 seconds.", "details": output}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))