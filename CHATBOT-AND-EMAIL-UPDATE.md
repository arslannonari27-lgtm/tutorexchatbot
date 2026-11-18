# TutorEx Academy — Chatbot & Contact Email Update

## Added / changed

- Official email set to **tutorexacademy@gmail.com** in `src/lib/site.ts`. Override is possible through `NEXT_PUBLIC_CONTACT_EMAIL`, but the default is now the supplied real Gmail address.
- Added a **floating, responsive FAQ chatbot** globally through `src/components/support-chatbot.tsx` and `src/app/layout.tsx`.
- The free chatbot supports predefined answers and links for **Find a Tutor, O Level, A Level, IELTS, Become a Tutor, Fees & Demos, countries/time zones, and contact**.
- Chat can accept short typed questions and show keyword-matched answers. It can be closed with Escape; it has keyboard-usable controls and screen-reader labels.
- The official email is shown on the **Contact** page and **footer** and enables the **Open Email Draft** action in the parent inquiry composer.
- Updated the draft Privacy page to explain how the chatbot functions.
- The WhatsApp link remains hidden until a real business number is configured.

## Critical distinction

**This is a free, rule-based FAQ chatbot. It is not ChatGPT, a real-time AI bot, nor a live human operator.** It **does not** collect leads automatically, email conversations to the founder, store chats, or book tutors. The email button opens the visitor's mail app, where the visitor must press Send. Until the parent Google Form / Supabase integration is built, this is the truthful behavior.

## Local setup (Windows + Antigravity)

1. Keep a backup of your old folder, e.g. `C:\\Projects\\tutorex-academy-old`.
2. Extract this updated project. The folder containing `package.json` is the project root.
3. Open that folder in Google Antigravity / VS Code.
4. Install Node.js LTS if necessary.
5. In the built-in terminal run:

   ```powershell
   npm install
   npm run dev
   ```

6. Open the local URL displayed by Next.js (usually `http://localhost:3000`).
7. Test Chat Help in the lower-right corner, quick replies, typed messages, the email link, Contact page, Footer, and Find a Tutor email draft.
8. Before launch, run `npm run check:content`, `npm run typecheck`, `npm run lint`, `npm run build`.

### Optional .env.local

The Gmail address works without an env file. If you create `.env.local`, use:

```env
NEXT_PUBLIC_CONTACT_EMAIL=tutorexacademy@gmail.com
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_PARENT_FORM_URL=
```

`NEXT_PUBLIC_*` values are public in browser builds. Do not place secret tokens in them.

## Quick user acceptance checklist

- [ ] Floating “Chat Help” button shows on all pages.
- [ ] The chatbot responds to O Level, A Level and IELTS with functioning page links.
- [ ] Tutor application option opens the existing public Google Form.
- [ ] Contact page and Footer display `tutorexacademy@gmail.com`.
- [ ] The parent inquiry option opens a drafted email and clearly does not falsely claim that it sent anything.
- [ ] WhatsApp remains hidden until its real official number is configured.
- [ ] Privacy and Terms have been reviewed before production launch.

## Security and production launch

Do not change Namecheap DNS, MX, SPF, DKIM, DMARC or nameservers to enable this update. Backend dashboards / automated lead capture are not part of this update. A later phase can implement secure guardian-led parent inquiries and optional AI chatbot responses behind an authenticated, rate-limited server API.
