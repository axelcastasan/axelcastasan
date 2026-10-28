const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function setup(reduced = false, hash = '') {
  const events = {};
  const animations = [];
  const summary = { addEventListener: (type, callback) => events[type] = callback, getBoundingClientRect: () => ({ height: 40 }) };
  const section = {
    open: false,
    querySelector: () => summary,
    getBoundingClientRect: () => ({ height: section.open ? 200 : 40 }),
    animate: (frames, options) => {
      const animation = { frames, options, cancel() { this.cancelled = true; } };
      animations.push(animation);
      return animation;
    },
    addEventListener: (type, callback) => events[type] = callback,
    closest: () => section,
    parentElement: { closest: () => null },
    scrollIntoView() { this.scrolled = true; },
  };
  vm.runInNewContext(readFileSync(require('node:path').join(__dirname, '../assets/portafolio.js'), 'utf8'), {
    window: { matchMedia: () => ({ matches: reduced }), addEventListener() {} },
    document: { querySelectorAll: () => [section], getElementById: id => id === 'proyectos' ? section : null },
    location: { hash },
  });
  return { section, animations, click: () => events.click({ preventDefault() {} }) };
}

test('abre y cierra con animación; conserva el contenido hasta terminar el cierre', () => {
  const ui = setup();
  ui.click();
  assert.equal(ui.section.open, true);
  assert.equal(ui.animations[0].options.duration, 240);
  ui.animations[0].onfinish();
  ui.click();
  assert.equal(ui.section.open, true);
  ui.animations[1].onfinish();
  assert.equal(ui.section.open, false);
});

test('invierte una apertura en curso y cancela la animación anterior', () => {
  const ui = setup();
  ui.click();
  ui.click();
  assert.equal(ui.animations[0].cancelled, true);
  ui.animations[1].onfinish();
  assert.equal(ui.section.open, false);
});

test('reducir movimiento omite la animación', () => {
  const ui = setup(true);
  ui.click();
  assert.equal(ui.section.open, true);
  ui.click();
  assert.equal(ui.section.open, false);
  assert.equal(ui.animations.length, 0);
});

test('un enlace directo abre la sección y la muestra', () => {
  const ui = setup(false, '#proyectos');
  assert.equal(ui.section.open, true);
  assert.equal(ui.section.scrolled, true);
});
