export interface BookPage {
  id: number
  type: 'cover' | 'toc' | 'chapter-intro' | 'content' | 'practice' | 'answer'
  chapter?: string
  chapterNum?: number
  title?: string
  content: string
}

export const bookPages: BookPage[] = [
  // Cover
  {
    id: 0,
    type: 'cover',
    title: 'SSC 2027 · ENGLISH 2ND PAPER',
    content: `📘 Grammar Master Book
Zero থেকে Board-Ready — সহজ বাংলা Grammar Guide

9 Grammar Chapters
10 Full Model Tests
60 Grammar Marks

Expanded & Corrected Study Edition`
  },
  // TOC
  {
    id: 1,
    type: 'toc',
    title: 'Table of Contents',
    content: `PART 0: Student Guide — এই বই কীভাবে ব্যবহার করবে
PART 1: Grammar Foundation (ZERO level)
PART 2: Chapter-by-Chapter Grammar Course (৯টি Chapter)
  CH 1: Gap Filling with Clues — 10 marks
  CH 2: Substitution Table — 5 marks
  CH 3: Right Form of Verbs — 10 marks
  CH 4: Changing Sentences — 10 marks
  CH 5: Tag Questions — 5 marks
  CH 6: Suffixes and Prefixes — 5 marks
  CH 7: Preposition — 5 marks
  CH 8: Connectors / Linking Words — 5 marks
  CH 9: Punctuation and Capitalization — 5 marks
PART 3: Board + Model Practice & Revision Zone
PART 4: Grammar in 10 Pages — Complete Revision System
PART 5: Full Model Tests (১০টি)`
  },
  // Part 0 - Student Guide
  {
    id: 2,
    type: 'content',
    chapter: 'PART 0',
    title: 'Student Guide — এই বই কীভাবে পড়বে',
    content: `0.1 📖 এই বই কীভাবে পড়তে হবে

নিয়ম ১: সিরিয়াল ধরে পড়ো। PART 1 (Foundation) না পড়ে Chapter 1-এ গেলে মাঝপথে আটকে যাবে।

নিয়ম ২: চোখে পড়ো না, কলমে পড়ো। "STOP HERE" লেখা দেখলে থামো, নিজে solve করো।

নিয়ম ৩: Practice skip নিষেধ। সব ছাত্র rule পড়তে ভালোবাসে, practice করতে কাঁপে।

0.2 ⏰ প্রতিদিন কত সময় পড়বে
মিনিমাম ১ ঘণ্টা, আদর্শ দেড় ঘণ্টা। রোজ।

দেড় ঘণ্টার আদর্শ ভাগ:
• ২৫ মিনিট: নতুন rule/concept শেখা
• ৩০ মিনিট: Practice set solve
• ২০ মিনিট: উত্তর মিলানো + ভুলের খাতায় লেখা
• ১৫ মিনিট: গতকালের ভুল retest`
  },
  {
    id: 3,
    type: 'content',
    chapter: 'PART 0',
    title: 'Grammar শেখার সঠিক পদ্ধতি',
    content: `0.3 🧠 Grammar শেখার ৭-ধাপের চক্র

LEARN → rule-টা পড়ো (ধীরে, বুঝে)
UNDERSTAND → নিজের ভাষায় বলতে পারো?
EXAMPLE → ৩-৪টা example দেখো + নিজে ১টা বানাও
PRACTICE → অনেকগুলো question solve করো
CHECK → উত্তর মিলাও; "Why?" পড়ো
MISTAKE NOTE → প্রতিটি ভুল লেখো
RETEST → ৩ দিন পরে আবার solve করো

⭐ Golden Rule: যে rule-এর "কেন?" ব্যাখ্যা করতে পারো, সে rule exam hall-এও মনে থাকবে।

0.4 📌 Rule কীভাবে মনে রাখবে
কৌশল ১: Rule নয়, Example মনে রাখো
কৌশল ২: নিজের example বানাও
কৌশল ৩: ১-৩-৭ Revision নিয়ম (আজ, ৩ দিন, ৭ দিন পরে)
কৌশল ৪: শেখো, তারপর শেখাও`
  },
  {
    id: 4,
    type: 'content',
    chapter: 'PART 0',
    title: 'Exam Strategy & Mistake Notebook',
    content: `0.5 📓 ভুলের খাতা (Mistake Notebook)
তারিখ | আমার ভুল | সঠিক উত্তর | কেন ভুল | Rule

0.6 🔍 প্রশ্ন দেখলে ৩টা প্রশ্ন করো
১. এটা কোন chapter-এর প্রশ্ন?
২. Exam Hack-এর Step 1 কী?
৩. Signal কোথায়?

0.7 🎯 SSC Exam Hall-এ Grammar (60) করার Strategy
Q1 Gap filling: ৮ মিনিট
Q2 Substitution: ৪ মিনিট
Q3 Verbs: ১০ মিনিট
Q4 Changing: ১২ মিনিট
Q5 Tag: ৪ মিনিট
Q6 Suffix/Prefix: ৪ মিনিট
Q7 Preposition: ৪ মিনিট
Q8 Connectors: ৪ মিনিট
Q9 Punctuation: ৫ মিনিট
🔁 Revision: ১০ মিনিট`
  },
  // Part 1 - Foundation
  {
    id: 5,
    type: 'chapter-intro',
    chapter: 'PART 1',
    chapterNum: 0,
    title: 'Grammar Foundation',
    content: `মূল ৯ chapter শুরুর আগের জমি তৈরি।

F-1: Sentence — পূর্ণ অর্থ দেয় এমন শব্দের দল
F-2: Subject — কাজটি যে করে
F-3: Object — কাজটি যার ওপর পড়ে
F-4: Verb — কাজ বা অবস্থা বোঝায়
F-5: Noun — কোনো নাম
F-6: Pronoun — noun-এর বদলি খেলোয়াড়
F-7: Adjective — noun-এর খবর বলে
F-8: Adverb — verb-এর খবর বলে
F-9: Preposition — সম্পর্কের সেতু
F-10: Conjunction — শব্দ জোড়া দেওয়ার গোন্তা
F-11: Article — a/an/the
F-12: Number — Singular/Plural
F-13: Person — 1st/2nd/3rd
F-14: Tense-এর basic idea
F-15: Auxiliary verb & Main verb
F-16: Clause-এর basic idea
F-17: Phrase-এর basic idea`
  },
  // Chapter 1
  {
    id: 6,
    type: 'chapter-intro',
    chapter: 'Chapter 1',
    chapterNum: 1,
    title: 'Gap Filling with Clues',
    content: `📊 Marks: 10 (1×10)

এই প্রশ্ন SSC-তে কীভাবে আসে?
একটা ৮–১০ লাইনের passage দেওয়া থাকবে, যার (a) থেকে (j) পর্যন্ত ১০টা ফাঁকা। পাশে box-এ ১০টা শব্দ।

নির্দেশনা: "Fill in the blanks with the words from the box. You may need to change the forms of some of the words."

⭐ Golden Rule: SLOT আগে, MEANING পরে।`
  },
  {
    id: 7,
    type: 'content',
    chapter: 'Chapter 1',
    title: 'Signal Table — Slot চেনার অস্ত্র',
    content: `🚦 Signal Table

a/an/the + ___ → noun
___ + noun → adjective
is/am/are + ___ → adjective/noun
Subject + ___ → verb
verb + ___ → adverb
many/few + ___ → plural noun
preposition + ___ → noun/V+ing
clause + ___ + clause → conjunction

📌 RULE 2: Article Slot (a/an/the)
a = consonant ধ্বনি → a book, a university
an = vowel ধ্বনি → an apple, an hour
the = নির্দিষ্ট → the sun, the best

📌 RULE 3: Form Change Rule
verb → noun: -ity/-tion/-ment/-ness
verb → adjective: -able/-ive/-ful
adjective → adverb: +ly
verb tense/number: V+s, V2, V3`
  },
  {
    id: 8,
    type: 'practice',
    chapter: 'Chapter 1',
    title: 'Practice Set 1 — Easy',
    content: `1. He is ___ honest man. (a/an/the)
2. They ___ football every afternoon. (play/plays/playing)
3. She ___ to school yesterday. (go/goes/went)
4. I have many ___. (book/books/booking)
5. The baby is crying because it is ___. (hunger/hungry/hungrily)
6. He drives ___. (slow/slowly/slowness)
7. We should love ___ country. (us/our/ours)
8. He goes to school ___ bus. (by/with/on)
9. Rahim ___ Karim are friends. (or/and/but)
10. ___ sun rises in the east. (a/an/the)

STOP HERE ✋ — নিজে solve করো তারপর উত্তর দেখো।`
  },
  {
    id: 9,
    type: 'answer',
    chapter: 'Chapter 1',
    title: 'Practice Set 1 — Answers',
    content: `✅ Answers + Why

1. an — honest-এ h নীরব → vowel ধ্বনি
2. play — every afternoon = present; they plural → V1
3. went — yesterday → past
4. books — many + plural noun
5. hungry — be verb-এর পরে adjective
6. slowly — verb-এর খবর → adverb
7. our — country-এর আগে possessive
8. by — by bus = fixed phrase
9. and — দুই নাম জোড়া
10. The — সূর্য একটাই; বাক্যশুরু Capital`
  },
  // Chapter 2
  {
    id: 10,
    type: 'chapter-intro',
    chapter: 'Chapter 2',
    chapterNum: 2,
    title: 'Substitution Table',
    content: `📊 Marks: 5 (1×5)

এই প্রশ্ন SSC-তে কীভাবে আসে?
৩টা column-এর table দেওয়া থাকবে। প্রতিটা column থেকে একটা করে অংশ নিয়ে ৫টা সঠিক বাক্য লেখা।

⭐ Golden Rule: আগে B (verb) column পড়ো — verb-ই বলে দেবে কোন subject তার বন্ধু।

Subject-Verb Agreement:
He/She/It/singular → is/was/helps (s-ওয়ালা)
They/We/You/I/plural → are/were/help (s ছাড়া)`
  },
  // Chapter 3
  {
    id: 11,
    type: 'chapter-intro',
    chapter: 'Chapter 3',
    chapterNum: 3,
    title: 'Right Form of Verbs',
    content: `📊 Marks: 10 (1×10) — বইয়ের বৃহত্তম অধ্যায়

⭐ ৫-সেকেন্ডের Formula:
প্রশ্ন ১: gap-এর ঠিক আগে কী আছে?
প্রশ্ন ২: Subject-টা কে?
প্রশ্ন ৩: সময় কখন?

🔍 আগে যা দেখছ → form:
to + V1 (He wants to go)
modal + V1 (We should help)
has/have/had + V3 (He has done)
be + V+ing (He is running)
be + V3 (Rice is grown — passive)
preposition + V+ing (without telling)
nothing → subject+সময় মেলাও`
  },
  {
    id: 12,
    type: 'content',
    chapter: 'Chapter 3',
    title: 'Irregular Verbs & Signposts',
    content: `📚 ৩০টি Irregular Verb:
go-went-gone | write-wrote-written | see-saw-seen
come-came-come | give-gave-given | begin-began-begun
take-took-taken | do-did-done | eat-ate-eaten
make-made-made | speak-spoke-spoken | build-built-built

⏰ সময়ের Signpost:
every day/daily → present (+s for singular)
yesterday/ago/last → past (V2)
tomorrow/next → will + V1
now/at present → be + V+ing
since/for/already → has/have/had + V3

📌 Special:
It is high time + V2! (past form!)
If + present → will + V1
Unless = if...not`
  },
  // Chapter 4
  {
    id: 13,
    type: 'chapter-intro',
    chapter: 'Chapter 4',
    chapterNum: 4,
    title: 'Changing Sentences',
    content: `📊 Marks: 10 (1×10)

⭐ হংসী নিয়ম: অর্থ যেন একটুও না বদলায়।

Affirmative ↔ Negative:
only ↔ none but | every ↔ there is no...but
always ↔ never+antonym | must ↔ cannot but
too...to ↔ so...that...cannot

Assertive ↔ Interrogative:
auxiliary আছে? → হাত ঘুরাও
auxiliary নেই? → do/does/did আনো

Assertive ↔ Exclamatory:
very+adj+noun → What a...!
very+adj → How...!

Simple ↔ Complex:
phrase ↔ clause বিনিময়
because of+noun ↔ because+S+V
to+V1 ↔ so that+S+can`
  },
  // Chapter 5
  {
    id: 14,
    type: 'chapter-intro',
    chapter: 'Chapter 5',
    chapterNum: 5,
    title: 'Tag Questions',
    content: `📊 Marks: 5 (1×5)

⭐ ৪-ধাপের সূত্র:
ধাপ ১: auxiliary ধরো (is/are/can/will...)
ধাপ ২: positive→n't, negative→positive
ধাপ ৩: subject→pronoun
ধাপ ৪: ?

Special Cases:
I am → aren't I?
Let's → shall we?
Let him → will you?
Imperative → will you?
nobody/nothing/hardly → positive tag!
used to → didn't
there → there
'd = would → wouldn't
'd = had → hadn't`
  },
  // Chapter 6
  {
    id: 15,
    type: 'chapter-intro',
    chapter: 'Chapter 6',
    chapterNum: 6,
    title: 'Suffixes and Prefixes',
    content: `📊 Marks: 5 (1×5)

Suffix বানায় noun: -tion, -ment, -ness, -ity, -er, -th
Suffix বানায় adjective: -ful, -less, -ous, -ive, -al, -y, -able
Suffix বানায় adverb: -ly
Suffix বানায় verb: -ize, -en, -ify

Prefix (negative): un-, in-/im-/il-/ir-, dis-, mis-
Prefix (other): re-, pre-, post-, co-, over-, under-

Spelling Rules:
y→i: happy→happily
নীরব-e + ly: true→truly (e উঠে যায়!)
-ful = এক l: beautiful (full নয়!)
-tion: educate→education`
  },
  // Chapter 7
  {
    id: 16,
    type: 'chapter-intro',
    chapter: 'Chapter 7',
    chapterNum: 7,
    title: 'Preposition',
    content: `📊 Marks: 5 (1×5)

In/On/At — তিন ছোট জিন:
at = বিন্দু (at 6am, at night)
on = দিন (on Sunday, on 26 March)
in = দীর্ঘ (in July, in the morning)

⭐ Fixed Pairs:
good at | fond of | afraid of | proud of
interested in | famous for | different from
depend on | suffer from | deal with
consist of | provide...with | abstain from
key to | senior to | superior to | married to

⚠️ ফাঁদ:
since=বিন্দু, for=পরিমাণ
different FROM (than নয়!)
next week-এর আগে preposition নেই!`
  },
  // Chapter 8
  {
    id: 17,
    type: 'chapter-intro',
    chapter: 'Chapter 8',
    chapterNum: 8,
    title: 'Connectors / Linking Words',
    content: `📊 Marks: 5 (1×5)

৭ দল:
① Addition: and, moreover, besides, not only...but also
② Contrast: but, however, though, although, despite
③ Reason: because, since, as, because of
④ Result: so, therefore, as a result, so...that
⑤ Example: for example, for instance, such as
⑥ Sequence: first, then, finally, suddenly
⑦ সারসংক্ষেপ: indeed, in fact, in short

⚠️ একসাথে নয়:
Although...but ❌ → Although..., ✅
Because...so ❌ → Because..., ✅
Unless + negative ❌ → Unless + positive ✅`
  },
  // Chapter 9
  {
    id: 18,
    type: 'chapter-intro',
    chapter: 'Chapter 9',
    chapterNum: 9,
    title: 'Punctuation & Capitalization',
    content: `📊 Marks: 5

Capital-এর ৮ নিয়ম:
1. বাক্যের শুরুতে
2. "I" সর্বদা
3. নাম (Proper Noun)
4. দিন/মাস/উৎসব
5. জাতি/ভাষা/ধর্ম
6. পুস্তক/পত্রিকার নাম
7. Institution
8. Allah/God

Dialogue Rules:
said + comma + "Capital...?"
"প্রশ্ন?" + said + subject.
indirect-এ ? নয়!

its = তার | it's = it is`
  },
  // Revision
  {
    id: 19,
    type: 'content',
    chapter: 'REVISION',
    title: 'Grammar in 10 Pages — Quick Revision',
    content: `📄 Ch-1 Gap Filling: slot→দল চেনো + form change
📄 Ch-2 Table: Subject↔Verb মিলাও + Meaning Test
📄 Ch-3 Verbs: ৫-সেকেন্ড formula (আগে কী? subject কে? সময়?)
📄 Ch-4 Changing: অর্থ-লক না ভাঙো! Neg জোড়া মুখস্থ
📄 Ch-5 Tag: polarity উল্টো + special cases
📄 Ch-6 Suffix: slotদল + spelling + prefix
📄 Ch-7 Prep: fixed pair ৫০টা মুখস্থ
📄 Ch-8 Connectors: ৭ দল + ৩ প্রশ্ন
📄 Ch-9 Punctuation: Capital ৮ নিয়ম + dialogue

🎯 1 Hour Before Exam Checklist:
☐ Ch-3 signals | ☐ Ch-5 specials | ☐ Ch-6 suffix list
☐ Ch-7 pairs | ☐ Ch-8 ৭ দল | ☐ Ch-9 dialogue rules`
  },
  // Model Test
  {
    id: 20,
    type: 'content',
    chapter: 'MODEL TEST 1',
    title: 'Full Model Test — 60 Marks',
    content: `Q1. Gap filling (10 marks)
Box: an | the | of | in | to | peace | bring | without | for | from

(a) ___ honest man is loved by all.
(b) Honesty is ___ best policy.
(c) A man ___ honesty is hated everywhere.
(d) It is ___ ornament of a man's character.
(e) It can ___ peace of mind.

Q2. Substitution Table (5 marks)
Education | enlightens | a man gradually
It | can remove | darkness from the mind
We | should acquire | knowledge

Q3. Right form of verbs (10 marks)
Education (a)___ (be) the backbone of a nation.
It (b)___ (enlighten) our mind.

Q5. Tag questions (5 marks)
(a) Everyone knows this, ___?
(b) Let us go there, ___?

✅ Answers:
Q1: (a) An (b) the (c) without (d) an (e) bring
Q5: (a) don't they? (b) shall we?`
  },
]
