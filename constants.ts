import { CaseStudy, Service } from './types';

export const XEEL_CONTEXT = `
You are the AI assistant for Xeel, an innovation partner company specialized in AI (Predictive, Generative, and Agentic).
Xeel's mission is to help clients understand opportunities, adopt AI technologies, and stay ahead of the curve.

Core Services:
1. Adoption: Change management, Upskilling, Training (Executive, Manager, Operational).
2. Strategy: Process analysis, Vibe coding, Ideation workshops, Roadmaps, ROI measurement.
3. Delivery: Custom AI solutions, Staffing (Time & Material, as-a-Service), Governance, Proprietary products (Under Control, CosmetiQ).

Key Clients include: Hitachi Energy, IBS Progetti, Co-Robotics, Basisgroup, Spinox, Comdata, Akeron, Kedos, Remira, Novarese, Pratikagroup.

New Product: "Xeel Knowledge Base AI" (Archive Digitization).
- Transforms technical archives (PDF, CAD, Images) into an active knowledge base.
- Features: Vector Database, ChatGPT 5 On-Demand or DeepSeek (On-prem), Conversational Search, Drag & Drop, Graphic Modules.
- Deployment Models:
  1. In Cloud: Scalable, OpenAI/Gemini based. Data leaves the perimeter.
  2. On Premise: Max privacy, Local Server, DeepSeek/Gemma based. Data STAYS in the company.

Case Studies (Use these to answer specific questions):
- Logistics: Optimized supply chain network for a fashion multinational using predictive models.
- Pharma: Early diagnosis of PAH using hospital data and ML.
- Telco: Broadband activation forecasting for 8000+ municipalities.
- Energy: Computer vision for safety compliance (PPE detection) in electrical infrastructure.
- Automotive (Docs): Document automation (OCR/NLP) for invoices/DDT.
- Automotive (Quality): Quality control on production lines using computer vision.
- Media: Generative AI for automatic video content creation from text.
- HR (Assessment): Soft skills assessment using NLP.
- HR (Onboarding): Agentic AI for onboarding temporary workers.
- Manufacturing: Roadmap for humanoid robotics adoption (Physical AI).
- Plastics: Process optimization using ML and Generative AI to reduce energy/costs.
- Nutrition: Genetic algorithms for personalized nutrition plans.
- Cosmetics: AI-driven data ecosystem connecting ingredients, products, and reviews.
- Genomics: Precision medicine platform for rare diseases.
- Supply Chain: Reorder point optimization to prevent stockouts.

Tone: Professional, innovative, helpful, concise.
`;

export const SERVICES: Service[] = [
  {
    id: 'adoption',
    title: 'Adoption',
    description: 'Aiutiamo persone e team a integrare l’AI nel lavoro quotidiano, sviluppando competenze e fiducia.',
    details: ['Change Management', 'Upskilling & Gap Analysis', 'Formazione Executive & Operativa'],
    iconName: 'users',
    color: 'bg-pink-500'
  },
  {
    id: 'strategy',
    title: 'Strategy',
    description: 'Trasformiamo l’AI in leva concreta di riorganizzazione e vantaggio competitivo.',
    details: ['Analisi Processi & Vibe Coding', 'Ideazione & Roadmap', 'Business Case & ROI'],
    iconName: 'compass',
    color: 'bg-orange-500'
  },
  {
    id: 'delivery',
    title: 'Delivery',
    description: 'Dalla strategia alla realtà: soluzioni custom, prodotti pronti e governance dei progetti.',
    details: ['Sviluppo Soluzioni Custom', 'Staffing & Team Augmentation', 'Governance Tecnica'],
    iconName: 'rocket',
    color: 'bg-blue-500'
  }
];

export const WORKFLOW_INFO = {
  cloud: {
    title: "In Cloud Flow",
    description: "Architettura SaaS: Interfaccia e AI nel Cloud, Storage sincronizzato.",
    steps: [
      { title: "1. Richiesta Web", desc: "L'utente accede alla Web App (Interface) ospitata nel Cloud Esterno." },
      { title: "2. Sync Dati", desc: "Lo Storage Aziendale sincronizza i documenti con il Vector DB (Cloud Cliente)." },
      { title: "3. Ricerca Vettoriale", desc: "L'Interfaccia interroga il Vector DB per trovare i documenti pertinenti." },
      { title: "4. Processing AI", desc: "Il Vector DB invia il contesto a OpenAI (Cloud Esterno)." },
      { title: "5. Generazione Risposta", desc: "OpenAI elabora la risposta e la invia all'Interfaccia Web." },
      { title: "6. Visualizzazione", desc: "L'utente visualizza i risultati finali e i documenti sull'Interfaccia." }
    ],
    pros: ["Scalabilità Immediata", "Accesso Ovunque", "Manutenzione Zero"],
    cons: ["Dipendenza da provider esterni"]
  },
  onPremise: {
    title: "On Premise Flow",
    description: "Architettura Locale: Tutto risiede sui server aziendali. Nessun dato esce.",
    steps: [
      { title: "1. Richiesta Intranet", desc: "L'utente accede alla Piattaforma AI ospitata nel Data Center Aziendale." },
      { title: "2. Sync Locale", desc: "Lo Storage interno alimenta il Vector DB locale via rete LAN sicura." },
      { title: "3. Ricerca Interna", desc: "L'Interfaccia interroga il Vector DB locale per recuperare i dati." },
      { title: "4. Processing Locale", desc: "Il modello LLM Service (ospitato localmente) elabora la richiesta." },
      { title: "5. Risposta AI", desc: "L'AI genera la risposta senza mai connettersi a internet." },
      { title: "6. Visualizzazione", desc: "L'utente riceve i dati. Tutto il traffico rimane nel perimetro aziendale." }
    ],
    pros: ["Massima Compliance", "Controllo totale", "Nessuna fuga di dati"],
    cons: ["Costo hardware iniziale", "Gestione infrastruttura"]
  }
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'logistics',
    title: 'Ottimizzazione Network Logistico',
    industry: 'Fashion / Logistics',
    tags: ['#AI4Logistics', '#SupplyChain', '#PredictiveAI'],
    context: 'Primaria multinazionale del fashion con network complesso e costi in crescita.',
    objective: 'Ridurre costi supply chain e ottimizzare tempi di consegna.',
    solution: 'Modelli predittivi e simulazione dei flussi. Ottimizzazione matematica dei nodi della rete.',
    result: 'Network ristrutturato su base data-driven. Configurazione ottimale identificata.',
    imageSeed: 101
  },
  {
    id: 'pharma',
    title: 'Diagnosi Precoce PAH',
    industry: 'Pharma / Health',
    tags: ['#AI4Health', '#RareDisease', '#EarlyDetection'],
    context: 'Patologia rara (PAH) spesso diagnosticata tardivamente.',
    objective: 'Sfruttare dati ospedalieri per anticipare la diagnosi.',
    solution: 'ML su dati di fruizione ospedaliera per individuare pattern ricorrenti.',
    result: 'Sistema di allerta precoce per pazienti a rischio. Miglior diagnosi tempestiva.',
    imageSeed: 102
  },
  {
    id: 'energy',
    title: 'Sicurezza Infrastrutture Energetiche',
    industry: 'Energy / Utility',
    tags: ['#ComputerVision', '#SafetyAI', '#DeepLearning'],
    context: 'Necessità di garantire rispetto normative sicurezza in cabine elettriche.',
    objective: 'Verificare automaticamente dotazioni individuali (DPI) e procedure.',
    solution: 'Computer vision per rilevamento DPI (casco, guanti) e procedure in tempo reale.',
    result: 'Maggiore sicurezza operatori, controlli standardizzati, riduzione incidenti.',
    imageSeed: 103
  },
  {
    id: 'automotive-quality',
    title: 'Controllo Qualità & Etichettatura',
    industry: 'Automotive',
    tags: ['#ComputerVision', '#QualityControl', '#Industry40'],
    context: 'Garantire conformità pacchi ed etichette su linea produttiva.',
    objective: 'Rilevare errori in tempo reale e supportare operatori.',
    solution: 'Telecamere con Deep Learning per riconoscimento etichette e non conformità.',
    result: 'Rilevazione automatica errori, aumento efficienza, riduzione rischi.',
    imageSeed: 104
  },
  {
    id: 'media',
    title: 'Generazione Contenuti Video',
    industry: 'Media & Entertainment',
    tags: ['#GenerativeAI', '#VideoGeneration', '#ContentAutomation'],
    context: 'Ridurre tempi e costi produzione video personalizzati.',
    objective: 'Generare video da testi descrittivi valorizzando archivio interno.',
    solution: 'Sistema GenAI per media. Generazione storyboard e sequenze da testo.',
    result: 'Video coerenti in tempi ridotti. Valorizzazione asset multimediali.',
    imageSeed: 105
  },
  {
    id: 'hr-agent',
    title: 'Agentic AI per Onboarding',
    industry: 'HR / Staffing',
    tags: ['#AgenticAI', '#AutonomousAgents', '#HRTech'],
    context: 'Gestione scalabile onboarding lavoratori occasionali.',
    objective: 'Automatizzare onboarding e migliorare retention.',
    solution: 'Agente AI autonomo integrato con sistemi HR per gestione pratiche.',
    result: 'Onboarding automatizzato, miglior esperienza lavoratore, maggiore efficienza.',
    imageSeed: 106
  },
   {
    id: 'manufacturing-robotics',
    title: 'Roadmap Robotica Umanoide',
    industry: 'Manufacturing',
    tags: ['#PhysicalAI', '#HumanoidRobots', '#FutureOfWork'],
    context: 'Azienda meccanica precisione in forte crescita.',
    objective: 'Pianificare adozione robot umanoidi (Physical AI).',
    solution: 'Analisi processi manuali, definizione scenari con 200-300 robot, roadmap 5-7 anni.',
    result: 'Piano strategico chiaro, stima impatto economico, posizionamento early adopter.',
    imageSeed: 107
  },
  {
    id: 'cosmetics',
    title: 'Ecosistema Dati Cosmetici',
    industry: 'Cosmetics / Skincare',
    tags: ['#DataEcosystem', '#GenAI', '#ConsumerInsights'],
    context: 'Dati frammentati tra ingredienti, prodotti e recensioni.',
    objective: 'Creare ecosistema integrato e navigabile con AI.',
    solution: 'Data unification, arricchimento con GenAI, sentiment analysis avanzata.',
    result: 'Ecosistema completo AI-driven, nuove capacità di innovazione prodotto.',
    imageSeed: 108
  }
];

export const STATS = [
  { label: 'Workshop AI Erogati', value: '50+' },
  { label: 'Partecipanti', value: '3000+' },
  { label: 'Sessioni di Ideazione', value: '100+' },
];