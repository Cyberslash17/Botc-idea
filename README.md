# Clocktower Role Ideas

A GitHub Pages site for collecting homebrew character ideas for
*Blood on the Clocktower*.

## Turning the site on (one time)

1. On GitHub, open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Merge to `main` (or run the *Deploy site to GitHub Pages* workflow from the
   **Actions** tab). The site appears at
   `https://<your-username>.github.io/<repo-name>/`.

## Adding a role idea

Every role is one Markdown file in the [`_roles`](_roles) folder.

1. Open `_roles` on GitHub and click **Add file → Create new file**.
2. Name it after the role, e.g. `plague-doctor.md`.
3. Paste in the contents of [`role-template.md`](role-template.md) and fill it in.
4. Commit to `main`. The site rebuilds in a minute or two.

Fields at the top of the file (between the `---` lines):

| Field          | What it's for                                                   |
|----------------|-----------------------------------------------------------------|
| `name`         | Character name                                                  |
| `team`         | `townsfolk`, `outsider`, `minion`, `demon`, `traveller`, `fabled` |
| `ability`      | The ability text as it would appear on the token                |
| `status`       | `idea`, `drafting`, `playtested` — or your own labels           |
| `author`       | Who came up with it                                             |
| `first_night`  | Storyteller instructions for night one                          |
| `other_nights` | Storyteller instructions for other nights                       |
| `reminders`    | List of reminder tokens, e.g. `[Poisoned, Dead]`                |
| `tags`         | Free-form tags for searching, e.g. `[information, madness]`     |
| `glyph`        | The role's icon — make one in the Glyph Forge (see below)       |
| `image`        | Optional path to your own icon image; overrides `glyph`         |

Everything below the second `---` is free-form Markdown for design notes,
playtest reports, open questions, and so on.

## Glyph Forge

The site has a **Glyph Forge** page (`/forge/`) for designing role icons in
the game's colours: blue for Townsfolk and Outsiders, red for Minions and
Demons, split blue/red for Travellers, and gold for Fabled.

Pick a main symbol, an optional accent symbol, and adjust rotation, size and
mirroring, or hit **Randomise**. Then either:

- **Copy the snippet** it generates into your role's front matter. The site
  draws the glyph itself, and it recolours automatically if you change the
  role's team; or
- **Download** the icon (PNG/SVG) or a full parchment token (PNG). To use a
  downloaded image on the site, upload it to `assets/icons/` and set
  `image: /assets/icons/your-file.png`.

Each role page has an *Edit this glyph in the Glyph Forge* link that opens
the Forge pre-filled with that role's current glyph.

New symbols can be added to `_includes/glyphs.svg` as a
`<symbol id="g-name" viewBox="0 0 100 100">`. Leave `fill` off the main
shapes so they pick up the team colour. They appear in the Forge automatically.

The three roles already in `_roles` are examples; edit or delete them.

## Previewing locally (optional)

```sh
gem install jekyll
jekyll serve
```

Then open http://localhost:4000.
