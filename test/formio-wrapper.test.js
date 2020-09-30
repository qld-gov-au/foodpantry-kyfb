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

    wrapper = new FormioWrapper(configuration);
  });

  it('wrapper is initialised', async () => {
    expect(wrapper).to.be.ok;
    expect(wrapper.buttonCSS.baseClass).equals('qg-btn');
    expect(wrapper.buttonCSS.cancel).equals('btn-link');
    expect(wrapper.buttonCSS.next).equals('btn-primary');
    expect(wrapper.buttonCSS.previous).equals('btn-default');
    expect(wrapper.buttonConfig.acceptWhenTermsFound).equals(true);
    expect(wrapper.buttonConfig.startOnFirst).equals(true);
    expect(typeof wrapper.formElement).equals('object');
    expect(typeof wrapper.formLocation).equals('string');
    expect(wrapper.formLocation).equals(
      'https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd/formwizard',
    );
    expect(wrapper.formSettings.buttonSettings.showCancel).equals(false);
    expect(wrapper.formSettings.buttonSettings.showNext).equals(false);
    expect(wrapper.formSettings.buttonSettings.showPrevious).equals(false);
    expect(wrapper.formSettings.buttonSettings.showSubmit).equals(false);
    expect(wrapper.loaded).equals(false);
    expect(wrapper.navigationCSS.baseClass).equals('qg-btn btn-link');
    expect(wrapper.scrollTarget).equals(0);
    expect(typeof wrapper.wizard).equals('object');
  });

  it('function initialise works', async () => {
    wrapper.initialise();
    try {
      const event = new CustomEvent('DOMContentLoaded', {
        bubbles: true,
      });
      window.dispatchEvent(event);
    } catch (e) {
      expect(false).equals(true);
    }
    expect(true).equals(true);
  });

  it('Not loaded throws exception', async () => {
    try {
      wrapper.notLoaded();
    } catch (e) {
      expect(typeof e).equals('object');
      expect(e.name).equals('Loaded Exception');
    }
  });

  it('scroll to top works', async () => {
    const scroll = spy(window, 'scroll');
    wrapper.scrollToTop();
    scroll.restore();
    assert.calledOnce(scroll);
  });

  it('_gotoPage function throws an error when loaded is false', async () => {
    wrapper.loaded = false;
    try {
      wrapper._goToPage(0);
    } catch (e) {
      expect(typeof e).equals('object');
    }
  });

  it('_gotoPage triggers the right wizard function', async () => {
    wrapper.loaded = true;
    wrapper.wizard.setPage = () => {};
    const spied = spy(wrapper.wizard, 'setPage');
    wrapper._goToPage(0);
    spied.restore();
    assert.calledOnce(spied);
  });

  it('_goToPreviousPage function throws an error when loaded is false', async () => {
    wrapper.loaded = false;
    try {
      wrapper._goToPreviousPage();
    } catch (e) {
      expect(typeof e).equals('object');
    }
  });

  it('_goToPreviousPage triggers the right wizard function', async () => {
    wrapper.loaded = true;
    wrapper.wizard.prevPage = () => {};
    const spied = spy(wrapper.wizard, 'prevPage');
    wrapper._goToPreviousPage();
    spied.restore();
    assert.calledOnce(spied);
  });

  it('_gotoNextPage function throws an error when loaded is false', async () => {
    wrapper.loaded = false;
    try {
      wrapper._goToNextPage();
    } catch (e) {
      expect(typeof e).equals('object');
    }
  });

  it('_goToNextPage triggers the right wizard function', async () => {
    wrapper.loaded = true;
    wrapper.wizard.nextPage = () => {};
    const spied = spy(wrapper.wizard, 'nextPage');
    wrapper._goToNextPage();
    spied.restore();
    assert.calledOnce(spied);
  });

  it('check page validity uses formio validity', async () => {
    const response = wrapper._checkPageValidity(-1, [], {});
    expect(response).equals(false);
    const checkPageValidity = () => true;

    const pages = [
      {
        checkValidity: checkPageValidity,
      },
      {
        checkValidity: checkPageValidity,
      },
    ];
    const spied = spy(pages[1], 'checkValidity');
    wrapper._checkPageValidity(1, pages, {});
    spied.restore();
    assert.calledOnce(spied);
  });

  it('determine title page functioning correctly', async () => {
    wrapper.buttonConfig.acceptWhenTermsFound = false;
    const failure = wrapper._determineTitleChange('does not matter');
    expect(failure).equals(false);
    wrapper.buttonConfig.acceptWhenTermsFound = true;
    const success = wrapper._determineTitleChange('terms and conditions');
    expect(success).equals(true);
  });

  it('page change event is fired as expected', async () => {
    const stubbedMenu = stub(wrapper, 'buildProgressMenuData');
    const stubbedButtons = stub(wrapper, 'buildButtonData');
    const stubbedFire = stub(window, 'dispatchEvent');
    wrapper._firePageChangeEvent();
    stubbedMenu.restore;
    stubbedButtons.restore;
    stubbedFire.restore;
    assert.calledOnce(stubbedMenu);
    assert.calledOnce(stubbedButtons);
    assert.calledOnce(stubbedFire);
  });

  it('button data works as anticipated', async () => {
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
      {
        component: {
          title: 'something',
        },
      },
    ];

    const stubbedValidity = stub(wrapper, '_checkPageValidity').returns(true);
    wrapper.wizard.page = 1;
    const validResponse = wrapper.buildButtonData();
    expect(typeof validResponse).equals('object');
    expect(validResponse.length).equals(3);
    expect(validResponse[0].title).equals('Previous');
    expect(validResponse[0].event).equals('formiowrapperGoToPrevious');
    expect(validResponse[0].cssClass).equals('qg-btn btn-default');
    expect(validResponse[0].disabled).equals(false);
    expect(validResponse[0].displayed).equals(true);
    expect(validResponse[0].visited).equals(false);

    expect(validResponse[1].title).equals('Accept');
    expect(validResponse[1].event).equals('formiowrapperGoToNext');
    expect(validResponse[1].cssClass).equals('qg-btn btn-primary');
    expect(validResponse[1].disabled).equals(false);
    expect(validResponse[1].displayed).equals(true);
    expect(validResponse[1].visited).equals(false);

    expect(validResponse[2].title).equals('Cancel');
    expect(validResponse[2].event).equals('formiowrapperCancel');
    expect(validResponse[2].cssClass).equals('qg-btn btn-link');
    expect(validResponse[2].disabled).equals(false);
    expect(validResponse[2].displayed).equals(true);
    expect(validResponse[2].visited).equals(false);

    wrapper.wizard.page = 0;
    const firstResponse = wrapper.buildButtonData();
    expect(typeof firstResponse).equals('object');
    expect(firstResponse.length).equals(3);

    expect(firstResponse[0].title).equals('Previous');
    expect(firstResponse[0].displayed).equals(false);

    expect(firstResponse[1].title).equals('Start');
    expect(firstResponse[1].displayed).equals(true);

    expect(firstResponse[2].title).equals('Cancel');
    expect(firstResponse[2].disabled).equals(false);

    wrapper.wizard.page = 2;
    const lastResponse = wrapper.buildButtonData();
    expect(typeof lastResponse).equals('object');
    expect(lastResponse.length).equals(3);

    expect(lastResponse[0].title).equals('Previous');
    expect(lastResponse[0].displayed).equals(true);

    expect(lastResponse[1].title).equals('Next');
    expect(lastResponse[1].displayed).equals(false);

    expect(lastResponse[2].title).equals('Cancel');
    expect(lastResponse[2].displayed).equals(true);

    wrapper.buttonConfig.startOnFirst = false;
    wrapper.wizard.page = 0;
    const notStart = wrapper.buildButtonData();
    expect(typeof notStart).equals('object');
    expect(notStart.length).equals(3);

    expect(notStart[1].title).equals('Next');
    expect(notStart[1].displayed).equals(true);
    wrapper.buttonConfig.startOnFirst = true;
    stubbedValidity.restore();
  });

  it('buildProgressMenuData works as anticipated', async () => {
    const stubbedValidity = stub(wrapper, '_checkPageValidity').returns(true);
    wrapper.wizard.page = 1;
    const badProgresss = wrapper.buildProgressMenuData();
    expect(badProgresss.length).equals(0);

    wrapper.wizard.components = [
      {
        component: {
          title: 'First Page',
        },
      },
      {
        component: {
          title: 'terms and conditions',
        },
      },
      {
        component: {
          title: 'something',
        },
      },
    ];
    wrapper.wizard._seenPages = [0, 1];

    const initialProgressBar = wrapper.buildProgressMenuData();
    expect(initialProgressBar.length).equals(3);
    expect(initialProgressBar[0].cssClass).includes('qg-btn btn-link');
    expect(typeof initialProgressBar[0].detail).equals('object');
    expect(initialProgressBar[0].title).equals('First Page');
    expect(initialProgressBar[0].event).equals('goToPage');
    expect(initialProgressBar[0].disabled).equals(false);
    expect(initialProgressBar[0].displayed).equals(true);

    expect(initialProgressBar[1].cssClass).includes('qg-btn btn-link');
    expect(initialProgressBar[1].cssClass).includes('active');
    expect(initialProgressBar[1].cssClass).includes('visited');
    expect(typeof initialProgressBar[1].detail).equals('object');
    expect(initialProgressBar[1].title).equals('terms and conditions');
    expect(initialProgressBar[1].event).equals('goToPage');
    expect(initialProgressBar[1].disabled).equals(false);
    expect(initialProgressBar[1].displayed).equals(true);

    expect(initialProgressBar[2].cssClass).includes('qg-btn btn-link');
    expect(typeof initialProgressBar[2].detail).equals('object');
    expect(initialProgressBar[2].title).equals('something');
    expect(initialProgressBar[2].event).equals('goToPage');
    expect(initialProgressBar[2].disabled).equals(true);
    expect(initialProgressBar[2].displayed).equals(true);
    stubbedValidity.restore();
  });

  afterEach(async () => {
    element = null;
    window.Formio = null;
    configuration = null;
    wrapper = null;
  });
});
