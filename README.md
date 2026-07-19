# Lucky Spelling Skill

Утилита создает простой spelling test для Lucky: читает список английских слов, заранее генерирует аудио для каждого слова, собирает статический сайт в `docs/` и умеет публиковать его на GitHub Pages. Backend, база данных, npm, React и Vite не нужны.

## Установка

Windows:

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -e .
```

macOS/Linux:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .
```

Для лучших MP3-голосов можно поставить TTS-зависимости:

```bash
pip install -e ".[tts]"
```

Для OCR из фото:

```bash
pip install -e ".[ocr]"
```

OCR через `pytesseract` также требует установленный Tesseract OCR в системе.

## GitHub CLI

Установите GitHub CLI, затем авторизуйтесь:

```bash
gh --version
gh auth login
```

Утилита не просит и не хранит GitHub password или token.

## Создать тест из words.txt

Формат файла - одно английское слово на строку:

```text
fungus
cactus
virus
```

Команда:

```bash
python -m lucky_spelling generate --words examples/sample_words.txt --out docs
```

Если аудио уже есть и нужно только пересобрать сайт:

```bash
python -m lucky_spelling generate --words examples/sample_words.txt --out docs --reuse-audio
```

Локальный preview:

```bash
python -m http.server 8000 --directory docs
```

Откройте `http://localhost:8000`.

На Windows тот же preview можно запустить двойным кликом по `start-preview.bat` в корне проекта. Окно сервера нужно оставить открытым; для остановки нажмите `Ctrl+C`.

## Создать тест из фото

MVP умеет пробовать OCR, если установлены optional OCR-зависимости:

```bash
python -m lucky_spelling generate --image input.jpg --out docs
```

Если OCR недоступен или ошибся, создайте `words.txt` вручную: одно слово на строку, затем запустите генерацию через `--words`.

## Deploy на GitHub Pages

После генерации:

```bash
python -m lucky_spelling deploy --repo lucky-spelling-test
```

Команда проверит `docs/index.html`, аудио в `docs/audio/`, авторизацию `gh`, создаст репозиторий при необходимости, запушит `main` и включит GitHub Pages из папки `/docs`.

В конце будет напечатан URL:

```text
https://<github-username>.github.io/lucky-spelling-test/
```

## Полный цикл

Из `words.txt`:

```bash
python -m lucky_spelling publish --words examples/sample_words.txt --repo lucky-spelling-test
```

Из фото:

```bash
python -m lucky_spelling publish --image input.jpg --repo lucky-spelling-test
```

## Как обновить слова

1. Замените содержимое `words.txt`.
2. Запустите `generate`.
3. Проверьте сайт локально через `python -m http.server`.
4. Запустите `deploy`.

## Если аудио не сгенерировалось

Поставьте TTS-зависимости:

```bash
pip install -e ".[tts]"
```

На Windows утилита также пробует локальный `System.Speech`. Если установлен `ffmpeg`, WAV будет автоматически конвертирован в MP3. Без `ffmpeg` сайт может использовать WAV-файлы, что тоже работает в обычном мобильном браузере.

## Если звук не играет на телефоне

Открывайте страницу по HTTPS-ссылке GitHub Pages, не как локальный `.html` из Files. На iPhone/iPad локальный preview может блокировать JavaScript. Звук запускается только после явного нажатия `Start` или `Repeat word`, потому что мобильные браузеры обычно запрещают autoplay.

## Что внутри сайта

`docs/` содержит обычную статическую страницу:

```text
docs/
  .nojekyll
  index.html
  styles.css
  app.js
  words.json
  words.txt
  audio/
```

На странице есть кнопки `Start`, `Repeat word`, `Back`, `Next`, `Show word`, `Auto-repeat`, `Restart`. Слово скрыто по умолчанию, а после последнего слова открывается финальный экран со всем списком.

## Тесты

```bash
python -m unittest discover -s tests
```
