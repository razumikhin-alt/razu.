"use client";
import * as React from "react";
import { Tabs } from "radix-ui";
import { Copy, Check, LoaderCircle } from "lucide-react";
import { readingParagraphs, readingText } from "@/lib/reading-text";
import { Button } from "@/components/ui/button";
type Details={caption:string|null;transcription:string|null;summary:string|null;recipe:{ingredients:string[];steps:string[]}|null;place:{address:string;city:string|null}|null;tutorial:string[];speechAbsent:boolean};
const cache=new Map<string,Details>();
export function forgetReelDetails(id:string){cache.delete(id);}
export function ReelDetails({id}:{id:string}){
  const [data,setData]=React.useState<Details|null>(null),[error,setError]=React.useState(false),[retry,setRetry]=React.useState(0),[copied,setCopied]=React.useState(false),[copyError,setCopyError]=React.useState(false);
  React.useEffect(()=>{
    const controller=new AbortController();setData(cache.get(id)??null);setError(false);setCopied(false);setCopyError(false);
    if(cache.has(id)&&retry===0)return()=>controller.abort();
    fetch(`/api/references/${encodeURIComponent(id)}`,{cache:"no-store",signal:controller.signal}).then(async r=>{if(!r.ok)throw Error();return await r.json() as Details;}).then(value=>{if(!controller.signal.aborted){if(cache.size>=20)cache.delete(cache.keys().next().value!);cache.set(id,value);setData(value);}}).catch(e=>{if(e.name!=="AbortError")setError(true);});
    return()=>controller.abort();
  },[id,retry]);
  const copy=async()=>{
    if(!data)return;
    const text=[data.summary?readingText(data.summary,"summary"):null,data.recipe?.ingredients.length?`Ingredientes\n${data.recipe.ingredients.join("\n")}`:null,data.recipe?.steps.length?`Modo de preparo\n${data.recipe.steps.map((s,i)=>`${i+1}. ${s}`).join("\n")}`:null,data.place?`Endereço: ${data.place.address}${data.place.city?`\nCidade: ${data.place.city}`:""}`:null,data.tutorial.length?`Passo a passo\n${data.tutorial.map((s,i)=>`${i+1}. ${s}`).join("\n")}`:null].filter(Boolean).join("\n\n");
    try{await navigator.clipboard.writeText(text);setCopied(true);setCopyError(false);}catch{setCopyError(true);}
  };
  return <section className="reel-details" aria-label="Detalhes do vídeo">
    <Tabs.Root className="detail-root" defaultValue="description" key={id}>
      <Tabs.List className="detail-tabs" aria-label="Conteúdo do vídeo"><Tabs.Trigger value="description">Descrição</Tabs.Trigger><Tabs.Trigger value="summary">Resumo</Tabs.Trigger><Tabs.Trigger value="transcript">Transcrição</Tabs.Trigger></Tabs.List>
      {error?<div className="detail-status" role="alert">Não foi possível carregar os detalhes.<Button variant="ghost" onClick={()=>setRetry(v=>v+1)}>Tentar novamente</Button></div>:!data?<p className="detail-status" role="status"><LoaderCircle size={18} className="loading-icon"/>Carregando detalhes</p>:<>
        <Tabs.Content value="description" className="detail-content"><p className="detail-text">{data.caption??"A legenda original ainda não está disponível."}</p></Tabs.Content>
        <Tabs.Content value="summary" className="detail-content">
          <div className="detail-prose">{readingParagraphs(data.summary??"O resumo ainda não está disponível.","summary").map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div>
          {data.recipe&&<section className="detail-fact"><h3>Ficha de receita</h3>{!!data.recipe.ingredients.length&&<><h4>Ingredientes</h4><ul>{data.recipe.ingredients.map((s,i)=><li key={i}>{s}</li>)}</ul></>}{!!data.recipe.steps.length&&<><h4>Modo de preparo</h4><ol>{data.recipe.steps.map((s,i)=><li key={i}>{s}</li>)}</ol></>}</section>}
          {data.place&&<section className="detail-fact"><h3>Ficha de lugar</h3><dl><dt>Endereço</dt><dd>{data.place.address}</dd><dt>Cidade</dt><dd>{data.place.city??"Não informada no conteúdo."}</dd></dl></section>}
          {!!data.tutorial.length&&<section className="detail-fact"><h3>Passo a passo</h3><ol>{data.tutorial.map((s,i)=><li key={i}>{s}</li>)}</ol></section>}
          <Button className="copy-summary" variant="outline" disabled={!data.summary&&!data.recipe&&!data.place&&!data.tutorial.length} onClick={copy}>{copied?<Check size={16}/>:<Copy size={16}/>} {copied?"Texto copiado":"Copiar texto"}</Button>
          {copyError&&<p role="alert">Não foi possível copiar. Selecione o texto para copiá-lo.</p>}
        </Tabs.Content>
        <Tabs.Content value="transcript" className="detail-content"><div className="detail-prose">{readingParagraphs(data.speechAbsent?"Ausência de fala confirmada.":data.transcription??"A transcrição ainda não está disponível. A ausência de fala não foi confirmada.").map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div></Tabs.Content>
      </>}
    </Tabs.Root>
  </section>;
}
