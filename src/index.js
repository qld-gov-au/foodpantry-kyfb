/* eslint-disable no-unused-vars */
import { LabelBuster } from './components/label-buster';
import { ButtonGroup } from './components/button-group';
import { SectionNavigation } from './components/section-navigation';
import buttonNav from './scripts/button-nav';

(() => {
  const lb = new LabelBuster();
  const bg = new ButtonGroup(document.querySelector('.button-container'));
  buttonNav();
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
