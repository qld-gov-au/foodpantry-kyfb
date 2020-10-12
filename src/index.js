/* eslint-disable no-unused-vars */
import { FormioWrapper } from './components/formio-wrapper';
import { ButtonGroup } from './components/button-group';
import { TopicsList } from './components/topics-list';

import attachStepHandlers from './scripts/step-handler';

(() => {
  const configuration = {
    formTitle: '',
    storage: localStorage,
    storageName: 'completedTopics',
    formLocation: '',
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
    termsConfig: {
      title: 'terms and conditions',
      termsStorageType: sessionStorage,
      termsStorageName: 'termsAndConditions',
      skipIfTermsAlreadyAccepted: true,
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

    const topicsList = new TopicsList('topics', localStorage);
    const secondaryTopics = new TopicsList('SummaryTopics', localStorage);
  });

  window.addEventListener('kyfb-topic-change', (event) => {
    kyfb.formLocation = event.detail.topic;
    kyfb.formTitle = event.detail.title;
    kyfb.initialise();
    if (event.detail.topic) {
      document.querySelector('#forms').hidden = false;
      document.querySelector('#topics').hidden = true;
      document.querySelector('#home').hidden = true;
    } else {
      document.querySelector('#forms').hidden = true;
      document.querySelector('#topics').hidden = false;
      document.querySelector('#home').hidden = false;
    }
  });
})();
