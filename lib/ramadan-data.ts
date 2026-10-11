// Practical step-by-step guides for the two great seasonal acts of worship:
// Ramadan (the fasting month) and Hajj/Umrah (the pilgrimage), with the
// virtues, daily etiquette, rites in order, and the supplications for each.

export interface GuideStep {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  duaAr?: string;
  duaEn?: string;
}

export interface GuideSection {
  id: string;
  nameAr: string;
  nameEn: string;
  steps: GuideStep[];
}

// ===================== RAMADAN =====================

export const RAMADAN_VIRTUES: GuideStep[] = [
  {
    id: "rv1", titleAr: "شهر القرآن", titleEn: "The month the Quran was revealed",
    descAr: "أنزل الله القرآن الكريم في رمضان، وفيه ليلة القدر التي هي خير من ألف شهر.",
    descEn: "The Quran was revealed in Ramadan, and it contains the Night of Decree (Laylat al-Qadr), which is better than a thousand months.",
  },
  {
    id: "rv2", titleAr: "تُفتح أبواب الجنة وتُغلق أبواب النار", titleEn: "Gates of Paradise open, gates of Hell close",
    descAr: "تُفتح فيه أبواب الجنة، وتُغلق أبواب النار، وتُصفّد الشياطين، فهو موسم للتوبة والإقبال على الله.",
    descEn: "The gates of Paradise are opened, the gates of Hellfire are closed, and devils are chained — a season for repentance and turning to Allah.",
  },
  {
    id: "rv3", titleAr: "مغفرة الذنوب", titleEn: "Forgiveness of sins",
    descAr: "من صام رمضان إيماناً واحتساباً غُفر له ما تقدم من ذنبه، كما أخبر النبي ﷺ.",
    descEn: "Whoever fasts Ramadan with faith and sincere hope for reward will have their previous sins forgiven, as the Prophet (peace be upon him) informed us.",
  },
  {
    id: "rv4", titleAr: "ليلة القدر", titleEn: "The Night of Decree",
    descAr: "تُطلب في الليالي الوتر من العشر الأواخر (٢١، ٢٣، ٢٥، ٢٧، ٢٩)، ومن علاماتها سكون الليل وصفاء الجو وطلوع الشمس في صباحها بلا شعاع حاد.",
    descEn: "Sought on the odd nights of the last ten (21st, 23rd, 25th, 27th, 29th). Signs include a calm, clear night, and the sun rising the next morning without harsh rays.",
    duaAr: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    duaEn: "O Allah, You are Forgiving and love forgiveness, so forgive me.",
  },
];

export const RAMADAN_DAILY: GuideStep[] = [
  {
    id: "rd1", titleAr: "السحور", titleEn: "Suhoor (pre-dawn meal)",
    descAr: "يُستحب تأخير السحور قريباً من أذان الفجر، وفيه بركة، ولا حرج في ترك النية اللفظية فالنية بالقلب تكفي.",
    descEn: "It is recommended to delay suhoor until close to the Fajr call to prayer — there is blessing in it. A verbal intention isn't required; intending in the heart is enough.",
  },
  {
    id: "rd2", titleAr: "الإفطار", titleEn: "Iftar (breaking the fast)",
    descAr: "يُستحب تعجيل الفطر عند تحقق غروب الشمس، والبدء بتمرات أو ماء، والدعاء عند الإفطار فهو من أوقات استجابة الدعاء.",
    descEn: "It is recommended to break the fast promptly once sunset is confirmed, starting with dates or water, and to make supplication — this is a time when prayers are especially answered.",
    duaAr: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
    duaEn: "The thirst has gone, the veins are moistened, and the reward is confirmed, if Allah wills.",
  },
  {
    id: "rd3", titleAr: "صلاة التراويح", titleEn: "Taraweeh prayer",
    descAr: "صلاة قيام الليل في رمضان، تُصلى جماعة بعد العشاء، ٨ أو ٢٠ ركعة بحسب الاجتهاد، وفيها يُختم القرآن غالباً في المساجد.",
    descEn: "The night prayer of Ramadan, prayed in congregation after Isha, typically 8 or 20 units depending on scholarly practice. Mosques often complete a full recitation of the Quran through it.",
  },
  {
    id: "rd4", titleAr: "تلاوة القرآن", titleEn: "Reciting the Quran",
    descAr: "يُستحب الإكثار من تلاوة القرآن وتدبره في رمضان، وكان النبي ﷺ وأصحابه يضاعفون قراءته فيه.",
    descEn: "It is recommended to increase Quran recitation and reflection during Ramadan, following the example of the Prophet (peace be upon him) and his companions.",
  },
  {
    id: "rd5", titleAr: "الصدقة والإحسان", titleEn: "Charity and kindness",
    descAr: "كان النبي ﷺ أجود الناس، وأجود ما يكون في رمضان، فالصدقة فيه مضاعفة الأجر، وإفطار الصائمين من أعظم القربات.",
    descEn: "The Prophet (peace be upon him) was the most generous of people, and most generous in Ramadan. Charity during this month carries multiplied reward, and feeding fasting people is among the greatest acts of devotion.",
  },
  {
    id: "rd6", titleAr: "الاعتكاف في العشر الأواخر", titleEn: "Itikaf in the last ten nights",
    descAr: "الاعتكاف لزوم المسجد للعبادة والانقطاع عن أمور الدنيا، سنة في العشر الأواخر طلباً لليلة القدر، يبدأ بعد غروب شمس العشرين وينتهي برؤية هلال شوال.",
    descEn: "Itikaf means secluding oneself in the mosque for worship, cut off from worldly matters. It is a tradition observed in the last ten nights, seeking the Night of Decree — beginning after sunset on the 20th and ending with the sighting of the Shawwal moon.",
  },
];

export const RAMADAN_EID: GuideStep[] = [
  {
    id: "re1", titleAr: "زكاة الفطر", titleEn: "Zakat al-Fitr",
    descAr: "تُدفع قبل صلاة العيد، صاع من طعام (نحو ٢.٥-٣ كجم) عن كل فرد في الأسرة، تطهيراً للصائم من اللغو وإغناءً للفقراء يوم العيد.",
    descEn: "Paid before Eid prayer, roughly 2.5-3 kg of staple food per family member — purifying the fasting person from idle talk and ensuring the poor can celebrate Eid too.",
  },
  {
    id: "re2", titleAr: "ليلة العيد وصلاته", titleEn: "Eid night and prayer",
    descAr: "يُستحب التكبير من غروب شمس آخر يوم من رمضان حتى صلاة العيد، والغسل والتجمل والتطيب، والذهاب لصلاة العيد مشياً إن أمكن من طريق والرجوع من طريق آخر.",
    descEn: "It is recommended to recite takbeer (glorifying Allah) from sunset on the last day of Ramadan until Eid prayer, to bathe, dress well, and walk to the prayer by one route and return by another if possible.",
    duaAr: "اللهُ أَكْبَرُ، اللهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللهُ، وَاللهُ أَكْبَرُ، اللهُ أَكْبَرُ وَلِلَّهِ الْحَمْدُ",
    duaEn: "Allah is the Greatest, Allah is the Greatest, there is no god but Allah, and Allah is the Greatest, Allah is the Greatest, and to Allah belongs all praise.",
  },
];

// ===================== HAJJ & UMRAH =====================

export const HAJJ_TYPES: GuideStep[] = [
  {
    id: "ht1", titleAr: "التمتع", titleEn: "Tamattu' (Umrah then Hajj)",
    descAr: "يُحرم بالعمرة أولاً فيؤديها ويتحلل منها، ثم يُحرم بالحج مستقلاً في وقته. وهو النوع الأكثر يسراً وموافقة لما اختاره أكثر الصحابة.",
    descEn: "Enter ihram for Umrah first, perform and complete it (exiting ihram), then enter ihram for Hajj separately at its time. This is the easiest type and what most companions chose.",
  },
  {
    id: "ht2", titleAr: "القران", titleEn: "Qiran (combined intention)",
    descAr: "يُحرم بالعمرة والحج معاً بنية واحدة من الميقات، ولا يتحلل منهما حتى يوم النحر، ويلزمه هدي كالمتمتع.",
    descEn: "Enter ihram with a single combined intention for both Umrah and Hajj from the boundary point, remaining in ihram until the Day of Sacrifice. A sacrificial offering is required, as with Tamattu'.",
  },
  {
    id: "ht3", titleAr: "الإفراد", titleEn: "Ifrad (Hajj alone)",
    descAr: "يُحرم بالحج فقط دون عمرة، ولا يلزمه هدي، وهو أقل الأنواع شيوعاً بين الحجاج الوافدين من خارج مكة.",
    descEn: "Enter ihram for Hajj alone, without Umrah. No sacrificial offering is required. This is the least common type among pilgrims traveling from outside Mecca.",
  },
];

export const UMRAH_STEPS: GuideStep[] = [
  {
    id: "u1", titleAr: "الإحرام", titleEn: "Ihram (entering the sacred state)",
    descAr: "يُغتسل ويتطيب قبل الإحرام (لا بعده)، ويلبس الرجل الإزار والرداء الأبيضين، وتلبس المرأة ثيابها العادية الساترة، ثم يعقد النية من الميقات قائلاً: اللهم لبيك عمرة.",
    descEn: "Bathe and apply perfume before entering ihram (not after). Men wear the two white unstitched garments; women wear their regular modest clothing. Make the intention at the boundary point, saying: 'O Allah, here I am for Umrah.'",
    duaAr: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
    duaEn: "Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Truly all praise, grace, and sovereignty belong to You. You have no partner.",
  },
  {
    id: "u2", titleAr: "الطواف بالكعبة", titleEn: "Tawaf (circling the Kaaba)",
    descAr: "يطوف سبعة أشواط حول الكعبة بدءاً من الحجر الأسود منتهياً عنده، يُستلم الحجر الأسود أو يُشار إليه إن تعذر، ويُستحب الرمل (سرعة المشي) للرجال في الأشواط الثلاثة الأولى.",
    descEn: "Circle the Kaaba seven times, starting and ending at the Black Stone. Touch or kiss it if possible, otherwise gesture toward it. Men are encouraged to walk briskly (ramal) in the first three circuits.",
    duaAr: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    duaEn: "Our Lord, grant us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
  },
  {
    id: "u3", titleAr: "السعي بين الصفا والمروة", titleEn: "Sa'i (walking between Safa and Marwah)",
    descAr: "يسعى سبعة أشواط بين جبلي الصفا والمروة، بدءاً من الصفا، مع الهرولة للرجال في المسافة بين العلامتين الخضراوين.",
    descEn: "Walk seven circuits between the hills of Safa and Marwah, starting at Safa. Men jog lightly between the two green markers on each pass.",
  },
  {
    id: "u4", titleAr: "الحلق أو التقصير", titleEn: "Shaving or trimming the hair",
    descAr: "يحلق الرجل رأسه كله أو يقصر منه، والأفضل الحلق، وتقصّر المرأة من شعرها قدر أنملة، وبهذا تتم العمرة ويخرج من الإحرام.",
    descEn: "A man shaves his entire head or trims it — shaving is preferred. A woman trims a fingertip's length from her hair. This completes Umrah and exits the state of ihram.",
  },
];

export const HAJJ_DAYS: GuideStep[] = [
  {
    id: "hd1", titleAr: "اليوم الأول (٨ ذو الحجة) — التوجه إلى منى", titleEn: "Day 1 (8th Dhul-Hijjah) — Heading to Mina",
    descAr: "يُحرم الحاج من مكانه ويتوجه إلى منى، ويصلي فيها الظهر والعصر والمغرب والعشاء والفجر كل في وقتها دون جمع، ويبيت فيها.",
    descEn: "The pilgrim enters ihram from their location and heads to Mina, praying Dhuhr, Asr, Maghrib, Isha, and Fajr each at its proper time without combining, and spends the night there.",
  },
  {
    id: "hd2", titleAr: "اليوم الثاني (٩ ذو الحجة) — يوم عرفة", titleEn: "Day 2 (9th Dhul-Hijjah) — The Day of Arafah",
    descAr: "أعظم أيام الحج، يتوجه الحاج إلى عرفة ويقف فيها من الظهر إلى غروب الشمس، وهو ركن الحج الأعظم، ومن لم يقف بعرفة فلا حج له. يُكثر فيه من الدعاء والذكر والاستغفار.",
    descEn: "The greatest day of Hajj. The pilgrim heads to Arafah and stands there from noon until sunset — this is the single greatest pillar of Hajj; without it, Hajj is not valid. It is a day for abundant supplication, remembrance, and seeking forgiveness.",
    duaAr: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    duaEn: "There is no god but Allah alone, with no partner. His is the dominion and His is all praise, and He is capable of all things.",
  },
  {
    id: "hd3", titleAr: "مزدلفة — ليلة ٩ إلى ١٠", titleEn: "Muzdalifah — the night of the 9th to 10th",
    descAr: "بعد غروب الشمس يتوجه الحاج إلى مزدلفة، يصلي فيها المغرب والعشاء جمعاً بأذان وإقامتين، ويبيت فيها، ويجمع حصى الرمي (٧٠ حصاة تقريباً) لرمي الجمرات.",
    descEn: "After sunset the pilgrim travels to Muzdalifah, combining Maghrib and Isha prayers with separate calls but one combined set, spends the night there, and gathers pebbles (roughly 70) for the stoning rituals.",
  },
  {
    id: "hd4", titleAr: "اليوم الثالث (١٠ ذو الحجة) — يوم النحر", titleEn: "Day 3 (10th Dhul-Hijjah) — The Day of Sacrifice",
    descAr: "يرمي جمرة العقبة الكبرى بسبع حصيات، ثم ينحر الهدي (لمن عليه هدي)، ثم يحلق أو يقصر، ثم يطوف طواف الإفاضة ويسعى (لمن لم يسع في العمرة)، وبهذا يتحلل التحلل الأول أو الكامل.",
    descEn: "Stone the large Jamrah (Jamrat al-Aqabah) with seven pebbles, slaughter the sacrificial offering (if required), shave or trim the hair, then perform Tawaf al-Ifadah and Sa'i (if not done during Umrah). This marks partial or full exit from ihram restrictions.",
  },
  {
    id: "hd5", titleAr: "أيام التشريق (١١-١٣ ذو الحجة)", titleEn: "Days of Tashreeq (11th-13th Dhul-Hijjah)",
    descAr: "يبيت الحاج في منى ويرمي الجمرات الثلاث (الصغرى والوسطى والكبرى) كل يوم بعد الظهر بسبع حصيات لكل جمرة، ويجوز التعجل بالخروج بعد رمي اليوم الثاني (١٢ ذو الحجة) لمن أراد، أو التأخر لليوم الثالث وهو الأفضل.",
    descEn: "The pilgrim stays overnight in Mina and stones all three Jamrahs (small, medium, large) each day after noon with seven pebbles each. One may leave early after the second day's stoning (12th), or stay through the third day (13th), which is preferable.",
  },
];

export const HAJJ_TIPS: GuideStep[] = [
  {
    id: "htip1", titleAr: "الاستعداد الصحي", titleEn: "Health preparation",
    descAr: "يُنصح بإجراء الفحوصات الطبية اللازمة قبل السفر، أخذ التطعيمات المطلوبة (كالحمى الشوكية)، وحمل الأدوية الشخصية مع نسخة من الوصفة الطبية.",
    descEn: "It is advised to complete necessary medical checkups before traveling, get required vaccinations (such as meningitis), and carry personal medication along with a copy of the prescription.",
  },
  {
    id: "htip2", titleAr: "الصبر وحسن الخلق", titleEn: "Patience and good character",
    descAr: "الحج موسم تزاحم وتعب، فيُستحب التحلي بالصبر والرفق مع الآخرين، وتجنب الجدال والرفث والفسوق كما أمر الله تعالى.",
    descEn: "Hajj is a season of crowds and exertion. Patience and gentleness with others is encouraged, while arguing, indecent speech, and sinful behavior should be avoided, as Allah commands.",
    duaAr: "الْحَجُّ أَشْهُرٌ مَّعْلُومَاتٌ ۚ فَمَن فَرَضَ فِيهِنَّ الْحَجَّ فَلَا رَفَثَ وَلَا فُسُوقَ وَلَا جِدَالَ فِي الْحَجِّ",
    duaEn: "Hajj is [during] well-known months... whoever intends to perform Hajj therein, there is no sexual relations nor wickedness nor disputing during Hajj. (Quran 2:197)",
  },
  {
    id: "htip3", titleAr: "تنظيم الوقت والماء", titleEn: "Time and hydration management",
    descAr: "الحرص على شرب كميات كافية من الماء خاصة في الحر، والتخطيط للتحرك في الساعات الأقل ازدحاماً، وحمل مظلة أو غطاء رأس للوقاية من الشمس.",
    descEn: "Drink plenty of water, especially in the heat, plan movement during less crowded hours, and carry an umbrella or head covering for sun protection.",
  },
];

export const RAMADAN_SECTIONS: GuideSection[] = [
  { id: "virtues", nameAr: "فضائل الشهر", nameEn: "Virtues of the Month", steps: RAMADAN_VIRTUES },
  { id: "daily", nameAr: "البرنامج اليومي", nameEn: "Daily Routine", steps: RAMADAN_DAILY },
  { id: "eid", nameAr: "ختام الشهر والعيد", nameEn: "Month's End & Eid", steps: RAMADAN_EID },
];

export const HAJJ_SECTIONS: GuideSection[] = [
  { id: "types", nameAr: "أنواع النسك", nameEn: "Types of Pilgrimage", steps: HAJJ_TYPES },
  { id: "umrah", nameAr: "خطوات العمرة", nameEn: "Umrah Steps", steps: UMRAH_STEPS },
  { id: "days", nameAr: "أيام الحج بالترتيب", nameEn: "Hajj Days in Order", steps: HAJJ_DAYS },
  { id: "tips", nameAr: "نصائح عملية", nameEn: "Practical Tips", steps: HAJJ_TIPS },
];
