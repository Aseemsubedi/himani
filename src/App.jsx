import { PDFDocument, degrees, rgb } from 'pdf-lib'
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll } from 'framer-motion'
import { geoNaturalEarth1, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  BookOpenText,
  Briefcase,
  Building2,
  Calculator,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileCheck,
  Globe2,
  GraduationCap,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Mic2,
  Monitor,
  PenLine,
  Phone,
  ShieldCheck,
  ArrowRight,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Menu,
  Sparkles,
  Star,
  Video,
  X,
} from 'lucide-react'
import { Link, NavLink, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { blogPosts, getPostBySlug } from './data/blogPosts'
import './App.css'

/** Brisbane office — aligned with public listing on himaniglobal.com */
const OFFICE_BRISBANE_ADDRESS = 'East Brisbane QLD, 4169'
const OFFICE_BRISBANE_MAP_URL = 'https://maps.google.com/?q=1+Lomond+Terrace+East+Brisbane+QLD+4169'

/** Chitwan / Bharatpur office */
const OFFICE_CHITWAN_ADDRESS = 'Level 1, Kamalnagar Chowk, Bharatpur, Nepal'

const SOCIAL_FACEBOOK_URL = 'https://www.facebook.com/himaniglobal'
const SOCIAL_INSTAGRAM_URL = 'https://www.instagram.com/himaniglobaleduvisa'
const SOCIAL_TIKTOK_URL = 'https://www.tiktok.com/@himaniglobal'

/** Phone numbers — single source for contact blocks */
const PHONE_BRISBANE_A = '+61 451 200 644'
const PHONE_BRISBANE_B = '0424 942 948'
const PHONE_WHATSAPP = '+61 424 942 948'
const PHONE_WHATSAPP_WA_ME = 'https://wa.me/61424942948'
const PHONE_CHITWAN_LANDLINE = '+977 56 490 603'
const PHONE_CHITWAN_MOBILE = '+977 986 244 7952'
const PHONE_KATHMANDU = '+977 984 590 2662'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Destinations', to: '/destinations' },
  { label: 'Tools', to: '/tools' },
  { label: 'Services', to: '/services' },
  {
    label: 'IELTS & PTE',
    to: '/english-classes',
    activePaths: ['/english-classes', '/ielts', '/pte'],
  },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

function minDateInputValue() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function ContactDirectory({ variant = 'page' }) {
  const isAside = variant === 'aside'
  return (
    <div
      className={
        isAside ? 'contact-directory contact-directory--aside' : 'contact-directory contact-directory--page'
      }
    >
      <div className="contact-directory-region">
        <p className="contact-directory-city">
          <MapPin size={14} aria-hidden />
          Brisbane, Australia
        </p>
        <p className="contact-directory-phones">
          <Phone size={14} aria-hidden />
          <a href="tel:+61451200644">{PHONE_BRISBANE_A}</a>
          <span className="contact-sep" aria-hidden>
            ·
          </span>
          <a href="tel:+61424942948">{PHONE_BRISBANE_B}</a>
        </p>

        <p className="contact-directory-row">
          <MessageCircle size={14} aria-hidden />
          <span>WhatsApp</span>
          <a href={PHONE_WHATSAPP_WA_ME} target="_blank" rel="noopener noreferrer">
            {PHONE_WHATSAPP}
            <ExternalLink size={isAside ? 12 : 13} className="contact-wa-icon" aria-hidden />
          </a>
        </p>

        <p className="contact-directory-row">
          <MapPin size={14} aria-hidden />
          <a href={OFFICE_BRISBANE_MAP_URL} target="_blank" rel="noopener noreferrer">
            {OFFICE_BRISBANE_ADDRESS}
          </a>
        </p>
      </div>

      <div className="contact-directory-region">
        <p className="contact-directory-city">
          <MapPin size={14} aria-hidden />
          Chitwan, Nepal
        </p>
        <p className="contact-directory-phones">
          <Phone size={14} aria-hidden />
          <a href="tel:+97756490603">{PHONE_CHITWAN_LANDLINE}</a>
          <span className="contact-sep" aria-hidden>
            ·
          </span>
          <a href="tel:+9779862447952">{PHONE_CHITWAN_MOBILE}</a>
        </p>
        <p className="contact-directory-row">
          <MapPin size={14} aria-hidden />
          <span>{OFFICE_CHITWAN_ADDRESS}</span>
        </p>
      </div>

      <div className="contact-directory-region">
        <p className="contact-directory-city">
          <MapPin size={14} aria-hidden />
          Kathmandu, Nepal
        </p>
        <p className="contact-directory-phones">
          <Phone size={14} aria-hidden />
          <a href="tel:+9779845902662">{PHONE_KATHMANDU}</a>
          <span className="contact-directory-soon" role="status">
            <Clock size={14} aria-hidden />
            Opening soon
          </span>
        </p>
      </div>
    </div>
  )
}

function WhatsAppWidget() {
  return (
    <a
      className="whatsapp-widget"
      href={PHONE_WHATSAPP_WA_ME}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat on WhatsApp"
    >
      <MessageCircle size={20} aria-hidden />
      <span>Chat on WhatsApp</span>
    </a>
  )
}

const services = [
  { title: 'Career Counseling', icon: GraduationCap },
  { title: 'Admission Support', icon: BookOpenText },
  { title: 'Visa Documentation', icon: ShieldCheck },
  { title: 'IELTS / PTE Preparation', icon: Briefcase },
]

const countryDetails = [
  {
    name: 'Australia',
    flag: '🇦🇺',
    duration: 'Bachelor 3 years | Master 2 years',
    budget: 'Approx. AUD 24,000 - 45,000/year',
    requirement: 'Academic docs, finance proof, Genuine Student profile',
  },
  {
    name: 'New Zealand',
    flag: '🇳🇿',
    duration: 'Bachelor 3 years | Master 1–2 years',
    budget: 'Approx. NZD 22,000 - 45,000/year',
    requirement: 'Academic docs, finance proof, genuine student profile',
  },
  {
    name: 'United Kingdom',
    flag: '🇬🇧',
    duration: 'Bachelor 3 years | Master 1 year',
    budget: 'Approx. GBP 14,000 - 30,000/year',
    requirement: 'CAS process, funds, English requirements',
  },
  {
    name: 'USA',
    flag: '🇺🇸',
    duration: 'Bachelor 4 years | Master 1.5-2 years',
    budget: 'Approx. USD 20,000 - 55,000/year',
    requirement: 'Academic profile, financial readiness, interview prep',
  },
  {
    name: 'Denmark',
    flag: '🇩🇰',
    duration: 'Bachelor 3 years | Master 2 years',
    budget: 'Approx. EUR 8,000 - 16,000/year',
    requirement: 'Program eligibility, funds, residence permit process',
  },
]

const quickInfoConsultation = {
  badge: 'Advisory · Opening session',
  title: 'Profile audit',
  headline: '20–30 minutes',
  lead:
    'We hear your goals and constraints first, then map how your profile, budget, language path, and timeline line up with the countries you are considering — clear options before you sink time or fees into the wrong corridor.',
  outcomes: [
    'Capture priorities: target countries or cities, budget band, intake timing, and what a good outcome looks like for you and your family',
    'Compare corridors with intent: fit for your profile, rule and cost differences, and realistic intake rhythms (e.g. Australia, New Zealand, UK, USA, Denmark)',
    'Leave with a short action list: documents to pull, tests or English steps to book, and deadline anchors for each place still on your list',
  ],
}

const quickInfoIntakes = {
  title: 'Intake logic by destination',
  subtitle:
    'Calendars and cutoffs change by country and school type. We fold your shortlist into one master timeline instead of forcing a single-country template onto every file.',
  rows: [
    {
      name: 'Australia & similar',
      window: 'Often Feb / Jul',
      note: 'High-volume cycles; competitive courses need earlier course search and English readiness.',
    },
    {
      name: 'New Zealand',
      window: 'Often Feb / Jul',
      note: 'Similar intake rhythm to Australia; offer of place, funds, and genuine student narrative must align before visa lodgement.',
    },
    {
      name: 'United Kingdom',
      window: 'Sep / Jan focus',
      note: 'Typical academic-year starts; CAS and funds timing must align with your offer and visa class.',
    },
    {
      name: 'United States',
      window: 'Fall / Spring',
      note: 'Term structure varies by school; we align I-20, funding proof, and interview prep to your admit.',
    },
    {
      name: 'Denmark & EU-style',
      window: 'Sep / Feb varies',
      note: 'Program-specific starts; residence permit and block-account style rules need early verification.',
    },
  ],
}

const quickInfoFacts = [
  {
    icon: Globe2,
    label: 'Destination coverage',
    value: 'Multi-country',
    hint: 'Australia, New Zealand, UK, USA, Denmark, and more — one disciplined process, country-specific checklists.',
  },
  {
    icon: Clock,
    label: 'First structured response',
    value: 'Same business day',
    hint: 'During office hours; layered cases get a booked follow-up instead of a rushed reply.',
  },
  {
    icon: Headphones,
    label: 'Counselor continuity',
    value: 'Single owner',
    hint: 'One lead counselor per active file so decisions and history stay coherent across borders.',
  },
  {
    icon: ShieldCheck,
    label: 'Compliance stance',
    value: 'No outcome promises',
    hint: 'Accurate documentation and preparation; final visa and admission decisions sit with authorities and institutions.',
  },
]

const visaCheckerDestinations = countryDetails.map((c) => c.name)

const visaCorridorThemes = {
  Australia: [
    'Subclass and CoE alignment: confirm the student visa class matches your course provider and intake.',
    'Genuine Student (GS) narrative, study history, and finances must read consistently across forms and interviews.',
    'Funds for tuition, living costs, and OSHC — acceptable sponsor/bank formats change; verify against current immigration instructions.',
  ],
  'New Zealand': [
    'Fee Paying Student Visa: offer of place from an approved provider must match course dates, fees, and your study plan.',
    'Genuine student / bona fide applicant narrative, study history, and finances must read consistently across forms and any interview.',
    'Funds for tuition, living costs, and return travel — verify acceptable sponsor/bank formats against current Immigration New Zealand instructions.',
  ],
  'United Kingdom': [
    'CAS timing, tuition deposit, and TB test (where required) must line up before visa application.',
    'Maintenance funds: amount, 28-day rule style evidence, and acceptable account types for your situation.',
    'Credibility interview risk if gaps or course changes — prepare a coherent study and return narrative.',
  ],
  USA: [
    'I-20 program dates, SEVIS fee, and DS-160 consistency with financial evidence and ties to home country.',
    'F-1 maintenance of status and work authorization rules — avoid assumptions about off-campus work.',
    'Embassy interview readiness: program, funding, and post-study intent must align with documentation.',
  ],
  Denmark: [
    'Study residence permit vs program start — block-account or funding proof rules vary; confirm current Danish Agency requirements.',
    'English or Danish language proof as required by your admit; biometric and insurance steps in the correct order.',
    'Housing and CPR follow-on steps are post-arrival but sometimes affect planning — map early with your counselor.',
  ],
}

function buildVisaCheckerReadout(fields) {
  const {
    destination,
    studyLevel,
    admissionStage,
    englishStatus,
    fundsPicture,
    preferredSubject,
    preferredUniversity,
    intakePreference,
    scholarshipFocus,
    financialPosition,
    budgetBandNpr,
    personalNotes,
  } = fields
  const themes = visaCorridorThemes[destination] || visaCorridorThemes.Australia
  const lines = []

  const lineOr = (s) => (s && String(s).trim() ? String(s).trim() : 'Not provided yet')

  const levelLabels = {
    secondary: 'Secondary / pathway',
    undergraduate: 'Undergraduate',
    postgraduate: 'Postgraduate',
  }
  const admissionLabels = {
    exploring: 'Exploring programs',
    applied: 'Applied / awaiting decision',
    offer_conditional: 'Offer (conditional)',
    offer_unconditional: 'Offer (unconditional) / CAS or I-20 stage',
    not_sure: 'Not sure',
  }
  const englishLabels = {
    not_started: 'Not started / planning',
    booked: 'Booked / in progress',
    scored_meets: 'Score on hand (meets targets)',
    scored_below: 'Score on hand (below targets)',
  }
  const fundsLabels = {
    early_planning: 'Early — estimating totals and sponsor flow',
    partial: 'Partial — amounts mapped, proof types not final',
    rough_ready: 'Stronger — ready to review proof formats with counselor',
  }
  const intakeLabels = {
    flexible: 'Flexible',
    '2026_1': 'First half of 2026',
    '2026_2': 'Second half of 2026',
    2027: '2027 or later',
    unsure: 'Not sure yet',
  }
  const scholarshipLabels = {
    exploring: 'Exploring scholarship options',
    merit: 'Targeting merit / competitive awards',
    need: 'Need-based aid / bursaries important',
    partial_ok: 'Partial scholarship would help a lot',
    self: 'Primarily self-funded; scholarship is bonus',
    not_sure: 'Not sure',
  }
  const financialPositionLabels = {
    family_sponsor: 'Primarily family / approved sponsor',
    self_savings: 'Own savings with possible family support',
    education_loan: 'Education loan is part of the plan',
    scholarship_first: 'Need meaningful scholarship to proceed',
    hybrid: 'Mix (family + self + loan / TBC)',
    prefer_not_say: 'Prefer to discuss privately',
  }
  const budgetLabels = {
    mapping: 'Still mapping total need vs capacity',
    u10: 'Roughly under ~10L NPR (ballpark)',
    '10_25': 'Roughly ~10–25L NPR (ballpark)',
    '25_40': 'Roughly ~25–40L NPR (ballpark)',
    '40p': 'Roughly 40L+ NPR (ballpark)',
    unsure: 'Unsure / depends on offer',
  }

  lines.push('HIMANI GLOBAL EDUCATION & VISA SERVICES — STUDENT VISA READINESS (INDICATIVE)')
  lines.push('')
  lines.push(
    'Important: This is not legal advice, not an immigration decision, and not a guarantee of a visa or admission. Authorities and institutions decide outcomes. Use this sheet to prepare questions for a qualified counselor.',
  )
  lines.push('')
  lines.push('— Your profile (visa pathway) —')
  lines.push(`Destination focus: ${destination}`)
  lines.push(`Study level: ${levelLabels[studyLevel] || studyLevel}`)
  lines.push(`Target intake timing: ${intakeLabels[intakePreference] || intakePreference}`)
  lines.push(`Admission stage: ${admissionLabels[admissionStage] || admissionStage}`)
  lines.push(`English / language tests: ${englishLabels[englishStatus] || englishStatus}`)
  lines.push('')
  lines.push('— Study preferences (for counseling alignment) —')
  lines.push(`Preferred subject / field: ${lineOr(preferredSubject)}`)
  lines.push(`Preferred university(ies) or type: ${lineOr(preferredUniversity)}`)
  lines.push(
    `Scholarship & aid focus: ${scholarshipLabels[scholarshipFocus] || scholarshipFocus}`,
  )
  lines.push('')
  lines.push('— Financial position (self-assessment) —')
  lines.push(
    `How you are planning to fund: ${financialPositionLabels[financialPosition] || financialPosition}`,
  )
  lines.push(
    `Budget band (NPR, rough – for planning only): ${budgetLabels[budgetBandNpr] || budgetBandNpr}`,
  )
  lines.push(
    `Documentation readiness (bank formats, sponsors, proof): ${fundsLabels[fundsPicture] || fundsPicture}`,
  )
  if (lineOr(personalNotes) !== 'Not provided yet') {
    lines.push('')
    lines.push('— You also told us (optional) —')
    for (const p of String(personalNotes).trim().split('\n')) {
      if (p.trim()) lines.push(`• ${p.trim()}`)
    }
  }
  lines.push('')
  lines.push(`— Typical themes for ${destination} student pathways —`)
  for (const t of themes) {
    lines.push(`• ${t}`)
  }
  lines.push('')
  lines.push('— Indicative readiness notes (based only on your answers) —')

  const notes = []
  if (admissionStage === 'exploring' || admissionStage === 'not_sure') {
    notes.push(
      'Admission is usually sequenced before a student visa in most corridors: clarify course, provider, and offer conditions before locking visa timelines.',
    )
  }
  if (admissionStage === 'applied') {
    notes.push(
      'While decisions are pending, pre-align finances, English proof, and any corridor-specific health or credibility prep so you are not flat-footed after an offer.',
    )
  }
  if (admissionStage === 'offer_conditional') {
    notes.push(
      'Meet offer conditions early (English, deposits, academics) so CAS, I-20, or enrolment steps do not compress your visa window.',
    )
  }
  if (admissionStage === 'offer_unconditional') {
    notes.push(
      'You indicated a firmer admission position — next is aligning visa class, financial evidence, and health checks to provider and immigration instructions.',
    )
  }
  if (englishStatus === 'not_started' || englishStatus === 'scored_below') {
    notes.push(
      'English testing is often a hard gate: plan a credible test date and minimum scores that match your admits, not generic internet averages.',
    )
  }
  if (englishStatus === 'booked') {
    notes.push(
      'Test in progress: line up score release dates with admission and visa deadlines so you do not miss a submission window.',
    )
  }
  if (fundsPicture === 'early_planning') {
    notes.push(
      'Early on funds: map tuition instalments, living band for the city, currency of funds, and sponsor logic early — weak finance narratives are a common rework source.',
    )
  }
  if (fundsPicture === 'partial') {
    notes.push(
      'Partial funds mapping: lock which accounts, currencies, and sponsor letters are admissible for your corridor before you format final bank packets.',
    )
  }
  if (fundsPicture === 'rough_ready') {
    notes.push(
      'You indicated stronger fund planning — still verify acceptable proof types, holding-period style rules, and corridor-specific insurance or deposit sequencing with current instructions.',
    )
  }
  if (scholarshipFocus === 'need' || scholarshipFocus === 'merit' || scholarshipFocus === 'partial_ok') {
    notes.push(
      'Scholarship plan: build a parallel timeline for institution merit or external awards — but visa financial proof usually requires liquid, rule-compliant funds, not unconfirmed future scholarships; split "wish list" from "proven for visa".',
    )
  }
  if (financialPosition === 'scholarship_first') {
    notes.push(
      'Heavy dependence on unconfirmed aid: be explicit with counsellors on minimum viable funding if awards under-deliver, so backup proof or alternate corridors can be stress-tested early.',
    )
  }
  if (financialPosition === 'education_loan') {
    notes.push(
      'Loan in the mix: line up sanction letters, disbursal logic, and how that maps to each corridor’s “available funds” story before interview or submission.',
    )
  }
  if (budgetBandNpr === 'u10' && (destination === 'USA' || destination === 'United Kingdom' || destination === 'New Zealand')) {
    notes.push(
      'You indicated a tighter NPR band for high-cost destinations — course choice, city, and scholarship strategy may need a hard look so your narrative and numbers stay believable in file and interview.',
    )
  }
  if (!preferredSubject || !String(preferredSubject).trim()) {
    notes.push(
      'Add your preferred field of study in the next version of this form or in session — it sharpens GTE, CAS, and statement alignment.',
    )
  }
  if (!preferredUniversity || !String(preferredUniversity).trim()) {
    notes.push(
      'If you have dream schools or a shortlist, list them in session — it helps us align intake, deposit rules, and visa timing.',
    )
  }
  if (lineOr(personalNotes) !== 'Not provided yet') {
    notes.push('Review your optional notes with Himani; bring any gaps in academics, health, or family context into that conversation.')
  }
  if (notes.length === 0) {
    notes.push(
      'No major red flags from the few fields selected — still validate every item against current immigration and institution rules before submission.',
    )
  }
  for (const n of notes) {
    lines.push(`• ${n}`)
  }

  lines.push('')
  lines.push('— Book a structured review —')
  lines.push(
    'Bring this text to Himani (Chitwan, Brisbane advisory, or online) so we can stress-test it against your real documents and current immigration instructions.',
  )

  return lines.join('\n')
}

const nepalChecklistDestinationExtras = {
  Australia: [
    'Electronic Confirmation of Enrolment (eCoE) matching course, provider, and fees used in your Genuine Student (GS) responses.',
    'Overseas Student Health Cover (OSHC) for the CoE period (start/end dates aligned).',
    'Financial capacity evidence per current student subclass rules (acceptable account types, sponsor relationship, history — not only a single “balance” figure).',
    'Health exams or biometrics only if requested in your IMMI flow — follow the letter you receive after application.',
  ],
  'New Zealand': [
    'Offer of place and tuition payment evidence aligned with your visa application and intended study start dates.',
    'Financial evidence per current student visa funds requirements (acceptable accounts, sponsor relationship, history).',
    'Medical certificates and police certificates when required for your nationality and intended stay length.',
    'Health and travel insurance planning — confirm provider and policy expectations before lodgement.',
  ],
  'United Kingdom': [
    'CAS number, deposit and tuition details must match CAS and your financial evidence.',
    'Maintenance funds: amount and “28-day” style history if your rule set requires it — verify account type and currency against current Student route caseworker guidance.',
    'TB test from an approved clinic if you lived in a listed country before UK entry (often relevant for Nepal-based students) — book early; validity window matters.',
    'ATAS certificate if your course code requires it — before visa in many cases.',
  ],
  USA: [
    'Signed I-20; SEVIS fee payment proof; DS-160 confirmation; program and financial data consistent across I-20, DS-160, and bank evidence.',
    'Strong ties to home country and non-immigrant intent narrative for the F-1 interview (aligned with your Nepal study plan and funding story).',
    'Embassy interview appointment and any document list from the consulate (bring originals and clean copies you can hand over in order).',
  ],
  Denmark: [
    'ST1 residence permit for study: align admit letter, program dates, and funds / block account or scholarship proof to Danish Agency requirements valid at the time of application.',
    'Biometrics and photo per VFS / mission instructions; some steps are appointment-driven.',
    'Housing and CPR are often post-arrival but plan rough timeline so you are not adrift in week one.',
  ],
}

function buildNepalChecklistReadout(fields) {
  const {
    destination,
    studyLevel,
    fileStage,
    fundModel,
  } = fields

  const levelLabel = {
    secondary: 'Secondary / foundation / pathway',
    undergraduate: 'Undergraduate (e.g. after +2 / equivalent)',
    postgraduate: 'Postgraduate (Bachelor complete or in progress as applicable)',
  }

  const stageLabel = {
    early: 'Still shortlisting or applying to institutions',
    offer: 'Offer or provisional admission in hand (conditions may apply)',
    enrollment: 'Enrolment / CoE or CAS or I-20 in progress (fees, GS/CAS data)',
    pre_lodge: 'Preparing to lodge student visa (forms and evidence being finalised)',
  }

  const fundLabel = {
    family: 'Family / parent sponsor; Nepal-based bank and income story',
    loan: 'Education loan (Nepal or partner bank) in the plan',
    self: 'Self + family mix (savings, income, top-ups)',
    scholarship: 'Scholarship or bursary is material to funding; verify what counts for the visa class',
  }

  const lines = []
  lines.push('HIMANI GLOBAL — STUDENT VISA CHECKLIST (NEPALI STUDENT / NEPAL ORIGIN) — INDICATIVE')
  lines.push('')
  lines.push(
    'This is a planning checklist only, not a complete or legally binding list. Immigration rules, institution rules, and document formats change. Himani does not guarantee visa outcomes. Use this to gather papers and to brief your counselor.',
  )
  lines.push('')
  lines.push('— Your selections —')
  lines.push(`Target destination (student route): ${destination}`)
  lines.push(`Study level: ${levelLabel[studyLevel] || studyLevel}`)
  lines.push(`Where you are in the process: ${stageLabel[fileStage] || fileStage}`)
  lines.push(`Funding model (broad): ${fundLabel[fundModel] || fundModel}`)
  lines.push('')

  lines.push('— A. Identity, civil status & family (Nepal) —')
  lines.push('• Valid passport: remaining validity and blank pages for visas per mission practice; renew early in Nepal if needed.')
  lines.push('• Nepali citizenship certificate; English translations where institutions/embassies require; spellings consistent across all ID and bank.')
  if (fundModel === 'family' || fundModel === 'self') {
    lines.push(
      '• Relationship to sponsors: if parents or relatives fund you, keep proof of relationship and sponsor letters with amounts and account references aligned to bank books.',
    )
  }
  lines.push('• Recent passport-size photos (some missions specify size/background; keep extras).')
  lines.push('')

  lines.push('— B. Academic & testing (typical for Nepal file) —')
  if (studyLevel === 'secondary') {
    lines.push('• SEE / equivalent transcripts and character / migration; pathway course offer if applicable.')
  } else {
    lines.push('• NEB +2 transcripts, provisional, character, migration, and any gap explanation if applicable.')
  }
  if (studyLevel === 'undergraduate' || studyLevel === 'postgraduate') {
    lines.push('• University transcripts, degree/provisional, backlogs or gap letters if your story needs them; MOE recognition notes if counsel asks.')
  }
  lines.push('• IELTS / PTE / other English score sheet matching institution and visa class minimums (validity window in mind for admissions vs visa).')
  lines.push('• CV, SOP, or research proposal only if your admit or program explicitly requires them; align dates and names with all other files.')
  lines.push('')

  lines.push('— C. Finances (Nepal-side preparation) —')
  if (fundModel === 'family' || fundModel === 'self') {
    lines.push('• Bank statements, balance certificates, and transaction history in acceptable format for the corridor you are using (NPR/FCY per rules).')
    lines.push('• Income evidence for sponsors: tax, salary, business, land, or other assets only if your narrative uses them; avoid dumping unrelated pages.')
  }
  if (fundModel === 'loan') {
    lines.push('• Education loan sanction / disbursement plan from the bank; map how tranches line up with tuition and living proof required on the student route.')
  }
  if (fundModel === 'scholarship') {
    lines.push('• Official scholarship or fee-reduction letter; separate liquid funds may still be required for the visa — do not assume award alone is enough for immigration proof until verified.')
  }
  lines.push('• If fixed deposits are broken, keep break letters and a clean trail. Large unexplained credits invite questions.')
  lines.push('')

  lines.push('— D. Police, health, and good character (use when applicable) —')
  lines.push('• Nepal Police clearance or background certificate per post rules and validity; apply with enough buffer before visa or interview deadlines.')
  if (destination === 'United Kingdom') {
    lines.push('• TB test from a Home Office–approved clinic for stays over six months in UK student route (confirm current country list and nearest clinic to Nepal / travel).')
  }
  lines.push('• Medical exams only if the visa post or the online form explicitly asks; do not pre-book unnecessary panels unless instructions say so.')
  lines.push('')

  const extras = nepalChecklistDestinationExtras[destination] || nepalChecklistDestinationExtras.Australia
  lines.push(`— E. Add-ons for ${destination} (student route — verify against current instruction) —`)
  for (const e of extras) {
    lines.push(`• ${e}`)
  }
  lines.push('')

  lines.push('— F. Before you submit or interview —')
  if (fileStage === 'early') {
    lines.push('• You are still early: use this list to pre-build a folder tree (identity / academics / funds / offer) so nothing is scrambled when deadlines compress.')
  }
  if (fileStage === 'pre_lodge' || fileStage === 'enrollment') {
    lines.push('• Cross-check every name, date, and amount across offer/CoE/CAS/I-20, financial proof, and application forms; one mismatch is a common refusal driver.')
  }
  lines.push('• Scan in colour, label files clearly, and keep originals travel-ready for VFS, embassy, or port of entry as instructed.')
  lines.push('• Book Himani to line-item this list against the exact subclass or route and your real documents in Nepal and abroad.')
  lines.push('')

  return lines.join('\n')
}

function StudentVisaEligibilityChecker() {
  const [destination, setDestination] = useState(visaCheckerDestinations[0])
  const [studyLevel, setStudyLevel] = useState('undergraduate')
  const [admissionStage, setAdmissionStage] = useState('exploring')
  const [englishStatus, setEnglishStatus] = useState('not_started')
  const [fundsPicture, setFundsPicture] = useState('early_planning')
  const [preferredSubject, setPreferredSubject] = useState('')
  const [preferredUniversity, setPreferredUniversity] = useState('')
  const [intakePreference, setIntakePreference] = useState('flexible')
  const [scholarshipFocus, setScholarshipFocus] = useState('exploring')
  const [financialPosition, setFinancialPosition] = useState('family_sponsor')
  const [budgetBandNpr, setBudgetBandNpr] = useState('mapping')
  const [personalNotes, setPersonalNotes] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  function handleGenerate() {
    setOutput(
      buildVisaCheckerReadout({
        destination,
        studyLevel,
        admissionStage,
        englishStatus,
        fundsPicture,
        preferredSubject,
        preferredUniversity,
        intakePreference,
        scholarshipFocus,
        financialPosition,
        budgetBandNpr,
        personalNotes,
      }),
    )
    setCopied(false)
  }

  async function handleCopy() {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const selectClass = 'tools-checker-select'

  return (
    <motion.div
      className="panel tools-checker"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <div className="tools-checker-head">
        <div className="tools-checker-icon" aria-hidden>
          <ShieldCheck size={24} strokeWidth={2} />
        </div>
        <div>
          <h3 className="tools-checker-title">Student visa eligibility checker</h3>
          <p className="tools-checker-sub">
            Indicative readiness only — not a visa decision. Add your study and money story, generate a
            personal note you can copy, then book Himani to validate against real rules and documents.
          </p>
        </div>
      </div>

      <p className="tools-checker-section-label">Visa pathway</p>
      <div className="tools-checker-grid">
        <div className="tools-checker-field">
          <label htmlFor="visa-destination">Destination focus</label>
          <select
            id="visa-destination"
            className={selectClass}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            {visaCheckerDestinations.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="tools-checker-field">
          <label htmlFor="visa-level">Study level</label>
          <select
            id="visa-level"
            className={selectClass}
            value={studyLevel}
            onChange={(e) => setStudyLevel(e.target.value)}
          >
            <option value="secondary">Secondary / pathway</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="postgraduate">Postgraduate</option>
          </select>
        </div>
        <div className="tools-checker-field">
          <label htmlFor="visa-admission">Admission stage</label>
          <select
            id="visa-admission"
            className={selectClass}
            value={admissionStage}
            onChange={(e) => setAdmissionStage(e.target.value)}
          >
            <option value="exploring">Exploring programs</option>
            <option value="applied">Applied / awaiting decision</option>
            <option value="offer_conditional">Offer (conditional)</option>
            <option value="offer_unconditional">Offer (unconditional) / CAS or I-20 stage</option>
            <option value="not_sure">Not sure</option>
          </select>
        </div>
        <div className="tools-checker-field">
          <label htmlFor="visa-english">English / test status</label>
          <select
            id="visa-english"
            className={selectClass}
            value={englishStatus}
            onChange={(e) => setEnglishStatus(e.target.value)}
          >
            <option value="not_started">Not started / planning</option>
            <option value="booked">Booked / in progress</option>
            <option value="scored_meets">Score on hand (meets current targets)</option>
            <option value="scored_below">Score on hand (below current targets)</option>
          </select>
        </div>
        <div className="tools-checker-field">
          <label htmlFor="visa-intake">Target intake timing</label>
          <select
            id="visa-intake"
            className={selectClass}
            value={intakePreference}
            onChange={(e) => setIntakePreference(e.target.value)}
          >
            <option value="flexible">Flexible</option>
            <option value="2026_1">First half of 2026</option>
            <option value="2026_2">Second half of 2026</option>
            <option value="2027">2027 or later</option>
            <option value="unsure">Not sure yet</option>
          </select>
        </div>
      </div>

      <p className="tools-checker-section-label">Study preferences</p>
      <div className="tools-checker-grid">
        <div className="tools-checker-field tools-checker-field--wide">
          <label htmlFor="visa-subject">Preferred subject / field (e.g. IT, Nursing, Business)</label>
          <input
            id="visa-subject"
            type="text"
            className="tools-checker-input"
            value={preferredSubject}
            onChange={(e) => setPreferredSubject(e.target.value)}
            placeholder="e.g. Computer Science, Health Sciences"
            autoComplete="off"
          />
        </div>
        <div className="tools-checker-field tools-checker-field--wide">
          <label htmlFor="visa-uni">Preferred university(ies) or type of institution</label>
          <input
            id="visa-uni"
            type="text"
            className="tools-checker-input"
            value={preferredUniversity}
            onChange={(e) => setPreferredUniversity(e.target.value)}
            placeholder="e.g. Group of Eight, Russell Group, or specific names"
            autoComplete="off"
          />
        </div>
        <div className="tools-checker-field tools-checker-field--wide">
          <label htmlFor="visa-scholarship">Scholarship &amp; aid focus</label>
          <select
            id="visa-scholarship"
            className={selectClass}
            value={scholarshipFocus}
            onChange={(e) => setScholarshipFocus(e.target.value)}
          >
            <option value="exploring">Exploring scholarship options</option>
            <option value="merit">Targeting merit / competitive awards</option>
            <option value="need">Need-based aid / bursaries matter</option>
            <option value="partial_ok">Partial scholarship would help a lot</option>
            <option value="self">Primarily self-funded; scholarship is a bonus</option>
            <option value="not_sure">Not sure</option>
          </select>
        </div>
      </div>

      <p className="tools-checker-section-label">Financial position</p>
      <div className="tools-checker-grid">
        <div className="tools-checker-field">
          <label htmlFor="visa-financial">How you plan to fund studies</label>
          <select
            id="visa-financial"
            className={selectClass}
            value={financialPosition}
            onChange={(e) => setFinancialPosition(e.target.value)}
          >
            <option value="family_sponsor">Primarily family / approved sponsor</option>
            <option value="self_savings">Own savings with possible family support</option>
            <option value="education_loan">Education loan in the plan</option>
            <option value="scholarship_first">Need meaningful scholarship to proceed</option>
            <option value="hybrid">Mix (family + self + loan / TBC)</option>
            <option value="prefer_not_say">Prefer to discuss privately</option>
          </select>
        </div>
        <div className="tools-checker-field">
          <label htmlFor="visa-budget-npr">Rough budget capacity (NPR, ballpark)</label>
          <select
            id="visa-budget-npr"
            className={selectClass}
            value={budgetBandNpr}
            onChange={(e) => setBudgetBandNpr(e.target.value)}
          >
            <option value="mapping">Still mapping need vs capacity</option>
            <option value="u10">Under ~10L NPR (ballpark)</option>
            <option value="10_25">~10–25L NPR (ballpark)</option>
            <option value="25_40">~25–40L NPR (ballpark)</option>
            <option value="40p">40L+ NPR (ballpark)</option>
            <option value="unsure">Unsure / depends on offer</option>
          </select>
        </div>
        <div className="tools-checker-field tools-checker-field--wide">
          <label htmlFor="visa-funds">Proof &amp; paperwork readiness (banks, sponsors)</label>
          <select
            id="visa-funds"
            className={selectClass}
            value={fundsPicture}
            onChange={(e) => setFundsPicture(e.target.value)}
          >
            <option value="early_planning">Early — still estimating totals and sponsor flow</option>
            <option value="partial">Partial — amounts mapped, proof types not final</option>
            <option value="rough_ready">Stronger — ready to review formats with a counselor</option>
          </select>
        </div>
      </div>

      <p className="tools-checker-section-label">Anything else (optional)</p>
      <div className="tools-checker-field tools-checker-field--wide tools-checker-field--notes">
        <label htmlFor="visa-notes">Gap years, work experience, health, or family context</label>
        <textarea
          id="visa-notes"
          className="tools-checker-textarea tools-checker-textarea--compact"
          rows={3}
          maxLength={600}
          value={personalNotes}
          onChange={(e) => setPersonalNotes(e.target.value)}
          placeholder="Short notes only — e.g. 1-year gap after +2, parents as sponsors, IELTS booked for March…"
        />
      </div>

      <div className="tools-checker-actions">
        <button type="button" className="btn-gold" onClick={handleGenerate}>
          Generate readiness note
        </button>
        <button type="button" className="btn-ghost" onClick={handleCopy} disabled={!output}>
          <Copy size={16} aria-hidden />
          {copied ? 'Copied' : 'Copy text'}
        </button>
      </div>

      <label className="tools-checker-output-label" htmlFor="visa-output">
        Your generated note
      </label>
      <textarea
        id="visa-output"
        className="tools-checker-output"
        readOnly
        rows={output ? 16 : 8}
        placeholder='Choose options above, then tap "Generate readiness note". You can copy the result for your records or to share with Himani.'
        value={output}
      />

      <p className="tools-checker-foot">
        <Link className="tools-checker-foot-link" to="/contact#book-meeting">
          Book a meeting to verify this against your file
        </Link>
      </p>
    </motion.div>
  )
}

function NepalStudentVisaChecklistGenerator() {
  const [destination, setDestination] = useState(visaCheckerDestinations[0])
  const [studyLevel, setStudyLevel] = useState('undergraduate')
  const [fileStage, setFileStage] = useState('early')
  const [fundModel, setFundModel] = useState('family')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const selectClass = 'tools-checker-select'

  function handleGenerate() {
    setOutput(
      buildNepalChecklistReadout({
        destination,
        studyLevel,
        fileStage,
        fundModel,
      }),
    )
    setCopied(false)
  }

  async function handleCopy() {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <motion.div
      id="nepal-visa-checklist"
      className="panel tools-checker tools-checker--nepal"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: 0.04 }}
    >
      <div className="tools-checker-head">
        <div className="tools-checker-icon tools-checker-icon--nepal" aria-hidden>
          <FileCheck size={24} strokeWidth={2} />
        </div>
        <div>
          <h3 className="tools-checker-title">Student Visa Checklist Generator (Nepali student)</h3>
          <p className="tools-checker-sub">
            For students preparing from Nepal: a structured document list (identity, NEB/HEI academics,
            sponsor and bank, police/TB when relevant) plus destination add-ons. Indicative only — not a
            complete legal list; book Himani to match your exact course and visa subclass.
          </p>
        </div>
      </div>

      <div className="tools-checker-grid">
        <div className="tools-checker-field">
          <label htmlFor="nepal-destination">Destination (student route)</label>
          <select
            id="nepal-destination"
            className={selectClass}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            {visaCheckerDestinations.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="tools-checker-field">
          <label htmlFor="nepal-level">Study level</label>
          <select
            id="nepal-level"
            className={selectClass}
            value={studyLevel}
            onChange={(e) => setStudyLevel(e.target.value)}
          >
            <option value="secondary">Secondary / foundation / pathway</option>
            <option value="undergraduate">Undergraduate (after +2 / equivalent)</option>
            <option value="postgraduate">Postgraduate</option>
          </select>
        </div>
        <div className="tools-checker-field">
          <label htmlFor="nepal-stage">File stage</label>
          <select
            id="nepal-stage"
            className={selectClass}
            value={fileStage}
            onChange={(e) => setFileStage(e.target.value)}
          >
            <option value="early">Shortlisting or applying to schools</option>
            <option value="offer">Offer in hand (may be conditional)</option>
            <option value="enrollment">Enrolment / CoE, CAS, or I-20 in progress</option>
            <option value="pre_lodge">Preparing to lodge student visa</option>
          </select>
        </div>
        <div className="tools-checker-field">
          <label htmlFor="nepal-fund">Funding model (Nepal context)</label>
          <select
            id="nepal-fund"
            className={selectClass}
            value={fundModel}
            onChange={(e) => setFundModel(e.target.value)}
          >
            <option value="family">Family / parent sponsor; Nepal banks</option>
            <option value="loan">Education loan in the plan</option>
            <option value="self">Self + family mix</option>
            <option value="scholarship">Scholarship is important to the plan</option>
          </select>
        </div>
      </div>

      <div className="tools-checker-actions">
        <button type="button" className="btn-gold" onClick={handleGenerate}>
          Generate checklist
        </button>
        <button type="button" className="btn-ghost" onClick={handleCopy} disabled={!output}>
          <Copy size={16} aria-hidden />
          {copied ? 'Copied' : 'Copy text'}
        </button>
      </div>

      <label className="tools-checker-output-label" htmlFor="nepal-checklist-output">
        Your generated checklist
      </label>
      <textarea
        id="nepal-checklist-output"
        className="tools-checker-output"
        readOnly
        rows={output ? 18 : 7}
        placeholder='Pick destination and options, then tap "Generate checklist". Use the copy for your file prep; verify each item with current instructions.'
        value={output}
      />

      <p className="tools-checker-foot">
        <Link className="tools-checker-foot-link" to="/contact#book-meeting">
          Get this reviewed against your real documents
        </Link>
      </p>
    </motion.div>
  )
}

function ToolPageLayout({ title, subtitle, children }) {
  return (
    <MotionSection className="section tools-section tools-section--page">
      <p className="tools-eyebrow">Planning aids</p>
      <h1 className="tools-main-title">{title}</h1>
      <p className="centered tools-lede">
        {subtitle}
      </p>
      {children}
      <p className="centered tools-foot">
        <Link className="btn-ghost tools-foot-cta" to="/tools">
          Back to all tools
        </Link>
      </p>
    </MotionSection>
  )
}

function computeAustralianGsmPoints(v) {
  const rows = []
  let total = 0

  const agePts = { '18-24': 25, '25-32': 30, '33-39': 25, '40-44': 15, '45-49': 0 }
  const ap = agePts[v.ageBand] ?? 0
  total += ap
  rows.push({ label: 'Age (at time of invitation — indicative band)', pts: ap })

  const engPts = { competent: 0, proficient: 10, superior: 20 }
  const ep = engPts[v.english] ?? 0
  total += ep
  rows.push({
    label: 'English (competent / proficient / superior — verify test mapping)',
    pts: ep,
  })

  const osPts = { none: 0, y3_4: 5, y5_7: 10, y8plus: 15 }
  const op = osPts[v.overseasSkilled] ?? 0
  total += op
  rows.push({ label: 'Overseas skilled employment (skilled occupation, last 10 years — simplified)', pts: op })

  const auPts = { none: 0, y1_2: 5, y3_4: 10, y5_7: 15, y8plus: 20 }
  const au = auPts[v.australianSkilled] ?? 0
  total += au
  rows.push({ label: 'Australian skilled employment (skilled occupation — simplified)', pts: au })

  const qualPts = { trade_diploma: 10, bachelor: 15, doctorate: 20 }
  const qp = qualPts[v.qualification] ?? 0
  total += qp
  rows.push({ label: 'Qualification (Australian or recognised — simplified)', pts: qp })

  if (v.australianStudy) {
    total += 5
    rows.push({ label: 'Australian study requirement (typically 2 years full-time in Australia)', pts: 5 })
  }
  if (v.specialistEducation) {
    total += 10
    rows.push({ label: 'Specialist education qualification (eligible STEM PhD / research master)', pts: 10 })
  }
  if (v.professionalYear) {
    total += 5
    rows.push({ label: 'Professional Year in Australia (eligible program)', pts: 5 })
  }
  if (v.naatiCcl) {
    total += 5
    rows.push({ label: 'Credentialled community language (e.g. NAATI CCL)', pts: 5 })
  }
  if (v.regionalStudy) {
    total += 5
    rows.push({ label: 'Study in regional Australia (eligible criteria)', pts: 5 })
  }

  let pp = 0
  let partnerNote
  if (v.partner === 'single_or_citizen') {
    pp = 10
    partnerNote = 'No partner to claim, or partner is Australian citizen / permanent resident'
  } else if (v.partner === 'partner_skilled') {
    pp = 10
    partnerNote = 'Partner with competent English + suitable skills assessment / nominated occupation'
  } else if (v.partner === 'partner_english') {
    pp = 5
    partnerNote = 'Partner with competent English only'
  } else {
    partnerNote = 'Partner included; not claiming partner points'
  }
  total += pp
  rows.push({ label: `Partner / single (${partnerNote})`, pts: pp })

  const warnings = []
  if ((op > 0 || au > 0) && !v.skillsAssessmentPositive) {
    warnings.push(
      'You selected skilled employment points. For GSM, skilled employment is usually tied to a nominated skilled occupation and a suitable positive skills assessment (or exempt occupation rules). Confirm with current Department of Home Affairs policy.',
    )
  }
  if (total < 65) {
    warnings.push(
      'Subclass 189/190/491 EOIs commonly need at least 65 points to submit; invitations are often issued well above 65 depending on occupation and round.',
    )
  }

  return { total, rows, warnings }
}

function SkillAssessmentPointsCalculator() {
  const [ageBand, setAgeBand] = useState('25-32')
  const [english, setEnglish] = useState('proficient')
  const [overseasSkilled, setOverseasSkilled] = useState('none')
  const [australianSkilled, setAustralianSkilled] = useState('none')
  const [qualification, setQualification] = useState('bachelor')
  const [australianStudy, setAustralianStudy] = useState(false)
  const [specialistEducation, setSpecialistEducation] = useState(false)
  const [professionalYear, setProfessionalYear] = useState(false)
  const [naatiCcl, setNaatiCcl] = useState(false)
  const [regionalStudy, setRegionalStudy] = useState(false)
  const [partner, setPartner] = useState('single_or_citizen')
  const [skillsAssessmentPositive, setSkillsAssessmentPositive] = useState(true)
  const [copied, setCopied] = useState(false)

  const result = useMemo(
    () =>
      computeAustralianGsmPoints({
        ageBand,
        english,
        overseasSkilled,
        australianSkilled,
        qualification,
        australianStudy,
        specialistEducation,
        professionalYear,
        naatiCcl,
        regionalStudy,
        partner,
        skillsAssessmentPositive,
      }),
    [
      ageBand,
      english,
      overseasSkilled,
      australianSkilled,
      qualification,
      australianStudy,
      specialistEducation,
      professionalYear,
      naatiCcl,
      regionalStudy,
      partner,
      skillsAssessmentPositive,
    ],
  )

  const summaryText = useMemo(() => {
    const lines = [
      'HIMANI GLOBAL — INDICATIVE AUSTRALIA SKILLED (GSM-STYLE) POINTS SUMMARY',
      '',
      'Not legal advice. The Department of Home Affairs points test, skilled occupation lists, and skills assessing authorities change. Use the official points calculator before lodging an EOI.',
      '',
      `Indicative total: ${result.total} points`,
      '',
      '— Breakdown —',
    ]
    for (const r of result.rows) {
      lines.push(`${r.label}: ${r.pts}`)
    }
    if (result.warnings.length) {
      lines.push('', '— Notes —')
      for (const w of result.warnings) {
        lines.push(`• ${w}`)
      }
    }
    return lines.join('\n')
  }, [result])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(summaryText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <motion.div
      className="panel tools-checker tools-checker--points"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="tools-checker-head">
        <div className="tools-checker-icon" aria-hidden>
          <Calculator size={22} strokeWidth={2} />
        </div>
        <div>
          <h2 className="tools-checker-title">Inputs</h2>
          <p className="tools-checker-sub">
            Model indicative points for Australia skilled migration pathways (e.g. Subclasses 189, 190, 491).
            A positive skills assessment from the relevant authority (ACS, Engineers Australia, VETASSESS,
            etc.) is normally required before you can claim skilled employment for your nominated occupation—
            this tool does not replace assessing-authority or DHA advice.
          </p>
        </div>
      </div>

      <div className="tools-checker-grid">
        <label className="tools-checker-field">
          <span>Age band (at invitation — estimate)</span>
          <select className="tools-checker-select" value={ageBand} onChange={(e) => setAgeBand(e.target.value)}>
            <option value="18-24">18–24 years (25 pts)</option>
            <option value="25-32">25–32 years (30 pts)</option>
            <option value="33-39">33–39 years (25 pts)</option>
            <option value="40-44">40–44 years (15 pts)</option>
            <option value="45-49">45–49 years (0 pts)</option>
          </select>
        </label>
        <label className="tools-checker-field">
          <span>English level (indicative)</span>
          <select className="tools-checker-select" value={english} onChange={(e) => setEnglish(e.target.value)}>
            <option value="competent">Competent English (0 pts)</option>
            <option value="proficient">Proficient English (10 pts)</option>
            <option value="superior">Superior English (20 pts)</option>
          </select>
        </label>
        <label className="tools-checker-field">
          <span>Overseas skilled employment (outside Australia)</span>
          <select
            className="tools-checker-select"
            value={overseasSkilled}
            onChange={(e) => setOverseasSkilled(e.target.value)}
          >
            <option value="none">Less than 3 years in skilled occupation (0)</option>
            <option value="y3_4">At least 3 but less than 5 years (5)</option>
            <option value="y5_7">At least 5 but less than 8 years (10)</option>
            <option value="y8plus">At least 8 years (15)</option>
          </select>
        </label>
        <label className="tools-checker-field">
          <span>Australian skilled employment</span>
          <select
            className="tools-checker-select"
            value={australianSkilled}
            onChange={(e) => setAustralianSkilled(e.target.value)}
          >
            <option value="none">Less than 1 year (0)</option>
            <option value="y1_2">At least 1 but less than 3 years (5)</option>
            <option value="y3_4">At least 3 but less than 5 years (10)</option>
            <option value="y5_7">At least 5 but less than 8 years (15)</option>
            <option value="y8plus">At least 8 years (20)</option>
          </select>
        </label>
        <label className="tools-checker-field tools-checker-field--wide">
          <span>Highest qualification (simplified)</span>
          <select
            className="tools-checker-select"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
          >
            <option value="trade_diploma">Australian diploma / trade or assessed comparable (10)</option>
            <option value="bachelor">Bachelor or master by coursework (15)</option>
            <option value="doctorate">Doctorate / PhD (20)</option>
          </select>
        </label>
        <label className="tools-checker-field tools-checker-field--wide">
          <span>Partner points</span>
          <select className="tools-checker-select" value={partner} onChange={(e) => setPartner(e.target.value)}>
            <option value="single_or_citizen">No partner to claim, or partner is AU citizen / PR (10)</option>
            <option value="partner_skilled">Partner: competent English + suitable skills assessment (10)</option>
            <option value="partner_english">Partner: competent English only (5)</option>
            <option value="partner_none">Partner on application; not claiming partner points (0)</option>
          </select>
        </label>
      </div>

      <p className="tools-checker-section-label">Australian study & extras</p>
      <div className="tools-points-checkboxes">
        <label className="tools-points-check">
          <input type="checkbox" checked={australianStudy} onChange={(e) => setAustralianStudy(e.target.checked)} />
          <span>Australian study requirement (e.g. 2 years full-time study in Australia) (+5)</span>
        </label>
        <label className="tools-points-check">
          <input
            type="checkbox"
            checked={specialistEducation}
            onChange={(e) => setSpecialistEducation(e.target.checked)}
          />
          <span>Specialist education (eligible STEM PhD / research master) (+10)</span>
        </label>
        <label className="tools-points-check">
          <input type="checkbox" checked={professionalYear} onChange={(e) => setProfessionalYear(e.target.checked)} />
          <span>Professional Year in Australia (eligible) (+5)</span>
        </label>
        <label className="tools-points-check">
          <input type="checkbox" checked={naatiCcl} onChange={(e) => setNaatiCcl(e.target.checked)} />
          <span>Credentialled community language (e.g. NAATI CCL) (+5)</span>
        </label>
        <label className="tools-points-check">
          <input type="checkbox" checked={regionalStudy} onChange={(e) => setRegionalStudy(e.target.checked)} />
          <span>Study in regional Australia (eligible) (+5)</span>
        </label>
        <label className="tools-points-check tools-points-check--emph">
          <input
            type="checkbox"
            checked={skillsAssessmentPositive}
            onChange={(e) => setSkillsAssessmentPositive(e.target.checked)}
          />
          <span>I have (or will have) a positive skills assessment for my nominated skilled occupation</span>
        </label>
      </div>

      <div className="tools-points-result">
        <div className="tools-points-total">
          <span className="tools-points-total-label">Indicative total</span>
          <span className="tools-points-total-value">{result.total}</span>
          <span className="tools-points-total-suffix">points</span>
        </div>
        <ul className="tools-points-breakdown">
          {result.rows.map((r) => (
            <li key={r.label}>
              <span>{r.label}</span>
              <strong>{r.pts}</strong>
            </li>
          ))}
        </ul>
        {result.warnings.length > 0 && (
          <ul className="tools-points-warnings">
            {result.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        )}
        <div className="tools-checker-actions tools-points-actions">
          <button type="button" className="btn-ghost" onClick={handleCopy}>
            <Copy size={16} aria-hidden /> {copied ? 'Copied' : 'Copy summary'}
          </button>
        </div>
      </div>

      <p className="tools-checker-foot">
        <Link className="tools-checker-foot-link" to="/contact#book-meeting">
          Book skills assessment & migration pathway advice with Himani
        </Link>
      </p>
    </motion.div>
  )
}

function SkillAssessmentPointsToolPage() {
  return (
    <AnimatedWrapper>
      <ToolPageLayout
        title="Skill assessment · GSM points calculator"
        subtitle="Indicative Australia skilled migration points calculator (subclasses 189, 190, 491 style). Positive skills assessment from the relevant authority is usually required before claiming skilled employment for your nominated occupation—verify every factor with the Department of Home Affairs and your assessing body."
      >
        <SkillAssessmentPointsCalculator />
      </ToolPageLayout>
    </AnimatedWrapper>
  )
}

const SAMPLE_DOCS = [
  {
    category: 'Business & Accounting',
    icon: <Briefcase size={18} />,
    color: '#6C5CE7',
    items: [
      { label: 'Bachelor of Accounting',                  file: 'bachelor-accounting.pdf' },
      { label: 'Bachelor of Business',                    file: 'bachelor-business.pdf' },
      { label: 'Bachelor of Business (Accounting)',       file: 'bachelor-business-accounting.pdf' },
      { label: 'Bachelor of Business (Accounting) — v2', file: 'bachelor-business-accounting-2.pdf' },
      { label: 'Bachelor of Business Administration',     file: 'bachelor-business-administration.pdf' },
      { label: 'Bachelor of Business — HRM Major',        file: 'bachelor-business-hrm.pdf' },
      { label: 'Bachelor of Business Program',            file: 'bachelor-business-program.pdf' },
      { label: 'MBA (Global)',                            file: 'master-mba-global.pdf' },
      { label: 'MBA (Tourism & Hospitality Leadership)',  file: 'master-mba-tourism.pdf' },
    ],
  },
  {
    category: 'Technology & Data',
    icon: <Monitor size={18} />,
    color: '#0984e3',
    items: [
      { label: 'Bachelor of Information Technology',      file: 'bachelor-information-technology.pdf' },
      { label: 'Bachelor of IT (BIT)',                    file: 'bachelor-bit.pdf' },
      { label: 'Bachelor of Information & Comm. Technology', file: 'bachelor-ict.pdf' },
      { label: 'Master of Data Science',                  file: 'master-data-science.pdf' },
    ],
  },
  {
    category: 'Science & Health',
    icon: <BookOpenText size={18} />,
    color: '#00b894',
    items: [
      { label: 'Bachelor of Food Science & Nutrition',    file: 'bachelor-food-science-nutrition.pdf' },
      { label: 'Master of Science (Food Science)',        file: 'master-food-science.pdf' },
    ],
  },
  {
    category: 'Law & Community',
    icon: <ClipboardCheck size={18} />,
    color: '#e17055',
    items: [
      { label: 'Bachelor of Criminal & Community Services', file: 'bachelor-criminal-community.pdf' },
    ],
  },
]

const TOOLS_DATA = [
  {
    icon: <ShieldCheck size={30} />,
    title: 'Visa Eligibility Checker',
    subtitle: 'Student Visa',
    desc: 'Answer a few questions and get a personalised readiness note covering your destination fit, subject area, scholarship position, and financial context.',
    features: ['Covers AU, NZ, UK, USA & Denmark', 'Personalised readiness summary', 'Includes finance & scholarship context'],
    to: '/tools/visa-eligibility',
    accent: 'var(--brand)',
  },
  {
    icon: <FileCheck size={30} />,
    title: 'Visa Checklist Generator',
    subtitle: 'Nepali Student',
    desc: 'Generate a Nepal-origin document checklist — covering identity, academics, sponsor evidence, bank statements, and country-specific add-ons.',
    features: ['Nepal-specific document flow', 'Identity, academics & finance', 'Country add-ons for each destination'],
    to: '/tools/nepali-visa-checklist',
    accent: '#2d8b6f',
  },
  {
    icon: <Calculator size={30} />,
    title: 'GSM Points Calculator',
    subtitle: 'Skill Assessment · Australia',
    desc: 'Get an indicative skilled migration points score for Australia\'s 189, 190, and 491 visa subclasses — with a skills assessment reminder for employment claims.',
    features: ['189 / 190 / 491 subclasses', 'Instant indicative score', 'Skills assessment guidance'],
    to: '/tools/skill-assessment-points',
    accent: '#b06a10',
  },
]

const FINANCIAL_DOCS = [
  {
    label: 'Relationship Certificate with sponsor',
    desc: 'Verifies the relationship between the applicant and their sponsor. Issued by the local VDC or Municipality.',
    requirements: ['Citizenship certificates of the applicant and sponsor', 'Two passport-size photos each', 'Application letter'],
  },
  {
    label: 'Income Source Certificate',
    desc: 'Official document outlining the sponsor\'s source of income (land lease, house rent, salary, or pension). Issued and verified by the local VDC or Municipality.',
  },
  {
    label: 'Salary Certificate',
    desc: 'Issued by an employer confirming employment and salary details, including position, duties, and employment period. Issued on company letterhead and must be signed and stamped by an authorised person.',
  },
  {
    label: 'House Rent Agreement',
    desc: 'Legal document between landlord and tenant outlining rental terms. Required when showing house rent as a source of income.',
    requirements: ['House Ownership Certificate', 'Citizenship certificates of both tenant and landlord', 'Signatures and fingerprint impressions of both parties', 'Signature of a witness'],
  },
  {
    label: 'Land Lease Agreement',
    desc: 'Formal contract between landowner and tenant outlining land lease terms. Used as supporting documentation for land lease income.',
    requirements: ['Land Ownership Certificate', 'Citizenship certificates of both landlord and tenant', 'Signatures and fingerprint impressions of both parties', 'Signature of a witness'],
  },
  {
    label: 'Pension with translation',
    desc: 'Official pension documentation with certified English translation, confirming pension as a regular income source.',
  },
  {
    label: 'Agriculture income',
    desc: 'Official income verification letter confirming income earned from agricultural activities. Verified and issued by the local Ward or Municipality under the Government of Nepal.',
  },
  {
    label: 'Animal husbandry with dairy production',
    desc: 'Income verification document for earnings from animal husbandry activities including dairy production. Verified by local authorities.',
  },
  {
    label: 'Audit Report',
    desc: 'Official document presenting the financial performance of a business, including profit and loss. Prepared and certified by a registered auditor.',
  },
  {
    label: 'Business Registration',
    desc: 'Official document issued by the government confirming that a business is legally registered and authorised to operate.',
  },
  {
    label: 'Tax Clearance Certificate',
    desc: 'Confirms that all tax liabilities have been settled. Issued by the Inland Revenue Department (IRD). Required for visa applications, bank loans, government tenders, and business renewals.',
  },
  {
    label: 'Land Ownership',
    desc: 'Official land registration record confirming legal ownership of a property or land.',
  },
  {
    label: 'Bank Loan',
    desc: 'Documentation of an existing bank loan, including terms and repayment schedule, used as part of financial evidence.',
  },
  {
    label: 'Bank Balance (Proof of fund available)',
    desc: 'Official certificate issued by a bank confirming available balance on a specific date, verifying sufficient funds and saving history. Signed and verified by an authorised bank officer.',
  },
  {
    label: 'Vehicle Income',
    desc: 'Income verification document for earnings from vehicle-based business or rental income.',
  },
  {
    label: 'CA Report',
    desc: 'Financial document prepared and certified by a Chartered Accountant. Covers income, expenses, assets, and liabilities. Used for visa applications, audits, loan processing, and business verification.',
  },
]

const OTHER_DOCS = [
  { label: 'Birth Certificate', desc: 'Official document issued by the government that records a person\'s date and place of birth.' },
  { label: 'Police Report', desc: 'Official record issued by the police detailing a complaint, incident, or legal report.' },
  { label: 'Citizenship Certificate', desc: 'Legal document that proves an individual\'s citizenship, issued by the government authority.' },
]

const DEPENDENT_DOCS = [
  { label: 'Marriage Registration Certificate', desc: 'Official document issued by the government that legally records and confirms marriage between two individuals. Serves as legal proof of marriage.' },
  { label: 'Marriage Photographs', desc: 'Visual proof of a wedding ceremony, used as supporting evidence of a genuine marital relationship.' },
  {
    label: 'Other additional Proof of Relationship',
    desc: 'Additional documents demonstrating a genuine relationship with a dependent.',
    requirements: ['Passport, citizenship, birth certificate, or police report of the dependent', 'Communication records such as Facebook, Skype, or email conversations showing genuine interaction'],
  },
]

const SOP_CATEGORIES = [
  {
    title: 'Science',
    emoji: '🔬',
    desc: 'Strong, well-structured SOPs for Science-related courses covering Physical, Biomedical, and Chemical Sciences.',
    fields: 'Astronomy, Biochemistry, Biomedical Science, Geography, Geology, Mathematics, Physics, Zoology',
    courses: ['Master of Data Science', 'Master of Technology', 'Bachelor of Information Technology', 'Advanced Diploma in IT'],
  },
  {
    title: 'Health',
    emoji: '🏥',
    desc: 'SOP samples for Nursing and Health courses. Australia offers great education, job opportunities, and an average Registered Nurse salary of around AUD $65,000/yr.',
    courses: ['Bachelor of Nursing', 'Diploma of Nursing', 'Master of Public Health'],
  },
  {
    title: 'Architecture & Building',
    emoji: '🏛️',
    desc: 'SOP samples for Architecture & Construction courses, designed with the Australian Institute of Architects and AIB for industry-relevant education.',
    courses: ['Bachelor of Architecture', 'Master of Construction Management', 'Diploma of Building & Construction'],
  },
  {
    title: 'Engineering & Technology',
    emoji: '⚙️',
    desc: 'SOP samples for Engineering courses in Australia, covering a wide range of specialisations to match your career goals.',
    courses: ['Master of Engineering', 'Bachelor of Civil Engineering', 'Master of Technology (Software Engineering)'],
  },
  {
    title: 'Law',
    emoji: '⚖️',
    desc: 'Australian law degrees are highly respected and open doors to careers in business, banking, and politics due to their rigorous quality education system.',
    courses: ['Bachelor of Laws (LLB)', 'Juris Doctor (JD)', 'Master of Laws (LLM)'],
  },
  {
    title: 'Business & Economics',
    emoji: '💼',
    desc: 'One of the most popular choices for international students in Australia, opening doors to global career opportunities in business, finance, and economics.',
    courses: ['Master of Business Administration', 'Bachelor of Commerce', 'Master of Finance'],
  },
  {
    title: 'Humanities, Social Science & Education',
    emoji: '📚',
    desc: 'Unlock global teaching careers with an Australian education degree, or explore Humanities and Social Sciences — one of Australia\'s most popular fields.',
    courses: ['Bachelor of Education', 'Master of Social Work', 'Bachelor of Arts'],
  },
  {
    title: 'Agriculture, Environment & Veterinary',
    emoji: '🌾',
    desc: 'Gain hands-on experience through labs, fieldwork, and research in one of Australia\'s most practical and impactful fields of study.',
    courses: ['Bachelor of Agriculture', 'Master of Environmental Science', 'Bachelor of Veterinary Science'],
  },
  {
    title: 'Creative Industries',
    emoji: '🎨',
    desc: 'Explore cultural professions and build your skills through creative, industry-focused learning and practical assessment.',
    courses: ['Bachelor of Design', 'Bachelor of Fine Arts', 'Diploma of Graphic Design'],
  },
]

async function downloadWithCopyright(file, label) {
  const pdfBytes = await fetch(`/sample-docs/${file}`).then((r) => r.arrayBuffer())
  const pdfDoc = await PDFDocument.load(pdfBytes)
  let logoImg = null
  try {
    const logoBytes = await fetch('/logo.png').then((r) => r.arrayBuffer())
    logoImg = await pdfDoc.embedPng(logoBytes)
  } catch (_) {
    // logo unavailable — watermark text only
  }
  const pages = pdfDoc.getPages()
  for (const page of pages) {
    const { width, height } = page.getSize()
    // diagonal watermark
    page.drawText('HIMANI GLOBAL', {
      x: width / 2 - 100,
      y: height / 2 - 20,
      size: 48,
      color: rgb(0.42, 0.36, 0.91),
      opacity: 0.05,
      rotate: degrees(35),
    })
    // logo bottom-right (only if available)
    if (logoImg) {
      const logoW = 90
      const logoH = logoW * (logoImg.height / logoImg.width)
      page.drawImage(logoImg, { x: width - logoW - 18, y: 12, width: logoW, height: logoH, opacity: 0.75 })
    }
    // copyright footer
    page.drawText('© Himani Global Education & Visa Services  |  himaniglobal.com.au', {
      x: 18,
      y: 14,
      size: 6.5,
      color: rgb(0.27, 0.2, 0.58),
      opacity: 0.85,
    })
  }
  const out = await pdfDoc.save()
  const url = URL.createObjectURL(new Blob([out], { type: 'application/pdf' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: `${label}.pdf` })
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}

function ToolsHubPage() {
  const [previewDoc, setPreviewDoc] = useState(null)
  const [expandedFinDoc, setExpandedFinDoc] = useState(null)
  return (
    <AnimatedWrapper>

      {/* ── Hero ── */}
      <section className="tools-hub-hero">
        <div className="tools-hub-hero-inner">
          <p className="tools-hub-eyebrow">Free planning tools</p>
          <h1 className="tools-hub-h1">
            Plan smarter,<br /><em>apply with confidence</em>
          </h1>
          <p className="tools-hub-sub">
            Three free tools built for Nepali students — get instant clarity on visa readiness,
            document checklists, and migration points before your consultation.
          </p>
          <Link to="/contact#book-meeting" className="btn-gold">Talk to a counsellor</Link>
        </div>
        <div className="tools-hub-hero-art" aria-hidden>
          <div className="tools-hub-hero-blob tools-hub-hero-blob--1" />
          <div className="tools-hub-hero-blob tools-hub-hero-blob--2" />
          <div className="tools-hub-stat-pills">
            <span>3 free tools</span>
            <span>Instant results</span>
            <span>No sign-up</span>
          </div>
        </div>
      </section>

      {/* ── Tools grid ── */}
      <section className="tools-hub-section">
        <div className="tools-hub-grid">
          {TOOLS_DATA.map((tool, i) => (
            <motion.div
              key={tool.title}
              className="tools-hub-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="tools-hub-card-top">
                <div className="tools-hub-card-icon" style={{ color: tool.accent, background: `${tool.accent}14`, borderColor: `${tool.accent}22` }}>
                  {tool.icon}
                </div>
                <div>
                  <p className="tools-hub-card-subtitle">{tool.subtitle}</p>
                  <h2 className="tools-hub-card-title">{tool.title}</h2>
                </div>
              </div>
              <p className="tools-hub-card-desc">{tool.desc}</p>
              <ul className="tools-hub-card-features">
                {tool.features.map((f) => (
                  <li key={f}>
                    <CheckCircle2 size={14} aria-hidden /> {f}
                  </li>
                ))}
              </ul>
              <Link to={tool.to} className="tools-hub-card-cta">
                Open tool <ArrowRight size={15} aria-hidden />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Sample Documents ── */}
      <section className="tools-docs-section">
        <div className="tools-docs-header">
          <div>
            <p className="tools-docs-eyebrow">Sample offer letters</p>
            <h2 className="tools-docs-h2">Course Document Samples</h2>
            <p className="tools-docs-sub">
              Browse real enrolment offer samples across popular courses — so you know exactly what to expect before you apply.
            </p>
          </div>
        </div>
        <div className="tools-docs-grid">
          {SAMPLE_DOCS.map((group) => (
            <div key={group.category} className="tools-docs-group">
              <div className="tools-docs-group-label" style={{ color: group.color }}>
                <span className="tools-docs-group-icon" style={{ background: `${group.color}18`, borderColor: `${group.color}30`, color: group.color }}>
                  {group.icon}
                </span>
                {group.category}
              </div>
              <ul className="tools-docs-list">
                {group.items.map((doc) => (
                  <li key={doc.file} className="tools-docs-item">
                    <span className="tools-docs-item-name">
                      <PenLine size={13} aria-hidden />
                      {doc.label}
                    </span>
                    <div className="tools-docs-item-actions">
                      <button
                        className="tools-docs-preview-btn"
                        onClick={() => setPreviewDoc(doc)}
                        aria-label={`Preview ${doc.label}`}
                      >
                        <Eye size={13} /> Preview
                      </button>
                      <button
                        className="tools-docs-download"
                        onClick={() => downloadWithCopyright(doc.file, doc.label)}
                      >
                        <Download size={13} /> Download PDF
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Financial & Supporting Documents ── */}
      <section className="tools-fin-section">
        <div className="tools-fin-header">
          <p className="tools-docs-eyebrow">Supporting Evidence</p>
          <h2 className="tools-fin-h2">Financial &amp; Supporting Document Samples</h2>
          <p className="tools-fin-sub">
            Real samples of financial and personal documents commonly required for Australian student visa applications from Nepal.
          </p>
        </div>

        {/* Financial Documents accordion */}
        <div className="tools-fin-group">
          <div className="tools-fin-group-label" style={{ color: '#0984e3' }}>
            <span className="tools-docs-group-icon" style={{ background: '#0984e318', borderColor: '#0984e330', color: '#0984e3' }}>
              <Calculator size={18} />
            </span>
            Financial Document Samples
          </div>
          <ul className="tools-fin-list">
            {FINANCIAL_DOCS.map((doc) => (
              <li key={doc.label} className={`tools-fin-item ${expandedFinDoc === doc.label ? 'is-open' : ''}`}>
                <button
                  className="tools-fin-item-header"
                  onClick={() => setExpandedFinDoc(expandedFinDoc === doc.label ? null : doc.label)}
                >
                  <span className="tools-fin-item-name"><PenLine size={13} aria-hidden />{doc.label}</span>
                  <span className="tools-fin-chevron">{expandedFinDoc === doc.label ? '−' : '+'}</span>
                </button>
                {expandedFinDoc === doc.label && (
                  <div className="tools-fin-item-body">
                    <p>{doc.desc}</p>
                    {doc.requirements && (
                      <ul className="tools-fin-reqs">
                        {doc.requirements.map((r) => (
                          <li key={r}><CheckCircle2 size={13} />{r}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="tools-fin-bottom-grid">
          {/* Other Documents */}
          <div className="tools-fin-group">
            <div className="tools-fin-group-label" style={{ color: '#00b894' }}>
              <span className="tools-docs-group-icon" style={{ background: '#00b89418', borderColor: '#00b89430', color: '#00b894' }}>
                <ClipboardCheck size={18} />
              </span>
              Other Document Samples
            </div>
            <ul className="tools-fin-list">
              {OTHER_DOCS.map((doc) => (
                <li key={doc.label} className="tools-fin-item">
                  <div className="tools-fin-item-static">
                    <span className="tools-fin-item-name"><PenLine size={13} aria-hidden />{doc.label}</span>
                    <p className="tools-fin-item-static-desc">{doc.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Dependent Side Documents */}
          <div className="tools-fin-group">
            <div className="tools-fin-group-label" style={{ color: '#e17055' }}>
              <span className="tools-docs-group-icon" style={{ background: '#e1705518', borderColor: '#e1705530', color: '#e17055' }}>
                <Globe2 size={18} />
              </span>
              Dependent Side Document Samples
            </div>
            <ul className="tools-fin-list">
              {DEPENDENT_DOCS.map((doc) => (
                <li key={doc.label} className={`tools-fin-item ${expandedFinDoc === doc.label ? 'is-open' : ''}`}>
                  <button
                    className="tools-fin-item-header"
                    onClick={() => setExpandedFinDoc(expandedFinDoc === doc.label ? null : doc.label)}
                  >
                    <span className="tools-fin-item-name"><PenLine size={13} aria-hidden />{doc.label}</span>
                    <span className="tools-fin-chevron">{expandedFinDoc === doc.label ? '−' : '+'}</span>
                  </button>
                  {expandedFinDoc === doc.label && (
                    <div className="tools-fin-item-body">
                      <p>{doc.desc}</p>
                      {doc.requirements && (
                        <ul className="tools-fin-reqs">
                          {doc.requirements.map((r) => (
                            <li key={r}><CheckCircle2 size={13} />{r}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── SOP Bank ── */}
      <section className="tools-sop-section">
        <div className="tools-sop-header">
          <p className="tools-docs-eyebrow">Statement of Purpose</p>
          <h2 className="tools-sop-h2">SOP Bank</h2>
          <p className="tools-sop-sub">
            Explore our curated SOP Bank with high-quality samples for different courses and universities. Find ideas, get inspired, and build your own strong SOP with ease. It's simple, useful, and free.
          </p>
        </div>
        <div className="tools-sop-grid">
          {SOP_CATEGORIES.map((cat) => (
            <motion.div
              key={cat.title}
              className="tools-sop-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <span className="tools-sop-emoji">{cat.emoji}</span>
              <h3 className="tools-sop-card-title">{cat.title}</h3>
              <p className="tools-sop-card-desc">{cat.desc}</p>
              <ul className="tools-sop-courses">
                {cat.courses.map((c) => (
                  <li key={c}><ArrowRight size={11} />{c}</li>
                ))}
              </ul>
              <Link to="/contact#book-meeting" className="tools-sop-card-cta">Get SOP guidance →</Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="tools-hub-cta">
        <p className="tools-hub-cta-eyebrow">Need personalised guidance?</p>
        <h2 className="tools-hub-cta-h2">Tools are just the start</h2>
        <p className="tools-hub-cta-sub">
          Bring your tool output to a free consultation — Himani's team will review it line by line
          and build a plan around your actual profile.
        </p>
        <div className="tools-hub-cta-actions">
          <Link to="/contact#book-meeting" className="btn-gold">Book free consultation</Link>
          <Link to="/services" className="btn-ghost">View all services</Link>
        </div>
      </section>

      {/* ── PDF Preview Modal ── */}
      <AnimatePresence>
        {previewDoc && (
          <motion.div
            className="pdf-preview-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewDoc(null)}
          >
            <motion.div
              className="pdf-preview-modal"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pdf-preview-header">
                <span className="pdf-preview-title">{previewDoc.label}</span>
                <div className="pdf-preview-header-actions">
                  <button
                    className="pdf-preview-download-btn"
                    onClick={() => downloadWithCopyright(previewDoc.file, previewDoc.label)}
                  >
                    <Download size={15} /> Download
                  </button>
                  <button className="pdf-preview-close" onClick={() => setPreviewDoc(null)} aria-label="Close preview">
                    <X size={18} />
                  </button>
                </div>
              </div>
              <object
                data={`/sample-docs/${previewDoc.file}`}
                type="application/pdf"
                className="pdf-preview-iframe"
                aria-label={previewDoc.label}
              >
                <div className="pdf-preview-fallback">
                  <p>PDF preview not supported in this browser.</p>
                  <button
                    className="btn-gold"
                    onClick={() => downloadWithCopyright(previewDoc.file, previewDoc.label)}
                  >
                    <Download size={15} /> Download PDF instead
                  </button>
                </div>
              </object>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </AnimatedWrapper>
  )
}

function VisaEligibilityToolPage() {
  return (
    <AnimatedWrapper>
      <ToolPageLayout
        title="Student Visa Eligibility Checker"
        subtitle="Personal readiness tool for students comparing Australia, New Zealand, the UK, the USA, Denmark, or mixed options."
      >
        <StudentVisaEligibilityChecker />
      </ToolPageLayout>
    </AnimatedWrapper>
  )
}

function NepaliChecklistToolPage() {
  return (
    <AnimatedWrapper>
      <ToolPageLayout
        title="Student Visa Checklist Generator (Nepali student)"
        subtitle="Checklist-oriented workflow for students preparing files from Nepal before admission and visa lodgement."
      >
        <NepalStudentVisaChecklistGenerator />
      </ToolPageLayout>
    </AnimatedWrapper>
  )
}

function ToolGuidePage({ title, detail }) {
  return (
    <AnimatedWrapper>
      <ToolPageLayout title={title} subtitle={detail}>
        <article className="panel card tools-guide-card">
          <h2>{title}</h2>
          <p>{detail}</p>
          <ul className="value-list">
            <li>Use this page as a prep worksheet before your counseling session.</li>
            <li>Collect evidence in order: identity, academics, finance, then route-specific items.</li>
            <li>Review the output with Himani before any final submission.</li>
          </ul>
          <Link className="btn-gold" to="/contact#book-meeting">
            Book a review meeting
          </Link>
        </article>
      </ToolPageLayout>
    </AnimatedWrapper>
  )
}

const pathwaySteps = [
  {
    title: 'Assess',
    detail:
      'Build a realistic plan around your profile, destination fit, budget range, and career direction.',
  },
  {
    title: 'Choose',
    detail:
      'Select country, course, and institution options with transparent comparison of cost, outcomes, and timelines.',
  },
  {
    title: 'Prepare',
    detail:
      'Prepare complete admission and visa documentation with quality checks before every major submission.',
  },
  {
    title: 'Apply',
    detail:
      'Submit with confidence through final verification, interview readiness, and milestone tracking support.',
  },
]

const updates = [
  'Upcoming intake windows, application deadlines, and late-submission risk alerts',
  'Visa policy shifts, document rule changes, and process requirement updates',
  'Scholarship opportunities, tuition discounts, and financial planning insights',
]

const premiumValueBlocks = [
  {
    title: 'What You Get Before Applying',
    points: [
      'Profile-based country and course shortlist with clear strategic rationale.',
      'Complete cost view: tuition, living, insurance, and visa-linked expenses.',
      'Early risk analysis to identify profile and documentation gaps before submission.',
    ],
  },
  {
    title: 'How We Reduce Rework',
    points: [
      'Structured file review process with quality checkpoints at every critical stage.',
      'Deadline-first intake planning to avoid last-minute errors and missed opportunities.',
      'Interview and statement readiness support for stronger presentation and clarity.',
    ],
  },
  {
    title: 'Who Benefits Most',
    points: [
      'Students who want clear guidance before investing significant time and money.',
      'Parents who need transparent process visibility, cost logic, and realistic timelines.',
      'Applicants seeking guided support from Nepal preparation to destination transition.',
    ],
  },
]

/** Fast-out easing — quick settle, still smooth */
const easeOutSnappy = [0.22, 1, 0.36, 1]

const heroEnterParent = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.02 },
  },
}

const heroEnterChild = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: easeOutSnappy },
  },
}

function MotionSection({ children, className = 'section' }) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.36, ease: easeOutSnappy }}
    >
      {children}
    </motion.section>
  )
}

function AnimatedWrapper({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOutSnappy }}
    >
      {children}
    </motion.main>
  )
}

const WMAP_URL  = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
const DEST_IDS  = new Set([36, 554, 826, 840, 208])  // Australia, New Zealand, UK, USA, Denmark
const ORIGIN_IDS = new Set([524, 356])           // Nepal, India

const W = 960, H = 500
const projection = geoNaturalEarth1().scale(153).translate([W / 2, H / 2 + 20])
const pathGen = geoPath(projection)

const arcFeature = (from, to) => ({
  type: 'Feature',
  geometry: { type: 'LineString', coordinates: [from, to] },
})

function WorldMapSVG() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [countries, setCountries] = useState([])

  useEffect(() => {
    fetch(WMAP_URL)
      .then(r => r.json())
      .then(world => setCountries(feature(world, world.objects.countries).features))
  }, [])

  const ORIGIN = [84, 28]
  const DESTS = [
    { coord: [133, -26], label: 'Australia',   flag: '🇦🇺', dx: 10,  dy: -10 },
    { coord: [174, -41], label: 'New Zealand', flag: '🇳🇿', dx: 10,  dy: 14 },
    { coord: [-3,   53], label: 'UK',          flag: '🇬🇧', dx: -10, dy: -12, anchor: 'end' },
    { coord: [-98,  39], label: 'USA',         flag: '🇺🇸', dx: -10, dy: -12, anchor: 'end' },
    { coord: [13,   58], label: 'Denmark',     flag: '🇩🇰', dx: 10,  dy: -12 },
  ]

  const pt = (coord) => projection(coord) ?? [0, 0]

  return (
    <div ref={ref} className="wmap-outer">
      <svg viewBox={`0 0 ${W} ${H}`} className="wmap-svg">
        {/* Country fills */}
        {countries.map((c, idx) => {
          const id = parseInt(c.id, 10)
          return (
            <path key={c.id ?? idx} d={pathGen(c)}
              fill={
                DEST_IDS.has(id)    ? 'rgba(108,92,231,0.42)' :
                ORIGIN_IDS.has(id)  ? 'rgba(197,165,90,0.48)' :
                '#C8C2F0'
              }
              stroke="#fff" strokeWidth={0.4}
            />
          )
        })}

        {/* Great-circle arcs */}
        {DESTS.map((dest, i) => (
          <path key={dest.label}
            d={pathGen(arcFeature(ORIGIN, dest.coord))}
            fill="none"
            stroke="var(--brand)" strokeWidth={1.5} strokeDasharray="7 5"
            className={`wmap-arc${inView ? ' wmap-arc--on' : ''}`}
            style={{ transitionDelay: `${i * 0.35}s` }}
          />
        ))}

        {/* Origin pin — Nepal & India */}
        {(() => {
          const [ox, oy] = pt(ORIGIN)
          return (
            <g transform={`translate(${ox},${oy})`}>
              {[16, 10].map((r, i) => (
                <circle key={i} r={r} fill="var(--gold)" fillOpacity={0}
                  stroke="var(--gold)" strokeWidth={1}
                  className={inView ? 'wmap-ring--on' : ''}
                  style={{ animationDelay: `${i * 0.55}s` }}
                />
              ))}
              <circle r={4} fill="var(--gold)" />
              <text x={8} y={-8} className="wmap-lbl wmap-lbl--gold">Nepal &amp; India</text>
            </g>
          )
        })()}

        {/* Destination pins */}
        {DESTS.map((dest, i) => {
          const [dx, dy] = pt(dest.coord)
          return (
            <g key={dest.label} transform={`translate(${dx},${dy})`}>
              {[14, 8].map((r, j) => (
                <circle key={j} r={r} fill="var(--brand)" fillOpacity={0}
                  stroke="var(--brand)" strokeWidth={1}
                  className={inView ? 'wmap-ring--on' : ''}
                  style={{ animationDelay: `${i * 0.35 + j * 0.5 + 0.8}s` }}
                />
              ))}
              <circle r={4} fill="var(--brand)" />
              <text x={dest.dx} y={dest.dy} className="wmap-lbl" textAnchor={dest.anchor || 'start'}>
                {dest.flag} {dest.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function AnimatedCount({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = null
    const duration = 1800
    const tick = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(ease * to))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, to])
  return <span ref={ref} className="anim-count">{count}{suffix}</span>
}

const marqueeItems = [
  { value: '1,200+', label: 'Students guided' },
  { value: '5', label: 'Countries covered' },
  { value: '8+', label: 'Years of experience' },
  { value: '98%', label: 'Client satisfaction' },
  { value: '2', label: 'Global offices' },
  { value: '500+', label: 'Visas processed' },
  { value: 'AU · NZ · UK · US · DK', label: 'Destinations' },
  { value: 'Free', label: 'First consultation' },
]

const destImages = {
  Australia: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
  'New Zealand': 'https://images.unsplash.com/photo-1730800672210-9ed7e0e1b789?auto=format&fit=crop&w=600&q=80',
  'United Kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
  USA: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80',
  Denmark: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=600&q=80',
}

const testimonials = [
  {
    text: 'Himani Global turned what felt impossible into a clear step-by-step plan. My Australia student visa was approved first attempt — no surprises, no stress.',
    name: 'Priya Sharma',
    route: 'Kathmandu → Brisbane, UQ Master of IT',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&q=80',
  },
  {
    text: 'The financial documentation guidance alone saved my application. They knew exactly what officers look for and prepared me for every question.',
    name: 'Rajesh Thapa',
    route: 'Chitwan → London, University of Westminster',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
  },
  {
    text: "From IELTS prep to visa lodgement, the team was with me at every step. I felt like I had a real advocate, not just an agent filling forms.",
    name: 'Anita Gurung',
    route: 'Pokhara → Melbourne, RMIT Business',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
  },
]

const blogImages = [
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=400&fit=crop&q=80', // students studying together
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=400&fit=crop&q=80', // university campus
  'https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?w=800&h=400&fit=crop&q=80', // London / UK
]

function HomePage() {
  const featuredPosts = blogPosts.slice(0, 3)

  return (
    <div className="home">

      {/* ── 1. Hero ── */}
      <section className="home-hero">
        <div className="home-hero-left">
          <div>
            <motion.p
              className="home-hero-eyebrow"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              MARA Registered · Brisbane &amp; Chitwan · Est. 2015
            </motion.p>

            <motion.h1
              className="home-hero-h1"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              Your path abroad,<br />
              <em>structured</em> and<br />
              clear.
            </motion.h1>

            <motion.p
              className="home-hero-sub"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
            >
              Expert guidance to universities in Australia, New Zealand, UK, USA &amp; Denmark — personalised to your profile, budget, and timeline.
            </motion.p>

            <motion.div
              className="home-hero-actions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.68, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link className="btn-gold" to="/contact#book-meeting">
                <Video size={16} aria-hidden />
                Book free consultation
              </Link>
              <Link className="btn-ghost" to="/destinations">
                Explore destinations
              </Link>
            </motion.div>
          </div>

          <motion.div
            className="home-hero-trust"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.88 }}
          >
            <span className="home-hero-trust-item"><CheckCircle2 size={13} /> MARA Registered</span>
            <span className="home-hero-trust-sep" aria-hidden />
            <span className="home-hero-trust-item"><Star size={13} /> 98% Visa Success</span>
            <span className="home-hero-trust-sep" aria-hidden />
            <span className="home-hero-trust-item"><GraduationCap size={13} /> 1,200+ Students</span>
          </motion.div>
        </div>
        <div className="home-hero-right">
          <img
            src="/photos/grad-celebration.jpg"
            alt="Graduate celebrating in Brisbane"
          />
        </div>
      </section>

      {/* ── 2. Marquee ── */}
      <div className="home-marquee-wrap">
        <div className="home-marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <div key={i} className="home-marquee-item">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
              <span className="home-marquee-dot" aria-hidden />
            </div>
          ))}
        </div>
      </div>

      {/* ── 2b. Trust authority strip (auto-scrolling marquee) ── */}
      {(() => {
        const trustItems = [
          { icon: <ShieldCheck size={15}/>, label: 'MARA Registered Migration Agents' },
          { icon: <Star size={15}/>, label: '98% Visa Success Rate' },
          { icon: <GraduationCap size={15}/>, label: '1,200+ Students Guided' },
          { icon: <Globe2 size={15}/>, label: 'Australia · NZ · UK · USA · Denmark' },
          { icon: <Clock size={15}/>, label: '8+ Years of Experience' },
          { icon: <ShieldCheck size={15}/>, label: 'MARA Registered Migration Agents' },
          { icon: <Star size={15}/>, label: '98% Visa Success Rate' },
          { icon: <GraduationCap size={15}/>, label: '1,200+ Students Guided' },
          { icon: <Globe2 size={15}/>, label: 'Australia · NZ · UK · USA · Denmark' },
          { icon: <Clock size={15}/>, label: '8+ Years of Experience' },
        ]
        return (
          <div className="home-trust-strip">
            <div className="home-trust-track">
              {trustItems.map(({ icon, label }, i) => (
                <div key={i} className="home-trust-item">
                  {icon}
                  <span>{label}</span>
                  <span className="home-trust-dot" aria-hidden />
                </div>
              ))}
            </div>
          </div>
        )
      })()}

      {/* ── 3. About / Who we are ── */}
      <section className="home-about">
        <div className="home-about-top">
          {/* Left: text */}
          <motion.div
            className="home-about-left"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="home-eyebrow">About Himani Global</p>
            <h2 className="home-about-h2">
              Since 2015, guiding <em>1,200+ students</em> to universities abroad.
            </h2>
            <p className="home-about-p">
              We are a specialist education and migration consultancy with offices in Brisbane and Chitwan —
              built for students and families who want transparent, structured guidance, not just forms filled.
            </p>
            <div className="home-about-stats-inline">
              {[
                { n: 1200, s: '+', label: 'Students guided' },
                { n: 98,   s: '%', label: 'Visa success' },
                { n: 4,    s: '',  label: 'Countries' },
                { n: 8,    s: '+', label: 'Years exp.' },
              ].map(({ n, s, label }) => (
                <div key={label} className="home-about-stat-chip">
                  <strong><AnimatedCount to={n} suffix={s} /></strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div><Link className="btn-gold" to="/about">Learn about us →</Link></div>
          </motion.div>

          {/* Right: 2×2 destination cards */}
          <motion.div
            className="home-about-right"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
          >
            <WorldMapSVG />
          </motion.div>
        </div>

      </section>

      {/* ── 3b. Services preview ── */}
      <section className="home-services">
        <div className="home-services-head">
          <p className="home-eyebrow">What we do</p>
          <h2 className="home-services-h2">End-to-end support,<br /><em>every step of the way</em></h2>
          <p className="home-services-sub">From your first profile audit to departure day — one team handles it all.</p>
        </div>
        <div className="home-services-grid">
          {[
            { icon: <GraduationCap size={22}/>, title: 'Student Admission', desc: 'Course shortlisting, institution matching, SOP guidance, and application handling with deadline tracking.' },
            { icon: <ShieldCheck size={22}/>, title: 'Visa Application', desc: 'End-to-end visa documentation, file structuring, compliance checks, and pre-lodgement review.' },
            { icon: <BookOpenText size={22}/>, title: 'IELTS Preparation', desc: 'Four-skill coaching, marked writing and speaking mocks, aligned to your band target and visa window.' },
            { icon: <Monitor size={22}/>, title: 'PTE Academic', desc: 'Integrated-task drills, computer-lab stamina, and score targeting coordinated with your intake milestones.' },
            { icon: <FileCheck size={22}/>, title: 'Health Insurance', desc: 'Guidance on compliant student cover by destination and duration, with practical plan selection support.' },
            { icon: <Briefcase size={22}/>, title: 'Professional Year & NAATI', desc: 'Pathways for post-study migration points — Professional Year course guidance and CCL language strategy.' },
          ].map(({ icon, title, desc }, i) => (
            <motion.div
              key={title}
              className="home-svc-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
            >
              <div className="home-svc-icon">{icon}</div>
              <h3 className="home-svc-title">{title}</h3>
              <p className="home-svc-desc">{desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="home-services-cta">
          <Link className="btn-gold" to="/services">All services</Link>
          <Link className="btn-ghost" to="/contact#book-meeting">Book free consultation</Link>
        </div>
      </section>

      {/* ── 4. Destinations ── */}
      <section className="home-destinations">
        <div className="home-destinations-header">
          <div>
            <p className="home-eyebrow">Where we send students</p>
            <h2 className="home-display-h2" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: 'var(--text)' }}>
              Study destinations
            </h2>
          </div>
          <Link className="home-view-all" to="/destinations">
            All destinations <ArrowRight size={14} />
          </Link>
        </div>
        <div className="home-destinations-grid">
          {countryDetails.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link className="home-dest-card" to="/destinations">
                <img
                  src={destImages[c.name] || destImages.Australia}
                  alt={c.name}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.opacity='0'; }}
                />
                <div className="home-dest-overlay" />
                <div className="home-dest-body">
                  <span className="home-dest-flag">{c.flag}</span>
                  <span className="home-dest-name">{c.name}</span>
                  <span className="home-dest-meta">{c.duration}</span>
                </div>
                <div className="home-dest-arrow" aria-hidden>
                  <ArrowRight size={14} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 5. Process ── */}
      <motion.section
        className="home-process"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="home-process-head">
          <div>
            <p className="home-eyebrow" style={{ color: 'var(--gold)' }}>How it works</p>
            <h2 className="home-process-h2">
              Your journey in<br /><em>four steps.</em>
            </h2>
          </div>
        </div>
        <div className="home-process-steps">
          {pathwaySteps.map((step, i) => (
            <motion.div
              key={step.title}
              className="home-process-step"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="home-process-num">0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── 5b. IELTS & PTE strip ── */}
      <section className="home-english-strip">
        <div className="home-english-strip-inner">
          <div className="home-english-strip-text">
            <p className="home-eyebrow" style={{color:'var(--gold)'}}>English test preparation</p>
            <h2 className="home-english-h2">IELTS &amp; PTE classes<br /><em>in Brisbane &amp; Chitwan</em></h2>
            <p className="home-english-sub">Structured batches — skills diagnostics, timed practice, speaking mocks, and marked writing. We align prep with your offer conditions and visa window.</p>
          </div>
          <div className="home-english-cards">
            {[
              { icon: <BookOpenText size={24}/>, title: 'IELTS', sub: 'Academic & General Training', link: '/ielts', detail: 'Four skills · Band targeting · Mock exams' },
              { icon: <Monitor size={24}/>, title: 'PTE Academic', sub: 'Computer-based scoring', link: '/pte', detail: 'Integrated tasks · Score drills · Fast results' },
            ].map(({ icon, title, sub, link, detail }) => (
              <Link key={title} className="home-english-card" to={link}>
                <div className="home-english-card-icon">{icon}</div>
                <div>
                  <strong className="home-english-card-title">{title}</strong>
                  <span className="home-english-card-sub">{sub}</span>
                  <span className="home-english-card-detail">{detail}</span>
                </div>
                <ArrowRight size={16} className="home-english-card-arrow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Testimonials ── */}
      <section className="home-testimonials">
        <div className="home-testimonials-head">
          <div>
            <p className="home-eyebrow">Student voices</p>
            <h2 className="home-testimonials-h2">
              Real results,<br /><em>real stories.</em>
            </h2>
          </div>
          <Link className="home-view-all" to="/contact">
            Work with us <ArrowRight size={14} />
          </Link>
        </div>
        <div className="home-testimonials-grid">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="home-tcard"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="home-tcard-stars" aria-label="5 out of 5 stars">
                {[1,2,3,4,5].map(s => <Star key={s} size={13} fill="currentColor" />)}
              </div>
              <p className="home-tcard-text">{t.text}</p>
              <div className="home-tcard-person">
                <img className="home-tcard-avatar" src={t.avatar} alt={t.name} loading="lazy" onError={(e) => { e.currentTarget.style.display='none'; }} />
                <div>
                  <span className="home-tcard-name">{t.name}</span>
                  <span className="home-tcard-route">{t.route}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 7. Tools ── */}
      <section className="home-tools">
        <div className="home-tools-head">
          <p className="home-eyebrow">Free planning aids</p>
          <h2 className="home-tools-h2">Student tools,<br /><em>no sign-up needed</em></h2>
          <p className="home-tools-sub">Free, instant, and built for Nepali students — no account, no fees.</p>
        </div>
        <div className="home-tools-cards">
          {[
            { icon: <ClipboardCheck size={24}/>, title: 'Visa Eligibility Checker', desc: 'Answer a few questions and get a structured readiness note for your target country.', link: '/tools/visa-eligibility', label: 'Check eligibility' },
            { icon: <FileCheck size={24}/>, title: 'Nepal Visa Checklist', desc: 'Generate a personalised document checklist for your destination and course type.', link: '/tools/nepali-visa-checklist', label: 'Get checklist' },
            { icon: <Calculator size={24}/>, title: 'Skill Assessment Points', desc: 'Calculate your Australian skilled migration point score across all key categories.', link: '/tools/skill-assessment-points', label: 'Calculate points' },
          ].map(({ icon, title, desc, link, label }, i) => (
            <motion.div
              key={title}
              className="home-tool-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="home-tool-icon">{icon}</div>
              <h3 className="home-tool-title">{title}</h3>
              <p className="home-tool-desc">{desc}</p>
              <Link className="home-tool-link" to={link}>{label} <ArrowRight size={13}/></Link>
            </motion.div>
          ))}
        </div>
        <div className="home-tools-view-all">
          <Link className="btn-ghost" to="/tools">All tools &amp; sample documents <ArrowRight size={14}/></Link>
        </div>
      </section>

      {/* ── 8. Blog ── */}
      <section className="home-blog">
        <div className="home-blog-head">
          <div>
            <p className="home-eyebrow">Knowledge</p>
            <h2 className="home-display-h2" style={{ fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', color: 'var(--text)' }}>
              From our desk
            </h2>
          </div>
          <Link className="home-view-all" to="/blog">
            All articles <ArrowRight size={14} />
          </Link>
        </div>
        <div className="home-blog-grid">
          {featuredPosts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link className="home-blog-card" to={`/blog/${post.slug}`}>
                <div className="home-blog-img">
                  <img
                    src={blogImages[i]}
                    alt={post.title}
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.parentElement.classList.add('home-blog-img--fallback')
                    }}
                  />
                </div>
                <div className="home-blog-body">
                  <span className="home-blog-cat">{post.category || 'Study Abroad'}</span>
                  <h3 className="home-blog-title">{post.title}</h3>
                  <p className="home-blog-excerpt">{post.excerpt}</p>
                  <div className="home-blog-footer">
                    <span className="home-blog-date">{formatBlogDate(post.date)}</span>
                    <span className="home-blog-read">Read <ArrowRight size={12} /></span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 8b. WhatsApp / Quick contact strip ── */}
      <div className="home-wa-strip">
        <div className="home-wa-strip-inner">
          <div className="home-wa-strip-text">
            <strong>Have a quick question?</strong>
            <span>Reach us directly on WhatsApp or call our Brisbane or Chitwan office.</span>
          </div>
          <div className="home-wa-strip-actions">
            <a className="home-wa-btn" href={PHONE_WHATSAPP_WA_ME} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16}/> WhatsApp us
            </a>
            <a className="home-wa-call" href={`tel:${PHONE_BRISBANE_A.replace(/\s/g,'')}`}>
              <Phone size={15}/> {PHONE_BRISBANE_A}
            </a>
            <a className="home-wa-call" href={`tel:${PHONE_CHITWAN_MOBILE.replace(/\s/g,'')}`}>
              <Phone size={15}/> {PHONE_CHITWAN_MOBILE}
            </a>
          </div>
        </div>
      </div>

      {/* ── 9. FAQ ── */}
      <motion.section
        className="home-faq"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="home-eyebrow">Common questions</p>
        <h2 className="home-faq-h2">Quick answers</h2>
        <div className="home-faq-list">
          {[
            ['Can I apply without IELTS / PTE?', 'Some institutions offer conditional pathways, but most student routes still need acceptable language evidence. Plan testing early to avoid intake delay.'],
            ['How long does the full process take?', 'A practical range is 2–5 months, depending on country, intake window, and your file readiness.'],
            ['Do you guarantee visa approval?', 'No. Legitimate agencies cannot guarantee outcomes. We focus on strong documentation quality and compliant preparation before submission.'],
            ['Can I include dependants?', 'In many cases yes, but it changes funds, insurance, and timing logic. Raise this in your first planning call so we can model the full picture.'],
          ].map(([q, a]) => (
            <details key={q} className="home-faq-item" open>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </motion.section>

      {/* ── 10. Dark CTA ── */}
      <motion.section
        className="home-cta"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="home-cta-eyebrow">Your path. Our purpose.</p>
        <h2 className="home-cta-h2">
          Ready to start<br />your journey <em>abroad?</em>
        </h2>
        <p className="home-cta-sub">
          Book a free 20-minute consultation. We'll map your destination, timeline, and next steps — no obligation.
        </p>
        <div className="home-cta-actions">
          <Link className="btn-gold" to="/contact#book-meeting">
            <Video size={16} aria-hidden /> Book free consultation
          </Link>
          <Link className="btn-ghost" to="/services">
            See our services
          </Link>
        </div>
      </motion.section>

    </div>
  )
}

function formatBlogDate(iso) {
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

function BlogListPage() {
  return (
    <AnimatedWrapper>
      {/* Hero */}
      <section className="blg-hero">
        <p className="blg-hero-eyebrow">Study abroad insights</p>
        <h1 className="blg-hero-h1">The Himani <em>Blog</em></h1>
        <p className="blg-hero-sub">
          Practical guides for Nepali students — destinations, visas, English tests, finances, and planning. Written for clarity, not hype.
        </p>
      </section>

      {/* Cards grid */}
      <section className="blg-grid-section">
        <div className="blg-grid">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.slug}
              className="blg-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: (i % 3) * 0.07 }}
            >
              <time className="blg-card-date" dateTime={post.date}>{formatBlogDate(post.date)}</time>
              <h2 className="blg-card-title">
                <Link to={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="blg-card-excerpt">{post.excerpt}</p>
              <Link to={`/blog/${post.slug}`} className="blg-card-link">
                Read article <ArrowRight size={14} />
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="blg-cta">
        <p className="blg-cta-eyebrow">Ready to apply?</p>
        <h2 className="blg-cta-h2">Turn reading into action</h2>
        <p className="blg-cta-sub">Book a free consultation and get a personalised plan built around your profile.</p>
        <div className="blg-cta-actions">
          <Link to="/contact#book-meeting" className="btn-gold">Book free consultation</Link>
          <Link to="/services" className="btn-ghost">View all services</Link>
        </div>
      </section>
    </AnimatedWrapper>
  )
}

function BlogPostPage() {
  const { slug } = useParams()
  const post = slug ? getPostBySlug(slug) : undefined
  if (!post) return <Navigate to="/blog" replace />

  return (
    <AnimatedWrapper>
      {/* Article hero */}
      <section className="blg-post-hero">
        <Link to="/blog" className="blg-post-back"><ArrowRight size={14} style={{transform:'rotate(180deg)'}}/> All articles</Link>
        <time className="blg-post-date" dateTime={post.date}>{formatBlogDate(post.date)}</time>
        <h1 className="blg-post-h1">{post.title}</h1>
        <p className="blg-post-dek">{post.excerpt}</p>
      </section>

      {/* Prose */}
      <div className="blg-post-body">
        <div className="blg-prose">
          {post.paragraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Footer CTA */}
        <aside className="blg-post-footer">
          <div className="blg-post-footer-inner">
            <p className="blg-post-footer-eyebrow">Need personalised guidance?</p>
            <h2 className="blg-post-footer-h2">Let's talk about your file</h2>
            <p className="blg-post-footer-sub">Questions about your own situation? Book a structured session with Himani Global's team.</p>
            <div className="blg-post-footer-actions">
              <Link to="/contact#book-meeting" className="btn-gold">Book a meeting</Link>
              <Link to="/english-classes" className="btn-ghost">IELTS &amp; PTE classes</Link>
            </div>
          </div>
        </aside>
      </div>
    </AnimatedWrapper>
  )
}

function AboutPage() {
  const whyItems = [
    {
      icon: <Globe2 size={24} />,
      title: 'MARA Registered',
      text: 'Fully registered with Australia\'s Migration Agents Registration Authority — compliant, professional, and accountable.',
    },
    {
      icon: <GraduationCap size={24} />,
      title: '98% Visa Success',
      text: 'Rigorous file preparation and compliance checks consistently deliver approvals for our students.',
    },
    {
      icon: <BookOpenText size={24} />,
      title: 'End-to-End Support',
      text: 'Course selection, admissions, CoE, visa documentation, and pre-departure — every step covered.',
    },
    {
      icon: <Headphones size={24} />,
      title: 'Personalised Guidance',
      text: 'No templates. Every student gets a strategy built around their profile, budget, and long-term goals.',
    },
  ]

  return (
    <AnimatedWrapper>
      <div className="about-v2">

        {/* ── Hero ── */}
        <section className="abt-hero">
          <motion.div
            className="abt-hero-content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="abt-eyebrow">About Himani Global</p>
            <h1 className="abt-hero-h1">
              Your education journey,<br />
              <em>built on trust.</em>
            </h1>
            <p className="abt-slogan-inline">Your Success, Our Mission</p>
            <p className="abt-hero-sub">
              A specialist education and migration consultancy with offices in Brisbane and Chitwan — serving students since 2015.
            </p>
            <div className="abt-hero-actions">
              <Link className="btn-gold" to="/contact#book-meeting">
                <Video size={16} aria-hidden /> Book free consultation
              </Link>
              <Link className="btn-ghost" to="/services">
                Our services
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="abt-hero-photo"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src="/photos/consultant-teal.jpg" alt="Himani Global education consultant" />
          </motion.div>
        </section>

        {/* ── Stats strip ── */}
        <div className="abt-stats">
          {[
            { n: 1200, s: '+', label: 'Students Guided' },
            { n: 98,   s: '%', label: 'Visa Success Rate' },
            { n: 8,    s: '+', label: 'Years Experience' },
            { n: 5,    s: '',  label: 'Countries Covered' },
          ].map(({ n, s, label }) => (
            <div key={label} className="abt-stat">
              <strong><AnimatedCount to={n} suffix={s} /></strong>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* ── Our Story ── */}
        <section className="abt-story">
          <div className="abt-story-text">
            <p className="abt-section-eyebrow">Our Story</p>
            <h2 className="abt-section-h2">
              A decade of opening<br /><em>doors for students</em>
            </h2>
            <p className="abt-body">
              Founded in 2015, Himani Global started with a single purpose: giving students honest, structured guidance to study abroad — not just paperwork.
            </p>
            <ul className="abt-list">
              <li>Offices in <strong>Brisbane, Australia</strong> and <strong>Chitwan, Nepal</strong></li>
              <li>Specialists in Australia, New Zealand, UK, USA &amp; Denmark pathways</li>
              <li>MARA-registered migration agents on staff</li>
              <li>Dedicated IELTS &amp; PTE preparation classes</li>
              <li>End-to-end: admissions → CoE → visa → departure</li>
            </ul>
          </div>
          <div className="abt-story-img">
            <img src="/photos/grad-celebration.jpg" alt="Student celebrating graduation in Brisbane" />
          </div>
        </section>

        {/* ── Mission & Vision ── */}
        <section className="abt-mv">
          <p className="abt-section-eyebrow abt-center">What Drives Us</p>
          <h2 className="abt-section-h2 abt-center">Mission &amp; Vision</h2>
          <div className="abt-mv-grid">
            <div className="abt-mv-card">
              <span className="abt-mv-icon"><Globe2 size={26} /></span>
              <h3>Our Mission</h3>
              <p>To open doors for students seeking global education — delivering accurate, personalised guidance that leads to real, successful outcomes.</p>
            </div>
            <div className="abt-mv-card">
              <span className="abt-mv-icon"><Star size={26} /></span>
              <h3>Our Vision</h3>
              <p>To become the most trusted study-abroad consultancy, expanding partnerships with top universities and continuously raising the standard of student support.</p>
            </div>
          </div>
        </section>

        {/* ── Why Choose Us ── */}
        <section className="abt-why">
          <p className="abt-section-eyebrow abt-center">Why Students Choose Us</p>
          <h2 className="abt-section-h2 abt-center">Built around <em>your outcome</em></h2>
          <div className="abt-why-grid">
            {whyItems.map(({ icon, title, text }) => (
              <div key={title} className="abt-why-card">
                <div className="abt-why-icon">{icon}</div>
                <h3 className="abt-why-title">{title}</h3>
                <p className="abt-why-text">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Founder highlight ── */}
        <section className="abt-founder">
          <div className="abt-founder-photo">
            <img src="/photos/consultant-desk.jpg" alt="Himani Global founder" />
          </div>
          <div className="abt-founder-text">
            <p className="abt-section-eyebrow">Leadership</p>
            <h2 className="abt-section-h2">Meet the founder</h2>
            <p className="abt-body">
              Himani Global was founded with the belief that every student deserves honest, structured guidance — not a one-size-fits-all process.
            </p>
            <p className="abt-body">
              With a team of MARA-registered consultants across Brisbane and Chitwan, we have built a practice grounded in transparency, empathy, and outcomes.
            </p>
            <ul className="abt-list">
              <li>MARA Registered Migration Agent</li>
              <li>Based in Brisbane, Australia</li>
              <li>1,200+ students guided since 2015</li>
            </ul>
          </div>
        </section>

        {/* ── CTA (merged slogan + action) ── */}
        <section className="abt-cta">
          <div className="abt-cta-inner">
            {/* Left: mission + stats */}
            <div className="abt-cta-left">
              <p className="abt-cta-eyebrow">Est. 2015 · Brisbane & Chitwan</p>
              <h2 className="abt-cta-mission">Your Success,<br /><em>Our Mission.</em></h2>
              <div className="abt-cta-stats">
                {[
                  { n: 1200, s: '+', label: 'Students guided' },
                  { n: 98,   s: '%', label: 'Visa success' },
                  { n: 8,    s: '+', label: 'Years experience' },
                ].map(({ n, s, label }) => (
                  <div key={label} className="abt-cta-stat">
                    <strong><AnimatedCount to={n} suffix={s} /></strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="abt-cta-divider" aria-hidden />

            {/* Right: action */}
            <div className="abt-cta-right">
              <h3 className="abt-cta-h2">Ready to plan<br />with confidence?</h3>
              <p className="abt-cta-sub">Book a free 20-minute session — we'll map your destination, timeline, documentation, and next steps. No obligation.</p>
              <div className="abt-cta-actions">
                <Link className="btn-gold" to="/contact#book-meeting">
                  <Video size={16} aria-hidden /> Book free consultation
                </Link>
                <Link className="btn-ghost" to="/tools">
                  Open student tools
                </Link>
              </div>
              <p className="abt-cta-note">
                <ShieldCheck size={13} aria-hidden /> MARA Registered · No outcome guarantees · Honest advice only
              </p>
            </div>
          </div>
        </section>

      </div>
    </AnimatedWrapper>
  )
}

const serviceCatalog = [
  {
    title: 'Student Admission',
    detail:
      'Course and institution shortlisting, profile matching, admission strategy, SOP guidance, and application handling with deadline tracking.',
  },
  {
    title: 'Visa Application',
    detail:
      'End-to-end visa documentation support, file structuring, compliance checks, and preparation support before lodgement.',
  },
  {
    title: 'Health Insurance',
    detail:
      'Guidance on student health cover requirements by destination and duration, with practical support in selecting compliant plans.',
  },
  {
    title: 'Professional Year Course',
    detail:
      'Orientation for eligible graduates on Professional Year pathways, intake timing, and documentation requirements.',
  },
  {
    title: 'NAATI CCL',
    detail:
      'Planning support for NAATI CCL preparation path, language selection strategy, and exam scheduling alignment.',
  },
  {
    title: 'IELTS Preparation',
    detail:
      'Academic or General Training — four-skill pacing, marked writing and speaking mocks, and batch timing aligned to your offer conditions and visa evidence windows.',
  },
  {
    title: 'PTE Preparation',
    detail:
      'PTE Academic — integrated-task drills, computer-lab stamina, 10–90 score targeting, and attempt timing coordinated with admission and visa milestones.',
  },
  {
    title: 'OBA for International Nurse',
    detail:
      'Support pathway overview for internationally qualified nurses, including stage-wise documentation and readiness planning.',
  },
  {
    title: 'Student Accommodation',
    detail:
      'Pre-arrival housing orientation, budget matching, area shortlisting, and basic checklist guidance for safer transition.',
  },
  {
    title: 'Skills Assessment',
    detail:
      'Advisory support for skills assessment pathway mapping, required evidence grouping, and authority-specific document flow.',
  },
  {
    title: 'Individual Tax Return',
    detail:
      'Practical support direction for individual tax return handling and records organization for eligible students and workers.',
  },
]

const SERVICE_ICONS = {
  'Student Admission':        <GraduationCap size={22} />,
  'Visa Application':         <FileCheck size={22} />,
  'Health Insurance':         <ShieldCheck size={22} />,
  'Professional Year Course': <Briefcase size={22} />,
  'NAATI CCL':                <Globe2 size={22} />,
  'IELTS Preparation':        <BookOpenText size={22} />,
  'PTE Preparation':          <Monitor size={22} />,
  'OBA for International Nurse': <ClipboardCheck size={22} />,
  'Student Accommodation':    <MapPin size={22} />,
  'Skills Assessment':        <CheckCircle2 size={22} />,
  'Individual Tax Return':    <Calculator size={22} />,
}

function ServicesPage() {
  const SVC_ACCENTS = ['#6C5CE7','#0984e3','#00b894','#e17055','#a29bfe','#d63031','#00cec9','#e84393','#f39c12','#27ae60','#8e44ad']
  return (
    <AnimatedWrapper>

      {/* ── Hero ── */}
      <section className="svc-hero">
        <div className="svc-hero-inner">
          <p className="svc-hero-eyebrow">Professional Support</p>
          <h1 className="svc-hero-h1">
            Everything you need,<br /><em>all in one place.</em>
          </h1>
          <p className="svc-hero-sub">
            From admission to visa, accommodation to tax — Himani Global handles every step of your study abroad journey so you can focus on building your future.
          </p>
          <p className="svc-hero-slogan">Your Success, Our Mission</p>
          <div className="svc-hero-actions">
            <Link to="/contact#book-meeting" className="btn-gold">Book free consultation</Link>
            <Link to="/tools" className="svc-hero-ghost-btn">Student tools →</Link>
          </div>
        </div>
        <div className="svc-hero-stats-grid">
          {[
            { num: '500+', label: 'Students helped' },
            { num: '11',   label: 'Services offered' },
            { num: '2',    label: 'Global offices' },
            { num: '5+',   label: 'Years experience' },
          ].map((s) => (
            <div key={s.label} className="svc-hero-stat">
              <strong>{s.num}</strong>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust strip ── */}
      <div className="svc-trust-strip">
        {[
          { icon: <ShieldCheck size={15}/>, text: 'MARA Registered' },
          { icon: <MapPin size={15}/>,      text: 'Brisbane, Australia' },
          { icon: <Globe2 size={15}/>,      text: 'Chitwan, Nepal' },
          { icon: <GraduationCap size={15}/>, text: 'AU · NZ · UK · USA · Denmark' },
          { icon: <Headphones size={15}/>,  text: 'End-to-end support' },
        ].map((p) => (
          <span key={p.text} className="svc-trust-pill">{p.icon}{p.text}</span>
        ))}
      </div>

      {/* ── Service Cards ── */}
      <section className="svc-cards-section">
        <div className="svc-cards-header">
          <p className="svc-cards-eyebrow">What we offer</p>
          <h2 className="svc-cards-h2">Our <em>Services</em></h2>
          <p className="svc-cards-sub">Comprehensive support at every stage of your study abroad journey.</p>
        </div>
        <div className="svc-cards-grid">
          {serviceCatalog.map((item, i) => {
            const accent = SVC_ACCENTS[i % SVC_ACCENTS.length]
            return (
              <motion.div
                key={item.title}
                className="svc-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.38, delay: (i % 3) * 0.07 }}
                style={{ '--svc-accent': accent }}
              >
                <div className="svc-card-icon-wrap">
                  <div className="svc-card-icon">{SERVICE_ICONS[item.title]}</div>
                </div>
                <h3 className="svc-card-title">{item.title}</h3>
                <p className="svc-card-desc">{item.detail}</p>
                {item.title === 'IELTS Preparation' && (
                  <Link to="/ielts" className="svc-card-link">IELTS class details <ArrowRight size={13}/></Link>
                )}
                {item.title === 'PTE Preparation' && (
                  <Link to="/pte" className="svc-card-link">PTE class details <ArrowRight size={13}/></Link>
                )}
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── Why Himani ── */}
      <section className="svc-why">
        <div className="svc-why-text">
          <p className="svc-why-eyebrow">Why Himani Global</p>
          <h2 className="svc-why-h2">More than an agent —<br /><em>a partner for life</em></h2>
          <p className="svc-why-sub">
            We combine local knowledge with international expertise. Our team in Brisbane and Nepal works together to make your journey seamless, compliant, and successful.
          </p>
          <Link to="/contact#book-meeting" className="btn-gold">Start your journey</Link>
        </div>
        <div className="svc-why-points">
          {[
            { icon: <ShieldCheck size={22}/>, title: 'MARA Registered Agents', desc: 'Legally authorised migration advice you can trust at every step.' },
            { icon: <MapPin size={22}/>,       title: 'Brisbane & Nepal Offices', desc: 'On-the-ground support in Australia and Nepal — no distance barriers.' },
            { icon: <GraduationCap size={22}/>, title: 'All Major Destinations', desc: 'Expert guidance for Australia, New Zealand, UK, USA, and Denmark programs.' },
            { icon: <Headphones size={22}/>,   title: 'Personalised Plans', desc: 'Every student gets a strategy tailored to their profile and goals.' },
          ].map((pt) => (
            <div key={pt.title} className="svc-why-point">
              <div className="svc-why-point-icon">{pt.icon}</div>
              <div>
                <h4 className="svc-why-point-title">{pt.title}</h4>
                <p className="svc-why-point-desc">{pt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section className="svc-cta">
        <p className="svc-cta-eyebrow">Ready to get started?</p>
        <h2 className="svc-cta-h2">Let's plan your journey together</h2>
        <p className="svc-cta-sub">
          Book a free consultation and Himani's team will build a personalised plan for your profile, budget, and timeline.
        </p>
        <div className="svc-cta-actions">
          <Link to="/contact#book-meeting" className="btn-gold">Book free consultation</Link>
          <Link to="/tools" className="btn-ghost">Open student tools</Link>
        </div>
      </section>

    </AnimatedWrapper>
  )
}

const destinationGuides = [
  {
    name: 'Australia',
    flag: '🇦🇺',
    shortInfo:
      'Career-focused study destination with strong quality controls, practical learning culture, and clear policy-driven student pathways.',
    overview:
      'Australia is strong for employability-focused programs, practical learning, and clear post-study planning when files are prepared carefully.',
    whoItFits:
      'Students looking for career-aligned courses, transparent quality indicators, and a structured study-to-career pathway.',
    tuitionBand: 'Approx. AUD 24,000 - 45,000 per year',
    livingBand: 'Approx. AUD 24,000 - 32,000 per year by city and lifestyle',
    visaApplicationCost:
      'Approx. AUD 1,600 - 1,900 (student visa application, base applicant; policy updates can change this).',
    dependentCost:
      'Approx. spouse AUD 1,100 - 1,400 + child AUD 350 - 450 each (plus living/insurance uplift).',
    englishRequirement:
      'Commonly IELTS/PTE/TOEFL evidence; exact score bands vary by institution, level, and visa-file context.',
    prAvailability:
      'Possible long-term pathway for eligible graduates under changing migration settings; not automatic and should never be promised.',
    insuranceRequirement:
      'OSHC is typically required for international students and should align with course/visa duration.',
    intakePattern: 'Major intakes: February and July (some programs run additional starts).',
    visaPath:
      'Student route planning usually links offer/enrolment, Genuine Student narrative, finance evidence, and health cover sequencing.',
    famousUniversities: [
      'University of Melbourne',
      'Australian National University (ANU)',
      'University of Sydney',
      'UNSW Sydney',
      'Monash University',
      'University of Queensland',
    ],
    scholarships: [
      'Australia Awards (highly competitive, government-linked pathways)',
      'Destination-focused university merit scholarships',
      'Faculty-level tuition reductions for strong academics',
      'Early acceptance or international excellence grants (institution-specific)',
    ],
    keyDocuments: [
      'Academic transcripts and completion/provisional documents',
      'Valid English score (IELTS/PTE or as accepted)',
      'Financial evidence aligned with sponsor narrative',
      'Offer/enrolment evidence and personal study statement',
    ],
  },
  {
    name: 'New Zealand',
    flag: '🇳🇿',
    shortInfo:
      'Career-focused study destination with strong quality controls, practical learning culture, and clear student visa pathways.',
    overview:
      'New Zealand is strong for employability-focused programs, practical learning, and structured post-study planning when files are prepared carefully.',
    whoItFits:
      'Students looking for career-aligned courses, English-medium instruction, and a manageable study-to-work pathway in a high-quality education system.',
    tuitionBand: 'Approx. NZD 22,000 - 45,000 per year',
    livingBand: 'Approx. NZD 20,000 - 25,000 per year by city and lifestyle',
    visaApplicationCost:
      'Approx. NZD 430 - 750 (student visa application, base applicant; policy updates can change this).',
    dependentCost:
      'Approx. partner NZD 430 - 750 + child NZD 230 - 350 each (plus living and insurance uplift).',
    englishRequirement:
      'Commonly IELTS/PTE/TOEFL evidence; exact score bands vary by institution, level, and visa-file context.',
    prAvailability:
      'Possible long-term pathway for eligible graduates under changing migration settings; not automatic and should never be promised.',
    insuranceRequirement:
      'Health and travel insurance is commonly required or strongly advised for international students for the study period.',
    intakePattern: 'Major intakes: February and July (some programs run additional starts).',
    visaPath:
      'Student route planning usually links offer of place, genuine student narrative, finance evidence, and health/character sequencing.',
    famousUniversities: [
      'University of Auckland',
      'University of Otago',
      'Victoria University of Wellington',
      'University of Canterbury',
      'Massey University',
      'Auckland University of Technology (AUT)',
    ],
    scholarships: [
      'New Zealand Excellence Awards (institution-administered, competitive)',
      'University merit scholarships for international students',
      'Faculty-level tuition reductions for strong academics',
      'Early acceptance or international excellence grants (institution-specific)',
    ],
    keyDocuments: [
      'Academic transcripts and completion/provisional documents',
      'Valid English score (IELTS/PTE or as accepted)',
      'Financial evidence aligned with sponsor narrative',
      'Offer of place and personal study statement',
    ],
  },
  {
    name: 'United Kingdom',
    flag: '🇬🇧',
    shortInfo:
      'Short-duration, globally recognized degrees with structured academic calendars and high competition in top-ranked institutions.',
    overview:
      'The UK is attractive for shorter master programs, globally recognized universities, and well-defined academic calendars.',
    whoItFits:
      'Students aiming for time-efficient degrees with strong ranking visibility and broad subject diversity.',
    tuitionBand: 'Approx. GBP 14,000 - 30,000 per year',
    livingBand: 'Approx. GBP 12,000 - 20,000 per year depending on city',
    visaApplicationCost:
      'Approx. GBP 490 - 600 visa fee + Immigration Health Surcharge (IHS) commonly around GBP 700 - 1,050/year depending on course length.',
    dependentCost:
      'Approx. dependant visa fee similar per person + IHS per person; plan significant extra maintenance funds for family files.',
    englishRequirement:
      'IELTS/UKVI IELTS/PTE or accepted alternatives based on provider and course requirements; check provider policy first.',
    prAvailability:
      'PR-style outcomes are limited and policy-dependent; students usually plan via legal post-study/work routes rather than direct promises.',
    insuranceRequirement:
      'Health surcharge and NHS access rules apply under the visa route in force at application time.',
    intakePattern: 'Primary intake: September. Secondary intake: January in selected programs.',
    visaPath:
      'Typical file flow ties offer conditions, CAS, maintenance-style funds logic, and timing-sensitive visa evidence.',
    famousUniversities: [
      'University of Oxford',
      'University of Cambridge',
      'Imperial College London',
      'UCL',
      "King's College London",
      'University of Manchester',
    ],
    scholarships: [
      'Chevening Scholarships (postgraduate, highly competitive)',
      'Commonwealth Scholarships (eligible pathways)',
      'University-specific global excellence scholarships',
      'Department/school bursaries and fee discounts',
    ],
    keyDocuments: [
      'Academic history with clear grading/transcript trail',
      'English test evidence and validity alignment',
      'CAS-linked documentation and fee/deposit proof',
      'Funds evidence in acceptable account format',
    ],
  },
  {
    name: 'USA',
    flag: '🇺🇸',
    shortInfo:
      'Large university ecosystem with broad subject choice, strong research opportunities, and significant variation by institution.',
    overview:
      'The USA offers wide program flexibility, strong research ecosystems, and large scholarship variation across institutions.',
    whoItFits:
      'Students who want broad course choice, customizable majors, and long-term academic progression options.',
    tuitionBand: 'Approx. USD 20,000 - 55,000 per year',
    livingBand: 'Approx. USD 12,000 - 22,000 per year by region/campus',
    visaApplicationCost:
      'Approx. USD 185 visa fee + USD 350 SEVIS for F-1 (excluding courier, medical, or travel-related extras).',
    dependentCost:
      'Approx. F-2 visa fee USD 185 per dependant (SEVIS usually tied to principal record), plus higher living/insurance planning.',
    englishRequirement:
      'TOEFL/IELTS/Duolingo (institution dependent), and sometimes GRE/GMAT by program; verify exact department expectations.',
    prAvailability:
      'Direct PR from student status is not straightforward; pathways depend on lawful transitions and employer/family-based routes.',
    insuranceRequirement:
      'University or private health insurance is commonly mandatory; waiver rules vary by campus.',
    intakePattern: 'Main intake: Fall. Additional intake: Spring (program-dependent).',
    visaPath:
      'File quality often depends on alignment across admission, I-20 data, DS-160 entries, finances, and interview readiness.',
    famousUniversities: [
      'MIT',
      'Stanford University',
      'Harvard University',
      'University of California, Berkeley',
      'Columbia University',
      'University of Michigan',
    ],
    scholarships: [
      'Need-aware / need-based institutional aid (policy varies)',
      'Merit scholarships at undergraduate and graduate levels',
      'Assistantships (TA/RA) for eligible postgraduate tracks',
      'External foundation or discipline-specific funding',
    ],
    keyDocuments: [
      'Academic transcripts and recommendation package',
      'English test and standardized tests where required',
      'Financial evidence matching I-20 projections',
      'Visa interview narrative and supporting document set',
    ],
  },
  {
    name: 'Denmark',
    flag: '🇩🇰',
    shortInfo:
      'High-quality, innovation-led education system with project-based learning and strong academic standards.',
    overview:
      'Denmark offers high-quality education, innovation-driven programs, and attractive study environments for focused applicants.',
    whoItFits:
      'Students seeking academically rigorous programs with strong project-based learning and European exposure.',
    tuitionBand: 'Approx. EUR 8,000 - 16,000 per year',
    livingBand: 'Approx. EUR 10,000 - 15,000 per year depending on city',
    visaApplicationCost:
      'Approx. DKK 2,000 - 2,500 for student residence permit processing (check latest SIRI fee table).',
    dependentCost:
      'Approx. dependent/residence-related fees are additional per family member; budget extra for funds, insurance, and settlement costs.',
    englishRequirement:
      'Program-level English proof (or Danish where required) with acceptance criteria set by each university.',
    prAvailability:
      'Long-term settlement may be possible only through compliant post-study and work pathways; assess case by case.',
    insuranceRequirement:
      'Health coverage and registration requirements should be planned alongside residence permit steps.',
    intakePattern: 'Main intake: September. Selected programs may offer spring starts.',
    visaPath:
      'Preparation usually emphasizes program-fit evidence, funds readiness, and residence permit sequencing with strict timelines.',
    famousUniversities: [
      'University of Copenhagen',
      'Aarhus University',
      'Technical University of Denmark (DTU)',
      'Copenhagen Business School (CBS)',
      'Aalborg University',
      'University of Southern Denmark',
    ],
    scholarships: [
      'Danish Government scholarship windows (institution-administered)',
      'University tuition waivers for non-EU students',
      'Program-level excellence discounts where available',
      'External Nordic/EU-facing funding options',
    ],
    keyDocuments: [
      'Academic and identity file set in accepted format',
      'Language proof per program requirement',
      'Funds/block-account style evidence as instructed',
      'Residence permit documentation and timeline plan',
    ],
  },
]

const DEST_IMAGES = {
  Australia: 'https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=900&q=80',
  'New Zealand': 'https://images.unsplash.com/photo-1730800672210-9ed7e0e1b789?auto=format&fit=crop&w=900&q=80',
  'United Kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=900&q=80',
  USA: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=900&q=80',
  Denmark: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=900&q=80',
}

const DEST_GRADIENT_FALLBACK = {
  Australia: 'linear-gradient(135deg,#1a4a6e,#0d2d4a)',
  'New Zealand': 'linear-gradient(135deg,#1a4a3a,#0d2d22)',
  'United Kingdom': 'linear-gradient(135deg,#1a1a4e,#2d2060)',
  USA: 'linear-gradient(135deg,#1a2a5e,#0a1a3a)',
  Denmark: 'linear-gradient(135deg,#8b1a2a,#4a0d1a)',
}

function DestinationsPage() {
  const [selectedCountry, setSelectedCountry] = useState(destinationGuides[0].name)
  const [activePanel, setActivePanel] = useState('universities')
  const activeCountry = destinationGuides.find((c) => c.name === selectedCountry) || destinationGuides[0]

  return (
    <AnimatedWrapper>

      {/* ── Hero ── */}
      <section className="dest-hero">
        <div className="dest-hero-inner">
          <p className="dest-eyebrow">Study Abroad Destinations</p>
          <h1 className="dest-hero-h1">Find Your <em>Perfect Destination</em></h1>
          <p className="dest-hero-sub">
            Expert guidance to Australia, New Zealand, UK, USA &amp; Denmark — personalised for students from Nepal.
          </p>
          <div className="dest-hero-actions">
            <Link to="/contact#book-meeting" className="btn-gold">Book destination counselling</Link>
            <Link to="/tools/visa-eligibility" className="btn-ghost">Visa eligibility checker</Link>
          </div>
        </div>
      </section>

      {/* ── Destination cards ── */}
      <section className="dest-cards-section">
        <p className="dest-cards-label">Select a destination to explore the full guide</p>
        <div className="dest-cards-grid">
          {destinationGuides.map((country) => (
            <button
              key={country.name}
              type="button"
              className={`dest-card ${selectedCountry === country.name ? 'is-active' : ''}`}
              onClick={() => { setSelectedCountry(country.name); setActivePanel('universities') }}
            >
              <div
                className="dest-card-img"
                style={{
                  backgroundImage: `url(${DEST_IMAGES[country.name]}), ${DEST_GRADIENT_FALLBACK[country.name]}`,
                }}
              />
              <div className="dest-card-overlay" />
              <span className="dest-card-active-chip" aria-hidden>Selected</span>
              <div className="dest-card-body">
                <span className="dest-card-flag" aria-hidden>{country.flag}</span>
                <h3 className="dest-card-name">{country.name}</h3>
                <p className="dest-card-tagline">{country.shortInfo}</p>
                <span className="dest-card-cta-badge">View full guide →</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── Country guide panel ── */}
      <div className="dest-guide-wrap">
        <motion.div
          key={activeCountry.name}
          className="dest-guide"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32 }}
        >
          {/* Header */}
          <div className="dest-guide-header">
            <div className="dest-guide-flag-wrap" aria-hidden>
              <span>{activeCountry.flag}</span>
            </div>
            <div>
              <h2>Study in {activeCountry.name}</h2>
              <p>{activeCountry.overview}</p>
            </div>
            <Link to="/contact#book-meeting" className="btn-gold dest-guide-header-cta">
              Talk to a counsellor
            </Link>
          </div>

          {/* Meta grid */}
          <dl className="dest-meta-grid">
            {[
              { label: 'Best fit for', value: activeCountry.whoItFits },
              { label: 'Tuition range', value: activeCountry.tuitionBand },
              { label: 'Living costs', value: activeCountry.livingBand },
              { label: 'Intake pattern', value: activeCountry.intakePattern },
              { label: 'Visa fee', value: activeCountry.visaApplicationCost },
              { label: 'Dependent cost', value: activeCountry.dependentCost },
              { label: 'English requirement', value: activeCountry.englishRequirement },
              { label: 'PR pathway', value: activeCountry.prAvailability },
            ].map(({ label, value }) => (
              <div key={label} className="dest-meta-item">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>

          {/* Tabs */}
          <div className="dest-tabs" role="tablist">
            {[
              { id: 'universities', icon: <Building2 size={14} aria-hidden />, label: 'Universities' },
              { id: 'scholarships', icon: <Sparkles size={14} aria-hidden />, label: 'Scholarships' },
              { id: 'documents', icon: <ClipboardCheck size={14} aria-hidden />, label: 'Documents' },
              { id: 'visa', icon: <ShieldCheck size={14} aria-hidden />, label: 'Visa path' },
            ].map(({ id, icon, label }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activePanel === id}
                className={`dest-tab ${activePanel === id ? 'is-active' : ''}`}
                onClick={() => setActivePanel(id)}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Tab panel */}
          <div className="dest-tab-panel" role="tabpanel">
            {activePanel === 'universities' && (
              <ul className="dest-value-list">
                {activeCountry.famousUniversities.map((uni) => <li key={uni}>{uni}</li>)}
              </ul>
            )}
            {activePanel === 'scholarships' && (
              <ul className="dest-value-list">
                {activeCountry.scholarships.map((s) => <li key={s}>{s}</li>)}
              </ul>
            )}
            {activePanel === 'documents' && (
              <ul className="dest-value-list">
                {activeCountry.keyDocuments.map((d) => <li key={d}>{d}</li>)}
              </ul>
            )}
            {activePanel === 'visa' && (
              <div className="dest-visa-content">
                <p>{activeCountry.visaPath}</p>
                <p className="dest-visa-note">
                  Need a practical checklist for your exact profile? Use the tools page, then bring your
                  output to a counselling call for line-by-line review.
                </p>
              </div>
            )}
          </div>

          {/* Guide CTA */}
          <div className="dest-guide-cta">
            <Link to="/contact#book-meeting" className="btn-gold">
              Talk to counsellor for {activeCountry.name}
            </Link>
            <Link to="/tools/nepali-visa-checklist" className="btn-ghost">
              Generate Nepal checklist
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Contact strip ── */}
      <section className="dest-contact-strip">
        <h2>Not sure which destination fits you?</h2>
        <p>
          Book a free consultation and Himani's team will match your academic background, budget,
          and goals to the right country and course.
        </p>
        <div className="dest-contact-actions">
          <Link to="/contact#book-meeting" className="btn-gold">Book free consultation</Link>
          <Link to="/tools" className="btn-ghost">Open student tools</Link>
        </div>
      </section>

    </AnimatedWrapper>
  )
}

const englishTestsBlogSlug = 'ielts-or-pte-which-english-test-fits-your-path'

const ieltsSkillCards = [
  {
    Icon: Headphones,
    title: 'Listening',
    body: 'Four recordings, forty questions — spelling, signposting, and staying calm when the pace jumps.',
  },
  {
    Icon: BookOpenText,
    title: 'Reading',
    body: 'Academic and General formats — question-type tactics, timeboxing, and when to move on without guessing blindly.',
  },
  {
    Icon: PenLine,
    title: 'Writing',
    body: 'Task response, cohesion, and lexical range — weekly marked tasks with band-specific feedback loops.',
  },
  {
    Icon: Mic2,
    title: 'Speaking',
    body: 'Parts 1–3 structure, natural fillers, and examiner-style mocks so test-day nerves shrink with repetition.',
  },
]

const pteFocusCards = [
  {
    Icon: Monitor,
    title: 'Computer-native exam',
    body: 'Keyboard, headset, and on-screen timer discipline — practice mirrors the real lab, not only PDFs.',
  },
  {
    Icon: ClipboardCheck,
    title: 'Integrated tasks',
    body: 'Read-aloud, repeat sentence, describe image, retell lecture, summarize text — chains where one weak link costs several points.',
  },
  {
    Icon: Star,
    title: '10–90 score logic',
    body: 'Overall and communicative skills, with awareness of enabling skills so you know what each mock is really testing.',
  },
  {
    Icon: Clock,
    title: 'Intake-aligned pacing',
    body: 'Results often return quickly — we sync mocks, review cycles, and booking so you do not collide with CAS or visa milestones.',
  },
]

const ieltsBatchPhases = [
  {
    title: 'Opening weeks',
    detail:
      'Baseline mock, error log setup, and priority skill stabilization — usually writing or speaking first.',
  },
  {
    title: 'Core block',
    detail:
      'Timed section rotations with instructor review and vocabulary work tied to the question types you miss most.',
  },
  {
    title: 'Test week',
    detail:
      'Full mock, band estimate, and a short game-day checklist — ID, timing, sleep, and listening pre-amble discipline.',
  },
]

const pteBatchPhases = [
  {
    title: 'Foundation',
    detail:
      'Question-type map, microphone checks, typing-speed reality check, and an honest baseline mock on the real interface.',
  },
  {
    title: 'Core block',
    detail:
      'Speaking and writing chains plus reading sets on rotation — each week closes with a scored mini-mock.',
  },
  {
    title: 'Pre-exam',
    detail:
      'Full-length simulation, fatigue management, and score interpretation so you know whether to book or drill one more week.',
  },
]

function EnglishClassAside({ bullets }) {
  return (
    <div className="class-reg-aside">
      <h2 className="contact-form-title">Before you submit</h2>
      <ul className="class-reg-aside-list">
        {bullets.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div className="class-reg-aside-contact">
        <strong>Quick contact</strong>
        <ContactDirectory variant="aside" />
      </div>
      <Link to="/contact#book-meeting" className="btn-ghost class-reg-aside-btn">
        Prefer a call first?
      </Link>
    </div>
  )
}

function EnglishClassRegistrationForm({ flavor, submitted, setSubmitted }) {
  return submitted ? (
    <div className="panel class-reg-success">
      <h2 className="contact-form-title">Registration received</h2>
      <p>
        Thank you — we have captured your class request. Our team will contact you using the phone or email
        you provided to confirm batch availability, fees, and start date.
      </p>
      <button type="button" className="btn-ghost" onClick={() => setSubmitted(false)}>
        Submit another request
      </button>
    </div>
  ) : (
    <form
      className="lead-form class-reg-form"
      onSubmit={(e) => {
        e.preventDefault()
        setSubmitted(true)
      }}
    >
      {flavor === 'pte' ? (
        <>
          <input type="hidden" name="program" value="pte" />
          <div className="class-reg-label class-reg-label--full class-reg-program-lock">
            <span>Program</span>
            <p className="class-reg-program-lock-text">
              <strong>PTE Academic</strong> — preparation track for this page. Add context in notes if you are
              also weighing IELTS.
            </p>
          </div>
        </>
      ) : (
        <label className="class-reg-label class-reg-label--full">
          <span>IELTS track *</span>
          <select name="program" required defaultValue="ielts-academic">
            <option value="ielts-academic">IELTS Academic</option>
            <option value="ielts-general">IELTS General Training</option>
            <option value="ielts-tbd">Not sure yet — assess on call</option>
          </select>
        </label>
      )}

      <label className="class-reg-label">
        <span>Full name *</span>
        <input type="text" name="fullName" placeholder="As on passport or ID" required autoComplete="name" />
      </label>
      <label className="class-reg-label">
        <span>Email *</span>
        <input type="email" name="email" placeholder="you@example.com" required autoComplete="email" />
      </label>
      <label className="class-reg-label">
        <span>Phone *</span>
        <input type="tel" name="phone" placeholder="With country code" required autoComplete="tel" />
      </label>

      <label className="class-reg-label">
        <span>Current level *</span>
        <select name="level" required defaultValue="">
          <option value="" disabled>
            Select closest fit
          </option>
          <option value="beginner">Beginner / first attempt</option>
          <option value="intermediate">Intermediate — need structured push</option>
          <option value="advanced">Advanced — fine-tuning for target band</option>
          <option value="unsure">Not sure — need assessment</option>
        </select>
      </label>
      <label className="class-reg-label">
        <span>Target score or band *</span>
        <input
          type="text"
          name="targetScore"
          placeholder={
            flavor === 'pte' ? 'e.g. PTE 65 overall, 65 speaking' : 'e.g. IELTS 7.0 each, 6.5 writing minimum'
          }
          required
        />
      </label>
      <label className="class-reg-label">
        <span>Preferred study mode *</span>
        <select name="mode" required defaultValue="">
          <option value="" disabled>
            Select format
          </option>
          <option value="online">Online (live sessions)</option>
          <option value="chitwan">In person — Chitwan</option>
          <option value="brisbane">In person — Brisbane</option>
          <option value="flex">Flexible — discuss options</option>
        </select>
      </label>
      <label className="class-reg-label">
        <span>Preferred start date *</span>
        <input type="date" name="startDate" required min={minDateInputValue()} />
      </label>

      <label className="class-reg-label class-reg-label--full">
        <span>Notes (optional)</span>
        <textarea
          name="notes"
          rows={4}
          placeholder="Test date booked, institution minimum, paper vs computer IELTS, work schedule, or anything else we should know."
        />
      </label>

      <div className="class-reg-submit-wrap">
        <button type="submit" className="btn-gold">
          Submit registration request
        </button>
        <p className="class-reg-disclaimer">
          This form sends a request to Himani Global. It does not guarantee a seat until we confirm batch
          capacity and fees with you.
        </p>
      </div>
    </form>
  )
}

function EnglishClassesHubPage() {
  return (
    <AnimatedWrapper>
      {/* Hero */}
      <section className="eng-hero">
        <div className="eng-hero-inner">
          <p className="eng-eyebrow">English test preparation</p>
          <h1 className="eng-hero-h1">IELTS &amp; PTE at<br /><em>Himani Global</em></h1>
          <p className="eng-hero-sub">
            Two dedicated tracks — same structured feedback culture. Pick the exam that matches your institution list and visa file, then open the track page to register.
          </p>
        </div>
      </section>

      {/* Track cards */}
      <section className="eng-tracks">
        <div className="eng-tracks-grid">
          <motion.div
            className="eng-track-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.42 }}
          >
            <div className="eng-track-icon"><BookOpenText size={22} /></div>
            <h3 className="eng-track-h3">IELTS preparation</h3>
            <p className="eng-track-p">
              Academic or General Training — four skills, human speaking examiner option, and clear band descriptors. Ideal when your shortlist still mixes paper-friendly destinations.
            </p>
            <Link className="eng-track-link" to="/ielts">
              IELTS track <ArrowRight size={15} />
            </Link>
          </motion.div>

          <motion.div
            className="eng-track-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.42, delay: 0.08 }}
          >
            <div className="eng-track-icon"><Monitor size={22} /></div>
            <h3 className="eng-track-h3">PTE Academic</h3>
            <p className="eng-track-p">
              Fully computer-delivered, integrated tasks, and numeric scoring — strong when you want rapid score turnaround and are comfortable with headphones and keyboard under pressure.
            </p>
            <Link className="eng-track-link" to="/pte">
              PTE track <ArrowRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Compare / CTA */}
      <section className="eng-compare">
        <div className="eng-compare-inner">
          <p className="eng-compare-eyebrow">Not sure which to pick?</p>
          <h2 className="eng-compare-h2">Which test fits<br /><em>your corridor?</em></h2>
          <p className="eng-compare-p">
            Acceptance, format, and timing differ by university and visa class. Our blog walks through how to choose without relying on rumour — then we stress-test the decision against your real shortlist.
          </p>
          <div className="eng-compare-actions">
            <Link className="btn-gold" to={`/blog/${englishTestsBlogSlug}`}>Read IELTS vs PTE guide</Link>
            <Link className="btn-ghost" to="/contact#book-meeting">Book a planning call</Link>
          </div>
        </div>
      </section>
    </AnimatedWrapper>
  )
}

function IeltsPrepPage() {
  const [submitted, setSubmitted] = useState(false)
  const asideBullets = [
    'Share institution or visa minimums if you have them — we refine band targets on call.',
    'Note whether you plan paper or computer-delivered IELTS so mock conditions match test day.',
    'Flag admission or visa deadlines so we can sequence mocks and class intensity realistically.',
  ]

  return (
    <AnimatedWrapper>
      {/* Hero */}
      <section className="ielts-hero">
        <div className="ielts-hero-inner">
          <p className="ielts-eyebrow">IELTS preparation</p>
          <h1 className="ielts-hero-h1">IELTS classes built around<br /><em>your target band</em></h1>
          <p className="ielts-hero-sub">
            Structured weekly rhythm: skills diagnostics, timed practice, marked writing, and speaking mocks. We align Academic or General Training prep with your offer conditions and visa evidence window.
          </p>
          <div className="ielts-hero-actions">
            <Link className="btn-gold" to="#register-ielts">Register for IELTS</Link>
            <Link className="btn-ghost" to="/english-classes">All English programs</Link>
          </div>
        </div>
      </section>

      {/* Four skills */}
      <section className="ielts-skills">
        <div className="ielts-skills-header">
          <p className="ielts-skills-eyebrow">Our approach</p>
          <h2 className="ielts-skills-h2">Four skills, one <em>coordinated plan</em></h2>
        </div>
        <div className="ielts-skills-grid">
          {ieltsSkillCards.map(({ Icon, title, body }, i) => (
            <motion.div
              key={title}
              className="ielts-skill-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: i * 0.06 }}
            >
              <div className="ielts-skill-icon"><Icon size={20} /></div>
              <h3 className="ielts-skill-h3">{title}</h3>
              <p className="ielts-skill-p">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Batch phases */}
      <section className="ielts-phases">
        <div className="ielts-phases-header">
          <p className="ielts-phases-eyebrow">Batch structure</p>
          <h2 className="ielts-phases-h2">Typical batch rhythm</h2>
        </div>
        <div className="ielts-phases-grid">
          {ieltsBatchPhases.map((step, idx) => (
            <motion.div
              key={step.title}
              className="ielts-phase-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: idx * 0.07 }}
            >
              <div className="ielts-phase-num">0{idx + 1}</div>
              <h3 className="ielts-phase-h3">{step.title}</h3>
              <p className="ielts-phase-p">{step.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="ielts-faq">
        <div className="ielts-faq-inner">
          <h2 className="ielts-faq-h2">Quick answers</h2>
          <div className="faq-list faq-list--compact">
            <details className="faq-item">
              <summary>Academic or General Training?</summary>
              <p>Academic is standard for higher-education offers. General Training is common for migration or some vocational routes. If you are unsure, pick "assess on call" in the form and bring your offer letter or visa subclass notes.</p>
            </details>
            <details className="faq-item">
              <summary>How many attempts should I budget?</summary>
              <p>Many students plan two slots — one diagnostic attempt and one polish attempt — but it depends on your starting level and deadlines. We map that honestly after the first week of class data.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Registration */}
      <section className="ielts-reg" id="register-ielts">
        <div className="ielts-reg-inner">
          <EnglishClassAside bullets={asideBullets} />
          <EnglishClassRegistrationForm flavor="ielts" submitted={submitted} setSubmitted={setSubmitted} />
        </div>
      </section>
    </AnimatedWrapper>
  )
}

function PtePrepPage() {
  const [submitted, setSubmitted] = useState(false)
  const asideBullets = [
    'PTE Academic is fully computer-based — mention if you need extra typing or headset comfort drills.',
    'Bring target overall or sectional scores from your university or visa checklist.',
    'If a test slot is already booked, add it in notes so we can compress or stretch your prep cadence.',
  ]

  return (
    <AnimatedWrapper>
      {/* Hero */}
      <section className="pte-hero">
        <div className="pte-hero-inner">
          <p className="pte-eyebrow">PTE Academic</p>
          <h1 className="pte-hero-h1">PTE preparation for<br /><em>fast, score-driven intakes</em></h1>
          <p className="pte-hero-sub">
            PTE rewards stamina, template discipline where appropriate, and ruthless time management on integrated tasks. Our batches blend strategy lectures with repeated machine-style mocks so the real exam room feels familiar, not experimental.
          </p>
          <div className="pte-hero-actions">
            <Link className="btn-gold" to="#register-pte">Register for PTE</Link>
            <Link className="btn-ghost" to="/english-classes">All English programs</Link>
          </div>
        </div>
      </section>

      {/* Focus cards */}
      <section className="pte-focus">
        <div className="pte-focus-header">
          <p className="pte-focus-eyebrow">Our approach</p>
          <h2 className="pte-focus-h2">Why PTE needs <em>its own lane</em></h2>
        </div>
        <div className="pte-focus-grid">
          {pteFocusCards.map(({ Icon, title, body }, i) => (
            <motion.div
              key={title}
              className="pte-focus-card"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: i * 0.06 }}
            >
              <div className="pte-focus-icon"><Icon size={20} /></div>
              <h3 className="pte-focus-h3">{title}</h3>
              <p className="pte-focus-p">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Batch phases */}
      <section className="pte-phases">
        <div className="pte-phases-header">
          <p className="pte-phases-eyebrow">Batch structure</p>
          <h2 className="pte-phases-h2">How PTE batches usually flow</h2>
        </div>
        <div className="pte-phases-grid">
          {pteBatchPhases.map((step, idx) => (
            <motion.div
              key={step.title}
              className="pte-phase-card"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.38, delay: idx * 0.07 }}
            >
              <div className="pte-phase-num">0{idx + 1}</div>
              <h3 className="pte-phase-h3">{step.title}</h3>
              <p className="pte-phase-p">{step.detail}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="pte-faq">
        <div className="pte-faq-inner">
          <h2 className="pte-faq-h2">Quick answers</h2>
          <div className="faq-list faq-list--compact">
            <details className="faq-item">
              <summary>Is PTE easier than IELTS?</summary>
              <p>Neither is universally easier — format fit matters more than myth. If you tolerate headphones, keyboard noise, and strict timers, PTE can feel more predictable. If you prefer live human speaking, compare both before locking fees.</p>
            </details>
            <details className="faq-item">
              <summary>Will my university accept PTE?</summary>
              <p>Most major destinations accept PTE Academic for many programs, but lists change. Always verify your exact course page and scholarship rules — bring screenshots or PDFs to class so we anchor prep to the right minimums.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Registration */}
      <section className="pte-reg" id="register-pte">
        <div className="pte-reg-inner">
          <EnglishClassAside bullets={asideBullets} />
          <EnglishClassRegistrationForm flavor="pte" submitted={submitted} setSubmitted={setSubmitted} />
        </div>
      </section>
    </AnimatedWrapper>
  )
}

function ContactPage() {
  const location = useLocation()
  const [formSubmitted, setFormSubmitted] = useState(false)

  useEffect(() => {
    if (location.hash === '#book-meeting') {
      window.requestAnimationFrame(() => {
        document.getElementById('book-meeting')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }, [location.pathname, location.hash])

  return (
    <AnimatedWrapper>
      {/* Hero */}
      <section className="ctc-hero">
        <div className="ctc-hero-inner">
          <p className="ctc-hero-eyebrow">Get in touch</p>
          <h1 className="ctc-hero-h1">Let's plan your<br /><em>journey together</em></h1>
          <p className="ctc-hero-sub">Book for a consult session, visit us in Brisbane or Chitwan, or send a meeting request — we'll confirm fees, format, and timing directly.</p>
          <div className="ctc-hero-pills">
            <span className="ctc-hero-pill"><Video size={14}/>Consult session</span>
            <span className="ctc-hero-pill"><MapPin size={14}/>Brisbane office</span>
            <span className="ctc-hero-pill"><Globe2 size={14}/>Chitwan office</span>
          </div>
        </div>
      </section>

      <div className="ctc-main" id="book-meeting">

        {/* ── Left: form panel ── */}
        <div className="ctc-form-panel">
          <div className="ctc-form-inner">
            <div className="ctc-form-header">
              <h2 className="ctc-form-h2">Request a meeting</h2>
              <p className="ctc-form-intro">Share a few details and we'll confirm a slot, fees, and format.</p>
            </div>

            {formSubmitted ? (
              <div className="ctc-form-success">
                <CheckCircle2 size={40} className="ctc-form-success-icon" />
                <h3 className="ctc-form-success-h3">Request received!</h3>
                <p className="ctc-form-success-p">Our team will contact you to confirm your appointment slot, fees, and format. Nothing is final until you hear from us.</p>
                <button className="btn-ghost" onClick={() => setFormSubmitted(false)}>Submit another request</button>
              </div>
            ) : (
              <form className="ctc-form" onSubmit={(e) => { e.preventDefault(); setFormSubmitted(true); }}>
                <div className="ctc-fields-row">
                  <label className="ctc-field">
                    <span className="ctc-field-label">Full name</span>
                    <input type="text" name="fullName" autoComplete="name" placeholder="As on your ID" required />
                  </label>
                  <label className="ctc-field">
                    <span className="ctc-field-label">Email</span>
                    <input type="email" name="email" autoComplete="email" placeholder="you@example.com" required />
                  </label>
                  <label className="ctc-field">
                    <span className="ctc-field-label">Phone</span>
                    <input type="tel" name="phone" autoComplete="tel" placeholder="+977 or +61…" required />
                  </label>
                </div>
                <div className="ctc-fields-row">
                  <label className="ctc-field ctc-field--grow">
                    <span className="ctc-field-label">How would you like to meet?</span>
                    <select name="meetingFormat" defaultValue="" required>
                      <option value="" disabled>Select format</option>
                      <option value="online">Online — consult session</option>
                      <option value="chitwan">In person — Chitwan</option>
                      <option value="brisbane">In person — Brisbane</option>
                    </select>
                  </label>
                  <label className="ctc-field">
                    <span className="ctc-field-label">Preferred date</span>
                    <input type="date" name="preferredDate" required min={minDateInputValue()} />
                  </label>
                  <label className="ctc-field">
                    <span className="ctc-field-label">Time (optional)</span>
                    <input type="time" name="preferredTime" />
                  </label>
                </div>
                <label className="ctc-field ctc-field--full">
                  <span className="ctc-field-label">Topic or questions</span>
                  <textarea name="topic" rows={4} placeholder="E.g. Australia master intake, UK CAS timing, IELTS plan, or budget range." />
                </label>
                <div className="ctc-submit-row">
                  <button type="submit" className="btn-gold ctc-submit-btn">
                    <Video size={15} aria-hidden /> Request meeting
                  </button>
                  <p className="ctc-submit-note">
                    <ShieldCheck size={12} /> Request only — nothing confirmed until our team replies.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ── Right: dark contact info panel ── */}
        <div className="ctc-info">
          <div className="ctc-info-inner">
            <p className="ctc-info-eyebrow">Offices & contact</p>
            <h2 className="ctc-info-h2">Reach us<br /><em>directly</em></h2>
            <p className="ctc-info-sub">Call, WhatsApp, or use the form — every channel in one place.</p>

            {/* Office cards */}
            <div className="ctc-offices">
              {/* Brisbane */}
              <div className="ctc-office-card">
                <div className="ctc-office-header">
                  <div className="ctc-office-dot ctc-office-dot--au" />
                  <span className="ctc-office-city">Brisbane, Australia</span>
                </div>
                <div className="ctc-office-rows">
                  <div className="ctc-office-row">
                    <Phone size={13} />
                    <a href="tel:+61451200644">{PHONE_BRISBANE_A}</a>
                    <span className="ctc-sep">·</span>
                    <a href="tel:+61424942948">{PHONE_BRISBANE_B}</a>
                  </div>
                  <div className="ctc-office-row">
                    <MessageCircle size={13} />
                    <a href={PHONE_WHATSAPP_WA_ME} target="_blank" rel="noopener noreferrer">
                      WhatsApp {PHONE_WHATSAPP} <ExternalLink size={11} />
                    </a>
                  </div>
                  <div className="ctc-office-row">
                    <MapPin size={13} />
                    <a href={OFFICE_BRISBANE_MAP_URL} target="_blank" rel="noopener noreferrer">
                      {OFFICE_BRISBANE_ADDRESS} <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Chitwan */}
              <div className="ctc-office-card">
                <div className="ctc-office-header">
                  <div className="ctc-office-dot ctc-office-dot--np" />
                  <span className="ctc-office-city">Chitwan, Nepal</span>
                </div>
                <div className="ctc-office-rows">
                  <div className="ctc-office-row">
                    <Phone size={13} />
                    <a href="tel:+97756490603">{PHONE_CHITWAN_LANDLINE}</a>
                    <span className="ctc-sep">·</span>
                    <a href="tel:+9779862447952">{PHONE_CHITWAN_MOBILE}</a>
                  </div>
                  <div className="ctc-office-row">
                    <MapPin size={13} />
                    <span>{OFFICE_CHITWAN_ADDRESS}</span>
                  </div>
                </div>
              </div>

              {/* Kathmandu */}
              <div className="ctc-office-card ctc-office-card--soon">
                <div className="ctc-office-header">
                  <div className="ctc-office-dot ctc-office-dot--soon" />
                  <span className="ctc-office-city">Kathmandu, Nepal</span>
                  <span className="ctc-soon-badge"><Clock size={11} /> Opening soon</span>
                </div>
                <div className="ctc-office-rows">
                  <div className="ctc-office-row">
                    <Phone size={13} />
                    <a href="tel:+9779845902662">{PHONE_KATHMANDU}</a>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a className="ctc-wa-btn" href={PHONE_WHATSAPP_WA_ME} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} />
              WhatsApp us now
            </a>
          </div>
        </div>



      </div>
    </AnimatedWrapper>
  )
}

function App() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <div className="app-shell">
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} />

      <header className="topbar">
        <Link className="brand" to="/">
          <img src="/logo.png" alt="Himani Global" className="brand-logo" />
        </Link>
        <div className="topbar-right">
          <nav className="topbar-desktop-nav">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  isActive || link.activePaths?.includes(location.pathname) ? 'active' : ''
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <Link
            to="/contact#book-meeting"
            className="btn-gold topbar-cta"
            title="Book an online or in-person meeting"
          >
            <Video size={16} aria-hidden />
            <span className="topbar-cta-text">Book meeting</span>
          </Link>
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              <div className="mobile-drawer-header">
                <Link className="brand" to="/" onClick={() => setMenuOpen(false)}>
                  <img src="/logo.png" alt="Himani Global" className="brand-logo" />
                </Link>
                <button className="hamburger-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <X size={20} />
                </button>
              </div>
              {navLinks.map((link) => (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={({ isActive }) =>
                    isActive || link.activePaths?.includes(location.pathname) ? 'active' : ''
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <Link
                to="/contact#book-meeting"
                className="btn-gold"
                onClick={() => setMenuOpen(false)}
              >
                <Video size={16} aria-hidden />
                Book meeting
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          className="page-motion"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools" element={<ToolsHubPage />} />
        <Route path="/tools/visa-eligibility" element={<VisaEligibilityToolPage />} />
        <Route path="/tools/nepali-visa-checklist" element={<NepaliChecklistToolPage />} />
        <Route path="/tools/skill-assessment-points" element={<SkillAssessmentPointsToolPage />} />
        <Route
          path="/tools/profile-snapshot"
          element={
            <ToolGuidePage
              title="Study-abroad profile snapshot"
              detail="Himani's opening intake worksheet for academics, budget, language readiness, and realistic destination fit."
            />
          }
        />
        <Route
          path="/tools/corridor-comparison"
          element={
            <ToolGuidePage
              title="Corridor comparison lens"
              detail="Compare destination corridors by cost bands, timeline rhythm, and the likely next bottleneck in your file."
            />
          }
        />
        <Route
          path="/tools/admission-visa-roadmap"
          element={
            <ToolGuidePage
              title="Admission + visa file roadmap"
              detail="A practical map of shared core documents and destination-specific requirements before submission."
            />
          }
        />
        <Route
          path="/about"
          element={<AboutPage />}
        />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route
          path="/services"
          element={<ServicesPage />}
        />
        <Route path="/english-classes" element={<EnglishClassesHubPage />} />
        <Route path="/ielts" element={<IeltsPrepPage />} />
        <Route path="/pte" element={<PtePrepPage />} />
        <Route path="/blog" element={<BlogListPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
        </motion.div>
      </AnimatePresence>

      <WhatsAppWidget />

      <footer className="footer footer--site panel">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <img src="/logo.png" alt="Himani Global" className="footer-brand-logo" />
            </div>
            <p className="footer-cities">Brisbane · Chitwan · Baglung · Kathmandu (soon)</p>
          </div>

          <div className="footer-grid">
            <div className="footer-col">
              <p className="footer-col-eyebrow">Offices</p>
              <div className="footer-address-block">
                <p>
                  <span className="footer-loc">Brisbane</span>
                  <a
                    className="footer-loc-addr"
                    href={OFFICE_BRISBANE_MAP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {OFFICE_BRISBANE_ADDRESS}
                  </a>
                </p>
                <p>
                  <span className="footer-loc">Chitwan (Bharatpur)</span>
                  <span className="footer-loc-addr">{OFFICE_CHITWAN_ADDRESS}</span>
                </p>
              </div>
            </div>
            <div className="footer-col">
              <p className="footer-col-eyebrow">Phone &amp; WhatsApp</p>
              <ul className="footer-phone-list" role="list">
                <li>
                  <a href="tel:+61451200644">{PHONE_BRISBANE_A}</a>
                  <span className="footer-phone-hint">Brisbane</span>
                </li>
                <li>
                  <a href="tel:+61424942948">{PHONE_BRISBANE_B}</a>
                  <span className="footer-phone-hint">Brisbane (mobile)</span>
                </li>
                <li>
                  <a href="tel:+97756490603">{PHONE_CHITWAN_LANDLINE}</a>
                  <span className="footer-phone-hint">Chitwan</span>
                </li>
                <li>
                  <a href="tel:+9779862447952">{PHONE_CHITWAN_MOBILE}</a>
                  <span className="footer-phone-hint">Chitwan (mobile)</span>
                </li>
                <li>
                  <a href={PHONE_WHATSAPP_WA_ME} target="_blank" rel="noopener noreferrer">
                    WhatsApp {PHONE_WHATSAPP}
                  </a>
                  <span className="footer-phone-hint">Message us</span>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <p className="footer-col-eyebrow">Connect</p>
              <div className="footer-social" role="navigation" aria-label="Social media">
                <a
                  className="footer-social-pill"
                  href={SOCIAL_FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={14} aria-hidden />
                  Facebook
                </a>
                <a
                  className="footer-social-pill"
                  href={SOCIAL_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={14} aria-hidden />
                  Instagram
                </a>
                <a
                  className="footer-social-pill"
                  href={SOCIAL_TIKTOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={14} aria-hidden />
                  TikTok
                </a>
              </div>
              <p className="footer-email">
                <a href="mailto:admissions@himaniglobal.com">
                  <Mail size={14} aria-hidden />
                  admissions@himaniglobal.com
                </a>
              </p>
              <p className="footer-email">
                <a href="mailto:himani@himaniglobal.com">
                  <Mail size={14} aria-hidden />
                  himani@himaniglobal.com
                </a>
              </p>
            </div>
          </div>

          <p className="footer-disclaimer disclaimer">
            <CheckCircle2 size={14} aria-hidden />
            <span>We provide guidance and documentation support. Final visa decisions are made by authorities.</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
