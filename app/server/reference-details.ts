/** Conservative extractors: only display source text, never infer missing quantities or places. */
export function extractRecipe(text:string) {
  const lines=text.split(/\n+/).map(s=>s.trim()).filter(Boolean);
  const ingredients=lines.filter(s=>/^[▫️•\-*\s]*(?:\d|[¼½¾])/.test(s)&&/(?:\d|[¼½¾])\s*(?:g|kg|ml|l|oz|cups?|tsp|tbsp|grams?|colheres?|xícaras?|litros?|unidades?)\b/i.test(s));
  const steps=sentences(text).filter(s=>/^(?:whip|whisk|mix|stir|pour|strain|grind|let|layer|add|bake|cook|heat|serve|bata|misture|adicione|acrescente|coe|deixe|asse|cozinhe|aqueça|sirva|despeje|coloque|finalize)\b/i.test(s));
  return ingredients.length?{ingredients:[...new Set(ingredients)],steps:[...new Set(steps)]}:null;
}
function sentences(text:string){return text.split(/\n+|(?<=[.!?])\s+/).map(s=>s.trim()).filter(Boolean);}
export function extractPlace(text:string){
  const address=text.match(/(?:rua|avenida|av\.|praça|praca|alameda|travessa|rodovia)\s+[^\n.!?]{2,120}?,?\s+\d+[^\n.!?]*/i)?.[0]?.trim();
  const city=text.match(/\b(?:em|cidade de|city of)\s+([A-ZÀ-Ú][\p{L}]+(?:\s+(?:[A-ZÀ-Ú][\p{L}]+|de|do|da)){0,4})(?=,|\.|\n)/u)?.[1]??address?.match(/,\s*([\p{L} ]+),\s*[A-Z]{2}$/u)?.[1]??null;
  return address?{address,city}:null;
}
export function extractTutorial(text:string){
  const steps=text.split(/\n+/).map(s=>s.trim()).filter(s=>/^\d+[.)]\s+/.test(s)).map(s=>s.replace(/^\d+[.)]\s+/,""));
  const procedural=sentences(text).filter(s=>/^(?:abra|acesse|clique|selecione|configure|instale|conecte|salve|open|click|select|install|connect|save)\b/i.test(s));
  return steps.length>1?steps:procedural.length>1?[...new Set(procedural)]:[];
}
export function buildDetails(data:any){
  const modern=!!data?.content_version;
  const caption=typeof data?.caption==="string"?data.caption:null;
  const transcription=typeof data?.transcription==="string"?data.transcription:(modern?null:(data?.transcript?.map((s:any)=>s.text).join(" ")??null));
  // Embedded location/music metadata is not included: this is only the original caption field.
  const summary=data?.semantic_description??data?.description??data?.video_inspection??null;
  const evidence=[caption,data?.transcription_pt??transcription,data?.video_inspection,summary].filter(Boolean).join("\n\n");
  const recipe=extractRecipe(evidence);
  const place=extractPlace(evidence);
  const tutorial=extractTutorial(evidence);
  return {caption,transcription,summary,recipe,place,tutorial,speechAbsent:data?.availability?.transcription==="absent"};
}
