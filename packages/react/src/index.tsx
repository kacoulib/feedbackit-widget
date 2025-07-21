import React, { useState, useEffect } from 'react';

export interface FeedbackItWidgetProps {
  projectId: string;
  lang?: string;
  showFeedbackButton?: boolean;
  pollAlerts?: boolean;
}

export const FeedbackItWidget: React.FC<FeedbackItWidgetProps> = ({ projectId, lang = 'en', showFeedbackButton = true, pollAlerts = true }) => {
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
        <button className="fi-btn" onClick={() => setShowForm(true)}>Donner un avis</button>
      )}
      {showForm && (
        <form onSubmit={e => { e.preventDefault(); setShowForm(false); }}>
          <textarea name="message" placeholder="Votre avis" />
          <input type="file" name="file" />
          <button type="submit">Envoyer</button>
        </form>
      )}
    </div>
  );
};

export default FeedbackItWidget;
