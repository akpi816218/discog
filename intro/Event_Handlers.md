# Event Handlers

## Initial file setup

When creating a new slash command, start with a copy of the template: `cp events/z.event.tstemplate commands/${EVENT_NAME}.ts`

```typescript
import { Events } from 'discord.js';
('use strict');
// ! Add event property
export const name = Events.Event_Name;
export const once = false;
export const execute = async (event: Event) => {
	// ...
};
export default {
	name,
	once,
	execute,
};
```

## Coding the event handler

Set `name` to the event object and remove the comment above it. Set `once` to reflect how many times the event should be handled. The code for the event should go inside the `execute` function. The `Event` must be the sole parameter to the function.

## Event handler rules

- The filename should be the name of the event, written in camel case.
- For data storage, use the `Jsoning` package. Add `import Jsoning from 'jsoning';` after the Discord.js imports.
