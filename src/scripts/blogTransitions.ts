// Custom Astro swap function for navigations within /blog. The site's
// <main class="window"> stays mounted across these navigations so a
// real CSS transition can dilate it between normal size and post-mode
// (92vw × 92vh). All other routes fall through to ClientRouter's default
// view-transition swap.

import { swapFunctions } from 'astro:transitions/client';

const DUR_DILATE_MS = 760;
const MIN_VIEWPORT_PX = 700;

// <html> classes owned by the inline color-mode script in Default.astro.
// swapRootAttributes would otherwise overwrite them.
const PRESERVED_HTML_CLASSES = ['color-alt', 'color-transitions'];

const SLOTS = [
  '.window-title',
  '.window__body > aside',
  '.window__body > article',
];

const isBlogPath = (p: string) =>
  p === '/blog' || p === '/blog/' || p.startsWith('/blog/');

document.addEventListener('astro:before-swap', (e: any) => {
  if (window.innerWidth < MIN_VIEWPORT_PX) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!isBlogPath(window.location.pathname)) return;
  if (!isBlogPath(new URL(e.to).pathname)) return;
  e.swap = () => blogSwap(e.newDocument);
});

function blogSwap(newDoc: Document) {
  swapHeadAndRoot(newDoc);

  const oldWin = document.querySelector<HTMLElement>('main.window');
  const newWin = newDoc.querySelector<HTMLElement>('main.window');
  if (!oldWin || !newWin) {
    swapFunctions.swapBodyElement(newDoc.body, document.body);
    return;
  }

  const willBePost = newWin.classList.contains('window--post');
  const isDilating = willBePost !== oldWin.classList.contains('window--post');

  // Measure BEFORE swapping slots. Going normal → post, the live .window
  // still has the no-`--post` class (overflow: auto, no explicit height) —
  // once the slots are swapped in, the post body would balloon the window's
  // natural height past the viewport and we'd "shrink" down to 92vh instead
  // of growing up to it.
  const fromW = oldWin.offsetWidth;
  const fromH = oldWin.offsetHeight;
  const { w: toW, h: toH } = isDilating
    ? measureOffscreen(newWin)
    : { w: 0, h: 0 };

  for (const sel of SLOTS) {
    const oldSlot = oldWin.querySelector<HTMLElement>(sel)!;
    const newSlot = newWin.querySelector<HTMLElement>(sel)!;
    swapFunctions.swapBodyElement(newSlot, oldSlot);
  }

  if (isDilating) dilate(oldWin, fromW, fromH, toW, toH);
}

function swapHeadAndRoot(newDoc: Document) {
  const html = document.documentElement;
  const kept = PRESERVED_HTML_CLASSES.filter(c => html.classList.contains(c));

  swapFunctions.deselectScripts(newDoc);
  swapFunctions.swapRootAttributes(newDoc);
  swapFunctions.swapHeadElements(newDoc);

  kept.forEach(c => html.classList.add(c));
}

// Measure an element's rendered dimensions without affecting layout.
function measureOffscreen(el: HTMLElement): { w: number; h: number } {
  const probe = el.cloneNode(true) as HTMLElement;
  probe.style.cssText =
    'position: absolute; left: -99999px; top: 0; visibility: hidden; transition: none;';
  document.body.appendChild(probe);
  const dims = { w: probe.offsetWidth, h: probe.offsetHeight };
  probe.remove();
  return dims;
}

// CSS-driven size transition with pre-measured endpoints. The .window stays
// the same DOM node, so this is just a real CSS transition — no view-
// transition snapshot, no morph.
//
// Why the dance: the browser collapses synchronous style changes into a
// single style recalc, and `height: auto` won't transition. The fix is
// three frames:
//
//   sync:   suppress transition, snap class, lock inline at FROM (numeric).
//   rAF 1:  re-enable transition. No animated property changes yet.
//   rAF 2:  set inline to TO. CSS transition now has a baseline to fire on.
let dilateCleanup: number | null = null;

function dilate(
  win: HTMLElement,
  fromW: number, fromH: number,
  toW: number, toH: number,
) {
  if (dilateCleanup !== null) {
    clearTimeout(dilateCleanup);
    dilateCleanup = null;
  }

  win.style.transition = 'none';
  win.classList.toggle('window--post');
  setSize(win, fromW, fromH);

  requestAnimationFrame(() => {
    win.style.transition = '';
    requestAnimationFrame(() => setSize(win, toW, toH));
  });

  dilateCleanup = window.setTimeout(() => {
    // Hand control back to CSS — the class now matches our target dims.
    win.style.width = '';
    win.style.height = '';
    win.style.maxWidth = '';
    dilateCleanup = null;
  }, DUR_DILATE_MS + 200);
}

function setSize(el: HTMLElement, w: number, h: number) {
  el.style.width = `${w}px`;
  el.style.height = `${h}px`;
  // .window has max-width: 960px in normal mode; pin it to width so the
  // animated width isn't clamped mid-transition when the target exceeds it.
  el.style.maxWidth = `${w}px`;
}

// ─── Post-mode TOC: active-section tracking ─────────────────────────────────
// Lives here, not in PostToc.astro, because /blog → /blog/[slug] navigations
// go through our custom swap and don't re-execute <script> tags inside the
// swapped HTML. A single layout-level listener handles every page-load.
document.addEventListener('astro:page-load', () => {
  const items = document.querySelectorAll<HTMLElement>('.post-toc__item');
  if (!items.length) return;

  const article = document.querySelector<HTMLElement>(
    '.window--post .window__body > article',
  );
  if (!article) return;

  const headings = Array.from(article.querySelectorAll<HTMLElement>('h2[id]'))
    .filter(h => h.parentElement?.tagName.toLowerCase() == 'section');
  if (!headings.length) return;

  let intersecting: Record<string, boolean> = {};

  const observer = new IntersectionObserver(entries => {
    for (let entry of entries) {
      intersecting[entry.target.querySelector('h2[id]')!.id] = entry.intersectionRatio > 0;
    }

    let firstItemHasBeenSet = false;

    items.forEach(item => {
      if (!item.dataset.headingId)
        return;

      let active = false;

      if (!firstItemHasBeenSet && item.dataset.headingId in intersecting && intersecting[item.dataset.headingId]) {
        firstItemHasBeenSet = true;
        active = true;
      }

      item.classList.toggle('active', active);
    });
  }, { root: article });

  headings.forEach(h => observer.observe(h.parentElement!));
  document.addEventListener(
    'astro:before-swap',
    () => observer.disconnect(),
    { once: true },
  );
});
