# @feedbackit/widget

React component for displaying FeedbackIt alerts and feedback form.

## Usage

```jsx
import { FeedbackItWidget } from '@feedbackit/widget';

<FeedbackItWidget projectId="abc123" />
```

### Language

The widget automatically detects the browser language (English or French).
Override detection using the `lang` prop:

```jsx
<FeedbackItWidget projectId="abc123" lang="fr" />
```
