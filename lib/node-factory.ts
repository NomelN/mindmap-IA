import type { Node, Edge } from '@xyflow/react';
import { nodeColors } from './utils';

// Fabrique de nœuds partagée par la création manuelle (bouton, double-clic)
// et les raccourcis clavier (Tab = enfant, Entrée = frère).

type Color = { bg: string; border: string; text: string; hex: string };

const ROOT_COLOR: Color = {
  bg: 'bg-zinc-900',
  border: 'border-zinc-900',
  text: 'text-white',
  hex: '#18181b',
};

let seq = 0;
function newId(): string {
  seq += 1;
  return `node-${Date.now()}-${seq}`;
}

// Un enfant du nœud central reçoit sa propre couleur ; sinon il hérite
// de la couleur de sa branche (cohérent avec la génération et l'expansion IA).
function inheritColor(parent: Node, siblingIndex: number): Color {
  const data = parent.data as Record<string, unknown>;
  const level = (data?.level as number) ?? 0;
  if (level === 0) return nodeColors[siblingIndex % nodeColors.length];
  return {
    bg: (data?.colorClass as string) ?? nodeColors[0].bg,
    border: (data?.borderClass as string) ?? nodeColors[0].border,
    text: (data?.textClass as string) ?? nodeColors[0].text,
    hex: (data?.borderColor as string) ?? nodeColors[0].hex,
  };
}

function nodeData(label: string, level: number, color: Color) {
  return {
    label,
    colorClass: color.bg,
    borderClass: color.border,
    textClass: color.text,
    borderColor: color.hex,
    level,
  };
}

export const DEFAULT_LABEL = 'Nouveau nœud';

// Crée un nœud enfant relié à son parent, décalé en dessous et étalé
// horizontalement selon le rang parmi les frères existants.
export function makeChildNode(
  parent: Node,
  siblingIndex: number,
  label: string = DEFAULT_LABEL
): { node: Node; edge: Edge } {
  const parentLevel = ((parent.data as Record<string, unknown>)?.level as number) ?? 0;
  const level = parentLevel + 1;
  const color = inheritColor(parent, siblingIndex);
  const id = newId();

  const dir = siblingIndex % 2 === 0 ? 1 : -1;
  const magnitude = 70 + 45 * Math.floor(siblingIndex / 2);

  const node: Node = {
    id,
    type: 'custom',
    selected: true,
    position: {
      x: parent.position.x + dir * magnitude,
      y: parent.position.y + 150,
    },
    data: nodeData(label, level, color),
  };

  const edge: Edge = {
    id: `edge-${parent.id}-${id}`,
    source: parent.id,
    target: id,
    type: 'smoothstep',
    animated: true,
    style: { stroke: color.hex, strokeWidth: 2 },
  };

  return { node, edge };
}

// Crée un nœud libre (non relié) à une position donnée. Le premier nœud
// d'un canvas vide devient le nœud central sombre.
export function makeFreeNode(
  position: { x: number; y: number },
  isRoot: boolean,
  colorIndex = 0
): Node {
  const color = isRoot ? ROOT_COLOR : nodeColors[colorIndex % nodeColors.length];
  return {
    id: newId(),
    type: 'custom',
    selected: true,
    position,
    data: nodeData(isRoot ? 'Nouvelle carte' : DEFAULT_LABEL, isRoot ? 0 : 1, color),
  };
}
