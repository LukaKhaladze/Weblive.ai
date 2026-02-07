# Weblive AI (MVP)

Weblive AI is a split-screen generator that builds a website blueprint (pages, sections, copy, and SEO) from a user prompt. The preview is editable in-place and projects are saved to localStorage.

## Setup

1) Install dependencies

```bash
npm install
```

2) Set environment variable

Create a `.env.local` file with:

```bash
OPENAI_API_KEY=your_api_key_here
```

3) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Example Prompt (Georgian)

```
შექმენი სტომატოლოგიური კლინიკის საიტის სტრუქტურა თბილისისათვის, აქცენტით ოჯახის მოვლასა და ბავშვთა დენტალურ მომსახურებაზე. გამოკვეთე ნდობა, სისუფთავე და თანამედროვე ტექნოლოგიები.
```

## Notes

- Projects are saved in `localStorage` under the key `weblive_projects_v1`.
- Export options include JSON and Markdown.
