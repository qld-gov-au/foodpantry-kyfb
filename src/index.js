/* eslint-disable no-unused-vars */
import { FormioWrapper } from './components/formio-wrapper';
import { ButtonGroup } from './components/button-group';
import attachStepHandlers from './scripts/step-handler';

(() => {
  const configuration = {
    formLocation: 'https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd/kyfb',
    formSettings: {
      buttonSettings: {
        showCancel: false,
        showPrevious: false,
        showNext: false,
        showSubmit: false,
      },
    },
    buttonCSS: {
      baseClass: 'qg-btn',
      previous: 'btn-default',
      next: 'btn-primary',
      cancel: 'btn-link',
    },
    scrollTarget: 0,
    buttonConfig: {
      startOnFirst: true,
      acceptWhenTermsFound: true,
    },
    navigationCSS: {
      baseClass: 'qg-btn btn-link',
    },
  };

  const kyfb = new FormioWrapper(configuration);
  const bg = new ButtonGroup(document.querySelector('.button-container'));
  attachStepHandlers();

  window.addEventListener('DOMContentLoaded', () => {
    /* Remove Squiz default H1 */
    const pageHeader = document.querySelector('#qg-primary-content');
    if (pageHeader) {
      pageHeader.removeChild(document.querySelector('h1'));
    }

    let sectionNav = document.querySelector(
      '#qg-section-nav > ul > li:nth-child(1)',
    );
    if (!sectionNav) {
      sectionNav = document.querySelector('#formnav');
      sectionNav.display = 'block';
    }

    const unorderdList = document.createElement('ol');
    unorderdList.classList = 'kyfb guide-sub-nav';
    sectionNav.appendChild(unorderdList);
    const sectionNavTarget = sectionNav.querySelector('ol');

    const sectionNavigation = new ButtonGroup(sectionNavTarget, 'navigation');
  });
})();
