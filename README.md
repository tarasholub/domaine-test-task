# Domaine FE assessment

Product card built to the Figma spec on Shopify's skeleton theme, styled with Tailwind v4.

Prototype: https://domaine-test-task.myshopify.com (storefront password: `shiche`)

## Running locally

```bash
npm install
npm run dev:css   # tailwind watch -> assets/tailwind.css
npm run dev       # shopify theme dev
```

## Notes

- The card is `snippets/product-card.liquid` + `assets/variant-swatches.js`. Swatches, price and image are separate snippets, reused on the product page and collection listing.
- Media convention: a variant's featured image is the front shot, the hover/carousel shot is the product media with alt `<color>-secondary`.
- A variant is on sale when `compare_at_price` is above `price`.
- Swatch colors come from Shopify's native option swatches (Color metafield), with the color name as a CSS fallback.
- On touch devices the hover crossfade becomes a two-slide swipe carousel.
