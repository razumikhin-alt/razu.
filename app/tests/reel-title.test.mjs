import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
const bundle=await build({entryPoints:[new URL('../lib/reel-title.ts',import.meta.url).pathname],bundle:true,write:false,format:'esm',platform:'node'});
const {reelTitle}=await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
test('existing summaries and future leading sentences yield short content titles',()=>{
  assert.equal(reelTitle({semantic_description:'O vídeo ensina café vietnamita com coco. Preparação detalhada.'}),'Café vietnamita com coco');
  assert.equal(reelTitle({semantic_description:'Café vietnamita com coco.\n\nResumo completo com medidas e modo de preparo.'}),'Café vietnamita com coco');
  assert.equal(reelTitle({description:'Tutorial de texto atrás de pessoas no CapCut.'}),'Texto atrás de pessoas');
  assert.equal(reelTitle({semantic_description:'Uma demonstração de bar ensina a recuperar hortelã murcha. Depois explica as etapas.'}),'Recuperar hortelã murcha');
  assert.equal(reelTitle({semantic_description:'O Reel mostra como preparar café vietnamita com coco. Medidas e etapas.'}),'Preparar café vietnamita com coco');
});
test('unverified content never supplies a title or modifies source fields',()=>{
  const data={caption:'Uma promessa',transcription:'Outro assunto'};assert.equal(reelTitle(data),'Vídeo aguardando análise');assert.deepEqual(data,{caption:'Uma promessa',transcription:'Outro assunto'});
  assert.ok(reelTitle({semantic_description:'Palavra '.repeat(40)}).length<=38);
});
