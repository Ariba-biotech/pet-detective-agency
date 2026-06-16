# Pet Detective Agency

A complete, kid-friendly browser game where junior detectives explore a cartoon city, collect clues, solve missing pet quests, and earn detective badge ranks.

## Play Features

- **Cartoon city map:** Visit colorful locations around Pawston City.
- **Missing pet quests:** Solve cases for Mittens the cat, Biscuit the puppy, Pepper the bunny, and Pickles the parrot.
- **Clue collection system:** Search locations, collect three clues per case, and keep notes in the detective notebook.
- **Detective badge progression:** Advance from Bronze Badge Rookie to Rainbow Chief Detective as pets are reunited.
- **Persistent saves:** Game progress, solved cases, collected clues, and sound settings are saved with `localStorage`.
- **Sound effects toggle:** Turn cheerful browser-generated sound effects on or off.
- **Mobile-friendly design:** Responsive layout works on phones, tablets, and desktops.
- **GitHub Pages ready:** Static HTML, CSS, and JavaScript only; no build step required.

## Files

- `index.html` — Game structure and accessible UI regions.
- `style.css` — Responsive cartoon styling, city map, posters, badge cards, and mobile layout.
- `script.js` — Quest data, clue searching, badge progression, sound effects, and localStorage saves.

## Run Locally

Open `index.html` directly in a browser, or serve the folder with a simple static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy to GitHub Pages

1. Push these files to a GitHub repository.
2. Open the repository settings on GitHub.
3. Go to **Pages**.
4. Select the branch that contains `index.html` and choose the repository root as the source.
5. Save, then open the published GitHub Pages URL.

## Browser Support

Pet Detective Agency uses standard HTML, CSS, JavaScript, `localStorage`, and the Web Audio API. It is designed for modern desktop and mobile browsers.
