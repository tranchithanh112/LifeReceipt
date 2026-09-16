import { makeFmt } from "./format";
import type { Dict } from "./types";

export const en: Dict = {
  locale: "en",
  htmlLang: "en",
  fmt: makeFmt("en"),

  meta: {
    title: "LifeReceipt — Where Did Your Life Go?",
    description:
      "Find out how many years of your life you spend sleeping, working, scrolling, commuting and more.",
    tagline: "Where did your life go?",
    calculateTitle: "Calculate my life",
    calculateDescription:
      "Nine quick questions about how you spend an average day. Takes 30 seconds, no signup, nothing leaves your device.",
    resultsTitle: "My LifeReceipt",
    resultsDescription:
      "An itemised receipt for one human life: what you have already spent on sleep, work, scrolling and the rest, and what it will cost by 80.",
    keywords: [
      "life calculator",
      "screen time",
      "time spent sleeping",
      "how much time do I spend scrolling",
      "life expectancy calculator",
      "LifeReceipt",
    ],
  },

  landing: {
    headlineLead: "Where did your life",
    headlineEm: "go?",
    sub: "Nine questions. One very uncomfortable receipt.",
    cta: "Calculate my life",
    ctaNote: "30 seconds. No signup. Nothing leaves your phone.",
    reopen: "Or reopen your last receipt →",
    tickerEyebrow: "In an average 80-year life you will spend",
    tickerNote: "Yours are worse somewhere very specific. That's the part worth finding out.",
    averageLife: [
      { value: "26 years", label: "asleep" },
      { value: "13 years", label: "at work" },
      { value: "9 years", label: "on a screen" },
      { value: "4 years", label: "eating" },
      { value: "1 year", label: "commuting" },
    ],
    closingTitle: "You only get one. Where is it going?",
    sampleName: "Sample",
    closingCta: "Print my LifeReceipt",
  },

  calculator: {
    loading: "Loading your answers…",
    startOver: "Start over",
    billedSoFar: "Billed so far",
    back: "Previous question",
    skip: "Skip",
    continue: "Continue",
    finish: "Print my receipt",
    ageEyebrow: "First things first",
    ageQuestion: "How old are you?",
    ageUnit: "years old",
    ageExact: "Your age, exact value",
    ageControlName: "age",
    aliveFor: (days) => `You have been alive for roughly ${days} days.`,
    exactSuffix: "h",
    exactValue: (label) => `${label}, exact value`,
    thatIs: (duration) => `That is ${duration} of your life so far.`,
    skipped: "Skipped — move the slider to put it back on the receipt.",
    zero: "Zero. Nothing to bill you for.",
    progressLabel: "Question progress",
  },

  receipt: {
    title: "Life Receipt",
    customer: "Customer",
    namePlaceholder: "ADD YOUR NAME",
    nameField: "Your name on the receipt",
    anonymous: "Anonymous",
    age: "Age",
    daysLived: "Days lived",
    issued: "Issued",
    order: "Order",
    itemRate: "Item / rate",
    lifeSpent: "Life spent",
    subtotal: "Subtotal",
    everythingElse: "Everything else",
    overlapCredit: "Overlap credit",
    totalLifeUsed: "Total life used",
    years: "yrs",
    mostExpensive: "Most expensive item",
    mostQuestionable: "Most questionable purchase",
    total: "Total",
    oneLife: "One life.",
    noRefunds: "** No refunds **",
    finalStamp: "Final",
    thanks: "Thank you for your time",
    emptyItems: "No line items. Suspiciously empty life.",
    moreItems: (n) => `+ ${n} more ${n === 1 ? "item" : "items"}`,
    projectedAcrossOneLife: "Projected across one life",
  },

  reveal: {
    youAre: (age) => `You're ${age}.`,
    thatIsAbout: "That is about",
    days: "days.",
    alreadySpent: "You have already spent",
    ofThem: (gerund) => `of them ${gerund}.`,
    andThisIsWhere: "And this is where it went.",
    skip: "Skip →",
  },

  results: {
    printing: "Printing…",
    srHeading: "Your LifeReceipt — where the years have gone, and where they are going",
    editAnswers: "Edit answers",
    startOver: "Start over",
    addActivities: "Add some activities",
    statsEyebrow: "If nothing changes",
    statsTitle: "The part nobody tells you",
    quipsEyebrow: "Notes on your spending",
    forecastEyebrow: "The only refund available",
    forecastTitle: (age) => `If you carry on until ${age}…`,
    shareEyebrow: "Make it everyone's problem",
    shareTitle: "Share your LifeReceipt",
    smallPrint: "The small print",
    method1: (age) =>
      `Every answer becomes an average number of hours per day, multiplied across your life so far and forward to age ${age}. Weekday answers spread over five days a week, weekly answers over seven.`,
    method2:
      "Activities are allowed to overlap — scrolling on a commute is counted on both lines, because it costs you both times. The itemised total can therefore exceed your age. It is a receipt, not an audit.",
    method3:
      "Everything runs in your browser. Your answers are saved to this device only, and clearing them below removes them for good.",
    missedSomething: "Missed something?",
    changeAnswers: "Change my answers",
    nothingToPrint: "Nothing to print",
    notBilledYet: "We haven't billed you yet.",
    notBilledBody:
      "Answer a handful of questions and your receipt prints in about thirty seconds.",
  },

  forecast: {
    chooseActivity: "Choose an activity",
    alreadySpent: "Already spent",
    stillToSpend: "Still to spend",
    behindYou: (pct) => `${pct}% behind you`,
    toAge: (age) => `to age ${age}`,
    lifetimeTotal: "Lifetime total",
    whatIfCut: "What if you cut it?",
    minusOneHour: "−1h",
    halveIt: "Halve it",
    zeroIt: "Zero it",
    reset: "Reset",
    timeRefunded: "Time refunded",
    additionalCharge: "Additional charge",
    nothingYet: "Nothing yet",
    dragPrompt: "Drag the slider, or tap a shortcut above.",
    backBefore: (age) => `back, before you turn ${age}.`,
    surrenderBefore: (age) => `you would hand over before you turn ${age}.`,
    acrossNHabits: (n) => `across ${n} changed habits`,
    resetEverything: "Reset everything",
    assumingYouLiveTo: "Assuming you live to",
    lifeExpectancyLabel: "Life expectancy in years",
    changedMarker: "changed",
    adjust: (label) => `Adjust ${label}`,
    barLabel: (pct, label) =>
      `${pct}% of your lifetime ${label.toLowerCase()} is already behind you`,
  },

  share: {
    tabReceipt: "The receipt",
    tabStatement: "The excuse",
    shareButton: "Share my LifeReceipt",
    download: "Download",
    copyLink: "Copy link",
    shared: "Shared.",
    saved: "Saved to your downloads.",
    copied: "Copied.",
    linkCopied: "Link copied.",
    failed: "Couldn't render the card — a screenshot works just as well.",
    tabsLabel: "Share card style",
    dareEyebrow: "Think your numbers are bad?",
    dareTitle: "Find out whose are worse.",
    sendToFriend: "Send this to a friend",
    readyToPaste: "Ready to paste",
    dare: (duration, gerund) =>
      `I just found out I'm going to spend ${duration} of my life ${gerund} 💀\nYour turn.`,
    dareFallback: "I just found out where my entire life is going 💀\nYour turn.",
    punchline: (duration, gerund) =>
      `Apparently I’ll spend ${duration} of my life ${gerund}.`,
    punchlineFallback: "Apparently I have no idea where my life goes.",
    cardHeadlineLead: "Where did\nmy life",
    cardHeadlineEm: "go?",
    daysLived: "Days lived",
    daysLeft: "Days left",
    noRefunds: "No refunds",
    excuseQuote: "“I don’t\nhave time.”",
    meanwhile: "Meanwhile",
    ofOneSingleLife: "of one single life",
    alreadyGone: "Already gone",
    stillToCome: "Still to come",
    findOutRest: "Find out where the rest of yours is going.",
    ageLabel: (age) => `Age ${age}`,
    yearUnit: "year",
    yearsUnit: "years",
    monthUnit: "month",
    monthsUnit: "months",
    beingBusy: "Being busy",
  },

  footer: {
    privacy: "Your answers stay on your device. Nothing is uploaded, stored or sold.",
  },

  notFound: {
    eyebrow: "Void · no such transaction",
    title: "This page was never printed.",
    body: "The page you asked for doesn't exist. Your life, unfortunately, is still being spent somewhere.",
    cta: "Back to LifeReceipt",
  },

  localeSwitch: { label: "Language" },

  activities: {
    sleep: {
      label: "Sleep",
      receiptLabel: "Sleep",
      question: "How many hours do you sleep per day?",
      hint: "Be honest, not aspirational.",
    },
    work: {
      label: "Work / study",
      receiptLabel: "Work",
      question: "How many hours do you work or study on an average weekday?",
      hint: "Counted across 5 days a week.",
    },
    social: {
      label: "Social media",
      receiptLabel: "Scrolling",
      question: "How many hours do you spend scrolling per day?",
      hint: "TikTok · Instagram · Facebook · X · Reddit · Shorts",
    },
    streaming: {
      label: "Streaming",
      receiptLabel: "Streaming",
      question: "How many hours do you watch Netflix / YouTube / TV per day?",
      hint: "Background rewatches of The Office count.",
    },
    gaming: {
      label: "Gaming",
      receiptLabel: "Gaming",
      question: "How many hours do you game per day?",
      hint: "Averaged out — weekend benders included.",
    },
    commute: {
      label: "Commuting",
      receiptLabel: "Commute",
      question: "How long do you commute each day?",
      hint: "Both directions, on a working day.",
    },
    exercise: {
      label: "Exercise",
      receiptLabel: "Exercise",
      question: "How many hours do you exercise per week?",
      hint: "Walking to the fridge is not cardio.",
    },
    loved: {
      label: "People you love",
      receiptLabel: "Loved ones",
      question:
        "How much intentional time do you spend with people you care about each day?",
      hint: "Phones down, actually present.",
    },
  },

  cadenceUnit: {
    daily: "hours a day",
    weekday: "hours a weekday",
    weekly: "hours a week",
  },
  cadenceShort: { daily: "/day", weekday: "/weekday", weekly: "/week" },
  hourShort: "h",

  gerund: {
    sleep: "asleep",
    work: "working",
    social: "scrolling",
    streaming: "streaming",
    gaming: "gaming",
    commute: "commuting",
    exercise: "exercising",
    loved: "with the people you love",
  },
  gerundOther: (label) => label.toLowerCase(),
  customFallbackLabel: "Other",

  stats: {
    future: (gerund, age) => `more ${gerund} between now and ${age}, if nothing changes.`,
    outgrowsLife: (gerund) => `${gerund} — more than your entire life so far.`,
    lifetime: (gerund) => `is what ${gerund} costs you across one entire life.`,
    freeTime:
      "of genuinely unclaimed time left, once sleep, work and commuting take their cut.",
    screens: "of your one life will happen behind a pane of glass.",
    perYear: (gerund, days) =>
      `a year ${gerund} — ${days} entire days, every single year.`,
    ratio: (gerund, against) => `more of your life goes ${gerund} than ${against}.`,
    ratioVsExercise: "exercising",
    ratioVsLoved: "with the people you love",
    saturdays: (summers) =>
      `Saturdays left. And ${summers} more summers. That is the whole supply.`,
    daysLeft: (age) => `days left until you turn ${age}. That is the entire remaining budget.`,
    sleepLifetime: "spent asleep by the end. The largest purchase you will never remember.",
    workLifetime: "of your life handed to work. Hopefully you like it.",
    commuteLifetime: "in transit. Not travelling anywhere interesting. Commuting.",
    shareSoFar: (gerund) =>
      `of every year you have ever lived has already gone ${gerund}.`,
    exerciseTiny: (duration, gerund) =>
      `of exercise across a whole lifetime, against ${duration} ${gerund}.`,
  },

  humor: {
    "scroll-heavy": "You say you don't have time. Your screen time would like a word.",
    "scroll-vs-exercise": "Your thumb is currently your most trained muscle.",
    "scroll-vs-loved":
      "Your phone receives more eye contact than the people in your life.",
    "scroll-moderate":
      "A restrained scrolling habit. Still measured in years, but restrained.",
    "scroll-none": "Barely any scrolling. Either admirable or a very old phone.",
    "sleep-low": "Apparently sleep is optional.",
    "sleep-low-work-high":
      "Sleeping less so you can work more. A flawless, undefeated strategy.",
    "sleep-high": "An impressive commitment to horizontal living.",
    "work-heavy": "Your employer appears prominently on your LifeReceipt.",
    "work-none": "No work on the receipt. Retired, rich, or extremely optimistic.",
    "commute-heavy": "Your second home appears to be transportation.",
    "commute-zero": "Zero commute. Somebody, at some point, made a very good decision.",
    "gaming-heavy": "At least your Steam library is getting value for money.",
    "gaming-moderate": "Gaming: present, accounted for, and quietly expensive.",
    "streaming-heavy":
      "Netflix is not a personality trait, but it is now a line item on your receipt.",
    "streaming-vs-scroll": "You don't watch things any more. You flick past them.",
    "exercise-strong": "Suspiciously responsible behaviour detected.",
    "exercise-token": "Under an hour a week of exercise. Technically non-zero.",
    "exercise-zero": "Exercise: no charge. Nothing was purchased.",
    "screens-huge": "More than a third of your waking life happens behind glass.",
    "screens-vs-sleep": "You spend more time looking at screens than sleeping. Bold.",
    "loved-strong":
      "Whoever you spend this time with is lucky. This is the only line nobody regrets.",
    "loved-thin":
      "Under half an hour a day with the people you love. Noted, without comment.",
    overflow:
      "Your day contains more than 24 hours. Either heroic multitasking or creative accounting.",
    "young-scroller":
      "You have not been alive very long, and a striking amount of it has been vertical video.",
    "older-scroller":
      "You did not make it this far through history to spend this long on a feed.",
  },
  humorTopLine: (label, duration) =>
    `${label} is your largest single expense at ${duration}, and it is only going up.`,
  humorFallback: "One life. Spent exactly as recorded above.",

  customItems: {
    activityName: "Activity name",
    hoursFor: (label) => `Hours for ${label}`,
    thisActivity: "this activity",
    perDay: "/day",
    perWeek: "/week",
    howOften: "How often",
    remove: (label) => `Remove ${label}`,
    addLineItem: "Add a line item",
    maxReached: "Six custom lines is plenty. The receipt has to fit on a phone.",
    hoursControlName: "hours",
  },

  numberField: {
    decrease: (name) => `Decrease ${name}`,
    increase: (name) => `Increase ${name}`,
  },
};
