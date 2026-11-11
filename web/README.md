# Public repo hub (Mainline Astro)

Based on [Mainline](https://github.com/shadcnblocks/mainline-astro-template) by shadcnblocks (MIT).

```bash
npm ci
npm run dev
npm run build
```

Site base path is `/Public_repo` for GitHub Pages. See root `AGENTS.md`.

## Add a course

`npm run new-course -- <slug> "Title"`, then edit `course.yaml`. The hub lists every course from that file.

`external` is the companion course (Udemy). The default instructor for a new course is John Christopher: https://www.udemy.com/user/john-christopher-32/ . Use the course URL with no coupon query.

`format: days` is a numbered day plan (`days/*.mdx`). `format: sessions` is one hour each weekday (`sessions/*.mdx`). AB-650 is days. AZ-140 is sessions.
