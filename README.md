# Forms Designer

[![Deploy Vite App to Pages](https://github.com/gravio-la/forms-designer/actions/workflows/vite-pages.yml/badge.svg)](https://github.com/gravio-la/forms-designer/actions/workflows/vite-pages.yml)

## Overview

FormsDesigner is a WYSIWYG editor developed in TypeScript for creating diverse forms using the JSONForms framework. It enables the creation of a JSON-Schema and an UI-schema for streamlined form creation and management.

## Open a Demo

A live [Storybook](https://formswizard.github.io/forms-designer/storybook/) demo is available online.

To view a demo on your local machine, launch a dev build — see [Develop](#develop) for more details.

##  Details

FormsDesigner allows for the easy and efficient creation of forms, producing JSON-Schema and UI-schema which can be used independently with JSONForms, enhancing its compatibility across various frameworks like VueJS, Angular, and Vanilla JS. It employs a modular approach for extending by providing new renderers for both the final form and the editing process.

The FormsDesigner is a part of the broader FormsWizard project, which delivers a complete No-Code solution to form creation and management, with synchronization and serverless operations brought by the FormsWizard project as a whole.

## Tool collections

Features of the designer (toolbox entries, JsonForms renderers, field-settings editors, translations, AJV formats) are packaged as **tool collections**: objects of type `FormsDesignerToolCollection` from `@formswizard/types`. The app wraps the UI in `<ToolProvider toolCollections={…}>` (`packages/tool-context`), which merges every collection into one registry the hooks read from.

**Important distinction:** `rendererRegistry` feeds the **main** designer / preview JsonForms (the canvas). `settingsRendererRegistry` feeds **only** the field-settings JsonForms in the right drawer (`materialRenderers` + these entries). They are separate arrays; if a custom control must appear in both places, register the same renderer entry in both. `cellRendererRegistry`, `toolSettings`, `ajvFormatRegistry`, `translations`, `iconRegistry`, and `draggableElements` are merged as documented in the generated `toolCollection.ts` (see the hygen template JSDoc in `_templates/forms-designer/tool-collection/toolCollection.ts.t`).

### Create a new tool collection package

From the repository root:

```sh
bunx hygen forms-designer tool-collection
```

You will be prompted for the npm package name (convention: `@formswizard/<short-name>`) and a description. Hygen writes a new package under `packages/<short-name>/` (source, `package.json`, `tsup` config, stubs for renderers, icons, draggable components, tool settings, and translations).

Because workspaces are `apps/*` and `packages/*`, the new folder is already part of the monorepo. Run `bun install` and `bun run build --filter <your-package>` (or a full `bun run build`) so dependents resolve.

### Register the collection in the app

Import your `…ToolCollection` export and pass it in the `toolCollections` array on `ToolProvider`, for example in `apps/vite/src/main.tsx` or `packages/forms-designer/WizardApp.tsx`. Order matters where merge order matters (e.g. renderer lists are concatenated in the order of the array).

## Apps and Packages

This Turborepo includes various packages and apps:

### Apps
- `./apps/storybook`: A Storybook for visualizing components.
- `./apps/vite`: An example using ViteJS.

### Packages
- `./packages/advanced-tools`: A collection of tools, like location and map pickers.
- `./packages/basic-renderer`: Contains basic renderers for the project.
- `./packages/basic-tools`: A collection of form components and renderers like TextFields, Number and Date Inputs.
- `./packages/eslint-config-custom`: Provides custom ESLint configurations.
- `./packages/experimental-renderers`: Experimental renderers (e.g. location picker with leaflet).
- `./packages/fieldSettings`: Field Settings logic and settings typically seen within the right drawer.
- `./packages/forms-designer`: The main FormsDesigner package.
- `./packages/i18n`: Internationalization support.
- `./packages/jest-presets`: Contains Jest presets for turbo repos.
- `./packages/react-hooks`: Includes React hooks used in the project.
- `./packages/renderer`: Houses special drag-and-drop renderers needed for the editor view.
- `./packages/state`: Manages state within the project.
- `./packages/theme`: Contains theming details and configurations.
- `./packages/tool-context`: Shared context for tool components.
- `./packages/toolbox`: A toolbox seen within the left drawer, where one can pick tools and blocks.
- `./packages/tsconfig`: Holds TypeScript configuration details.
- `./packages/tsup-config`: Shared tsup bundler configuration.
- `./packages/types`: Type definitions used across the project.
- `./packages/utils`: General utilities for various tasks.

Each package/app is fully developed in TypeScript and provides type definitions.

## Build

To build all apps and packages, execute:

```sh
bun run build
```

## Develop

To develop all apps and packages, execute:

```sh
bun run dev
```

If you only want to run a task for part of the projects, use turbo's filtering:

```sh
bun run dev --filter @formswizard/forms-designer-renderer
```
or exclude certain apps:
```sh
bun run dev --filter '!@formswizard/storybook'
```
## Test

To run all tests, execute:

```sh
bun run test
```


## Update dependencies

To update all dependencies, execute:

```sh
bun update --latest
```

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting


### Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
