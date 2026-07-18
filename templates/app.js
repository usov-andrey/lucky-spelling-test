const ASSET_VERSION = "pokemon-modes-20260718-1";

const BUDDIES = [
  { name: "Pikachu", image: "pokemon/pikachu.png" },
  { name: "Eevee", image: "pokemon/eevee.png" },
  { name: "Bulbasaur", image: "pokemon/bulbasaur.png" },
  { name: "Charmander", image: "pokemon/charmander.png" },
  { name: "Squirtle", image: "pokemon/squirtle.png" },
  { name: "Jigglypuff", image: "pokemon/jigglypuff.png" },
];

const state = {
  lesson: null,
  words: [],
  mode: null,
  currentIndex: 0,
  audio: null,
};

const els = {
  introScreen: document.getElementById("intro-screen"),
  practiceScreen: document.getElementById("practice-screen"),
  finishScreen: document.getElementById("finish-screen"),
  introTitle: document.getElementById("intro-title"),
  introTopic: document.getElementById("intro-topic"),
  chooseLearn: document.getElementById("choose-learn"),
  chooseTest: document.getElementById("choose-test"),
  changeMode: document.getElementById("change-mode"),
  progress: document.getElementById("progress"),
  modeLabel: document.getElementById("mode-label"),
  practiceHeading: document.getElementById("practice-heading"),
  buddyImage: document.getElementById("buddy-image"),
  prompt: document.getElementById("prompt"),
  word: document.getElementById("word"),
  repeat: document.getElementById("repeat"),
  meaning: document.getElementById("meaning"),
  back: document.getElementById("back"),
  next: document.getElementById("next"),
  status: document.getElementById("status"),
  finishMessage: document.getElementById("finish-message"),
  wordList: document.getElementById("word-list"),
  finishRestart: document.getElementById("finish-restart"),
  finishModes: document.getElementById("finish-modes"),
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
    disableModeButtons(false);
  } catch (error) {
    els.introTopic.textContent = "Could not load the words. Please refresh the page.";
  }
}

function currentWord() {
  return state.words[state.currentIndex];
}

function showOnly(screen) {
  [els.introScreen, els.practiceScreen, els.finishScreen].forEach((item) => {
    item.classList.toggle("is-hidden", item !== screen);
  });
}

function renderIntro() {
  const page = state.lesson.pageLabel ? ` · ${state.lesson.pageLabel}` : "";
  els.introTitle.textContent = `${state.lesson.title || "Lucky Spelling"}${page}`;
  els.introTopic.textContent = state.lesson.topic || "Listen, learn, and spell";
  showOnly(els.introScreen);
}

function chooseMode(mode) {
  stopAudio();
  state.mode = mode;
  state.currentIndex = 0;
  renderPractice();
  playCurrentWord();
}

function renderPractice() {
  const item = currentWord();
  if (!item) return;

  const isLearn = state.mode === "learn";
  const buddy = BUDDIES[state.currentIndex % BUDDIES.length];
  showOnly(els.practiceScreen);
  els.practiceScreen.dataset.mode = state.mode;
  els.progress.textContent = `${state.currentIndex + 1} of ${state.words.length}`;
  els.modeLabel.textContent = isLearn ? "Learn mode" : "Test mode";
  els.practiceHeading.textContent = isLearn ? "Learn the word" : "Listen and spell";
  els.prompt.textContent = isLearn ? "Look, listen, and say it" : "Write the word on your paper";
  els.word.textContent = isLearn ? item.word : "The word is hidden";
  els.word.classList.toggle("is-test-word", !isLearn);
  els.meaning.classList.toggle("is-hidden", !isLearn);
  els.meaning.disabled = !item.definition;
  els.back.disabled = state.currentIndex === 0;
  els.next.textContent = state.currentIndex === state.words.length - 1 ? "Finish" : "Next";
  els.buddyImage.src = assetUrl(buddy.image);
  els.buddyImage.alt = buddy.name;
  els.status.textContent = "";
}

function renderFinish() {
  stopAudio();
  showOnly(els.finishScreen);
  els.finishMessage.textContent = state.mode === "learn"
    ? "You learned every word!"
    : "You completed the spelling test!";
  els.wordList.innerHTML = "";
  state.words.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.word;
    els.wordList.appendChild(li);
  });
}

function disableModeButtons(disabled) {
  els.chooseLearn.disabled = disabled;
  els.chooseTest.disabled = disabled;
}

function stopAudio() {
  if (!state.audio) return;
  state.audio.pause();
  state.audio.currentTime = 0;
  state.audio = null;
}

function playAudio(path) {
  stopAudio();
  state.audio = new Audio(assetUrl(path));
  state.audio.play().catch(() => {
    els.status.textContent = "Tap Hear the word to play the sound.";
  });
}

function playCurrentWord() {
  const item = currentWord();
  if (item) playAudio(item.audio);
}

function goBack() {
  if (state.currentIndex === 0) return;
  stopAudio();
  state.currentIndex -= 1;
  renderPractice();
  playCurrentWord();
}

function goNext() {
  stopAudio();
  if (state.currentIndex === state.words.length - 1) {
    renderFinish();
    return;
  }
  state.currentIndex += 1;
  renderPractice();
  playCurrentWord();
}

function openMeaning() {
  const item = currentWord();
  if (!item || !item.definition || state.mode !== "learn") return;
  stopAudio();
  els.learnWord.textContent = item.word;
  els.learnImage.src = assetUrl(item.image);
  els.learnImage.alt = item.imageAlt || "";
  els.learnDefinition.textContent = item.definition;
  const credit = item.imageCredit || {};
  els.imageCredit.textContent = credit.name
    ? `Image: ${credit.name}${credit.license ? ` · ${credit.license}` : ""}`
    : "";
  els.imageCredit.href = credit.url || "https://openmoji.org/";
  els.imageCredit.hidden = !credit.name;
  els.playDefinition.dataset.audio = item.definitionAudio || "";
  els.playDefinition.hidden = !item.definitionAudio;
  els.learnDialog.showModal();
}

function closeMeaning() {
  stopAudio();
  els.learnDialog.close();
}

function returnToModes() {
  stopAudio();
  state.mode = null;
  renderIntro();
}

els.chooseLearn.addEventListener("click", () => chooseMode("learn"));
els.chooseTest.addEventListener("click", () => chooseMode("test"));
els.changeMode.addEventListener("click", returnToModes);
els.repeat.addEventListener("click", playCurrentWord);
els.meaning.addEventListener("click", openMeaning);
els.back.addEventListener("click", goBack);
els.next.addEventListener("click", goNext);
els.finishRestart.addEventListener("click", () => chooseMode(state.mode));
els.finishModes.addEventListener("click", returnToModes);
els.playDefinition.addEventListener("click", () => {
  const path = els.playDefinition.dataset.audio;
  if (path) playAudio(path);
});
els.closeLearn.addEventListener("click", closeMeaning);
els.learnDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeMeaning();
});
els.learnDialog.addEventListener("click", (event) => {
  if (event.target === els.learnDialog) closeMeaning();
});

disableModeButtons(true);
loadWords();
