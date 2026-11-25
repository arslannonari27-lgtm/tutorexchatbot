'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Bot, Mail, MessageCircle, Send, X } from 'lucide-react';
import { site } from '@/lib/site';

type ChatLink = { label: string; href: string; external?: boolean };
type Message = { id: number; role: 'visitor' | 'assistant'; text: string; links?: ChatLink[] };
type Topic = { label: string; text: string };

const initialMessage: Message = {
  id: 0,
  role: 'assistant',
  text: "Welcome to TutorEx Academy! I'm a free, automated FAQ assistant (not a live agent). I can guide you to tutor requests, exam preparation information, or tutor registration. Please don't share a child's personal details here.",
  links: [{ label: 'Find a Tutor', href: '/find-a-tutor' }, { label: 'Contact the team', href: '/contact' }],
};

const topics: Topic[] = [
  { label: 'Find a Tutor', text: 'I want to find an online tutor' },
  { label: 'O Level', text: 'I need O Level tutoring' },
  { label: 'A Level', text: 'I need A Level tutoring' },
  { label: 'IELTS', text: 'I need IELTS preparation' },
  { label: 'Become a Tutor', text: 'How can I apply as a tutor?' },
  { label: 'Fees & Demos', text: 'How do fees and demo classes work?' },
];

function answerFor(question: string): Omit<Message, 'id' | 'role'> {
  const q = question.toLowerCase().trim();
  if (/(apply|application|teach|teacher|become|join|register|registration|tutor job)/.test(q)) {
    return {
      text: 'Interested in tutoring? Please complete our Tutor Registration Form. Applications are reviewed before any approval; applying does not guarantee students or work.',
      links: [
        { label: 'Become a Tutor', href: '/become-a-tutor' },
        { label: 'Open Application Form', href: site.tutorApplicationUrl, external: true },
      ],
    };
  }
  if (/ielts|band score|listening|speaking test/.test(q)) {
    return {
      text: 'You can request IELTS Academic or General Training preparation for Listening, Reading, Writing or Speaking. Specialist tutor availability and rates must be confirmed. We cannot promise a specific band score.',
      links: [{ label: 'IELTS Information', href: '/programs/ielts' }, { label: 'Request IELTS Tutor', href: '/find-a-tutor' }],
    };
  }
  if (/o[ -]?level/.test(q)) {
    return {
      text: 'We accept inquiries for Cambridge O Level support. Please share the subject, syllabus or exam board, preferred schedule and learning goals through the Find a Tutor page. Availability is not guaranteed.',
      links: [{ label: 'O Level Information', href: '/programs/o-level' }, { label: 'Request O Level Tutor', href: '/find-a-tutor' }],
    };
  }
  if (/a[ -]?level|as level/.test(q)) {
    return {
      text: 'You can inquire about Cambridge International AS & A Level subject tutoring. We review suitable specialist tutors according to subject, syllabus and availability.',
      links: [{ label: 'A Level Information', href: '/programs/a-level' }, { label: 'Request A Level Tutor', href: '/find-a-tutor' }],
    };
  }
  if (/(fee|price|cost|budget|payment|demo|trial|free class)/.test(q)) {
    return {
      text: 'Fees, schedules and payment responsibilities are agreed before enrollment; TutorEx Academy has not published fixed prices. A demo may be discussed when an appropriate tutor is available. We do not guarantee free demos.',
      links: [{ label: 'Frequently Asked Questions', href: '/faq' }, { label: 'Ask About Availability', href: '/find-a-tutor' }],
    };
  }
  if (/(whatsapp|email|contact|support|human|agent|team|complaint)/.test(q)) {
    return {
      text: `Our team can be contacted at ${site.contactEmail}. The chatbot cannot deliver messages to staff automatically. Please use the email link or Contact page.`,
      links: [{ label: 'Email TutorEx Academy', href: `mailto:${site.contactEmail}?subject=TutorEx%20Academy%20Inquiry` }, { label: 'Contact Page', href: '/contact' }],
    };
  }
  if (/(country|international|uk|usa|uae|saudi|pakistan|world|timezone|time zone)/.test(q)) {
    return {
      text: 'TutorEx Academy welcomes inquiries from Pakistan, the UK, USA, UAE, Saudi Arabia and other countries. Matching depends on the relevant time zone, curriculum and tutor availability.',
      links: [{ label: 'How It Works', href: '/how-it-works' }, { label: 'Find a Tutor', href: '/find-a-tutor' }],
    };
  }
  if (/(math|english|physics|chemistry|biology|science|computer|quran|tajweed|urdu|islamiat|subject)/.test(q)) {
    return {
      text: 'We welcome requests for Maths, English, Science, Computer Science, Urdu, Islamiat, Quran & Tajweed and other listed subjects. Tutor suitability and availability are reviewed before matching.',
      links: [{ label: 'Browse Subjects', href: '/subjects' }, { label: 'Find a Tutor', href: '/find-a-tutor' }],
    };
  }
  if (/(tutor|student|parent|child|lesson|class|learning|match)/.test(q)) {
    return {
      text: 'Tell us the curriculum, grade, subject, country or time zone, budget and preferred timings in the Find a Tutor inquiry page. Please share a child’s information only through an appropriate parent/guardian channel.',
      links: [{ label: 'Find a Tutor', href: '/find-a-tutor' }, { label: 'How It Works', href: '/how-it-works' }],
    };
  }
  return {
    text: "I can help with tutor requests, O Level, A Level, IELTS, tutor applications, fees and contact details. For anything else, please email our team. This is a guided FAQ chatbot, not a human or AI-powered live agent.",
    links: [{ label: 'Contact the Team', href: '/contact' }, { label: 'Email Us', href: `mailto:${site.contactEmail}?subject=TutorEx%20Academy%20Inquiry` }],
  };
}

export function SupportChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open) transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  function ask(text: string) {
    const trimmed = text.trim().slice(0, 350);
    if (!trimmed) return;
    const response = answerFor(trimmed);
    const visitorId = nextId.current++;
    const assistantId = nextId.current++;
    setMessages(old => [
      ...old,
      { id: visitorId, role: 'visitor', text: trimmed },
      { id: assistantId, role: 'assistant', ...response },
    ]);
    setInput('');
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(input);
  }

  return (
    <div className="fixed bottom-4 right-4 z-[80] sm:bottom-6 sm:right-6">
      {open && (
        <section id="tutorex-chat-panel" role="region" aria-label="TutorEx Academy automated FAQ chat" className="mb-3 flex h-[min(68vh,570px)] w-[min(92vw,390px)] flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_20px_65px_rgba(16,44,78,.22)]">
          <header className="flex items-center justify-between bg-navy px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-white/15"><Bot size={22} aria-hidden="true" /></div>
              <div><h2 className="font-heading text-sm font-bold">TutorEx Help Assistant</h2><p className="text-[11px] text-white/75">Automated FAQs · Not live support</p></div>
            </div>
            <button type="button" onClick={() => { setOpen(false); launcherRef.current?.focus(); }} aria-label="Close chat" className="rounded-lg p-2 hover:bg-white/15 focus-visible:outline-white"><X size={19} /></button>
          </header>
          <div ref={transcriptRef} role="log" aria-label="Chat messages" aria-live="polite" aria-relevant="additions" className="flex-1 space-y-3 overflow-y-auto bg-[#F7F9FC] px-3 py-4 sm:px-4">
            {messages.map(message => (
              <div key={message.id} className={`flex ${message.role === 'visitor' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[91%] rounded-2xl px-3.5 py-3 text-[13px] leading-5 shadow-sm ${message.role === 'visitor' ? 'rounded-br-sm bg-teal text-white' : 'rounded-bl-sm border border-navy/10 bg-white text-navy'}`}>
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                  {message.links && <div className="mt-3 flex flex-col gap-2">{message.links.map(link =>
                    link.href.startsWith('/') ?
                      <Link key={link.label} className="inline-flex items-center gap-1.5 font-semibold text-teal underline underline-offset-2" href={link.href} onClick={() => setOpen(false)}>{link.label}<ArrowRight size={14} /></Link> :
                      <a key={link.label} className="inline-flex items-center gap-1.5 font-semibold text-teal underline underline-offset-2" href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener noreferrer' : undefined}>{link.label}{link.label.toLowerCase().includes('email') ? <Mail size={14} /> : <ArrowRight size={14} />}</a>
                  )}</div>}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-navy/10 bg-white px-3 pb-3 pt-2.5 sm:px-4">
            <p className="mb-2 text-[11px] font-semibold text-navy/65">Quick questions</p>
            <div className="mb-3 flex max-h-[72px] flex-wrap gap-1.5 overflow-y-auto">
              {topics.map(topic => <button key={topic.label} type="button" className="rounded-full border border-teal/25 bg-teal/5 px-2.5 py-1.5 text-[11px] font-semibold text-navy hover:border-teal hover:bg-teal/10" onClick={() => ask(topic.text)}>{topic.label}</button>)}
            </div>
            <form className="flex items-center gap-2" onSubmit={submit}>
              <label htmlFor="tutorex-chat-message" className="sr-only">Ask a general question</label>
              <input ref={inputRef} id="tutorex-chat-message" className="h-10 min-w-0 flex-1 rounded-xl border border-navy/20 bg-white px-3 text-[13px] text-navy placeholder:text-navy/45 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/20" placeholder="Ask a general question..." value={input} maxLength={350} onChange={event => setInput(event.target.value)} />
              <button type="submit" disabled={!input.trim()} aria-label="Send question to FAQ chatbot" className="flex size-10 items-center justify-center rounded-xl bg-teal text-white hover:bg-[#118a98] disabled:cursor-not-allowed disabled:opacity-40"><Send size={17} /></button>
            </form>
            <p className="mt-2 text-[10px] leading-4 text-navy/55">Messages stay in this page only; they are not emailed or submitted. Do not enter confidential or student-identifying information.</p>
          </div>
        </section>
      )}
      <button ref={launcherRef} type="button" aria-controls="tutorex-chat-panel" aria-expanded={open} aria-label={open ? 'Close TutorEx help assistant' : 'Open TutorEx help assistant'} onClick={() => setOpen(value => !value)} className="ml-auto flex items-center gap-2 rounded-full bg-navy px-4 py-3.5 font-semibold text-white shadow-[0_9px_30px_rgba(16,44,78,.24)] transition-transform hover:-translate-y-0.5 hover:bg-[#17406e] focus-visible:outline-white">
        {open ? <X size={21} /> : <MessageCircle size={21} />}
        <span className="text-sm">{open ? 'Close' : 'Chat Help'}</span>
      </button>
    </div>
  );
}
