import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Expand, ZoomIn, X } from "lucide-react";
import "./system-tour-3d.css";

const screens = [
  {
    title: "Orçamentos",
    shortTitle: "Orçamentos",
    description: "Itens, valores e condições em uma proposta organizada.",
    image: "/screens/orcamentos.png",
    alt: "Tela real da demonstração do Conta Comigo com a lista de orçamentos fictícios",
  },
  {
    title: "PDF do orçamento",
    shortTitle: "PDF",
    description: "O orçamento gerado pelo próprio sistema, com logo e cinco itens de exemplo.",
    image: "/screens/orcamento-pdf.png",
    alt: "PDF de orçamento gerado pelo Conta Comigo com logo da empresa e cinco itens fictícios",
    kind: "document",
  },
  {
    title: "Clientes",
    shortTitle: "Clientes",
    description: "Dados e histórico do cliente próximos de cada atendimento.",
    image: "/screens/clientes.png",
    alt: "Tela de clientes da demonstração do Conta Comigo com dados fictícios",
  },
  {
    title: "Serviços",
    shortTitle: "Serviços",
    description: "Acompanhe o andamento de cada serviço em um lugar só.",
    image: "/screens/servicos.png",
    alt: "Tela de serviços da demonstração do Conta Comigo com dados fictícios",
  },
  {
    title: "Agenda e serviços",
    shortTitle: "Agenda",
    description: "Compromissos e serviços visíveis para acompanhar a rotina.",
    image: "/screens/agenda.png",
    alt: "Tela real da demonstração do Conta Comigo com agenda de serviços fictícios",
  },
  {
    title: "Contratos",
    shortTitle: "Contratos",
    description: "Documentos e histórico ligados ao trabalho combinado.",
    image: "/screens/contratos.png",
    alt: "Tela real da demonstração do Conta Comigo com contratos fictícios",
  },
  {
    title: "Peças e itens",
    shortTitle: "Peças",
    description: "Tenha os itens usados nos serviços organizados para preparar orçamentos.",
    image: "/screens/pecas.png",
    alt: "Tela de peças e itens da demonstração do Conta Comigo com dados fictícios",
  },
];

const faceAngle = 360 / screens.length;
export default function SystemTour3D() {
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [radius, setRadius] = useState(1080);
  const pointer = useRef(null);
  const modalPointer = useRef(null);
  const stage = useRef(null);
  const expandButton = useRef(null);
  const closeButton = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!stage.current) return undefined;
    const measure = () => setRadius(Math.round(stage.current.clientWidth * 1.04));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

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

  const goTo = (index) => {
    setActive((index + screens.length) % screens.length);
    setDrag(0);
    setZoomed(false);
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
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (pointer.current?.id !== event.pointerId) return;
    setDrag(Math.max(-260, Math.min(260, event.clientX - pointer.current.x)));
  };

  const finishDrag = (event) => {
    if (pointer.current?.id !== event.pointerId) return;
    const distance = event.clientX - pointer.current.x;
    pointer.current = null;
    setDragging(false);
    setDrag(0);
    if (distance > 55) goTo(active - 1);
    if (distance < -55) goTo(active + 1);
  };

  const cancelDrag = () => {
    pointer.current = null;
    setDragging(false);
    setDrag(0);
  };

  const rotation = -active * faceAngle + drag * 0.45;

  return (
    <section className="system-tour" id="telas-do-sistema" aria-label="Telas do Conta Comigo">
      <div className="system-tour-heading">
        <span>Veja o sistema por dentro</span>
        <small>Arraste para girar ou escolha uma tela abaixo</small>
      </div>
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
          className={`system-tour-rotor${dragging ? " is-dragging" : ""}`}
          style={{ transform: `translateZ(-${radius}px) rotateY(${rotation}deg)` }}
        >
          {screens.map((screen, index) => (
            <figure
              className={`system-tour-face${screen.kind === "document" ? " is-document" : ""}`}
              key={screen.title}
              style={{ transform: `rotateY(${index * faceAngle}deg) translateZ(${radius}px)` }}
              aria-hidden={index !== active}
            >
              <div className="system-tour-visual">
                <img src={screen.image} alt={screen.alt} draggable="false" loading="eager" />
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
          ))}
        </div>
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
          <button ref={expandButton} type="button" className="system-tour-expand" onClick={() => setExpanded(true)} aria-label={`Ampliar tela de ${screens[active].title}`}><Expand size={17} /><span>Ampliar tela</span></button>
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
              <img src={screens[active].image} alt={screens[active].alt} draggable="false" />
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
