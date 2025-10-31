# RAG Chatbot

### How to Run

0. **Go inside `chatbot` folder**

   ```bash
   winget install Python.Python.3.13

   ```

1. **Go inside `chatbot` folder**

   ```bash
   cd chatbot
   ```

2. **Create a virtual environment**

   ```bash
   python -m venv venv
   ```

3. **Activate it**

   * **Windows:**

     ```bash
     venv\Scripts\activate
     ```
   * **Linux/Mac:**

     ```bash
     source venv/bin/activate
     ```

4. **Install required packages**

   ```bash
   pip install -r requirements.txt
   ```

5. **Start the backend**

   ```bash
   python run.py
   ```

6. **Open the bot interface**

   * Open `index.html` in your browser.
   * The chatbot will now connect to the running backend.


