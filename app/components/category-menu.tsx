"use client";
import { DropdownMenu } from "radix-ui";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
export type Category={id:string;label:string};
export function CategoryMenu({values,options,disabled,onChange}:{values:Category[];options:Category[];disabled?:boolean;onChange:(ids:string[])=>void}){
  return <DropdownMenu.Root><DropdownMenu.Trigger asChild><Button className="category-edit" variant="ghost" disabled={disabled} aria-label={`Alterar categoria: ${values.map(v=>v.label).join(", ")||"sem categoria"}`}>{values.map(v=>v.label).join(" · ")||"Categoria"}<ChevronDown size={13}/></Button></DropdownMenu.Trigger><DropdownMenu.Portal><DropdownMenu.Content className="card-menu-content category-options" align="start" sideOffset={6} collisionPadding={12}><DropdownMenu.Label>Categorias</DropdownMenu.Label>{options.map(option=><DropdownMenu.CheckboxItem key={option.id} checked={values.some(v=>v.id===option.id)} disabled={disabled} onSelect={e=>e.preventDefault()} onCheckedChange={checked=>onChange(checked?[...values.map(v=>v.id),option.id]:values.filter(v=>v.id!==option.id).map(v=>v.id))}><span className="category-check"><DropdownMenu.ItemIndicator><Check size={15}/></DropdownMenu.ItemIndicator></span>{option.label}</DropdownMenu.CheckboxItem>)}{!options.length&&<DropdownMenu.Label>Nenhuma categoria disponível</DropdownMenu.Label>}</DropdownMenu.Content></DropdownMenu.Portal></DropdownMenu.Root>;
}
