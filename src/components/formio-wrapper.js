/**
 * @class FormioWrapper
 */
export class FormioWrapper {
  /**
   * @param {Object} configuration the configuration object
   * @returns {void}
   */
  constructor(configuration) {
    this.formTitle = configuration.formTitle;
    this.storage = configuration.storage;
    this.storageName = configuration.storageName;
    this.formLocation = configuration.formLocation;
    this.buttonCSS = configuration.buttonCSS;
    this.navigationCSS = configuration.navigationCSS;
    this.scrollTarget = configuration.scrollTarget;
    this.formSettings = configuration.formSettings;
    this.buttonConfig = configuration.buttonConfig;
    this.termsConfig = configuration.termsConfig;
    this.formName = configuration.formName;
    this.extraTriggers = configuration.extraTriggersOnActions;

    this.formElement = {};

    this.wizard = {};
    this.loaded = false;

    window.addEventListener('DOMContentLoaded', () => {
      this.initialise();
    });

    window.addEventListener('formiowrapperGoToNext', () => {
      this._goToNextPage();
      if (this.extraTriggers.next) {
        this._fireExtraEvent(this.extraTriggers.next);
      }
    });

    window.addEventListener('formiowrapperGoToPrevious', () => {
      this._goToPreviousPage();
      if (this.extraTriggers.previous) {
        this._fireExtraEvent(this.extraTriggers.previous);
      }
    });

    window.addEventListener('formiowrapperCancel', () => {
      this._goToPage(0);
      if (this.extraTriggers.cancel) {
        this._fireExtraEvent(this.extraTriggers.cancel);
      }
    });

    window.addEventListener('goToPage', (event) => {
      this._goToPage(Number(event.detail.page));
      if (this.extraTriggers.goto) {
        this._fireExtraEvent(this.extraTriggers.goto);
      }
    });
  }

  /**
   */
  initialise() {
    if (!this.formLocation) return;
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
      this.formTitle = !this.formTitle ? wizard._form.title : this.formTitle;
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
   * @param {String} event the event name to fire
   * @return {Event}
   */
  _fireExtraEvent(event) {
    const newEvent = new CustomEvent(event, {
      bubbles: true,
      detail: {
        title: this.formTitle,
        page: this.wizard && this.wizard.page ? this.wizard.page : 0,
      },
    });
    window.dispatchEvent(newEvent);
    return newEvent;
  }

  /**
   * @returns {void}
   */
  // eslint-ignored here while committing
  _firePageChangeEvent() {
    const event = new CustomEvent('formiowrapperPageChange', {
      bubbles: true,
      detail: {
        title: this.formTitle,
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
      const visited = this._seenPages(offset, this.wizard._seenPages);
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
   * @description if you skip a terms and conditions page it may not come up
   * as seen... so therefore if we have seen any pages after that it is
   * classified as seen also.
   * @param {Number} page current page number being examined
   * @param {Array} seenPages the list of seen pages
   * @return {Boolean}
   */
  // eslint-disable-next-line class-methods-use-this
  _seenPages(page, seenPages) {
    if (!seenPages.length) return false;
    if (seenPages.indexOf(page + 1) !== -1) return true;
    if (seenPages.indexOf(page) !== -1) return true;
    return false;
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
      disabled: false,
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

    const currentPageTitle = this.wizard.pages[page].component.title;
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
    return currentPageTitle.toLowerCase().includes(this.termsConfig.title);
  }

  /**
   * @param {Number} page the current page number
   * @param {Array} pages the wizard pages
   * @return {Boolean}
   */
  _shouldNextPageBeSkipped(page, pages) {
    if (!this.termsConfig.skipIfTermsAlreadyAccepted) return false;
    const pageTitle = pages[page + 1].component.title;
    if (!pageTitle.toLowerCase().includes(this.termsConfig.title)) return false;
    return this._areTermsAccepted(page, pages);
  }

  /**
   * @param {Number} page the wizard page number
   * @param {Array} pages the wizard pages
   * @return {Boolean}
   */
  _areTermsAccepted(page, pages) {
    const termsStorage = this.termsConfig.termsStorageType;
    const storedValue = termsStorage.getItem(this.termsConfig.termsStorageName);
    const storageValue = JSON.parse(storedValue);
    if (storageValue === false) return false;
    if (storageValue === true) return true;

    const previousPageNumber = page;
    const previousPageTitle = pages[previousPageNumber].component.title;
    if (previousPageTitle.toLowerCase().includes(this.termsConfig.title)) {
      termsStorage.setItem(this.termsConfig.termsStorageName, true);
      return true;
    }
    return false;
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
    if (this._shouldNextPageBeSkipped(this.wizard.page, this.wizard.pages)) {
      const proposedPage = this.wizard.page + 2;
      const targetPage = proposedPage < this.wizard.pages.length
        ? proposedPage
        : this.wizard.page + 1;
      if (this.wizard._data) {
        this.wizard._data[this.termsConfig.dataName] = true;
      }
      this._goToPage(targetPage);
      return true;
    }
    this._updateIfCompleted(this.wizard.page + 1, this.wizard.pages);
    this._areTermsAccepted(this.wizard.page, this.wizard.pages);
    this.wizard.nextPage();
    return true;
  }

  /**
   * @param {Number} page the current page number
   * @param {Array} pages the array of pages
   * @return {Boolean|String}
   */
  _updateIfCompleted(page, pages) {
    if (!page) return false;
    if (!pages || !pages.length) return false;
    if (page === pages.length - 1) {
      let completed = JSON.parse(this.storage.getItem(this.storageName));
      if (!completed || !completed.length) {
        completed = [];
      }
      completed.push(this.formTitle);
      this.storage.setItem(this.storageName, JSON.stringify(completed));
      return completed;
    }
    return false;
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

    this._updateIfCompleted(pageNo, this.wizard.pages);
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
    if (this.scrollTarget === -1) return;
    window.scroll({
      top: this.scrollTarget,
      behavior: 'smooth',
    });
  }
}
