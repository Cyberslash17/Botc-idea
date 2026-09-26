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

Everything below the second `---` is free-form Markdown for design notes,
playtest reports, open questions, and so on.

The three roles already in `_roles` are examples; edit or delete them.

## Previewing locally (optional)

```sh
gem install jekyll
jekyll serve
```

Then open http://localhost:4000.
