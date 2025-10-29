# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess  # We keep this as a fallback if you need it

# --- New LangChain Imports ---
from langchain_community.llms import Ollama
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

# -----------------------------

app = FastAPI(title="EcoBot Web API - RAG Edition")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Initialize the RAG components ---
embeddings = OllamaEmbeddings(model="llama3")
vectorstore = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
llm = Ollama(model="ecobot")  # Use your custom-persona model!

# Create a retriever from the vector store
retriever = vectorstore.as_retriever()

# Create a custom prompt template to guide the model
prompt_template = """
You are EcoBot, a friendly and helpful teaching assistant. Use the following context to help you answer the user's question. 
The context is a helpful starting point, but you should also use your own general knowledge to provide a complete and accurate answer.

If the context is not relevant to the question, please ignore it and rely solely on your internal knowledge. And this context is only for to understand never talk about in the answer.

Context: {context}

Question: {question}

Helpful Answer:"""

QA_CHAIN_PROMPT = PromptTemplate.from_template(prompt_template)

# Create the Retrieval-Augmented Generation chain
qa_chain = RetrievalQA.from_chain_type(
    llm,
    retriever=retriever,
    chain_type_kwargs={"prompt": QA_CHAIN_PROMPT}
)


# ------------------------------------

class Query(BaseModel):
    question: str


@app.post("/ask")
def ask_bot(query: Query):
    print(f"🤖 Received a RAG question: {query.question}")

    # Use the RAG chain to get the answer
    result = qa_chain.invoke({"query": query.question})

    answer = result["result"]  # The answer is in the 'result' key

    print(f"✅ Got a RAG answer: {answer[:100]}...")
    return {"answer": answer}