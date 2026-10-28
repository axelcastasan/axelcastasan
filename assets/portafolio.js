// Conserva los controles nativos de teclado y el contenido accesible sin JavaScript.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

for (const section of document.querySelectorAll('details')) {
  const summary = section.querySelector(':scope > summary');
  let animation;
  let expanded = section.open;

  summary.addEventListener('click', (event) => {
    event.preventDefault();
    const start = section.getBoundingClientRect().height;
    animation?.cancel();
    expanded = !expanded;
    if (reducedMotion.matches || !section.animate) {
      section.open = expanded;
      return;
    }
    section.open = true;
    const end = expanded ? section.getBoundingClientRect().height : summary.getBoundingClientRect().height;
    animation = section.animate({ height: [`${start}px`, `${end}px`] }, {
      duration: 240,
      easing: 'cubic-bezier(.2,.65,.3,1)',
    });
    animation.onfinish = () => {
      section.open = expanded;
      animation = undefined;
    };
  });

  section.addEventListener('toggle', () => {
    if (!animation) expanded = section.open;
  });
  section.addEventListener('reveal', () => {
    animation?.cancel();
    animation = undefined;
    expanded = true;
    section.open = true;
  });
}

function revealHash() {
  const id = location.hash.slice(1);
  const target = document.getElementById(id);
  let section = target?.closest('details');
  while (section) {
    section.dispatchEvent(new Event('reveal'));
    section = section.parentElement.closest('details');
  }
  target?.scrollIntoView({ block: 'start' });
}

window.addEventListener('hashchange', revealHash);
for (const link of document.querySelectorAll('nav a[href^="#"]')) {
  link.addEventListener('click', () => {
    if (link.hash === location.hash) revealHash();
  });
}
revealHash();
