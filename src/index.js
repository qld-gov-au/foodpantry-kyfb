/* eslint-disable no-unused-vars */
import { FormioWrapper } from './components/formio-wrapper';
import { ButtonGroup } from './components/button-group';
import { TopicsList } from './components/topics-list';
import { ReapplySelected } from './scripts/reapply-selected';
import { configuration } from './config';

(() => {
  const cssReapplier = new ReapplySelected();
  const kyfb = new FormioWrapper(configuration);

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
      configuration.stageLocation,
    );

    const secondaryTopics = new TopicsList(
      'SummaryTopics',
      localStorage,
      configuration.stageLocation,
    );
  });

  let firstInit = true;

  window.addEventListener('kyfb-topic-change', (event) => {
    kyfb.config.form.location = event.detail.topic;
    kyfb.config.form.baseLocation = event.detail.base;
    kyfb.config.form.title = event.detail.title;

    kyfb.initialise(firstInit);
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
    kyfb.initialise();
    document.querySelector('#forms').hidden = true;
    document.querySelector('#topics').hidden = false;
    document.querySelector('#home').hidden = false;
    document.querySelector('.guide-sub-nav').hidden = true;
  });

  window.addEventListener('formioNewPageRender', (event) => {
    // apply styles against to any radio's
    cssReapplier.reapply(['radio']);

    // automated email on summary
    if (event.detail.page === 3) {
      const newEvent = new CustomEvent('formiowrapperSendAdminEmail', {
        bubbles: true,
      });
      window.dispatchEvent(newEvent);
    }
  });
})();
