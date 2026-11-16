// JS compartilhado - cada página chama as funções que usa
function toggleTema(){document.body.classList.toggle('escuro');
  try{localStorage.setItem('tema',document.body.classList.contains('escuro')?'e':'c')}catch(e){}}
try{if(localStorage.getItem('tema')==='e')document.addEventListener('DOMContentLoaded',()=>document.body.classList.add('escuro'))}catch(e){}
function $(id){return document.getElementById(id)}

function fraseAleatoria(){
  const f=['O mundo é um livro; quem não viaja lê só uma página.','Viajar é a única coisa que compramos que nos deixa mais ricos.','Nem todos os que vagam estão perdidos.','Aventura é o melhor caminho para conhecer a si mesmo.'];
  $('frase').textContent=f[Math.floor(Math.random()*f.length)];}
function mostrarCuriosidade(){$('curiosidade').classList.toggle('oculto');
  $('btn-cur').textContent=$('curiosidade').classList.contains('oculto')?'Mostrar curiosidade':'Esconder curiosidade';}
function filtrar(tipo){document.querySelectorAll('.item-galeria').forEach(i=>{
  i.classList.toggle('oculto',tipo!=='todos'&&i.dataset.tipo!==tipo)});}
function calcular(){const d=+$('dias').value,v=+$('diaria').value,p=+$('pessoas').value;
  $('total').textContent=(d>0&&v>=0&&p>0)?`Custo estimado: R$ ${(d*v*p).toFixed(2)}`:'Preencha valores válidos.';}
function abrirFaq(el){el.nextElementSibling.classList.toggle('oculto');}
function contarChecks(){const t=document.querySelectorAll('.check').length,
  m=document.querySelectorAll('.check:checked').length;$('progresso').textContent=`${m} de ${t} itens na mala`;}
function enviarContato(e){e.preventDefault();const n=$('nome').value.trim(),m=$('email').value.trim(),
  msg=$('msg').value.trim(),r=$('retorno');
  if(n.length<3||!m.includes('@')||msg.length<10){r.className='erro';r.textContent='Preencha nome, e-mail válido e mensagem (mín. 10 letras).';return;}
  r.className='';r.textContent=`Obrigado, ${n}! Mensagem recebida (simulação).`;}

// API 1 - Open-Meteo (clima)
async function buscarClima(){const c=$('cidade').value.trim(),r=$('res');if(!c)return;r.textContent='Buscando...';
  try{const g=await(await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(c)}&count=1&language=pt`)).json();
    if(!g.results){r.innerHTML='<span class="erro">Cidade não encontrada.</span>';return;}
    const l=g.results[0];
    const w=(await(await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${l.latitude}&longitude=${l.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m`)).json()).current;
    r.innerHTML=`<h3>${l.name} - ${l.country}</h3>🌡️ ${w.temperature_2m} °C<br>💧 Umidade: ${w.relative_humidity_2m}%<br>💨 Vento: ${w.wind_speed_10m} km/h`;
  }catch(e){r.innerHTML='<span class="erro">Erro ao consultar a API.</span>';}}
// API 2 - REST Countries
async function buscarPais(){const p=$('pais').value.trim(),r=$('res');if(!p)return;r.textContent='Buscando...';
  try{const x=await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(p)}?fields=name,capital,population,region,flags,languages,currencies`);
    if(!x.ok)throw 0;const d=(await x.json())[0];
    r.innerHTML=`<img src="${d.flags.png}" alt="bandeira" width="120"><h3>${d.name.common}</h3>Capital: ${(d.capital||['-'])[0]}<br>Região: ${d.region}<br>População: ${d.population.toLocaleString('pt-BR')}<br>Idiomas: ${Object.values(d.languages||{}).join(', ')}<br>Moeda: ${Object.values(d.currencies||{}).map(m=>m.name).join(', ')}`;
  }catch(e){r.innerHTML='<span class="erro">País não encontrado (use o nome em inglês, ex.: Japan).</span>';}}
// API 3 - ViaCEP
async function buscarCep(){const c=$('cep').value.replace(/\D/g,''),r=$('res');
  if(c.length!==8){r.innerHTML='<span class="erro">CEP deve ter 8 dígitos.</span>';return;}
  try{const d=await(await fetch(`https://viacep.com.br/ws/${c}/json/`)).json();
    if(d.erro){r.innerHTML='<span class="erro">CEP não encontrado.</span>';return;}
    r.innerHTML=`📍 ${d.logradouro||'-'}<br>Bairro: ${d.bairro||'-'}<br>${d.localidade} - ${d.uf}<br>DDD: ${d.ddd}`;
  }catch(e){r.innerHTML='<span class="erro">Erro ao consultar a API.</span>';}}
