"use client";

import * as React from "react";
import { Dialog } from "radix-ui";
import { ArrowUpRight, ChevronDown, ChevronUp, LoaderCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryMenu, type Category } from "@/components/category-menu";
import { ReelDetails } from "@/components/reel-details";

type Reference = { title:string;categories:Category[];removed:boolean;saved_at:string;id:string; creator:string|null; source_url:string; cover_url?:string|null };
type Props = {
  categories:Category[];
  busy:boolean;
  onCategories:(item:Reference,ids:string[])=>void;
  initial:Reference;
  items:Reference[];
  total:number;
  hasMore:boolean;
  loadMore:()=>Promise<Reference[]>;
  onClose:()=>void;
};

export function ReelPlayer({initial,items,total,hasMore,loadMore,onClose,categories,busy,onCategories}:Props) {
  const [selected,setCurrent]=React.useState(initial);
  const current=items.find(item=>item.id===selected.id)??selected;
  const panel=React.useRef<HTMLDivElement>(null);
  const [loading,setLoading]=React.useState(false);
  const [error,setError]=React.useState("");
  React.useEffect(()=>{panel.current?.scrollTo({top:0});},[current.id]);
  const pending=React.useRef(false);
  const mounted=React.useRef(true);
  const origin=React.useRef(typeof document!=="undefined"?document.activeElement as HTMLElement:null);
  const index=items.findIndex(item=>item.id===current.id);
  const hasPrevious=index>0;
  const hasNext=index>=0&&(index<items.length-1||hasMore);
  React.useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);

  const move=async(direction:-1|1)=>{
    if(pending.current||!(direction===1?hasNext:hasPrevious))return;
    setError("");
    const next=items[index+direction];
    if(next){setCurrent(next);return;}
    pending.current=true;setLoading(true);
    try{
      const more=await loadMore();
      if(mounted.current&&more[0])setCurrent(more[0]);
    }catch(e){if(mounted.current)setError((e as Error).message);}
    finally{pending.current=false;if(mounted.current)setLoading(false);}
  };

  return <Dialog.Root open onOpenChange={open=>{if(!open)onClose();}}>
    <Dialog.Portal>
      <Dialog.Overlay className="sheet-overlay"/>
      <Dialog.Content ref={panel} className="player-panel" aria-describedby={undefined}
        onCloseAutoFocus={event=>{event.preventDefault();origin.current?.focus();}}
        onKeyDown={event=>{
          if(event.altKey||event.ctrlKey||event.metaKey||(event.target as Element).closest('.reel-details'))return;
          if(event.key==="ArrowDown"||event.key==="ArrowUp"){
            event.preventDefault();void move(event.key==="ArrowDown"?1:-1);
          }
        }}>
        <div className="panel-heading glass-panel-heading player-topbar">
          <Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="Voltar à biblioteca"><ArrowLeft size={22}/></Button></Dialog.Close>
          <span className="player-top-label">Seu repertório</span>
          <a className="player-source-icon" href={current.source_url} target="_blank" rel="noopener noreferrer" aria-label="Abrir vídeo no Instagram"><ArrowUpRight size={21}/></a>
        </div>
        <div className="player-body">
          <div className="active-video"><iframe key={current.id} title={`Reel de ${current.creator??"criador"} no Instagram`}
            src={`${current.source_url}embed/`} sandbox="allow-scripts allow-same-origin allow-presentation" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen loading="eager"/></div>
          <div className="player-navigation" role="group" aria-label="Navegar pelas referências">
            <Button variant="ghost" size="icon" aria-label="Referência anterior" disabled={!hasPrevious||loading} onClick={()=>void move(-1)}><ChevronUp size={22}/></Button>
            <span>{index+1} de {total}</span>
            <Button variant="ghost" size="icon" aria-label="Próxima referência" disabled={!hasNext||loading} onClick={()=>void move(1)}>{loading?<LoaderCircle size={22} className="loading-icon"/>:<ChevronDown size={22}/>}</Button>
          </div>
        </div>
        <div className="player-identity"><CategoryMenu values={current.categories} options={categories} disabled={busy||current.removed} onChange={ids=>onCategories(current,ids)}/><Dialog.Title>{current.title}</Dialog.Title><div className="player-meta"><span>@{current.creator??"criador"} · Vídeo</span><time dateTime={current.saved_at}>Salvo em {new Intl.DateTimeFormat("pt-BR",{day:"numeric",month:"short",year:"numeric"}).format(new Date(current.saved_at))}</time></div></div>
        <div className="player-position" role="status" aria-live="polite">{index+1} de {total}{loading?" · Carregando":!hasNext?" · Fim das referências":""}</div>
        {error&&<p className="player-error" role="alert">{error} Use a seta para tentar novamente.</p>}
        <a className="instagram-fallback" href={current.source_url} target="_blank" rel="noopener noreferrer">Abrir no Instagram<ArrowUpRight size={16}/></a>
        <ReelDetails key={current.id} id={current.id}/>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
