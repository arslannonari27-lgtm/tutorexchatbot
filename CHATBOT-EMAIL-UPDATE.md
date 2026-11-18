# TutorEx Academy — Chatbot and official email update

## Added
- Floating rule-based FAQ assistant in every page, with links to Find a Tutor, O Level, A Level, IELTS, Become a Tutor, and Contact.
- Official contact email `tutorexacademy@gmail.com` as the default value, including on the Contact page and footer.
- Parent inquiry composer opens a prepared email to the official address; visitors must press Send in their own email app. No direct inbox submission or data storage is implemented.
- WhatsApp button remains unavailable until the official number is provided.

## Limitations
The chatbot is not ChatGPT-powered and does not send messages to staff, save conversations, create inquiries, or process payments. Do not request sensitive data or information identifying a child via chatbot.

## Local setup
1. Open the extracted folder containing `package.json` in Antigravity.
2. `npm install`
3. `npm run dev`
4. Open http://localhost:3000
5. Test Chat Help button, quick questions, mobile layout, contact email link, and Find a Tutor email draft.
6. `npm run lint` and `npm run build` once dependencies are installed.

## Local verification
`node scripts/content-check.mjs` passed. Full lint and build cannot be verified in this environment because npm dependencies are not installed (`next: not found`).

## Email override
Optional `.env.local` value: `NEXT_PUBLIC_CONTACT_EMAIL=tutorexacademy@gmail.com`

## Safety
Do not expose Supabase secrets or change Namecheap DNS to enable this update. Publishing requires separate deployment and policy review.
