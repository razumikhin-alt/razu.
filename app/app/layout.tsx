import type { Metadata } from "next";
import "./globals.css";
import "./razu.css";
export const metadata:Metadata={title:"razu.",description:"razu. — seu repertório privado de Reels, ideias e referências.",icons:{icon:"/razu-icon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>;}
