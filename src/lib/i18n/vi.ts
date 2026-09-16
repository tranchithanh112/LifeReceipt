import { makeFmt } from "./format";
import type { Dict } from "./types";

/**
 * Vietnamese is the default locale.
 *
 * The humour is written fresh rather than translated — the English lines rely
 * on understatement that lands flat word-for-word, so each rule gets a joke
 * that works in Vietnamese instead of a faithful copy of one that doesn't.
 */
export const vi: Dict = {
  locale: "vi",
  htmlLang: "vi",
  fmt: makeFmt("vi"),

  meta: {
    title: "LifeReceipt — Đời bạn đi đâu mất rồi?",
    description:
      "Xem bạn đã dành bao nhiêu năm cuộc đời để ngủ, làm việc, lướt mạng, đi lại và mọi thứ khác.",
    tagline: "Đời bạn đi đâu mất rồi?",
    calculateTitle: "Tính đời tôi",
    calculateDescription:
      "Chín câu hỏi nhanh về một ngày bình thường của bạn. Mất 30 giây, không cần đăng ký, không gì rời khỏi máy bạn.",
    resultsTitle: "Hoá đơn đời tôi",
    resultsDescription:
      "Hoá đơn chi tiết cho một đời người: bạn đã tiêu bao nhiêu cho giấc ngủ, công việc, lướt mạng và phần còn lại — và nó sẽ tốn bao nhiêu tính đến năm 80 tuổi.",
    keywords: [
      "tính thời gian cuộc đời",
      "thời gian sử dụng điện thoại",
      "đời người bao nhiêu năm",
      "tôi dành bao nhiêu thời gian lướt mạng",
      "hoá đơn đời người",
      "LifeReceipt",
    ],
  },

  landing: {
    headlineLead: "Đời bạn đi đâu",
    headlineEm: "mất rồi?",
    sub: "Chín câu hỏi. Một hoá đơn rất khó chịu.",
    cta: "Tính đời tôi",
    ctaNote: "30 giây. Không đăng ký. Không gì rời khỏi máy bạn.",
    reopen: "Hoặc mở lại hoá đơn lần trước →",
    tickerEyebrow: "Trong một đời 80 năm trung bình, bạn sẽ dành",
    tickerNote:
      "Con số của bạn tệ hơn ở một chỗ rất cụ thể. Đó mới là phần đáng biết.",
    averageLife: [
      { value: "26 năm", label: "để ngủ" },
      { value: "13 năm", label: "đi làm" },
      { value: "9 năm", label: "nhìn màn hình" },
      { value: "4 năm", label: "để ăn" },
      { value: "1 năm", label: "đi lại" },
    ],
    closingTitle: "Bạn chỉ có một đời. Nó đang đi đâu?",
    sampleName: "Mẫu",
    closingCta: "In hoá đơn đời tôi",
  },

  calculator: {
    loading: "Đang tải câu trả lời của bạn…",
    startOver: "Làm lại",
    billedSoFar: "Đã tính đến giờ",
    back: "Câu trước",
    skip: "Bỏ qua",
    continue: "Tiếp tục",
    finish: "In hoá đơn",
    ageEyebrow: "Trước tiên",
    ageQuestion: "Bạn bao nhiêu tuổi?",
    ageUnit: "tuổi",
    ageExact: "Tuổi của bạn, giá trị chính xác",
    ageControlName: "tuổi",
    aliveFor: (days) => `Bạn đã sống được khoảng ${days} ngày.`,
    exactSuffix: "h",
    exactValue: (label) => `${label}, giá trị chính xác`,
    thatIs: (duration) => `Tức là ${duration} cuộc đời bạn cho tới giờ.`,
    skipped: "Đã bỏ qua — kéo thanh trượt để đưa nó lại vào hoá đơn.",
    zero: "Bằng không. Không có gì để tính.",
    progressLabel: "Tiến độ câu hỏi",
  },

  receipt: {
    title: "Hoá đơn đời người",
    customer: "Khách hàng",
    namePlaceholder: "THÊM TÊN BẠN",
    nameField: "Tên bạn trên hoá đơn",
    anonymous: "Ẩn danh",
    age: "Tuổi",
    daysLived: "Số ngày đã sống",
    issued: "Ngày in",
    order: "Mã đơn",
    itemRate: "Hạng mục / mức",
    lifeSpent: "Đời đã tiêu",
    subtotal: "Tạm tính",
    everythingElse: "Phần còn lại",
    overlapCredit: "Trừ trùng lặp",
    totalLifeUsed: "Tổng đời đã dùng",
    years: "năm",
    mostExpensive: "Khoản đắt nhất",
    mostQuestionable: "Khoản đáng ngờ nhất",
    total: "Tổng cộng",
    oneLife: "Một đời người.",
    noRefunds: "** KHÔNG HOÀN TRẢ **",
    finalStamp: "Chốt",
    thanks: "Cảm ơn vì thời gian của bạn",
    emptyItems: "Không có hạng mục nào. Một cuộc đời trống đáng ngờ.",
    moreItems: (n) => `+ ${n} hạng mục nữa`,
    projectedAcrossOneLife: "Dự phóng cho cả một đời",
  },

  reveal: {
    youAre: (age) => `Bạn ${age} tuổi.`,
    thatIsAbout: "Tức là khoảng",
    days: "ngày.",
    alreadySpent: "Bạn đã tiêu mất",
    ofThem: (gerund) => `để ${gerund}.`,
    andThisIsWhere: "Và đây là nơi nó đã đi.",
    skip: "Bỏ qua →",
  },

  results: {
    printing: "Đang in…",
    srHeading: "Hoá đơn đời bạn — những năm đã trôi đi, và những năm sắp trôi",
    editAnswers: "Sửa câu trả lời",
    startOver: "Làm lại",
    addActivities: "Thêm vài hoạt động",
    statsEyebrow: "Nếu không thay đổi gì",
    statsTitle: "Phần không ai nói với bạn",
    quipsEyebrow: "Ghi chú về chi tiêu của bạn",
    forecastEyebrow: "Khoản hoàn trả duy nhất",
    forecastTitle: (age) => `Nếu bạn cứ thế đến năm ${age} tuổi…`,
    shareEyebrow: "Biến nó thành vấn đề của mọi người",
    shareTitle: "Chia sẻ hoá đơn của bạn",
    smallPrint: "Những dòng chữ nhỏ",
    method1: (age) =>
      `Mỗi câu trả lời được quy về số giờ trung bình mỗi ngày, rồi nhân cho quãng đời bạn đã sống và kéo tiếp đến năm ${age} tuổi. Câu trả lời theo ngày làm việc được trải trên 5 ngày một tuần, theo tuần thì trải trên 7 ngày.`,
    method2:
      "Các hoạt động được phép chồng lên nhau — lướt mạng lúc đang đi đường được tính vào cả hai dòng, vì nó lấy của bạn cả hai lần. Vì vậy tổng các hạng mục có thể vượt quá số tuổi của bạn. Đây là hoá đơn, không phải bản kiểm toán.",
    method3:
      "Mọi thứ chạy ngay trong trình duyệt. Câu trả lời chỉ lưu trên máy này, và xoá ở dưới là mất hẳn.",
    missedSomething: "Thiếu gì đó?",
    changeAnswers: "Đổi câu trả lời",
    nothingToPrint: "Không có gì để in",
    notBilledYet: "Chúng tôi chưa tính tiền bạn.",
    notBilledBody:
      "Trả lời vài câu hỏi là hoá đơn của bạn in ra trong khoảng ba mươi giây.",
  },

  forecast: {
    chooseActivity: "Chọn một hoạt động",
    alreadySpent: "Đã tiêu",
    stillToSpend: "Còn phải tiêu",
    behindYou: (pct) => `${pct}% đã ở sau lưng`,
    toAge: (age) => `đến ${age} tuổi`,
    lifetimeTotal: "Tổng cả đời",
    whatIfCut: "Nếu cắt bớt thì sao?",
    minusOneHour: "−1h",
    halveIt: "Giảm nửa",
    zeroIt: "Về không",
    reset: "Đặt lại",
    timeRefunded: "Thời gian hoàn lại",
    additionalCharge: "Phụ thu thêm",
    nothingYet: "Chưa có gì",
    dragPrompt: "Kéo thanh trượt, hoặc bấm một nút ở trên.",
    backBefore: (age) => `được trả lại, trước khi bạn ${age} tuổi.`,
    surrenderBefore: (age) => `bạn sẽ mất thêm, trước khi ${age} tuổi.`,
    acrossNHabits: (n) => `từ ${n} thói quen đã đổi`,
    resetEverything: "Đặt lại tất cả",
    assumingYouLiveTo: "Giả sử bạn sống đến",
    lifeExpectancyLabel: "Tuổi thọ dự kiến",
    changedMarker: "đã đổi",
    adjust: (label) => `Điều chỉnh ${label}`,
    barLabel: (pct, label) =>
      `${pct}% tổng thời gian ${label.toLowerCase()} cả đời đã ở sau lưng bạn`,
  },

  share: {
    tabReceipt: "Hoá đơn",
    tabStatement: "Lời bào chữa",
    shareButton: "Chia sẻ hoá đơn",
    download: "Tải về",
    copyLink: "Sao chép link",
    shared: "Đã chia sẻ.",
    saved: "Đã lưu vào máy.",
    copied: "Đã sao chép.",
    linkCopied: "Đã sao chép link.",
    failed: "Không dựng được ảnh — chụp màn hình cũng được vậy.",
    tabsLabel: "Kiểu ảnh chia sẻ",
    dareEyebrow: "Nghĩ con số của bạn đã tệ?",
    dareTitle: "Xem của ai tệ hơn.",
    sendToFriend: "Gửi cho một người bạn",
    readyToPaste: "Sẵn sàng để dán",
    dare: (duration, gerund) =>
      `Tôi vừa biết mình sẽ dành ${duration} cuộc đời để ${gerund} 💀\nĐến lượt bạn.`,
    dareFallback: "Tôi vừa biết cả đời mình đang đi đâu 💀\nĐến lượt bạn.",
    punchline: (duration, gerund) =>
      `Hoá ra tôi sẽ dành ${duration} cuộc đời để ${gerund}.`,
    punchlineFallback: "Hoá ra tôi chẳng biết đời mình đi đâu.",
    cardHeadlineLead: "Đời tôi đi đâu",
    cardHeadlineEm: "mất rồi?",
    daysLived: "Ngày đã sống",
    daysLeft: "Ngày còn lại",
    noRefunds: "Không hoàn trả",
    excuseQuote: "“Tôi không\ncó thời gian.”",
    meanwhile: "Trong khi đó",
    ofOneSingleLife: "của một đời người",
    alreadyGone: "Đã trôi qua",
    stillToCome: "Còn sắp tới",
    findOutRest: "Xem phần đời còn lại của bạn đang đi đâu.",
    ageLabel: (age) => `${age} tuổi`,
    yearUnit: "năm",
    yearsUnit: "năm",
    monthUnit: "tháng",
    monthsUnit: "tháng",
    beingBusy: "Bận rộn",
  },

  footer: {
    privacy:
      "Câu trả lời của bạn nằm lại trên máy bạn. Không tải lên, không lưu trữ, không bán.",
  },

  notFound: {
    eyebrow: "Vô hiệu · không có giao dịch này",
    title: "Trang này chưa từng được in.",
    body: "Trang bạn tìm không tồn tại. Còn đời bạn thì tiếc thay vẫn đang bị tiêu ở đâu đó.",
    cta: "Quay lại LifeReceipt",
  },

  localeSwitch: { label: "Ngôn ngữ" },

  activities: {
    sleep: {
      label: "Ngủ",
      receiptLabel: "Ngủ",
      question: "Mỗi ngày bạn ngủ bao nhiêu tiếng?",
      hint: "Khai thật, đừng khai ước mơ.",
    },
    work: {
      label: "Làm việc / học",
      receiptLabel: "Làm việc",
      question: "Một ngày đi làm, bạn làm việc hoặc học bao nhiêu tiếng?",
      hint: "Tính trên 5 ngày một tuần.",
    },
    social: {
      label: "Mạng xã hội",
      receiptLabel: "Lướt mạng",
      question: "Mỗi ngày bạn lướt mạng bao nhiêu tiếng?",
      hint: "TikTok · Instagram · Facebook · X · Threads · Shorts",
    },
    streaming: {
      label: "Xem video",
      receiptLabel: "Xem video",
      question: "Mỗi ngày bạn xem Netflix / YouTube / TV bao nhiêu tiếng?",
      hint: "Mở làm nền cũng tính.",
    },
    gaming: {
      label: "Chơi game",
      receiptLabel: "Game",
      question: "Mỗi ngày bạn chơi game bao nhiêu tiếng?",
      hint: "Tính trung bình — cày cuối tuần tính luôn.",
    },
    commute: {
      label: "Đi lại",
      receiptLabel: "Đi lại",
      question: "Mỗi ngày bạn mất bao lâu để đi lại?",
      hint: "Cả đi lẫn về, tính ngày đi làm.",
    },
    exercise: {
      label: "Thể dục",
      receiptLabel: "Thể dục",
      question: "Mỗi tuần bạn tập thể dục bao nhiêu tiếng?",
      hint: "Đi bộ ra tủ lạnh không tính là cardio.",
    },
    loved: {
      label: "Người thân",
      receiptLabel: "Người thân",
      question:
        "Mỗi ngày bạn dành bao nhiêu thời gian thật sự cho người mình thương?",
      hint: "Bỏ điện thoại xuống, có mặt thật sự.",
    },
  },

  cadenceUnit: {
    daily: "tiếng mỗi ngày",
    weekday: "tiếng mỗi ngày làm việc",
    weekly: "tiếng mỗi tuần",
  },
  cadenceShort: { daily: "/ngày", weekday: "/ngày làm", weekly: "/tuần" },
  hourShort: "h",

  gerund: {
    sleep: "ngủ",
    work: "làm việc",
    social: "lướt mạng",
    streaming: "xem video",
    gaming: "chơi game",
    commute: "đi lại",
    exercise: "tập thể dục",
    loved: "ở bên người mình thương",
  },
  gerundOther: (label) => label.toLowerCase(),
  customFallbackLabel: "Khác",

  stats: {
    future: (gerund, age) =>
      `${gerund} nữa từ giờ đến năm ${age} tuổi, nếu không thay đổi gì.`,
    outgrowsLife: (gerund) => `${gerund} — nhiều hơn cả quãng đời bạn đã sống.`,
    lifetime: (gerund) => `là cái giá của việc ${gerund} trong cả một đời.`,
    freeTime:
      "thời gian thật sự tự do còn lại, sau khi ngủ, làm việc và đi lại đã lấy phần của chúng.",
    screens: "của đời bạn sẽ diễn ra sau một tấm kính.",
    perYear: (gerund, days) =>
      `mỗi năm để ${gerund} — ${days} ngày trọn vẹn, năm nào cũng vậy.`,
    ratio: (gerund, against) =>
      `thời gian bạn dành để ${gerund} nhiều hơn ${against}.`,
    ratioVsExercise: "tập thể dục",
    ratioVsLoved: "ở bên người mình thương",
    saturdays: (summers) =>
      `ngày thứ Bảy còn lại. Và ${summers} mùa hè nữa. Đó là tất cả những gì bạn có.`,
    daysLeft: (age) =>
      `ngày còn lại trước khi bạn ${age} tuổi. Đó là toàn bộ ngân sách.`,
    sleepLifetime:
      "để ngủ tính đến cuối đời. Khoản mua lớn nhất mà bạn sẽ không nhớ nổi.",
    workLifetime: "của đời bạn giao cho công việc. Mong là bạn thích nó.",
    commuteLifetime: "ngồi trên đường. Không đi đâu thú vị cả. Chỉ là đi lại.",
    shareSoFar: (gerund) =>
      `của mỗi năm bạn từng sống đã trôi vào việc ${gerund}.`,
    exerciseTiny: (duration, gerund) =>
      `tập thể dục trong cả một đời, so với ${duration} để ${gerund}.`,
  },

  humor: {
    "scroll-heavy":
      "Bạn bảo không có thời gian. Mục “Thời gian sử dụng” muốn nói chuyện.",
    "scroll-vs-exercise": "Ngón cái đang là cơ bắp khoẻ nhất trên người bạn.",
    "scroll-vs-loved": "Điện thoại được bạn nhìn vào nhiều hơn người thân.",
    "scroll-moderate":
      "Một thói quen lướt mạng có kiềm chế. Vẫn tính bằng năm, nhưng có kiềm chế.",
    "scroll-none":
      "Gần như không lướt mạng. Hoặc là đáng nể, hoặc là điện thoại hỏng.",
    "sleep-low": "Hoá ra ngủ chỉ là tuỳ chọn.",
    "sleep-low-work-high":
      "Ngủ ít đi để làm được nhiều hơn. Một chiến lược hoàn hảo, chưa từng thất bại.",
    "sleep-high": "Một sự tận tâm đáng nể với lối sống nằm ngang.",
    "work-heavy": "Công ty bạn chiếm một dòng rất to trong hoá đơn này.",
    "work-none": "Không có dòng công việc. Nghỉ hưu, giàu sẵn, hoặc rất lạc quan.",
    "commute-heavy": "Nhà thứ hai của bạn hình như là ở trên đường.",
    "commute-zero": "Không mất phút nào đi lại. Ai đó đã ra một quyết định rất đúng.",
    "gaming-heavy": "Ít ra thì thư viện game của bạn cũng đáng đồng tiền.",
    "gaming-moderate": "Game: có mặt, được ghi nhận, và âm thầm tốn kém.",
    "streaming-heavy":
      "Netflix không phải là tính cách, nhưng giờ nó là một dòng trong hoá đơn của bạn.",
    "streaming-vs-scroll": "Bạn không còn xem gì nữa. Bạn chỉ lướt qua chúng.",
    "exercise-strong": "Phát hiện hành vi có trách nhiệm một cách đáng ngờ.",
    "exercise-token":
      "Chưa tới một tiếng tập mỗi tuần. Về mặt kỹ thuật thì vẫn khác không.",
    "exercise-zero": "Thể dục: miễn phí. Vì chẳng mua gì cả.",
    "screens-huge": "Hơn một phần ba quãng đời thức của bạn diễn ra sau tấm kính.",
    "screens-vs-sleep": "Bạn nhìn màn hình nhiều hơn cả ngủ. Bạo đấy.",
    "loved-strong":
      "Ai được bạn dành thời gian này thì thật may. Đây là dòng duy nhất không ai hối tiếc.",
    "loved-thin":
      "Chưa tới nửa tiếng mỗi ngày cho người mình thương. Ghi nhận, không bình luận.",
    overflow:
      "Một ngày của bạn có hơn 24 tiếng. Hoặc là đa nhiệm phi thường, hoặc là kế toán sáng tạo.",
    "young-scroller":
      "Bạn chưa sống được bao lâu, mà một phần đáng kể trong đó là video dọc.",
    "older-scroller":
      "Bạn không sống qua ngần ấy năm để rồi dành từng này thời gian cho một cái feed.",
  },
  humorTopLine: (label, duration) =>
    `${label} là khoản chi lớn nhất của bạn với ${duration}, và nó chỉ đang tăng lên.`,
  humorFallback: "Một đời người. Tiêu đúng như ghi ở trên.",

  customItems: {
    activityName: "Tên hoạt động",
    hoursFor: (label) => `Số giờ cho ${label}`,
    thisActivity: "hoạt động này",
    perDay: "/ngày",
    perWeek: "/tuần",
    howOften: "Tần suất",
    remove: (label) => `Xoá ${label}`,
    addLineItem: "Thêm một hạng mục",
    maxReached:
      "Sáu hạng mục tự thêm là đủ rồi. Hoá đơn còn phải vừa màn hình điện thoại.",
    hoursControlName: "số giờ",
  },

  numberField: {
    decrease: (name) => `Giảm ${name}`,
    increase: (name) => `Tăng ${name}`,
  },
};
