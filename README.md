# YGL – You've 🐐 logs!

This is YGL, a simple NDJSON log viewer optimized to get logs on the screen as
quickly as possible.

## How to run

YGL uses a standard `vite` setup. Run `npm install`, then run:

- `npm run dev` to start a dev build server (port `5173`)
- `npm run build` to do a production build (to `dist`)
- `npm run preview` to start a production build server (port `4173`, requires build)
- `npm run test` to run all unit tests
- `npm run lint` to run the linter

## Structure of `src`

- `data` contains fetching and parsing functions, plus a convenient React hook wrapper.
- `messages` and `timeline` contain straightforward React components to render the
  retrieved data.
- Other files are either support files or `App`, which ties together the hook and display
  components.

## Testing

The default `vitest` setup runs basic unit tests. See `messages` and `timeline` sources
for test files. `data` sources contain unit tests for the streaming fetcher/parser,
with `fetch` mocked. These unit tests verify functionality but not timing.

A more complete test support would require at least one functional test, to go through
a full fetch/parse/render cycle and verify real-world timing criteria.

## Notes / Discussion

- The streaming parser delivers the first messages as quickly as possible, and then
  batches messages into chunks to prevent large event files from overwhelming the UI.
  For the given example file, performance is quite good: Even a development build with
  devtools enabled renders a cached download practically instantly, without blocking
  the UI.
  - Decided against using a worker since performance seems okay even without it. It
    would be interesting to discuss performance impact of a worker due to message passing
    overhead. Memory use is also a topic to explore, maybe a `SharedArrayBuffer` could
    be used?
- Decided to go with a paginated table instead of virtualization, due to the requirement
  of "bare minimum" dependencies. A DIY virtualization implementation seemed cumbersome.
  Also, practically-endless scrolling for large event tables can surface accessibility challenges.
- Known limitations/bugs:
  - The paginator doesn't support jumping to a specific page.
  - Downloads can't be stopped (look into fetch abort).
  - The timeline is optimized for the example file, and only supports `day` as unit.
