from fastapi import FastAPI
import uvicorn
from dotenv import load_dotenv
import os

load_dotenv()
app = FastAPI()

@app.get("/")
def read_root():
    return{"message":"Home Route"}

if __name__ == "__main__":
    uvicorn.run("main:app", host=os.getenv("HOST"), port=int(os.getenv("PORT")), reload=True)