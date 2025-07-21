(function (global) {
  function init(options) {
    var projectId = options.projectId;
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
    btn.textContent = 'Donner un avis';
    btn.onclick = function () {
      alert('TODO: open feedback form');
    };
    document.body.appendChild(btn);
  }
  global.FeedbackItWidget = { init: init };
})(this);
