"use client";
import * as React from "react";
import { Dialog } from "radix-ui";
import { RefreshCw, X, Copy, Check, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { capturePrompt, CAPTURE_CHAT_URL } from "@/lib/razu";

export function CaptureNow({disabled,onRefresh}:{disabled:boolean;onRefresh:()=>void}){
  const [open,setOpen]=React.useState(false),[prompt,setPrompt]=React.useState(""),[copied,setCopied]=React.useState(false),[error,setError]=React.useState(false);
  const field=React.useRef<HTMLTextAreaElement>(null);
  const copy=async()=>{
    try{await navigator.clipboard.writeText(prompt);setCopied(true);setError(false);}
    catch{setError(true);field.current?.focus();field.current?.select();}
  };
  return <Dialog.Root open={open} onOpenChange={value=>{setOpen(value);if(value){setPrompt(capturePrompt(window.location.origin));setCopied(false);setError(false);}}}>
    <Dialog.Trigger asChild><Button className="capture-button glass-control" variant="outline" size="icon" aria-label="Atualizar biblioteca" title="Atualizar biblioteca" disabled={disabled}><RefreshCw size={18} aria-hidden="true"/></Button></Dialog.Trigger>
    <Dialog.Portal><Dialog.Overlay className="sheet-overlay"/><Dialog.Content className="capture-panel" aria-describedby="capture-help">
      <div className="panel-heading glass-panel-heading"><Dialog.Title>Atualizar a biblioteca</Dialog.Title><Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="Fechar atualização"><X size={20}/></Button></Dialog.Close></div>
      <p id="capture-help">Peça uma captura agora, sem esperar o próximo horário. O Work usa sua sessão privada do Instagram e mantém a programação existente.</p>
      <ol className="capture-steps"><li>Copie o pedido abaixo.</li><li>Abra esta conversa no Work do aplicativo do ChatGPT no celular e envie o pedido.</li><li>Ao terminar, volte aqui e recarregue os resultados.</li></ol>
      <label htmlFor="capture-prompt">Pedido de captura imediata</label>
      <textarea ref={field} id="capture-prompt" readOnly value={prompt} rows={4}/>
      <div className="capture-actions"><Button onClick={copy}>{copied?<Check size={16}/>:<Copy size={16}/>} {copied?"Pedido copiado":"Copiar pedido"}</Button><Button variant="outline" asChild><a href={CAPTURE_CHAT_URL} target="_blank" rel="noopener noreferrer">Abrir conversa<ArrowUpRight size={16}/></a></Button></div>
      <p className="capture-status" role="status">{error?"Selecione e copie o pedido acima.":copied?"Agora envie o pedido no Work. A captura começa após o envio.":"O botão prepara o pedido; a captura é executada pelo agente no Work."}</p>
      <Button className="refresh-results" variant="ghost" onClick={()=>{onRefresh();setOpen(false);}}><RefreshCw size={16}/>Recarregar resultados</Button>
    </Dialog.Content></Dialog.Portal>
  </Dialog.Root>;
}
