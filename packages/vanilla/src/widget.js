(function (global) {
  var translations = {
    en: { feedbackButton: 'Give feedback' },
    fr: { feedbackButton: 'Donner un avis' }
  };

  function detectLang(lang) {
    if (lang && translations[lang]) return lang;
    if (navigator.language && navigator.language.indexOf('fr') === 0) return 'fr';
    return 'en';
  }

  function init(options) {
    var projectId = options.projectId;
    var lang = detectLang(options.lang);
    fetch('https://api.feedbackit.io/alerts?projectId=' + projectId)
      .then(function (r) { return r.json(); })
      .then(function (a) {
        if (a.active) {
          var div = document.createElement('div');
          div.className = 'fi-alert fi-' + a.type;
          div.textContent = a.message;
          document.body.appendChild(div);
        }
      });
    var btn = document.createElement('button');
    btn.textContent = translations[lang].feedbackButton;
    btn.onclick = function () {
      alert('TODO: open feedback form');
    };
    document.body.appendChild(btn);
  }
  global.FeedbackItWidget = { init: init };
})(this);
