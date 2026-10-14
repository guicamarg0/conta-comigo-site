import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import "./system-tour-3d.css";

const screens = [
  {
    title: "Orçamentos",
    description: "Itens, valores e condições em uma proposta organizada.",
    image: "/screens/orcamentos.png",
    alt: "Tela real da demonstração do Conta Comigo com a lista de orçamentos fictícios",
  },
  {
    title: "Agenda e serviços",
    description: "Compromissos e serviços visíveis para acompanhar a rotina.",
    image: "/screens/agenda.png",
    alt: "Tela real da demonstração do Conta Comigo com agenda de serviços fictícios",
  },
  {
    title: "Contratos",
    description: "Documentos e histórico ligados ao trabalho combinado.",
    image: "/screens/contratos.png",
    alt: "Tela real da demonstração do Conta Comigo com contratos fictícios",
  },
];

const faceAngle = 120;
export default function SystemTour3D() {
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [radius, setRadius] = useState(380);
  const pointer = useRef(null);
  const stage = useRef(null);
  const expandButton = useRef(null);
  const closeButton = useRef(null);

  useEffect(() => {
    if (!stage.current) return undefined;
    const measure = () => setRadius(Math.max(170, Math.min(450, Math.round(stage.current.clientWidth * 0.62))));
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
      if (event.key === "Escape") setExpanded(false);
      if (event.key === "Tab") {
        event.preventDefault();
        closeButton.current?.focus();
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
        <small>Arraste para girar ou escolha uma tela</small>
      </div>
      <div
        className="system-tour-stage"
        ref={stage}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={cancelDrag}
        aria-label="Arraste na horizontal para girar as telas da demonstração"
      >
        <div
          className={`system-tour-rotor${dragging ? " is-dragging" : ""}`}
          style={{ transform: `translateZ(-${radius}px) rotateY(${rotation}deg)` }}
        >
          {screens.map((screen, index) => (
            <figure
              className="system-tour-face"
              key={screen.title}
              style={{ transform: `rotateY(${index * faceAngle}deg) translateZ(${radius}px)` }}
              aria-hidden={index !== active}
            >
              <img src={screen.image} alt={screen.alt} draggable="false" loading="eager" />
            </figure>
          ))}
        </div>
      </div>
      <div className="system-tour-bottom">
        <div className="system-tour-description" aria-live="polite">
          <strong>{screens[active].title}</strong>
          <span>{screens[active].description}</span>
          <small>Capturas da demonstração, com dados fictícios.</small>
        </div>
        <div className="system-tour-actions">
          <button type="button" onClick={() => goTo(active - 1)} aria-label="Tela anterior"><ChevronLeft size={18} /></button>
          <div className="system-tour-dots" aria-label="Escolher tela">
            {screens.map((screen, index) => (
              <button
                type="button"
                key={screen.title}
                className={index === active ? "is-active" : ""}
                aria-label={`Mostrar ${screen.title}`}
                aria-pressed={index === active}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
          <button type="button" onClick={() => goTo(active + 1)} aria-label="Próxima tela"><ChevronRight size={18} /></button>
          <button ref={expandButton} type="button" className="system-tour-expand" onClick={() => setExpanded(true)} aria-label={`Ampliar tela de ${screens[active].title}`}><Expand size={17} /></button>
        </div>
      </div>
      {expanded && createPortal(
        <div className="system-tour-lightbox" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setExpanded(false);
        }}>
          <div className="system-tour-dialog" role="dialog" aria-modal="true" aria-label={`Tela de ${screens[active].title}`}>
            <div className="system-tour-dialog-top">
              <span>{screens[active].title} · demonstração fictícia</span>
              <button ref={closeButton} type="button" onClick={() => setExpanded(false)} aria-label="Fechar imagem ampliada"><X size={20} /></button>
            </div>
            <img src={screens[active].image} alt={screens[active].alt} />
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
