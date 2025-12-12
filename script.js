// script.js
// Quiz logic using Firebase Firestore, timer auto-next

import { addDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/* --------------------------
   CONFIG & DATA
-------------------------- */

const QLIST = [
  {
    "question":"During the 2017 Women’s Cricket World Cup semifinal, one Indian batter played a historic unbeaten 171-run innings under intense pressure. Who was this player, often credited with changing the momentum of India’s campaign?",
    "options":["Mithali Raj","Harmanpreet Kaur","Smriti Mandhana","Deepti Sharma"],
    "answer":1
  },
  {
    "question":"In international women’s cricket history, India’s first-ever ODI double century was scored by which legendary player, known for her calm captaincy and long-term consistency?",
    "options":["Smriti Mandhana","Jhulan Goswami","Mithali Raj","Harmanpreet Kaur"],
    "answer":2
  },
  {
    "question":"Recognized as one of the fastest bowlers in women's cricket, which Indian pacer is known for her exceptional height, speed, and wicket-taking ability over two decades?",
    "options":["Poonam Yadav","Jhulan Goswami","Mansi Joshi","Ekta Bisht"],
    "answer":1
  },
  {
    "question":"Nykaa, a multibillion-dollar beauty and skincare marketplace, was built by which woman entrepreneur who transitioned from a high-profile banking career to launch her own startup?",
    "options":["Vineeta Singh","Falguni Nayar","Richa Kar","Suchi Mukherjee"],
    "answer":1
  },
  {
    "question":"Zivame, India’s first major online lingerie platform, was founded after the entrepreneur identified the discomfort women face while shopping offline. Who created this brand?",
    "options":["Falguni Nayar","Richa Kar","Vineeta Singh","Shahnaz Husain"],
    "answer":1
  },
  {
    "question":"Bootstrapping a company is a strategy where the founders do not rely on investors. Which option correctly explains this concept in startup funding?",
    "options":["Using venture capital only","Using your personal or internal business funds","Taking large bank loans","Crowdfunding with the public"],
    "answer":1
  },
  {
    "question":"In the 2019 FIFA Women’s World Cup, the champion team displayed exceptional dominance with world-class forwards and midfielders. Which nation lifted the trophy that year?",
    "options":["Germany","Netherlands","Brazil","USA"],
    "answer":3
  },
  {
    "question":"While discussing Olympic achievements, which of the following Indian female athletes is celebrated for winning multiple medals at world events, especially famous for her Tokyo 2020 performance in badminton?",
    "options":["Hima Das","P. V. Sindhu","Dutee Chand","Rani Rampal"],
    "answer":1
  },
  {
    "question":"Known for her contributions to STEM inspiration globally, which Indian-origin astronaut tragically lost her life during the Columbia Space Shuttle mission but continues to inspire millions?",
    "options":["Kalpana Chawla","Sunita Williams","Tessy Thomas","Indra Nooyi"],
    "answer":0
  },
  {
    "question":"Which city, known for its distinct pink-colored architecture and historical heritage, is popularly referred to as the ‘Pink City’ of India?",
    "options":["Jodhpur","Kochi","Jaipur","Udaipur"],
    "answer":2
  },
  {
    "question":"Lean In is a globally influential book encouraging women to pursue leadership roles and overcome workplace barriers. Who authored this bestselling work?",
    "options":["Indra Nooyi","Sheryl Sandberg","Melinda Gates","Sudha Murthy"],
    "answer":1
  },
  {
    "question":"Marie Curie, a pioneering scientist, became the first woman ever to win a Nobel Prize. In which scientific area did she make her earliest breakthrough discoveries?",
    "options":["Mathematics","Biology","Physics & Chemistry","Computer Science"],
    "answer":2
  },
  {
    "question":"Which Indian women's cricket captain, known for exceptional leadership and consistency, is widely regarded as the longest-serving leader of the national team?",
    "options":["Mithali Raj","Harmanpreet Kaur","Anjum Chopra","Shubhangi Kulkarni"],
    "answer":0
  },
  {
    "question":"Which Indian woman entrepreneur is associated with building a leading premium chocolate brand after transitioning from a career in fitness and finance?",
    "options":["Vineeta Singh","Falguni Nayar","Neha Narkhede","Suchi Mukherjee"],
    "answer":0
  },
  {
    "question":"In badminton, players strike a feathered projectile unique to the sport. What is the name of this projectile used in professional play?",
    "options":["Tennis ball","Shuttlecock","Ping pong ball","Squash ball"],
    "answer":1
  },
  {
    "question":"Which city serves as the capital of New Zealand and is known for its political, cultural, and film production significance?",
    "options":["Auckland","Hamilton","Wellington","Christchurch"],
    "answer":2
  },
  {
    "question":"Known as the 'Iron Lady of India' for her strong political decisions and leadership style, who earned this title in modern Indian history?",
    "options":["Kiran Bedi","Mother Teresa","Kalpana Chawla","Indira Gandhi"],
    "answer":3
  },
  {
    "question":"Which Indian women’s hockey team milestone is remembered for marking their strongest Olympic finish in many years during the Tokyo 2020 Games?",
    "options":["First-ever Olympic qualification","First Olympic gold","First Olympic bronze","Fourth-place finish after a close semifinal"],
    "answer":3
  },
  {
    "question":"Which Indian women's cricket legend became the first to surpass 10,000 runs in international cricket across formats?",
    "options":["Smriti Mandhana","Harmanpreet Kaur","Mithali Raj","Punam Raut"],
    "answer":2
  },
  {
    "question":"Which element with the symbol 'O' is essential for respiration and constitutes a major part of Earth’s atmosphere?",
    "options":["Osmium","Oxygen","Ozone","Oxalate"],
    "answer":1
  },
  {
    "question":"Guacamole, a popular dip from Mexican cuisine, is primarily made using which creamy green fruit known for its healthy fats?",
    "options":["Avocado","Tomato","Pepper","Potato"],
    "answer":0
  },
  {
    "question":"Which Indian cricketer became a global youth icon after her explosive batting as a teenager, especially known for her fearless T20 style?",
    "options":["Smriti Mandhana","Shafali Verma","Deepti Sharma","Jemimah Rodrigues"],
    "answer":1
  },
  {
    "question":"Recognized as India’s first woman IPS officer, who became known for her strict discipline, reforms in policing, and strong administrative presence?",
    "options":["Chhavi Rajawat","Indira Gandhi","Kiran Bedi","Irom Sharmila"],
    "answer":2
  },
  {
    "question":"Chess, a strategic board game with centuries of history, includes pieces such as rooks, bishops, and pawns. Which piece moves in an ‘L’ shape?",
    "options":["Queen","Rook","Knight","Bishop"],
    "answer":2
  },
  {
    "question":"Which entrepreneur is credited for starting India’s first major online beauty discovery platform long before it became a billion-dollar industry?",
    "options":["Falguni Nayar","Suchi Mukherjee","Vineeta Singh","Richa Kar"],
    "answer":0
  }
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
