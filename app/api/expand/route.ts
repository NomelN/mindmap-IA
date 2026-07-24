import { NextRequest, NextResponse } from 'next/server';
import { getAIClient } from '@/lib/ai';

// POST - Développer une branche : générer des sous-nœuds pour un nœud existant
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { label, theme, existingChildren } = body as {
      label?: string;
      theme?: string;
      existingChildren?: string[];
    };

    if (!label || typeof label !== 'string') {
      return NextResponse.json(
        { error: 'Le label du nœud est requis' },
        { status: 400 }
      );
    }

    const avoidList =
      existingChildren && existingChildren.length > 0
        ? `\nCe nœud a déjà ces sous-branches (n'en génère PAS de similaires) : ${existingChildren.join(', ')}.`
        : '';

    const { client, model } = getAIClient();
    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: `Tu développes une branche d'une mind map${theme ? ` sur le thème « ${theme} »` : ''}.
          On te donne le label d'un nœud : génère 3 à 4 sous-branches pertinentes pour l'approfondir.${avoidList}
          Les labels doivent être courts (2-4 mots maximum) et en français.
          Réponds UNIQUEMENT avec un objet JSON valide dans ce format exact :
          { "children": [ { "label": "Sous-branche 1" }, { "label": "Sous-branche 2" } ] }`,
        },
        {
          role: 'user',
          content: `Développe le nœud : « ${label} »`,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error("Aucune réponse de l'IA");
    }

    const parsed = JSON.parse(responseContent);
    const children: { label: string }[] = (parsed.children || [])
      .filter((c: { label?: unknown }) => typeof c?.label === 'string' && c.label.trim())
      .slice(0, 4)
      .map((c: { label: string }) => ({ label: c.label.trim() }));

    if (children.length === 0) {
      throw new Error("L'IA n'a proposé aucune sous-branche");
    }

    return NextResponse.json({ children });
  } catch (error) {
    console.error("Erreur lors de l'expansion de la branche:", error);
    return NextResponse.json(
      { error: 'Échec du développement de la branche' },
      { status: 500 }
    );
  }
}
