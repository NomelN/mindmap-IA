import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer une mind map spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const mindMap = await prisma.mindMap.findUnique({
      where: { id },
      include: {
        nodes: true,
        edges: true,
      },
    });

    if (!mindMap) {
      return NextResponse.json(
        { error: 'Mind map not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(mindMap);
  } catch (error) {
    console.error('Error fetching mind map:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mind map' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une mind map.
// Convention de stockage identique à /api/generate : les edges référencent les
// nœuds par INDEX (pas par id), et les ids de nœuds sont régénérés par Prisma.
// Cela évite toute collision d'ids client ("node-0"…) entre cartes et reste
// compatible avec dbMindMapToFlow.
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, theme, nodes, edges } = body;

    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      return NextResponse.json(
        { error: 'nodes et edges sont requis' },
        { status: 400 }
      );
    }

    // Mapping id client -> index pour résoudre les edges
    const idToIndex = new Map<string, number>(
      nodes.map((node: any, index: number) => [node.id, index])
    );

    // Supprimer les anciens nodes et edges
    await prisma.node.deleteMany({
      where: { mindMapId: id },
    });
    await prisma.edge.deleteMany({
      where: { mindMapId: id },
    });

    // Mettre à jour la mind map ; titre/description/theme conservés si absents
    const mindMap = await prisma.mindMap.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(theme !== undefined && {
          theme: theme ? theme.toLowerCase().trim() : null,
        }),
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
    console.error('Error updating mind map:', error);
    return NextResponse.json(
      { error: 'Failed to update mind map' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une mind map
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.mindMap.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting mind map:', error);
    return NextResponse.json(
      { error: 'Failed to delete mind map' },
      { status: 500 }
    );
  }
}
