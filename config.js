/* =====================================================================
   Casa Lúdica Moema — Configuração
   ---------------------------------------------------------------------
   PREENCHA AQUI as 2 chaves do seu projeto Supabase (veja SETUP.md).
   Enquanto estiverem vazias, o site mostra os dados de exemplo abaixo.
   ===================================================================== */
window.CASA_CONFIG = {
  SUPABASE_URL: "https://hblnphqibwvnjqbflsvw.supabase.co",
  SUPABASE_ANON_KEY: "sb_publishable_ksTvM5jhI61qpcG5tin4EQ_LdgzEifb"
};

/* Textos/links padrão do site. No ar, estes valores vêm do painel admin
   (aba Configurações); os daqui servem de fallback. */
window.CASA_SETTINGS = {
  instagram_url: "https://instagram.com/casaludicamoema",
  whatsapp_url:  "https://wa.me/5511999999999",
  hero_title:    "Casa Lúdica Moema",
  hero_slogan:   "Juntos por uma infância + lúdica",
  hero_lead:     "Ambientes que encantam e transformam a infância. Escolha um espaço e conheça nossas soluções em brinquedos e mobiliário lúdico."
};

/* Paleta oficial (para o admin oferecer como opções de cor) */
window.CASA_PALETTE = [
  {name:"Verde lúdico",   hex:"#109E63"},
  {name:"Verde paz",      hex:"#2EBD48"},
  {name:"Azul água",      hex:"#01ACBE"},
  {name:"Azul alegria",   hex:"#5F94DA"},
  {name:"Lilás lazer",    hex:"#8857B8"},
  {name:"Roxo brincadeira",hex:"#924296"},
  {name:"Rosa encantado", hex:"#FF5995"},
  {name:"Rosa amor",      hex:"#F94262"},
  {name:"Vermelho",       hex:"#E73236"},
  {name:"Laranja diversão",hex:"#FF8736"},
  {name:"Amarelo magia",  hex:"#FDBF35"},
  {name:"Azul noite",     hex:"#373A81"}
];

/* Dados de exemplo (usados enquanto o Supabase não está conectado) */
window.CASA_DEMO = [
  {
    slug:"escolas", name:"Escolas", color:"#109E63",
    cta_title:"Quer conhecer as soluções para sua escola?",
    cta_text:"Deixe seu e-mail e nossa equipe envia o catálogo completo e condições especiais.",
    sections:[
      {name:"Playground", color:"#109E63", items:[
        {title:"Playground modular", image_url:""},
        {title:"Casinha de madeira", image_url:""},
        {title:"Balanço duplo", image_url:""},
        {title:"Escorregador infantil", image_url:""}
      ]},
      {name:"Recursos educacionais", color:"#2EBD48", items:[
        {title:"Kit alfabeto", image_url:""},
        {title:"Blocos de montar", image_url:""},
        {title:"Ábaco gigante", image_url:""},
        {title:"Jogo de encaixe", image_url:""}
      ]}
    ]
  },
  {
    slug:"clinicas", name:"Clínicas & Consultórios", color:"#01ACBE",
    cta_title:"Monte um ambiente acolhedor no seu consultório",
    cta_text:"Deixe seu e-mail e receba nossa curadoria de itens para clínicas e consultórios.",
    sections:[
      {name:"Sala de espera", color:"#01ACBE", items:[
        {title:"Poltrona kids", image_url:""},
        {title:"Painel sensorial", image_url:""},
        {title:"Mesa de atividades", image_url:""},
        {title:"Tapete lúdico", image_url:""}
      ]},
      {name:"Mobiliário", color:"#5F94DA", items:[
        {title:"Estante colorida", image_url:""},
        {title:"Cadeira infantil", image_url:""},
        {title:"Baú organizador", image_url:""}
      ]},
      {name:"Recursos terapêuticos", color:"#8857B8", items:[
        {title:"Kit motricidade", image_url:""},
        {title:"Blocos texturizados", image_url:""},
        {title:"Jogo terapêutico", image_url:""},
        {title:"Painel de emoções", image_url:""}
      ]}
    ]
  },
  {
    slug:"espacos", name:"Espaços de brincar", color:"#FF5995",
    cta_title:"Vamos criar um espaço de brincar inesquecível?",
    cta_text:"Deixe seu e-mail e receba ideias e o catálogo para o seu espaço.",
    sections:[
      {name:"Mobiliário externo", color:"#FF5995", items:[
        {title:"Gangorra", image_url:""},
        {title:"Casa de árvore", image_url:""},
        {title:"Cama elástica", image_url:""},
        {title:"Túnel de brincar", image_url:""}
      ]},
      {name:"Mobiliário interno", color:"#FF8736", items:[
        {title:"Tenda infantil", image_url:""},
        {title:"Piscina de bolinhas", image_url:""},
        {title:"Cantinho da leitura", image_url:""}
      ]}
    ]
  }
];
