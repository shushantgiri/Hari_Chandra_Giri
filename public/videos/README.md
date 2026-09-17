# /public/videos

Drop real footage here (mp4/webm), then open
`components/video/VideoSection.tsx` and replace the placeholder `<div>`
inside the lightbox (search for "Footage isn't uploaded yet") with a real
`<video>` element or an embed for whichever host you use (YouTube, Vimeo,
Mux, etc.):

```tsx
<video controls className="h-full w-full" poster="/images/records/100-stairs.jpg">
  <source src="/videos/100-stairs.mp4" type="video/mp4" />
</video>
```

The six video slots already defined in `VIDEOS` in that file map to:
100 stairs (featured), hand-walking, 75 stairs, football challenge, tyre
skipping, training.
