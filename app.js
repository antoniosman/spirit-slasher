const app = document.querySelector("#app");
const toastNode = document.querySelector("#toast");
const transitionNode = document.querySelector("#transition");
const introAudio = document.querySelector("#introAudio");
const outroAudio = document.querySelector("#outroAudio");
const soundButton = document.querySelector("#soundButton");
const fullscreenButton = document.querySelector("#fullscreenButton");
const homeButton = document.querySelector("#homeButton");
const updateButton = document.querySelector("#updateButton");

const STORAGE_KEY = "spirit-slasher-trilogies-v1";
const SETTINGS_KEY = "spirit-slasher-settings-v1";
const MAX_SAVES = 3;

const roster = [
  ["Alex", "char_alex.webp"], ["Billy", "char_billy.webp"],
  ["Catherine", "char_catherine.png"], ["Demarin", "char_demarin.webp"],
  ["Elisa", "char_elisa.webp"], ["Ester", "char_ester.png"],
  ["Eva", "char_eva.png"], ["Evaggelia", "char_evaggelia.png"],
  ["Evelyn", "char_evelyn.webp"], ["Hope", "char_hope.webp"],
  ["Ian", "char_ian.png"], ["Irene", "char_irene.png"],
  ["Jasmine", "char_jasmine.png"], ["Luna", "char_luna.webp"],
  ["Paul", "char_paul.png"], ["Pauline", "char_pauline.webp"],
  ["Phillip", "char_phillip.webp"], ["Rino", "char_rino.webp"],
  ["Sargenie", "char_sargenie.jpeg"], ["Smaragda", "char_smaragda.jpeg"],
  ["Sorina", "char_sorina.png"], ["Tony", "char_tony.webp"],
  ["Vicky", "char_vicky.jpg"], ["Vincent", "char_vincent.jpg"],
  ["Violet", "char_violet.png"], ["Zoe", "char_zoe.jpeg"]
].map(([name, file]) => ({ name, file }));

const relations = [
  ["Luna", "Hope", "Δίδυμες"],
  ["Demarin", "Irene", "Αδελφές — η Irene είναι μεγαλύτερη"],
  ["Catherine", "Evaggelia", "Αδελφές — η Catherine είναι μεγαλύτερη"],
  ["Rino", "Pauline", "Αδέλφια — ο Rino είναι μεγαλύτερος"],
  ["Rino", "Billy", "Σύντροφοι"],
  ["Luna", "Vincent", "Σύντροφοι"],
  ["Hope", "Paul", "Σύντροφοι"],
  ["Tony", "Ian", "Σύντροφοι"]
];

const movieTitles = ["", "THE BEGINNING", "THE SEQUEL", "FINAL CHAPTER"];
const motives = [
  "Εκδίκηση", "Οικογενειακό μυστικό", "Το περιστατικό που θάφτηκε",
  "Εμμονή", "Ζήλια", "Συγκάλυψη", "Δόξα και notoriety", "Χειραγώγηση"
];
const movieWorlds = {
  1: {
    asset: "assets/locations/movie-1-atlas.webp",
    rooms: [
      { name: "Το γυάλινο foyer", hint: "Η βροχή έχει σβήσει τα ίχνη έξω από τη σπασμένη πόρτα.", position: "0% 0%" },
      { name: "Το υπόγειο πλυντήριο", hint: "Ο ηλεκτρικός πίνακας έκλεισε από ανθρώπινο χέρι.", position: "100% 0%" },
      { name: "Το πνιγμένο θερμοκήπιο", hint: "Κάποιος έκρυψε ένα δεύτερο κινητό κάτω από τις γλάστρες.", position: "0% 100%" },
      { name: "Η προβλήτα της λίμνης", hint: "Ένα σκοινί κόπηκε καθαρά λίγα λεπτά πριν τη θύελλα.", position: "100% 100%" }
    ]
  },
  2: {
    asset: "assets/locations/movie-2-atlas.webp",
    rooms: [
      { name: "Το πανεπιστημιακό film archive", hint: "Έξι frames λείπουν ακριβώς πριν από τον πρώτο φόνο.", position: "0% 0%" },
      { name: "Η νεκρή αίθουσα προβολής", hint: "Ο προβολέας άναψε μόνος του στις 01:13.", position: "100% 0%" },
      { name: "Ο neon διάδρομος του motel", hint: "Μια βρεγμένη κάρτα δωματίου δεν ανήκει σε κανέναν από το cast.", position: "0% 100%" },
      { name: "Το service basement του νοσοκομείου", hint: "Το ασανσέρ κλήθηκε από όροφο που έχει σφραγιστεί.", position: "100% 100%" }
    ]
  },
  3: {
    asset: "assets/locations/movie-3-atlas.webp",
    rooms: [
      { name: "Η καμένη αίθουσα χορού", hint: "Στην τέφρα υπάρχει ένα φρέσκο αποτύπωμα που δεν έπρεπε να υπάρχει.", position: "0% 0%" },
      { name: "Το παρεκκλήσι στη χιονοθύελλα", hint: "Το κερί άναψε πριν φτάσει οποιοσδήποτε επιζών.", position: "100% 0%" },
      { name: "Το υπόγειο projection vault", hint: "Μια παλιά μπομπίνα περιέχει πλάνο από φόνο που δεν γυρίστηκε ποτέ.", position: "0% 100%" },
      { name: "Ο πύργος μετάδοσης", hint: "Το τελευταίο τηλεφώνημα εκπέμφθηκε από την κορυφή.", position: "100% 100%" }
    ]
  }
};

const survivalItems = {
  1: ["spare key", "φακό με μία μπαταρία", "κλειδί του speedboat"],
  2: ["emergency pass", "φορητό ασύρματο", "master key του motel"],
  3: ["bolt cutter", "flare gun", "κάρτα του projection vault"]
};

const openingIncidents = [
  { eyebrow: "SECURITY FEED 04", title: "Μία κάμερα δείχνει κάποιον που δεν είναι στο cast.", event: "το security feed παγώνει σε ένα άδειο δωμάτιο και μια φιγούρα περνάει μόνο στο reflection" },
  { eyebrow: "THE PROJECTOR STARTS", title: "Η προβολή αρχίζει χωρίς χειριστή.", event: "ο projector παίζει πλάνο του κτιρίου τραβηγμένο πριν από λίγα δευτερόλεπτα" },
  { eyebrow: "FALSE FIRE ALARM", title: "Ο συναγερμός χωρίζει τους πάντες.", event: "οι πόρτες πυρασφάλειας κλειδώνουν σε διαφορετικές πτέρυγες" },
  { eyebrow: "ELEVATOR CAMERA", title: "Το ασανσέρ σταματά σε σφραγισμένο όροφο.", event: "η εσωτερική κάμερα δείχνει τα φώτα να σβήνουν ένα-ένα" },
  { eyebrow: "RADIO INTERRUPTION", title: "Το αυτοκίνητο μιλάει με τη φωνή ενός νεκρού.", event: "το ραδιόφωνο διακόπτει τη μουσική με μια παλιά ηχογράφηση που κανείς δεν έπρεπε να έχει" },
  { eyebrow: "LIVE STREAM", title: "Το stream έχει θεατή μέσα στο ίδιο δωμάτιο.", event: "τα σχόλια περιγράφουν κινήσεις που δεν έχουν συμβεί ακόμη" },
  { eyebrow: "MOTION DETECTED", title: "Οι αισθητήρες σχηματίζουν έναν διάδρομο.", event: "κάθε sensor ανάβει διαδοχικά προς το μέρος των δύο θυμάτων" },
  { eyebrow: "BACKSTAGE LOCKDOWN", title: "Η πόρτα του backstage κλειδώνει από μέσα.", event: "ένα μεταλλικό χτύπημα ακούγεται πίσω από τον καθρέφτη του καμαρινιού" },
  { eyebrow: "GENERATOR FAILURE", title: "Το εφεδρικό ρεύμα τροφοδοτεί μόνο ένα δωμάτιο.", event: "όλο το κτίριο βυθίζεται στο σκοτάδι εκτός από μια κόκκινη έξοδο" },
  { eyebrow: "A PACKAGE ARRIVES", title: "Το δέμα περιέχει πλάνο από το επόμενο λεπτό.", event: "μια Polaroid δείχνει τα δύο θύματα σε θέση που δεν έχουν πάρει ακόμη" }
];

const openingComplications = [
  "Η καταιγίδα έχει κόψει τον κεντρικό δρόμο.", "Κάποιος έχει απενεργοποιήσει όλες τις εξωτερικές κλειδαριές.",
  "Το υπόλοιπο cast πιστεύει ότι πρόκειται για prank.", "Η αστυνομία βρίσκεται σαράντα λεπτά μακριά.",
  "Ένα δεύτερο σήμα δίνει εντελώς αντίθετη πληροφορία.", "Ο ένας από τους δύο αρνείται να εγκαταλείψει τον χώρο.",
  "Οι κάμερες δείχνουν timestamp από αύριο.", "Υπάρχει μόνο μία ασφαλής διαδρομή και κλείνει.",
  "Η μουσική καλύπτει κάθε κραυγή στο main hall.", "Κάποιος από το group έχει ήδη μετακινήσει το μοναδικό όχημα."
];

const openingActions = {
  protect: ["Κλείδωσε τη ζώνη και σβήσε όλα τα φώτα.", "Στείλε τους δύο σε διαφορετικές κρυψώνες.", "Άνοιξε το emergency protocol από απόσταση.", "Πες τους να σπάσουν το παράθυρο της υπηρεσίας.", "Κλείσε τις πυράντοχες πόρτες γύρω τους.", "Οδήγησέ τους μέσα από τις κάμερες.", "Κόψε το ρεύμα πριν φτάσει η φιγούρα.", "Ενεργοποίησε το silent alarm.", "Στείλε τους στο πιο κοντινό panic room.", "Χρησιμοποίησε τα ηχεία για αντιπερισπασμό."],
  authority: ["Ειδοποίησε την αστυνομία και κράτησε ανοιχτό το feed.", "Στείλε live εικόνα στις αρχές.", "Τράβηξε τον συναγερμό εκκένωσης.", "Κάλεσε security από τον κρυφό ασύρματο.", "Ενεργοποίησε όλα τα φώτα έκτακτης ανάγκης.", "Κλείδωσε το κτίριο και περίμενε ενισχύσεις.", "Στείλε το GPS των δύο θυμάτων.", "Ζήτησε από το group να καλύψει τις εξόδους.", "Άνοιξε τις σειρήνες για να τρομάξεις τον εισβολέα.", "Κατέγραψε το feed πριν καλέσεις βοήθεια."],
  intervene: ["Τρέξε εκεί μόνος/η από τη συντομότερη διαδρομή.", "Πάρε το αυτοκίνητο και χτύπα την πίσω είσοδο.", "Μπες από το service tunnel.", "Ακολούθησε τη φιγούρα αντί να προειδοποιήσεις τους άλλους.", "Πάρε έναν φακό και κατέβα στο σκοτάδι.", "Σπάσε την κλειδωμένη πόρτα πριν κλείσει η έξοδος.", "Ανέβα στην οροφή και πέρασε από τον αεραγωγό.", "Πήγαινε προς την κραυγή χωρίς backup.", "Χρησιμοποίησε τη μυστική διαδρομή του χάρτη.", "Παράτα το group και μπες στο επικίνδυνο δωμάτιο."]
};

const roomZones = {
  1: [
    ["Atrium της βροχής", "Διάδρομος των ξενώνων", "Σπασμένο wet bar", "Βόρεια βεράντα", "Γυάλινη σκάλα", "Κλειστό cloakroom", "Πίσω σαλόνι", "Δωμάτιο με τα πορτρέτα", "Μπαλκόνι της λίμνης", "Κρυφό office"],
    ["Boiler cage", "Laundry aisle", "Service stairs", "Fuse room", "Wine storage", "Generator bay", "Concrete shower", "Maintenance tunnel", "Cold pantry", "Flooded corridor"],
    ["Moonlit greenhouse", "Seed archive", "Overgrown potting room", "Glass walkway", "Orchid chamber", "Irrigation control", "Tool alcove", "Fogged conservatory", "North planting bed", "Collapsed arbor"],
    ["Storm dock", "Boathouse loft", "Fuel shed", "Rope platform", "Lakeside stairs", "Abandoned rowboat", "Signal cabin", "Fishing deck", "Under-dock crawlspace", "Flooded pier"]
  ],
  2: [
    ["Reel archive A", "Editing vault", "Negative storage", "Sound booth", "Censorship room", "Loading stacks", "Restoration lab", "Microfilm aisle", "Locked catalog", "Archive office"],
    ["Grand auditorium", "Projection booth", "Balcony row", "Backstage fly loft", "Orchestra pit", "Dressing corridor", "Prop room", "Ticket lobby", "Red curtain wing", "Emergency exit maze"],
    ["Motel east wing", "Room 17", "Vending alcove", "Neon stairwell", "Ice-machine corner", "Manager office", "Pool passage", "Laundry annex", "Parking overlook", "Roof access"],
    ["Hospital service floor", "Broken elevator", "Sterile storage", "Pipe gallery", "Old morgue hall", "Ambulance bay", "Boiler ward", "Records cage", "Emergency tunnel", "Condemned theatre"]
  ],
  3: [
    ["Burned ballroom", "Ash gallery", "Collapsed music room", "Blackened foyer", "Ruined library", "Servants passage", "Fireplace vault", "West tower stairs", "Charred conservatory", "Moonlit courtyard"],
    ["Snow chapel nave", "Bell tower", "Frozen crypt", "Vestry passage", "Candle room", "Mountain cemetery", "Confessional aisle", "Organ loft", "Storm porch", "Buried cloister"],
    ["Projection vault", "Mastering bunker", "Tape labyrinth", "Analog control", "Hidden screening room", "Emergency generator", "Film incinerator", "Sound archive", "Red-light lab", "Sealed edit suite"],
    ["Satellite roof", "Antenna catwalk", "Transmission cabin", "Lightning platform", "Maintenance crane", "Signal tunnel", "Broadcast deck", "Service ladder", "Storm barrier", "Dawn helipad"]
  ]
};

function expandedRooms(number) {
  return movieWorlds[number].rooms.flatMap((base, baseIndex) => roomZones[number][baseIndex].map((name, zoneIndex) => ({
    ...base,
    name,
    hint: `${base.hint} Zone ${String(zoneIndex + 1).padStart(2, "0")}: η διάταξη αλλάζει σε κάθε canon.`,
    zoom: 202 + (zoneIndex % 5) * 5
  })));
}

function buildOpeningScenario(number, target, partner, random, excludedIds = []) {
  let scenarioId = Math.floor(random() * 100);
  while (excludedIds.includes(scenarioId + 1)) scenarioId = (scenarioId + 17) % 100;
  const incident = openingIncidents[scenarioId % openingIncidents.length];
  const complication = openingComplications[Math.floor(scenarioId / 10)];
  const actionIndex = (scenarioId + number * 3) % 10;
  return {
    id: scenarioId + 1,
    eyebrow: `${incident.eyebrow} · SCENARIO ${String(scenarioId + 1).padStart(3, "0")}`,
    title: incident.title,
    body: `Ο/Η ${target} και ο/η ${partner} έχουν απομονωθεί όταν ${incident.event}. ${complication} Έχεις μόνο μία κίνηση πριν χωριστούν.`,
    choices: [openingActions.protect[actionIndex], openingActions.authority[(actionIndex + 3) % 10], openingActions.intervene[(actionIndex + 6) % 10]],
    time: `${String(10 + Math.floor(random() * 2)).padStart(2, "0")}:${String(Math.floor(random() * 60)).padStart(2, "0")} PM`
  };
}
const featureCopy = [
  ["100 opening scenarios", "Κάθε movie τραβά έναν από 100 συνδυασμούς opening — όχι πάντα τηλέφωνο, όχι πάντα την ίδια παγίδα ή επιλογές."],
  ["Hidden relationship engine", "Trust, friendship, suspicion, fear, loyalty και knowledge αλλάζουν αθόρυβα τις σκηνές."],
  ["Real clues & red herrings", "Τα στοιχεία είναι αληθινά, αλλά η ερμηνεία τους μπορεί να σε οδηγήσει στον λάθος άνθρωπο."],
  ["120 room variants", "Τρία cinematic map atlases γίνονται 120 διαφορετικά sub-rooms, routes, clues και scene orders σε κάθε canon."],
  ["Accusation history", "Το παιχνίδι θυμάται την πρώτη, τη μεσαία και την τελική θεωρία σου και μετρά τι πρόβλεψες."],
  ["Legacy survivors", "Οι σημαντικές σχέσεις και οι επιζώντες επιστρέφουν. Οι πιο πιστοί δεν πετιούνται άδικα στο opening kill του sequel."],
  ["Movie III mastermind", "Μόνο στο Final Chapter υπάρχει πιθανότητα να κρύβεται ακριβώς ένας παλιός killer — ποτέ στο intro και ποτέ ως κανονικός χαρακτήρας."],
  ["Outcome-built credits", "Το outro μοντάρεται από το αποτέλεσμα: εσύ, οι φίλοι σου, οι killers και μετά όλο το cast."],
  ["Offline PWA", "Εγκαθίσταται σε Android και iOS, κρατά τα saves στη συσκευή και παίζει offline μετά την πρώτη φόρτωση."]
];

let saves = loadJSON(STORAGE_KEY, []);
let settings = loadJSON(SETTINGS_KEY, { sound: true });
let current = null;
let introTimer = null;
let creditTimer = null;
let deferredInstallPrompt = null;
let swRegistration = null;
let audioContext = null;

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function persistSaves() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saves));
}

function saveCurrent() {
  if (!current) return;
  current.updatedAt = Date.now();
  const index = saves.findIndex(save => save.id === current.id);
  if (index >= 0) saves[index] = current;
  else saves.unshift(current);
  saves = saves.slice(0, MAX_SAVES);
  persistSaves();
}

function character(name) { return roster.find(item => item.name === name); }
function imagePath(name) { return `assets/characters/${character(name)?.file || "char_billy.webp"}`; }
function allNames() { return roster.map(item => item.name); }

function mulberry32(seed) {
  return function random() {
    let value = seed += 0x6D2B79F5;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function shuffle(list, random = Math.random) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pick(list, random = Math.random) { return list[Math.floor(random() * list.length)]; }
function unique(list) { return [...new Set(list.filter(Boolean))]; }
function formatDate(timestamp) { return new Intl.DateTimeFormat("el-GR", { dateStyle: "medium" }).format(new Date(timestamp)); }
function movieLabel(number) { return `MOVIE ${["", "I", "II", "III"][number]}`; }

function el(tag, className = "", text = "") {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== "") node.textContent = text;
  return node;
}

function button(text, className, onClick, dataChoice = false) {
  const node = el("button", `btn ${className}`.trim(), text);
  node.type = "button";
  if (dataChoice) node.dataset.storyChoice = "true";
  node.addEventListener("click", onClick);
  return node;
}

function screen(extra = "") {
  stopTimers();
  app.textContent = "";
  const node = el("section", `screen ${extra}`.trim());
  app.append(node);
  window.scrollTo({ top: 0, behavior: "instant" });
  return node;
}

function stopTimers() {
  if (introTimer) clearInterval(introTimer);
  if (creditTimer) clearInterval(creditTimer);
  introTimer = null;
  creditTimer = null;
}

function stopMusic() {
  [introAudio, outroAudio].forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
}

function playMusic(audio, restart = true) {
  if (!settings.sound) return;
  if (restart) audio.currentTime = 0;
  audio.volume = .78;
  audio.play().catch(() => {});
}

function playSfx(kind) {
  if (!settings.sound) return;
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioContext;
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    const tone = (frequency, duration, type = "sine", volume = .06, delay = 0, endFrequency = null) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now + delay);
      if (endFrequency) oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + delay + duration);
      gain.gain.setValueAtTime(.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(volume, now + delay + .018);
      gain.gain.exponentialRampToValueAtTime(.0001, now + delay + duration);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(now + delay);
      oscillator.stop(now + delay + duration + .03);
    };
    if (kind === "slash") {
      tone(760, .22, "sawtooth", .045, 0, 70);
      tone(105, .34, "triangle", .05, .08, 42);
    } else if (kind === "impact") {
      tone(74, .55, "sine", .11, 0, 36);
      tone(42, .72, "triangle", .06, .04, 25);
    } else if (kind === "ring") {
      tone(680, .18, "sine", .045, 0);
      tone(820, .18, "sine", .035, .21);
      tone(680, .18, "sine", .045, .62);
      tone(820, .18, "sine", .035, .83);
    }
  } catch {}
}

function toast(message) {
  toastNode.textContent = message;
  toastNode.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => toastNode.classList.remove("show"), 2400);
}

function withTransition(callback) {
  playSfx("slash");
  transitionNode.classList.remove("play");
  void transitionNode.offsetWidth;
  transitionNode.classList.add("play");
  setTimeout(callback, 390);
}

function renderHome() {
  current = null;
  stopMusic();
  const root = screen();
  const content = el("div", "content home-layout");
  const copy = el("div");
  copy.append(el("p", "eyebrow", "YOUR CHOICES. THEIR BLOOD."));
  const title = el("h1", "display");
  title.append("Every save writes a ", el("em", "", "different ending."));
  copy.append(title, el("div", "rule"));
  copy.append(el("p", "lead", "Μια κινηματογραφική procedural slasher τριλογία. Διάλεξε ποιον εμπιστεύεσαι, διάβασε τα στοιχεία και ζήσε με ό,τι προκάλεσαν οι αποφάσεις σου."));
  const actions = el("div", "actions");
  actions.append(
    button(saves.length < MAX_SAVES ? "Νέα τριλογία" : "Νέα τριλογία — αντικατάσταση slot", "", renderProtagonist),
    button("Όλα τα features", "ghost", renderFeatures)
  );
  if (deferredInstallPrompt) actions.append(button("Εγκατάσταση εφαρμογής", "secondary", installApp));
  copy.append(actions);

  if (saves.length) {
    const savesWrap = el("div");
    savesWrap.append(el("p", "eyebrow", "YOUR UNIVERSES"));
    saves.forEach(save => {
      const card = el("article", "panel save-card");
      const meta = el("div", "save-meta");
      meta.append(el("span", "", save.completed ? "TRILOGY COMPLETE" : `${movieLabel(save.movieNumber)} · ${movieTitles[save.movieNumber]}`), el("span", "", formatDate(save.updatedAt || save.createdAt)));
      card.append(meta, el("h2", "save-name", `${save.protagonist}’s Cut`));
      const cardActions = el("div", "save-actions");
      cardActions.append(
        button(save.completed ? "Δες την τριλογία" : "Συνέχεια", "", () => loadUniverse(save.id)),
        button("Διαγραφή", "ghost", () => deleteUniverse(save.id))
      );
      card.append(cardActions);
      savesWrap.append(card);
    });
    copy.append(savesWrap);
  }

  const art = el("div", "home-art");
  const logo = el("img", "hero-logo");
  logo.src = "assets/brand/spirit-slasher-logo.png";
  logo.alt = "Spirit Slasher emblem";
  art.append(logo, el("div", "chapter-stamp", "THREE FILMS / ONE CANON"));
  content.append(copy, art);
  root.append(content);
}

function renderFeatures() {
  const root = screen();
  const content = el("div", "content");
  content.append(el("p", "eyebrow", "THE FULL EXPERIENCE"), el("h1", "headline", "Όλα όσα θυμάται η τριλογία."));
  content.append(el("p", "lead", "Δεν υπάρχουν απλώς τυχαίοι killers. Το παιχνίδι συνδέει σχέσεις, θεωρίες, στοιχεία, σωτηρίες και θανάτους μέχρι το τελευταίο reveal."));
  const grid = el("div", "feature-grid");
  featureCopy.forEach(([title, text], index) => {
    const card = el("article", "panel feature");
    card.append(el("b", "", String(index + 1).padStart(2, "0")), el("h3", "", title), el("p", "", text));
    grid.append(card);
  });
  content.append(grid);
  const actions = el("div", "actions");
  actions.append(button("Πίσω", "ghost", renderHome), button("Δημιούργησε το canon σου", "", renderProtagonist));
  content.append(actions);
  root.append(content);
}

function renderProtagonist() {
  const root = screen();
  const content = el("div", "content");
  const head = el("div", "section-head");
  const title = el("div");
  title.append(el("p", "eyebrow", "CASTING THE FINAL SURVIVOR"), el("h1", "headline", "Ποιος είσαι στην τριλογία;"));
  head.append(title, el("p", "section-copy", "Ο χαρακτήρας σου δεν μπορεί να γίνει killer ή θύμα. Οι προκαθορισμένες συγγένειες και σχέσεις παραμένουν canon."));
  content.append(head);
  const grid = el("div", "roster");
  roster.forEach(item => grid.append(characterButton(item.name, () => confirmProtagonist(item.name))));
  content.append(grid);
  const actions = el("div", "actions");
  actions.append(button("Πίσω", "ghost", renderHome));
  content.append(actions);
  root.append(content);
}

function characterButton(name, onClick, selected = false, extraClass = "") {
  const card = el("button", `character-card ${selected ? "selected" : ""} ${extraClass}`.trim());
  card.type = "button";
  const img = el("img");
  img.src = imagePath(name);
  img.alt = name;
  img.loading = "lazy";
  card.append(img, el("span", "", name));
  card.addEventListener("click", onClick);
  return card;
}

function confirmProtagonist(name) {
  const root = screen();
  const content = el("div", "content narrow");
  content.append(el("p", "eyebrow", "STARRING"), el("h1", "display", name), el("p", "lead", `${name} — You. Από εδώ και πέρα, η τριλογία θα θυμάται κάθε άνθρωπο που εμπιστεύτηκες και κάθε άνθρωπο που δεν κατάφερες να σώσεις.`));
  const relationList = relations.filter(row => row.includes(name));
  if (relationList.length) {
    const notebook = el("div", "notebook");
    relationList.forEach(([a, b, type]) => {
      const other = a === name ? b : a;
      const card = el("article", "panel clue");
      card.append(el("small", "", "CANON RELATIONSHIP"), el("h3", "", other), el("p", "", type));
      notebook.append(card);
    });
    content.append(notebook);
  }
  const actions = el("div", "actions");
  actions.append(button("Έναρξη Movie I", "", () => createUniverse(name)), button("Άλλος χαρακτήρας", "ghost", renderProtagonist));
  content.append(actions);
  root.append(content);
}

function createUniverse(protagonist) {
  if (saves.length >= MAX_SAVES) {
    const oldest = [...saves].sort((a, b) => (a.updatedAt || 0) - (b.updatedAt || 0))[0];
    if (!confirm(`Έχεις ήδη ${MAX_SAVES} universes. Να αντικατασταθεί το παλαιότερο (${oldest.protagonist}’s Cut);`)) return;
    saves = saves.filter(save => save.id !== oldest.id);
  }
  const seed = (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) >>> 0;
  current = {
    id: `cut-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    seed,
    protagonist,
    movieNumber: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completed: false,
    history: [],
    relationships: Object.fromEntries(allNames().map(name => [name, {
      trust: name === protagonist ? 100 : 0,
      friendship: name === protagonist ? 100 : 0,
      suspicion: 0, fear: 0, loyalty: 0, knowledge: 0
    }])),
    movie: null
  };
  relations.forEach(([a, b]) => {
    if (a === protagonist && current.relationships[b]) Object.assign(current.relationships[b], { trust: 30, friendship: 42, loyalty: 34 });
    if (b === protagonist && current.relationships[a]) Object.assign(current.relationships[a], { trust: 30, friendship: 42, loyalty: 34 });
  });
  startMovie(1);
}

function loadUniverse(id) {
  current = saves.find(save => save.id === id);
  if (!current) return renderHome();
  if (current.completed) return renderTrilogyArchive();
  if (!current.movie) return startMovie(current.movieNumber || 1);
  const movie = current.movie;
  const world = movieWorlds[movie.number];
  movie.rooms ||= [...world.rooms];
  movie.worldAsset ||= world.asset;
  movie.survivalItem ||= survivalItems[movie.number][0];
  movie.protectedLegacy ||= [];
  movie.offscreenDeaths ||= [];
  movie.lateDeaths ||= [];
  movie.fatalityTarget ||= 4;
  movie.openingScenario ||= buildOpeningScenario(movie.number, movie.openingTarget, movie.openingPartner, mulberry32((current.seed + movie.number * 331) >>> 0));
  movie.pendingBeat ||= null;
  movie.pendingNextStage ||= null;
  Object.entries(movie.status || {}).forEach(([name, status]) => {
    if (status === "PRESUMED DEAD" && !(movie.killers || []).includes(name)) movie.status[name] = "DEAD";
  });
  renderMovie();
}

function deleteUniverse(id) {
  const save = saves.find(item => item.id === id);
  if (!save || !confirm(`Να διαγραφεί οριστικά το ${save.protagonist}’s Cut;`)) return;
  saves = saves.filter(item => item.id !== id);
  persistSaves();
  renderHome();
}

function linkedNames(name) {
  return relations.filter(([a, b]) => a === name || b === name).map(([a, b]) => a === name ? b : a);
}

function startMovie(number) {
  current.movieNumber = number;
  current.movie = generateMovie(number);
  saveCurrent();
  if (number === 3 && current.history.length) renderRecap();
  else playCastIntro();
}

function generateMovie(number) {
  const random = mulberry32((current.seed + number * 9973 + current.history.length * 1117) >>> 0);
  const protagonist = current.protagonist;
  const oldKillers = unique(current.history.flatMap(movie => movie.killers || [])).filter(name => name !== protagonist);
  const confirmedDead = new Set(unique(current.history.flatMap(record => [
    ...(record.killers || []),
    ...Object.entries(record.statuses || {}).filter(([, status]) => status === "DEAD").map(([name]) => name)
  ])));
  const priorSurvivors = number === 1 ? [] : unique(current.history.at(-1)?.survivors || [])
    .filter(name => name !== protagonist && !confirmedDead.has(name));
  const legacyPriority = unique([...linkedNames(protagonist), ...priorSurvivors])
    .filter(name => !confirmedDead.has(name));
  const desired = number === 1 ? 11 : 12;
  const seenBefore = new Set(current.history.flatMap(record => record.cast || []));
  const returningLimit = number === 2 ? 3 : number === 3 ? 4 : 0;
  const returningSurvivors = shuffle(legacyPriority, random).slice(0, returningLimit);
  const newcomers = shuffle(allNames().filter(name => name !== protagonist && !seenBefore.has(name) && !confirmedDead.has(name)), random);
  const otherLiving = shuffle(allNames().filter(name => name !== protagonist && !confirmedDead.has(name) && !returningSurvivors.includes(name) && !newcomers.includes(name)), random);
  let cast = unique([protagonist, ...returningSurvivors, ...newcomers, ...otherLiving]).slice(0, desired);

  let returningKiller = null;
  let killerCount;
  if (number === 3) {
    const roll = random();
    if (roll >= .66 && oldKillers.length) {
      returningKiller = pick(oldKillers, random);
      killerCount = 1;
    } else if (roll >= .33) killerCount = random() < .5 ? 2 : 3;
    else killerCount = 1;
  } else {
    const roll = random();
    killerCount = roll < .10 ? 1 : roll < .79 ? 2 : roll < .99 ? 3 : 4;
  }

  if (returningKiller && cast.includes(returningKiller)) {
    cast = cast.filter(name => name !== returningKiller);
    const replacement = shuffle(allNames().filter(name => !cast.includes(name) && name !== returningKiller), random)[0];
    if (replacement) cast.push(replacement);
  }

  let eligibleKillers = shuffle(cast.filter(name => name !== protagonist), random);
  if (number === 3 && !returningKiller) {
    const wronglyAccusedBefore = unique(current.history.flatMap(record => record.wronglyAccused || []));
    const legacyFriends = unique(current.history.flatMap(record => record.friends || []));
    const historyShapedCandidates = unique([...wronglyAccusedBefore, ...legacyFriends])
      .filter(name => cast.includes(name) && name !== protagonist);
    eligibleKillers = unique([...shuffle(historyShapedCandidates, random), ...eligibleKillers]);
  }
  const killers = returningKiller ? [returningKiller] : eligibleKillers.slice(0, killerCount);
  const victims = cast.filter(name => name !== protagonist && !killers.includes(name));
  const previousRecord = current.history.at(-1);
  const protectedLegacy = number > 1 ? unique([
    previousRecord?.closestFriend,
    previousRecord?.mostTrusted,
    ...priorSurvivors.filter(name => (current.relationships[name]?.loyalty || 0) >= 20)
  ]).filter(name => victims.includes(name)) : [];
  const openingPool = victims.filter(name => !protectedLegacy.includes(name));
  const safeOpeningPool = openingPool.length >= 2 ? openingPool : victims;
  const openingTarget = pick(safeOpeningPool, random);
  const openingPartner = pick(safeOpeningPool.filter(name => name !== openingTarget), random);
  const remainingVictims = victims.filter(name => ![openingTarget, openingPartner].includes(name));
  const dangerA = pick(remainingVictims, random);
  const dangerB = pick(remainingVictims.filter(name => name !== dangerA), random);
  const secondTarget = pick(remainingVictims.filter(name => ![dangerA, dangerB].includes(name)), random);
  const innocent = pick(cast.filter(name => name !== protagonist && !killers.includes(name)), random);
  const secretHolder = pick(cast.filter(name => name !== protagonist && name !== innocent), random);
  const mainKiller = killers[0];
  const shuffledFriends = shuffle(cast.filter(name => name !== protagonist), random);
  const friendOptions = [shuffledFriends.slice(0, 3), shuffledFriends.slice(3, 6), shuffledFriends.slice(6, 9)];
  const world = movieWorlds[number];
  const rooms = shuffle(expandedRooms(number), random).slice(0, 12);
  const locationChoices = rooms.slice(0, 3).map(room => [room.name, room.hint]);
  const openingScenario = buildOpeningScenario(number, openingTarget, openingPartner, random, current.history.map(record => record.openingScenarioId));
  const fatalityTarget = number === 1 ? 3 + Math.floor(random() * 3) : 3 + Math.floor(random() * 4);
  const cluePool = [
    pick([
      { type: "REAL CLUE", title: `${mainKiller}: το δεύτερο τηλέφωνο`, text: `Το burner phone ενεργοποιήθηκε κοντά στο σπίτι του/της ${mainKiller}, τέσσερα λεπτά πριν από την επίθεση.` },
      { type: "REAL CLUE", title: `${mainKiller}: το κλειδί του projector`, text: `Το μοναδικό κλειδί του projection booth βρέθηκε σε σακάκι που φόρεσε ο/η ${mainKiller}.` },
      { type: "REAL CLUE", title: `${mainKiller}: το σβησμένο frame`, text: `Στο χαμένο frame φαίνεται καθαρά η αντανάκλαση του/της ${mainKiller} πριν χτυπήσει ο συναγερμός.` },
      { type: "REAL CLUE", title: `${mainKiller}: η κρυφή διαδρομή`, text: `Μόνο ο/η ${mainKiller} γνώριζε τον κωδικό της διαδρομής που χρησιμοποίησε η μάσκα.` },
      { type: "REAL CLUE", title: `${mainKiller}: το ίχνος στο archive`, text: `Η πρόσβαση στο κλειδωμένο archive έγινε με προσωπικό token του/της ${mainKiller}.` }
    ], random),
    pick([
      { type: "RED HERRING", title: `${innocent}: αίμα στο αυτοκίνητο`, text: `Το αίμα ανήκει στο προηγούμενο θύμα, αλλά ο/η ${innocent} καθάρισε το αυτοκίνητο πριν φτάσει η αστυνομία.` },
      { type: "RED HERRING", title: `${innocent}: η σκισμένη μάσκα`, text: `Το ύφασμα ταιριάζει στα ρούχα του/της ${innocent}, επειδή το θύμα τα είχε δανειστεί νωρίτερα.` },
      { type: "RED HERRING", title: `${innocent}: το ψεύτικο άλλοθι`, text: `Ο/Η ${innocent} είπε ψέματα για το πού βρισκόταν — αλλά έκρυβε κάτι άσχετο με τους φόνους.` },
      { type: "RED HERRING", title: `${innocent}: το ματωμένο εισιτήριο`, text: `Το εισιτήριο βρέθηκε στη σκηνή, όμως το είχε κλέψει το πρώτο θύμα ώρες πριν.` },
      { type: "RED HERRING", title: `${innocent}: η ηχογράφηση`, text: `Η φωνή μοιάζει με του/της ${innocent}, αλλά το αρχείο έχει μονταριστεί από τρία παλιότερα clips.` }
    ], random),
    pick([
      { type: "CHARACTER SECRET", title: `${secretHolder}: σβησμένα μηνύματα`, text: `Ο/Η ${secretHolder} είχε κανονίσει μυστική συνάντηση και έσβησε όλη τη συνομιλία.` },
      { type: "CHARACTER SECRET", title: `${secretHolder}: κρυφό χρέος`, text: `Ο/Η ${secretHolder} έκρυβε μια συμφωνία που θα κατέστρεφε τη σχέση του/της με το group.` },
      { type: "CHARACTER SECRET", title: `${secretHolder}: δεύτερη ταυτότητα`, text: `Ένα παλιό badge δείχνει ότι ο/η ${secretHolder} εργαζόταν εδώ με άλλο όνομα.` },
      { type: "CHARACTER SECRET", title: `${secretHolder}: το κλεμμένο footage`, text: `Ο/Η ${secretHolder} είχε αντιγράψει ιδιωτικό footage για δικό του/της σκοπό, όχι για τον killer.` },
      { type: "CHARACTER SECRET", title: `${secretHolder}: η μυστική έξοδος`, text: `Ο/Η ${secretHolder} γνώριζε μια έξοδο αλλά την έκρυβε για να προστατεύσει κάποιον άλλο.` }
    ], random)
  ];
  const locationClues = Object.fromEntries(locationChoices.map((location, index) => [location[0], cluePool[index]]));
  const status = Object.fromEntries(unique([...cast, ...killers]).map(name => [name, "ALIVE"]));
  const historicalChoice = current.history.flatMap(movie => movie.pivotal || [])[0];
  let motive = pick(motives, random);
  let motiveLine = `Όλα οδηγούν σε εσένα, ${protagonist}. Όχι επειδή τα ξεκίνησες — επειδή ήσουν πάντα το τέλος.`;
  if (number === 3 && returningKiller) {
    motive = "Επιστροφή για εκδίκηση";
    motiveLine = `Με είδες να πέφτω και έγραψες το τέλος μου. Εγώ έγραφα το δικό σου.`;
  } else if (number === 3 && historicalChoice) {
    motive = "Η επιλογή που δεν ξεχάστηκε";
    motiveLine = `Δεν θυμάσαι καν την επιλογή «${historicalChoice}», έτσι; Εγώ τη θυμόμουν κάθε μέρα.`;
  }

  return {
    number, title: movieTitles[number], stage: 0, cast, introCast: cast.filter(name => name !== returningKiller),
    killers, returningKiller, mainKiller, motive, motiveLine, status,
    openingTarget, openingPartner, dangerA, dangerB, secondTarget,
    friendOptions, friends: [], keyHolder: null, survivalItem: pick(survivalItems[number], random),
    locationChoices, locationClues, rooms, worldAsset: world.asset, protectedLegacy, fatalityTarget, openingScenario,
    cluesFound: [], choices: [], firstSuspicion: [], midpointTheory: [], finalTheory: [], pendingTheory: [],
    stageResult: null, saved: [], offscreenDeaths: [], lateDeaths: [], deathsPrevented: 0, peopleSaved: 0,
    sceneIndex: 0, completed: false, recordCreated: false, pendingBeat: null, pendingNextStage: null
  };
}

function remember(text, consequence = "") {
  const movie = current.movie;
  movie.choices.push({ text, consequence, stage: movie.stage });
  saveCurrent();
}

function setStatus(name, status) {
  const movie = current.movie;
  if (!name || name === current.protagonist) return;
  movie.status[name] = status;
}

function isAlive(name) { return current.movie.status[name] === "ALIVE" || current.movie.status[name] === "SAVED"; }
function isKiller(name) { return current.movie.killers.includes(name); }

function renderRecap() {
  stopMusic();
  const root = screen();
  const content = el("div", "content narrow");
  content.append(el("p", "eyebrow", "PREVIOUSLY…"), el("h1", "display", "Your canon remembers."));
  const list = el("div", "recap-list");
  const lines = [];
  current.history.forEach(record => {
    const closest = record.friends?.[0] || record.survivors.find(name => name !== current.protagonist) || "κανέναν";
    lines.push(`Στο ${movieLabel(record.number)}, εμπιστεύτηκες τον/την ${closest}.`);
    if (record.saved?.length) lines.push(`Έσωσες: ${record.saved.join(", ")}.`);
    if (record.wronglyAccused?.length) lines.push(`Υποψιάστηκες άδικα: ${record.wronglyAccused.join(", ")}.`);
    lines.push(`${record.killers.join(" & ")} ${record.killers.length > 1 ? "αποκαλύφθηκαν" : "αποκαλύφθηκε"} ως killer.`);
    lines.push(`${record.survivors.length} επέζησαν.`);
  });
  lines.push("Δύο χρόνια αργότερα, το τηλέφωνο χτύπησε ξανά…");
  lines.slice(-8).forEach((text, index) => {
    const line = el("div", "recap-line");
    line.style.animationDelay = `${index * .18}s`;
    line.append(el("span", "", String(index + 1).padStart(2, "0")), el("p", "", text));
    list.append(line);
  });
  content.append(list);
  const actions = el("div", "actions");
  actions.append(button("Παίξε το Final Chapter", "", playCastIntro));
  content.append(actions);
  root.append(content);
}

function playCastIntro() {
  stopTimers();
  stopMusic();
  const movie = current.movie;
  let index = 0;
  const overlay = el("section", "cast-intro");
  const skip = el("button", "skip", "Skip intro");
  skip.type = "button";
  skip.addEventListener("click", finishCastIntro);
  document.body.append(overlay, skip);
  playMusic(introAudio);

  function showCredit() {
    const name = movie.introCast[index];
    overlay.textContent = "";
    const backdrop = el("div", "cast-backdrop");
    const img = el("img");
    img.src = imagePath(name);
    img.alt = "";
    backdrop.append(img);
    const copy = el("div", "cast-title");
    const label = name === current.protagonist ? "STARRING · YOU" : index < 4 ? "ALSO STARRING" : "WITH";
    copy.append(el("div", "credit", label), el("h1", "", name), el("p", "", `${movieLabel(movie.number)} · ${movie.title}`));
    overlay.append(backdrop, copy);
    index += 1;
    if (index >= movie.introCast.length) {
      clearInterval(introTimer);
      introTimer = setTimeout(finishCastIntro, 1850);
    }
  }

  function finishCastIntro() {
    stopTimers();
    introAudio.pause();
    overlay.remove();
    skip.remove();
    movie.stage = Math.max(1, movie.stage);
    saveCurrent();
    renderMovie();
  }

  window.finishCastIntro = finishCastIntro;
  showCredit();
  introTimer = setInterval(showCredit, 1650);
}

function renderMovie() {
  const movie = current.movie;
  if (!movie) return startMovie(current.movieNumber || 1);
  if (movie.pendingBeat) return renderCinematicBeat();
  if (movie.stage === 0) return playCastIntro();
  const renderers = {
    1: renderOpening,
    2: renderFriendChoice,
    3: renderKeyChoice,
    4: renderInvestigation,
    5: renderDanger,
    6: () => renderAccusation("midpoint"),
    7: renderTrustScene,
    8: renderSecondAttack,
    9: () => renderAccusation("final"),
    10: renderReveal,
    11: renderFinale,
    12: renderMovieReport
  };
  (renderers[movie.stage] || renderOpening)();
}

function movieScreen(sceneName, progress) {
  const root = screen("movie-shell");
  const content = el("div", "content");
  const top = el("div", "movie-topline");
  const bar = el("div", "progress");
  const fill = el("span");
  fill.style.setProperty("--progress", `${progress}%`);
  fill.style.width = `${progress}%`;
  bar.append(fill);
  top.append(el("span", "", `${movieLabel(current.movie.number)} · ${current.movie.title}`), bar, el("span", "", sceneName));
  content.append(top);
  root.append(content);
  return content;
}

function roomFor(offset = 0) {
  const movie = current.movie;
  const rooms = movie.rooms?.length ? movie.rooms : movieWorlds[movie.number].rooms;
  return rooms[(Math.max(0, movie.stage - 1) + offset) % rooms.length];
}

function paintRoom(node, room = roomFor()) {
  const movie = current.movie;
  node.style.backgroundImage = `linear-gradient(180deg, rgba(4, 4, 7, .05), rgba(4, 4, 7, .72)), url("${movie.worldAsset || movieWorlds[movie.number].asset}")`;
  node.style.backgroundPosition = room?.position || "center";
  return node;
}

function scenePanel({ name, time, image, room = roomFor(), tone = "", eyebrow, title, body, choices = [] }) {
  const scene = el("article", "panel scene");
  const visual = paintRoom(el("div", `scene-visual room-shot ${tone}`.trim()), room);
  const portrait = el("div", "speaker-portrait");
  const img = el("img");
  img.src = imagePath(image);
  img.alt = name;
  portrait.append(img);
  visual.append(portrait, el("span", "timecode", time));
  const caption = el("div", "visual-caption");
  caption.append(el("strong", "", name), el("small", "", room?.name || "EVERYONE HAS SOMETHING TO HIDE"));
  visual.append(caption);
  const copy = el("div", "scene-copy");
  copy.append(el("p", "eyebrow dialogue-in", eyebrow), el("h1", "headline dialogue-in", title), el("p", "dialogue-line dialogue-in", body));
  const list = el("div", "choice-list");
  choices.forEach((choice, index) => {
    const item = el("button", "choice");
    item.type = "button";
    item.dataset.storyChoice = "true";
    item.append(el("b", "", String.fromCharCode(65 + index)), el("span", "", choice.label));
    item.addEventListener("click", choice.action);
    list.append(item);
  });
  copy.append(list);
  scene.append(visual, copy);
  return scene;
}

function queueBeat(beat, nextStage) {
  current.movie.pendingBeat = beat;
  current.movie.pendingNextStage = nextStage;
  saveCurrent();
  withTransition(renderCinematicBeat);
}

function renderCinematicBeat() {
  const movie = current.movie;
  const beat = movie.pendingBeat;
  if (!beat) return renderMovie();
  stopTimers();
  if (beat.kind === "death" || beat.kind === "attack") {
    playSfx("impact");
    navigator.vibrate?.([90, 55, 150]);
  }
  const root = screen(`beat-screen ${beat.kind || "action"}`);
  const room = beat.room || roomFor(beat.roomOffset || 0);
  const backdrop = paintRoom(el("div", "beat-backdrop"), room);
  backdrop.append(el("span", "film-grain"));
  const content = el("div", "beat-content");
  content.append(el("p", "eyebrow beat-kicker", beat.eyebrow || "THE NIGHT CHANGES"), el("h1", "display beat-title", beat.title), el("p", "lead beat-body", beat.body));
  if (beat.names?.length) {
    const row = el("div", "beat-cast");
    beat.names.forEach((name, index) => {
      if (!character(name)) return;
      const card = el("article", "beat-person");
      const img = el("img"); img.src = imagePath(name); img.alt = name;
      const status = beat.statuses?.[index] || movie.status[name] || "ALIVE";
      card.append(img, el("strong", "", name), el("small", status === "DEAD" ? "CONFIRMED DEAD" : status));
      row.append(card);
    });
    content.append(row);
  }
  const actions = el("div", "actions");
  actions.append(button(beat.cta || "Συνέχεια", "", () => {
    const destination = movie.pendingNextStage;
    movie.pendingBeat = null;
    movie.pendingNextStage = null;
    if (destination === "credits") {
      saveCurrent();
      runCredits();
    } else advance(destination);
  }));
  content.append(actions);
  root.append(backdrop, content);
}

function advance(stage) {
  current.movie.stage = stage;
  current.movie.stageResult = null;
  saveCurrent();
  withTransition(renderMovie);
}

function renderOpening() {
  const movie = current.movie;
  if (!movie.ringPlayed) {
    movie.ringPlayed = true;
    playSfx(movie.openingScenario.id % 5 === 0 ? "ring" : "impact");
    navigator.vibrate?.(movie.openingScenario.id % 2 ? [80, 45, 120] : [60, 90, 60, 90, 110]);
    saveCurrent();
  }
  const content = movieScreen("OPENING SCENE", 8);
  const person = movie.openingTarget;
  const scenario = movie.openingScenario;
  content.append(scenePanel({
    name: person, time: scenario.time, image: person, tone: "red", eyebrow: scenario.eyebrow, title: scenario.title,
    body: scenario.body,
    choices: [
      { label: scenario.choices[0], action: () => openingChoice("warn") },
      { label: scenario.choices[1], action: () => openingChoice("police") },
      { label: scenario.choices[2], action: () => openingChoice("drive") }
    ]
  }));
}

function openingChoice(choice) {
  const movie = current.movie;
  let survivor;
  let victim;
  if (choice === "warn") {
    setStatus(movie.openingTarget, "SAVED");
    setStatus(movie.openingPartner, "DEAD");
    survivor = movie.openingTarget; victim = movie.openingPartner;
    movie.saved.push(movie.openingTarget); movie.peopleSaved += 1; movie.deathsPrevented += 1;
    remember(`Προειδοποίησες τον/την ${movie.openingTarget}.`, `${movie.openingTarget} survived; ${movie.openingPartner} died.`);
    toast(`${movie.openingTarget} will remember that.`);
  } else if (choice === "police") {
    setStatus(movie.openingTarget, "DEAD");
    setStatus(movie.openingPartner, "SAVED");
    survivor = movie.openingPartner; victim = movie.openingTarget;
    movie.saved.push(movie.openingPartner); movie.peopleSaved += 1;
    remember("Κάλεσες την αστυνομία.", `${movie.openingPartner} survived; ${movie.openingTarget} died.`);
  } else {
    setStatus(movie.openingTarget, "SAVED");
    setStatus(movie.openingPartner, "DEAD");
    survivor = movie.openingTarget; victim = movie.openingPartner;
    movie.saved.push(movie.openingTarget); movie.peopleSaved += 1; movie.deathsPrevented += 1;
    current.relationships[movie.openingTarget].trust += 10;
    remember(`Οδήγησες προς το εξοχικό.`, `${movie.openingTarget} survived; ${movie.openingPartner} became the opening kill.`);
    toast(`Έφτασες εγκαίρως για τον/την ${movie.openingTarget} — όχι για τον/την ${movie.openingPartner}.`);
  }
  rebuildFriendOptions();
  queueBeat({
    kind: "death",
    eyebrow: "OPENING KILL · CONFIRMED",
    title: `${victim} δεν τα κατάφερε.`,
    body: `Η επιλογή σου έσωσε τον/την ${survivor}, αλλά ο/η ${victim} βρέθηκε νεκρός/ή. Ο θάνατος είναι οριστικός και το υπόλοιπο cast το μαθαίνει τώρα.`,
    names: [survivor, victim], statuses: ["SAVED", "DEAD"], roomOffset: 1,
    cta: "Μπες στη νύχτα"
  }, 2);
}

function rebuildFriendOptions() {
  const movie = current.movie;
  const random = mulberry32((current.seed + movie.number * 1459 + 44) >>> 0);
  const available = shuffle(movie.cast.filter(name => name !== current.protagonist && isAlive(name)), random);
  movie.friendOptions = [available.slice(0, 3), available.slice(3, 6), available.slice(6, 9)].filter(group => group.length);
}

function renderFriendChoice() {
  const movie = current.movie;
  const gatherings = [
    ["THE SURVIVORS REGROUP", "Με ποιους θα κλειστείς απόψε;", "Οι ομάδες χωρίζονται ανάμεσα σε διαφορετικά δωμάτια. Κάποιοι συζητούν τον θάνατο· άλλοι ψάχνουν έξοδο."],
    ["A SCREENING WITHOUT A FILM", "Ποιον θέλεις δίπλα σου στο σκοτάδι;", "Ο projector ανάβει και όλοι αλλάζουν θέσεις. Η παρέα που θα διαλέξεις γίνεται το main group της νύχτας."],
    ["THE BUILDING SPLITS", "Ποιο group θα ακολουθήσεις;", "Τρεις διαδρομές ανοίγουν ταυτόχρονα. Όσοι δεν πάρεις μαζί σου συνεχίζουν μόνοι και μπορεί να μη γυρίσουν όλοι."],
    ["WHISPERS AFTER MIDNIGHT", "Ποιον πιστεύεις όταν όλοι λένε ψέματα;", "Οι επιζώντες ανταλλάσσουν διαφορετικές εκδοχές του opening. Η επιλογή παρέας χτίζει πίστη — και απομονώνει τους άλλους."],
    ["LOCKDOWN", "Διάλεξε ποιοι θα μπουν στο safe room.", "Ο χώρος δεν χωράει όλο το cast. Οι υπόλοιποι πρέπει να ψάξουν άλλη διαδρομή μέσα στον τυχαιοποιημένο χάρτη."]
  ];
  const gathering = gatherings[movie.openingScenario.id % gatherings.length];
  const content = movieScreen(gathering[0], 18);
  const root = el("div", "content");
  root.append(el("p", "eyebrow", gathering[0]), el("h1", "headline", gathering[1]), el("p", "lead", gathering[2]));
  const grid = el("div", "feature-grid");
  movie.friendOptions.forEach((group, index) => {
    const card = el("article", "panel feature");
    card.append(el("b", "", String.fromCharCode(65 + index)), el("h3", "", group.join(" · ")), el("p", "", index === 2 ? "Έξω, μακριά από τη μουσική." : "Στο σαλόνι, ανάμεσα στους υπόλοιπους."));
    const choose = button("Πήγαινε σε αυτούς", "ghost", () => chooseFriends(group), true);
    card.append(choose);
    grid.append(card);
  });
  root.append(grid);
  content.append(root);
}

function chooseFriends(group) {
  const movie = current.movie;
  movie.friends = [...group];
  group.forEach(name => {
    current.relationships[name].friendship += 24;
    current.relationships[name].trust += 12;
    current.relationships[name].loyalty += 10;
  });
  remember(`Διάλεξες να μείνεις με ${group.join(", ")}.`, "They became your core friend group.");
  const random = mulberry32((current.seed + movie.number * 7121 + movie.choices.length * 83) >>> 0);
  const extras = shuffle(movie.cast.filter(name => name !== current.protagonist && !group.includes(name) && !isKiller(name) && isAlive(name) && !(movie.protectedLegacy || []).includes(name) && !movie.saved.includes(name)), random);
  const deathRoll = random();
  const intensityCap = Math.max(0, Math.min(3, (movie.fatalityTarget || 4) - 2));
  const deathCount = deathRoll < .18 ? 0 : deathRoll < .58 ? 1 : deathRoll < .88 ? 2 : intensityCap;
  movie.offscreenDeaths = extras.slice(0, Math.min(deathCount, Math.max(0, extras.length - 2)));
  movie.offscreenDeaths.forEach(name => setStatus(name, "DEAD"));
  if (movie.offscreenDeaths.length) {
    remember(`Έμεινες με ${group.join(", ")} ενώ άλλοι χωρίστηκαν.`, `${movie.offscreenDeaths.join(" & ")} died away from the main group.`);
    queueBeat({
      kind: "death",
      eyebrow: "ELSEWHERE · DEATH REPORT",
      title: movie.offscreenDeaths.length === 1 ? "Μία φωνή λείπει από την παρέα." : "Δύο δωμάτια σίγησαν.",
      body: `Δεν τους διάλεξες για το main group. Λίγο αργότερα, μαθαίνετε καθαρά ότι ${movie.offscreenDeaths.join(" και ")} ${movie.offscreenDeaths.length === 1 ? "βρέθηκε νεκρός/ή" : "βρέθηκαν νεκροί"}. Οι υπόλοιποι ζουν — προς το παρόν.`,
      names: movie.offscreenDeaths, statuses: movie.offscreenDeaths.map(() => "DEAD"), roomOffset: 2,
      cta: "Μείνε με την ομάδα"
    }, 3);
  } else {
    queueBeat({
      kind: "dialogue",
      eyebrow: "THE INNER CIRCLE",
      title: `${group[0]} σού δίνει τον λόγο του/της.`,
      body: `Η ομάδα σχηματίστηκε: ${group.join(", ")}. Οι σχέσεις, η πίστη και όσα μοιραστείτε από εδώ και πέρα θα επιστρέψουν στις επόμενες ταινίες.`,
      names: group, statuses: group.map(() => "ALLY"), roomOffset: 1
    }, 3);
  }
}

function renderKeyChoice() {
  const movie = current.movie;
  const candidates = movie.friends.filter(isAlive);
  const focus = candidates[0] || movie.dangerA;
  const content = movieScreen("A QUIET MOMENT", 28);
  content.append(scenePanel({
    name: focus, time: "12:06 AM", image: focus, tone: "cold", eyebrow: "AN ORDINARY CHOICE", title: `Έχεις μόνο ένα ${movie.survivalItem}.`,
    body: "Μοιάζει ασήμαντο. Κανείς δεν ξέρει ακόμη ότι μια κλειδωμένη πόρτα μπορεί να γίνει η διαφορά ανάμεσα σε ζωή και θάνατο.",
    choices: [
      ...candidates.slice(0, 3).map(name => ({ label: `Δώσε το ${movie.survivalItem} στον/στην ${name}.`, action: () => giveKey(name) })),
      { label: `Κράτησε το ${movie.survivalItem}. Δεν εμπιστεύεσαι κανέναν αρκετά.`, action: () => giveKey(null) }
    ]
  }));
}

function giveKey(name) {
  const movie = current.movie;
  movie.keyHolder = name;
  if (name) {
    current.relationships[name].trust += 18;
    remember(`Έδωσες το ${movie.survivalItem} στον/στην ${name}.`, "The item may change a later death scene.");
  } else remember(`Κράτησες το ${movie.survivalItem}.`, "No one else could use it later.");
  queueBeat({
    kind: "action",
    eyebrow: "OBJECT IN PLAY",
    title: name ? `${name} παίρνει το ${movie.survivalItem}.` : `Το ${movie.survivalItem} μένει πάνω σου.`,
    body: name ? `Το αντικείμενο αλλάζει χέρια. Ο/Η ${name} θυμάται ότι τον/την εμπιστεύτηκες — και μπορεί να το χρησιμοποιήσει όταν εσύ δεν θα είσαι εκεί.` : "Κανείς άλλος δεν ξέρει ότι το έχεις. Η απόφαση μπορεί να κλειδώσει μια μελλοντική έξοδο.",
    names: name ? [name] : [current.protagonist], statuses: [name ? "TRUST +18" : "ITEM KEPT"], roomOffset: 1
  }, 4);
}

function renderInvestigation() {
  const movie = current.movie;
  const content = movieScreen("INVESTIGATION", 38);
  if (movie.stageResult?.kind === "clue") {
    const clue = movie.stageResult.clue;
    const wrap = el("div", "content narrow");
    wrap.append(el("p", "eyebrow", "CASE FILE · NEW EVIDENCE"), el("h1", "headline", clue.title), el("p", "lead", clue.text));
    const note = el("article", `panel clue ${clue.type === "REAL CLUE" ? "red" : ""}`);
    note.append(el("small", "", "EVIDENCE ADDED"), el("h3", "", movie.stageResult.location), el("p", "", "Το στοιχείο μπήκε στο προσωπικό σου case file. Το παιχνίδι δεν θα σου πει αν η ερμηνεία σου είναι σωστή."));
    wrap.append(note);
    const actions = el("div", "actions");
    actions.append(button("Συνέχεια", "", () => advance(5)));
    wrap.append(actions);
    content.append(wrap);
    return;
  }
  const wrap = el("div", "content");
  wrap.append(el("p", "eyebrow", "THREE PLACES · ONE CHANCE"), el("h1", "headline", "Πού θα ψάξεις πρώτα;"));
  const grid = el("div", "feature-grid");
  movie.locationChoices.forEach(([location, hint], index) => {
    const room = movie.rooms.find(item => item.name === location);
    const card = paintRoom(el("article", "panel feature location-card"), room);
    card.append(el("b", "", String(index + 1).padStart(2, "0")), el("h3", "", location), el("p", "", hint), button("Έρευνα", "ghost", () => findClue(location), true));
    grid.append(card);
  });
  wrap.append(grid);
  content.append(wrap);
}

function findClue(location) {
  const movie = current.movie;
  const clue = movie.locationClues[location];
  movie.cluesFound.push(clue);
  current.relationships[clue.title.split(":")[0]] && (current.relationships[clue.title.split(":")[0]].suspicion += 18);
  remember(`Έψαξες: ${location}.`, `Found ${clue.type}: ${clue.title}.`);
  queueBeat({
    kind: clue.type === "REAL CLUE" ? "clue" : "twist",
    eyebrow: `${clue.type} · CASE FILE UPDATED`,
    title: clue.title,
    body: `${clue.text} Το στοιχείο μπαίνει στο προσωπικό σου case file — αλλά η ερμηνεία του μπορεί ακόμη να σε οδηγήσει στον λάθος άνθρωπο.`,
    names: [clue.title.split(":")[0]], statuses: [clue.type],
    room: movie.rooms.find(item => item.name === location), cta: "Συνέχισε την έρευνα"
  }, 5);
}

function renderDanger() {
  const movie = current.movie;
  playSfx("impact");
  navigator.vibrate?.([80, 45, 120]);
  const content = movieScreen("THE FIRST ATTACK", 49);
  const leftRoom = roomFor(0);
  const rightRoom = roomFor(1);
  content.append(scenePanel({
    name: `${movie.dangerA} / ${movie.dangerB}`, time: "01:18 AM", image: movie.dangerA, tone: "red", eyebrow: "YOU CANNOT REACH BOTH", title: "Δύο κραυγές. Δύο διάδρομοι.",
    body: `Ο/Η ${movie.dangerA} είναι παγιδευμένος/η στο «${leftRoom.name}». Ο/Η ${movie.dangerB} τρέχει προς το «${rightRoom.name}». Πρέπει να διαλέξεις.`,
    choices: [
      { label: `Τρέξε στο «${leftRoom.name}» για τον/την ${movie.dangerA}.`, action: () => rescueChoice(movie.dangerA, movie.dangerB) },
      { label: `Πήγαινε στο «${rightRoom.name}» για τον/την ${movie.dangerB}.`, action: () => rescueChoice(movie.dangerB, movie.dangerA) }
    ]
  }));
}

function rescueChoice(savedName, leftName) {
  const movie = current.movie;
  setStatus(savedName, "SAVED");
  movie.saved.push(savedName); movie.peopleSaved += 1;
  current.relationships[savedName].trust += 22;
  let consequence;
  if (movie.keyHolder === leftName) {
    setStatus(leftName, "SAVED");
    movie.saved.push(leftName); movie.peopleSaved += 1; movie.deathsPrevented += 1;
    consequence = `${leftName} escaped using the ${movie.survivalItem}.`;
  } else {
    setStatus(leftName, "DEAD");
    consequence = `${leftName} died.`;
  }
  remember(`Έτρεξες προς τον/την ${savedName}, αφήνοντας τον/την ${leftName}.`, consequence);
  const bothLive = isAlive(leftName);
  queueBeat({
    kind: bothLive ? "rescue" : "death",
    eyebrow: bothLive ? "IMPOSSIBLE DOUBLE SAVE" : "ONE CHOICE · ONE DEATH",
    title: bothLive ? "Και οι δύο βγήκαν ζωντανοί." : `${leftName} πέθανε πριν φτάσει βοήθεια.`,
    body: bothLive ? `Έσωσες τον/την ${savedName}, ενώ το ${movie.survivalItem} επέτρεψε στον/στην ${leftName} να αποδράσει μόνος/η. Η παλιά σου επιλογή μόλις άλλαξε τη σκηνή.` : `Πρόλαβες τον/την ${savedName}. Στον άλλο διάδρομο, ο/η ${leftName} βρέθηκε νεκρός/ή. Το παιχνίδι δεν θα τον/την επαναφέρει αργότερα.`,
    names: [savedName, leftName], statuses: ["SAVED", bothLive ? "SAVED" : "DEAD"], roomOffset: 1,
    cta: "Κατάγραψε ποιον έχασες"
  }, 6);
}

function renderAccusation(kind) {
  const movie = current.movie;
  const isFinal = kind === "final";
  const content = movieScreen(isFinal ? "FINAL THEORY" : "MIDPOINT THEORY", isFinal ? 78 : 58);
  const wrap = el("div", "content");
  wrap.append(el("p", "eyebrow", isFinal ? "ACT III IS WAITING" : "WHO DO YOU SUSPECT?"), el("h1", "headline", isFinal ? "Κλείδωσε την τελική σου θεωρία." : "Ποιος βρίσκεται πίσω από τους φόνους;"));
  wrap.append(el("p", "section-copy", "Διάλεξε από 1 έως 4 άτομα. Το παιχνίδι θα θυμάται αυτή τη θεωρία μέχρι τα credits."));
  const grid = el("div", "suspect-grid");
  movie.cast.filter(name => name !== current.protagonist && movie.status[name] !== "DEAD").forEach(name => {
    const selected = movie.pendingTheory.includes(name);
    grid.append(characterButton(name, () => toggleSuspect(name, kind), selected, "suspect-card"));
  });
  wrap.append(grid);
  const footer = el("div", "selection-footer");
  footer.append(el("p", "", movie.pendingTheory.length ? `Επιλογές: ${movie.pendingTheory.join(", ")}` : "Δεν έχεις επιλέξει ακόμη."));
  const lock = button("Κλείδωσε θεωρία", "", () => lockTheory(kind), true);
  lock.disabled = movie.pendingTheory.length < 1 || movie.pendingTheory.length > 4;
  footer.append(lock);
  wrap.append(footer);
  content.append(wrap);
}

function toggleSuspect(name, kind) {
  const list = current.movie.pendingTheory;
  const index = list.indexOf(name);
  if (index >= 0) list.splice(index, 1);
  else if (list.length < 4) list.push(name);
  else return toast("Μπορείς να κατηγορήσεις μέχρι 4 άτομα.");
  renderAccusation(kind);
}

function lockTheory(kind) {
  const movie = current.movie;
  const theory = [...movie.pendingTheory];
  movie.pendingTheory = [];
  if (kind === "midpoint") {
    movie.midpointTheory = theory;
    if (!movie.firstSuspicion.length) movie.firstSuspicion = [...theory];
    remember(`Midpoint theory: ${theory.join(" + ")}.`, "Suspicion recorded.");
    queueBeat({
      kind: "theory", eyebrow: "THEORY LOCKED", title: theory.join(" + "),
      body: "Η θεωρία σου καταγράφηκε. Από εδώ και πέρα, οι ύποπτοι αντιδρούν διαφορετικά επειδή καταλαβαίνουν ποιον παρακολουθείς.",
      names: theory, statuses: theory.map(() => "SUSPECT"), roomOffset: 1
    }, 7);
  } else {
    movie.finalTheory = theory;
    remember(`Final theory: ${theory.join(" + ")}.`, "Final accusation recorded.");
    queueBeat({
      kind: "theory", eyebrow: "FINAL THEORY LOCKED", title: theory.join(" + "),
      body: "Δεν μπορείς να αλλάξεις τη θεωρία σου μετά από αυτή τη σκηνή. Οι μάσκες πέφτουν στο επόμενο cut.",
      names: theory, statuses: theory.map(() => "ACCUSED"), roomOffset: 2, cta: "Reveal"
    }, 10);
  }
}

function renderTrustScene() {
  const movie = current.movie;
  const aliveFriends = movie.friends.filter(isAlive);
  const focus = aliveFriends[0] || movie.cast.find(name => name !== current.protagonist && isAlive(name));
  const content = movieScreen("THE CONFESSION", 66);
  content.append(scenePanel({
    name: focus, time: "02:03 AM", image: focus, tone: "cold", eyebrow: "KNOWLEDGE IS DANGEROUS", title: "Κάποιος ζητάει την αλήθεια.",
    body: `Ο/Η ${focus} σε βρίσκει μόνο/η και ζητάει να δει το στοιχείο. Αν το μοιραστείς, ίσως αποκτήσεις σύμμαχο — ή δώσεις στον killer ακριβώς ό,τι χρειάζεται.`,
    choices: [
      { label: `Δείξε το στοιχείο στον/στην ${focus}.`, action: () => trustChoice(focus, true) },
      { label: "Κράτησέ το μυστικό μέχρι να είσαι βέβαιος/η.", action: () => trustChoice(focus, false) }
    ]
  }));
}

function trustChoice(name, shared) {
  const movie = current.movie;
  let beatBody;
  let beatKind = "dialogue";
  if (shared) {
    current.relationships[name].trust += 22;
    current.relationships[name].knowledge += 26;
    current.relationships[name].loyalty += 12;
    remember(`Μοιράστηκες το στοιχείο με τον/την ${name}.`, `${name} knows what you found.`);
    if (isKiller(name)) {
      beatKind = "sabotage";
      beatBody = `Μοιράζεσαι το clue. Δευτερόλεπτα αργότερα, το ρεύμα κόβεται και ένα κρίσιμο αρχείο εξαφανίζεται. Κάποιος στη συζήτηση ήξερε ακριβώς τι να σαμποτάρει.`;
    } else beatBody = `Ο/Η ${name} διαβάζει το clue και σου αποκαλύπτει μια κρυφή διαδρομή μέσα από το «${roomFor(1).name}». Η εμπιστοσύνη σας θα συνεχίσει στις επόμενες ταινίες αν επιζήσει.`;
  } else {
    current.relationships[name].suspicion += 14;
    remember(`Έκρυψες το στοιχείο από τον/την ${name}.`, `${name} became more suspicious of you.`);
    beatKind = "sabotage";
    beatBody = `Κρύβεις το clue. Ο/Η ${name} το αντιλαμβάνεται και απομακρύνεται. Στο επόμενο πλάνο, μια έξοδος έχει μπλοκαριστεί — δεν ξέρεις αν ήταν αντίδραση, σύμπτωση ή παγίδα.`;
  }
  queueBeat({
    kind: beatKind, eyebrow: shared ? "A SECRET CHANGES HANDS" : "TRUST FRACTURES",
    title: shared ? `${name} ξέρει όσα ξέρεις.` : `${name} καταλαβαίνει ότι κρύβεις κάτι.`,
    body: beatBody, names: [name], statuses: [shared ? "KNOWLEDGE +26" : "SUSPICION +14"], roomOffset: 1
  }, 8);
}

function renderSecondAttack() {
  const movie = current.movie;
  const target = movie.secondTarget;
  const attackRoom = roomFor(1);
  const attackVariants = [
    ["Η εικόνα κόβεται στη μέση ενός frame.", `Ο/Η ${target} εμφανίζεται για ένα δευτερόλεπτο στο security feed από το «${attackRoom.name}». Πίσω του/της κινείται μια δεύτερη σκιά.`],
    ["Ο projector δείχνει ζωντανή καταδίωξη.", `Το πλάνο ακολουθεί τον/την ${target} μέσα στο «${attackRoom.name}», παρότι κανείς δεν κρατάει κάμερα.`],
    ["Ένα emergency light αναβοσβήνει τρεις φορές.", `Ο/Η ${target} έχει κλειδωθεί στο «${attackRoom.name}». Κάθε αναλαμπή φέρνει τη μάσκα πιο κοντά.`],
    ["Το ασανσέρ ανοίγει χωρίς καμπίνα.", `Από το σκοτάδι ακούς τον/την ${target} στο «${attackRoom.name}» και μετά το μεταλλικό σύρσιμο μιας παγίδας.`],
    ["Το live stream αποκτά αντίστροφη μέτρηση.", `Ο/Η ${target} είναι μόνος/η στο «${attackRoom.name}». Το countdown τελειώνει πριν προλάβεις να εξηγήσεις τι συμβαίνει.`]
  ];
  const attack = attackVariants[movie.openingScenario.id % attackVariants.length];
  const content = movieScreen("NO ONE IS SAFE", 72);
  content.append(scenePanel({
    name: target, time: "02:41 AM", image: target, room: attackRoom, tone: "red", eyebrow: "A NEW ATTACK ROUTE", title: attack[0],
    body: `${attack[1]} Το μοναδικό αληθινό clue είναι ακόμα στην τσέπη σου.`,
    choices: [
      { label: `Ρίσκαρε τα πάντα. Βρες τον/την ${target}.`, action: () => secondAttackChoice(true) },
      { label: "Προστάτεψε το στοιχείο. Μην πέσεις στην παγίδα.", action: () => secondAttackChoice(false) }
    ]
  }));
}

function secondAttackChoice(rescue) {
  const movie = current.movie;
  const target = movie.secondTarget;
  if (rescue) {
    setStatus(target, "SAVED");
    movie.saved.push(target); movie.peopleSaved += 1;
    current.relationships[target].trust += 26;
    remember(`Ρίσκαρες για να σώσεις τον/την ${target}.`, `${target} survived.`);
  } else {
    setStatus(target, "DEAD");
    remember(`Δεν πήγες στο θέατρο για τον/την ${target}.`, `${target} died.`);
  }
  queueBeat({
    kind: rescue ? "rescue" : "death",
    eyebrow: rescue ? "CHASE SEQUENCE · RESCUE" : "THE CALL GOES SILENT",
    title: rescue ? `${target} βγαίνει από τη σκιά.` : `${target} είναι νεκρός/ή.`,
    body: rescue ? `Σπας την παγίδα στο «${roomFor(1).name}» και τραβάς τον/την ${target} έξω την τελευταία στιγμή. Το ρίσκο χτίζει μια σχέση που το sequel θα θυμάται.` : `Προστάτεψες το clue. Όταν φτάνουν οι υπόλοιποι, ο θάνατος του/της ${target} επιβεβαιώνεται. Δεν υπάρχει fake resurrection αργότερα.`,
    names: [target], statuses: [rescue ? "SAVED" : "DEAD"], roomOffset: 1
  }, 9);
}

function renderReveal() {
  const movie = current.movie;
  playSfx("impact");
  navigator.vibrate?.([120, 60, 180]);
  const discovered = movie.killers.filter(name => movie.finalTheory.includes(name)).length;
  const root = screen();
  const content = el("div", "content reveal-stage");
  content.append(el("p", "eyebrow", `ACT III · ${discovered}/${movie.killers.length} IDENTIFIED`));
  const line = discovered === movie.killers.length ? "Not even slightly." : discovered ? "Ήξερα για έναν από εσάς." : "Δεν μπορεί…";
  content.append(el("h1", "display", line));
  const row = el("div", "killer-row");
  movie.killers.forEach((name, index) => {
    const card = el("article", "killer-card");
    const img = el("img"); img.src = imagePath(name); img.alt = name;
    const copy = el("div");
    copy.append(el("small", "", index === 0 ? "THE MASTERMIND" : "ACCOMPLICE"), el("h2", "", name));
    card.append(img, copy); row.append(card);
  });
  content.append(row, el("p", "lead", `«${movie.motiveLine}» — Motive: ${movie.motive}`));
  if (movie.returningKiller) content.append(el("p", "remember", `Η μοναδική legacy ανατροπή: ο/η ${movie.returningKiller}, καταγεγραμμένος/η ως KILLER · PRESUMED DEAD, επέζησε κρυφά. Δεν υπήρξε στο intro, στο cast, σε διάλογο ή σε καμία προηγούμενη επιλογή του Movie III.`));
  const actions = el("div", "actions");
  actions.append(button("Μπες στο τελικό chase", "", () => advance(11)));
  content.append(actions);
  root.append(content);
}

function renderFinale() {
  const movie = current.movie;
  const discovered = movie.killers.filter(name => movie.finalTheory.includes(name)).length;
  const closest = movie.friends.filter(isAlive)[0] || movie.cast.find(name => name !== current.protagonist && isAlive(name) && !isKiller(name));
  const content = movieScreen("THE FINAL CHASE", 92);
  content.append(scenePanel({
    name: closest || current.protagonist, time: "03:17 AM", image: closest || current.protagonist, tone: "red", eyebrow: "THE LAST DECISION", title: "Το φιλμ τελειώνει μόνο με αίμα.",
    body: closest ? `Ο/Η ${closest} είναι δεμένος/η απέναντι από την έξοδο. Οι killers περιμένουν να διαλέξεις ανάμεσα στον άνθρωπο και στην παγίδα που έστησες.` : "Έμεινες μόνος/η. Το μόνο πλεονέκτημά σου είναι όσα κατάλαβες πριν από το reveal.",
    choices: [
      { label: closest ? `Σώσε πρώτα τον/την ${closest}.` : "Όρμησε προς την έξοδο.", action: () => finaleChoice("friend", closest, discovered) },
      { label: "Ενεργοποίησε την παγίδα και αντιμετώπισε τους killers.", action: () => finaleChoice("trap", closest, discovered) },
      { label: "Προσποιήσου ότι παραδίνεσαι. Περίμενε το λάθος τους.", action: () => finaleChoice("wait", closest, discovered) }
    ]
  }));
}

function finaleChoice(choice, closest, discovered) {
  const movie = current.movie;
  const perfect = discovered === movie.killers.length;
  if (choice === "friend" && closest) {
    setStatus(closest, "SAVED");
    movie.saved.push(closest); movie.peopleSaved += 1;
    if (!perfect) {
      const otherFriend = movie.friends.find(name => name !== closest && isAlive(name) && !isKiller(name));
      if (otherFriend) setStatus(otherFriend, "DEAD");
    }
    remember(`Στο finale έσωσες πρώτα τον/την ${closest}.`, perfect ? "Your full theory let you save them and stop every killer." : "The rescue had a cost.");
  } else if (choice === "trap") {
    remember("Ενεργοποίησες την παγίδα στο Act III.", perfect ? "Every killer walked into it." : "An undiscovered killer escaped the first strike.");
    if (!perfect && closest) setStatus(closest, "DEAD");
  } else {
    remember("Προσποιήθηκες ότι παραδίνεσαι.", discovered ? "You recognized the opening and turned the attack around." : "The killers controlled the room until the final second.");
    if (!discovered && closest) setStatus(closest, "DEAD");
  }
  const deathsSoFar = movie.cast.filter(name => movie.status[name] === "DEAD").length;
  const remainingFatalities = Math.max(0, (movie.fatalityTarget || 4) - deathsSoFar);
  const finaleRandom = mulberry32((current.seed + movie.number * 12289 + movie.choices.length * 173) >>> 0);
  const lateCandidates = shuffle(movie.cast.filter(name => name !== current.protagonist && !isKiller(name) && isAlive(name) && !movie.saved.includes(name) && name !== closest), finaleRandom);
  movie.lateDeaths = lateCandidates.slice(0, remainingFatalities);
  movie.lateDeaths.forEach(name => setStatus(name, "DEAD"));
  if (movie.lateDeaths.length) remember(`Το τελικό χάος στο ${roomFor(2).name} είχε κι άλλα θύματα.`, `${movie.lateDeaths.join(" & ")} died during the final chase.`);
  movie.killers.forEach(name => setStatus(name, movie.number === 3 ? "DEAD" : "KILLER · PRESUMED DEAD"));
  setStatus(current.protagonist, "ALIVE");
  movie.completed = true;
  createMovieRecord();
  const lost = movie.cast.filter(name => movie.status[name] === "DEAD");
  queueBeat({
    kind: "finale",
    eyebrow: movie.number === 3 ? "FINAL CUT · THE NIGHT ENDS" : "FINAL CUT · EVIL FALLS",
    title: movie.number === 3 ? "Οι μάσκες πέφτουν για πάντα." : "Οι killers χάνονται μέσα στη φωτιά.",
    body: movie.number === 3
      ? `Το Final Chapter τελειώνει με ${movie.killers.join(" και ")} επιβεβαιωμένα νεκρούς. Επιζώντες και σχέσεις κλειδώνουν στο canon σου.`
      : `Οι ${movie.killers.length === 1 ? "killer καταγράφεται" : "killers καταγράφονται"} ως PRESUMED DEAD. Δεν θα εμφανιστούν ως κανονικοί χαρακτήρες στην επόμενη ταινία. Μόνο το Movie III μπορεί να κρύβει έναν — και δεν θα το μάθεις πριν το reveal. ${lost.length ? `Στη διάρκεια της νύχτας χάθηκαν επίσης: ${lost.join(", ")}.` : "Οι υπόλοιποι κατάφεραν να επιζήσουν."}`,
    names: [...movie.lateDeaths, ...movie.killers],
    statuses: [...movie.lateDeaths.map(() => "DEAD"), ...movie.killers.map(() => movie.number === 3 ? "DEAD" : "KILLER · PRESUMED DEAD")],
    roomOffset: 2, cta: "End credits"
  }, "credits");
}

function createMovieRecord() {
  const movie = current.movie;
  if (movie.recordCreated) return current.history.at(-1);
  const survivors = movie.cast.filter(name => name === current.protagonist || isAlive(name)).filter(name => !movie.killers.includes(name));
  const wronglyAccused = unique([...movie.midpointTheory, ...movie.finalTheory]).filter(name => !movie.killers.includes(name));
  const correct = movie.killers.filter(name => movie.finalTheory.includes(name));
  const rankedSurvivors = survivors.filter(name => name !== current.protagonist);
  const closestFriend = [...rankedSurvivors].sort((a, b) => current.relationships[b].friendship - current.relationships[a].friendship)[0] || null;
  const mostTrusted = [...rankedSurvivors].sort((a, b) => current.relationships[b].trust - current.relationships[a].trust)[0] || null;
  const record = {
    number: movie.number, title: movie.title, cast: movie.cast, killers: movie.killers,
    returningKiller: movie.returningKiller, motive: movie.motive, survivors,
    openingScenarioId: movie.openingScenario?.id,
    statuses: movie.status, friends: movie.friends, saved: unique(movie.saved),
    wronglyAccused, firstSuspicion: movie.firstSuspicion, midpointTheory: movie.midpointTheory,
    finalTheory: movie.finalTheory, identified: correct.length, cluesFound: movie.cluesFound.length,
    peopleSaved: movie.peopleSaved, deathsPrevented: movie.deathsPrevented,
    victimCount: movie.cast.filter(name => movie.status[name] === "DEAD").length,
    choices: movie.choices.length, pivotal: movie.choices.slice(0, 3).map(item => item.text),
    closestFriend, mostTrusted, totalClues: movie.locationChoices.length
  };
  current.history.push(record);
  movie.recordCreated = true;
  return record;
}

function creditOrder() {
  const movie = current.movie;
  return unique([
    current.protagonist,
    ...movie.friends,
    ...movie.killers,
    ...movie.cast
  ]).map(name => {
    let role = "CAST";
    if (name === current.protagonist) role = "FINAL SURVIVOR · YOU";
    else if (movie.friends.includes(name)) role = "YOUR INNER CIRCLE";
    else if (name === movie.killers[0]) role = "THE MASTERMIND";
    else if (movie.killers.includes(name)) role = "THE KILLER";
    const status = movie.status[name] || (movie.killers.includes(name) ? "KILLER" : "ALIVE");
    return { name, role, status };
  });
}

function runCredits() {
  stopTimers();
  stopMusic();
  const slides = creditOrder();
  let index = 0;
  const overlay = el("section", "credits");
  const controls = el("div", "credits-controls");
  controls.append(button("Skip to statistics", "ghost", finishCredits));
  document.body.append(overlay, controls);
  playMusic(outroAudio);

  function showSlide() {
    overlay.textContent = "";
    const entry = slides[index];
    const slide = el("article", "credit-slide active");
    const imageWrap = el("div", "credit-image");
    const img = el("img"); img.src = imagePath(entry.name); img.alt = "";
    imageWrap.append(img);
    const copy = el("div", "credit-copy");
    copy.append(el("small", "", entry.role), el("h1", "", entry.name), el("p", "", entry.status));
    slide.append(imageWrap, copy); overlay.append(slide);
    index += 1;
    if (index >= slides.length) {
      clearInterval(creditTimer);
      creditTimer = setTimeout(finishCredits, 3700);
    }
  }

  function finishCredits() {
    stopTimers();
    outroAudio.pause();
    overlay.remove(); controls.remove();
    current.movie.stage = 12;
    saveCurrent();
    renderMovieReport();
  }

  showSlide();
  creditTimer = setInterval(showSlide, 2700);
}

function renderMovieReport() {
  const movie = current.movie;
  const record = current.history.find(item => item.number === movie.number) || createMovieRecord();
  const root = screen();
  const content = el("div", "content");
  content.append(el("p", "eyebrow", "YOUR STORY"), el("h1", "headline", `${movieLabel(movie.number)} · End Credits Statistics`));
  const stats = [
    [current.protagonist, "Final survivor"],
    [record.killers.join(" & "), "Killers"],
    [`${record.survivors.length}/${record.cast.length}`, "Survivors"],
    [`${record.identified}/${record.killers.length}`, "Killers identified"],
    [String(record.peopleSaved), "People saved"],
    [String(record.victimCount ?? record.cast.filter(name => record.statuses?.[name] === "DEAD").length), "Victims this movie"],
    [record.wronglyAccused.join(", ") || "Κανείς", "Wrongly accused"],
    [record.closestFriend || record.friends[0] || "—", "Closest friend"],
    [record.mostTrusted || "—", "Most trusted"],
    [record.firstSuspicion.join(" + ") || "—", "First suspect"],
    [record.finalTheory.join(" + ") || "—", "Final theory"],
    [`${record.cluesFound}/${record.totalClues || 3}`, "Clues found"],
    [String(record.deathsPrevented), "Deaths prevented"],
    [String(record.choices), "Choices made"]
  ];
  const grid = el("div", "stats-grid");
  stats.forEach(([value, label]) => {
    const card = el("article", "panel stat");
    card.append(el("strong", "", value), el("span", "", label)); grid.append(card);
  });
  content.append(grid, el("p", "eyebrow", "CAST STATUS"));
  const statusList = el("div", "status-list");
  unique([current.protagonist, ...movie.cast, ...movie.killers]).forEach(name => {
    const row = el("div", "status-row");
    const img = el("img"); img.src = imagePath(name); img.alt = "";
    const status = movie.status[name] || "ALIVE";
    const statusText = isKiller(name) && !status.startsWith("KILLER") ? `KILLER · ${status}` : status;
    row.append(img, el("strong", "", name), el("span", /DEAD|KILLER/.test(statusText) ? "dead" : "", statusText));
    statusList.append(row);
  });
  content.append(statusList);
  const actions = el("div", "actions");
  if (movie.number < 3) {
    actions.append(button(`Η ιστορία συνεχίζεται στο ${movieLabel(movie.number + 1)}`, "", () => {
      current.movie = null;
      startMovie(movie.number + 1);
    }));
    actions.append(button("Replay outro", "ghost", runCredits));
  } else {
    actions.append(button("Δες το αρχείο της τριλογίας", "", completeTrilogy));
  }
  content.append(actions);
  root.append(content);
}

function completeTrilogy() {
  current.completed = true;
  current.movie = null;
  saveCurrent();
  renderTrilogyArchive();
}

function renderTrilogyArchive() {
  if (!current) return renderHome();
  const root = screen();
  const content = el("div", "content");
  content.append(el("p", "eyebrow", "THE TRILOGY IS COMPLETE"), el("h1", "display", `${current.protagonist}’s Cut`), el("p", "lead", "Τρεις ταινίες. Ένα προσωπικό canon. Κάθε όνομα παρακάτω κουβαλάει ό,τι του συνέβη στη δική σου εκδοχή."));
  current.history.forEach(record => {
    const block = el("section", "panel feature");
    block.append(el("p", "eyebrow", `${movieLabel(record.number)} · ${record.title}`), el("h2", "headline", `${record.killers.join(" & ")} — ${record.motive}`));
    block.append(el("p", "section-copy", `Survivors: ${record.survivors.join(", ")}. Identified: ${record.identified}/${record.killers.length}. Saved: ${record.saved.join(", ") || "κανείς"}.`));
    content.append(block);
  });
  const actions = el("div", "actions");
  actions.append(button("Νέο universe", "", renderProtagonist), button("Κεντρικό μενού", "ghost", renderHome));
  content.append(actions);
  root.append(content);
}

function installApp() {
  if (!deferredInstallPrompt) return toast("Στο iPhone: Share → Add to Home Screen.");
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.finally(() => { deferredInstallPrompt = null; });
}

function registerWebMCP() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  Promise.resolve(context.registerTool({
    name: "read_story_state",
    title: "Read story state",
    description: "Read the current visible movie, scene, protagonist, and non-secret progress. Never reveals hidden killers.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute() {
      return current ? {
        protagonist: current.protagonist,
        movie: current.movieNumber,
        scene: current.movie?.stage || 0,
        completedMovies: current.history.length,
        visibleChoices: [...document.querySelectorAll("[data-story-choice]")].map((node, index) => ({ index, label: node.textContent.trim() }))
      } : { state: "main_menu", savedUniverses: saves.length };
    }
  }, { signal: lifecycle.signal })).catch(() => {});
  Promise.resolve(context.registerTool({
    name: "choose_visible_story_option",
    title: "Choose visible story option",
    description: "Choose one currently visible story option by its zero-based index. This changes and saves the story.",
    inputSchema: { type: "object", properties: { index: { type: "integer", minimum: 0 } }, required: ["index"], additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      const choices = [...document.querySelectorAll("[data-story-choice]")];
      if (!Number.isInteger(input?.index) || !choices[input.index]) throw new Error("That visible choice does not exist.");
      const label = choices[input.index].textContent.trim();
      choices[input.index].click();
      return { chosen: label, saved: true };
    }
  }, { signal: lifecycle.signal })).catch(() => {});
}

soundButton.addEventListener("click", () => {
  settings.sound = !settings.sound;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  soundButton.textContent = settings.sound ? "♪" : "×";
  soundButton.setAttribute("aria-pressed", String(settings.sound));
  soundButton.setAttribute("aria-label", settings.sound ? "Ήχος ενεργός" : "Ήχος κλειστός");
  if (!settings.sound) stopMusic();
  else toast("Ο ήχος ενεργοποιήθηκε.");
});

fullscreenButton.addEventListener("click", () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => toast("Χρησιμοποίησε το full screen του browser."));
  else document.exitFullscreen?.();
});

homeButton.addEventListener("click", () => {
  if (current?.movie && !current.movie.completed && !confirm("Η πρόοδος έχει αποθηκευτεί. Επιστροφή στο κεντρικό μενού;")) return;
  renderHome();
});

window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

async function checkForUpdate(manual = false) {
  if (!swRegistration) {
    if (manual) toast("Ο update checker δεν είναι ακόμη έτοιμος.");
    return;
  }
  updateButton.classList.add("checking");
  try {
    await swRegistration.update();
    if (swRegistration.waiting) {
      updateButton.classList.add("ready");
      toast("Βρέθηκε update. Εγκατάσταση τώρα…");
      swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
    } else if (manual) toast("Έχεις ήδη την τελευταία έκδοση.");
  } catch {
    if (manual) toast("Δεν ήταν δυνατός ο έλεγχος update. Δοκίμασε ξανά online.");
  } finally {
    updateButton.classList.remove("checking");
  }
}

async function setupServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  const hadController = Boolean(navigator.serviceWorker.controller);
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController || refreshing) return;
    refreshing = true;
    location.reload();
  });
  try {
    swRegistration = await navigator.serviceWorker.register("./service-worker.js", { updateViaCache: "none" });
    swRegistration.addEventListener("updatefound", () => {
      const installing = swRegistration.installing;
      if (!installing) return;
      installing.addEventListener("statechange", () => {
        if (installing.state === "installed" && navigator.serviceWorker.controller) {
          updateButton.classList.add("ready");
          installing.postMessage({ type: "SKIP_WAITING" });
        }
      });
    });
    await checkForUpdate(false);
    setInterval(() => checkForUpdate(false), 15 * 60 * 1000);
  } catch {}
}

updateButton.addEventListener("click", () => checkForUpdate(true));

soundButton.textContent = settings.sound ? "♪" : "×";
registerWebMCP();
window.addEventListener("load", setupServiceWorker, { once: true });
renderHome();
