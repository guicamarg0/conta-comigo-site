import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ClipboardList,
  Clock3,
  FileSignature,
  Menu,
  MessageCircle,
  X,
} from "lucide-react";
import "./brand.css";
import SystemTour3D from "./SystemTour3D.jsx";
import ContactForm from "./ContactForm.jsx";

const DEMO_URL = "https://gestao-servicos-guicamarg0.pages.dev/demo";
const LOGIN_URL = "https://gestao-servicos-guicamarg0.pages.dev/login";
const WHATSAPP_URL =
  "https://wa.me/5541995009891?text=" +
  encodeURIComponent("Olá! Conheci o Conta Comigo pelo site e gostaria de saber mais.");

const navigation = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Planos", href: "#planos" },
  { label: "Contato", href: "#contato" },
];

const journey = [
  {
    number: "01",
    Icon: ClipboardList,
    title: "Orçamentos bem apresentados",
    description:
      "Monte propostas com itens, valores e condições. Revise antes de enviar e gere o PDF com a identidade da sua empresa.",
  },
  {
    number: "02",
    Icon: FileSignature,
    title: "Acordos em ordem",
    description:
      "Organize modelos e contratos ligados ao que foi aprovado, com informações fáceis de encontrar depois.",
  },
  {
    number: "03",
    Icon: CalendarDays,
    title: "Serviços no calendário",
    description:
      "Acompanhe o que foi combinado, os próximos compromissos e o andamento de cada atendimento.",
  },
];

const essentialFeatures = [
  "Cadastro de clientes, empresas e itens",
  "Orçamentos com revisões e PDF com logo",
  "Modelos de contrato e histórico",
  "Serviços, agenda e painel de acompanhamento",
];

const futureFeatures = [
  "Pagamentos e recebimentos de serviços",
  "Acompanhamento mais completo do cliente",
  "Aplicativo para celular",
];

function DemoLink({ children, className = "", onClick }) {
  return (
    <a
      className={className}
      href={DEMO_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
    >
      {children}
    </a>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="site-logo" href="#inicio" aria-label="Conta Comigo, voltar ao início">
          <img src="/marca/logo-horizontal.svg" alt="Conta Comigo" />
        </a>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {navigation.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <DemoLink className="header-demo">
            Explorar demonstração <ArrowUpRight size={16} aria-hidden="true" />
          </DemoLink>
          <button
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((current) => !current)}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="mobile-nav" id="mobile-navigation" aria-label="Navegação para celular">
          {navigation.map((item) => (
            <a href={item.href} key={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
          <DemoLink className="mobile-demo" onClick={() => setMenuOpen(false)}>
            Explorar demonstração <ArrowUpRight size={17} aria-hidden="true" />
          </DemoLink>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title">
      <div className="hero-inner">
        <div className="hero-copy">
          <span className="eyebrow"><span className="eyebrow-mark" /> Gestão de serviços sem complicação</span>
          <h1 id="hero-title">
            Mais clareza para quem <em>vive de prestar serviços.</em>
          </h1>
          <p>
            Organize orçamentos, contratos e agenda em um só lugar. Saiba o que
            foi proposto, aprovado e agendado em cada trabalho.
          </p>
          <div className="hero-actions">
            <DemoLink className="button button-primary">
              Explorar demonstração <ArrowUpRight size={18} aria-hidden="true" />
            </DemoLink>
            <a className="button button-quiet" href="#sobre">
              Entenda como funciona <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="hero-footnote">
            <Check size={17} aria-hidden="true" />
            Demonstração com dados fictícios, separada das contas reais
          </div>
        </div>
        <div className="hero-tour">
          <SystemTour3D />
        </div>
      </div>
      <div className="flow-strip" aria-label="Etapas da rotina">
        <span>Do primeiro contato à entrega</span>
        <div>
          <b>Orçamento</b><ArrowRight size={16} aria-hidden="true" />
          <b>Contrato</b><ArrowRight size={16} aria-hidden="true" />
          <b>Serviço</b><ArrowRight size={16} aria-hidden="true" />
          <b>Agenda</b>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about section-container" id="sobre" aria-labelledby="about-title">
      <div className="section-heading">
        <span className="eyebrow">Sobre o Conta Comigo</span>
        <h2 id="about-title">Seu negócio tem muitas etapas. Elas podem conversar entre si.</h2>
        <p>
          O Conta Comigo foi pensado para autônomos e pequenas empresas
          prestadoras de serviços. Cadastre clientes e itens, prepare propostas,
          organize contratos e acompanhe a execução sem perder o contexto.
        </p>
      </div>
      <div className="journey-grid">
        {journey.map(({ number, Icon, title, description }) => (
          <article className="journey-card" key={number}>
            <div className="journey-card-top">
              <span className="journey-icon"><Icon size={24} strokeWidth={1.8} aria-hidden="true" /></span>
              <span className="journey-number">{number}</span>
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function DemoInvitation() {
  return (
    <section className="demo-invitation" aria-labelledby="demo-title">
      <div className="demo-invitation-inner">
        <div>
          <span className="eyebrow eyebrow-light">Conheça na prática</span>
          <h2 id="demo-title">Veja como o Conta Comigo funciona na rotina.</h2>
          <p>
            Entre na demonstração do próprio sistema e explore um cenário de
            exemplo. Os dados usados ali são fictícios.
          </p>
        </div>
        <div className="demo-invitation-actions">
          <DemoLink className="button button-white">
            Abrir demonstração <ArrowUpRight size={18} aria-hidden="true" />
          </DemoLink>
          <a href={LOGIN_URL} target="_blank" rel="noopener noreferrer">
            Já tem uma conta? Acessar sistema <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

function Plans() {
  return (
    <section className="plans section-container" id="planos" aria-labelledby="plans-title">
      <div className="section-heading plans-heading">
        <span className="eyebrow">Planos e evolução</span>
        <h2 id="plans-title">Comece pelo que organiza sua rotina hoje.</h2>
        <p>
          Estamos definindo os formatos de contratação. Conheça os recursos já
          disponíveis e o que planejamos acrescentar.
        </p>
      </div>
      <div className="plan-grid">
        <article className="plan-card plan-current">
          <div className="plan-card-top">
            <span className="plan-status">Recursos disponíveis</span>
            <h3>Essencial</h3>
            <p>O fluxo central para acompanhar serviços sem espalhar informações.</p>
          </div>
          <ul>
            {essentialFeatures.map((feature) => (
              <li key={feature}><Check size={18} aria-hidden="true" />{feature}</li>
            ))}
          </ul>
          <DemoLink className="button button-primary">
            Conhecer na demonstração <ArrowUpRight size={18} aria-hidden="true" />
          </DemoLink>
        </article>
        <article className="plan-card plan-future">
          <div className="plan-card-top">
            <span className="plan-status">Em planejamento</span>
            <h3>Próximas evoluções</h3>
            <p>Novas ferramentas para acompanhar ainda mais de perto o negócio.</p>
          </div>
          <ul>
            {futureFeatures.map((feature) => (
              <li key={feature}><Clock3 size={18} aria-hidden="true" />{feature}</li>
            ))}
          </ul>
          <a className="button button-outline" href="#contato">
            Conversar sobre planos <ArrowRight size={18} aria-hidden="true" />
          </a>
        </article>
      </div>
      <p className="plans-note">
        Valores e contratação online ainda estão em definição. Os recursos
        futuros não fazem parte da oferta atual.
      </p>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main section-container">
        <div className="footer-brand">
          <a href="#inicio" aria-label="Conta Comigo, voltar ao início">
            <img src="/marca/logo-horizontal.svg" alt="Conta Comigo" />
          </a>
          <p>Mais clareza em cada etapa do seu serviço.</p>
        </div>
        <nav aria-label="Navegação do rodapé">
          {navigation.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <div className="footer-contact">
          <span>Vamos conversar?</span>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={17} aria-hidden="true" /> WhatsApp
          </a>
          <a href="mailto:webcontacomigo@gmail.com">webcontacomigo@gmail.com</a>
        </div>
      </div>
      <div className="footer-bottom section-container">
        <span>© {new Date().getFullYear()} Conta Comigo</span>
        <span>Feito para quem transforma serviço em confiança.</span>
      </div>
    </footer>
  );
}

export function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <SiteHeader />
      <main id="conteudo">
        <Hero />
        <About />
        <DemoInvitation />
        <Plans />
        <div className="contact-wrap"><ContactForm /></div>
      </main>
      <SiteFooter />
    </>
  );
}

export default App;
