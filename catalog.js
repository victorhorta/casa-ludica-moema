/* =====================================================================
   Casa Lúdica Moema — camada de dados + render do site público
   Lê do Supabase (se configurado) ou usa os dados de exemplo (config.js).
   ===================================================================== */
(function () {
  "use strict";

  var CFG = window.CASA_CONFIG || {};
  var db = null;
  if (CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY && window.supabase) {
    try { db = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY); }
    catch (e) { console.warn("Supabase indisponível, usando dados de exemplo.", e); }
  }

  /* ---------- ícones / trechos reutilizados ---------- */
  var IG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3zm6.8-11.2a1.5 1.5 0 1 1-1.5-1.5 1.5 1.5 0 0 1 1.5 1.5z"/></svg>';
  var WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.2.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.2-.3-.2-.6-.4zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>';
  var ARROW = '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24"><path d="M4 12l6 6L20 6"/></svg>';
  var PH = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.6"/><path d="M21 16l-5-5-6 6"/></svg>';
  var ZOOM = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/><path d="M11 8.2v5.6M8.2 11h5.6"/></svg>';
  var CHEV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  var PENCIL = '<span class="pencil"><span class="lead-tip"></span><span class="body"></span><span class="tip"></span></span>';
  function roof(color){
    return '<div class="roofwrap"><svg class="roof" viewBox="0 0 300 90" style="--c:'+color+'" aria-hidden="true">'
      + '<path pathLength="1" d="M20 80 L150 14 L280 80" stroke="var(--azul-noite)" stroke-width="11"/>'
      + '<path pathLength="1" d="M42 82 L150 28 L258 82" stroke="var(--rosa-amor)" stroke-width="7"/>'
      + '<path pathLength="1" d="M60 84 L150 40 L240 84" stroke="var(--salmao)" stroke-width="5"/></svg></div>';
  }

  function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
  function two(n){ return (n<10?"0":"")+n; }

  /* ---------- carregar dados ---------- */
  async function loadData(){
    if(!db){ return {cats: window.CASA_DEMO || [], settings: window.CASA_SETTINGS || {}}; }
    try{
      var c = await db.from("categories").select("id,slug,name,color,cta_title,cta_text,position").order("position");
      var s = await db.from("sections").select("id,category_id,name,color,position").order("position");
      var i = await db.from("items").select("id,section_id,title,description,image_url,position,active").eq("active", true).order("position");
      var st = await db.from("settings").select("*").eq("id", 1).maybeSingle();
      if(c.error || s.error || i.error) throw (c.error || s.error || i.error);
      var cats = (c.data || []).map(function(cat){
        cat.sections = (s.data || []).filter(function(x){return x.category_id===cat.id;}).map(function(sec){
          sec.items = (i.data || []).filter(function(y){return y.section_id===sec.id;});
          return sec;
        });
        return cat;
      });
      if(!cats.length){ return {cats: window.CASA_DEMO || [], settings: window.CASA_SETTINGS || {}}; }
      var settings = (st && st.data) ? st.data : (window.CASA_SETTINGS || {});
      return {cats: cats, settings: settings};
    }catch(e){
      console.warn("Falha ao ler do Supabase, usando dados de exemplo.", e);
      return {cats: window.CASA_DEMO || [], settings: window.CASA_SETTINGS || {}};
    }
  }

  /* ---------- render ---------- */
  function cardHTML(item, color, idx, catName, secName){
    var media = item.image_url
      ? '<div class="thumb zoom" style="padding:0" role="button" tabindex="0" aria-label="Ampliar imagem: '+esc(item.title)+'"><img src="'+esc(item.image_url)+'" alt="'+esc(item.title)+'" loading="lazy" style="width:100%;height:100%;object-fit:cover"/><span class="zoom-badge" aria-hidden="true">'+ZOOM+'</span></div>'
      : '<div class="thumb"><div class="ph">'+PH+'<span>foto do produto</span></div></div>';
    var desc = item.description ? '<p class="cap-desc">'+esc(item.description)+'</p>' : '';
    return '<div class="card reveal" style="--i:'+idx+'" data-cat="'+esc(catName||"")+'" data-sec="'+esc(secName||"")+'">'+media+'<div class="cap"><h4>'+esc(item.title)+'</h4>'+desc+'</div></div>';
  }

  function sectionHTML(sec, catColor, catName, bodyId){
    var color = sec.color || catColor;
    var items = sec.items || [];
    var cards = items.map(function(it,ix){ return cardHTML(it, color, ix, catName, sec.name); }).join("");
    var count = items.length ? (items.length + (items.length===1?" item":" itens")) : "";
    return '<div class="cat-section" style="--sc:'+color+'">'
      + '<button type="button" class="s-head reveal" aria-expanded="true" aria-controls="'+bodyId+'">'
      +   '<span class="sq"></span><h3>'+esc(sec.name)+'</h3><span class="count">'+count+'</span>'
      +   '<span class="chev" aria-hidden="true">'+CHEV+'</span>'
      + '</button>'
      + '<div class="s-body" id="'+bodyId+'"><div class="s-body-inner"><div class="grid">'+cards+'</div></div></div>'
      + '</div>';
  }

  function ctaHTML(cat, settings){
    return '<div class="cta"><div class="cta-card reveal" style="--c:'+cat.color+'">'
      + '<h3>'+esc(cat.cta_title || ("Quer saber mais sobre "+cat.name+"?"))+'</h3>'
      + '<p>'+esc(cat.cta_text || "Deixe seu e-mail e nossa equipe entra em contato.")+'</p>'
      + '<form class="cta-form" data-cat="'+esc(cat.name)+'">'
      +   '<input type="email" required placeholder="seu@email.com" aria-label="E-mail" />'
      +   '<button type="submit">Quero saber mais</button>'
      + '</form>'
      + '<p class="cta-ok">'+CHECK+' Recebemos seu contato! Em breve falamos com você.</p>'
      + '<div class="cta-social">'
      +   '<a href="'+esc(settings.instagram_url||"#")+'" target="_blank" rel="noopener">'+IG+' @casaludicamoema</a>'
      +   '<a href="'+esc(settings.whatsapp_url||"#")+'" target="_blank" rel="noopener">'+WA+' WhatsApp da loja</a>'
      + '</div></div></div>';
  }

  function categoryHTML(cat, idx, settings){
    var secs = (cat.sections || []).map(function(s, six){
      return sectionHTML(s, cat.color, cat.name, "secbody-"+esc(cat.slug)+"-"+six);
    }).join("");
    return roof(cat.color)
      + '<section class="cat" id="'+esc(cat.slug)+'" style="--c:'+cat.color+'">'
      + '<div class="cat-head">'
      +   '<div class="kicker reveal">Categoria '+two(idx+1)+'</div>'
      +   '<h2 class="reveal" style="--i:1">'+esc(cat.name)+'</h2>'
      +   '<div class="reveal" style="--i:2">'+PENCIL+'</div>'
      + '</div>'
      + secs
      + ctaHTML(cat, settings)
      + '</section>';
  }

  function render(data){
    var cats = (data.cats || []).slice(0, 3);
    var settings = data.settings || {};

    /* hero textos (se vierem das configurações) */
    var setTxt = function(sel, val){ var el=document.querySelector(sel); if(el && val) el.textContent = val; };
    setTxt(".hero h1", settings.hero_title);
    setTxt(".hero .slogan", settings.hero_slogan);
    setTxt(".hero .lead", settings.hero_lead);

    /* links Instagram / WhatsApp */
    var ig = settings.instagram_url || "#", wa = settings.whatsapp_url || "#";
    ["#wa-top","#wa-foot"].forEach(function(id){ var e=document.querySelector(id); if(e) e.href=wa; });
    var igf=document.querySelector("#ig-foot"); if(igf) igf.href=ig;

    /* nav (scroll-spy) */
    var spy = document.getElementById("spy");
    if(spy){ spy.innerHTML = cats.map(function(c){
      return '<a href="#'+esc(c.slug)+'" style="color:'+c.color+'"><span class="dot"></span>'+esc(c.name)+'</a>';
    }).join(""); }

    /* hero rooms */
    var rooms = document.getElementById("rooms");
    if(rooms){ rooms.innerHTML = cats.map(function(c,ix){
      var sub = (c.sections||[]).map(function(s){return s.name;}).join(" · ");
      return '<a class="room reveal" href="#'+esc(c.slug)+'" style="--c:'+c.color+'; --i:'+ix+'">'
        + '<div class="rnum">'+two(ix+1)+'</div><h3>'+esc(c.name)+'</h3>'
        + '<p>'+esc(sub)+'</p>'
        + '<span class="go">Ver espaço '+ARROW+'</span></a>';
    }).join(""); }

    /* catálogo */
    var root = document.getElementById("catalog-root");
    if(root){ root.innerHTML = cats.map(function(c,ix){ return categoryHTML(c, ix, settings); }).join(""); }

    wireLeads();
    initMotion();
    initZoom();
    initAccordion();
  }

  /* ---------- lightbox (ampliar imagem do produto) ---------- */
  function dataFromThumb(th){
    var im = th.querySelector("img");
    var card = th.closest(".card");
    var h = card ? card.querySelector("h4") : null;
    var d = card ? card.querySelector(".cap-desc") : null;
    return {
      src: im ? (im.getAttribute("src") || im.src) : "",
      title: h ? h.textContent : "",
      desc: d ? d.textContent : "",
      cat: card ? (card.getAttribute("data-cat") || "") : "",
      sec: card ? (card.getAttribute("data-sec") || "") : ""
    };
  }

  var lbBuilt = false;
  function buildLightbox(){
    if(lbBuilt) return; lbBuilt = true;
    var css = ""
      + ".thumb.zoom{cursor:zoom-in}"
      + ".thumb.zoom .zoom-badge{position:absolute;top:10px;right:10px;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.92);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(55,58,129,.18);opacity:0;transform:scale(.8);transition:opacity .2s ease,transform .2s ease;pointer-events:none}"
      + ".thumb.zoom .zoom-badge svg{width:17px;height:17px;stroke:var(--azul-noite,#373A81);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}"
      + ".card:hover .thumb.zoom .zoom-badge,.thumb.zoom:focus-visible .zoom-badge{opacity:1;transform:scale(1)}"
      + ".thumb.zoom:focus-visible{outline:3px solid var(--azul-noite,#373A81);outline-offset:2px}"
      + ".lb{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:24px}"
      + ".lb.open{display:flex}"
      + ".lb-backdrop{position:absolute;inset:0;background:rgba(31,33,74,.72);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);animation:lbfade .25s ease}"
      + ".lb-panel{position:relative;z-index:1;background:#fff;border-radius:var(--r-card,20px);width:auto;max-width:min(92vw,860px);max-height:90vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 30px 80px rgba(31,33,74,.45);animation:lbpop .28s cubic-bezier(.2,.8,.3,1)}"
      + ".lb-imgwrap{position:relative;background:#f4f5fb;display:flex;align-items:center;justify-content:center;padding:22px;min-height:0}"
      + ".lb-img{max-width:100%;max-height:64vh;width:auto;height:auto;object-fit:contain;display:block;border-radius:10px}"
      + ".lb-cap{padding:16px 22px 22px;border-top:1px solid #eef0f7}"
      + ".lb-meta{display:block;font-family:var(--ff-display);font-weight:600;font-size:.7rem;letter-spacing:.6px;text-transform:uppercase;color:#9096ad;margin-bottom:5px}"
      + ".lb-meta:empty{display:none}"
      + ".lb-cap h4{font-family:var(--ff-display);font-weight:500;font-size:1.18rem;color:var(--azul-noite,#373A81);margin:0}"
      + ".lb-cap p{margin:6px 0 0;font-size:.92rem;line-height:1.45;color:var(--tinta-suave,#5b5f77)}"
      + ".lb-cap p:empty{display:none}"
      + ".lb-close{position:absolute;top:12px;right:12px;z-index:3;width:38px;height:38px;border:none;border-radius:50%;background:rgba(255,255,255,.92);color:var(--azul-noite,#373A81);font-size:22px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(31,33,74,.25);transition:transform .15s ease,background .15s ease}"
      + ".lb-close:hover{transform:scale(1.08);background:#fff}"
      + ".lb-nav{position:absolute;top:50%;transform:translateY(-50%);z-index:2;width:42px;height:42px;border:none;border-radius:50%;background:rgba(255,255,255,.92);color:var(--azul-noite,#373A81);font-size:26px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(31,33,74,.25);transition:transform .15s ease,background .15s ease}"
      + ".lb-nav:hover{background:#fff;transform:translateY(-50%) scale(1.08)}"
      + ".lb-prev{left:12px}.lb-next{right:12px}"
      + "body.lb-lock{overflow:hidden}"
      + "@keyframes lbfade{from{opacity:0}to{opacity:1}}"
      + "@keyframes lbpop{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}"
      + "@media(max-width:520px){.lb-img{max-height:56vh}.lb-panel{max-width:94vw}.lb-imgwrap{padding:14px}.lb-nav{width:36px;height:36px;font-size:22px}.lb-prev{left:6px}.lb-next{right:6px}}"
      + "@media(prefers-reduced-motion:reduce){.lb-backdrop,.lb-panel{animation:none}}";
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

    var lb = document.createElement("div");
    lb.className = "lb"; lb.id = "lightbox";
    lb.setAttribute("role","dialog"); lb.setAttribute("aria-modal","true");
    lb.setAttribute("aria-hidden","true"); lb.setAttribute("aria-label","Imagem ampliada do produto");
    lb.innerHTML = '<div class="lb-backdrop" data-close></div>'
      + '<div class="lb-panel">'
      +   '<button class="lb-close" data-close aria-label="Fechar">×</button>'
      +   '<div class="lb-imgwrap">'
      +     '<button class="lb-nav lb-prev" aria-label="Item anterior">‹</button>'
      +     '<img class="lb-img" alt=""/>'
      +     '<button class="lb-nav lb-next" aria-label="Próximo item">›</button>'
      +   '</div>'
      +   '<div class="lb-cap"><span class="lb-meta"></span><h4 class="lb-title"></h4><p class="lb-desc"></p></div>'
      + '</div>';
    document.body.appendChild(lb);

    var img  = lb.querySelector(".lb-img"),
        meta = lb.querySelector(".lb-meta"),
        tt   = lb.querySelector(".lb-title"),
        dd   = lb.querySelector(".lb-desc"),
        prevBtn = lb.querySelector(".lb-prev"),
        nextBtn = lb.querySelector(".lb-next"),
        closeBtn = lb.querySelector(".lb-close"),
        items = [], idx = 0, lastFocus = null;

    function show(i){
      if(!items.length) return;
      idx = (i % items.length + items.length) % items.length;   /* wrap-around */
      var d = dataFromThumb(items[idx]);
      img.src = d.src; img.alt = d.title || "";
      meta.textContent = (d.cat && d.sec) ? (d.cat + " › " + d.sec) : (d.cat || d.sec || "");
      tt.textContent = d.title || ""; dd.textContent = d.desc || "";
      var multi = items.length > 1;
      prevBtn.style.display = nextBtn.style.display = multi ? "" : "none";
    }
    function openList(list, i){
      items = list || [];
      lastFocus = document.activeElement;
      lb.classList.add("open"); lb.setAttribute("aria-hidden","false");
      document.body.classList.add("lb-lock");
      show(i || 0);
      closeBtn.focus();
    }
    function close(){
      lb.classList.remove("open"); lb.setAttribute("aria-hidden","true");
      document.body.classList.remove("lb-lock");
      img.removeAttribute("src"); items = [];
      if(lastFocus && lastFocus.focus){ lastFocus.focus(); }
    }
    prevBtn.addEventListener("click", function(){ show(idx - 1); });
    nextBtn.addEventListener("click", function(){ show(idx + 1); });
    lb.addEventListener("click", function(e){ if(e.target.hasAttribute("data-close")) close(); });
    document.addEventListener("keydown", function(e){
      if(!lb.classList.contains("open")) return;
      if(e.key === "Escape"){ close(); }
      else if(e.key === "ArrowLeft"){ e.preventDefault(); show(idx - 1); }
      else if(e.key === "ArrowRight"){ e.preventDefault(); show(idx + 1); }
    });
    window.__casaLb = { openList: openList };
  }

  function initZoom(){
    buildLightbox();
    var root = document.getElementById("catalog-root");
    if(!root || root.__zoomWired) return; root.__zoomWired = true;
    function openFromThumb(thumb){
      var all = Array.prototype.slice.call(root.querySelectorAll(".thumb.zoom"));
      var i = all.indexOf(thumb); if(i < 0) i = 0;
      window.__casaLb.openList(all, i);
    }
    root.addEventListener("click", function(e){
      var thumb = e.target.closest(".thumb.zoom"); if(thumb) openFromThumb(thumb);
    });
    root.addEventListener("keydown", function(e){
      if(e.key !== "Enter" && e.key !== " ") return;
      var thumb = e.target.closest(".thumb.zoom"); if(!thumb) return;
      e.preventDefault(); openFromThumb(thumb);
    });
  }

  /* ---------- seções colapsáveis (sanfona) ---------- */
  function initAccordion(){
    var root = document.getElementById("catalog-root");
    if(!root || root.__accWired) return; root.__accWired = true;
    root.addEventListener("click", function(e){
      var head = e.target.closest(".s-head");
      if(!head || !root.contains(head)) return;
      var open = head.getAttribute("aria-expanded") !== "false";
      head.setAttribute("aria-expanded", open ? "false" : "true");
    });
  }

  /* ---------- formulário de leads ---------- */
  function wireLeads(){
    document.querySelectorAll(".cta-form").forEach(function(form){
      form.addEventListener("submit", async function(e){
        e.preventDefault();
        var input = form.querySelector('input[type=email]');
        var email = input ? input.value.trim() : "";
        var cat = form.getAttribute("data-cat") || "";
        var card = form.closest(".cta-card");
        var btn = form.querySelector("button");
        if(btn){ btn.disabled = true; }
        try{
          if(db){ await db.from("leads").insert({ email: email, category: cat }); }
          /* notificação por e-mail (quando publicado na Vercel com /api/lead) */
          try{ await fetch("/api/lead", {method:"POST", headers:{"Content-Type":"application/json"},
            body: JSON.stringify({email:email, category:cat})}); }catch(_){}
        }catch(err){ console.warn("Não foi possível salvar o lead:", err); }
        form.style.display = "none";
        var ok = card.querySelector(".cta-ok");
        if(ok) ok.style.display = "flex";
      });
    });
  }

  /* ---------- animações (reveal + scroll-spy) ---------- */
  function initMotion(){
    var revObs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add("in"); revObs.unobserve(en.target); } });
    }, {threshold:.05, rootMargin:"0px 0px -4% 0px"});
    document.querySelectorAll(".reveal, .roof").forEach(function(el){ revObs.observe(el); });

    var links = Array.prototype.slice.call(document.querySelectorAll(".spy a"));
    links.forEach(function(a){ a.dataset.color = getComputedStyle(a).color; });
    var spyObs = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          var id = en.target.id;
          links.forEach(function(a){
            var on = a.getAttribute("href") === "#"+id;
            a.setAttribute("aria-current", on?"true":"false");
            a.style.background = on ? a.dataset.color : "transparent";
            a.style.color = on ? "#fff" : a.dataset.color;
          });
        }
      });
    }, {rootMargin:"-45% 0px -50% 0px"});
    document.querySelectorAll(".cat").forEach(function(s){ spyObs.observe(s); });
  }

  /* ---------- início ---------- */
  function start(){ loadData().then(render); }
  if(document.readyState === "loading"){ document.addEventListener("DOMContentLoaded", start); }
  else { start(); }
})();
