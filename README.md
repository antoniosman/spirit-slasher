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
- Οι killers των Movie I/II καταγράφονται ως `KILLER · PRESUMED DEAD`, αποκλείονται από κάθε επόμενο κανονικό cast και μόνο ένας μπορεί να επιστρέψει κρυφά στο Movie III.
- Returning killer του Movie III κρύβεται από intro, cast, διάλογο, suspect list και επιλογές και εμφανίζεται μόνο στο reveal/outro.
- Procedural engine 100 διαφορετικών opening scenarios με κάμερες, projector, alarms, elevator, radio, livestream, sensors, lockdown, generator και παγιδευμένα δωμάτια.
- 120 διαφορετικά sub-room variants σε τρία ξεχωριστά cinematic map atlases, με randomized routes, crops, clues και scene order.
- Μηχανισμός επιλογής βασικής παρέας που αλλάζει trust, friendship και loyalty.
- Κρυφό relationship state: trust, friendship, suspicion, fear, loyalty και knowledge.
- Real clues, red herrings και character secrets χωρίς να αποκαλύπτεται ο τύπος της σωστής ερμηνείας.
- Midpoint και final accusation 1–4 υπόπτων, με αποθήκευση πρώτης και τελικής θεωρίας.
- Δυναμικές καταστάσεις Alive, Saved, Dead και Killer · Presumed Dead. Οι κανονικοί νεκροί δεν επιστρέφουν ποτέ.
- Παλαιότερες αποφάσεις (π.χ. spare key) αλλάζουν μεταγενέστερες σκηνές ζωής/θανάτου.
- Randomized αριθμός θυμάτων ανά ταινία, off-screen death reports και finale casualty montage — όχι σταθερά δύο θύματα.
- Πλήρες Act III με 0/N, 1/N ή N/N killers discovered και διαφορετικό dialogue.
- Motive engine με revenge, family secret, past incident, obsession, jealousy, cover-up, fame, manipulation και player-history motives.
- Νέοι χαρακτήρες σε κάθε sequel, μαζί με περιορισμένο αριθμό πραγματικών survivors. Οι πιο σημαντικές σχέσεις προστατεύονται από άδικο opening kill, όχι από όλη την ταινία.
- Movie III “Previously…” recap φτιαγμένο από τις πραγματικές επιλογές του save.
- Dynamic outro με το supplied outro track και σειρά: player, φίλοι, killers, υπόλοιπο cast.
- End credits statistics, cast status και πλήρες trilogy archive.
- Responsive mobile/desktop design, touch controls, fullscreen, sound toggle και reduced-motion support.
- Original Spirit Slasher mask-and-slash logo, cinematic room camera moves, animated dialogue, action/death/rescue/sabotage/theory beats, film scratches, glitch cuts, haunted vignette, vibration και procedural Web Audio scare cues.
- Startup auto-update checker με σαφές status panel για έλεγχο, τελευταία έκδοση, διαθέσιμη ενημέρωση, ολοκλήρωση και σφάλμα· περιλαμβάνει αριθμό έκδοσης και χειροκίνητο Update button.
- Installable PWA για Android/iOS και offline cache μετά την πρώτη φόρτωση.
- GitHub Pages continuous deployment μέσω GitHub Actions.

## Run locally

Serve the folder through any static HTTP server. Service workers do not run from `file://` URLs.
