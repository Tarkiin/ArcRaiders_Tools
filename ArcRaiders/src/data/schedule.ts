export const MAPS = ["DAM", "BURIED CITY", "SPACE PORT", "BLUE GATE", "STELLA MONTIS"] as const;
export type MapName = (typeof MAPS)[number];

export const EVENTS = [
  "Harvester",
  "Matriarch",
  "Night Raid",
  "Uncovered Caches",
  "Electromagnetic Storm",
  "Lush Blooms",
  "Prospecting Probes",
  "Husk Graveyard",
  "Launch Tower Loot",
  "Hidden Bunker",
  "Locked Gate",
] as const;
export type EventName = (typeof EVENTS)[number];

export const MAP_LABELS: Record<MapName, string> = {
  DAM: "Presa",
  "BURIED CITY": "Ciudad enterrada",
  "SPACE PORT": "Puerto espacial",
  "BLUE GATE": "Puerta azul",
  "STELLA MONTIS": "Stella Montis",
};

export const EVENT_LABELS: Record<EventName, string> = {
  Harvester: "Cosechadora",
  Matriarch: "Matriarca",
  "Night Raid": "Incursión nocturna",
  "Uncovered Caches": "Alijos descubiertos",
  "Electromagnetic Storm": "Tormenta electromagnética",
  "Lush Blooms": "Floraciones exuberantes",
  "Prospecting Probes": "Sondas",
  "Husk Graveyard": "Cascarones",
  "Launch Tower Loot": "Botín de la torre de lanzamiento",
  "Hidden Bunker": "Búnker oculto",
  "Locked Gate": "Puerta bloqueada",
};

export function mapLabel(map: MapName) {
  return MAP_LABELS[map];
}

export function eventLabel(event: EventName) {
  return EVENT_LABELS[event];
}

// Schedule source: https://arcraidershub.com/data/events.json (UTC hours)
export const EVENT_SCHEDULE: Record<string, Record<MapName, EventName[]>> = {
  "0:00": {
    DAM: [],
    "BURIED CITY": ["Lush Blooms"],
    "SPACE PORT": [],
    "BLUE GATE": ["Night Raid"],
    "STELLA MONTIS": [],
  },
  "1:00": {
    DAM: ["Lush Blooms"],
    "BURIED CITY": [],
    "SPACE PORT": ["Electromagnetic Storm"],
    "BLUE GATE": [],
    "STELLA MONTIS": [],
  },
  "2:00": {
    DAM: ["Night Raid"],
    "BURIED CITY": [],
    "SPACE PORT": [],
    "BLUE GATE": ["Matriarch"],
    "STELLA MONTIS": ["Night Raid"],
  },
  "3:00": {
    DAM: [],
    "BURIED CITY": ["Night Raid"],
    "SPACE PORT": ["Matriarch"],
    "BLUE GATE": ["Electromagnetic Storm"],
    "STELLA MONTIS": [],
  },
  "4:00": {
    DAM: [],
    "BURIED CITY": ["Uncovered Caches"],
    "SPACE PORT": ["Night Raid"],
    "BLUE GATE": [],
    "STELLA MONTIS": ["Night Raid"],
  },
  "5:00": {
    DAM: ["Uncovered Caches"],
    "BURIED CITY": [],
    "SPACE PORT": [],
    "BLUE GATE": ["Lush Blooms"],
    "STELLA MONTIS": [],
  },
  "6:00": {
    DAM: ["Electromagnetic Storm"],
    "BURIED CITY": [],
    "SPACE PORT": [],
    "BLUE GATE": ["Night Raid"],
    "STELLA MONTIS": [],
  },
  "7:00": {
    DAM: [],
    "BURIED CITY": ["Night Raid"],
    "SPACE PORT": ["Launch Tower Loot", "Electromagnetic Storm"],
    "BLUE GATE": [],
    "STELLA MONTIS": [],
  },
  "8:00": {
    DAM: [],
    "BURIED CITY": ["Lush Blooms"],
    "SPACE PORT": [],
    "BLUE GATE": ["Matriarch"],
    "STELLA MONTIS": ["Night Raid"],
  },
  "9:00": {
    DAM: ["Harvester"],
    "BURIED CITY": [],
    "SPACE PORT": [],
    "BLUE GATE": ["Electromagnetic Storm"],
    "STELLA MONTIS": ["Night Raid"],
  },
  "10:00": {
    DAM: ["Night Raid"],
    "BURIED CITY": [],
    "SPACE PORT": ["Night Raid"],
    "BLUE GATE": [],
    "STELLA MONTIS": [],
  },
  "11:00": {
    DAM: [],
    "BURIED CITY": ["Night Raid"],
    "SPACE PORT": ["Lush Blooms"],
    "BLUE GATE": ["Harvester"],
    "STELLA MONTIS": [],
  },
  "12:00": {
    DAM: [],
    "BURIED CITY": ["Uncovered Caches"],
    "SPACE PORT": [],
    "BLUE GATE": ["Night Raid"],
    "STELLA MONTIS": [],
  },
  "13:00": {
    DAM: ["Matriarch"],
    "BURIED CITY": [],
    "SPACE PORT": ["Electromagnetic Storm"],
    "BLUE GATE": [],
    "STELLA MONTIS": [],
  },
  "14:00": {
    DAM: ["Electromagnetic Storm"],
    "BURIED CITY": [],
    "SPACE PORT": [],
    "BLUE GATE": ["Matriarch"],
    "STELLA MONTIS": ["Night Raid"],
  },
  "15:00": {
    DAM: [],
    "BURIED CITY": ["Night Raid"],
    "SPACE PORT": ["Launch Tower Loot"],
    "BLUE GATE": ["Electromagnetic Storm"],
    "STELLA MONTIS": [],
  },
  "16:00": {
    DAM: [],
    "BURIED CITY": ["Lush Blooms"],
    "SPACE PORT": ["Night Raid"],
    "BLUE GATE": [],
    "STELLA MONTIS": ["Night Raid"],
  },
  "17:00": {
    DAM: ["Lush Blooms"],
    "BURIED CITY": [],
    "SPACE PORT": [],
    "BLUE GATE": ["Uncovered Caches"],
    "STELLA MONTIS": [],
  },
  "18:00": {
    DAM: ["Night Raid"],
    "BURIED CITY": [],
    "SPACE PORT": [],
    "BLUE GATE": ["Night Raid"],
    "STELLA MONTIS": [],
  },
  "19:00": {
    DAM: [],
    "BURIED CITY": ["Night Raid"],
    "SPACE PORT": ["Matriarch", "Electromagnetic Storm"],
    "BLUE GATE": [],
    "STELLA MONTIS": [],
  },
  "20:00": {
    DAM: [],
    "BURIED CITY": ["Uncovered Caches"],
    "SPACE PORT": [],
    "BLUE GATE": ["Harvester"],
    "STELLA MONTIS": [],
  },
  "21:00": {
    DAM: ["Harvester"],
    "BURIED CITY": [],
    "SPACE PORT": [],
    "BLUE GATE": ["Electromagnetic Storm"],
    "STELLA MONTIS": ["Night Raid"],
  },
  "22:00": {
    DAM: ["Electromagnetic Storm"],
    "BURIED CITY": [],
    "SPACE PORT": ["Night Raid"],
    "BLUE GATE": [],
    "STELLA MONTIS": ["Night Raid"],
  },
  "23:00": {
    DAM: [],
    "BURIED CITY": ["Night Raid"],
    "SPACE PORT": ["Harvester"],
    "BLUE GATE": ["Lush Blooms"],
    "STELLA MONTIS": [],
  },
};
