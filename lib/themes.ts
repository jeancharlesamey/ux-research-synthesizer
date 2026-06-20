// Default theme templates for UX Research Synthesizer

export interface Theme {
  id: string;
  name: string;
  definition: string;
  closenessThreshold: number; // 0-1, how similar a quote must be to match (user-adjustable)
  keywords?: string[]; // Optional: keywords that boost a quote's severity
}

export const DEFAULT_THEMES: Theme[] = [
  {
    id: 'pain-point',
    name: 'Pain Point',
    definition: 'Something that frustrates or slows down the user; an unmet need or friction point',
    closenessThreshold: 0.10,
    keywords: ['frustrated', 'annoying', 'painful', 'difficult', 'broke', 'broken', 'slow', 'hate', 'can\'t', 'won\'t', 'issue', 'problem', 'struggle', 'stuck', 'fail', 'failure', 'error', 'bug', 'crash', 'worse', 'terrible', 'awful', 'nightmare', 'waste', 'frustré', 'agaçant', 'douloureux', 'difficile', 'cassé', 'lent', 'détester', 'problème', 'lutte', 'bloqué', 'échec', 'erreur', 'cauchemar'],
  },
  {
    id: 'need',
    name: 'User Need',
    definition: 'What the user wants to accomplish or achieve; their underlying motivation',
    closenessThreshold: 0.10,
    keywords: ['need', 'want', 'wish', 'should', 'would like', 'prefer', 'goal', 'require', 'necessary', 'essential', 'must', 'must have', 'expect', 'hope', 'desire', 'seek', 'look for', 'looking for', 'trying to', 'attempt', 'besoin', 'veux', 'souhaite', 'devrais', 'préfère', 'objectif', 'nécessaire', 'essentiel', 'dois', 'espère', 'cherche', 'essayer'],
  },
  {
    id: 'workaround',
    name: 'Workaround',
    definition: 'A way the user has adapted or worked around the issue; a manual process they\'ve created',
    closenessThreshold: 0.10,
    keywords: ['instead', 'use', 'workaround', 'manually', 'do it myself', 'have to', 'copy-paste', 'work around', 'bypass', 'avoid', 'skip', 'jump through', 'alternative', 'substitute', 'end up', 'resort to', 'stuck with', 'à la place', 'utiliser', 'contournement', 'manuellement', 'contourner', 'éviter', 'sauter', 'pallier', 'remplacer', 'aboutir', 'recourir à'],
  },
  {
    id: 'positive-feedback',
    name: 'Positive Feedback',
    definition: 'Something the user likes, praises, or finds helpful; a strength of the product',
    closenessThreshold: 0.10,
    keywords: ['love', 'like', 'great', 'helpful', 'easy', 'good', 'works well', 'appreciate', 'excellent', 'wonderful', 'fantastic', 'amazing', 'impressed', 'pleased', 'satisfied', 'happy', 'enjoy', 'prefer', 'useful', 'valuable', 'aimer', 'adorent', 'super', 'utile', 'facile', 'bon', 'marche bien', 'apprécier', 'excellent', 'merveilleux', 'fantastique', 'impressionné', 'satisfait', 'heureux', 'profiter'],
  },
  {
    id: 'mental-model',
    name: 'Mental Model Insight',
    definition: 'How the user thinks about or conceptualizes the problem; their assumptions or framework',
    closenessThreshold: 0.10,
    keywords: ['think', 'believe', 'expect', 'assume', 'imagine', 'conceptually', 'view it as', 'perceive', 'consider', 'regard', 'understand', 'see it as', 'view', 'perspective', 'opinion', 'mindset', 'approach', 'logic', 'reasoning', 'pense', 'crois', 'suppose', 'imagine', 'considère', 'regarde', 'comprend', 'perspective', 'opinion', 'mentalité', 'approche', 'logique'],
  },
];

export function getDefaultThemes(): Theme[] {
  return JSON.parse(JSON.stringify(DEFAULT_THEMES)); // Deep copy
}

export function updateThemeThreshold(themes: Theme[], themeId: string, newThreshold: number): Theme[] {
  return themes.map((t) =>
    t.id === themeId ? { ...t, closenessThreshold: Math.max(0, Math.min(1, newThreshold)) } : t
  );
}

export function addCustomTheme(themes: Theme[], theme: Omit<Theme, 'id'>): Theme[] {
  const newId = `custom-${Date.now()}`;
  return [...themes, { ...theme, id: newId }];
}

export function removeTheme(themes: Theme[], themeId: string): Theme[] {
  return themes.filter((t) => t.id !== themeId);
}
