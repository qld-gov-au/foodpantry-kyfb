/* eslint-disable */

import { fixture, html, expect, oneEvent } from '@open-wc/testing';
import { stub, spy, assert } from 'sinon';
import { FormioWrapper } from '../src/components/formio-wrapper';

describe('Formio Wrapper Tests.', () => {
  let wrapper = {};
  let element;
  let configuration;
  beforeEach(async () => {
    element = await fixture(html` <div id="formio"></div> `);
    window.Formio = {};
    Formio.createForm = () => {};
    stub(window.Formio, 'createForm').resolves();
    Formio.wizard = {};
    Formio._data = {};

    configuration = {
      formLocation:
        'https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd/formwizard',
      storage: localStorage,
      storageName: 'completedTopics',
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
        hideCancelOnFirst: true,
        acceptWhenTermsFound: true,
      },
      termsConfig: {
        title: 'terms and conditions',
        termsStorageType: sessionStorage,
        termsStorageName: 'termsAndConditions',
        dataName: 'termsAndConditions',
        skipIfTermsAlreadyAccepted: false,
      },
      extraTriggersOnActions: {},
      navigationCSS: {
        baseClass: 'qg-btn btn-link',
      },
      submissionInfo: {
        projectID: '5f44969319d1a97a819d80a7',
        formID: '5f8f7e6c8095d22a27f6a03a',
      },
    };

    wrapper = new FormioWrapper(configuration);
  });

  it('_addListeners works as intended', async () => {
    wrapper.loaded = true;

    wrapper.wizard.page = 1;
    wrapper.wizard.pages = [
      {
        component: {
          title: 'something',
        },
      },
      {
        component: {
          title: 'terms and conditions',
        },
      },
    ];
    wrapper.wizard.nextPage = () => {};
    wrapper.wizard.prevPage = () => {};
    wrapper.wizard.setPage = () => {};

    const spiedInitialise = spy(wrapper, 'initialise');
    const spiedGoToNext = spy(wrapper, '_goToNextPage');
    const spiedFireExtraEvent = spy(wrapper, '_fireExtraEvent');
    const spiedGoToPreviousPage = spy(wrapper, '_goToPreviousPage');
    const spiedGoToPage = spy(wrapper, '_goToPage');

    wrapper._addListeners(element);
    element.dispatchEvent(new CustomEvent('DOMContentLoaded'));
    element.dispatchEvent(new CustomEvent('formiowrapperGoToNext'));
    element.dispatchEvent(new CustomEvent('formiowrapperGoToPrevious'));
    // element.dispatchEvent(new CustomEvent('goToPage', {
    //   bubbles: true,
    //   detail: {page: 1},
    // }));
    element.dispatchEvent(new CustomEvent('formiowrapperCancel'));

    spiedInitialise.restore();
    spiedGoToNext.restore();
    spiedFireExtraEvent.restore();
    spiedGoToPreviousPage.restore();
    spiedGoToPage.restore();

    assert.calledOnce(spiedInitialise);
    assert.calledOnce(spiedGoToNext);
    assert.notCalled(spiedFireExtraEvent);
    assert.calledOnce(spiedGoToPreviousPage);
    assert.calledOnce(spiedGoToPage);
  });

  it('_addListeners gotopage', async () => {
    wrapper.loaded = true;
    wrapper.wizard.page = 1;
    wrapper.wizard.pages = [
      {
        component: {
          title: 'something',
        },
      },
      {
        component: {
          title: 'terms and conditions',
        },
      },
    ];
    wrapper.wizard.nextPage = () => {};
    wrapper.wizard.prevPage = () => {};
    wrapper.wizard.setPage = () => {};

    const spiedGoToPage = spy(wrapper, '_goToPage');

    wrapper._addListeners(element);
    element.dispatchEvent(
      new CustomEvent('goToPage', {
        bubbles: true,
        detail: { page: 1 },
      }),
    );

    spiedGoToPage.restore();

    assert.calledTwice(spiedGoToPage);
  });

  afterEach(async () => {
    element = null;
    window.Formio = null;
    configuration = null;
    wrapper = null;
  });
});
