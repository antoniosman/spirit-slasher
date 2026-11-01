const app = document.querySelector("#app");
const toastNode = document.querySelector("#toast");
const transitionNode = document.querySelector("#transition");
const introAudio = document.querySelector("#introAudio");
const outroAudio = document.querySelector("#outroAudio");
const funeralAudio = document.querySelector("#funeralAudio");
const killerMemorialAudio = document.querySelector("#killerMemorialAudio");
const winnersAudio = document.querySelector("#winnersAudio");
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
const UPDATE_RESUME_KEY = "spirit-slasher-resume-after-update";
const UPDATE_RESUMED_KEY = "spirit-slasher-resumed-after-update";
const APP_VERSION = "1.25.0";
const SAVE_TRANSFER_VERSION = 1;
const LOCAL_PENDING = Symbol("local-pending");
const GITHUB_ASSET_BASE = "https://antoniosman.github.io/spirit-slasher/";

function assetUrl(path) {
  const base = String(window.SPIRIT_ASSET_BASE || GITHUB_ASSET_BASE).replace(/\/+$/, "");
  return `${base}/${String(path || "").replace(/^\/+/, "")}`;
}

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
  ["Sargenie", "char_sargenie-hq.png"], ["Smaragda", "char_smaragda-hq.png"],
  ["Sorina", "char_sorina.png"], ["Tony", "char_tony.webp"],
  ["Vicky", "char_vicky.jpg"], ["Vincent", "char_vincent.jpg"],
  ["Violet", "char_violet.png"], ["Zoe", "char_zoe-hq.png"]
].map(([name, file]) => ({ name, file }));

const cinematicCharacterFiles = {
  Sargenie: "char_sargenie-cinematic.png",
  Smaragda: "char_smaragda-cinematic.png",
  Zoe: "char_zoe-cinematic.png"
};

const characterGenders = {
  Alex: "female", Billy: "male", Catherine: "female", Demarin: "female",
  Elisa: "female", Ester: "female", Eva: "female", Evelyn: "female",
  Evaggelia: "female", Hope: "female", Ian: "male", Irene: "female", Jasmine: "female", Luna: "female", Paul: "male",
  Pauline: "female", Phillip: "male", Rino: "male", Sargenie: "male",
  Smaragda: "female", Sorina: "female", Tony: "male", Vicky: "female",
  Vincent: "male", Violet: "female", Zoe: "female"
};
function isFemale(name) { return characterGenders[name] === "female"; }
function subjectName(name, lower = false) { const article = isFemale(name) ? (lower ? "η" : "Η") : (lower ? "ο" : "Ο"); return `${article} ${name}`; }
function accusativeName(name) { return `${isFemale(name) ? "την" : "τον"} ${name}`; }
function toName(name) { return `${isFemale(name) ? "στην" : "στον"} ${name}`; }
function genitiveName(name) { return `${isFemale(name) ? "της" : "του"} ${name}`; }
function genderWord(name, male, female) { return isFemale(name) ? female : male; }

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
  "Εμμονή", "Ζήλια", "Συγκάλυψη", "Δόξα και notoriety", "Χειραγώγηση",
  "Κληρονομιά που κλάπηκε", "Ενοχή επιζώντα", "Εκβιασμός που ξέφυγε",
  "Αντιγραφή ενός παλιού εγκλήματος", "Διαγραφή ενός μάρτυρα",
  "Λατρεία της μάσκας", "Πείραμα κοινωνικού ελέγχου", "Μυστική συμφωνία",
  "Τιμωρία για μια εγκατάλειψη", "Ανάγκη να ξαναγράψει το τέλος"
];
const movieWorlds = {
  1: {
    asset: assetUrl("assets/locations/movie-1-atlas.webp"),
    rooms: [
      { name: "Το γυάλινο foyer", hint: "Η βροχή έχει σβήσει τα ίχνη έξω από τη σπασμένη πόρτα.", position: "0% 0%" },
      { name: "Το υπόγειο πλυντήριο", hint: "Ο ηλεκτρικός πίνακας έκλεισε από ανθρώπινο χέρι.", position: "100% 0%" },
      { name: "Το πνιγμένο θερμοκήπιο", hint: "Κάποιος έκρυψε ένα δεύτερο κινητό κάτω από τις γλάστρες.", position: "0% 100%" },
      { name: "Η προβλήτα της λίμνης", hint: "Ένα σκοινί κόπηκε καθαρά λίγα λεπτά πριν τη θύελλα.", position: "100% 100%" }
    ]
  },
  2: {
    asset: assetUrl("assets/locations/movie-2-atlas.webp"),
    rooms: [
      { name: "Το πανεπιστημιακό film archive", hint: "Έξι frames λείπουν ακριβώς πριν από τον πρώτο φόνο.", position: "0% 0%" },
      { name: "Η νεκρή αίθουσα προβολής", hint: "Ο προβολέας άναψε μόνος του στις 01:13.", position: "100% 0%" },
      { name: "Ο neon διάδρομος του motel", hint: "Μια βρεγμένη κάρτα δωματίου δεν ανήκει σε κανέναν από το cast.", position: "0% 100%" },
      { name: "Το service basement του νοσοκομείου", hint: "Το ασανσέρ κλήθηκε από όροφο που έχει σφραγιστεί.", position: "100% 100%" }
    ]
  },
  3: {
    asset: assetUrl("assets/locations/movie-3-atlas.webp"),
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

const finalInvestigationOpenings = [
  ["Ένα ασύνδετο intercom ξυπνά.", "Μια φωνή διαβάζει τον αριθμό του επόμενου δωματίου."],
  ["Το τελευταίο φως αλλάζει χρώμα.", "Ένα emergency strip σχηματίζει βέλος που δεν υπήρχε πριν."],
  ["Η μπομπίνα γυρίζει μόνη της.", "Ένα κρυμμένο frame εμφανίζεται μόνο για δύο δευτερόλεπτα."],
  ["Ένα κινητό νεκρού χτυπά.", "Στην οθόνη υπάρχει live φωτογραφία από διπλανό διάδρομο."],
  ["Το πάτωμα αποκαλύπτει καταπακτή.", "Κάτω από τη σκόνη φαίνονται φρέσκα ίχνη παπουτσιών."],
  ["Η κάμερα ασφαλείας στρέφεται πάνω σου.", "Το feed δείχνει δέκα λεπτά από το μέλλον."],
  ["Μια πόρτα γράφει το όνομά σου.", "Το χρώμα είναι ακόμη υγρό και η κλειδαριά μόλις άνοιξε."],
  ["Ο χάρτης καίγεται από το κέντρο.", "Μένει άθικτη μόνο μία διαδρομή προς το archive."],
  ["Ακούγεται μια δεύτερη δική σου φωνή.", "Η ηχογράφηση περιγράφει στοιχείο που δεν έχεις βρει ακόμη."],
  ["Το ρεύμα επιστρέφει σε ένα μόνο δωμάτιο.", "Πίσω από το τζάμι κάποιος άφησε έναν φάκελο με αίμα."]
];
const finalInvestigationRisks = [
  "Η διαδρομή μπορεί να κλειδώσει πίσω σου.", "Ο killer μπορεί να περιμένει μέσα στο σκοτάδι.",
  "Το εύρημα ίσως είναι τέλεια κατασκευασμένο άλλοθι.", "Κάθε λεπτό δίνει στους killers χρόνο να μετακινήσουν θύμα.",
  "Ένα λάθος βήμα θα σβήσει τα υπόλοιπα στοιχεία.", "Η εικόνα μπορεί να είναι deepfake από παλιό footage.",
  "Κάποιος από το group επιμένει ότι είναι παγίδα.", "Το δωμάτιο συνδέεται με δύο αντίθετες εξόδους.",
  "Το στοιχείο κατονομάζει άνθρωπο που μόλις έσωσες.", "Η αντίστροφη μέτρηση αφήνει μόνο μία προσπάθεια."
];
const secondAttackOpenings = [
  ["Η εικόνα κόβεται στη μέση ενός frame.", (name, room) => `${subjectName(name)} εμφανίζεται για ένα δευτερόλεπτο στο security feed από το «${room}». Πίσω ${genitiveName(name)} κινείται μια δεύτερη σκιά.`],
  ["Ο projector δείχνει ζωντανή καταδίωξη.", (name, room) => `Το πλάνο ακολουθεί ${accusativeName(name)} μέσα στο «${room}», παρότι κανείς δεν κρατάει κάμερα.`],
  ["Ένα emergency light αναβοσβήνει τρεις φορές.", (name, room) => `${subjectName(name)} έχει κλειδωθεί στο «${room}». Κάθε αναλαμπή φέρνει τη μάσκα πιο κοντά.`],
  ["Το ασανσέρ ανοίγει χωρίς καμπίνα.", (name, room) => `Από το σκοτάδι ακούς ${accusativeName(name)} στο «${room}» και μετά το μεταλλικό σύρσιμο μιας παγίδας.`],
  ["Το live stream αποκτά αντίστροφη μέτρηση.", (name, room) => `${subjectName(name)} είναι ${genderWord(name, "μόνος", "μόνη")} στο «${room}». Το countdown τελειώνει πριν προλάβεις να εξηγήσεις τι συμβαίνει.`],
  ["Οι πυράντοχες πόρτες κλείνουν διαδοχικά.", (name, room) => `${subjectName(name)} τρέχει στο «${room}», ενώ κάθε πόρτα κόβει ακόμη μία πιθανή έξοδο.`],
  ["Μια κάμερα πέφτει στο πάτωμα.", (name, room) => `Το τελευταίο πλάνο δείχνει ${accusativeName(name)} να κρύβεται στο «${room}» πριν μια μπότα συνθλίψει τον φακό.`],
  ["Το radio επαναλαμβάνει την ίδια κραυγή.", (name, room) => `Η φωνή ${genitiveName(name)} ακούγεται από τρεις συχνότητες ταυτόχρονα, αλλά μόνο μία οδηγεί στο «${room}».`],
  ["Ένα παράθυρο γράφει HELP από μέσα.", (name, room) => `${subjectName(name)} βρίσκεται πίσω από το τζάμι στο «${room}» και μια φιγούρα σβήνει τα γράμματα ένα-ένα.`],
  ["Ο συναγερμός ανακοινώνει λάθος όνομα.", (name, room) => `Το σύστημα λέει ότι ${subjectName(name, true)} έχει ήδη πεθάνει, ενώ το live feed ${genitiveName(name)} συνεχίζει από το «${room}».`]
];
const secondAttackComplications = [
  "Η συντομότερη διαδρομή έχει γεμίσει καπνό.", "Κάποιος άλλαξε τις πινακίδες εξόδου.",
  "Ένα δεύτερο τηλέφωνο δίνει αντίθετες οδηγίες.", "Το πάτωμα υποχωρεί κάθε δεκαπέντε δευτερόλεπτα.",
  "Ο killer έχει αφήσει το αληθινό clue πάνω σε pressure plate.", "Μια γνώριμη φωνή ζητά να μην ανοίξεις την πόρτα.",
  "Το emergency map δείχνει δωμάτιο που δεν υπάρχει.", "Η μάσκα άφησε δύο διαφορετικά ίχνη αίματος.",
  "Το ρεύμα αρκεί είτε για την πόρτα είτε για τις κάμερες.", "Ένας masked accomplice περιμένει στη δεύτερη έξοδο."
];
function buildFinalInvestigationScenario(movie) {
  const id = Math.abs((current.seed + movie.number * 7919 + (movie.openingScenario?.id || 0) * 101 + movie.choices.length * 17) % 100);
  const opening = finalInvestigationOpenings[id % 10];
  const risk = finalInvestigationRisks[Math.floor(id / 10)];
  return { id: id + 1, title: opening[0], body: `${opening[1]} ${risk}` };
}
function buildSecondAttackScenario(movie, target, room) {
  const id = Math.abs((current.seed + movie.number * 3571 + (movie.openingScenario?.id || 0) * 43 + movie.choices.length * 29) % 100);
  const opening = secondAttackOpenings[id % 10];
  return { id: id + 1, title: opening[0], body: `${opening[1](target, room.name)} ${secondAttackComplications[Math.floor(id / 10)]}` };
}

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
    body: `${subjectName(target)} και ${subjectName(partner, true)} έχουν απομονωθεί όταν ${incident.event}. ${complication} Έχεις μόνο μία κίνηση πριν χωριστούν.`,
    choices: [openingActions.protect[actionIndex], openingActions.authority[(actionIndex + 3) % 10], openingActions.intervene[(actionIndex + 6) % 10]],
    time: `${String(10 + Math.floor(random() * 2)).padStart(2, "0")}:${String(Math.floor(random() * 60)).padStart(2, "0")} PM`
  };
}
const featureCopy = [
  ["100 opening scenarios", "Κάθε movie τραβά έναν από 100 συνδυασμούς opening — όχι πάντα τηλέφωνο, όχι πάντα την ίδια παγίδα ή επιλογές."],
  ["Hidden relationship engine", "Trust, friendship, suspicion, fear, loyalty και knowledge αλλάζουν αθόρυβα τις σκηνές."],
  ["Life-sim Relationship Board", "Portrait tiles, canon συγγένειες και εμφανή friendship, trust, loyalty και suspicion statuses δείχνουν γιατί κάθε δεσμός έχει σημασία."],
  ["Random relationship events", "Καβγάδες, πένθος, όρκοι, κατηγορίες, rivalry και confessions γεννιούνται από το συγκεκριμένο cast και μπορεί να είναι ειλικρινή ή χειριστικά."],
  ["Real clues & red herrings", "Τα στοιχεία είναι αληθινά, αλλά η ερμηνεία τους μπορεί να σε οδηγήσει στον λάθος άνθρωπο."],
  ["120 room variants", "Τρία cinematic map atlases γίνονται 120 διαφορετικά sub-rooms, routes, clues και scene orders σε κάθε canon."],
  ["Accusation history", "Το παιχνίδι θυμάται την πρώτη, τη μεσαία και την τελική θεωρία σου και μετρά τι πρόβλεψες."],
  ["Independent NPC minds", "Κάθε NPC χτίζει δική του υποψία από προσωπικές παρατηρήσεις, μπορεί να μπλοφάρει και δεν επαναλαμβάνει μηχανικά τα ίδια λόγια ή τη θεωρία του παίκτη."],
  ["Local 2–3P pass-the-phone", "Διάλεξε δύο ή τρεις χαρακτήρες. Στο 3P μπορείς προαιρετικά να ενεργοποιήσεις μυστικό human killer μόνο στο Movie III, με ιδιωτικό role reveal, μπλόφες και κρυφό sabotage."],
  ["Legacy survivors", "Οι σημαντικές σχέσεις και οι επιζώντες επιστρέφουν. Οι πιο πιστοί δεν πετιούνται άδικα στο opening kill του sequel."],
  ["Movie III mastermind", "Μόνο στο Final Chapter υπάρχει πιθανότητα να κρύβεται ακριβώς ένας παλιός killer — ποτέ στο intro και ποτέ ως κανονικός χαρακτήρας."],
  ["Fictional killer betting", "Πόνταρε Slasher Credits στη final theory: 2× για πλήρη ακριβή πρόβλεψη ή αναλογική επιστροφή για μερική επιτυχία — χωρίς πραγματικά χρήματα."],
  ["Outcome-built credits", "Το outro μοντάρεται από το αποτέλεσμα: εσύ, οι φίλοι σου, οι killers και μετά όλο το cast."],
  ["Portrait memorial finale", "Μετά το Movie III, κάθε επιβεβαιωμένος νεκρός εμφανίζεται σε ξεχωριστό portrait memorial με τη σειρά που πέθανε — οι killers μένουν εκτός In Memoriam."],
  ["Unlimited Save Vault", "Όσα local universes θέλεις, με ονόματα, αναζήτηση, ταξινόμηση και scrollable επιλογή χωρίς αντικατάσταση παλιού save."],
  ["Cross-device save transfer", "Κάνε export ή share ένα ή όλα τα saves και import το αρχείο σε άλλη συσκευή, ακόμη και από το iPhone share sheet."],
  ["Offline PWA", "Εγκαθίσταται σε Android και iOS, κρατά τα saves στη συσκευή και παίζει offline μετά την πρώτη φόρτωση."]
];

let saves = loadJSON(STORAGE_KEY, []);
let settings = loadJSON(SETTINGS_KEY, { sound: true });
let current = null;
let introTimer = null;
let creditTimer = null;
let memorialTimer = null;
let survivorTimer = null;
let killerRevealTimer = null;
let funeral3DStop = null;
let sceneWebGLStops = [];
let deferredInstallPrompt = null;
let swRegistration = null;
let audioContext = null;
let onlineSession = null;
let onlineWatchingCode = null;
let onlineSessionSignature = "";
let onlineEngineStartedCode = null;
let onlineLivePanel = null;
let onlineChatDock = null;
let onlineChatOpen = false;
let onlineChatLastSeenId = "";
let onlinePortalView = "signin";
let onlineChoiceCapture = null;
let updateCheckInFlight = false;
let onlineStoryPublishTimer = null;
let onlineStoryPublishing = false;
let onlineStoryPublishSignature = "";

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
  persistSaves();
  // Player 1 is the single story author in Online mode. Debouncing keeps the
  // canonical snapshot cheap while still making every scene/outcome visible
  // to the other browsers.
  if (isOnlineEngine() && isOnlineStoryAuthoritative()) {
    clearTimeout(onlineStoryPublishTimer);
    onlineStoryPublishTimer = setTimeout(() => publishOnlineStoryState(), 90);
  }
}

function buildTransferPayload(selectedSaves) {
  return {
    format: "spirit-slasher-save-transfer",
    transferVersion: SAVE_TRANSFER_VERSION,
    gameVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    saves: selectedSaves.map(save => JSON.parse(JSON.stringify(save)))
  };
}

async function transferSaves(selectedSaves, label = "spirit-slasher-saves") {
  if (!selectedSaves.length) return toast("Δεν υπάρχουν saves για μεταφορά.");
  const payload = JSON.stringify(buildTransferPayload(selectedSaves), null, 2);
  const fileName = `${label.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "spirit-slasher"}.json`;
  const blob = new Blob([payload], { type: "application/json" });
  let file = null;
  try { file = new File([blob], fileName, { type: "application/json" }); } catch {}
  try {
    if (file && navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ title: "Spirit Slasher Save", text: "Μεταφορά canon σε άλλη συσκευή", files: [file] });
      toast("Το save άνοιξε στο share sheet.");
      return;
    }
  } catch (error) {
    if (error?.name === "AbortError") return;
  }
  const url = URL.createObjectURL(file || blob);
  const link = el("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("Το αρχείο save κατέβηκε. Στείλε το στην άλλη συσκευή.");
}

function isValidImportedSave(save) {
  return save && typeof save === "object" && character(save.protagonist) && (!save.playerCharacters || save.playerCharacters.every(character)) && Number.isFinite(Number(save.seed)) && Array.isArray(save.history) && save.relationships && typeof save.relationships === "object";
}

async function importSaveFile(file) {
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) return toast("Το αρχείο είναι μεγαλύτερο από 10 MB.");
  try {
    const parsed = JSON.parse(await file.text());
    const candidates = Array.isArray(parsed?.saves) ? parsed.saves : isValidImportedSave(parsed) ? [parsed] : [];
    const valid = candidates.filter(isValidImportedSave);
    if (!valid.length) throw new Error("invalid-save");
    const now = Date.now();
    const imported = valid.map((source, index) => {
      const save = JSON.parse(JSON.stringify(source));
      const collision = saves.some(existing => existing.id === save.id);
      save.id = collision || !save.id ? `import-${now}-${index}-${Math.floor(Math.random() * 9999)}` : save.id;
      save.label = `${String(save.label || `${save.protagonist}’s Cut`).slice(0, 68)}${collision ? " · imported" : ""}`;
      save.createdAt = Number(save.createdAt) || now;
      save.updatedAt = now + index;
      return save;
    });
    saves = [...imported, ...saves];
    persistSaves();
    renderSaveVault();
    toast(`${imported.length} save${imported.length === 1 ? "" : "s"} μεταφέρθηκαν επιτυχώς.`);
  } catch {
    toast("Το αρχείο δεν είναι έγκυρο Spirit Slasher save.");
  }
}

function chooseSaveImport() {
  const input = el("input");
  input.type = "file";
  input.accept = "application/json,.json";
  input.hidden = true;
  input.addEventListener("change", async () => {
    await importSaveFile(input.files?.[0]);
    input.remove();
  }, { once: true });
  document.body.append(input);
  input.click();
}

function character(name) { return roster.find(item => item.name === name); }
function imagePath(name) { return assetUrl(`assets/characters/${character(name)?.file || "char_billy.webp"}`); }
function cinematicImagePath(name) { return assetUrl(`assets/characters/${cinematicCharacterFiles[name] || character(name)?.file || "char_billy.webp"}`); }
function allNames() { return roster.map(item => item.name); }
function playerCharacters() {
  if (current?.gameMode === "online" && current.onlineGroupCharacters?.length) return unique(current.onlineGroupCharacters);
  return unique(current?.playerCharacters?.length ? current.playerCharacters : [current?.protagonist].filter(Boolean));
}
function onlineGroupCharacters() {
  if (current?.gameMode !== "online") return [];
  return unique(current.onlineGroupCharacters?.length ? current.onlineGroupCharacters : playerCharacters());
}
function castPlayerCharacters() {
  return current?.gameMode === "online" ? onlineGroupCharacters() : playerCharacters();
}
function isPlayerCharacter(name) { return castPlayerCharacters().includes(name); }
function isLocalMode() { return current?.gameMode === "local" && playerCharacters().length > 1; }
function isMultiplayerMode() { return current?.gameMode !== "single" && playerCharacters().length > 1; }
function activePlayerName() {
  // The online story is shared, but each browser still has its own profile
  // viewer for relationship labels and avatar copy.
  if (current?.gameMode === "online") return current?.protagonist;
  return playerCharacters()[current?.activePlayerIndex || 0] || current?.protagonist;
}
function passLocalTurn() {
  if (!isLocalMode()) return;
  const currentIndex = Number.isInteger(current.activePlayerIndex) ? current.activePlayerIndex : 0;
  current.activePlayerIndex = (currentIndex + 1) % playerCharacters().length;
  saveCurrent();
  toast(`Σειρά: ${activePlayerName()}`);
  renderMovie();
}
function isWeaponItem(item) { return ["bolt cutter", "flare gun"].includes(item); }
function playerHasWeapon() { return isWeaponItem(current?.movie?.survivalItem) && Boolean(current?.movie?.itemKept); }
function relationshipState(name, viewer = activePlayerName()) {
  return current?.relationshipsByPlayer?.[viewer]?.[name] || current?.relationships?.[name] || {};
}
function friendsForPlayer(player = activePlayerName()) {
  return current?.movie?.playerFriends?.[player] || current?.movie?.friends || [];
}
function innerCircleMembers() {
  const movie = current?.movie;
  if (!movie) return [];
  return unique([
    ...(movie.friends || []),
    ...Object.values(movie.playerFriends || {}).flat(),
    ...(movie.continuityFriends || [])
  // Never remove a hidden killer from an item menu. Disappearing from the
  // Inner Circle would reveal the twist before the story does.
  ]).filter(name => !isPlayerCharacter(name) && isAlive(name));
}
function describeLocalChoice(value) {
  if (Array.isArray(value)) return value.join(" · ");
  if (value === null) return "Κράτησε το αντικείμενο / δεν επέλεξε παραλήπτη";
  if (typeof value === "boolean") return value ? "Ρίσκαρε για τη διάσωση" : "Προστάτεψε το στοιχείο";
  if (value && typeof value === "object") {
    if (value.choice) return `${value.choice}${value.closest ? ` · στόχος: ${value.closest}` : ""}`;
    return `${value.name || "Επιλογή"} · ${value.shared ? "Μοιράστηκε το στοιχείο" : "Κράτησε το στοιχείο κρυφό"}`;
  }
  return String(value);
}
function describeOnlineChoice(value) {
  if (value && typeof value === "object" && value.label) return value.label;
  return describeLocalChoice(value);
}
function localChoiceRecap(resolution) {
  if (!resolution?.choices) return "";
  return playerCharacters().map(player => `${player}: ${describeLocalChoice(resolution.choices[player])}`).join(" · ");
}
function localDecisionTitle(key) {
  return String(key || "story decision")
    .replace(/^movie-\d+-/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, letter => letter.toUpperCase());
}
function renderLocalActionLog() {
  if (!isMultiplayerMode()) return null;
  const history = current?.movie?.localDecisionHistory || [];
  if (!history.length) return null;
  const panel = el("section", "panel local-action-log");
  const heading = el("div", "local-action-log-heading");
  heading.append(
    el("span", "eyebrow", isOnlineEngine() ? "ONLINE PARTY · SHARED ACTION LOG" : `LOCAL ${playerCharacters().length}P · SHARED ACTION LOG`),
    el("small", "", isOnlineEngine() ? "Το ίδιο Local flow καταγράφεται για όλους τους συνδεδεμένους παίκτες." : "Οι επιλογές και τα αποτελέσματα μένουν ορατά σε όλους τους local players.")
  );
  panel.append(heading);
  const entries = el("div", "local-action-log-list");
  history.slice(-4).forEach((entry, index) => {
    const row = el("article", "local-action-entry");
    row.append(el("strong", "", `${history.length - history.slice(-4).length + index + 1}. ${localDecisionTitle(entry.key)}`));
    playerCharacters().forEach(player => {
      const choice = el("span", "local-action-choice");
      choice.append(el("b", "", player), el("small", "", describeLocalChoice(entry.choices?.[player])));
      row.append(choice);
    });
    entries.append(row);
  });
  panel.append(entries);
  return panel;
}
function buildRelationshipBoard(player, source = null) {
  const board = Object.fromEntries(allNames().map(name => [name, {
    trust: name === player ? 100 : 0,
    friendship: name === player ? 100 : 0,
    suspicion: 0, fear: 0, loyalty: 0, knowledge: 0
  }]));
  if (source) Object.entries(source).forEach(([name, state]) => { if (board[name]) Object.assign(board[name], state); });
  relations.forEach(([a, b]) => {
    if (a === player && board[b]) Object.assign(board[b], { trust: Math.max(board[b].trust, 30), friendship: Math.max(board[b].friendship, 42), loyalty: Math.max(board[b].loyalty, 34) });
    if (b === player && board[a]) Object.assign(board[a], { trust: Math.max(board[a].trust, 30), friendship: Math.max(board[a].friendship, 42), loyalty: Math.max(board[a].loyalty, 34) });
  });
  return board;
}
function localDecision(key, value, resolver = values => values.at(-1)) {
  if (!isMultiplayerMode()) return value;
  if (isOnlineEngine()) {
    // Online uses the exact Local pass-the-phone decision contract. During a
    // click we capture the real gameplay value without advancing the scene;
    // once every remote turn is locked, Player 1 replays the same resolver
    // with all values in player order and publishes the single shared result.
    if (onlineChoiceCapture) {
      onlineChoiceCapture.key = key;
      onlineChoiceCapture.value = value;
      onlineChoiceCapture.resolver = resolver;
      return LOCAL_PENDING;
    }
    if (current.onlineResolvedChoices) {
      const movie = current.movie;
      const ordered = (onlineSession?.players || []).map(player => ({
        player: player.character || player.username,
        submission: current.onlineResolvedChoices[player.username]
      })).filter(entry => entry.submission !== undefined);
      const values = ordered.map(entry => entry.submission?.choice ?? entry.submission);
      const choices = Object.fromEntries(ordered.map((entry, index) => [entry.player, values[index]]));
      movie.localDecisionHistory ||= [];
      movie.localDecisionHistory.push({ key, choices });
      movie.lastLocalResolution = { key, choices };
      return resolver(values);
    }
    return LOCAL_PENDING;
  }
  const movie = current.movie;
  movie.localDecisions ||= {};
  const bucket = movie.localDecisions[key] ||= {};
  const player = activePlayerName();
  bucket[player] = value;
  const players = playerCharacters();
  const missing = players.find(name => bucket[name] === undefined);
  if (missing) {
    current.activePlayerIndex = players.indexOf(missing);
    movie.localTurnNotice = { key, player, choice: value, nextPlayer: missing };
    saveCurrent();
    toast(`${player} κλείδωσε την επιλογή. Τώρα αποφασίζει ${subjectName(missing, true)}.`);
    renderMovie();
    return LOCAL_PENDING;
  }
  const values = players.map(name => bucket[name]);
  movie.localDecisionHistory ||= [];
  movie.localDecisionHistory.push({ key, choices: Object.fromEntries(players.map(name => [name, bucket[name]])) });
  movie.lastLocalResolution = { key, choices: Object.fromEntries(players.map(name => [name, bucket[name]])) };
  movie.localTurnNotice = null;
  delete movie.localDecisions[key];
  current.activePlayerIndex = 0;
  saveCurrent();
  return resolver(values);
}

function isOnlineEngine() {
  return current?.gameMode === "online" && Boolean(current.onlineSessionCode) && Boolean(window.SpiritOnline);
}

function isOnlineStoryAuthoritative() {
  if (!isOnlineEngine()) return false;
  const firstPlayer = onlineSession?.players?.[0]?.username;
  return Boolean(firstPlayer && firstPlayer === current?.onlineUsername);
}

function onlineDecisionKey() {
  const movie = current.movie;
  const revision = Number(onlineSession?.sceneState?.revision || current.onlineSceneRevision || 0);
  return `movie-${movie.number}-stage-${movie.stage}-rev-${revision}-choice-${movie.choices.length}`;
}

function onlineDecisionScope() {
  // The server collects the ordered player turns, then resolves one shared
  // decision round. Player 1 is the canonical story author for the outcome.
  return "personal";
}

function onlineTurnLabel(session = onlineSession) {
  const turn = session?.turn;
  if (!turn || turn.mode === "shared") return "SHARED DECISION · everyone may choose";
  if (turn.mode === "advance") return "OUTCOMES COMPLETE · syncing the next scene";
  if (turn.pendingUsername) return `SYNCING SCENE · ${turn.username || "player"} is finishing`;
  return `NOW DECIDING · ${turn.username || "player"}`;
}

function onlineCanAct(session = onlineSession) {
  const turn = session?.turn;
  if (!turn || turn.mode === "shared") return true;
  if (turn.mode !== "personal") return false;
  return !turn.pendingUsername && turn.username === current?.onlineUsername;
}

function onlineStoryPayload() {
  if (!current) return null;
  // Keep connection identity local to each browser, but publish every field
  // that can affect procedural scenes, relationships and outcomes.
  const fields = [
    "seed", "protagonist", "playerCharacters", "onlineGroupCharacters", "gameMode",
    "movieNumber", "movie", "history", "onlineScenarioHistory", "relationships",
    "relationshipsByPlayer", "playerCredits", "credits", "activePlayerIndex",
    "completed", "survivorCelebrationPending", "finalSequence", "label"
  ];
  const state = {};
  fields.forEach(field => {
    if (current[field] !== undefined) state[field] = current[field];
  });
  state.playerCharacters = playerCharacters();
  state.onlineGroupCharacters = onlineGroupCharacters();
  state.gameMode = "online";
  return JSON.parse(JSON.stringify(state));
}

function publishOnlineStoryState() {
  if (!isOnlineEngine() || !isOnlineStoryAuthoritative() || !window.SpiritOnline?.updateStoryState) return;
  if (onlineStoryPublishing) {
    clearTimeout(onlineStoryPublishTimer);
    onlineStoryPublishTimer = setTimeout(() => publishOnlineStoryState(), 180);
    return;
  }
  const state = onlineStoryPayload();
  if (!state) return;
  const signature = JSON.stringify(state);
  if (signature === onlineStoryPublishSignature) return;
  onlineStoryPublishing = true;
  window.SpiritOnline.updateStoryState(current.onlineSessionCode, state)
    .then(result => {
      onlineStoryPublishSignature = signature;
      current.onlineStoryRevision = Number(result.revision || result.session?.storyState?.revision || current.onlineStoryRevision || 0);
      if (result.session) {
        rememberOnlineSession(result.session);
        onlineSessionSignature = "";
        updateOnlineLivePanel(onlineSession);
      }
    })
    .catch(error => onlineFailure(error))
    .finally(() => { onlineStoryPublishing = false; });
}

function applyOnlineStoryState(session = onlineSession) {
  const snapshot = session?.storyState;
  const revision = Number(snapshot?.revision || 0);
  if (!isOnlineEngine() || !snapshot?.state || !revision || revision <= Number(current.onlineStoryRevision || 0)) return false;
  const localIdentity = {
    id: current.id,
    protagonist: current.protagonist,
    onlineUsername: current.onlineUsername,
    onlineSessionCode: current.onlineSessionCode,
    onlineGroupCharacters: onlineGroupCharacters(),
    playerCharacters: playerCharacters()
  };
  const state = JSON.parse(JSON.stringify(snapshot.state));
  Object.assign(current, state);
  current.id = localIdentity.id;
  current.protagonist = localIdentity.protagonist;
  current.onlineUsername = localIdentity.onlineUsername;
  current.onlineSessionCode = localIdentity.onlineSessionCode;
  current.onlineGroupCharacters = unique(state.onlineGroupCharacters?.length ? state.onlineGroupCharacters : localIdentity.onlineGroupCharacters);
  current.playerCharacters = [...current.onlineGroupCharacters];
  current.gameMode = "online";
  current.onlineStoryRevision = revision;
  current.onlineSceneRevision = Number(session.sceneState?.revision || current.onlineSceneRevision || 0);
  current.onlineLastDecisionKey = session.sceneState?.lastDecision?.key || current.onlineLastDecisionKey || null;
  current.onlinePendingDecision = null;
  current.onlineAwaitingStory = false;
  current.onlineDecisionNotice = session.sceneState?.lastDecision?.choices
    ? { key: session.sceneState.lastDecision.key, choices: session.sceneState.lastDecision.choices, player: current.onlineUsername }
    : null;
  current.onlineRoundComplete = session.turn?.mode === "advance";
  onlineStoryPublishSignature = JSON.stringify(onlineStoryPayload());
  saveCurrent();
  stopTimers();
  if (current.completed) {
    current.finalSequence ||= "archive";
    if (current.finalSequence === "survivors") renderSurvivorsCelebration();
    else if (current.finalSequence === "funeral") renderFuneral();
    else if (current.finalSequence === "killers") renderKillerMemorial();
    else renderTrilogyArchive();
    return true;
  }
  renderMovie();
  return true;
}

function syncOnlineSceneState(session) {
  const shared = session?.sceneState;
  if (!isOnlineEngine() || !current?.movie || !shared) return false;
  // Hydrate the canonical story before considering the lightweight scene
  // cursor. This is what prevents three browsers from running three random
  // versions of the same movie.
  if (applyOnlineStoryState(session)) return true;
  // The server publishes stage 1 as soon as the host starts the session, but
  // every client still has to watch its own cast intro first.  Advancing here
  // used to replace the intro overlay with a blank/frozen scene.
  if (current.movie.stage === 0) return false;
  // Do not interrupt a player's local cinematic outcome when another player
  // resolves the same round. The next poll will apply the revision after the
  // beat's Continue button returns to the shared scene.
  if (current.movie.pendingBeat) return false;
  const targetMovie = Number(shared.movie);
  const targetStage = Number(shared.stage);
  if (!Number.isInteger(targetMovie) || !Number.isInteger(targetStage)) return false;
  if (targetMovie < current.movie.number || (targetMovie === current.movie.number && targetStage < current.movie.stage)) return false;
  const decisionKey = shared.lastDecision?.key || "";
  const samePosition = targetMovie === current.movie.number && targetStage === current.movie.stage;
  const hasNewSharedState = Number(shared.revision || 0) > Number(current.onlineSceneRevision || 0) || (decisionKey && decisionKey !== current.onlineLastDecisionKey);
  if (samePosition && !hasNewSharedState) return false;
  if (targetMovie > current.movie.number) {
    current.movie = null;
    current.movieNumber = targetMovie;
    current.onlineScenePublishKey = null;
    current.onlineSceneRevision = 0;
    current.onlineLastDecisionKey = null;
    startMovie(targetMovie);
    toast(`Το κοινό session προχώρησε στο ${movieLabel(targetMovie)}.`);
    return true;
  }
  current.movie.stage = targetStage;
  current.movie.pendingBeat = null;
  current.movie.pendingNextStage = null;
  current.onlinePendingDecision = null;
  current.onlineRoundComplete = false;
  current.onlineScenePublishKey = `${targetMovie}:${targetStage}:${shared.scene}`;
  current.onlineSceneRevision = Number(shared.revision || 0);
  if (shared.lastDecision?.choices) {
    current.onlineLastDecisionKey = shared.lastDecision.key;
    current.onlineDecisionNotice = { key: shared.lastDecision.key, choices: shared.lastDecision.choices, player: current.onlineUsername };
  }
  saveCurrent();
  toast(`Κοινός συγχρονισμός: ${shared.scene}`);
  renderMovie();
  return true;
}

function onlineDecisionResolved(session, key, player) {
  return session?.history?.find(event => event.type === "decision-resolved" && event.key === key && event.choices?.[player] !== undefined) || null;
}

function finishOnlineDecision(key, player, action, session) {
  const resolved = onlineDecisionResolved(session, key, player);
  if (!resolved || current?.onlinePendingDecision?.key !== key) return false;
  rememberOnlineSession(session);
  current.onlinePendingDecision = null;
  current.onlineRoundComplete = session?.turn?.mode === "advance";
  current.onlineDecisionNotice = { key, choices: resolved.choices || {}, player };
  current.onlineResolvedChoices = resolved.choices || {};
  if (isOnlineStoryAuthoritative()) {
    action();
    // Most actions call saveCurrent themselves; this covers actions that only
    // change the scene cursor and makes the publish intent explicit.
    publishOnlineStoryState();
  } else {
    // Non-authoritative players must never run their local closure. They wait
    // for Player 1's snapshot, otherwise each browser would fork the plot.
    current.onlineAwaitingStory = true;
    toast("Η κοινή επιλογή λύθηκε. Περιμένουμε το επόμενο shared scene…");
  }
  current.onlineResolvedChoices = null;
  return true;
}

function onlineDecisionGate(label, action) {
  if (!isOnlineEngine()) return action();
  if (!onlineCanAct()) {
    toast(`Περίμενε τη σειρά του/της ${onlineSession?.turn?.username || "άλλου παίκτη"}.`);
    return;
  }
  onlineChoiceCapture = {};
  try { action(); }
  finally {
    if (onlineChoiceCapture && onlineChoiceCapture.value === undefined) onlineChoiceCapture.value = label;
  }
  const captured = onlineChoiceCapture;
  onlineChoiceCapture = null;
  const key = `${onlineDecisionKey()}-${String(captured.key || "choice").slice(0, 60)}`;
  const scope = onlineDecisionScope();
  if (current.onlinePendingDecision?.key === key) return;
  const player = current.onlineUsername || current.protagonist;
  current.onlinePendingDecision = { key, label, player };
  document.querySelectorAll("[data-story-choice]").forEach(node => { node.disabled = true; });
  const waitForResolution = async () => {
    if (!current?.onlinePendingDecision || current.onlinePendingDecision.key !== key) return;
    try {
      const result = await window.SpiritOnline.getSession(current.onlineSessionCode);
      if (finishOnlineDecision(key, player, action, result.session)) return;
      current.onlineDecisionTimer = setTimeout(waitForResolution, 600);
    } catch {
      current.onlineDecisionTimer = setTimeout(waitForResolution, 1500);
    }
  };
  window.SpiritOnline.sendDecision(current.onlineSessionCode, key, { label, player, choice: captured.value, localKey: captured.key || "choice" }, scope)
    .then(result => {
      if (result.resolved && finishOnlineDecision(key, player, action, result.session)) return;
      current.onlineDecisionTimer = setTimeout(waitForResolution, 600);
      toast(scope === "shared" ? `Κλείδωσες: ${label}. Περιμένουμε την κοινή opening επιλογή.` : `Κλείδωσες: ${label}. Τώρα θα φανεί το outcome και μετά περνάει η σειρά.`);
    })
    .catch(error => {
      current.onlinePendingDecision = null;
      renderMovie();
      onlineFailure(error);
    });
}

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
  node.addEventListener("click", () => dataChoice ? onlineDecisionGate(text, onClick) : onClick());
  return node;
}

function screen(extra = "") {
  stopTimers();
  document.documentElement.classList.remove("intro-lock");
  document.body.classList.remove("intro-lock");
  sceneWebGLStops.forEach(stop => stop?.());
  sceneWebGLStops = [];
  document.querySelectorAll(".cast-intro, .skip").forEach(node => node.remove());
  document.querySelectorAll("[data-online-chat-dock]").forEach(node => node.remove());
  onlineChatDock = null;
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
  if (survivorTimer) clearInterval(survivorTimer);
  if (killerRevealTimer) clearTimeout(killerRevealTimer);
  introTimer = null;
  creditTimer = null;
  memorialTimer = null;
  survivorTimer = null;
  killerRevealTimer = null;
  funeral3DStop?.();
  funeral3DStop = null;
  stopMemorialScore();
}

function stopMusic() {
  [introAudio, outroAudio, funeralAudio, killerMemorialAudio, winnersAudio].forEach(audio => {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  });
}

function stopMemorialScore() {
  funeralAudio?.pause();
  if (funeralAudio) funeralAudio.currentTime = 0;
}

function playMemorialScore() {
  if (!settings.sound || !funeralAudio) return;
  stopMemorialScore();
  funeralAudio.volume = .72;
  funeralAudio.play().catch(() => {});
}

function playKillerMemorialScore() {
  if (!settings.sound || !killerMemorialAudio) return;
  killerMemorialAudio.currentTime = 0;
  killerMemorialAudio.volume = .78;
  killerMemorialAudio.play().catch(() => {});
}

function playMusic(audio, restart = true) {
  if (!settings.sound || !audio) return;
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
    button("Νέα τριλογία", "", renderModeSelect),
    ...(saves.length ? [button(`Save Vault · ${saves.length}`, "secondary", renderSaveVault)] : []),
    button("Όλα τα features", "ghost", renderFeatures)
  );
  if (deferredInstallPrompt) actions.append(button("Εγκατάσταση εφαρμογής", "secondary", installApp));
  copy.append(actions);

  const art = el("div", "home-art");
  const logo = el("img", "hero-logo");
  logo.src = assetUrl("assets/brand/spirit-slasher-logo.png");
  logo.alt = "Spirit Slasher emblem";
  art.append(logo, el("div", "chapter-stamp", "THREE FILMS / ONE CANON"));
  content.append(copy, art);
  root.append(content);
}

function renderSaveVault() {
  current = null;
  stopMusic();
  const root = screen("vault-shell");
  const content = el("div", "content vault-content");
  const head = el("div", "vault-head");
  const title = el("div");
  title.append(el("p", "eyebrow", "UNLIMITED · PORTABLE SAVE VAULT"), el("h1", "headline", "Διάλεξε ή μετέφερε το canon σου."), el("p", "section-copy", `${saves.length} αποθηκευμένες τριλογίες στη συσκευή. Μπορείς να τις στείλεις σε iPhone, υπολογιστή ή άλλη συσκευή χωρίς λογαριασμό.`));
  const headActions = el("div", "actions compact");
  headActions.append(
    button("Νέο save", "", renderModeSelect),
    button("Import", "secondary", chooseSaveImport),
    button("Export όλα", "secondary", () => transferSaves(saves, "spirit-slasher-all-saves")),
    button("Πίσω", "ghost", renderHome)
  );
  head.append(title, headActions);
  const transfer = el("aside", "panel save-transfer-note");
  transfer.append(
    el("span", "save-transfer-icon", "⇄"),
    el("div", "", ""),
  );
  transfer.lastElementChild.append(
    el("strong", "", "SAVE TRANSFER · ΧΩΡΙΣ CLOUD ACCOUNT"),
    el("p", "", "Export → στείλε το .json με AirDrop, Files, email ή άλλο share app → άνοιξε το Save Vault στην άλλη συσκευή και πάτησε Import. Το αρχείο περιέχει μόνο τα canon saves που επέλεξες.")
  );
  const tools = el("div", "vault-tools panel");
  const search = el("input", "vault-search");
  search.type = "search";
  search.placeholder = "Αναζήτηση ονόματος ή πρωταγωνιστή…";
  search.setAttribute("aria-label", "Αναζήτηση saves");
  const sort = el("select", "vault-sort");
  sort.setAttribute("aria-label", "Ταξινόμηση saves");
  [["updated", "Πιο πρόσφατα"], ["created", "Πιο παλιά"], ["name", "Αλφαβητικά"]].forEach(([value, label]) => {
    const option = el("option", "", label); option.value = value; sort.append(option);
  });
  tools.append(search, sort);
  const list = el("div", "save-vault-list");

  const draw = () => {
    list.textContent = "";
    const query = search.value.trim().toLocaleLowerCase("el");
    const ordered = [...saves].filter(save => `${save.label || ""} ${save.protagonist} ${(save.playerCharacters || []).join(" ")}`.toLocaleLowerCase("el").includes(query));
    ordered.sort((a, b) => sort.value === "name"
      ? (a.label || `${a.protagonist}’s Cut`).localeCompare(b.label || `${b.protagonist}’s Cut`, "el")
      : sort.value === "created" ? (a.createdAt || 0) - (b.createdAt || 0) : (b.updatedAt || 0) - (a.updatedAt || 0));
    ordered.forEach((save, index) => {
      const card = el("article", "panel vault-save-card");
      const portrait = el("img", "vault-save-portrait"); portrait.src = imagePath(save.protagonist); portrait.alt = "";
      const info = el("div", "vault-save-info");
      const status = save.completed ? "TRILOGY COMPLETE" : `${movieLabel(save.movieNumber || 1)} · ${movieTitles[save.movieNumber || 1]}`;
      const deaths = unique((save.history || []).flatMap(record => record.deaths || [])).length;
      info.append(
        el("span", "vault-index", `SAVE ${String(index + 1).padStart(3, "0")} · ${status}`),
        el("h2", "save-name", save.label || `${save.protagonist}’s Cut`),
        el("p", "vault-save-meta", `${(save.playerCharacters || [save.protagonist]).join(" & ")} · ${formatDate(save.updatedAt || save.createdAt)} · ${save.history?.length || 0}/3 movies · ${deaths} deaths`)
      );
      const cardActions = el("div", "save-actions");
      cardActions.append(
        button(save.completed ? "Άνοιξε archive" : "Συνέχεια", "", () => loadUniverse(save.id)),
        button("Μετονομασία", "secondary", () => renameUniverse(save.id)),
        button("Μεταφορά", "secondary", () => transferSaves([save], save.label || `${save.protagonist}-cut`)),
        button("Διαγραφή", "ghost", () => deleteUniverse(save.id, renderSaveVault))
      );
      card.append(portrait, info, cardActions); list.append(card);
    });
    if (!ordered.length) list.append(el("p", "vault-empty", query ? "Δεν βρέθηκε save με αυτό το όνομα." : "Το Save Vault είναι ακόμη άδειο."));
  };
  search.addEventListener("input", draw);
  sort.addEventListener("change", draw);
  content.append(head, transfer, tools, list); root.append(content); draw();
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
  actions.append(button("Πίσω", "ghost", renderHome), button("Δημιούργησε το canon σου", "", renderModeSelect));
  content.append(actions);
  root.append(content);
}

function renderModeSelect() {
  const root = screen();
  const content = el("div", "content narrow");
  content.append(el("p", "eyebrow", "NEW TRILOGY · CHOOSE YOUR CUT"), el("h1", "display", "Πώς θέλεις να παίξεις;"), el("p", "lead", "Οι επιλογές, οι σχέσεις και τα saves λειτουργούν σε κάθε mode. Το Local 2–3P είναι pass-the-phone / share-screen· στο προαιρετικό Hidden Killer 3P ένας ανθρώπινος player μπορεί να βρίσκεται μέσα από τη μάσκα."));
  const grid = el("div", "mode-grid");
  const single = el("article", "panel mode-card");
  single.append(el("p", "eyebrow", "SINGLE PLAYER"), el("h2", "headline", "Μόνος/η στο cut"), el("p", "section-copy", "Ένας πρωταγωνιστής, procedural τριλογία και όλο το canon στα χέρια σου."), button("Single Player", "", () => renderProtagonist("single")));
  const multi = el("article", "panel mode-card");
  multi.append(el("p", "eyebrow", "MULTIPLAYER"), el("h2", "headline", "Παίξε μαζί"), el("p", "section-copy", "Online με account και local/tunnel server ή Local μέχρι τρεις παίκτες με κοινή οθόνη / pass-the-phone."), button("Multiplayer", "secondary", renderMultiplayerMode));
  grid.append(single, multi); content.append(grid);
  const actions = el("div", "actions"); actions.append(button("Πίσω", "ghost", renderHome)); content.append(actions);
  root.append(content);
}

function renderMultiplayerMode() {
  const root = screen();
  const content = el("div", "content narrow");
  content.append(el("p", "eyebrow", "MULTIPLAYER CUT"), el("h1", "display", "Διάλεξε τρόπο σύνδεσης."), el("p", "lead", "Το Online mode συνδέεται τώρα σε local/LAN server από το PC σου. Το Local mode παραμένει pass-the-phone σε μία συσκευή."));
  const grid = el("div", "mode-grid");
  const online = el("article", "panel mode-card");
  online.append(el("p", "eyebrow", "ONLINE · LOCAL SERVER"), el("h2", "headline", "Account & lobby"), el("p", "section-copy", "Κάνε account, δημιούργησε session ή μπες με code. Ο server μπορεί να τρέχει στο PC σου και να δέχεται παίκτες από LAN ή ασφαλές HTTPS tunnel."), button("Open Online", "", openOnlineLobby));
  const local = el("article", "panel mode-card");
  local.append(el("p", "eyebrow", "LOCAL · 2–3 PLAYERS"), el("h2", "headline", "Pass the phone"), el("p", "section-copy", "Standard survivor mode για 2–3 παίκτες ή προαιρετικό Hidden Killer μόνο στο Movie III όταν επιλέξετε τρεις. Όλοι παίζουν διαδοχικά στην ίδια κοινή τριλογία."), button("Local 2–3 Players", "", () => renderLocalSetup()));
  grid.append(online, local); content.append(grid);
  const actions = el("div", "actions"); actions.append(button("Πίσω", "ghost", renderModeSelect)); content.append(actions);
  root.append(content);
}

function onlineField(label, type, value = "", placeholder = "") {
  const wrapper = el("label", "online-field");
  wrapper.append(el("span", "", label));
  const input = el("input");
  input.type = type;
  input.value = value;
  input.placeholder = placeholder;
  input.autocomplete = type === "password" ? "current-password" : "off";
  wrapper.append(input);
  return { wrapper, input };
}

function onlineWatch(code) {
  if (!code || onlineWatchingCode === code) return;
  window.SpiritOnline.stopWatching();
  onlineWatchingCode = code;
  window.SpiritOnline.rememberSessionCode?.(code);
  const applySession = session => {
    const previousTurn = JSON.stringify(onlineSession?.turn || null);
    const signature = JSON.stringify({ code: session.code, status: session.status, stage: session.stage, sceneState: session.sceneState, storyState: session.storyState?.revision, turn: session.turn, players: session.players, history: session.history, pendingDecisions: session.pendingDecisions, chat: session.chat });
    if (signature === onlineSessionSignature && onlineSession?.me === session.me) return;
    onlineSessionSignature = signature;
    onlineSession = session;
    window.SpiritOnline.rememberSessionCode?.(session.code);
    updateOnlineLivePanel(session);
    if (session.status === "playing") {
      applyOnlineStoryState(session);
      syncOnlineSceneState(session);
      launchOnlineGame(session);
      // A turn handoff changes which browser's controls are enabled. Refresh
      // the same scene immediately instead of waiting for a full navigation.
      if (previousTurn !== JSON.stringify(session.turn || null)
        && current?.movie && !current.movie.pendingBeat && current.movie.stage > 0) renderMovie();
      return;
    }
    if (document.querySelector("[data-online-lobby]")) renderOnlineLobby();
  };
  // Quick Tunnels can cancel long-lived HTTP streams when a tab sleeps or
  // changes network. Polling is intentionally the reliable Online test path.
  // A short poll keeps avatars and live choice labels responsive without the
  // fragile long-lived SSE stream that Quick Tunnels can cancel.
  window.SpiritOnline.startPolling(code, applySession, onlineFailure, 1500);
}

function onlineFailure(error) {
  if (error?.status === 404 || error?.code === "session_not_found") {
    window.SpiritOnline?.clearSavedSessionCode?.();
    onlineSession = null;
    onlineWatchingCode = null;
    onlineSessionSignature = "";
    window.SpiritOnline?.stopWatching?.();
    if (document.querySelector("[data-online-lobby]")) renderOnlineLobby();
  }
  toast(error?.message || "Δεν ολοκληρώθηκε η ενέργεια στον Online server.");
}

function rememberOnlineSession(session) {
  onlineSession = session || null;
  if (session?.code) window.SpiritOnline?.rememberSessionCode?.(session.code);
  return onlineSession;
}

function openOnlineLobby() {
  // Entering Multiplayer is a clean chooser now. An old active session is
  // never opened silently; the player must press Reconnect or type a code.
  onlineSession = null;
  onlineWatchingCode = null;
  onlineSessionSignature = "";
  onlineEngineStartedCode = null;
  onlineChatOpen = false;
  onlineChatLastSeenId = "";
  window.SpiritOnline?.stopWatching?.();
  renderOnlineLobby();
}

async function leaveOnlineSession() {
  const client = window.SpiritOnline;
  const code = current?.onlineSessionCode || onlineSession?.code;
  if (!window.confirm("Να φύγεις από αυτό το online session; Θα επιστρέψεις στο lobby και θα χρειαστείς νέο code για σύνδεση.")) return;
  try {
    if (code && client?.leaveSession) await client.leaveSession(code);
  } catch (error) {
    if (error?.status !== 404 && error?.status !== 403) toast(error?.message || "Το session δεν απάντησε. Έγινε τοπική έξοδος.");
  } finally {
    client?.clearSavedSessionCode?.();
    client?.stopWatching?.();
    onlineSession = null;
    onlineWatchingCode = null;
    onlineSessionSignature = "";
    onlineEngineStartedCode = null;
    onlineChatOpen = false;
    onlineChatLastSeenId = "";
    if (current?.gameMode === "online") {
      current.gameMode = "single";
      current.onlineSessionCode = null;
      current.onlineUsername = null;
      current.onlineGroupCharacters = [];
      saveCurrent();
    }
    renderOnlineLobby();
  }
}

function onlinePendingChoice(session, username) {
  const pending = Object.values(session?.pendingDecisions || {}).find(decision => decision?.submissions?.[username]);
  const value = pending?.submissions?.[username];
  return value ? describeOnlineChoice(value) : "";
}

function mountOnlineLivePanel() {
  const panel = el("aside", "panel online-live-panel online-party-hud");
  panel.dataset.onlineLive = "true";
  const heading = el("div", "online-live-heading");
  const headingCopy = el("div", "online-live-heading-copy");
  headingCopy.append(el("span", "eyebrow", "ONLINE PARTY · SHARED SCENE"), el("small", "", "Ένας κόσμος, μία σκηνή και ξεχωριστό turn για κάθε παίκτη."));
  heading.append(headingCopy, button("Leave session", "ghost mini-btn", leaveOnlineSession));
  const sharedScene = el("div", "online-shared-scene");
  const players = el("div", "online-live-players");
  panel.append(heading, sharedScene, players);
  panel._onlineSharedScene = sharedScene;
  panel._onlinePlayers = players;
  return panel;
}

function mountOnlineChatDock() {
  if (!isOnlineEngine() || !onlineSession) return null;
  document.querySelectorAll("[data-online-chat-dock]").forEach(node => node.remove());
  const dock = el("aside", `online-chat-dock ${onlineChatOpen ? "open" : ""}`);
  dock.dataset.onlineChatDock = "true";
  const toggle = el("button", "online-chat-fab");
  toggle.type = "button";
  toggle.setAttribute("aria-label", "Άνοιξε το party chat");
  toggle.setAttribute("aria-expanded", String(onlineChatOpen));
  toggle.append(el("span", "chat-fab-icon", "💬"));
  const badge = el("span", "online-chat-badge", "0");
  badge.hidden = true;
  toggle.append(badge);

  const drawer = el("section", "online-chat-drawer");
  const header = el("div", "online-chat-drawer-head");
  const copy = el("div");
  copy.append(el("span", "eyebrow", "PARTY CHAT"), el("small", "", "Μόνο για τους παίκτες του session"));
  const close = el("button", "online-chat-close", "×");
  close.type = "button";
  close.setAttribute("aria-label", "Κλείσε το chat");
  header.append(copy, close);
  const messages = el("div", "online-live-chat-messages");
  const form = el("form", "online-live-chat-form");
  const input = document.createElement("input");
  input.type = "text";
  input.maxLength = 500;
  input.placeholder = "Γράψε στην παρέα…";
  input.autocomplete = "off";
  const send = el("button", "btn chat-send", "Send");
  send.type = "submit";
  form.append(input, send);
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text || !onlineSession?.code || !window.SpiritOnline?.sendChat) return;
    send.disabled = true;
    try {
      const result = await window.SpiritOnline.sendChat(onlineSession.code, text);
      rememberOnlineSession(result.session || onlineSession);
      input.value = "";
      updateOnlineLivePanel(onlineSession);
    } catch (error) {
      onlineFailure(error);
    } finally {
      send.disabled = false;
    }
  });
  const setOpen = value => {
    onlineChatOpen = value;
    dock.classList.toggle("open", value);
    toggle.setAttribute("aria-expanded", String(value));
    if (value) {
      const latest = onlineSession?.chat?.at(-1);
      if (latest) onlineChatLastSeenId = latest.id;
      badge.hidden = true;
      badge.textContent = "0";
      requestAnimationFrame(() => { messages.scrollTop = messages.scrollHeight; input.focus(); });
    }
  };
  toggle.addEventListener("click", () => setOpen(!onlineChatOpen));
  close.addEventListener("click", () => setOpen(false));
  drawer.append(header, messages, form);
  dock.append(drawer, toggle);
  dock._onlineMessages = messages;
  dock._onlineBadge = badge;
  dock._setOpen = setOpen;
  document.body.append(dock);
  onlineChatDock = dock;
  const latest = onlineSession.chat?.at(-1);
  if (!onlineChatLastSeenId && latest) onlineChatLastSeenId = latest.id;
  updateOnlineLivePanel(onlineSession);
  return dock;
}

function updateOnlineLivePanel(session = onlineSession) {
  if (!session) return;
  const sharedScene = onlineLivePanel?._onlineSharedScene;
  const players = onlineLivePanel?._onlinePlayers;
  const scene = session.sceneState;
  if (onlineLivePanel?.isConnected && sharedScene && players) {
    sharedScene.textContent = "";
    if (scene) {
      sharedScene.append(
        el("span", "eyebrow", "SHARED SCENE"),
        el("strong", "", `${movieLabel(scene.movie)} · STAGE ${scene.stage} · ${scene.scene}`),
        el("small", "", onlineTurnLabel(session))
      );
      if (scene.lastDecision?.choices) {
        const decisions = Object.entries(scene.lastDecision.choices).map(([username, value]) => `${username}: ${describeOnlineChoice(value)}`);
        sharedScene.append(el("small", "", `LAST ROUND · ${decisions.join(" · ")}`));
      }
    } else {
      sharedScene.append(el("span", "eyebrow", "SHARED SCENE"), el("small", "", "Η κοινή σκηνή ετοιμάζεται…"));
    }
    players.textContent = "";
    (session.players || []).forEach((player, index) => {
      const isTurn = session.turn?.username === player.username;
      const row = el("article", `online-live-player party-color-${(index % 4) + 1} ${isTurn ? "is-turn" : ""}`);
      const portrait = document.createElement("img");
      portrait.src = imagePath(player.character || "Billy");
      portrait.alt = "";
      const copy = el("span", "online-live-player-copy");
      const nameLine = el("span", "online-live-player-name");
      nameLine.append(el("strong", "", player.username));
      if (player.username === session.me) nameLine.append(el("small", "", "YOU"));
      copy.append(nameLine, el("small", "", player.character || "Choosing character…"));
      const choice = onlinePendingChoice(session, player.username);
      const status = el("span", `online-live-player-status ${choice ? "has-choice" : ""}`, choice ? `LOCKED · ${choice}` : isTurn ? "PLAYING NOW" : "WATCHING");
      row.append(portrait, copy, status);
      players.append(row);
    });
  }

  if (onlineChatDock?.isConnected) {
    const messages = onlineChatDock._onlineMessages;
    messages.textContent = "";
    (session.chat || []).slice(-40).forEach(message => {
      const line = el("p", `online-chat-line ${message.username === session.me ? "mine" : ""}`);
      line.append(el("strong", "", message.username), el("span", "", message.text));
      messages.append(line);
    });
    const chat = session.chat || [];
    if (onlineChatOpen) {
      const latest = chat.at(-1);
      if (latest) onlineChatLastSeenId = latest.id;
      onlineChatDock._onlineBadge.hidden = true;
      messages.scrollTop = messages.scrollHeight;
    } else {
      const seenIndex = chat.findIndex(message => message.id === onlineChatLastSeenId);
      const unseen = chat.slice(seenIndex >= 0 ? seenIndex + 1 : chat.length).filter(message => message.username !== session.me).length;
      onlineChatDock._onlineBadge.textContent = unseen > 9 ? "9+" : String(unseen);
      onlineChatDock._onlineBadge.hidden = unseen === 0;
    }
  }
}

function publishOnlineSceneState(sceneName) {
  if (!isOnlineEngine() || !isOnlineStoryAuthoritative() || !current.movie || !window.SpiritOnline.updateSceneState) return;
  const movie = current.movie;
  const normalizedScene = String(sceneName || `stage-${movie.stage}`).trim().slice(0, 140);
  const publishKey = `${movie.number}:${movie.stage}:${normalizedScene}`;
  if (current.onlineScenePublishKey === publishKey) return;
  current.onlineScenePublishKey = publishKey;
  const decisionKey = current.onlineDecisionNotice?.key || "";
  window.SpiritOnline.updateSceneState(current.onlineSessionCode, movie.number, movie.stage, normalizedScene, decisionKey)
    .then(result => {
      if (!result.session) return;
      const previousTurn = JSON.stringify(onlineSession?.turn || null);
      rememberOnlineSession(result.session);
      current.onlineSceneRevision = Number(result.session.sceneState?.revision || current.onlineSceneRevision || 0);
      current.onlineLastDecisionKey = result.session.sceneState?.lastDecision?.key || current.onlineLastDecisionKey || null;
      onlineSessionSignature = "";
      updateOnlineLivePanel(onlineSession);
      // The server releases Player 1 only after the final player's outcome has
      // been acknowledged. Re-render the current scene so its controls unlock
      // immediately instead of waiting for the next poll.
      if (previousTurn !== JSON.stringify(result.session.turn || null)
        && current.movie?.number === movie.number && current.movie?.stage === movie.stage) renderMovie();
    })
    .catch(error => {
      if (error.session) {
        rememberOnlineSession(error.session);
        onlineSessionSignature = "";
        updateOnlineLivePanel(onlineSession);
        syncOnlineSceneState(error.session);
      }
      if (error.status !== 409) {
        current.onlineScenePublishKey = null;
        onlineFailure(error);
      }
    });
}

function launchOnlineGame(session) {
  if (!session?.code || session.status !== "playing" || onlineEngineStartedCode === session.code) return;
  const player = session.players.find(entry => entry.username === session.me);
  if (!player?.character) return;
  onlineEngineStartedCode = session.code;
  rememberOnlineSession(session);
  toast("Η κοινή Online τριλογία ξεκινά.");
  const savedOnlineCut = [...saves]
    .filter(save => save.gameMode === "online" && save.onlineSessionCode === session.code)
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0];
  if (savedOnlineCut) {
    savedOnlineCut.onlineUsername = session.me;
    savedOnlineCut.onlineGroupCharacters = session.players.map(entry => entry.character).filter(Boolean);
    loadUniverse(savedOnlineCut.id);
    applyOnlineStoryState(session);
    return;
  }
  createUniverse(player.character, {
    mode: "online",
    playerCharacters: [player.character],
    onlineGroupCharacters: session.players.map(entry => entry.character).filter(Boolean),
    seed: session.seed,
    onlineSessionCode: session.code,
    onlineUsername: session.me,
  });
  applyOnlineStoryState(session);
}

function renderOnlineLobby() {
  const root = screen();
  root.dataset.onlineLobby = "true";
  const content = el("div", "content online-portal");
  const client = window.SpiritOnline;
  if (!client) {
    content.append(el("p", "eyebrow", "ONLINE ERROR"), el("h1", "display", "Λείπει ο Online adapter."), el("p", "lead", "Κάνε refresh την εφαρμογή για να φορτωθεί το Online client."));
    root.append(content);
    return;
  }

  if (!client.getToken()) {
    const shell = el("section", "online-access-shell");
    const pitch = el("aside", "online-access-pitch");
    pitch.append(
      el("p", "eyebrow", "SPIRIT SLASHER · ONLINE PARTY"),
      el("h1", "display", "Το Local flow, τώρα σε κάθε οθόνη."),
      el("p", "lead", "Έως τέσσερις παίκτες μπαίνουν στην ίδια τριλογία. Βλέπουν το ίδιο scene, παίζουν με αυστηρή σειρά και κάθε επιλογή γράφεται στο κοινό outcome."),
      el("div", "online-feature-line", "01 · SAME STORY"),
      el("div", "online-feature-line", "02 · INDIVIDUAL TURNS"),
      el("div", "online-feature-line", "03 · SHARED OUTCOMES")
    );
    const panel = el("article", "panel online-auth-card");
    const tabs = el("div", "online-auth-tabs");
    const signInTab = button("Sign in", onlinePortalView === "signin" ? "active" : "ghost", () => { onlinePortalView = "signin"; renderOnlineLobby(); });
    const registerTab = button("Create account", onlinePortalView === "register" ? "active" : "ghost", () => { onlinePortalView = "register"; renderOnlineLobby(); });
    tabs.append(signInTab, registerTab);
    const isRegister = onlinePortalView === "register";
    panel.append(tabs, el("p", "eyebrow", isRegister ? "NEW PLAYER" : "WELCOME BACK"), el("h2", "headline", isRegister ? "Φτιάξε το player profile σου." : "Μπες ξανά στην παρέα."));
    const username = onlineField("USERNAME", "text", "", "your username");
    const password = onlineField("PASSWORD", "password", "", "8+ characters");
    const fields = el("div", "online-auth-form"); fields.append(username.wrapper, password.wrapper);
    panel.append(fields);
    const submit = button(isRegister ? "Create my account" : "Sign in", "online-auth-submit", async () => {
      try {
        const result = isRegister
          ? await client.register(username.input.value, password.input.value)
          : await client.login(username.input.value, password.input.value);
        localStorage.setItem("spirit-slasher-online-user-v1", result.user.username);
        onlinePortalView = "menu";
        toast(isRegister ? "Το account δημιουργήθηκε." : "Καλώς ήρθες ξανά.");
        renderOnlineLobby();
      } catch (error) { onlineFailure(error); }
    });
    const authActions = el("div", "online-auth-actions");
    authActions.append(submit, button("Back to multiplayer", "ghost", renderMultiplayerMode));
    panel.append(authActions);
    shell.append(pitch, panel); content.append(shell); root.append(content); return;
  }

  if (!onlineSession) {
    const profile = el("header", "online-profile-header");
    const profileCopy = el("div");
    profileCopy.append(el("p", "eyebrow", "ONLINE PARTY"), el("h1", "display", "Διάλεξε πώς θα μπεις."), el("p", "lead", `Signed in ως ${localStorage.getItem("spirit-slasher-online-user-v1") || "player"}. Το account και τα lobbies είναι πλέον ξεχωριστά screens.`));
    const profileActions = el("div", "online-profile-actions");
    profileActions.append(button("Sign out", "ghost", async () => { client.stopWatching(); await client.logout(); client.clearSavedSessionCode?.(); onlineSession = null; onlineWatchingCode = null; onlineSessionSignature = ""; onlineEngineStartedCode = null; onlinePortalView = "signin"; renderOnlineLobby(); }), button("Back", "ghost", renderMultiplayerMode));
    profile.append(profileCopy, profileActions); content.append(profile);

    const menu = el("section", "online-menu-grid");
    const createCard = el("article", "panel online-menu-card create-party");
    createCard.append(el("span", "online-menu-icon", "✦"), el("p", "eyebrow", "NEW PARTY"), el("h2", "headline", "Δημιούργησε lobby"), el("p", "section-copy", "Άνοιξε κοινή τριλογία για 2–4 παίκτες. Όλοι διαλέγουν διαφορετικό χαρακτήρα."), button("Create online party", "", async () => {
      try { const result = await client.createSession(4); onlineEngineStartedCode = null; onlineSessionSignature = ""; rememberOnlineSession(result.session); renderOnlineLobby(); } catch (error) { onlineFailure(error); }
    }));
    const joinCard = el("article", "panel online-menu-card join-party");
    const joinCode = onlineField("JOIN CODE", "text", "", "ABC123");
    joinCard.append(el("span", "online-menu-icon", "⌁"), el("p", "eyebrow", "JOIN PARTY"), el("h2", "headline", "Έχεις κωδικό;"), el("p", "section-copy", "Γράψε τον εξαψήφιο κωδικό που βλέπει η παρέα στο lobby."), joinCode.wrapper, button("Join online party", "secondary", async () => {
      try { const result = await client.joinSession(joinCode.input.value.trim().toUpperCase()); onlineEngineStartedCode = null; onlineSessionSignature = ""; rememberOnlineSession(result.session); renderOnlineLobby(); } catch (error) { onlineFailure(error); }
    }));
    menu.append(createCard, joinCard);
    const savedCode = client.getSavedSessionCode?.();
    if (savedCode) {
      const resumeCard = el("article", "panel online-menu-card resume-party");
      resumeCard.append(el("span", "online-menu-icon", "↻"), el("p", "eyebrow", "SAVED PARTY"), el("h2", "headline", savedCode), el("p", "section-copy", "Το session δεν ανοίγει μόνο του. Εσύ αποφασίζεις αν θέλεις να συνεχίσεις."));
      const resumeActions = el("div", "actions");
      resumeActions.append(button("Reconnect", "", async () => {
        try { const result = await client.getSession(savedCode); rememberOnlineSession(result.session); onlineSessionSignature = ""; renderOnlineLobby(); if (result.session.status === "playing") launchOnlineGame(result.session); } catch (error) { onlineFailure(error); }
      }), button("Forget", "ghost", () => { client.clearSavedSessionCode?.(); renderOnlineLobby(); }));
      resumeCard.append(resumeActions); menu.append(resumeCard);
    }
    content.append(menu); root.append(content); return;
  }

  onlineWatch(onlineSession.code);
  const mine = onlineSession.players.find(player => player.username === onlineSession.me);
  if (onlineSession.status === "lobby") {
    const lobby = el("section", "party-lobby");
    const hero = el("header", "party-lobby-hero");
    const heroCopy = el("div");
    heroCopy.append(el("p", "eyebrow", "ONLINE PARTY LOBBY"), el("h1", "display", "Η τριλογία περιμένει."), el("p", "lead", "Μοιράσου μόνο τον κωδικό. Κάθε θέση είναι ξεχωριστός παίκτης και κάθε επιλεγμένος χαρακτήρας κλειδώνει."));
    const code = el("button", "party-code"); code.type = "button"; code.append(el("small", "", "TAP TO COPY"), el("strong", "", onlineSession.code));
    code.addEventListener("click", async () => { try { await navigator.clipboard.writeText(onlineSession.code); toast("Ο κωδικός αντιγράφηκε."); } catch { toast(`Session code: ${onlineSession.code}`); } });
    hero.append(heroCopy, code); lobby.append(hero);

    const board = el("div", "party-board");
    for (let index = 0; index < onlineSession.maxPlayers; index += 1) {
      const player = onlineSession.players[index];
      const slot = el("article", `party-slot party-color-${index + 1} ${player ? "occupied" : "empty"} ${player?.username === onlineSession.me ? "mine" : ""}`);
      const avatar = el("div", "party-avatar");
      if (player?.character) { const img = el("img"); img.src = imagePath(player.character); img.alt = ""; avatar.append(img); }
      else avatar.append(el("span", "", player ? "?" : "+"));
      const slotCopy = el("div", "party-slot-copy");
      slotCopy.append(el("small", "", `PLAYER ${index + 1}`), el("strong", "", player?.username || "OPEN SLOT"), el("span", "", player?.character || (player ? "CHOOSING…" : "WAITING FOR PLAYER")));
      slot.append(avatar, slotCopy); board.append(slot);
    }
    const center = el("div", "party-board-center");
    center.append(el("span", "party-star", "✦"), el("strong", "", `${onlineSession.players.length}/${onlineSession.maxPlayers}`), el("small", "", "PLAYERS CONNECTED"));
    board.append(center); lobby.append(board);

    const characterPanel = el("article", "panel party-character-panel");
    characterPanel.append(el("p", "eyebrow", "CHOOSE YOUR CHARACTER"), el("h2", "headline", mine?.character || "Η θέση σου δεν έχει κλειδώσει ακόμη"), el("p", "section-copy", "Οι canon σχέσεις, τα bets και τα προσωπικά relationship stats ακολουθούν τον δικό σου χαρακτήρα."));
    const characterGrid = el("div", "roster party-character-grid");
    roster.forEach(item => {
      const selectedBy = onlineSession.players.find(player => player.character === item.name);
      const selectedByMe = selectedBy?.username === onlineSession.me;
      const lockedByOther = Boolean(selectedBy && !selectedByMe);
      const card = characterButton(item.name, async () => {
        if (lockedByOther) return;
        try { const result = await client.setCharacter(onlineSession.code, item.name); onlineSessionSignature = ""; rememberOnlineSession(result.session); renderOnlineLobby(); } catch (error) { onlineFailure(error); }
      }, false, lockedByOther ? "online-locked" : selectedByMe ? "online-selected" : "");
      if (selectedBy) {
        const label = selectedByMe ? "SELECTED BY YOU" : `LOCKED · ${selectedBy.username}`;
        card.append(el("span", "character-lock-label", label));
        card.setAttribute("aria-label", `${item.name} · ${label}`);
        if (lockedByOther) {
          card.disabled = true;
          card.setAttribute("aria-disabled", "true");
        }
      }
      characterGrid.append(card);
    });
    characterPanel.append(characterGrid); lobby.append(characterPanel);
    const ready = onlineSession.players.length >= 2 && onlineSession.players.every(player => player.character);
    const actions = el("div", "actions party-lobby-actions");
    if (onlineSession.host === onlineSession.me) actions.append(button(ready ? "Start the trilogy" : "Waiting for every character", "", async () => { if (!ready) return; try { const result = await client.startSession(onlineSession.code); onlineSessionSignature = ""; rememberOnlineSession(result.session); launchOnlineGame(result.session); } catch (error) { onlineFailure(error); } }));
    else actions.append(el("p", "online-status", ready ? "Όλοι είναι έτοιμοι · η τριλογία ξεκινά σε λίγο" : "Περιμένουμε να κλειδώσουν όλοι χαρακτήρα"));
    actions.append(button("Leave lobby", "ghost", async () => {
      try { await client.leaveSession(onlineSession.code); } catch (error) { if (error?.status !== 404) onlineFailure(error); }
      client.clearSavedSessionCode?.(); client.stopWatching(); onlineSession = null; onlineWatchingCode = null; onlineSessionSignature = ""; onlineEngineStartedCode = null; renderOnlineLobby();
    }));
    lobby.append(actions); content.append(lobby);
  } else {
    const connected = el("article", "panel online-reconnect-card"); connected.append(el("p", "online-status", "PARTY IN PROGRESS"), el("h1", "headline", "Η κοινή τριλογία είναι ενεργή."), el("p", "section-copy", "Θα φορτωθεί το ίδιο scene και το ίδιο outcome που βλέπουν οι υπόλοιποι παίκτες."), button("Return to the game", "", () => launchOnlineGame(onlineSession)), button("Leave session", "ghost", leaveOnlineSession)); content.append(connected);
  }
  root.append(content);
}

function renderLocalSetup(selected = []) {
  const selectedPlayers = Array.isArray(selected) ? selected : [selected].filter(Boolean);
  const root = screen();
  const content = el("div", "content");
  const head = el("div", "section-head");
  const title = el("div");
  const nextNumber = selectedPlayers.length + 1;
  title.append(el("p", "eyebrow", "LOCAL · 2–3 PLAYERS · CASTING"), el("h1", "headline", selectedPlayers.length ? `Διάλεξε τον/την Player ${nextNumber}` : "Διάλεξε 2 ή 3 χαρακτήρες"));
  head.append(title, el("p", "section-copy", selectedPlayers.length
    ? `Ήδη επιλέχθηκαν: ${selectedPlayers.join(" & ")}. Κάθε χαρακτήρας έχει δικά του relationships, theory, bet και ανεξάρτητο turn.`
    : "Στο standard mode οι ανθρώπινοι players παραμένουν καλοί και εκτός killers. Με τρεις παίκτες μπορείτε αργότερα να ενεργοποιήσετε τυχαίο μυστικό killer με ιδιωτική αποκάλυψη ρόλων."));
  content.append(head);
  if (selectedPlayers.length) {
    const chosen = el("div", "local-player-pair local-player-selection");
    selectedPlayers.forEach((name, index) => {
      const card = el("article", "panel local-player-card");
      const img = el("img"); img.src = imagePath(name); img.alt = "";
      card.append(img, el("strong", "", `PLAYER ${index + 1}`), el("h2", "", name));
      chosen.append(card);
    });
    content.append(chosen);
  }
  const grid = el("div", "roster");
  roster.filter(item => !selectedPlayers.includes(item.name)).forEach(item => grid.append(characterButton(item.name, () => {
    const next = [...selectedPlayers, item.name];
    if (next.length >= 3) confirmLocalPlayers(next);
    else renderLocalSetup(next);
  }, false, selectedPlayers.length ? "local-player-two" : "")));
  content.append(grid);
  const actions = el("div", "actions");
  if (selectedPlayers.length === 2) actions.append(button("Παίξε με 2 players", "", () => confirmLocalPlayers(selectedPlayers)));
  actions.append(button("Πίσω", "ghost", selectedPlayers.length ? () => renderLocalSetup(selectedPlayers.slice(0, -1)) : renderMultiplayerMode));
  content.append(actions);
  root.append(content);
}

function confirmLocalPlayers(players) {
  const selectedPlayers = Array.isArray(players) ? players : [...arguments].filter(Boolean);
  const root = screen();
  const content = el("div", "content narrow");
  content.append(el("p", "eyebrow", `LOCAL ${selectedPlayers.length}P · READY`), el("h1", "display", selectedPlayers.join(" & ")), el("p", "lead", "Το παιχνίδι δείχνει blocking handoff popup σε κάθε αλλαγή σειράς. Όλοι βλέπουν την ίδια σκηνή, αλλά κλειδώνουν ανεξάρτητες επιλογές και outcomes."));
  const pair = el("div", "local-player-pair");
  selectedPlayers.forEach((name, index) => {
    const card = el("article", "panel local-player-card");
    const img = el("img"); img.src = imagePath(name); img.alt = ""; img.dataset.character = name;
    card.append(img, el("strong", "", `PLAYER ${index + 1}`), el("h2", "", name), el("small", "", selectedPlayers.length === 3 ? "SURVIVORS MODE = NO SECRET ROLES" : "GOOD · IMMUNE TO KILLER ROLE")); pair.append(card);
  });
  content.append(pair);
  const actions = el("div", "actions");
  actions.append(button(`Έναρξη Local ${selectedPlayers.length}P · Survivors`, "", () => createUniverse(selectedPlayers[0], { mode: "local", playerCharacters: selectedPlayers })));
  if (selectedPlayers.length === 3) actions.append(button("Hidden Killer 3P · Τυχαίος μυστικός ρόλος", "secondary", () => createUniverse(selectedPlayers[0], { mode: "local", playerCharacters: selectedPlayers, localHiddenKillerEnabled: true })));
  actions.append(button("Άλλαξε χαρακτήρες", "ghost", () => renderLocalSetup(selectedPlayers.slice(0, -1))));
  content.append(actions); root.append(content);
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
  img.dataset.character = name;
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

function createUniverse(protagonist, options = {}) {
  onlineStoryPublishSignature = "";
  const mode = options.mode || "single";
  const onlineGroup = unique(options.onlineGroupCharacters?.length ? options.onlineGroupCharacters : options.playerCharacters || [protagonist]).filter(name => character(name));
  // Online story generation must know the complete cast of human players on
  // every browser. Previously each client only generated itself, producing
  // different danger rolls, groups and scenes after the opening.
  const players = unique(mode === "online" && onlineGroup.length
    ? onlineGroup
    : options.playerCharacters?.length ? options.playerCharacters : [protagonist]);
  const seed = Number.isFinite(options.seed) ? Number(options.seed) >>> 0 : (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) >>> 0;
  const relationshipsByPlayer = Object.fromEntries(players.map(player => [player, buildRelationshipBoard(player)]));
  current = {
    id: `cut-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    seed,
    protagonist,
    playerCharacters: players,
    onlineGroupCharacters: mode === "online" ? onlineGroup : [],
    gameMode: mode,
    localHiddenKillerEnabled: Boolean(options.localHiddenKillerEnabled && mode === "local" && players.length === 3),
    hiddenKiller: options.localHiddenKillerEnabled && mode === "local" && players.length === 3 ? players[(seed + players.join("").length) % players.length] : null,
    onlineSessionCode: options.onlineSessionCode || null,
    onlineUsername: options.onlineUsername || null,
    onlinePendingDecision: null,
    onlineDecisionNotice: null,
    onlineScenePublishKey: null,
    onlineSceneRevision: 0,
    onlineLastDecisionKey: null,
    onlineRoundComplete: false,
    onlineStoryRevision: 0,
    activePlayerIndex: 0,
    relationshipViewer: players[0],
    playerCredits: Object.fromEntries(players.map(name => [name, 1000])),
    label: `${players.join(" & ")}’s ${mode === "local" ? "Local Cut" : mode === "online" ? "Online Party Cut" : "Cut"} · ${new Intl.DateTimeFormat("el-GR", { dateStyle: "short", timeStyle: "short" }).format(new Date())}`,
    credits: mode === "single" ? 1000 : players.length * 1000,
    movieNumber: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    completed: false,
    history: [],
    relationships: relationshipsByPlayer[protagonist],
    relationshipsByPlayer,
    movie: null
  };
  relations.forEach(([a, b]) => {
    players.forEach(player => {
      const board = current.relationshipsByPlayer[player];
      if (a === player && board[b]) Object.assign(board[b], { trust: 30, friendship: 42, loyalty: 34 });
      if (b === player && board[a]) Object.assign(board[a], { trust: 30, friendship: 42, loyalty: 34 });
    });
  });
  startMovie(1);
}

function loadUniverse(id) {
  current = saves.find(save => save.id === id);
  if (!current) return renderHome();
  current.credits ??= 1000;
  current.playerCharacters = unique(current.playerCharacters?.length ? current.playerCharacters.filter(name => character(name)) : [current.protagonist]);
  current.gameMode ||= current.playerCharacters.length > 1 ? "local" : "single";
  current.localHiddenKillerEnabled ??= false;
  current.hiddenKiller ||= null;
  if (current.gameMode === "online") {
    current.onlineGroupCharacters = unique(current.onlineGroupCharacters?.length ? current.onlineGroupCharacters : current.playerCharacters).filter(name => character(name));
    if (current.onlineGroupCharacters.length) current.playerCharacters = [...current.onlineGroupCharacters];
  }
  current.activePlayerIndex ??= 0;
  current.relationshipViewer ||= current.playerCharacters[0];
  current.onlineSceneRevision ??= 0;
  current.onlineStoryRevision ??= 0;
  current.onlineLastDecisionKey ||= null;
  current.onlineRoundComplete ??= false;
  current.survivorCelebrationPending ??= false;
  if (!current.playerCharacters.includes(current.relationshipViewer)) current.relationshipViewer = current.playerCharacters[0];
  current.playerCredits ||= Object.fromEntries(current.playerCharacters.map(name => [name, 1000]));
  current.relationshipsByPlayer = Object.fromEntries(current.playerCharacters.map((name, index) => [name, buildRelationshipBoard(name, current.relationshipsByPlayer?.[name] || (index === 0 ? current.relationships : null))]));
  current.relationships = current.relationshipsByPlayer[current.protagonist] || current.relationships;
  if (current.completed) {
    // The final sequence is resumable: archive first, then winners, funeral
    // and killer memorial. Older saves used survivorCelebrationPending; map
    // that flag once so refreshes no longer reopen a blank final screen.
    // A pre-v1.17 save could have been captured while the old winners scene
    // was blank. Reopen those saves in the stable archive so the player has a
    // visible recovery path instead of being trapped on the broken canvas.
    current.finalSequence ||= "archive";
    if (current.finalSequence === "survivors") return renderSurvivorsCelebration();
    if (current.finalSequence === "funeral") return renderFuneral();
    if (current.finalSequence === "killers") return renderKillerMemorial();
    return renderTrilogyArchive();
  }
  if (!current.movie) return startMovie(current.movieNumber || 1);
  const movie = current.movie;
  const world = movieWorlds[movie.number];
  movie.rooms ||= [...world.rooms];
  movie.worldAsset ||= world.asset;
  movie.locationChoices ||= [];
  movie.locationClues ||= {};
  while (movie.locationChoices.length < 4) {
    const usedLocations = new Set(movie.locationChoices.map(([location]) => location));
    const extraRoom = movie.rooms.find(room => !usedLocations.has(room.name));
    if (!extraRoom) break;
    movie.locationChoices.push([extraRoom.name, extraRoom.hint]);
    movie.locationClues[extraRoom.name] ||= {
      type: "UNVERIFIED CLUE",
      title: "UNKNOWN FIGURE: το κλειδωμένο τέταρτο δωμάτιο",
      text: "Το δωμάτιο προστέθηκε από το updated investigation flow. Το ίχνος είναι αληθινό, red herring ή παγίδα· δεν αποκαλύπτει αυτόματα κανέναν killer."
    };
  }
  movie.survivalItem ||= survivalItems[movie.number][0];
  movie.protectedLegacy ||= [];
  movie.offscreenDeaths ||= [];
  movie.lateDeaths ||= [];
  movie.abandoned ||= [];
  movie.departed ||= [];
  movie.deathOrder ||= [];
  movie.continuityFriends ||= movie.priorCoreFriends || [];
  movie.newcomers ||= [];
  movie.itemKept ??= false;
  movie.itemUsed ??= false;
  movie.itemHolders ||= movie.keyHolder ? String(movie.keyHolder).split(" & ").filter(Boolean) : [];
  movie.itemKeepers ||= movie.itemKept ? [...current.playerCharacters] : [];
  movie.finalKiller ||= null;
  movie.canonMoments ||= [];
  movie.fatalityTarget ||= 4;
  movie.openingScenario ||= buildOpeningScenario(movie.number, movie.openingTarget, movie.openingPartner, mulberry32((current.seed + movie.number * 331) >>> 0));
  movie.openingKillerRoll ??= 1;
  movie.investigatedRooms ||= [];
  movie.investigationPhase ||= "rooms";
  movie.investigationActions ||= 0;
  movie.initialInvestigationComplete ??= movie.investigatedRooms.length > 0;
  movie.additionalActions ||= {};
  movie.additionalActionDrafts ||= {};
  movie.additionalActionsComplete ??= false;
  if (movie.stage === 4 && movie.initialInvestigationComplete && !movie.additionalActionsComplete) movie.investigationPhase = "followup";
  movie.dialoguedWith ||= [];
  movie.puzzle ||= investigationPuzzles[0];
  movie.puzzleSolved ||= false;
  movie.puzzleAdvantage ||= false;
  movie.itemSaved ||= [];
  movie.resolvedLegacyKillers ||= [];
  if (movie.number === 3 && !movie.legacyEcho) {
    const archivedKillers = unique(current.history.flatMap(record => record.killers || []));
    movie.legacyEcho = movie.returningKiller || archivedKillers[0] || null;
  }
  if (movie.number === 3 && movie.legacyEcho) {
    const migrateLegacyClue = clue => {
      if (!clue || clue.type !== "REAL CLUE" || clue.title.includes("ARCHIVE ECHO")) return;
      const detail = clue.title.includes(":") ? clue.title.split(":").slice(1).join(":").trim() : "το ίχνος στο archive";
      clue.title = `${movie.legacyEcho} · ARCHIVE ECHO: ${detail}`;
      clue.text = `Το ίχνος μοιάζει με εκείνο ${genitiveName(movie.legacyEcho)}, σαν να βρισκόταν εδώ. Μπορεί όμως να είναι επιστροφή, αντιγραφή ή εσκεμμένη παγίδα — δεν αποδεικνύει ότι επέστρεψε κανείς. ${clue.text}`;
    };
    Object.values(movie.locationClues || {}).forEach(migrateLegacyClue);
    (movie.cluesFound || []).forEach(migrateLegacyClue);
  }
  movie.relationshipEvent ||= null;
  movie.relationshipEventShown ??= !movie.relationshipEvent;
  movie.accusationDebates ||= {};
  movie.finalDeepInvestigationResolved ??= false;
  movie.finalDeepInvestigationResult ||= null;
  movie.finalInvestigationScenario ||= null;
  movie.roleBriefingComplete ??= !current.localHiddenKillerEnabled;
  if (movie.number !== 3) movie.roleBriefingComplete = true;
  movie.roleBriefingIndex ??= 0;
  movie.roleBriefingRevealed ??= false;
  movie.hiddenKillerStrategy ||= null;
  movie.relationshipArc ||= null;
  movie.rareEvent ||= null;
  movie.rareEventConsumed ??= false;
  movie.secretAlliance ||= null;
  movie.secretAttackVictims ||= [];
  movie.wrongAccusationResolved ??= false;
  movie.pendingBet ??= 0;
  movie.betAmount ??= 0;
  movie.betPayout ??= 0;
  movie.betResult ||= "NO BET";
  movie.betSettled ||= false;
  movie.pendingBeat ||= null;
  movie.pendingNextStage ||= null;
  movie.localDecisions ||= {};
  movie.localDecisionHistory ||= [];
  movie.localTurnNotice ||= null;
  movie.lastLocalResolution ||= null;
  movie.playerFriends ||= {};
  movie.localTheories ||= { midpoint: {}, final: {} };
  movie.localBets ||= {};
  playerCharacters().forEach(name => {
    const hiddenKillerStatus = current.localHiddenKillerEnabled && name === current.hiddenKiller && movie.killers?.includes(name);
    if (!hiddenKillerStatus || !movie.completed) movie.status[name] = "ALIVE";
  });
  Object.entries(movie.status || {}).forEach(([name, status]) => {
    if (status === "PRESUMED DEAD" && !(movie.killers || []).includes(name)) movie.status[name] = "DEAD";
  });
  renderMovie();
}

function renameUniverse(id) {
  const save = saves.find(item => item.id === id);
  if (!save) return;
  const next = prompt("Δώσε ένα όνομα που θα σε βοηθήσει να θυμάσαι αυτό το canon:", save.label || `${save.protagonist}’s Cut`);
  if (!next?.trim()) return;
  save.label = next.trim().slice(0, 80);
  save.updatedAt = Date.now();
  persistSaves();
  renderSaveVault();
}

function deleteUniverse(id, destination = renderHome) {
  const save = saves.find(item => item.id === id);
  if (!save || !confirm(`Να διαγραφεί οριστικά το ${save.protagonist}’s Cut;`)) return;
  saves = saves.filter(item => item.id !== id);
  persistSaves();
  destination();
}

function linkedNames(name) {
  return relations.filter(([a, b]) => a === name || b === name).map(([a, b]) => a === name ? b : a);
}

function relationshipBetween(a, b) {
  const match = relations.find(([left, right]) => (left === a && right === b) || (left === b && right === a));
  return match?.[2] || "";
}

function protagonistRelationship(name) {
  return relationshipBetween(activePlayerName(), name);
}

function relationshipLevel(value, inverse = false) {
  if (inverse) {
    if (value >= 55) return "Πολύ υψηλή";
    if (value >= 28) return "Υψηλή";
    if (value >= 8) return "Υπάρχει";
    return "Χαμηλή";
  }
  const score = value;
  if (score >= 55) return "Πολύ ισχυρό";
  if (score >= 28) return "Ισχυρό";
  if (score >= 8) return "Αναπτύσσεται";
  if (score <= -20) return "Σπασμένο";
  return "Αβέβαιο";
}

function relationshipSummary(name, viewer = activePlayerName()) {
  const state = relationshipState(name, viewer);
  const canon = relationshipBetween(viewer, name);
  const flags = [];
  if (canon) flags.push(canon);
  if (friendsForPlayer(viewer).includes(name)) flags.push("Main group");
  if ((state.loyalty || 0) >= 20) flags.push("Loyal");
  if ((state.suspicion || 0) >= 25) flags.push("Under suspicion");
  return flags.join(" · ") || "Unresolved connection";
}

function canonRelationshipLines(names = current.movie?.cast || []) {
  const active = new Set(names);
  return relations.map(([a, b, type]) => ({
    a, b, type,
    active: active.has(a) && active.has(b),
    partial: active.has(a) || active.has(b)
  }));
}

function renderRelationshipBoard() {
  const movie = current.movie;
  const viewer = isMultiplayerMode() ? (current.relationshipViewer || activePlayerName()) : activePlayerName();
  current.relationshipViewer = viewer;
  const root = screen("movie-shell relationship-board-screen");
  const content = el("div", "content");
  const head = el("div", "section-head");
  const title = el("div");
  title.append(el("p", "eyebrow", `${movieLabel(movie.number)} · ${viewer} · RELATIONSHIP MECHANICS`), el("h1", "headline", "Οι δικοί σου δεσμοί αλλάζουν ποιος επιστρέφει και ποιος επιβιώνει."), el("p", "section-copy", `Αυτό είναι το προσωπικό relationship board ${genitiveName(viewer)}. Το main group αποκτά story priority στα sequels· οι canon συγγένειες, trust, friendship και loyalty επηρεάζουν βοήθεια και survival odds.`));
  head.append(title, button("Επιστροφή στην ταινία", "ghost", renderMovie));
  content.append(head);
  if (isMultiplayerMode()) {
    const switcher = el("div", "relationship-player-switcher");
    switcher.append(el("span", "eyebrow", isOnlineEngine() ? "ONLINE PARTY · VIEW RELATIONSHIPS" : `LOCAL ${playerCharacters().length}P · VIEW RELATIONSHIPS`));
    playerCharacters().forEach((player, index) => {
      const viewButton = button(`PLAYER ${index + 1} · ${player}`, `ghost mini-btn ${player === viewer ? "active" : ""}`.trim(), () => {
        current.relationshipViewer = player;
        saveCurrent();
        renderRelationshipBoard();
      });
      viewButton.setAttribute("aria-pressed", String(player === viewer));
      switcher.append(viewButton);
    });
    content.append(switcher);
  }
  const canonPanel = el("section", "panel canon-relationship-panel");
  canonPanel.append(el("p", "eyebrow", "CANON RELATIONSHIPS · EVERY MOVIE"), el("h2", "headline", "Οι αρχικοί δεσμοί παραμένουν ενεργοί."), el("p", "section-copy", "Οι συγγένειες και οι σχέσεις δεν είναι απλή πληροφορία: όταν τα πρόσωπα βρίσκονται στην ίδια ταινία, μιλούν, συνεργάζονται, τσακώνονται και επηρεάζουν ο ένας τη διάσωση του άλλου."));
  const canonList = el("div", "canon-relationship-list");
  canonRelationshipLines().forEach(({ a, b, type, active, partial }) => {
    const row = el("div", `canon-relationship-row ${active ? "active" : partial ? "partial" : "absent"}`);
    row.append(el("strong", "", `${a} ↔ ${b}`), el("span", "", type), el("small", "", active ? "ON SCREEN · INTERACTING" : partial ? "ONE MEMBER IN THIS CUT" : "CANON · NOT IN THIS CUT"));
    canonList.append(row);
  });
  canonPanel.append(canonList);
  content.append(canonPanel);
  const grid = el("div", "relationship-grid");
  unique([...friendsForPlayer(viewer), ...linkedNames(viewer), ...movie.cast.filter(name => !isPlayerCharacter(name))]).forEach(name => {
    const state = relationshipState(name, viewer);
    if (!state) return;
    const card = el("article", `panel relationship-card ${movie.status[name] === "DEAD" ? "dead" : ""}`);
    const portrait = el("img"); portrait.src = imagePath(name); portrait.alt = "";
    const copy = el("div", "relationship-card-copy");
    const identity = el("div", "bond-identity");
    identity.append(el("span", "social-diamond"), el("small", "", relationshipSummary(name, viewer)));
    copy.append(identity, el("h2", "", name));
    [["Trust", state.trust || 0, false], ["Friendship", state.friendship || 0, false], ["Loyalty", state.loyalty || 0, false], ["Suspicion", state.suspicion || 0, true]].forEach(([label, value, inverse]) => {
      const row = el("div", `bond-row ${String(label).toLowerCase()}`);
      const text = el("span", "bond-label"); text.append(el("b", "", label), el("small", "", relationshipLevel(value, inverse)));
      const meter = el("span", "bond-meter");
      const fill = el("i"); fill.style.width = `${Math.max(5, Math.min(100, 50 + value))}%`; meter.append(fill);
      row.append(text, meter); copy.append(row);
    });
    card.append(portrait, copy); grid.append(card);
  });
  content.append(grid); root.append(content);
}

function supportingVoices(exclude = [], count = 2) {
  const movie = current.movie;
  const available = movie.cast.filter(name => !isPlayerCharacter(name) && !exclude.includes(name) && isAlive(name));
  if (!available.length) return [];
  const offset = ((movie.stage || 0) * 2 + (movie.openingScenario?.id || 0)) % available.length;
  return [...available.slice(offset), ...available.slice(0, offset)].slice(0, count);
}

function dialogueLine(name) {
  const movie = current.movie;
  const relation = protagonistRelationship(name);
  const relatedDead = linkedNames(name).find(other => movie.status[other] === "DEAD");
  const seed = [...name].reduce((total, letter) => total + letter.charCodeAt(0), current.seed + movie.number * 613 + movie.stage * 97 + movie.choices.length * 31 + (movie.openingScenario?.id || 0));
  if (relatedDead) {
    const bond = relationshipBetween(name, relatedDead);
    const grief = bond.includes("Σύντροφοι") ? [
      `Δεν μπορώ να δεχτώ ότι ${subjectName(relatedDead, true)} χάθηκε. Όποιος το έκανε θα το πληρώσει.`,
      `Μου υποσχέθηκε ότι θα φύγουμε μαζί. Δεν θα αφήσω ${accusativeName(relatedDead)} να γίνει απλώς άλλο ένα όνομα.`,
      `Ακούω ακόμη τη φωνή ${genitiveName(relatedDead)}. Αν σταματήσω τώρα, ${genderWord(relatedDead, "τον", "την")} εγκαταλείπω δεύτερη φορά.`
    ] : [
      `${subjectName(relatedDead)} ήταν οικογένειά μου. Θα βρω ποιος το έκανε, ακόμη κι αν πρέπει να μείνω χωρίς κανέναν.`,
      `Δεν πρόλαβα να πω αντίο ${toName(relatedDead)}. Κανείς δεν θα μου πάρει και την αλήθεια.`,
      `Όποιος σκότωσε ${accusativeName(relatedDead)} θα πληρώσει. Δεν με νοιάζει ποια μάσκα φοράει.`
    ];
    return `${bond || "BLOOD BOND"} · «${grief[Math.abs(seed) % grief.length]}»`;
  }
  const priorMemory = continuityMemory(name).at(-1);
  if (priorMemory?.type === "saved") return `SURVIVAL MEMORY · «Δεν ξέχασα ότι με έσωσες στο ${movieLabel(priorMemory.movie)}. Αν χρειαστεί, αυτή τη φορά θα καλύψω εγώ την έξοδό σου.»`;
  if (priorMemory?.type === "accused") {
    const trust = relationshipState(name)?.trust || 0;
    return trust < 0
      ? `BROKEN TRUST · «Με είπες killer χωρίς απόδειξη στο ${movieLabel(priorMemory.movie)}. Μην περιμένεις να σου δώσω ό,τι βρήκα τώρα.»`
      : `WOUNDED TRUST · «Θυμάμαι την κατηγορία σου. Θα βοηθήσω μόνο επειδή ο πραγματικός killer είναι ακόμη εδώ.»`;
  }
  if (priorMemory?.type === "abandoned") return `ABANDONED · «Όταν χωρίστηκαν τα groups, με άφησες πίσω. Επιβίωσα χωρίς εσένα και τώρα θα αποφασίσω εγώ αν θα βοηθήσω.»`;
  if (priorMemory?.type === "grief") return `TRAUMA · «Από τότε που πέθανε ${subjectName(priorMemory.linked, true)}, δεν κοιμάμαι. Αυτή τη φορά θα βρω την αλήθεια πριν χαθεί άλλος άνθρωπος.»`;
  if (movie.secretAlliance?.members?.includes(name) && movie.secretAlliance.revealed) {
    const partner = movie.secretAlliance.members.find(member => member !== name);
    return `SECRET ALLIANCE · «${subjectName(partner)} κι εγώ ανταλλάσσαμε στοιχεία κρυφά. Αυτό δεν μας κάνει killers· σημαίνει ότι δεν εμπιστευόμασταν την ομάδα.»`;
  }
  const contexts = movie.stage <= 2 ? [
    "Το opening δεν ήταν τυχαίο.", "Κάποιος ήξερε ακριβώς πού θα σταθούμε.", "Η πρώτη παγίδα ήταν μήνυμα, όχι απλώς φόνος.", "Κοίτα ποιος αποφεύγει να μιλήσει για όσα είδε."
  ] : movie.stage <= 5 ? [
    "Ο χάρτης δεν ταιριάζει με τις κάμερες.", "Υπάρχει δεύτερη διαδρομή πίσω από τον τοίχο.", "Κάποιος μετακίνησε το στοιχείο πριν φτάσουμε.", "Το άλλοθι αλλάζει κάθε φορά που το ακούμε.", "Το δωμάτιο ήταν κλειδωμένο, αλλά η σκόνη έχει φρέσκα ίχνη."
  ] : movie.stage <= 8 ? [
    "Ο killer μας σπρώχνει να χωριστούμε.", "Η επόμενη επίθεση έχει ήδη αρχίσει.", "Κάποιος μέσα στην ομάδα δίνει λάθος ώρες.", "Δεν εμπιστεύομαι τη σιωπή μετά από εκείνη την κραυγή.", "Αν τρέξουμε όλοι προς το ίδιο μέρος, πέφτουμε ακριβώς στην παγίδα."
  ] : [
    "Δεν θα ξέρουμε την αλήθεια μέχρι να πέσει η τελευταία μάσκα.", "Το πιο καθαρό στοιχείο μπορεί να είναι το πιο τέλειο ψέμα.", "Κανείς δεν πρέπει να θεωρείται αθώος επειδή φοβάται.", "Μη διαλέξεις με βάση αυτό που περιμένει ο killer.", "Μέχρι το τελευταίο cut, τίποτα δεν είναι δεδομένο."
  ];
  const reactions = [
    "Μείνε κοντά μου, αλλά μην πιστέψεις ούτε εμένα χωρίς απόδειξη.",
    "Αν ακούσεις τη φωνή μου από άλλο δωμάτιο, μην απαντήσεις αμέσως.",
    "Θα παρακολουθώ τις εξόδους· εσύ κράτα τα στοιχεία.",
    "Κάποιος εδώ παίζει ρόλο καλύτερα απ’ όλους μας.",
    "Απόψε η σωστή επιλογή μπορεί να μοιάζει με τη χειρότερη."
  ];
  const line = `«${contexts[Math.abs(seed) % contexts.length]} ${reactions[Math.abs(seed * 7 + movie.stage) % reactions.length]}»`;
  const relatedAlive = linkedNames(name).find(other => isAlive(other));
  if (relatedAlive) {
    const canon = relationshipBetween(name, relatedAlive);
    return `${canon || "CANON BOND"} · ${name} & ${relatedAlive}: «${contexts[Math.abs(seed) % contexts.length]} Θα μείνουμε μαζί και θα καλύψουμε ο ένας τον άλλον μέχρι το τέλος.»`;
  }
  return relation ? `${relation} · ${line}` : line;
}

function distributeFriendGroups(names, preferred = []) {
  if (!names.length) return [];
  const active = new Set(names);
  const clusters = [];
  const visited = new Set();
  names.forEach(name => {
    if (visited.has(name)) return;
    const cluster = [];
    const queue = [name];
    while (queue.length) {
      const currentName = queue.shift();
      if (visited.has(currentName) || !active.has(currentName)) continue;
      visited.add(currentName);
      cluster.push(currentName);
      linkedNames(currentName).filter(linked => active.has(linked) && !visited.has(linked)).forEach(linked => queue.push(linked));
    }
    if (cluster.length) clusters.push(cluster);
  });
  const continuity = unique(preferred).filter(name => active.has(name));
  const continuityCluster = unique(clusters.filter(cluster => cluster.some(name => continuity.includes(name))).flat());
  const otherClusters = clusters.filter(cluster => !cluster.some(name => continuityCluster.includes(name)));
  const requestedGroups = current?.gameMode === "local" && playerCharacters().length >= 3 ? 4 : 3;
  const groupCount = Math.max(1, Math.min(requestedGroups, names.length));
  const groups = Array.from({ length: groupCount }, () => []);
  if (continuityCluster.length) groups[0].push(...continuityCluster);
  otherClusters.forEach(cluster => {
    const destination = groups
      .map((group, index) => ({ index, size: group.length }))
      .sort((a, b) => a.size - b.size || a.index - b.index)[0].index;
    groups[destination].push(...cluster);
  });
  // A 3-player Local game deliberately exposes four routes. If canon clusters
  // produced an empty route, split the largest group so no option is fake and
  // choosing different paths cannot automatically protect the entire cast.
  groups.forEach((group, index) => {
    if (group.length) return;
    const donorIndex = groups.map((candidate, candidateIndex) => ({ candidateIndex, size: candidate.length }))
      .filter(entry => entry.size > 1)
      .sort((a, b) => b.size - a.size)[0]?.candidateIndex;
    if (donorIndex === undefined) return;
    group.push(groups[donorIndex].pop());
  });
  return groups.filter(group => group.length);
}

function startMovie(number) {
  current.movieNumber = number;
  current.movie = generateMovie(number);
  if (isLocalMode()) current.activePlayerIndex = current.movie.openingPlayerIndex || 0;
  if (current.gameMode === "online") {
    current.onlineScenarioHistory ||= [];
    current.onlineScenarioHistory[number - 1] = {
      number,
      cast: [...current.movie.cast],
      killers: [...current.movie.killers],
      survivors: current.movie.cast.filter(name => !current.movie.killers.includes(name)),
      friends: unique(current.movie.friendOptions?.[0] || []).slice(0, 4),
      saved: [],
      statuses: Object.fromEntries(current.movie.killers.map(name => [name, "KILLER · PRESUMED DEAD"]))
    };
  }
  saveCurrent();
  if (number === 3 && current.history.length) renderRecap();
  else playCastIntro();
}

function generateMovie(number) {
  const scenarioHistory = current.gameMode === "online" ? (current.onlineScenarioHistory || []) : current.history;
  const random = mulberry32((current.seed + number * 9973 + scenarioHistory.length * 1117) >>> 0);
  const protagonist = current.protagonist;
  const players = castPlayerCharacters();
  const oldKillers = unique(scenarioHistory.flatMap(movie => movie.killers || [])).filter(name => !players.includes(name));
  const confirmedDead = new Set(unique(scenarioHistory.flatMap(record => [
    ...(record.killers || []),
    ...Object.entries(record.statuses || {}).filter(([, status]) => status === "DEAD").map(([name]) => name)
  ])));
  const movieOneDepartures = unique(scenarioHistory.filter(record => record.number === 1).flatMap(record => record.departed || []))
    .filter(name => !players.includes(name) && !confirmedDead.has(name));
  const priorSurvivors = number === 1 ? [] : unique(scenarioHistory.at(-1)?.survivors || [])
    .filter(name => !players.includes(name) && !confirmedDead.has(name) && (number !== 2 || !movieOneDepartures.includes(name)));
  const priorCoreFriends = number === 1 ? [] : unique(scenarioHistory.at(-1)?.friends || [])
    .filter(name => priorSurvivors.includes(name));
  const legacyPriority = unique([...players.flatMap(player => linkedNames(player)), ...priorSurvivors])
    .filter(name => !players.includes(name) && !confirmedDead.has(name));
  const desired = number === 1 ? 11 : 12;
  const seenBefore = new Set(scenarioHistory.flatMap(record => record.cast || []));
  const returningLimit = number === 2 ? Math.max(4, priorCoreFriends.length) : 0;
  const returningSurvivors = number === 2
    ? unique([...priorCoreFriends, ...shuffle(legacyPriority.filter(name => !priorCoreFriends.includes(name)), random)]).slice(0, returningLimit)
    : [];
  const newcomers = shuffle(allNames().filter(name => !players.includes(name) && !seenBefore.has(name) && !confirmedDead.has(name) && (number !== 2 || !movieOneDepartures.includes(name))), random);
  const otherLiving = shuffle(allNames().filter(name => !players.includes(name) && !confirmedDead.has(name) && !returningSurvivors.includes(name) && !newcomers.includes(name) && (number !== 2 || !movieOneDepartures.includes(name))), random);
  const allLegacySurvivors = unique(scenarioHistory.flatMap(record => record.survivors || []))
    .filter(name => !players.includes(name) && !confirmedDead.has(name));
  let cast = number === 3
    ? unique([...players, ...movieOneDepartures, ...newcomers, ...shuffle(allLegacySurvivors, random), ...otherLiving])
    : unique([...players, ...returningSurvivors, ...newcomers, ...otherLiving]).slice(0, desired + players.length - 1);

  // A previous killer's relative/partner can return as a revenge suspect,
  // an innocent target or a genuine helper. The relationship opens an arc;
  // it never proves guilt and the mode is rolled independently per trilogy.
  const linkedLegacyCandidates = unique(oldKillers.flatMap(killer => linkedNames(killer)))
    .filter(name => !players.includes(name) && !confirmedDead.has(name));
  let relationshipArc = null;
  if (number > 1 && linkedLegacyCandidates.length && random() < .62) {
    const subject = pick(linkedLegacyCandidates, random);
    const linkedKiller = oldKillers.find(killer => linkedNames(killer).includes(subject));
    const arcRoll = random();
    const mode = arcRoll < .30 ? "revenge-killer" : arcRoll < .68 ? "innocent-suspect" : "truth-seeker";
    relationshipArc = { subject, linkedKiller, mode, relation: relationshipBetween(subject, linkedKiller), revealed: false };
    if (!cast.includes(subject)) {
      const replaceIndex = cast.map((name, index) => ({ name, index }))
        .reverse().find(entry => !players.includes(entry.name) && !priorCoreFriends.includes(entry.name))?.index;
      if (replaceIndex !== undefined) cast.splice(replaceIndex, 1, subject);
      else cast.push(subject);
    }
  }

  let returningKiller = null;
  let killerCount;
  let killerProfile = "NEW KILLERS";
  if (number === 3) {
    const legacyRoll = random();
    if (legacyRoll < .34 && oldKillers.length) {
      returningKiller = pick(oldKillers, random);
      const accompliceRoll = random();
      killerCount = accompliceRoll < .55 ? 1 : accompliceRoll < .85 ? 2 : 3;
      killerProfile = killerCount === 1 ? "LEGACY GHOST · SOLO" : `LEGACY GHOST + ${killerCount - 1} NEW`;
    } else {
      const newKillerRoll = random();
      killerCount = newKillerRoll < .35 ? 1 : newKillerRoll < .80 ? 2 : 3;
    }
  } else {
    const roll = random();
    killerCount = roll < .10 ? 1 : roll < .79 ? 2 : roll < .99 ? 3 : 4;
  }

  if (returningKiller && cast.includes(returningKiller)) {
    cast = cast.filter(name => name !== returningKiller);
    const replacement = shuffle(allNames().filter(name => !cast.includes(name) && !players.includes(name) && name !== returningKiller && !confirmedDead.has(name)), random)[0];
    if (replacement) cast.push(replacement);
  }

  let eligibleKillers = shuffle(cast.filter(name => !players.includes(name)), random);
  if (relationshipArc?.mode === "revenge-killer") eligibleKillers = unique([relationshipArc.subject, ...eligibleKillers]);
  if (relationshipArc && relationshipArc.mode !== "revenge-killer") eligibleKillers = eligibleKillers.filter(name => name !== relationshipArc.subject);
  if (number === 3 && !returningKiller) {
    const wronglyAccusedBefore = unique(scenarioHistory.flatMap(record => record.wronglyAccused || []));
    const legacyFriends = unique(scenarioHistory.flatMap(record => record.friends || []));
    const historyShapedCandidates = unique([...wronglyAccusedBefore, ...legacyFriends])
      .filter(name => cast.includes(name) && !players.includes(name));
    eligibleKillers = unique([...shuffle(historyShapedCandidates, random), ...eligibleKillers]);
  }
  let killers = returningKiller
    ? [returningKiller, ...eligibleKillers.slice(0, Math.max(0, killerCount - 1))]
    : eligibleKillers.slice(0, killerCount);
  if (number === 3 && returningKiller && relationshipArc?.mode === "revenge-killer" && linkedNames(returningKiller).includes(relationshipArc.subject)) {
    killers = unique([returningKiller, relationshipArc.subject, ...killers]).slice(0, Math.max(2, killerCount));
  }
  const hiddenHumanKiller = current.localHiddenKillerEnabled && number === 3 ? current.hiddenKiller : null;
  if (hiddenHumanKiller) {
    const npcKillers = killers.filter(name => name !== hiddenHumanKiller);
    if (!npcKillers.length && eligibleKillers[0]) npcKillers.push(eligibleKillers[0]);
    killers = unique([hiddenHumanKiller, ...npcKillers]);
    killerProfile = `HIDDEN PLAYER + ${npcKillers.length} MASKED NPC${npcKillers.length === 1 ? "" : "S"}`;
  }
  const victims = cast.filter(name => !players.includes(name) && !killers.includes(name));
  const previousRecord = scenarioHistory.at(-1);
  const survivingLegacyFriends = unique(scenarioHistory.flatMap(record =>
    (record.friends || []).filter(name => (record.survivors || []).includes(name))
  ));
  const legacySaved = unique(scenarioHistory.flatMap(record => record.saved || []));
  const protectedLegacy = number > 1 ? unique([
    previousRecord?.closestFriend,
    previousRecord?.mostTrusted,
    ...survivingLegacyFriends,
    ...legacySaved,
    ...priorSurvivors.filter(name => (relationshipState(name, protagonist)?.loyalty || 0) >= 20)
  ]).filter(name => victims.includes(name)) : [];
  const openingPool = victims.filter(name => !protectedLegacy.includes(name));
  const safeOpeningPool = openingPool.length >= 2 ? openingPool : victims;
  const openingTarget = pick(safeOpeningPool, random);
  const openingPartner = pick(safeOpeningPool.filter(name => name !== openingTarget), random);
  const remainingVictims = victims.filter(name => ![openingTarget, openingPartner].includes(name));
  const dangerA = pick(remainingVictims, random);
  const dangerB = pick(remainingVictims.filter(name => name !== dangerA), random);
  const secondTarget = pick(remainingVictims.filter(name => ![dangerA, dangerB].includes(name)), random);
  const secondBackupTarget = pick(remainingVictims.filter(name => ![dangerA, dangerB, secondTarget].includes(name)), random);
  const innocent = pick(cast.filter(name => !players.includes(name) && !killers.includes(name)), random);
  const secretHolder = pick(cast.filter(name => !players.includes(name) && name !== innocent), random);
  const mainKiller = killers.find(name => !isPlayerCharacter(name)) || killers[0];
  const mysteryFinalClue = number === 3;
  const legacyEcho = mysteryFinalClue && oldKillers.length ? (returningKiller || pick(oldKillers, random)) : null;
  const clueIdentity = mysteryFinalClue ? (legacyEcho ? `${legacyEcho} · ARCHIVE ECHO` : "UNKNOWN FIGURE") : mainKiller;
  const legacyClueWarning = legacyEcho
    ? `Το ίχνος μοιάζει με εκείνο ${genitiveName(legacyEcho)}, σαν να βρισκόταν εδώ. Μπορεί όμως να είναι επιστροφή, αντιγραφή ή εσκεμμένη παγίδα — δεν αποδεικνύει ότι επέστρεψε κανείς.`
    : "Το ίχνος μοιάζει να έρχεται από παλιό case file, αλλά δεν αποδεικνύει αν ανήκει σε παλιό ή νέο killer.";
  const continuityFriends = number === 1 ? [] : unique([
    ...(previousRecord?.friends || []),
    ...priorCoreFriends
  ]).filter(name => cast.includes(name) && !players.includes(name));
  const shuffledFriends = shuffle(cast.filter(name => !players.includes(name)), random);
  const friendOptions = distributeFriendGroups(shuffledFriends, continuityFriends);
  const world = movieWorlds[number];
  const rooms = shuffle(expandedRooms(number), random).slice(0, 12);
  const locationChoices = rooms.slice(0, 4).map(room => [room.name, room.hint]);
  const openingScenario = buildOpeningScenario(number, openingTarget, openingPartner, random, current.history.map(record => record.openingScenarioId));
  const fatalityTarget = number === 1
    ? Math.min(Math.max(4, cast.length - 3), 4 + Math.floor(random() * 4))
    : number === 2
      ? Math.min(Math.max(5, cast.length - 3), 5 + Math.floor(random() * 4))
      : Math.min(Math.max(6, cast.length - 3), Math.max(8, Math.ceil(cast.length * .62) + Math.floor(random() * 3)));
  const openingKillerRoll = random();
  const puzzle = pick(investigationPuzzles, random);
  const rareEventRoll = random();
  const rareEvent = rareEventRoll < .18 ? pick([
    { type: "ANONYMOUS CALL", title: "Η φωνή ξέρει ποιος έμεινε μόνος.", truthMode: random() < .52 ? "truth" : "trap" },
    { type: "HIDDEN WARNING", title: "Μην εμπιστευτείς το πιο καθαρό στοιχείο.", truthMode: random() < .58 ? "truth" : "trap" },
    { type: "UNMARKED CASE FILE", title: "Ένα κρυφό αρχείο εμφανίζεται χωρίς αποστολέα.", truthMode: random() < .50 ? "truth" : "trap" },
    { type: number === 3 ? "LEGACY ECHO" : "FORGED TRACE", title: number === 3 ? "Μια παλιά υπογραφή επιστρέφει — ή αντιγράφεται τέλεια." : "Το ίχνος δείχνει κάποιον υπερβολικά εύκολα.", truthMode: random() < .45 ? "truth" : "trap" }
  ], random) : null;
  const alliancePool = shuffle(cast.filter(name => !players.includes(name)), random);
  const secretAlliance = alliancePool.length >= 2 && random() < .34 ? {
    members: alliancePool.slice(0, 2),
    nature: pick(["mutual-protection", "hidden-evidence", "shared-secret", "private-investigation", "protect-a-relative"], random),
    revealed: false
  } : null;
  const cluePool = [
    pick([
      { type: "REAL CLUE", title: `${clueIdentity}: το δεύτερο τηλέφωνο`, text: mysteryFinalClue ? `${legacyClueWarning} Το burner phone ενεργοποιήθηκε σε εγκαταλελειμμένο σημείο χωρίς καταχωρημένο ιδιοκτήτη.` : `Το burner phone ενεργοποιήθηκε κοντά στο σπίτι ${genitiveName(mainKiller)}, τέσσερα λεπτά πριν από την επίθεση.` },
      { type: "REAL CLUE", title: `${clueIdentity}: το κλειδί του projector`, text: mysteryFinalClue ? `${legacyClueWarning} Το κλειδί έχει καμένη επιφάνεια και cloned αποτυπώματα από σφραγισμένο evidence bag.` : `Το μοναδικό κλειδί του projection booth βρέθηκε σε σακάκι που φόρεσε ${subjectName(mainKiller, true)}.` },
      { type: "REAL CLUE", title: `${clueIdentity}: το σβησμένο frame`, text: mysteryFinalClue ? `${legacyClueWarning} Το frame αναπαράγει μια γνώριμη κίνηση, όμως το πρόσωπο έχει αφαιρεθεί ψηφιακά.` : `Στο χαμένο frame φαίνεται καθαρά η αντανάκλαση ${genitiveName(mainKiller)} πριν χτυπήσει ο συναγερμός.` },
      { type: "REAL CLUE", title: `${clueIdentity}: η κρυφή διαδρομή`, text: mysteryFinalClue ? `${legacyClueWarning} Ο παλιός κωδικός χρησιμοποιήθηκε από μη καταχωρημένο terminal και θα μπορούσε να έχει αντιγραφεί.` : `Μόνο ${subjectName(mainKiller, true)} γνώριζε τον κωδικό της διαδρομής που χρησιμοποίησε η μάσκα.` },
      { type: "REAL CLUE", title: `${clueIdentity}: το ίχνος στο archive`, text: mysteryFinalClue ? `${legacyClueWarning} Το cloned token συνδέεται με το παλιό case, όχι με επιβεβαιωμένη παρουσία ανθρώπου.` : `Η πρόσβαση στο κλειδωμένο archive έγινε με προσωπικό token ${genitiveName(mainKiller)}.` }
    ], random),
    pick([
      { type: "RED HERRING", title: `${innocent}: αίμα στο αυτοκίνητο`, text: `Το αίμα ανήκει στο προηγούμενο θύμα, αλλά ${subjectName(innocent, true)} καθάρισε το αυτοκίνητο πριν φτάσει η αστυνομία.` },
      { type: "RED HERRING", title: `${innocent}: η σκισμένη μάσκα`, text: `Το ύφασμα ταιριάζει στα ρούχα ${genitiveName(innocent)}, επειδή το θύμα τα είχε δανειστεί νωρίτερα.` },
      { type: "RED HERRING", title: `${innocent}: το ψεύτικο άλλοθι`, text: `${subjectName(innocent)} είπε ψέματα για το πού βρισκόταν — αλλά έκρυβε κάτι άσχετο με τους φόνους.` },
      { type: "RED HERRING", title: `${innocent}: το ματωμένο εισιτήριο`, text: `Το εισιτήριο βρέθηκε στη σκηνή, όμως το είχε κλέψει το πρώτο θύμα ώρες πριν.` },
      { type: "RED HERRING", title: `${innocent}: η ηχογράφηση`, text: `Η φωνή μοιάζει με εκείνη ${genitiveName(innocent)}, αλλά το αρχείο έχει μονταριστεί από τρία παλιότερα clips.` }
    ], random),
    pick([
      { type: "CHARACTER SECRET", title: `${secretHolder}: σβησμένα μηνύματα`, text: `${subjectName(secretHolder)} είχε κανονίσει μυστική συνάντηση και έσβησε όλη τη συνομιλία.` },
      { type: "CHARACTER SECRET", title: `${secretHolder}: κρυφό χρέος`, text: `${subjectName(secretHolder)} έκρυβε μια συμφωνία που θα κατέστρεφε τη σχέση ${genitiveName(secretHolder)} με το group.` },
      { type: "CHARACTER SECRET", title: `${secretHolder}: δεύτερη ταυτότητα`, text: `Ένα παλιό badge δείχνει ότι ${subjectName(secretHolder, true)} εργαζόταν εδώ με άλλο όνομα.` },
      { type: "CHARACTER SECRET", title: `${secretHolder}: το κλεμμένο footage`, text: `${subjectName(secretHolder)} είχε αντιγράψει ιδιωτικό footage για προσωπικό σκοπό, όχι για τον killer.` },
      { type: "CHARACTER SECRET", title: `${secretHolder}: η μυστική έξοδος`, text: `${subjectName(secretHolder)} γνώριζε μια έξοδο αλλά την έκρυβε για να προστατεύσει κάποιον άλλο.` }
    ], random)
  ];
  cluePool.push(pick([
    { type: "REAL CLUE", title: `${clueIdentity}: το σπασμένο radio`, text: mysteryFinalClue ? `${legacyClueWarning} Η συχνότητα κρατά ένα παλιό ηχητικό αποτύπωμα, αλλά μπορεί να είναι αντιγραφή.` : `Το κρυπτογραφημένο radio συνδέθηκε με συσκευή που χρησιμοποίησε ${subjectName(mainKiller, true)} πριν από το blackout.` },
    { type: "RED HERRING", title: `${innocent}: το κλειδωμένο ντουλάπι`, text: `Το ντουλάπι είχε αντικείμενα ${genitiveName(innocent)}, αλλά το λουκέτο ανοίχτηκε με δεύτερο, άγνωστο κλειδί.` },
    { type: "CHARACTER SECRET", title: `${secretHolder}: η κρυφή συχνότητα`, text: `${subjectName(secretHolder)} άκουγε τις συνομιλίες του group χωρίς να το παραδεχτεί. Αυτό εξηγεί όσα γνώριζε, όχι αν είναι killer.` }
  ], random));
  const locationClues = Object.fromEntries(locationChoices.map((location, index) => [location[0], cluePool[index]]));
  const status = Object.fromEntries(unique([...cast, ...killers]).map(name => [name, "ALIVE"]));
  const historicalChoice = current.history.flatMap(movie => movie.pivotal || [])[0];
  let motive = pick(motives, random);
  let motiveLine = `Όλα οδηγούν σε εσένα, ${players.join(" και ")}. Όχι επειδή τα ξεκινήσατε — επειδή ήσασταν πάντα το τέλος.`;
  if (number === 3 && returningKiller) {
    motive = "Επιστροφή για εκδίκηση";
    motiveLine = `Με είδες να πέφτω και έγραψες το τέλος μου. Εγώ έγραφα το δικό σου.`;
  } else if (relationshipArc?.mode === "revenge-killer" && killers.includes(relationshipArc.subject)) {
    motive = `Εκδίκηση λόγω δεσμού · ${relationshipArc.relation || "προσωπική σχέση"}`;
    motiveLine = `${subjectName(relationshipArc.linkedKiller)} δεν ήταν απλώς ένα όνομα στο αρχείο. Όταν ${genderWord(relationshipArc.linkedKiller, "τον", "την")} χάσατε, αποφάσισα να συνεχίσω εγώ το τέλος.`;
  } else if (number === 3 && historicalChoice) {
    motive = "Η επιλογή που δεν ξεχάστηκε";
    motiveLine = `Δεν θυμάσαι καν την επιλογή «${historicalChoice}», έτσι; Εγώ τη θυμόμουν κάθε μέρα.`;
  }

  return {
    number, title: movieTitles[number], stage: 0, cast, introCast: cast.filter(name => name !== returningKiller),
    killers, returningKiller, legacyEcho, mainKiller, killerProfile, motive, motiveLine, status,
    openingTarget, openingPartner, dangerA, dangerB, secondTarget, secondBackupTarget,
    friendOptions, continuityFriends, newcomers: [...newcomers], friends: [], playerFriends: {}, keyHolder: null, itemHolders: [], itemKeepers: [], itemKept: false, itemUsed: false, survivalItem: pick(survivalItems[number], random),
    locationChoices, locationClues, rooms, worldAsset: world.asset, protectedLegacy, fatalityTarget, openingScenario, openingKillerRoll,
    relationshipArc, rareEvent, rareEventConsumed: false, secretAlliance, secretAttackVictims: [], wrongAccusationResolved: false,
    cluesFound: [], choices: [], firstSuspicion: [], midpointTheory: [], finalTheory: [], pendingTheory: [],
    pendingBet: 0, betAmount: 0, betPayout: 0, betResult: "NO BET", betSettled: false, localDecisions: {}, localDecisionHistory: [], localTurnNotice: null, lastLocalResolution: null, localTheories: { midpoint: {}, final: {} }, localBets: {},
    stageResult: null, saved: [], offscreenDeaths: [], lateDeaths: [], abandoned: [], deathOrder: [], canonMoments: [], deathsPrevented: 0, peopleSaved: 0,
    investigatedRooms: [], investigationPhase: "rooms", investigationActions: 0, initialInvestigationComplete: false, additionalActions: {}, additionalActionDrafts: {}, additionalActionsComplete: false, dialoguedWith: [], puzzle, puzzleSolved: false, puzzleAdvantage: false, itemSaved: [], resolvedLegacyKillers: [], relationshipEvent: null, relationshipEventShown: false, accusationDebates: {}, finalDeepInvestigationResolved: false, finalDeepInvestigationResult: null,
    openingPlayerIndex: isLocalMode() ? (Math.floor(random() * players.length)) : 0,
    roleBriefingComplete: !(current.localHiddenKillerEnabled && number === 3), roleBriefingIndex: 0, roleBriefingRevealed: false, hiddenKillerStrategy: null,
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
  const isHiddenHumanKiller = current.localHiddenKillerEnabled && name === current.hiddenKiller && movie.killers.includes(name);
  if (!name || (isPlayerCharacter(name) && !isHiddenHumanKiller)) return false;
  const previous = movie.status[name];
  const protectedAsSaved = previous === "SAVED" || (movie.saved || []).includes(name) || (movie.itemSaved || []).includes(name);
  if (status === "DEAD" && protectedAsSaved && !movie.killers.includes(name)) return false;
  movie.status[name] = status;
  if (status === "DEAD" && previous !== "DEAD") {
    movie.deathOrder ||= [];
    if (!movie.deathOrder.includes(name)) movie.deathOrder.push(name);
  }
  return true;
}

function isAlive(name) { return current.movie.status[name] === "ALIVE" || current.movie.status[name] === "SAVED"; }
function isKiller(name) { return current.movie.killers.includes(name); }
function movieThreeProtected(name) {
  const movie = current?.movie;
  if (!movie || movie.number !== 3 || !name || isPlayerCharacter(name) || movie.killers?.includes(name)) return false;
  const currentFriends = unique([
    ...(movie.friends || []),
    ...Object.values(movie.playerFriends || {}).flat()
  ]);
  const historyFriends = current.history?.some(record => (record.friends || []).includes(name)) || false;
  const historySaved = current.history?.some(record => (record.saved || []).includes(name)) || false;
  return currentFriends.includes(name) || (movie.saved || []).includes(name) || (movie.itemSaved || []).includes(name) || historyFriends || historySaved;
}
function movieInteractionScore(name) {
  const movie = current.movie;
  const stateScores = Object.values(current.relationshipsByPlayer || {}).map(board => {
    const state = board?.[name] || {};
    return (state.friendship || 0) + (state.trust || 0) + (state.loyalty || 0);
  });
  const choiceMentions = (movie.choices || []).reduce((total, choice) => {
    const text = `${choice.text || ""} ${choice.consequence || ""}`;
    return total + (text.includes(name) ? 1 : 0);
  }, 0);
  const mortalityBias = name === "Paul" ? -95 : 0;
  return mortalityBias + choiceMentions * 4
    + (movie.dialoguedWith || []).filter(entry => entry === name).length * 8
    + (movie.canonMoments || []).filter(moment => (moment.pair || []).includes(name)).length * 8
    + (movie.friends || []).includes(name) * 40
    + (movie.saved || []).includes(name) * 45
    + (movie.itemSaved || []).includes(name) * 30
    + itemHeldBy(name) * 55
    + linkedNames(name).some(linked => isPlayerCharacter(linked)) * 28
    + Math.max(0, ...stateScores) / 25;
}
function rankMovieThreeDeaths(names, random) {
  return shuffle(names, random).sort((a, b) => movieInteractionScore(a) - movieInteractionScore(b));
}

function continuityMemory(name, viewer = activePlayerName()) {
  const memories = [];
  current.history?.forEach(record => {
    if ((record.saved || []).includes(name)) memories.push({ type: "saved", movie: record.number, text: `${viewer} βοήθησε να επιζήσει` });
    if ((record.wronglyAccused || []).includes(name)) memories.push({ type: "accused", movie: record.number, text: `${viewer} τον/την κατηγόρησε άδικα` });
    if ((record.friends || []).includes(name)) memories.push({ type: "friend", movie: record.number, text: "ήταν μέλος της βασικής παρέας" });
    if ((record.abandoned || []).includes(name)) memories.push({ type: "abandoned", movie: record.number, text: `${viewer} τον/την άφησε έξω από το group` });
    const lostLinked = linkedNames(name).find(linked => (record.deaths || []).includes(linked));
    if (lostLinked) memories.push({ type: "grief", movie: record.number, linked: lostLinked, text: `έχασε ${accusativeName(lostLinked)}` });
  });
  return memories;
}

function continuityIntroLine(name) {
  const memories = continuityMemory(name, playerCharacters()[0]);
  const latest = memories.at(-1);
  if (!latest) return "";
  if (latest.type === "saved") return `${subjectName(name)} θυμάται ποιος/ποια ${genderWord(name, "τον", "την")} έσωσε στο ${movieLabel(latest.movie)}.`;
  if (latest.type === "accused") return `${subjectName(name)} δεν έχει ξεχάσει τη λανθασμένη κατηγορία του ${movieLabel(latest.movie)}.`;
  if (latest.type === "abandoned") return `${subjectName(name)} θυμάται ότι έμεινε έξω από το group στο ${movieLabel(latest.movie)}.`;
  if (latest.type === "grief") return `${subjectName(name)} επιστρέφει με το τραύμα από τον θάνατο ${genitiveName(latest.linked)}.`;
  return `${subjectName(name)} επιστρέφει επειδή ο δεσμός με την ομάδα άντεξε.`;
}

function teamWeaknessProfile() {
  const movie = current.movie;
  const boards = Object.values(current.relationshipsByPlayer || {});
  const names = movie.cast.filter(name => !isPlayerCharacter(name));
  const values = boards.flatMap(board => names.map(name => board?.[name]?.trust || 0));
  const averageTrust = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  const wrongAccusations = unique([...(movie.midpointTheory || []), ...(movie.finalTheory || [])]).filter(name => !movie.killers.includes(name) && name !== "LEGACY GHOST").length;
  const clueDeficit = Math.max(0, 3 - (movie.cluesFound || []).length);
  const pressure = Math.max(0, Math.min(1, .28 + wrongAccusations * .10 + clueDeficit * .08 + (movie.puzzleSolved && !movie.puzzleAdvantage ? .14 : 0) - averageTrust / 240));
  return { averageTrust, wrongAccusations, clueDeficit, pressure };
}

function maybeSecretAttack(context, random) {
  const movie = current.movie;
  const weakness = teamWeaknessProfile();
  const chance = .10 + weakness.pressure * .24 + (context === "failed-puzzle" ? .14 : 0);
  if (random() >= chance) return null;
  const pool = rankMovieThreeDeaths(movie.cast.filter(name => !isPlayerCharacter(name) && !isKiller(name) && isAlive(name)
    && !friendsForPlayer().includes(name) && movie.status[name] !== "SAVED" && !movie.saved.includes(name)
    && !movie.itemSaved.includes(name) && !itemHeldBy(name)), random);
  const victim = pool[0] || null;
  if (!victim || !setStatus(victim, "DEAD")) return null;
  movie.secretAttackVictims = unique([...(movie.secretAttackVictims || []), victim]);
  remember(`Κρυφή επίθεση (${context}): ${victim}.`, `${victim} was murdered outside the Inner Circle and the death was announced immediately.`);
  return victim;
}

function consumeRareEvent() {
  const movie = current.movie;
  if (!movie.rareEvent || movie.rareEventConsumed) return null;
  movie.rareEventConsumed = true;
  const event = movie.rareEvent;
  return `${event.type} · ${event.title} Το εύρημα μπορεί να είναι αληθινό ή killer-planted και δεν αποκαλύπτει ταυτότητα πριν από το reveal.`;
}
function itemHeldBy(name) {
  const movie = current.movie;
  return (movie.itemHolders || []).includes(name) || movie.keyHolder === name || (movie.itemKeepers || []).includes(name) || (movie.itemKept && isPlayerCharacter(name));
}
function playerHasItem() {
  const movie = current.movie;
  return movie.itemKept || Boolean(movie.keyHolder);
}

function renderRecap() {
  stopMusic();
  const root = screen();
  const content = el("div", "content narrow");
  content.append(el("p", "eyebrow", "PREVIOUSLY… · MOVIE I + MOVIE II"), el("h1", "display", "Your canon remembers everything."), el("p", "lead", "Οι δύο πρώτες ταινίες επιστρέφουν αναλυτικά πριν ανοίξει το Final Chapter. Οι ταυτότητες των killers παραμένουν κρυφές μέχρι το reveal της κάθε ταινίας."));
  const list = el("div", "recap-movie-list");
  current.history.filter(record => record.number < 3).forEach((record, movieIndex) => {
    const block = el("article", "panel recap-movie");
    block.append(el("p", "eyebrow", `${movieLabel(record.number)} · ${record.title}`), el("h2", "headline", `Τι συνέβη στην ${movieLabel(record.number)}`));
    const opening = record.openingTarget && record.openingPartner
      ? record.openingOutcome && typeof record.openingOutcome === "object"
        ? `Opening: ${Object.entries(record.openingOutcome).map(([player, outcome]) => `${player} → ${outcome === "both" ? "κινδύνευσαν και οι δύο" : `επέζησε ${subjectName(outcome === "target" ? record.openingTarget : record.openingPartner, true)}`}`).join(" · ")}.`
        : record.openingOutcome === "both"
          ? `Opening: ${record.openingTarget} και ${record.openingPartner} πέθαναν.`
          : `Opening: ${record.openingTarget} και ${record.openingPartner} χωρίστηκαν· επέζησε ${subjectName(record.openingOutcome === "target" ? record.openingTarget : record.openingPartner, true)}.`
      : `Opening scenario ${String(record.openingScenarioId || "—").padStart(3, "0")}: το αποτέλεσμα καταγράφηκε στο canon.`;
    const lines = [
      opening,
      `Η βασική σου παρέα ήταν: ${record.friends?.join(", ") || "κανείς"}.`,
      `Σώθηκαν μέσα στην ταινία: ${record.saved?.join(", ") || "κανείς"}.`,
      `Πέθαναν στην πορεία: ${record.deaths?.join(", ") || "κανείς"}.`,
      `Επέζησαν μέχρι το τέλος: ${record.survivors?.join(", ") || "κανείς"}.`,
      `Το αντικείμενο ήταν: ${record.survivalItem || "—"}${record.itemHolder ? ` · το κράτησε ο/η ${record.itemHolder}` : " · έμεινε πάνω σου"}${record.itemUsed ? " · επηρέασε το αποτέλεσμα" : " · δεν ενεργοποίησε σωτηρία"}.`,
      `Βρήκες ${record.cluesFound || 0} στοιχεία, έκανες ${record.choices || 0} επιλογές και απέτυχες/πέτυχες στα puzzles ανάλογα με το canon του save.`,
      record.wronglyAccused?.length ? `Λάθος κατηγορίες: ${record.wronglyAccused.join(", ")}.` : "Δεν καταγράφηκε λάθος κατηγορία.",
      record.canonMoments?.length ? `Canon στιγμές σχέσεων: ${record.canonMoments.map(moment => `${moment.pair.join(" + ")} (${moment.relation})`).join(" · ")}.` : "Δεν ενεργοποιήθηκε ξεχωριστή canon-pair σκηνή."
    ];
    const details = el("div", "recap-list");
    lines.forEach((text, lineIndex) => {
      const line = el("div", "recap-line");
      line.style.animationDelay = `${(movieIndex * .12) + lineIndex * .08}s`;
      line.append(el("span", "", String(lineIndex + 1).padStart(2, "0")), el("p", "", text));
      details.append(line);
    });
    const choices = (record.choicesLog || []).slice(0, 16).map(choice => `${choice.text}${choice.consequence ? ` — ${choice.consequence}` : ""}`);
    if (choices.length) {
      const choicePanel = el("div", "recap-choices");
      choicePanel.append(el("p", "eyebrow", "PIVOTAL CHOICES"), el("p", "section-copy", choices.join(" · ")));
      block.append(details, choicePanel);
    } else block.append(details);
    list.append(block);
  });
  list.append(el("p", "recap-last-line", "Δύο χρόνια αργότερα, το τηλέφωνο χτύπησε ξανά…"));
  content.append(list);
  const actions = el("div", "actions");
  actions.append(button("Παίξε το Final Chapter", "", playCastIntro));
  content.append(actions);
  root.append(content);
}

function playCastIntro() {
  stopTimers();
  stopMusic();
  document.documentElement.classList.add("intro-lock");
  document.body.classList.add("intro-lock");
  const movie = current.movie;
  const cast = unique(movie.introCast?.length ? movie.introCast : [movie.openingTarget, movie.openingPartner, current.protagonist]);
  movie.introCast = cast;
  let index = 0;
  document.querySelectorAll(".cast-intro, .skip").forEach(node => node.remove());
  const overlay = el("section", "cast-intro");
  const skip = el("button", "skip", "Skip intro");
  skip.type = "button";
  skip.addEventListener("click", finishCastIntro);
  document.body.append(overlay, skip);
  playMusic(introAudio);

  function showCredit() {
    const name = cast[index];
    overlay.textContent = "";
    const backdrop = el("div", "cast-backdrop");
    const img = el("img");
    img.src = cinematicImagePath(name);
    img.alt = "";
    img.dataset.character = name;
    backdrop.append(img);
    const copy = el("div", "cast-title");
    const legacyCore = current.history.some(record => (record.friends || []).includes(name) && (record.survivors || []).includes(name));
    const playerIndex = playerCharacters().indexOf(name);
    const label = isPlayerCharacter(name) ? playerIndex >= 0 ? `STARRING · PLAYER ${playerIndex + 1}` : "STARRING · ONLINE PLAYER" : legacyCore ? "RETURNING · YOUR INNER CIRCLE" : index < 4 ? "ALSO STARRING" : "WITH";
    copy.append(el("div", "credit", label), el("h1", "", name), el("p", "", `${movieLabel(movie.number)} · ${movie.title}`));
    overlay.append(backdrop, copy);
    index += 1;
    if (index >= cast.length) {
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
  if (current.localHiddenKillerEnabled && movie.number === 3 && !movie.roleBriefingComplete) return renderLocalRoleBriefing();
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
    9: renderFinalTheoryGateway,
    10: renderReveal,
    11: renderFinale,
    12: renderMovieReport
  };
  (renderers[movie.stage] || renderOpening)();
}

function renderLocalRoleBriefing() {
  const movie = current.movie;
  const players = playerCharacters();
  const index = Math.min(movie.roleBriefingIndex || 0, players.length - 1);
  const player = players[index];
  current.activePlayerIndex = index;
  const root = screen();
  const content = el("div", "content narrow private-role-screen");
  if (!movie.roleBriefingRevealed) {
    content.append(
      el("p", "eyebrow", `PRIVATE ROLE · PLAYER ${index + 1}/${players.length}`),
      el("h1", "display", `Δώσε τη συσκευή ${toName(player)}.`),
      el("p", "lead", "Οι υπόλοιποι παίκτες δεν πρέπει να κοιτάζουν. Κάθε ρόλος αποκαλύπτεται ξεχωριστά και κρύβεται πριν περάσει η συσκευή."),
      button(`Αποκάλυψε τον ρόλο του ${player}`, "", () => { movie.roleBriefingRevealed = true; saveCurrent(); renderMovie(); })
    );
    root.append(content);
    return;
  }
  const isHumanKiller = player === current.hiddenKiller;
  content.append(
    el("p", "eyebrow", isHumanKiller ? "SECRET ROLE · THE INSIDE KILLER" : "SECRET ROLE · SURVIVOR"),
    el("h1", "display", isHumanKiller ? "Είσαι μέσα από τη μάσκα." : "Πρέπει να επιβιώσεις."),
    el("p", "lead", isHumanKiller
      ? "Συνεργάζεσαι με άγνωστους masked NPC accomplices μέσω κωδικοποιημένων σημάτων. Δεν μαθαίνεις τις ταυτότητές τους και εκείνοι δεν εμφανίζονται ως σύμμαχοι· έτσι δεν μπορείς να τους προδώσεις κατά λάθος. Μπλόφαρε στις θεωρίες και διάλεξε ένα κρυφό πλεονέκτημα."
      : "Υπάρχει πιθανότητα ένας από τους άλλους δύο ανθρώπινους players να είναι killer. Οι σχέσεις και τα clues ισχύουν κανονικά—μην εμπιστεύεσαι κανέναν μόνο επειδή είναι player.")
  );
  const actions = el("div", "actions private-role-actions");
  if (isHumanKiller) {
    actions.append(
      button("Σαμπόταρε τις εξόδους · περισσότεροι φόνοι", "", () => finishRoleBriefingTurn("sabotage")),
      button("Φύτεψε τέλειο ψεύτικο clue", "secondary", () => finishRoleBriefingTurn("frame")),
      button("Στείλε κρυφό σήμα στους accomplices", "ghost", () => finishRoleBriefingTurn("signal"))
    );
  } else actions.append(button("Κρύψε τον ρόλο και δώσε τη συσκευή", "", () => finishRoleBriefingTurn("survivor")));
  content.append(actions);
  root.append(content);
}

function finishRoleBriefingTurn(strategy) {
  const movie = current.movie;
  const player = playerCharacters()[movie.roleBriefingIndex || 0];
  if (player === current.hiddenKiller) {
    movie.hiddenKillerStrategy = strategy;
    if (strategy === "sabotage") movie.fatalityTarget = Math.min(movie.cast.length - 3, movie.fatalityTarget + 2);
    if (strategy === "frame") movie.hiddenKillerTruthPenalty = .22;
    if (strategy === "signal") movie.hiddenKillerSignal = true;
  }
  movie.roleBriefingIndex = (movie.roleBriefingIndex || 0) + 1;
  movie.roleBriefingRevealed = false;
  if (movie.roleBriefingIndex >= playerCharacters().length) {
    movie.roleBriefingComplete = true;
    current.activePlayerIndex = movie.openingPlayerIndex || 0;
  }
  saveCurrent();
  renderMovie();
}

function movieScreen(sceneName, progress) {
  const root = screen("movie-shell");
  const content = el("div", "content");
  onlineLivePanel = null;
  const top = el("div", "movie-topline");
  const bar = el("div", "progress");
  const fill = el("span");
  fill.style.setProperty("--progress", `${progress}%`);
  fill.style.width = `${progress}%`;
  bar.append(fill);
  const sceneTools = el("span", "movie-scene-tools");
  sceneTools.append(el("span", "", sceneName), button("Relationships", "ghost mini-btn", renderRelationshipBoard));
  const playerLabel = current.gameMode === "online" ? `${playerCharacters().join(" & ")} · ONLINE PARTY` : isLocalMode() ? `${playerCharacters().join(" & ")} · LOCAL ${playerCharacters().length}P` : `${current.protagonist} IS YOU`;
  top.append(el("span", "", `${movieLabel(current.movie.number)} · ${current.movie.title} · ${playerLabel}`), bar, sceneTools);
  content.append(top);
  if (isLocalMode()) {
    const turn = el("div", "turn-strip");
    turn.append(el("span", "eyebrow", `PASS-THE-PHONE · LOCAL ${playerCharacters().length}P`), el("strong", "", `Τώρα αποφασίζει: ${activePlayerName()}`), el("small", "", `Όλο το κείμενο και η επόμενη επιλογή ανήκουν ${toName(activePlayerName())}. Μετά το lock εμφανίζεται αυτόματα popup για τον επόμενο παίκτη.`));
    content.append(turn);
    const notice = current.movie.localTurnNotice;
    if (notice) {
      const handoff = el("aside", "local-handoff-modal");
      const handoffCard = el("div", "panel local-handoff-card");
      handoffCard.append(
        el("span", "eyebrow", "PASS THE PHONE · NEXT PLAYER"),
        el("h2", "display", `Δώσε τη συσκευή ${toName(notice.nextPlayer)}`),
        el("p", "lead", `${notice.player} κλείδωσε: «${describeLocalChoice(notice.choice)}». Η επόμενη επιλογή ανήκει αποκλειστικά ${toName(notice.nextPlayer)}.`),
        button(`Συνέχεια ως ${notice.nextPlayer}`, "", () => {
          current.movie.localTurnNotice = null;
          saveCurrent();
          renderMovie();
        })
      );
      handoff.append(handoffCard);
      root.append(handoff);
    }
    const actionLog = renderLocalActionLog();
    if (actionLog) content.append(actionLog);
  }
  if (current.gameMode === "online") {
    const onlineTurn = el("div", "turn-strip online-turn-strip");
    const pendingRound = Object.values(onlineSession?.pendingDecisions || {}).find(decision => Object.keys(decision?.submissions || {}).length);
    const pendingCopy = pendingRound
      ? Object.entries(pendingRound.submissions || {}).map(([name, value]) => `${name} joined ${describeOnlineChoice(value)}`).join(" · ")
      : "";
    onlineTurn.append(
      el("span", "eyebrow", "ONLINE · PASS THE TURN"),
      el("strong", "", onlineTurnLabel()),
      el("small", "", pendingCopy || "Ίδιο flow με το Local: Player 1 ανοίγει την ιστορία και μετά κάθε scene περνάει με σειρά σε όλους."),
    );
    content.append(onlineTurn);
    publishOnlineSceneState(sceneName);
    onlineLivePanel = mountOnlineLivePanel();
    content.append(onlineLivePanel);
    const actionLog = renderLocalActionLog();
    if (actionLog) content.append(actionLog);
    updateOnlineLivePanel(onlineSession);
    mountOnlineChatDock();
  }
  if (current.gameMode === "online" && current.onlineDecisionNotice) {
    const notice = current.onlineDecisionNotice;
    const handoff = el("aside", "local-turn-notice online-choice-notice");
    const otherChoices = Object.entries(notice.choices || {}).filter(([name]) => name !== notice.player);
    handoff.append(
      el("span", "eyebrow", otherChoices.length > 1 ? "ONLINE · OTHER PLAYERS ACTED" : "ONLINE · OTHER PLAYER ACTED"),
      el("strong", "", "Η επιλογή σου συγχρονίστηκε με το session.")
    );
    otherChoices.forEach(([name, value]) => handoff.append(el("p", "", `${name}: ${describeOnlineChoice(value)}`)));
    content.append(handoff);
    current.onlineDecisionNotice = null;
  }
  const activeCanon = canonRelationshipLines(current.movie.cast).filter(pair => pair.active);
  const strip = el("div", "canon-strip");
  strip.append(
    el("span", "eyebrow", activeCanon.length ? "ACTIVE CANON BONDS" : "CANON RELATIONSHIP MAP"),
    el("strong", "", activeCanon.length ? activeCanon.map(pair => `${pair.a} ↔ ${pair.b} · ${pair.type}`).join("  ·  ") : "Οι αρχικές συγγένειες και σχέσεις παραμένουν ενεργές στο canon."),
    el("small", "", activeCanon.length ? "Μιλούν, κινούνται και επηρεάζουν ο ένας τη διάσωση του άλλου." : "Άνοιξε Relationships για να δεις ποιοι θα επιστρέψουν μαζί.")
  );
  content.append(strip);
  root.append(content);
  return content;
}

function survivalRoll(name, chance, random) {
  return random() < Math.max(.03, Math.min(.98, chance));
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
  const atmosphere = el("canvas", "scene-webgl");
  atmosphere.setAttribute("aria-hidden", "true");
  visual.append(atmosphere);
  requestAnimationFrame(() => {
    if (!atmosphere.isConnected) return;
    const stop = window.SpiritFuneral3D?.mountAtmosphere(atmosphere, tone || "neutral");
    if (stop) sceneWebGLStops.push(stop);
  });
  const portrait = el("div", "speaker-portrait");
  const img = el("img");
  img.src = imagePath(image);
  img.alt = name;
  img.dataset.character = image;
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
  const bondNames = unique([image, ...voiceNames]).filter(voiceName => character(voiceName) && !isPlayerCharacter(voiceName)).slice(0, 3);
  if (bondNames.length) {
    const hud = el("div", "scene-bond-hud");
    bondNames.forEach(voiceName => {
      const state = relationshipState(voiceName);
      const tile = el("article", "scene-bond-tile");
      const avatar = el("img"); avatar.src = imagePath(voiceName); avatar.alt = "";
      const details = el("span", "scene-bond-copy");
      details.append(el("strong", "", voiceName), el("small", "", relationshipSummary(voiceName)));
      const meters = el("span", "scene-bond-meters");
      const friendship = el("i", "friendship"); friendship.style.width = `${Math.max(7, Math.min(100, 50 + (state?.friendship || 0)))}%`;
      const suspicion = el("i", "suspicion"); suspicion.style.width = `${Math.max(0, Math.min(100, state?.suspicion || 0))}%`;
      meters.append(friendship, suspicion); details.append(meters); tile.append(avatar, details); hud.append(tile);
    });
    copy.append(hud);
  }
  const list = el("div", `choice-list ${choices.length > 6 ? "choice-list-scroll" : ""}`.trim());
  choices.forEach((choice, index) => {
    const item = el("button", "choice");
    item.type = "button";
    item.dataset.storyChoice = "true";
    if (isOnlineEngine() && !onlineCanAct()) {
      item.disabled = true;
      item.classList.add("turn-locked");
      item.title = `Περίμενε τη σειρά του/της ${onlineSession?.turn?.username || "άλλου παίκτη"}.`;
    }
    if (choice.disabled) {
      item.disabled = true;
      item.classList.add("choice-disabled");
    }
    item.append(el("b", "", String.fromCharCode(65 + index)), el("span", "", choice.label));
    if (!choice.disabled) item.addEventListener("click", () => onlineDecisionGate(choice.label, choice.action));
    list.append(item);
  });
  copy.append(list);
  scene.append(visual, copy);
  return scene;
}

function queueBeat(beat, nextStage) {
  if (isMultiplayerMode() && current.movie.lastLocalResolution) {
    beat = {
      ...beat,
      body: `${beat.body} LOCAL ${playerCharacters().length}P RECAP · ${localChoiceRecap(current.movie.lastLocalResolution)}.`
    };
    current.movie.lastLocalResolution = null;
  }
  if (isOnlineEngine() && current.onlineRoundComplete === false) nextStage = "online-next-turn";
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
    } else if (destination === "final-kill") {
      resolveFinalKiller();
    } else if (destination === "final-sacrifice") {
      queueFinalKillBeat();
    } else if (destination === "killer-fall-summary") {
      queueKillerFallSummary();
    } else if (destination === "item-reassign") {
      renderItemReassignment();
    } else if (destination === "online-next-turn") {
      // Keep both clients on the same decision stage while the next player
      // takes their independent turn. The server unlocks the next scene only
      // after every player has submitted this round.
      saveCurrent();
      renderMovie();
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
  const decisionPlayer = isLocalMode() ? activePlayerName() : playerCharacters()[movie.openingPlayerIndex || 0] || current.protagonist;
  content.append(scenePanel({
    name: person, time: scenario.time, image: person, tone: "red", eyebrow: `${scenario.eyebrow}${isLocalMode() ? ` · TURN: ${decisionPlayer}` : isOnlineEngine() ? " · PLAYER 1 DECIDES" : ""}`, title: scenario.title,
    body: `${scenario.body}${isLocalMode() ? ` ${subjectName(decisionPlayer)} παίρνει την πρώτη απόφαση· μετά κάντε pass turn.` : isOnlineEngine() ? " Ο Player 1 κλειδώνει το opening outcome. Μετά όλοι συνεχίζετε στην ίδια κοινή ιστορία." : ""}`,
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
  const submitted = localDecision(`opening-${movie.number}`, choice);
  if (submitted === LOCAL_PENDING) return;
  const localVotes = isMultiplayerMode() ? movie.lastLocalResolution?.choices : null;
  const votes = localVotes ? Object.entries(localVotes) : [[activePlayerName(), submitted]];
  const outcomeByPlayer = {};
  const survivors = new Set();
  const resultLines = [];
  votes.forEach(([player, selectedChoice], index) => {
    const choiceCode = { warn: 101, police: 211, drive: 307 }[selectedChoice];
    const multiplayerOffset = isMultiplayerMode() ? index * 811 + player.length * 17 : 0;
    const random = mulberry32((current.seed + movie.number * 4079 + movie.openingScenario.id * 97 + choiceCode + multiplayerOffset) >>> 0);
    const roll = random();
    const outcome = selectedChoice === "warn"
      ? (roll < .18 ? "both" : roll < .72 ? "target" : "partner")
      : selectedChoice === "police"
        ? (roll < .20 ? "both" : roll < .72 ? "partner" : "target")
        : (roll < .30 ? "both" : roll < .68 ? "target" : "partner");
    outcomeByPlayer[player] = outcome;
    if (outcome === "target") survivors.add(movie.openingTarget);
    if (outcome === "partner") survivors.add(movie.openingPartner);
    resultLines.push(`${player}: ${outcome === "both" ? "και οι δύο κινδύνευσαν" : `σώθηκε ${subjectName(outcome === "target" ? movie.openingTarget : movie.openingPartner, true)}`}`);
  });
  const survivorNames = [...survivors];
  const victims = [movie.openingTarget, movie.openingPartner].filter(name => !survivors.has(name));
  survivorNames.forEach(name => {
    setStatus(name, "SAVED");
    if (!movie.saved.includes(name)) { movie.saved.push(name); movie.peopleSaved += 1; }
    movie.deathsPrevented += 1;
    const rescuingPlayers = votes.filter(([player]) => {
      const selectedOutcome = outcomeByPlayer[player];
      return selectedOutcome === (name === movie.openingTarget ? "target" : "partner");
    }).map(([player]) => player);
    if (rescuingPlayers.length) rescuingPlayers.forEach(player => { relationshipState(name, player).trust += 10; });
  });
  victims.forEach(name => setStatus(name, "DEAD"));

  if (survivorNames.length && movie.openingKillerRoll < .12 && movie.killers.length < 4) {
    movie.openingSecretKiller = survivorNames[0];
    movie.killers.push(survivorNames[0]);
  }
  movie.openingOutcome = localVotes ? outcomeByPlayer : outcomeByPlayer[activePlayerName()];
  const actionText = votes.map(([, selectedChoice]) => movie.openingScenario.choices[{ warn: 0, police: 1, drive: 2 }[selectedChoice]]).join(" · ");
  remember(actionText, survivorNames.length ? `${survivorNames.join(" & ")} survived; ${victims.join(" & ") || "κανείς"} died.` : `${victims.join(" & ")} both died.`);
  rebuildFriendOptions();
  const bothDied = survivorNames.length === 0;
  queueBeat({
    kind: "death",
    eyebrow: bothDied ? "OPENING MASSACRE · BOTH LOST" : "OPENING KILL · THE OUTCOME SHIFTED",
    title: bothDied ? `${movie.openingTarget} και ${movie.openingPartner} πέθαναν.` : `${survivorNames.join(" και ")} επέζησαν.`,
    body: bothDied
      ? "Η επιλογή φάνηκε σωστή, όμως η παγίδα είχε δεύτερο επίπεδο. Και οι δύο θάνατοι επιβεβαιώνονται — κανείς τους δεν θα εμφανιστεί ξανά ως ζωντανός χαρακτήρας."
      : `${resultLines.join(" · ")} Οι αποφάσεις των παικτών λύθηκαν χωριστά και η επιβίωση κάθε θύματος προέκυψε από το σύνολο των ανεξάρτητων outcomes. Κανείς δεν αποκτά plot armor.`,
    names: [movie.openingTarget, movie.openingPartner],
    statuses: [movie.status[movie.openingTarget], movie.status[movie.openingPartner]], roomOffset: 1,
    cta: "Μπες στη νύχτα"
  }, 2);
}

function rebuildFriendOptions() {
  const movie = current.movie;
  const random = mulberry32((current.seed + movie.number * 1459 + 44) >>> 0);
  const available = shuffle(movie.cast.filter(name => !isPlayerCharacter(name) && isAlive(name)), random);
  const continuity = (movie.continuityFriends || []).filter(name => available.includes(name));
  movie.friendOptions = distributeFriendGroups(available, continuity);
}

function refreshSceneTargets() {
  const movie = current.movie;
  const random = mulberry32((current.seed + movie.number * 1877 + movie.choices.length * 239) >>> 0);
  const available = movie.cast.filter(name => !isPlayerCharacter(name) && isAlive(name) && !isKiller(name)
    && movie.status[name] !== "SAVED" && !movie.saved.includes(name) && !movie.itemSaved.includes(name));
  const preferredPool = movie.itemKept
    ? available.filter(name => !friendsForPlayer().includes(name))
    : movie.keyHolder
      ? friendsForPlayer().filter(name => available.includes(name))
      : [];
  const preferred = unique([...preferredPool, movie.dangerA, movie.dangerB, movie.secondTarget]).filter(name => available.includes(name));
  const ordered = unique([...preferred, ...shuffle(available, random)]);
  movie.dangerA = ordered[0];
  movie.dangerB = ordered[1];
  movie.secondTarget = ordered[2];
}

function renderFriendChoice() {
  const movie = current.movie;
  const routeCount = movie.friendOptions?.length || 3;
  const gatherings = [
    ["THE SURVIVORS REGROUP", "Με ποιους θα κλειστείς απόψε;", "Οι ομάδες χωρίζονται ανάμεσα σε διαφορετικά δωμάτια. Κάποιοι συζητούν τον θάνατο· άλλοι ψάχνουν έξοδο."],
    ["A SCREENING WITHOUT A FILM", "Ποιον θέλεις δίπλα σου στο σκοτάδι;", "Ο projector ανάβει και όλοι αλλάζουν θέσεις. Η παρέα που θα διαλέξεις γίνεται το main group της νύχτας."],
    ["THE BUILDING SPLITS", "Ποιο group θα ακολουθήσεις;", `${routeCount === 4 ? "Τέσσερις" : routeCount === 3 ? "Τρεις" : routeCount} διαδρομές ανοίγουν ταυτόχρονα. Όσοι δεν πάρεις μαζί σου συνεχίζουν μόνοι και μπορεί να μη γυρίσουν όλοι.`],
    ["WHISPERS AFTER MIDNIGHT", "Ποιον πιστεύεις όταν όλοι λένε ψέματα;", "Οι επιζώντες ανταλλάσσουν διαφορετικές εκδοχές του opening. Η επιλογή παρέας χτίζει πίστη — και απομονώνει τους άλλους."],
    ["FIND YOUR GROUP", "Βρες το group σου.", "Ο χώρος δεν χωράει όλο το cast. Οι υπόλοιποι πρέπει να ψάξουν άλλη διαδρομή μέσα στον τυχαιοποιημένο χάρτη."]
  ];
  const gathering = gatherings[movie.openingScenario.id % gatherings.length];
  const content = movieScreen(gathering[0], 18);
  const root = el("div", "content");
  root.append(el("p", "eyebrow", gathering[0]), el("h1", "headline", gathering[1]), el("p", "lead", gathering[2]), el("p", "decision-warning", "ΣΗΜΑΝΤΙΚΗ ΑΠΟΦΑΣΗ · Αυτό το group γίνεται η βασική σου παρέα. Αν επιζήσουν, θα έχουν προτεραιότητα και ουσιαστικό ρόλο στις επόμενες ταινίες."));
  const grieving = movie.cast.filter(name => isAlive(name) && linkedNames(name).some(other => movie.status[other] === "DEAD"));
  if (grieving.length) {
    const reactions = el("div", "grief-reactions");
    grieving.slice(0, 3).forEach(name => {
      const reaction = el("article", "ensemble-line grief-line");
      const avatar = el("img"); avatar.src = imagePath(name); avatar.alt = "";
      const copy = el("span"); copy.append(el("strong", "", name), el("small", "", dialogueLine(name)));
      reaction.append(avatar, copy); reactions.append(reaction);
    });
    root.append(reactions);
  }
  const grid = el("div", "feature-grid");
  movie.friendOptions.forEach((group, index) => {
    const onlineRound = isOnlineEngine()
      ? Object.values(onlineSession?.pendingDecisions || {}).find(decision => Object.values(decision?.submissions || {}).some(submission => submission?.localKey === `group-${movie.number}`))
      : null;
    const onlineJoinedPlayers = (onlineSession?.players || []).filter(player => {
      const submission = onlineRound?.submissions?.[player.username];
      if (!submission) return false;
      if (Array.isArray(submission.choice)) return JSON.stringify(submission.choice) === JSON.stringify(group);
      return String(submission.label || "").toUpperCase().includes(`GROUP ${index + 1}`);
    });
    const localGroupPicks = isLocalMode() ? (movie.localDecisions?.[`group-${movie.number}`] || {}) : {};
    const localJoinedPlayers = Object.entries(localGroupPicks)
      .filter(([, selectedGroup]) => Array.isArray(selectedGroup) && JSON.stringify(selectedGroup) === JSON.stringify(group))
      .map(([player]) => ({ username: player, character: player }));
    const joinedPlayers = isOnlineEngine() ? onlineJoinedPlayers : localJoinedPlayers;
    const card = el("article", `panel feature ${joinedPlayers.length ? "party-group-picked" : ""}`.trim());
    const canonLinks = group.map(name => protagonistRelationship(name) ? `${name}: ${protagonistRelationship(name)}` : "").filter(Boolean);
    const groupCanon = canonRelationshipLines(group).filter(pair => pair.active).map(pair => `${pair.a} ↔ ${pair.b}: ${pair.type}`);
    const returning = group.filter(name => movie.continuityFriends?.includes(name));
    const continuityCopy = returning.length >= 2 ? `Η παλιά παρέα παραμένει ενωμένη: ${returning.join(", ")}. ` : "";
    const canonCopy = groupCanon.length ? `Canon δεσμός: ${groupCanon.join(" · ")}. ` : "";
    const groupCopy = `${continuityCopy}${canonCopy}${canonLinks.length ? `${canonLinks.join(" · ")} · ` : ""}${group.length} active members · κανείς δεν έμεινε εκτός group.`;
    card.append(el("b", "", String.fromCharCode(65 + index)), el("h3", "", group.join(" · ")), el("p", "", groupCopy));
    if (joinedPlayers.length) {
      const joiners = el("div", "party-group-joiners");
      joinedPlayers.forEach(player => {
        const line = el("span", "party-group-joiner");
        const avatar = el("img"); avatar.src = imagePath(player.character || "Billy"); avatar.alt = "";
        line.append(avatar, el("strong", "", `${player.character || player.username} joined this group`), el("small", "", player.character || "PLAYER"));
        joiners.append(line);
      });
      card.append(joiners);
    }
    const choose = button(`GROUP ${index + 1} · Πήγαινε σε αυτούς`, "ghost", () => chooseFriends(group, index), true);
    card.append(choose);
    grid.append(card);
  });
  root.append(grid);
  content.append(root);
}

function chooseFriends(group, groupIndex = -1) {
  const movie = current.movie;
  group = localDecision(`group-${movie.number}`, group, values => unique(values.flat()));
  if (group === LOCAL_PENDING) return;
  // The canonical host combines the ordered group picks into one shared cast
  // outcome. Every browser receives this result through story-state sync.
  if (isOnlineEngine() && isOnlineStoryAuthoritative() && current.onlineResolvedChoices) {
    const selectedIndexes = Object.values(current.onlineResolvedChoices)
      .map(value => String(value?.label || value || "").match(/GROUP\s+(\d+)/i)?.[1])
      .map(value => Number(value) - 1)
      .filter(index => Number.isInteger(index) && movie.friendOptions?.[index]);
    const groups = selectedIndexes.map(index => movie.friendOptions[index]);
    if (groups.length) group = unique(groups.flat());
  }
  movie.friends = [...group];
  const groupVote = movie.localDecisionHistory?.at(-1)?.choices;
  movie.playerFriends ||= {};
  if (isOnlineEngine()) {
    playerCharacters().forEach(player => { movie.playerFriends[player] = [...group]; });
    group.forEach(name => {
      playerCharacters().forEach(player => {
        const state = relationshipState(name, player);
        state.friendship += 24;
        state.trust += 12;
        state.loyalty += 10;
      });
    });
  } else if (isMultiplayerMode() && groupVote) {
    playerCharacters().forEach(player => {
      const ownGroup = unique(groupVote[player] || group);
      movie.playerFriends[player] = ownGroup;
      ownGroup.forEach(name => {
        const state = relationshipState(name, player);
        state.friendship += 24;
        state.trust += 12;
        state.loyalty += 10;
      });
    });
  } else {
    movie.playerFriends[current.protagonist] = [...group];
    group.forEach(name => {
      relationshipState(name).friendship += 24;
      relationshipState(name).trust += 12;
      relationshipState(name).loyalty += 10;
    });
  }
  remember(`Διάλεξες να μείνεις με ${group.join(", ")}.`, "They became your core friend group.");
  const random = mulberry32((current.seed + movie.number * 7121 + movie.choices.length * 83) >>> 0);
  movie.relationshipEvent = createRelationshipEvent(group, random);
  movie.relationshipEventShown = false;
  const extras = shuffle(movie.cast.filter(name => !isPlayerCharacter(name) && !group.includes(name) && !isKiller(name) && isAlive(name) && movie.status[name] !== "SAVED" && !movie.saved.includes(name)), random);
  const eligibleExtras = movie.number === 3 ? extras.filter(name => !movieThreeProtected(name)) : extras;
  const orderedExtras = rankMovieThreeDeaths(eligibleExtras, random);
  const deathRoll = random();
  const largeFinaleCast = movie.number === 3 && movie.cast.length >= 16;
  const intensityCap = Math.max(0, Math.min(movie.number === 3 ? (largeFinaleCast ? 8 : 6) : 4, (movie.fatalityTarget || 4) - 1));
  const rolledDeathCount = movie.number === 3
    ? (deathRoll < .20 ? 1 : deathRoll < .48 ? 2 : deathRoll < .72 ? 3 : deathRoll < .90 ? Math.min(5, intensityCap) : intensityCap)
    : (deathRoll < .34 ? 1 : deathRoll < .70 ? 2 : deathRoll < .91 ? 3 : intensityCap);
  const minimumLivingExtras = orderedExtras.length > 1 ? 1 : 0;
  const deathCount = orderedExtras.length ? Math.max(1, rolledDeathCount) : 0;
  const selectedOffscreen = orderedExtras.slice(0, Math.min(deathCount, Math.max(0, orderedExtras.length - minimumLivingExtras)));
  movie.offscreenDeaths = selectedOffscreen.filter(name => setStatus(name, "DEAD"));
  movie.abandoned = orderedExtras.filter(name => !movie.offscreenDeaths.includes(name) && isAlive(name));
  movie.abandoned.forEach(name => {
    playerCharacters().forEach(player => {
      relationshipState(name, player).trust -= 9;
      relationshipState(name, player).friendship -= 5;
    });
  });
  refreshSceneTargets();
  if (movie.offscreenDeaths.length) {
    remember(`Έμεινες με ${group.join(", ")} ενώ άλλοι χωρίστηκαν.`, `${movie.offscreenDeaths.join(" & ")} died away from the main group.`);
    queueBeat({
      kind: "death",
      eyebrow: movie.number === 3 && movie.offscreenDeaths.length > 2 ? "THE BLOODIED ROOM · MULTIPLE DEATHS" : "THE BLOODIED ROOM · SOMEONE WAS LEFT OUT",
      title: movie.offscreenDeaths.length === 1 ? "Το δωμάτιο που άφησαν πίσω είναι γεμάτο αίμα." : `${movie.offscreenDeaths.length} σώματα βρίσκονται στο Bloodied Room.`,
      body: `Κανένας παίκτης δεν τους διάλεξε για το group του. Όταν η πόρτα του Bloodied Room ανοίγει, επιβεβαιώνεται με τη σειρά: ${movie.offscreenDeaths.map(name => `${subjectName(name)} βρέθηκε ${genderWord(name, "νεκρός", "νεκρή")}`).join(" · ")}. Όλοι καταγράφονται τώρα ως DEAD και δεν θα επιστρέψουν σε επόμενη επιλογή.`,
      names: movie.offscreenDeaths, statuses: movie.offscreenDeaths.map(() => "DEAD"), roomOffset: 2,
      cta: "Κλείσε την πόρτα του Bloodied Room"
    }, 3);
  } else {
    queueBeat({
      kind: "dialogue",
      eyebrow: "THE INNER CIRCLE",
      title: `${group[0]} σού δίνει τον λόγο ${genitiveName(group[0])}.`,
      body: `Η ομάδα σχηματίστηκε: ${group.join(", ")}. Οι σχέσεις, η πίστη και όσα μοιραστείτε από εδώ και πέρα θα επιστρέψουν στις επόμενες ταινίες.`,
      names: group, statuses: group.map(() => "ALLY"), roomOffset: 1
    }, 3);
  }
}

function createRelationshipEvent(group, random) {
  const aliveGroup = group.filter(isAlive);
  if (!aliveGroup.length) return null;
  const canonPairs = relations.filter(([a, b]) => aliveGroup.includes(a) && aliveGroup.includes(b));
  if (canonPairs.length) {
    const [a, b, relation] = pick(canonPairs, random);
    return { type: "canon", first: a, second: b, relation, seed: Math.floor(random() * 1_000_000), canon: true };
  }
  const grieving = aliveGroup.find(name => linkedNames(name).some(other => current.movie.status[other] === "DEAD"));
  const first = grieving || pick(aliveGroup, random);
  const second = pick(aliveGroup.filter(name => name !== first), random) || supportingVoices([first], 1)[0] || first;
  const types = grieving
    ? ["grief", "grief", "accusation", "vow"]
    : current.movie.number === 1
      ? ["argument", "accusation", "vow", "confession", "rivalry", "departure", "departure"]
      : ["argument", "accusation", "vow", "confession", "rivalry"];
  return { type: pick(types, random), first, second, seed: Math.floor(random() * 1_000_000) };
}

function renderRelationshipEvent() {
  const movie = current.movie;
  const event = movie.relationshipEvent;
  if (!event || movie.relationshipEventShown || !isAlive(event.first)) {
    movie.relationshipEventShown = true;
    return renderKeyChoice();
  }
  const second = isAlive(event.second) ? event.second : supportingVoices([event.first], 1)[0] || event.first;
  event.second = second;
  const relatedDead = linkedNames(event.first).find(name => movie.status[name] === "DEAD");
  const scenes = {
    grief: {
      eyebrow: "GRIEF EVENT · RANDOM RELATIONSHIP SCENE", title: `${event.first} καταρρέει μπροστά στην ομάδα.`,
      body: relatedDead ? `${subjectName(event.first)} θρηνεί ${accusativeName(relatedDead)}. ${subjectName(second)} προσπαθεί να ${genderWord(event.first, "τον", "την")} κρατήσει ${genderWord(event.first, "όρθιο", "όρθια")}, αλλά ο πόνος μετατρέπεται σε θυμό.` : `${subjectName(event.first)} δεν αντέχει άλλο τους θανάτους και ξεσπά μπροστά ${toName(second)}.`,
      choices: [`Υποσχέσου ότι θα βρείτε μαζί τον υπεύθυνο.`, `Άφησε ${accusativeName(second)} να ${genderWord(event.first, "τον", "την")} παρηγορήσει.`, "Πες ότι πρέπει να προχωρήσετε πριν υπάρξει άλλο θύμα."]
    },
    argument: {
      eyebrow: "ARGUMENT · THE GROUP FRACTURES", title: `${event.first} και ${second} τσακώνονται για το opening.`,
      body: `${subjectName(event.first)} κατηγορεί ${accusativeName(second)} ότι έκρυψε μια έξοδο. Η ένταση είναι αληθινή — αλλά μπορεί να είναι φόβος, ενοχή ή τέλεια παράσταση.`,
      choices: [`Πάρε το μέρος ${genitiveName(event.first)}.`, `Πάρε το μέρος ${genitiveName(second)}.`, "Χώρισέ τους και ζήτησε αποδείξεις."]
    },
    accusation: {
      eyebrow: "ACCUSATION · NO PROOF", title: `${event.first} δείχνει ${accusativeName(second)}.`,
      body: `Ένα αντικείμενο βρέθηκε σε λάθος τσάντα. Κανείς δεν ξέρει αν πρόκειται για στοιχείο, παγίδα ή λάθος μέσα στον πανικό.`,
      choices: [`Πίεσε ${accusativeName(second)} να εξηγήσει.`, `Υπερασπίσου ${accusativeName(second)}.`, `Κράτησέ τους κοντά σου μέχρι να μάθεις περισσότερα.`]
    },
    vow: {
      eyebrow: "PROTECTIVE VOW · TRUST EVENT", title: `${event.first} ορκίζεται να μη σε αφήσει μόνο/η.`,
      body: `${subjectName(second)} αμφιβάλλει αν η υπόσχεση είναι γενναιότητα ή προσπάθεια να ελέγξει τις κινήσεις σου. Η ταυτότητα κανενός δεν αποκαλύπτεται.`,
      choices: [`Δέξου τον όρκο ${genitiveName(event.first)}.`, `Ζήτησε να προστατέψει πρώτα ${accusativeName(second)}.`, "Μην αφήσεις κανέναν να γίνει προσωπικός σου φρουρός."]
    },
    confession: {
      eyebrow: "CONFESSION · MAYBE A LIE", title: `${event.first} παραδέχεται ότι είπε ψέματα.`,
      body: `Το ψέμα αφορά τη διαδρομή ${genitiveName(event.first)} πριν από τον φόνο. ${subjectName(second)} πιστεύει ότι η εξήγηση είναι μισή αλήθεια.`,
      choices: [`Κράτησε το μυστικό ${genitiveName(event.first)}.`, `Ανάγκασε ${accusativeName(event.first)} να το πει σε όλους.`, `Ζήτησε από ${accusativeName(second)} να ελέγξει την ιστορία.`]
    },
    rivalry: {
      eyebrow: "RIVALRY · LOYALTY TEST", title: `${event.first} και ${second} θέλουν να οδηγήσουν την ομάδα.`,
      body: "Και οι δύο προτείνουν διαφορετική διαδρομή. Καμία δεν είναι αποδεδειγμένα ασφαλής και η απόφασή σου θα αλλάξει ποιος νιώθει ότι τον εμπιστεύεσαι.",
      choices: [`Ακολούθησε ${accusativeName(event.first)}.`, `Ακολούθησε ${accusativeName(second)}.`, "Συνδύασε τα σχέδια και κράτησε εσύ τον έλεγχο."]
    },
    departure: {
      eyebrow: "MOVIE I · SOMEONE WANTS OUT", title: `${event.first} λέει ότι φεύγει από την ιστορία.`,
      body: `${subjectName(event.first)} δεν αντέχει άλλη νύχτα με μάσκες. Αν δεχτείς, θα φύγει πραγματικά τώρα, δεν θα εμφανιστεί στο Movie II και θα επιστρέψει υποχρεωτικά μόνο στο Movie III για το κλείσιμο της τριλογίας.`,
      choices: [`Άφησε ${accusativeName(event.first)} να φύγει.`, `Πείσε ${accusativeName(event.first)} να μείνει μαζί σας.`, `Ζήτησε μία τελευταία βοήθεια πριν αποφασίσει.`]
    }
  };
  if (event.type === "canon") {
    const partners = event.relation.includes("Σύντροφοι") || event.relation.includes("Αδέλφ") || event.relation.includes("Αδελφ");
    scenes.canon = {
      eyebrow: `CANON BOND · ${event.relation.toUpperCase()}`,
      title: `${event.first} και ${second} κινούνται σαν ένα.`,
      body: partners
        ? `${subjectName(event.first)} και ${subjectName(second, true)} αρνούνται να χωριστούν. Ξέρουν ο ένας τις κινήσεις του άλλου, μοιράζονται το ρίσκο και μπορούν να σε τραβήξουν μαζί τους σε μια επικίνδυνη διαδρομή.`
        : `${subjectName(event.first)} και ${subjectName(second, true)} έχουν δεσμό που προϋπήρχε της ταινίας. Η απώλεια ή η σωτηρία του ενός θα αλλάξει αμέσως τη στάση του άλλου.`,
      choices: [
        `Στείλε τους μαζί να ερευνήσουν τη διαδρομή.`,
        `Κράτησε ${accusativeName(event.first)} δίπλα σου και ζήτησε από ${accusativeName(second)} να περιμένει.`,
        `Δώσε τους κοινή ευθύνη για τη διάσωση της ομάδας.`
      ]
    };
  }
  const scene = scenes[event.type] || scenes.argument;
  const content = movieScreen("RANDOM RELATIONSHIP EVENT", 24);
  content.append(scenePanel({
    name: `${event.first} / ${second}`, time: "11:58 PM", image: event.first, room: roomFor(1), tone: event.type === "argument" || event.type === "accusation" ? "red" : "cold",
    eyebrow: scene.eyebrow, title: scene.title, body: scene.body,
    choices: scene.choices.map((label, index) => ({ label, action: () => resolveRelationshipEvent(index) })), cameos: [second]
  }));
}

function resolveRelationshipEvent(choiceIndex) {
  const movie = current.movie;
  choiceIndex = localDecision(`relationship-${movie.number}`, choiceIndex);
  if (choiceIndex === LOCAL_PENDING) return;
  const event = movie.relationshipEvent;
  const first = event.first;
  const second = event.second;
  const random = mulberry32((current.seed + event.seed + choiceIndex * 991 + movie.number * 53) >>> 0);
  const twist = random();
  let favored;
  let strained;
  const applyRelationshipVote = (viewer, selectedChoice) => {
    const voteRandom = mulberry32((event.seed + selectedChoice * 991 + movie.number * 53 + viewer.length) >>> 0);
    let voteFavored = selectedChoice === 0 ? first : selectedChoice === 1 ? second : (voteRandom() < .5 ? first : second);
    let voteStrained = voteFavored === first ? second : first;
    if (voteRandom() > .78) [voteFavored, voteStrained] = [voteStrained, voteFavored];
    const firstState = relationshipState(voteFavored, viewer);
    const secondState = relationshipState(voteStrained, viewer);
    firstState.trust += event.type === "grief" ? 22 : 14;
    firstState.loyalty += 10;
    secondState.friendship += selectedChoice === 2 ? 8 : -6;
    secondState.suspicion += voteRandom() > .65 ? 9 : 2;
    if (event.type === "canon") {
      const sharedBond = selectedChoice === 0 ? 18 : selectedChoice === 2 ? 24 : 8;
      firstState.friendship += sharedBond;
      secondState.friendship += sharedBond;
      firstState.loyalty += sharedBond / 2;
      secondState.loyalty += sharedBond / 2;
    }
    return { favored: voteFavored, strained: voteStrained };
  };
  const localVoteSet = movie.localDecisionHistory?.at(-1)?.choices;
  const appliedVotes = isMultiplayerMode() && localVoteSet
    ? playerCharacters().map(player => applyRelationshipVote(player, localVoteSet[player]))
    : [applyRelationshipVote(activePlayerName(), choiceIndex)];
  favored = appliedVotes.at(-1).favored;
  strained = appliedVotes.at(-1).strained;
  if (event.type === "canon") {
    movie.canonMoments ||= [];
    movie.canonMoments.push({ pair: [first, second], relation: event.relation, choice: choiceIndex + 1, localChoices: localVoteSet || null });
  }
  if (event.type === "departure" && choiceIndex === 0) {
    movie.departed ||= [];
    if (!movie.departed.includes(first)) movie.departed.push(first);
    movie.status[first] = "LEFT · RETURNS IN MOVIE III";
    movie.friends = (movie.friends || []).filter(name => name !== first);
    Object.keys(movie.playerFriends || {}).forEach(player => {
      movie.playerFriends[player] = (movie.playerFriends[player] || []).filter(name => name !== first);
    });
    remember(`${first} έφυγε οριστικά από το Movie I.`, `${first} will skip Movie II and is guaranteed to return in Movie III.`);
  }
  movie.relationshipEventShown = true;
  const localVoteLines = localVoteSet
    ? playerCharacters().map(player => `${player}: επιλογή ${(localVoteSet[player] ?? choiceIndex) + 1}`).join(" · ")
    : `επιλογή ${choiceIndex + 1}`;
  remember(`Relationship event: ${event.type} — ${localVoteLines}.`, `${favored} felt supported; ${strained} reacted unpredictably.`);
  queueBeat({
    kind: event.type === "argument" || event.type === "accusation" ? "twist" : "dialogue",
    eyebrow: twist > .78 ? "RELATIONSHIP TWIST · NOT THE EXPECTED REACTION" : "RELATIONSHIP SHIFT",
    title: event.type === "departure" && choiceIndex === 0 ? `${first} φεύγει — και αυτή τη φορά η έξοδος είναι πραγματική.` : localVoteSet ? "Οι παίκτες άλλαξαν διαφορετικά τον ίδιο δεσμό." : twist > .78 ? `${strained} θυμάται ότι στάθηκες δίπλα του/της.` : `${favored} έρχεται πιο κοντά σου.`,
     body: event.type === "canon"
       ? `Ο δεσμός ${event.relation} γράφεται στο canon της ταινίας. ${localVoteSet ? `${localVoteLines}. ` : ""}Οι δυο τους θα έχουν αυξημένη πιθανότητα να βρεθούν μαζί, να ανταλλάξουν βοήθεια και να επηρεάσουν ο ένας τη διάσωση του άλλου.`
       : event.type === "departure" && choiceIndex === 0
         ? `${first} αφαιρείται από όλες τις επόμενες σκηνές του Movie I και από ολόκληρο το Movie II. Το Movie III θα ${genderWord(first, "τον", "την")} επαναφέρει υποχρεωτικά, χωρίς να αποκαλύπτει ρόλο ή ενοχή.`
         : `Η σκηνή αλλάζει trust, friendship και loyalty χωρίς να αποκαλύπτει ποιος λέει αλήθεια. ${localVoteSet ? `${localVoteLines}. ` : ""}${strained} μπορεί να είναι πληγωμένος/η, φοβισμένος/η ή να παίζει ρόλο.`,
    names: unique([first, second]), statuses: unique([first, second]).map(name => event.type === "departure" && choiceIndex === 0 && name === first ? "LEFT · RETURNS IN MOVIE III" : name === favored ? "BOND STRENGTHENED" : "TENSION"), roomOffset: 1,
    cta: "Συνέχισε με την ομάδα"
  }, 3);
}

function renderKeyChoice() {
  const movie = current.movie;
  if (movie.relationshipEvent && !movie.relationshipEventShown) return renderRelationshipEvent();
  const candidates = innerCircleMembers();
  const itemKey = `item-${movie.number}`;
  const onlineItemRound = isOnlineEngine()
    ? Object.values(onlineSession?.pendingDecisions || {}).find(decision => Object.values(decision?.submissions || {}).some(submission => submission?.localKey === itemKey))
    : null;
  const onlineRecipients = Object.fromEntries(Object.entries(onlineItemRound?.submissions || {}).map(([username, submission]) => {
    const player = (onlineSession?.players || []).find(entry => entry.username === username);
    return [player?.character || username, submission?.choice ?? null];
  }));
  const pendingRecipients = isOnlineEngine() ? onlineRecipients : isLocalMode() ? (movie.localDecisions?.[itemKey] || {}) : {};
  const pickedBy = Object.fromEntries(Object.entries(pendingRecipients).filter(([, recipient]) => recipient).map(([player, recipient]) => [recipient, player]));
  const focus = candidates[0] || movie.dangerA;
  const content = movieScreen("A QUIET MOMENT", 28);
  content.append(scenePanel({
    name: focus, time: "12:06 AM", image: focus, tone: "cold", eyebrow: "AN ORDINARY CHOICE", title: `Έχεις μόνο ένα ${movie.survivalItem}.`,
    body: `Μπορείς να το δώσεις σε οποιοδήποτε ζωντανό μέλος του inner circle ή να το κρατήσεις. Η προστασία καταγράφεται ξεχωριστά για κάθε ανθρώπινο player.`,
    choices: [
      ...candidates.map(name => pickedBy[name]
        ? { label: `🔒 ${name} · έχει ήδη επιλεγεί από ${pickedBy[name]}.`, disabled: true }
        : { label: `Δώσε το ${movie.survivalItem} ${toName(name)}.`, action: () => giveKey(name) }),
      { label: `KEEP · Κράτησε το ${movie.survivalItem} πάνω σου.`, action: () => giveKey(null) }
    ]
  }));
}

function renderItemReassignment() {
  const movie = current.movie;
  const candidates = movie.cast
    .filter(name => !isPlayerCharacter(name) && isAlive(name))
    .sort((a, b) => (friendsForPlayer().includes(b) ? 1 : 0) - (friendsForPlayer().includes(a) ? 1 : 0));
  const focus = candidates[0] || current.protagonist;
  const content = movieScreen("THE OBJECT CHANGES HANDS", 31);
  content.append(scenePanel({
    name: focus, time: "12:11 AM", image: focus, tone: "cold", eyebrow: "SECOND CHANCE · NO SAFE ANSWER",
    title: `Σε ποιον άλλον θα δώσεις το ${movie.survivalItem};`,
    body: `Το κράτησες από την παρέα σου. Δεν μένει όμως αδρανές: μπορείς τώρα να το εμπιστευτείς σε άλλο ζωντανό πρόσωπο, ακόμη κι αν δεν ξέρεις τι κρύβει. Η απόφαση γράφεται στο canon και επηρεάζει την επόμενη επίθεση.`,
    choices: [
      ...candidates.slice(0, 6).map(name => ({ label: `Δώσε το ${movie.survivalItem} ${toName(name)}.`, action: () => giveKey(name) })),
      { label: `Κράτησέ το πάνω σου μέχρι τη σύγκρουση.`, action: finalizeKeptItem }
    ], cameos: candidates.slice(0, 3)
  }));
}

function finalizeKeptItem() {
  const movie = current.movie;
  const keepDecision = localDecision(`item-finalize-${movie.number}`, true);
  if (keepDecision === LOCAL_PENDING) return;
  movie.itemReassigning = false;
  movie.keyHolder = null;
  movie.itemHolders = [];
  movie.itemKept = true;
  movie.itemUsed = false;
  remember(`Δεν έδωσες το ${movie.survivalItem} σε κανέναν.`, "Το κράτησες μέχρι την επίθεση και οι στόχοι μετακινήθηκαν έξω από την κεντρική παρέα.");
  refreshSceneTargets();
  queueBeat({
    kind: "action", eyebrow: "OBJECT KEPT · THE ROUTE SPLITS", title: `Το ${movie.survivalItem} μένει μαζί σου.`,
    body: "Δεν χάθηκε η ευκαιρία· απλώς κανείς άλλος δεν θα το χρησιμοποιήσει πριν από την κρίσιμη διαδρομή. Τώρα πρέπει να διαλέξεις ποιον θα προλάβεις.",
    names: [current.protagonist], statuses: ["ITEM KEPT · PLAYER"], roomOffset: 1
  }, 4);
}

function giveKey(name) {
  const movie = current.movie;
  const duplicatePick = name && isLocalMode()
    ? Object.entries(movie.localDecisions?.[`item-${movie.number}`] || {}).find(([player, recipient]) => player !== activePlayerName() && recipient === name)
    : null;
  if (duplicatePick) {
    toast(`${name} έχει ήδη επιλεγεί από ${duplicatePick[0]}. Διάλεξε άλλο μέλος του inner circle.`);
    return;
  }
  name = localDecision(`item-${movie.number}`, name);
  if (name === LOCAL_PENDING) return;
  const localItemVotes = isMultiplayerMode() ? movie.lastLocalResolution?.choices : null;
  const recipients = localItemVotes
    ? unique(Object.values(localItemVotes).filter(Boolean))
    : (name ? [name] : []);
  const keepers = localItemVotes
    ? Object.entries(localItemVotes).filter(([, recipient]) => !recipient).map(([player]) => player)
    : (!name ? [activePlayerName()] : []);
  movie.itemHolders = recipients;
  movie.itemKeepers = keepers;
  movie.keyHolder = recipients.length ? recipients.join(" & ") : null;
  movie.itemKept = keepers.length > 0;
  movie.itemReassigning = false;
  movie.itemUsed = false;
  if (recipients.length) {
    if (localItemVotes) {
      Object.entries(localItemVotes).forEach(([player, recipient]) => {
        if (recipient) relationshipState(recipient, player).trust += 18;
      });
      remember(`Οι παίκτες έδωσαν το ${movie.survivalItem} στους/στις ${recipients.join(" και ")}.`, "Κάθε local επιλογή καταγράφηκε· όλοι οι παραλήπτες έχουν ξεχωριστό item protection.");
    } else {
      relationshipState(recipients[0]).trust += 18;
      remember(`Έδωσες το ${movie.survivalItem} ${toName(recipients[0])}.`, "The item now changes the rescue odds, the identity of the next target and the finale.");
    }
  }
  if (keepers.length) remember(`${keepers.join(" και ")} κράτησαν το ${movie.survivalItem}.`, "Το item παραμένει πάνω στους players και δίνει survival bonus στις κρίσιμες επιλογές.");
  refreshSceneTargets();
  queueBeat({
    kind: "action",
    eyebrow: "OBJECT IN PLAY · CHOICE CONFIRMED",
    title: recipients.length > 1 ? `${recipients.join(" και ")} παίρνουν το ${movie.survivalItem}.` : recipients.length ? `${recipients[0]} παίρνει το ${movie.survivalItem}.` : `${keepers.join(" και ")} κρατούν το ${movie.survivalItem}.`,
    body: recipients.length > 1
      ? `Οι παίκτες επέλεξαν διαφορετικούς παραλήπτες. Το αντικείμενο γίνεται κοινό multiplayer protection: ${recipients.join(" και ")} κρατούν ξεχωριστό survival bonus και η σκηνή καταγράφει όλες τις αποφάσεις.`
      : recipients.length
        ? `Το αντικείμενο αλλάζει χέρια. ${subjectName(recipients[0])} θυμάται ότι ${genderWord(recipients[0], "τον", "την")} εμπιστεύτηκες — και μπορεί να το χρησιμοποιήσει όταν εσύ δεν θα είσαι εκεί.`
        : `Το αντικείμενο μένει στους ${keepers.join(" και ")}. Δεν υπάρχει αναγκαστική δεύτερη ανάθεση: το KEEP είναι τελική και ουσιαστική επιλογή.`,
    names: recipients.length ? recipients : keepers, statuses: recipients.length ? recipients.map(() => "ITEM HOLDER · TRUST +18") : keepers.map(() => "ITEM KEPT · PLAYER PROTECTION"), roomOffset: 1
  }, 4);
}

function renderInvestigation() {
  const movie = current.movie;
  if (movie.investigationPhase === "followup") return renderInvestigationFollowup();
  if (movie.investigationPhase === "puzzle") return renderPuzzle();
  const content = movieScreen("INVESTIGATION", 38);
  const wrap = el("div", "content");
  wrap.append(
    el("p", "eyebrow", "INITIAL INVESTIGATION · FOUR LOCKED ROUTES"),
    el("h1", "headline", "Διάλεξε ένα από τα 4 δωμάτια."),
    el("p", "section-copy", isLocalMode() ? "Κάθε παίκτης επιλέγει διαδοχικά διαφορετικό δωμάτιο. Όσα περισσέψουν παραμένουν κλειστά μέχρι την προαιρετική δεύτερη φάση." : "Ερεύνησε ένα δωμάτιο. Τα υπόλοιπα δεν αποκαλύπτονται αυτόματα και παραμένουν διαθέσιμα μόνο στην προαιρετική δεύτερη φάση.")
  );
  const grid = el("div", "feature-grid");
  const roomKey = `initial-room-${movie.number}`;
  const onlineRoomRound = isOnlineEngine()
    ? Object.values(onlineSession?.pendingDecisions || {}).find(decision => Object.values(decision?.submissions || {}).some(submission => submission?.localKey === roomKey))
    : null;
  const onlineRooms = Object.fromEntries(Object.entries(onlineRoomRound?.submissions || {}).map(([username, submission]) => {
    const player = (onlineSession?.players || []).find(entry => entry.username === username);
    return [player?.character || username, submission?.choice ?? null];
  }));
  const pendingRooms = isOnlineEngine() ? onlineRooms : (movie.localDecisions?.[roomKey] || {});
  const pickedBy = Object.fromEntries(Object.entries(pendingRooms).filter(([, location]) => location).map(([player, location]) => [location, player]));
  movie.locationChoices.filter(([location]) => !movie.investigatedRooms.includes(location)).forEach(([location, hint], index) => {
    const room = movie.rooms.find(item => item.name === location);
    const card = paintRoom(el("article", "panel feature location-card"), room);
    const owner = pickedBy[location];
    const choose = button(owner ? `🔒 ${owner} ερευνά αυτό το δωμάτιο` : "Έρευνα", "ghost", () => findClue(location), true);
    choose.disabled = Boolean(owner);
    card.classList.toggle("room-locked", Boolean(owner));
    card.append(el("b", "", String(index + 1).padStart(2, "0")), el("h3", "", location), el("p", "", owner ? `${hint} · LOCKED BY ${owner}` : hint), choose);
    grid.append(card);
  });
  wrap.append(grid);
  content.append(wrap);
}

function findClue(location) {
  const movie = current.movie;
  const roomKey = `initial-room-${movie.number}`;
  const duplicate = Object.entries(movie.localDecisions?.[roomKey] || {}).find(([player, picked]) => player !== activePlayerName() && picked === location);
  if (duplicate) {
    toast(`Το δωμάτιο έχει ήδη κλειδωθεί από ${duplicate[0]}. Διάλεξε άλλη διαδρομή.`);
    return;
  }
  location = localDecision(roomKey, location);
  if (location === LOCAL_PENDING) return;
  const localChoices = movie.lastLocalResolution?.choices;
  const locations = isMultiplayerMode() ? unique(Object.values(localChoices || {}).filter(Boolean)) : [location];
  const clues = locations.map(selectedLocation => movie.locationClues[selectedLocation]).filter(Boolean);
  locations.forEach(selectedLocation => {
    const clue = movie.locationClues[selectedLocation];
    if (!movie.investigatedRooms.includes(selectedLocation)) movie.investigatedRooms.push(selectedLocation);
    if (!movie.cluesFound.includes(clue)) movie.cluesFound.push(clue);
  });
  movie.investigationActions = locations.length;
  movie.initialInvestigationComplete = true;
  movie.investigationPhase = "followup";
  if (isMultiplayerMode() && localChoices) {
    Object.entries(localChoices).forEach(([player, selectedLocation]) => {
      const clue = movie.locationClues[selectedLocation];
      if (clue) relationshipState(clue.title.split(":")[0], player).suspicion += 18;
    });
  } else clues.forEach(clue => { relationshipState(clue.title.split(":")[0]).suspicion += 18; });
  remember(`Έρευνα: ${locations.join(" + ")}.`, clues.map(clue => `Found ${clue.type}: ${clue.title}.`).join(" "));
  const mainClue = clues[0] || movie.locationClues[location];
  const eventRandom = mulberry32((current.seed + movie.number * 15401 + movie.investigationActions * 907 + locations.join("").length) >>> 0);
  const rareEventLine = consumeRareEvent();
  const secretVictim = maybeSecretAttack(movie.puzzleSolved && !movie.puzzleAdvantage ? "failed-puzzle" : "investigation", eventRandom);
  let allianceLine = "";
  if (movie.secretAlliance && !movie.secretAlliance.revealed && eventRandom() < .38) {
    movie.secretAlliance.revealed = true;
    allianceLine = ` ΜΥΣΤΙΚΗ ΣΥΜΜΑΧΙΑ · ${movie.secretAlliance.members.join(" και ")} αντάλλασσαν πληροφορίες κρυφά (${movie.secretAlliance.nature}). Η συμμαχία δεν αποτελεί απόδειξη ενοχής.`;
  }
  const reliability = mainClue.type === "REAL CLUE"
    ? (movie.puzzleAdvantage ? "ΥΨΗΛΗ ΑΞΙΟΠΙΣΤΙΑ" : "ΜΕΣΑΙΑ ΑΞΙΟΠΙΣΤΙΑ")
    : (movie.puzzleAdvantage ? "ΠΙΘΑΝΗ ΠΛΑΣΤΟΓΡΑΦΗΣΗ" : "ΑΝΕΠΙΒΕΒΑΙΩΤΟ");
  queueBeat({
    kind: secretVictim ? "death" : mainClue.type === "REAL CLUE" ? "clue" : "twist",
    eyebrow: secretVictim ? "HIDDEN ATTACK · DEATH CONFIRMED" : clues.length > 1 ? "MULTIPLAYER · MULTIPLE ROOMS INVESTIGATED" : `${mainClue.type} · ${reliability}`,
    title: secretVictim ? `${subjectName(secretVictim)} δολοφονήθηκε μακριά από το Inner Circle.` : clues.length > 1 ? "Οι παίκτες ερεύνησαν διαφορετικές διαδρομές." : mainClue.title,
    body: `${clues.map((clue, index) => `${index + 1}. ${clue.title}: ${clue.text}`).join(" ")} Αξιοπιστία: ${reliability}. Τα puzzles και οι προηγούμενες έρευνες αλλάζουν πόσο εύκολα αναγνωρίζεται ένα killer-planted στοιχείο.${rareEventLine ? ` ΣΠΑΝΙΟ ΓΕΓΟΝΟΣ · ${rareEventLine}` : ""}${allianceLine}${secretVictim ? ` Την ίδια στιγμή ανακοινώνεται ο θάνατος ${genitiveName(secretVictim)}· ${subjectName(secretVictim)} είναι πλέον οριστικά DEAD.` : ""}`,
    names: unique([...clues.map(clue => clue.title.split(":")[0]), ...(secretVictim ? [secretVictim] : [])]), statuses: [...clues.map(clue => clue.type), ...(secretVictim ? ["DEAD"] : [])],
    room: movie.rooms.find(item => item.name === locations[0]), cta: "Πέρασε στις προαιρετικές ενέργειες"
  }, 4);
}

function renderInvestigationFollowup() {
  const movie = current.movie;
  if (isOnlineEngine()) return renderOnlineAdditionalActions();
  movie.additionalActions ||= {};
  movie.additionalActionDrafts ||= {};
  const player = isLocalMode() ? activePlayerName() : current.protagonist;
  const draft = movie.additionalActionDrafts[player] || null;
  const reservedRooms = Object.values(movie.additionalActions).filter(action => action?.type === "room").map(action => action.target);
  const unsearched = movie.locationChoices.filter(([location]) => !movie.investigatedRooms.includes(location) && !reservedRooms.includes(location));
  const dialogueCandidates = movie.cast
    .filter(name => !isPlayerCharacter(name) && name !== movie.legacyEcho && name !== "LEGACY GHOST" && isAlive(name))
    .sort((a, b) => (relationshipState(b, player).trust || 0) - (relationshipState(a, player).trust || 0));
  const focus = dialogueCandidates[0] || supportingVoices([], 1)[0] || current.protagonist;
  let eyebrow = `SECOND PHASE · ${player.toUpperCase()}`;
  let title = `${player}, διάλεξε μία πρόσθετη ενέργεια.`;
  let body = "Η δεύτερη φάση είναι προαιρετική. Κάθε παίκτης κλειδώνει μία ενέργεια και μετά παραδίδει τη σειρά στον επόμενο.";
  let choices;
  if (draft === "room") {
    eyebrow = "OPTIONAL ROOM · UNREVEALED EVIDENCE";
    title = "Ποιο ανεξερεύνητο δωμάτιο θέλεις να ανοίξεις;";
    body = "Μόνο το δωμάτιο που επιλέγεις θα αποκαλυφθεί. Ένα δωμάτιο που κλειδώθηκε από άλλον παίκτη δεν μπορεί να εξερευνηθεί δεύτερη φορά.";
    choices = [
      ...unsearched.map(([location]) => ({ label: `Ερεύνησε το «${location}».`, action: () => submitAdditionalAction({ type: "room", target: location }) })),
      { label: "Πίσω στις 4 κατηγορίες", action: () => setAdditionalActionDraft(null) }
    ];
  } else if (draft === "talk") {
    eyebrow = "PRIVATE CONVERSATION · WHO DO YOU TRUST?";
    title = "Με ποιον ζωντανό χαρακτήρα θέλεις να μιλήσεις;";
    body = "Μπορείς να επιλέξεις οποιονδήποτε ζωντανό NPC, ακόμη και εκτός Inner Circle. Η συζήτηση μπορεί να αυξήσει ή να μειώσει trust και το στοιχείο μπορεί να είναι αλήθεια, λάθος εκτίμηση ή σκόπιμη παραπλάνηση.";
    choices = [
      ...dialogueCandidates.map(name => ({ label: `Μίλησε ιδιωτικά με ${accusativeName(name)}${protagonistRelationship(name) ? ` · ${protagonistRelationship(name)}` : ""}.`, action: () => submitAdditionalAction({ type: "talk", target: name }) })),
      { label: "Πίσω στις 4 κατηγορίες", action: () => setAdditionalActionDraft(null) }
    ];
  } else if (draft === "puzzle") {
    eyebrow = "OPTIONAL PUZZLE · ONE ANSWER CHANGES THE ROUTE";
    title = movie.puzzle.title;
    body = movie.puzzle.question;
    choices = [
      ...movie.puzzle.answers.map((answer, index) => ({ label: answer, action: () => submitAdditionalAction({ type: "puzzle", answer: index }) })),
      { label: "Πίσω στις 4 κατηγορίες", action: () => setAdditionalActionDraft(null) }
    ];
  } else {
    choices = [
      { label: unsearched.length ? "Ερεύνησε ένα δωμάτιο που δεν επισκέφθηκες." : "🔒 Δεν υπάρχει άλλο διαθέσιμο ανεξερεύνητο δωμάτιο.", disabled: !unsearched.length, action: () => setAdditionalActionDraft("room") },
      { label: "Μίλησε ιδιωτικά με έναν ζωντανό χαρακτήρα.", disabled: !dialogueCandidates.length, action: () => setAdditionalActionDraft("talk") },
      { label: `Λύσε ένα Puzzle · «${movie.puzzle.title}».`, action: () => setAdditionalActionDraft("puzzle") },
      { label: "Μην κάνεις τίποτα · συνέχισε την ιστορία.", action: () => submitAdditionalAction({ type: "none" }) }
    ];
  }
  const content = movieScreen("INVESTIGATE OR TALK", 43);
  content.append(scenePanel({
    name: focus, time: "12:44 AM", image: focus, room: roomFor(2), tone: "cold",
    eyebrow, title, body,
    choices, cameos: dialogueCandidates.slice(0, 4)
  }));
}

function renderOnlineAdditionalActions() {
  const movie = current.movie;
  const reservedRooms = Object.values(movie.additionalActions || {}).filter(action => action?.type === "room").map(action => action.target);
  const unsearched = movie.locationChoices.filter(([location]) => !movie.investigatedRooms.includes(location) && !reservedRooms.includes(location));
  const dialogueCandidates = movie.cast.filter(name => !isPlayerCharacter(name) && name !== movie.legacyEcho && name !== "LEGACY GHOST" && isAlive(name));
  const focus = dialogueCandidates[0] || current.protagonist;
  const choices = [
    ...unsearched.map(([location]) => ({ label: `ROOM · Ερεύνησε το «${location}».`, action: () => submitOnlineAdditionalAction({ type: "room", target: location }) })),
    ...dialogueCandidates.map(name => ({ label: `TALK · Μίλησε ιδιωτικά με ${accusativeName(name)}.`, action: () => submitOnlineAdditionalAction({ type: "talk", target: name }) })),
    ...movie.puzzle.answers.map((answer, index) => ({ label: `PUZZLE · ${answer}`, action: () => submitOnlineAdditionalAction({ type: "puzzle", answer: index }) })),
    { label: "NONE · Μην κάνεις τίποτα.", action: () => submitOnlineAdditionalAction({ type: "none" }) }
  ];
  const content = movieScreen("ONLINE · SECOND INVESTIGATION PHASE", 43);
  content.append(scenePanel({
    name: focus, time: "12:44 AM", image: focus, room: roomFor(2), tone: "cold",
    eyebrow: "ONE OPTIONAL ACTION PER ONLINE PLAYER",
    title: "Κλείδωσε τη δική σου πρόσθετη ενέργεια.",
    body: "Κάθε online player επιλέγει ανεξάρτητα room, private talk, puzzle ή none. Ο server περιμένει όλες τις επιλογές και δημοσιεύει ένα κοινό αποτέλεσμα.",
    choices, cameos: dialogueCandidates.slice(0, 4)
  }));
}

function submitOnlineAdditionalAction(action) {
  const movie = current.movie;
  const resolved = localDecision(`additional-action-${movie.number}`, action, values => values);
  if (resolved === LOCAL_PENDING) return;
  const choices = movie.lastLocalResolution?.choices || {};
  movie.additionalActions = Object.fromEntries(Object.entries(choices).map(([player, value]) => [player, value]));
  resolveAdditionalActions();
}

function setAdditionalActionDraft(type) {
  const movie = current.movie;
  movie.additionalActionDrafts ||= {};
  const player = isLocalMode() ? activePlayerName() : current.protagonist;
  if (type) movie.additionalActionDrafts[player] = type;
  else delete movie.additionalActionDrafts[player];
  saveCurrent();
  renderMovie();
}

function submitAdditionalAction(action) {
  const movie = current.movie;
  movie.additionalActions ||= {};
  movie.additionalActionDrafts ||= {};
  const players = isLocalMode() ? playerCharacters() : [current.protagonist];
  const player = isLocalMode() ? activePlayerName() : current.protagonist;
  if (action.type === "room") {
    const alreadyTaken = movie.investigatedRooms.includes(action.target)
      || Object.entries(movie.additionalActions).some(([owner, entry]) => owner !== player && entry?.type === "room" && entry.target === action.target);
    if (alreadyTaken) {
      toast("Αυτό το δωμάτιο έχει ήδη εξερευνηθεί ή κλειδωθεί από άλλον παίκτη.");
      return renderMovie();
    }
  }
  movie.additionalActions[player] = action;
  delete movie.additionalActionDrafts[player];
  const missing = players.find(name => !movie.additionalActions[name]);
  if (missing) {
    current.activePlayerIndex = players.indexOf(missing);
    movie.localTurnNotice = { key: `additional-action-${movie.number}`, player, choice: action.type, nextPlayer: missing };
    saveCurrent();
    toast(`${player} κλείδωσε την πρόσθετη ενέργεια. Τώρα αποφασίζει ${subjectName(missing, true)}.`);
    return renderMovie();
  }
  current.activePlayerIndex = 0;
  movie.localTurnNotice = null;
  resolveAdditionalActions();
}

function resolveAdditionalActions() {
  const movie = current.movie;
  const entries = Object.entries(movie.additionalActions || {});
  const lines = [];
  const shownNames = [];
  const statuses = [];
  let anyCorrectPuzzle = false;
  let puzzleAttempted = false;
  entries.forEach(([player, action], index) => {
    const random = mulberry32((current.seed + movie.number * 17891 + player.length * 311 + index * 997) >>> 0);
    if (action.type === "room") {
      const clue = movie.locationClues[action.target];
      if (clue && !movie.investigatedRooms.includes(action.target)) {
        movie.investigatedRooms.push(action.target);
        if (!movie.cluesFound.includes(clue)) movie.cluesFound.push(clue);
        relationshipState(clue.title.split(":")[0], player).suspicion += 18;
        lines.push(`${player}: άνοιξε το «${action.target}» και βρήκε ${clue.type} — ${clue.title}.`);
        const clueName = clue.title.split(":")[0];
        if (character(clueName)) { shownNames.push(clueName); statuses.push(clue.type); }
      } else lines.push(`${player}: το δωμάτιο είχε ήδη καταγραφεί και δεν αποκάλυψε δεύτερο clue.`);
    } else if (action.type === "talk") {
      const target = action.target;
      const state = relationshipState(target, player);
      const canon = relationshipBetween(player, target);
      const misleading = isKiller(target) || random() < .28;
      const trustDelta = misleading ? (random() < .5 ? -8 : 4) : canon ? 18 : 10;
      state.trust += trustDelta;
      state.friendship += misleading ? 2 : canon ? 14 : 7;
      state.suspicion += misleading ? 9 : -3;
      if (!movie.dialoguedWith.includes(target)) movie.dialoguedWith.push(target);
      lines.push(`${player}: μίλησε ιδιωτικά με ${accusativeName(target)}. Το trust ${trustDelta >= 0 ? `ανέβηκε +${trustDelta}` : `έπεσε ${trustDelta}`}, αλλά η πληροφορία παραμένει UNVERIFIED και μπορεί να είναι αλήθεια ή παραπλάνηση.`);
      shownNames.push(target); statuses.push("PRIVATE CLUE · UNVERIFIED");
    } else if (action.type === "puzzle") {
      puzzleAttempted = true;
      const correct = action.answer === movie.puzzle.correct;
      anyCorrectPuzzle ||= correct;
      lines.push(`${player}: απάντησε «${movie.puzzle.answers[action.answer]}» στο puzzle — ${correct ? "η διαδρομή άνοιξε" : "ενεργοποιήθηκε λάθος μηχανισμός"}.`);
    } else lines.push(`${player}: δεν έκανε πρόσθετη ενέργεια και κράτησε τις πληροφορίες που είχε ήδη.`);
  });
  if (puzzleAttempted) {
    movie.puzzleSolved = true;
    movie.puzzleAdvantage = Boolean(movie.puzzleAdvantage || anyCorrectPuzzle);
  }
  const puzzleRandom = mulberry32((current.seed + movie.number * 19913 + entries.length * 487) >>> 0);
  const puzzleVictim = puzzleAttempted && !anyCorrectPuzzle ? maybeSecretAttack("failed-puzzle", puzzleRandom) : null;
  if (puzzleVictim) {
    lines.push(`${subjectName(puzzleVictim)} δολοφονήθηκε όσο οι παίκτες ακολουθούσαν τη λάθος λύση. Ο θάνατος καταγράφεται οριστικά.`);
    shownNames.push(puzzleVictim);
    statuses.push("DEAD");
  }
  movie.investigationActions += entries.length;
  movie.additionalActionsComplete = true;
  movie.investigationPhase = "done";
  remember(`Πρόσθετες ενέργειες: ${entries.map(([player, action]) => `${player} → ${action.type}${action.target ? ` (${action.target})` : ""}`).join(" · ")}.`, lines.join(" "));
  queueBeat({
    kind: puzzleVictim ? "death" : anyCorrectPuzzle ? "clue" : "dialogue",
    eyebrow: "SECOND INVESTIGATION PHASE · ACTIONS LOCKED",
    title: "Κάθε παίκτης ακολούθησε τη δική του διαδρομή.",
    body: lines.join(" "),
    names: unique(shownNames),
    statuses: unique(shownNames).map(name => statuses[shownNames.lastIndexOf(name)] || "UNVERIFIED"),
    roomOffset: 2,
    cta: "Συνέχισε στην επίθεση"
  }, 5);
}

function talkAfterInvestigation(name) {
  const movie = current.movie;
  name = localDecision(`investigation-talk-${movie.number}-${movie.investigationActions}`, name);
  if (name === LOCAL_PENDING) return;
  const localChoices = movie.lastLocalResolution?.choices;
  const names = isMultiplayerMode() ? unique(Object.values(localChoices || {}).filter(Boolean)) : [name];
  names.forEach(selectedName => { if (!movie.dialoguedWith.includes(selectedName)) movie.dialoguedWith.push(selectedName); });
  movie.investigationActions += names.length;
  movie.investigationPhase = movie.investigationActions >= 3 ? "done" : "followup";
  const localTalkVotes = localChoices || {};
  const talkEntries = isMultiplayerMode() ? Object.entries(localTalkVotes) : [[activePlayerName(), name]];
  const refused = [];
  talkEntries.forEach(([player, selectedName]) => {
    const relation = relationshipBetween(player, selectedName);
    const state = relationshipState(selectedName, player);
    const priorAccusation = continuityMemory(selectedName, player).some(memory => memory.type === "accused");
    const refusalRandom = mulberry32((current.seed + movie.number * 12101 + selectedName.length * 379 + player.length * 151) >>> 0);
    const refuses = priorAccusation && state.trust < 0 && refusalRandom() < Math.min(.76, .34 + Math.abs(state.trust) / 120);
    if (refuses) {
      refused.push({ player, name: selectedName });
      state.trust -= 4;
      return;
    }
    state.trust += relation ? 18 : 10;
    state.friendship += relation ? 14 : 8;
    if (movie.relationshipArc?.mode === "truth-seeker" && movie.relationshipArc.subject === selectedName) {
      movie.puzzleAdvantage = true;
      movie.relationshipArc.revealed = true;
    }
    if (isKiller(selectedName)) relationshipState(selectedName, player).suspicion = Math.max(0, relationshipState(selectedName, player).suspicion - 8);
  });
  const allianceRevealed = movie.secretAlliance && !movie.secretAlliance.revealed && names.some(selectedName => movie.secretAlliance.members.includes(selectedName));
  if (allianceRevealed) movie.secretAlliance.revealed = true;
  const relation = protagonistRelationship(name);
  const sabotage = isKiller(name);
  remember(`Ιδιωτικές συζητήσεις: ${names.join(" + ")}.`, names.map(selectedName => `${selectedName} ${isKiller(selectedName) ? "redirected the investigation" : "improved trust and survival odds"}`).join(" · "));
  queueBeat({
    kind: sabotage ? "sabotage" : "dialogue",
    eyebrow: relation ? `CANON RELATIONSHIP · ${relation}` : "PRIVATE CONVERSATION",
    title: refused.length ? `${refused.map(entry => entry.name).join(" και ")} αρνούνται να συνεργαστούν.` : sabotage ? `${name} σου δίνει ένα στοιχείο που μοιάζει υπερβολικά τέλειο.` : `${names.join(" και ")} αποφασίζουν να μιλήσουν.`,
    body: `${refused.length ? `${refused.map(entry => `${entry.name}: «Με κατηγόρησες όταν ήμουν αθώος/α. Δεν σου χρωστάω το στοιχείο μου.»`).join(" · ")} Η χαμηλή εμπιστοσύνη έχει πραγματική συνέπεια. ` : sabotage ? "Η πληροφορία ανοίγει νέα διαδρομή, αλλά μετακινεί αθόρυβα την υποψία μακριά από τον πραγματικό killer. " : `${names.join(" και ")} αποκαλύπτουν τι είδαν στις δικές τους διαδρομές. Κάθε προσωπική συζήτηση αυξάνει διαφορετικά trust, friendship και survival odds. `}${movie.relationshipArc?.mode === "truth-seeker" && names.includes(movie.relationshipArc.subject) ? `${movie.relationshipArc.subject} μετατρέπει το προσωπικό τραύμα σε πραγματική βοήθεια και ξεκλειδώνει πλεονέκτημα έρευνας. ` : ""}${allianceRevealed ? `Αποκαλύπτεται ότι ${movie.secretAlliance.members.join(" και ")} είχαν μυστική συμμαχία (${movie.secretAlliance.nature}). Αυτό εξηγεί την απόκρυψη πληροφοριών, όχι την ταυτότητα του killer.` : ""}`,
    names, statuses: names.map(selectedName => refused.some(entry => entry.name === selectedName) ? "REFUSED · BROKEN TRUST" : isKiller(selectedName) ? "UNRELIABLE CLUE" : allianceRevealed && movie.secretAlliance.members.includes(selectedName) ? "SECRET ALLIANCE · NOT PROOF" : "TRUST INCREASED"), roomOffset: 2
  }, movie.investigationActions >= 3 ? 5 : 4);
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
  answerIndex = localDecision(`puzzle-${movie.number}`, answerIndex);
  if (answerIndex === LOCAL_PENDING) return;
  const localAnswers = movie.lastLocalResolution?.choices;
  const answers = isMultiplayerMode() ? Object.values(localAnswers || {}) : [answerIndex];
  const correct = answers.some(answer => answer === movie.puzzle.correct);
  movie.puzzleSolved = true;
  movie.puzzleAdvantage = correct;
  movie.investigationActions += isMultiplayerMode() ? 2 : 1;
  movie.investigationPhase = movie.investigationActions >= 3 ? "done" : "followup";
  remember(`Puzzle: ${movie.puzzle.title} — ${isMultiplayerMode() ? answers.map(answer => movie.puzzle.answers[answer]).join(" + ") : movie.puzzle.answers[answerIndex]}.`, correct ? "At least one player solved the route correctly." : "Wrong route opened.");
  const puzzleRandom = mulberry32((current.seed + movie.number * 19913 + movie.investigationActions * 487) >>> 0);
  const secretVictim = correct ? null : maybeSecretAttack("failed-puzzle", puzzleRandom);
  const supporting = supportingVoices([], 2);
  queueBeat({
    kind: secretVictim ? "death" : correct ? "clue" : "twist", eyebrow: secretVictim ? "WRONG ANSWER · HIDDEN MURDER" : correct ? "PUZZLE SOLVED" : "WRONG ANSWER · NEW DANGER",
    title: secretVictim ? `${subjectName(secretVictim)} δολοφονήθηκε όσο η ομάδα ακολουθούσε τη λάθος διαδρομή.` : correct ? "Ο κρυφός μηχανισμός ανοίγει." : "Ο χάρτης σε οδηγεί σε παγίδα.",
    body: correct ? `${movie.puzzle.clue} Το πλεονέκτημα θα αυξήσει τις πιθανότητες διάσωσης αργότερα.` : `${secretVictim ? `Ο θάνατος ${genitiveName(secretVictim)} ανακοινώνεται και καταγράφεται ως DEAD. ` : ""}Η λάθος επιλογή δεν τελειώνει το παιχνίδι, αλλά ο killer εκμεταλλεύεται την αποτυχία και αποκτά καλύτερη θέση για την επόμενη επίθεση.`,
    names: unique([...supporting, ...(secretVictim ? [secretVictim] : [])]), statuses: [...supporting.map(() => correct ? "ROUTE FOUND" : "EXPOSED"), ...(secretVictim ? ["DEAD"] : [])], roomOffset: 3
  }, movie.investigationActions >= 3 ? 5 : 4);
}

function renderDanger() {
  const movie = current.movie;
  playSfx("impact");
  navigator.vibrate?.([80, 45, 120]);
  const content = movieScreen("THE FIRST ATTACK", 49);
  const leftRoom = roomFor(0);
  const rightRoom = roomFor(1);
  const targetLine = movie.itemKept
    ? `Δεν έδωσες το ${movie.survivalItem} στην παρέα σου. Οι δύο νέοι στόχοι έξω από το main group ζητούν βοήθεια.`
    : movie.keyHolder
      ? `Το ${movie.survivalItem} βρίσκεται με ${accusativeName(movie.itemHolders?.[0] || movie.keyHolder)}. Η επιλογή της διαδρομής θα κρίνει αν θα προλάβει να το χρησιμοποιήσει.`
      : "Οι δύο διαδρομές ανοίγουν μαζί και κανείς δεν είναι πραγματικά ασφαλής.";
  const pairRelation = relationshipBetween(movie.dangerA, movie.dangerB);
  const emotionalLine = pairRelation
    ? `Οι δυο τους συνδέονται ως «${pairRelation}»· φωνάζουν ο ένας το όνομα του άλλου και κάθε επιλογή αποκτά προσωπικό βάρος.`
    : "Δεν έχουν ιδιαίτερο δεσμό και κανείς δεν περίμενε ότι θα παγιδευτούν μαζί.";
  content.append(scenePanel({
    name: `${movie.dangerA} / ${movie.dangerB}`, time: "01:18 AM", image: movie.dangerA, tone: "red", eyebrow: "YOU CANNOT REACH BOTH", title: "Δύο κραυγές. Δύο διάδρομοι.",
    body: `${targetLine} ${subjectName(movie.dangerA)} είναι ${genderWord(movie.dangerA, "παγιδευμένος", "παγιδευμένη")} στο «${leftRoom.name}». ${subjectName(movie.dangerB)} τρέχει προς το «${rightRoom.name}». ${emotionalLine}`,
    choices: [
      { label: `Τρέξε στο «${leftRoom.name}» για ${accusativeName(movie.dangerA)}.`, action: () => rescueChoice(movie.dangerA, movie.dangerB) },
      { label: `Πήγαινε στο «${rightRoom.name}» για ${accusativeName(movie.dangerB)}.`, action: () => rescueChoice(movie.dangerB, movie.dangerA) },
      { label: "Χώρισε την ομάδα και προσπάθησε να σώσεις και τους δύο.", action: () => rescueChoice("both", null) },
      { label: "Μην μπεις στην παγίδα· κράτησε την ομάδα μαζί.", action: () => rescueChoice("none", null) }
    ]
  }));
}

function rescueChoice(savedName, leftName) {
  const movie = current.movie;
  const submitted = localDecision(`rescue-${movie.number}`, savedName);
  if (submitted === LOCAL_PENDING) return;
  const localVotes = isMultiplayerMode() ? movie.lastLocalResolution?.choices : null;
  const votes = localVotes ? Object.entries(localVotes) : [[activePlayerName(), submitted]];
  const outcomeByName = {};
  const resultLines = [];
  votes.forEach(([player, selectedName], index) => {
    const mode = selectedName === "both" || selectedName === "none" ? selectedName : "one";
    const chosenName = mode === "one" ? selectedName : movie.dangerA;
    const otherName = chosenName === movie.dangerA ? movie.dangerB : movie.dangerA;
    const multiplayerOffset = isMultiplayerMode() ? index * 997 + player.length * 13 : 0;
    const random = mulberry32((current.seed + movie.number * 5431 + selectedName.length * 317 + otherName.length * 149 + movie.choices.length + multiplayerOffset) >>> 0);
    const chosenTrust = Math.min(.14, Math.max(0, relationshipState(chosenName, player).trust) / 500);
    const leftLoyalty = Math.min(.14, Math.max(0, relationshipState(otherName, player).loyalty) / 450);
    const canonBondBonus = relationshipBetween(chosenName, otherName) ? .10 : 0;
    const allianceChosenBonus = movie.secretAlliance?.members?.includes(chosenName)
      && movie.secretAlliance.members.some(member => member !== chosenName && isAlive(member)) ? .10 : 0;
    const allianceOtherBonus = movie.secretAlliance?.members?.includes(otherName)
      && movie.secretAlliance.members.some(member => member !== otherName && isAlive(member)) ? .10 : 0;
    const chosenItemBonus = !isKiller(chosenName) && (itemHeldBy(chosenName) ? .34 : movie.itemKept ? .24 : 0);
    const leftItemBonus = !isKiller(otherName) && (itemHeldBy(otherName) ? .76 : movie.itemKept ? .18 : 0);
    const weaponBonus = playerHasWeapon() ? .12 : 0;
    const puzzleBonus = movie.puzzleAdvantage ? .12 : 0;
    const chosenAlreadySaved = movie.status[chosenName] === "SAVED" || movie.saved.includes(chosenName) || movie.itemSaved.includes(chosenName);
    const leftAlreadySaved = movie.status[otherName] === "SAVED" || movie.saved.includes(otherName) || movie.itemSaved.includes(otherName);
    const chosenBase = mode === "both" ? .44 : mode === "none" ? .07 : .66;
    const otherBase = mode === "both" ? .44 : mode === "none" ? .09 : .12;
    const chosenLives = chosenAlreadySaved || (movie.number === 3 && movieThreeProtected(chosenName))
      ? true
      : survivalRoll(chosenName, Math.min(.98, chosenBase + chosenTrust + chosenItemBonus + puzzleBonus + canonBondBonus + allianceChosenBonus + weaponBonus), random);
    const leftLives = leftAlreadySaved || (movie.number === 3 && movieThreeProtected(otherName))
      ? true
      : survivalRoll(otherName, Math.min(.96, otherBase + leftLoyalty + leftItemBonus + puzzleBonus / 2 + canonBondBonus / 2 + allianceOtherBonus + weaponBonus), random);
    outcomeByName[chosenName] = Boolean(outcomeByName[chosenName] || chosenLives);
    outcomeByName[otherName] = Boolean(outcomeByName[otherName] || leftLives);
    resultLines.push(`${player} (${mode.toUpperCase()}): ${chosenName} ${chosenLives ? "σώθηκε" : "χάθηκε"} · ${otherName} ${leftLives ? "βγήκε ζωντανός/ή" : "έπεσε"}`);
  });
  const outcomes = Object.entries(outcomeByName);
  outcomes.forEach(([name, lives]) => {
    if (lives) {
      setStatus(name, "SAVED");
      if (!movie.saved.includes(name)) { movie.saved.push(name); movie.peopleSaved += 1; }
      movie.deathsPrevented += 1;
    } else setStatus(name, "DEAD");
  });
  const living = outcomes.filter(([, lives]) => lives).map(([name]) => name);
  const dead = outcomes.filter(([, lives]) => !lives).map(([name]) => name);
  votes.forEach(([player, selectedName]) => {
    const helped = selectedName === "both" ? living : living.includes(selectedName) ? [selectedName] : [];
    helped.forEach(name => { relationshipState(name, player).trust += 22; });
  });
  outcomes.forEach(([name, lives]) => {
    if (lives && (itemHeldBy(name) || movie.itemKept) && !movie.itemSaved.includes(name)) movie.itemSaved.push(name);
  });
  if (movie.itemKept && living.length) movie.itemUsed = true;
  const rescuedBoth = living.length === 2;
  let collateralDeath = null;
  if (rescuedBoth) {
    const collateralRandom = mulberry32((current.seed + movie.number * 14939 + movie.choices.length * 811 + living.join("").length) >>> 0);
    if (collateralRandom() < .20) {
      const collateralPool = rankMovieThreeDeaths(movie.cast.filter(name => !isPlayerCharacter(name) && !isKiller(name) && isAlive(name) && !living.includes(name) && movie.status[name] !== "SAVED" && !movie.saved.includes(name) && !itemHeldBy(name)), collateralRandom);
      collateralDeath = collateralPool[0] || null;
      if (collateralDeath && setStatus(collateralDeath, "DEAD")) dead.push(collateralDeath);
      else collateralDeath = null;
    }
  }
  remember(`Οι παίκτες έτρεξαν σε διαφορετικές διαδρομές: ${votes.map(([player, selectedName]) => `${player} → ${selectedName}`).join(" · ")}.`, `Survived: ${living.join(" & ") || "none"}. Died: ${dead.join(" & ") || "none"}.${collateralDeath ? " A 20% collateral twist triggered." : ""}`);
  const bothLive = rescuedBoth;
  const bothDead = living.length === 0 && outcomes.length === 2;
  queueBeat({
    kind: dead.length ? "death" : "rescue",
    eyebrow: collateralDeath ? "DOUBLE SAVE · COLLATERAL DEATH" : bothLive ? "DOUBLE SAVE · THE ODDS SHIFTED" : bothDead ? "THE CHOICE WAS A TRAP" : "ONE SURVIVOR · NOT THE EXPECTED ONE",
    title: collateralDeath ? `Τους έσωσες και τους δύο — αλλά ${subjectName(collateralDeath, true)} δεν απάντησε ποτέ.` : bothLive ? "Και οι δύο βγήκαν ζωντανοί." : bothDead ? "Κανείς δεν βγήκε από τα δωμάτια." : `${living[0]} επέζησε. ${dead[0]} πέθανε.`,
    body: collateralDeath
      ? `Η διπλή διάσωση πέτυχε, όμως ενεργοποιήθηκε η σπάνια πιθανότητα 20%: όσο όλοι κοιτούσαν τους δύο διαδρόμους, οι killers βρήκαν ${accusativeName(collateralDeath)} ${genderWord(collateralDeath, "απομονωμένο", "απομονωμένη")}. Ο θάνατος ανακοινώνεται τώρα και καταγράφεται οριστικά.`
      : bothLive
        ? `Trust, puzzle knowledge, οι ξεχωριστές αποφάσεις και το ${movie.survivalItem} άλλαξαν τις πιθανότητες. ${resultLines.join(" · ")}`
      : bothDead
        ? `Ο killer είχε προβλέψει διαφορετικές διαδρομές. ${resultLines.join(" · ")}`
        : `${movie.itemSaved.some(name => living.includes(name)) ? `Το ${movie.survivalItem} άλλαξε άμεσα τις πιθανότητες για ${living.filter(name => movie.itemSaved.includes(name)).join(" και ")}. ` : ""}${resultLines.join(" · ")} Το αποτέλεσμα προέκυψε από ξεχωριστά relationship, item και probability rolls — όχι από σταθερό A/B outcome.`,
    names: unique([...living, ...dead]), statuses: unique([...living, ...dead]).map(name => movie.status[name]), roomOffset: 1,
    cta: "Κατάγραψε ποιον έχασες"
  }, 6);
}

function createAccusationDebate(kind) {
  const movie = current.movie;
  movie.accusationDebates ||= {};
  if (movie.accusationDebates[kind]) return movie.accusationDebates[kind];
  const random = mulberry32((current.seed + movie.number * 6197 + (kind === "final" ? 911 : 421)) >>> 0);
  const speakers = shuffle(movie.cast.filter(name => !isPlayerCharacter(name) && isAlive(name) && name !== movie.legacyEcho), random).slice(0, 4);
  const visibleKillers = movie.killers.filter(name => movie.cast.includes(name) && isAlive(name));
  const innocents = movie.cast.filter(name => isAlive(name) && !movie.killers.includes(name));
  const observations = [
    "είδε μια σκιά να βγαίνει από το δωμάτιο πριν ξανανοίξουν τα φώτα",
    "μέτρησε δύο διαφορετικές ώρες στο ίδιο άλλοθι",
    "βρήκε φρέσκο νερό σε διάδρομο που δεν είχε πρόσβαση",
    "άκουσε κάποιον να χρησιμοποιεί έναν κωδικό που υποτίθεται πως γνώριζε μόνο ένας άνθρωπος",
    "παρατήρησε ότι ένα ίχνος μετακινήθηκε πριν φτάσει η ομάδα",
    "είδε την κάμερα να κόβεται ακριβώς όταν άλλαξε η φωνή στο radio"
  ];
  const endings = [
    "Δεν είναι απόδειξη, αλλά δεν μπορώ να το αγνοήσω.",
    "Δεν μπορώ να το αποδείξω· εγώ όμως έτσι το διάβασα.",
    "Αν κάνω λάθος, ο πραγματικός killer θα το εκμεταλλευτεί.",
    "Δεν βασίζομαι σε όσα είπε ο/η παίκτης· αυτό το είδα μόνος/η μου.",
    "Το συμπέρασμα είναι δικό μου, όχι της ομάδας."
  ];
  const claimedTargets = [];
  const statements = speakers.map((speaker, index) => {
    const localRandom = mulberry32((current.seed + movie.number * 97 + speaker.length * 613 + index * 1777) >>> 0);
    const shouldTellTruth = Boolean(visibleKillers.length) && index === 0 && localRandom() < .42;
    const truthfulTarget = pick(visibleKillers.filter(name => name !== speaker), localRandom);
    const arcSuspect = movie.relationshipArc?.mode === "innocent-suspect" && movie.relationshipArc.subject !== speaker && isAlive(movie.relationshipArc.subject)
      ? movie.relationshipArc.subject : null;
    const bluffTarget = arcSuspect && localRandom() < .56 ? arcSuspect : pick(innocents.filter(name => name !== speaker), localRandom);
    let target = (shouldTellTruth ? truthfulTarget : bluffTarget) || truthfulTarget || bluffTarget || "LEGACY GHOST";
    const alternatives = shuffle(innocents.filter(name => name !== speaker && !claimedTargets.includes(name)), localRandom);
    if (claimedTargets.includes(target) && alternatives[0]) target = alternatives[0];
    claimedTargets.push(target);
    const truthful = Boolean(target && target !== "LEGACY GHOST" && movie.killers.includes(target) && shouldTellTruth);
    const targetLine = target === "LEGACY GHOST" ? "ένα παλιό πρόσωπο από το case file" : accusativeName(target);
    return {
      speaker,
      target,
      truthful,
      text: `«Στο radio άκουσα κάτι που ίσως έδειχνε ${targetLine}, αλλά η φωνή κόπηκε και μπορεί να ήταν μίμηση. ${observations[(index + speaker.length) % observations.length]}. ${endings[(index * 2 + speaker.length) % endings.length]}»`
    };
  });
  movie.accusationDebates[kind] = statements;
  return statements;
}

function theoryForPlayer(kind, name = activePlayerName()) {
  const movie = current.movie;
  if (!isMultiplayerMode()) return movie.pendingTheory;
  movie.localTheories ||= { midpoint: {}, final: {} };
  return movie.localTheories[kind][name] ||= [];
}

function betForPlayer(name = activePlayerName()) {
  const movie = current.movie;
  if (!isMultiplayerMode()) return movie.pendingBet || 0;
  movie.localBets ||= {};
  return movie.localBets[name] || 0;
}

function renderFinalTheoryGateway() {
  const movie = current.movie;
  if (movie.finalDeepInvestigationResolved) return renderAccusation("final");
  movie.finalInvestigationScenario ||= buildFinalInvestigationScenario(movie);
  const scenario = movie.finalInvestigationScenario;
  const room = roomFor(3);
  const content = movieScreen("BEFORE THE FINAL THEORY", 76);
  content.append(scenePanel({
    name: activePlayerName(), time: "02:56 AM", image: activePlayerName(), room, tone: "cold",
    eyebrow: `ONE LAST CHANCE · SCENARIO ${String(scenario.id).padStart(3, "0")}`,
    title: scenario.title,
    body: `${scenario.body} Πριν κλειδώσεις την τελική μαντεψιά, το «${room.name}» ανοίγει για λίγα δευτερόλεπτα. Το στοιχείο μπορεί να είναι αληθινό — ή να έχει τοποθετηθεί από τον ίδιο τον killer για να σε παρασύρει.`,
    choices: [
      { label: "Ερεύνησε περισσότερο πριν από το τελικό συμπέρασμα.", action: () => resolveFinalInvestigation("investigate") },
      { label: "Μην ρισκάρεις. Πήγαινε κατευθείαν στην τελική μαντεψιά.", action: () => resolveFinalInvestigation("theory") }
    ]
  }));
}

function resolveFinalInvestigation(choice) {
  const movie = current.movie;
  const submitted = localDecision(`final-investigation-${movie.number}`, choice, values => values.includes("investigate") ? "investigate" : "theory");
  if (submitted === LOCAL_PENDING) return;
  movie.finalDeepInvestigationResolved = true;
  if (submitted !== "investigate") {
    movie.finalDeepInvestigationResult = "SKIPPED";
    remember("Δεν μπήκατε στην τελευταία διαδρομή.", "Η τελική θεωρία θα βασιστεί μόνο στα στοιχεία που είχαν ήδη βρεθεί.");
    saveCurrent();
    return renderAccusation("final");
  }
  const random = mulberry32((current.seed + movie.number * 19081 + movie.choices.length * 977) >>> 0);
  const truthChance = Math.max(.20, Math.min(.82, .58 + (movie.puzzleAdvantage ? .15 : 0) + (playerHasWeapon() ? .06 : 0) - (movie.hiddenKillerTruthPenalty || 0)));
  const truthful = random() < truthChance;
  const realTarget = movie.mainKiller || movie.killers[0];
  const falseTarget = pick(movie.cast.filter(name => !movie.killers.includes(name) && isAlive(name)), random);
  const namedTarget = truthful ? realTarget : falseTarget;
  const clue = truthful
    ? { type: "FINAL FORENSIC CLUE", title: `${namedTarget}: το μη μονταρισμένο frame`, text: `Το τελευταίο frame συνδέει πραγματικά ${accusativeName(namedTarget)} με τη διαδρομή της μάσκας. Παραμένει clue, όχι αυτόματη αποκάλυψη.` }
    : { type: "KILLER-PLANTED TRAP", title: `${namedTarget}: το υπερβολικά τέλειο ίχνος`, text: `Το εύρημα δείχνει ${accusativeName(namedTarget)}, αλλά η χρονική σήμανση έχει αλλοιωθεί. Ο πραγματικός killer ήθελε να βρεις ακριβώς αυτό.` };
  movie.cluesFound.push(clue);
  movie.finalDeepInvestigationResult = truthful ? "TRUTH" : "TRAP";
  if (!truthful && namedTarget) relationshipState(namedTarget).suspicion += 22;
  remember(`Τελική έρευνα: ${clue.title}.`, truthful ? `Truth probability ${Math.round(truthChance * 100)}% — το clue ήταν αληθινό.` : `Trap probability ${Math.round((1 - truthChance) * 100)}% — ο killer φύτεψε το clue.`);
  queueBeat({
    kind: "twist",
    eyebrow: "FINAL INVESTIGATION · UNVERIFIED TRACE",
    title: `${movie.finalInvestigationScenario?.title || "Το τελευταίο frame"} — αλήθεια ή τέλεια παγίδα;`,
    body: `Το εύρημα δείχνει ${namedTarget ? accusativeName(namedTarget) : "μια άγνωστη φιγούρα"}, όμως ο forensic έλεγχος δεν μπορεί να ξεχωρίσει αυθεντικό frame από killer-planted fabrication. Η πραγματική πιθανότητα παραμένει κρυφή μέχρι το reveal· τώρα πρέπει να αποφασίσεις αν θα το πιστέψεις.`,
    names: namedTarget ? [namedTarget] : [], statuses: namedTarget ? ["UNVERIFIED · TRUTH OR FRAME-UP"] : [], roomOffset: 3,
    cta: "Πήγαινε στην τελική μαντεψιά"
  }, 9);
}

function renderAccusation(kind) {
  const movie = current.movie;
  const isFinal = kind === "final";
  const localPlayer = activePlayerName();
  const pendingTheory = theoryForPlayer(kind, localPlayer);
  const content = movieScreen(isFinal ? "FINAL THEORY" : "MIDPOINT THEORY", isFinal ? 78 : 58);
  const wrap = el("div", "content");
  wrap.append(el("p", "eyebrow", isFinal ? "ACT III IS WAITING" : "WHO DO YOU SUSPECT?"), el("h1", "headline", isFinal ? "Κλείδωσε την τελική σου θεωρία." : "Ποιος βρίσκεται πίσω από τους φόνους;"));
  if (isMultiplayerMode()) wrap.append(el("p", "decision-warning", `TURN · ${localPlayer} · Κλείδωσε τη δική σου θεωρία. Η σειρά περνά στον επόμενο παίκτη και το reveal παραμένει κοινό.`));
  wrap.append(el("p", "section-copy", "Διάλεξε από 1 έως 4 άτομα. Το παιχνίδι θα θυμάται αυτή τη θεωρία μέχρι τα credits."));
  const debate = el("section", "panel accusation-debate");
  debate.append(el("p", "eyebrow", "THE GROUP TURNS ON ITSELF"), el("h2", "headline", "Πριν μιλήσεις, άκου τους άλλους."), el("p", "section-copy", "Ο καθένας μιλά από τη δική του οπτική και κανείς δεν σου λέει αν το συμπέρασμά του είναι σωστό. Άκου τις παρατηρήσεις, τις σιωπές και τις αντιφάσεις — ακόμη και ένας killer μπορεί να δείξει τον σωστό άνθρωπο για να κερδίσει χρόνο."));
  const debateLines = el("div", "accusation-debate-lines");
  createAccusationDebate(kind).forEach(statement => {
    const line = el("article", "accusation-debate-line");
    const avatar = el("img"); avatar.src = imagePath(statement.speaker); avatar.alt = "";
    const copy = el("div");
    copy.append(el("strong", "", statement.speaker), el("small", "", statement.text));
    line.append(avatar, copy); debateLines.append(line);
  });
  debate.append(debateLines);
  wrap.append(debate);
  const grid = el("div", "suspect-grid");
  const hiddenKillerVote = current.localHiddenKillerEnabled && movie.number === 3;
  movie.cast.filter(name => (!isPlayerCharacter(name) || hiddenKillerVote)
    && (name !== localPlayer || hiddenKillerVote) && movie.status[name] !== "DEAD").forEach(name => {
    const selected = pendingTheory.includes(name);
    const suspect = characterButton(name, () => toggleSuspect(name, kind), selected, "suspect-card");
    suspect.dataset.suspectName = name;
    suspect.setAttribute("aria-pressed", String(selected));
    grid.append(suspect);
  });
  if (isFinal && movie.number === 3) {
    const ghostSelected = pendingTheory.includes("LEGACY GHOST");
    const ghost = el("button", `character-card suspect-card ghost-suspect ${ghostSelected ? "selected" : ""}`.trim());
    ghost.type = "button";
    ghost.dataset.storyChoice = "true";
    ghost.dataset.suspectName = "LEGACY GHOST";
    ghost.setAttribute("aria-pressed", String(ghostSelected));
    ghost.append(el("span", "ghost-mark", "?"), el("strong", "", "LEGACY GHOST"), el("small", "", "Ο killer ίσως δεν βρίσκεται στο cast."));
    ghost.addEventListener("click", () => toggleSuspect("LEGACY GHOST", kind));
    grid.append(ghost);
  }
  wrap.append(grid);
  if (isFinal) {
    const bet = el("section", "panel bet-slip");
    const availableCredits = isMultiplayerMode() ? (current.playerCredits[localPlayer] || 0) : current.credits;
    bet.append(el("p", "eyebrow", "FICTIONAL BET · NO REAL MONEY"), el("h2", "", `Ποντάρει ${subjectName(localPlayer, true)}`), el("p", "", `Διαθέσιμα: ${availableCredits} Slasher Credits. Ακριβής θεωρία πληρώνει 2×. Μερική επιτυχία επιστρέφει το αντίστοιχο ποσοστό.`));
    const controls = el("div", "bet-controls");
    const input = el("input", "bet-input");
    input.type = "number"; input.inputMode = "numeric"; input.min = "0"; input.max = String(availableCredits); input.step = "10"; input.value = String(Math.min(betForPlayer(localPlayer), availableCredits));
    input.setAttribute("aria-label", "Ποσό πονταρίσματος σε Slasher Credits");
    input.addEventListener("input", () => {
      const amount = Math.max(0, Math.min(availableCredits, Math.floor(Number(input.value) || 0)));
      if (isMultiplayerMode()) movie.localBets[localPlayer] = amount; else movie.pendingBet = amount;
    });
    controls.append(input);
    [100, 250].filter(amount => amount <= availableCredits).forEach(amount => {
      const chip = button(String(amount), "ghost bet-chip", () => { if (isMultiplayerMode()) movie.localBets[localPlayer] = amount; else movie.pendingBet = amount; input.value = String(amount); });
      controls.append(chip);
    });
    controls.append(button("MAX", "ghost bet-chip", () => { if (isMultiplayerMode()) movie.localBets[localPlayer] = availableCredits; else movie.pendingBet = availableCredits; input.value = String(availableCredits); }));
    bet.append(controls, el("small", "bet-disclaimer", "Τα Slasher Credits είναι αποκλειστικά μέρος του παιχνιδιού. Δεν υπάρχει κατάθεση, πληρωμή ή πραγματικό χρηματικό έπαθλο."));
    wrap.append(bet);
  }
  const footer = el("div", "selection-footer");
  footer.append(el("p", "theory-selection-copy", pendingTheory.length ? `Επιλογές ${localPlayer}: ${pendingTheory.join(", ")}` : `${localPlayer} δεν έχει επιλέξει ακόμη.`));
  const lock = button("Κλείδωσε θεωρία", "", () => lockTheory(kind), true);
  lock.classList.add("theory-lock-button");
  lock.disabled = pendingTheory.length < 1 || pendingTheory.length > 4;
  footer.append(lock);
  wrap.append(footer);
  content.append(wrap);
}

function toggleSuspect(name, kind) {
  const localPlayer = activePlayerName();
  const list = theoryForPlayer(kind, localPlayer);
  const index = list.indexOf(name);
  if (index >= 0) list.splice(index, 1);
  else if (list.length < 4) list.push(name);
  else return toast("Μπορείς να κατηγορήσεις μέχρι 4 άτομα.");
  document.querySelectorAll("[data-suspect-name]").forEach(card => {
    const selected = list.includes(card.dataset.suspectName);
    card.classList.toggle("selected", selected);
    card.setAttribute("aria-pressed", String(selected));
  });
  const selectionCopy = document.querySelector(".theory-selection-copy");
  if (selectionCopy) selectionCopy.textContent = list.length ? `Επιλογές ${localPlayer}: ${list.join(", ")}` : `${localPlayer} δεν έχει επιλέξει ακόμη.`;
  const lock = document.querySelector(".theory-lock-button");
  if (lock) lock.disabled = list.length < 1 || list.length > 4;
  saveCurrent();
}

function lockTheory(kind) {
  const movie = current.movie;
  const player = activePlayerName();
  const theory = [...theoryForPlayer(kind, player)];
  movie.accusationConsequencesLogged ||= {};
  theory.filter(name => name !== "LEGACY GHOST" && !movie.killers.includes(name)).forEach(name => {
    const key = `${kind}:${player}:${name}`;
    if (movie.accusationConsequencesLogged[key]) return;
    movie.accusationConsequencesLogged[key] = true;
    const state = relationshipState(name, player);
    state.trust -= kind === "final" ? 28 : 14;
    state.friendship -= kind === "final" ? 12 : 6;
    state.suspicion += 20;
  });
  if (isOnlineEngine()) {
    const available = current.playerCredits[player] || 0;
    const wager = kind === "final" ? Math.max(0, Math.min(available, Math.floor(movie.localBets[player] || 0))) : 0;
    const submitted = localDecision(`theory-${kind}-${movie.number}`, { theory, wager }, values => values);
    if (submitted === LOCAL_PENDING) return;
    const locked = movie.lastLocalResolution?.choices || {};
    movie.localTheories ||= { midpoint: {}, final: {} };
    Object.entries(locked).forEach(([characterName, choice]) => {
      movie.localTheories[kind][characterName] = [...(choice?.theory || [])];
      if (kind === "final") {
        const safeWager = Math.max(0, Math.min(current.playerCredits[characterName] || 0, Math.floor(choice?.wager || 0)));
        movie.localBets[characterName] = safeWager;
        current.playerCredits[characterName] = (current.playerCredits[characterName] || 0) - safeWager;
      }
    });
    const combinedTheory = unique(Object.values(movie.localTheories[kind]).flat());
    current.credits = Object.values(current.playerCredits).reduce((sum, amount) => sum + amount, 0);
    if (kind === "midpoint") {
      movie.midpointTheory = combinedTheory;
      movie.localMidpointTheories = Object.fromEntries(Object.entries(movie.localTheories.midpoint).map(([name, picks]) => [name, [...picks]]));
      if (!movie.firstSuspicion.length) movie.firstSuspicion = [...combinedTheory];
      remember(`Online midpoint theories: ${Object.entries(movie.localTheories.midpoint).map(([name, picks]) => `${name} → ${picks.join(" + ")}`).join(" · ")}.`, "Every online player locked an independent suspicion in the shared Local flow.");
      queueBeat({
        kind: "theory", eyebrow: "ALL ONLINE THEORIES LOCKED", title: combinedTheory.join(" + "),
        body: `Οι παίκτες κλείδωσαν ανεξάρτητες θεωρίες: ${Object.entries(movie.localTheories.midpoint).map(([name, picks]) => `${name}: ${picks.join(", ")}`).join(" · ")}.`,
        names: combinedTheory, statuses: combinedTheory.map(() => "SUSPECT"), roomOffset: 1
      }, 7);
      return;
    }
    movie.finalTheory = combinedTheory;
    movie.finalTheories = Object.fromEntries(Object.entries(movie.localTheories.final).map(([name, picks]) => [name, [...picks]]));
    movie.betAmount = Object.values(movie.localBets).reduce((sum, amount) => sum + amount, 0);
    movie.betSettled = false;
    remember(`Online final theories: ${Object.entries(movie.localTheories.final).map(([name, picks]) => `${name} → ${picks.join(" + ")}`).join(" · ")}.`, "Every online theory and bet resolves exactly like Local multiplayer.");
    queueBeat({
      kind: "theory", eyebrow: "ALL FINAL THEORIES LOCKED", title: combinedTheory.join(" + "),
      body: `Οι μάσκες πέφτουν. ${Object.entries(movie.localBets).map(([name, amount]) => `${name} πόνταρε ${amount || 0} credits`).join(" · ")}. Οι θεωρίες κρίνονται ξεχωριστά στο κοινό reveal.`,
      names: combinedTheory, statuses: combinedTheory.map(() => "ACCUSED"), roomOffset: 2, cta: "Reveal"
    }, 10);
    return;
  }
  if (isLocalMode()) {
    if (kind === "final") {
      const available = current.playerCredits[player] || 0;
      const wager = Math.max(0, Math.min(available, Math.floor(movie.localBets[player] || 0)));
      movie.localBets[player] = wager;
      current.playerCredits[player] = available - wager;
      current.credits = Object.values(current.playerCredits).reduce((sum, amount) => sum + amount, 0);
    }
    const allLocked = playerCharacters().every(name => movie.localTheories?.[kind]?.[name]?.length);
    if (!allLocked) {
      current.activePlayerIndex = (current.activePlayerIndex + 1) % playerCharacters().length;
      saveCurrent();
      toast(`${player} κλείδωσε τη θεωρία. Τώρα παίζει ${subjectName(activePlayerName(), true)}.`);
      renderAccusation(kind);
      return;
    }
    movie.pendingTheory = [];
    const theories = playerCharacters().map(name => movie.localTheories[kind][name] || []);
    const combinedTheory = unique(theories.flat());
    if (kind === "midpoint") {
      movie.midpointTheory = combinedTheory;
      movie.localMidpointTheories = Object.fromEntries(playerCharacters().map(name => [name, [...movie.localTheories.midpoint[name]]]));
      if (!movie.firstSuspicion.length) movie.firstSuspicion = [...combinedTheory];
      remember(`Local midpoint theories: ${playerCharacters().map(name => `${name} → ${movie.localTheories.midpoint[name].join(" + ")}`).join(" · ")}.`, "Both players locked independent suspicions.");
      current.activePlayerIndex = 0;
      queueBeat({
        kind: "theory", eyebrow: "BOTH THEORIES LOCKED", title: combinedTheory.join(" + "),
        body: `Οι local players κλείδωσαν ανεξάρτητες θεωρίες: ${playerCharacters().map(name => `${name}: ${movie.localTheories.midpoint[name].join(", ")}`).join(" · ")}.`,
        names: combinedTheory, statuses: combinedTheory.map(() => "SUSPECT"), roomOffset: 1
      }, 7);
      return;
    }
    movie.finalTheory = combinedTheory;
    movie.finalTheories = Object.fromEntries(playerCharacters().map(name => [name, [...movie.localTheories.final[name]]]));
    movie.betAmount = Object.values(movie.localBets).reduce((sum, amount) => sum + amount, 0);
    movie.betSettled = false;
    remember(`Local final theories: ${playerCharacters().map(name => `${name} → ${movie.localTheories.final[name].join(" + ")}`).join(" · ")}.`, "Both players locked independent final accusations.");
    current.activePlayerIndex = 0;
    queueBeat({
      kind: "theory", eyebrow: "BOTH FINAL THEORIES LOCKED", title: combinedTheory.join(" + "),
      body: `Οι μάσκες πέφτουν. ${playerCharacters().map(name => `${name} πόνταρε ${movie.localBets[name] || 0} credits`).join(" · ")}. Οι δύο θεωρίες θα κριθούν ξεχωριστά στο reveal.`,
      names: combinedTheory, statuses: combinedTheory.map(() => "ACCUSED"), roomOffset: 2, cta: "Reveal"
    }, 10);
    return;
  }
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
  const aliveFriends = friendsForPlayer().filter(isAlive);
  const focus = aliveFriends[0] || movie.cast.find(name => !isPlayerCharacter(name) && isAlive(name));
  const relation = protagonistRelationship(focus);
  const content = movieScreen("THE CONFESSION", 66);
  content.append(scenePanel({
    name: focus, time: "02:03 AM", image: focus, tone: "cold", eyebrow: "KNOWLEDGE IS DANGEROUS", title: "Κάποιος ζητάει την αλήθεια.",
    body: `${relation ? `${subjectName(focus)} έχει σχέση «${relation.toLowerCase()}» μαζί σου και η κοινή σας ιστορία βαραίνει την απόφαση. ` : ""}Σου ζητάει να δει το στοιχείο. Αν το μοιραστείς, ίσως αποκτήσεις σύμμαχο — ή δώσεις στον killer ακριβώς ό,τι χρειάζεται.`,
    choices: [
      { label: `Δείξε το στοιχείο ${toName(focus)}.`, action: () => trustChoice(focus, true) },
      { label: "Κράτησέ το μυστικό μέχρι να είσαι βέβαιος/η.", action: () => trustChoice(focus, false) }
    ]
  }));
}

function trustChoice(name, shared) {
  const movie = current.movie;
  const trustVote = localDecision(`trust-${movie.number}`, { name, shared }, values => values.at(-1));
  if (trustVote === LOCAL_PENDING) return;
  const localTrustVotes = isMultiplayerMode() ? movie.lastLocalResolution?.choices : null;
  const entries = localTrustVotes ? Object.entries(localTrustVotes) : [[activePlayerName(), trustVote]];
  const sharedNames = [];
  const hiddenNames = [];
  const sabotageNames = [];
  entries.forEach(([player, vote]) => {
    const state = relationshipState(vote.name, player);
    if (vote.shared) {
      state.trust += 22;
      state.knowledge += 26;
      state.loyalty += 12;
      sharedNames.push(vote.name);
      if (isKiller(vote.name)) sabotageNames.push(vote.name);
      remember(`${player} μοιράστηκε το στοιχείο με ${accusativeName(vote.name)}.`, `${vote.name} knows what that player found.`);
    } else {
      state.suspicion += 14;
      hiddenNames.push(vote.name);
      sabotageNames.push(vote.name);
      remember(`${player} έκρυψε το στοιχείο από ${accusativeName(vote.name)}.`, `${vote.name} became more suspicious of that player.`);
    }
  });
  const beatKind = sabotageNames.length ? "sabotage" : "dialogue";
  const names = unique(entries.map(([, vote]) => vote.name));
  const hasShared = sharedNames.length > 0;
  const beatBody = [
    sharedNames.length ? `Μοιράστηκαν clue: ${unique(sharedNames).join(" και ")}. Η διαδρομή μέσα από το «${roomFor(1).name}» ανοίγει, αλλά κάθε NPC κρατά τη δική του αντίδραση.` : "",
    hiddenNames.length ? `Κρύφτηκε clue από: ${unique(hiddenNames).join(" και ")}. Η έξοδος μπλοκάρει και η καχυποψία ανεβαίνει.` : "",
    sabotageNames.some(name => isKiller(name)) ? "Κάποιος στη συζήτηση ήξερε ακριβώς τι να σαμποτάρει." : ""
  ].filter(Boolean).join(" ");
  queueBeat({
    kind: beatKind, eyebrow: hasShared ? "A SECRET CHANGES HANDS" : "TRUST FRACTURES",
    title: localTrustVotes ? "Οι παίκτες μοιράστηκαν διαφορετικές εκδοχές του clue." : shared ? `${trustVote.name} ξέρει όσα ξέρεις.` : `${trustVote.name} καταλαβαίνει ότι κρύβεις κάτι.`,
    body: beatBody, names, statuses: entries.map(([, vote]) => vote.shared ? "KNOWLEDGE +26" : "SUSPICION +14"), roomOffset: 1
  }, 8);
}

function renderSecondAttack() {
  const movie = current.movie;
  const target = movie.secondTarget;
  const backup = isAlive(movie.secondBackupTarget)
    ? movie.secondBackupTarget
    : movie.cast.find(name => name !== target && !isPlayerCharacter(name) && !isKiller(name) && isAlive(name) && movie.status[name] !== "SAVED");
  movie.secondBackupTarget = backup || null;
  const attackRoom = roomFor(1);
  movie.secondAttackScenario ||= buildSecondAttackScenario(movie, target, attackRoom);
  const attack = movie.secondAttackScenario;
  const content = movieScreen("NO ONE IS SAFE", 72);
  content.append(scenePanel({
    name: backup ? `${target} / ${backup}` : target, time: "02:41 AM", image: target, room: attackRoom, tone: "red", eyebrow: `A NEW ATTACK ROUTE · SCENARIO ${String(attack.id).padStart(3, "0")}`, title: attack.title,
    body: `${attack.body}${backup ? ` Ταυτόχρονα ${subjectName(backup, true)} καλεί από δεύτερο διάδρομο.` : ""} Το μοναδικό αληθινό clue είναι ακόμα στην τσέπη σου. Κάθε διαδρομή έχει ανεξάρτητο probability roll.`,
    choices: [
      ...(backup ? [{ label: `Ρίσκαρε τα πάντα για να σώσεις και ${accusativeName(target)} και ${accusativeName(backup)}.`, action: () => secondAttackChoice("both") }] : []),
      { label: `Σώσε μόνο ${accusativeName(target)}. Μην μοιράσεις τον χρόνο σου.`, action: () => secondAttackChoice("primary") },
      ...(backup ? [{ label: `Σώσε μόνο ${accusativeName(backup)}. Άφησε την πρώτη διαδρομή.`, action: () => secondAttackChoice("backup") }] : []),
      { label: "Μην πάει κανείς. Προστάτεψε το στοιχείο και περίμενε.", action: () => secondAttackChoice("none") }
    ], cameos: backup ? [backup] : []
  }));
}

function secondAttackChoice(rescueMode) {
  const movie = current.movie;
  const normalizedMode = rescueMode === true ? "primary" : rescueMode === false ? "none" : rescueMode;
  const submitted = localDecision(`second-attack-${movie.number}`, normalizedMode);
  if (submitted === LOCAL_PENDING) return;
  const targets = unique([movie.secondTarget, movie.secondBackupTarget]).filter(name => name && isAlive(name) && !isKiller(name));
  const weaponBonus = playerHasWeapon() ? .12 : 0;
  const puzzleBonus = movie.puzzleAdvantage ? .12 : 0;
  const localVotes = isMultiplayerMode() ? movie.lastLocalResolution?.choices : null;
  const votes = localVotes ? Object.entries(localVotes) : [[activePlayerName(), submitted]];
  const playerOutcomes = [];
  targets.forEach((target, targetIndex) => {
    votes.forEach(([player, rawMode], playerIndex) => {
      const mode = rawMode === true ? "primary" : rawMode === false ? "none" : rawMode;
      const isPrimary = targetIndex === 0;
      const baseChance = mode === "both" ? .46
        : mode === "primary" ? (isPrimary ? .70 : .12)
          : mode === "backup" ? (isPrimary ? .12 : .70)
            : (isPrimary ? .08 : .10);
      const itemBonus = itemHeldBy(target) ? .30 : movie.itemKept ? .12 : 0;
      const relationBonus = Math.min(.15, Math.max(0, relationshipState(target, player).loyalty + relationshipState(target, player).trust) / 700);
      const random = mulberry32((current.seed + movie.number * 6823 + target.length * 211 + playerIndex * 991 + targetIndex * 433 + { both: 19, primary: 41, backup: 57, none: 73 }[mode]) >>> 0);
      const survivalChance = Math.min(.96, baseChance + itemBonus + relationBonus + puzzleBonus + weaponBonus);
      const alreadySaved = movie.status[target] === "SAVED" || movie.saved.includes(target) || movie.itemSaved.includes(target);
      const survived = alreadySaved || (movie.number === 3 && movieThreeProtected(target)) ? true : survivalRoll(target, survivalChance, random);
      playerOutcomes.push({ player, target, mode, survived, chance: survivalChance, itemBonus });
    });
  });
  const savedTargets = [];
  const deadTargets = [];
  targets.forEach(target => {
    const targetOutcomes = playerOutcomes.filter(result => result.target === target);
    const survived = targetOutcomes.some(result => result.survived);
    if (survived) {
      setStatus(target, "SAVED");
      savedTargets.push(target);
      if (!movie.saved.includes(target)) { movie.saved.push(target); movie.peopleSaved += 1; }
      movie.deathsPrevented += 1;
      targetOutcomes.forEach(result => { if (result.mode !== "none" && result.survived) relationshipState(target, result.player).trust += 26; });
      if (targetOutcomes.some(result => result.itemBonus) && !movie.itemSaved.includes(target)) movie.itemSaved.push(target);
    } else if (setStatus(target, "DEAD")) deadTargets.push(target);
  });
  let collateralDeath = null;
  if (targets.length === 2 && savedTargets.length === 2) {
    const collateralRandom = mulberry32((current.seed + movie.number * 17431 + movie.choices.length * 601 + targets.join("").length) >>> 0);
    if (collateralRandom() < .20) {
      const collateralPool = rankMovieThreeDeaths(movie.cast.filter(name => !isPlayerCharacter(name) && !isKiller(name) && isAlive(name) && !targets.includes(name) && movie.status[name] !== "SAVED" && !movie.saved.includes(name) && !itemHeldBy(name)), collateralRandom);
      collateralDeath = collateralPool[0] || null;
      if (collateralDeath && setStatus(collateralDeath, "DEAD")) deadTargets.push(collateralDeath);
      else collateralDeath = null;
    }
  }
  if (savedTargets.length && movie.itemKept) movie.itemUsed = true;
  remember(`Second attack: ${playerOutcomes.map(result => `${result.player} → ${result.mode} / ${result.target}: ${result.survived ? "survived" : "failed"} (${Math.round(result.chance * 100)}%)`).join(" · ")}.`, `${savedTargets.join(" & ") || "Κανείς"} saved · ${deadTargets.join(" & ") || "κανείς"} died.`);
  const deathAnnouncement = deadTargets.length
    ? `ΑΝΑΚΟΙΝΩΣΗ ΘΑΝΑΤΟΥ · ${deadTargets.map(name => `${subjectName(name)} είναι οριστικά DEAD`).join(" · ")}. `
    : "ΑΠΟΤΕΛΕΣΜΑ · Δεν πέθανε κανείς σε αυτή τη διπλή επίθεση. ";
  queueBeat({
    kind: deadTargets.length ? "death" : "rescue",
    eyebrow: collateralDeath ? "THE IMPOSSIBLE DOUBLE RESCUE · SOMEONE ELSE PAID" : savedTargets.length === targets.length ? "THE IMPOSSIBLE DOUBLE RESCUE" : savedTargets.length ? "ONE ROUTE OPENED · ONE MAY HAVE CLOSED" : "THE ROUTES CLOSED",
    title: collateralDeath ? `Σώθηκαν και οι δύο — όμως χάθηκε ${subjectName(collateralDeath, true)}.` : savedTargets.length ? `Σώθηκαν: ${savedTargets.join(" και ")}.` : "Κανείς δεν βγήκε από τους διαδρόμους.",
    body: `${deathAnnouncement}${savedTargets.length ? `Επιβεβαιωμένα SAVED: ${savedTargets.join(", ")}. ` : ""}${deadTargets.length ? `Επιβεβαιωμένα DEAD: ${deadTargets.join(", ")}. ` : ""}${collateralDeath ? "Η διπλή διάσωση ενεργοποίησε το 20% collateral twist: οι killers χτύπησαν διαφορετικό, χαμηλής αλληλεπίδρασης χαρακτήρα και ο θάνατος ανακοινώνεται στο ίδιο cut. " : ""}Οι επιλογές BOTH / PRIMARY ONLY / BACKUP ONLY / NONE είχαν διαφορετικά τυχαία ποσοστά και τα items, weapons, puzzles και relationships μετακίνησαν τις πιθανότητες.`,
    names: unique([...targets, ...deadTargets]), statuses: unique([...targets, ...deadTargets]).map(name => deadTargets.includes(name) ? "DEAD" : "SAVED"), roomOffset: 1
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
  if (isMultiplayerMode()) {
    movie.localBetResults = {};
    let totalPayout = 0;
    playerCharacters().forEach(player => {
      const theory = movie.finalTheories?.[player] || movie.localTheories?.final?.[player] || [];
      const wager = movie.localBets?.[player] || 0;
      const hits = identifiedKillers(movie, theory).length;
      const falsePicks = falsePredictions(movie, theory).length;
      const exact = hits === movie.killers.length && falsePicks === 0;
      const ratio = movie.killers.length ? hits / movie.killers.length : 0;
      const payout = exact ? wager * 2 : Math.round(wager * ratio);
      current.playerCredits[player] = (current.playerCredits[player] || 0) + payout;
      totalPayout += payout;
      movie.localBetResults[player] = { wager, payout, result: exact ? "EXACT WIN" : hits ? `PARTIAL ${hits}/${movie.killers.length}` : "LOST" };
    });
    movie.betPayout = totalPayout;
    current.credits = Object.values(current.playerCredits).reduce((sum, amount) => sum + amount, 0);
    movie.betResult = playerCharacters().map(player => `${player}: ${movie.localBetResults[player].result}`).join(" · ");
    saveCurrent();
    return;
  }
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
  stopMusic();
  playKillerMemorialScore();
  playSfx("impact");
  navigator.vibrate?.([120, 60, 180]);
  const discovered = identifiedKillers(movie).length;
  settleBet(movie);
  const root = screen();
  const content = el("div", "content reveal-stage");
  content.append(el("p", "eyebrow", `ACT III · ${discovered}/${movie.killers.length} IDENTIFIED`));
  const line = discovered === movie.killers.length ? "Not even slightly." : discovered ? "Ήξερα για έναν από εσάς." : "Δεν μπορεί…";
  content.append(el("h1", "display", line));
  const row = el("div", `killer-row${movie.killers.length === 1 ? " single-killer" : ""}`);
  movie.killers.forEach((name, index) => {
    const card = el("article", "killer-card");
    const img = el("img"); img.src = imagePath(name); img.alt = name; img.dataset.character = name;
    const copy = el("div");
    copy.append(el("small", "", index === 0 ? "THE MASTERMIND" : "ACCOMPLICE"), el("h2", "", name));
    card.append(img, copy); row.append(card);
  });
  content.append(row, el("p", "lead", `«${movie.motiveLine}» — Motive: ${movie.motive}`));
  if (movie.returningKiller) content.append(el("p", "remember", `Η μοναδική legacy ανατροπή: ${subjectName(movie.returningKiller)}, ${genderWord(movie.returningKiller, "καταγεγραμμένος", "καταγεγραμμένη")} ως KILLER · PRESUMED DEAD, επέζησε κρυφά. Δεν υπήρξε στο intro, στο cast, σε διάλογο ή σε καμία προηγούμενη επιλογή του Movie III.`));
  if (movie.relationshipArc) {
    const arc = movie.relationshipArc;
    const arcCopy = arc.mode === "revenge-killer" && movie.killers.includes(arc.subject)
      ? `${subjectName(arc.subject)} αποκαλύπτει ότι ο δεσμός «${arc.relation || "ισχυρή προσωπική σχέση"}» με ${accusativeName(arc.linkedKiller)} έγινε κίνητρο εκδίκησης. Η σχέση άνοιξε την πιθανότητα· δεν την έκανε βεβαιότητα.`
      : arc.mode === "truth-seeker"
        ? `${subjectName(arc.subject)} ήταν αθώος/α και επέστρεψε για να μάθει τι συνέβη ${toName(arc.linkedKiller)}, όχι για να συνεχίσει τους φόνους.`
        : `${subjectName(arc.subject)} κατηγορήθηκε εξαιτίας του δεσμού με ${accusativeName(arc.linkedKiller)}, αλλά η συγγένεια/σχέση δεν ήταν απόδειξη ενοχής.`;
    content.append(el("p", "remember", `RELATIONSHIP ARC · ${arcCopy}`));
  }
  const weakness = teamWeaknessProfile();
  const killerTaunt = weakness.pressure > .62
    ? "«Δεν χρειάστηκε καν να σας χωρίσουμε. Οι κατηγορίες και η δυσπιστία σας το έκαναν για εμάς.»"
    : weakness.clueDeficit
      ? "«Σας αφήσαμε ψεύτικα ίχνη και κοιτάξατε ακριβώς εκεί που θέλαμε.»"
      : "«Συνεργαστήκατε καλύτερα απ’ όσο περιμέναμε· γι’ αυτό έπρεπε να αλλάζουμε διαδρομή κάθε φορά.»";
  content.append(el("p", "remember", `KILLER ADAPTATION · ${killerTaunt}`));
  const revealReactions = unique(movie.killers.flatMap(killer => linkedNames(killer)
    .filter(name => movie.cast.includes(name) && isAlive(name) && !movie.killers.includes(name))
    .map(name => ({ name, killer, relation: relationshipBetween(name, killer) }))));
  if (revealReactions.length) {
    const reactions = el("section", "panel accusation-debate");
    reactions.append(el("p", "eyebrow", "CANON BONDS · REVEAL REACTIONS"), el("h2", "headline", "Οι σχέσεις σπάνε μπροστά στη μάσκα."));
    revealReactions.forEach(({ name, killer, relation }) => {
      const line = el("article", "accusation-debate-line");
      const avatar = el("img"); avatar.src = imagePath(name); avatar.alt = "";
      const copy = el("div");
      copy.append(el("strong", "", `${name} · ${relation || "ΙΣΧΥΡΟΣ ΔΕΣΜΟΣ"}`), el("small", "", `«${subjectName(killer)} ήταν δικός μου άνθρωπος. Δεν ξέρω αν πρέπει να θρηνήσω αυτόν που ήξερα ή να σταματήσω αυτόν που έγινε.»`));
      line.append(avatar, copy); reactions.append(line);
    });
    content.append(reactions);
  }
  if (isMultiplayerMode() && movie.localBetResults) {
    const localResults = el("article", "panel reveal-bet partial");
    localResults.append(el("small", "", isOnlineEngine() ? "ONLINE PARTY BET RESULTS" : `LOCAL ${playerCharacters().length}P BET RESULTS`));
    playerCharacters().forEach(player => {
      const result = movie.localBetResults[player];
      localResults.append(el("p", "", `${player}: ${result.result} · ποντάρισμα ${result.wager} · επιστροφή ${result.payout}`));
    });
    content.append(localResults);
  } else if (movie.betAmount) {
    const betResult = el("article", `panel reveal-bet ${movie.betResult === "EXACT WIN" ? "win" : movie.betResult === "LOST" ? "lost" : "partial"}`);
    betResult.append(
      el("small", "", "FICTIONAL BET RESULT"),
      el("h2", "", movie.betResult === "EXACT WIN" ? "Κέρδισες το στοίχημα." : movie.betResult === "LOST" ? "Το στοίχημα χάθηκε." : "Μερική επιτυχία."),
      el("p", "", `Πόνταρες ${movie.betAmount}. Επιστροφή: ${movie.betPayout} Slasher Credits. Νέο υπόλοιπο: ${current.credits}.`)
    );
    content.append(betResult);
  }
  const actions = el("div", "actions");
  actions.append(button("Μπες στο τελικό chase", "", resolveWrongAccusationConsequence));
  content.append(actions);
  root.append(content);
}

function resolveWrongAccusationConsequence() {
  const movie = current.movie;
  if (movie.wrongAccusationResolved) return advance(11);
  movie.wrongAccusationResolved = true;
  const wrong = unique([
    ...falsePredictions(movie),
    ...Object.values(movie.finalTheories || {}).flat().filter(name => name !== "LEGACY GHOST" && !movie.killers.includes(name))
  ]).filter(name => name !== "LEGACY GHOST" && isAlive(name) && !isPlayerCharacter(name));
  if (!wrong.length) {
    saveCurrent();
    return advance(11);
  }
  const random = mulberry32((current.seed + movie.number * 24151 + wrong.join("").length * 331) >>> 0);
  const target = pick(wrong, random);
  const stateValues = playerCharacters().map(player => relationshipState(target, player)?.trust || 0);
  const averageTrust = stateValues.reduce((sum, value) => sum + value, 0) / Math.max(1, stateValues.length);
  const weakness = teamWeaknessProfile();
  const protectedTarget = itemHeldBy(target) || movie.status[target] === "SAVED" || movie.saved.includes(target) || movie.itemSaved.includes(target);
  const deathChance = protectedTarget ? .04 : Math.max(.10, Math.min(.58, .24 + weakness.pressure * .24 - averageTrust / 300));
  const dies = random() < deathChance && setStatus(target, "DEAD");
  if (dies) {
    remember(`Η λανθασμένη κατηγορία άφησε ${accusativeName(target)} απομονωμένο/η μετά το reveal.`, `${target} was murdered by the real killers before the final decision.`);
    queueBeat({
      kind: "death", eyebrow: "WRONGLY ACCUSED · THE REAL KILLER STRIKES",
      title: `${subjectName(target)} πεθαίνει ακριβώς πριν από την τελική επιλογή.`,
      body: `«Τόση ώρα πιστεύατε ότι ήταν ${subjectName(target, true)}… κρίμα που δεν καταλάβατε ποιος ήταν πραγματικά ο κίνδυνος.» Οι πραγματικοί killers εκμεταλλεύονται την απομόνωση που δημιούργησε η λανθασμένη θεωρία. Ο θάνατος επιβεβαιώνεται τώρα, αλλά δεν ήταν υποχρεωτικός: η πιθανότητα επηρεάστηκε από trust, items και τη συνοχή της ομάδας.`,
      names: [target], statuses: ["INNOCENT · DEAD"], roomOffset: 2, cta: "Μπες στην τελική επιλογή"
    }, 11);
    return;
  }
  const forgives = averageTrust > 12 || random() < .34;
  playerCharacters().forEach(player => { relationshipState(target, player).trust += forgives ? 6 : -10; });
  remember(`${target} επέζησε μετά τη λανθασμένη κατηγορία και ${forgives ? "επέλεξε να βοηθήσει" : "αρνήθηκε να συγχωρήσει"}.`, "The accusation remains part of relationship continuity.");
  queueBeat({
    kind: "dialogue", eyebrow: "WRONGLY ACCUSED · CONSEQUENCE",
    title: forgives ? `${subjectName(target)} μένει — αλλά δεν ξεχνά.` : `${subjectName(target)} απομακρύνεται από την ομάδα.`,
    body: forgives
      ? `«Με δείξατε σαν killer και ήμουν αθώος/α. Θα βοηθήσω να τελειώσει αυτό, αλλά η εμπιστοσύνη δεν επιστρέφει σε μία νύχτα.»`
      : `«Δεν θα ξαναρισκάρω τη ζωή μου για ανθρώπους που με καταδίκασαν χωρίς απόδειξη.» Η άρνηση συνεργασίας και η χαμηλή εμπιστοσύνη συνεχίζονται στις επόμενες σκηνές και ταινίες.`,
    names: [target], statuses: [forgives ? "ALIVE · WOUNDED TRUST" : "ALIVE · REFUSES HELP"], roomOffset: 2, cta: "Μπες στην τελική επιλογή"
  }, 11);
}

function renderFinale() {
  const movie = current.movie;
  const discovered = identifiedKillers(movie).length;
  const closest = friendsForPlayer().filter(name => isAlive(name) && !isKiller(name))[0] || movie.cast.find(name => !isPlayerCharacter(name) && isAlive(name) && !isKiller(name));
  const content = movieScreen("THE FINAL CHASE", 92);
  content.append(scenePanel({
    name: closest || current.protagonist, time: "03:17 AM", image: closest || current.protagonist, tone: "red", eyebrow: "THE LAST DECISION", title: "Το φιλμ τελειώνει μόνο με αίμα.",
    body: closest ? `${subjectName(closest)} είναι ${genderWord(closest, "δεμένος", "δεμένη")} απέναντι από την έξοδο. Οι killers περιμένουν να διαλέξεις ανάμεσα στον άνθρωπο και στην παγίδα που έστησες.` : "Έμεινες χωρίς σύμμαχο. Το μόνο πλεονέκτημά σου είναι όσα κατάλαβες πριν από το reveal.",
    choices: [
      { label: closest ? `Σώσε πρώτα ${accusativeName(closest)}.` : "Όρμησε προς την έξοδο.", action: () => finaleChoice("friend", closest, discovered) },
      { label: "Ενεργοποίησε την παγίδα και αντιμετώπισε τους killers.", action: () => finaleChoice("trap", closest, discovered) },
      { label: "Προσποιήσου ότι παραδίνεσαι. Περίμενε το λάθος τους.", action: () => finaleChoice("wait", closest, discovered) }
    ]
  }));
}

function finaleChoice(choice, closest, discovered) {
  const movie = current.movie;
  const submitted = localDecision(`finale-${movie.number}`, isMultiplayerMode() ? { choice, closest } : choice);
  if (submitted === LOCAL_PENDING) return;
  const localVotes = isMultiplayerMode() ? movie.lastLocalResolution?.choices : null;
  const decisions = localVotes
    ? Object.entries(localVotes).map(([player, vote]) => ({ player, choice: vote.choice, closest: vote.closest }))
    : [{ player: activePlayerName(), choice: submitted, closest }];
  const perfect = discovered === movie.killers.length;
  const weakness = teamWeaknessProfile();
  const teamModifier = Math.max(-.16, Math.min(.16, (weakness.averageTrust / 180) - weakness.pressure * .12));
  const outcomeByName = {};
  const resultLines = [];
  decisions.forEach((decision, index) => {
    if (!decision.closest) {
      resultLines.push(`${decision.player}: αντιμετώπισε τους killers χωρίς στόχο διάσωσης.`);
      return;
    }
    const multiplayerOffset = isMultiplayerMode() ? index * 997 + decision.player.length * 19 : 0;
    const finaleRandom = mulberry32((current.seed + movie.number * 12289 + movie.choices.length * 173 + multiplayerOffset) >>> 0);
    const relationshipBonus = Math.min(.16, Math.max(0, relationshipState(decision.closest, decision.player).loyalty + relationshipState(decision.closest, decision.player).trust) / 650);
    const itemBonus = !isKiller(decision.closest) && (itemHeldBy(decision.closest) ? .34 : movie.itemKept ? .28 : 0);
    const weaponBonus = playerHasWeapon() ? .12 : 0;
    const baseChance = decision.choice === "friend" ? .62 : decision.choice === "trap" ? .38 : .46;
    const theoryBonus = perfect ? .20 : discovered ? .08 : 0;
    const alreadySaved = movie.status[decision.closest] === "SAVED" || movie.saved.includes(decision.closest) || movie.itemSaved.includes(decision.closest);
    const lives = alreadySaved || (movie.number === 3 && movieThreeProtected(decision.closest))
      ? true
      : survivalRoll(decision.closest, Math.min(.96, baseChance + relationshipBonus + itemBonus + weaponBonus + theoryBonus + teamModifier + (movie.puzzleAdvantage ? .08 : 0)), finaleRandom);
    outcomeByName[decision.closest] = Boolean(outcomeByName[decision.closest] || lives);
    if (lives && itemBonus && !movie.itemSaved.includes(decision.closest)) movie.itemSaved.push(decision.closest);
    if (lives && itemBonus && movie.itemKept) movie.itemUsed = true;
    resultLines.push(`${decision.player}: ${decision.choice} → ${decision.closest} ${lives ? "survived" : "died"}`);
  });
  Object.entries(outcomeByName).forEach(([name, lives]) => {
    setStatus(name, lives ? "SAVED" : "DEAD");
    if (lives && !movie.saved.includes(name)) { movie.saved.push(name); movie.peopleSaved += 1; }
  });
  remember(`Finale decisions: ${resultLines.join(" · ") || "κανείς δεν χρειάστηκε διάσωση"}.`, perfect ? "The full theory improved the final odds." : "The killers controlled the room until the last cut.");
  const deathsSoFar = movie.cast.filter(name => movie.status[name] === "DEAD").length;
  const closestTargets = unique(decisions.map(decision => decision.closest).filter(Boolean));
  const lateRandom = mulberry32((current.seed + movie.number * 12289 + movie.choices.length * 173 + (isMultiplayerMode() ? 701 : 0)) >>> 0);
  const finaleDeathBonus = movie.number === 1 ? 1 + Math.floor(lateRandom() * 2)
    : movie.number === 2 ? 2 + Math.floor(lateRandom() * 2)
      : 2 + Math.floor(lateRandom() * 3);
  const remainingFatalities = Math.max(1, (movie.fatalityTarget || 4) + finaleDeathBonus - deathsSoFar);
  const latePool = rankMovieThreeDeaths(movie.cast.filter(name => !isPlayerCharacter(name) && !isKiller(name) && isAlive(name) && !closestTargets.includes(name) && (movie.number !== 3 || !movieThreeProtected(name))), lateRandom);
  const lateCandidates = latePool.filter(name => {
    if (movie.status[name] === "SAVED" || movie.saved.includes(name) || movie.itemSaved.includes(name)) return false;
    if ((itemHeldBy(name) || movie.itemSaved.includes(name)) && !isKiller(name) && lateRandom() < .94) {
      if (!movie.itemSaved.includes(name)) movie.itemSaved.push(name);
      movie.deathsPrevented += 1;
      return false;
    }
    return true;
  });
  movie.lateDeaths = lateCandidates.slice(0, remainingFatalities).filter(name => setStatus(name, "DEAD"));
  if (movie.lateDeaths.length) remember(`Το τελικό χάος στο ${roomFor(2).name} είχε ${movie.lateDeaths.length} ακόμη ${movie.lateDeaths.length === 1 ? "θύμα" : "θύματα"}.`, `${movie.lateDeaths.join(" & ")} died during the final chase and will be announced in the final cut.`);
  if (movie.number === 3) {
    const rescuedOwn = decisions.find(decision => decision.choice === "friend" && decision.closest && outcomeByName[decision.closest]);
    const sacrificeRandom = mulberry32((current.seed + movie.number * 22877 + movie.choices.length * 1031) >>> 0);
    const sacrificePool = rankMovieThreeDeaths(movie.cast.filter(name => !isPlayerCharacter(name) && !isKiller(name) && isAlive(name) && name !== rescuedOwn?.closest && movie.status[name] !== "SAVED" && !movie.saved.includes(name) && !movie.itemSaved.includes(name) && !itemHeldBy(name)), sacrificeRandom);
    const sacrifice = rescuedOwn ? sacrificePool[0] : null;
    if (sacrifice && setStatus(sacrifice, "DEAD")) {
      movie.finalSacrifice = { saved: rescuedOwn.closest, lost: sacrifice, player: rescuedOwn.player };
      movie.lateDeaths = unique([...movie.lateDeaths, sacrifice]);
      remember(`${rescuedOwn.player} έσωσε ${accusativeName(rescuedOwn.closest)}, αλλά ${subjectName(sacrifice, true)} θυσιάστηκε στη διαδρομή διαφυγής.`, "Movie III rescue sacrifice: one bond survived because another low-interaction character held the killers back.");
      queueBeat({
        kind: "death", eyebrow: "MOVIE III · EVERY RESCUE HAS A PRICE",
        title: `${subjectName(sacrifice)} μένει πίσω για να ανοίξει την έξοδο.`,
        body: `${subjectName(rescuedOwn.closest)} σώθηκε από ${accusativeName(rescuedOwn.player)}. Την ίδια στιγμή ${subjectName(sacrifice, true)} κλείνει την πυράντοχη πόρτα από την άλλη πλευρά, παρασύρει τους killers μακριά και θυσιάζεται. Η διάσωση είναι αληθινή—και το τίμημα επίσης.`,
        names: [rescuedOwn.closest, sacrifice], statuses: ["SAVED · OWES A LIFE", "SACRIFICE · DEAD"], roomOffset: 2,
        cta: "Μετέτρεψε τη θυσία σε τελευταίο χτύπημα"
      }, "final-sacrifice");
    } else queueFinalKillBeat();
    return;
  }
  finishFinaleResolution();
}

function queueFinalKillBeat() {
  const movie = current.movie;
  const players = playerCharacters();
  const survivorPlayers = players.filter(player => player !== current.hiddenKiller);
  movie.finalKillAssignments = movie.killers.map((killer, index) => ({
    killer,
    player: killer === current.hiddenKiller
      ? (survivorPlayers[index % Math.max(1, survivorPlayers.length)] || players[0])
      : movie.killers.length === 1 ? players[0] : (players[index] || players[index % players.length] || players[0])
  }));
  movie.finalKiller = movie.killers.at(-1) || movie.mainKiller;
  queueBeat({
    kind: "execution",
    eyebrow: movie.killers.length === 1 ? "ONE LAST BODY · PLAYER 1" : "FINAL EXECUTIONS · EVERY PLAYER GETS ONE",
    title: movie.killers.length === 1 ? `${players[0]} αντιμετωπίζει τον τελευταίο killer.` : "Οι killers μοιράζονται ανάμεσα στους παίκτες.",
    body: movie.finalKillAssignments.length
      ? `${movie.finalKillAssignments.map(({ player, killer }) => `${player} σκοτώνει ${accusativeName(killer)}`).join(" · ")}. ${movie.killers.length === 1 ? "Όταν υπάρχει ένας μόνο killer, το τελικό χτύπημα ανήκει αποκλειστικά στον Player 1." : "Κάθε παίκτης παίρνει έναν διαφορετικό killer για το οριστικό τέλος."}`
      : "Η τελευταία μάσκα έπεσε. Το final cut χρειάζεται μόνο μία κίνηση για να τελειώσει.",
    names: movie.finalKillAssignments.map(entry => entry.killer),
    statuses: movie.finalKillAssignments.map(entry => `${entry.player} · FINAL BLOW`),
    roomOffset: 2,
    cta: movie.finalKillAssignments.length ? "Δώστε τα τελικά χτυπήματα" : "Κλείσε την ιστορία"
  }, "final-kill");
}

function resolveFinalKiller() {
  const movie = current.movie;
  const assignments = movie.finalKillAssignments?.length
    ? movie.finalKillAssignments
    : [{ player: playerCharacters()[0], killer: movie.finalKiller || movie.killers.at(-1) || movie.mainKiller }].filter(entry => entry.killer);
  movie.finalKillAssignments = assignments;
  movie.finalKiller = assignments.at(-1)?.killer || null;
  if (assignments.length) {
    playSfx("slash");
    navigator.vibrate?.([120, 55, 220]);
    assignments.forEach(({ player, killer }) => setStatus(killer, "DEAD"));
    remember(`Τελικά χτυπήματα: ${assignments.map(({ player, killer }) => `${player} → ${killer}`).join(" · ")}.`, "Every assigned killer was killed on screen and recorded as confirmed dead.");
  }
  finishFinaleResolution();
}

function finishFinaleResolution() {
  const movie = current.movie;
  movie.killers.forEach(name => setStatus(name, movie.number === 3 ? "DEAD" : "KILLER · PRESUMED DEAD"));
  if (movie.number === 3) {
    movie.resolvedLegacyKillers = unique(current.history.flatMap(record => record.killers || []));
    movie.resolvedLegacyKillers.forEach(name => setStatus(name, "DEAD"));
  }
  playerCharacters().filter(name => !(current.localHiddenKillerEnabled && movie.killers.includes(name) && name === current.hiddenKiller)).forEach(name => setStatus(name, "ALIVE"));
  if (movie.number === 3) enforceMovieThreeSurvivorCap();
  movie.completed = true;
  createMovieRecord();
  const killersConfirmedDead = unique([...(movie.resolvedLegacyKillers || []), ...movie.killers]);
  const lost = unique([...(movie.deathOrder || []), ...movie.cast]).filter(name => movie.status[name] === "DEAD" && !killersConfirmedDead.includes(name));
  movie.killersConfirmedDead = killersConfirmedDead;
  movie.endVictims = lost;
  queueBeat({
    kind: lost.length ? "death" : "finale",
    eyebrow: `${movieLabel(movie.number).toUpperCase()} · VICTIM ROLL`,
    title: lost.length ? `Αυτοί χάθηκαν στο ${movieLabel(movie.number)}.` : "Κανένα επιπλέον θύμα δεν χάθηκε.",
    body: lost.length
      ? `Πριν αποκαλυφθεί η τελική μοίρα των killers, καταγράφονται με τη σειρά θανάτου: ${lost.map(name => subjectName(name)).join(" · ")}. ${movie.itemSaved.length ? `Το ${movie.survivalItem} προστάτευσε: ${movie.itemSaved.join(", ")}.` : ""}`
      : `Όλοι οι μη-killer χαρακτήρες που έφτασαν στο final cut επέζησαν. ${movie.itemSaved.length ? `Το ${movie.survivalItem} προστάτευσε: ${movie.itemSaved.join(", ")}.` : ""}`,
    names: lost,
    statuses: lost.map(() => "DEAD"),
    roomOffset: 2,
    cta: "Δες τη μοίρα των killers"
  }, "killer-fall-summary");
}

function queueKillerFallSummary() {
  const movie = current.movie;
  const killersConfirmedDead = movie.killersConfirmedDead || unique([...(movie.resolvedLegacyKillers || []), ...movie.killers]);
  const shownKillers = movie.number === 3 ? killersConfirmedDead : movie.killers;
  queueBeat({
    kind: "finale",
    eyebrow: movie.number === 3 ? "FINAL CUT · ALL MASKS FALL" : "FINAL CUT · EVIL FALLS",
    title: movie.number === 3 ? "Οι killers πεθαίνουν οριστικά." : "Οι killers χάνονται μέσα στη φωτιά.",
    body: movie.number === 3
      ? `${movie.finalKillAssignments?.length ? `Τελικά χτυπήματα: ${movie.finalKillAssignments.map(({ player, killer }) => `${player} σκότωσε ${accusativeName(killer)}`).join(" · ")}. ` : ""}${killersConfirmedDead.join(", ")} καταγράφονται ως CONFIRMED DEAD. Όσοι παλιοί killers δεν επέστρεψαν θεωρούνται πλέον επίσης οριστικά νεκροί και το PRESUMED DEAD κλείνει εδώ.`
      : `${movie.killers.length === 1 ? "Ο killer καταγράφεται" : "Οι killers καταγράφονται"} ως PRESUMED DEAD. Δεν θα εμφανιστούν ως κανονικοί χαρακτήρες στην επόμενη ταινία και μόνο το Movie III μπορεί να κρύβει τη μοναδική επιτρεπόμενη ανατροπή επιστροφής.`,
    names: shownKillers,
    statuses: shownKillers.map(() => movie.number === 3 ? "KILLER · CONFIRMED DEAD" : "KILLER · PRESUMED DEAD"),
    roomOffset: 2,
    cta: movie.number === 3 ? "Πήγαινε στα statistics" : "Προχώρησε στην επόμενη ταινία"
  }, "credits");
}

function enforceMovieThreeSurvivorCap() {
  const movie = current.movie;
  if (!movie || movie.number !== 3 || movie.survivorCapApplied) return;
  const correctTheory = identifiedKillers(movie).length === movie.killers.length;
  const wrongTheory = falsePredictions(movie).length;
  const score = (correctTheory ? 3 : 0)
    + (movie.puzzleAdvantage ? 1 : 0)
    + ((movie.cluesFound || []).length >= 3 ? 1 : 0)
    + ((movie.itemSaved || []).length ? 1 : 0)
    + ((movie.peopleSaved || 0) >= 4 ? 1 : 0)
    + ((movie.deathsPrevented || 0) >= 3 ? 1 : 0)
    + (wrongTheory === 0 ? 1 : 0);
  const random = mulberry32((current.seed + 3 * 31469 + score * 1301 + movie.cast.length * 17) >>> 0);
  let cap;
  let tier;
  if (score >= 7) {
    cap = random() < .65 ? 9 : 10;
    tier = "EXCEPTIONAL";
  } else if (score >= 3) {
    cap = random() < .60 ? 6 : 7;
    tier = "STANDARD";
  } else {
    const roll = random();
    cap = roll < .45 ? 3 : roll < .80 ? 4 : 5;
    tier = "CRITICAL";
  }
  cap = Math.max(playerCharacters().filter(name => name !== current.hiddenKiller).length, cap);
  const living = movie.cast.filter(name => !movie.killers.includes(name) && (isPlayerCharacter(name) || isAlive(name)));
  // Eight is deliberately not a finale tier. If earlier deaths leave exactly
  // eight people, the last montage takes one more low-interaction NPC and
  // closes on seven rather than silently accepting the forbidden midpoint.
  if (living.length === 8) cap = Math.min(cap, 7);
  const excess = Math.max(0, living.length - cap);
  const candidates = rankMovieThreeDeaths(living.filter(name => !isPlayerCharacter(name)), random);
  const cut = candidates.slice(0, excess);
  cut.forEach(name => {
    movie.saved = (movie.saved || []).filter(entry => entry !== name);
    movie.itemSaved = (movie.itemSaved || []).filter(entry => entry !== name);
    movie.status[name] = "DEAD";
    movie.deathOrder ||= [];
    if (!movie.deathOrder.includes(name)) movie.deathOrder.push(name);
  });
  movie.lateDeaths = unique([...(movie.lateDeaths || []), ...cut]);
  movie.survivorCapApplied = true;
  movie.survivorCap = cap;
  movie.survivorTier = tier;
  movie.survivorScore = score;
  if (cut.length) remember(`Movie III survivor cut: ${cut.join(" & ")} πέθαναν στο τελευταίο montage.`, `${tier} tier · score ${score}/9 · final survivor cap ${cap}. Lowest-interaction characters were removed first; Paul carries the strongest mortality bias.`);
}

function createMovieRecord() {
  const movie = current.movie;
  if (movie.recordCreated) return current.history.at(-1);
  const survivors = movie.cast.filter(name => isPlayerCharacter(name) || isAlive(name)).filter(name => !movie.killers.includes(name));
  const wronglyAccused = unique([
    ...movie.midpointTheory.filter(name => !movie.killers.includes(name)),
    ...falsePredictions(movie)
  ]);
  const correct = identifiedKillers(movie);
  const ordinaryDeaths = movie.cast.filter(name => movie.status[name] === "DEAD" && !movie.killers.includes(name));
  const deathOrder = unique([...(movie.deathOrder || []), ...movie.cast, ...movie.killers, ...(movie.resolvedLegacyKillers || [])])
    .filter(name => movie.status[name] === "DEAD");
  const deaths = deathOrder;
  const rankedSurvivors = survivors.filter(name => !isPlayerCharacter(name));
  const closestFriend = [...rankedSurvivors].sort((a, b) => relationshipState(b).friendship - relationshipState(a).friendship)[0] || null;
  const mostTrusted = [...rankedSurvivors].sort((a, b) => relationshipState(b).trust - relationshipState(a).trust)[0] || null;
  const record = {
    number: movie.number, title: movie.title, cast: movie.cast, killers: movie.killers,
    returningKiller: movie.returningKiller, legacyEcho: movie.legacyEcho, killerProfile: movie.killerProfile, motive: movie.motive, survivors,
    openingScenarioId: movie.openingScenario?.id, openingTarget: movie.openingTarget, openingPartner: movie.openingPartner, openingOutcome: movie.openingOutcome,
    statuses: movie.status, friends: movie.friends, playerFriends: movie.playerFriends || {}, saved: unique(movie.saved), abandoned: unique(movie.abandoned || []), departed: unique(movie.departed || []),
    playerTheories: movie.finalTheories || {}, playerBets: movie.localBets || {},
    deaths, deathOrder,
    wronglyAccused, firstSuspicion: movie.firstSuspicion, midpointTheory: movie.midpointTheory,
    finalTheory: movie.finalTheory, identified: correct.length, cluesFound: movie.cluesFound.length,
    peopleSaved: movie.peopleSaved, deathsPrevented: movie.deathsPrevented,
    survivalItem: movie.survivalItem, itemHolder: (movie.itemHolders || []).join(" & ") || movie.keyHolder || (movie.itemKept ? (movie.itemKeepers || playerCharacters()).join(" & ") : null), itemHolders: [...(movie.itemHolders || [])], itemKeepers: [...(movie.itemKeepers || [])], itemKept: movie.itemKept, itemUsed: movie.itemUsed,
    confirmedLegacyDeaths: unique(movie.resolvedLegacyKillers || []),
    victimCount: ordinaryDeaths.length, itemSaved: unique(movie.itemSaved), puzzleSolved: movie.puzzleSolved, puzzleAdvantage: movie.puzzleAdvantage,
    betAmount: movie.betAmount, betPayout: movie.betPayout, betResult: movie.betResult,
    choices: movie.choices.length, pivotal: movie.choices.slice(0, 3).map(item => item.text), choicesLog: movie.choices.slice(), canonMoments: movie.canonMoments || [],
    closestFriend, mostTrusted, totalClues: movie.locationChoices.length, finalDeepInvestigationResult: movie.finalDeepInvestigationResult,
    finalInvestigationScenario: movie.finalInvestigationScenario, finalSacrifice: movie.finalSacrifice || null,
    additionalActions: JSON.parse(JSON.stringify(movie.additionalActions || {})),
    hiddenKillerStrategy: movie.hiddenKillerStrategy || null, finalKillAssignments: movie.finalKillAssignments || [],
    relationshipArc: movie.relationshipArc || null, secretAlliance: movie.secretAlliance || null,
    secretAttackVictims: movie.secretAttackVictims || [], rareEvent: movie.rareEvent || null,
    survivorCap: movie.survivorCap || null, survivorTier: movie.survivorTier || null, survivorScore: movie.survivorScore ?? null
  };
  current.history.push(record);
  movie.recordCreated = true;
  return record;
}

function creditOrder() {
  const movie = current.movie;
  return unique([
    ...playerCharacters(),
    ...movie.friends,
    ...movie.killers,
    ...movie.cast
  ]).map(name => {
    let role = "CAST";
    if (isPlayerCharacter(name)) {
      const playerIndex = playerCharacters().indexOf(name);
      role = playerIndex >= 0 ? `FINAL SURVIVOR · PLAYER ${playerIndex + 1}` : "FINAL SURVIVOR · ONLINE PLAYER";
    }
    else if (name === movie.killers[0]) role = "THE MASTERMIND";
    else if (movie.killers.includes(name)) role = "THE KILLER";
    else if (movie.friends.includes(name)) role = "YOUR INNER CIRCLE";
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
    const img = el("img"); img.src = cinematicImagePath(entry.name); img.alt = ""; img.dataset.character = entry.name;
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
    [playerCharacters().join(" & "), isLocalMode() ? `Final survivors · Local ${playerCharacters().length}P` : "Final survivor"],
    [record.killers.join(" & "), "Killers"],
    [`${record.survivors.length}/${record.cast.length}`, "Survivors"],
    [`${record.identified}/${record.killers.length}`, "Killers identified"],
    [String(record.peopleSaved), "People saved"],
    [String(record.victimCount ?? record.cast.filter(name => record.statuses?.[name] === "DEAD").length), "Victims this movie"],
    [(record.deaths || []).join(", ") || "Κανείς", "Who died"],
    [record.betAmount ? `${record.betResult} · +${record.betPayout}` : "No bet", "Fictional bet"],
    [(record.confirmedLegacyDeaths || []).join(", ") || "—", "Legacy killers officially dead"],
    [String(current.credits), "Slasher Credits balance"],
    [record.wronglyAccused.join(", ") || "Κανείς", "Wrongly accused"],
    [record.closestFriend || record.friends[0] || "—", "Closest friend"],
    [record.mostTrusted || "—", "Most trusted"],
    [record.firstSuspicion.join(" + ") || "—", "First suspect"],
    [record.finalTheory.join(" + ") || "—", "Final theory"],
    [`${record.cluesFound}/${record.totalClues || 3}`, "Clues found"],
    [record.survivalItem ? `${record.survivalItem}${record.itemUsed ? " · IMPACTED OUTCOME" : " · NOT SPENT"}` : "—", "Story item"],
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
  unique([...playerCharacters(), ...movie.cast, ...movie.killers, ...(movie.resolvedLegacyKillers || [])]).forEach(name => {
    const row = el("div", "status-row");
    const img = el("img"); img.src = imagePath(name); img.alt = ""; img.dataset.character = name;
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
  current.survivorCelebrationPending = false;
  current.finalSequence = "archive";
  saveCurrent();
  renderTrilogyArchive();
}

function trilogyDeaths() {
  const entries = current.history.flatMap(record => {
    const excluded = new Set([...(record.killers || []), ...(record.confirmedLegacyDeaths || [])]);
    const ordered = record.deathOrder || record.deaths || unique([...(record.cast || []), ...(record.killers || [])]);
    const names = ordered.filter(name => !excluded.has(name) && record.statuses?.[name] === "DEAD");
    return names.map(name => ({ name, movie: record.number, title: record.title }));
  });
  const firstDeath = new Map();
  entries.forEach(entry => { if (!firstDeath.has(entry.name)) firstDeath.set(entry.name, entry); });
  return [...firstDeath.values()];
}

function trilogySurvivors() {
  const finalRecord = [...(current?.history || [])].reverse().find(record => record.number === 3) || current?.history?.at(-1);
  const dead = new Set(trilogyDeaths().map(entry => entry.name));
  const killers = new Set((current?.history || []).flatMap(record => record.killers || []));
  const fallback = finalRecord?.cast?.filter(name => finalRecord.statuses?.[name] !== "DEAD") || [];
  return unique([...(finalRecord?.survivors || []), ...fallback, ...playerCharacters()])
    .filter(name => !dead.has(name) && !killers.has(name));
}

function renderSurvivorsCelebration() {
  if (!current) return renderHome();
  const survivors = trilogySurvivors();
  if (!survivors.length) {
    current.survivorCelebrationPending = false;
    current.finalSequence = "funeral";
    saveCurrent();
    return renderFuneral();
  }
  stopMusic();
  const root = screen("funeral-screen survivors-screen cinematic");
  const stage = el("div", "funeral-stage survivors-stage");
  const scene = el("article", "funeral-scene survivors-scene");
  const depth = el("div", "funeral-depth survivors-depth");
  let activeIndex = 0;
  const controls = el("div", "funeral-controls survivors-controls");
  const nextButton = button("Επόμενος survivor", "ghost", advance);
  const finish = () => {
    if (survivorTimer) clearInterval(survivorTimer);
    survivorTimer = null;
    current.survivorCelebrationPending = false;
    current.finalSequence = "archive";
    saveCurrent();
    stopMusic();
    renderTrilogyArchive();
  };
  controls.append(
    nextButton,
    button("Refresh winners", "ghost", () => { activeIndex = 0; showSurvivor(); }),
    button("Πίσω στο archive", "ghost", finish),
    button("Ολοκλήρωση", "", finish)
  );
  stage.append(scene);
  root.append(stage, controls, el("div", "funeral-heading", "THE NIGHT DIDN'T WIN"));

  function showSurvivor() {
    const name = survivors[activeIndex];
    scene.textContent = "";
    depth.textContent = "";
    depth.append(el("span", "funeral-rain rain-far"), el("span", "funeral-rain rain-near"));
    const portrait = el("div", "funeral-portrait survivors-portrait");
    const image = el("img"); image.src = imagePath(name); image.alt = `Portrait of survivor ${name}`;
    portrait.append(image);
    const copy = el("div", "funeral-copy survivors-copy");
    copy.append(
      el("p", "eyebrow", `${String(activeIndex + 1).padStart(2, "0")} / ${String(survivors.length).padStart(2, "0")} · MOVIE III`),
      el("h1", "display", name),
      el("p", "funeral-line", `${name} επέζησε. Οι survivors στέκονται όρθιοι και γιορτάζουν όσους κατάφεραν να βγουν ζωντανοί.`),
      el("small", "funeral-status survivors-status", "SURVIVOR · ALIVE · CELEBRATION")
    );
    const confetti = el("div", "survivors-confetti");
    ["#ffda61", "#ff7182", "#8ce9ed", "#c6a6ff", "#ffffff", "#82e8a6"].forEach((color, index) => {
      const piece = el("span");
      piece.style.setProperty("--x", `${12 + index * 15}%`);
      piece.style.setProperty("--delay", `${index * -.3}s`);
      piece.style.setProperty("--duration", `${3.4 + index * .35}s`);
      piece.style.setProperty("--drift", `${index % 2 ? 30 : -30}px`);
      piece.style.setProperty("--color", color);
      confetti.append(piece);
    });
    scene.append(portrait, depth, confetti, copy);
    nextButton.textContent = activeIndex >= survivors.length - 1 ? "Πίσω στο archive" : "Επόμενος survivor";
  }

  function advance() {
    if (activeIndex >= survivors.length - 1) return finish();
    activeIndex += 1;
    showSurvivor();
  }

  showSurvivor();
  playMusic(winnersAudio);
  survivorTimer = setInterval(() => {
    if (activeIndex >= survivors.length - 1) finish();
    else advance();
  }, 4300);
}

function renderFuneral() {
  if (!current) return renderHome();
  const dead = trilogyDeaths();
  if (!dead.length) {
    current.finalSequence = "killers";
    saveCurrent();
    return renderKillerMemorial();
  }
  stopMusic();
  const root = screen("funeral-screen cinematic");
  const stage = el("div", "funeral-stage");
  const controls = el("div", "funeral-controls");
  const finalRecord = current.history.at(-1);
  const attendees = unique(finalRecord?.survivors || []);
  let index = 0;

  const finish = () => {
    stopMemorialScore();
    current.finalSequence = "killers";
    saveCurrent();
    renderKillerMemorial();
  };

  const showPortrait = () => {
    if (index >= dead.length) return finish();
    const entry = dead[index];
    stage.textContent = "";
    const scene = el("article", "funeral-scene");
    const portrait = el("div", "funeral-portrait");
    const portraitImage = el("img");
    portraitImage.src = imagePath(entry.name);
    portraitImage.alt = `Portrait of ${entry.name}`;
    portrait.append(portraitImage);
    const depth = el("div", "funeral-depth");
    depth.append(el("span", "funeral-rain rain-far"), el("span", "funeral-rain rain-near"));
    const copy = el("div", "funeral-copy");
    copy.append(
      el("p", "eyebrow", `${String(index + 1).padStart(2, "0")} / ${String(dead.length).padStart(2, "0")} · ${movieLabel(entry.movie)}`),
      el("h1", "display", entry.name),
      el("p", "funeral-line", `${subjectName(entry.name)} θάβεται παρουσία των επιζώντων. Οι ζωντανοί πλησιάζουν κλαίγοντας, ανάβουν κεριά και ρίχνουν λουλούδια στον τάφο.`),
      el("small", "funeral-status", `${entry.title} · BURIED · CONFIRMED DEAD`),
      el("p", "funeral-witnesses", `Παρόντες: ${attendees.join(", ") || playerCharacters().join(" & ")}`)
    );
    scene.append(portrait, depth, copy);
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
    button("Συνέχεια στο killer memorial", "", finish)
  );
  root.append(stage, el("div", "funeral-heading", "I WILL REMEMBER YOU"), controls);
  playMemorialScore();
  showPortrait();
  memorialTimer = setInterval(showPortrait, 4600);
}

function renderKillerMemorial() {
  if (!current) return renderHome();
  const entries = current.history.flatMap(record => (record.killers || []).map((name, index) => ({
    name,
    movie: record.number,
    title: record.title,
    motive: record.motive,
    role: index === 0 ? "THE MASTERMIND" : "THE KILLER"
  })));
  if (!entries.length) {
    current.finalSequence = "survivors";
    saveCurrent();
    return renderSurvivorsCelebration();
  }
  stopMusic();
  const root = screen("killer-memorial-screen cinematic");
  const stage = el("div", "killer-memorial-stage");
  const controls = el("div", "funeral-controls killer-memorial-controls");
  let index = 0;

  const finish = () => {
    stopTimers();
    stopMusic();
    current.finalSequence = "survivors";
    saveCurrent();
    renderSurvivorsCelebration();
  };

  const showReveal = () => {
    if (index >= entries.length) return finish();
    const entry = entries[index];
    stage.textContent = "";
    const card = el("article", "killer-memorial-card");
    const visual = el("div", "killer-memorial-visual");
    const image = el("img"); image.src = imagePath(entry.name); image.alt = `Killer reveal: ${entry.name}`;
    visual.append(image, el("span", "killer-memorial-scanline"));
    const copy = el("div", "killer-memorial-copy");
    copy.append(
      el("p", "eyebrow", `${movieLabel(entry.movie)} · KILLER REVEAL · ${String(index + 1).padStart(2, "0")} / ${String(entries.length).padStart(2, "0")}`),
      el("p", "killer-memorial-role", entry.role),
      el("h1", "display", entry.name),
      el("p", "killer-memorial-line", `Το πρόσωπο πίσω από τη μάσκα. Motive: ${entry.motive}. Η αποκάλυψη έρχεται μόνο τώρα, μετά το In Memoriam.`),
      el("small", "funeral-status", `${entry.title} · REVEALED · CASE CLOSED`)
    );
    card.append(visual, copy);
    stage.append(card);
    index += 1;
  };

  const next = () => {
    if (killerRevealTimer) clearTimeout(killerRevealTimer);
    showReveal();
    if (index < entries.length) killerRevealTimer = setTimeout(next, 5200);
  };

  controls.append(button("Επόμενος killer", "ghost", next), button("Συνέχεια στους winners", "", finish));
  root.append(stage, el("div", "funeral-heading", "THE MASKS WERE ALWAYS THERE"), controls);
  playKillerMemorialScore();
  showReveal();
  killerRevealTimer = setTimeout(next, 5200);
}

function renderTrilogyArchive() {
  if (!current) return renderHome();
  current.credits ??= 1000;
  const root = screen();
  const content = el("div", "content");
  content.append(el("p", "eyebrow", "THE TRILOGY IS COMPLETE"), el("h1", "display", `${playerCharacters().join(" & ")}’s ${isLocalMode() ? "Local Cut" : "Cut"}`), el("p", "lead", `Τρεις ταινίες. Ένα προσωπικό canon. Τελικό fictional betting balance: ${current.credits} Slasher Credits.`));
  const finalRecord = current.history.find(record => record.number === 3);
  if (finalRecord?.confirmedLegacyDeaths?.length) {
    const resolution = el("section", "panel legacy-resolution");
    resolution.append(el("p", "eyebrow", "PRESUMED DEAD · CASE CLOSED"), el("h2", "headline", "Μετά το Final Chapter, κανείς δεν παραμένει θεωρητικά νεκρός."), el("p", "section-copy", `Επίσημα επιβεβαιωμένοι νεκροί legacy killers: ${finalRecord.confirmedLegacyDeaths.join(", ")}. Όποιος δεν επέστρεψε, δεν εμφανίστηκε ξανά επειδή είχε πράγματι πεθάνει.`));
    content.append(resolution);
  }
  current.history.forEach(record => {
    const block = el("section", "panel feature");
    block.append(el("p", "eyebrow", `${movieLabel(record.number)} · ${record.title}`), el("h2", "headline", `${record.killers.join(" & ")} — ${record.motive}`));
    const deaths = record.deaths || record.cast.filter(name => record.statuses?.[name] === "DEAD");
    block.append(el("p", "section-copy", `Survivors: ${record.survivors.join(", ")}. Saved during the movie: ${record.saved.join(", ") || "κανείς"}.`));
    if (record.number === 3) block.append(el("p", "archive-bet", `Killer profile: ${record.killerProfile || (record.returningKiller ? "LEGACY GHOST" : "NEW KILLERS")}${record.finalDeepInvestigationResult ? ` · Final investigation: ${record.finalDeepInvestigationResult}` : ""}.`));
    if (record.finalSacrifice) block.append(el("p", "archive-deaths", `Final sacrifice: ${record.finalSacrifice.saved} σώθηκε · ${record.finalSacrifice.lost} θυσιάστηκε για την έξοδο.`));
    if (record.finalKillAssignments?.length) block.append(el("p", "archive-bet", `Final blows: ${record.finalKillAssignments.map(({ player, killer }) => `${player} → ${killer}`).join(" · ")}.`));
    block.append(el("p", "archive-deaths", `Deaths: ${deaths.join(", ") || "κανείς"}.`));
    block.append(el("p", "archive-bet", `Theory: ${record.identified}/${record.killers.length} killers · Bet: ${record.betAmount ? `${record.betResult} / επιστροφή ${record.betPayout}` : "κανένα"}.`));
    content.append(block);
  });
  const memorialEntries = trilogyDeaths();
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
  if (trilogyDeaths().length) actions.append(button("Πήγαινε στο funeral", "secondary", () => {
    current.finalSequence = "funeral";
    saveCurrent();
    renderFuneral();
  }));
  if (trilogySurvivors().length) actions.append(button("Δες τους winners (last)", "", () => {
    current.finalSequence = "survivors";
    current.survivorCelebrationPending = true;
    saveCurrent();
    renderSurvivorsCelebration();
  }));
  if (current.history.some(record => (record.killers || []).length)) actions.append(button("Replay killer memorial", "secondary", () => {
    current.finalSequence = "killers";
    saveCurrent();
    renderKillerMemorial();
  }));
  actions.append(button("Refresh scene", "ghost", () => {
    current.finalSequence = "archive";
    current.survivorCelebrationPending = false;
    saveCurrent();
    renderTrilogyArchive();
  }));
  actions.append(button("Μεταφορά αυτού του save", "secondary", () => transferSaves([current], current.label || `${current.protagonist}-cut`)), button("Νέο universe", "", renderModeSelect), button("Κεντρικό μενού", "ghost", renderHome));
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
  if (updateCheckInFlight) return;
  updateCheckInFlight = true;
  updateButton.classList.add("checking");
  updateButton.setAttribute("aria-label", "Γίνεται έλεγχος για ενημέρωση");
  showUpdateStatus("checking", "Έλεγχος για ενημέρωση…", `Σύγκριση της έκδοσης v${APP_VERSION} με το GitHub Pages.`, 0);
  try {
    // Read the published version outside the service-worker cache. This is
    // important for players who are still controlled by the previous worker:
    // an old cached app must be able to discover a newer build before it can install
    // the new worker.
    let publishedVersion = "";
    try {
      const response = await fetch(`${GITHUB_ASSET_BASE}version.json?update=${Date.now()}`, {
        cache: "no-store",
        headers: { Accept: "application/json" }
      });
      if (response.ok) publishedVersion = String((await response.json())?.version || "");
    } catch {
      // The service-worker update check below remains useful while offline.
    }
    await swRegistration.update();
    if (swRegistration.waiting) {
      prepareUpdateResume();
      updateButton.classList.add("ready");
      showUpdateStatus("available", "Βρέθηκε νέα έκδοση", current?.movie ? "Η τρέχουσα σκηνή αποθηκεύτηκε. Η εγκατάσταση γίνεται αυτόματα και η τριλογία συνεχίζεται από εδώ." : "Η εγκατάσταση γίνεται αυτόματα. Το παιχνίδι θα ανοίξει ξανά μόνο του.", 0);
      swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
    } else if (swRegistration.installing) {
      showUpdateStatus("available", "Κατεβαίνει η νέα έκδοση", current?.movie ? "Μπορείς να συνεχίσεις να παίζεις. Το τρέχον save θα διατηρηθεί και η τριλογία θα συνεχιστεί μετά την ανανέωση." : "Μην κλείσεις το παιχνίδι — θα ανανεωθεί αυτόματα μόλις είναι έτοιμη.", 0);
    } else if (isNewerVersion(publishedVersion, APP_VERSION)) {
      // A cached v1.11 page can have a service-worker registration whose
      // script URL is also cached. Registering a versioned, cache-busting
      // script URL forces the browser to fetch the current worker.
      prepareUpdateResume();
      updateButton.classList.add("ready");
      showUpdateStatus("available", `Βρέθηκε νέα έκδοση v${publishedVersion}`, current?.movie ? "Το save της τρέχουσας σκηνής είναι ασφαλές. Εφαρμόζεται τώρα και η τριλογία συνεχίζεται αυτόματα." : "Εφαρμόζεται τώρα και το παιχνίδι θα ανοίξει ξανά αυτόματα.", 0);
      const versionedRegistration = await navigator.serviceWorker.register(`./service-worker.js?v=${encodeURIComponent(publishedVersion)}&force=${Date.now()}`, { updateViaCache: "none" });
      swRegistration = versionedRegistration;
      if (versionedRegistration.waiting) versionedRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
      else if (versionedRegistration.installing) {
        const installing = versionedRegistration.installing;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed") installing.postMessage({ type: "SKIP_WAITING" });
        });
      } else await forceReloadForUpdate(publishedVersion);
    } else {
      updateButton.classList.remove("ready");
      const visibleVersion = publishedVersion || APP_VERSION;
      showUpdateStatus("latest", "Είσαι ενημερωμένος", `Έχεις ήδη την τελευταία έκδοση v${visibleVersion}.`);
    }
  } catch {
    showUpdateStatus("error", "Δεν ολοκληρώθηκε ο έλεγχος", `Η έκδοση v${APP_VERSION} παραμένει ενεργή. Έλεγξε τη σύνδεσή σου και πάτησε ξανά ↻.`);
  } finally {
    updateButton.classList.remove("checking");
    updateButton.setAttribute("aria-label", "Έλεγχος για ενημέρωση");
    updateCheckInFlight = false;
  }
}

function versionParts(value) {
  return String(value || "0")
    .split(".")
    .map(part => Number.parseInt(part, 10))
    .map(part => Number.isFinite(part) ? part : 0);
}

function isNewerVersion(candidate, currentVersion) {
  const candidateParts = versionParts(candidate);
  const currentParts = versionParts(currentVersion);
  for (let index = 0; index < Math.max(candidateParts.length, currentParts.length); index += 1) {
    const candidatePart = candidateParts[index] || 0;
    const currentPart = currentParts[index] || 0;
    if (candidatePart !== currentPart) return candidatePart > currentPart;
  }
  return false;
}

async function forceReloadForUpdate(version) {
  prepareUpdateResume();
  sessionStorage.setItem(UPDATE_COMPLETE_KEY, String(version || APP_VERSION));
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations
      .filter(registration => registration.scope.startsWith(location.origin))
      .map(registration => registration.unregister()));
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys
        .filter(key => key.startsWith("spirit-slasher-"))
        .map(key => caches.delete(key)));
    }
  } catch {
    // A cache cleanup failure should never trap the player in the old build.
  }
  const separator = location.search ? "&" : "?";
  location.replace(`${location.pathname}${separator}update=${encodeURIComponent(version || APP_VERSION)}&t=${Date.now()}${location.hash || ""}`);
}

function automaticUpdatesEnabled() {
  return location.hostname.endsWith("github.io") || location.hostname === "slasher.spirituniverse.gr";
}

function prepareUpdateResume() {
  if (!current?.movie || current.movie.completed || !current.id) return;
  saveCurrent();
  sessionStorage.setItem(UPDATE_RESUME_KEY, current.id);
}

async function setupServiceWorker() {
  const completedUpdate = sessionStorage.getItem(UPDATE_COMPLETE_KEY);
  const resumedAfterUpdate = sessionStorage.getItem(UPDATE_RESUMED_KEY);
  sessionStorage.removeItem(UPDATE_RESUMED_KEY);
  if (completedUpdate) {
    sessionStorage.removeItem(UPDATE_COMPLETE_KEY);
    showUpdateStatus("updated", "Η ενημέρωση ολοκληρώθηκε", resumedAfterUpdate ? `Το Spirit Slasher είναι τώρα στην έκδοση v${APP_VERSION}. Η τριλογία συνεχίζεται από το τελευταίο save.` : `Το Spirit Slasher είναι τώρα στην έκδοση v${APP_VERSION}.`, 6000);
  }
  if (!("serviceWorker" in navigator)) {
    showUpdateStatus("info", "Οι αυτόματες ενημερώσεις δεν υποστηρίζονται", `Τρέχεις την έκδοση v${APP_VERSION}. Άνοιξε το παιχνίδι από σύγχρονο browser.`);
    return;
  }
  let firstControllerChange = !navigator.serviceWorker.controller;
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing || !navigator.serviceWorker.controller) return;
    if (firstControllerChange) {
      firstControllerChange = false;
      return;
    }
    refreshing = true;
    prepareUpdateResume();
    sessionStorage.setItem(UPDATE_COMPLETE_KEY, APP_VERSION);
    location.reload();
  });
  try {
    swRegistration = await navigator.serviceWorker.register(`./service-worker.js?v=${encodeURIComponent(APP_VERSION)}`, { updateViaCache: "none" });
    swRegistration.addEventListener("updatefound", () => {
      const installing = swRegistration.installing;
      if (!installing) return;
      installing.addEventListener("statechange", () => {
        if (installing.state === "installed" && navigator.serviceWorker.controller) {
          prepareUpdateResume();
          updateButton.classList.add("ready");
          showUpdateStatus("available", "Η νέα έκδοση είναι έτοιμη", current?.movie ? "Το save της τρέχουσας σκηνής είναι ασφαλές. Εφαρμόζεται τώρα και το παιχνίδι συνεχίζεται αυτόματα." : "Εφαρμόζεται τώρα και το παιχνίδι θα ανοίξει ξανά αυτόματα.", 0);
          installing.postMessage({ type: "SKIP_WAITING" });
        }
      });
    });
    if (automaticUpdatesEnabled()) {
      if (!completedUpdate) await checkForUpdate(false);
      setInterval(() => checkForUpdate(false), 15 * 60 * 1000);
    }
  } catch {
    showUpdateStatus("error", "Το update system δεν συνδέθηκε", `Η έκδοση v${APP_VERSION} λειτουργεί κανονικά. Πάτησε ↻ όταν είσαι online.`);
  }
}

updateButton.addEventListener("click", () => checkForUpdate(true));

soundButton.textContent = settings.sound ? "♪" : "×";
registerWebMCP();
window.addEventListener("load", setupServiceWorker, { once: true });
function bootApp() {
  const resumeId = sessionStorage.getItem(UPDATE_RESUME_KEY);
  if (!resumeId) return renderHome();
  sessionStorage.removeItem(UPDATE_RESUME_KEY);
  const resumed = saves.find(save => save.id === resumeId);
  if (resumed?.movie && !resumed.completed) {
    sessionStorage.setItem(UPDATE_RESUMED_KEY, "1");
    loadUniverse(resumeId);
  } else {
    renderHome();
  }
}
bootApp();
