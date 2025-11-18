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

// PUT - Mettre à jour une mind map
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, nodes, edges } = body;

    // Supprimer les anciens nodes et edges
    await prisma.node.deleteMany({
      where: { mindMapId: id },
    });
    await prisma.edge.deleteMany({
      where: { mindMapId: id },
    });

    // Mettre à jour la mind map avec les nouveaux nodes et edges
    const mindMap = await prisma.mindMap.update({
      where: { id },
      data: {
        title: title || 'Nouvelle Mind Map',
        description: description || '',
        nodes: {
          create: nodes.map((node: any) => ({
            id: node.id,
            type: node.type,
            label: node.data?.label || '',
            position: JSON.stringify(node.position),
            data: JSON.stringify(node.data),
            style: node.style ? JSON.stringify(node.style) : null,
          })),
        },
        edges: {
          create: edges.map((edge: any) => ({
            id: edge.id,
            source: edge.source,
            target: edge.target,
            type: edge.type || 'smoothstep',
            animated: edge.animated || false,
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
