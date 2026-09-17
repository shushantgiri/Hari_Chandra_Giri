# /public/images

No real photography is wired into the site yet — every photo you see is a
generated placeholder (`components/ui/PlaceholderImage.tsx`), so nothing here
is a stock photo or an invented picture of Hari.

Drop real, rights-cleared photography in here, then swap the matching
`<PlaceholderImage label="..." />` for a Next.js `<Image src="/images/..."
alt="..." fill />` in the component that uses it. Search each component
folder for `PlaceholderImage` to find every spot that needs a real photo —
the `label` prop on each one already describes what should go there (e.g.
"Hari Chandra Giri — full-height hand-walking photograph").

Suggested file organization once you have assets:

```
images/
  hero/            full-height hero photography
  records/         one shot per record, matches lib/records.ts ids
  journey/         one shot per journey milestone, matches lib/journey.ts ids
  about/           portrait for the About section
  gallery/         the six "In Motion" gallery shots
  nepal/           landscape for the Nepal section
```
