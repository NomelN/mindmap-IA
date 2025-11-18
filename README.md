# Mind Map IA - Application Interactive de Mind Mapping

Une application moderne de mind mapping construite avec Next.js, React, ReactFlow et Prisma, offrant une interface intuitive et visuellement attrayante pour créer et organiser vos idées.

## ✨ Fonctionnalités

- **Interface Interactive** : Créez et manipulez des nœuds par glisser-déposer
- **Design Magnifique** : Palette de 8 couleurs gradient vibrantes pour vos nœuds
- **Édition Intuitive** : Double-cliquez sur un nœud pour l'éditer (texte et couleur)
- **Connexions Animées** : Créez des liens entre vos idées avec des animations fluides
- **Persistance des Données** : Sauvegardez vos mind maps dans une base de données SQLite
- **Contrôles Avancés** : Zoom, minimap, et contrôles de navigation
- **Design Responsive** : Interface adaptée avec des effets de hover et transitions

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+ installé
- npm ou yarn

### Installation

1. Installer les dépendances :
```bash
npm install
```

2. Initialiser la base de données :
```bash
npx prisma migrate dev --name init
```

3. Lancer le serveur de développement :
```bash
npm run dev
```

4. Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 🎨 Utilisation

### Créer un Nouveau Nœud

1. Tapez votre idée dans le champ "Nouvelle idée..."
2. Cliquez sur "+ Ajouter" ou appuyez sur Entrée
3. Le nœud apparaît avec une couleur aléatoire

### Éditer un Nœud

1. **Double-cliquez** sur n'importe quel nœud
2. Modifiez le texte
3. Changez la couleur en cliquant sur une palette
4. Cliquez "Sauvegarder" ou "Supprimer"

### Connecter des Nœuds

1. Cliquez et maintenez sur le point de connexion (rond blanc) en bas d'un nœud
2. Glissez vers le point de connexion en haut d'un autre nœud
3. Relâchez pour créer la connexion animée

### Naviguer

- **Déplacer** : Cliquez et glissez sur le canvas
- **Zoom** : Utilisez les contrôles en bas à gauche ou la molette de la souris
- **Minimap** : Visualisez et naviguez dans votre mind map complète

### Sauvegarder

- Cliquez sur le bouton "💾 Sauvegarder" dans la toolbar
- Votre mind map est sauvegardée dans la base de données

## 🛠️ Stack Technique

- **Framework** : Next.js 15 avec App Router
- **UI** : React 19
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
│   │   └── mindmap/          # API routes pour CRUD
│   ├── globals.css           # Styles globaux
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Page d'accueil
├── components/
│   ├── CustomNode.tsx        # Composant de nœud personnalisé
│   ├── MindMapCanvas.tsx     # Canvas ReactFlow principal
│   ├── NodeEditor.tsx        # Modal d'édition de nœud
│   └── Toolbar.tsx           # Barre d'outils
├── lib/
│   ├── prisma.ts             # Client Prisma
│   ├── store.ts              # Store Zustand
│   └── utils.ts              # Utilitaires et couleurs
├── prisma/
│   └── schema.prisma         # Schéma de base de données
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

- **Animations fluides** : Transitions CSS et animations pour une UX agréable
- **Hover effects** : Effets au survol pour améliorer l'interactivité
- **Sélection visuelle** : Ring jaune quand un nœud est sélectionné
- **Drag & Drop** : Déplacez librement les nœuds
- **Background personnalisé** : Motif de points pour guider l'organisation
- **Sauvegarde automatique** : Détecte si c'est une nouvelle map ou une mise à jour

## 🚧 Améliorations Futures

- Mode sombre
- Export en PNG/SVG
- Templates de mind maps
- Collaboration en temps réel
- Raccourcis clavier
- Undo/Redo
- Recherche de nœuds
- Sous-nœuds et hiérarchies

## 📄 Licence

Projet open-source pour usage personnel et éducatif.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

---

Créé avec ❤️ en utilisant React, Next.js et ReactFlow
