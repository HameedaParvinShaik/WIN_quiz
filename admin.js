import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
document.getElementById('save').onclick = async ()=>{
  const q = document.getElementById('q').value;
  const A = document.getElementById('a').value;
  const B = document.getElementById('b').value;
  const C = document.getElementById('c').value;
  const D = document.getElementById('d').value;
  const ans = document.getElementById('ans').value.toUpperCase();
  const map = {A:0,B:1,C:2,D:3};
  if(!q||!A||!B||!C||!D||!map[ans]) return alert('Fill all fields and answer A/B/C/D');
  await addDoc(collection(window.db,'questions'),{
    question:q, options:[A,B,C,D], answer:map[ans]
  });
  alert('Saved!');
};
