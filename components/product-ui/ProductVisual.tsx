import {
  AgentSiddhiVisual,
  AuditSiddhiVisual,
  CloudSiddhiVisual,
  ConnectSiddhiVisual,
  NodeSiddhiVisual,
  ProSiddhiVisual,
  ShieldSiddhiVisual,
  SmartSiddhiVisual,
} from "./visuals";

/** Maps a product slug to its coded interface. */
const VISUALS: Record<string, () => React.JSX.Element> = {
  auditsiddhi: AuditSiddhiVisual,
  nodesiddhi: NodeSiddhiVisual,
  agentsiddhi: AgentSiddhiVisual,
  smartsiddhi: SmartSiddhiVisual,
  shieldsiddhi: ShieldSiddhiVisual,
  cloudsiddhi: CloudSiddhiVisual,
  connectsiddhi: ConnectSiddhiVisual,
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
