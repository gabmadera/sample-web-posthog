export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  emoji: string;
  gradient: string; // tailwind classes for the image placeholder tile
  description: string;
  specs: [label: string, value: string][];
}

export const products: Product[] = [
  {
    id: "aurora-lamp",
    name: "Aurora Desk Lamp",
    tagline: "Adaptive light that follows your focus.",
    price: 129,
    emoji: "💡",
    gradient: "from-accent to-accent-deep",
    description:
      "A desk lamp that tunes its color temperature to the time of day and your calendar. Warm for deep work, cool for calls, off when you leave.",
    specs: [
      ["Lumens", "800 lm"],
      ["Color range", "1800K–6500K"],
      ["Connectivity", "Wi-Fi, Thread"],
      ["Power", "USB-C, 15W"],
    ],
  },
  {
    id: "halo-bulb",
    name: "Halo Smart Bulb",
    tagline: "Sixteen million colors, one tap.",
    price: 39,
    emoji: "🔆",
    gradient: "from-accent-mid to-navy",
    description:
      "Our best-selling A19 bulb. Scenes, schedules, and sunrise alarms with no hub required.",
    specs: [
      ["Lumens", "1100 lm"],
      ["Socket", "E26 / A19"],
      ["Connectivity", "Wi-Fi, Bluetooth"],
      ["Lifespan", "25,000 h"],
    ],
  },
  {
    id: "drift-strip",
    name: "Drift Light Strip",
    tagline: "Two meters of ambient glow.",
    price: 59,
    emoji: "🌈",
    gradient: "from-accent-200 to-accent",
    description:
      "Addressable LED strip with music sync and gradient scenes. Cut to length, extend to ten meters.",
    specs: [
      ["Length", "2 m (extendable)"],
      ["LEDs", "60/m addressable"],
      ["Connectivity", "Wi-Fi"],
      ["Mount", "3M adhesive"],
    ],
  },
  {
    id: "beacon-hub",
    name: "Beacon Home Hub",
    tagline: "Every device, one quiet brain.",
    price: 99,
    emoji: "📡",
    gradient: "from-navy to-accent-deep",
    description:
      "Bridges Thread, Zigbee, and Wi-Fi devices into one local, private network. Automations run on the hub, not the cloud.",
    specs: [
      ["Radios", "Thread, Zigbee, BLE"],
      ["Storage", "Local, encrypted"],
      ["Ports", "Ethernet, USB-C"],
      ["Matter", "Certified"],
    ],
  },
  {
    id: "ember-sconce",
    name: "Ember Wall Sconce",
    tagline: "Gallery light, living-room price.",
    price: 149,
    emoji: "🕯️",
    gradient: "from-accent-deep to-navy",
    description:
      "Cast-aluminum sconce with a soft uplight and a dimmable reading beam. Hardwired or plug-in.",
    specs: [
      ["Lumens", "600 lm"],
      ["Finish", "Matte graphite"],
      ["Install", "Hardwire or plug-in"],
      ["Dimming", "0.1%–100%"],
    ],
  },
  {
    id: "orbit-pendant",
    name: "Orbit Pendant",
    tagline: "A halo for the dining table.",
    price: 219,
    emoji: "⭕",
    gradient: "from-accent to-accent-200",
    description:
      "Ring pendant with independently controllable inner and outer light. Scene-aware from dinner to homework.",
    specs: [
      ["Diameter", "60 cm"],
      ["Lumens", "2400 lm"],
      ["Drop", "Adjustable 40–150 cm"],
      ["Connectivity", "Thread"],
    ],
  },
  {
    id: "pulse-sensor",
    name: "Pulse Motion Sensor",
    tagline: "Lights that anticipate you.",
    price: 29,
    emoji: "👁️",
    gradient: "from-ink-700 to-navy",
    description:
      "mmWave presence sensing — knows you're there even when you're still. Two-year battery, magnetic mount.",
    specs: [
      ["Sensing", "mmWave presence"],
      ["Battery", "24 months"],
      ["Range", "6 m, 120°"],
      ["Connectivity", "Thread"],
    ],
  },
  {
    id: "tide-switch",
    name: "Tide Scene Switch",
    tagline: "Four buttons, endless moods.",
    price: 49,
    emoji: "🎛️",
    gradient: "from-accent-mid to-accent",
    description:
      "Wireless scene controller that sticks anywhere. Tap, double-tap, and hold gestures on each button.",
    specs: [
      ["Buttons", "4, multi-gesture"],
      ["Battery", "18 months"],
      ["Mount", "Magnetic plate"],
      ["Connectivity", "Bluetooth, Thread"],
    ],
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatPrice(value: number): string {
  return `$${value.toFixed(2)}`;
}
