export type Archetype =
  | 'Cobra' | 'Oracle'   | 'Vulture' | 'Minister'
  | 'Ghost' | 'Leviathan'| 'Architect'| 'Smuggler'
  | 'Tyrant'| 'Chemist'

export type Answers = {
  Q1: 'A' | 'B' | 'C' | 'D'
  Q2: 'A' | 'B' | 'C' | 'D'
  Q3: 'A' | 'B' | 'C' | 'D'
  Q4: 'A' | 'B' | 'C' | 'D'
  Q5: 'A' | 'B' | 'C' | 'D'
}

const MATRIX: Record<string, Record<string, Archetype>> = {
  Q1: { A: 'Tyrant',    B: 'Oracle',    C: 'Cobra',     D: 'Vulture'   },
  Q2: { A: 'Leviathan', B: 'Minister',  C: 'Chemist',   D: 'Ghost'     },
  Q3: { A: 'Leviathan', B: 'Vulture',   C: 'Ghost',     D: 'Chemist'   },
  Q4: { A: 'Architect', B: 'Cobra',     C: 'Oracle',    D: 'Smuggler'  },
  Q5: { A: 'Smuggler',  B: 'Minister',  C: 'Architect', D: 'Tyrant'    },
}

export function getArchetype(answers: Answers): Archetype {
  const scores: Partial<Record<Archetype, number>> = {}

  for (const [q, answer] of Object.entries(answers)) {
    const archetype = MATRIX[q][answer]
    scores[archetype] = (scores[archetype] ?? 0) + 1
  }

  const maxScore = Math.max(...Object.values(scores) as number[])
  const winners = (Object.keys(scores) as Archetype[])
    .filter(k => scores[k] === maxScore)

  if (winners.length > 1) {
    const q1Pick = MATRIX.Q1[answers.Q1]
    return winners.includes(q1Pick) ? q1Pick : winners[0]
  }

  return winners[0]
}

export const ARCHETYPE_PROFILES: Record<Archetype, { essence: string; contradiction: string }> = {
  Cobra:     { essence: 'Précis, froid, mortel. Frappe une fois, parfaitement.',        contradiction: 'Incapable de déléguer — la confiance lui est physiquement difficile.' },
  Oracle:    { essence: 'Voit ce que les autres ne voient pas encore. Souvent trop tôt.',contradiction: 'Méprise les gens qui lui donnent raison trop tard.' },
  Vulture:   { essence: 'Prospère sur les ruines. Arrive quand tout le monde part.',     contradiction: 'A une fascination sincère pour ce qu\'il détruit.' },
  Minister:  { essence: 'Respectable en surface. Opaque en dessous.',                    contradiction: 'Croit réellement qu\'il fait le bien.' },
  Ghost:     { essence: 'Invisible. Personne ne sait vraiment comment il a construit ça.',contradiction: 'Hante ses propres succès sans jamais les revendiquer.' },
  Leviathan: { essence: 'Massif, lent, inexorable. Ne court jamais.',                    contradiction: 'Sous-estime régulièrement les petits. Sa seule vraie faille.' },
  Architect: { essence: 'Construit des systèmes. Joue à 20 ans d\'avance.',             contradiction: 'Vit dans le futur au point de manquer le présent.' },
  Smuggler:  { essence: 'Trouve des passages là où les autres voient des murs.',         contradiction: 'Allergique aux règles même quand elles le protègent.' },
  Tyrant:    { essence: 'Domine par l\'intensité, pas par la ruse.',                     contradiction: 'Respecte profondément les rares personnes qui lui résistent.' },
  Chemist:   { essence: 'Transforme ce qui semble sans valeur en quelque chose de précieux.', contradiction: 'Ne sait pas quand arrêter l\'expérience.' },
}
