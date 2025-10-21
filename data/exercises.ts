export interface Exercise {
  id: string;
  title: string;
  content: string;
  solution?: string;
}

export const izjaveInMnoziceExercises: Exercise[] = [
  {
    id: "izjave-1",
    title: "Ugotovi pravilnost izjav",
    content: `Ugotovi, katera od naslednjih izjav je pravilna in katera napačna:

(a) Število 2 je praštevilo, ali pa je število 17 sodo.
(b) Število 2 je praštevilo in število 17 je sodo.
(c) Ni res, da je število 7 večje od 2 in število 8 manjše od 2.
(d) Če je 27 praštevilo, potem je število 7 edina rešitev enačbe $\\frac{x+\\sqrt{x+2}}{x-2}=2$.`,
    solution: "**Rešitev:** Izjava je: (a) pravilna, (b) napačna, (c) pravilna, (d) pravilna."
  },
  {
    id: "izjave-2", 
    title: "Pravilnostna tabela",
    content: `Zapiši pravilnostno tabelo za izjavo: $(A \\land B) \\Rightarrow \\lnot C$`,
    solution: `**Rešitev:**

$$\\begin{array}{ccc|c} 
A & B & C & (A \\land B) \\Rightarrow \\lnot C \\cr\\hline 
p & p & p & n \\cr 
p & p & n & p \\cr 
p & n & p & p \\cr 
p & n & n & p \\cr 
n & p & p & p \\cr 
n & p & n & p \\cr 
n & n & p & p \\cr 
n & n & n & p 
\\end{array}$$`
  },
  {
    id: "izjave-3",
    title: "Tavtologija",
    content: `Ugotovi, ali je naslednja izjava tavtologija: $(A \\land B) \\Rightarrow (B \\lor C)$`,
    solution: "**Rešitev:** Ta izjava je tavtologija."
  },
  {
    id: "izjave-4",
    title: "Sestavljene izjave",
    content: `Podane so naslednje štiri sestavljene izjave:
- Prva izjava: $\\lnot(A\\land B)$
- Druga izjava: $\\lnot A\\Rightarrow \\lnot B$
- Tretja izjava: $A\\Rightarrow (B\\Rightarrow A)$
- Četrta izjava: $A\\Rightarrow (A\\land \\lnot B)$

(a) Katera od teh izjav je tavtologija?
(b) Kateri dve izjavi sta enakovredni?`,
    solution: "**Rešitev:** (a) Tretja izjava je tavtologija. (b) Prva in četrta izjava sta enakovredni."
  },
  {
    id: "izjave-5",
    title: "Enakovredne izjave",
    content: `S pomočjo pravilnostne tabele ugotovi, kateri preprostejši izjavi je enakovredna izjava: $(A \\lor B) \\Rightarrow \\lnot A$`,
    solution: "**Rešitev:** Enakovredna je izjavi $\\lnot A$."
  },
  {
    id: "mnozice-1",
    title: "Množice s formulo",
    content: `Zapiši naslednje množice s formulo:

$A=\\{7,~ 14,~ 21,~ 28,~ 35,~\\ldots\\}$
$B=\\{7,~ 11,~ 15,~ 19,~ 23,~\\ldots\\}$
$C=\\{1,~ 4,~ 9,~ 16,~ 25,~\\ldots\\}$`,
    solution: "**Rešitev:** $A=\\{7n;~ n\\in\\mathbb{N}\\}$, $B=\\{4n+3;~ n\\in\\mathbb{N}\\}$, $C=\\{n^2;~ n\\in\\mathbb{N}\\}$"
  },
  {
    id: "mnozice-2",
    title: "Množice z naštevanjem",
    content: `Zapiši naslednje množice z naštevanjem elementov:

$A=\\{30n;~ n\\in\\mathbb{N},~ n<5\\}$
$B=\\{n^3;~ n\\in\\mathbb{N},~ 5n<30\\}$
$C=\\{5n;~ n\\in\\mathbb{N},~ n^3<30\\}$`,
    solution: "**Rešitev:** $A=\\{30,~ 60,~ 90,~ 120\\}$, $B=\\{1,~ 8,~ 27,~ 64,~ 125\\}$, $C=\\{5,~ 10,~ 15\\}$"
  },
  {
    id: "mnozice-3",
    title: "Operacije z množicami",
    content: `Dane so množice $A=\\{2,~ 4,~ 6,~ 8,~ 10\\}$, $B=\\{1,~ 2,~ 3,~ 4\\}$ in $C=\\{4,~ 5,~ 6\\}$. Izračunaj:

(a) $A\\cap B\\cap C$
(b) $A\\setminus(B\\cup C)$
(c) $(A\\setminus B)\\cup C$`,
    solution: "**Rešitev:** (a) $A\\cap B\\cap C=\\{4\\}$; (b) $A\\setminus(B\\cup C)=\\{8,~ 10\\}$; (c) $(A\\setminus B)\\cup C=\\{4,~ 5,~ 6,~ 8,~ 10\\}$"
  },
  {
    id: "mnozice-4",
    title: "Kartezični produkt",
    content: `Dani sta množici $A=\\{1,~ 2,~ 3\\}$ in $B=\\{3,~ 4\\}$. Izračunaj:

(a) $A\\times B$
(b) $B\\times B$`,
    solution: "**Rešitev:** (a) $A\\times B=\\{(1,3),~ (1,4),~ (2,3),~ (2,4),~ (3,3),~ (3,4)\\}$; (b) $B\\times B=\\{(3,3),~ (3,4),~ (4,3),~ (4,4)\\}$"
  },
  {
    id: "mnozice-5",
    title: "Kompleksne operacije",
    content: `Podane so množice $A=\\{x;~ x\\in\\mathbb{N}~ \\land~ x<20\\}$, $B=\\{x;~ x\\in\\mathbb{N}~ \\land~ x>13\\}$ in $C=\\{2a+1;~ a\\in\\mathbb{N}\\}$. 

Zapiši množico $D=(A\\cap B)\\setminus C'$ z naštevanjem elementov.`,
    solution: "**Rešitev:** $D=\\{15, 17, 19\\}$"
  },
  {
    id: "mnozice-6",
    title: "Presek množic",
    content: `Dani sta množici $A=\\{2n;~ n\\in\\mathbb{N}\\}$ in $B=\\{25+15n;~ n\\in\\mathbb{N},~ n\\leq5\\}$. 

Zapiši množico $A\\cap B$ tako, da našteješ njene elemente.`,
    solution: "**Rešitev:** $A\\cap B=\\{40, 70, 100\\}$"
  },
  {
    id: "mnozice-7",
    title: "Presek z formulo",
    content: `Dani sta množici $A=\\{2n+5;~ n\\in\\mathbb{N}\\}$ in $B=\\{3n+2;~ n\\in\\mathbb{N}\\}$. 

Zapiši množico $D=A\\cap B$ s formulo.`,
    solution: "**Rešitev:** $D=\\{6n+5;~ n\\in\\mathbb{N}\\}$"
  },
  {
    id: "mnozice-8",
    title: "Komplement množice",
    content: `Dani sta množici $A=\\{3n;~ n\\in\\mathbb{Z}\\}$ in $B=\\{3n-1;~ n\\in\\mathbb{Z}\\}$. 

Zapiši množico $M=(A\\cup B)'$ s formulo. Upoštevaj $\\mathcal{U}=\\mathbb{Z}$.`,
    solution: "**Rešitev:** $M=\\{3n+1;~ n\\in\\mathbb{Z}\\}$"
  },
  {
    id: "mnozice-9",
    title: "Vennovi diagrami",
    content: `V dijaškem domu stanuje 120 dijakov. Naročijo se lahko na tri revije: Astronomija, Biznis in Cvetličarstvo. Na vsako od teh revij je naročenih 40 dijakov. Na Astronomijo in Biznis je naročenih 8 dijakov, na Astronomijo in Cvetličarstvo je naročenih 14 dijakov, na Biznis in Cvetličarstvo pa je naročenih 12 dijakov. Na vse tri revije je naročenih 5 dijakov.

Izračunaj:
(a) koliko dijakov ni naročenih na nobeno revijo,
(b) koliko dijakov je naročenih točno na eno revijo,
(c) koliko dijakov je naročenih vsaj na dve reviji.`,
    solution: "**Rešitev:** (a) 29 dijakov, (b) 67 dijakov, (c) 24 dijakov"
  },
  {
    id: "mnozice-10",
    title: "Potenčna množica",
    content: `Dana je množica $A=\\{0, 1, 2, 3, 4, 5, 6\\}$.

(a) Izračunaj $m(\\mathcal{P}A)$.
(b) Zapiši vse podmnožice množice A, ki so disjunktne z množico $B=\\{2n;~ n\\in\\mathbb{Z}\\}$.
(c) Zapiši z naštevanjem elementov množico $M=\\{X\\in\\mathcal{P}A;~ m(X)=2~ \\land~ 2\\in X\\}$.`,
    solution: `**Rešitev:** (a) $m(\\mathcal{P}A)=2^7=128$; (b) disjunktne so: $\\{\\},~ \\{1\\},~ \\{3\\},~ \\{5\\},~ \\{1,3\\},~ \\{1,5\\},~ \\{3,5\\},~ \\{1,3,5\\}$; (c) $M=\\big\\{ \\{0,2\\},~ \\{1,2\\},~ \\{2,3\\},~ \\{2,4\\},~ \\{2,5\\},~ \\{2,6\\} \\big\\}$`
  }
];
