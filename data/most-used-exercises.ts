import type { LangCode, Localized } from "./subjects.ts";

const L = (
  sl: string,
  en: string,
): Localized => ({
  sl,
  en,
  it: en,
  de: en,
  fr: en,
  es: en,
  pl: en,
  ro: en,
});

export type MostUsedExercise = {
  id: string;
  label: Localized;
  url: string;
};

/** Curated "most used" SI secondary-school sets from mpavle1/naloge. */
export const mostUsedExercises: MostUsedExercise[] = [
  {
    id: "linearna",
    label: L("Linearna funkcija", "Linear function"),
    url: "https://www2.arnes.si/~mpavle1/naloge/1gim_11.html",
  },
  {
    id: "sistemi",
    label: L("Sistemi enačb", "Systems of equations"),
    url: "https://www2.arnes.si/~mpavle1/naloge/1gim_12.html",
  },
  {
    id: "racio",
    label: L("Racionalna in realna števila", "Rational and real numbers"),
    url: "https://www2.arnes.si/~mpavle1/naloge/1racio.html",
  },
  {
    id: "procenti",
    label: L("Sklepni in procentni račun", "Proportions and percentages"),
    url: "https://www2.arnes.si/~mpavle1/naloge/1eko_11a.html",
  },
  {
    id: "kvadratna",
    label: L("Kvadratna funkcija", "Quadratic function"),
    url: "https://www2.arnes.si/~mpavle1/naloge/2gim_15.html",
  },
  {
    id: "potence",
    label: L("Potence in koreni", "Powers and roots"),
    url: "https://www2.arnes.si/~mpavle1/naloge/2gim_14.html",
  },
  {
    id: "geometrija",
    label: L("Geometrija v ravnini", "Plane geometry"),
    url: "https://www2.arnes.si/~mpavle1/naloge/2gim_10.html",
  },
  {
    id: "enacbe-or",
    label: L("Enačbe in neenačbe (matura OR)", "Equations (matura OR)"),
    url: "https://www2.arnes.si/~mpavle1/naloge/pzm2or.html",
  },
  {
    id: "enacbe-vr",
    label: L("Enačbe in neenačbe (matura VR)", "Equations (matura VR)"),
    url: "https://www2.arnes.si/~mpavle1/naloge/pzm2vr.html",
  },
  {
    id: "funkcije-or",
    label: L("Funkcije (matura OR)", "Functions (matura OR)"),
    url: "https://www2.arnes.si/~mpavle1/naloge/pzm4or.html",
  },
  {
    id: "funkcije-vr",
    label: L("Funkcije (matura VR)", "Functions (matura VR)"),
    url: "https://www2.arnes.si/~mpavle1/naloge/pzm4vr.html",
  },
  {
    id: "mesane-or",
    label: L("Mešane naloge (matura OR)", "Mixed (matura OR)"),
    url: "https://www2.arnes.si/~mpavle1/naloge/pzmmixor.html",
  },
];

export function mostUsedTabLabel(lang: LangCode): string {
  const map: Record<LangCode, string> = {
    sl: "Priljubljene",
    en: "Most used",
    it: "Popolari",
    de: "Beliebt",
    fr: "Populaires",
    es: "Populares",
    pl: "Popularne",
    ro: "Populare",
  };
  return map[lang] || map.en;
}
