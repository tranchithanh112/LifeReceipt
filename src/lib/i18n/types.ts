import type { ActivityId, Cadence } from "../activities";

export type Locale = "vi" | "en";

export const LOCALES: Locale[] = ["vi", "en"];

/** Vietnamese is the primary audience, so it is what the static HTML ships. */
export const DEFAULT_LOCALE: Locale = "vi";

export const LOCALE_LABEL: Record<Locale, string> = {
  vi: "Tiếng Việt",
  en: "English",
};

/** Formatters bound to one locale, so components never pass a locale around. */
export interface Fmt {
  /** Compact, for receipt lines: "9y 4m" / "9 năm 4 th". */
  duration: (years: number) => string;
  /** Prose: "9 years 4 months" / "9 năm 4 tháng". */
  durationLong: (years: number) => string;
  /** Headline form: "9.4 years" / "9,4 năm". */
  yearsDecimal: (years: number) => string;
  number: (value: number) => string;
  ratio: (value: number) => string;
  /** The date printed on the receipt. */
  receiptDate: (date: Date) => string;
  /** A raw slider value, e.g. 4.5 -> "4,5" in Vietnamese. */
  decimal: (value: number) => string;
}

/**
 * Everything the UI says, in one locale.
 *
 * Stats and humour are functions rather than templates because the two
 * languages order their clauses differently — Vietnamese puts the time
 * expression after the verb, English before it — so a `{0} {1}` template
 * would force one language into the other's grammar.
 */
export interface Dict {
  locale: Locale;
  htmlLang: string;
  fmt: Fmt;

  meta: {
    title: string;
    description: string;
    tagline: string;
    calculateTitle: string;
    calculateDescription: string;
    resultsTitle: string;
    resultsDescription: string;
    keywords: string[];
  };

  landing: {
    headlineLead: string;
    headlineEm: string;
    sub: string;
    cta: string;
    ctaNote: string;
    reopen: string;
    tickerEyebrow: string;
    tickerNote: string;
    averageLife: { value: string; label: string }[];
    closingTitle: string;
    closingCta: string;
    sampleName: string;
  };

  calculator: {
    loading: string;
    startOver: string;
    billedSoFar: string;
    back: string;
    skip: string;
    continue: string;
    finish: string;
    ageEyebrow: string;
    ageQuestion: string;
    ageUnit: string;
    ageExact: string;
    ageControlName: string;
    aliveFor: (days: string) => string;
    exactSuffix: string;
    exactValue: (label: string) => string;
    thatIs: (duration: string) => string;
    skipped: string;
    zero: string;
    progressLabel: string;
  };

  receipt: {
    title: string;
    customer: string;
    namePlaceholder: string;
    nameField: string;
    anonymous: string;
    age: string;
    daysLived: string;
    issued: string;
    order: string;
    itemRate: string;
    lifeSpent: string;
    subtotal: string;
    everythingElse: string;
    overlapCredit: string;
    totalLifeUsed: string;
    years: string;
    mostExpensive: string;
    mostQuestionable: string;
    total: string;
    oneLife: string;
    noRefunds: string;
    finalStamp: string;
    thanks: string;
    emptyItems: string;
    moreItems: (n: number) => string;
    projectedAcrossOneLife: string;
  };

  reveal: {
    youAre: (age: number) => string;
    thatIsAbout: string;
    days: string;
    alreadySpent: string;
    ofThem: (gerund: string) => string;
    andThisIsWhere: string;
    skip: string;
  };

  results: {
    printing: string;
    srHeading: string;
    editAnswers: string;
    startOver: string;
    addActivities: string;
    statsEyebrow: string;
    statsTitle: string;
    quipsEyebrow: string;
    forecastEyebrow: string;
    forecastTitle: (age: number) => string;
    shareEyebrow: string;
    shareTitle: string;
    smallPrint: string;
    method1: (age: number) => string;
    method2: string;
    method3: string;
    missedSomething: string;
    changeAnswers: string;
    nothingToPrint: string;
    notBilledYet: string;
    notBilledBody: string;
  };

  forecast: {
    chooseActivity: string;
    alreadySpent: string;
    stillToSpend: string;
    behindYou: (pct: number) => string;
    toAge: (age: number) => string;
    lifetimeTotal: string;
    whatIfCut: string;
    minusOneHour: string;
    halveIt: string;
    zeroIt: string;
    reset: string;
    timeRefunded: string;
    additionalCharge: string;
    nothingYet: string;
    dragPrompt: string;
    backBefore: (age: number) => string;
    surrenderBefore: (age: number) => string;
    acrossNHabits: (n: number) => string;
    resetEverything: string;
    assumingYouLiveTo: string;
    lifeExpectancyLabel: string;
    changedMarker: string;
    adjust: (label: string) => string;
    barLabel: (pct: number, label: string) => string;
  };

  share: {
    tabReceipt: string;
    tabStatement: string;
    shareButton: string;
    download: string;
    copyLink: string;
    shared: string;
    saved: string;
    copied: string;
    linkCopied: string;
    failed: string;
    tabsLabel: string;
    dareEyebrow: string;
    dareTitle: string;
    sendToFriend: string;
    readyToPaste: string;
    dare: (duration: string, gerund: string) => string;
    dareFallback: string;
    /** The quote baked onto the receipt card. */
    punchline: (duration: string, gerund: string) => string;
    punchlineFallback: string;
    cardHeadlineLead: string;
    cardHeadlineEm: string;
    daysLived: string;
    daysLeft: string;
    noRefunds: string;
    excuseQuote: string;
    meanwhile: string;
    ofOneSingleLife: string;
    alreadyGone: string;
    stillToCome: string;
    findOutRest: string;
    ageLabel: (age: number) => string;
    yearUnit: string;
    yearsUnit: string;
    monthUnit: string;
    monthsUnit: string;
    beingBusy: string;
  };

  footer: {
    privacy: string;
  };

  notFound: {
    eyebrow: string;
    title: string;
    body: string;
    cta: string;
  };

  localeSwitch: {
    label: string;
  };

  activities: Record<
    ActivityId,
    { label: string; receiptLabel: string; question: string; hint: string }
  >;

  /** "hours a day" etc., shown beside the big slider value. */
  cadenceUnit: Record<Cadence, string>;
  /** "/day" etc., shown after a rate on the receipt. */
  cadenceShort: Record<Cadence, string>;
  /** Hour abbreviation used on the receipt rate column. */
  hourShort: string;

  /** Verb phrase per activity, e.g. social -> "scrolling" / "lướt mạng". */
  gerund: Record<string, string>;
  /** Fallback when a custom activity has no known gerund. */
  gerundOther: (label: string) => string;
  customFallbackLabel: string;

  stats: {
    future: (gerund: string, age: number) => string;
    outgrowsLife: (gerund: string) => string;
    lifetime: (gerund: string) => string;
    freeTime: string;
    screens: string;
    perYear: (gerund: string, days: string) => string;
    ratio: (gerund: string, against: string) => string;
    ratioVsExercise: string;
    ratioVsLoved: string;
    saturdays: (summers: string) => string;
    daysLeft: (age: number) => string;
    sleepLifetime: string;
    workLifetime: string;
    commuteLifetime: string;
    shareSoFar: (gerund: string) => string;
    exerciseTiny: (duration: string, gerund: string) => string;
  };

  /** Keyed by humour rule id. */
  humor: Record<string, string>;
  humorTopLine: (label: string, duration: string) => string;
  humorFallback: string;

  customItems: {
    activityName: string;
    hoursFor: (label: string) => string;
    thisActivity: string;
    perDay: string;
    perWeek: string;
    howOften: string;
    remove: (label: string) => string;
    addLineItem: string;
    maxReached: string;
    hoursControlName: string;
  };

  numberField: {
    decrease: (name: string) => string;
    increase: (name: string) => string;
  };
}
