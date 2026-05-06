# @guild/ui

Shared illuminated-manuscript UI primitives, ornaments, and Tailwind v4 theme.

## Install (consumer app)

While developing locally, point your app's `package.json` at this directory:

```json
{
  "dependencies": {
    "@guild/ui": "link:../guild-ui"
  }
}
```

For deployable installs, pin to a tag:

```json
{
  "dependencies": {
    "@guild/ui": "github:toolsforexperience/guild-ui#v0.1.0"
  }
}
```

## Use

```tsx
import "@guild/ui/styles.css";
import { Card, Badge, DropCap } from "@guild/ui";
```

In your app's CSS, after `@import "tailwindcss";`, scan this package's source files
so Tailwind picks up the class usage:

```css
@source "../node_modules/@guild/ui/src/**/*.{ts,tsx}";
```

## Fonts

The theme uses EB Garamond, Cardo, and UnifrakturMaguntia from Google Fonts.
Add to your app's HTML head:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Cardo:ital,wght@0,400;0,700;1,400&family=UnifrakturMaguntia&display=swap" rel="stylesheet">
```
