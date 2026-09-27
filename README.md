# Walelign Getnet Dagnew — Professional Portfolio

A premium, responsive static portfolio built with **HTML + CSS + JavaScript** using the supplied portfolio assets and career/CV information.

## Included
- Modern dark/futuristic professional design
- Amharic / English language toggle
- Dark/light theme toggle
- Typing headline animation
- Scroll reveal animations
- Animated metric counter
- Particle background and rotating rings
- Project dashboard gallery
- Code-preview lightbox
- Certificate/document lightbox
- Responsive mobile navigation
- Downloadable CV
- Email, phone and Telegram contact actions
- Accessible reduced-motion support
- Colorful animated accents: gradient section labels, hue-shifting background orbs, shimmer-sweep on skill/IT-support cards, glowing timeline dots, tilt effect on cards (mouse-follow)
- New "Video" section with a custom play button, glowing rotating border and a 2-minute self-introduction video player

## Adding your 2-minute intro video
The new **Video** section (between the hero ticker and Skills) is wired to play a video, but the actual video file is not included — add your own:
1. Record a ~2 minute video introducing your background and work (English and/or Amharic).
2. Export/save it as an MP4 named `intro-video.mp4`.
3. Place it in the `assets/` folder (same folder as `headshot-pro.jpg`), replacing nothing — just add the file.
Until that file is added, the section shows your headshot as a poster with a play button (clicking it will do nothing until the real file is present).

## Run
Open `index.html` in a modern browser. No server is required.

## Deploy it online (pick one, all free)
- **Netlify Drop**: go to app.netlify.com/drop, drag the whole `WGD_Portfolio_Pro` folder in — you get a live link in seconds.
- **GitHub Pages**: create a repo, upload these files, then in Settings → Pages set the source to the main branch. Your site publishes at `https://<username>.github.io/<repo>`.
- **Vercel**: vercel.com → "Add New Project" → drag-and-drop the folder or connect a repo.
No build step is needed for any of these — it's already a static site.

## Main files
- `index.html`
- `styles.css`
- `script.js`
- `assets/`


## Professional visual refinement v2
The portfolio was reviewed and upgraded without removing the supplied assets or core sections.

### Improvements
- Wider professional content grid for desktop screens.
- Stronger visual hierarchy and more readable typography.
- Balanced multi-color gradient accents using cyan, blue, violet, pink and amber.
- Improved cards, borders, shadows, hover states and project presentation.
- Fixed the `.cert` CSS collision between the hero certification badge and certificate cards.
- Improved mobile spacing and one-column layouts on small screens.
- Improved dark/light theme persistence with localStorage.
- Improved language switching, including bilingual HTML formatting such as line breaks and emphasis.
- Improved keyboard/focus accessibility and reduced-motion handling.
- More robust JavaScript null checks and slideshow/video controls.
- Theme and language preferences persist after refresh.
