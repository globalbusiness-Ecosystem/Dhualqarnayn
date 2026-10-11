// محرك حساب المواريث الإسلامية (الفرائض) — يغطي الورثة الأكثر شيوعاً وفق الراجح من مذاهب أهل السنة.
// يُراعي حجب الورثة (كالإخوة بالأب أو الابن)، والعول (زيادة الفروض عن التركة)، والرد (نقص الفروض عن التركة بلا عاصب).
// تنبيه: لا يغطي هذا المحرك كل حالات الفرائض (كالأجداد والجدات، والإخوة لأب أو لأم، وأبناء الإخوة والأعمام،
// وذوي الأرحام)، وهي حالات تحتاج حاسباً أدق أو سؤال عالم موثوق أو قاضٍ شرعي.

export type DeceasedGender = "male" | "female";

export interface MawarethInput {
  estate: number;
  debts: number;
  funeralCosts: number;
  bequest: number; // الوصية (تُحسب من الثلث فأقل)
  deceasedGender: DeceasedGender;
  hasSpouse: boolean;
  spouseCount: number; // عدد الزوجات إن كان المتوفى رجلاً (1 فأكثر)، يُتجاهل إن كانت المتوفاة امرأة
  sons: number;
  daughters: number;
  fatherAlive: boolean;
  motherAlive: boolean;
  fullBrothers: number;
  fullSisters: number;
}

export interface HeirShare {
  id: string;
  label: string;
  count: number;
  fraction: number; // نسبة هذه الفئة كاملة من التركة القابلة للقسمة
  totalAmount: number;
  perPerson: number;
  basis: string;
}

export interface MawarethResult {
  netEstate: number;
  bequestAmount: number;
  distributable: number;
  heirs: HeirShare[];
  awlApplied: boolean;
  raddApplied: boolean;
  blockedNotes: string[];
  generalNotes: string[];
  noHeirsModeled: boolean;
}

const EPS = 1e-9;

export function computeMawareth(input: MawarethInput): MawarethResult {
  const blockedNotes: string[] = [];
  const generalNotes: string[] = [];

  const netEstate = Math.max(0, input.estate - Math.max(0, input.debts) - Math.max(0, input.funeralCosts));
  const bequestAmount = Math.min(Math.max(0, input.bequest), netEstate / 3);
  const distributable = Math.max(0, netEstate - bequestAmount);

  const hasDescendant = input.sons > 0 || input.daughters > 0;
  const siblingsBlocked = input.fatherAlive || input.sons > 0;
  if (siblingsBlocked && (input.fullBrothers > 0 || input.fullSisters > 0)) {
    blockedNotes.push(
      input.fatherAlive
        ? "الإخوة والأخوات الأشقاء محجوبون بالكامل لوجود الأب."
        : "الإخوة والأخوات الأشقاء محجوبون بالكامل لوجود الابن."
    );
  }
  const effBrothers = siblingsBlocked ? 0 : input.fullBrothers;
  const effSisters = siblingsBlocked ? 0 : input.fullSisters;

  // عدد الإخوة/الأخوات (غير المحجوبين حكماً) يؤثر على فرض الأم حتى لو كانوا محجوبين عن الميراث فعلاً
  const siblingCountForMother = input.fullBrothers + input.fullSisters;

  type Entry = { id: string; label: string; count: number; fraction: number; basis: string };
  const fixed: Entry[] = [];

  // ---- الزوج/الزوجة ----
  let spouseFraction = 0;
  if (input.hasSpouse) {
    if (input.deceasedGender === "male") {
      const n = Math.max(1, Math.round(input.spouseCount) || 1);
      spouseFraction = hasDescendant ? 1 / 8 : 1 / 4;
      fixed.push({
        id: "wife",
        label: n > 1 ? "الزوجات (مجتمعات في الفرض)" : "الزوجة",
        count: n,
        fraction: spouseFraction,
        basis: hasDescendant ? "الثُمن لوجود الفرع الوارث (سورة النساء: ١٢)" : "الربع لعدم وجود فرع وارث (سورة النساء: ١٢)",
      });
    } else {
      spouseFraction = hasDescendant ? 1 / 4 : 1 / 2;
      fixed.push({
        id: "husband",
        label: "الزوج",
        count: 1,
        fraction: spouseFraction,
        basis: hasDescendant ? "الربع لوجود الفرع الوارث (سورة النساء: ١٢)" : "النصف لعدم وجود فرع وارث (سورة النساء: ١٢)",
      });
    }
  }

  // ---- الأم ----
  let motherFraction = 0;
  if (input.motherAlive) {
    const gharrawayn =
      input.fatherAlive && input.hasSpouse && !hasDescendant && siblingCountForMother === 0;
    if (gharrawayn) {
      // المسألة "الغراوين": تأخذ الأم ثلث الباقي بعد فرض الزوج/الزوجة، لا ثلث التركة كلها
      motherFraction = (1 - spouseFraction) / 3;
      generalNotes.push("طُبّقت مسألة العمريتين (الغراوين): أخذت الأم ثلث الباقي بعد فرض الزوج/الزوجة لوجود الأب معها وعدم وجود فرع وارث أو إخوة.");
    } else {
      motherFraction = hasDescendant || siblingCountForMother >= 2 ? 1 / 6 : 1 / 3;
    }
    fixed.push({
      id: "mother",
      label: "الأم",
      count: 1,
      fraction: motherFraction,
      basis:
        motherFraction === 1 / 6
          ? "السدس لوجود فرع وارث أو اثنين فأكثر من الإخوة (سورة النساء: ١١)"
          : gharrawayn
          ? "ثلث الباقي بعد فرض الزوجين (مسألة الغراوين)"
          : "الثلث لعدم وجود فرع وارث أو إخوة (سورة النساء: ١١)",
    });
  }

  // ---- البنات (فرضاً، فقط إذا لا يوجد ابن) ----
  let daughtersFixedFraction = 0;
  if (input.daughters > 0 && input.sons === 0) {
    daughtersFixedFraction = input.daughters === 1 ? 1 / 2 : 2 / 3;
    fixed.push({
      id: "daughters",
      label: input.daughters === 1 ? "البنت" : "البنات (مجتمعات)",
      count: input.daughters,
      fraction: daughtersFixedFraction,
      basis: input.daughters === 1 ? "النصف لعدم وجود ابن (سورة النساء: ١١)" : "الثلثان لعدم وجود ابن (سورة النساء: ١١)",
    });
  }

  // ---- الأب (فرضاً عند وجود فرع وارث؛ وله التعصيب لاحقاً إذا لا يوجد ابن) ----
  const fatherFixedFraction = input.fatherAlive && hasDescendant ? 1 / 6 : 0;
  if (input.fatherAlive && hasDescendant) {
    fixed.push({
      id: "father",
      label: "الأب",
      count: 1,
      fraction: fatherFixedFraction,
      basis: "السدس فرضاً لوجود الفرع الوارث (سورة النساء: ١١)، وله ما يتبقى تعصيباً إن لم يوجد ابن",
    });
  }

  // ---- الأخوات الشقيقات (فرضاً، فقط إن لا إخوة ذكور وغير محجوبات، ولا ينطبق عصبة مع البنات) ----
  const asabaMaalBanat = effSisters > 0 && effBrothers === 0 && input.daughters > 0 && input.sons === 0 && !input.fatherAlive;
  let sistersFixedFraction = 0;
  if (effSisters > 0 && effBrothers === 0 && !asabaMaalBanat && !hasDescendant) {
    sistersFixedFraction = effSisters === 1 ? 1 / 2 : 2 / 3;
    fixed.push({
      id: "sisters",
      label: effSisters === 1 ? "الأخت الشقيقة" : "الأخوات الشقيقات (مجتمعات)",
      count: effSisters,
      fraction: sistersFixedFraction,
      basis: effSisters === 1 ? "النصف لعدم وجود أخ أو فرع وارث (سورة النساء: ١٧٦)" : "الثلثان لعدم وجود أخ أو فرع وارث (سورة النساء: ١٧٦)",
    });
  }

  let fixedSum = fixed.reduce((s, e) => s + e.fraction, 0);

  let awlApplied = false;
  let raddApplied = false;
  const finalEntries: Entry[] = [];

  if (fixedSum > 1 + EPS) {
    // العول: تُنسب الفروض كلها إلى مجموعها فتُنقّص بالتساوي
    awlApplied = true;
    const scale = 1 / fixedSum;
    generalNotes.push(
      `حدث "العول": مجموع الفروض المقدّرة (${(fixedSum * 1).toFixed(4)}) تجاوز التركة، فنُسبت جميع الفروض إلى مجموعها بالتساوي وفق إجماع الفرضيين.`
    );
    for (const e of fixed) finalEntries.push({ ...e, fraction: e.fraction * scale });
  } else {
    // توزيع الباقي (التعصيب) حسب ترتيب العصبة
    const residue = 1 - fixedSum;
    for (const e of fixed) finalEntries.push({ ...e });

    const pushOrMerge = (id: string, label: string, count: number, add: number, basis: string) => {
      const existing = finalEntries.find((e) => e.id === id);
      if (existing) {
        existing.fraction += add;
      } else {
        finalEntries.push({ id, label, count, fraction: add, basis });
      }
    };

    if (residue > EPS) {
      if (input.sons > 0) {
        const units = input.sons * 2 + input.daughters * 1;
        const sonsShare = residue * ((input.sons * 2) / units);
        const daughtersShare = residue * ((input.daughters * 1) / units);
        pushOrMerge("sons", "الابن" + (input.sons > 1 ? "ون (مجتمعون)" : ""), input.sons, sonsShare, "تعصيباً — الباقي بعد الفروض، بنسبة ضِعف نصيب البنت (سورة النساء: ١١)");
        if (input.daughters > 0) {
          pushOrMerge("daughters", input.daughters === 1 ? "البنت" : "البنات (مجتمعات)", input.daughters, daughtersShare, "تعصيباً مع الابن — نصف نصيبه (سورة النساء: ١١)");
        }
      } else if (input.fatherAlive) {
        pushOrMerge("father", "الأب", 1, residue, "تعصيباً — باقي التركة بعد الفروض، لأن الأب أقرب عاصب");
      } else if (effBrothers > 0) {
        const units = effBrothers * 2 + effSisters * 1;
        const brothersShare = residue * ((effBrothers * 2) / units);
        const sistersShare = residue * ((effSisters * 1) / units);
        pushOrMerge("brothers", effBrothers > 1 ? "الإخوة الأشقاء (مجتمعون)" : "الأخ الشقيق", effBrothers, brothersShare, "تعصيباً — الباقي بعد الفروض، بنسبة ضِعف نصيب الأخت");
        if (effSisters > 0) {
          pushOrMerge("sisters", effSisters === 1 ? "الأخت الشقيقة" : "الأخوات الشقيقات (مجتمعات)", effSisters, sistersShare, "تعصيباً مع الأخ — نصف نصيبه");
        }
      } else if (asabaMaalBanat) {
        pushOrMerge(
          "sisters",
          effSisters === 1 ? "الأخت الشقيقة" : "الأخوات الشقيقات (مجتمعات)",
          effSisters,
          residue,
          "عصبة مع البنات — تأخذ الأخوات باقي التركة مع البنات لعدم وجود ابن أو أب أو أخ"
        );
      } else {
        // الرد: لا يوجد عاصب يستحق الباقي — يُرد على أصحاب الفروض من غير الزوجين
        raddApplied = true;
        const raddPool = finalEntries.filter((e) => e.id !== "wife" && e.id !== "husband");
        const raddPoolTotal = raddPool.reduce((s, e) => s + e.fraction, 0);
        if (raddPoolTotal > EPS) {
          const targetTotal = 1 - spouseFraction;
          const scale = targetTotal / raddPoolTotal;
          for (const e of raddPool) e.fraction = e.fraction * scale;
          generalNotes.push(
            "حدث \"الرد\": لم يوجد عاصب يستحق باقي التركة، فرُدّ الفائض على أصحاب الفروض من غير الزوجين بنسبة فروضهم، وفق مذهب من يرى الرد (كالحنفية والحنابلة وبعض الشافعية والمالكية في أحوال خاصة)."
          );
        } else if (finalEntries.length > 0) {
          // لا يوجد أحد سوى الزوج/الزوجة — يأخذ كل التركة في بعض المذاهب
          for (const e of finalEntries) e.fraction = 1;
          generalNotes.push("لا يوجد في هذه الحالة إلا الزوج/الزوجة، وبعض المذاهب (كالحنفية) يرى ردّ باقي التركة كاملاً عليه لعدم وجود عاصب أو صاحب فرض آخر.");
        } else {
          generalNotes.push("لم يتم تحديد أي وارث في هذه البيانات لتوزيع التركة عليه — يُرجى مراجعة البيانات المدخلة.");
        }
      }
    }
  }

  const noHeirsModeled = finalEntries.length === 0;
  if (noHeirsModeled) {
    generalNotes.push(
      "لم يُدخَل أي وارث من الورثة المدعومة في هذه الحاسبة (كالزوج/الزوجة، الأبناء، البنات، الأب، الأم، الإخوة والأخوات الأشقاء). يرجى إدخال بيانات الورثة، أو إن كانت التركة لورثة غير هؤلاء (كالأجداد أو الأعمام أو ذوي الأرحام) فيرجى سؤال عالم موثوق أو قاضٍ شرعي."
    );
  }

  const heirs: HeirShare[] = finalEntries
    .filter((e) => e.fraction > EPS)
    .map((e) => {
      const totalAmount = distributable * e.fraction;
      return {
        id: e.id,
        label: e.label,
        count: e.count,
        fraction: e.fraction,
        totalAmount,
        perPerson: e.count > 0 ? totalAmount / e.count : totalAmount,
        basis: e.basis,
      };
    });

  generalNotes.push(
    "هذه الحاسبة تغطي حالات الزوج/الزوجة والأبناء والبنات والأب والأم والإخوة والأخوات الأشقاء فقط، وهي أكثر حالات المواريث شيوعاً. للحالات التي فيها أجداد أو جدات أو إخوة لأب أو لأم أو أبناء إخوة أو أعمام أو ذوو أرحام، يختلف الحساب ويلزم فيها الرجوع لعالم فرائض موثوق أو قاضٍ شرعي."
  );

  return {
    netEstate,
    bequestAmount,
    distributable,
    heirs,
    awlApplied,
    raddApplied,
    blockedNotes,
    generalNotes,
    noHeirsModeled,
  };
}
