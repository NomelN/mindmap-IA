import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { nodeColors } from '@/lib/utils';
import { prisma } from '@/lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
}

interface GeneratedNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    colorClass?: string;
    borderClass?: string;
    textClass?: string;
    borderColor?: string;
    level: number;
  };
}

interface GeneratedEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  animated: boolean;
  style: {
    stroke: string;
    strokeWidth: number;
  };
}

// Fonction pour obtenir la couleur hex d'un objet color
function getHexColor(color: typeof nodeColors[0]): string {
  return color.hex;
}

// POST - Générer une mind map via IA
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { theme } = body;

    if (!theme || typeof theme !== 'string') {
      return NextResponse.json(
        { error: 'Le thème est requis' },
        { status: 400 }
      );
    }

    // Normaliser le thème pour la recherche (minuscule et trimmed)
    const normalizedTheme = theme.toLowerCase().trim();

    // Vérifier si une mind map existe déjà pour ce thème
    const existingMindMap = await prisma.mindMap.findFirst({
      where: {
        theme: normalizedTheme,
      },
      include: {
        nodes: true,
        edges: true,
      },
    });

    // Si une mind map existe, la retourner au lieu de régénérer
    if (existingMindMap) {
      // Trier les nodes par leur index pour maintenir l'ordre
      const sortedNodes = existingMindMap.nodes.sort((a, b) => {
        const aData = JSON.parse(a.data);
        const bData = JSON.parse(b.data);
        return (aData.nodeIndex || 0) - (bData.nodeIndex || 0);
      });

      // Créer un mapping index -> nouveau node ID pour les edges
      const indexToNodeId: { [key: string]: string } = {};

      // Convertir les nodes de la DB au format ReactFlow
      const nodes: GeneratedNode[] = sortedNodes.map((node, index) => {
        const parsedData = JSON.parse(node.data);
        // Mapper l'index au node ID de la DB
        indexToNodeId[String(index)] = node.id;

        return {
          id: node.id,
          type: node.type,
          position: JSON.parse(node.position),
          data: {
            label: parsedData.label,
            colorClass: parsedData.colorClass,
            borderClass: parsedData.borderClass,
            textClass: parsedData.textClass,
            borderColor: parsedData.borderColor,
            level: parsedData.level,
          },
        };
      });

      // Convertir les edges de la DB au format ReactFlow
      const edges: GeneratedEdge[] = existingMindMap.edges.map((edge, idx) => {
        // Les source et target stockés sont des indexes (string)
        const sourceNodeId = indexToNodeId[edge.source] || edge.source;
        const targetNodeId = indexToNodeId[edge.target] || edge.target;

        return {
          id: `edge-${sourceNodeId}-${targetNodeId}`,
          source: sourceNodeId,
          target: targetNodeId,
          type: edge.type || 'smoothstep',
          animated: edge.animated,
          style: edge.style ? JSON.parse(edge.style) : {
            stroke: '#a1a1aa', // Fallback
            strokeWidth: 2,
          },
        };
      });

      return NextResponse.json({
        nodes,
        edges,
        theme,
        fromCache: true,
        mindMapId: existingMindMap.id,
      });
    }

    // Appel à l'API OpenAI pour générer la structure de la mind map
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Tu es un assistant qui génère des structures de mind map.
          Génère une mind map hiérarchique sur le thème donné avec EXACTEMENT 1 nœud central et EXACTEMENT 4 branches principales, chaque branche ayant 3-4 sous-branches.
          Réponds UNIQUEMENT avec un objet JSON valide dans ce format exact:
          {
            "id": "1",
            "label": "Thème central (court et concis)",
            "children": [
              {
                "id": "2",
                "label": "Branche principale 1",
                "children": [
                  { "id": "3", "label": "Sous-branche 1.1" },
                  { "id": "4", "label": "Sous-branche 1.2" }
                ]
              },
              {
                "id": "5",
                "label": "Branche principale 2",
                "children": [
                  { "id": "6", "label": "Sous-branche 2.1" },
                  { "id": "7", "label": "Sous-branche 2.2" }
                ]
              },
              {
                "id": "8",
                "label": "Branche principale 3",
                "children": [
                  { "id": "9", "label": "Sous-branche 3.1" },
                  { "id": "10", "label": "Sous-branche 3.2" }
                ]
              },
              {
                "id": "11",
                "label": "Branche principale 4",
                "children": [
                  { "id": "12", "label": "Sous-branche 4.1" },
                  { "id": "13", "label": "Sous-branche 4.2" }
                ]
              }
            ]
          }
          Important: Tu dois TOUJOURS générer EXACTEMENT 4 branches principales, pas plus, pas moins.
          Les labels doivent être courts (2-4 mots maximum).
          Assure-toi que chaque ID est unique et numérique séquentiel.`
        },
        {
          role: 'user',
          content: `Génère une mind map sur le thème: "${theme}"`
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('Aucune réponse de l\'IA');
    }

    const mindMapStructure: MindMapNode = JSON.parse(responseContent);

    // Convertir la structure en nodes et edges pour ReactFlow
    const nodes: GeneratedNode[] = [];
    const edges: GeneratedEdge[] = [];
    let nodeCounter = 0;

    // Fonction récursive pour créer les nodes et edges
    function createNodesAndEdges(
      node: MindMapNode,
      parentId: string | null,
      level: number,
      angle: number,
      totalSiblings: number,
      siblingIndex: number,
      parentColor?: typeof nodeColors[0]
    ) {
      const nodeId = `node-${nodeCounter++}`;

      // Attribuer une couleur en fonction du niveau
      let color;
      if (level === 0) {
        // Nœud central - Zinc Dark
        color = {
          name: 'zinc',
          bg: 'bg-zinc-900',
          border: 'border-zinc-900',
          text: 'text-white',
          hex: '#18181b'
        };
      } else if (level === 1) {
        // Branches principales - chaque branche a sa propre couleur
        color = nodeColors[siblingIndex % nodeColors.length];
      } else {
        // Sous-branches - même couleur que le parent
        color = parentColor || nodeColors[0];
      }

      // Calculer la position
      let x = 600; // Centre plus à droite
      let y = 400; // Centre plus bas

      if (level > 0 && parentId) {
        const radius = level === 1 ? 450 : 250; // Beaucoup plus d'espace
        const spreadAngle = level === 1 ? 360 : 120;
        // Pour 4 branches, on commence à -45° pour avoir une disposition en croix
        const startAngle = level === 1 ? -45 : angle - spreadAngle / 2;
        const angleStep = totalSiblings > 1 ? spreadAngle / totalSiblings : 0;
        const currentAngle = startAngle + (angleStep * siblingIndex);

        const parentNode = nodes.find(n => n.id === parentId);
        if (parentNode) {
          const radians = (currentAngle * Math.PI) / 180;
          x = parentNode.position.x + radius * Math.cos(radians);
          y = parentNode.position.y + radius * Math.sin(radians);
        }
      }

      // Créer le node avec le niveau pour la différenciation visuelle
      nodes.push({
        id: nodeId,
        type: 'custom',
        position: { x, y },
        data: {
          label: node.label,
          colorClass: color.bg,
          borderClass: color.border,
          textClass: color.text,
          borderColor: color.hex,
          level: level,
        },
      });

      // Créer l'edge si ce n'est pas le nœud central
      if (parentId) {
        const edgeColor = getHexColor(color);
        edges.push({
          id: `edge-${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: 'smoothstep',
          animated: true,
          style: {
            stroke: edgeColor,
            strokeWidth: 2,
          },
        });
      }

      // Traiter les enfants
      if (node.children && node.children.length > 0) {
        node.children.forEach((child, index) => {
          createNodesAndEdges(
            child,
            nodeId,
            level + 1,
            angle,
            node.children!.length,
            index,
            color
          );
        });
      }
    }

    // Créer tous les nodes et edges
    createNodesAndEdges(mindMapStructure, null, 0, 0, 1, 0);

    // Sauvegarder automatiquement dans la base de données pour le cache
    try {
      // Créer un mapping des IDs ReactFlow vers les indexes pour pouvoir recréer les edges
      const nodeIdMapping: { [key: string]: number } = {};
      nodes.forEach((node, index) => {
        nodeIdMapping[node.id] = index;
      });

      const mindMap = await prisma.mindMap.create({
        data: {
          title: theme,
          description: `Mind map générée automatiquement sur le thème: ${theme}`,
          theme: normalizedTheme,
          nodes: {
            create: nodes.map((node, index) => ({
              // Stocker l'index comme ID temporaire pour recréer la structure
              type: node.type,
              label: node.data.label,
              position: JSON.stringify(node.position),
              data: JSON.stringify({
                ...node.data,
                originalId: node.id, // Stocker l'ID original pour référence
                nodeIndex: index, // Stocker l'index
              }),
            })),
          },
          edges: {
            create: edges.map((edge) => ({
              // Stocker les indexes au lieu des IDs
              source: String(nodeIdMapping[edge.source]),
              target: String(nodeIdMapping[edge.target]),
              type: edge.type,
              animated: edge.animated,
              style: JSON.stringify(edge.style),
            })),
          },
        },
        include: {
          nodes: true,
          edges: true,
        },
      });

      return NextResponse.json({
        nodes,
        edges,
        theme,
        mindMapId: mindMap.id,
        fromCache: false,
      });
    } catch (dbError) {
      // Si erreur de sauvegarde, retourner quand même les données générées
      console.error('Erreur lors de la sauvegarde automatique:', dbError);
      return NextResponse.json({
        nodes,
        edges,
        theme,
        fromCache: false,
      });
    }

  } catch (error) {
    console.error('Erreur lors de la génération de la mind map:', error);
    return NextResponse.json(
      { error: 'Échec de la génération de la mind map' },
      { status: 500 }
    );
  }
}
