export interface Institution {
  id: string;
  name: string;
  fullName: string;
  slogan: string;
  theme: string;
  examProvider: string;
  primaryColor: string;
}

export const INSTITUTIONS: Institution[] = [
  {
    id: "taranom",
    name: "ترنم همدلی",
    fullName: "آکادمی تخصصی ترنم همدلی",
    slogan: "مربیگری کنکور نسل آینده",
    theme: "classic",
    examProvider: "ترنم همدلی",
    primaryColor: "#1e3a8a"
  },
  {
    id: "gaj",
    name: "گاج",
    fullName: "موسسه آموزشی گاج",
    slogan: "قبولی با آزمون‌های گاج",
    theme: "emerald",
    examProvider: "گاج",
    primaryColor: "#064e3b"
  },
  {
    id: "qalamchi",
    name: "قلم‌چی",
    fullName: "مجموعه آموزشی قلم‌چی",
    slogan: "رتبه برتر با قلم‌چی",
    theme: "ruby",
    examProvider: "قلم‌چی",
    primaryColor: "#881337"
  }
];

let _activeBrand = INSTITUTIONS[0];

export const setBrandById = (id: string) => {
  const found = INSTITUTIONS.find(i => i.id === id);
  if (found) _activeBrand = found;
};

export const BRAND_CONFIG: Institution = new Proxy({} as Institution, {
  get(_, prop: string) {
    return _activeBrand[prop as keyof Institution];
  }
});
