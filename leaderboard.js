import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } 
from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCpVhsD2feq5x5KqDJZVv8DskLVdifvjng",
  authDomain: "win-club-quiz.firebaseapp.com",
  projectId: "win-club-quiz",
  storageBucket: "win-club-quiz.firebasestorage.app",
  messagingSenderId: "810956968688",
  appId: "1:810956968688:web:2a87ff7b745115e125a835",
  measurementId: "G-GXV4P7B3XY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ========= PASSWORD ==============
const ADMIN_PASS = "Hameeda_ADMIN";
// =================================

async function renderBoard() {
  const boardEl = document.getElementById("board");

  let p = prompt("Enter Admin Password to View Leaderboard:");

  if (p !== ADMIN_PASS) {
    boardEl.innerHTML = `
      <tr><td style="color:red; padding:15px;">❌ Incorrect Password</td></tr>
    `;
    return;
  }

  const q = query(collection(db, "round1_scores"), orderBy("score", "desc"));
  const snap = await getDocs(q);

  let html = `
    <tr>
      <th>Name</th>
      <th style="text-align:right;">Score</th>
      <th style="text-align:center;">Date</th>
    </tr>
  `;

  snap.forEach(doc => {
    const d = doc.data();
    const dt = d.timestamp?.toDate?.() 
      ? d.timestamp.toDate().toLocaleString()
      : "";

    html += `
      <tr>
        <td>${d.name}</td>
        <td style="text-align:right;">${d.score}</td>
        <td style="text-align:center;">${dt}</td>
      </tr>
    `;
  });

  boardEl.innerHTML = html;
}

renderBoard();
