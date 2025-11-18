import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer toutes les mind maps
export async function GET() {
  try {
    const mindMaps = await prisma.mindMap.findMany({
      include: {
        nodes: true,
        edges: true,
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

// POST - Créer une nouvelle mind map
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, theme, nodes, edges } = body;

    const mindMap = await prisma.mindMap.create({
      data: {
        title: title || 'Nouvelle Mind Map',
        description: description || '',
        theme: theme ? theme.toLowerCase().trim() : null,
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
    console.error('Error creating mind map:', error);
    return NextResponse.json(
      { error: 'Failed to create mind map' },
      { status: 500 }
    );
  }
}
