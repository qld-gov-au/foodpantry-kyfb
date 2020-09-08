/* eslint-disable no-unused-vars */

(() => {
  // const lb = new LabelBuster();
  // const bg = new ButtonGroup(document.querySelector('.button-container'));

  /* Remove Squiz default H1 */
  window.addEventListener('DOMContentLoaded', () => {
    const pageHeader = document.querySelector('#qg-primary-content');
    if (pageHeader) {
      pageHeader.removeChild(document.querySelector('h1'));
    }
  });
})();
