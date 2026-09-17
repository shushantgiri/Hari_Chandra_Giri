export interface JourneyMilestone {
  id: string;
  /** Display label for the marker — an age, a year, or a short phrase. */
  marker: string;
  title: string;
  description: string;
}

// Hari's exact birth year isn't part of the public record, so the earliest
// milestone is deliberately labelled by age rather than a guessed calendar
// year. Everything from 2021 onward ties directly to a dated, sourced record
// in lib/records.ts. His reported age in press coverage (29 in mid-2023, 31
// by mid-2026) places his first record at roughly 26–27 years old — nearly
// two decades after he started at age 8 — which is the throughline the
// descriptions below are built around.
export const journey: JourneyMilestone[] = [
  {
    id: "start",
    marker: "AGE 8",
    title: "First steps, on his hands",
    description:
      "No records to chase yet — just a child in Nepal, building the balance and strength that would take years of quiet repetition to pay off.",
  },
  {
    id: "army",
    marker: "2014",
    title: "Joins the Nepal Army",
    description:
      "Service and structure that ran alongside years of hand-walking practice most people never saw.",
  },
  {
    id: "2021",
    marker: "2021",
    title: "First world record",
    description:
      "Nearly two decades after he started, 50 stairs in 12.65 seconds finally put his name in the record books — his first Guinness World Records title.",
  },
  {
    id: "2022",
    marker: "2022",
    title: "Two records, one day",
    description: "Two records in one day, on the same Kathmandu track.",
  },
  {
    id: "2023",
    marker: "2023",
    title: "75 stairs, Jamchen Vijaya Stupa",
    description:
      "The previous record had stood for nine years. Hari broke it on the steps of a Buddhist temple above the Kathmandu Valley, averaging three steps a second.",
  },
  {
    id: "2024",
    marker: "2024",
    title: "Onto a tyre",
    description:
      "A change of discipline, not a rest — 120 skips on an upright tyre in one minute, testing a completely different kind of control.",
  },
  {
    id: "2025",
    marker: "2025",
    title: "London",
    description:
      "Even on a trip to London, the training didn't stop — 500 ml of lemon juice, gone in 24 seconds, upside down.",
  },
  {
    id: "2026",
    marker: "2026",
    title: "100 stairs, Yunyang",
    description:
      "Six months of daily training — wet steps, dry steps, every condition he could find — before the most dangerous attempt of his career: 100 stairs, upside down, in 44.71 seconds.",
  },
];
