/**
 * @class LabelBuster
 */
const formLocation =
  'https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd/formwizardkyfb';
// eslint-disable-next-line import/prefer-default-export
export class LabelBuster {
  /**
   * @param {Boolean} test if we are running a test
   * @returns {void}
   */
  constructor(test = false) {
    this.formLocation = formLocation;
    this.formElement = {};
    this.formSettings = {
      buttonSettings: {
        showCancel: false,
        showPrevious: false,
        showNext: false,
        showSubmit: false,
      },
    };
    this.wizard = {};
    this.loaded = false;
    this.isTest = test;

    window.addEventListener('DOMContentLoaded', () => {
      if (this.isTest) return;
      this.initialise();
    });

    window.addEventListener('labelbusterGoToNext', () => {
      this.goToNextPage();
    });

    window.addEventListener('labelbusterAccept', () => {
      this.acceptEvent();
    });

    window.addEventListener('labelbusterGoToPrevious', () => {
      this.goToPreviousPage();
    });

    window.addEventListener('labelbusterCancel', () => {
      this.goToPage(0);
    });
  }

  /**
   */
  initialise() {
    this.formElement = document.querySelector('#formio');
    // listens for terms and conditions selection
    this.formElement.addEventListener('click', (e) => {
      if (e.target.name === 'data[termsAndConditions]') {
        this.firePageChangeEvent();
      }
    });
    Formio.createForm(
      this.formElement,
      this.formLocation,
      this.formSettings
    ).then((wizard) => {
      this.wizard = wizard;
      this.loaded = true;
    });
    this.firePageChangeEvent();
  }

  /**
   * @returns {void}
   */
  firePageChangeEvent() {
    const event = new CustomEvent('labelbusterPageChange', {
      bubbles: true,
      detail: {
        page: this.wizard && this.wizard.page ? this.wizard.page : 0,
        hasAccepted: this.hasAccepted(),
      },
    });
    window.dispatchEvent(event);
  }

  /**
   * @return {Boolean}
   */
  goToNextPage() {
    if (!this.loaded) {
      this.notLoaded();
      return false;
    }
    if (this.isTest) {
      return true;
    }
    this.wizard.nextPage().then(() => {
      this.firePageChangeEvent();
    });
    return true;
  }

  /**
   * @return {Boolean}
   */
  acceptEvent() {
    if (!this.loaded) {
      this.notLoaded();
      return false;
    }
    if (!this.hasAccepted()) return false;
    if (this.isTest) {
      return true;
    }
    this.wizard.nextPage().then(() => {
      this.firePageChangeEvent();
    });
    return true;
  }

  /**
   * @return {Boolean}
   */
  hasAccepted() {
    if (this.wizard && this.wizard._data) {
      return this.wizard._data.termsAndConditions;
    }
    return false;
  }

  /**
   * @return {Boolean}
   */
  goToPreviousPage() {
    if (!this.loaded) {
      this.notLoaded();
      return false;
    }
    if (this.isTest) {
      return true;
    }
    this.wizard.prevPage().then(() => {
      this.firePageChangeEvent();
    });
    return true;
  }

  /**
   * @param {Number} pageNo the page number provided by the wizard instance
   * @return {Boolean}
   */
  goToPage(pageNo) {
    if (!this.loaded) {
      this.notLoaded();
      return false;
    }
    if (this.isTest) {
      return true;
    }
    this.wizard.setPage(pageNo).then(() => {
      this.firePageChangeEvent();
    });
    return true;
  }

  notLoaded() {
    const errorObject = {
      element: this.formElement,
      loaded: this.loaded,
      settings: this.settings,
      name: 'Loaded Exception',
      message: 'FormIO not properly loaded',
    };

    throw errorObject;
  }
}

window.label = new LabelBuster();
