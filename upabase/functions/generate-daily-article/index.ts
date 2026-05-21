import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  try {
    // 1. Initialiser le client Supabase avec les privilèges admin
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 2. Sélectionner un sport au hasard pour varier le contenu
    const sports = ["football", "basketball", "tennis"];
    const selectedSport = sports[Math.floor(Math.random() * sports.length)];

    // 3. Demander à l'IA de générer un article haut de gamme au format JSON strict
    const prompt = `Agis en tant qu'expert en pronostics sportifs et rédacteur SEO professionnel pour le site "PicsousBet". 
    Rédige un article de blog captivant et optimisé sur le sport suivant : ${selectedSport}.
    L'article doit analyser une tendance actuelle, une stratégie de pari ou un match à venir important.

    Tu DOIS répondre UNIQUEMENT sous la forme d'un objet JSON valide avec la structure suivante :
    {
      "title": "Titre accrocheur et percutant de l'article",
      "tags": ["PariSportif", "Ligue1", "Astuce"], 
      "read_time": 4,
      "intro": "Une introduction dynamique qui donne envie de lire la suite.",
      "body": "Développement complet de l'article avec des arguments techniques et des conseils. Sépare les paragraphes par des sauts de ligne.",
      "conclusion": "Une conclusion forte qui incite à parier intelligemment en utilisant le code promo PICSOUS."
    }
    Ne mets aucune phrase avant ou après le JSON.`;

    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Économique et très performant pour la rédaction
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const aiData = await openAiResponse.json();
    const articleJson = JSON.parse(aiData.choices[0].message.content.trim());

    // 4. Insérer l'article généré dans la base de données
    const { data, error } = await supabase
      .from('articles')
      .insert([
        {
          title: articleJson.title,
          sport: selectedSport,
          tags: articleJson.tags,
          read_time: articleJson.read_time,
          intro: articleJson.intro,
          body: articleJson.body,
          conclusion: articleJson.conclusion,
          status: 'published'
        }
      ]);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true, message: "Article généré avec succès !" }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
})
