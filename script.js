var questions = [
  { q: "Which keyword declares a variable?", c: ["var","int","define","create"], a: 0 },
  { q: "What does DOM stand for?", c: ["Document Object Model","Data Output Machine","Document Oriented Module","Digital Object Map"], a: 0 },
  { q: "Which symbol starts a comment?", c: ["//","#","**","!--"], a: 0 },
  { q: "How do you show an alert?", c: ["alert('Hello')","msg('Hello')","print('Hello')","box('Hello')"], a: 0 },
  { q: "Which compares value AND type?", c: ["==","===","!=", "="], a: 1 },
  { q: "What is an array?", c: ["A list of values","A loop","A function","A variable type"], a: 0 },
  { q: "What is a constant variable?", c: ["A variable that changes anytime","A variable that cannot be reassigned","A variable used inside loops","A variable that stores numbers only"], a: 1 },
  { q: "Which loop repeats a number of times?", c: ["for","switch","if","repeat"], a: 0 },
  { q: "How to declare a function?", c: ["function myFunc()","def myFunc()","func myFunc()","make myFunc()"], a: 0 },
  { q: "JS file extension?", c: [".js",".jv",".script",".java"], a: 0 },
  { q: "Which variable type has block scope?", c: ["var","int","Both A and D","let"], a: 2 },
  { q: "Which variable name is valid?", c: ["2name","my-name","_studentName","class"], a: 2 },
  { q: "What happens if you use a variable before declaring it with var?", c: ["Error","It becomes undefined","It becomes null","It is deleted"], a: 1 },
  { q: "Which is NOT a data type", c: ["string","number","boolean","character"], a: 3 },
  { q: "What is the output of typeof null", c: ["null","object","undefined", "string"], a: 1 },
  { q: "Which is an example of an array?", c: ["(123)","['1','2','3']","{1, 2, 3}","[1, 2, 3]"], a: 3 },
  { q: "What data type is [ ]?", c: ["array","object","list","undefined"], a: 0 },
  { q: "What keyword stops a loop early?", c: ["for","switch","break","stop"], a: 2 },
  { q: "Which statement selects between multiple options?", c: ["if","for","while","switch"], a: 3 },
  { q: "Which keyword returns a value?", c: ["stop","end","return","output"], a: 2 }
];

var num = 0;
var score = 0;
var seconds = 60;
var timer;
var timeExpired = true;
var userAnswers = new Array(questions.length).fill(null);
var timeLeftPerQuestion = new Array(questions.length).fill(60);

$(document).ready(function () {
  showStartScreen();
});

function showStartScreen() {
  $("#quiz-board").html(
    "<h1>JavaScript Quiz</h1>" +
    "<p style='margin-bottom: 20px;'>Test your knowledge and fundamentals in Javascript!</p>" +
    "<button id='startBtn' class='btn'>Start Quiz</button>"
  );
  $("#Number").text("0");
  $("#matches").text("0/" + questions.length);
  $("#time").text("0:00");
  $(".controls").hide();

  $("#startBtn").click(function () {
    num = 0;
    score = 0;
    timeExpired = false;
    userAnswers.fill(null);
    timeLeftPerQuestion.fill(60);
    $(".controls").show();
    showQuestion();
    startTimer();
  });
}

function startTimer() {
  clearInterval(timer);
  timeExpired = false;
  seconds = timeLeftPerQuestion[num];
  updateTimerDisplay(seconds);

  timer = setInterval(function () {
    seconds--;
    timeLeftPerQuestion[num] = seconds;
    updateTimerDisplay(seconds);

    if (seconds <= 0) {
      clearInterval(timer);
      timeExpired = true;
      $(".btn").first().prop("disabled", true);
      Next();
    }
  }, 1000);
}

function updateTimerDisplay(seconds) {
  var mins = Math.floor(seconds / 60);
  var secs = seconds % 60;
  if (secs < 10) secs = "0" + secs;
  $("#time").text(mins + ":" + secs);
}

function showQuestion() {
  var q = questions[num];
  var html = "<h2>" + q.q + "</h2><br>";
  html += "<div class='answer-grid'>";
  for (var i = 0; i < q.c.length; i++) {
    html += "<button class='choiceBtn' data-i='" + i + "'>" + q.c[i] + "</button>";
  }
  html += "</div>";

  $("#quiz-board").html(html);
  $("#Number").text(num + 1);
  $("#matches").text((num + 1) + "/" + questions.length);

  $(".choiceBtn").css({ "background": "#ff88af", "color": "#ffffff" });

  if (userAnswers[num] !== null) $(".choiceBtn").prop("disabled", true);
  else $(".choiceBtn").prop("disabled", false);

  $(".btn").first().prop("disabled", timeExpired);

  startTimer();

  $(".choiceBtn").click(function () {
    var pick = $(this).data("i");
    if (userAnswers[num] === null && !timeExpired) {
      userAnswers[num] = pick;
      if (pick == q.a) score++;
      $(".choiceBtn").prop("disabled", true);
      $(this).css("background", "#ca3f6e");
      clearInterval(timer);
      $(".btn").first().prop("disabled", false);
      setTimeout(function () { Next(); }, 900);
    }
  });
}

function Next() {
  num++;
  if (num >= questions.length) {
    endQuiz();
    return;
  }
  showQuestion();
}

function Previous() {
  if (!timeExpired && num > 0) {
    num--;
    showQuestion();
  }
}

function getTotalTimeSpent() {
  var total = 0;
  for (var i = 0; i < timeLeftPerQuestion.length; i++) {
    total += (60 - timeLeftPerQuestion[i]);
  }
  return total;
}

function endQuiz() {
  clearInterval(timer);

  var totalSeconds = getTotalTimeSpent();
  var mins = Math.floor(totalSeconds / 60);
  var secs = totalSeconds % 60;
  if (secs < 10) secs = "0" + secs;

  var reviewHtml = "<h2 style='margin-bottom: 25px;'>Quiz Complete!</h2>";
  reviewHtml += "<p>Your Score: <b>" + score + " / " + questions.length + "</b></p>";
  reviewHtml += "<p style='margin-top:10px;'>Total Time: <b>" + mins + ":" + secs + "</b></p>";
  reviewHtml += "<button id='restartBtn' class='btn' style='margin-top: 20px;'>Restart Quiz</button>";

  reviewHtml += "<div class='review-section'><h3>Review Answers:</h3>";
  for (var i = 0; i < questions.length; i++) {
    reviewHtml += "<div class='review-question'>";
    reviewHtml += "<p><strong>Q" + (i+1) + ": " + questions[i].q + "</strong></p>";

    if (userAnswers[i] === questions[i].a) {
      reviewHtml += "<p style='color: #7ab8a8;'><em>Your answer:</em> " + questions[i].c[userAnswers[i]] + "</p>";
      reviewHtml += "<p style='color: #7ab8a8; font-weight: bold;'>Correct!</p>";
    } else {
      reviewHtml += "<p style='color: #ff4d6d;'><em>Your answer:</em> " + (userAnswers[i] !== null ? questions[i].c[userAnswers[i]] : "No answer") + "</p>";
      reviewHtml += "<p style='color: #7ab8a8;'><em>Correct answer:</em> " + questions[i].c[questions[i].a] + "</p>";
    }

    reviewHtml += "</div><hr>";
  }
  reviewHtml += "</div>";

  $("#quiz-board").html(reviewHtml);
  $(".controls").hide();

  $("#restartBtn").click(function () {
    showStartScreen();
  });
}
