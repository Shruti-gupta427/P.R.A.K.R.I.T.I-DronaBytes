import os
import webbrowser
import subprocess
import time

# Start the FastAPI app
process = subprocess.Popen(
    ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
)


try:
    process.wait()
except KeyboardInterrupt:
    print("\nShutting down server...")
    process.terminate()
