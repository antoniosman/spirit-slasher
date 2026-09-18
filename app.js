const app = document.querySelector("#app");
const toastNode = document.querySelector("#toast");
const transitionNode = document.querySelector("#transition");
const introAudio = document.querySelector("#introAudio");
const outroAudio = document.querySelector("#outroAudio");
const funeralAudio = document.querySelector("#funeralAudio");
const soundButton = document.querySelector("#soundButton");
const fullscreenButton = document.querySelector("#fullscreenButton");
const homeButton = document.querySelector("#homeButton");
const updateButton = document.querySelector("#updateButton");
const updateStatus = document.querySelector("#updateStatus");
const updateStatusIcon = document.querySelector("#updateStatusIcon");
const updateStatusTitle = document.querySelector("#updateStatusTitle");
const updateStatusDetail = document.querySelector("#updateStatusDetail");

const STORAGE_KEY = "spirit-slasher-trilogies-v1";
const SETTINGS_KEY = "spirit-slasher-settings-v1";
const UPDATE_COMPLETE_KEY = "spirit-slasher-update-complete";
const APP_VERSION = "1.5.0";
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

const investigationPuzzles = [
  { title: "Το ρολόι χωρίς δείκτες", question: "Τρεις κάμερες γράφουν 00:13, 01:13 και 02:13. Ποιο feed έχει μονταριστεί;", answers: ["Το πρώτο", "Το δεύτερο", "Αυτό που δεν αλλάζει σκιά"], correct: 2, clue: "Η σκιά αποκαλύπτει ότι ένα feed γυρίστηκε νωρίτερα." },
  { title: "Η κλειδαριά των τεσσάρων frames", question: "Η σειρά είναι αίμα, μάσκα, έξοδος, σιωπή. Ποιο σύμβολο ανοίγει την πόρτα;", answers: ["Η έξοδος", "Η μάσκα", "Η σιωπή"], correct: 0, clue: "Το exit symbol κρύβει τον μηχανισμό της κλειδαριάς." },
  { title: "Το αντίστροφο μήνυμα", question: "Η φράση ακούγεται σωστά μόνο όταν η μπομπίνα παίζει ανάποδα. Τι ψάχνεις πρώτο;", answers: ["Την πηγή του ήχου", "Το τελευταίο frame", "Το άδειο κάθισμα"], correct: 1, clue: "Το τελευταίο frame δείχνει ποιος άγγιξε την μπομπίνα." },
  { title: "Οι τρεις κόκκινες πόρτες", question: "Η μία είναι ζεστή, η μία βρεγμένη, η μία εντελώς αθόρυβη. Ποια δεν χρησιμοποιήθηκε πρόσφατα;", answers: ["Η ζεστή", "Η βρεγμένη", "Η αθόρυβη"], correct: 2, clue: "Η σκόνη πίσω από την αθόρυβη πόρτα είναι ανέγγιχτη." },
  { title: "Το ψεύτικο άλλοθι", question: "Κάποιος λέει ότι άκουσε δύο χτυπήματα πριν κοπεί το ρεύμα. Το αρχείο έχει τρία. Τι σημαίνει;", answers: ["Ήταν πιο κοντά", "Λέει ψέματα", "Το τρίτο έγινε αργότερα"], correct: 0, clue: "Μόνο κάποιος μέσα στο service corridor θα έχανε το τρίτο χτύπημα." },
  { title: "Η διαδρομή της μάσκας", question: "Δύο δωμάτια έχουν βρεγμένα ίχνη αλλά έξω δεν βρέχει. Από πού ήρθε το νερό;", answers: ["Από τη λίμνη", "Από σπασμένο σωλήνα", "Από το sprinkler"], correct: 1, clue: "Ο σωλήνας συνδέεται με κρυφό maintenance passage." },
  { title: "Ο κώδικας του projector", question: "Οι αριθμοί 24, 48, 72 επαναλαμβάνονται. Ποιον αριθμό χρειάζεται το επόμενο reel;", answers: ["84", "96", "120"], correct: 1, clue: "Η ακολουθία μετρά frames ανά δύο δευτερόλεπτα." },
  { title: "Το δωμάτιο που δεν υπάρχει", question: "Ο χάρτης δείχνει 12 δωμάτια, οι κάμερες 13. Ποια ένδειξη αποκαλύπτει το κρυφό;", answers: ["Η διπλή καλωδίωση", "Το σπασμένο τζάμι", "Η παλιά ταμπέλα"], correct: 0, clue: "Δύο feeds μοιράζονται την ίδια παροχή πίσω από ψεύτικο τοίχο." },
  { title: "Η κασέτα των 13 δευτερολέπτων", question: "Το ίδιο ουρλιαχτό επαναλαμβάνεται κάθε 13 δευτερόλεπτα. Τι είναι αληθινό;", answers: ["Η πρώτη λήψη", "Η τελευταία λήψη", "Ο θόρυβος ανάμεσα"], correct: 2, clue: "Ο ενδιάμεσος θόρυβος περιέχει βήματα που δεν επαναλαμβάνονται." }
];

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
  ["Fictional killer betting", "Πόνταρε Slasher Credits στη final theory: 2× για πλήρη ακριβή πρόβλεψη ή αναλογική επιστροφή για μερική επιτυχία — χωρίς πραγματικά χρήματα."],
  ["Outcome-built credits", "Το outro μοντάρεται από το αποτέλεσμα: εσύ, οι φίλοι σου, οι killers και μετά όλο το cast."],
  ["3D funeral finale", "Μετά το Movie III, κάθε επιβεβαιωμένος νεκρός αποκτά δικό του κινηματογραφικό memorial portrait με την ειδική funeral μουσική."],
  ["Offline PWA", "Εγκαθίσταται σε Android και iOS, κρατά τα saves στη συσκευή και παίζει offline μετά την πρώτη φόρτωση."]
];

let saves = loadJSON(STORAGE_KEY, []);
let settings = loadJSON(SETTINGS_KEY, { sound: true });
let current = null;
let introTimer = null;
let creditTimer = null;
let memorialTimer = null;
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
  if (memorialTimer) clearInterval(memorialTimer);
  introTimer = null;
  creditTimer = null;
  memorialTimer = null;
  stopMemorialScore();
}

function stopMusic() {
  [introAudio, outroAudio, funeralAudio].forEach(audio => {
    audio.pause();
    audio.currentTime = 0;
  });
}

function stopMemorialScore() {
  funeralAudio.pause();
  funeralAudio.currentTime = 0;
}

function playMemorialScore() {
  if (!settings.sound) return;
  stopMemorialScore();
  funeralAudio.volume = .72;
  funeralAudio.play().catch(() => {});
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

function showUpdateStatus(state, title, detail, duration = 4600) {
  const icons = { checking: "↻", latest: "✓", available: "↓", updated: "✓", error: "!", info: "i" };
  clearTimeout(showUpdateStatus.timer);
  clearTimeout(showUpdateStatus.hideTimer);
  updateStatus.className = `update-status ${state}`;
  updateStatusIcon.textContent = icons[state] || "i";
  updateStatusTitle.textContent = title;
  updateStatusDetail.textContent = detail;
  updateStatus.hidden = false;
  requestAnimationFrame(() => updateStatus.classList.add("show"));
  if (duration > 0) {
    showUpdateStatus.timer = setTimeout(() => {
      updateStatus.classList.remove("show");
      showUpdateStatus.hideTimer = setTimeout(() => { updateStatus.hidden = true; }, 280);
    }, duration);
  }
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
    credits: 1000,
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
  current.credits ??= 1000;
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
  movie.openingKillerRoll ??= 1;
  movie.investigatedRooms ||= [];
  movie.investigationPhase ||= "rooms";
  movie.investigationActions ||= 0;
  movie.dialoguedWith ||= [];
  movie.puzzle ||= investigationPuzzles[0];
  movie.puzzleSolved ||= false;
  movie.puzzleAdvantage ||= false;
  movie.itemSaved ||= [];
  movie.pendingBet ??= 0;
  movie.betAmount ??= 0;
  movie.betPayout ??= 0;
  movie.betResult ||= "NO BET";
  movie.betSettled ||= false;
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

function relationshipBetween(a, b) {
  const match = relations.find(([left, right]) => (left === a && right === b) || (left === b && right === a));
  return match?.[2] || "";
}

function protagonistRelationship(name) {
  return relationshipBetween(current?.protagonist, name);
}

function supportingVoices(exclude = [], count = 2) {
  const movie = current.movie;
  const available = movie.cast.filter(name => name !== current.protagonist && !exclude.includes(name) && isAlive(name));
  if (!available.length) return [];
  const offset = ((movie.stage || 0) * 2 + (movie.openingScenario?.id || 0)) % available.length;
  return [...available.slice(offset), ...available.slice(0, offset)].slice(0, count);
}

function dialogueLine(name) {
  const relation = protagonistRelationship(name);
  const lines = [
    "«Δεν θα μείνω μόνος/η σε άλλο δωμάτιο.»",
    "«Κάποιος αλλάζει τον χάρτη όσο κινούμαστε.»",
    "«Το άλλοθι που ακούσαμε δεν ταιριάζει με τις κάμερες.»",
    "«Αν χωριστούμε ξανά, ο killer κερδίζει.»",
    "«Κοίτα ποιος αποφεύγει να μιλήσει για το opening.»"
  ];
  const line = lines[(name.length + current.movie.stage + (current.movie.openingScenario?.id || 0)) % lines.length];
  return relation ? `${relation} · ${line}` : line;
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
  const returningLimit = number === 2 ? 3 : 0;
  const returningSurvivors = shuffle(legacyPriority, random).slice(0, returningLimit);
  const newcomers = shuffle(allNames().filter(name => name !== protagonist && !seenBefore.has(name) && !confirmedDead.has(name)), random);
  const otherLiving = shuffle(allNames().filter(name => name !== protagonist && !confirmedDead.has(name) && !returningSurvivors.includes(name) && !newcomers.includes(name)), random);
  const allLegacySurvivors = unique(current.history.flatMap(record => record.survivors || []))
    .filter(name => name !== protagonist && !confirmedDead.has(name));
  let cast = number === 3
    ? unique([protagonist, ...newcomers, ...shuffle(allLegacySurvivors, random), ...otherLiving])
    : unique([protagonist, ...returningSurvivors, ...newcomers, ...otherLiving]).slice(0, desired);

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
  const survivingLegacyFriends = unique(current.history.flatMap(record =>
    (record.friends || []).filter(name => (record.survivors || []).includes(name))
  ));
  const protectedLegacy = number > 1 ? unique([
    previousRecord?.closestFriend,
    previousRecord?.mostTrusted,
    ...survivingLegacyFriends,
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
  const fatalityTarget = number === 1 ? 3 + Math.floor(random() * 3) : number === 2 ? 3 + Math.floor(random() * 4) : 4 + Math.floor(random() * 5);
  const openingKillerRoll = random();
  const puzzle = pick(investigationPuzzles, random);
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
    locationChoices, locationClues, rooms, worldAsset: world.asset, protectedLegacy, fatalityTarget, openingScenario, openingKillerRoll,
    cluesFound: [], choices: [], firstSuspicion: [], midpointTheory: [], finalTheory: [], pendingTheory: [],
    pendingBet: 0, betAmount: 0, betPayout: 0, betResult: "NO BET", betSettled: false,
    stageResult: null, saved: [], offscreenDeaths: [], lateDeaths: [], deathsPrevented: 0, peopleSaved: 0,
    investigatedRooms: [], investigationPhase: "rooms", investigationActions: 0, dialoguedWith: [], puzzle, puzzleSolved: false, puzzleAdvantage: false, itemSaved: [],
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
    const canonRelation = protagonistRelationship(closest);
    if (canonRelation) lines.push(`${closest}: ${canonRelation}. Η αρχική σας σχέση άλλαξε τις πιθανότητες επιβίωσης.`);
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

function scenePanel({ name, time, image, room = roomFor(), tone = "", eyebrow, title, body, choices = [], cameos = null }) {
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
  const voiceNames = (cameos === null ? supportingVoices([image], 2) : cameos)
    .filter(voiceName => character(voiceName) && isAlive(voiceName));
  if (voiceNames.length) {
    const dialogue = el("div", "ensemble-dialogue");
    voiceNames.forEach(voiceName => {
      const line = el("article", "ensemble-line");
      const avatar = el("img"); avatar.src = imagePath(voiceName); avatar.alt = "";
      const text = el("span");
      text.append(el("strong", "", voiceName), el("small", "", dialogueLine(voiceName)));
      line.append(avatar, text); dialogue.append(line);
    });
    copy.append(dialogue);
  }
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
  backdrop.append(el("span", "beat-depth depth-far"), el("span", "beat-depth depth-near"), el("span", "film-grain"));
  const content = el("div", "beat-content");
  content.append(el("p", "eyebrow beat-kicker", beat.eyebrow || "THE NIGHT CHANGES"), el("h1", "display beat-title", beat.title), el("p", "lead beat-body", beat.body));
  if (beat.names?.length) {
    const row = el("div", "beat-cast");
    beat.names.forEach((name, index) => {
      if (!character(name)) return;
      const status = beat.statuses?.[index] || movie.status[name] || "ALIVE";
      const motion = status === "DEAD" ? "motion-dead" : /SAVED|ALLY/.test(status) ? "motion-saved" : /KILLER/.test(status) ? "motion-killer" : "motion-active";
      const card = el("article", `beat-person ${motion}`);
      const img = el("img"); img.src = imagePath(name); img.alt = name;
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
    cameos: [movie.openingPartner],
    choices: [
      { label: scenario.choices[0], action: () => openingChoice("warn") },
      { label: scenario.choices[1], action: () => openingChoice("police") },
      { label: scenario.choices[2], action: () => openingChoice("drive") }
    ]
  }));
}

function openingChoice(choice) {
  const movie = current.movie;
  const choiceCode = { warn: 101, police: 211, drive: 307 }[choice];
  const random = mulberry32((current.seed + movie.number * 4079 + movie.openingScenario.id * 97 + choiceCode) >>> 0);
  const roll = random();
  let outcome;
  if (choice === "warn") outcome = roll < .18 ? "both" : roll < .72 ? "target" : "partner";
  else if (choice === "police") outcome = roll < .20 ? "both" : roll < .72 ? "partner" : "target";
  else outcome = roll < .30 ? "both" : roll < .68 ? "target" : "partner";

  const survivors = outcome === "both" ? [] : [outcome === "target" ? movie.openingTarget : movie.openingPartner];
  const victims = [movie.openingTarget, movie.openingPartner].filter(name => !survivors.includes(name));
  survivors.forEach(name => {
    setStatus(name, "SAVED");
    if (!movie.saved.includes(name)) { movie.saved.push(name); movie.peopleSaved += 1; }
    movie.deathsPrevented += 1;
    current.relationships[name].trust += 10;
  });
  victims.forEach(name => setStatus(name, "DEAD"));

  if (survivors.length && movie.openingKillerRoll < .12 && movie.killers.length < 4) {
    movie.openingSecretKiller = survivors[0];
    movie.killers.push(survivors[0]);
  }
  movie.openingOutcome = outcome;
  const actionText = movie.openingScenario.choices[{ warn: 0, police: 1, drive: 2 }[choice]];
  remember(actionText, survivors.length ? `${survivors.join(" & ")} survived; ${victims.join(" & ")} died.` : `${victims.join(" & ")} both died.`);
  rebuildFriendOptions();
  const bothDied = survivors.length === 0;
  queueBeat({
    kind: "death",
    eyebrow: bothDied ? "OPENING MASSACRE · BOTH LOST" : "OPENING KILL · THE OUTCOME SHIFTED",
    title: bothDied ? `${movie.openingTarget} και ${movie.openingPartner} πέθαναν.` : `${survivors[0]} επέζησε. ${victims[0]} όχι.`,
    body: bothDied
      ? "Η επιλογή φάνηκε σωστή, όμως η παγίδα είχε δεύτερο επίπεδο. Και οι δύο θάνατοι επιβεβαιώνονται — κανείς τους δεν θα εμφανιστεί ξανά ως ζωντανός χαρακτήρας."
      : `Ο/Η ${survivors[0]} βγαίνει ζωντανός/ή από το opening, αλλά δεν αποκτά plot armor. Αν δεν τον/την πάρεις στο main group, θα έχει την ίδια πιθανότητα με όλους τους άλλους να πεθάνει στα δωμάτια.`,
    names: [movie.openingTarget, movie.openingPartner],
    statuses: [movie.status[movie.openingTarget], movie.status[movie.openingPartner]], roomOffset: 1,
    cta: "Μπες στη νύχτα"
  }, 2);
}

function rebuildFriendOptions() {
  const movie = current.movie;
  const random = mulberry32((current.seed + movie.number * 1459 + 44) >>> 0);
  const available = shuffle(movie.cast.filter(name => name !== current.protagonist && isAlive(name)), random);
  movie.friendOptions = [available.slice(0, 3), available.slice(3, 6), available.slice(6, 9)].filter(group => group.length);
}

function refreshSceneTargets() {
  const movie = current.movie;
  const random = mulberry32((current.seed + movie.number * 1877 + movie.choices.length * 239) >>> 0);
  const available = movie.cast.filter(name => name !== current.protagonist && isAlive(name) && !isKiller(name));
  const preferred = [movie.dangerA, movie.dangerB, movie.secondTarget].filter(name => available.includes(name));
  const ordered = unique([...preferred, ...shuffle(available, random)]);
  movie.dangerA = ordered[0];
  movie.dangerB = ordered[1];
  movie.secondTarget = ordered[2];
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
    const canonLinks = group.map(name => protagonistRelationship(name) ? `${name}: ${protagonistRelationship(name)}` : "").filter(Boolean);
    const groupCopy = canonLinks.length ? canonLinks.join(" · ") : index === 2 ? "Έξω, μακριά από τη μουσική." : "Στο σαλόνι, ανάμεσα στους υπόλοιπους.";
    card.append(el("b", "", String.fromCharCode(65 + index)), el("h3", "", group.join(" · ")), el("p", "", groupCopy));
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
  const extras = shuffle(movie.cast.filter(name => name !== current.protagonist && !group.includes(name) && !isKiller(name) && isAlive(name)), random);
  const deathRoll = random();
  const intensityCap = Math.max(0, Math.min(3, (movie.fatalityTarget || 4) - 2));
  const deathCount = deathRoll < .18 ? 0 : deathRoll < .58 ? 1 : deathRoll < .88 ? 2 : intensityCap;
  movie.offscreenDeaths = extras.slice(0, Math.min(deathCount, Math.max(0, extras.length - 3)));
  movie.offscreenDeaths.forEach(name => setStatus(name, "DEAD"));
  refreshSceneTargets();
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
  if (movie.investigationPhase === "followup") return renderInvestigationFollowup();
  if (movie.investigationPhase === "puzzle") return renderPuzzle();
  const content = movieScreen("INVESTIGATION", 38);
  const wrap = el("div", "content");
  wrap.append(el("p", "eyebrow", "THE MAP KEEPS CHANGING"), el("h1", "headline", movie.investigatedRooms.length ? "Ποιο δωμάτιο θα ερευνήσεις μετά;" : "Πού θα ψάξεις πρώτα;"));
  const grid = el("div", "feature-grid");
  movie.locationChoices.filter(([location]) => !movie.investigatedRooms.includes(location)).forEach(([location, hint], index) => {
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
  const isExtraRoom = movie.investigatedRooms.length > 0;
  if (!movie.investigatedRooms.includes(location)) movie.investigatedRooms.push(location);
  if (!movie.cluesFound.includes(clue)) movie.cluesFound.push(clue);
  if (isExtraRoom) movie.investigationActions += 1;
  movie.investigationPhase = movie.investigationActions >= 2 ? "done" : "followup";
  current.relationships[clue.title.split(":")[0]] && (current.relationships[clue.title.split(":")[0]].suspicion += 18);
  remember(`Έψαξες: ${location}.`, `Found ${clue.type}: ${clue.title}.`);
  queueBeat({
    kind: clue.type === "REAL CLUE" ? "clue" : "twist",
    eyebrow: `${clue.type} · CASE FILE UPDATED`,
    title: clue.title,
    body: `${clue.text} Το στοιχείο μπαίνει στο προσωπικό σου case file — αλλά η ερμηνεία του μπορεί ακόμη να σε οδηγήσει στον λάθος άνθρωπο.`,
    names: [clue.title.split(":")[0]], statuses: [clue.type],
    room: movie.rooms.find(item => item.name === location), cta: movie.investigationActions >= 2 ? "Προχώρησε στην επίθεση" : "Διάλεξε την επόμενη κίνηση"
  }, movie.investigationActions >= 2 ? 5 : 4);
}

function renderInvestigationFollowup() {
  const movie = current.movie;
  const unsearched = movie.locationChoices.filter(([location]) => !movie.investigatedRooms.includes(location));
  const dialogueCandidates = movie.cast
    .filter(name => name !== current.protagonist && isAlive(name) && !movie.dialoguedWith.includes(name))
    .sort((a, b) => (protagonistRelationship(b) ? 1 : 0) - (protagonistRelationship(a) ? 1 : 0))
    .slice(0, 2);
  const focus = dialogueCandidates[0] || supportingVoices([], 1)[0] || current.protagonist;
  const choices = [];
  if (unsearched[0]) choices.push({ label: `Ερεύνησε και το «${unsearched[0][0]}».`, action: () => { movie.investigationPhase = "rooms"; saveCurrent(); renderMovie(); } });
  dialogueCandidates.forEach(name => choices.push({ label: `Μίλησε ιδιωτικά με τον/την ${name}${protagonistRelationship(name) ? ` — ${protagonistRelationship(name)}` : ""}.`, action: () => talkAfterInvestigation(name) }));
  if (!movie.puzzleSolved) choices.push({ label: `Λύσε το puzzle: «${movie.puzzle.title}».`, action: () => { movie.investigationPhase = "puzzle"; saveCurrent(); renderMovie(); } });
  choices.push({ label: "Σταμάτα την έρευνα και συγκέντρωσε την ομάδα.", action: () => { movie.investigationPhase = "done"; advance(5); } });
  const content = movieScreen("INVESTIGATE OR TALK", 43);
  content.append(scenePanel({
    name: focus, time: "12:44 AM", image: focus, room: roomFor(2), tone: "cold",
    eyebrow: "THE CASE OPENS UP", title: "Έχεις χρόνο για μία ακόμη κίνηση.",
    body: "Μπορείς να ψάξεις δεύτερο δωμάτιο, να λύσεις τον μηχανισμό του χάρτη ή να μιλήσεις με κάποιον χαρακτήρα για έξτρα στοιχείο. Κάθε συζήτηση αλλάζει trust, suspicion και μελλοντική επιβίωση.",
    choices, cameos: dialogueCandidates
  }));
}

function talkAfterInvestigation(name) {
  const movie = current.movie;
  movie.dialoguedWith.push(name);
  movie.investigationActions += 1;
  movie.investigationPhase = movie.investigationActions >= 2 ? "done" : "followup";
  const relation = protagonistRelationship(name);
  current.relationships[name].trust += relation ? 18 : 10;
  current.relationships[name].friendship += relation ? 14 : 8;
  const sabotage = isKiller(name);
  if (sabotage) current.relationships[name].suspicion = Math.max(0, current.relationships[name].suspicion - 8);
  remember(`Μίλησες ιδιωτικά με τον/την ${name}.`, sabotage ? "They subtly redirected the investigation." : "Their trust and survival odds improved.");
  queueBeat({
    kind: sabotage ? "sabotage" : "dialogue",
    eyebrow: relation ? `CANON RELATIONSHIP · ${relation}` : "PRIVATE CONVERSATION",
    title: sabotage ? `${name} σου δίνει ένα στοιχείο που μοιάζει υπερβολικά τέλειο.` : `${name} αποφασίζει να σε εμπιστευτεί.`,
    body: sabotage ? "Η πληροφορία ανοίγει νέα διαδρομή, αλλά μετακινεί αθόρυβα την υποψία μακριά από τον πραγματικό killer." : `Ο/Η ${name} αποκαλύπτει τι είδε ανάμεσα στα δωμάτια. Η συζήτηση αυξάνει τις πιθανότητες να συνεργαστεί — και να επιζήσει — αργότερα.`,
    names: [name], statuses: [sabotage ? "UNRELIABLE CLUE" : "TRUST INCREASED"], roomOffset: 2
  }, movie.investigationActions >= 2 ? 5 : 4);
}

function renderPuzzle() {
  const movie = current.movie;
  const content = movieScreen("PUZZLE ROOM", 45);
  content.append(scenePanel({
    name: "THE MAP", time: "12:51 AM", image: current.protagonist, room: roomFor(3), tone: "cold",
    eyebrow: "ONE ANSWER CHANGES THE ROUTE", title: movie.puzzle.title, body: movie.puzzle.question,
    choices: movie.puzzle.answers.map((answer, index) => ({ label: answer, action: () => solvePuzzle(index) }))
  }));
}

function solvePuzzle(answerIndex) {
  const movie = current.movie;
  const correct = answerIndex === movie.puzzle.correct;
  movie.puzzleSolved = true;
  movie.puzzleAdvantage = correct;
  movie.investigationActions += 1;
  movie.investigationPhase = movie.investigationActions >= 2 ? "done" : "followup";
  remember(`Puzzle: ${movie.puzzle.title} — ${movie.puzzle.answers[answerIndex]}.`, correct ? "Solved correctly." : "Wrong route opened.");
  queueBeat({
    kind: correct ? "clue" : "twist", eyebrow: correct ? "PUZZLE SOLVED" : "WRONG ANSWER · NEW DANGER",
    title: correct ? "Ο κρυφός μηχανισμός ανοίγει." : "Ο χάρτης σε οδηγεί σε παγίδα.",
    body: correct ? `${movie.puzzle.clue} Το πλεονέκτημα θα αυξήσει τις πιθανότητες διάσωσης αργότερα.` : "Η λάθος επιλογή δεν τελειώνει το παιχνίδι, αλλά ο killer αποκτά καλύτερη θέση για την επόμενη επίθεση.",
    names: supportingVoices([], 2), statuses: supportingVoices([], 2).map(() => correct ? "ROUTE FOUND" : "EXPOSED"), roomOffset: 3
  }, movie.investigationActions >= 2 ? 5 : 4);
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
  const random = mulberry32((current.seed + movie.number * 5431 + savedName.length * 317 + leftName.length * 149 + movie.choices.length) >>> 0);
  const chosenTrust = Math.min(.14, Math.max(0, current.relationships[savedName].trust) / 500);
  const leftLoyalty = Math.min(.14, Math.max(0, current.relationships[leftName].loyalty) / 450);
  const chosenItemBonus = movie.keyHolder === savedName && !isKiller(savedName) ? .18 : 0;
  const leftItemBonus = movie.keyHolder === leftName && !isKiller(leftName) ? .62 : 0;
  const puzzleBonus = movie.puzzleAdvantage ? .12 : 0;
  const chosenLives = random() < Math.min(.96, .66 + chosenTrust + chosenItemBonus + puzzleBonus);
  const leftLives = random() < Math.min(.92, .12 + leftLoyalty + leftItemBonus + puzzleBonus / 2);
  const outcomes = [[savedName, chosenLives], [leftName, leftLives]];
  outcomes.forEach(([name, lives]) => {
    if (lives) {
      setStatus(name, "SAVED");
      if (!movie.saved.includes(name)) { movie.saved.push(name); movie.peopleSaved += 1; }
      movie.deathsPrevented += 1;
    } else setStatus(name, "DEAD");
  });
  if (chosenLives) current.relationships[savedName].trust += 22;
  [savedName, leftName].forEach(name => {
    if (isAlive(name) && movie.keyHolder === name && !movie.itemSaved.includes(name)) movie.itemSaved.push(name);
  });
  const living = outcomes.filter(([, lives]) => lives).map(([name]) => name);
  const dead = outcomes.filter(([, lives]) => !lives).map(([name]) => name);
  remember(`Έτρεξες προς τον/την ${savedName}, αφήνοντας τον/την ${leftName}.`, `Survived: ${living.join(" & ") || "none"}. Died: ${dead.join(" & ") || "none"}.`);
  const bothLive = living.length === 2;
  const bothDead = dead.length === 2;
  queueBeat({
    kind: dead.length ? "death" : "rescue",
    eyebrow: bothLive ? "DOUBLE SAVE · THE ODDS SHIFTED" : bothDead ? "THE CHOICE WAS A TRAP" : "ONE SURVIVOR · NOT THE EXPECTED ONE",
    title: bothLive ? "Και οι δύο βγήκαν ζωντανοί." : bothDead ? "Κανείς δεν βγήκε από τα δωμάτια." : `${living[0]} επέζησε. ${dead[0]} πέθανε.`,
    body: bothLive
      ? `Trust, puzzle knowledge και το ${movie.survivalItem} άλλαξαν τις πιθανότητες. Η επιλογή δεν είχε προκαθορισμένο αποτέλεσμα.`
      : bothDead
        ? "Ο killer είχε προβλέψει τη διαδρομή σου. Ακόμη και το άτομο που επέλεξες να σώσεις μπορούσε να πεθάνει."
        : `${movie.keyHolder && living.includes(movie.keyHolder) ? `Το ${movie.survivalItem} βοήθησε τον/την ${movie.keyHolder} να επιζήσει. ` : ""}Το αποτέλεσμα προέκυψε από σχέσεις, στοιχεία και κρυφό probability roll — όχι από σταθερό A/B outcome.`,
    names: [savedName, leftName], statuses: [movie.status[savedName], movie.status[leftName]], roomOffset: 1,
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
  if (isFinal && movie.number === 3) {
    const ghostSelected = movie.pendingTheory.includes("LEGACY GHOST");
    const ghost = el("button", `character-card suspect-card ghost-suspect ${ghostSelected ? "selected" : ""}`.trim());
    ghost.type = "button";
    ghost.dataset.storyChoice = "true";
    ghost.append(el("span", "ghost-mark", "?"), el("strong", "", "LEGACY GHOST"), el("small", "", "Ο killer ίσως δεν βρίσκεται στο cast."));
    ghost.addEventListener("click", () => toggleSuspect("LEGACY GHOST", kind));
    grid.append(ghost);
  }
  wrap.append(grid);
  if (isFinal) {
    const bet = el("section", "panel bet-slip");
    bet.append(el("p", "eyebrow", "FICTIONAL BET · NO REAL MONEY"), el("h2", "", "Πόνταρε στη θεωρία σου"), el("p", "", `Διαθέσιμα: ${current.credits} Slasher Credits. Ακριβής θεωρία πληρώνει 2×. Μερική επιτυχία επιστρέφει το αντίστοιχο ποσοστό.`));
    const controls = el("div", "bet-controls");
    const input = el("input", "bet-input");
    input.type = "number"; input.inputMode = "numeric"; input.min = "0"; input.max = String(current.credits); input.step = "10"; input.value = String(Math.min(movie.pendingBet || 0, current.credits));
    input.setAttribute("aria-label", "Ποσό πονταρίσματος σε Slasher Credits");
    input.addEventListener("input", () => { movie.pendingBet = Math.max(0, Math.min(current.credits, Math.floor(Number(input.value) || 0))); });
    controls.append(input);
    [100, 250].filter(amount => amount <= current.credits).forEach(amount => {
      const chip = button(String(amount), "ghost bet-chip", () => { movie.pendingBet = amount; input.value = String(amount); });
      controls.append(chip);
    });
    controls.append(button("MAX", "ghost bet-chip", () => { movie.pendingBet = current.credits; input.value = String(current.credits); }));
    bet.append(controls, el("small", "bet-disclaimer", "Τα Slasher Credits είναι αποκλειστικά μέρος του παιχνιδιού. Δεν υπάρχει κατάθεση, πληρωμή ή πραγματικό χρηματικό έπαθλο."));
    wrap.append(bet);
  }
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
    movie.betAmount = Math.max(0, Math.min(current.credits, Math.floor(movie.pendingBet || 0)));
    current.credits -= movie.betAmount;
    movie.betSettled = false;
    remember(`Final theory: ${theory.join(" + ")}.`, "Final accusation recorded.");
    queueBeat({
      kind: "theory", eyebrow: "FINAL THEORY LOCKED", title: theory.join(" + "),
      body: `Δεν μπορείς να αλλάξεις τη θεωρία σου μετά από αυτή τη σκηνή. ${movie.betAmount ? `Πόνταρες ${movie.betAmount} fictional Slasher Credits.` : "Δεν έβαλες ποντάρισμα."} Οι μάσκες πέφτουν στο επόμενο cut.`,
      names: theory, statuses: theory.map(() => "ACCUSED"), roomOffset: 2, cta: "Reveal"
    }, 10);
  }
}

function renderTrustScene() {
  const movie = current.movie;
  const aliveFriends = movie.friends.filter(isAlive);
  const focus = aliveFriends[0] || movie.cast.find(name => name !== current.protagonist && isAlive(name));
  const relation = protagonistRelationship(focus);
  const content = movieScreen("THE CONFESSION", 66);
  content.append(scenePanel({
    name: focus, time: "02:03 AM", image: focus, tone: "cold", eyebrow: "KNOWLEDGE IS DANGEROUS", title: "Κάποιος ζητάει την αλήθεια.",
    body: `${relation ? `Ο/Η ${focus} είναι ${relation.toLowerCase()} μαζί σου και η κοινή σας ιστορία βαραίνει την απόφαση. ` : ""}Σου ζητάει να δει το στοιχείο. Αν το μοιραστείς, ίσως αποκτήσεις σύμμαχο — ή δώσεις στον killer ακριβώς ό,τι χρειάζεται.`,
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
  const random = mulberry32((current.seed + movie.number * 6823 + target.length * 211 + (rescue ? 19 : 41)) >>> 0);
  const itemBonus = movie.keyHolder === target && !isKiller(target) ? .55 : 0;
  const relationBonus = Math.min(.15, Math.max(0, current.relationships[target].loyalty + current.relationships[target].trust) / 700);
  const puzzleBonus = movie.puzzleAdvantage ? .12 : 0;
  const survivalChance = Math.min(.96, (rescue ? .64 : .10) + itemBonus + relationBonus + puzzleBonus);
  const survived = random() < survivalChance;
  if (survived) {
    setStatus(target, "SAVED");
    if (!movie.saved.includes(target)) { movie.saved.push(target); movie.peopleSaved += 1; }
    movie.deathsPrevented += 1;
    if (rescue) current.relationships[target].trust += 26;
    if (itemBonus && !movie.itemSaved.includes(target)) movie.itemSaved.push(target);
  } else {
    setStatus(target, "DEAD");
  }
  remember(rescue ? `Ρίσκαρες για να σώσεις τον/την ${target}.` : `Προστάτεψες το clue αντί να τρέξεις στον/στην ${target}.`, `${target} ${survived ? "survived" : "died"}.`);
  queueBeat({
    kind: survived ? "rescue" : "death",
    eyebrow: survived ? "THE ODDS BROKE IN YOUR FAVOR" : rescue ? "THE RESCUE BECAME AN AMBUSH" : "THE ROUTE CLOSED",
    title: survived ? `${target} επιβιώνει από την επίθεση.` : `${target} είναι νεκρός/ή.`,
    body: survived
      ? `${rescue ? "Το ρίσκο σου" : "Η δική του/της αντίδραση"}${itemBonus ? ` και το ${movie.survivalItem}` : ""} άλλαξαν το κρυφό probability roll. Η επιβίωση δεν ήταν δεδομένη.`
      : `${rescue ? "Έτρεξες προς την παγίδα, αλλά ο killer είχε αλλάξει τη διαδρομή." : "Δεν πήγες — και αυτή τη φορά δεν υπήρχε έξοδος."} Ο θάνατος επιβεβαιώνεται και δεν θα αναιρεθεί αργότερα.`,
    names: [target], statuses: [survived ? "SAVED" : "DEAD"], roomOffset: 1
  }, 9);
}

function identifiedKillers(movie, theory = movie.finalTheory) {
  return movie.killers.filter(name => theory.includes(name) || (name === movie.returningKiller && theory.includes("LEGACY GHOST")));
}

function falsePredictions(movie, theory = movie.finalTheory) {
  return theory.filter(name => name !== "LEGACY GHOST" && !movie.killers.includes(name))
    .concat(theory.includes("LEGACY GHOST") && !movie.returningKiller ? ["LEGACY GHOST"] : []);
}

function settleBet(movie) {
  if (movie.betSettled) return;
  movie.betSettled = true;
  const wager = movie.betAmount || 0;
  if (!wager) {
    movie.betResult = "NO BET";
    movie.betPayout = 0;
    return;
  }
  const hits = identifiedKillers(movie).length;
  const falsePicks = falsePredictions(movie).length;
  const exact = hits === movie.killers.length && falsePicks === 0;
  const ratio = movie.killers.length ? hits / movie.killers.length : 0;
  movie.betPayout = exact ? wager * 2 : Math.round(wager * ratio);
  current.credits += movie.betPayout;
  movie.betResult = exact ? "EXACT WIN" : hits ? `PARTIAL ${hits}/${movie.killers.length}` : "LOST";
  saveCurrent();
}

function renderReveal() {
  const movie = current.movie;
  playSfx("impact");
  navigator.vibrate?.([120, 60, 180]);
  const discovered = identifiedKillers(movie).length;
  settleBet(movie);
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
  if (movie.betAmount) {
    const betResult = el("article", `panel reveal-bet ${movie.betResult === "EXACT WIN" ? "win" : movie.betResult === "LOST" ? "lost" : "partial"}`);
    betResult.append(
      el("small", "", "FICTIONAL BET RESULT"),
      el("h2", "", movie.betResult === "EXACT WIN" ? "Κέρδισες το στοίχημα." : movie.betResult === "LOST" ? "Το στοίχημα χάθηκε." : "Μερική επιτυχία."),
      el("p", "", `Πόνταρες ${movie.betAmount}. Επιστροφή: ${movie.betPayout} Slasher Credits. Νέο υπόλοιπο: ${current.credits}.`)
    );
    content.append(betResult);
  }
  const actions = el("div", "actions");
  actions.append(button("Μπες στο τελικό chase", "", () => advance(11)));
  content.append(actions);
  root.append(content);
}

function renderFinale() {
  const movie = current.movie;
  const discovered = identifiedKillers(movie).length;
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
  const finaleRandom = mulberry32((current.seed + movie.number * 12289 + movie.choices.length * 173) >>> 0);
  if (closest) {
    const relationshipBonus = Math.min(.16, Math.max(0, current.relationships[closest].loyalty + current.relationships[closest].trust) / 650);
    const itemBonus = movie.keyHolder === closest && !isKiller(closest) ? .22 : 0;
    const baseChance = choice === "friend" ? .62 : choice === "trap" ? .38 : .46;
    const theoryBonus = perfect ? .20 : discovered ? .08 : 0;
    const lives = finaleRandom() < Math.min(.96, baseChance + relationshipBonus + itemBonus + theoryBonus + (movie.puzzleAdvantage ? .08 : 0));
    setStatus(closest, lives ? "SAVED" : "DEAD");
    if (lives && !movie.saved.includes(closest)) { movie.saved.push(closest); movie.peopleSaved += 1; }
    if (lives && itemBonus && !movie.itemSaved.includes(closest)) movie.itemSaved.push(closest);
    remember(
      choice === "friend" ? `Στο finale έτρεξες πρώτα προς τον/την ${closest}.` : choice === "trap" ? "Ενεργοποίησες την παγίδα στο Act III." : "Προσποιήθηκες ότι παραδίνεσαι.",
      `${closest} ${lives ? "survived" : "died"}; the outcome used theory, relationship, item and a hidden roll.`
    );
  } else remember("Αντιμετώπισες το finale μόνος/η.", perfect ? "The full theory improved the final odds." : "The killers controlled the room until the last cut.");
  const deathsSoFar = movie.cast.filter(name => movie.status[name] === "DEAD").length;
  const remainingFatalities = Math.max(0, (movie.fatalityTarget || 4) - deathsSoFar);
  const lateCandidates = shuffle(movie.cast.filter(name => name !== current.protagonist && !isKiller(name) && isAlive(name) && name !== closest), finaleRandom).filter(name => {
    if (name === movie.keyHolder && !isKiller(name) && finaleRandom() < .72) {
      if (!movie.itemSaved.includes(name)) movie.itemSaved.push(name);
      movie.deathsPrevented += 1;
      return false;
    }
    return true;
  });
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
      ? `Το Final Chapter τελειώνει με ${movie.killers.join(" και ")} επιβεβαιωμένα νεκρούς. ${lost.length ? `Στη διάρκεια της ταινίας πέθαναν: ${lost.join(", ")}.` : "Δεν υπήρξαν άλλα θύματα."} ${movie.itemSaved.length ? `Το ${movie.survivalItem} βοήθησε να σωθούν: ${movie.itemSaved.join(", ")}.` : ""}`
      : `Οι ${movie.killers.length === 1 ? "killer καταγράφεται" : "killers καταγράφονται"} ως PRESUMED DEAD. Δεν θα εμφανιστούν ως κανονικοί χαρακτήρες στην επόμενη ταινία. Μόνο το Movie III μπορεί να κρύβει έναν — και δεν θα το μάθεις πριν το reveal. ${lost.length ? `Στη διάρκεια της νύχτας χάθηκαν επίσης: ${lost.join(", ")}.` : "Οι υπόλοιποι κατάφεραν να επιζήσουν."} ${movie.itemSaved.length ? `Το ${movie.survivalItem} προστάτευσε: ${movie.itemSaved.join(", ")}.` : ""}`,
    names: [...movie.lateDeaths, ...movie.killers],
    statuses: [...movie.lateDeaths.map(() => "DEAD"), ...movie.killers.map(() => movie.number === 3 ? "DEAD" : "KILLER · PRESUMED DEAD")],
    roomOffset: 2, cta: "End credits"
  }, "credits");
}

function createMovieRecord() {
  const movie = current.movie;
  if (movie.recordCreated) return current.history.at(-1);
  const survivors = movie.cast.filter(name => name === current.protagonist || isAlive(name)).filter(name => !movie.killers.includes(name));
  const wronglyAccused = unique([
    ...movie.midpointTheory.filter(name => !movie.killers.includes(name)),
    ...falsePredictions(movie)
  ]);
  const correct = identifiedKillers(movie);
  const ordinaryDeaths = movie.cast.filter(name => movie.status[name] === "DEAD" && !movie.killers.includes(name));
  const deaths = unique([...movie.cast, ...movie.killers]).filter(name => movie.status[name] === "DEAD");
  const rankedSurvivors = survivors.filter(name => name !== current.protagonist);
  const closestFriend = [...rankedSurvivors].sort((a, b) => current.relationships[b].friendship - current.relationships[a].friendship)[0] || null;
  const mostTrusted = [...rankedSurvivors].sort((a, b) => current.relationships[b].trust - current.relationships[a].trust)[0] || null;
  const record = {
    number: movie.number, title: movie.title, cast: movie.cast, killers: movie.killers,
    returningKiller: movie.returningKiller, motive: movie.motive, survivors,
    openingScenarioId: movie.openingScenario?.id,
    statuses: movie.status, friends: movie.friends, saved: unique(movie.saved),
    deaths,
    wronglyAccused, firstSuspicion: movie.firstSuspicion, midpointTheory: movie.midpointTheory,
    finalTheory: movie.finalTheory, identified: correct.length, cluesFound: movie.cluesFound.length,
    peopleSaved: movie.peopleSaved, deathsPrevented: movie.deathsPrevented,
    victimCount: ordinaryDeaths.length, itemSaved: unique(movie.itemSaved), puzzleSolved: movie.puzzleSolved, puzzleAdvantage: movie.puzzleAdvantage,
    betAmount: movie.betAmount, betPayout: movie.betPayout, betResult: movie.betResult,
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
    [(record.deaths || []).join(", ") || "Κανείς", "Who died"],
    [record.betAmount ? `${record.betResult} · +${record.betPayout}` : "No bet", "Fictional bet"],
    [String(current.credits), "Slasher Credits balance"],
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
  renderFuneral();
}

function trilogyDeaths() {
  const entries = current.history.flatMap(record => {
    const names = record.deaths || unique([...(record.cast || []), ...(record.killers || [])]).filter(name => record.statuses?.[name] === "DEAD");
    return names.map(name => ({ name, movie: record.number, title: record.title }));
  });
  const firstDeath = new Map();
  entries.forEach(entry => { if (!firstDeath.has(entry.name)) firstDeath.set(entry.name, entry); });
  return [...firstDeath.values()];
}

function renderFuneral() {
  if (!current) return renderHome();
  const dead = trilogyDeaths();
  if (!dead.length) return renderTrilogyArchive();
  stopMusic();
  const root = screen("funeral-screen cinematic");
  const stage = el("div", "funeral-stage");
  const controls = el("div", "funeral-controls");
  let index = 0;

  const finish = () => {
    stopMemorialScore();
    renderTrilogyArchive();
  };

  const showPortrait = () => {
    if (index >= dead.length) return finish();
    const entry = dead[index];
    stage.textContent = "";
    const scene = el("article", "funeral-scene");
    const depth = el("div", "funeral-depth");
    depth.append(el("span", "funeral-rain rain-far"), el("span", "funeral-rain rain-near"), el("span", "funeral-candle candle-left"), el("span", "funeral-candle candle-right"));
    const portrait = el("div", "funeral-portrait");
    const img = el("img"); img.src = imagePath(entry.name); img.alt = entry.name;
    portrait.append(img, el("span", "mourning-ribbon", "IN MEMORY"));
    const copy = el("div", "funeral-copy");
    copy.append(
      el("p", "eyebrow", `${String(index + 1).padStart(2, "0")} / ${String(dead.length).padStart(2, "0")} · ${movieLabel(entry.movie)}`),
      el("h1", "display", entry.name),
      el("p", "funeral-line", "Η ιστορία θυμάται τη θέση που άφησε πίσω."),
      el("small", "funeral-status", `${entry.title} · CONFIRMED DEAD`)
    );
    scene.append(depth, portrait, copy);
    stage.append(scene);
    index += 1;
  };

  const next = () => {
    clearInterval(memorialTimer);
    showPortrait();
    if (index < dead.length) memorialTimer = setInterval(showPortrait, 4600);
  };

  controls.append(
    button("Επόμενο πορτρέτο", "ghost", next),
    button("Συνέχεια στο archive", "", finish)
  );
  root.append(stage, el("div", "funeral-heading", "I WILL REMEMBER YOU"), controls);
  playMemorialScore();
  showPortrait();
  memorialTimer = setInterval(showPortrait, 4600);
}

function renderTrilogyArchive() {
  if (!current) return renderHome();
  current.credits ??= 1000;
  const root = screen();
  const content = el("div", "content");
  content.append(el("p", "eyebrow", "THE TRILOGY IS COMPLETE"), el("h1", "display", `${current.protagonist}’s Cut`), el("p", "lead", `Τρεις ταινίες. Ένα προσωπικό canon. Τελικό fictional betting balance: ${current.credits} Slasher Credits.`));
  current.history.forEach(record => {
    const block = el("section", "panel feature");
    block.append(el("p", "eyebrow", `${movieLabel(record.number)} · ${record.title}`), el("h2", "headline", `${record.killers.join(" & ")} — ${record.motive}`));
    const deaths = record.deaths || record.cast.filter(name => record.statuses?.[name] === "DEAD");
    block.append(el("p", "section-copy", `Survivors: ${record.survivors.join(", ")}. Saved during the movie: ${record.saved.join(", ") || "κανείς"}.`));
    block.append(el("p", "archive-deaths", `Deaths: ${deaths.join(", ") || "κανείς"}.`));
    block.append(el("p", "archive-bet", `Theory: ${record.identified}/${record.killers.length} killers · Bet: ${record.betAmount ? `${record.betResult} / επιστροφή ${record.betPayout}` : "κανένα"}.`));
    content.append(block);
  });
  const memorialEntries = current.history.flatMap(record => (record.deaths || record.cast.filter(name => record.statuses?.[name] === "DEAD")).map(name => ({ name, movie: record.number })));
  const memorial = el("section", "trilogy-memorial");
  memorial.append(el("p", "eyebrow", "IN MEMORIAM · ALL THREE FILMS"), el("h2", "headline", "Ποιοι πέθαναν στην τριλογία"));
  const memorialGrid = el("div", "memorial-grid");
  memorialEntries.forEach(entry => {
    const card = el("article", "memorial-card");
    const img = el("img"); img.src = imagePath(entry.name); img.alt = "";
    card.append(img, el("strong", "", entry.name), el("small", "", `${movieLabel(entry.movie)} · DEAD`));
    memorialGrid.append(card);
  });
  if (!memorialEntries.length) memorialGrid.append(el("p", "section-copy", "Κανένας καταγεγραμμένος θάνατος."));
  memorial.append(memorialGrid); content.append(memorial);
  const actions = el("div", "actions");
  if (trilogyDeaths().length) actions.append(button("Replay 3D funeral", "secondary", renderFuneral));
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
  else {
    if (document.querySelector(".funeral-screen")) playMemorialScore();
    toast("Ο ήχος ενεργοποιήθηκε.");
  }
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
    if (manual) showUpdateStatus("info", "Ο έλεγχος ετοιμάζεται", `Τρέχεις την έκδοση v${APP_VERSION}. Δοκίμασε ξανά σε λίγα δευτερόλεπτα.`);
    return;
  }
  updateButton.classList.add("checking");
  updateButton.setAttribute("aria-label", "Γίνεται έλεγχος για ενημέρωση");
  showUpdateStatus("checking", "Έλεγχος για ενημέρωση…", `Σύγκριση της έκδοσης v${APP_VERSION} με το GitHub Pages.`, 0);
  try {
    await swRegistration.update();
    if (swRegistration.waiting) {
      updateButton.classList.add("ready");
      showUpdateStatus("available", "Βρέθηκε νέα έκδοση", "Η εγκατάσταση γίνεται αυτόματα. Το παιχνίδι θα ανοίξει ξανά μόνο του.", 0);
      swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
    } else if (swRegistration.installing) {
      showUpdateStatus("available", "Κατεβαίνει η νέα έκδοση", "Μην κλείσεις το παιχνίδι — θα ανανεωθεί αυτόματα μόλις είναι έτοιμη.", 0);
    } else {
      updateButton.classList.remove("ready");
      showUpdateStatus("latest", "Είσαι ενημερωμένος", `Έχεις ήδη την τελευταία έκδοση v${APP_VERSION}.`);
    }
  } catch {
    showUpdateStatus("error", "Δεν ολοκληρώθηκε ο έλεγχος", `Η έκδοση v${APP_VERSION} παραμένει ενεργή. Έλεγξε τη σύνδεσή σου και πάτησε ξανά ↻.`);
  } finally {
    updateButton.classList.remove("checking");
    updateButton.setAttribute("aria-label", "Έλεγχος για ενημέρωση");
  }
}

async function setupServiceWorker() {
  const completedUpdate = sessionStorage.getItem(UPDATE_COMPLETE_KEY);
  if (completedUpdate) {
    sessionStorage.removeItem(UPDATE_COMPLETE_KEY);
    showUpdateStatus("updated", "Η ενημέρωση ολοκληρώθηκε", `Το Spirit Slasher είναι τώρα στην έκδοση v${APP_VERSION}.`, 6000);
  }
  if (!("serviceWorker" in navigator)) {
    showUpdateStatus("info", "Οι αυτόματες ενημερώσεις δεν υποστηρίζονται", `Τρέχεις την έκδοση v${APP_VERSION}. Άνοιξε το παιχνίδι από σύγχρονο browser.`);
    return;
  }
  const hadController = Boolean(navigator.serviceWorker.controller);
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController || refreshing) return;
    refreshing = true;
    sessionStorage.setItem(UPDATE_COMPLETE_KEY, APP_VERSION);
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
          showUpdateStatus("available", "Η νέα έκδοση είναι έτοιμη", "Εφαρμόζεται τώρα και το παιχνίδι θα ανοίξει ξανά αυτόματα.", 0);
          installing.postMessage({ type: "SKIP_WAITING" });
        }
      });
    });
    if (!completedUpdate) await checkForUpdate(false);
    setInterval(() => checkForUpdate(false), 15 * 60 * 1000);
  } catch {
    showUpdateStatus("error", "Το update system δεν συνδέθηκε", `Η έκδοση v${APP_VERSION} λειτουργεί κανονικά. Πάτησε ↻ όταν είσαι online.`);
  }
}

updateButton.addEventListener("click", () => checkForUpdate(true));

soundButton.textContent = settings.sound ? "♪" : "×";
registerWebMCP();
window.addEventListener("load", setupServiceWorker, { once: true });
renderHome();
