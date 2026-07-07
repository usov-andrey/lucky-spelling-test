const state = {
  words: [],
  currentIndex: 0,
  autoRepeat: true,
  repeatTimer: null,
  audio: null,
};

const els = {
  testScreen: document.getElementById("test-screen"),
  finishScreen: document.getElementById("finish-screen"),
  progress: document.getElementById("progress"),
  word: document.getElementById("word"),
  repeat: document.getElementById("repeat"),
  back: document.getElementById("back"),
  next: document.getElementById("next"),
  restart: document.getElementById("restart"),
  autoRepeat: document.getElementById("auto-repeat"),
  status: document.getElementById("status"),
  wordList: document.getElementById("word-list"),
  finishRestart: document.getElementById("finish-restart"),
  finishBack: document.getElementById("finish-back"),
};

async function loadWords() {
  try {
    const response = await fetch("words.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    state.words = await response.json();
    renderTest();
  } catch (error) {
    els.status.textContent = "Could not load words.json. Use a local web server or GitHub Pages.";
    disableButtons(true);
  }
}

function currentWord() {
  return state.words[state.currentIndex];
}

function renderTest() {
  const word = currentWord();
  if (!word) {
    els.status.textContent = "No words found.";
    disableButtons(true);
    return;
  }

  els.testScreen.classList.remove("is-hidden");
  els.finishScreen.classList.add("is-hidden");
  els.progress.textContent = `Word ${state.currentIndex + 1} of ${state.words.length}`;
  els.word.textContent = "";
  els.word.classList.add("hidden-word");
  els.back.disabled = state.currentIndex === 0;
  els.next.textContent = state.currentIndex === state.words.length - 1 ? "Finish" : "Next";
  els.autoRepeat.textContent = state.autoRepeat ? "Auto-repeat: On" : "Auto-repeat: Off";
  els.autoRepeat.setAttribute("aria-pressed", String(state.autoRepeat));
}

function renderFinish() {
  stopAudio();
  els.testScreen.classList.add("is-hidden");
  els.finishScreen.classList.remove("is-hidden");
  els.wordList.innerHTML = "";
  state.words.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.word;
    els.wordList.appendChild(li);
  });
}

function disableButtons(disabled) {
  [els.repeat, els.restart, els.back, els.next, els.autoRepeat].forEach((button) => {
    button.disabled = disabled;
  });
}

function stopAudio() {
  if (state.repeatTimer) {
    clearTimeout(state.repeatTimer);
    state.repeatTimer = null;
  }
  if (state.audio) {
    state.audio.pause();
    state.audio.currentTime = 0;
    state.audio.onended = null;
  }
}

function playCurrentWord() {
  const word = currentWord();
  if (!word) {
    return;
  }

  stopAudio();
  state.audio = new Audio(word.audio);
  state.audio.onended = () => {
    if (state.autoRepeat) {
      state.repeatTimer = window.setTimeout(playCurrentWord, 2000);
    }
  };
  state.audio.play().catch(() => {
    els.status.textContent = "Tap Repeat word or Restart if the browser blocked sound.";
  });
  els.status.textContent = "";
}

function playAfterNavigationIfNeeded() {
  if (state.autoRepeat) {
    playCurrentWord();
  }
}

function goBack() {
  if (state.currentIndex === 0) {
    return;
  }
  stopAudio();
  state.currentIndex -= 1;
  renderTest();
  playAfterNavigationIfNeeded();
}

function goNext() {
  stopAudio();
  if (state.currentIndex === state.words.length - 1) {
    renderFinish();
    return;
  }
  state.currentIndex += 1;
  renderTest();
  playAfterNavigationIfNeeded();
}

function restartToFirst() {
  stopAudio();
  state.currentIndex = 0;
  renderTest();
  playAfterNavigationIfNeeded();
}

els.repeat.addEventListener("click", playCurrentWord);
els.back.addEventListener("click", goBack);
els.next.addEventListener("click", goNext);
els.restart.addEventListener("click", restartToFirst);
els.autoRepeat.addEventListener("click", () => {
  state.autoRepeat = !state.autoRepeat;
  stopAudio();
  renderTest();
  playAfterNavigationIfNeeded();
});
els.finishRestart.addEventListener("click", restartToFirst);
els.finishBack.addEventListener("click", () => {
  stopAudio();
  state.currentIndex = Math.max(0, state.words.length - 1);
  renderTest();
  playAfterNavigationIfNeeded();
});

loadWords();
