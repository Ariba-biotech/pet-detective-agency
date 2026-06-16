const locations = [
  { id: "park", name: "Sunny Park", icon: "🌳", x: 8, y: 12, color: "#a4f285" },
  { id: "bakery", name: "Biscuit Bakery", icon: "🥐", x: 38, y: 8, color: "#ffd6a5" },
  { id: "library", name: "Story Library", icon: "📚", x: 68, y: 13, color: "#cdb4db" },
  { id: "fountain", name: "Bubble Fountain", icon: "⛲", x: 14, y: 44, color: "#9bf6ff" },
  { id: "market", name: "Rainbow Market", icon: "🍎", x: 42, y: 40, color: "#ffadad" },
  { id: "station", name: "Paw Patrol Stop", icon: "🚋", x: 70, y: 46, color: "#bdb2ff" },
  { id: "beach", name: "Pebble Beach", icon: "🏖️", x: 10, y: 75, color: "#fdffb6" },
  { id: "garden", name: "Moon Garden", icon: "🌙", x: 43, y: 73, color: "#caffbf" },
  { id: "rooftop", name: "Kite Rooftop", icon: "🪁", x: 72, y: 76, color: "#ffc6ff" }
];

const quests = [
  {
    id: "mittens",
    pet: "Mittens",
    emoji: "🐱",
    title: "Find Mittens the Cat",
    family: "the Button family",
    description: "Mittens followed a trail of sparkly yarn after breakfast.",
    clues: [
      { location: "library", text: "A librarian saw tiny pawprints near a shelf of bedtime stories." },
      { location: "market", text: "A ball of purple yarn rolled under the fruit stand." },
      { location: "rooftop", text: "Soft meows are coming from the kite rooftop!" }
    ],
    solution: "rooftop"
  },
  {
    id: "biscuit",
    pet: "Biscuit",
    emoji: "🐶",
    title: "Find Biscuit the Puppy",
    family: "Coach Rivera",
    description: "Biscuit chased a squeaky tennis ball across Pawston City.",
    clues: [
      { location: "park", text: "Fresh puppy tracks circle the soccer goal." },
      { location: "bakery", text: "Someone nibbled a heart-shaped dog biscuit." },
      { location: "fountain", text: "Happy barking echoes beside the bubble fountain!" }
    ],
    solution: "fountain"
  },
  {
    id: "pepper",
    pet: "Pepper",
    emoji: "🐰",
    title: "Find Pepper the Bunny",
    family: "Grandpa Jun",
    description: "Pepper bounced away with a carrot picnic basket.",
    clues: [
      { location: "garden", text: "Nibble marks decorate the moon garden carrots." },
      { location: "market", text: "A lettuce seller spotted two fluffy ears." },
      { location: "beach", text: "Tiny hops lead to a cozy towel fort on Pebble Beach!" }
    ],
    solution: "beach"
  },
  {
    id: "pickles",
    pet: "Pickles",
    emoji: "🦜",
    title: "Find Pickles the Parrot",
    family: "Captain Sunny",
    description: "Pickles flew off while practicing a new whistle song.",
    clues: [
      { location: "station", text: "Commuters heard a bird whistle the train bell tune." },
      { location: "rooftop", text: "Bright green feathers sparkle beside a kite string." },
      { location: "bakery", text: "Pickles is singing for crumbs above the bakery sign!" }
    ],
    solution: "bakery"
  }
];

const STORAGE_KEY = "petDetectiveAgencySave";
const defaultState = { activeQuest: null, solved: [], clues: {}, sound: true };
let state = loadState();
let audioContext;

const questList = document.getElementById("questList");
const cityMap = document.getElementById("cityMap");
const caseHeading = document.getElementById("currentCaseHeading");
const caseDescription = document.getElementById("caseDescription");
const clueTray = document.getElementById("clueTray");
const petPortrait = document.getElementById("petPortrait");
const rankName = document.getElementById("rankName");
const badgeIcon = document.getElementById("badgeIcon");
const badgeProgress = document.getElementById("badgeProgress");
const caseStats = document.getElementById("caseStats");
const notebookText = document.getElementById("notebookText");
const mapHint = document.getElementById("mapHint");
const toast = document.getElementById("toast");
const soundToggle = document.getElementById("soundToggle");

function loadState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function playTone(type = "tap") {
  if (!state.sound) return;
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  const notes = type === "win" ? [523, 659, 784] : type === "clue" ? [392, 523] : [330];
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime + index * 0.11);
    gain.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + index * 0.11 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + index * 0.11 + 0.16);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(audioContext.currentTime + index * 0.11);
    oscillator.stop(audioContext.currentTime + index * 0.11 + 0.18);
  });
}

function activeQuest() {
  return quests.find(quest => quest.id === state.activeQuest);
}

function render() {
  renderQuests();
  renderMap();
  renderCase();
  renderProgress();
  updateSoundButton();
  saveState();
}

function renderQuests() {
  questList.innerHTML = quests.map(quest => {
    const solved = state.solved.includes(quest.id);
    const active = state.activeQuest === quest.id;
    const clueCount = (state.clues[quest.id] || []).length;
    return `<button class="poster ${active ? "active" : ""} ${solved ? "solved" : ""}" data-quest="${quest.id}" type="button">
      <span class="poster-title"><span>${quest.emoji}</span>${quest.title}</span>
      <small>${solved ? "✅ Reunited!" : `${clueCount}/${quest.clues.length} clues found`}</small>
    </button>`;
  }).join("");

  document.querySelectorAll("[data-quest]").forEach(button => {
    button.addEventListener("click", () => selectQuest(button.dataset.quest));
  });
}

function renderMap() {
  cityMap.innerHTML = locations.map(location => `
    <button class="location" style="left:${location.x}%; top:${location.y}%; --building:${location.color}" data-location="${location.id}" role="listitem" type="button">
      <span>${location.icon}</span>${location.name}
    </button>`).join("");

  document.querySelectorAll("[data-location]").forEach(button => {
    button.addEventListener("click", () => searchLocation(button.dataset.location));
  });
}

function renderCase() {
  const quest = activeQuest();
  if (!quest) {
    caseHeading.textContent = "Choose a missing pet poster";
    caseDescription.textContent = "Tap a poster to begin your next cheerful city mystery.";
    petPortrait.textContent = "🕵️‍♀️";
    clueTray.innerHTML = "";
    mapHint.textContent = "Pick a case, then visit city spots to search for clues.";
    notebookText.textContent = "Your notes will appear here as you discover clues and solve cases.";
    return;
  }

  const foundClues = state.clues[quest.id] || [];
  const solved = state.solved.includes(quest.id);
  caseHeading.textContent = solved ? `${quest.pet} is home!` : quest.title;
  caseDescription.textContent = solved ? `${quest.pet} was reunited with ${quest.family}. Great detective work!` : quest.description;
  petPortrait.textContent = quest.emoji;
  mapHint.textContent = solved ? "Choose another poster to solve a new case." : "Tap city spots to collect all three clues.";
  clueTray.innerHTML = quest.clues.map((clue, index) => {
    const collected = foundClues.includes(clue.location);
    return `<span class="clue-chip">${collected ? "🔎" : "❔"} Clue ${index + 1}</span>`;
  }).join("");
  notebookText.innerHTML = foundClues.length
    ? foundClues.map(id => `• ${quest.clues.find(clue => clue.location === id).text}`).join("<br>")
    : "No clues yet. Search the city map!";
}

function renderProgress() {
  const solvedCount = state.solved.length;
  const clueCount = Object.values(state.clues).reduce((total, clues) => total + clues.length, 0);
  const ranks = [
    { min: 0, name: "Bronze Badge Rookie", icon: "🥉" },
    { min: 1, name: "Silver Paw Sleuth", icon: "🥈" },
    { min: 3, name: "Gold Badge Detective", icon: "🥇" },
    { min: 4, name: "Rainbow Chief Detective", icon: "🏆" }
  ];
  const rank = ranks.filter(item => solvedCount >= item.min).pop();
  rankName.textContent = rank.name;
  badgeIcon.textContent = rank.icon;
  badgeProgress.style.width = `${Math.min(100, (solvedCount / quests.length) * 100)}%`;
  caseStats.textContent = `${solvedCount} pets found • ${clueCount} clues collected`;
}

function selectQuest(id) {
  state.activeQuest = id;
  playTone("tap");
  showToast(`Case opened: ${quests.find(quest => quest.id === id).title}`);
  render();
}

function searchLocation(locationId) {
  const quest = activeQuest();
  if (!quest) {
    showToast("Choose a missing pet poster first, detective!");
    playTone("tap");
    return;
  }
  if (state.solved.includes(quest.id)) {
    showToast(`${quest.pet} is already safe at home.`);
    return;
  }

  state.clues[quest.id] ||= [];
  const clue = quest.clues.find(item => item.location === locationId);
  if (!clue) {
    showToast("You searched carefully, but this spot has no clue for this case.");
    playTone("tap");
    return;
  }
  if (!state.clues[quest.id].includes(locationId)) {
    state.clues[quest.id].push(locationId);
    showToast(clue.text);
    playTone("clue");
  } else {
    showToast("You already wrote down this clue in your notebook.");
  }

  const hasAllClues = quest.clues.every(item => state.clues[quest.id].includes(item.location));
  if (hasAllClues && !state.solved.includes(quest.id)) {
    state.solved.push(quest.id);
    setTimeout(() => showToast(`Mystery solved! ${quest.pet} was found at ${locationName(quest.solution)}!`), 700);
    playTone("win");
  }
  render();
}

function locationName(id) {
  return locations.find(location => location.id === id).name;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function updateSoundButton() {
  soundToggle.textContent = state.sound ? "🔊 Sound On" : "🔇 Sound Off";
  soundToggle.setAttribute("aria-pressed", String(state.sound));
}

soundToggle.addEventListener("click", () => {
  state.sound = !state.sound;
  playTone("tap");
  render();
});

document.getElementById("resetGame").addEventListener("click", () => {
  state = { ...defaultState, clues: {}, solved: [] };
  localStorage.removeItem(STORAGE_KEY);
  showToast("Your detective notebook has been reset.");
  render();
});

render();
