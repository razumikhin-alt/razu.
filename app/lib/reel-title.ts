/** A short, evidence-only title derived from the AI's verified summary.
 * Kept separate from source content so no caption/transcript or receipt is rewritten.
 * The same projection covers existing references and every future analysis.
 */
export function reelTitle(data:any):string {
  const summary=data?.semantic_description??data?.description??data?.video_inspection;
  if(typeof summary!=="string"||!summary.trim())return "Vídeo aguardando análise";
  let text=summary.replace(/<[^>]*>/g,"").replace(/[*#_]/g,"").trim()
    .replace(/^(?:resumo|descrição|síntese)\s*:\s*/i,"");
  text=text.split(/\n|[.!?](?:\s|$)|;|,\s+(?:com|enquanto|seguido|mostrando|apresentando)\b/)[0].trim();
  // Summaries often start by describing the presenter. Keep the demonstrated
  // idea instead of turning that introductory prose into a card title.
  text=text.replace(/^(?:(?:uma?|o|a)\s+)?(?:(?:demonstração|tutorial|explicação|vídeo|reel)(?:\s+(?:de|sobre)\s+[^,.]{1,40}?)?)\s+(?:ensina|mostra|demonstra|explica|apresenta)\s+(?:(?:como|a|o)\s+)?/i,"")
    .replace(/^(?:(?:uma?|o|a)\s+)?(?:vídeo|reel|pessoa|criador|apresentador|tutorial|demonstração)\s+(?:mostra|apresenta|ensina|explica|demonstra|aborda|descreve)\s+(?:(?:como|a|o)\s+)?/i,"")
    .replace(/^tutorial\s+(?:de|sobre)\s+/i,"")
    .replace(/^como\s+(?=\w)/i,"");
  const words=text.split(/\s+/);let title=words.slice(0,5).join(" ");
  while(title.length>38)title=title.split(" ").slice(0,-1).join(" ");
  title=title.replace(/\s+(?:e|de|do|da|dos|das|com|para|em|um|uma|no|na|o|a|que)$/i,"").replace(/[,;:.\s]+$/,"");
  return title?title[0].toLocaleUpperCase("pt-BR")+title.slice(1):"Vídeo aguardando análise";
}
