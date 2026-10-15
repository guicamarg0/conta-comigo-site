import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, Expand, ZoomIn, X } from "lucide-react";
import "./system-tour-3d.css";

const screens = [
  {
    title: "Orçamentos",
    shortTitle: "Orçamentos",
    description: "Itens, valores e condições em uma proposta organizada.",
    image: "/screens/orcamentos.png",
    preview: "/screens/previews/orcamentos-1600w.webp",
    previewSrcSet: "/screens/previews/orcamentos-800w.webp 800w, /screens/previews/orcamentos-1200w.webp 1200w, /screens/previews/orcamentos-1600w.webp 1600w",
    previewSizes: "100vw",
    previewWidths: [800, 1200, 1600],
    width: 2400,
    height: 1350,
    alt: "Tela real da demonstração do Conta Comigo com a lista de orçamentos fictícios",
  },
  {
    title: "PDF do orçamento",
    shortTitle: "PDF",
    description: "O orçamento gerado pelo próprio sistema, com logo e cinco itens de exemplo.",
    image: "/screens/orcamento-pdf.png",
    preview: "/screens/previews/orcamento-pdf-1200w.webp",
    previewSrcSet: "/screens/previews/orcamento-pdf-640w.webp 640w, /screens/previews/orcamento-pdf-960w.webp 960w, /screens/previews/orcamento-pdf-1200w.webp 1200w",
    previewSizes: "55vw",
    previewWidths: [640, 960, 1200],
    width: 2481,
    height: 3508,
    alt: "PDF de orçamento gerado pelo Conta Comigo com logo da empresa e cinco itens fictícios",
    kind: "document",
  },
  {
    title: "Clientes",
    shortTitle: "Clientes",
    description: "Dados e histórico do cliente próximos de cada atendimento.",
    image: "/screens/clientes.png",
    preview: "/screens/previews/clientes-1600w.webp",
    previewSrcSet: "/screens/previews/clientes-800w.webp 800w, /screens/previews/clientes-1200w.webp 1200w, /screens/previews/clientes-1600w.webp 1600w",
    previewSizes: "100vw",
    previewWidths: [800, 1200, 1600],
    width: 2560,
    height: 1440,
    alt: "Tela de clientes da demonstração do Conta Comigo com dados fictícios",
  },
  {
    title: "Serviços",
    shortTitle: "Serviços",
    description: "Acompanhe o andamento de cada serviço em um lugar só.",
    image: "/screens/servicos.png",
    preview: "/screens/previews/servicos-1600w.webp",
    previewSrcSet: "/screens/previews/servicos-800w.webp 800w, /screens/previews/servicos-1200w.webp 1200w, /screens/previews/servicos-1600w.webp 1600w",
    previewSizes: "100vw",
    previewWidths: [800, 1200, 1600],
    width: 2560,
    height: 1440,
    alt: "Tela de serviços da demonstração do Conta Comigo com dados fictícios",
  },
  {
    title: "Agenda e serviços",
    shortTitle: "Agenda",
    description: "Compromissos e serviços visíveis para acompanhar a rotina.",
    image: "/screens/agenda.png",
    preview: "/screens/previews/agenda-1600w.webp",
    previewSrcSet: "/screens/previews/agenda-800w.webp 800w, /screens/previews/agenda-1200w.webp 1200w, /screens/previews/agenda-1600w.webp 1600w",
    previewSizes: "100vw",
    previewWidths: [800, 1200, 1600],
    width: 2400,
    height: 1350,
    alt: "Tela real da demonstração do Conta Comigo com agenda de serviços fictícios",
  },
  {
    title: "Contratos",
    shortTitle: "Contratos",
    description: "Documentos e histórico ligados ao trabalho combinado.",
    image: "/screens/contratos.png",
    preview: "/screens/previews/contratos-1600w.webp",
    previewSrcSet: "/screens/previews/contratos-800w.webp 800w, /screens/previews/contratos-1200w.webp 1200w, /screens/previews/contratos-1600w.webp 1600w",
    previewSizes: "100vw",
    previewWidths: [800, 1200, 1600],
    width: 2400,
    height: 1350,
    alt: "Tela real da demonstração do Conta Comigo com contratos fictícios",
  },
  {
    title: "Peças e itens",
    shortTitle: "Peças",
    description: "Tenha os itens usados nos serviços organizados para preparar orçamentos.",
    image: "/screens/pecas.png",
    preview: "/screens/previews/pecas-1600w.webp",
    previewSrcSet: "/screens/previews/pecas-800w.webp 800w, /screens/previews/pecas-1200w.webp 1200w, /screens/previews/pecas-1600w.webp 1600w",
    previewSizes: "100vw",
    previewWidths: [800, 1200, 1600],
    width: 2560,
    height: 1440,
    alt: "Tela de peças e itens da demonstração do Conta Comigo com dados fictícios",
  },
];

const faceAngle = 360 / screens.length;
const MAX_DRAG_DISTANCE = 260;
const DRAG_COMMIT_THRESHOLD = 90;
const DRAG_ROTATION_FACTOR = 0.25;

export default function SystemTour3D() {
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [settling, setSettling] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [showCrispFace, setShowCrispFace] = useState(true);
  const [radius, setRadius] = useState(1080);
  const [preparedPreviews, setPreparedPreviews] = useState(() => new Set([0]));
  const previewLoads = useRef(new Map());
  const originalLoads = useRef(new Map());
  const pointer = useRef(null);
  const modalPointer = useRef(null);
  const stage = useRef(null);
  const expandButton = useRef(null);
  const closeButton = useRef(null);
  const dialogRef = useRef(null);

  const normalizedIndex = (index) => (index + screens.length) % screens.length;
  const loadImage = (cache, cacheKey, src, priority = "low", srcSet = "", sizes = "100vw") => {
    const cached = cache.current.get(cacheKey);
    if (cached) {
      if (priority === "high" && "fetchPriority" in cached.image) cached.image.fetchPriority = priority;
      return cached.promise;
    }
    const image = new window.Image();
    image.decoding = "async";
    image.sizes = sizes;
    if ("fetchPriority" in image) image.fetchPriority = priority;
    if (srcSet) image.srcset = srcSet;
    const promise = new Promise((resolve) => {
      image.onload = async () => {
        try { await image.decode(); } catch { /* onload confirms image data is available */ }
        resolve(true);
      };
      image.onerror = () => { cache.current.delete(cacheKey); resolve(false); };
    });
    cache.current.set(cacheKey, { image, promise });
    image.src = src;
    return promise;
  };
  const previewSource = (screen) => {
    const viewportWidth = typeof window === "undefined" ? 1200 : window.innerWidth;
    const stageWidth = stage.current?.clientWidth || viewportWidth;
    const displayWidth = stageWidth * (screen.kind === "document" ? 0.55 : 1);
    const requiredWidth = displayWidth * (typeof window === "undefined" ? 1 : window.devicePixelRatio || 1);
    const width = screen.previewWidths.find((candidate) => candidate >= requiredWidth) || screen.previewWidths.at(-1);
    return screen.previewSrcSet.split(", ").find((entry) => entry.endsWith(`${width}w`))?.replace(` ${width}w`, "") || screen.preview;
  };
  const preloadPreview = async (index, priority = "low") => {
    const target = normalizedIndex(index);
    const screen = screens[target];
    const src = previewSource(screen);
    const loaded = await loadImage(previewLoads, `${target}:${src}`, src, priority, screen.previewSrcSet, screen.previewSizes);
    if (loaded) {
      setPreparedPreviews((current) => {
        if (current.has(target)) return current;
        const next = new Set(current);
        next.add(target);
        return next;
      });
    }
    return loaded;
  };
  const preloadOriginal = (index, priority = "high") => {
    const target = normalizedIndex(index);
    return loadImage(originalLoads, target, screens[target].image, priority);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void preloadPreview(active - 1);
      void preloadPreview(active + 1);
    }, 180);
    return () => window.clearTimeout(timer);
  }, [active]);

  useEffect(() => {
    if (!stage.current) return undefined;
    const measure = () => setRadius(Math.round(stage.current.clientWidth * 1.04));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (dragging || settling) return undefined;
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650;
    const timer = window.setTimeout(() => setShowCrispFace(true), delay);
    return () => window.clearTimeout(timer);
  }, [active, dragging, settling]);

  useEffect(() => {
    if (!expanded) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setExpanded(false);
        setZoomed(false);
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        setActive((current) => (current + (event.key === "ArrowRight" ? 1 : -1) + screens.length) % screens.length);
        setZoomed(false);
      }
      if (event.key === "Tab") {
        const focusable = [...(dialogRef.current?.querySelectorAll('button:not([disabled]), a[href]') || [])];
        if (!focusable.length) return;
        if (event.shiftKey && document.activeElement === focusable[0]) {
          event.preventDefault();
          focusable.at(-1)?.focus();
        } else if (!event.shiftKey && document.activeElement === focusable.at(-1)) {
          event.preventDefault();
          focusable[0]?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      expandButton.current?.focus();
    };
  }, [expanded]);

  const goTo = async (index) => {
    const next = normalizedIndex(index);
    await preloadPreview(next, "high");
    if (expanded) await preloadOriginal(next, "high");
    setActive(next);
    setDrag(0);
    setZoomed(false);
    setShowCrispFace(next === active && !dragging);
  };

  const openExpanded = async () => {
    await Promise.all([preloadPreview(active, "high"), preloadOriginal(active, "high")]);
    setExpanded(true);
  };

  const onModalPointerDown = (event) => {
    if (zoomed || (event.pointerType === "mouse" && event.button !== 0)) return;
    modalPointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  };

  const onModalPointerUp = (event) => {
    if (modalPointer.current?.id !== event.pointerId) return;
    const distanceX = event.clientX - modalPointer.current.x;
    const distanceY = event.clientY - modalPointer.current.y;
    modalPointer.current = null;
    if (Math.abs(distanceX) > 60 && Math.abs(distanceX) > Math.abs(distanceY) * 1.2) {
      goTo(active + (distanceX < 0 ? 1 : -1));
    }
  };

  const onPointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointer.current = { id: event.pointerId, x: event.clientX };
    void preloadPreview(active - 1, "high");
    void preloadPreview(active + 1, "high");
    setSettling(false);
    setDragging(true);
    setShowCrispFace(false);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (pointer.current?.id !== event.pointerId) return;
    setDrag(Math.max(-MAX_DRAG_DISTANCE, Math.min(MAX_DRAG_DISTANCE, event.clientX - pointer.current.x)));
  };

  const finishDrag = (event) => {
    if (pointer.current?.id !== event.pointerId) return;
    const distance = event.clientX - pointer.current.x;
    pointer.current = null;
    const target = distance > DRAG_COMMIT_THRESHOLD ? active - 1 : distance < -DRAG_COMMIT_THRESHOLD ? active + 1 : null;
    if (target !== null) {
      setDragging(false);
      setSettling(true);
      setShowCrispFace(false);
      void goTo(target);
      return;
    }
    setDragging(false);
    setDrag(0);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (Math.abs(distance) > 1 && !prefersReducedMotion) {
      setSettling(true);
      setShowCrispFace(false);
    } else {
      setSettling(false);
      setShowCrispFace(true);
    }
  };

  const cancelDrag = () => {
    pointer.current = null;
    setDragging(false);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (Math.abs(drag) > 1 && !prefersReducedMotion) {
      setSettling(true);
      setShowCrispFace(false);
    } else {
      setSettling(false);
      setShowCrispFace(true);
    }
    setDrag(0);
  };

  const rotation = -active * faceAngle + drag * DRAG_ROTATION_FACTOR;

  return (
    <section className="system-tour" id="telas-do-sistema" aria-labelledby="system-tour-title">
      <div className="system-tour-heading">
        <h2 id="system-tour-title">Conheça as telas do sistema de gestão de serviços</h2>
        <div className="system-tour-heading-meta">
          <small>Arraste para girar ou escolha uma tela abaixo</small>
          <a className="system-tour-faq-link" href="/perguntas-frequentes/">
            Dúvidas frequentes <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
      <p className="system-tour-intro">
        Veja como o Conta Comigo reúne orçamentos, clientes, contratos, serviços e agenda
        para ajudar profissionais autônomos e pequenas empresas a organizar cada atendimento.
      </p>
      <div
        className="system-tour-stage"
        ref={stage}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={cancelDrag}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") goTo(active - 1);
          if (event.key === "ArrowRight") goTo(active + 1);
        }}
        tabIndex={0}
        aria-label="Arraste na horizontal para girar as telas da demonstração"
      >
        <div
          className={`system-tour-rotor${dragging ? " is-dragging" : ""}${settling ? " is-settling" : ""}`}
          style={{ transform: `translateZ(-${radius}px) rotateY(${rotation}deg)` }}
          aria-hidden={showCrispFace}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget && event.propertyName === "transform" && settling) {
              setSettling(false);
              setShowCrispFace(true);
            }
          }}
        >
          {screens.map((screen, index) => {
            const preview = preparedPreviews.has(index) ? screen : screens[active];
            const previewUrl = previewSource(preview);
            return (
              <figure
                className={`system-tour-face${screen.kind === "document" ? " is-document" : ""}`}
                key={screen.title}
                style={{ transform: `rotateY(${index * faceAngle}deg) translateZ(${radius}px)` }}
                aria-hidden={index !== active}
              >
                <div className="system-tour-visual">
                  <img src={previewUrl} srcSet={preview.previewSrcSet} sizes={preview.previewSizes} alt={screen.alt} width={preview.width} height={preview.height} draggable="false" loading={index === active ? "eager" : "lazy"} decoding="async" fetchPriority={index === active ? "high" : "low"} />
                </div>
                {screen.kind === "document" && (
                  <figcaption className="system-tour-document-caption">
                    <span>Gerado no Conta Comigo</span>
                    <strong>Um orçamento pronto para apresentar.</strong>
                    <p>Logo da empresa, serviços e valores organizados em um PDF real da demonstração.</p>
                    <small>Use “Ampliar tela” para ler os detalhes.</small>
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
        <figure className={`system-tour-flat${screens[active].kind === "document" ? " is-document" : ""}${showCrispFace ? " is-visible" : ""}`} aria-hidden={!showCrispFace}>
          <div className="system-tour-visual">
            <img src={previewSource(screens[active])} srcSet={screens[active].previewSrcSet} sizes={screens[active].previewSizes} alt={screens[active].alt} width={screens[active].width} height={screens[active].height} draggable="false" loading="eager" decoding="async" fetchPriority="high" />
          </div>
          {screens[active].kind === "document" && (
            <figcaption className="system-tour-document-caption">
              <span>Gerado no Conta Comigo</span>
              <strong>Um orçamento pronto para apresentar.</strong>
              <p>Logo da empresa, serviços e valores organizados em um PDF real da demonstração.</p>
              <small>Use “Ampliar tela” para ler os detalhes.</small>
            </figcaption>
          )}
        </figure>
      </div>
      <div className="system-tour-screen-list" role="group" aria-label="Escolher tela do sistema">
        {screens.map((screen, index) => (
          <button
            type="button"
            key={screen.title}
            className={index === active ? "is-active" : ""}
            aria-label={`Mostrar ${screen.title}`}
            aria-pressed={index === active}
            onClick={() => goTo(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span> {screen.shortTitle}
          </button>
        ))}
      </div>
      <div className="system-tour-bottom">
        <div className="system-tour-description" aria-live="polite">
          <strong>{screens[active].title}</strong>
          <span>{screens[active].description}</span>
          <small>Capturas da demonstração, com dados fictícios.</small>
          {screens[active].kind === "document" && (
            <a className="system-tour-pdf-link" href="/screens/orcamento-exemplo.pdf" target="_blank" rel="noopener noreferrer">
              Abrir o PDF original <Expand size={15} aria-hidden="true" />
            </a>
          )}
        </div>
        <div className="system-tour-actions">
          <button type="button" onClick={() => goTo(active - 1)} aria-label="Tela anterior"><ChevronLeft size={18} /></button>
          <span className="system-tour-counter">{String(active + 1).padStart(2, "0")} / {String(screens.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => goTo(active + 1)} aria-label="Próxima tela"><ChevronRight size={18} /></button>
          <button ref={expandButton} type="button" className="system-tour-expand" onClick={() => { void openExpanded(); }} aria-label={`Ampliar tela de ${screens[active].title}`}><Expand size={17} /><span>Ampliar tela</span></button>
        </div>
      </div>
      {expanded && createPortal(
        <div className="system-tour-lightbox" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) { setExpanded(false); setZoomed(false); }
        }}>
          <div ref={dialogRef} className={`system-tour-dialog${zoomed ? " is-zoomed" : ""}${screens[active].kind === "document" ? " is-document" : ""}`} role="dialog" aria-modal="true" aria-label={`Tela de ${screens[active].title}`}>
            <div className="system-tour-dialog-top">
              <span aria-live="polite">{screens[active].title} <small>{active + 1} de {screens.length} · dados fictícios</small></span>
              <div className="system-tour-dialog-top-actions">
                <button type="button" onClick={() => goTo(active - 1)} aria-label="Tela anterior"><ChevronLeft size={20} /></button>
                <button type="button" onClick={() => goTo(active + 1)} aria-label="Próxima tela"><ChevronRight size={20} /></button>
                <a className="system-tour-dialog-faq-link" href="/perguntas-frequentes/" aria-label="Abrir perguntas frequentes">
                  <span>Perguntas frequentes</span> <ArrowUpRight size={17} aria-hidden="true" />
                </a>
                <button type="button" onClick={() => setZoomed((value) => !value)} aria-label={zoomed ? "Ajustar imagem à tela" : "Aproximar detalhes"} aria-pressed={zoomed}><ZoomIn size={20} /><span>{zoomed ? "Ajustar" : "Aproximar"}</span></button>
                <button ref={closeButton} type="button" onClick={() => { setExpanded(false); setZoomed(false); }} aria-label="Fechar imagem ampliada"><X size={20} /></button>
              </div>
            </div>
            <div
              className="system-tour-dialog-image"
              onPointerDown={onModalPointerDown}
              onPointerUp={onModalPointerUp}
              onPointerCancel={() => { modalPointer.current = null; }}
            >
              <img src={screens[active].image} alt={screens[active].alt} width={screens[active].width} height={screens[active].height} draggable="false" decoding="async" fetchPriority="high" />
            </div>
            <div className="system-tour-dialog-footer">
              <div className="system-tour-dialog-tabs" role="group" aria-label="Escolher tela ampliada">
                {screens.map((screen, index) => (
                  <button key={screen.title} type="button" aria-pressed={index === active} onClick={() => goTo(index)}>
                    {screen.shortTitle}
                  </button>
                ))}
              </div>
              {screens[active].kind === "document" && (
                <a href="/screens/orcamento-exemplo.pdf" target="_blank" rel="noopener noreferrer">Abrir PDF original <Expand size={16} aria-hidden="true" /></a>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
