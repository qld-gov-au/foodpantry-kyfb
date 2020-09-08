/* eslint-disable no-unused-vars */
import { SectionNavigation } from './components/section-navigation';

(() => {
  // const lb = new LabelBuster();
  // const bg = new ButtonGroup(document.querySelector('.button-container'));

  /* Remove Squiz default H1 */
  window.addEventListener('DOMContentLoaded', () => {
    const pageHeader = document.querySelector('#qg-primary-content');
    if (pageHeader) {
      pageHeader.removeChild(document.querySelector('h1'));
    }

    let sectionNav = document.querySelector('#qg-section-nav');
    if (!sectionNav) {
      sectionNav = document.querySelector('#formnav');
      sectionNav.display = 'block';
    }
    const sectionNavTarget = sectionNav.querySelector('ul');
    const sectionNavigation = new SectionNavigation(sectionNavTarget);
  });
})();
