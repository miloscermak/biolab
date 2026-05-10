// Otázky kvízu. Přidat / upravit lze přímo zde, deploy se spustí automaticky po pushi.
export const QUESTIONS = [
  {
    q: "Jaký je hlavní rozdíl mezi cytologickým a histologickým vyšetřením?",
    options: [
      "Cytologie hodnotí pouze živé buňky, zatímco histologie pouze mrtvou tkáň.",
      "Cytologie je vhodná jen pro infekce, histologie jen pro nádory.",
      "Cytologie hodnotí hlavně jednotlivé buňky nebo buněčné skupiny, histologie navíc posuzuje architekturu tkáně.",
      "Cytologie se používá pouze u krve, histologie pouze u kostní dřeně."
    ],
    correct: 2,
    explanation: "Cytologie sleduje hlavně buňky; histologie hodnotí i prostorové uspořádání tkáně."
  },
  {
    q: "Proč se bioptický vzorek často ihned po odběru fixuje například formalinem?",
    options: [
      "Aby se zachovala struktura tkáně a zpomalil rozklad buněk po odběru.",
      "Aby se ve vzorku začaly rychleji množit nádorové buňky pro snazší diagnostiku.",
      "Aby se z tkáně odstranily všechny bílkoviny a zůstala pouze DNA.",
      "Aby se vzorek stal sterilním a tím použitelným pro kultivaci bakterií."
    ],
    correct: 0,
    explanation: "Fixace stabilizuje tkáň po odběru a pomáhá zachovat morfologii pro další zpracování."
  },
  {
    q: "Co nejlépe vystihuje rozdíl mezi FNA a core needle biopsy?",
    options: [
      "FNA je vždy chirurgický zákrok v celkové anestezii, core biopsy je vždy neinvazivní test.",
      "FNA se používá pouze pro cytologii štítné žlázy, core biopsy pouze pro nádory prsu.",
      "FNA poskytuje vždy spolehlivější informaci o architektuře tkáně než core biopsy.",
      "FNA typicky odebírá tenkou jehlou buňky nebo tekutinu, core biopsy odebírá váleček tkáně."
    ],
    correct: 3,
    explanation: "FNA je tenkojehlová aspirace buněk/tekutiny; core biopsy poskytuje váleček tkáně."
  },
  {
    q: "Co obvykle ukazuje základní histologické barvení H&E?",
    options: [
      "Přítomnost konkrétní mutace v nádorové DNA.",
      "Obecnou morfologii tkáně: jádra, cytoplazmu, vazivo a uspořádání buněk.",
      "Výhradně přítomnost virů v buňkách.",
      "Pouze expresi jednoho konkrétního proteinu v nádorové tkáni."
    ],
    correct: 1,
    explanation: "H&E je základní morfologické barvení, nikoli molekulární ani specificky proteinový test."
  },
  {
    q: "Jaký je vztah mezi Pap testem a HPV testem v cervikálním screeningu?",
    options: [
      "Pap test i HPV test jsou totéž vyšetření, jen se používají různé názvy podle země.",
      "Pap test detekuje přímo DNA viru HPV, zatímco HPV test hodnotí vzhled buněk.",
      "Pap test hodnotí buněčné změny na čípku, zatímco HPV test hledá přítomnost rizikových typů lidského papilomaviru.",
      "Pap test slouží hlavně k ověření, zda účastníci workshopu umí správně vyslovit „Papanicolaou“."
    ],
    correct: 2,
    explanation: "Pap test hledá buněčné změny; HPV test detekuje rizikové typy viru HPV."
  },
  {
    q: "K čemu slouží imunohistochemie?",
    options: [
      "K průkazu konkrétních proteinů nebo antigenů v tkáni pomocí protilátek.",
      "K přímému čtení pořadí nukleotidů v DNA.",
      "K určení počtu kopií celého genomu v každé buňce bez mikroskopu.",
      "K nahrazení všech běžných histologických barvení jedním univerzálním testem."
    ],
    correct: 0,
    explanation: "IHC využívá protilátky k průkazu konkrétních proteinů v tkáni."
  },
  {
    q: "Co je základní princip PCR?",
    options: [
      "Převedení bílkovin na DNA pomocí enzymu polymerázy.",
      "Zobrazení buněk ve tkáni pomocí fluorescenčního mikroskopu.",
      "Náhodné sekvenování celého genomu bez předem vybraného cíle.",
      "Mnohonásobné namnožení vybraného úseku DNA, aby jej bylo možné detekovat nebo analýzovat."
    ],
    correct: 3,
    explanation: "PCR amplifikuje vybraný úsek DNA."
  },
  {
    q: "V čem spočívá hlavní výhoda NGS oproti klasickému vyšetření jednoho genu?",
    options: [
      "NGS vždy zcela nahrazuje mikroskopické vyšetření patologem.",
      "NGS umožňuje paralelně analyzovat mnoho úseků DNA nebo RNA v jedné analýze.",
      "NGS funguje pouze u infekčních onemocnění, nikoli u nádorů.",
      "NGS nevyžaduje žádnou interpretaci, protože výsledek je vždy jednoznačný."
    ],
    correct: 1,
    explanation: "NGS umožňuje paralelní analýzu mnoha genetických oblastí."
  },
  {
    q: "Proč se u nádorů testují mutace, fúze genů nebo jiné biomarkery?",
    options: [
      "Mohou pomoci zpřesnit diagnózu, odhadnout chování nádoru nebo vybrat cílenou léčbu.",
      "Slouží pouze k potvrzení, že vzorek opravdu pochází z lidské tkáně.",
      "Používají se hlavně proto, že molekulární test je vždy levnější než mikroskopie.",
      "Jsou potřeba jen u benigních nádorů, u zhoubných nádorů význam nemají."
    ],
    correct: 0,
    explanation: "Biomarkery mohou mít diagnostický, prognostický i prediktivní význam."
  },
  {
    q: "Co znamená, když se mluví o metylaci DNA?",
    options: [
      "Jde o přímé rozstříhání chromozomů na kratší úseky.",
      "Jde o typ barvení, které odlišuje cytoplazmu od buněčného jádra.",
      "Jde o změnu pořadí písmen DNA, tedy vždy o mutaci.",
      "Jde o epigenetickou úpravu DNA, která může ovlivnit aktivitu genů, aniž by změnila samotnou sekvenci DNA."
    ],
    correct: 3,
    explanation: "Metylace je epigenetická změna, která může měnit aktivitu genů bez změny sekvence."
  }
];
