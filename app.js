const app = document.querySelector("#app");
const toastNode = document.querySelector("#toast");
const transitionNode = document.querySelector("#transition");
const introAudio = document.querySelector("#introAudio");
const outroAudio = document.querySelector("#outroAudio");
const funeralAudio = document.querySelector("#funeralAudio");
const killerMemorialAudio = document.querySelector("#killerMemorialAudio");
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
const APP_VERSION = "1.10";
const SAVE_TRANSFER_VERSION = 1;

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
  ["Life-sim Relationship Board", "Portrait tiles, canon συγγένειες και εμφανή friendship, trust, loyalty και suspicion statuses δείχνουν γιατί κάθε δεσμός έχει σημασία."],
  ["Random relationship events", "Καβγάδες, πένθος, όρκοι, κατηγορίες, rivalry και confessions γεννιούνται από το συγκεκριμένο cast και μπορεί να είναι ειλικρινή ή χειριστικά."],
  ["Real clues & red herrings", "Τα στοιχεία είναι αληθινά, αλλά η ερμηνεία τους μπορεί να σε οδηγήσει στον λάθος άνθρωπο."],
  ["120 room variants", "Τρία cinematic map atlases γίνονται 120 διαφορετικά sub-rooms, routes, clues και scene orders σε κάθε canon."],
  ["Accusation history", "Το παιχνίδι θυμάται την πρώτη, τη μεσαία και την τελική θεωρία σου και μετρά τι πρόβλεψες."],
  ["Independent NPC minds", "Κάθε NPC χτίζει δική του υποψία από προσωπικές παρατηρήσεις, μπορεί να μπλοφάρει και δεν επαναλαμβάνει μηχανικά τα ίδια λόγια ή τη θεωρία του παίκτη."],
  ["Local 2P pass-the-phone", "Διάλεξε δύο καλούς χαρακτήρες, άφησε τον Player 2 να πάρει opening turns και κάνε pass turn χωρίς να αλλάξει το canon των σχέσεων."],
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
let killerRevealTimer = null;
let funeral3DStop = null;
let sceneWebGLStops = [];
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
  persistSaves();
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
function imagePath(name) { return `assets/characters/${character(name)?.file || "char_billy.webp"}`; }
function allNames() { return roster.map(item => item.name); }
function playerCharacters() { return unique(current?.playerCharacters?.length ? current.playerCharacters : [current?.protagonist].filter(Boolean)); }
function isPlayerCharacter(name) { return playerCharacters().includes(name); }
function isLocalMode() { return current?.gameMode === "local" && playerCharacters().length > 1; }
function activePlayerName() { return playerCharacters()[current?.activePlayerIndex || 0] || current?.protagonist; }
function passLocalTurn() {
  if (!isLocalMode()) return;
  current.activePlayerIndex = (current.activePlayerIndex + 1) % playerCharacters().length;
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
  if (!isLocalMode()) return value;
  const movie = current.movie;
  movie.localDecisions ||= {};
  const bucket = movie.localDecisions[key] ||= {};
  const player = activePlayerName();
  bucket[player] = value;
  const players = playerCharacters();
  const missing = players.find(name => bucket[name] === undefined);
  if (missing) {
    current.activePlayerIndex = players.indexOf(missing);
    saveCurrent();
    toast(`${player} κλείδωσε την επιλογή. Τώρα αποφασίζει ο/η ${missing}.`);
    renderMovie();
    return null;
  }
  const values = players.map(name => bucket[name]);
  movie.localDecisionHistory ||= [];
  movie.localDecisionHistory.push({ key, choices: Object.fromEntries(players.map(name => [name, bucket[name]])) });
  delete movie.localDecisions[key];
  current.activePlayerIndex = 0;
  saveCurrent();
  return resolver(values);
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
  node.addEventListener("click", onClick);
  return node;
}

function screen(extra = "") {
  stopTimers();
  sceneWebGLStops.forEach(stop => stop?.());
  sceneWebGLStops = [];
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
  if (killerRevealTimer) clearTimeout(killerRevealTimer);
  introTimer = null;
  creditTimer = null;
  memorialTimer = null;
  killerRevealTimer = null;
  funeral3DStop?.();
  funeral3DStop = null;
  stopMemorialScore();
}

function stopMusic() {
  [introAudio, outroAudio, funeralAudio, killerMemorialAudio].forEach(audio => {
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

function playKillerMemorialScore() {
  if (!settings.sound) return;
  killerMemorialAudio.currentTime = 0;
  killerMemorialAudio.volume = .78;
  killerMemorialAudio.play().catch(() => {});
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
    button("Νέα τριλογία", "", renderModeSelect),
    ...(saves.length ? [button(`Save Vault · ${saves.length}`, "secondary", renderSaveVault)] : []),
    button("Όλα τα features", "ghost", renderFeatures)
  );
  if (deferredInstallPrompt) actions.append(button("Εγκατάσταση εφαρμογής", "secondary", installApp));
  copy.append(actions);

  const art = el("div", "home-art");
  const logo = el("img", "hero-logo");
  logo.src = "assets/brand/spirit-slasher-logo.png";
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
  content.append(el("p", "eyebrow", "NEW TRILOGY · CHOOSE YOUR CUT"), el("h1", "display", "Πώς θέλεις να παίξεις;"), el("p", "lead", "Οι επιλογές, οι σχέσεις και τα saves λειτουργούν σε κάθε mode. Το Local 2P είναι pass-the-phone / share-screen και κρατάει και τους δύο επιλεγμένους χαρακτήρες ζωντανούς."));
  const grid = el("div", "mode-grid");
  const single = el("article", "panel mode-card");
  single.append(el("p", "eyebrow", "SINGLE PLAYER"), el("h2", "headline", "Μόνος/η στο cut"), el("p", "section-copy", "Ένας πρωταγωνιστής, procedural τριλογία και όλο το canon στα χέρια σου."), button("Single Player", "", () => renderProtagonist("single")));
  const multi = el("article", "panel mode-card");
  multi.append(el("p", "eyebrow", "MULTIPLAYER"), el("h2", "headline", "Παίξε μαζί"), el("p", "section-copy", "Online έρχεται αργότερα. Local υποστηρίζει μέχρι δύο παίκτες με κοινή οθόνη ή pass-the-phone."), button("Multiplayer", "secondary", renderMultiplayerMode));
  grid.append(single, multi); content.append(grid);
  const actions = el("div", "actions"); actions.append(button("Πίσω", "ghost", renderHome)); content.append(actions);
  root.append(content);
}

function renderMultiplayerMode() {
  const root = screen();
  const content = el("div", "content narrow");
  content.append(el("p", "eyebrow", "MULTIPLAYER CUT"), el("h1", "display", "Διάλεξε τρόπο σύνδεσης."), el("p", "lead", "Το Online mode είναι Coming Soon. Το Local mode παίζεται τώρα σε μία συσκευή με δύο ανθρώπινους χαρακτήρες."));
  const grid = el("div", "mode-grid");
  const online = el("article", "panel mode-card disabled");
  online.append(el("p", "eyebrow", "ONLINE"), el("h2", "headline", "COMING SOON"), el("p", "section-copy", "Απαιτεί server/account υποδομή και θα ενεργοποιηθεί σε επόμενη έκδοση."), button("Coming soon", "ghost", () => toast("Το Online multiplayer έρχεται σύντομα.")));
  const local = el("article", "panel mode-card");
  local.append(el("p", "eyebrow", "LOCAL · 2 PLAYERS"), el("h2", "headline", "Pass the phone"), el("p", "section-copy", "Δύο καλοί χαρακτήρες, ποτέ killers και ποτέ μόνιμα νεκροί. Όλοι οι υπόλοιποι είναι NPCs και οι σχέσεις συνεχίζουν κανονικά."), button("Local 2 Players", "", () => renderLocalSetup()));
  grid.append(online, local); content.append(grid);
  const actions = el("div", "actions"); actions.append(button("Πίσω", "ghost", renderModeSelect)); content.append(actions);
  root.append(content);
}

function renderLocalSetup(firstName = null) {
  const root = screen();
  const content = el("div", "content");
  const head = el("div", "section-head");
  const title = el("div");
  title.append(el("p", "eyebrow", "LOCAL 2P · CASTING"), el("h1", "headline", firstName ? "Διάλεξε τον/την Player 2" : "Διάλεξε δύο χαρακτήρες"));
  head.append(title, el("p", "section-copy", firstName ? `Player 1: ${firstName}. Ο Player 2 παίρνει δικό του/της turn και οι δύο παραμένουν καλοί, ζωντανοί και έξω από τη λίστα killers.` : "Οι δύο επιλογές είναι ανθρώπινοι players. Όλοι οι άλλοι ρόλοι μένουν NPCs και οι σχέσεις μετράνε κανονικά."));
  content.append(head);
  const grid = el("div", "roster");
  roster.filter(item => item.name !== firstName).forEach(item => grid.append(characterButton(item.name, () => firstName ? confirmLocalPlayers(firstName, item.name) : renderLocalSetup(item.name), false, firstName ? "local-player-two" : "")));
  content.append(grid);
  const actions = el("div", "actions"); actions.append(button("Πίσω", "ghost", firstName ? () => renderLocalSetup() : renderMultiplayerMode)); content.append(actions);
  root.append(content);
}

function confirmLocalPlayers(firstName, secondName) {
  const root = screen();
  const content = el("div", "content narrow");
  content.append(el("p", "eyebrow", "LOCAL 2P · READY"), el("h1", "display", `${firstName} & ${secondName}`), el("p", "lead", "Ο Player 1 ξεκινά με μία extra επιλογή. Ο Player 2 μπορεί να πάρει το opening decision, να πατήσει pass turn και να σώσετε διαφορετικούς χαρακτήρες."));
  const pair = el("div", "local-player-pair");
  [firstName, secondName].forEach((name, index) => {
    const card = el("article", "panel local-player-card");
    const img = el("img"); img.src = imagePath(name); img.alt = "";
    card.append(img, el("strong", "", `PLAYER ${index + 1}`), el("h2", "", name), el("small", "", "GOOD · IMMUNE TO KILLER ROLE")); pair.append(card);
  });
  content.append(pair);
  const actions = el("div", "actions");
  actions.append(button("Έναρξη Local 2P", "", () => createUniverse(firstName, { mode: "local", playerCharacters: [firstName, secondName] })), button("Άλλαξε χαρακτήρες", "ghost", renderLocalSetup));
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
  const players = unique(options.playerCharacters?.length ? options.playerCharacters : [protagonist]);
  const mode = options.mode || "single";
  const seed = (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) >>> 0;
  const relationshipsByPlayer = Object.fromEntries(players.map(player => [player, buildRelationshipBoard(player)]));
  current = {
    id: `cut-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    seed,
    protagonist,
    playerCharacters: players,
    gameMode: mode,
    activePlayerIndex: 0,
    playerCredits: Object.fromEntries(players.map(name => [name, 1000])),
    label: `${players.join(" & ")}’s ${mode === "local" ? "Local Cut" : "Cut"} · ${new Intl.DateTimeFormat("el-GR", { dateStyle: "short", timeStyle: "short" }).format(new Date())}`,
    credits: mode === "local" ? players.length * 1000 : 1000,
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
  current.activePlayerIndex ??= 0;
  current.playerCredits ||= Object.fromEntries(current.playerCharacters.map(name => [name, 1000]));
  current.relationshipsByPlayer = Object.fromEntries(current.playerCharacters.map((name, index) => [name, buildRelationshipBoard(name, current.relationshipsByPlayer?.[name] || (index === 0 ? current.relationships : null))]));
  current.relationships = current.relationshipsByPlayer[current.protagonist] || current.relationships;
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
  movie.deathOrder ||= [];
  movie.continuityFriends ||= movie.priorCoreFriends || [];
  movie.newcomers ||= [];
  movie.itemKept ??= false;
  movie.itemUsed ??= false;
  movie.finalKiller ||= null;
  movie.canonMoments ||= [];
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
      clue.text = `Το ίχνος μοιάζει με του/της ${movie.legacyEcho}, σαν να βρισκόταν εδώ. Μπορεί όμως να είναι επιστροφή, αντιγραφή ή εσκεμμένη παγίδα — δεν αποδεικνύει ότι επέστρεψε κανείς. ${clue.text}`;
    };
    Object.values(movie.locationClues || {}).forEach(migrateLegacyClue);
    (movie.cluesFound || []).forEach(migrateLegacyClue);
  }
  movie.relationshipEvent ||= null;
  movie.relationshipEventShown ??= !movie.relationshipEvent;
  movie.accusationDebates ||= {};
  movie.pendingBet ??= 0;
  movie.betAmount ??= 0;
  movie.betPayout ??= 0;
  movie.betResult ||= "NO BET";
  movie.betSettled ||= false;
  movie.pendingBeat ||= null;
  movie.pendingNextStage ||= null;
  movie.localDecisions ||= {};
  movie.localDecisionHistory ||= [];
  movie.playerFriends ||= {};
  movie.localTheories ||= { midpoint: {}, final: {} };
  movie.localBets ||= {};
  playerCharacters().forEach(name => { movie.status[name] = "ALIVE"; });
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

function relationshipSummary(name) {
  const state = relationshipState(name);
  const canon = protagonistRelationship(name);
  const flags = [];
  if (canon) flags.push(canon);
  if (friendsForPlayer().includes(name)) flags.push("Main group");
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
  const root = screen("movie-shell relationship-board-screen");
  const content = el("div", "content");
  const head = el("div", "section-head");
  const title = el("div");
  title.append(el("p", "eyebrow", `${movieLabel(movie.number)} · ${activePlayerName()} · RELATIONSHIP MECHANICS`), el("h1", "headline", "Οι δικοί σου δεσμοί αλλάζουν ποιος επιστρέφει και ποιος επιβιώνει."), el("p", "section-copy", `Αυτό είναι το προσωπικό relationship board του/της ${activePlayerName()}. Το main group αποκτά story priority στα sequels· οι canon συγγένειες, trust, friendship και loyalty επηρεάζουν βοήθεια και survival odds.`));
  head.append(title, button("Επιστροφή στην ταινία", "ghost", renderMovie));
  content.append(head);
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
  unique([...movie.friends, ...linkedNames(activePlayerName()), ...movie.cast.filter(name => !isPlayerCharacter(name))]).forEach(name => {
    const state = relationshipState(name);
    if (!state) return;
    const card = el("article", `panel relationship-card ${movie.status[name] === "DEAD" ? "dead" : ""}`);
    const portrait = el("img"); portrait.src = imagePath(name); portrait.alt = "";
    const copy = el("div", "relationship-card-copy");
    const identity = el("div", "bond-identity");
    identity.append(el("span", "social-diamond"), el("small", "", relationshipSummary(name)));
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
      `Δεν μπορώ να δεχτώ ότι ο/η ${relatedDead} χάθηκε. Όποιος το έκανε θα το πληρώσει.`,
      `Μου υποσχέθηκε ότι θα φύγουμε μαζί. Δεν θα αφήσω τον/την ${relatedDead} να γίνει απλώς άλλο ένα όνομα.`,
      `Ακούω ακόμη τη φωνή του/της ${relatedDead}. Αν σταματήσω τώρα, τον/την εγκαταλείπω δεύτερη φορά.`
    ] : [
      `Ο/Η ${relatedDead} ήταν οικογένειά μου. Θα βρω ποιος το έκανε, ακόμη κι αν πρέπει να μείνω μόνος/η.`,
      `Δεν πρόλαβα να πω αντίο στον/στην ${relatedDead}. Κανείς δεν θα μου πάρει και την αλήθεια.`,
      `Όποιος σκότωσε τον/την ${relatedDead} θα πληρώσει. Δεν με νοιάζει ποια μάσκα φοράει.`
    ];
    return `${bond || "BLOOD BOND"} · «${grief[Math.abs(seed) % grief.length]}»`;
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
  const groupCount = Math.max(1, Math.min(3, otherClusters.length + (continuityCluster.length ? 1 : 0)));
  const groups = Array.from({ length: groupCount }, () => []);
  if (continuityCluster.length) groups[0].push(...continuityCluster);
  otherClusters.forEach((cluster, index) => groups[(continuityCluster.length ? 1 : 0) + (index % Math.max(1, groupCount - (continuityCluster.length ? 1 : 0)))].push(...cluster));
  return groups.filter(group => group.length);
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
  const players = playerCharacters();
  const oldKillers = unique(current.history.flatMap(movie => movie.killers || [])).filter(name => !players.includes(name));
  const confirmedDead = new Set(unique(current.history.flatMap(record => [
    ...(record.killers || []),
    ...Object.entries(record.statuses || {}).filter(([, status]) => status === "DEAD").map(([name]) => name)
  ])));
  const priorSurvivors = number === 1 ? [] : unique(current.history.at(-1)?.survivors || [])
    .filter(name => !players.includes(name) && !confirmedDead.has(name));
  const priorCoreFriends = number === 1 ? [] : unique(current.history.at(-1)?.friends || [])
    .filter(name => priorSurvivors.includes(name));
  const legacyPriority = unique([...players.flatMap(player => linkedNames(player)), ...priorSurvivors])
    .filter(name => !players.includes(name) && !confirmedDead.has(name));
  const desired = number === 1 ? 11 : 12;
  const seenBefore = new Set(current.history.flatMap(record => record.cast || []));
  const returningLimit = number === 2 ? Math.max(4, priorCoreFriends.length) : 0;
  const returningSurvivors = number === 2
    ? unique([...priorCoreFriends, ...shuffle(legacyPriority.filter(name => !priorCoreFriends.includes(name)), random)]).slice(0, returningLimit)
    : [];
  const newcomers = shuffle(allNames().filter(name => !players.includes(name) && !seenBefore.has(name) && !confirmedDead.has(name)), random);
  const otherLiving = shuffle(allNames().filter(name => !players.includes(name) && !confirmedDead.has(name) && !returningSurvivors.includes(name) && !newcomers.includes(name)), random);
  const allLegacySurvivors = unique(current.history.flatMap(record => record.survivors || []))
    .filter(name => !players.includes(name) && !confirmedDead.has(name));
  let cast = number === 3
    ? unique([...players, ...newcomers, ...shuffle(allLegacySurvivors, random), ...otherLiving])
    : unique([...players, ...returningSurvivors, ...newcomers, ...otherLiving]).slice(0, desired + players.length - 1);

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
    const replacement = shuffle(allNames().filter(name => !cast.includes(name) && !players.includes(name) && name !== returningKiller && !confirmedDead.has(name)), random)[0];
    if (replacement) cast.push(replacement);
  }

  let eligibleKillers = shuffle(cast.filter(name => !players.includes(name)), random);
  if (number === 3 && !returningKiller) {
    const wronglyAccusedBefore = unique(current.history.flatMap(record => record.wronglyAccused || []));
    const legacyFriends = unique(current.history.flatMap(record => record.friends || []));
    const historyShapedCandidates = unique([...wronglyAccusedBefore, ...legacyFriends])
      .filter(name => cast.includes(name) && !players.includes(name));
    eligibleKillers = unique([...shuffle(historyShapedCandidates, random), ...eligibleKillers]);
  }
  const killers = returningKiller ? [returningKiller] : eligibleKillers.slice(0, killerCount);
  const victims = cast.filter(name => !players.includes(name) && !killers.includes(name));
  const previousRecord = current.history.at(-1);
  const survivingLegacyFriends = unique(current.history.flatMap(record =>
    (record.friends || []).filter(name => (record.survivors || []).includes(name))
  ));
  const protectedLegacy = number > 1 ? unique([
    previousRecord?.closestFriend,
    previousRecord?.mostTrusted,
    ...survivingLegacyFriends,
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
  const innocent = pick(cast.filter(name => !players.includes(name) && !killers.includes(name)), random);
  const secretHolder = pick(cast.filter(name => !players.includes(name) && name !== innocent), random);
  const mainKiller = killers[0];
  const mysteryFinalClue = number === 3;
  const legacyEcho = mysteryFinalClue && oldKillers.length ? (returningKiller || pick(oldKillers, random)) : null;
  const clueIdentity = mysteryFinalClue ? (legacyEcho ? `${legacyEcho} · ARCHIVE ECHO` : "UNKNOWN FIGURE") : mainKiller;
  const legacyClueWarning = legacyEcho
    ? `Το ίχνος μοιάζει με του/της ${legacyEcho}, σαν να βρισκόταν εδώ. Μπορεί όμως να είναι επιστροφή, αντιγραφή ή εσκεμμένη παγίδα — δεν αποδεικνύει ότι επέστρεψε κανείς.`
    : "Το ίχνος μοιάζει να έρχεται από παλιό case file, αλλά δεν αποδεικνύει αν ανήκει σε παλιό ή νέο killer.";
  const continuityFriends = number === 1 ? [] : unique([
    ...(previousRecord?.friends || []),
    ...priorCoreFriends
  ]).filter(name => cast.includes(name) && !players.includes(name));
  const shuffledFriends = shuffle(cast.filter(name => !players.includes(name)), random);
  const friendOptions = distributeFriendGroups(shuffledFriends, continuityFriends);
  const world = movieWorlds[number];
  const rooms = shuffle(expandedRooms(number), random).slice(0, 12);
  const locationChoices = rooms.slice(0, 3).map(room => [room.name, room.hint]);
  const openingScenario = buildOpeningScenario(number, openingTarget, openingPartner, random, current.history.map(record => record.openingScenarioId));
  const fatalityTarget = number === 1
    ? 3 + Math.floor(random() * 3)
    : number === 2
      ? 3 + Math.floor(random() * 4)
      : Math.min(Math.max(4, cast.length - 2), cast.length > 16 ? 6 + Math.floor(random() * 5) : 4 + Math.floor(random() * 5));
  const openingKillerRoll = random();
  const puzzle = pick(investigationPuzzles, random);
  const cluePool = [
    pick([
      { type: "REAL CLUE", title: `${clueIdentity}: το δεύτερο τηλέφωνο`, text: mysteryFinalClue ? `${legacyClueWarning} Το burner phone ενεργοποιήθηκε σε εγκαταλελειμμένο σημείο χωρίς καταχωρημένο ιδιοκτήτη.` : `Το burner phone ενεργοποιήθηκε κοντά στο σπίτι του/της ${mainKiller}, τέσσερα λεπτά πριν από την επίθεση.` },
      { type: "REAL CLUE", title: `${clueIdentity}: το κλειδί του projector`, text: mysteryFinalClue ? `${legacyClueWarning} Το κλειδί έχει καμένη επιφάνεια και cloned αποτυπώματα από σφραγισμένο evidence bag.` : `Το μοναδικό κλειδί του projection booth βρέθηκε σε σακάκι που φόρεσε ο/η ${mainKiller}.` },
      { type: "REAL CLUE", title: `${clueIdentity}: το σβησμένο frame`, text: mysteryFinalClue ? `${legacyClueWarning} Το frame αναπαράγει μια γνώριμη κίνηση, όμως το πρόσωπο έχει αφαιρεθεί ψηφιακά.` : `Στο χαμένο frame φαίνεται καθαρά η αντανάκλαση του/της ${mainKiller} πριν χτυπήσει ο συναγερμός.` },
      { type: "REAL CLUE", title: `${clueIdentity}: η κρυφή διαδρομή`, text: mysteryFinalClue ? `${legacyClueWarning} Ο παλιός κωδικός χρησιμοποιήθηκε από μη καταχωρημένο terminal και θα μπορούσε να έχει αντιγραφεί.` : `Μόνο ο/η ${mainKiller} γνώριζε τον κωδικό της διαδρομής που χρησιμοποίησε η μάσκα.` },
      { type: "REAL CLUE", title: `${clueIdentity}: το ίχνος στο archive`, text: mysteryFinalClue ? `${legacyClueWarning} Το cloned token συνδέεται με το παλιό case, όχι με επιβεβαιωμένη παρουσία ανθρώπου.` : `Η πρόσβαση στο κλειδωμένο archive έγινε με προσωπικό token του/της ${mainKiller}.` }
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
  let motiveLine = `Όλα οδηγούν σε εσένα, ${players.join(" και ")}. Όχι επειδή τα ξεκινήσατε — επειδή ήσασταν πάντα το τέλος.`;
  if (number === 3 && returningKiller) {
    motive = "Επιστροφή για εκδίκηση";
    motiveLine = `Με είδες να πέφτω και έγραψες το τέλος μου. Εγώ έγραφα το δικό σου.`;
  } else if (number === 3 && historicalChoice) {
    motive = "Η επιλογή που δεν ξεχάστηκε";
    motiveLine = `Δεν θυμάσαι καν την επιλογή «${historicalChoice}», έτσι; Εγώ τη θυμόμουν κάθε μέρα.`;
  }

  return {
    number, title: movieTitles[number], stage: 0, cast, introCast: cast.filter(name => name !== returningKiller),
    killers, returningKiller, legacyEcho, mainKiller, motive, motiveLine, status,
    openingTarget, openingPartner, dangerA, dangerB, secondTarget,
    friendOptions, continuityFriends, newcomers: [...newcomers], friends: [], playerFriends: {}, keyHolder: null, itemKept: false, itemUsed: false, survivalItem: pick(survivalItems[number], random),
    locationChoices, locationClues, rooms, worldAsset: world.asset, protectedLegacy, fatalityTarget, openingScenario, openingKillerRoll,
    cluesFound: [], choices: [], firstSuspicion: [], midpointTheory: [], finalTheory: [], pendingTheory: [],
    pendingBet: 0, betAmount: 0, betPayout: 0, betResult: "NO BET", betSettled: false, localDecisions: {}, localDecisionHistory: [], localTheories: { midpoint: {}, final: {} }, localBets: {},
    stageResult: null, saved: [], offscreenDeaths: [], lateDeaths: [], deathOrder: [], canonMoments: [], deathsPrevented: 0, peopleSaved: 0,
    investigatedRooms: [], investigationPhase: "rooms", investigationActions: 0, dialoguedWith: [], puzzle, puzzleSolved: false, puzzleAdvantage: false, itemSaved: [], resolvedLegacyKillers: [], relationshipEvent: null, relationshipEventShown: false, accusationDebates: {},
    openingPlayerIndex: isLocalMode() ? (Math.floor(random() * players.length)) : 0,
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
  if (!name || isPlayerCharacter(name)) return;
  const previous = movie.status[name];
  movie.status[name] = status;
  if (status === "DEAD" && previous !== "DEAD") {
    movie.deathOrder ||= [];
    if (!movie.deathOrder.includes(name)) movie.deathOrder.push(name);
  }
}

function isAlive(name) { return current.movie.status[name] === "ALIVE" || current.movie.status[name] === "SAVED"; }
function isKiller(name) { return current.movie.killers.includes(name); }
function itemHeldBy(name) {
  const movie = current.movie;
  return movie.keyHolder === name || (movie.itemKept && isPlayerCharacter(name));
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
      ? record.openingOutcome === "both"
        ? `Opening: ${record.openingTarget} και ${record.openingPartner} πέθαναν.`
        : `Opening: ${record.openingTarget} και ${record.openingPartner} χωρίστηκαν· επέζησε ο/η ${record.openingOutcome === "target" ? record.openingTarget : record.openingPartner}.`
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
    const legacyCore = current.history.some(record => (record.friends || []).includes(name) && (record.survivors || []).includes(name));
    const label = isPlayerCharacter(name) ? `STARRING · PLAYER ${playerCharacters().indexOf(name) + 1}` : legacyCore ? "RETURNING · YOUR INNER CIRCLE" : index < 4 ? "ALSO STARRING" : "WITH";
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
  const sceneTools = el("span", "movie-scene-tools");
  sceneTools.append(el("span", "", sceneName), button("Relationships", "ghost mini-btn", renderRelationshipBoard));
  const playerLabel = isLocalMode() ? `${playerCharacters().join(" & ")} · LOCAL 2P` : `${current.protagonist} IS YOU`;
  top.append(el("span", "", `${movieLabel(current.movie.number)} · ${current.movie.title} · ${playerLabel}`), bar, sceneTools);
  content.append(top);
  if (isLocalMode()) {
    const turn = el("div", "turn-strip");
    turn.append(el("span", "eyebrow", "PASS-THE-PHONE"), el("strong", "", `Σειρά: ${activePlayerName()}`), el("small", "", "Ο Player 1 έχει μία extra επιλογή στην έρευνα."), button("Pass turn", "ghost mini-btn", passLocalTurn));
    content.append(turn);
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
    } else if (destination === "final-kill") {
      resolveFinalKiller();
    } else if (destination === "item-reassign") {
      renderItemReassignment();
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
  const decisionPlayer = playerCharacters()[movie.openingPlayerIndex || 0] || current.protagonist;
  content.append(scenePanel({
    name: person, time: scenario.time, image: person, tone: "red", eyebrow: `${scenario.eyebrow}${isLocalMode() ? ` · TURN: ${decisionPlayer}` : ""}`, title: scenario.title,
    body: `${scenario.body}${isLocalMode() ? ` Ο/Η ${decisionPlayer} παίρνει την πρώτη απόφαση· μετά κάντε pass turn.` : ""}`,
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
  choice = localDecision(`opening-${movie.number}`, choice);
  if (choice === null) return;
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
    relationshipState(name).trust += 10;
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
  const available = shuffle(movie.cast.filter(name => !isPlayerCharacter(name) && isAlive(name)), random);
  const continuity = (movie.continuityFriends || []).filter(name => available.includes(name));
  movie.friendOptions = distributeFriendGroups(available, continuity);
}

function refreshSceneTargets() {
  const movie = current.movie;
  const random = mulberry32((current.seed + movie.number * 1877 + movie.choices.length * 239) >>> 0);
  const available = movie.cast.filter(name => !isPlayerCharacter(name) && isAlive(name) && !isKiller(name));
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
  const gatherings = [
    ["THE SURVIVORS REGROUP", "Με ποιους θα κλειστείς απόψε;", "Οι ομάδες χωρίζονται ανάμεσα σε διαφορετικά δωμάτια. Κάποιοι συζητούν τον θάνατο· άλλοι ψάχνουν έξοδο."],
    ["A SCREENING WITHOUT A FILM", "Ποιον θέλεις δίπλα σου στο σκοτάδι;", "Ο projector ανάβει και όλοι αλλάζουν θέσεις. Η παρέα που θα διαλέξεις γίνεται το main group της νύχτας."],
    ["THE BUILDING SPLITS", "Ποιο group θα ακολουθήσεις;", "Τρεις διαδρομές ανοίγουν ταυτόχρονα. Όσοι δεν πάρεις μαζί σου συνεχίζουν μόνοι και μπορεί να μη γυρίσουν όλοι."],
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
    const card = el("article", "panel feature");
    const canonLinks = group.map(name => protagonistRelationship(name) ? `${name}: ${protagonistRelationship(name)}` : "").filter(Boolean);
    const groupCanon = canonRelationshipLines(group).filter(pair => pair.active).map(pair => `${pair.a} ↔ ${pair.b}: ${pair.type}`);
    const returning = group.filter(name => movie.continuityFriends?.includes(name));
    const continuityCopy = returning.length >= 2 ? `Η παλιά παρέα παραμένει ενωμένη: ${returning.join(", ")}. ` : "";
    const canonCopy = groupCanon.length ? `Canon δεσμός: ${groupCanon.join(" · ")}. ` : "";
    const groupCopy = `${continuityCopy}${canonCopy}${canonLinks.length ? `${canonLinks.join(" · ")} · ` : ""}${group.length} active members · κανείς δεν έμεινε εκτός group.`;
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
  group = localDecision(`group-${movie.number}`, group, values => unique(values.flat()));
  if (group === null) return;
  movie.friends = [...group];
  const groupVote = movie.localDecisionHistory?.at(-1)?.choices;
  movie.playerFriends ||= {};
  if (isLocalMode() && groupVote) {
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
  const extras = shuffle(movie.cast.filter(name => !isPlayerCharacter(name) && !group.includes(name) && !isKiller(name) && isAlive(name)), random);
  const quietNewcomers = extras.filter(name => movie.newcomers?.includes(name));
  const establishedExtras = extras.filter(name => !movie.newcomers?.includes(name));
  const orderedExtras = [...quietNewcomers, ...establishedExtras];
  const deathRoll = random();
  const largeFinaleCast = movie.number === 3 && movie.cast.length >= 16;
  const intensityCap = Math.max(0, Math.min(movie.number === 3 ? (largeFinaleCast ? 5 : 4) : 3, (movie.fatalityTarget || 4) - 2));
  const deathCount = movie.number === 3
    ? (deathRoll < (largeFinaleCast ? .10 : .16) ? 0 : deathRoll < .34 ? 1 : deathRoll < .68 ? 2 : deathRoll < .88 ? Math.min(4, intensityCap) : intensityCap)
    : (deathRoll < .18 ? 0 : deathRoll < .58 ? 1 : deathRoll < .88 ? 2 : intensityCap);
  const minimumLivingExtras = movie.number === 3 && largeFinaleCast ? 2 : 3;
  const selectedOffscreen = orderedExtras.slice(0, Math.min(deathCount, Math.max(0, orderedExtras.length - minimumLivingExtras)));
  movie.offscreenDeaths = selectedOffscreen;
  movie.offscreenDeaths.forEach(name => setStatus(name, "DEAD"));
  refreshSceneTargets();
  if (movie.offscreenDeaths.length) {
    remember(`Έμεινες με ${group.join(", ")} ενώ άλλοι χωρίστηκαν.`, `${movie.offscreenDeaths.join(" & ")} died away from the main group.`);
    queueBeat({
      kind: "death",
      eyebrow: movie.number === 3 && movie.offscreenDeaths.length > 2 ? "ELSEWHERE · MULTIPLE DEATH REPORTS" : "ELSEWHERE · DEATH REPORT",
      title: movie.offscreenDeaths.length === 1 ? "Μία φωνή λείπει από την παρέα." : `${movie.offscreenDeaths.length} δωμάτια σίγησαν.`,
      body: `Δεν τους διάλεξες για το main group. Οι ανακοινώσεις έρχονται μία-μία: ${movie.offscreenDeaths.map(name => `${name} βρέθηκε νεκρός/ή`).join(" · ")}. Οι υπόλοιποι ζουν — προς το παρόν.`,
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
  const types = grieving ? ["grief", "grief", "accusation", "vow"] : ["argument", "accusation", "vow", "confession", "rivalry"];
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
      body: relatedDead ? `Ο/Η ${event.first} θρηνεί τον/την ${relatedDead}. Ο/Η ${second} προσπαθεί να τον/την κρατήσει όρθιο/α, αλλά ο πόνος μετατρέπεται σε θυμό.` : `Ο/Η ${event.first} δεν αντέχει άλλο τους θανάτους και ξεσπά μπροστά στον/στην ${second}.`,
      choices: [`Υποσχέσου ότι θα βρείτε μαζί τον υπεύθυνο.`, `Άφησε τον/την ${second} να τον/την παρηγορήσει.`, "Πες ότι πρέπει να προχωρήσετε πριν υπάρξει άλλο θύμα."]
    },
    argument: {
      eyebrow: "ARGUMENT · THE GROUP FRACTURES", title: `${event.first} και ${second} τσακώνονται για το opening.`,
      body: `Ο/Η ${event.first} κατηγορεί τον/την ${second} ότι έκρυψε μια έξοδο. Η ένταση είναι αληθινή — αλλά μπορεί να είναι φόβος, ενοχή ή τέλεια παράσταση.`,
      choices: [`Πάρε το μέρος του/της ${event.first}.`, `Πάρε το μέρος του/της ${second}.`, "Χώρισέ τους και ζήτησε αποδείξεις."]
    },
    accusation: {
      eyebrow: "ACCUSATION · NO PROOF", title: `${event.first} δείχνει τον/την ${second}.`,
      body: `Ένα αντικείμενο βρέθηκε σε λάθος τσάντα. Κανείς δεν ξέρει αν πρόκειται για στοιχείο, παγίδα ή λάθος μέσα στον πανικό.`,
      choices: [`Πίεσε τον/την ${second} να εξηγήσει.`, `Υπερασπίσου τον/την ${second}.`, `Κράτησε και τους δύο κοντά σου μέχρι να μάθεις περισσότερα.`]
    },
    vow: {
      eyebrow: "PROTECTIVE VOW · TRUST EVENT", title: `${event.first} ορκίζεται να μη σε αφήσει μόνο/η.`,
      body: `Ο/Η ${second} αμφιβάλλει αν η υπόσχεση είναι γενναιότητα ή προσπάθεια να ελέγξει τις κινήσεις σου. Η ταυτότητα κανενός δεν αποκαλύπτεται.`,
      choices: [`Δέξου τον όρκο του/της ${event.first}.`, `Ζήτησε να προστατέψει πρώτα τον/την ${second}.`, "Μην αφήσεις κανέναν να γίνει προσωπικός σου φρουρός."]
    },
    confession: {
      eyebrow: "CONFESSION · MAYBE A LIE", title: `${event.first} παραδέχεται ότι είπε ψέματα.`,
      body: `Το ψέμα αφορά τη διαδρομή του/της πριν από τον φόνο. Ο/Η ${second} πιστεύει ότι η εξήγηση είναι μισή αλήθεια.`,
      choices: [`Κράτησε το μυστικό του/της ${event.first}.`, `Ανάγκασε τον/την ${event.first} να το πει σε όλους.`, `Ζήτησε από τον/την ${second} να ελέγξει την ιστορία.`]
    },
    rivalry: {
      eyebrow: "RIVALRY · LOYALTY TEST", title: `${event.first} και ${second} θέλουν να οδηγήσουν την ομάδα.`,
      body: "Και οι δύο προτείνουν διαφορετική διαδρομή. Καμία δεν είναι αποδεδειγμένα ασφαλής και η απόφασή σου θα αλλάξει ποιος νιώθει ότι τον εμπιστεύεσαι.",
      choices: [`Ακολούθησε τον/την ${event.first}.`, `Ακολούθησε τον/την ${second}.`, "Συνδύασε τα σχέδια και κράτησε εσύ τον έλεγχο."]
    }
  };
  if (event.type === "canon") {
    const partners = event.relation.includes("Σύντροφοι") || event.relation.includes("Αδέλφ") || event.relation.includes("Αδελφ");
    scenes.canon = {
      eyebrow: `CANON BOND · ${event.relation.toUpperCase()}`,
      title: `${event.first} και ${second} κινούνται σαν ένα.`,
      body: partners
        ? `Ο/Η ${event.first} και ο/η ${second} αρνούνται να χωριστούν. Ξέρουν ο ένας τις κινήσεις του άλλου, μοιράζονται το ρίσκο και μπορούν να σε τραβήξουν μαζί τους σε μια επικίνδυνη διαδρομή.`
        : `Ο/Η ${event.first} και ο/η ${second} έχουν δεσμό που προϋπήρχε της ταινίας. Η απώλεια ή η σωτηρία του ενός θα αλλάξει αμέσως τη στάση του άλλου.`,
      choices: [
        `Στείλε τους μαζί να ερευνήσουν τη διαδρομή.`,
        `Κράτησε τον/την ${event.first} δίπλα σου και ζήτησε από τον/την ${second} να περιμένει.`,
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
  if (choiceIndex === null) return;
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
  const appliedVotes = isLocalMode() && localVoteSet
    ? playerCharacters().map(player => applyRelationshipVote(player, localVoteSet[player]))
    : [applyRelationshipVote(activePlayerName(), choiceIndex)];
  favored = appliedVotes.at(-1).favored;
  strained = appliedVotes.at(-1).strained;
  if (event.type === "canon") {
    movie.canonMoments ||= [];
    movie.canonMoments.push({ pair: [first, second], relation: event.relation, choice: choiceIndex + 1, localChoices: localVoteSet || null });
  }
  movie.relationshipEventShown = true;
  remember(`Relationship event: ${event.type} — επιλογή ${choiceIndex + 1}.`, `${favored} felt supported; ${strained} reacted unpredictably.`);
  queueBeat({
    kind: event.type === "argument" || event.type === "accusation" ? "twist" : "dialogue",
    eyebrow: twist > .78 ? "RELATIONSHIP TWIST · NOT THE EXPECTED REACTION" : "RELATIONSHIP SHIFT",
    title: twist > .78 ? `${strained} θυμάται ότι στάθηκες δίπλα του/της.` : `${favored} έρχεται πιο κοντά σου.`,
     body: event.type === "canon"
       ? `Ο δεσμός ${event.relation} γράφεται στο canon της ταινίας. Οι δυο τους θα έχουν αυξημένη πιθανότητα να βρεθούν μαζί, να ανταλλάξουν βοήθεια και να επηρεάσουν ο ένας τη διάσωση του άλλου.`
       : `Η σκηνή αλλάζει trust, friendship και loyalty χωρίς να αποκαλύπτει ποιος λέει αλήθεια. ${strained} μπορεί να είναι πληγωμένος/η, φοβισμένος/η ή να παίζει ρόλο.`,
    names: unique([first, second]), statuses: unique([first, second]).map(name => name === favored ? "BOND STRENGTHENED" : "TENSION"), roomOffset: 1,
    cta: "Συνέχισε με την ομάδα"
  }, 3);
}

function renderKeyChoice() {
  const movie = current.movie;
  if (movie.relationshipEvent && !movie.relationshipEventShown) return renderRelationshipEvent();
  const candidates = friendsForPlayer().filter(name => !isPlayerCharacter(name) && isAlive(name) && !isKiller(name));
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
      ...candidates.slice(0, 6).map(name => ({ label: `Δώσε το ${movie.survivalItem} στον/στην ${name}.`, action: () => giveKey(name) })),
      { label: `Κράτησέ το πάνω σου μέχρι τη σύγκρουση.`, action: finalizeKeptItem }
    ], cameos: candidates.slice(0, 3)
  }));
}

function finalizeKeptItem() {
  const movie = current.movie;
  const keepDecision = localDecision(`item-finalize-${movie.number}`, true);
  if (keepDecision === null) return;
  movie.itemReassigning = false;
  movie.keyHolder = null;
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
  name = localDecision(`item-${movie.number}`, name);
  if (name === null) return;
  movie.keyHolder = name;
  movie.itemKept = !name;
  movie.itemReassigning = false;
  movie.itemUsed = false;
  if (name) {
    relationshipState(name).trust += 18;
    remember(`Έδωσες το ${movie.survivalItem} στον/στην ${name}.`, "The item now changes the rescue odds, the identity of the next target and the finale.");
  } else remember(`Κράτησες το ${movie.survivalItem}.`, "Θα σου προσφερθεί αμέσως δεύτερη επιλογή παραλήπτη εκτός της πρώτης παρέας.");
  refreshSceneTargets();
  if (!name) movie.itemReassigning = true;
  queueBeat({
    kind: "action",
    eyebrow: "OBJECT IN PLAY",
    title: name ? `${name} παίρνει το ${movie.survivalItem}.` : `Το ${movie.survivalItem} μένει πάνω σου.`,
    body: name ? `Το αντικείμενο αλλάζει χέρια. Ο/Η ${name} θυμάται ότι τον/την εμπιστεύτηκες — και μπορεί να το χρησιμοποιήσει όταν εσύ δεν θα είσαι εκεί.` : "Το κράτησες πάνω σου. Μόλις τελειώσει αυτή η στιγμή, θα διαλέξεις αμέσως άλλον ζωντανό άνθρωπο για να του το εμπιστευτείς — ή θα το κρατήσεις μέχρι την επίθεση.",
    names: name ? [name] : [current.protagonist], statuses: [name ? "TRUST +18 · ITEM HOLDER" : "ITEM KEPT · NEW RESCUE TARGETS"], roomOffset: 1
  }, name ? 4 : "item-reassign");
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
  location = localDecision(`room-${movie.number}-${movie.investigationActions}`, location);
  if (location === null) return;
  const clue = movie.locationClues[location];
  if (!movie.investigatedRooms.includes(location)) movie.investigatedRooms.push(location);
  if (!movie.cluesFound.includes(clue)) movie.cluesFound.push(clue);
  movie.investigationActions += 1;
  movie.investigationPhase = movie.investigationActions >= 3 ? "done" : "followup";
  relationshipState(clue.title.split(":")[0]).suspicion += 18;
  remember(`Έψαξες: ${location}.`, `Found ${clue.type}: ${clue.title}.`);
  queueBeat({
    kind: clue.type === "REAL CLUE" ? "clue" : "twist",
    eyebrow: `${clue.type} · CASE FILE UPDATED`,
    title: clue.title,
    body: `${clue.text} Το στοιχείο μπαίνει στο προσωπικό σου case file — αλλά η ερμηνεία του μπορεί ακόμη να σε οδηγήσει στον λάθος άνθρωπο.`,
    names: [clue.title.split(":")[0]], statuses: [clue.type],
    room: movie.rooms.find(item => item.name === location), cta: movie.investigationActions >= 3 ? "Προχώρησε στην επίθεση" : "Διάλεξε την επόμενη κίνηση"
  }, movie.investigationActions >= 3 ? 5 : 4);
}

function renderInvestigationFollowup() {
  const movie = current.movie;
  const unsearched = movie.locationChoices.filter(([location]) => !movie.investigatedRooms.includes(location));
  const dialogueCandidates = movie.cast
    .filter(name => !isPlayerCharacter(name) && name !== movie.legacyEcho && name !== "LEGACY GHOST" && isAlive(name) && !movie.dialoguedWith.includes(name))
    .sort((a, b) => (protagonistRelationship(b) ? 1 : 0) - (protagonistRelationship(a) ? 1 : 0))
    .slice(0, isLocalMode() && (current.activePlayerIndex || 0) === 0 ? 3 : 2);
  const focus = dialogueCandidates[0] || supportingVoices([], 1)[0] || current.protagonist;
  const choices = [];
  if (unsearched[0]) choices.push({ label: `Ερεύνησε και το «${unsearched[0][0]}».`, action: () => { movie.investigationPhase = "rooms"; saveCurrent(); renderMovie(); } });
  dialogueCandidates.forEach(name => choices.push({ label: `Μίλησε ιδιωτικά με τον/την ${name}${protagonistRelationship(name) ? ` — ${protagonistRelationship(name)}` : ""}.`, action: () => talkAfterInvestigation(name) }));
  if (!movie.puzzleSolved) choices.push({ label: `Λύσε το puzzle: «${movie.puzzle.title}».`, action: () => { movie.investigationPhase = "puzzle"; saveCurrent(); renderMovie(); } });
  choices.push({ label: "Προχώρα τώρα χωρίς άλλη έρευνα · SKIP", action: () => { movie.investigationPhase = "done"; advance(5); } });
  const content = movieScreen("INVESTIGATE OR TALK", 43);
  content.append(scenePanel({
    name: focus, time: "12:44 AM", image: focus, room: roomFor(2), tone: "cold",
    eyebrow: `THE CASE OPENS UP · ${movie.investigationActions}/3 ACTIONS`, title: "Διάλεξε την επόμενη κίνηση.",
    body: "Έχεις έως τρεις actions συνολικά: δωμάτιο, puzzle ή συζήτηση. Μπορείς να τα συνδυάσεις όπως θέλεις ή να πατήσεις SKIP και να προχωρήσεις.",
    choices, cameos: dialogueCandidates
  }));
}

function talkAfterInvestigation(name) {
  const movie = current.movie;
  name = localDecision(`investigation-talk-${movie.number}-${movie.investigationActions}`, name);
  if (name === null) return;
  movie.dialoguedWith.push(name);
  movie.investigationActions += 1;
  movie.investigationPhase = movie.investigationActions >= 3 ? "done" : "followup";
  const relation = protagonistRelationship(name);
  relationshipState(name).trust += relation ? 18 : 10;
  relationshipState(name).friendship += relation ? 14 : 8;
  const sabotage = isKiller(name);
  if (sabotage) relationshipState(name).suspicion = Math.max(0, relationshipState(name).suspicion - 8);
  remember(`Μίλησες ιδιωτικά με τον/την ${name}.`, sabotage ? "They subtly redirected the investigation." : "Their trust and survival odds improved.");
  queueBeat({
    kind: sabotage ? "sabotage" : "dialogue",
    eyebrow: relation ? `CANON RELATIONSHIP · ${relation}` : "PRIVATE CONVERSATION",
    title: sabotage ? `${name} σου δίνει ένα στοιχείο που μοιάζει υπερβολικά τέλειο.` : `${name} αποφασίζει να σε εμπιστευτεί.`,
    body: sabotage ? "Η πληροφορία ανοίγει νέα διαδρομή, αλλά μετακινεί αθόρυβα την υποψία μακριά από τον πραγματικό killer." : `Ο/Η ${name} αποκαλύπτει τι είδε ανάμεσα στα δωμάτια. Η συζήτηση αυξάνει τις πιθανότητες να συνεργαστεί — και να επιζήσει — αργότερα.`,
    names: [name], statuses: [sabotage ? "UNRELIABLE CLUE" : "TRUST INCREASED"], roomOffset: 2
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
  if (answerIndex === null) return;
  const correct = answerIndex === movie.puzzle.correct;
  movie.puzzleSolved = true;
  movie.puzzleAdvantage = correct;
  movie.investigationActions += 1;
  movie.investigationPhase = movie.investigationActions >= 3 ? "done" : "followup";
  remember(`Puzzle: ${movie.puzzle.title} — ${movie.puzzle.answers[answerIndex]}.`, correct ? "Solved correctly." : "Wrong route opened.");
  queueBeat({
    kind: correct ? "clue" : "twist", eyebrow: correct ? "PUZZLE SOLVED" : "WRONG ANSWER · NEW DANGER",
    title: correct ? "Ο κρυφός μηχανισμός ανοίγει." : "Ο χάρτης σε οδηγεί σε παγίδα.",
    body: correct ? `${movie.puzzle.clue} Το πλεονέκτημα θα αυξήσει τις πιθανότητες διάσωσης αργότερα.` : "Η λάθος επιλογή δεν τελειώνει το παιχνίδι, αλλά ο killer αποκτά καλύτερη θέση για την επόμενη επίθεση.",
    names: supportingVoices([], 2), statuses: supportingVoices([], 2).map(() => correct ? "ROUTE FOUND" : "EXPOSED"), roomOffset: 3
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
      ? `Το ${movie.survivalItem} βρίσκεται με τον/την ${movie.keyHolder}. Η επιλογή της διαδρομής θα κρίνει αν θα προλάβει να το χρησιμοποιήσει.`
      : "Οι δύο διαδρομές ανοίγουν μαζί και κανείς δεν είναι πραγματικά ασφαλής.";
  content.append(scenePanel({
    name: `${movie.dangerA} / ${movie.dangerB}`, time: "01:18 AM", image: movie.dangerA, tone: "red", eyebrow: "YOU CANNOT REACH BOTH", title: "Δύο κραυγές. Δύο διάδρομοι.",
    body: `${targetLine} Ο/Η ${movie.dangerA} είναι παγιδευμένος/η στο «${leftRoom.name}». Ο/Η ${movie.dangerB} τρέχει προς το «${rightRoom.name}». Πρέπει να διαλέξεις.`,
    choices: [
      { label: `Τρέξε στο «${leftRoom.name}» για τον/την ${movie.dangerA}.`, action: () => rescueChoice(movie.dangerA, movie.dangerB) },
      { label: `Πήγαινε στο «${rightRoom.name}» για τον/την ${movie.dangerB}.`, action: () => rescueChoice(movie.dangerB, movie.dangerA) }
    ]
  }));
}

function rescueChoice(savedName, leftName) {
  const movie = current.movie;
  const selectedName = localDecision(`rescue-${movie.number}`, savedName);
  if (selectedName === null) return;
  savedName = selectedName;
  leftName = savedName === movie.dangerA ? movie.dangerB : movie.dangerA;
  const random = mulberry32((current.seed + movie.number * 5431 + savedName.length * 317 + leftName.length * 149 + movie.choices.length) >>> 0);
  const chosenTrust = Math.min(.14, Math.max(0, relationshipState(savedName).trust) / 500);
  const leftLoyalty = Math.min(.14, Math.max(0, relationshipState(leftName).loyalty) / 450);
  const canonBondBonus = relationshipBetween(savedName, leftName) ? .10 : 0;
  const chosenItemBonus = !isKiller(savedName) && (itemHeldBy(savedName) ? .34 : movie.itemKept ? .24 : 0);
  const leftItemBonus = !isKiller(leftName) && (itemHeldBy(leftName) ? .76 : movie.itemKept ? .18 : 0);
  const weaponBonus = playerHasWeapon() ? .12 : 0;
  const puzzleBonus = movie.puzzleAdvantage ? .12 : 0;
  const chosenLives = survivalRoll(savedName, Math.min(.98, .66 + chosenTrust + chosenItemBonus + puzzleBonus + canonBondBonus + weaponBonus), random);
  const leftLives = survivalRoll(leftName, Math.min(.96, .12 + leftLoyalty + leftItemBonus + puzzleBonus / 2 + canonBondBonus / 2 + weaponBonus), random);
  const outcomes = [[savedName, chosenLives], [leftName, leftLives]];
  outcomes.forEach(([name, lives]) => {
    if (lives) {
      setStatus(name, "SAVED");
      if (!movie.saved.includes(name)) { movie.saved.push(name); movie.peopleSaved += 1; }
      movie.deathsPrevented += 1;
    } else setStatus(name, "DEAD");
  });
  const living = outcomes.filter(([, lives]) => lives).map(([name]) => name);
  const dead = outcomes.filter(([, lives]) => !lives).map(([name]) => name);
  if (isLocalMode()) {
    const rescueVotes = movie.localDecisionHistory?.at(-1)?.choices || {};
    playerCharacters().forEach(player => {
      const votedFor = rescueVotes[player];
      if (living.includes(votedFor)) relationshipState(votedFor, player).trust += 22;
    });
  } else if (chosenLives) relationshipState(savedName).trust += 22;
  [savedName, leftName].forEach(name => {
    if (isAlive(name) && (itemHeldBy(name) || movie.itemKept) && !movie.itemSaved.includes(name)) movie.itemSaved.push(name);
  });
  if (movie.itemKept && living.length) movie.itemUsed = true;
  remember(`Έτρεξες προς τον/την ${savedName}, αφήνοντας τον/την ${leftName}.`, `Survived: ${living.join(" & ") || "none"}. Died: ${dead.join(" & ") || "none"}.`);
  const bothLive = living.length === 2;
  const bothDead = dead.length === 2;
  queueBeat({
    kind: dead.length ? "death" : "rescue",
    eyebrow: bothLive ? "DOUBLE SAVE · THE ODDS SHIFTED" : bothDead ? "THE CHOICE WAS A TRAP" : "ONE SURVIVOR · NOT THE EXPECTED ONE",
    title: bothLive ? "Και οι δύο βγήκαν ζωντανοί." : bothDead ? "Κανείς δεν βγήκε από τα δωμάτια." : `${living[0]} επέζησε. ${dead[0]} πέθανε.`,
    body: bothLive
      ? `Trust, puzzle knowledge${canonBondBonus ? ", ο canon δεσμός και η κοινή τους κάλυψη" : ""} και το ${movie.survivalItem} άλλαξαν τις πιθανότητες. Η επιλογή δεν είχε προκαθορισμένο αποτέλεσμα.`
      : bothDead
        ? "Ο killer είχε προβλέψει τη διαδρομή σου. Ακόμη και το άτομο που επέλεξες να σώσεις μπορούσε να πεθάνει."
        : `${movie.itemSaved.some(name => living.includes(name)) ? `Το ${movie.survivalItem} άλλαξε άμεσα τις πιθανότητες για ${living.filter(name => movie.itemSaved.includes(name)).join(" και ")}. ` : ""}${canonBondBonus ? `Ο δεσμός τους κράτησε ανοιχτή μια δεύτερη διαδρομή. ` : ""}Το αποτέλεσμα προέκυψε από σχέσεις, στοιχεία, το αντικείμενο και κρυφό probability roll — όχι από σταθερό A/B outcome.`,
    names: [savedName, leftName], statuses: [movie.status[savedName], movie.status[leftName]], roomOffset: 1,
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
  const innocents = movie.cast.filter(name => !isPlayerCharacter(name) && isAlive(name) && !movie.killers.includes(name));
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
  const statements = speakers.map((speaker, index) => {
    const localRandom = mulberry32((current.seed + movie.number * 97 + speaker.length * 613 + index * 1777) >>> 0);
    const shouldTellTruth = Boolean(visibleKillers.length) && (index === 0 || localRandom() > .42);
    const truthfulTarget = pick(visibleKillers.filter(name => name !== speaker), localRandom);
    const bluffTarget = pick(innocents.filter(name => name !== speaker), localRandom);
    const target = (shouldTellTruth ? truthfulTarget : bluffTarget) || truthfulTarget || bluffTarget || "LEGACY GHOST";
    const truthful = Boolean(target && target !== "LEGACY GHOST" && movie.killers.includes(target) && shouldTellTruth);
    const targetLine = target === "LEGACY GHOST" ? "ένα παλιό πρόσωπο από το case file" : `τον/την ${target}`;
    return {
      speaker,
      target,
      truthful,
      text: `«Πιστεύω ότι είναι ${targetLine}, γιατί ${observations[(index + speaker.length) % observations.length]}. ${endings[(index * 2 + speaker.length) % endings.length]}»`
    };
  });
  movie.accusationDebates[kind] = statements;
  return statements;
}

function theoryForPlayer(kind, name = activePlayerName()) {
  const movie = current.movie;
  if (!isLocalMode()) return movie.pendingTheory;
  movie.localTheories ||= { midpoint: {}, final: {} };
  return movie.localTheories[kind][name] ||= [];
}

function betForPlayer(name = activePlayerName()) {
  const movie = current.movie;
  if (!isLocalMode()) return movie.pendingBet || 0;
  movie.localBets ||= {};
  return movie.localBets[name] || 0;
}

function renderAccusation(kind) {
  const movie = current.movie;
  const isFinal = kind === "final";
  const localPlayer = activePlayerName();
  const pendingTheory = theoryForPlayer(kind, localPlayer);
  const content = movieScreen(isFinal ? "FINAL THEORY" : "MIDPOINT THEORY", isFinal ? 78 : 58);
  const wrap = el("div", "content");
  wrap.append(el("p", "eyebrow", isFinal ? "ACT III IS WAITING" : "WHO DO YOU SUSPECT?"), el("h1", "headline", isFinal ? "Κλείδωσε την τελική σου θεωρία." : "Ποιος βρίσκεται πίσω από τους φόνους;"));
  if (isLocalMode()) wrap.append(el("p", "decision-warning", `TURN · ${localPlayer} · Κλείδωσε τη δική σου θεωρία. Μετά αποφασίζει ο/η ${playerCharacters().find(name => name !== localPlayer) || localPlayer}.`));
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
  movie.cast.filter(name => !isPlayerCharacter(name) && movie.status[name] !== "DEAD").forEach(name => {
    const selected = pendingTheory.includes(name);
    grid.append(characterButton(name, () => toggleSuspect(name, kind), selected, "suspect-card"));
  });
  if (isFinal && movie.number === 3) {
    const ghostSelected = pendingTheory.includes("LEGACY GHOST");
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
    const availableCredits = isLocalMode() ? (current.playerCredits[localPlayer] || 0) : current.credits;
    bet.append(el("p", "eyebrow", "FICTIONAL BET · NO REAL MONEY"), el("h2", "", `Πόνταρε ο/η ${localPlayer}`), el("p", "", `Διαθέσιμα: ${availableCredits} Slasher Credits. Ακριβής θεωρία πληρώνει 2×. Μερική επιτυχία επιστρέφει το αντίστοιχο ποσοστό.`));
    const controls = el("div", "bet-controls");
    const input = el("input", "bet-input");
    input.type = "number"; input.inputMode = "numeric"; input.min = "0"; input.max = String(availableCredits); input.step = "10"; input.value = String(Math.min(betForPlayer(localPlayer), availableCredits));
    input.setAttribute("aria-label", "Ποσό πονταρίσματος σε Slasher Credits");
    input.addEventListener("input", () => {
      const amount = Math.max(0, Math.min(availableCredits, Math.floor(Number(input.value) || 0)));
      if (isLocalMode()) movie.localBets[localPlayer] = amount; else movie.pendingBet = amount;
    });
    controls.append(input);
    [100, 250].filter(amount => amount <= availableCredits).forEach(amount => {
      const chip = button(String(amount), "ghost bet-chip", () => { if (isLocalMode()) movie.localBets[localPlayer] = amount; else movie.pendingBet = amount; input.value = String(amount); });
      controls.append(chip);
    });
    controls.append(button("MAX", "ghost bet-chip", () => { if (isLocalMode()) movie.localBets[localPlayer] = availableCredits; else movie.pendingBet = availableCredits; input.value = String(availableCredits); }));
    bet.append(controls, el("small", "bet-disclaimer", "Τα Slasher Credits είναι αποκλειστικά μέρος του παιχνιδιού. Δεν υπάρχει κατάθεση, πληρωμή ή πραγματικό χρηματικό έπαθλο."));
    wrap.append(bet);
  }
  const footer = el("div", "selection-footer");
  footer.append(el("p", "", pendingTheory.length ? `Επιλογές ${localPlayer}: ${pendingTheory.join(", ")}` : `${localPlayer} δεν έχει επιλέξει ακόμη.`));
  const lock = button("Κλείδωσε θεωρία", "", () => lockTheory(kind), true);
  lock.disabled = pendingTheory.length < 1 || pendingTheory.length > 4;
  footer.append(lock);
  wrap.append(footer);
  content.append(wrap);
}

function toggleSuspect(name, kind) {
  const list = theoryForPlayer(kind);
  const index = list.indexOf(name);
  if (index >= 0) list.splice(index, 1);
  else if (list.length < 4) list.push(name);
  else return toast("Μπορείς να κατηγορήσεις μέχρι 4 άτομα.");
  renderAccusation(kind);
}

function lockTheory(kind) {
  const movie = current.movie;
  const player = activePlayerName();
  const theory = [...theoryForPlayer(kind, player)];
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
      toast(`${player} κλείδωσε τη θεωρία. Τώρα παίζει ο/η ${activePlayerName()}.`);
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
        body: `Οι δύο παίκτες κλείδωσαν ανεξάρτητες θεωρίες: ${playerCharacters().map(name => `${name}: ${movie.localTheories.midpoint[name].join(", ")}`).join(" · ")}.`,
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
    body: `${relation ? `Ο/Η ${focus} είναι ${relation.toLowerCase()} μαζί σου και η κοινή σας ιστορία βαραίνει την απόφαση. ` : ""}Σου ζητάει να δει το στοιχείο. Αν το μοιραστείς, ίσως αποκτήσεις σύμμαχο — ή δώσεις στον killer ακριβώς ό,τι χρειάζεται.`,
    choices: [
      { label: `Δείξε το στοιχείο στον/στην ${focus}.`, action: () => trustChoice(focus, true) },
      { label: "Κράτησέ το μυστικό μέχρι να είσαι βέβαιος/η.", action: () => trustChoice(focus, false) }
    ]
  }));
}

function trustChoice(name, shared) {
  const movie = current.movie;
  const trustVote = localDecision(`trust-${movie.number}`, { name, shared }, values => values.at(-1));
  if (trustVote === null) return;
  name = trustVote.name;
  shared = trustVote.shared;
  const localTrustVotes = movie.localDecisionHistory?.at(-1)?.choices;
  const localTrustApplied = isLocalMode() && localTrustVotes;
  if (localTrustApplied) {
    playerCharacters().forEach(player => {
      const vote = localTrustVotes[player];
      const state = relationshipState(vote.name, player);
      if (vote.shared) {
        state.trust += 22;
        state.knowledge += 26;
        state.loyalty += 12;
      } else state.suspicion += 14;
    });
  }
  let beatBody;
  let beatKind = "dialogue";
  if (shared) {
    if (!localTrustApplied) {
      relationshipState(name).trust += 22;
      relationshipState(name).knowledge += 26;
      relationshipState(name).loyalty += 12;
    }
    remember(`Μοιράστηκες το στοιχείο με τον/την ${name}.`, `${name} knows what you found.`);
    if (isKiller(name)) {
      beatKind = "sabotage";
      beatBody = `Μοιράζεσαι το clue. Δευτερόλεπτα αργότερα, το ρεύμα κόβεται και ένα κρίσιμο αρχείο εξαφανίζεται. Κάποιος στη συζήτηση ήξερε ακριβώς τι να σαμποτάρει.`;
    } else beatBody = `Ο/Η ${name} διαβάζει το clue και σου αποκαλύπτει μια κρυφή διαδρομή μέσα από το «${roomFor(1).name}». Η εμπιστοσύνη σας θα συνεχίσει στις επόμενες ταινίες αν επιζήσει.`;
  } else {
    if (!localTrustApplied) relationshipState(name).suspicion += 14;
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
  rescue = localDecision(`second-attack-${movie.number}`, rescue);
  if (rescue === null) return;
  const target = movie.secondTarget;
  const random = mulberry32((current.seed + movie.number * 6823 + target.length * 211 + (rescue ? 19 : 41)) >>> 0);
  const itemBonus = !isKiller(target) && (itemHeldBy(target) ? .72 : movie.itemKept ? .32 : 0);
  const weaponBonus = playerHasWeapon() ? .12 : 0;
  const relationBonus = Math.min(.15, Math.max(0, relationshipState(target).loyalty + relationshipState(target).trust) / 700);
  const puzzleBonus = movie.puzzleAdvantage ? .12 : 0;
  const survivalChance = Math.min(.96, (rescue ? .64 : .10) + itemBonus + relationBonus + puzzleBonus + weaponBonus);
  const survived = survivalRoll(target, survivalChance, random);
  if (survived) {
    setStatus(target, "SAVED");
    if (!movie.saved.includes(target)) { movie.saved.push(target); movie.peopleSaved += 1; }
    movie.deathsPrevented += 1;
    if (rescue) {
      if (isLocalMode()) {
        const attackVotes = movie.localDecisionHistory?.at(-1)?.choices || {};
        playerCharacters().forEach(player => { if (attackVotes[player]) relationshipState(target, player).trust += 26; });
      } else relationshipState(target).trust += 26;
    }
    if (itemBonus && !movie.itemSaved.includes(target)) movie.itemSaved.push(target);
    if (itemBonus && movie.itemKept) movie.itemUsed = true;
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
      : `${rescue ? "Έτρεξες προς την παγίδα, αλλά ο killer είχε αλλάξει τη διαδρομή." : "Δεν πήγες — και αυτή τη φορά δεν υπήρχε έξοδος."} Ο θάνατος επιβεβαιώνεται και η ιστορία προχωρά χωρίς επιστροφή.`,
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
  if (isLocalMode()) {
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
  if (movie.number === 3) {
    stopMusic();
    playKillerMemorialScore();
  }
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
  if (isLocalMode() && movie.localBetResults) {
    const localResults = el("article", "panel reveal-bet partial");
    localResults.append(el("small", "", "LOCAL 2P BET RESULTS"));
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
  actions.append(button("Μπες στο τελικό chase", "", () => advance(11)));
  content.append(actions);
  root.append(content);
}

function renderFinale() {
  const movie = current.movie;
  const discovered = identifiedKillers(movie).length;
  const closest = friendsForPlayer().filter(name => isAlive(name) && !isKiller(name))[0] || movie.cast.find(name => !isPlayerCharacter(name) && isAlive(name) && !isKiller(name));
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
  choice = localDecision(`finale-${movie.number}`, choice);
  if (choice === null) return;
  const perfect = discovered === movie.killers.length;
  const finaleRandom = mulberry32((current.seed + movie.number * 12289 + movie.choices.length * 173) >>> 0);
  if (closest) {
    const relationshipBonus = Math.min(.16, Math.max(0, relationshipState(closest).loyalty + relationshipState(closest).trust) / 650);
    const itemBonus = !isKiller(closest) && (itemHeldBy(closest) ? .34 : movie.itemKept ? .28 : 0);
    const weaponBonus = playerHasWeapon() ? .12 : 0;
    const baseChance = choice === "friend" ? .62 : choice === "trap" ? .38 : .46;
    const theoryBonus = perfect ? .20 : discovered ? .08 : 0;
    const lives = survivalRoll(closest, Math.min(.96, baseChance + relationshipBonus + itemBonus + weaponBonus + theoryBonus + (movie.puzzleAdvantage ? .08 : 0)), finaleRandom);
    setStatus(closest, lives ? "SAVED" : "DEAD");
    if (lives && !movie.saved.includes(closest)) { movie.saved.push(closest); movie.peopleSaved += 1; }
    if (lives && itemBonus && !movie.itemSaved.includes(closest)) movie.itemSaved.push(closest);
    if (lives && itemBonus && movie.itemKept) movie.itemUsed = true;
    remember(
      choice === "friend" ? `Στο finale έτρεξες πρώτα προς τον/την ${closest}.` : choice === "trap" ? "Ενεργοποίησες την παγίδα στο Act III." : "Προσποιήθηκες ότι παραδίνεσαι.",
      `${closest} ${lives ? "survived" : "died"}; the outcome used theory, relationship, item and a hidden roll.`
    );
  } else remember("Αντιμετώπισες το finale μόνος/η.", perfect ? "The full theory improved the final odds." : "The killers controlled the room until the last cut.");
  const deathsSoFar = movie.cast.filter(name => movie.status[name] === "DEAD").length;
  const remainingFatalities = Math.max(0, (movie.fatalityTarget || 4) - deathsSoFar);
  const latePool = movie.number === 3
    ? [
      ...shuffle(movie.cast.filter(name => movie.newcomers?.includes(name) && !isPlayerCharacter(name) && !isKiller(name) && isAlive(name) && name !== closest), finaleRandom),
      ...shuffle(movie.cast.filter(name => !movie.newcomers?.includes(name) && !isPlayerCharacter(name) && !isKiller(name) && isAlive(name) && name !== closest), finaleRandom)
    ]
    : shuffle(movie.cast.filter(name => !isPlayerCharacter(name) && !isKiller(name) && isAlive(name) && name !== closest), finaleRandom);
  const lateCandidates = latePool.filter(name => {
    if ((itemHeldBy(name) || movie.itemSaved.includes(name)) && !isKiller(name) && finaleRandom() < .88) {
      if (!movie.itemSaved.includes(name)) movie.itemSaved.push(name);
      movie.deathsPrevented += 1;
      return false;
    }
    return true;
  });
  movie.lateDeaths = lateCandidates.slice(0, remainingFatalities);
  movie.lateDeaths.forEach(name => setStatus(name, "DEAD"));
  if (movie.lateDeaths.length) remember(`Το τελικό χάος στο ${roomFor(2).name} είχε κι άλλα θύματα.`, `${movie.lateDeaths.join(" & ")} died during the final chase.`);
  if (movie.number === 3) {
    movie.finalKiller = movie.killers.at(-1) || movie.mainKiller;
    queueBeat({
      kind: "execution",
      eyebrow: "ONE LAST BODY · YOUR HAND",
      title: movie.finalKiller ? `Ο/Η ${movie.finalKiller} δεν θα φύγει ζωντανός/ή.` : "Η μάσκα έπεσε για πάντα.",
      body: movie.finalKiller
        ? `Η τελευταία επιλογή άνοιξε την έξοδο, αλλά ο/η ${movie.finalKiller} βρίσκεται ακόμη απέναντί σου. Δεν υπάρχει άλλη αναβολή. Αυτή τη φορά το τελικό χτύπημα είναι δικό σου.`
        : "Η τελευταία μάσκα έπεσε. Το final cut χρειάζεται μόνο μία κίνηση για να τελειώσει.",
      names: movie.finalKiller ? [movie.finalKiller] : [],
      statuses: movie.finalKiller ? ["CORNERED · FINAL KILL"] : [],
      roomOffset: 2,
      cta: movie.finalKiller ? `Σκότωσε τον/την ${movie.finalKiller}` : "Κλείσε την ιστορία"
    }, "final-kill");
    return;
  }
  finishFinaleResolution();
}

function resolveFinalKiller() {
  const movie = current.movie;
  const finalKiller = movie.finalKiller || movie.killers.at(-1) || movie.mainKiller;
  movie.finalKiller = finalKiller || null;
  if (finalKiller) {
    playSfx("slash");
    navigator.vibrate?.([120, 55, 220]);
    remember(`Έδωσες εσύ το τελευταίο χτύπημα στον/στην ${finalKiller}.`, "The final killer was killed in the final scene, not merely marked dead in the statistics.");
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
  playerCharacters().forEach(name => setStatus(name, "ALIVE"));
  movie.completed = true;
  createMovieRecord();
  const lost = unique([...movie.cast, ...(movie.resolvedLegacyKillers || [])]).filter(name => movie.status[name] === "DEAD");
  const killersConfirmedDead = unique([...(movie.resolvedLegacyKillers || []), ...movie.killers]);
  queueBeat({
    kind: "finale",
    eyebrow: movie.number === 3 ? "FINAL CUT · THE NIGHT ENDS" : "FINAL CUT · EVIL FALLS",
    title: movie.number === 3 ? "Οι μάσκες πέφτουν για πάντα." : "Οι killers χάνονται μέσα στη φωτιά.",
    body: movie.number === 3
      ? `${movie.finalKiller ? `Εσύ έδωσες το τελευταίο χτύπημα στον/στην ${movie.finalKiller}. ` : ""}Η ιστορία τελειώνει οριστικά. ${killersConfirmedDead.join(", ")} καταγράφονται πλέον ως CONFIRMED DEAD. Όσοι παλιοί killers δεν επέστρεψαν, δεν γύρισαν επειδή είχαν πράγματι πεθάνει· το PRESUMED DEAD κλείνει εδώ. ${lost.length ? `Στη διάρκεια της ταινίας και της τελικής έρευνας επιβεβαιώθηκαν νεκροί: ${lost.join(", ")}.` : "Δεν υπήρξαν άλλα θύματα."} ${movie.itemSaved.length ? `Το ${movie.survivalItem} βοήθησε να σωθούν: ${movie.itemSaved.join(", ")}.` : ""}`
      : `Οι ${movie.killers.length === 1 ? "killer καταγράφεται" : "killers καταγράφονται"} ως PRESUMED DEAD. Δεν θα εμφανιστούν ως κανονικοί χαρακτήρες στην επόμενη ταινία. Μόνο το Movie III μπορεί να κρύβει έναν — και δεν θα το μάθεις πριν το reveal. ${lost.length ? `Στη διάρκεια της νύχτας χάθηκαν επίσης: ${lost.join(", ")}.` : "Οι υπόλοιποι κατάφεραν να επιζήσουν."} ${movie.itemSaved.length ? `Το ${movie.survivalItem} προστάτευσε: ${movie.itemSaved.join(", ")}.` : ""}`,
    names: movie.number === 3 ? unique([...movie.lateDeaths, ...killersConfirmedDead]) : [...movie.lateDeaths, ...movie.killers],
    statuses: movie.number === 3 ? unique([...movie.lateDeaths, ...killersConfirmedDead]).map(() => "DEAD") : [...movie.lateDeaths.map(() => "DEAD"), ...movie.killers.map(() => "KILLER · PRESUMED DEAD")],
    roomOffset: 2, cta: "End credits"
  }, "credits");
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
    returningKiller: movie.returningKiller, legacyEcho: movie.legacyEcho, motive: movie.motive, survivors,
    openingScenarioId: movie.openingScenario?.id, openingTarget: movie.openingTarget, openingPartner: movie.openingPartner, openingOutcome: movie.openingOutcome,
    statuses: movie.status, friends: movie.friends, playerFriends: movie.playerFriends || {}, saved: unique(movie.saved),
    playerTheories: movie.finalTheories || {}, playerBets: movie.localBets || {},
    deaths, deathOrder,
    wronglyAccused, firstSuspicion: movie.firstSuspicion, midpointTheory: movie.midpointTheory,
    finalTheory: movie.finalTheory, identified: correct.length, cluesFound: movie.cluesFound.length,
    peopleSaved: movie.peopleSaved, deathsPrevented: movie.deathsPrevented,
    survivalItem: movie.survivalItem, itemHolder: movie.keyHolder || (movie.itemKept ? playerCharacters().join(" & ") : null), itemKept: movie.itemKept, itemUsed: movie.itemUsed,
    confirmedLegacyDeaths: unique(movie.resolvedLegacyKillers || []),
    victimCount: ordinaryDeaths.length, itemSaved: unique(movie.itemSaved), puzzleSolved: movie.puzzleSolved, puzzleAdvantage: movie.puzzleAdvantage,
    betAmount: movie.betAmount, betPayout: movie.betPayout, betResult: movie.betResult,
    choices: movie.choices.length, pivotal: movie.choices.slice(0, 3).map(item => item.text), choicesLog: movie.choices.slice(), canonMoments: movie.canonMoments || [],
    closestFriend, mostTrusted, totalClues: movie.locationChoices.length
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
    if (isPlayerCharacter(name)) role = `FINAL SURVIVOR · PLAYER ${playerCharacters().indexOf(name) + 1}`;
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
    [playerCharacters().join(" & "), isLocalMode() ? "Final survivors · Local 2P" : "Final survivor"],
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
    const excluded = new Set([...(record.killers || []), ...(record.confirmedLegacyDeaths || [])]);
    const ordered = record.deathOrder || record.deaths || unique([...(record.cast || []), ...(record.killers || [])]);
    const names = ordered.filter(name => !excluded.has(name) && record.statuses?.[name] === "DEAD");
    return names.map(name => ({ name, movie: record.number, title: record.title }));
  });
  const firstDeath = new Map();
  entries.forEach(entry => { if (!firstDeath.has(entry.name)) firstDeath.set(entry.name, entry); });
  return [...firstDeath.values()];
}

function renderFuneral() {
  if (!current) return renderHome();
  const dead = trilogyDeaths();
  if (!dead.length) return renderKillerMemorial();
  stopMusic();
  const root = screen("funeral-screen cinematic");
  const stage = el("div", "funeral-stage");
  const controls = el("div", "funeral-controls");
  const finalRecord = current.history.at(-1);
  const attendees = unique(finalRecord?.survivors || []);
  let index = 0;

  const finish = () => {
    stopMemorialScore();
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
      el("p", "funeral-line", `Ο/Η ${entry.name} θάβεται παρουσία των επιζώντων. Οι ζωντανοί πλησιάζουν κλαίγοντας, ανάβουν κεριά και ρίχνουν λουλούδια στον τάφο.`),
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
    button("Συνέχεια στο archive", "", finish)
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
  if (!entries.length) return renderTrilogyArchive();
  stopMusic();
  const root = screen("killer-memorial-screen cinematic");
  const stage = el("div", "killer-memorial-stage");
  const controls = el("div", "funeral-controls killer-memorial-controls");
  let index = 0;

  const finish = () => {
    stopTimers();
    stopMusic();
    renderTrilogyArchive();
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

  controls.append(button("Επόμενος killer", "ghost", next), button("Συνέχεια στο archive", "", finish));
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
  if (trilogyDeaths().length) actions.append(button("Replay memorial", "secondary", renderFuneral));
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
