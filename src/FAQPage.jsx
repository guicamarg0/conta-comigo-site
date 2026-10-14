import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { faqGroups } from "./faq-content.js";
import "./faq-page.css";

const DEMO_URL = "https://gestao-servicos-guicamarg0.pages.dev/demo";

export default function FAQPage() {
  return (
    <div className="faq-page">
      <header className="faq-page-header">
        <a href="/" aria-label="Conta Comigo, página inicial">
          <img src="/marca/logo-horizontal.svg" alt="Conta Comigo" />
        </a>
        <a className="faq-page-home-link" href="/">Voltar ao site <ArrowLeft size={16} aria-hidden="true" /></a>
      </header>
      <main className="faq-page-main">
        <div className="faq-page-intro">
          <span className="eyebrow">Central de dúvidas</span>
          <h1>Perguntas frequentes sobre o Conta Comigo</h1>
          <p>
            Saiba como o sistema apoia empreendedores e pequenas empresas na organização
            de orçamentos, contratos, serviços e gestão da rotina.
          </p>
        </div>
        <nav className="faq-page-categories" aria-label="Temas das perguntas frequentes">
          {faqGroups.map(({ id, title }) => <a key={id} href={`#${id}`}>{title}</a>)}
        </nav>
        {faqGroups.map(({ id, title, questions }) => (
          <section className="faq-page-group" id={id} key={id} aria-labelledby={`${id}-title`}>
            <h2 id={`${id}-title`}>{title}</h2>
            <div className="faq-list">
              {questions.map(({ question, answer }) => (
                <details className="faq-item" key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
        <aside className="faq-page-contact">
          <div>
            <h2>Ainda tem dúvidas?</h2>
            <p>Converse com a equipe ou explore a demonstração pública com dados fictícios.</p>
          </div>
          <div className="faq-page-actions">
            <a className="button button-primary" href={DEMO_URL} target="_blank" rel="noopener noreferrer">
              Explorar demonstração <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <a href="/#contato">Falar com a equipe</a>
          </div>
        </aside>
      </main>
      <footer className="faq-page-footer">
        <span>© {new Date().getFullYear()} Conta Comigo</span>
        <a href="/">Página inicial</a>
      </footer>
    </div>
  );
}
