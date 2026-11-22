# Who Did This?! Cat Chaos

*Bad cat. Big mess. No proof.*

A cozy cat-chaos game for the browser (playable test build). The family is out for a minute: wreck the room, collect fish and get back to bed before they return.

## Play

Open `index.html` through any static web server, or enable GitHub Pages for this repository (Settings → Pages → Deploy from a branch → `main`, folder `/`). The game then lives at `https://<user>.github.io/who-did-this/`.

Opening `index.html` straight from disk works too, but sound effects need a web server.

## What is in here

| Path | Contents |
|---|---|
| `index.html` | The whole game: markup, styles and code in one file |
| `a/` | Illustrations as sprite sheets (cat, furniture, props, people, backgrounds) |
| `s/` | Music loop and sound effects |
| `icon-*.png` | App icon in several sizes |
| `manifest.webmanifest` | Lets the game be added to a phone home screen |

## Features

- Three rooms with their own layout, mechanics and difficulty: Living Room, Kitchen, Home Office
- A 30-level campaign (10 levels per room), each with one clear goal and three stars; free play opens after level 5 of a room
- Fish currency, five upgrades, cat levels, stars and records per room
- Daily bowl, courier parcel after each round, missions, loot stash, photo album
- English by default, Polish as a second language

Progress is saved in the browser only (`localStorage`).

## Notes

- Sprite positions inside each sheet are listed in the `AT` object near the top of the script in `index.html`.
- `window.__game.bot(roomId, upgradeLevel)` plays one simulated round with a random bot; it was used to tune star thresholds. Pass a level index as the third argument (`bot('salon', 0, 3)`) to simulate a campaign level.
