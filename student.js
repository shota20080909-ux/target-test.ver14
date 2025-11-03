let units = JSON.parse(localStorage.getItem("units") || "{}");
let currentUnit = {};
let keys = [];
let index = 0;
let score = 0;
let wrongWords = [];

function loadUnits() {
  const select = document.getElementById("unitSelect");
  select.innerHTML = "";
  Object.keys(units).forEach(u => {
    const opt = document.createElement("option");
    opt.value = u;
    opt.textContent = u;
    select.appendChild(opt);
  });
}

function startTest() {
  const name = document.getElementById("unitSelect").value;
  if (!name) return alert("単元を選択してください。");
  currentUnit = units[name];
  keys = Object.keys(currentUnit);
  index = 0;
  score = 0;
  wrongWords = [];
  document.getElementById("unitSelectArea").style.display = "none";
  document.getElementById("testArea").style.display = "block";
  showQuestion();
}

function showQuestion() {
  if (index >= keys.length) {
    endTest();
    return;
  }
  const jp = keys[index];
  document.getElementById("questionText").textContent = `${index + 1}. 「${jp}」の英語は？`;
  document.getElementById("answerInput").value = "";
  document.getElementById("resultText").textContent = "";
  document.getElementById("nextButton").style.display = "none";
  document.getElementById("answerButton").style.display = "inline-block";
  document.getElementById("answerInput").focus();
  document.getElementById("progressText").textContent = `(${index + 1}/${keys.length})`;
}

function checkAnswer() {
  const jp = keys[index];
  const correct = currentUnit[jp].trim().toLowerCase();
  const ans = document.getElementById("answerInput").value.trim().toLowerCase();
  const resultText = document.getElementById("resultText");

  if (ans === correct) {
    score++;
    resultText.textContent = "正解！";
    resultText.style.color = "green";
  } else {
    resultText.textContent = `不正解。正解は「${correct}」`;
    resultText.style.color = "red";
    wrongWords.push({ question: jp, answer: correct });
  }

  document.getElementById("answerButton").style.display = "none";
  document.getElementById("nextButton").style.display = "inline-block";
}

function nextQuestion() {
  index++;
  showQuestion();
}

function checkEnter(e) {
  if (e.key === "Enter") {
    const nextButton = document.getElementById("nextButton");
    if (nextButton.style.display === "inline-block") {
      nextQuestion();
    } else {
      checkAnswer();
    }
  }
}

function endTest() {
  let message = `終了！スコア：${score}/${keys.length}\n`;
  if (wrongWords.length > 0) {
    message += "\n間違えた問題:\n";
    wrongWords.forEach(w => {
      message += `「${w.question}」→ ${w.answer}\n`;
    });
    message += "\nもう一度間違いを復習しますか？";
    if (confirm(message)) {
      currentUnit = {};
      wrongWords.forEach(w => currentUnit[w.question] = w.answer);
      keys = Object.keys(currentUnit);
      index = 0;
      score = 0;
      wrongWords = [];
      showQuestion();
      return;
    }
  } else {
    alert(message);
  }
  location.reload();
}

loadUnits();