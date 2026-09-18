# Spirit Slasher — Implementation Audit

Audit source: `game_idea.txt` supplied by the user. Checked against the implemented PWA on 18 September 2026.

| Requirement | Status | Implemented behavior |
|---|---:|---|
| Every save creates its own trilogy canon | ✅ | Three independent local universes; seed, cast, choices, relationships, outcomes and history persist per save. |
| Main Character creation | ✅ | Player chooses one of all 26 Spirits; that character is permanently marked as You. |
| Player is never killer or victim | ✅ | Protagonist is excluded from killer and victim pools and is forced alive at the finale. |
| Movie I cast of 8–12 characters | ✅ | Movie I procedurally selects 11 characters including the protagonist. Movie III expands as needed to include every unused living character and all eligible legacy survivors. |
| Cinematic cast intro | ✅ | Timed full-screen cast montage with supplied intro music and player/returning cast labels. |
| Hidden killers, motives, secrets, victims, clues and changeable events | ✅ | All are generated before each movie and remain hidden until their relevant scene or reveal. |
| Movie I/II killer odds 10% / 69% / 20% / 1% | ✅ | Exact thresholds: 0–.10, .10–.79, .79–.99 and .99–1.00. |
| Randomized Opening Kill every movie | ✅ | 100 opening combinations vary the incident, complication and actions. A hidden roll can kill the target, partner or both, and a lone survivor has a small hidden killer chance. |
| Different maps and rooms | ✅ | Three original cinematic atlases drive 120 named sub-room variants with randomized routes, scene order and investigation locations. |
| Meaningful friend-group choice | ✅ | Selected group becomes the inner circle and changes friendship, trust, loyalty, danger calls, Act III and credits order. |
| Hidden relationship system | ✅ | Trust, friendship, suspicion, fear, loyalty and knowledge are stored without exposing numeric values. |
| “Will remember that” feedback | ✅ | Important social choices show non-numeric memory feedback. |
| Real clues | ✅ | A generated clue points to the mastermind but is presented as neutral evidence. |
| Red herrings | ✅ | True physical evidence implicates an innocent person without the game lying about the evidence. |
| Character secrets | ✅ | Procedural personal secret is unrelated to the murders but can affect suspicion. |
| Accusations of 1–4 people | ✅ | Midpoint and Final Theory screens enforce 1–4 suspects and preserve both theories. |
| Dynamic deaths and rescues | ✅ | Alive, Saved, Dead and Killer · Presumed Dead states change from choices, relationships, items, puzzle knowledge and hidden rolls; victim count is randomized per movie. Dead characters are refreshed out of all later target pools. |
| Delayed consequence such as spare key | ✅ | A survival item is entrusted to a character and materially raises survival odds in later attacks, room outcomes and the finale. |
| Extra investigations and character screen time | ✅ | After the first room the player can investigate more rooms, solve a randomized riddle or speak privately with living cast members for clues and relationship changes; ensemble cameos keep supporting characters visible. |
| Unpredictable choice outcomes | ✅ | Rescue, abandonment and finale options use seeded probability plus earned advantages, so A/B/C does not map to a permanent fixed death result. |
| Act III 0/N, partial or full discovery | ✅ | Reveal counts correct suspects and changes protagonist dialogue and finale survival logic. |
| No resurrection of ordinary dead | ✅ | Any non-killer marked Dead is permanently excluded from later casts, scenes, dialogue and choices. |
| Motive engine | ✅ | Revenge, family secret, past incident, obsession, jealousy, cover-up, notoriety, manipulation and history-driven motives. |
| Motive connected to protagonist | ✅ | Every reveal includes a protagonist-directed motive line; Movie III can quote a past player choice. |
| Movie II legacy survivors | ✅ | A limited set of real survivors returns alongside a majority of new characters; prior main-group survivors cannot be the immediate sequel opening kill but can die later. |
| Every character gets trilogy participation | ✅ | Movie III expands its cast to include every living character not previously used, all eligible Movie I/II survivors and the protagonist; no living unused Spirit is omitted from the trilogy. |
| Movie III reads full save history | ✅ | Uses saved killers, survivors, friends, accusations, rescues, deaths and pivotal choices. |
| Movie III mastermind chosen after Movies I/II | ✅ | Non-returning mastermind candidates prioritize wrongly accused legacy characters and old friends. |
| Movie III killer distribution | ✅ | Approximately equal thirds: one killer; two/three killers; one returning presumed-dead killer. |
| Returning killer hidden from Movie III intro | ✅ | Exactly one old killer may return; they are removed from cast, intro, dialogue, suspect lists and choices until the Act III reveal. |
| Cinematic animated actions | ✅ | Choices cut to perspective-driven animated beats with depth layers and distinct 3D motion for deaths, rescues, active movement, killers, clues, relationship scenes, sabotage, theories and finale casualties. |
| “Previously…” before Movie III | ✅ | Generates a recap from the player’s actual trust, rescue, accusation, killer and survivor history. |
| Supplied intro music | ✅ | Used in every procedural cast intro. |
| Supplied outro music | ✅ | Used in every outcome-built credit sequence. |
| Dynamic outro order | ✅ | Player first; inner-circle friends; mastermind and other killers; remaining cast. |
| End Credits Statistics | ✅ | Final survivor, killers, survivors, named deaths, identified killers, saved people, wrong accusations, relationships, theories, clues, item saves, fictional bet result, balance, prevented deaths and choices. |
| 3D funeral for every death | ✅ | Completing Movie III launches a full-screen portrait memorial for every confirmed death with perspective movement, rain, candles, film identification and the supplied funeral music; it can be replayed from the trilogy archive. |
| Fictional killer betting | ✅ | Players may wager any available Slasher Credits on the final theory. Exact complete identification pays 2×; partial correct identification returns the matching fraction; no real money or payment exists. |
| Cast Status | ✅ | Every participant is listed with their final state and killer status. |
| 26 Spirits and clean character art | ✅ | All 26 named assets from the existing Spirits game are packaged and cached offline. |
| Fixed family/romantic canon | ✅ | All eight supplied relationships are encoded and used for protagonist relationship seeding/casting priority. |
| Movie-like, immersive presentation | ✅ | Cinematic typography, scene pacing, full-screen montages, film scratches, glitch cuts, haunted vignette, reveal impacts, Web Audio cues and supported-device vibration. |
| Original professional logo/icon | ✅ | Custom mask-and-slash Spirit Slasher emblem used in header, home screen, favicon and Android/iOS PWA icons. |
| Android and iOS PWA | ✅ | Standalone manifest, safe-area layout, Apple metadata/touch icon, responsive orientations and offline service worker. |
| Update button and automatic startup updates | ✅ | Header control, startup check, visible versioned status messages for checking/latest/installing/completed/error, skip-waiting activation and automatic reload. |
| GitHub Pages deployment | ✅ | GitHub Actions Pages workflow is included and deployment is verified separately after push. |

## Verification summary

- Static JavaScript/JSON/asset checks are performed before deployment.
- Manual gameplay and balance testing of version 1.5.0 is intentionally left to the owner, as requested.
