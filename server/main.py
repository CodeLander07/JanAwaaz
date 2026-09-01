from fastapi import FastAPI
import uvicorn

app = FastAPI()

@app.get("/")
def read_root():
    return{"message":"Home Route"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="[IP_ADDRESS]", port=5000, reload=True)