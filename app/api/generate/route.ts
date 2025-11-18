import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { nodeColors } from '@/lib/utils';

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
    gradient: string;
    borderColor: string;
    level: number; // Pour différencier visuellement
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
        // Nœud central - gradient doré brillant unique
        color = {
          name: 'gold',
          gradient: 'linear-gradient(135deg, #ffd700, #ffed4e, #ffd700, #ffed4e)',
          border: '#ffd700',
          hex: '#ffd700'
        };
      } else if (level === 1) {
        // Branches principales - chaque branche a sa propre couleur (on commence à l'index 0)
        color = nodeColors[siblingIndex % nodeColors.length];
      } else {
        // Sous-branches - même couleur que le parent mais plus claire
        color = parentColor || nodeColors[0];
      }

      // Calculer la position
      let x = 500; // Centre
      let y = 300; // Centre

      if (level > 0 && parentId) {
        const radius = level === 1 ? 300 : 180; // Plus d'espace entre les niveaux
        const spreadAngle = level === 1 ? 360 : 100;
        const startAngle = level === 1 ? 0 : angle - spreadAngle / 2;
        const angleStep = totalSiblings > 1 ? spreadAngle / (totalSiblings - 1) : 0;
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
          gradient: color.gradient,
          borderColor: color.border,
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

    return NextResponse.json({
      nodes,
      edges,
      theme,
    });

  } catch (error) {
    console.error('Erreur lors de la génération de la mind map:', error);
    return NextResponse.json(
      { error: 'Échec de la génération de la mind map' },
      { status: 500 }
    );
  }
}
