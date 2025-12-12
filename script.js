// script.js
// Quiz logic using Firebase Firestore, timer auto-next

import { addDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/* --------------------------
   CONFIG & DATA
-------------------------- */

const QLIST = [
  // Women Cricket India
  {"question":"Who is the current captain of the Indian Women's T20 team?","options":["Smriti Mandhana","Harmanpreet Kaur","Mithali Raj","Shafali Verma"],"answer":1},
  {"question":"Which Indian woman cricketer scored the first double century in ODIs?","options":["Mithali Raj","Harmanpreet Kaur","Jhulan Goswami","Smriti Mandhana"],"answer":0},
  {"question":"Who is known as the fastest bowler in Indian women's cricket?","options":["Jhulan Goswami","Poonam Yadav","Mansi Joshi","Ekta Bisht"],"answer":0},
  {"question":"Which Indian woman cricketer is famous for a 171* innings against Australia in WC 2017?","options":["Harmanpreet Kaur","Mithali Raj","Smriti Mandhana","Deepti Sharma"],"answer":0},
  {"question":"Who was the first captain of the Indian Women's cricket team?","options":["Mithali Raj","Shubhangi Kulkarni","Jhulan Goswami","Anjum Chopra"],"answer":1},

  // Women Entrepreneurs / Startups
  {"question":"Who founded Nykaa, a leading beauty brand in India?","options":["Vineeta Singh","Falguni Nayar","Richa Kar","Suchi Mukherjee"],"answer":1},
  {"question":"Which entrepreneur started Zivame, an online lingerie store?","options":["Richa Kar","Falguni Nayar","Vineeta Singh","Shahnaz Husain"],"answer":0},
  {"question":"Who co-founded the e-learning platform Vedantu?","options":["Vineeta Singh","Sameer Nigam","Vamsi Krishna","Aditi Agarwal"],"answer":2},
  {"question":"Which sector is Falguni Nayar famous for?","options":["Fashion","Beauty & Cosmetics","Food & Beverages","Education"],"answer":1},
  {"question":"Bootstrapping a startup means:","options":["Using investors' money","Using your own money","Crowdfunding","Bank loans"],"answer":1},

  // Sports & Games
  {"question":"Which country won the FIFA Women's World Cup 2019?","options":["USA","Germany","Netherlands","Brazil"],"answer":0},
  {"question":"How many players are there in a basketball team on court?","options":["5","6","7","11"],"answer":0},
  {"question":"Which sport uses a shuttlecock?","options":["Badminton","Tennis","Table Tennis","Squash"],"answer":0},
  {"question":"Which Indian female athlete won gold at Tokyo 2020 in javelin throw?","options":["Dutee Chand","P. V. Sindhu","Neeraj Chopra","Neerja Birla"],"answer":2},
  {"question":"The Indian women’s hockey team won their first Olympic medal in which year?","options":["2016","2020","2012","2008"],"answer":1},

  // Knowledge / Trivia
  {"question":"What is the capital of New Zealand?","options":["Auckland","Wellington","Christchurch","Hamilton"],"answer":1},
  {"question":"Which planet is known as the Red Planet?","options":["Venus","Mars","Jupiter","Mercury"],"answer":1},
  {"question":"Who wrote the book 'Lean In'?","options":["Sheryl Sandberg","Indra Nooyi","Kiran Mazumdar-Shaw","Melinda Gates"],"answer":0},
  {"question":"Which chemical element has the symbol 'O'?","options":["Osmium","Oxygen","Gold","Silver"],"answer":1},
  {"question":"The first woman to win a Nobel Prize was:","options":["Marie Curie","Rosalind Franklin","Ada Lovelace","Barbara McClintock"],"answer":0},

  // Random / Mix
  {"question":"Who is called the 'Iron Lady' of India?","options":["Indira Gandhi","Kiran Bedi","Kalpana Chawla","Mother Teresa"],"answer":0},
  {"question":"Which Indian woman is known for space achievements?","options":["Kiran Mazumdar-Shaw","Kalpana Chawla","Indra Nooyi","Arundhati Bhattacharya"],"answer":1},
  {"question":"Which board game uses knights, bishops, and pawns?","options":["Chess","Ludo","Carrom","Checkers"],"answer":0},
  {"question":"What is the main ingredient in guacamole?","options":["Tomato","Avocado","Potato","Pepper"],"answer":1},
  {"question":"Which Indian city is called the 'Pink City'?","options":["Jaipur","Jodhpur","Udaipur","Kochi"],"answer":0}
];


const REGISTERED = [
  // Your original entries
  { name: "Hameeda Parvin", email: "parvin.23mic7243@vitapstudent.ac.in" },
  { name: "Demo User 1", email: "demo1@example.com" },
  { name: "Demo User 2", email: "demo2@example.com" },

  // Students (unique emails)
  { name: "K Rohith", email: "rohith.25bcb7068@vitapstudent.ac.in" },
  { name: "Duggirala Pradeepa", email: "pradeepa.24bce8289@vitapstudent.ac.in" },
  { name: "Kotha Venakta Lakshmi Rakesh", email: "Rakesh.24mic7309@vitapstudent.ac.in" },
  { name: "K Vanshika", email: "vanshika.24bca7564@vitapstudent.ac.in" },
  { name: "P. Nandini", email: "nandini.24bce8542@vitapstudent.ac.in" },
  { name: "Edupuganti Hanija", email: "hanija.22mic7206@vitapstudent.ac.in" },
  { name: "Vikhyat Shajee Nambiar", email: "vikhyat.23bcb7137@gmail.com" },
  { name: "Lekhana", email: "lekhana.25bce8522@vitapstudent.ac.in" },
  { name: "V Raghu Vamsi", email: "raghuvamsi.24bce7891@vitapstudent.ac.in" },
  { name: "Kanala Shyam Kumar Reddy", email: "Shyam.25bce7427@vitapstudent.ac.in" },
  { name: "Pebbili Prasanna Laxmi", email: "laxmi.24bcd7100@vitapstudent.ac.in" },
  { name: "Vaishnavi Bandaru", email: "vaishnavi.24bce8587@vitapstudent.ac.in" },
  { name: "N Vyshnavi", email: "vyshnavi.24bcd7139@vitapstudent.ac.in" },
  { name: "Harshini", email: "Harshini.25bbl7011@vitapstudent.ac.in" },
  { name: "K. Daisy Sharon", email: "daisy.25bcc7075@vitapstudent.ac.in" },
  { name: "G. Sree Varshitha", email: "varshitha.25bca7261@vitapstudent.ac.in" },
  { name: "Vittala Indira", email: "indira.25bca7749@vitapstudent.ac.in" },
  { name: "Madala Venkata Vardhani", email: "vardhani.25bca7380@vitapstudent.ac.in" },
  { name: "Manideep Pothuri", email: "manideep.24bce8620@vitapstudent.ac.in" },
  { name: "Yerragudi Sree Harshitha", email: "harshitha.25bma7014@vitapstudent.ac.in" },
  { name: "R. Tirumala Seshasai", email: "seshasai.24mis7124@vitapstudent.ac.in" },
  { name: "Ranak Chitiprolu", email: "ranak.24bca7088@vitapstudent.ac.in" },
  { name: "Meet Nagariya", email: "meet.24bmr7025@vitapstudent.ac.in" },
  { name: "Mahima Bino", email: "neethu.24bce7510@vitapstudent.ac.in" },
  { name: "G. Jasmini", email: "jasmini.24bca7962@vitapstudent.ac.in" },
  { name: "Padala Chandana Silpa", email: "chandana.24bca7033@vitapstudent.ac.in" },
  { name: "L Hemalya", email: "hemalya.24bca7534@vitapstudent.ac.in" },
  { name: "Raja Lineysha", email: "lineysha.24bcd7186@vitapstudent.ac.in" },
  { name: "B. Navya Sri", email: "navya.24bce7542@vitapstudent.ac.in" },
  { name: "Ramya Narayanapuram", email: "ramya.24bce8439@vitapstudent.ac.in" },
  { name: "Gattamaneni Mohitha Sai", email: "mohitha.24bca8079@vitapstudent.ac.in" },
  { name: "U. Himabindu", email: "bindu.24mis7298@vitapstudent.ac.in" },
  { name: "Misba Fathima", email: "fathima.24bce8199@vitapstudent.ac.in" },
  { name: "Sakya E", email: "Priyadarshini.24bce7850@vitapstudent.ac.in" },
  { name: "J. Vineetha", email: "vineetha.23bce9319@vitapstudent.ac.in" },
  { name: "Shaik Shabreen Mehak", email: "shabreen.24bce7522@vitapstudent.ac.in" },
  { name: "John Samana", email: "john.23mic7290@vitapstudent.ac.in" }
];


/* --------------------------
   STATE
-------------------------- */

const TOTAL = QLIST.length;
let currentIndex = 0;
let answers = Array(TOTAL).fill(null);
let timer = null;
let timeLeft = 25;
let participant = { name: "", email: "" };
let tabSwitchUsed = false;  // Only allow 1 tab switch

/* --------------------------
   DOM HELPERS
-------------------------- */

function $id(id) { return document.getElementById(id); }

document.addEventListener("DOMContentLoaded", () => {
  if ($id("qcount")) $id("qcount").textContent = TOTAL;
  if ($id("startBtn")) $id("startBtn").addEventListener("click", startQuiz);
  if ($id("nextBtn")) $id("nextBtn").addEventListener("click", () => goNext(false));

  document.body.oncopy = e => e.preventDefault();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && $id("quiz") && !$id("quiz").classList.contains("hidden")) {
      if(!tabSwitchUsed){
        alert("⚠️ You switched tab! Quiz will end.");
        tabSwitchUsed = true;
      }
      finishQuiz();
    }
  });
});

/* --------------------------
   START QUIZ
-------------------------- */

async function startQuiz() {
  const nameEl = $id("name");
  const emailEl = $id("email");
  const regMsg = $id("regMsg");

  const name = nameEl.value.trim();
  const email = emailEl.value.trim().toLowerCase();

  if (!name || !email) { regMsg.textContent = "Enter name & registered email."; return; }

  const reg = REGISTERED.find(u => u.email.toLowerCase() === email);
  if (!reg) { regMsg.textContent = "🙅‍♀️ You are not registered."; return; }

  if (await checkAlreadyAttempted(email)) { 
    regMsg.textContent = "✋ You have already attempted the quiz."; 
    return; 
  }

  participant.name = name;
  participant.email = email;

  $id("start").classList.add("hidden");
  $id("quiz").classList.remove("hidden");

  currentIndex = 0;
  answers = Array(TOTAL).fill(null);

  renderQuestion(0);
}

async function checkAlreadyAttempted(email) {
  if (!window.db) return false;
  try {
    const snap = await getDocs(query(collection(window.db,"round1_scores"),where("email","==",email)));
    return !snap.empty;
  } catch(e) { console.warn("Firestore check failed:", e); return false; }
}

/* --------------------------
   TIMER + RENDER
-------------------------- */

function startTimer() {
  clearInterval(timer);
  timeLeft = 25;
  if ($id("timer")) $id("timer").textContent = `⏱️ ${timeLeft}`;
  timer = setInterval(() => {
    timeLeft--;
    if ($id("timer")) $id("timer").textContent = `⏱️ ${timeLeft}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      goNext(true); // auto-next
    }
  }, 1000);
}

function renderQuestion(i) {
  currentIndex = i;
  const q = QLIST[i];

  $id("qnum").textContent = i + 1;
  $id("questionText").textContent = `🎯 ${q.question}`;
  const opts = $id("options"); opts.innerHTML=""; $id("nextBtn").disabled=true;

  q.options.forEach((opt, idx) => {
    const d = document.createElement("div");
    d.className="option";
    if (answers[i]===idx) { 
      d.classList.add("selected"); 
      d.textContent = `${String.fromCharCode(65+idx)}. ${opt} ✅`; 
      $id("nextBtn").disabled=false; 
    } else d.textContent = `${String.fromCharCode(65+idx)}. ${opt}`;

    d.onclick = () => {
      answers[i]=idx;
      Array.from(opts.children).forEach(c=>{
        c.classList.remove("selected"); 
        c.textContent=c.textContent.replace(" ✅","");
      });
      d.classList.add("selected");
      d.textContent=`${String.fromCharCode(65+idx)}. ${opt} ✅`;
      $id("nextBtn").disabled=false;
    };

    opts.appendChild(d);
  });

  startTimer();
}

/* --------------------------
   NEXT QUESTION
-------------------------- */

function goNext(auto=false) {
  if (!auto && answers[currentIndex]===null) return;

  if (auto && answers[currentIndex]===null) answers[currentIndex]=-1;

  if (currentIndex<TOTAL-1) renderQuestion(currentIndex+1);
  else finishQuiz();
}

/* --------------------------
   FINISH QUIZ
-------------------------- */

async function finishQuiz() {
  clearInterval(timer);

  $id("quiz").classList.add("hidden");
  $id("result").classList.remove("hidden");

  let score = 0;
  for (let i=0; i<TOTAL; i++) if (answers[i]===QLIST[i].answer) score++;

  const consent = $id("accept") && $id("accept").checked;
  if (consent && window.db){
    try {
      await addDoc(collection(window.db,"round1_scores"),{
        name: participant.name,
        email: participant.email,
        score,
        total: TOTAL,
        timestamp: new Date()
      });
      if($id("savedMsg")) $id("savedMsg").textContent="Score saved to database.";
    } catch(e) { if($id("savedMsg")) $id("savedMsg").textContent="Could not save score: "+e.message; }
  } else if($id("savedMsg")) $id("savedMsg").textContent="Score not saved.";

  if($id("resultText")) $id("resultText").textContent=`🎉 Quiz completed! Thank you, ${participant.name}!`;

  if(!$id("result").querySelector(".try-again")){
    const btn=document.createElement("button");
    btn.className="try-again"; btn.textContent="Back to Home"; 
    btn.onclick=()=>location.href='index.html';
    $id("result").appendChild(btn);
  }
}
