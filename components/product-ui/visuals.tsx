import { AppFrame, BarChart, Kpi, Pill, Rail, Row } from "./AppFrame";

/**
 * One representative interface per product, built in markup. See AppFrame for why these
 * are coded rather than screenshotted. Labels are drawn from what each product's page
 * already claims — nothing here asserts a capability the deck does not.
 */

export function SavantVisual() {
  return (
    <AppFrame title="Savant AI — Retail dataset">
      <div className="flex gap-4">
        <Rail items={["Upload", "Dashboard", "Ask", "Forecast", "Export"]} active={1} />
        <div className="min-w-0 flex-1">
          {/* Conversational query — the product's defining interaction */}
          <div className="flex items-center gap-2 rounded-lg border border-border-strong bg-surface-2 px-3 py-2">
            <span className="text-brand" aria-hidden="true">
              ✦
            </span>
            <span className="min-w-0 truncate text-xs text-ink">
              Which category is losing margin this quarter?
            </span>
          </div>
          <p className="mt-2 text-[11px] text-muted">
            Domain detected: <span className="font-semibold text-ink">Retail</span> — no
            configuration required
          </p>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <Kpi label="Revenue" value="₹4.2Cr" delta="▲ 12%" />
            <Kpi label="Avg. order" value="₹1,840" delta="▲ 3%" />
            <Kpi label="Margin" value="21.4%" delta="▼ 1.8%" />
          </div>

          <div className="mt-3 rounded-xl border border-border p-3">
            <p className="text-[11px] font-semibold text-muted">Units sold by category</p>
            <BarChart
              className="mt-2"
              bars={[42, 58, 71, 55, 84, 62, 48, 76, 91, 68, 54, 80]}
            />
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

export function TawthiqVisual() {
  const rules = [
    ["Auditor opinion present", "pass"],
    ["Signatures & stamps detected", "pass"],
    ["Assets = Liabilities + Equity", "pass"],
    ["Notes cross-reference", "warn"],
    ["Reporting currency", "pass"],
  ] as const;
  return (
    <AppFrame title="Tawthiq — FY2026 filing validation">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-muted">Compliance score</p>
          <p className="text-2xl font-bold leading-none text-ink">96%</p>
        </div>
        <div className="flex flex-wrap justify-end gap-1.5">
          <Pill tone="brand">IFRS</Pill>
          <Pill tone="brand">SOCPA</Pill>
          <Pill tone="brand">Tadawul</Pill>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-border px-3">
        {rules.map(([label, tone]) => (
          <Row key={label}>
            <span className="min-w-0 truncate text-xs text-ink">{label}</span>
            <Pill tone={tone === "pass" ? "pass" : "warn"}>
              {tone === "pass" ? "Pass" : "Review"}
            </Pill>
          </Row>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-lg bg-surface-2 px-3 py-2">
        <span className="text-[11px] font-semibold text-brand">Evidence</span>
        <span className="min-w-0 truncate text-[11px] text-muted">
          statement-of-financial-position.pdf — page 14, highlighted
        </span>
      </div>
    </AppFrame>
  );
}

export function AgentOSVisual() {
  const agents = [
    ["Format Detection", "done"],
    ["Schema Intelligence", "done"],
    ["Validation", "running"],
    ["Human Governance", "waiting"],
    ["Orchestration", "idle"],
  ] as const;
  return (
    <AppFrame title="AgentOS — pipeline run #2703">
      <ul className="space-y-2">
        {agents.map(([name, state]) => (
          <li
            key={name}
            className="flex items-center gap-3 rounded-lg border border-border px-3 py-2"
          >
            <span
              aria-hidden="true"
              className={
                state === "done"
                  ? "h-2 w-2 shrink-0 rounded-full bg-accent-green"
                  : state === "running"
                    ? "h-2 w-2 shrink-0 rounded-full bg-brand"
                    : "h-2 w-2 shrink-0 rounded-full bg-border-strong"
              }
            />
            <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink">
              {name} Agent
            </span>
            <span className="text-[11px] capitalize text-muted">{state}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2">
        <span className="text-[11px] text-muted">Low-confidence result routed for review</span>
        <Pill tone="warn">Human in the loop</Pill>
      </div>
    </AppFrame>
  );
}

export function AgentSiddhiVisual() {
  return (
    <AppFrame title="Agent Siddhi — enterprise discovery">
      <div className="grid grid-cols-3 gap-2">
        {["ERP", "CRM", "Workflow", "Policy store", "Data lake", "Service desk"].map(
          (s, i) => (
            <div
              key={s}
              className={
                i === 3
                  ? "rounded-lg border border-brand/50 bg-brand/10 px-2.5 py-2 text-[11px] font-semibold text-blue-900"
                  : "rounded-lg border border-border bg-surface-2 px-2.5 py-2 text-[11px] text-ink"
              }
            >
              {s}
            </div>
          ),
        )}
      </div>
      <div className="mt-3 rounded-xl border border-border px-3">
        <Row>
          <span className="text-xs text-ink">Goal: resolve exception EX-441</span>
          <Pill tone="brand">Executing</Pill>
        </Row>
        <Row>
          <span className="text-xs text-muted">Policy check — procurement threshold</span>
          <Pill tone="pass">Applied</Pill>
        </Row>
        <Row>
          <span className="text-xs text-muted">Approval — finance controller</span>
          <Pill tone="warn">Pending</Pill>
        </Row>
      </div>
      <p className="mt-2 text-[11px] text-muted">
        Full execution trace retained for audit
      </p>
    </AppFrame>
  );
}

export function SmartAssistantVisual() {
  return (
    <AppFrame title="Smart AI Assistant">
      <div className="space-y-2.5">
        <Bubble side="user">Can you check the status of invoice INV-8842?</Bubble>
        <Bubble side="bot">
          Found it in the CRM — issued 12 Feb, due 14 Mar, currently unpaid. Would you like
          me to send a reminder?
        </Bubble>
        <Bubble side="user">Yes, and classify it for compliance.</Bubble>
        <Bubble side="bot">
          Reminder queued. Classified as{" "}
          <span className="font-semibold">Trade receivable — domestic</span>.
        </Bubble>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Pill tone="brand">CRM retrieval</Pill>
        <Pill tone="brand">Document processing</Pill>
        <Pill tone="pass">Moderation active</Pill>
      </div>
    </AppFrame>
  );
}

function Bubble({
  side,
  children,
}: {
  side: "user" | "bot";
  children: React.ReactNode;
}) {
  return (
    <div className={side === "user" ? "flex justify-end" : "flex justify-start"}>
      <p
        className={
          side === "user"
            ? "max-w-[85%] rounded-2xl rounded-br-sm bg-brand/15 px-3 py-2 text-xs text-ink"
            : "max-w-[85%] rounded-2xl rounded-bl-sm border border-border bg-surface-2 px-3 py-2 text-xs text-ink"
        }
      >
        {children}
      </p>
    </div>
  );
}

export function EthicsVisual() {
  return (
    <AppFrame title="Ethics Intelligence — case AZ-1187">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium text-muted">Reporter</p>
          <p className="text-sm font-bold text-ink">Anonymous</p>
          <p className="mt-0.5 text-[11px] text-muted">
            Access code <span className="font-mono text-ink">7K4-QP9-22B</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-medium text-muted">AI risk score</p>
          <p className="text-2xl font-bold leading-none text-ink">High</p>
        </div>
      </div>
      <div className="mt-3 rounded-xl border border-border px-3">
        <Row>
          <span className="text-xs text-ink">Pattern match — 3 related reports</span>
          <Pill tone="warn">Flagged</Pill>
        </Row>
        <Row>
          <span className="text-xs text-muted">Encrypted two-way channel</span>
          <Pill tone="pass">Open</Pill>
        </Row>
        <Row>
          <span className="text-xs text-muted">Investigator assigned</span>
          <Pill tone="brand">Escalated</Pill>
        </Row>
      </div>
      <p className="mt-2 text-[11px] text-muted">
        No personal data collected · full audit trail retained
      </p>
    </AppFrame>
  );
}

export function CloudOrchestrationVisual() {
  const stages = [
    ["Requirements", "done"],
    ["Architecture", "done"],
    ["Policy check", "done"],
    ["Infrastructure as code", "running"],
    ["Deploy", "idle"],
  ] as const;
  return (
    <AppFrame title="Cloud Orchestration — work order WO-3391">
      <ol className="space-y-2">
        {stages.map(([name, state], i) => (
          <li key={name} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={
                state === "done"
                  ? "grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-green text-[11px] font-bold text-ink"
                  : state === "running"
                    ? "grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-[11px] font-bold text-white"
                    : "grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border-strong text-[11px] font-bold text-muted"
              }
            >
              {state === "done" ? "✓" : i + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink">{name}</span>
            <span className="text-[11px] capitalize text-muted">{state}</span>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border pt-3">
        <Pill tone="brand">AWS</Pill>
        <Pill tone="brand">Azure</Pill>
        <Pill tone="brand">GCP</Pill>
        <span className="ml-auto text-[11px] text-muted">Approval before deploy</span>
      </div>
    </AppFrame>
  );
}

export function ProSiddhiVisual() {
  const rows = [
    ["Machine Operator", "Pune", "26 applicants"],
    ["Electrician", "Chennai", "18 applicants"],
    ["Warehouse Associate", "Bhiwandi", "41 applicants"],
    ["Delivery Executive", "Bengaluru", "63 applicants"],
  ];
  return (
    <AppFrame title="ProSiddhi — employer dashboard">
      <div className="grid grid-cols-3 gap-2">
        <Kpi label="Active jobs" value="12" />
        <Kpi label="Unlocked" value="148" />
        <Kpi label="Credits" value="2,400" />
      </div>
      <div className="mt-3 rounded-xl border border-border px-3">
        {rows.map(([role, city, applicants]) => (
          <Row key={role}>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium text-ink">{role}</span>
              <span className="block text-[11px] text-muted">{city}</span>
            </span>
            <span className="shrink-0 text-[11px] text-muted">{applicants}</span>
            <Pill tone="brand">Unlock</Pill>
          </Row>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-muted">English &amp; हिन्दी · pay per unlock</p>
    </AppFrame>
  );
}
