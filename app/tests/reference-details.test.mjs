import test from "node:test";
import assert from "node:assert/strict";
import {build} from "esbuild";
const bundle=await build({entryPoints:[new URL('../server/reference-details.ts',import.meta.url).pathname],bundle:true,write:false,format:'esm',platform:'node'});
const {buildDetails}=await import(`data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`);
test('keeps the entire caption and original speech, with no metadata or invented speech',()=>{
  const caption='Minha receita\n\n#café';const d=buildDetails({content_version:'1.2.0',caption,transcription:null,availability:{transcription:'unavailable'},music:'Track',location:'Location'});
  assert.equal(d.caption,caption);assert.equal(d.transcription,null);assert.equal(d.speechAbsent,false);assert.equal(d.recipe,null);assert.equal(d.place,null);
  assert.equal(buildDetails({availability:{transcription:'absent'},transcription:''}).speechAbsent,true);
});
test('extracts compact quantities, fractional amounts and ordered preparation without changing measurements',()=>{
  const d=buildDetails({content_version:'1.2.0',caption:'Recipe:\n100g coffee\n800g water\n▫️3 1/2 oz syrup\nWhip until soft peaks form. Pour over ice.',transcription:'original',semantic_description:'Cold foam.'});
  assert.deepEqual(d.recipe.ingredients,['100g coffee','800g water','▫️3 1/2 oz syrup']);assert.deepEqual(d.recipe.steps,['Whip until soft peaks form.','Pour over ice.']);assert.equal(d.summary,'Cold foam.');
});
test('isolates an explicit address and city and never infers a city from an abbreviation',()=>{
  const d=buildDetails({caption:'praça visconde de sousa fontes, 120 - parque da mooca, SP.',semantic_description:'Visita em São Paulo, com amigos.',transcription:'Visita em São Paulo, com amigos.'});
  assert.match(d.place.address,/120/);assert.equal(d.place.city,'São Paulo');assert.equal(buildDetails({caption:'Rua das Flores, 10'}).place.city,null);
});
test('numbers tutorials while keeping instruction order',()=>{
  assert.deepEqual(buildDetails({transcription:'Abra as configurações. Selecione a conta. Salve a alteração.'}).tutorial,['Abra as configurações.','Selecione a conta.','Salve a alteração.']);
  assert.deepEqual(buildDetails({transcription:'1. Abra o menu\n2. Confirme'}).tutorial,['Abra o menu','Confirme']);
});
