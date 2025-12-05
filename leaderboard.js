import { 
  collection, 
  getDocs, 
  query, 
  orderBy 
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

async function renderBoard() {
  const boardEl = document.getElementById('board');

  if (!window.db) {
    boardEl.innerHTML = '<tr><td colspan="3">DB not found</td></tr>';
    return;
  }

  try {
    // Firestore query (score DESC)
    const q = query(collection(window.db, 'round1_scores'), orderBy('score', 'desc'));
    const snap = await getDocs(q);

    let entries = [];

    snap.forEach(doc => {
      const d = doc.data();
      entries.push({
        name: d.name,
        score: d.score,
        total: d.total,
        timestamp: d.timestamp?.toDate ? d.timestamp.toDate() : new Date(d.timestamp)
      });
    });

    // 🔥 SECOND SORT: if same score → earlier time ranks higher
    entries.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(a.timestamp) - new Date(b.timestamp);
    });

    // Build table HTML
    let html = `
      <tr>
        <th style="text-align:left; padding: 8px 16px;">Name</th>
        <th style="text-align:center; padding: 8px 16px;">Score</th>
        <th style="text-align:center; padding: 8px 16px;">Timestamp</th>
      </tr>
    `;

    entries.forEach(d => {
      const dt = d.timestamp 
                 ? d.timestamp.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) 
                 : "";

      html += `
        <tr>
          <td style="text-align:left; padding: 6px 16px;">${d.name}</td>
          <td style="text-align:center; padding: 6px 16px;">${d.score}/${d.total}</td>
          <td style="text-align:center; padding: 6px 16px;">${dt}</td>
        </tr>
      `;
    });

    boardEl.innerHTML = html;

  } catch (e) {
    console.error(e);
    boardEl.innerHTML = '<tr><td colspan="3">Error loading leaderboard</td></tr>';
  }
}

renderBoard();
