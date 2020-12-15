/* eslint-disable no-undef */
import { getAnchor, htmlToElement } from '../../lib/utility';

test('Should get the anchor elements', () => {
  // Start directly with the anchor.
  const anchor = document.createElement('a');
  expect(getAnchor(anchor)).toBe(anchor);

  // Start with a child element of the anchor.
  const child = document.createElement('span');
  anchor.appendChild(child);
  expect(getAnchor(child)).toBe(anchor);
});

test('Should not find an anchor element', () => {
  const wrappers = '<div id="foo"><p></p></div>';
  document.querySelector('body').innerHTML = wrappers;
  const startElement = document.querySelector('#foo');
  expect(getAnchor(startElement)).toBe(null);
});

test('Should return a DOM Element (DocumentFragment)', () => {
  const markup = '<div class="foo"><p>bar</p></div>';
  expect(htmlToElement(markup)).toBeInstanceOf(DocumentFragment);
});
