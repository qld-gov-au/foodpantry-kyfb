/* eslint-disable no-unused-vars */
import 'whatwg-fetch';
import { FormioWrapper } from './components/formio-wrapper';
import { ButtonGroup } from './components/button-group';
import { TopicsList } from './components/topics-list';
import { ReapplySelected } from './scripts/reapply-selected';

(() => {
  const configuration = {
    formTitle: '',
    storage: localStorage,
    storageName: 'completedTopics',
    formLocation: '',
    stageLocation: 'https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd',
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
    scrollType: 'auto',
    buttonConfig: {
      startOnFirst: true,
      hideCancelOnFirst: false,
      acceptWhenTermsFound: true,
    },
    termsConfig: {
      title: 'terms of use',
      termsStorageType: sessionStorage,
      termsStorageName: 'termsAndConditions',
      skipIfTermsAlreadyAccepted: true,
      dataName: 'termsAndConditions',
    },
    navigationCSS: {
      baseClass: 'qg-btn btn-link',
    },
    extraTriggersOnActions: {
      cancel: 'cancelKYFBForm',
    },
    submissionInfo: {
      formName: 'kyfbpdf',
    },
    formAdminEmail: 'jordan.binskin.cfa@smartservice.qld.gov.au',
  };

  const cssReapplier = new ReapplySelected();

  const kyfb = new FormioWrapper(configuration);
  const bg = new ButtonGroup(document.querySelector('.button-container'));

  window.addEventListener('DOMContentLoaded', () => {
    /* Remove Squiz default H1 */
    const pageHeader = document.querySelector('#qg-primary-content');
    if (pageHeader) {
      pageHeader.removeChild(document.querySelector('h1'));
    }

    const navigationSection = document.querySelector('#qg-section-nav');
    let sectionNav;
    if (!navigationSection) {
      sectionNav = document.createElement('div');
      sectionNav.id = 'qg-section-nav';
      document.body.appendChild(sectionNav);
      sectionNav = document.querySelector('#qg-section-nav');
    } else {
      sectionNav = navigationSection.querySelector('ul > li > a.active')
        .parentElement;
    }
    const unorderdList = document.createElement('ol');
    unorderdList.classList = 'kyfb guide-sub-nav';
    sectionNav.appendChild(unorderdList);
    const sectionNavTarget = sectionNav.querySelector('ol');

    const sectionNavigation = new ButtonGroup(sectionNavTarget, 'navigation');

    const topicsList = new TopicsList(
      'topics',
      localStorage,
      configuration.stageLocation,
    );
    const secondaryTopics = new TopicsList(
      'SummaryTopics',
      localStorage,
      configuration.stageLocation,
    );
  });

  window.addEventListener('kyfb-topic-change', (event) => {
    kyfb.formLocation = event.detail.topic;
    kyfb.formTitle = event.detail.title;
    kyfb.initialise();
    if (event.detail.topic) {
      document.querySelector('#forms').hidden = false;
      document.querySelector('#topics').hidden = true;
      document.querySelector('#home').hidden = true;
      document.querySelector('.guide-sub-nav').hidden = false;
    } else {
      document.querySelector('#forms').hidden = true;
      document.querySelector('#topics').hidden = false;
      document.querySelector('#home').hidden = false;
      document.querySelector('.guide-sub-nav').hidden = true;
    }
  });

  window.addEventListener('cancelKYFBForm', (event) => {
    kyfb.formLocation = '';
    kyfb.formTitle = '';
    kyfb.initialise();
    document.querySelector('#forms').hidden = true;
    document.querySelector('#topics').hidden = false;
    document.querySelector('#home').hidden = false;
    document.querySelector('.guide-sub-nav').hidden = true;
  });

  window.addEventListener('formiowrapperPageChange', (event) => {
    cssReapplier.reapply(['radio']);
  });
})();
