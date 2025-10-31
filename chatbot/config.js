const API_URL = "https://cams-bull-congratulations-julia.trycloudflare.com";  // your tunnel URL
const SECRET = "ecobot123";

async function askBot() {
    const q = document.getElementById("question").value;
    if (!q) return;

    const res = await fetch(${API_URL}/ask, {
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
