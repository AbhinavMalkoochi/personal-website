/** Daily samples of the repo at each day's last commit on main (2026). Lines are newline counts. */
export interface Day {
  date: string;
  agents: number;
  harness: number;
  journeys: number;
  product: number;
  rulings: number;
}

// [date, AGENTS.md, authored harness (no vendored skills or lint plugin), live journeys, product, dated rulings in AGENTS.md]
const rows: [string, number, number, number, number, number][] = [
  ["08-21", 72, 118, 0, 3154, 0],
  ["08-22", 98, 222, 0, 3154, 0],
  ["08-24", 115, 385, 0, 3154, 0],
  ["08-26", 117, 770, 0, 8073, 0],
  ["08-31", 169, 1550, 0, 16729, 0],
  ["09-02", 239, 2537, 0, 19738, 0],
  ["09-04", 268, 3563, 472, 20657, 0],
  ["09-07", 273, 4378, 1099, 21679, 0],
  ["09-10", 274, 4684, 1372, 23484, 0],
  ["09-14", 276, 4900, 1544, 28892, 0],
  ["09-17", 284, 5072, 1611, 31731, 0],
  ["09-18", 289, 4865, 1701, 34549, 2],
  ["09-21", 293, 4929, 1739, 36636, 2],
  ["09-22", 297, 5083, 1832, 41369, 3],
  ["09-23", 376, 5564, 1867, 29835, 7],
  ["09-25", 445, 6380, 2177, 30955, 10],
  ["09-27", 445, 7457, 2858, 32155, 10],
  ["09-28", 477, 9112, 3386, 33148, 11],
  ["09-29", 448, 10467, 4217, 34901, 14],
  ["09-30", 206, 10660, 4278, 36733, 2],
  ["10-02", 206, 10681, 4299, 37537, 3],
  ["10-03", 296, 9823, 4368, 37784, 2],
  ["10-04", 313, 10246, 4368, 37784, 4],
  ["10-05", 313, 11048, 4738, 44735, 4],
  ["10-06", 319, 11176, 4811, 45997, 5],
  ["10-07", 102, 2625, 0, 46240, 0],
];

export const days: Day[] = rows.map(([date, agents, harness, journeys, product, rulings]) => ({ date, agents, harness, journeys, product, rulings }));

/** Moments worth marking on the timeline charts. */
export const milestones: { date: string; label: string }[] = [
  { date: "09-02", label: "Pre-push gate + slop guard" },
  { date: "09-23", label: "Review gates every commit; unit tests deleted" },
  { date: "09-28", label: "CI deleted; the rulebook peaks" },
  { date: "10-03", label: "Walk gate: prove the exact committed code" },
  { date: "10-07", label: "The cut" },
];
