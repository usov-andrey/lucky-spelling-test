const ASSET_VERSION = "page22-20260718-1";

const state = {
  lesson: null,
  words: [],
  currentIndex: 0,
  autoRepeat: true,
  repeatTimer: null,
  audio: null,
};

const els = {
  introScreen: document.getElementById("intro-screen"),
  testScreen: document.getElementById("test-screen"),
  finishScreen: document.getElementById("finish-screen"),
  introTitle: document.getElementById("intro-title"),
  introTopic: document.getElementById("intro-topic"),
  start: document.getElementById("start"),
  progress: document.getElementById("progress"),
  repeat: document.getElementById("repeat"),
  learn: document.getElementById("learn"),
  back: document.getElementById("back"),
  next: document.getElementById("next"),
  restart: document.getElementById("restart"),
  autoRepeat: document.getElementById("auto-repeat"),
  status: document.getElementById("status"),
  wordList: document.getElementById("word-list"),
  finishRestart: document.getElementById("finish-restart"),
  finishBack: document.getElementById("finish-back"),
  learnDialog: document.getElementById("learn-dialog"),
  learnWord: document.getElementById("learn-word"),
  learnImage: document.getElementById("learn-image"),
  learnDefinition: document.getElementById("learn-definition"),
  playDefinition: document.getElementById("play-definition"),
  closeLearn: document.getElementById("close-learn"),
  imageCredit: document.getElementById("image-credit"),
};

function assetUrl(path) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}v=${ASSET_VERSION}`;
}

async function loadWords() {
  try {
    const response = await fetch(assetUrl("words.json"), { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.lesson = await response.json();
    state.words = state.lesson.words || [];
    if (!state.words.length) throw new Error("No words found");
    renderIntro();
    disableButtons(false);
  } catch (error) {
    els.status.textContent = "Could not load the test. Please refresh the page.";
  }
}

function currentWord() {
  return state.words[state.currentIndex];
}

function showOnly(screen) {
  [els.introScreen, els.testScreen, els.finishScreen].forEach((item) => {
    item.classList.toggle("is-hidden", item !== screen);
  });
}

function renderIntro() {
  const page = state.lesson.pageLabel ? ` (${state.lesson.pageLabel})` : "";
  els.introTitle.textContent = `${state.lesson.title || "Lucky Spelling Test"}${page}`;
  els.introTopic.textContent = state.lesson.topic || "Listen, learn, and spell";
  showOnly(els.introScreen);
}

function startTest() {
  stopAudio();
  state.currentIndex = 0;
  renderTest();
  playCurrentWord();
}

function renderTest() {
  const word = currentWord();
  if (!word) return;
  showOnly(els.testScreen);
  els.progress.textContent = `Word ${state.currentIndex + 1} of ${state.words.length}`;
  els.back.disabled = state.currentIndex === 0;
  els.next.textContent = state.currentIndex === state.words.length - 1 ? "Finish" : "Next";
  els.learn.disabled = !word.definition;
  els.autoRepeat.textContent = state.autoRepeat ? "Auto-repeat: On" : "Auto-repeat: Off";
  els.autoRepeat.setAttribute("aria-pressed", String(state.autoRepeat));
  els.status.textContent = "";
}

function renderFinish() {
  stopAudio();
  showOnly(els.finishScreen);
  els.wordList.innerHTML = "";
  state.words.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.word;
    els.wordList.appendChild(li);
  });
}

function disableButtons(disabled) {
  [els.start, els.repeat, els.learn, els.restart, els.back, els.next, els.autoRepeat].forEach((button) => {
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
    state.audio = null;
  }
}

function playAudio(path, repeatWord = false) {
  stopAudio();
  state.audio = new Audio(assetUrl(path));
  state.audio.onended = () => {
    if (repeatWord && state.autoRepeat && !els.learnDialog.open) {
      state.repeatTimer = window.setTimeout(playCurrentWord, 2000);
    }
  };
  state.audio.play().catch(() => {
    els.status.textContent = "Tap Repeat word if the browser blocked sound.";
  });
}

function playCurrentWord() {
  const word = currentWord();
  if (word) playAudio(word.audio, true);
}

function goBack() {
  if (state.currentIndex === 0) return;
  stopAudio();
  state.currentIndex -= 1;
  renderTest();
  if (state.autoRepeat) playCurrentWord();
}

function goNext() {
  stopAudio();
  if (state.currentIndex === state.words.length - 1) {
    renderFinish();
    return;
  }
  state.currentIndex += 1;
  renderTest();
  if (state.autoRepeat) playCurrentWord();
}

function restartToFirst() {
  stopAudio();
  state.currentIndex = 0;
  renderTest();
  if (state.autoRepeat) playCurrentWord();
}

function openLearn() {
  const word = currentWord();
  if (!word || !word.definition) return;
  stopAudio();
  els.learnWord.textContent = word.word;
  els.learnImage.src = assetUrl(word.image);
  els.learnImage.alt = word.imageAlt;
  els.learnDefinition.textContent = word.definition;
  const credit = word.imageCredit || {};
  els.imageCredit.textContent = `Image: ${credit.name || "OpenMoji"} · ${credit.license || "CC BY-SA 4.0"}`;
  els.imageCredit.href = credit.url || "https://openmoji.org/";
  els.playDefinition.dataset.audio = word.definitionAudio;
  els.learnDialog.showModal();
}

function closeLearn() {
  stopAudio();
  els.learnDialog.close();
  if (state.autoRepeat) playCurrentWord();
}

els.start.addEventListener("click", startTest);
els.repeat.addEventListener("click", playCurrentWord);
els.learn.addEventListener("click", openLearn);
els.back.addEventListener("click", goBack);
els.next.addEventListener("click", goNext);
els.restart.addEventListener("click", restartToFirst);
els.autoRepeat.addEventListener("click", () => {
  state.autoRepeat = !state.autoRepeat;
  stopAudio();
  renderTest();
  if (state.autoRepeat) playCurrentWord();
});
els.finishRestart.addEventListener("click", restartToFirst);
els.finishBack.addEventListener("click", () => {
  state.currentIndex = state.words.length - 1;
  renderTest();
  if (state.autoRepeat) playCurrentWord();
});
els.playDefinition.addEventListener("click", () => {
  const path = els.playDefinition.dataset.audio;
  if (path) playAudio(path, false);
});
els.closeLearn.addEventListener("click", closeLearn);
els.learnDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeLearn();
});
els.learnDialog.addEventListener("click", (event) => {
  if (event.target === els.learnDialog) closeLearn();
});

disableButtons(true);
loadWords();
