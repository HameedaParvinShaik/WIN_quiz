import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

async function renderBoard() {
  const boardEl = document.getElementById('board');
  
  if (!window.db) {
    boardEl.innerHTML = '<tr><td colspan="3">No DB</td></tr>';
    return;
  }

  const q = query(collection(window.db, 'round1_scores'), orderBy('score', 'desc'));
  const snap = await getDocs(q);

  let html = `
    <tr>
      <th style="text-align:left; padding: 8px 16px;">Name</th>
      <th style="text-align:right; padding: 8px 16px;">Score</th>
      <th style="text-align:center; padding: 8px 16px;">Date</th>
    </tr>
  `;

  snap.forEach(doc => {
    const d = doc.data();
    const dt = d.timestamp && d.timestamp.toDate 
               ? d.timestamp.toDate().toLocaleString() 
               : (d.timestamp ? new Date(d.timestamp).toLocaleString() : '');
    
    html += `
      <tr>
        <td style="text-align:left; padding: 4px 16px;">${d.name}</td>
        <td style="text-align:right; padding: 4px 16px;">${d.score}</td>
        <td style="text-align:center; padding: 4px 16px;">${dt}</td>
      </tr>
    `;
  });

  boardEl.innerHTML = html;
}

renderBoard();
