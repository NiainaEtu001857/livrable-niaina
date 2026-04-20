const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export async function generateLetter(record) {
  const fallback = buildFallbackLetter(record);

  if (!process.env.CLAUDE_API_KEY) {
    return { content: fallback, source: 'fallback' };
  }

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL || 'claude-3-5-haiku-latest',
        max_tokens: 800,
        temperature: 0.3,
        system: 'Tu rediges une lettre officielle et juridiquement prudente pour le Service des Impots. Style formel, clair, sans invention de faits.',
        messages: [
          {
            role: 'user',
            content: buildLetterPrompt(record)
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.content?.map((item) => item.text).filter(Boolean).join('\n\n').trim();

    if (!text) {
      throw new Error('Claude API returned empty content.');
    }

    return { content: text, source: 'claude' };
  } catch (error) {
    return {
      content: fallback,
      source: 'fallback',
      reason: error.message
    };
  }
}

export async function generateChecklist(record) {
  const fallback = buildFallbackChecklist(record);

  if (!process.env.CLAUDE_API_KEY) {
    return { items: fallback, source: 'fallback' };
  }

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL || 'claude-3-5-haiku-latest',
        max_tokens: 500,
        temperature: 0.3,
        system: 'Tu produis une checklist concise de pieces justificatives pour un dossier de succession, avec delais utiles. Reponse en liste numerotee.',
        messages: [
          {
            role: 'user',
            content: buildChecklistPrompt(record)
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data?.content?.map((item) => item.text).filter(Boolean).join('\n').trim();
    const items = text
      .split('\n')
      .map((line) => line.replace(/^\s*\d+[\).\s-]*/, '').trim())
      .filter(Boolean);

    if (!items.length) {
      throw new Error('Claude API returned no checklist items.');
    }

    return { items, source: 'claude' };
  } catch (error) {
    return {
      items: fallback,
      source: 'fallback',
      reason: error.message
    };
  }
}

function buildLetterPrompt(record) {
  return [
    'Redige une lettre officielle adressee au Service des Impots.',
    'Contrainte: environ 300 mots, ton formel et juridique, pas de placeholders.',
    `Defunt: ${fullName(record.deceased)}.`,
    `Declarant: ${fullName(record.declarant)}.`,
    `Heitiers: ${record.heirs.map((heir) => `${fullName(heir)} (${heir.relationship || 'lien non precise'})`).join('; ') || 'aucun renseigne'}.`,
    `Actifs: ${record.assets.map((asset) => `${asset.type || 'bien'} ${asset.description || ''} valeur ${formatCurrency(asset.value)}`).join('; ') || 'aucun renseigne'}.`,
    `Contexte complementaire: ${JSON.stringify(record.context)}`
  ].join('\n');
}

function buildChecklistPrompt(record) {
  return [
    'Genere une checklist numerotee des pieces justificatives de succession.',
    'Inclure les delais legaux applicables quand ils sont utiles.',
    `Profil: mineur=${Boolean(record.context?.minorHeir)}, bien immobilier=${Boolean(record.assets.some((asset) => /immobilier/i.test(asset.type || '')))}, heritage etranger=${Boolean(record.context?.foreignEstate)}.`,
    `Heitiers: ${record.heirs.map((heir) => `${fullName(heir)} (${heir.relationship || 'lien non precise'})`).join('; ') || 'aucun renseigne'}.`
  ].join('\n');
}

function buildFallbackLetter(record) {
  const heirsCount = record.heirs.length;
  const assetSummary = record.assets.length
    ? record.assets.map((asset) => `${asset.type || 'bien'}${asset.description ? ` (${asset.description})` : ''}`).join(', ')
    : 'aucun actif detaille a ce stade';

  return [
    'Objet : Declaration de succession',
    '',
    'Madame, Monsieur,',
    '',
    `Nous vous transmettons les elements relatifs a la succession de ${fullName(record.deceased)}, decede${genderSuffix(record.deceased)} le ${record.deceased?.dateOfDeath || 'date non renseignee'}.`,
    `La presente declaration est effectuee par ${fullName(record.declarant)}, en qualite de declarant${record.declarant?.relationship ? ` (${record.declarant.relationship})` : ''}.`,
    `Le dossier recense actuellement ${heirsCount} heritier${heirsCount > 1 ? 's' : ''} ainsi que les actifs suivants : ${assetSummary}.`,
    'Les informations communiquees ont ete consolidees a partir des donnees declarees par le client et sont transmises aux fins d instruction du dossier fiscal correspondant.',
    'Nous vous remercions de bien vouloir prendre acte de cette declaration et nous indiquer, le cas echeant, toute piece ou precision complementaire necessaire au traitement du dossier.',
    '',
    'Veuillez agreer, Madame, Monsieur, l expression de nos salutations distinguees.'
  ].join('\n');
}

function buildFallbackChecklist(record) {
  const items = [
    'Acte de deces du defunt.',
    'Pieces d identite du declarant et des heritiers.',
    'Livret de famille ou tout document justifiant la qualite d heritier.',
    'Inventaire des actifs et justificatifs de valorisation.',
    'Releves bancaires, attestations et contrats utiles a la succession.',
    'Declaration a deposer dans les 6 mois du deces en France metropolitaine, ou 12 mois si le deces est intervenu a l etranger.'
  ];

  if (record.context?.minorHeir) {
    items.push('Justificatifs relatifs au representant legal de l heritier mineur.');
  }

  if (record.assets.some((asset) => /immobilier/i.test(asset.type || ''))) {
    items.push('Titre de propriete, evaluation du bien immobilier et dernier avis de taxe fonciere.');
  }

  if (record.context?.foreignEstate) {
    items.push('Documents relatifs aux biens ou comptes detenus a l etranger, avec traductions si necessaire.');
  }

  return items;
}

function fullName(person = {}) {
  return [person.firstName, person.lastName].filter(Boolean).join(' ').trim() || 'Nom non renseigne';
}

function formatCurrency(value) {
  if (typeof value !== 'number') {
    return 'non renseignee';
  }

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
}

function genderSuffix(person = {}) {
  return person.gender === 'F' ? 'e' : '';
}
