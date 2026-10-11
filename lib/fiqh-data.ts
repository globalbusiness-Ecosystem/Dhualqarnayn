// A concise, categorized library of Islamic jurisprudence (fiqh) rulings —
// worship acts, transactions, food, and everyday matters — summarized from
// mainstream scholarly consensus. Educational use; not a substitute for a
// qualified local scholar for personal rulings (fatwas).

export interface FiqhCategory {
  id: string;
  nameAr: string;
  nameEn: string;
  icon: string; // single glyph used in a colored dot/badge, not emoji
}

export interface FiqhEntry {
  id: string;
  categoryId: string;
  questionAr: string;
  questionEn: string;
  rulingAr: string;
  rulingEn: string;
  detailAr: string;
  detailEn: string;
  sourceAr: string;
  sourceEn: string;
}

export const FIQH_CATEGORIES: FiqhCategory[] = [
  { id: "purity", nameAr: "الطهارة", nameEn: "Purification", icon: "w" },
  { id: "prayer", nameAr: "الصلاة", nameEn: "Prayer", icon: "p" },
  { id: "zakat", nameAr: "الزكاة والصدقة", nameEn: "Zakat & Charity", icon: "z" },
  { id: "fasting", nameAr: "الصيام", nameEn: "Fasting", icon: "f" },
  { id: "hajj", nameAr: "الحج والعمرة", nameEn: "Hajj & Umrah", icon: "h" },
  { id: "food", nameAr: "المأكل والمشرب", nameEn: "Food & Drink", icon: "m" },
  { id: "transactions", nameAr: "المعاملات والمال", nameEn: "Transactions & Money", icon: "t" },
  { id: "family", nameAr: "الأسرة والزواج", nameEn: "Family & Marriage", icon: "a" },
  { id: "dress", nameAr: "اللباس والزينة", nameEn: "Dress & Appearance", icon: "d" },
  { id: "conduct", nameAr: "الأخلاق والمعاملات اليومية", nameEn: "Everyday Conduct", icon: "k" },
];

export const FIQH_DATA: FiqhEntry[] = [
  // ===== Purification =====
  {
    id: "p1", categoryId: "purity",
    questionAr: "ما هي شروط صحة الوضوء؟",
    questionEn: "What are the conditions for a valid ablution (wudu)?",
    rulingAr: "واجب قبل الصلاة", rulingEn: "Required before prayer",
    detailAr: "يشترط لصحة الوضوء: النية، استعمال ماء طاهر، غسل الأعضاء الأربعة (الوجه، اليدين إلى المرفقين، مسح الرأس، الرجلين إلى الكعبين) بالترتيب والموالاة، وإزالة ما يمنع وصول الماء إلى البشرة كطلاء الأظافر العازل أو الشمع.",
    detailEn: "Valid wudu requires: intention, pure water, washing the four parts (face, forearms to elbows, wiping the head, feet to ankles) in order without long pauses, and removing anything that blocks water from reaching the skin, like sealant nail polish or wax.",
    sourceAr: "سورة المائدة: ٦", sourceEn: "Surah Al-Ma'idah 5:6",
  },
  {
    id: "p2", categoryId: "purity",
    questionAr: "هل يجوز التيمم عند عدم وجود الماء؟",
    questionEn: "Is dry ablution (tayammum) allowed when water is unavailable?",
    rulingAr: "جائز", rulingEn: "Permissible",
    detailAr: "يجوز التيمم بالتراب الطاهر عند عدم وجود الماء، أو عند المرض الذي يضر استعمال الماء فيه، أو شدة البرد مع خوف الضرر. يكون بضرب اليدين على التراب ومسح الوجه والكفين.",
    detailEn: "Dry ablution with clean soil/dust is permitted when water is unavailable, when illness makes water harmful, or in extreme cold with fear of harm. It involves striking the hands on clean earth and wiping the face and hands.",
    sourceAr: "سورة النساء: ٤٣", sourceEn: "Surah An-Nisa 4:43",
  },
  {
    id: "p3", categoryId: "purity",
    questionAr: "ما نواقض الوضوء؟",
    questionEn: "What invalidates wudu?",
    rulingAr: "ينقض بعدة أمور", rulingEn: "Several things break it",
    detailAr: "ينقض الوضوء: خروج البول أو الغائط أو الريح، النوم العميق المستغرق، زوال العقل بسكر أو مرض، ولمس القبل أو الدبر بلا حاجز عند أكثر العلماء، وخروج المذي والمني.",
    detailEn: "Wudu is nullified by: urination, defecation, or passing gas, deep sleep, loss of consciousness from intoxication or illness, and the emission of fluids. Most scholars also count direct contact with the private parts without a barrier.",
    sourceAr: "اتفاق الفقهاء", sourceEn: "Scholarly consensus",
  },
  {
    id: "p4", categoryId: "purity",
    questionAr: "كيف يكون الغسل من الجنابة؟",
    questionEn: "How is the ritual bath (ghusl) performed after major impurity?",
    rulingAr: "واجب", rulingEn: "Obligatory",
    detailAr: "النية، تسمية الله، غسل اليدين، غسل الفرج، الوضوء الكامل أو بتأخير الرجلين، تخليل أصول الشعر بالماء، ثم تعميم الماء على الجسد كله ثلاث مرات مع التأكد من وصول الماء لكل موضع.",
    detailEn: "Intention, saying Allah's name, washing the hands and private area, performing wudu (feet may be delayed), working water through the hair roots, then pouring water over the entire body three times, ensuring it reaches every part.",
    sourceAr: "صحيح البخاري ومسلم", sourceEn: "Sahih Bukhari & Muslim",
  },
  {
    id: "p5", categoryId: "purity",
    questionAr: "هل دم الحيض يمنع الصلاة والصيام؟",
    questionEn: "Does menstruation prevent prayer and fasting?",
    rulingAr: "نعم يمنع", rulingEn: "Yes, it prevents both",
    detailAr: "لا تصلي الحائض ولا تصوم مدة حيضها، ولا يلزمها قضاء الصلاة، لكن يلزمها قضاء ما فاتها من أيام الصيام بعد انتهاء الحيض والطهارة منه.",
    detailEn: "A menstruating woman does not pray or fast during her period and need not make up missed prayers, but she must make up missed fasting days after her period ends and she becomes pure.",
    sourceAr: "صحيح البخاري", sourceEn: "Sahih Bukhari",
  },

  // ===== Prayer =====
  {
    id: "pr1", categoryId: "prayer",
    questionAr: "ما حكم ترك الصلاة متعمداً؟",
    questionEn: "What is the ruling on deliberately abandoning prayer?",
    rulingAr: "كبيرة من الكبائر", rulingEn: "A major sin",
    detailAr: "الصلاة ركن من أركان الإسلام الخمسة، وتركها عمداً من أكبر الذنوب عند جمهور العلماء، ومن أهل العلم من يرى أن تاركها جحوداً كافر، أما تركها تكاسلاً ففيه خلاف بين العلماء مع اتفاقهم على عظم خطره. والواجب التوبة والمبادرة بالصلاة.",
    detailEn: "Prayer is one of Islam's five pillars. Deliberately abandoning it is considered one of the gravest sins by the majority of scholars. Repentance and resuming prayer immediately is obligatory.",
    sourceAr: "سنن الترمذي", sourceEn: "Sunan At-Tirmidhi",
  },
  {
    id: "pr2", categoryId: "prayer",
    questionAr: "هل يجوز الجمع بين الصلوات؟",
    questionEn: "Is combining prayers permitted?",
    rulingAr: "جائز في أحوال خاصة", rulingEn: "Permitted in specific cases",
    detailAr: "يجوز الجمع بين الظهر والعصر، وبين المغرب والعشاء، للمسافر سفراً تقصر فيه الصلاة، وللمريض ومن في حكمه، وللمطر الشديد عند بعض العلماء. أما القصر فمختص بالسفر.",
    detailEn: "Combining Dhuhr with Asr, and Maghrib with Isha, is allowed for a traveler, for the sick, and in some views for heavy rain. Shortening prayers (not just combining) applies specifically to travel.",
    sourceAr: "صحيح مسلم", sourceEn: "Sahih Muslim",
  },
  {
    id: "pr3", categoryId: "prayer",
    questionAr: "ما حكم صلاة الجماعة للرجال؟",
    questionEn: "What is the ruling on congregational prayer for men?",
    rulingAr: "واجبة عند كثير من العلماء", rulingEn: "Obligatory per many scholars",
    detailAr: "ذهب جمهور الفقهاء إلى أن صلاة الجماعة في المسجد سنة مؤكدة، وذهب بعضهم كالحنابلة إلى وجوبها على الرجال القادرين لغير عذر، لما فيها من الأجر العظيم وتماسك المجتمع المسلم.",
    detailEn: "The majority view it as a strongly emphasized tradition, while some (notably the Hanbali school) hold it obligatory for capable men without a valid excuse, given its immense reward and role in community cohesion.",
    sourceAr: "صحيح البخاري ومسلم", sourceEn: "Sahih Bukhari & Muslim",
  },
  {
    id: "pr4", categoryId: "prayer",
    questionAr: "كيف يصلي المسافر والمريض؟",
    questionEn: "How do travelers and the sick pray?",
    rulingAr: "برخصة شرعية", rulingEn: "With a legal dispensation",
    detailAr: "يقصر المسافر الصلاة الرباعية إلى ركعتين، ويجوز له الجمع. والمريض يصلي على حسب حاله: قائماً فإن لم يستطع فجالساً فعلى جنبه، ولا تسقط عنه الصلاة ما دام عقله حاضراً.",
    detailEn: "A traveler shortens four-unit prayers to two, and may combine them. The sick pray according to ability: standing, then sitting, then lying on their side — prayer is never dropped while one's mind is present.",
    sourceAr: "صحيح البخاري", sourceEn: "Sahih Bukhari",
  },
  {
    id: "pr5", categoryId: "prayer",
    questionAr: "ما حكم صلاة الجمعة على النساء؟",
    questionEn: "Is Friday prayer obligatory on women?",
    rulingAr: "غير واجبة، وتصح منها", rulingEn: "Not obligatory, but valid if performed",
    detailAr: "صلاة الجمعة واجبة على الرجال البالغين المستوطنين القادرين، وليست واجبة على النساء، فإن صلتها مع الجماعة صحت وأجزأتها عن صلاة الظهر، وإن لم تحضرها صلت الظهر في بيتها.",
    detailEn: "Friday prayer is obligatory on adult, resident, capable men. It is not obligatory on women, but if a woman attends it counts in place of Dhuhr; otherwise she prays Dhuhr at home.",
    sourceAr: "سنن أبي داود", sourceEn: "Sunan Abi Dawud",
  },

  // ===== Zakat & Charity =====
  {
    id: "z1", categoryId: "zakat",
    questionAr: "على من تجب الزكاة؟",
    questionEn: "Who is obligated to pay zakat?",
    rulingAr: "واجبة على من بلغ النصاب", rulingEn: "Obligatory on those who reach the threshold",
    detailAr: "تجب الزكاة على كل مسلم بالغ عاقل حر يملك مالاً بلغ النصاب الشرعي وحال عليه حول كامل (سنة هجرية)، وتُستثنى الديون التي عليه إن أنقصت المال عن النصاب.",
    detailEn: "Zakat is obligatory on every sane, adult, free Muslim who possesses wealth reaching the legal minimum (nisab) and has held it for a full lunar year. Outstanding debts that reduce wealth below the threshold are deducted first.",
    sourceAr: "سورة التوبة: ١٠٣", sourceEn: "Surah At-Tawbah 9:103",
  },
  {
    id: "z2", categoryId: "zakat",
    questionAr: "كم نسبة زكاة المال؟",
    questionEn: "What is the zakat rate on money/savings?",
    rulingAr: "٢.٥٪", rulingEn: "2.5%",
    detailAr: "زكاة النقود والمدخرات والذهب والفضة والعروض التجارية ٢.٥٪ من قيمتها (ربع العشر) إذا بلغت النصاب (ما يعادل قيمة ٨٥ جراماً من الذهب تقريباً) وحال عليها الحول.",
    detailEn: "Cash, savings, gold, silver, and trade goods are zakat-ed at 2.5% of their value (one-fortieth), once wealth reaches the nisab (roughly equal to 85 grams of gold) and a full year has passed.",
    sourceAr: "صحيح البخاري", sourceEn: "Sahih Bukhari",
  },
  {
    id: "z3", categoryId: "zakat",
    questionAr: "من هم مصارف الزكاة الثمانية؟",
    questionEn: "Who are the eight categories eligible for zakat?",
    rulingAr: "محددة نصاً", rulingEn: "Explicitly defined",
    detailAr: "الفقراء، المساكين، العاملون عليها، المؤلفة قلوبهم، الرقاب (تحرير العبيد)، الغارمون (أصحاب الديون)، في سبيل الله، وابن السبيل (المنقطع في سفره). لا يجوز صرف الزكاة لغير هذه الأصناف.",
    detailEn: "The poor, the needy, zakat administrators, those whose hearts are to be won over, freeing captives, those in debt, in the cause of Allah, and the stranded traveler. Zakat may not be given outside these categories.",
    sourceAr: "سورة التوبة: ٦٠", sourceEn: "Surah At-Tawbah 9:60",
  },
  {
    id: "z4", categoryId: "zakat",
    questionAr: "ما حكم زكاة الفطر؟",
    questionEn: "What is the ruling on Zakat al-Fitr (fast-breaking charity)?",
    rulingAr: "واجبة على كل مسلم", rulingEn: "Obligatory on every Muslim",
    detailAr: "زكاة الفطر واجبة على كل مسلم صغيراً أو كبيراً، ذكراً أو أنثى، عن نفسه وعن من يعولهم، تدفع قبل صلاة العيد وتقدَّر بصاع من طعام أهل البلد الغالب (نحو ٢.٥ - ٣ كجم) أو ما يعادلها نقداً عند من يبيح ذلك.",
    detailEn: "Fitr charity is obligatory on every Muslim, young or old, male or female, on behalf of themselves and their dependents. It is paid before Eid prayer, valued at roughly 2.5-3 kg of a staple food, or its cash equivalent where permitted.",
    sourceAr: "صحيح البخاري", sourceEn: "Sahih Bukhari",
  },

  // ===== Fasting =====
  {
    id: "f1", categoryId: "fasting",
    questionAr: "ما الذي يفسد الصيام؟",
    questionEn: "What breaks a fast?",
    rulingAr: "عدة أمور", rulingEn: "Several things",
    detailAr: "يفسد الصيام: الأكل والشرب المتعمد، الجماع، الإنزال المتعمد، القيء المتعمد، الحيض والنفاس، والردة عن الإسلام. أما الخطأ غير المتعمد كالأكل ناسياً فلا يفسد الصيام ويكمل يومه.",
    detailEn: "A fast is broken by: deliberate eating/drinking, sexual intercourse, deliberate ejaculation, deliberate vomiting, menstruation and postpartum bleeding. Unintentional acts, like eating while forgetting one is fasting, do not break the fast — one simply continues.",
    sourceAr: "صحيح البخاري ومسلم", sourceEn: "Sahih Bukhari & Muslim",
  },
  {
    id: "f2", categoryId: "fasting",
    questionAr: "من يُرخص له الفطر في رمضان؟",
    questionEn: "Who is exempted from fasting Ramadan?",
    rulingAr: "فئات محددة برخصة", rulingEn: "Specific categories with dispensation",
    detailAr: "المريض الذي يضره الصيام، المسافر سفر قصر، الحامل والمرضع إن خافتا ضرراً، الكبير العاجز، والحائض والنفساء. يقضي القادر على القضاء الأيام لاحقاً، ومن لا يقدر أبداً كالكبير العاجز يفدي بإطعام مسكين عن كل يوم.",
    detailEn: "Those exempted include the harmfully ill, travelers, pregnant/nursing women who fear harm, the frail elderly, and menstruating/postpartum women. Those able to make up days later must do so; those permanently unable (like the frail elderly) feed one needy person per missed day instead.",
    sourceAr: "سورة البقرة: ١٨٤-١٨٥", sourceEn: "Surah Al-Baqarah 2:184-185",
  },
  {
    id: "f3", categoryId: "fasting",
    questionAr: "هل يجوز صيام التطوع خارج رمضان؟",
    questionEn: "Is voluntary fasting outside Ramadan permitted?",
    rulingAr: "مستحب", rulingEn: "Recommended",
    detailAr: "يستحب صيام يوم عاشوراء، وتاسوعاء، وعرفة لغير الحجاج، وأيام الاثنين والخميس، وثلاثة أيام من كل شهر، وست من شوال، وصيام أكثر شعبان، وصيام يوم وإفطار يوم (صيام داود). ويحرم صيام يومي العيدين ويوم الشك المختلف فيه.",
    detailEn: "Recommended voluntary fasts include Ashura, the day before it, the Day of Arafah (for non-pilgrims), Mondays and Thursdays, three days each month, six days of Shawwal, and alternate-day fasting. Fasting on the two Eid days is prohibited.",
    sourceAr: "صحيح مسلم", sourceEn: "Sahih Muslim",
  },
  {
    id: "f4", categoryId: "fasting",
    questionAr: "ما حكم تناول حبوب منع الحيض لإتمام رمضان؟",
    questionEn: "What is the ruling on using medication to delay menstruation to complete Ramadan?",
    rulingAr: "جائز بشروط", rulingEn: "Permitted with conditions",
    detailAr: "يجوز للمرأة استخدام ما يؤخر الحيض بإذن الطبيب إذا كان لا يضر بصحتها، أما إن كان يترتب عليه ضرر صحي فالأفضل تركه، فالصيام يُقضى بعد رمضان ولا حرج في ذلك.",
    detailEn: "A woman may use menstruation-delaying medication with doctor approval if it causes no health harm. If it does carry health risk, it is better avoided — missed fasting days can simply be made up after Ramadan without any sin.",
    sourceAr: "فتاوى معاصرة", sourceEn: "Contemporary rulings",
  },

  // ===== Hajj & Umrah =====
  {
    id: "h1", categoryId: "hajj",
    questionAr: "على من يجب الحج؟",
    questionEn: "Who is obligated to perform Hajj?",
    rulingAr: "واجب مرة في العمر", rulingEn: "Obligatory once in a lifetime",
    detailAr: "يجب الحج على كل مسلم بالغ عاقل حر مستطيع بدنياً ومالياً، استطاعة تشمل نفقة السفر والإقامة وكفاية من يعولهم، ويكون مرة واحدة في العمر وما زاد فهو تطوع.",
    detailEn: "Hajj is obligatory on every sane, adult, free Muslim who is physically and financially able — meaning they can cover travel and stay costs plus provide for their dependents. It is required once in a lifetime; additional times are voluntary.",
    sourceAr: "سورة آل عمران: ٩٧", sourceEn: "Surah Al Imran 3:97",
  },
  {
    id: "h2", categoryId: "hajj",
    questionAr: "ما الفرق بين الحج والعمرة؟",
    questionEn: "What is the difference between Hajj and Umrah?",
    rulingAr: "الحج أركان أوسع ووقته محدد", rulingEn: "Hajj has broader rites and a fixed time",
    detailAr: "الحج له أركان محددة (الإحرام، الوقوف بعرفة، طواف الإفاضة، السعي) في وقت محدد من ذي الحجة ولا يصح إلا فيه، بينما العمرة (الإحرام، الطواف، السعي، الحلق أو التقصير) تصح في أي وقت من السنة وهي أخف أعمالاً.",
    detailEn: "Hajj has fixed pillars (entering ihram, standing at Arafah, the circling of Tawaf al-Ifadah, Sa'i) that must occur within specific days of Dhul-Hijjah. Umrah (ihram, Tawaf, Sa'i, cutting the hair) can be performed any time of year and involves fewer rites.",
    sourceAr: "صحيح البخاري ومسلم", sourceEn: "Sahih Bukhari & Muslim",
  },
  {
    id: "h3", categoryId: "hajj",
    questionAr: "ما محظورات الإحرام؟",
    questionEn: "What is prohibited during the state of ihram?",
    rulingAr: "محددة شرعاً", rulingEn: "Legally defined",
    detailAr: "يحرم على المحرم: لبس المخيط للرجل، تغطية الرأس للرجل، استعمال الطيب، إزالة الشعر أو الأظافر، عقد النكاح، والجماع ومقدماته، وقتل الصيد البري. من ارتكب محظوراً عليه فدية حسب نوعه.",
    detailEn: "Prohibitions during ihram include: men wearing tailored/sewn garments or covering the head, using perfume, cutting hair or nails, contracting marriage, sexual relations, and hunting land game. Violating a prohibition requires an expiation based on its type.",
    sourceAr: "سورة البقرة: ١٩٦-١٩٧", sourceEn: "Surah Al-Baqarah 2:196-197",
  },
  {
    id: "h4", categoryId: "hajj",
    questionAr: "هل يجوز الحج بالاستدانة؟",
    questionEn: "Is it permissible to go into debt to perform Hajj?",
    rulingAr: "لا يجب، والأفضل تركه", rulingEn: "Not obligatory, and better avoided",
    detailAr: "لا يجب الحج إلا على المستطيع مالياً بلا استدانة، فمن لم يجد المال الكافي من ماله الحلال فلا حج عليه، والاستدانة لأداء الحج مع عدم القدرة على السداد لا يستحب لما فيها من تحميل النفس ديناً قد يُعجزها.",
    detailEn: "Hajj is obligatory only on those who are financially able without borrowing. Going into debt one cannot reasonably repay to perform Hajj is discouraged, since it burdens a person with an obligation they may be unable to fulfill.",
    sourceAr: "فتاوى معاصرة", sourceEn: "Contemporary rulings",
  },

  // ===== Food & Drink =====
  {
    id: "m1", categoryId: "food",
    questionAr: "ما حكم أكل لحم الخنزير؟",
    questionEn: "What is the ruling on eating pork?",
    rulingAr: "حرام", rulingEn: "Prohibited",
    detailAr: "لحم الخنزير محرم بنص القرآن الصريح، ويشمل التحريم جميع مشتقاته ومنتجاته الداخلة في الطعام، إلا في حالة الضرورة القصوى لحفظ النفس من الهلاك عند عدم وجود بديل.",
    detailEn: "Pork is explicitly prohibited by the Quran, including all its derivatives used in food products, except in cases of extreme necessity to preserve life when no alternative exists.",
    sourceAr: "سورة البقرة: ١٧٣", sourceEn: "Surah Al-Baqarah 2:173",
  },
  {
    id: "m2", categoryId: "food",
    questionAr: "ما حكم شرب الخمر والمسكرات؟",
    questionEn: "What is the ruling on alcohol and intoxicants?",
    rulingAr: "حرام", rulingEn: "Prohibited",
    detailAr: "كل مسكر خمر، وكل خمر حرام، سواء كان من عصير العنب أو غيره، وسواء قلّ أو كثر، ويشمل التحريم بيعها وتقديمها وحضور مجالسها، لعظم مفاسدها على العقل والمجتمع.",
    detailEn: "Every intoxicant is considered 'khamr' and is prohibited, whether from grapes or other sources, in small or large amounts. This extends to selling, serving, or sitting at gatherings where it is consumed, due to the severe harm to the mind and society.",
    sourceAr: "سورة المائدة: ٩٠", sourceEn: "Surah Al-Ma'idah 5:90",
  },
  {
    id: "m3", categoryId: "food",
    questionAr: "ما شروط الذبح الحلال؟",
    questionEn: "What are the requirements for halal slaughter?",
    rulingAr: "شروط محددة", rulingEn: "Specific conditions",
    detailAr: "يشترط أن يكون الذابح مسلماً عاقلاً، وأن يُسمّي الله عند الذبح، وأن يقطع الحلقوم والمريء والودجين بأداة حادة في موضع الذبح، مع إراحة الحيوان قبل الذبح وعدم تعذيبه.",
    detailEn: "Requirements include a sane Muslim slaughterer, pronouncing Allah's name at the moment of slaughter, severing the windpipe, esophagus, and the two jugular veins with a sharp instrument at the throat, while treating the animal gently and not causing it unnecessary suffering.",
    sourceAr: "صحيح مسلم", sourceEn: "Sahih Muslim",
  },
  {
    id: "m4", categoryId: "food",
    questionAr: "هل يجوز أكل طعام أهل الكتاب؟",
    questionEn: "Is it permissible to eat food prepared by Jews and Christians?",
    rulingAr: "جائز بشروط", rulingEn: "Permitted with conditions",
    detailAr: "يجوز أكل طعام أهل الكتاب ما لم يكن فيه محرم بعينه كلحم الخنزير أو ذبيحة لم تُذبح شرعاً، ويُستثنى اللحوم التي تحتاج تذكية فلا تؤكل إلا إذا ثبت أنها ذُبحت على الطريقة الشرعية أو ما يقاربها من ذكاة أهل الكتاب الأصلية.",
    detailEn: "Food from the People of the Book is permissible as long as it contains nothing explicitly prohibited, like pork. Meat requiring ritual slaughter is only eaten if it is confirmed to have been slaughtered in a manner meeting Islamic or equivalent scriptural requirements.",
    sourceAr: "سورة المائدة: ٥", sourceEn: "Surah Al-Ma'idah 5:5",
  },
  {
    id: "m5", categoryId: "food",
    questionAr: "ما حكم الجيلاتين المشتق من الخنزير؟",
    questionEn: "What is the ruling on gelatin derived from pork?",
    rulingAr: "حرام إن ثبت مصدره", rulingEn: "Prohibited if confirmed source",
    detailAr: "الجيلاتين المستخرج من الخنزير محرم، لذلك ينبغي التحقق من مصدر الجيلاتين في المنتجات الغذائية والدوائية والتأكد من حصولها على شهادة حلال معتمدة، وعند الشك يُفضَّل البحث عن بديل موثق المصدر.",
    detailEn: "Gelatin sourced from pork is prohibited. It is important to verify the source of gelatin in food and medicinal products and look for a trusted halal certification; when in doubt, seek a documented alternative.",
    sourceAr: "فتاوى معاصرة", sourceEn: "Contemporary rulings",
  },

  // ===== Transactions & Money =====
  {
    id: "t1", categoryId: "transactions",
    questionAr: "ما حكم الربا؟",
    questionEn: "What is the ruling on interest (riba)?",
    rulingAr: "حرام", rulingEn: "Prohibited",
    detailAr: "الربا محرم تحريماً شديداً بنص القرآن، سواء كان ربا الفضل (التفاضل في الصنف الواحد) أو ربا النسيئة (الزيادة مقابل التأخير في السداد)، ويشمل التحريم القروض البنكية التقليدية بالفوائد.",
    detailEn: "Interest is severely prohibited by explicit Quranic text, whether through unequal exchange of the same commodity type or through charging extra for delayed repayment. This prohibition extends to conventional interest-based bank loans.",
    sourceAr: "سورة البقرة: ٢٧٥", sourceEn: "Surah Al-Baqarah 2:275",
  },
  {
    id: "t2", categoryId: "transactions",
    questionAr: "ما حكم العمل في وظيفة فيها تعامل بالربا؟",
    questionEn: "What is the ruling on working in a job involving interest-based transactions?",
    rulingAr: "يُنهى عنه عند التعامل المباشر", rulingEn: "Discouraged for direct involvement",
    detailAr: "يُكره بشدة ويحرم عند كثير من العلماء العمل في وظائف يكون فيها الموظف طرفاً مباشراً في عقد الربا كمحاسب القروض الربوية، أما الوظائف العامة في المؤسسة التي لا علاقة مباشرة لها بعقد الربا ففيها تفصيل بين العلماء، والأحوط تجنبها إن وُجد بديل.",
    detailEn: "Many scholars prohibit jobs where an employee is a direct party to an interest contract, such as processing interest-based loans. General roles with no direct link to the interest contract are debated among scholars; the more cautious position is to avoid them if an alternative exists.",
    sourceAr: "فتاوى معاصرة", sourceEn: "Contemporary rulings",
  },
  {
    id: "t3", categoryId: "transactions",
    questionAr: "ما حكم الغش في البيع والشراء؟",
    questionEn: "What is the ruling on deception in buying and selling?",
    rulingAr: "حرام", rulingEn: "Prohibited",
    detailAr: "الغش في المعاملات التجارية محرم، سواء بإخفاء عيب في السلعة، أو الكذب في وصفها، أو التطفيف في الميزان والمقياس، وقد برّأ النبي ﷺ المسلمين من الغشاشين قائلاً: من غشنا فليس منا.",
    detailEn: "Deception in commercial dealings is prohibited, whether by hiding a defect, lying about a product's description, or shortchanging weights and measures. The Prophet (peace be upon him) distanced true Muslims from those who deceive others.",
    sourceAr: "صحيح مسلم", sourceEn: "Sahih Muslim",
  },
  {
    id: "t4", categoryId: "transactions",
    questionAr: "ما حكم التأمين التجاري التقليدي؟",
    questionEn: "What is the ruling on conventional commercial insurance?",
    rulingAr: "خلاف بين العلماء، الأحوط التأمين التكافلي", rulingEn: "Scholarly debate; takaful preferred",
    detailAr: "يرى أكثر العلماء المعاصرين أن التأمين التجاري التقليدي فيه شبهة الربا والغرر والميسر، ويوجد بديل شرعي هو التأمين التكافلي التعاوني القائم على التبرع والمشاركة في المخاطر، وهو الأقرب للأحكام الشرعية.",
    detailEn: "Most contemporary scholars see conventional commercial insurance as containing elements of interest, excessive uncertainty, and gambling-like risk. A sharia-compliant alternative is cooperative takaful insurance, based on mutual donation and shared risk.",
    sourceAr: "مجمع الفقه الإسلامي", sourceEn: "Islamic Fiqh Academy resolutions",
  },
  {
    id: "t5", categoryId: "transactions",
    questionAr: "ما حكم العمل بالعملات المشفرة؟",
    questionEn: "What is the ruling on dealing with cryptocurrency?",
    rulingAr: "خلاف معاصر بين العلماء", rulingEn: "Ongoing contemporary scholarly debate",
    detailAr: "هذه مسألة مستجدة محل اجتهاد معاصر: بعض العلماء يبيحها بشروط كوضوح الغرض وعدم الغرر الفاحش وخلوها من الربا، وبعضهم يمنعها لعدم استقرار قيمتها الشديد وشبهة المقامرة، فالأحوط استشارة جهة فتوى موثوقة قبل التعامل بها.",
    detailEn: "This is a modern issue under active scholarly deliberation. Some permit it with conditions — clear purpose, no excessive uncertainty, no interest involvement — while others prohibit it citing extreme volatility and speculative risk. It is prudent to consult a trusted scholarly authority before engaging with it.",
    sourceAr: "فتاوى معاصرة متباينة", sourceEn: "Varying contemporary rulings",
  },

  // ===== Family & Marriage =====
  {
    id: "a1", categoryId: "family",
    questionAr: "ما أركان عقد النكاح؟",
    questionEn: "What are the pillars of a valid marriage contract?",
    rulingAr: "أركان محددة", rulingEn: "Specific pillars",
    detailAr: "يتكون عقد النكاح من: الزوج والزوجة الخاليين من الموانع الشرعية، وليّ المرأة، وشاهدين عدلين، والصيغة (الإيجاب والقبول)، والمهر وهو حق للزوجة.",
    detailEn: "A marriage contract consists of: a groom and bride free of legal impediments, the bride's guardian, two just witnesses, the formal offer and acceptance, and the dowry (mahr), which is the bride's right.",
    sourceAr: "اتفاق الفقهاء", sourceEn: "Scholarly consensus",
  },
  {
    id: "a2", categoryId: "family",
    questionAr: "ما حكم الطلاق وهل يُستحب؟",
    questionEn: "What is the ruling on divorce — is it encouraged?",
    rulingAr: "مكروه إلا لضرورة", rulingEn: "Discouraged except out of necessity",
    detailAr: "الطلاق مشروع لكنه مكروه إلا إذا كان هناك ضرر فعلي يستدعيه، والأفضل البحث عن كل وسائل الإصلاح والصبر أولاً، ويُشرع عند الحاجة الحقيقية مع اتباع الطريقة الشرعية في عدده ووقته.",
    detailEn: "Divorce is legally valid but discouraged unless there is real harm necessitating it. Seeking reconciliation and patience is preferred first. When genuinely needed, it should follow the proper legal procedure in timing and count.",
    sourceAr: "سورة البقرة: ٢٢٩", sourceEn: "Surah Al-Baqarah 2:229",
  },
  {
    id: "a3", categoryId: "family",
    questionAr: "ما حقوق الزوجة على زوجها؟",
    questionEn: "What are a wife's rights over her husband?",
    rulingAr: "حقوق واجبة", rulingEn: "Mandatory rights",
    detailAr: "من حقوق الزوجة: المهر، النفقة الكاملة من مأكل ومسكن وملبس بحسب الاستطاعة، المعاملة بالحسنى والعدل بين الزوجات إن تعددن، وعدم الإضرار بها قولاً أو فعلاً.",
    detailEn: "A wife's rights include: the dowry, full maintenance including food, housing, and clothing according to the husband's means, kind and just treatment (including fairness among co-wives if applicable), and freedom from harm in word or action.",
    sourceAr: "سورة النساء: ١٩", sourceEn: "Surah An-Nisa 4:19",
  },
  {
    id: "a4", categoryId: "family",
    questionAr: "ما حكم العضل (منع الولي ابنته من الزواج بلا سبب)؟",
    questionEn: "What is the ruling on a guardian unjustly preventing his daughter's marriage?",
    rulingAr: "محرم وتزول الولاية عنه", rulingEn: "Prohibited; guardianship may transfer",
    detailAr: "عضل المرأة عن الزواج بمن تريد كفئاً لها بلا سبب شرعي محرم، وإذا تعنّت الولي القريب انتقلت الولاية إلى ولي آخر أو إلى القاضي بحسب ما تراه الجهات الشرعية المختصة.",
    detailEn: "Unjustly preventing a woman from marrying a suitable, compatible match is prohibited. If a close guardian stubbornly refuses without valid reason, guardianship may pass to another relative or to a qualified judge, per competent religious authorities.",
    sourceAr: "سورة البقرة: ٢٣٢", sourceEn: "Surah Al-Baqarah 2:232",
  },

  // ===== Dress & Appearance =====
  {
    id: "d1", categoryId: "dress",
    questionAr: "ما حكم الحجاب للمرأة المسلمة؟",
    questionEn: "What is the ruling on hijab for a Muslim woman?",
    rulingAr: "واجب", rulingEn: "Obligatory",
    detailAr: "الحجاب الشرعي واجب على المرأة المسلمة البالغة أمام غير محارمها، ويشمل تغطية الرأس والجسد بلباس غير شفاف وغير ضيق يصف الجسد، مع ترك الوجه مكشوفاً عند جمهور العلماء.",
    detailEn: "Covering the hair and body (excluding the face, per the majority view) with non-transparent, non-revealing clothing is obligatory on an adult Muslim woman in front of unrelated men.",
    sourceAr: "سورة النور: ٣١", sourceEn: "Surah An-Nur 24:31",
  },
  {
    id: "d2", categoryId: "dress",
    questionAr: "ما حكم تشبه الرجل بالمرأة أو العكس في اللباس؟",
    questionEn: "What is the ruling on men or women dressing to resemble the opposite sex?",
    rulingAr: "محرم", rulingEn: "Prohibited",
    detailAr: "يحرم على الرجل أن يتشبه بالمرأة في اللباس والزينة الخاصة بها، ويحرم على المرأة أن تتشبه بالرجل، لما ورد من لعن النبي ﷺ للمتشبهين والمتشبهات.",
    detailEn: "It is prohibited for men to imitate women in distinctly feminine dress and adornment, and for women to imitate men, based on the Prophet's (peace be upon him) strong condemnation of such imitation.",
    sourceAr: "صحيح البخاري", sourceEn: "Sahih Bukhari",
  },
  {
    id: "d3", categoryId: "dress",
    questionAr: "ما حكم الوشم (التاتو) الدائم؟",
    questionEn: "What is the ruling on permanent tattoos?",
    rulingAr: "محرم", rulingEn: "Prohibited",
    detailAr: "الوشم الدائم الذي يغيّر الجلد بإدخال مواد تحت البشرة محرم لما فيه من تغيير خلق الله، أما الزينة المؤقتة التي تُغسل كالحناء فلا بأس بها.",
    detailEn: "Permanent tattoos that alter the skin by introducing substances beneath it are prohibited, as this changes what Allah created. Temporary, washable decoration like henna is not problematic.",
    sourceAr: "صحيح البخاري ومسلم", sourceEn: "Sahih Bukhari & Muslim",
  },

  // ===== Everyday Conduct =====
  {
    id: "k1", categoryId: "conduct",
    questionAr: "ما حكم الكذب؟",
    questionEn: "What is the ruling on lying?",
    rulingAr: "محرم إلا في مواضع مستثناة", rulingEn: "Prohibited except in narrow exceptions",
    detailAr: "الكذب من كبائر الذنوب وعلامات النفاق، ويُستثنى منه ثلاثة مواضع عند جمهور العلماء: الإصلاح بين متخاصمين، كلام الرجل لزوجته لإصلاح العلاقة، وكلام المحارب في الحرب لتضليل العدو.",
    detailEn: "Lying is a grave sin and a sign of hypocrisy. The majority of scholars allow narrow exceptions: reconciling between disputing parties, a husband speaking kindly to maintain marital harmony, and deceiving the enemy in warfare.",
    sourceAr: "صحيح مسلم", sourceEn: "Sahih Muslim",
  },
  {
    id: "k2", categoryId: "conduct",
    questionAr: "ما حكم الغيبة والنميمة؟",
    questionEn: "What is the ruling on backbiting and gossip?",
    rulingAr: "محرم", rulingEn: "Prohibited",
    detailAr: "الغيبة ذكر الغائب بما يكره وهو صادق فيه، والنميمة نقل الكلام بين الناس لإشعال الفتنة، وكلاهما من كبائر الذنوب وشبّههما القرآن بأكل لحم الأخ الميت.",
    detailEn: "Backbiting is mentioning an absent person in a way they would dislike, even if true. Gossip-mongering spreads words between people to stir discord. Both are grave sins, likened by the Quran to eating the flesh of one's deceased brother.",
    sourceAr: "سورة الحجرات: ١٢", sourceEn: "Surah Al-Hujurat 49:12",
  },
  {
    id: "k3", categoryId: "conduct",
    questionAr: "ما حكم بر الوالدين غير المسلمين؟",
    questionEn: "What is the ruling on honoring non-Muslim parents?",
    rulingAr: "واجب", rulingEn: "Obligatory",
    detailAr: "بر الوالدين واجب حتى لو كانا غير مسلمين، ما لم يأمرا بمعصية الله، فتجب معاملتهما بالإحسان والمعروف ولا يجوز العقوق معهما، واتفق العلماء على استحباب دعوتهما إلى الإسلام بالحكمة.",
    detailEn: "Honoring parents is obligatory even if they are not Muslim, as long as they do not command disobedience to Allah. They must be treated with kindness and respect; undutifulness is never permitted. Scholars agree it is commendable to invite them to Islam with wisdom.",
    sourceAr: "سورة لقمان: ١٥", sourceEn: "Surah Luqman 31:15",
  },
  {
    id: "k4", categoryId: "conduct",
    questionAr: "ما حكم الموسيقى والغناء؟",
    questionEn: "What is the ruling on music and singing?",
    rulingAr: "موضع خلاف بين العلماء", rulingEn: "A matter of scholarly disagreement",
    detailAr: "اختلف العلماء قديماً وحديثاً في حكم الموسيقى والغناء: فمنهم من حرّمها مطلقاً خصوصاً مع المعازف، ومنهم من أجاز ما خلا من الكلام الفاحش أو ما يصاحبه من منكرات كالخلوة المحرمة والسكر. والأحوط لمن أراد السلامة تجنب ما فيه شبهة.",
    detailEn: "Scholars, past and present, differ on music and singing: some prohibit it entirely, particularly with instruments, while others permit content free of indecent lyrics or accompanying prohibited settings. The cautious approach for those seeking certainty is to avoid anything ambiguous.",
    sourceAr: "خلاف فقهي مشهور", sourceEn: "Well-known scholarly disagreement",
  },
  {
    id: "k5", categoryId: "conduct",
    questionAr: "ما حكم التصوير الفوتوغرافي؟",
    questionEn: "What is the ruling on photography?",
    rulingAr: "جائز عند أكثر المعاصرين", rulingEn: "Permitted per most contemporary scholars",
    detailAr: "يرى أكثر العلماء المعاصرين أن التصوير الفوتوغرافي (بالكاميرا) لا يدخل في النهي عن التصوير الوارد في الأحاديث والذي يُقصد به التصوير اليدوي (الرسم والنحت) بقصد التعظيم أو العبادة، لعدم وجود عنصر الخلق فيه، ما لم يكن الموضوع المصوَّر محرماً بذاته.",
    detailEn: "Most contemporary scholars hold that photography does not fall under the prophetic prohibition on image-making, which referred to hand-crafted images (drawing, sculpture) made for veneration or worship, since photography does not involve an act of 'creation'. This excludes photographing anything inherently prohibited.",
    sourceAr: "فتاوى معاصرة", sourceEn: "Contemporary rulings",
  },
];

export function getFiqhByCategory(categoryId: string): FiqhEntry[] {
  return FIQH_DATA.filter((e) => e.categoryId === categoryId);
}
