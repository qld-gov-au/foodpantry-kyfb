/* eslint-disable no-unused-vars */
import { FormioWrapper } from './components/formio-wrapper';
import { ButtonGroup } from './components/button-group';
import { TopicsList } from './components/topics-list';
import { ReapplySelected } from './scripts/reapply-selected';
import { configuration } from './config';
import { Environment } from './environment';

(() => {
  const cssReapplier = new ReapplySelected();
  const environment = new Environment();

  // Overwrite config with environment variables where applicable.
  const config = {};
  Object.keys(configuration).forEach((key) => {
    config[key] = { ...configuration[key], ...environment[key] };
  });

  const kyfb = new FormioWrapper(config);
  window.formEnv = environment.flag;

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
      sectionNav.innerHTML = '<ul><li><a class="active" href="#">KYFB</li></ul>';
    } else {
      sectionNav = navigationSection.querySelector('ul > li > a.active')
        .parentElement;
      navigationSection.querySelector('ul > li > a.active').classList
        .add('opened');
    }

    const unorderdList = document.createElement('ol');
    unorderdList.classList.add('kyfb', 'guide-sub-nav');
    sectionNav.appendChild(unorderdList);
    const sectionNavTarget = sectionNav.querySelector('ol');

    const sectionNavigation = new ButtonGroup(sectionNavTarget, 'navigation');
    const bg = new ButtonGroup(document.querySelector('.button-container'));

    const topicsList = new TopicsList(
      'topics',
      localStorage,
    );

    const secondaryTopics = new TopicsList(
      'SummaryTopics',
      localStorage,
    );
  });

  let firstInit = true;

  window.addEventListener('kyfb-topic-change', (event) => {
    if (kyfb.wizard) {
      if (kyfb.wizard.data && kyfb.wizard.data.topicName) {
        kyfb.wizard.data.topicName = event.detail.title;
      }

      // if (kyfb.wizard._seenPages) {
      //   kyfb.wizard._seenPages = [];
      // }
      //
      // if (kyfb.wizard.page) {
      //   kyfb.wizard.page = 0;
      // }
    }

    kyfb.config.form.location = event.detail.topic;
    kyfb.config.form.baseLocation = event.detail.base;
    kyfb.config.form.title = event.detail.title;
    kyfb.lastNavigation = null;

    kyfb.initialise(firstInit);
    // kyfb.populateDataFromStorageTrigger();
    firstInit = false;
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
    kyfb.lastNavigation = null;
    kyfb.initialise();
    document.querySelector('#forms').hidden = true;
    document.querySelector('#topics').hidden = false;
    document.querySelector('#home').hidden = false;
    document.querySelector('.guide-sub-nav').hidden = true;
  });

  window.dataLayer = window.dataLayer || [];
  window.addEventListener('formioWrapperTracking', (event) => {
    const { form } = event.detail;
    const { change } = event.detail;
    if (!form.changed) return;
    if (typeof form.changed.component === 'object') {
      const { title } = change.changed.instance.root._form || '';
      const { modified } = change.changed.instance.root._form || '';
      window.dataLayer.push({
        event: 'formio-interaction',
        'formio-name': title,
        'formio-input-id': change.changed.component.id,
        'formio-input-type': change.changed.component.type,
        'formio-input-value': change.changed.value,
        'formio-input-key': change.changed.component.key,
        'formio-input-label-raw': change.changed.component.label,
        'formio-version': modified,
        'formio-category': `Form: ${title}`,
        'formio-action': 'filled in',
      });
    }
  });

  window.addEventListener('formioNewPageRender', (event) => {
    // automated email on summary
    if (event.detail.page === 3) {
      const newEvent = new CustomEvent('formiowrapperSendAdminEmail', {
        bubbles: true,
      });
      window.dispatchEvent(newEvent);
    }
  });

  const mutationObserver = new MutationObserver(() => {
    // apply styles against to any radio's
    cssReapplier.reapply(['radio']);
  });

  mutationObserver.observe(
    document.querySelector(configuration.form.selector),
    { childList: true, subtree: true },
  );
})();
