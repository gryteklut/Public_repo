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

`external` is the companion course (Udemy). The default instructor for a new course is John Christopher: https://www.udemy.com/user/john-christopher-32/ . Use the course URL with no coupon query. Sessions are 60 minutes on weekdays (`sessions/*.mdx`), with a `budget`, a `week`, and an `optional` list for anything that is not on the exam.
