# Spirit Slasher: A Slasher Trilogy

Ένα cinematic procedural slasher PWA όπου κάθε save δημιουργεί τη δική του canon τριλογία.

## Implemented features

- Τρία ανεξάρτητα save slots / universes με αυτόματη αποθήκευση στη συσκευή.
- Επιλογή main character από τους 26 υπάρχοντες Spirits χαρακτήρες.
- Και οι 26 καθαρές character εικόνες από τα προηγούμενα Spirits games.
- Προκαθορισμένες συγγένειες και σχέσεις: Luna–Hope, Demarin–Irene, Catherine–Evaggelia, Rino–Pauline, Rino–Billy, Luna–Vincent, Hope–Paul, Tony–Ian.
- Movie I και II killer distribution: 10% ένας, 69% δύο, 20% τρεις, 1% τέσσερις killers.
- Movie III distribution: ίση πιθανότητα για έναν killer, δύο/τρεις killers ή παλιό killer που θεωρούνταν νεκρός και επιστρέφει για εκδίκηση.
- Ο main character δεν γίνεται ποτέ killer ή θύμα.
- Procedural cast 11–12 χαρακτήρων και cinematic cast intro με το supplied intro track.
- Returning killer του Movie III κρύβεται από το intro και εμφανίζεται μόνο στο reveal/outro.
- Opening kill με outcome που επηρεάζεται από την πρώτη επιλογή.
- Μηχανισμός επιλογής βασικής παρέας που αλλάζει trust, friendship και loyalty.
- Κρυφό relationship state: trust, friendship, suspicion, fear, loyalty και knowledge.
- Real clues, red herrings και character secrets χωρίς να αποκαλύπτεται ο τύπος της σωστής ερμηνείας.
- Midpoint και final accusation 1–4 υπόπτων, με αποθήκευση πρώτης και τελικής θεωρίας.
- Δυναμικές καταστάσεις Alive, Saved, Dead, Presumed Dead και Killer.
- Παλαιότερες αποφάσεις (π.χ. spare key) αλλάζουν μεταγενέστερες σκηνές ζωής/θανάτου.
- Σπάνια fake death πιθανότητα.
- Πλήρες Act III με 0/N, 1/N ή N/N killers discovered και διαφορετικό dialogue.
- Motive engine με revenge, family secret, past incident, obsession, jealousy, cover-up, fame, manipulation και player-history motives.
- Legacy survivors χωρίς plot armor στα sequels.
- Movie III “Previously…” recap φτιαγμένο από τις πραγματικές επιλογές του save.
- Dynamic outro με το supplied outro track και σειρά: player, φίλοι, killers, υπόλοιπο cast.
- End credits statistics, cast status και πλήρες trilogy archive.
- Responsive mobile/desktop design, touch controls, fullscreen, sound toggle και reduced-motion support.
- Original Spirit Slasher mask-and-slash logo, cinematic film scratches, glitch cuts, haunted vignette, reveal impacts, vibration και procedural Web Audio scare cues.
- Startup auto-update checker με άμεση εφαρμογή νέας έκδοσης και χειροκίνητο Update button στο header.
- Installable PWA για Android/iOS και offline cache μετά την πρώτη φόρτωση.
- GitHub Pages continuous deployment μέσω GitHub Actions.

## Run locally

Serve the folder through any static HTTP server. Service workers do not run from `file://` URLs.
