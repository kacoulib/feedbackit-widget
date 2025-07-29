import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

export interface FeedbackItWidgetProps {
  projectId: string;
  lang?: string;
  showFeedbackButton?: boolean;
  pollAlerts?: boolean;
}

const translations = {
  en: {
    feedbackButton: 'Give feedback',
    placeholder: 'Your feedback',
    send: 'Send'
  },
  fr: {
    feedbackButton: 'Donner un avis',
    placeholder: 'Votre avis',
    send: 'Envoyer'
  }
};

function detectLang(prop?: string): keyof typeof translations {
  if (prop && translations[prop as keyof typeof translations]) return prop as keyof typeof translations;
  if (typeof navigator !== 'undefined' && navigator.language.startsWith('fr')) return 'fr';
  return 'en';
}

export const FeedbackItWidget: React.FC<FeedbackItWidgetProps> = ({ projectId, lang, showFeedbackButton = true, pollAlerts = true }) => {
  const locale = detectLang(lang);
  const t = translations[locale];
  const [alert, setAlert] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    if (!pollAlerts) return;
    fetch(`https://api.feedbackit.io/alerts?projectId=${projectId}`)
      .then(r => r.json())
      .then(a => setAlert(a.active ? a : null))
      .catch(() => {});
  }, [projectId, pollAlerts]);
  return (
    <div className="feedbackit-widget">
      {alert && (
        <div className={`fi-alert fi-${alert.type}`}>{alert.message}</div>
      )}
      {showFeedbackButton && (
        <button className="fi-btn" onClick={() => setShowForm(true)}>{t.feedbackButton}</button>
      )}
      {showForm && (
        <form onSubmit={e => { e.preventDefault(); setShowForm(false); }}>
          <textarea name="message" placeholder={t.placeholder} />
          <input type="file" name="file" />
          <button type="submit">{t.send}</button>
        </form>
      )}
    </div>
  );
};

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

export default FeedbackItWidget;
