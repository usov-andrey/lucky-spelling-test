const ASSET_VERSION = "settings-20260719-1";
const LANGUAGE_KEY = "lucky-spelling-language";
const THEME_KEY = "lucky-spelling-theme";

const BUDDIES = [
  { name: "Pikachu", image: "pokemon/pikachu.png" },
  { name: "Eevee", image: "pokemon/eevee.png" },
  { name: "Bulbasaur", image: "pokemon/bulbasaur.png" },
  { name: "Charmander", image: "pokemon/charmander.png" },
  { name: "Squirtle", image: "pokemon/squirtle.png" },
  { name: "Jigglypuff", image: "pokemon/jigglypuff.png" },
];

const THEMES = {
  pokemon: { symbols: [], finish: "" },
  space: { symbols: ["🚀", "🪐", "👩‍🚀", "🌟", "👨‍🚀"], finish: "🏆🚀" },
  magic: { symbols: ["🦉", "🪄", "🔮", "🐉", "✨"], finish: "🏆✨" },
  ocean: { symbols: ["🐬", "🐙", "🐢", "🦈", "🐠"], finish: "🏆🐬" },
};

const COPY = {
  en: {
    chooseAdventure: "Choose your adventure",
    introTopic: "Listen, learn, and spell",
    learn: "Learn",
    learnDesc: "See the word and discover its meaning",
    test: "Test",
    testDesc: "Listen and spell without seeing the word",
    settings: "Settings",
    settingsDesc: "Choose your lesson, theme, and language",
    settingsEyebrow: "Make it yours",
    settingsIntro: "Pick how your spelling adventure looks and sounds.",
    back: "← Back",
    modes: "← Modes",
    chooseLesson: "Choose lesson",
    lessonNote: "The lesson resets to the current lesson when you open the app again.",
    currentLesson: "Current lesson",
    previousLesson: "Previous lesson",
    chooseTheme: "Choose theme",
    chooseLanguage: "Choose language",
    themePokemon: "Pokémon",
    themeSpace: "Space Explorers",
    themeMagic: "Magic Academy",
    themeOcean: "Ocean Adventure",
    languageEnglish: "English",
    languageThai: "Thai",
    languageRussian: "Russian",
    learnMode: "Learn mode",
    testMode: "Test mode",
    learnHeading: "Learn the word",
    testHeading: "Listen and spell",
    learnPrompt: "Look, listen, and say it",
    testPrompt: "Write the word on your paper",
    hiddenWord: "The word is hidden",
    hearWord: "Hear the word",
    meaning: "What does it mean?",
    backWord: "Back",
    next: "Next",
    finish: "Finish",
    of: "of",
    audioHint: "Tap Hear the word to play the sound.",
    finishEyebrow: "Adventure complete",
    finishHeading: "Great job, Lucky!",
    learnedAll: "You learned every word!",
    testedAll: "You completed the spelling test!",
    again: "Do it again",
    anotherMode: "Choose another mode",
    wordMeaning: "Word meaning",
    hearMeaning: "🔊 Hear the meaning",
    closeMeaning: "Close meaning card",
    loadError: "Could not load the words. Please refresh the page.",
  },
  th: {
    chooseAdventure: "เลือกการผจญภัยของคุณ",
    introTopic: "ฟัง เรียนรู้ และสะกดคำ",
    learn: "เรียนรู้",
    learnDesc: "ดูคำศัพท์และเรียนรู้ความหมาย",
    test: "ทดสอบ",
    testDesc: "ฟังและสะกดโดยไม่เห็นคำศัพท์",
    settings: "การตั้งค่า",
    settingsDesc: "เลือกบทเรียน ธีม และภาษา",
    settingsEyebrow: "ปรับให้เป็นแบบของคุณ",
    settingsIntro: "เลือกรูปแบบและภาษาสำหรับการผจญภัยสะกดคำ",
    back: "← กลับ",
    modes: "← โหมด",
    chooseLesson: "เลือกบทเรียน",
    lessonNote: "เมื่อเปิดแอปอีกครั้ง บทเรียนจะกลับไปเป็นบทเรียนปัจจุบัน",
    currentLesson: "บทเรียนปัจจุบัน",
    previousLesson: "บทเรียนก่อนหน้า",
    chooseTheme: "เลือกธีม",
    chooseLanguage: "เลือกภาษา",
    themePokemon: "โปเกมอน",
    themeSpace: "นักสำรวจอวกาศ",
    themeMagic: "โรงเรียนเวทมนตร์",
    themeOcean: "ผจญภัยใต้ทะเล",
    languageEnglish: "อังกฤษ",
    languageThai: "ไทย",
    languageRussian: "รัสเซีย",
    learnMode: "โหมดเรียนรู้",
    testMode: "โหมดทดสอบ",
    learnHeading: "เรียนรู้คำศัพท์",
    testHeading: "ฟังและสะกดคำ",
    learnPrompt: "ดู ฟัง และพูดตาม",
    testPrompt: "เขียนคำศัพท์ลงบนกระดาษ",
    hiddenWord: "ซ่อนคำศัพท์อยู่",
    hearWord: "ฟังคำศัพท์",
    meaning: "คำนี้แปลว่าอะไร?",
    backWord: "ย้อนกลับ",
    next: "ถัดไป",
    finish: "เสร็จสิ้น",
    of: "จาก",
    audioHint: "แตะฟังคำศัพท์เพื่อเล่นเสียง",
    finishEyebrow: "จบการผจญภัยแล้ว",
    finishHeading: "เก่งมาก Lucky!",
    learnedAll: "คุณเรียนรู้ครบทุกคำแล้ว!",
    testedAll: "คุณทำแบบทดสอบสะกดคำเสร็จแล้ว!",
    again: "ทำอีกครั้ง",
    anotherMode: "เลือกโหมดอื่น",
    wordMeaning: "ความหมายของคำ",
    hearMeaning: "🔊 ฟังความหมาย",
    closeMeaning: "ปิดการ์ดความหมาย",
    loadError: "โหลดคำศัพท์ไม่ได้ โปรดลองรีเฟรชหน้าเว็บ",
  },
  ru: {
    chooseAdventure: "Выбери приключение",
    introTopic: "Слушай, учись и пиши слова",
    learn: "Учить",
    learnDesc: "Увидеть слово и узнать его значение",
    test: "Тест",
    testDesc: "Слушать и писать, не видя слова",
    settings: "Настройки",
    settingsDesc: "Выбрать урок, тему и язык",
    settingsEyebrow: "Настрой под себя",
    settingsIntro: "Выбери, как будет выглядеть и звучать твоё приключение.",
    back: "← Назад",
    modes: "← Режимы",
    chooseLesson: "Выбрать урок",
    lessonNote: "При следующем открытии приложения снова включится текущий урок.",
    currentLesson: "Текущий урок",
    previousLesson: "Предыдущий урок",
    chooseTheme: "Выбрать тему",
    chooseLanguage: "Выбрать язык",
    themePokemon: "Покемоны",
    themeSpace: "Исследователи космоса",
    themeMagic: "Академия магии",
    themeOcean: "Океанское приключение",
    languageEnglish: "Английский",
    languageThai: "Тайский",
    languageRussian: "Русский",
    learnMode: "Режим обучения",
    testMode: "Режим теста",
    learnHeading: "Выучи слово",
    testHeading: "Слушай и пиши",
    learnPrompt: "Посмотри, послушай и повтори",
    testPrompt: "Напиши слово на бумаге",
    hiddenWord: "Слово скрыто",
    hearWord: "Послушать слово",
    meaning: "Что это значит?",
    backWord: "Назад",
    next: "Дальше",
    finish: "Закончить",
    of: "из",
    audioHint: "Нажми «Послушать слово», чтобы включить звук.",
    finishEyebrow: "Приключение завершено",
    finishHeading: "Отличная работа, Lucky!",
    learnedAll: "Ты выучил(а) все слова!",
    testedAll: "Ты закончил(а) тест по правописанию!",
    again: "Пройти ещё раз",
    anotherMode: "Выбрать другой режим",
    wordMeaning: "Значение слова",
    hearMeaning: "🔊 Послушать значение",
    closeMeaning: "Закрыть карточку значения",
    loadError: "Не удалось загрузить слова. Обнови страницу.",
  },
};

function readPreference(key, allowed, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return allowed.includes(value) ? value : fallback;
  } catch (_) {
    return fallback;
  }
}

function savePreference(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (_) {
    // Preferences still work for this visit when storage is unavailable.
  }
}

const state = {
  lessons: [],
  lessonId: "current",
  lesson: null,
  words: [],
  mode: null,
  currentIndex: 0,
  audio: null,
  language: readPreference(LANGUAGE_KEY, Object.keys(COPY), "en"),
  theme: readPreference(THEME_KEY, Object.keys(THEMES), "pokemon"),
};

const els = {
  introScreen: document.getElementById("intro-screen"),
  settingsScreen: document.getElementById("settings-screen"),
  practiceScreen: document.getElementById("practice-screen"),
  finishScreen: document.getElementById("finish-screen"),
  pokemonLineup: document.getElementById("pokemon-lineup"),
  collectionLineup: document.getElementById("collection-lineup"),
  introEyebrow: document.getElementById("intro-eyebrow"),
  introTitle: document.getElementById("intro-title"),
  introTopic: document.getElementById("intro-topic"),
  chooseLearn: document.getElementById("choose-learn"),
  chooseTest: document.getElementById("choose-test"),
  chooseSettings: document.getElementById("choose-settings"),
  closeSettings: document.getElementById("close-settings"),
  settingsEyebrow: document.getElementById("settings-eyebrow"),
  settingsTitle: document.getElementById("settings-title"),
  settingsDescription: document.getElementById("settings-description"),
  lessonLegend: document.getElementById("lesson-legend"),
  lessonOptions: document.getElementById("lesson-options"),
  lessonNote: document.getElementById("lesson-note"),
  themeLegend: document.getElementById("theme-legend"),
  themeOptions: document.getElementById("theme-options"),
  languageLegend: document.getElementById("language-legend"),
  languageOptions: document.getElementById("language-options"),
  changeMode: document.getElementById("change-mode"),
  progress: document.getElementById("progress"),
  modeLabel: document.getElementById("mode-label"),
  practiceHeading: document.getElementById("practice-heading"),
  buddyImage: document.getElementById("buddy-image"),
  buddySymbol: document.getElementById("buddy-symbol"),
  prompt: document.getElementById("prompt"),
  word: document.getElementById("word"),
  repeat: document.getElementById("repeat"),
  repeatLabel: document.getElementById("repeat-label"),
  meaning: document.getElementById("meaning"),
  back: document.getElementById("back"),
  next: document.getElementById("next"),
  status: document.getElementById("status"),
  finishPokemon: document.getElementById("finish-pokemon"),
  finishSymbol: document.getElementById("finish-symbol"),
  finishEyebrow: document.getElementById("finish-eyebrow"),
  finishHeading: document.getElementById("finish-heading"),
  finishMessage: document.getElementById("finish-message"),
  wordList: document.getElementById("word-list"),
  finishRestart: document.getElementById("finish-restart"),
  finishModes: document.getElementById("finish-modes"),
  learnDialog: document.getElementById("learn-dialog"),
  meaningEyebrow: document.getElementById("meaning-eyebrow"),
  learnWord: document.getElementById("learn-word"),
  learnImage: document.getElementById("learn-image"),
  learnDefinition: document.getElementById("learn-definition"),
  playDefinition: document.getElementById("play-definition"),
  closeLearn: document.getElementById("close-learn"),
  imageCredit: document.getElementById("image-credit"),
  legalNote: document.getElementById("legal-note"),
};

function t(key) {
  return COPY[state.language][key] || COPY.en[key] || key;
}

function assetUrl(path) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}v=${ASSET_VERSION}`;
}

async function fetchLesson(path) {
  const response = await fetch(assetUrl(path), { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (Array.isArray(data)) {
    return { title: "Lucky Spelling Test", pageLabel: "", topic: "", words: data };
  }
  return data;
}

async function loadLessons() {
  try {
    const current = await fetchLesson("words.json");
    state.lessons = [{ id: "current", data: current }];
    state.lesson = current;
    state.words = current.words || [];
    if (!state.words.length) throw new Error("No words found");
    renderIntro();
    disableModeButtons(false);

    try {
      const previous = await fetchLesson("lessons/previous.json");
      if ((previous.words || []).length) {
        state.lessons.push({ id: "previous", data: previous });
        renderLessonOptions();
      }
    } catch (_) {
      // A newly generated app can legitimately have only one lesson.
    }
  } catch (_) {
    els.introTopic.textContent = t("loadError");
  }
}

function currentWord() {
  return state.words[state.currentIndex];
}

function showOnly(screen) {
  [els.introScreen, els.settingsScreen, els.practiceScreen, els.finishScreen].forEach((item) => {
    item.classList.toggle("is-hidden", item !== screen);
  });
}

function lessonName(lesson) {
  const type = lesson.id === "current" ? t("currentLesson") : t("previousLesson");
  const label = lesson.data.pageLabel || lesson.data.topic || "";
  return label ? `${type} · ${label}` : type;
}

function renderIntro() {
  if (!state.lesson) return;
  const page = state.lesson.pageLabel ? ` · ${state.lesson.pageLabel}` : "";
  els.introTitle.textContent = `${state.lesson.title || "Lucky Spelling"}${page}`;
  els.introTopic.textContent = state.lesson.topic || t("introTopic");
  showOnly(els.introScreen);
}

function renderStaticCopy() {
  document.documentElement.lang = state.language;
  document.title = t("settings") === "Settings" ? "Lucky Spelling Test" : `Lucky Spelling Test · ${t("settings")}`;
  els.introEyebrow.textContent = t("chooseAdventure");
  els.chooseLearn.querySelector("strong").textContent = t("learn");
  els.chooseLearn.querySelector("small").textContent = t("learnDesc");
  els.chooseTest.querySelector("strong").textContent = t("test");
  els.chooseTest.querySelector("small").textContent = t("testDesc");
  els.chooseSettings.querySelector("strong").textContent = t("settings");
  els.chooseSettings.querySelector("small").textContent = t("settingsDesc");
  els.closeSettings.textContent = t("back");
  els.settingsEyebrow.textContent = t("settingsEyebrow");
  els.settingsTitle.textContent = t("settings");
  els.settingsDescription.textContent = t("settingsIntro");
  els.lessonLegend.textContent = t("chooseLesson");
  els.lessonNote.textContent = t("lessonNote");
  els.themeLegend.textContent = t("chooseTheme");
  els.languageLegend.textContent = t("chooseLanguage");
  els.changeMode.textContent = t("modes");
  els.repeatLabel.textContent = t("hearWord");
  els.meaning.textContent = t("meaning");
  els.back.textContent = t("backWord");
  els.finishEyebrow.textContent = t("finishEyebrow");
  els.finishHeading.textContent = t("finishHeading");
  els.finishRestart.textContent = t("again");
  els.finishModes.textContent = t("anotherMode");
  els.meaningEyebrow.textContent = t("wordMeaning");
  els.playDefinition.textContent = t("hearMeaning");
  els.closeLearn.setAttribute("aria-label", t("closeMeaning"));
}

function renderChoice(container, value, selected, label, symbol, onSelect) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "choice-card";
  button.dataset.value = value;
  button.setAttribute("aria-pressed", String(selected));
  button.innerHTML = `<span class="choice-symbol" aria-hidden="true">${symbol}</span><span>${label}</span>`;
  button.addEventListener("click", onSelect);
  container.appendChild(button);
}

function renderLessonOptions() {
  els.lessonOptions.innerHTML = "";
  state.lessons.forEach((lesson) => {
    renderChoice(
      els.lessonOptions,
      lesson.id,
      lesson.id === state.lessonId,
      lessonName(lesson),
      lesson.id === "current" ? "📘" : "📗",
      () => selectLesson(lesson.id),
    );
  });
}

function renderThemeOptions() {
  const choices = [
    ["pokemon", t("themePokemon"), "⚡"],
    ["space", t("themeSpace"), "🚀"],
    ["magic", t("themeMagic"), "🪄"],
    ["ocean", t("themeOcean"), "🐬"],
  ];
  els.themeOptions.innerHTML = "";
  choices.forEach(([value, label, symbol]) => {
    renderChoice(els.themeOptions, value, value === state.theme, label, symbol, () => selectTheme(value));
  });
}

function renderLanguageOptions() {
  const choices = [
    ["en", t("languageEnglish"), "🇬🇧"],
    ["th", t("languageThai"), "🇹🇭"],
    ["ru", t("languageRussian"), "🇷🇺"],
  ];
  els.languageOptions.innerHTML = "";
  choices.forEach(([value, label, symbol]) => {
    renderChoice(els.languageOptions, value, value === state.language, label, symbol, () => selectLanguage(value));
  });
}

function renderSettings() {
  renderLessonOptions();
  renderThemeOptions();
  renderLanguageOptions();
}

function applyTheme() {
  const theme = THEMES[state.theme];
  document.body.dataset.theme = state.theme;
  const isPokemon = state.theme === "pokemon";
  els.pokemonLineup.classList.toggle("is-hidden", !isPokemon);
  els.collectionLineup.classList.toggle("is-hidden", isPokemon);
  els.collectionLineup.setAttribute("aria-hidden", String(isPokemon));
  els.collectionLineup.innerHTML = theme.symbols.map((symbol) => `<span>${symbol}</span>`).join("");
  els.legalNote.hidden = !isPokemon;
}

function selectLesson(id) {
  const lesson = state.lessons.find((item) => item.id === id);
  if (!lesson) return;
  stopAudio();
  state.lessonId = id;
  state.lesson = lesson.data;
  state.words = lesson.data.words || [];
  state.currentIndex = 0;
  state.mode = null;
  renderLessonOptions();
}

function selectTheme(theme) {
  if (!THEMES[theme]) return;
  state.theme = theme;
  savePreference(THEME_KEY, theme);
  applyTheme();
  renderThemeOptions();
}

function selectLanguage(language) {
  if (!COPY[language]) return;
  state.language = language;
  savePreference(LANGUAGE_KEY, language);
  renderStaticCopy();
  renderSettings();
}

function chooseMode(mode) {
  stopAudio();
  state.mode = mode;
  state.currentIndex = 0;
  renderPractice();
  playCurrentWord();
}

function renderBuddy(index) {
  const theme = THEMES[state.theme];
  const isPokemon = state.theme === "pokemon";
  els.buddyImage.classList.toggle("is-hidden", !isPokemon);
  els.buddySymbol.classList.toggle("is-hidden", isPokemon);
  if (isPokemon) {
    const buddy = BUDDIES[index % BUDDIES.length];
    els.buddyImage.src = assetUrl(buddy.image);
    els.buddyImage.alt = buddy.name;
  } else {
    els.buddySymbol.textContent = theme.symbols[index % theme.symbols.length];
  }
}

function renderPractice() {
  const item = currentWord();
  if (!item) return;

  const isLearn = state.mode === "learn";
  showOnly(els.practiceScreen);
  els.practiceScreen.dataset.mode = state.mode;
  els.progress.textContent = `${state.currentIndex + 1} ${t("of")} ${state.words.length}`;
  els.modeLabel.textContent = isLearn ? t("learnMode") : t("testMode");
  els.practiceHeading.textContent = isLearn ? t("learnHeading") : t("testHeading");
  els.prompt.textContent = isLearn ? t("learnPrompt") : t("testPrompt");
  els.word.textContent = isLearn ? item.word : t("hiddenWord");
  els.word.classList.toggle("is-test-word", !isLearn);
  els.meaning.classList.toggle("is-hidden", !isLearn);
  els.meaning.disabled = !item.definition;
  els.back.disabled = state.currentIndex === 0;
  els.next.textContent = state.currentIndex === state.words.length - 1 ? t("finish") : t("next");
  renderBuddy(state.currentIndex);
  els.status.textContent = "";
}

function renderFinish() {
  stopAudio();
  showOnly(els.finishScreen);
  const isPokemon = state.theme === "pokemon";
  els.finishPokemon.classList.toggle("is-hidden", !isPokemon);
  els.finishSymbol.classList.toggle("is-hidden", isPokemon);
  els.finishSymbol.textContent = THEMES[state.theme].finish;
  els.finishMessage.textContent = state.mode === "learn" ? t("learnedAll") : t("testedAll");
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
    els.status.textContent = t("audioHint");
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
els.chooseSettings.addEventListener("click", () => {
  renderSettings();
  showOnly(els.settingsScreen);
});
els.closeSettings.addEventListener("click", renderIntro);
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
renderStaticCopy();
applyTheme();
renderSettings();
loadLessons();
