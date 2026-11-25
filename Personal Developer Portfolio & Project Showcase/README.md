# Personal Developer Portfolio & Project Showcase

Portfolio site for **Abdullah Zafar**, full-stack web engineer. It presents shipped projects, education, the tech stack, and contact details from his resume.

This folder is Task 1 of the Datheon Full-Stack Web Development Internship.

## Run it locally

No build step. From this folder:

```bash
python -m http.server 5500
```

Open `http://localhost:5500`.

You can also open `index.html` directly in a browser. Fonts load from Google Fonts, so an internet connection is needed for the typefaces.

## What’s included

- Semantic sections: header, hero, featured projects, about, skills grid, contact, footer
- Mobile-first layout with CSS Grid and Flexbox
- Dark and light theme, saved in `localStorage` and aligned with the system preference on the first visit
- Smooth in-page navigation
- Hamburger menu below 760px
- Project case-note modals (`<dialog>`)
- Resume download (`assets/Abdullah-Zafar-CV.pdf`)
- Contact form that opens a prefilled `mailto:` to qazia7513@gmail.com

## Projects linked from the page

| Project | Live |
| --- | --- |
| Vignette | https://vignette-archive.vercel.app/ |
| SingleCart | https://singlecart.vercel.app/ |
| Urban Bites | https://urbanbites-app.vercel.app/ |
| Skin Vision | Mobile final-year project (no public web demo) |

## Deploy

**GitHub Pages** (repository site, branch `main`, folder `/`):

`https://abdullahzafar9.github.io/Datheon_Full_Stack_Web_Development_Internship/Personal%20Developer%20Portfolio%20&%20Project%20Showcase/`

**Vercel or Netlify:** set the project root to this folder. The site is static HTML, CSS, and JavaScript.

## Stack

HTML5, CSS3, JavaScript (ES6+). No framework and no package install.
