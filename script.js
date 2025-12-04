// script.js
// Quiz logic using only Firebase Firestore, admin/leaderboard protection, timer auto-next

import { addDoc, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/* --------------------------
   CONFIG & DATA
-------------------------- */

const ADMIN_PASS = "Hameeda_ADMIN";

const QLIST = [
  {"question":"What is a main challenge women entrepreneurs face?","options":["Lack of IT skills","Work-life balance","Limited finance access","Avoiding marketing"],"answer":2},
  {"question":"A business created mainly to support the owner’s lifestyle is called?","options":["High-growth","Innovation-driven","Lifestyle business","Venture-backed"],"answer":2},
  {"question":"Which barrier is similar to the corporate ‘glass ceiling’?","options":["Plastic floor","Brick wall","Funding gap","Silver lining"],"answer":2},
  {"question":"Which US agency supports small businesses, including women-owned ones?","options":["Commerce Dept","Federal Reserve","SBA","NWBC"],"answer":2},
  {"question":"Which is NOT one of the 4 Ps of marketing?","options":["Product","Price","People","Promotion"],"answer":2},
  {"question":"Which funding gives ownership in exchange for money?","options":["Debt","Equity","Crowdfunding","Bootstrapping"],"answer":1},
  {"question":"Using your own money to start a business is called?","options":["Debt leverage","Franchising","Angel investing","Bootstrapping"],"answer":3},
  {"question":"In SWOT, which are internal factors?","options":["Strengths & Opportunities","Strengths & Weaknesses","Weaknesses & Threats","Opportunities & Threats"],"answer":1},
  {"question":"Which structure gives no liability protection?","options":["Partnership","LLC","C-Corp","Sole Proprietorship"],"answer":3},
  {"question":"What outlines business goals and strategies?","options":["Mission","Business plan","Brochure","NDA"],"answer":1},
  {"question":"Which sector has many women-owned businesses?","options":["Construction","Technology","Healthcare","Oil & Gas"],"answer":2},
  {"question":"Micro-loans help mainly whom?","options":["Big firms","Developed nations","Women in developing countries","Govt agencies"],"answer":2},
  {"question":"Women leaders are often associated with which style?","options":["Autocratic","Transactional","Transformational","Laissez-faire"],"answer":2},
  {"question":"Which barrier comes from cultural bias?","options":["Networking issues","No mentors","Gender bias by investors","High taxes"],"answer":2},
  {"question":"What does a USP explain?","options":["Year-1 revenue","Target users","What makes you unique","Sourcing policy"],"answer":2},
  {"question":"A common govt support for women entrepreneurs is?","options":["Board quotas","Import rights","Training programs","Product bans"],"answer":2},
  {"question":"Who founded Goop?","options":["Reese Witherspoon","Jessica Alba","Gwyneth Paltrow","Jennifer Garner"],"answer":2},
  {"question":"Who founded The Body Shop?","options":["L'Oréal","Sephora","The Body Shop","Lush"],"answer":2},
  {"question":"Women often report less confidence in which area?","options":["Marketing","HR","Finance","Design"],"answer":2},
  {"question":"What is the term for a new business with innovative ideas?","options":["Small shop","Startup","Franchise","Retail chain"],"answer":1},
  {"question":"Which type of investor funds startups early?","options":["Angel investor","Bank","Customer","Supplier"],"answer":0},
  {"question":"What is market segmentation?","options":["Setting prices","Finding competitors","Dividing customers into groups","Paying suppliers"],"answer":2},
  {"question":"Which document protects business ideas when shared?","options":["Contract","NDA","Invoice","License"],"answer":1},
  {"question":"Which skill is key for entrepreneurs?","options":["Public speaking","Coding","Risk-taking","Time pass"],"answer":2},
  {"question":"Which term means ‘taking a business online’?","options":["Digitization","Globalization","Branding","Sponsoring"],"answer":0}
];

const REGISTERED = [
  {"name":"Hameeda Parvin","email":"parvin.23mic7243@vitapstudent.ac.in"},
  {"name":"Demo User 1","email":"demo1@example.com"},
  {"name":"Demo User 2","email":"demo2@example.com"}
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
      finishQuiz();
    }
  });

  protectAdminLinks();
});

/* --------------------------
   ADMIN / LEADERBOARD PROTECTION
-------------------------- */
/* --------------------------
   ADMIN / LEADERBOARD PROTECTION
-------------------------- */

function protectAdminLinks() {
  const adminLink = document.querySelector('nav a[href="admin.html"]');
  const boardLink = document.querySelector('nav a[href="leaderboard.html"]');
  if (adminLink) adminLink.addEventListener("click", e => { e.preventDefault(); requireAdminThenNavigate("admin.html"); });
  if (boardLink) boardLink.addEventListener("click", e => { e.preventDefault(); requireAdminThenNavigate("leaderboard.html"); });
}

function requireAdminThenNavigate(target) {
  const isAdmin = sessionStorage.getItem("win_admin") === "true";
  if (isAdmin) { window.location.href = target; return; }
  const pwd = prompt("Enter admin password:");
  if (pwd === ADMIN_PASS) { 
    sessionStorage.setItem("win_admin","true"); 
    alert("Admin access granted."); 
    window.location.href = target; 
  } else alert("Wrong password. Access denied.");
}


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
    if (answers[i]===idx) { d.classList.add("selected"); d.textContent = `${String.fromCharCode(65+idx)}. ${opt} ✅`; $id("nextBtn").disabled=false; }
    else d.textContent = `${String.fromCharCode(65+idx)}. ${opt}`;

    d.onclick = () => {
      answers[i]=idx;
      Array.from(opts.children).forEach(c=>{ c.classList.remove("selected"); c.textContent=c.textContent.replace(" ✅",""); });
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
    btn.className="try-again"; btn.textContent="Back to Home"; btn.onclick=()=>location.reload();
    $id("result").appendChild(btn);
  }
}
