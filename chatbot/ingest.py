# ingest.py (Upgraded with High-Performance Batch Processing)
import os
import time
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import FAISS

# --- CONFIGURATION ---
DATA_PATH = "./data/"
INDEX_PATH = "faiss_index"
BATCH_SIZE = 32  # The number of documents to process in a single batch

# 1. Load your documents from the data directory
print("--- 📂 Loading documents... ---")
txt_loader = DirectoryLoader(DATA_PATH, glob="**/*.txt", show_progress=True)
pdf_loader = DirectoryLoader(DATA_PATH, glob="**/*.pdf", loader_cls=PyPDFLoader, show_progress=True)
all_docs = txt_loader.load() + pdf_loader.load()
print(f"--- Loaded {len(all_docs)} total documents. ---")

# 2. Split them into chunks
print("--- 쪼 Splitting documents into chunks... ---")
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
splits = text_splitter.split_documents(all_docs)
total_splits = len(splits)
print(f"--- Split into {total_splits} chunks. ---")

# 3. Create Ollama embeddings and process in batches
print(f"--- 🧠 Creating embeddings in batches of {BATCH_SIZE}... ---")
embeddings = OllamaEmbeddings(model="llama3")
# Note: Adjust model if you are using a specific embedding model

# Initialize the vector store with the first batch
first_batch_splits = [doc.page_content for doc in splits[:BATCH_SIZE]]
first_batch_embeddings = embeddings.embed_documents(first_batch_splits)

# Create the FAISS index from the first batch
vectorstore = FAISS.from_embeddings(
    text_embeddings=list(zip(first_batch_splits, first_batch_embeddings)),
    embedding=embeddings
)

# Process the rest of the documents in batches
total_batches = (total_splits // BATCH_SIZE) + 1
start_time = time.time()

for i in range(BATCH_SIZE, total_splits, BATCH_SIZE):
    batch_num = (i // BATCH_SIZE) + 1

    # Estimate time remaining
    elapsed_time = time.time() - start_time
    avg_time_per_batch = elapsed_time / (batch_num - 1) if batch_num > 1 else 0
    remaining_batches = total_batches - batch_num
    eta = remaining_batches * avg_time_per_batch

    print(f"--- Processing batch {batch_num}/{total_batches} (ETA: {eta / 60:.2f} minutes)... ---")

    # Get the next batch of splits
    end_index = min(i + BATCH_SIZE, total_splits)
    batch_splits = [doc.page_content for doc in splits[i:end_index]]

    # Add the batch to the existing FAISS index
    vectorstore.add_texts(texts=batch_splits)

# 4. Save the completed vector store
print("--- 💾 Saving the FAISS index to disk... ---")
vectorstore.save_local(INDEX_PATH)

print("--- ✅ Your knowledge base is ready! ---")