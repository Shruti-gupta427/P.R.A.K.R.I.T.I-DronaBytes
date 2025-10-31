<<<<<<< HEAD
const API_URL = "https://reprints-avon-computational-monkey.trycloudflare.com";  // your tunnel URL
=======
const API_URL = "https://cams-bull-congratulations-julia.trycloudflare.com";  // your tunnel URL
>>>>>>> 5ead8495559a956b7f9250f3b7dc0a0b3dcb4539
const SECRET = "ecobot123";

async function askBot() {
    const q = document.getElementById("question").value;
    if (!q) return;

    const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-secret": SECRET
        },
        body: JSON.stringify({ question: q })
    });

    const data = await res.json();
    document.getElementById("output").innerHTML = marked.parse(data.answer);
}
