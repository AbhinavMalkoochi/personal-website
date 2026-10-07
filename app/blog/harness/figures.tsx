import { Bars, Figure, LineChart, Stats, Timeline } from "../viz/charts";
import { Loop } from "../viz/Loop";
import { days, milestones } from "./history";

const fmt = new Intl.NumberFormat("en");

const arms = {
  steps: { name: "Steps + outside review", color: "var(--viz-aqua)" },
  current: { name: "Gates off (what we had)", color: "var(--viz-blue)" },
  vanilla: { name: "Vanilla + outside review", color: "var(--viz-yellow)" },
  minimal: { name: "Minimal rulebook", color: "var(--viz-orange)" },
};

type Arm = keyof typeof arms;

/** Task 1, graded blind by three models from two families; each out of 40. */
const scores: Record<Arm, { opus: number; sol61: number; sol6: number; minutes: number; added: number; cost: number }> = {
  steps: { opus: 28, sol61: 26, sol6: 24, minutes: 64, added: 209, cost: 59 },
  current: { opus: 27, sol61: 27, sol6: 20, minutes: 45, added: 260, cost: 56 },
  vanilla: { opus: 23, sol61: 26, sol6: 16, minutes: 46, added: 205, cost: 89 },
  minimal: { opus: 23, sol61: 20, sol6: 17, minutes: 97, added: 582, cost: 104 },
};

const order = Object.keys(arms) as Arm[];

function Legend({ keys }: { keys: Arm[] }) {
  return (
    <div className="viz-legend">
      {keys.map((k) => <span key={k}><i className="box" style={{ background: arms[k].color }} />{arms[k].name}</span>)}
    </div>
  );
}

function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <table>
      <thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
      <tbody>{rows.map((r) => <tr key={String(r[0])}>{r.map((c, i) => <td key={i}>{typeof c === "number" ? fmt.format(c) : c}</td>)}</tr>)}</tbody>
    </table>
  );
}

export function HarnessGrowth() {
  return (
    <Figure
      title="Lines of harness vs lines of product"
      note="The rules, hooks, scripts and end-to-end suites I wrote for the agents, against the app itself. Daily, at each day's last commit; vendored lint plugins and third-party skills left out. The product dip on Sep 23 is the day every unit test was deleted."
      table={<Table head={["Day", "Harness", "Product"]} rows={days.map((d) => [d.date, d.harness, d.product])} />}
    >
      <div className="viz-legend">
        <span><i style={{ background: "var(--viz-orange)" }} />Harness</span>
        <span><i style={{ background: "var(--viz-ink)" }} />Product</span>
      </div>
      <LineChart
        dates={days.map((d) => d.date)}
        unit="lines"
        marks={milestones}
        series={[
          { name: "Product", color: "var(--viz-ink)", values: days.map((d) => d.product) },
          { name: "Harness", color: "var(--viz-orange)", values: days.map((d) => d.harness) },
        ]}
      />
    </Figure>
  );
}

export function RulebookLength() {
  return (
    <Figure
      title="The rulebook every agent reads first"
      note="AGENTS.md, the instructions loaded into every agent turn. It peaked at 489 lines mid-day on Sep 28; the dip on Sep 30 was a rewrite that grew right back."
      table={<Table head={["Day", "AGENTS.md lines", "Dated rulings"]} rows={days.map((d) => [d.date, d.agents, d.rulings])} />}
    >
      <LineChart
        height={200}
        dates={days.map((d) => d.date)}
        unit="lines in AGENTS.md"
        marks={milestones}
        series={[{ name: "AGENTS.md", color: "var(--viz-ink)", values: days.map((d) => d.agents) }]}
      />
    </Figure>
  );
}

export function ReviewLoop() {
  return (
    <Figure title="Why one PR took seven review rounds" note="Proof was tied to the exact bytes being committed, so every fix a reviewer asked for invalidated the recording that the next review required.">
      <Loop
        center="7 rounds"
        sub="~1h50m for one PR"
        steps={[
          "A fresh reviewer finds 3–5 new things",
          "The agent fixes them",
          "The recorded walk no longer matches the code",
          "Walk again: a real 10–15 min end-to-end run",
          "Ask for a new review",
        ]}
      />
    </Figure>
  );
}

export function GateOff() {
  return (
    <Figure title="PRs merged, before and after removing the review gate" note="The same night, the same agents, the same work in flight.">
      <Bars
        unit=" PRs"
        rows={[
          { label: "First 3 hours, gated", value: 0, color: "var(--viz-orange)", detail: "0 PRs merged in the first ~3 hours" },
          { label: "35 min, gate removed", value: 4, color: "var(--viz-blue)", detail: "#380–#383 merged in 35 minutes after the gate came out" },
        ]}
        max={5}
      />
    </Figure>
  );
}

export function Scoreboard() {
  return (
    <Figure
      title="Same task, four harnesses, three blind graders"
      note="Total score out of 120 (three graders × 40: completeness, correctness, collateral damage, code quality). Graders saw the diffs as P, Q, R and S and never knew which harness made which."
      table={
        <Table
          head={["Harness", "Opus 5.5", "GPT-6.1-Sol", "GPT-6-Sol", "Total"]}
          rows={order.map((k) => [arms[k].name, scores[k].opus, scores[k].sol61, scores[k].sol6, scores[k].opus + scores[k].sol61 + scores[k].sol6])}
        />
      }
    >
      <Bars
        max={120}
        unit=" / 120"
        rows={order.map((k) => ({
          label: arms[k].name,
          value: scores[k].opus + scores[k].sol61 + scores[k].sol6,
          color: arms[k].color,
          detail: `Opus ${scores[k].opus} · GPT-6.1-Sol ${scores[k].sol61} · GPT-6-Sol ${scores[k].sol6}`,
        }))}
      />
    </Figure>
  );
}

export function RunCosts() {
  const small = (title: string, unit: string, pick: (k: Arm) => number, display?: (v: number) => string) => (
    <div>
      <h4>{title}</h4>
      <Bars
        unit={unit}
        rows={order.map((k) => ({ label: arms[k].name.split(" ")[0], value: pick(k), color: arms[k].color, display: display?.(pick(k)), detail: arms[k].name }))}
      />
    </div>
  );

  return (
    <Figure
      title="What each run cost"
      note="Minutes from prompt to an open PR, lines of product code added, and estimated spend at list prices (cache reads are ~97% of the tokens). Graders and reviewers not included."
      table={<Table head={["Harness", "Minutes", "Lines added", "Est. $"]} rows={order.map((k) => [arms[k].name, scores[k].minutes, scores[k].added, `$${scores[k].cost}`])} />}
    >
      <Legend keys={order} />
      <div className="viz-small">
        {small("Minutes to PR", " min", (k) => scores[k].minutes)}
        {small("Lines added", "", (k) => scores[k].added)}
        {small("Estimated cost", "", (k) => scores[k].cost, (v) => `$${v}`)}
      </div>
    </Figure>
  );
}

export function TheCut() {
  const rows = [
    { label: "End-to-end journeys", value: 4809 },
    { label: "Verify scripts & checks", value: 2694 },
    { label: "Test seams", value: 1634 },
    { label: "Process docs", value: 552 },
    { label: "Skills", value: 305 },
    { label: "Map proof claims", value: 290 },
    { label: "Rulebook (AGENTS.md)", value: 217 },
  ];
  return (
    <Figure
      title="What the final cut removed"
      note="Net lines deleted by the PR that shipped the near-vanilla harness. Authored harness went from 11,262 lines to 2,625."
      table={<Table head={["Part", "Net lines removed"]} rows={rows.map((r) => [r.label, r.value])} />}
    >
      <Bars rows={rows.map((r) => ({ ...r, color: "var(--viz-ink)", detail: "net lines removed" }))} />
    </Figure>
  );
}

export function TokenBill() {
  const rows = [
    { label: "Day one of the redesign", value: 889, detail: "~889M tokens in ~8h20m · ~$1,700 est." },
    { label: "This experiment (all runs)", value: 385, detail: "~385M tokens over two days · ~$770 est." },
    { label: "One benchmark run (avg)", value: 39, detail: "29–52M tokens per Task 1 run · $56–$104 est." },
  ];
  return (
    <Figure title="Tokens, in millions" note="Summed from session transcripts. Almost all of it is the agent re-reading its own context (cache reads).">
      <Bars unit="M" rows={rows.map((r) => ({ ...r, color: "var(--viz-blue)" }))} />
    </Figure>
  );
}

export function HeadlineStats() {
  return <Stats items={[
  { value: "11,262", label: "lines of harness at the peak" },
  { value: "40%", label: "of commits touched the harness" },
  { value: "7", label: "review rounds to merge one PR" },
  { value: "0 → 4", label: "PRs merged: 3 hours gated vs 35 min ungated" },
  { value: "~1.4B", label: "tokens over the two worst days" },
  { value: "489 → 102", label: "lines in the agents' rulebook" },
]} />;
}

export function Escalation() {
  return <Timeline steps={[
  { when: "Sep 2", title: "A gate before every push", body: "Lint, typecheck and build before every push, plus a guard that refuses TODOs, skipped tests and unexplained lint suppressions. This one stayed." },
  { when: "Sep 4", title: "A hook that won't let the agent stop", body: "A Claude Code Stop hook runs the checks at the end of every turn and blocks the agent from finishing while anything is red." },
  { when: "Sep 23", title: "A reviewer must approve every commit", body: "A separate reviewer agent has to approve every commit, recorded against a hash of the staged diff. The same day, unit tests were replaced with end-to-end checks only.", tone: "bad" },
  { when: "Sep 28", title: "The rulebook hits 489 lines", body: "The rulebook every agent reads on every turn reaches 489 lines, including a dozen dated rulings. CI is removed the same day." },
  { when: "Sep 29", title: "A hook against hook bypasses", body: "A hook refuses --no-verify, skip flags, and writing the review record by hand." },
  { when: "Oct 3", title: "Prove the exact bytes", body: "A commit is refused unless a recorded walk of the app ran the exact staged contents of every changed file.", tone: "bad" },
  { when: "Oct 5", title: "A checklist hook on merges", body: "Merging a PR is refused while its checklist has an unticked item, unless I'm quoted dropping it.", tone: "bad" },
]} />;
}
