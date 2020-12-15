/* eslint-disable no-undef */
import createRegionalizer from '../../index';

jest.mock('../../lib/viewManager', () => ({
  __esModule: true,
  default: () => ({
    insertView: jest.fn()
  })
}));

const regionalizer = createRegionalizer({ foo: 'bar' });

test('Should return a regionalizer object with the wanted properties', () => {
  expect(regionalizer).toHaveProperty('init');
  expect(regionalizer).toHaveProperty('changeView');
});

test('Should initialize regionalizer without an error to be thrown', () => {
  expect(() => { regionalizer.init(); }).not.toThrow();
});

test('Should change view and resolve', () => {
  expect(regionalizer.changeView()).resolves.toBe();
});

test('Should handle in-app and outbound link clicks', () => {
  document.body.innerHTML = `
  <a id="foo1" href="/foo1"></a>
  <a href="/foo2">
    <div id="foo2"></div>
  </a>
  <a id="bar1" href="/bar1" target="_blank"></a>
  <a id="bar2" href="https://www.example.com"></a>
  `;
  regionalizer.init();

  // Add a variable to check whether the event has been fired.
  let eventHasOccured = false;
  window.addEventListener('regionalizer.inAppNavigation', () => {
    eventHasOccured = true;
  });

  // Test the flat link.
  document.getElementById('foo1').click();
  expect(eventHasOccured).toBe(true);

  // Reset eventHasOccured and test the element wrapped by a link.
  eventHasOccured = false;
  document.getElementById('foo2').click();
  expect(eventHasOccured).toBe(true);

  // Reset eventHasOccured and test the link which opens a new tab.
  eventHasOccured = false;
  document.getElementById('bar1').click();
  expect(eventHasOccured).toBe(false);

  // Reset eventHasOccured and test the link to another website.
  eventHasOccured = false;
  document.getElementById('bar2').click();
  expect(eventHasOccured).toBe(false);
});
