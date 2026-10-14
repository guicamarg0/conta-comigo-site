import { useId, useRef, useState } from "react";
import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import "./contact-form.css";

const CONTACT_EMAIL = "webcontacomigo@gmail.com";
const WHATSAPP_NUMBER = "5541995009891";
const INTEREST_OPTIONS = [
  "Conhecer o Conta Comigo",
  "Conversar sobre planos",
  "Organizar minha rotina de serviços",
  "Outro assunto",
];

const INITIAL_VALUES = { name: "", email: "", interest: "", message: "" };

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Informe seu nome.";
  if (!values.email.trim()) {
    errors.email = "Informe seu e-mail.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Informe um e-mail válido.";
  }
  if (!values.interest) errors.interest = "Selecione um assunto.";
  if (!values.message.trim()) errors.message = "Escreva sua mensagem.";
  return errors;
}

function buildMessage(values) {
  return [
    "Olá! Gostaria de conversar sobre o Conta Comigo.",
    "",
    `Nome: ${values.name.trim()}`,
    `E-mail: ${values.email.trim()}`,
    `Assunto: ${values.interest}`,
    "",
    values.message.trim(),
  ].join("\n");
}

/** Abre uma mensagem preenchida no aplicativo escolhido; nenhum dado é enviado pelo site. */
export default function ContactForm() {
  const id = useId();
  const fieldRefs = useRef({});
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});

  function updateField(field, value) {
    setValues((previous) => ({ ...previous, [field]: value }));
    if (errors[field]) setErrors((previous) => ({ ...previous, [field]: "" }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    const channel = event.nativeEvent.submitter?.value;
    const message = buildMessage(values);
    if (channel === "email") {
      const subject = `Contato pelo site Conta Comigo — ${values.interest}`;
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      return;
    }
    if (channel === "whatsapp") {
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    }
  }

  function fieldProps(field) {
    return {
      id: `${id}-${field}`,
      name: field,
      value: values[field],
      onChange: (event) => updateField(field, event.target.value),
      ref: (element) => { fieldRefs.current[field] = element; },
      "aria-invalid": Boolean(errors[field]),
      "aria-describedby": errors[field] ? `${id}-${field}-error` : undefined,
      required: true,
    };
  }

  return (
    <section className="cc-contact-form" id="contato" aria-labelledby={`${id}-title`}>
      <div className="cc-contact-intro">
        <span className="eyebrow">Fale com a gente</span>
        <h2 id={`${id}-title`}>Conte como é sua rotina de serviços.</h2>
        <p>Podemos mostrar como o Conta Comigo ajuda a organizar orçamentos, contratos, agenda e atendimentos.</p>
        <div className="cc-contact-direct">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={18} aria-hidden="true" /> +55 (41) 99500-9891
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`}>
            <Mail size={18} aria-hidden="true" /> {CONTACT_EMAIL}
          </a>
        </div>
      </div>

      <form className="cc-contact-card" noValidate onSubmit={handleSubmit}>
        <div className="cc-contact-fields-row">
          <div className="cc-contact-field">
            <label htmlFor={`${id}-name`}>Seu nome <span aria-hidden="true">*</span></label>
            <input {...fieldProps("name")} type="text" autoComplete="name" placeholder="Como podemos chamar você?" />
            {errors.name && <small id={`${id}-name-error`} role="alert">{errors.name}</small>}
          </div>
          <div className="cc-contact-field">
            <label htmlFor={`${id}-email`}>Seu e-mail <span aria-hidden="true">*</span></label>
            <input {...fieldProps("email")} type="email" autoComplete="email" placeholder="voce@empresa.com.br" />
            {errors.email && <small id={`${id}-email-error`} role="alert">{errors.email}</small>}
          </div>
        </div>

        <div className="cc-contact-field">
          <label htmlFor={`${id}-interest`}>Assunto <span aria-hidden="true">*</span></label>
          <select {...fieldProps("interest")}>
            <option value="">Selecione uma opção</option>
            {INTEREST_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          {errors.interest && <small id={`${id}-interest-error`} role="alert">{errors.interest}</small>}
        </div>

        <div className="cc-contact-field">
          <label htmlFor={`${id}-message`}>Sua mensagem <span aria-hidden="true">*</span></label>
          <textarea {...fieldProps("message")} rows={5} placeholder="Conte um pouco sobre o seu negócio e o que você gostaria de organizar." />
          {errors.message && <small id={`${id}-message-error`} role="alert">{errors.message}</small>}
        </div>

        <p className="cc-contact-note">Escolha como prefere conversar. A mensagem será aberta com seus dados preenchidos para você revisar e enviar no aplicativo escolhido.</p>
        <div className="cc-contact-actions">
          <button className="button-primary" type="submit" name="channel" value="whatsapp">
            <MessageCircle size={17} aria-hidden="true" /> Abrir no WhatsApp <ArrowUpRight size={15} aria-hidden="true" />
          </button>
          <button className="button-secondary" type="submit" name="channel" value="email">
            <Mail size={17} aria-hidden="true" /> Abrir no e-mail <ArrowUpRight size={15} aria-hidden="true" />
          </button>
        </div>
      </form>
    </section>
  );
}
