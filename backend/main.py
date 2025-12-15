from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from gradio_client import Client
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CONFIGURATION

HF_SPACE_ID = "ranveer0323/legalis-engine" 

@app.get("/")
def home():
    return {"message": "Legalis API is running via HF Spaces"}

class TranslationRequest(BaseModel):
    text: str

@app.post("/translate")
def translate_text(request: TranslationRequest):
    try:
        # Initialize Client for your HF Space
        client = Client(HF_SPACE_ID)
        
        # Call the predict function of the Space
        # The API usually exposes the function as 'predict'
        result = client.predict(
            request.text, 
            api_name="/translate"
        )
        
        return {"translated_text": result}

    except Exception as e:
        print(f"Error: {e}")
        # Return a friendly error if the Space is asleep
        if "504" in str(e) or "Queue" in str(e):
            return {"error": "Model is waking up. Please try again in 30 seconds."}
        return {"error": str(e)}