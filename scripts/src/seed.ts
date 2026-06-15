import { db, studentsTable, examsTable, trapsTable } from "@workspace/db";

async function main() {
  console.log("Seeding database…");

  const existing = await db.select().from(studentsTable).limit(1);
  if (existing.length > 0) {
    console.log("Database already seeded. Skipping.");
    process.exit(0);
  }

  const [demoStudent] = await db.insert(studentsTable).values({
    name: "دانش‌آموز دمو",
    code: "demo",
    field: "tajrobi",
    grade: "دوازدهم",
    city: "تهران",
    age: 17,
    mainGoal: "پزشکی دانشگاه تهران",
    subscriptionType: "premium",
    paymentStatus: "active",
    currentTraz: 7200,
    targetTraz: 8800,
    studyHoursPerDay: 8,
    role: "student",
  }).returning();

  const [adminStudent] = await db.insert(studentsTable).values({
    name: "مدیر سیستم",
    code: "admin",
    field: "tajrobi",
    grade: "—",
    city: "تهران",
    role: "admin",
    subscriptionType: "admin",
  }).returning();

  await db.insert(examsTable).values([
    { studentId: demoStudent.id, date: "۱۴۰۳/۰۶/۲۵", title: "آزمون گاج ۱ — شهریور", traz: 6800, rank: 2400, overallPercentage: 48 },
    { studentId: demoStudent.id, date: "۱۴۰۳/۰۷/۱۰", title: "آزمون گاج ۲ — مهر", traz: 7000, rank: 2100, overallPercentage: 52 },
    { studentId: demoStudent.id, date: "۱۴۰۳/۰۸/۰۵", title: "آزمون قلم‌چی ۱ — آبان", traz: 7200, rank: 1900, overallPercentage: 57 },
  ]);

  await db.insert(trapsTable).values([
    {
      studentId: demoStudent.id,
      questionTitle: "معادله مشتق تابع مرکب",
      subject: "ریاضی",
      category: "حسابان",
      trapType: "محاسباتی",
      correctAnswer: "قانون زنجیره f'(g(x)) × g'(x)",
      userMistake: "فراموش کردن ضرب مشتق درونی",
      importance: "high",
    },
    {
      studentId: demoStudent.id,
      questionTitle: "مراحل گوارش پروتئین‌ها",
      subject: "زیست‌شناسی",
      category: "گوارش",
      trapType: "مفهومی",
      correctAnswer: "پپسین → معده | پانکراس → روده کوچک",
      userMistake: "جابجایی نقش پانکراس و معده",
      importance: "high",
    },
    {
      studentId: demoStudent.id,
      questionTitle: "واکنش تعادلی اکسیداسیون",
      subject: "شیمی",
      category: "الکتروشیمی",
      trapType: "تله‌ای",
      correctAnswer: "اکسایش در آند، کاهش در کاتد",
      userMistake: "برعکس کردن قطب‌ها",
      importance: "medium",
    },
  ]);

  console.log(`Seed complete: student(${demoStudent.id}) and admin(${adminStudent.id}) created.`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
