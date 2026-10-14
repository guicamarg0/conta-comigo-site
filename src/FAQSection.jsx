import { ArrowRight } from "lucide-react";
import { landingFaqItems } from "./faq-content.js";

export default function FAQSection() {
  return (
    <section className="faq section-container" aria-labelledby="faq-title">
      <div className="section-heading">
        <span className="eyebrow">Dúvidas frequentes</span>
        <h2 id="faq-title">Respostas para organizar sua rotina de serviços.</h2>
        <p>Veja algumas respostas rápidas ou consulte a página completa de perguntas frequentes.</p>
      </div>
      <div className="faq-list">
        {landingFaqItems.map(({ question, answer }) => (
          <details className="faq-item" key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
      <a className="button button-outline faq-more-link" href="/perguntas-frequentes/">
        Ver todas as perguntas frequentes <ArrowRight size={17} aria-hidden="true" />
      </a>
    </section>
  );
}
