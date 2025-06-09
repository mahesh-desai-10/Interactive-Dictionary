const URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

let information = document.querySelector(".information");
let searchBtn = document.querySelector(".search-icon");
let soundBtn = document.querySelector(".pronunciation");
let searchBox = document.querySelector(".search-box");
let sound = document.querySelector(".word-audio");
let wordCopy = document.querySelector(".wordCopy");
let noAudio = document.querySelector("#no-audio");
let meaning = document.querySelector("#meaning");
let example = document.querySelector("#example");

const getData = async () => {
  let newURL = URL + searchBox.value;
  let response = await fetch(newURL);
  wordCopy.innerText = searchBox.value;
  let data = await response.json();
  let item = data[0];
  information.classList.remove("hide");
};

const getMeaning = async () => {
  let newURL = URL + searchBox.value;
  let response = await fetch(newURL);
  let data = await response.json();
  let item = data[0];

  const meanings = item.meanings;

  const allDefinitions = meanings.flatMap((meaning) =>
    meaning.definitions.map((def) => def.definition)
  );

  meaning.innerText = allDefinitions[0];
};

const getExample = async () => {
  let newURL = URL + searchBox.value;
  let response = await fetch(newURL);
  let data = await response.json();
  let item = data[0];

  const meanings = item.meanings;

  const examples = data[0].meanings
    .flatMap((m) =>
      m.definitions.filter((d) => d.example).map((d) => d.example)
    )
    .slice(0, 3);

  const exampleDiv = document.querySelector(".example");
  exampleDiv.innerHTML =
    `<p class="heading">Example :</p><ul>` +
    examples.map((e) => `<li>${e}</li>`).join("") +
    `</ul>`;
};
const getSynonyms = async () => {
  const response = await fetch(URL + searchBox.value);
  const data = await response.json();
  const item = data[0];

  const synonyms = [...new Set(item.meanings.flatMap((m) => m.synonyms))].slice(
    0,
    3
  );

  const synonymDiv = document.querySelector(".synonyms");
  if (synonyms.length > 0) {
    synonymDiv.innerHTML =
      `<p class="heading">Synonyms :</p><ul>` +
      synonyms.map((s) => `<li>${s}</li>`).join("") +
      `</ul>`;
  } else {
    synonymDiv.innerHTML = `<p class="heading">Synonyms :</p><p>No synonyms found.</p>`;
  }
};

let lastClickTime = 0;

const getAudio = async () => {
  const now = Date.now();
  const fastClick = now - lastClickTime < 2000;
  lastClickTime = now;

  let newURL = URL + searchBox.value;
  try {
    const response = await fetch(newURL);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let data = await response.json();

    let item = data[0];

    let audioURL = item.phonetics[0].audio;

    if (!audioURL) {
      noAudio.innerText = "pronunciation audio not available";
      console.warn("pronunciation audio not available.");
    }
    sound.src = audioURL;
    sound.volume = 1.0;
    sound.playbackRate = fastClick ? 0.6 : 1.0;

    await sound.play();
  } catch (err) {
    noAudio.innerText = "pronunciation audio not available";
    console.error("Audio fetch/play error:", err);
  }
};

searchBtn.addEventListener(
  "click",
  getData,
  getMeaning,
  getExample,
  getSynonyms
);
soundBtn.addEventListener("click", getAudio);

searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    getData();
    getMeaning();
    getExample();
    getSynonyms();
  }
});
