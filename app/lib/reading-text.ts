/** Presentation only: no rewriting, translation or removal of the source words. */
export function readingParagraphs(text:string,kind:"summary"|"transcription"="transcription"):string[]{
  if(!text.trim())return [];
  const limit=kind==="summary"?260:400;
  const maxSentences=kind==="summary"?2:3;
  const blocks=text.replace(/\r\n?/g,"\n").split(/\n\s*\n/).filter(s=>s.trim());
  const segmenter=typeof Intl.Segmenter==="function"?new Intl.Segmenter("pt-BR",{granularity:"sentence"}):null;
  return blocks.flatMap(block=>{
    // Existing single line breaks remain valid boundaries, especially lists and lyrics.
    if(block.includes("\n"))return block.split("\n").map(line=>line.trim()).filter(Boolean);
    let parts=segmenter?Array.from(segmenter.segment(block),s=>s.segment):block.match(/[^.!?]+(?:[.!?]+(?:\s+|$)|$)/g)??[block];
    // ASR can return very long unpunctuated speech: break only at whitespace.
    parts=parts.flatMap(part=>{
      if(part.length<=limit*2)return [part];
      const chunks:string[]=[];let chunk="";
      for(const word of part.match(/\S+\s*/g)??[part]){
        if(chunk.length>=limit){chunks.push(chunk);chunk="";}
        chunk+=word;
      }
      if(chunk)chunks.push(chunk);
      return chunks;
    });
    const paragraphs:string[]=[];let current="",count=0;
    for(const part of parts){
      if(current&&(count>=maxSentences||current.length+part.length>limit)&&current.trim().length>=90){paragraphs.push(current.trim());current="";count=0;}
      current+=part;count++;
    }
    if(current.trim())paragraphs.push(current.trim());
    return paragraphs;
  });
}
export function readingText(text:string,kind:"summary"|"transcription"="transcription"){return readingParagraphs(text,kind).join("\n\n");}
