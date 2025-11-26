# Mind Map IA - Génération Automatique de Mind Maps par IA

Une application moderne de mind mapping avec génération automatique par Intelligence Artificielle. Entrez simplement un thème et laissez l'IA créer une mind map structurée et colorée pour vous !

## ✨ Fonctionnalités

- **🤖 Génération par IA** : Entrez un thème et l'IA génère automatiquement une mind map complète
- **🎨 Couleurs Intelligentes** : Chaque branche principale a sa propre couleur, avec des sous-branches assorties
- **✨ Animation Fluide** : Les nœuds apparaissent progressivement avec une animation
- **🎯 Interface Interactive** : Manipulez les nœuds par glisser-déposer après la génération
- **💾 Persistance des Données** : Sauvegardez vos mind maps dans une base de données SQLite
- **🔍 Contrôles Avancés** : Zoom, minimap, et contrôles de navigation
- **🌈 Design Moderne** : Interface avec gradients et effets visuels

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ installé
- npm ou yarn
- Une clé API OpenAI

### Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement :
```bash
cp .env.example .env
```
Puis éditez le fichier `.env` et ajoutez votre clé API OpenAI :
```
OPENAI_API_KEY=votre_clé_api_ici
DATABASE_URL="file:./dev.db"
```

3. Initialiser la base de données :
```bash
npx prisma migrate dev --name init
```

4. Lancer le serveur de développement :
```bash
npm run dev
```

5. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 🎨 Utilisation

### Générer une Mind Map avec l'IA

1. Entrez un thème dans la barre de recherche (ex: "Intelligence Artificielle", "Photosynthèse", "Marketing Digital")
2. Cliquez sur "✨ Générer" ou appuyez sur Entrée
3. L'IA génère automatiquement une mind map structurée
4. Les nœuds apparaissent progressivement avec une animation
5. Chaque branche principale a sa propre couleur avec un gradient unique
6. Les sous-branches héritent de la couleur de leur parent
7. Les connexions sont colorées selon la branche source

### Manipuler la Mind Map

1. **Déplacer un nœud** : Cliquez et glissez n'importe quel nœud
2. **Connecter des nœuds** : Cliquez sur le point de connexion en bas d'un nœud et glissez vers le point en haut d'un autre
3. **Zoomer** : Utilisez les contrôles en bas à gauche ou la molette de la souris
4. **Naviguer** : Cliquez et glissez sur le fond pour déplacer la vue

### Sauvegarder

- Cliquez sur le bouton "💾 Sauvegarder" dans la toolbar
- Votre mind map est sauvegardée dans la base de données SQLite

## 🛠️ Stack Technique

- **Framework** : Next.js 15 avec App Router
- **UI** : React 19
- **IA** : OpenAI GPT-4o-mini pour la génération de contenu
- **Styling** : Tailwind CSS avec gradients personnalisés
- **Mind Map** : ReactFlow (@xyflow/react)
- **Base de données** : SQLite avec Prisma ORM
- **State Management** : Zustand
- **TypeScript** : Pour la sécurité des types

## 📁 Structure du Projet

```
mind-map-ia/
├── app/
│   ├── api/
│   │   ├── generate/         # API route pour génération IA
│   │   └── mindmap/          # API routes pour CRUD
│   ├── globals.css           # Styles globaux
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Page d'accueil
├── components/
│   ├── CustomNode.tsx        # Composant de nœud personnalisé avec styles inline
│   ├── MindMapCanvas.tsx     # Canvas ReactFlow principal
│   ├── NodeEditor.tsx        # Modal d'édition de nœud (non utilisé)
│   └── Toolbar.tsx           # Barre d'outils avec recherche IA
├── lib/
│   ├── prisma.ts             # Client Prisma
│   ├── store.ts              # Store Zustand
│   └── utils.ts              # Utilitaires et couleurs
├── prisma/
│   └── schema.prisma         # Schéma de base de données
├── .env                      # Variables d'environnement (API keys)
├── .env.example              # Template pour .env
└── package.json
```

## 🎨 Palette de Couleurs

8 magnifiques combinaisons de couleurs gradient :
- Bleu (Blue)
- Violet (Purple)
- Rose (Pink)
- Orange (Orange)
- Vert (Green)
- Sarcelle (Teal)
- Cyan (Cyan)
- Indigo (Indigo)

## 🔧 Scripts Disponibles

```bash
npm run dev       # Lancer en mode développement avec Turbopack
npm run build     # Build pour production
npm run start     # Lancer le serveur de production
npm run lint      # Vérifier le code avec ESLint
```

## 📝 API Routes

### POST `/api/generate`
**Génère une mind map via IA**
- Body: `{ "theme": "votre thème" }`
- Retourne: `{ "nodes": [...], "edges": [...], "theme": "..." }`

### GET `/api/mindmap`
Récupère toutes les mind maps

### POST `/api/mindmap`
Crée une nouvelle mind map

### GET `/api/mindmap/[id]`
Récupère une mind map spécifique

### PUT `/api/mindmap/[id]`
Met à jour une mind map

### DELETE `/api/mindmap/[id]`
Supprime une mind map

## 🌟 Fonctionnalités Avancées

- **🤖 Génération IA intelligente** : Utilise GPT-4o-mini pour créer des structures cohérentes
- **🎨 Couleurs par branche** : Système de couleurs hiérarchique automatique
- **✨ Animations progressives** : Chaque nœud apparaît avec un délai de 150ms
- **🎯 Positionnement radial** : Les nœuds sont disposés en cercle autour du centre
- **🔗 Connexions colorées** : Les edges héritent de la couleur du nœud source
- **💫 Hover effects** : Effets au survol pour améliorer l'interactivité
- **🎯 Sélection visuelle** : Ring jaune quand un nœud est sélectionné
- **🖱️ Drag & Drop** : Déplacez librement les nœuds après génération
- **📐 Background personnalisé** : Motif de points pour guider l'organisation

## 🚧 Améliorations Futures

- Régénération partielle de branches
- Export en PNG/SVG de la mind map
- Historique des générations
- Mode sombre
- Templates de mind maps prédéfinis
- Collaboration en temps réel
- Raccourcis clavier
- Undo/Redo
- Personnalisation du style IA
