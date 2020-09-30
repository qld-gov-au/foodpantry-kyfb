/**
 * @class FormioWrapper
 */
export class FormioWrapper {
  /**
   * @param {Object} configuration the configuration object
   * @returns {void}
   */
  constructor(configuration) {
    this.formLocation = configuration.formLocation;
    this.buttonCSS = configuration.buttonCSS;
    this.navigationCSS = configuration.navigationCSS;
    this.scrollTarget = configuration.scrollTarget;
    this.formSettings = configuration.formSettings;
    this.buttonConfig = {
      startOnFirst: true,
      acceptWhenTermsFound: true,
    };

    this.formElement = {};

    this.wizard = {};
    this.loaded = false;

    window.addEventListener('DOMContentLoaded', () => {
      this.initialise();
    });

    window.addEventListener('formiowrapperGoToNext', () => {
      this._goToNextPage();
    });

    window.addEventListener('formiowrapperGoToPrevious', () => {
      this._goToPreviousPage();
    });

    window.addEventListener('formiowrapperCancel', () => {
      this._goToPage(0);
    });

    window.addEventListener('goToPage', (event) => {
      this._goToPage(Number(event.detail.page));
    });
  }

  /**
   */
  initialise() {
    this.formElement = document.querySelector('#formio');
    // responds to form changing events
    this.formElement.addEventListener('click', () => {
      this._firePageChangeEvent();
    });
    Formio.createForm(
      this.formElement,
      this.formLocation,
      this.formSettings,
    ).then((wizard) => {
      this.wizard = wizard;
      this.loaded = true;
      this.wizard.on('initialized', () => {
        this._firePageChangeEvent();
      });
      this.wizard.on('render', () => {
        this.scrollToTop();
        this._firePageChangeEvent();
      });
    });
  }

  /**
   * @returns {void}
   */

  // eslint-ignored here while committing
  _firePageChangeEvent() {
    const event = new CustomEvent('formiowrapperPageChange', {
      bubbles: true,
      detail: {
        page: this.wizard && this.wizard.page ? this.wizard.page : 0,
        navigation: this.buildProgressMenuData(),
        buttons: this.buildButtonData(),
      },
    });
    window.dispatchEvent(event);
  }

  /**
   * @returns {Array} the array of options to distribute
   */
  buildProgressMenuData() {
    const navigationArray = [];
    if (!this.wizard || !this.wizard.components) {
      return navigationArray;
    }
    // this.wizard.setPage(this.wizard.page);
    let invalidPreviousStep = false;
    this.wizard.components.forEach((page, offset) => {
      const isValid = this._checkPageValidity(
        offset,
        this.wizard.components,
        this.wizard.data,
      );

      const active = offset === this.wizard.page;
      const activeClass = active ? 'active' : '';
      const visited = this.wizard._seenPages.indexOf(offset) !== -1;
      const visitedClass = visited ? 'visited' : '';

      if (!visited) {
        invalidPreviousStep = true;
      }
      const outputObject = {
        cssClass: `${this.navigationCSS.baseClass} ${activeClass} ${visitedClass}`,
        detail: {
          page: offset,
        },
        event: 'goToPage',
        title: page.component.title,
        disabled: invalidPreviousStep,
        displayed: true,
        active,
        type: 'li',
      };
      if (!isValid) {
        invalidPreviousStep = true;
      }
      navigationArray.push(outputObject);
    });
    return navigationArray;
  }

  /**
   * @return {Array} the button data array
   */
  buildButtonData() {
    const { page } = this.wizard;
    const { pages } = this.wizard;
    const { data } = this.wizard;

    const previousButton = {
      title: 'Previous',
      event: 'formiowrapperGoToPrevious',
      cssClass: `${this.buttonCSS.baseClass} ${this.buttonCSS.previous}`,
      disabled: !this._checkPageValidity(page - 1, pages, data),
      displayed: true,
      visited: false,
    };

    const nextButton = {
      title: 'Next',
      event: 'formiowrapperGoToNext',
      cssClass: `${this.buttonCSS.baseClass} ${this.buttonCSS.next}`,
      disabled: !this._checkPageValidity(page, pages, data),
      displayed: true,
      visited: false,
    };

    const cancelButton = {
      title: 'Cancel',
      event: 'formiowrapperCancel',
      cssClass: `${this.buttonCSS.baseClass} ${this.buttonCSS.cancel}`,
      disabled: false,
      displayed: true,
      visited: false,
    };

    if (page === 0) {
      previousButton.displayed = false;
      cancelButton.displayed = false;
      if (this.buttonConfig.startOnFirst) {
        nextButton.title = 'Start';
      }
    }

    if (page === this.wizard.pages.length - 1) {
      nextButton.displayed = false;
    }

    const currentPageTitle = this.wizard.pages[this.wizard.page].component
      .title;
    if (this._determineTitleChange(currentPageTitle)) {
      nextButton.title = 'Accept';
      nextButton.disabled = !this._checkPageValidity(page, pages, data);
    }

    return [previousButton, nextButton, cancelButton];
  }

  /**
   * @param {String} currentPageTitle the current page title
   * @return {Boolean}
   */
  _determineTitleChange(currentPageTitle) {
    if (!this.buttonConfig.acceptWhenTermsFound) return false;
    return currentPageTitle.toLowerCase().includes('terms');
  }

  /**
   * @param {Number} offset the offset in the page array
   * @param {Object} pages the details about the page
   * @param {Object} data the data entered by the user
   * @returns {Boolean}
   */
  // eslint-disable-next-line class-methods-use-this
  _checkPageValidity(offset, pages, data) {
    if (offset < 0) return false;
    return pages[offset].checkValidity(data);
  }

  /**
   * @return {Boolean}
   */
  _goToNextPage() {
    if (!this.loaded) {
      this.notLoaded();
    }
    this.wizard.nextPage();
    return true;
  }

  /**
   * @return {Boolean}
   */
  _goToPreviousPage() {
    if (!this.loaded) {
      this.notLoaded();
    }
    this.wizard.prevPage();
    return true;
  }

  /**
   * @param {Number} pageNo the page number provided by the wizard instance
   * @return {Boolean}
   */
  _goToPage(pageNo) {
    if (!this.loaded) {
      this.notLoaded();
    }
    this.wizard.setPage(pageNo);
    return true;
  }

  /**
   */
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

  /**
   */
  scrollToTop() {
    window.scroll({
      top: this.scrollTaret,
      behavior: 'smooth',
    });
  }
}
