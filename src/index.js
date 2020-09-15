/* eslint-disable no-unused-vars */
import { LabelBuster } from './components/label-buster';
import { ButtonGroup } from './components/button-group';
import { SectionNavigation } from './components/section-navigation';
import attachStepHandlers from './scripts/step-handler';

(() => {
  const lb = new LabelBuster();
  const bg = new ButtonGroup(document.querySelector('.button-container'));
  attachStepHandlers();
  /* Remove Squiz default H1 */
  window.addEventListener('DOMContentLoaded', () => {
    const pageHeader = document.querySelector('#qg-primary-content');
    if (pageHeader) {
      pageHeader.removeChild(document.querySelector('h1'));
    }
    let sectionNav = document.querySelector(
      '#qg-section-nav > ul > li:nth-child(2)'
    );
    if (!sectionNav) {
      sectionNav = document.querySelector('#formnav');
      sectionNav.display = 'block';
    }

    const unorderdList = document.createElement('ul');
    unorderdList.classList = 'lb';
    sectionNav.appendChild(unorderdList);
    const sectionNavTarget = sectionNav.querySelector('ul');

    const sectionNavigation = new SectionNavigation(sectionNavTarget);
  });
})();
