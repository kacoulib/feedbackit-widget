# @feedbackit/widget-html

Vanilla JS build of the FeedbackIt widget. Use in any webpage.

```html
<script src="widget.js"></script>
<script>
  FeedbackItWidget.init({ projectId: 'abc123' });
</script>
```

### Language

Language defaults to the browser setting (English or French). Override with the
`lang` option:

```html
<script>
  FeedbackItWidget.init({ projectId: 'abc123', lang: 'fr' });
</script>
```
