// قسم الدعوة — Islamic Dawah (outreach / invitation to Islam) library
// Structured, authentic content for inviting others to Islam and strengthening understanding.

export interface DawahItem {
  id: string;
  title: string;
  titleEn: string;
  body: string;
  bodyEn: string;
  ref?: string; // Quran/Hadith reference if applicable
}

export interface DawahSection {
  id: string;
  icon: string;
  title: string;
  titleEn: string;
  intro: string;
  introEn: string;
  items: DawahItem[];
}

export const DAWAH_SECTIONS: DawahSection[] = [
  {
    id: "intro",
    icon: "☪",
    title: "من هو الله؟ ومن هو محمد ﷺ؟",
    titleEn: "Who is Allah? Who is Muhammad ﷺ?",
    intro: "مدخل مبسّط لفهم جوهر الإسلام لمن يسأل عنه لأول مرة.",
    introEn: "A simple introduction to the essence of Islam for first-time inquirers.",
    items: [
      {
        id: "i1",
        title: "ما هو الإسلام؟",
        titleEn: "What is Islam?",
        body: "الإسلام هو الاستسلام الكامل لله الواحد الأحد، وعبادته وحده دون شريك، واتباع ما أرسل به رسله من هدى. وهو امتداد لرسالة التوحيد التي جاء بها جميع الأنبياء من آدم إلى محمد عليهم الصلاة والسلام.",
        bodyEn: "Islam means complete submission to the One God, worshipping Him alone without partners, and following the guidance sent through His messengers. It is the continuation of the same message of monotheism brought by every prophet from Adam to Muhammad ﷺ.",
        ref: "إن الدين عند الله الإسلام — آل عمران: ١٩",
      },
      {
        id: "i2",
        title: "من هو الله سبحانه؟",
        titleEn: "Who is Allah?",
        body: "الله هو الخالق الواحد الأحد، الذي لا شريك له ولا ولد ولا والد، المتصف بكل كمال، المنزّه عن كل نقص. خلق الكون كله ويدبّر أمره، وهو قريب يسمع ويجيب دعاء من دعاه.",
        bodyEn: "Allah is the One and Only Creator, with no partner, no child, and no parent — perfect in every attribute, free of any flaw. He created and sustains the entire universe, and He is near, hearing and answering the call of whoever calls upon Him.",
        ref: "قل هو الله أحد، الله الصمد، لم يلد ولم يولد، ولم يكن له كفواً أحد — الإخلاص",
      },
      {
        id: "i3",
        title: "من هو محمد ﷺ؟",
        titleEn: "Who is Muhammad ﷺ?",
        body: "محمد بن عبدالله ﷺ هو خاتم الأنبياء والمرسلين، وُلد في مكة، واختاره الله ليبلغ الناس كافة برسالة الإسلام الخالدة. عاش حياته بالصدق والأمانة والرحمة حتى بشهادة أعدائه، وتوفي بعد أن أتم تبليغ الرسالة كاملة.",
        bodyEn: "Muhammad ibn Abdullah ﷺ is the final prophet and messenger, born in Makkah, chosen by Allah to deliver the eternal message of Islam to all of humanity. He lived a life of truthfulness, trustworthiness, and mercy — acknowledged even by his opponents — and passed away only after completing the message in full.",
        ref: "وما أرسلناك إلا رحمة للعالمين — الأنبياء: ١٠٧",
      },
      {
        id: "i4",
        title: "لماذا نحتاج إلى دين؟",
        titleEn: "Why do we need religion?",
        body: "خُلق الإنسان بفطرة تبحث عن معنى ومصدر لهذا الوجود. الدين الحق يجيب عن أسئلة الحياة الكبرى: من أين أتيت؟ ولماذا أنا هنا؟ وإلى أين المصير؟ ويمنح الحياة هدفاً وغاية واضحة، ويضع للإنسان ميزاناً أخلاقياً ثابتاً لا يتغير بتغيّر الأهواء.",
        bodyEn: "Humans are created with an innate nature (fitrah) that seeks meaning and a source for existence. True religion answers life's biggest questions: where did I come from, why am I here, and where am I headed — giving life clear purpose and a fixed moral compass that doesn't shift with passing trends.",
      },
    ],
  },
  {
    id: "pillars-islam",
    icon: "🕌",
    title: "أركان الإسلام الخمسة",
    titleEn: "The Five Pillars of Islam",
    intro: "الأعمال الظاهرة التي يقوم عليها بنيان الإسلام.",
    introEn: "The outward acts upon which the structure of Islam is built.",
    items: [
      {
        id: "p1",
        title: "١. الشهادتان",
        titleEn: "1. The Two Testimonies",
        body: "أن تشهد أن لا إله إلا الله وحده لا شريك له، وأن محمداً عبده ورسوله. وهذه هي بوابة الدخول في الإسلام، وأساس كل عمل بعدها.",
        bodyEn: "To testify that there is no deity worthy of worship except Allah alone, and that Muhammad is His servant and messenger. This is the gateway into Islam and the foundation of every act that follows.",
      },
      {
        id: "p2",
        title: "٢. الصلاة",
        titleEn: "2. Prayer (Salah)",
        body: "خمس صلوات يومية في أوقات محددة، تصل العبد بربه مباشرة دون وسيط، وتذكّره بخالقه على مدار يومه، وتغرس فيه الانضباط والطمأنينة.",
        bodyEn: "Five daily prayers at fixed times, connecting the worshipper directly with their Creator without any intermediary, reminding them of Allah throughout the day, and instilling discipline and inner peace.",
      },
      {
        id: "p3",
        title: "٣. الزكاة",
        titleEn: "3. Zakah (Almsgiving)",
        body: "إخراج نسبة محددة (٢.٥٪ غالباً) من المال الذي بلغ النصاب وحال عليه الحول، تُعطى للفقراء والمحتاجين، تطهيراً للمال وتكافلاً بين أفراد المجتمع.",
        bodyEn: "Giving a fixed percentage (typically 2.5%) of one's savings annually to the poor and needy — purifying one's wealth and building solidarity within society.",
      },
      {
        id: "p4",
        title: "٤. صوم رمضان",
        titleEn: "4. Fasting Ramadan",
        body: "الامتناع عن الطعام والشراب وسائر المفطرات من طلوع الفجر إلى غروب الشمس طوال شهر رمضان، تدريباً على تقوى الله وضبط النفس والشعور بحال المحتاجين.",
        bodyEn: "Abstaining from food, drink, and other things that break the fast from dawn until sunset throughout the month of Ramadan — training in God-consciousness, self-discipline, and empathy for those in need.",
      },
      {
        id: "p5",
        title: "٥. حج البيت",
        titleEn: "5. Hajj (Pilgrimage)",
        body: "زيارة بيت الله الحرام في مكة المكرمة لأداء مناسك الحج مرة واحدة في العمر، لمن استطاع إليه سبيلاً مادياً وبدنياً، وهو تجمّع إيماني عالمي يجسّد وحدة المسلمين.",
        bodyEn: "A once-in-a-lifetime pilgrimage to the Sacred House in Makkah, obligatory for those physically and financially able — a global gathering of faith that embodies the unity of Muslims from every nation.",
      },
    ],
  },
  {
    id: "pillars-faith",
    icon: "✦",
    title: "أركان الإيمان الستة",
    titleEn: "The Six Pillars of Faith",
    intro: "العقائد الباطنة التي يقوم عليها إيمان المسلم القلبي.",
    introEn: "The inward beliefs that form the core of a Muslim's faith.",
    items: [
      { id: "f1", title: "الإيمان بالله", titleEn: "Belief in Allah", body: "توحيده في ربوبيته وألوهيته وأسمائه وصفاته، وأنه وحده المستحق للعبادة.", bodyEn: "Affirming His oneness in lordship, worship, names, and attributes — He alone deserves worship." },
      { id: "f2", title: "الإيمان بالملائكة", titleEn: "Belief in Angels", body: "مخلوقات نورانية لا تعصي الله، تقوم بمهام محددة كحَمَلة الوحي وتدبير الكون.", bodyEn: "Beings of light created to never disobey Allah, assigned duties such as delivering revelation and managing affairs of creation." },
      { id: "f3", title: "الإيمان بالكتب", titleEn: "Belief in Scriptures", body: "كل الكتب السماوية التي أُنزلت على الأنبياء، وآخرها وأتمها القرآن الكريم المحفوظ من التحريف.", bodyEn: "All scriptures revealed to the prophets, the final and complete of which is the Quran, preserved unaltered." },
      { id: "f4", title: "الإيمان بالرسل", titleEn: "Belief in Messengers", body: "جميع الأنبياء والرسل الذين أرسلهم الله لهداية البشر، بلا تفريق بينهم في أصل الرسالة.", bodyEn: "All prophets and messengers sent by Allah to guide humanity, without discrimination among them in the core message they carried." },
      { id: "f5", title: "الإيمان باليوم الآخر", titleEn: "Belief in the Last Day", body: "البعث بعد الموت والحساب والجزاء، إما بجنة خالدة أو عقاب عادل، وهو ما يمنح الحياة معنى المسؤولية.", bodyEn: "Resurrection after death, judgment, and recompense — eternal paradise or just punishment — giving life its sense of accountability." },
      { id: "f6", title: "الإيمان بالقدر", titleEn: "Belief in Divine Decree", body: "أن كل ما يحدث بعلم الله وتقديره، خيره وشره، مع إثبات اختيار الإنسان ومسؤوليته عن أفعاله.", bodyEn: "That everything occurs by Allah's knowledge and decree, good and bad, while affirming human free will and accountability for one's actions." },
    ],
  },
  {
    id: "shahada",
    icon: "🤲",
    title: "كيف تدخل الإسلام؟",
    titleEn: "How to Enter Islam",
    intro: "الدخول في الإسلام بسيط ومباشر، بلا وسيط ولا طقوس معقدة.",
    introEn: "Entering Islam is simple and direct, with no intermediary or complex rituals.",
    items: [
      {
        id: "s1",
        title: "النطق بالشهادتين",
        titleEn: "Pronouncing the Testimony of Faith",
        body: "كل ما يلزم هو أن تنطق بيقين وصدق: «أشهد أن لا إله إلا الله، وأشهد أن محمداً رسول الله». بمجرد قولها بإيمان، يصبح الشخص مسلماً، وتُغفر جميع ذنوبه السابقة.",
        bodyEn: "All that is required is to sincerely declare: 'I testify that there is no deity but Allah, and I testify that Muhammad is the Messenger of Allah.' The moment this is said with conviction, the person becomes a Muslim, and all their past sins are forgiven.",
        ref: "الإسلام يهدم ما كان قبله — رواه مسلم",
      },
      {
        id: "s2",
        title: "لا حاجة لوسيط أو مراسم",
        titleEn: "No Need for an Intermediary or Ceremony",
        body: "ليس في الإسلام كهنوت ولا حاجة لموافقة أحد؛ يمكن أن يحدث ذلك بينك وبين الله مباشرة في أي مكان وزمان، وإن كان حضور شهود أو إخبار مركز إسلامي يساعد على التوجيه والدعم لاحقاً.",
        bodyEn: "There is no clergy in Islam and no need for anyone's approval; it can happen directly between you and Allah, anywhere, anytime — though having witnesses or informing a local Islamic center can help with guidance and support afterward.",
      },
      {
        id: "s3",
        title: "الخطوات التالية",
        titleEn: "Next Steps",
        body: "تعلّم الوضوء وكيفية الصلاة تدريجياً، وابدأ بتلاوة القرآن ولو آيات يسيرة يومياً، وتواصل مع مجتمع مسلم قريب منك للدعم والتعلّم المستمر.",
        bodyEn: "Learn ablution and how to pray gradually, begin reciting even a few verses of the Quran daily, and connect with a nearby Muslim community for ongoing support and learning.",
      },
    ],
  },
  {
    id: "faq",
    icon: "❓",
    title: "أسئلة شائعة",
    titleEn: "Frequently Asked Questions",
    intro: "إجابات موجزة على أكثر الأسئلة التي يطرحها غير المسلمين.",
    introEn: "Brief answers to the most common questions non-Muslims ask.",
    items: [
      {
        id: "q1",
        title: "هل الإسلام دين عنف؟",
        titleEn: "Is Islam a violent religion?",
        body: "لا. كلمة «إسلام» مشتقة من «السلام»، والقرآن يحرّم قتل النفس البريئة ويعتبره كقتل الناس جميعاً. العنف المرتكب باسم الدين من قبل أفراد يخالف تعاليم الإسلام الصريحة ولا يمثّله.",
        bodyEn: "No. The word 'Islam' is derived from 'peace,' and the Quran forbids killing an innocent soul, equating it to killing all of humanity. Violence committed by individuals in the name of religion contradicts Islam's explicit teachings and does not represent it.",
        ref: "من قتل نفساً بغير نفس... فكأنما قتل الناس جميعاً — المائدة: ٣٢",
      },
      {
        id: "q2",
        title: "ما مكانة المرأة في الإسلام؟",
        titleEn: "What is the status of women in Islam?",
        body: "كرّم الإسلام المرأة وأعطاها حقوقاً كاملة في التملك والميراث والتعليم والعمل والرأي، قبل أن تعرف كثير من الحضارات هذه الحقوق بقرون، واعتبرها شقيقة الرجل في التكليف والمسؤولية.",
        bodyEn: "Islam honored women with full rights to ownership, inheritance, education, work, and opinion centuries before many civilizations recognized such rights, considering her man's equal partner in religious duty and responsibility.",
      },
      {
        id: "q3",
        title: "لماذا تحجب المرأة المسلمة شعرها؟",
        titleEn: "Why does a Muslim woman cover her hair?",
        body: "الحجاب شعيرة من شعائر العفة، تمنح المرأة كرامة واحتراماً وتحررها من النظرة التي تختزلها في مظهرها، وهو اختيار يمارسه الملايين من النساء المسلمات بقناعة واعتزاز.",
        bodyEn: "The hijab is an act of modesty that grants a woman dignity and respect, freeing her from being reduced to her physical appearance — a choice practiced by millions of Muslim women with conviction and pride.",
      },
      {
        id: "q4",
        title: "لماذا يصلي المسلمون خمس مرات؟",
        titleEn: "Why do Muslims pray five times a day?",
        body: "الصلوات الخمس تذكّر المسلم بربه على مدار يومه، وتمنحه فرصاً متكررة للتوقف والتأمل والتواصل الروحي، وتنظّم وقته وتربّيه على الانضباط.",
        bodyEn: "The five daily prayers remind a Muslim of their Creator throughout the day, offering repeated opportunities to pause, reflect, and connect spiritually, while structuring time and building discipline.",
      },
      {
        id: "q5",
        title: "هل يؤمن المسلمون بعيسى عليه السلام؟",
        titleEn: "Do Muslims believe in Jesus?",
        body: "نعم، يؤمن المسلمون بعيسى بن مريم عليه السلام نبياً ورسولاً كريماً، وُلد بمعجزة من غير أب، وأيّده الله بمعجزات عظيمة، لكنهم لا يعتقدون بألوهيته، بل يوحّدون الله وحده.",
        bodyEn: "Yes, Muslims believe in Jesus, son of Mary, as a noble prophet and messenger, born miraculously without a father and supported by Allah with great miracles — though Muslims do not believe in his divinity, affirming Allah's oneness alone.",
      },
      {
        id: "q6",
        title: "ماذا عن الطعام الحلال؟",
        titleEn: "What about halal food?",
        body: "الحلال هو ما أباحه الله من الطعام والشراب، ويُحرَّم الخنزير والميتة والدم والمسكرات. والذبح الشرعي يراعي رحمة الحيوان وطهارة اللحم الناتج.",
        bodyEn: "Halal refers to what Allah has permitted in food and drink; pork, carrion, blood, and intoxicants are forbidden. Islamic slaughter emphasizes mercy toward the animal and the purity of the resulting meat.",
      },
    ],
  },
  {
    id: "wisdom",
    icon: "💬",
    title: "آداب الدعوة إلى الله",
    titleEn: "Etiquette of Inviting Others to Islam",
    intro: "كيف تدعو إلى الله بالحكمة والرفق كما أمر القرآن.",
    introEn: "How to invite others to Allah with wisdom and gentleness as the Quran instructs.",
    items: [
      {
        id: "w1",
        title: "الحكمة والموعظة الحسنة",
        titleEn: "Wisdom and Good Admonition",
        body: "أمر الله نبيه بالدعوة بالحكمة والكلمة الطيبة، لا بالإلزام أو التشديد. اختر الكلمة المناسبة للمستمع، وراعِ حاله وثقافته وأسئلته الحقيقية.",
        bodyEn: "Allah commanded His prophet to invite with wisdom and good words, not coercion or harshness. Choose words that fit the listener, and consider their circumstances, culture, and genuine questions.",
        ref: "ادعُ إلى سبيل ربك بالحكمة والموعظة الحسنة — النحل: ١٢٥",
      },
      {
        id: "w2",
        title: "لا إكراه في الدين",
        titleEn: "No Compulsion in Religion",
        body: "الإسلام يرفض الإكراه على الدخول في الدين؛ فالإيمان قرار حر ينبع من القناعة القلبية، ودور الداعية هو التبليغ والتوضيح، لا الإلزام.",
        bodyEn: "Islam rejects forcing anyone into the religion; faith is a free decision rooted in inner conviction. The role of one inviting to Islam is to convey and clarify, not to compel.",
        ref: "لا إكراه في الدين قد تبين الرشد من الغي — البقرة: ٢٥٦",
      },
      {
        id: "w3",
        title: "القدوة قبل الكلمة",
        titleEn: "Example Before Words",
        body: "أقوى وسائل الدعوة هي السلوك الحسن والأخلاق الصادقة، فكثير ممن دخلوا الإسلام تأثروا بأخلاق المسلمين قبل أن يسمعوا كلمة واحدة من التعاليم.",
        bodyEn: "The strongest means of invitation is good conduct and sincere character — many who embraced Islam were moved by the character of Muslims before hearing a single word of its teachings.",
      },
      {
        id: "w4",
        title: "الصبر وعدم استعجال النتيجة",
        titleEn: "Patience Without Rushing Results",
        body: "الهداية بيد الله وحده، ودور الداعية هو البلاغ المبين فحسب، فلا يحزن إن لم يستجب من يدعوه، ولا يستعجل، بل يزرع ويترك الثمر لله.",
        bodyEn: "Guidance belongs to Allah alone; the inviter's role is simply clear conveyance. Don't despair if someone doesn't respond, and don't rush — plant the seed and leave the harvest to Allah.",
        ref: "فإنما عليك البلاغ وعلينا الحساب — الرعد: ٤٠",
      },
    ],
  },
  {
    id: "share",
    icon: "📤",
    title: "رسائل دعوية جاهزة للمشاركة",
    titleEn: "Ready-to-Share Dawah Messages",
    intro: "رسائل مختصرة يمكنك مشاركتها مع من تحب لتعريفه بالإسلام.",
    introEn: "Short messages you can share with loved ones to introduce them to Islam.",
    items: [
      {
        id: "m1",
        title: "عن معنى الحياة",
        titleEn: "On the Meaning of Life",
        body: "هل تساءلت يوماً: لماذا أنا هنا؟ الإسلام يقدّم إجابة واضحة تمنح الحياة هدفاً حقيقياً — خُلقنا لعبادة الله وحده، وهو ما يملأ القلب بالطمأنينة.",
        bodyEn: "Have you ever wondered: why am I here? Islam offers a clear answer that gives life real purpose — we were created to worship the One God alone, which fills the heart with peace.",
      },
      {
        id: "m2",
        title: "عن القرآن الكريم",
        titleEn: "On the Quran",
        body: "القرآن الكريم كتاب محفوظ بالكامل منذ أكثر من ١٤٠٠ عام دون أي تغيير، يتحدى العقل والعلم، ويهدي القلب. أدعوك لقراءة ترجمة معانيه ولو لمرة واحدة.",
        bodyEn: "The Quran has been perfectly preserved for over 1400 years without a single change, challenging both reason and science while guiding the heart. I invite you to read a translation of its meanings, even just once.",
      },
      {
        id: "m3",
        title: "دعوة شخصية",
        titleEn: "A Personal Invitation",
        body: "أحبك في الله، وأتمنى لك ما أتمناه لنفسي من هداية وسعادة في الدنيا والآخرة. إن كان لديك أي سؤال عن الإسلام مهما كان، أنا هنا للإجابة بكل احترام ومحبة.",
        bodyEn: "I care about you, and I wish for you what I wish for myself — guidance and happiness in this life and the next. If you have any question about Islam, I'm here to answer with respect and love.",
      },
    ],
  },
];

export function getAllDawahSections(): DawahSection[] {
  return DAWAH_SECTIONS;
}
