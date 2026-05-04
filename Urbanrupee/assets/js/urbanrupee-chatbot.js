(function () {
  "use strict";
  if (window.__urbanrupeeChatbotLoaded) return;
  window.__urbanrupeeChatbotLoaded = true;

  /** Optional server bridge — never expose vendor API keys in static HTML.
   *  window.URBANRUPEE_CHATBOT_API = { chat: "/api/chat", rag: "/api/rag", handoff: "/api/ticket" };
   *  Wire a tiny backend or serverless for LLM/RAG, human handoff (Crisp/Intercom/email), and rate limits. */

  /** Wikipedia summaries are disabled by default so visitors only see Urbanrupee Q&A + on-site fallbacks. */
  function wikipediaFallbackEnabled() {
    return typeof window !== "undefined" && window.URBANRUPEE_CHATBOT_WIKIPEDIA === true;
  }

  var STYLE_ID = "urbanrupee-chatbot-inline-css-v11";
  var FAB_SVG =
    '<svg class="ur-chat__fab-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';

  function scriptSrc() {
    var cs = document.currentScript;
    if (cs && cs.src) return cs.src;
    var nodes = document.getElementsByTagName("script");
    for (var i = nodes.length - 1; i >= 0; i--) {
      var s = nodes[i].src || "";
      if (s.indexOf("urbanrupee-chatbot") !== -1) return s;
    }
    return "";
  }

  /** Site logo fallback (JPEG) if dedicated chatbot PNGs fail to load */
  function fallbackLogoUrl() {
    var base = scriptSrc();
    if (!base) return "assets/images/logo/logo.png";
    try {
      return new URL("../images/logo/logo.png", base).href;
    } catch (e) {
      return "assets/images/logo/logo.png";
    }
  }

  /** Shield / “R” mark — FAB + bot message avatar */
  function chatbotMarkUrl() {
    var base = scriptSrc();
    if (!base) return "assets/images/logo/urbanrupee-chatbot-mark.png";
    try {
      return new URL("../images/logo/urbanrupee-chatbot-mark.png", base).href;
    } catch (e) {
      return "assets/images/logo/urbanrupee-chatbot-mark.png";
    }
  }

  /** Panel header uses the same clean mark as the FAB (no full-UI screenshots — they stack on the real header and look nested). */
  function chatbotHeaderLogoUrl() {
    return chatbotMarkUrl();
  }

  function injectCriticalCss() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent =
      "#ur-chat-root{--ur-brand-l:#58d1d7;--ur-brand-m:#38a2c0;--ur-brand-d:#1a7ea2;--ur-chat-bg:#1a7ea2;--ur-chat-panel:#fff;--ur-chat-accent:#1a7ea2;--ur-chat-accent-hover:#38a2c0;--ur-chat-text:#0f172a;--ur-chat-muted:#64748b;--ur-chat-bot-bubble:#fff;--ur-chat-user-bubble:#c8eef2;--ur-chat-radius:12px;--ur-chat-shadow:0 12px 42px rgba(26,126,162,.22);font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;font-size:clamp(.875rem,2.5vw,.9rem);line-height:1.45;position:fixed!important;right:max(12px,env(safe-area-inset-right))!important;bottom:max(12px,env(safe-area-inset-bottom))!important;left:auto!important;top:auto!important;z-index:2147483646!important;width:auto;max-width:min(100vw - 16px,440px);margin:0!important;padding:0!important;display:flex!important;flex-direction:column-reverse;align-items:flex-end;gap:10px;pointer-events:none;box-sizing:border-box;opacity:1!important;visibility:visible!important}" +
      "#ur-chat-root *,#ur-chat-root *::before,#ur-chat-root *::after{box-sizing:border-box}" +
      "#ur-chat-root.ur-chat--open{pointer-events:auto;align-items:stretch!important;flex-direction:column-reverse!important;gap:0!important;width:min(100vw - 24px,440px)!important;max-width:440px!important;background:transparent!important;padding:0!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important}" +
      "#ur-chat-root .ur-chat__fab{pointer-events:auto;position:relative;flex-shrink:0;width:clamp(58px,16vw,68px);height:clamp(58px,16vw,68px);border:none;border-radius:50%;cursor:pointer;background:linear-gradient(135deg,#58d1d7 0%,#38a2c0 48%,#1a7ea2 100%);box-shadow:var(--ur-chat-shadow);display:flex;align-items:center;justify-content:center;padding:0;color:#fff;transition:transform .2s ease,box-shadow .2s ease}" +
      "#ur-chat-root .ur-chat__fab:hover{transform:scale(1.04);box-shadow:0 14px 44px rgba(15,23,42,.22)}" +
      "#ur-chat-root .ur-chat__fab:focus-visible{outline:3px solid #38a2c0;outline-offset:2px}" +
      "#ur-chat-root .ur-chat__fab .ur-chat__fab-icon{width:54%;height:54%;flex-shrink:0;pointer-events:none}" +
      "#ur-chat-root .ur-chat__fab .ur-chat__fab-logo{position:absolute;inset:5px;z-index:1;width:calc(100% - 10px);height:calc(100% - 10px);object-fit:contain;object-position:center;background:#fff;border-radius:50%;border:2px solid rgba(255,255,255,.95);box-sizing:border-box;pointer-events:none}" +
      "#ur-chat-root .ur-chat__fab .ur-chat__fab-label{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}" +
      "#ur-chat-root .ur-chat__panel{pointer-events:auto;display:none;flex-direction:column;flex-shrink:0;position:relative;width:100%;height:min(620px,80dvh);max-height:min(620px,80dvh);min-height:min(480px,64dvh);margin:0;background:#f8f9fb;border-radius:12px;box-shadow:0 12px 42px rgba(26,126,162,.2),0 2px 10px rgba(0,0,0,.06);overflow:hidden;border:1px solid rgba(26,126,162,.25)}" +
      "#ur-chat-root .ur-chat__wave-bg{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;border-radius:inherit}" +
      "#ur-chat-root .ur-chat__wave-bg .ur-chat__wave-svg{position:absolute;left:0;right:0;bottom:0;width:100%;min-width:0;height:min(48%,200px);max-height:200px;display:block;animation:urChatSvgBob 17s ease-in-out infinite}" +
      "#ur-chat-root .ur-chat__wave-band--back,#ur-chat-root .ur-chat__wave-band--mid,#ur-chat-root .ur-chat__wave-band--front{transform-box:fill-box}" +
      "#ur-chat-root .ur-chat__wave-band--back{animation:urChatWv1 6.8s linear infinite;will-change:transform}" +
      "#ur-chat-root .ur-chat__wave-band--mid{animation:urChatWv1 5.9s linear infinite reverse;will-change:transform;opacity:.92}" +
      "#ur-chat-root .ur-chat__wave-band--front{animation:urChatWv2 4.5s linear infinite;will-change:transform}" +
      "@keyframes urChatWv1{0%{transform:translate3d(0,0,0)}100%{transform:translate3d(-50%,0,0)}}" +
      "@keyframes urChatWv2{0%{transform:translate3d(0,0,0)}100%{transform:translate3d(-50%,0,0)}}" +
      "@keyframes urChatSvgBob{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-4px,0)}}" +
      "#ur-chat-root .ur-chat__panel>.ur-chat__head,#ur-chat-root .ur-chat__panel>.ur-chat__messages-wrap,#ur-chat-root .ur-chat__panel>.ur-chat__typing,#ur-chat-root .ur-chat__panel>.ur-chat__foot,#ur-chat-root .ur-chat__panel>.ur-chat__team-cta{position:relative;z-index:1}" +
      "#ur-chat-root.ur-chat--open .ur-chat__panel{display:flex!important;width:100%!important;max-width:100%!important;margin:0!important;height:min(620px,80dvh)!important;max-height:min(620px,80dvh)!important;min-height:min(480px,64dvh)!important;border-radius:12px!important;box-shadow:0 12px 42px rgba(26,126,162,.22),0 2px 10px rgba(0,0,0,.07)!important;border:1px solid rgba(26,126,162,.3)!important}" +
      "#ur-chat-root.ur-chat--open .ur-chat__fab{display:none}" +
      "#ur-chat-root .ur-chat__head{flex-shrink:0;display:flex;align-items:center;gap:12px;padding:14px 16px;min-height:60px;background:linear-gradient(135deg,#58d1d7 0%,#38a2c0 45%,#1a7ea2 100%);color:#fff;border-bottom:1px solid rgba(255,255,255,.22);box-shadow:0 1px 0 rgba(0,0,0,.08) inset}" +
      "#ur-chat-root .ur-chat__head .ur-chat__head-logo-wrap{flex-shrink:0;width:48px;height:48px;border-radius:12px;background:#fff;padding:5px;display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 2px 8px rgba(0,40,60,.15)}" +
      "#ur-chat-root .ur-chat__head .ur-chat__head-logo-wrap img{width:100%;height:100%;object-fit:contain;object-position:center;display:block}" +
      "#ur-chat-root .ur-chat__head .ur-chat__head-mark{display:flex;align-items:center;justify-content:center;width:100%;height:100%;font-size:.8rem;font-weight:800;color:#1a7ea2;letter-spacing:-.03em}" +
      "#ur-chat-root .ur-chat__head-text{flex:1;min-width:0}" +
      "#ur-chat-root .ur-chat__head-text strong{display:block;font-size:1.05rem;font-weight:700;letter-spacing:.01em;text-shadow:0 1px 1px rgba(0,0,0,.12)}" +
      "#ur-chat-root .ur-chat__head-text span{display:block;font-size:.72rem;opacity:.95;font-weight:500}" +
      "#ur-chat-root .ur-chat__close{flex-shrink:0;width:40px;height:40px;border:none;border-radius:10px;background:rgba(255,255,255,.18);color:#fff;font-size:1.35rem;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}" +
      "#ur-chat-root .ur-chat__close:hover{background:rgba(255,255,255,.28)}" +
      "#ur-chat-root .ur-chat__messages{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;padding:14px 14px 12px;display:flex;flex-direction:column;gap:10px;background:linear-gradient(180deg,rgba(255,255,255,.88) 0%,rgba(248,249,251,.45) 42%,rgba(230,243,247,.72) 100%),radial-gradient(circle at 18% 12%,rgba(88,209,215,.08) 0,transparent 42%),radial-gradient(circle at 82% 70%,rgba(26,126,162,.06) 0,transparent 38%);-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;outline:none}" +
      "#ur-chat-root .ur-chat__messages::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}" +
      "#ur-chat-root .ur-chat__msg{max-width:90%;padding:8px 12px;border-radius:10px;color:var(--ur-chat-text);word-wrap:break-word;font-size:.9rem;line-height:1.45;box-shadow:0 1px 1px rgba(0,0,0,.04)}" +
      "#ur-chat-root .ur-chat__msg--bot{align-self:flex-start;background:#fff;border-bottom-left-radius:4px;border:1px solid rgba(26,126,162,.12);max-width:100%}" +
      "#ur-chat-root .ur-chat__msg--bot .ur-chat__msg-inner{display:flex;align-items:flex-start;gap:10px;max-width:100%}" +
      "#ur-chat-root .ur-chat__msg--bot .ur-chat__msg-avatar{flex-shrink:0;width:34px;height:34px;border-radius:10px;object-fit:contain;object-position:center;background:#fff;border:1px solid rgba(26,126,162,.18);box-shadow:0 1px 3px rgba(0,0,0,.06)}" +
      "#ur-chat-root .ur-chat__msg--bot .ur-chat__msg-col{flex:1;min-width:0;display:flex;flex-direction:column;align-items:stretch;gap:0}" +
      "#ur-chat-root .ur-chat__msg--user{align-self:flex-end;background:linear-gradient(135deg,#c8eef2 0%,#a8dce8 100%);border-bottom-right-radius:4px;border:1px solid rgba(26,126,162,.18)}" +
      "#ur-chat-root .ur-chat__typing{flex-shrink:0;align-self:flex-start;font-size:.75rem;color:#1a7ea2;padding:4px 10px;min-height:1.2em;background:rgba(255,255,255,.55);border-radius:8px;margin:0 4px}" +
      "#ur-chat-root .ur-chat__foot{position:relative;flex-shrink:0;display:flex;flex-direction:column;align-items:stretch;gap:0;padding:0;background:linear-gradient(180deg,rgba(255,255,255,.94) 0%,rgba(238,246,248,.93) 100%);border-top:1px solid rgba(26,126,162,.14)}" +
      "#ur-chat-root .ur-chat__foot-inner{flex-shrink:0;display:flex;align-items:flex-end;gap:10px;padding:10px 14px 14px;width:100%}" +
      "#ur-chat-root .ur-chat__input{flex:1;min-width:0;min-height:42px;padding:10px 16px;border:1px solid rgba(26,126,162,.22);border-radius:22px;font:inherit;font-size:.9rem;color:var(--ur-chat-text);background:#fff}" +
      "#ur-chat-root .ur-chat__input:focus{outline:none;border-color:#38a2c0;box-shadow:0 0 0 2px rgba(88,209,215,.4)}" +
      "#ur-chat-root .ur-chat__send{flex-shrink:0;min-width:76px;min-height:44px;padding:0 14px;border:none;border-radius:22px;background:linear-gradient(135deg,#58d1d7 0%,#38a2c0 50%,#1a7ea2 100%);color:#fff;font-weight:600;font-size:.85rem;cursor:pointer;box-shadow:0 2px 8px rgba(26,126,162,.28)}" +
      "#ur-chat-root .ur-chat__send:hover{filter:brightness(1.05)}" +
      "#ur-chat-root .ur-chat__send:disabled,#ur-chat-root .ur-chat__input:disabled{opacity:.55;cursor:wait}" +
      "#ur-chat-root .ur-chat__fab-badge{position:absolute;top:-2px;right:-2px;min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:#dc2626;color:#fff;font-size:10px;font-weight:700;line-height:18px;text-align:center;box-shadow:0 1px 4px rgba(0,0,0,.2);pointer-events:none}" +
      "#ur-chat-root .ur-chat__fab-badge[hidden]{display:none!important}" +
      "#ur-chat-root .ur-chat__messages-wrap{position:relative;flex:1;min-height:0;display:flex;flex-direction:column}" +
      "#ur-chat-root .ur-chat__offline{flex-shrink:0;text-align:center;font-size:.68rem;padding:6px 8px;background:#fef3c7;color:#92400e;border-bottom:1px solid #fcd34d}" +
      "#ur-chat-root .ur-chat__jump{position:absolute;bottom:8px;right:10px;z-index:3;border:none;border-radius:999px;padding:7px 12px;font-size:.72rem;font-weight:600;cursor:pointer;background:#1a7ea2;color:#fff;box-shadow:0 4px 14px rgba(26,126,162,.35)}" +
      "#ur-chat-root .ur-chat__jump[hidden]{display:none!important}" +
      "#ur-chat-root .ur-chat__composer{display:flex;align-items:flex-end;gap:8px;flex:1;min-width:0;position:relative}" +
      "#ur-chat-root textarea.ur-chat__input{resize:none;min-height:72px;max-height:132px;line-height:1.45;padding:10px 14px;border-radius:16px;overflow-y:auto;scrollbar-width:none;-ms-overflow-style:none}" +
      "#ur-chat-root textarea.ur-chat__input::-webkit-scrollbar{display:none!important;width:0!important;height:0!important}" +
      "#ur-chat-root .ur-chat__count{font-size:.65rem;color:#64748b;white-space:nowrap;align-self:flex-end;padding-bottom:4px}" +
      "#ur-chat-root .ur-chat__head-actions{position:relative;display:flex;align-items:center;gap:6px;flex-shrink:0;margin-left:4px}" +
      "#ur-chat-root .ur-chat__lang-trigger{display:inline-flex;align-items:center;gap:8px;max-width:170px;border:1px solid rgba(255,255,255,.42);background:linear-gradient(145deg,rgba(255,255,255,.28),rgba(255,255,255,.12));color:#fff;border-radius:10px;padding:7px 10px;font-size:.68rem;font-weight:700;cursor:pointer;outline:none;line-height:1.1;box-shadow:0 3px 10px rgba(0,0,0,.12)}" +
      "#ur-chat-root .ur-chat__lang-trigger:focus-visible{border-color:rgba(255,255,255,.78);box-shadow:0 0 0 2px rgba(255,255,255,.2)}" +
      "#ur-chat-root .ur-chat__lang-trigger-label{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
      "#ur-chat-root .ur-chat__lang-caret{font-size:.9rem;opacity:.9;line-height:1}" +
      "#ur-chat-root .ur-chat__lang-menu{position:absolute;top:calc(100% + 8px);right:0;min-width:220px;max-width:min(80vw,280px);max-height:min(240px,52vh);overflow:auto;padding:8px;background:#fff;border:1px solid rgba(26,126,162,.2);border-radius:12px;box-shadow:0 14px 36px rgba(15,23,42,.24);z-index:2147483647}" +
      "#ur-chat-root .ur-chat__lang-option{display:block;width:100%;text-align:left;padding:7px 10px;border:none;background:transparent;color:#0f172a;font-size:.72rem;font-weight:600;border-radius:8px;cursor:pointer}" +
      "#ur-chat-root .ur-chat__lang-option:hover{background:rgba(56,189,248,.12)}" +
      "#ur-chat-root .ur-chat__lang-option.is-active{background:rgba(26,126,162,.16);color:#075985}" +
      "#ur-chat-root .ur-chat__head{z-index:6!important}" +
      "#ur-chat-root .ur-chat__messages-wrap,#ur-chat-root .ur-chat__typing,#ur-chat-root .ur-chat__foot,#ur-chat-root .ur-chat__team-cta{z-index:1!important}" +
      "#ur-chat-root .ur-chat__team-cta{text-align:center;padding:8px 12px 10px;background:rgba(248,250,252,.65);border-top:1px solid rgba(26,126,162,.1)}" +
      "#ur-chat-root .ur-chat__team-cta a{color:#1a7ea2;font-weight:600;font-size:.72rem;text-decoration:none}" +
      "#ur-chat-root .ur-chat__team-cta a:hover{text-decoration:underline}" +
      "#ur-chat-root .ur-chat__msg-tools{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;align-items:center;position:relative;z-index:5;pointer-events:auto}" +
      "#ur-chat-root .ur-chat__feedback-note{font-size:.68rem;color:#4b5b70;font-weight:700;line-height:1.2;max-width:100%;background:rgba(56,189,248,.12);border:1px solid rgba(56,189,248,.22);border-radius:999px;padding:4px 10px;letter-spacing:.01em}" +
      "#ur-chat-root .ur-chat__thumb{border:1px solid rgba(26,126,162,.24);background:linear-gradient(145deg,rgba(255,255,255,.92),rgba(240,249,255,.92));cursor:pointer;font-size:1rem;line-height:1;opacity:.92;padding:6px 10px;min-width:44px;min-height:44px;border-radius:12px;pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent;display:inline-flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(15,23,42,.08);transition:transform .18s ease,box-shadow .2s ease,border-color .2s ease,background .2s ease,opacity .2s ease}" +
      "#ur-chat-root .ur-chat__thumb:hover:not(:disabled){opacity:1;background:linear-gradient(145deg,rgba(240,249,255,.95),rgba(224,242,254,.95));border-color:rgba(26,126,162,.35);box-shadow:0 6px 14px rgba(15,23,42,.12);transform:translateY(-1px)}" +
      "#ur-chat-root .ur-chat__thumb.ur-chat__thumb--selected{border-color:rgba(26,126,162,.55);background:linear-gradient(145deg,rgba(186,230,253,.75),rgba(125,211,252,.55));box-shadow:0 8px 16px rgba(26,126,162,.18);opacity:1}" +
      "#ur-chat-root .ur-chat__thumb:disabled{opacity:.7;cursor:default}" +
      "#ur-chat-root .ur-chat__msg-body{white-space:pre-wrap}" +
      "@media (prefers-color-scheme:dark){#ur-chat-root .ur-chat__panel{background:#0f172a;border-color:rgba(56,162,192,.35)}#ur-chat-root .ur-chat__wave-bg{opacity:.22}#ur-chat-root .ur-chat__head{filter:brightness(.92)}#ur-chat-root .ur-chat__foot{background:linear-gradient(180deg,rgba(15,23,42,.96) 0%,rgba(30,41,59,.92) 100%)}#ur-chat-root .ur-chat__typing{background:rgba(30,41,59,.9);color:#7dd3fc}#ur-chat-root .ur-chat__count{color:#94a3b8}#ur-chat-root .ur-chat__team-cta{background:rgba(15,23,42,.55);border-top-color:rgba(56,162,192,.22)}#ur-chat-root textarea.ur-chat__input{background:#334155;color:#f8fafc;border-color:rgba(88,209,215,.25)}#ur-chat-root .ur-chat__messages{background:linear-gradient(180deg,rgba(30,41,59,.75) 0%,rgba(15,23,42,.55) 100%),radial-gradient(circle at 20% 20%,rgba(88,209,215,.06) 0,transparent 45%)}#ur-chat-root .ur-chat__feedback-note{color:#cbd5e1;background:rgba(56,189,248,.14);border-color:rgba(56,189,248,.28)}#ur-chat-root .ur-chat__lang-trigger{background:linear-gradient(145deg,rgba(148,163,184,.28),rgba(51,65,85,.4));border-color:rgba(148,163,184,.48);color:#e2e8f0}#ur-chat-root .ur-chat__lang-menu{background:#0f172a;border-color:rgba(125,211,252,.24);box-shadow:0 14px 38px rgba(0,0,0,.42)}#ur-chat-root .ur-chat__lang-option{color:#e2e8f0}#ur-chat-root .ur-chat__lang-option:hover{background:rgba(56,189,248,.16)}#ur-chat-root .ur-chat__lang-option.is-active{background:rgba(14,116,144,.4);color:#bae6fd}#ur-chat-root .ur-chat__thumb{background:linear-gradient(145deg,rgba(51,65,85,.96),rgba(30,41,59,.96));border-color:rgba(125,211,252,.26);box-shadow:0 3px 10px rgba(0,0,0,.28)}#ur-chat-root .ur-chat__thumb:hover:not(:disabled){background:linear-gradient(145deg,rgba(71,85,105,.96),rgba(51,65,85,.96));border-color:rgba(125,211,252,.42)}#ur-chat-root .ur-chat__thumb.ur-chat__thumb--selected{background:linear-gradient(145deg,rgba(14,116,144,.72),rgba(8,145,178,.52));border-color:rgba(125,211,252,.58)}}" +
      "@media (max-width:440px){#ur-chat-root{right:max(8px,env(safe-area-inset-right))!important;bottom:max(8px,env(safe-area-inset-bottom))!important;max-width:100vw!important;width:min(100vw - 16px,440px)!important}#ur-chat-root.ur-chat--open{width:min(100vw - 16px,440px)!important}#ur-chat-root .ur-chat__panel,#ur-chat-root.ur-chat--open .ur-chat__panel{border-radius:12px!important;height:min(580px,76dvh)!important;max-height:min(580px,76dvh)!important;min-height:min(400px,58dvh)!important}}" +
      "@media (prefers-reduced-motion:reduce){#ur-chat-root .ur-chat__fab{transition:none}#ur-chat-root .ur-chat__wave-band--back,#ur-chat-root .ur-chat__wave-band--mid,#ur-chat-root .ur-chat__wave-band--front{animation:none!important}#ur-chat-root .ur-chat__wave-bg .ur-chat__wave-svg{animation:none}#ur-chat-root .ur-chat__wave-bg{opacity:.85}}";
    document.head.appendChild(style);
  }

  function escapeHtml(s) {
    var d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function normalizeReplyText(s) {
    return String(s || "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function getKbEntries() {
    var g = typeof window !== "undefined" ? window : null;
    return g && g.__URBANRUPEE_CHATBOT_KB__ && g.__URBANRUPEE_CHATBOT_KB__.length
      ? g.__URBANRUPEE_CHATBOT_KB__
      : [];
  }

  function normalizeAnswerPool(a) {
    if (Array.isArray(a)) {
      return a
        .map(function (x) {
          return String(x || "").trim();
        })
        .filter(Boolean);
    }
    var one = String(a || "").trim();
    return one ? [one] : [];
  }

  function makeKbVariant(base, recent) {
    var pool = normalizeAnswerPool(base);
    if (!pool.length) return null;
    var picked = pickUniqueFromPool(pool, recent || []);
    var wrappers = [
      function (txt) {
        return txt;
      },
      function (txt) {
        return "Short answer: " + txt;
      },
      function (txt) {
        return txt + "\n\nIf helpful, I can explain this for your business use case in 2-3 lines.";
      },
    ];
    var wrappedPool = wrappers.map(function (fn) {
      return fn(picked);
    });
    return pickUniqueFromPool(wrappedPool, recent || []);
  }

  /** Match visitor message to site Q&A (urbanrupee-chatbot-knowledge.js). */
  function matchKnowledgeBase(raw, recent) {
    var t = String(raw || "")
      .toLowerCase()
      .replace(/['’]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    if (t.length < 2) return null;
    var list = getKbEntries();
    if (!list.length) return null;
    var words = t.split(/[^a-z0-9]+/).filter(function (w) {
      return w.length >= 4;
    });
    var best = null;
    var bestScore = 0;
    var secondBestScore = 0;
    var i;
    for (i = 0; i < list.length; i++) {
      var e = list[i];
      if (!e || !e.a) continue;
      if (e.req && e.req.length) {
        var ok = true;
        var r;
        for (r = 0; r < e.req.length; r++) {
          if (t.indexOf(String(e.req[r] || "").toLowerCase()) === -1) {
            ok = false;
            break;
          }
        }
        if (!ok) continue;
      }
      var score = 0;
      var keys = e.k || [];
      var j;
      var kw;
      for (j = 0; j < keys.length; j++) {
        kw = String(keys[j] || "")
          .toLowerCase()
          .trim();
        if (!kw) continue;
        if (t.indexOf(kw) !== -1) score += kw.length + (kw.indexOf(" ") !== -1 ? 4 : 0);
      }
      var wi;
      for (wi = 0; wi < words.length; wi++) {
        var wd = words[wi];
        for (j = 0; j < keys.length; j++) {
          kw = String(keys[j] || "")
            .toLowerCase()
            .trim();
          if (kw.length < 4) continue;
          if (kw.indexOf(wd) !== -1 || wd.indexOf(kw) !== -1) score += 3;
        }
      }
      if (score > bestScore) {
        secondBestScore = bestScore;
        bestScore = score;
        best = e;
      } else if (score > secondBestScore) {
        secondBestScore = score;
      }
    }
    if (!best) return null;
    if (bestScore < 6) return null;
    if (bestScore - secondBestScore < 2) return null;
    return makeKbVariant(best.a, recent || []);
  }

  function pickUniqueFromPool(pool, recent) {
    var last = recent.length ? normalizeReplyText(recent[recent.length - 1]) : "";
    var seen = {};
    for (var i = 0; i < recent.length; i++) seen[normalizeReplyText(recent[i])] = true;
    var fresh = [];
    for (var j = 0; j < pool.length; j++) {
      if (!seen[normalizeReplyText(pool[j])]) fresh.push(pool[j]);
    }
    if (fresh.length) return fresh[Math.floor(Math.random() * fresh.length)];
    var notLast = pool.filter(function (p) {
      return normalizeReplyText(p) !== last;
    });
    if (notLast.length) return notLast[Math.floor(Math.random() * notLast.length)];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  var SS_CTX = "urbanrupee_chat_ctx";
  var SS_SET = "urbanrupee_chat_settings";
  var SS_LANG = "urbanrupee_chat_lang";
  var SUPPORTED_LANGS = ["en", "hi"];

  function analytics(ev, props) {
    try {
      var p = props || {};
      try {
        if (window.dataLayer) window.dataLayer.push(Object.assign({ event: String(ev) }, p));
      } catch (e1) {}
      try {
        if (typeof window.plausible === "function") window.plausible(String(ev), { props: p });
      } catch (e2) {}
    } catch (e0) {}
  }

  function readSettings() {
    try {
      return JSON.parse(sessionStorage.getItem(SS_SET) || "{}") || {};
    } catch (e) {
      return {};
    }
  }

  function writeSettings(o) {
    try {
      sessionStorage.setItem(SS_SET, JSON.stringify(o));
    } catch (e) {}
  }

  function readCtx() {
    try {
      return JSON.parse(sessionStorage.getItem(SS_CTX) || "{}") || {};
    } catch (e) {
      return {};
    }
  }

  function sessionHintAppend() {
    var c = readCtx();
    var bits = [];
    if (c.channel) bits.push(c.channel);
    if (c.region) bits.push(c.region);
    if (c.industry) bits.push(c.industry);
    if (!bits.length) return "";
    var line = bits.join(" · ");
    return getLang() === "hi"
      ? "\n\n(सत्र संदर्भ: " + line + "।)"
      : "\n\n(Session context: " + line + ".)";
  }

  function getLang() {
    try {
      var l = sessionStorage.getItem(SS_LANG);
      if (SUPPORTED_LANGS.indexOf(l) !== -1) return l;
      var nav = (navigator.language || navigator.userLanguage || "en").toLowerCase();
      if (nav.indexOf("hi") === 0) return "hi";
      return "en";
    } catch (e) {
      return "en";
    }
  }

  function setLang(l) {
    try {
      sessionStorage.setItem(SS_LANG, SUPPORTED_LANGS.indexOf(l) !== -1 ? l : "en");
    } catch (e) {}
  }

  function redactPII(s) {
    var t = String(s || "");
    t = t.replace(/\b(?:\d[ \-]*?){13,19}\d\b/g, "[card number removed]");
    t = t.replace(/\b\d{3}[-\s]?\d{3}[-\s]?\d{4}\b/g, "[number removed]");
    t = t.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, "[number removed]");
    t = t.replace(/\bOTP\b\s*[:=]?\s*\d{4,8}\b/gi, "[OTP removed]");
    t = t.replace(/\bpassword\b\s*[:=]\s*\S+/gi, "[password removed]");
    return t;
  }

  function checkRateLimit() {
    var now = Date.now();
    if (!window.__urChatRl) window.__urChatRl = [];
    window.__urChatRl = window.__urChatRl.filter(function (t) {
      return now - t < 60000;
    });
    if (window.__urChatRl.length >= 18) return false;
    window.__urChatRl.push(now);
    return true;
  }

  function playChime() {
    var s = readSettings();
    if (!s.sound) return;
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!window.__urChatAudio) window.__urChatAudio = new Ctx();
      var ctx = window.__urChatAudio;
      if (ctx.state === "suspended") ctx.resume();
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.value = 0.04;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  }

  function maybeVibrate() {
    var s = readSettings();
    if (!s.haptic || !navigator.vibrate) return;
    try {
      navigator.vibrate(12);
    } catch (e) {}
  }

  function fetchWithTimeout(url, ms) {
    var ac = new AbortController();
    var t = setTimeout(function () {
      ac.abort();
    }, ms);
    return fetch(url, { signal: ac.signal }).finally(function () {
      clearTimeout(t);
    });
  }

  function trimExtract(text, maxLen) {
    if (!text) return "";
    var t = text.replace(/\s+/g, " ").trim();
    if (t.length <= maxLen) return t;
    return t.slice(0, maxLen).replace(/\s+\S*$/, "") + " …";
  }

  function fetchWikipediaAnswer(query) {
    var q = String(query || "").trim();
    if (q.length < 2) return Promise.resolve(null);
    if (q.length > 100) q = q.slice(0, 100);
    var url1 =
      "https://en.wikipedia.org/w/api.php?action=opensearch&search=" +
      encodeURIComponent(q) +
      "&limit=2&namespace=0&format=json&origin=*";
    return fetchWithTimeout(url1, 12000)
      .then(function (r) {
        if (!r.ok) throw new Error("os");
        return r.json();
      })
      .then(function (data) {
        var titles = data && data[1];
        if (!titles || !titles.length) return null;
        var title = titles[0];
        var url2 =
          "https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts&exintro=1&explaintext=1&redirects=1&titles=" +
          encodeURIComponent(title);
        return fetchWithTimeout(url2, 12000).then(function (r2) {
          if (!r2.ok) throw new Error("ex");
          return r2.json();
        });
      })
      .then(function (j) {
        if (!j || !j.query || !j.query.pages) return null;
        var pages = j.query.pages;
        var id = Object.keys(pages)[0];
        if (id === "-1") return null;
        var ex = pages[id].extract;
        if (!ex) return null;
        var body = trimExtract(ex, 950);
        return pages[id].title + "\n\n" + body;
      })
      .catch(function () {
        return null;
      });
  }

  function fetchWikiWithRetry(query) {
    return fetchWikipediaAnswer(query).then(function (w) {
      if (w) return w;
      return fetchWikipediaAnswer(query);
    });
  }

  function localFastReply(raw, recent) {
    var t = String(raw || "")
      .toLowerCase()
      .trim();
    if (!t) return null;
    var hi = getLang() === "hi";
    if (/^(hi+|hey+|hello+|namaste|hola)\b|^gm\b|^gn\b/.test(t)) {
      return pickUniqueFromPool(
        hi
          ? [
              "नमस्ते — मैं Urbanrupee भुगतान, इंटीग्रेशन और सामान्य सवालों में मदद कर सकता हूँ। आप पहले क्या जानना चाहते हैं?",
              "आपसे मिलकर अच्छा लगा। Urbanrupee प्रोडक्ट्स, ऑनबोर्डिंग या कोई भी विषय पूछें — मैं साफ़, संक्षिप्त जवाब दूँगा।",
              "नमस्कार। मैं व्यापारियों व पार्टनर्स के लिए Urbanrupee समझा सकता हूँ, या सही पेज की ओर इशारा कर सकता हूँ।",
            ]
          : [
              "Hello — I am here to help with Urbanrupee payments, integrations, and general questions. What would you like to explore first?",
              "Good to meet you. Ask about Urbanrupee products, onboarding, or anything on your mind, and I will respond in a clear, concise way.",
              "Hi there. I can walk you through how Urbanrupee supports merchants and partners, or point you to the right page on this site.",
            ],
        recent || []
      );
    }
    if (/^(bye|goodbye)/.test(t)) {
      return pickUniqueFromPool(
        hi
          ? [
              "अलविदा — Urbanrupee पर आने के लिए धन्यवाद। मानव सहायता के लिए Contact पेज उपयोग करें।",
              "ख्याल रखें। प्राइसिंग या डेमो बाद में चाहिए हो तो Urbanrupee टीम Contact के ज़रिए उपलब्ध है।",
            ]
          : [
              "Goodbye, and thank you for visiting Urbanrupee. Reach out anytime through Contact if you need a human follow-up.",
              "Take care. If you need pricing or a tailored walkthrough later, the Urbanrupee team is available via Contact.",
            ],
        recent || []
      );
    }
    if (/thank/.test(t)) {
      return pickUniqueFromPool(
        hi
          ? [
              "स्वागत है। और कोई सवाल हो तो यहीं लिखें।",
              "खुशी हुई मदद करके। जब चाहें बातचीत जारी रखें।",
            ]
          : [
              "You are very welcome. If another question comes up, just type it here.",
              "Glad to help. Feel free to continue the conversation whenever you are ready.",
            ],
        recent || []
      );
    }
    if (
      /\b(sing|singing|song|karaoke|playlist|lyrics|band|concert|musician)\b/.test(t) ||
      /\b(i want|i wanna|i'd like|can you|please)\b.*\b(sing|song|joke|story|poem|dance)\b/.test(t) ||
      /\b(tell me a joke|make me laugh|something funny|say a joke)\b/.test(t) ||
      /\b(weather today|cricket score|who won|movie recommendation|netflix)\b/.test(t)
    ) {
      return pickUniqueFromPool(
        hi
          ? [
              "मैं गाने या मनोरंजन में माहिर नहीं हूँ — मैं Urbanrupee और भुगतान पर फोकस करता हूँ। यदि चेकआउट, UPI, सेटलमेंट या ऑनबोर्डिंग में मदद चाहिए तो एक लाइन में लिखें।",
              "अच्छा मूड समझता हूँ, पर यह चैट भुगतान व व्यापार से जुड़ी है। अपना प्रोडक्ट/चैनल बताएँ तो व्यावहारिक जवाब दूँगा।",
            ]
          : [
              "I’m not the right assistant for singing or entertainment—I stay focused on Urbanrupee, payments, and merchants. If you share what you’re building (e.g. checkout, UPI, settlements), I’ll answer in a concrete, relatable way.",
              "I hear you, but this chat is tuned for payments and Urbanrupee. Ask about checkout, refunds, or integrations—and add your sector in plain words if it helps.",
            ],
        recent || []
      );
    }
    return null;
  }

  function getProfessionalReplyHi(raw, recent) {
    var recentArr = recent || [];
    var t = String(raw || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
    if (!t) {
      return pickUniqueFromPool(
        [
          "कृपया एक छोटा प्रश्न लिखें — मैं Urbanrupee या भुगतान से जुड़ा व्यावहारिक जवाब दूँगा।",
          "अपना सवाल टाइप करें — मैं जवाब सरल और स्कैन करने योग्य रखूँगा।",
        ],
        recentArr
      );
    }
    var intentsHi = [
      {
        match: function (q) {
          return (
            /\b(sing|song|music|karaoke|joke|funny|dance|weather|movie|cricket|football|recipe|story|poem)\b/.test(q) ||
            /\b(i want|i need|can you)\b.*\b(sing|joke|fun)\b/.test(q)
          );
        },
        pool: [
          "मैं गाने या मनोरंजन में मदद नहीं करता — यह चैट Urbanrupee व भुगतान के लिए है। चेकआउट, UPI या सेटलमेंट पर एक लाइन में पूछें।",
          "समझ सकता हूँ, पर यहाँ जवाब भुगतान और व्यापार से जुड़े रहेंगे। अपना उद्योग/चैनल एक लाइन में लिखकर सवाल साफ़ करें।",
        ],
      },
      {
        match: function (q) {
          if (!/\b(why|how come|reason|what made)\b/.test(q)) return false;
          if (
            /\b(choose|chose|pick|prefer|instead|rather|another|other|compet|rival|alternative|vs|versus|compare|platform|here|came|over\b|worth|not\b|better|different|instead of)\b/.test(q)
          )
            return true;
          if (/\b(came\s+(here|to)|into\s+this|into\s+that)\b/.test(q)) return true;
          if (/\bwhy\b.*\b(urban|rupee|we|you|us|exist|start|build|created|launch|here)\b/.test(q)) return true;
          return false;
        },
        pool: [
          "यह सवाल जायज़ है। टीमें अक्सर Urbanrupee तब चुनती हैं जब उन्हें वॉल्यूम पर भरोसेमंद चेकआउट, साफ़ रिकंसिलिएशन और गो-लाइव के बाद जवाबदेही चाहिए — सिर्फ़ सेल्स चक्र तक सीमित नहीं।",
          "कई PSP-स्टाइल प्लेटफ़ॉर्म की तुलना होती है। Urbanrupee उन व्यापारियों के लिए है जो भारतीय रेल्स के साथ व्यावहारिक रिपोर्टिंग और इंटीग्रेशन पथ चाहते हैं।",
        ],
      },
      {
        match: function (q) {
          return (
            /\b(vs|versus|compare|better than|rather than|instead of)\b/.test(q) ||
            (/\b(urban|rupee)\b/.test(q) && /\b(compet|alternative|razorpay|stripe|paypal|other gateway|other platform)\b/.test(q))
          );
        },
        pool: [
          "तुलना में प्राइसिंग, सेटलमेंट, विवाद टूलिंग और इंटीग्रेशन गहराई देखें — सिर्फ़ मार्केटिंग पेज नहीं। Urbanrupee ईमानदार चेकलिस्ट के लिए Contact उपयोग करें।",
          "हर गेटवे अलग सेगमेंट में मजबूत होता है। Urbanrupee भारत-केंद्रित फ्लो (UPI, कार्ड, ऑर्केस्ट्रेशन) पर स्पष्टता पर ज़ोर देता है।",
        ],
      },
      {
        match: function (q) {
          return (
            /\b(what does|what is|who is|who are|tell me about|overview of|explain)\b/.test(q) &&
            /\b(urban|rupee|your company|this company|this platform)\b/.test(q)
          );
        },
        pool: [
          "Urbanrupee एक भुगतान व PSP-स्टाइल प्लेटफ़ॉर्म है जो भरोसेमंद चेकआउट, तरीकों का ऑर्केस्ट्रेशन, और सेटलमेंट/रिपोर्टिंग टूलिंग देता है। Services व About सेक्शन में विवरण है।",
          "व्यावहारिक रूप से Urbanrupee डिजिटल भुगतान स्वीकार करने में मदद करता है — खासकर UPI-स्टाइल फ्लो — साथ में इंटीग्रेशन और सपोर्ट रिदम।",
        ],
      },
      {
        match: function (q) {
          return /\b(contact|email|phone|call|reach|speak to|talk to|human|sales|demo)\b/.test(q);
        },
        pool: [
          "तेज़ और व्यक्तिगत जवाब के लिए इस साइट का Contact पेज उपयोग करें। संक्षेप में use-case लिखें।",
          "कोट, डेमो या खाता-विशिष्ट मार्गदर्शन के लिए Contact सही चैनल है।",
        ],
      },
      {
        match: function (q) {
          return /\b(price|cost|fee|pricing|how much|quote|plan)\b/.test(q);
        },
        pool: [
          "कमर्शियल शर्तें मॉडल, मिक्स और वॉल्यूम पर निर्भर करती हैं। एक लाइन सारांश के साथ Contact करें।",
          "यहाँ अनुमान लगाने से बेहतर है कि टीम थ्रूपुट समझकर उत्तर दे — Contact उपयोग करें।",
        ],
      },
      {
        match: function (q) {
          return /\b(upi|intent|qr|p2p|vpa|collect request)\b/.test(q);
        },
        pool: [
          "Urbanrupee आधुनिक भारतीय भुगतान अनुभवों को सपोर्ट करता है — UPI इंटेंट लिंक, QR, और ऑर्केस्ट्रेशन। विवरण Services में।",
          "UPI चेकआउट में सफलता दर, एक्सपायरी हैंडलिंग, और रिकंसिलिएशन आईडी महत्वपूर्ण हैं — गहराई के लिए Contact।",
        ],
      },
      {
        match: function (q) {
          return /\b(payment|pay|gateway|checkout|transaction|refund|settle|reconcil)\b/.test(q);
        },
        pool: [
          "Urbanrupee भुगतान स्वीकृति, चेकआउट गुणवत्ता, और लेनदेन के आसपास ऑपरेशनल परत पर केंद्रित है। Services देखें।",
          "चैनल (वेब/ऐप) और इंस्ट्रूमेंट मिक्स बताने पर जवाब तंग होगा — ज़रूरत हो तो Contact।",
        ],
      },
      {
        match: function (q) {
          return /\b(help|support|assist|stuck|issue|problem|error)\b/.test(q);
        },
        pool: [
          "मैं यहाँ पोज़िशनिंग और सामान्य फ्लो स्पष्ट कर सकता हूँ। इंसिडेंट-स्टाइल मदद के लिए Contact बेहतर है।",
          "उत्पाद मार्गदर्शन के लिए सादे शब्दों में पूछें। प्रोडक्शन प्रभावित हो तो Contact से एस्केलेट करें।",
        ],
      },
      {
        match: function (q) {
          return /\b(security|safe|fraud|pci|compliance|aml|risk)\b/.test(q);
        },
        pool: [
          "सुरक्षा व अनुपालन गंभीरता से लिए जाते हैं: न्यूनतम विशेषाधिकार, स्पष्ट डेटा सीमाएँ। नीति-स्तर विवरण करार व कानूनी पेजों पर — Contact से अनुपालन प्रश्न रूट करें।",
          "उच्च स्तर पर Urbanrupee सुरक्षित ट्रांसमिशन, की/डैशबोर्ड एक्सेस पैटर्न, और चेंज मैनेजमेंट पर ज़ोर देता है।",
        ],
      },
      {
        match: function (q) {
          return /\b(urban|rupee)\b/.test(q);
        },
        pool: [
          "Urbanrupee व्यापारी-ग्रेड भुगतान और उसके आसपास के वर्कफ़्लो पर केंद्रित है — चेकआउट, तरीकों का ऑर्केस्ट्रेशन, और वित्त टीमों की दृश्यता।",
          "Urbanrupee पर और विस्तार से बात कर सकते हैं। क्या आप व्यापारी, प्लेटफ़ॉर्म या पार्टनर हैं?",
        ],
      },
    ];
    for (var ih = 0; ih < intentsHi.length; ih++) {
      if (intentsHi[ih].match(t)) return pickUniqueFromPool(intentsHi[ih].pool, recentArr);
    }
    return pickUniqueFromPool(
      [
        "धन्यवाद। इस शब्दावली का सीधा लेख नहीं है, फिर भी मैं संरचित मदद कर सकता हूँ: प्रोडक्ट, कमर्शियल या इंप्लीमेंटेशन — कौन सा?",
        "थोड़ा खुला सवाल है। यदि UPI, सेटलमेंट, या Urbanrupee कमर्शियल के आसपास दोबारा लिखें तो जवाब तंग होगा।",
        "मददगार बनना चाहता हूँ। चैनल (ऐप/वेब), देश, या प्रदाता तुलना जोड़ें तो अगला जवाब निकट आएगा।",
        "यदि सवाल भुगतान से बाहर है, तो भी जोड़ बताएँ: एक वाक्य में व्यवसाय मॉडल (जैसे fintech ऐप, D2C, मार्केटप्लेस) और चेकआउट से क्या परिणाम चाहिए।",
      ],
      recentArr
    );
  }

  function getProfessionalReply(raw, recent) {
    if (getLang() === "hi") return getProfessionalReplyHi(raw, recent);
    var recentArr = recent || [];
    var t = String(raw || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
    if (!t) {
      return pickUniqueFromPool(
        [
          "Please share a short question and I will respond with something relevant to Urbanrupee or payments in general.",
          "Go ahead and type your question — I will keep answers practical and easy to scan.",
        ],
        recentArr
      );
    }

    var intents = [
      {
        match: function (q) {
          return (
            /\b(sing|singing|song|music|karaoke|playlist|lyrics|band|concert|musician|dance|joke|funny|poem|story|weather|recipe|sport|cricket|football|movie|netflix|homework)\b/.test(
              q
            ) || /\b(i want|i wanna|i need|can you|please)\b.*\b(sing|joke|fun|story|dance)\b/.test(q)
          );
        },
        pool: [
          "I’m focused on Urbanrupee and payments—not singing, jokes, or general web search. Tell me your product context (e.g. fintech checkout, UPI, subscriptions) and I’ll give a tight, relatable answer.",
          "This assistant stays in the payments lane. Mention your industry and channel in one line, then ask about refunds, routing, or go-live risk—I’ll answer like someone who works with merchants every day.",
        ],
      },
      {
        match: function (q) {
          if (!/\b(why|how come|reason|what made)\b/.test(q)) return false;
          if (
            /\b(choose|chose|pick|prefer|instead|rather|another|other|compet|rival|alternative|vs|versus|compare|platform|here|came|over\b|worth|not\b|better|different|instead of)\b/.test(q)
          )
            return true;
          if (/\b(came\s+(here|to)|into\s+this|into\s+that)\b/.test(q)) return true;
          if (/\bwhy\b.*\b(urban|rupee|we|you|us|exist|start|build|created|launch|here)\b/.test(q)) return true;
          return false;
        },
        pool: [
          "That is a fair question. Teams usually shortlist Urbanrupee when they want payment flows that stay dependable at volume, with clearer reconciliation and a partner who stays accountable after go-live—not only during the sales cycle.",
          "Most organisations compare several PSP-style platforms. Urbanrupee is positioned for merchants who value predictable checkout behaviour, practical reporting, and integration paths that match how Indian payment rails are actually used day to day.",
          "If you are weighing options, focus on settlement clarity, chargeback handling, support responsiveness, and how quickly your engineering team can ship. Urbanrupee is designed around those operational realities; a short call via Contact can map fit to your stack.",
          "Choosing a provider is partly about roadmap alignment. Urbanrupee emphasises merchant-grade uptime expectations, transparent escalation, and product surfaces your finance and tech teams can both work with—happy to go deeper through Contact if you share your context.",
          "Rather than a generic feature list, consider how each vendor reduces operational drag: refunds, partial captures, reconciliation, and observability. Urbanrupee organises its offering around those workflows; we can outline a relevant slice for your use case on request.",
        ],
      },
      {
        match: function (q) {
          return (
            /\b(vs|versus|compare|better than|rather than|instead of)\b/.test(q) ||
            (/\b(urban|rupee)\b/.test(q) && /\b(compet|alternative|razorpay|stripe|paypal|other gateway|other platform)\b/.test(q))
          );
        },
        pool: [
          "A structured comparison should cover pricing mechanics, settlement cycles, dispute tooling, and integration depth—not only marketing pages. Urbanrupee is happy to walk through an honest checklist against your current provider; start with Contact and mention your volume profile.",
          "Every gateway has strengths in different segments. Urbanrupee focuses on clarity in India-centric flows (UPI, cards, orchestration) and on keeping reconciliation honest between systems. Share your priorities and we can speak to them directly.",
          "When you compare platforms, validate SLAs, sandbox parity, and how incidents are communicated. Urbanrupee treats post-launch reliability as part of the product narrative, not an afterthought.",
        ],
      },
      {
        match: function (q) {
          return (
            /\b(what does|what is|who is|who are|tell me about|overview of|explain)\b/.test(q) &&
            /\b(urban|rupee|your company|this company|this platform)\b/.test(q)
          );
        },
        pool: [
          "Urbanrupee is a payment and PSP-style platform built for businesses that need dependable checkout, orchestration across methods, and operational tooling around settlements and reporting. The Services and About sections on this site summarise the product surface in more detail.",
          "In practical terms, Urbanrupee helps merchants accept and manage digital payments with a focus on Indian rails (including UPI-style flows), plus the surrounding merchant experience: integration, monitoring, and support rhythms suited to growing teams.",
          "Think of Urbanrupee as a partner layer between your storefront or app and payment networks—designed to reduce friction at checkout and to keep finance aligned with what actually cleared in each window.",
        ],
      },
      {
        match: function (q) {
          return /\b(contact|email|phone|call|reach|speak to|talk to|human|sales|demo)\b/.test(q);
        },
        pool: [
          "The fastest path to a tailored answer is the Contact page on this website. Share your use case briefly and the Urbanrupee team can respond with next steps.",
          "For quotes, demos, or account-specific guidance, please use Contact so the right specialist can pick up your thread with full context.",
        ],
      },
      {
        match: function (q) {
          return /\b(price|cost|fee|pricing|how much|quote|plan)\b/.test(q);
        },
        pool: [
          "Commercial terms depend on your model, methods mix, and volumes. Urbanrupee scopes pricing thoughtfully—please reach out through Contact with a one-line summary and someone will respond with a sensible outline.",
          "Rather than guessing a number here, the team prefers a quick alignment on channels and throughput so pricing reflects reality. Contact is the right channel for that conversation.",
        ],
      },
      {
        match: function (q) {
          return /\b(upi|intent|qr|p2p|vpa|collect request)\b/.test(q);
        },
        pool: [
          "Urbanrupee supports modern Indian payment experiences, including UPI-oriented flows such as intent links, QR journeys, and orchestration where multiple paths need to behave coherently. Product names and diagrams live under Services.",
          "If you are designing UPI checkout, consider success-rate telemetry, expiry handling, and reconciliation IDs across PSP hops. Urbanrupee can discuss patterns that have worked for similar merchants—use Contact for a deeper pass.",
        ],
      },
      {
        match: function (q) {
          return /\b(payment|pay|gateway|checkout|transaction|refund|settle|reconcil)\b/.test(q);
        },
        pool: [
          "Urbanrupee centres on payment acceptance, checkout quality, and the operational layer around transactions—reporting, exceptions, and partner-friendly APIs. Browse Services for the catalogue that best matches your stack.",
          "For payment questions, it helps to know your channel (web, app, in-store) and your mix of instruments. With that, Urbanrupee can suggest a coherent architecture; Contact is useful when you want a human to validate assumptions.",
        ],
      },
      {
        match: function (q) {
          return /\b(help|support|assist|stuck|issue|problem|error)\b/.test(q);
        },
        pool: [
          "I can clarify positioning and common flows here. For incident-style or account-specific help, the Contact route ensures your ticket reaches someone who can access the right internal tools.",
          "If this is product guidance, ask in plain language and I will answer crisply. If it is production-impacting, please escalate through Contact so support can track it properly.",
        ],
      },
      {
        match: function (q) {
          return /\b(security|safe|fraud|pci|compliance|aml|risk)\b/.test(q);
        },
        pool: [
          "Security and compliance are treated seriously: least-privilege integrations, clear data boundaries, and alignment to the regulatory context you operate in. Policy-grade detail belongs in your agreement and on dedicated legal pages—Contact can route compliance questions appropriately.",
          "At a high level, Urbanrupee designs for secure transmission, robust access patterns around keys and dashboards, and operational discipline around change management. Ask a specific control area if you want a sharper paragraph.",
        ],
      },
      {
        match: function (q) {
          return /\b(urban|rupee)\b/.test(q);
        },
        pool: [
          "Urbanrupee focuses on merchant-grade payments and the workflows that surround them—checkout, methods orchestration, and visibility for finance teams. Tell me whether you care more about integration, operations, or commercial structure and I will narrow the answer.",
          "Happy to discuss Urbanrupee in more detail. If you share whether you are a merchant, platform, or partner, I can keep the next reply closer to your scenario.",
        ],
      },
    ];

    for (var i = 0; i < intents.length; i++) {
      if (intents[i].match(t)) return pickUniqueFromPool(intents[i].pool, recentArr);
    }

    return pickUniqueFromPool(
      [
        "I answer from Urbanrupee’s trained topics—try questions like what Urbanrupee is, whether it is a payment gateway, services offered, orchestration, Hyper Checkout, white label, AML, reconciliation, security, or how to get started. Rephrase in your own words, or use Contact for a tailored conversation.",
        "That phrasing is a bit open-ended. If you rephrase around payments, checkout, UPI, settlements, or what Urbanrupee offers commercially, I can give a tighter, more actionable response.",
        "I want to be useful rather than generic. Could you add one detail—your channel (app or web), country, or whether you are comparing providers—so the next reply lands closer to what you need?",
        "Understood. Urbanrupee supports businesses across payment acceptance and related operations; pointing me to Services, About, or a concrete keyword (e.g. refunds, routing, reconciliation) usually unlocks a sharper answer.",
        "Let me answer professionally without hand-waving: share the outcome you are optimising for (conversion, cost, time-to-integrate, or control), and I will map how a PSP-style platform like Urbanrupee typically helps.",
        "If this is strategic rather than technical, the Contact page is still the best bridge to a human who can speak to roadmap and commercials. Meanwhile, I can clarify positioning if you ask a more specific follow-up.",
        "If your question is not about payments, I will still try to relate it: tell me your business model in one sentence (e.g. fintech lending app, D2C brand, marketplace) and what outcome you want from checkout.",
      ],
      recentArr
    );
  }

  function streamIntoElement(el, fullText, messagesEl, fast, onAfterChunk) {
    var after = typeof onAfterChunk === "function" ? onAfterChunk : null;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = fullText;
      if (after) after();
      else messagesEl.scrollTop = messagesEl.scrollHeight;
      return Promise.resolve();
    }
    var step = fast ? 4 : 2;
    var delay = fast ? 8 : 14;
    return new Promise(function (resolve) {
      var i = 0;
      function tick() {
        if (i >= fullText.length) {
          resolve();
          return;
        }
        i = Math.min(i + step, fullText.length);
        el.textContent = fullText.slice(0, i);
        if (after) after();
        else messagesEl.scrollTop = messagesEl.scrollHeight;
        setTimeout(tick, delay);
      }
      tick();
    });
  }

  function buildUi() {
    if (document.getElementById("ur-chat-root")) return;

    var I18N_PACK = {
      en: {
        langName: "English",
        subtitle: "Ask us anything · we reply when online",
        typingLook: "Looking that up…",
        typingPrep: "Preparing a tailored reply…",
        typingLocal: "…",
        placeholder: "Ask anything… Shift+Enter adds a new line.",
        send: "Send",
        jump: "↓ Latest",
        offline: "You appear offline — using built-in guidance (Wikipedia may be unavailable).",
        team: "Talk to the team",
        teamSubject: "Urbanrupee assistant — request human follow-up",
        welcome:
          "Welcome to Urbanrupee. Ask anything about our platform, payments, or how we compare — I keep replies professional and vary wording so chats stay fresh.",
        rateLimited: "Please wait a moment before sending another message.",
        redactedNote: "We removed sensitive patterns from your message before sending.",
        wikiDedupe:
          "\n\nIf you need a different angle on Urbanrupee itself, ask about checkout, settlements, or Contact for a human specialist.",
        wikiDedupeHi:
          "\n\nUrbanrupee पर दूसरा कोण चाहिए तो चेकआउट, सेटलमेंट या Contact से मानव विशेषज्ञ माँगें।",
        feedbackThanks: "Thanks for the feedback.",
        feedbackNoted: "Thanks — we'll use this to improve.",
      },
      hi: {
        langName: "Hindi",
        subtitle: "कुछ भी पूछें · ऑनलाइन होने पर जवाब",
        typingLook: "खोज रहा हूँ…",
        typingPrep: "अनुकूल जवाब तैयार कर रहा हूँ…",
        typingLocal: "…",
        placeholder: "यहाँ लिखें… नई पंक्ति: Shift+Enter",
        send: "भेजें",
        jump: "↓ नवीनतम",
        offline: "ऑफ़लाइन लगते हैं — अंतर्निहित मार्गदर्शन (Wikipedia उपलब्ध नहीं हो सकता)।",
        team: "टीम से बात करें",
        teamSubject: "Urbanrupee सहायक — मानव टीम से संपर्क",
        welcome:
          "Urbanrupee में आपका स्वागत है। प्लेटफ़ॉर्म, भुगतान या बाज़ार में तुलना — कुछ भी पूछें। मैं जवाब व्यावसायिक रखता हूँ और शब्द बदलता रहता हूँ।",
        rateLimited: "कृपया थोड़ा रुककर फिर भेजें।",
        redactedNote: "भेजने से पहले संवेदनशील पैटर्न हटा दिए गए।",
        wikiDedupe:
          "\n\nIf you need a different angle on Urbanrupee itself, ask about checkout, settlements, or Contact for a human specialist.",
        wikiDedupeHi:
          "\n\nUrbanrupee पर दूसरा कोण चाहिए तो चेकआउट, सेटलमेंट या Contact से मानव विशेषज्ञ माँगें।",
        feedbackThanks: "प्रतिक्रिया के लिए धन्यवाद।",
        feedbackNoted: "नोट किया — हम इससे सुधार करेंगे।",
      },
    };

    var LANG_OPTIONS = SUPPORTED_LANGS.map(function (code) {
      return { code: code, label: (I18N_PACK[code] && I18N_PACK[code].langName) || code.toUpperCase() };
    });

    function T(key) {
      var lang = getLang();
      var p = I18N_PACK[lang] || I18N_PACK.en;
      return p[key] || I18N_PACK.en[key] || "";
    }

    var CHAT_MARK = chatbotMarkUrl();
    var CHAT_HEADER = chatbotHeaderLogoUrl();
    var LOGO_FALLBACK = fallbackLogoUrl();
    var root = document.createElement("div");
    root.id = "ur-chat-root";
    root.setAttribute("role", "region");
    root.setAttribute("aria-label", "Urbanrupee chat assistant");

    var CLOSED_ROOT_STYLE =
      "position:fixed!important;right:max(12px,env(safe-area-inset-right))!important;bottom:max(12px,env(safe-area-inset-bottom))!important;left:auto!important;top:auto!important;width:auto!important;height:auto!important;min-height:0!important;max-width:min(100vw - 16px,440px)!important;background:transparent!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;z-index:2147483646!important;display:flex!important;flex-direction:column-reverse!important;align-items:flex-end!important;visibility:visible!important;opacity:1!important;pointer-events:none!important;margin:0!important;padding:0!important;";
    var OPEN_ROOT_STYLE =
      "position:fixed!important;right:max(12px,env(safe-area-inset-right))!important;bottom:max(12px,env(safe-area-inset-bottom))!important;left:auto!important;top:auto!important;width:min(100vw - 24px,440px)!important;max-width:440px!important;height:auto!important;min-height:0!important;background:transparent!important;-webkit-backdrop-filter:none!important;backdrop-filter:none!important;z-index:2147483646!important;display:flex!important;flex-direction:column-reverse!important;align-items:stretch!important;justify-content:flex-end!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;margin:0!important;padding:0!important;";
    root.style.cssText = CLOSED_ROOT_STYLE;

    root.innerHTML =
      '<button type="button" class="ur-chat__fab" id="ur-chat-fab" aria-expanded="false" aria-controls="ur-chat-panel">' +
      FAB_SVG +
      '<img class="ur-chat__fab-logo" alt="" width="48" height="48" decoding="async" />' +
      '<span class="ur-chat__fab-label">Open Urbanrupee chat</span>' +
      '<span class="ur-chat__fab-badge" id="ur-chat-badge" hidden>0</span>' +
      "</button>" +
      '<div class="ur-chat__panel" id="ur-chat-panel" role="dialog" aria-modal="true" aria-labelledby="ur-chat-title" hidden>' +
      '<div class="ur-chat__wave-bg" aria-hidden="true">' +
      '<svg class="ur-chat__wave-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2400 200" preserveAspectRatio="xMidYMax meet" focusable="false">' +
      "<defs>" +
      '<linearGradient id="urChatWaveFill" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#58d1d7" stop-opacity=".35"/>' +
      '<stop offset="55%" stop-color="#38a2c0" stop-opacity=".18"/>' +
      '<stop offset="100%" stop-color="#1a7ea2" stop-opacity=".06"/>' +
      "</linearGradient>" +
      '<pattern id="urChatWaveGrid" width="40" height="12" patternUnits="userSpaceOnUse">' +
      '<path d="M0 11.5H40" fill="none" stroke="#e2e8f0" stroke-width=".55"/>' +
      "</pattern>" +
      "</defs>" +
      '<rect width="2400" height="200" fill="#f8f9fb"/>' +
      '<rect width="2400" height="200" fill="url(#urChatWaveGrid)" opacity=".72"/>' +
      '<g class="ur-chat__wave-band ur-chat__wave-band--back">' +
      '<path fill="none" stroke="#94a3b8" stroke-width="2" stroke-opacity=".55" d="M0 52 C320 10 640 118 1200 52"/>' +
      '<path fill="none" stroke="#94a3b8" stroke-width="2" stroke-opacity=".55" transform="translate(1200 0)" d="M0 52 C320 10 640 118 1200 52"/>' +
      "</g>" +
      '<g class="ur-chat__wave-band ur-chat__wave-band--mid">' +
      '<path fill="none" stroke="#94a3b8" stroke-width="1.35" stroke-opacity=".42" d="M0 78 C400 122 720 28 1200 78"/>' +
      '<path fill="none" stroke="#94a3b8" stroke-width="1.35" stroke-opacity=".42" transform="translate(1200 0)" d="M0 78 C400 122 720 28 1200 78"/>' +
      "</g>" +
      '<g class="ur-chat__wave-band ur-chat__wave-band--front">' +
      '<path fill="url(#urChatWaveFill)" stroke="#38a2c0" stroke-width="2.2" d="M0 106 C380 44 620 168 1200 106 L1200 200 L0 200 Z"/>' +
      '<path fill="url(#urChatWaveFill)" stroke="#38a2c0" stroke-width="2.2" transform="translate(1200 0)" d="M0 106 C380 44 620 168 1200 106 L1200 200 L0 200 Z"/>' +
      "</g>" +
      "</svg></div>" +
      '<div class="ur-chat__head">' +
      '<div class="ur-chat__head-logo-wrap">' +
      '<img class="ur-chat__head-logo" alt="Urbanrupee" width="48" height="48" decoding="async" />' +
      "</div>" +
      '<div class="ur-chat__head-text">' +
      '<strong id="ur-chat-title">Urbanrupee</strong>' +
      '<span id="ur-chat-subtitle"></span>' +
      "</div>" +
      '<div class="ur-chat__head-actions">' +
      '<button type="button" class="ur-chat__lang-trigger" id="ur-chat-lang-trigger" aria-haspopup="listbox" aria-expanded="false" aria-label="Select preferred language">' +
      '<span class="ur-chat__lang-trigger-label" id="ur-chat-lang-label">English</span>' +
      '<span class="ur-chat__lang-caret" aria-hidden="true">▾</span>' +
      "</button>" +
      '<div class="ur-chat__lang-menu" id="ur-chat-lang-menu" role="listbox" hidden></div>' +
      "</div>" +
      '<button type="button" class="ur-chat__close" id="ur-chat-close" aria-label="Close chat">&times;</button>' +
      "</div>" +
      '<div class="ur-chat__messages-wrap">' +
      '<div class="ur-chat__offline" id="ur-chat-offline" hidden></div>' +
      '<div class="ur-chat__messages" id="ur-chat-messages" aria-live="polite" aria-relevant="additions"></div>' +
      '<button type="button" class="ur-chat__jump" id="ur-chat-jump" hidden></button>' +
      "</div>" +
      '<div class="ur-chat__typing" id="ur-chat-typing" aria-live="polite"></div>' +
      '<div class="ur-chat__foot">' +
      '<div class="ur-chat__foot-inner">' +
      '<div class="ur-chat__composer">' +
      '<textarea class="ur-chat__input" id="ur-chat-input" rows="3" autocomplete="off" maxlength="2000" aria-label="Your message"></textarea>' +
      '<span class="ur-chat__count" id="ur-chat-count">0/2000</span>' +
      "</div>" +
      '<button type="button" class="ur-chat__send" id="ur-chat-send"></button>' +
      "</div>" +
      '<div class="ur-chat__team-cta" id="ur-chat-team-wrap" hidden>' +
      '<a id="ur-chat-team" href="contact.html"></a>' +
      "</div>" +
      "</div>" +
      "</div>";

    document.body.appendChild(root);

    var fab = root.querySelector("#ur-chat-fab");
    var panel = root.querySelector("#ur-chat-panel");
    var closeBtn = root.querySelector("#ur-chat-close");
    var messagesEl = root.querySelector("#ur-chat-messages");
    var typingEl = root.querySelector("#ur-chat-typing");
    var input = root.querySelector("#ur-chat-input");
    var sendBtn = root.querySelector("#ur-chat-send");
    var badge = root.querySelector("#ur-chat-badge");
    var jumpBtn = root.querySelector("#ur-chat-jump");
    var offlineEl = root.querySelector("#ur-chat-offline");
    var subtitleEl = root.querySelector("#ur-chat-subtitle");
    var teamWrap = root.querySelector("#ur-chat-team-wrap");
    var teamLink = root.querySelector("#ur-chat-team");
    var countEl = root.querySelector("#ur-chat-count");
    var langTrigger = root.querySelector("#ur-chat-lang-trigger");
    var langLabel = root.querySelector("#ur-chat-lang-label");
    var langMenu = root.querySelector("#ur-chat-lang-menu");
    var fabLogo = root.querySelector(".ur-chat__fab-logo");
    var headLogo = root.querySelector(".ur-chat__head-logo");
    var abortCtl = null;
    var unread = 0;
    var userPinnedToBottom = true;

    function bumpUnread() {
      if (root.classList.contains("ur-chat--open")) return;
      unread++;
      if (badge) {
        badge.textContent = unread > 9 ? "9+" : String(unread);
        badge.hidden = false;
      }
    }

    function clearUnread() {
      unread = 0;
      if (badge) badge.hidden = true;
    }

    function teamHref() {
      var subj = T("teamSubject") || "Urbanrupee assistant — request human follow-up";
      return "contact.html?subject=" + encodeURIComponent(subj);
    }

    function applyI18n() {
      root.setAttribute("dir", "ltr");
      if (subtitleEl) subtitleEl.textContent = T("subtitle");
      if (input) {
        input.placeholder = T("placeholder");
        input.setAttribute("aria-label", T("placeholder"));
      }
      if (sendBtn) sendBtn.textContent = T("send");
      if (jumpBtn) jumpBtn.textContent = T("jump");
      if (offlineEl) offlineEl.textContent = T("offline");
      if (teamLink) {
        teamLink.textContent = T("team");
        teamLink.href = teamHref();
      }
    }

    function setLangMenuOpen(open) {
      if (!langMenu || !langTrigger) return;
      langMenu.hidden = !open;
      langTrigger.setAttribute("aria-expanded", open ? "true" : "false");
    }

    function renderLangOptions() {
      if (!langMenu) return;
      langMenu.innerHTML = "";
      LANG_OPTIONS.forEach(function (opt) {
        var o = document.createElement("button");
        o.type = "button";
        o.className = "ur-chat__lang-option";
        o.setAttribute("role", "option");
        o.setAttribute("data-lang", opt.code);
        o.textContent = opt.label;
        o.addEventListener("click", function () {
          setLang(opt.code);
          applyLangUi();
          setLangMenuOpen(false);
        });
        langMenu.appendChild(o);
      });
    }

    function applyLangUi() {
      var l = getLang();
      if (langLabel) {
        var match = LANG_OPTIONS.find(function (opt) {
          return opt.code === l;
        });
        langLabel.textContent = match ? match.label : "English";
      }
      if (langMenu) {
        [].forEach.call(langMenu.querySelectorAll(".ur-chat__lang-option"), function (btn) {
          var active = btn.getAttribute("data-lang") === l;
          btn.setAttribute("aria-selected", active ? "true" : "false");
          btn.classList.toggle("is-active", active);
        });
      }
      applyI18n();
    }

    function syncJumpVisibility() {
      if (!messagesEl || !jumpBtn) return;
      var nearBottom = messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 56;
      userPinnedToBottom = nearBottom;
      jumpBtn.hidden = nearBottom;
    }

    function scrollChatToBottom() {
      if (!messagesEl) return;
      messagesEl.scrollTop = messagesEl.scrollHeight;
      syncJumpVisibility();
    }

    function maybeScrollOnStream() {
      if (userPinnedToBottom && messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function updateCount() {
      if (countEl && input) countEl.textContent = String(input.value.length) + "/2000";
    }

    function updateLongThreadUi() {
      if (!messagesEl || !teamWrap) return;
      var n = messagesEl.querySelectorAll(".ur-chat__msg").length;
      teamWrap.hidden = n < 8;
    }

    function attachThumbs(wrap, snippet) {
      if (!wrap || wrap.querySelector(".ur-chat__msg-tools")) return;
      var host = wrap.querySelector(".ur-chat__msg-col") || wrap;
      var tools = document.createElement("div");
      tools.className = "ur-chat__msg-tools";
      var note = document.createElement("span");
      note.className = "ur-chat__feedback-note";
      note.setAttribute("aria-live", "polite");
      note.hidden = true;
      var up = document.createElement("button");
      up.type = "button";
      up.className = "ur-chat__thumb";
      up.setAttribute("aria-label", "Helpful");
      up.textContent = "👍";
      var down = document.createElement("button");
      down.type = "button";
      down.className = "ur-chat__thumb";
      down.setAttribute("aria-label", "Not helpful");
      down.textContent = "👎";
      var sn = String(snippet || "").slice(0, 160);
      function onPick(dir) {
        return function (e) {
          if (tools.getAttribute("data-ur-feedback-sent") === "1") return;
          e.preventDefault();
          e.stopPropagation();
          tools.setAttribute("data-ur-feedback-sent", "1");
          analytics("ur_chat_feedback", { direction: dir, snippet_len: sn.length });
          try {
            window.dispatchEvent(
              new CustomEvent("urbanrupee:chat-feedback", {
                bubbles: true,
                detail: { direction: dir, snippet_len: sn.length },
              })
            );
          } catch (e3) {}
          up.classList.toggle("ur-chat__thumb--selected", dir === "up");
          down.classList.toggle("ur-chat__thumb--selected", dir === "down");
          up.disabled = true;
          down.disabled = true;
          note.textContent = dir === "up" ? T("feedbackThanks") : T("feedbackNoted");
          note.hidden = false;
        };
      }
      up.addEventListener("click", onPick("up"));
      down.addEventListener("click", onPick("down"));
      tools.appendChild(up);
      tools.appendChild(down);
      tools.appendChild(note);
      host.appendChild(tools);
    }

    function appendBotShell() {
      var inner = document.createElement("div");
      inner.className = "ur-chat__msg-inner";
      var av = document.createElement("img");
      av.className = "ur-chat__msg-avatar";
      av.src = CHAT_MARK;
      av.alt = "";
      av.width = 34;
      av.height = 34;
      av.decoding = "async";
      av.addEventListener("error", function () {
        av.src = LOGO_FALLBACK;
      });
      var col = document.createElement("div");
      col.className = "ur-chat__msg-col";
      var body = document.createElement("div");
      body.className = "ur-chat__msg-body";
      inner.appendChild(av);
      inner.appendChild(col);
      col.appendChild(body);
      return { inner: inner, col: col, body: body, avatar: av };
    }

    function appendBubble(text, who) {
      var div = document.createElement("div");
      div.className = "ur-chat__msg ur-chat__msg--" + who;
      if (who === "bot") {
        var shell = appendBotShell();
        shell.body.innerHTML = escapeHtml(text).replace(/\n/g, "<br>");
        div.appendChild(shell.inner);
        attachThumbs(shell.col, text);
      } else {
        div.innerHTML = escapeHtml(text).replace(/\n/g, "<br>");
      }
      messagesEl.appendChild(div);
      userPinnedToBottom = true;
      scrollChatToBottom();
      updateLongThreadUi();
    }

    function appendEmptyBotBubble() {
      var div = document.createElement("div");
      div.className = "ur-chat__msg ur-chat__msg--bot";
      var shell = appendBotShell();
      div.appendChild(shell.inner);
      messagesEl.appendChild(div);
      userPinnedToBottom = true;
      scrollChatToBottom();
      return { wrap: div, body: shell.body };
    }

    function setBusy(b) {
      input.disabled = b;
      sendBtn.disabled = b;
    }

    function setOfflineVis() {
      if (!offlineEl) return;
      offlineEl.hidden = !!navigator.onLine;
    }

    function focusTrapKeydown(e) {
      if (e.key !== "Tab" || !root.classList.contains("ur-chat--open")) return;
      var sels =
        'button:not([disabled]), [href], textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
      var nodes = [].slice
        .call(panel.querySelectorAll(sels))
        .filter(function (n) {
          if (n.hasAttribute("hidden") || n.closest("[hidden]")) return false;
          try {
            return n.offsetParent !== null || n === closeBtn;
          } catch (e2) {
            return true;
          }
        });
      if (!nodes.length) return;
      var first = nodes[0];
      var last = nodes[nodes.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    function openChat() {
      analytics("ur_chat_open", { lang: getLang() });
      root.classList.add("ur-chat--open");
      root.style.cssText = OPEN_ROOT_STYLE;
      panel.hidden = false;
      fab.setAttribute("aria-expanded", "true");
      clearUnread();
      applyI18n();
      if (teamLink) teamLink.href = teamHref();
      window.setTimeout(function () {
        input.focus();
      }, 0);
    }

    function closeChat() {
      analytics("ur_chat_close", { lang: getLang() });
      root.classList.remove("ur-chat--open");
      root.style.cssText = CLOSED_ROOT_STYLE;
      panel.hidden = true;
      fab.setAttribute("aria-expanded", "false");
      if (abortCtl) abortCtl.abort();
      fab.focus();
    }

    var recentBotReplies = [];

    function sendUserMessage() {
      var raw = String(input.value || "").trim();
      if (!raw) return;
      if (!checkRateLimit()) {
        typingEl.textContent = T("rateLimited");
        window.setTimeout(function () {
          typingEl.textContent = "";
        }, 2400);
        return;
      }
      var safe = redactPII(raw);
      if (safe !== raw) {
        typingEl.textContent = T("redactedNote");
        window.setTimeout(function () {
          if (typingEl.textContent === T("redactedNote")) typingEl.textContent = "";
        }, 3200);
      }
      input.value = "";
      updateCount();
      analytics("ur_chat_message_sent", { len: safe.length, lang: getLang() });

      appendBubble(safe, "user");
      if (abortCtl) abortCtl.abort();
      abortCtl = new AbortController();
      var signal = abortCtl.signal;

      var local = localFastReply(safe, recentBotReplies);
      var kbReply = !local ? matchKnowledgeBase(safe, recentBotReplies) : null;
      typingEl.textContent = local || kbReply ? T("typingLocal") : T("typingPrep");
      setBusy(true);

      var bubbleObj = appendEmptyBotBubble();

      function finishReply(str, streamFast, sourceKey) {
        typingEl.textContent = "";
        var finalStr = (str || getProfessionalReply(safe, recentBotReplies)) + sessionHintAppend();
        streamIntoElement(bubbleObj.body, finalStr, messagesEl, streamFast || false, maybeScrollOnStream).then(
          function () {
            analytics("ur_chat_reply_source", { source: sourceKey || "fallback", lang: getLang() });
            attachThumbs(bubbleObj.wrap, finalStr);
            recentBotReplies.push(finalStr);
            if (recentBotReplies.length > 16) recentBotReplies.shift();
            if (!root.classList.contains("ur-chat--open")) bumpUnread();
            playChime();
            maybeVibrate();
            updateLongThreadUi();
            setBusy(false);
            syncJumpVisibility();
          }
        );
      }

      if (local) {
        window.setTimeout(function () {
          if (signal.aborted) return;
          finishReply(local, true, "local");
        }, 120);
        return;
      }

      if (kbReply) {
        window.setTimeout(function () {
          if (signal.aborted) return;
          finishReply(kbReply, true, "kb");
        }, 120);
        return;
      }

      if (!navigator.onLine) {
        typingEl.textContent = "";
        finishReply("", true, "offline_fallback");
        return;
      }

      if (wikipediaFallbackEnabled()) {
        fetchWikiWithRetry(safe).then(function (wiki) {
          if (signal.aborted) {
            if (bubbleObj.wrap.parentNode) bubbleObj.wrap.remove();
            typingEl.textContent = "";
            setBusy(false);
            return;
          }
          if (wiki) {
            typingEl.textContent = "";
            var w = wiki;
            if (normalizeReplyText(w) === normalizeReplyText(recentBotReplies[recentBotReplies.length - 1] || "")) {
              w = wiki + (getLang() === "hi" ? T("wikiDedupeHi") : T("wikiDedupe"));
            }
            finishReply(w, false, "wikipedia");
          } else {
            typingEl.textContent = T("typingPrep");
            window.setTimeout(function () {
              if (signal.aborted) {
                if (bubbleObj.wrap.parentNode) bubbleObj.wrap.remove();
                typingEl.textContent = "";
                setBusy(false);
                return;
              }
              finishReply("", false, "fallback");
            }, 280);
          }
        });
        return;
      }

      typingEl.textContent = T("typingPrep");
      window.setTimeout(function () {
        if (signal.aborted) {
          if (bubbleObj.wrap.parentNode) bubbleObj.wrap.remove();
          typingEl.textContent = "";
          setBusy(false);
          return;
        }
        finishReply("", false, "fallback");
      }, 280);
    }

    if (fabLogo) fabLogo.src = CHAT_MARK;
    if (headLogo) headLogo.src = CHAT_HEADER;

    if (fabLogo) {
      fabLogo.addEventListener("error", function () {
        if (fabLogo.getAttribute("data-ur-fb") === "1") {
          fabLogo.style.display = "none";
          return;
        }
        fabLogo.setAttribute("data-ur-fb", "1");
        fabLogo.src = LOGO_FALLBACK;
      });
    }
    if (headLogo) {
      headLogo.addEventListener("error", function () {
        if (headLogo.getAttribute("data-ur-hb") === "1") {
          var wrap2 = headLogo.closest(".ur-chat__head-logo-wrap");
          if (wrap2) wrap2.innerHTML = '<span class="ur-chat__head-mark" aria-hidden="true">UR</span>';
          return;
        }
        headLogo.setAttribute("data-ur-hb", "1");
        headLogo.src = LOGO_FALLBACK;
      });
    }

    renderLangOptions();
    applyLangUi();
    if (langTrigger) {
      langTrigger.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        setLangMenuOpen(langMenu ? langMenu.hidden : false);
      });
    }
    document.addEventListener("click", function (e) {
      if (!langMenu || !langTrigger) return;
      if (!langMenu.hidden && !langMenu.contains(e.target) && !langTrigger.contains(e.target)) {
        setLangMenuOpen(false);
      }
    });

    messagesEl.addEventListener("scroll", syncJumpVisibility);
    if (jumpBtn) {
      jumpBtn.addEventListener("click", function () {
        userPinnedToBottom = true;
        scrollChatToBottom();
      });
    }

    panel.addEventListener("keydown", focusTrapKeydown);

    window.addEventListener("online", setOfflineVis);
    window.addEventListener("offline", setOfflineVis);
    setOfflineVis();

    input.addEventListener("input", updateCount);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendUserMessage();
      }
    });

    if (teamLink) {
      teamLink.addEventListener("click", function () {
        analytics("ur_chat_contact_click", { from: "team_cta", lang: getLang() });
      });
    }

    fab.addEventListener("click", openChat);
    closeBtn.addEventListener("click", closeChat);
    sendBtn.addEventListener("click", sendUserMessage);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("ur-chat--open")) closeChat();
    });

    updateCount();
    appendBubble(T("welcome"), "bot");
  }

  function start() {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", start);
      return;
    }
    injectCriticalCss();
    function bootChat() {
      buildUi();
    }
    if (typeof requestIdleCallback === "function") {
      requestIdleCallback(bootChat, { timeout: 2200 });
    } else {
      window.setTimeout(bootChat, 120);
    }
  }

  start();
})();
