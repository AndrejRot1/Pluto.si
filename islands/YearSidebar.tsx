import { useEffect, useState } from "preact/hooks";

interface YearGroup {
  year: string;
  topics: { title: string; items: string[] }[];
  schoolType?: 'osnovna' | 'srednja';
}

const data: YearGroup[] = [
  // Osnovna šola
  {
    year: "5. razred",
    schoolType: 'osnovna',
    topics: [
      { title: "Naravna števila", items: ["Seštevanje", "Odštevanje", "Množenje", "Deljenje"] },
      { title: "Geometrija", items: ["Koti", "Trikotniki", "Kvadrati", "Pravokotniki"] },
      { title: "Ulomki", items: ["Osnovni ulomki", "Seštevanje ulomkov", "Množenje ulomkov"] },
    ],
  },
  {
    year: "6. razred",
    schoolType: 'osnovna',
    topics: [
      { title: "Decimalna števila", items: ["Decimalni zapis", "Seštevanje", "Množenje"] },
      { title: "Geometrija", items: ["Obseg", "Površina", "Krogi", "Valji"] },
      { title: "Procenti", items: ["Osnovni procenti", "Izračuni", "Aplikacije"] },
    ],
  },
  {
    year: "7. razred",
    schoolType: 'osnovna',
    topics: [
      { title: "Algebra", items: ["Spremenljivke", "Enačbe", "Neenačbe"] },
      { title: "Geometrija", items: ["Podobnost", "Pitagorov izrek", "Trigonometrija"] },
      { title: "Statistika", items: ["Povprečje", "Mediana", "Grafi"] },
    ],
  },
  {
    year: "8. razred",
    schoolType: 'osnovna',
    topics: [
      { title: "Funkcije", items: ["Linearne funkcije", "Grafi", "Aplikacije"] },
      { title: "Geometrija", items: ["Prostorska geometrija", "Volumen", "Površina"] },
      { title: "Verjetnost", items: ["Osnovni koncepti", "Kombinatorika", "Aplikacije"] },
    ],
  },
  {
    year: "9. razred",
    schoolType: 'osnovna',
    topics: [
      { title: "Algebra", items: ["Kvadratne enačbe", "Polinomi", "Faktorizacija"] },
      { title: "Geometrija", items: ["Trigonometrija", "Vektorji", "Koordinatni sistem"] },
      { title: "Analiza", items: ["Limite", "Zveznost", "Osnove odvodov"] },
    ],
  },
  // Srednja šola
  {
    year: "1. letnik",
    schoolType: 'srednja',
    topics: [
      { title: "Algebra", items: ["Naravna števila", "Enačbe", "Neenačbe"] },
      { title: "Geometrija", items: ["Kotne funkcije", "Trikotniki"] },
    ],
  },
  {
    year: "2. letnik",
    schoolType: 'srednja',
    topics: [
      { title: "Funkcije", items: ["Linearne", "Kvadratne"] },
      { title: "Polinomi", items: ["Faktorizacija", "Ničle"] },
    ],
  },
  {
    year: "3. letnik",
    schoolType: 'srednja',
    topics: [
      { title: "Analiza", items: ["Limite", "Zveznost"] },
      { title: "Trigonometrija", items: ["Sinus", "Kosinus", "Tangens"] },
    ],
  },
  {
    year: "4. letnik",
    schoolType: 'srednja',
    topics: [
      { title: "Odvodi", items: ["Pravila odvajanja", "Ekstremi"] },
      { title: "Integrali", items: ["Nedoločeni", "Določeni"] },
      { title: "Verjetnost", items: ["Kombinatorika", "Porazdelitve"] },
    ],
  },
];

export default function YearSidebar() {
  async function handleTopicClick(topic: string, year: string) {
    try {
      console.log('Loading topic:', topic, 'for year:', year);
      
      // Send topic to AI for explanation
      const prompt = `Razloži matematično temo "${topic}" za ${year}. Podaj:
1. Kratko definicijo teme
2. Enostaven primer z rešitvijo
3. Kako se tema povezuje z drugimi matematičnimi koncepti

Tema: ${topic}
Letnik: ${year}`;
      
      const event = new CustomEvent("pluto-send", { detail: prompt });
      globalThis.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to load topic:', error);
    }
  }

  // Group data by school type
  const osnovnaSola = data.filter(item => item.schoolType === 'osnovna');
  const srednjaSola = data.filter(item => item.schoolType === 'srednja');

  return (
    <aside class="w-72 bg-white border-r border-gray-200 p-3 overflow-y-auto h-screen flex-shrink-0">
      <h2 class="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Matematične teme</h2>
      
      {/* Osnovna šola */}
      <div class="mb-6">
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Osnovna šola</h3>
        <div class="space-y-1">
          {osnovnaSola.map((g) => (
            <details class="group">
              <summary class="cursor-pointer list-none flex items-center justify-between select-none py-2 px-2 hover:bg-gray-50 rounded-md transition-colors">
                <span class="text-sm font-medium text-gray-700">{g.year}</span>
                <span class="text-xs text-gray-400 group-open:rotate-90 transition-transform">›</span>
              </summary>
              <div class="mt-1 ml-2 space-y-1">
                {g.topics.map((t) => (
                  <div class="mb-2">
                    <div class="text-xs font-medium text-gray-600 mb-1">{t.title}</div>
                    <ul class="space-y-0.5">
                      {t.items.map((label) => (
                        <li>
                          <button
                            type="button"
                            onClick={() => handleTopicClick(label, g.year)}
                            class="block w-full text-left text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded px-2 py-1 transition-colors"
                          >
                            {label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Srednja šola */}
      <div>
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Srednja šola</h3>
        <div class="space-y-1">
          {srednjaSola.map((g) => (
            <details class="group">
              <summary class="cursor-pointer list-none flex items-center justify-between select-none py-2 px-2 hover:bg-gray-50 rounded-md transition-colors">
                <span class="text-sm font-medium text-gray-700">{g.year}</span>
                <span class="text-xs text-gray-400 group-open:rotate-90 transition-transform">›</span>
              </summary>
              <div class="mt-1 ml-2 space-y-1">
                {g.topics.map((t) => (
                  <div class="mb-2">
                    <div class="text-xs font-medium text-gray-600 mb-1">{t.title}</div>
                    <ul class="space-y-0.5">
                      {t.items.map((label) => (
                        <li>
                          <button
                            type="button"
                            onClick={() => handleTopicClick(label, g.year)}
                            class="block w-full text-left text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded px-2 py-1 transition-colors"
                          >
                            {label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </aside>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[^\p{ASCII}]/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}