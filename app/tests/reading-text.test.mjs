import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
const bundle=await build({entryPoints:[new URL('../lib/reading-text.ts',import.meta.url).pathname],bundle:true,write:false,format:'esm',platform:'node'});
const {readingParagraphs,readingText}=await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
const words=text=>text.replace(/\s+/g,' ').trim();
test('long transcript gains paragraph boundaries while preserving every source word and number',()=>{
  const text='Misture 3,5 oz de água com 100g de café. '.repeat(24)+'Sirva a 85 °C sem alterar a receita.';
  const p=readingParagraphs(text);
  assert(p.length>3);assert.equal(words(p.join(' ')),words(text));assert.equal(words(readingText(text)),words(text));
});
test('summary becomes readable paragraphs, with original order and no rewritten evidence',()=>{
  const text='O vídeo apresenta uma receita de café com espuma e raspas de laranja, preparada em um copo alto. A pessoa acrescenta a bebida lentamente para formar camadas visíveis. A espuma é colocada sobre o café e finalizada com raspas. A apresentação termina mostrando o copo pronto sobre a bancada.';
  const p=readingParagraphs(text,'summary');assert(p.length>=2);assert.equal(words(p.join(' ')),words(text));
});
test('preserves existing paragraphs, numbered instructions, multilingual speech and no-speech states',()=>{
  const text='Hello, world!\n\n1. Use ½ xícara.\n2. Ajouter 30 ml.\n\nEspere!';
  assert.deepEqual(readingParagraphs(text),['Hello, world!','1. Use ½ xícara.','2. Ajouter 30 ml.','Espere!']);
  assert.deepEqual(readingParagraphs(''),[]);assert.deepEqual(readingParagraphs('Ausência de fala confirmada.'),['Ausência de fala confirmada.']);
});
test('unpunctuated ASR is separated only at whitespace and keeps every word',()=>{
  const text='fala sem pontuação com receitas e instruções '.repeat(70);const p=readingParagraphs(text);
  assert(p.length>3);assert.equal(words(p.join(' ')),words(text));
});

test('capture request is manual, private, and preserves the existing automation',async()=>{
 const b=await build({entryPoints:[new URL('../lib/razu.ts',import.meta.url).pathname],bundle:true,write:false,format:'esm',platform:'node'});
 const {capturePrompt,APP_NAME,CAPTURE_CHAT_URL}=await import(`data:text/javascript;base64,${Buffer.from(b.outputFiles[0].text).toString('base64')}`);
 const text=capturePrompt('https://private.example');assert.equal(APP_NAME,'razu.');assert.match(text,/trigger=manual/);assert.match(text,/https:\/\/private.example/);assert.match(text,/Não crie nem altere agendamentos/);assert.match(text,/baseline/);assert.match(text,/exclusões/);assert.match(text,/privados/);assert.match(CAPTURE_CHAT_URL,/^https:\/\/chatgpt.com\/c\//);
});
