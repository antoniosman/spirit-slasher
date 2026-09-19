# Spirit Slasher: A Slasher Trilogy

Ένα cinematic procedural slasher PWA όπου κάθε save δημιουργεί τη δική του canon τριλογία.

## Implemented features

- Unlimited local Save Vault με ονομασία, μετονομασία, αναζήτηση, ταξινόμηση και scrollable επιλογή universe χωρίς αυτόματη διαγραφή παλιού slot.
- Cross-device save transfer: export/share ενός save ή ολόκληρου του Vault σε `.json` και ασφαλές import σε άλλη συσκευή, με native iPhone share sheet όπου υποστηρίζεται.
- Επιλογή main character από τους 26 υπάρχοντες Spirits χαρακτήρες.
- Και οι 26 καθαρές character εικόνες από τα προηγούμενα Spirits games.
- Προκαθορισμένες συγγένειες και σχέσεις: Luna–Hope, Demarin–Irene, Catherine–Evaggelia, Rino–Pauline, Rino–Billy, Luna–Vincent, Hope–Paul, Tony–Ian.
- Movie I και II killer distribution: 10% ένας, 69% δύο, 20% τρεις, 1% τέσσερις killers.
- Movie III distribution: ίση πιθανότητα για έναν killer, δύο/τρεις killers ή παλιό killer που θεωρούνταν νεκρός και επιστρέφει για εκδίκηση.
- Ο main character δεν γίνεται ποτέ killer ή θύμα.
- Procedural cast 11–12 χαρακτήρων στα Movie I/II και διευρυμένο Movie III ensemble που φέρνει υποχρεωτικά κάθε ζωντανό χαρακτήρα που δεν είχε screen time, μαζί με όλους τους διαθέσιμους legacy survivors.
- Οι killers των Movie I/II καταγράφονται ως `KILLER · PRESUMED DEAD`, αποκλείονται από κάθε επόμενο κανονικό cast και μόνο ένας μπορεί να επιστρέψει κρυφά στο Movie III.
- Returning killer του Movie III κρύβεται από intro, cast, διάλογο, suspect list και επιλογές και εμφανίζεται μόνο στο reveal/outro.
- Τα πραγματικά στοιχεία του Movie III μπορούν να δείξουν ένα ονομαστικό `ARCHIVE ECHO` — «σαν να ήταν εδώ» — αλλά χρησιμοποιούν ακριβώς την ίδια αμφίσημη γλώσσα είτε υπάρχει returning killer είτε όχι. Επιστροφή, αντιγραφή και παγίδα παραμένουν ισότιμες εξηγήσεις μέχρι το reveal.
- Procedural engine 100 διαφορετικών opening scenarios με κάμερες, projector, alarms, elevator, radio, livestream, sensors, lockdown, generator και παγιδευμένα δωμάτια.
- 120 διαφορετικά sub-room variants σε τρία ξεχωριστά cinematic map atlases, με randomized routes, crops, clues και scene order.
- Μηχανισμός επιλογής βασικής παρέας που αλλάζει trust, friendship και loyalty. Οι σημαντικοί survivors προστατεύονται μόνο από το επόμενο opening kill — όχι από τους κινδύνους της ταινίας.
- Κρυφό relationship state: trust, friendship, suspicion, fear, loyalty και knowledge.
- Life-sim Relationship Board μέσα σε κάθε ταινία με portrait tiles, canon συγγένειες και εμφανή qualitative friendship, trust, loyalty και suspicion meters.
- Randomized relationship events με καβγάδες, πένθος, κατηγορίες, confessions, rivalry και όρκους προστασίας· ακόμη και ένας killer μπορεί να κλαίει ή να χειραγωγεί χωρίς να αποκαλύπτεται.
- Real clues, red herrings και character secrets χωρίς να αποκαλύπτεται ο τύπος της σωστής ερμηνείας.
- Midpoint και final accusation 1–4 υπόπτων, με αποθήκευση πρώτης και τελικής θεωρίας.
- Δυναμικές καταστάσεις Alive, Saved, Dead και Killer · Presumed Dead. Οι θάνατοι παραμένουν οριστικοί και κανένας χαρακτήρας δεν επιστρέφει με ειδικό μηχανισμό.
- Παλαιότερες αποφάσεις (π.χ. survival item) αλλάζουν πραγματικά τις πιθανότητες επιβίωσης και μπορούν να σώσουν τον κάτοχό τους σε attack, rooms ή finale.
- Τα openings μπορούν να σκοτώσουν τον στόχο, τον σύντροφό του ή και τους δύο. Ο opening survivor χωρίς θέση στην παρέα μπαίνει ισότιμα στα επόμενα death pools και έχει μικρή κρυφή πιθανότητα να είναι killer.
- Δεύτερο investigation loop με επιπλέον δωμάτια, προσωπικές συζητήσεις, relationship-aware διάλογο, γρίφους και clues πριν συνεχίσει το attack.
- Probabilistic plot-twist outcomes: καμία επιλογή A/B/C δεν αντιστοιχεί μόνιμα σε συγκεκριμένο θάνατο ή διάσωση.
- Randomized αριθμός θυμάτων ανά ταινία, off-screen death reports και finale casualty montage — όχι σταθερά δύο θύματα.
- Πλήρες Act III με 0/N, 1/N ή N/N killers discovered και διαφορετικό dialogue.
- Motive engine με revenge, family secret, past incident, obsession, jealousy, cover-up, fame, manipulation και player-history motives.
- Νέοι χαρακτήρες σε κάθε sequel, μαζί με περιορισμένο αριθμό πραγματικών survivors. Οι πιο σημαντικές σχέσεις προστατεύονται από άδικο opening kill, όχι από όλη την ταινία.
- Movie III “Previously…” recap φτιαγμένο από τις πραγματικές επιλογές του save.
- Dynamic outro με το supplied outro track και σειρά: player, φίλοι, killers, υπόλοιπο cast.
- Online sessions με server-defined κοινό scene state, monotonic stage/revision, live avatars, pending choices και ξεχωριστά per-player consequences.
- End credits statistics, cast status, αναλυτική λίστα νεκρών και πλήρες trilogy In Memoriam archive.
- Μετά το Movie III παίζει portrait memorial για κάθε επιβεβαιωμένο μη-killer νεκρό, αυστηρά με τη σειρά του πρώτου θανάτου και με το supplied `funeral_music.mp3`. Οι killers δεν εμφανίζονται στο In Memoriam.
- Προαιρετικό fictional betting: ο παίκτης ποντάρει Slasher Credits στη final theory, κερδίζει 2× μόνο με ακριβή πλήρη πρόβλεψη ή παίρνει αναλογική επιστροφή για μερική επιτυχία. Δεν χρησιμοποιούνται πραγματικά χρήματα ή πληρωμές.
- Responsive mobile/desktop design, touch controls, fullscreen, sound toggle και reduced-motion support.
- Original Spirit Slasher mask-and-slash logo, cinematic room camera moves, animated dialogue, 3D-perspective action/death/rescue/killer beats, film scratches, depth layers, glitch cuts, haunted vignette, vibration και procedural Web Audio scare cues.
- Startup auto-update checker με σαφές status panel για έλεγχο, τελευταία έκδοση, διαθέσιμη ενημέρωση, ολοκλήρωση και σφάλμα· περιλαμβάνει αριθμό έκδοσης και χειροκίνητο Update button.
- Installable PWA για Android/iOS με cached app shell· τα βαριά portraits, maps και audio φορτώνονται από το GitHub Pages asset base ώστε ο Online/tunnel server να μένει ελαφρύς.
- GitHub Pages continuous deployment μέσω GitHub Actions.

## Local Online backend (initial foundation)

Το Online mode έχει πλέον dependency-free local backend για testing σε PC/LAN.
Τρέχει με `npm run server`, σερβίρει και το PWA στο `http://localhost:8787` και
παρέχει accounts, sessions 2–4 παικτών, character lobby, seeded shared cast,
per-player decision barriers, live avatar/choice polling και session-private chat.
Οι λεπτομέρειες βρίσκονται στο [`server/README.md`](server/README.md). Το Online
preview engine κρατάει ξεχωριστές επιλογές/outcomes ανά account, ενώ τα Single
Player και Local μένουν ανεπηρέαστα.

Για δοκιμή με παίκτη εκτός του τοπικού δικτύου, χρησιμοποίησε το named tunnel
`https://slasher.spirituniverse.gr` που έχεις ρυθμίσει στο Cloudflare. Αφού
εγκαταστήσεις μία φορά το `cloudflared` Windows service από το Cloudflare
dashboard, τοπικά ξεκινάς το game server με:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start-named-tunnel.ps1
```

Το script δεν περιέχει και δεν αποθηκεύει tunnel token. Το Online adapter
χρησιμοποιεί αυτόματα το named hostname όταν το παιχνίδι ανοίγει από GitHub
Pages, ενώ όταν ανοίγει από `slasher.spirituniverse.gr` χρησιμοποιεί το ίδιο
origin. Το Quick Tunnel script παραμένει διαθέσιμο μόνο για προσωρινά tests.

## Run locally

Serve the folder through any static HTTP server. Service workers do not run from `file://` URLs.
