---
to: packages/<%= name.split("/")[1] %>/README.md
---
# <%= name %>

<%= description %>

This package is part of the FormsDesigner monorepo (`packages/*`). Peer dependencies use the root **catalog** (`catalog:` in `package.json`).

## Development

From the monorepo root:

```sh
bun install
cd packages/<%= name.split("/")[1] %> && bun run build && bun test
```

Or from the root with Turborepo: `turbo run build --filter=<%= name %>`.

## Usage in an app

Import the collection and pass it to `ToolProvider` (see `apps/vite/src/main.tsx` or `packages/forms-designer/WizardApp.tsx`):

```typescript
import { <%= name.split("/")[1].replace(/-/g, '') %>ToolCollection } from '<%= name %>'

<ToolProvider
  toolCollections={[
    // …other collections,
    <%= name.split("/")[1].replace(/-/g, '') %>ToolCollection,
  ]}
>
```

See `src/toolCollection.ts` for how registries (`rendererRegistry`, optional `settingsRendererRegistry`, etc.) are wired, and the repository root `README.md` section **Tool collections**.

## License

MIT
