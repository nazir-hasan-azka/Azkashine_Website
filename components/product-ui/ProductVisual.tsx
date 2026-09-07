import {
  AgentOSVisual,
  AgentSiddhiVisual,
  CloudOrchestrationVisual,
  EthicsVisual,
  ProSiddhiVisual,
  SavantVisual,
  SmartAssistantVisual,
  TawthiqVisual,
} from "./visuals";

/** Maps a product slug to its coded interface. */
const VISUALS: Record<string, () => React.JSX.Element> = {
  "savant-ai": SavantVisual,
  tawthiq: TawthiqVisual,
  agentos: AgentOSVisual,
  "agent-siddhi": AgentSiddhiVisual,
  "smart-ai-assistant": SmartAssistantVisual,
  "ethics-intelligence": EthicsVisual,
  "cloud-orchestration": CloudOrchestrationVisual,
  prosiddhi: ProSiddhiVisual,
};

export function hasVisual(slug: string): boolean {
  return slug in VISUALS;
}

export function ProductVisual({ slug }: { slug: string }) {
  const Visual = VISUALS[slug];
  if (!Visual) return null;
  return <Visual />;
}
