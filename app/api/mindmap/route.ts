import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Lister toutes les mind maps (métadonnées seulement, sans nodes/edges)
export async function GET() {
  try {
    const mindMaps = await prisma.mindMap.findMany({
      select: {
        id: true,
        title: true,
        theme: true,
        updatedAt: true,
        _count: {
          select: { nodes: true },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return NextResponse.json(mindMaps);
  } catch (error) {
    console.error('Error fetching mind maps:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mind maps' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle mind map.
// Même convention de stockage que /api/generate et PUT /api/mindmap/[id] :
// edges par index de nœud, ids de nœuds régénérés par Prisma.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, theme, nodes, edges } = body;

    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      return NextResponse.json(
        { error: 'nodes et edges sont requis' },
        { status: 400 }
      );
    }

    const idToIndex = new Map<string, number>(
      nodes.map((node: any, index: number) => [node.id, index])
    );

    const mindMap = await prisma.mindMap.create({
      data: {
        title: title || 'Nouvelle Mind Map',
        description: description || '',
        theme: theme ? theme.toLowerCase().trim() : null,
        nodes: {
          create: nodes.map((node: any, index: number) => ({
            type: node.type || 'custom',
            label: node.data?.label || '',
            position: JSON.stringify(node.position),
            data: JSON.stringify({
              ...node.data,
              originalId: node.id,
              nodeIndex: index,
            }),
            style: node.style ? JSON.stringify(node.style) : null,
          })),
        },
        edges: {
          create: edges.map((edge: any) => ({
            source: String(idToIndex.get(edge.source) ?? edge.source),
            target: String(idToIndex.get(edge.target) ?? edge.target),
            type: edge.type || 'smoothstep',
            animated: edge.animated ?? false,
            style: edge.style ? JSON.stringify(edge.style) : null,
          })),
        },
      },
      include: {
        nodes: true,
        edges: true,
      },
    });

    return NextResponse.json(mindMap);
  } catch (error) {
    console.error('Error creating mind map:', error);
    return NextResponse.json(
      { error: 'Failed to create mind map' },
      { status: 500 }
    );
  }
}
