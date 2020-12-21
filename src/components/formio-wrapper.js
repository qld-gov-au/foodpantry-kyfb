/**
 * @class FormioWrapper
 */
export class FormioWrapper {
  /**
   * @param {Object} configuration the configuration object
   * @returns {void}
   */
  constructor(configuration) {
    this.config = configuration;
    this.formElement = {};
    this.wizard = {};
    this.loaded = false;
    this._addListeners(this.config.form.baseElement);
  }

  initialise(firstInit = true) {
    if (!this.config.form.location) return;
    this.submissionEndpoint = `${this.config.form.baseLocation}${this.config.form.pdfEndpoint}/${this.config.form.endpoint}`;
    this.formElement = document.querySelector('#formio');

    // create main form
    Formio.createForm(
      this.formElement,
      this.config.form.location,
      this.config.form.formioConfig,
    ).then((wizard) => {
      this.wizard = wizard;
      this.submissionData = this.wizard.submission.data;
      this.wizard.data.adminEmail = this.formAdminEmail;
      this.formTitle = !this.formTitle ? wizard._form.title : this.formTitle;
      this.loaded = true;
      if (firstInit) {
        this._attachHandlers();
        this.createPDFInstance();
        this._populateDataFromStorage(
          this.config.storage.type,
          this.config.form.title,
        );
      }
    });
  }

  /**
   */
  _attachHandlers() {
    this.wizard.on('initialized', () => {
      this._firePageChangeEvent();
    });
    this.wizard.on('render', () => {
      this._firePageChangeEvent();
      this.scrollToTop(
        this.config.form.baseElement,
        this.config.scroll.focusTarget,
      );
    });
    this.wizard.on('change', () => {
      this._firePageChangeEvent();
      this._updateStorage(
        this.config.storage.type,
        this.config.form.title,
        this.wizard.data,
      );
    });
    this.wizard.on('downloadPDF', () => {
      this.wizard.data.sendEmail = false;
      this._downloadPDF();
    });
    this.wizard.on('sendEmail', () => {
      this.wizard.data.sendEmail = 'user';
      this._sendEmail();
    });
  }

  /**
   * @param {Object} baseObject object to trigger listeners and events on
   */
  _addListeners(baseObject = window) {
    baseObject.addEventListener('DOMContentLoaded', () => {
      this.initialise();
    });

    baseObject.addEventListener('formiowrapperGoToNext', () => {
      this._goToNextPage();
    });

    baseObject.addEventListener('formiowrapperGoToPrevious', () => {
      this._goToPreviousPage();
      if (this.config.extraTriggersOnActions.previous) {
        this._fireExtraEvent(this.config.extraTriggersOnActions.previous);
      }
    });

    baseObject.addEventListener('formiowrapperCancel', () => {
      this._clearStorage();
      this._goToPage(0);
      if (this.config.extraTriggersOnActions.cancel) {
        this._fireExtraEvent(this.config.extraTriggersOnActions.cancel);
      }
    });

    baseObject.addEventListener('formiowrapperGoToPage', (event) => {
      this._goToPage(Number(event.detail.page));
      if (this.config.extraTriggersOnActions.goto) {
        this._fireExtraEvent(this.config.extraTriggersOnActions.goto);
      }
    });

    baseObject.addEventListener('formiowrapperSendAdminEmail', () => {
      this.wizard.data.sendEmail = 'admin';
      this._sendEmail();
    });

    baseObject.addEventListener('formiowrapperPageChange', (event) => {
      if (event.detail.page !== this.currentPageRef) {
        this._fireExtraEvent('formioNewPageRender');
        this.currentPageRef = this.wizard.page;
      }
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
        title: this.config.form.title,
        page: this.wizard && this.wizard.page ? this.wizard.page : 0,
      },
    });
    this.config.form.baseElement.dispatchEvent(newEvent);
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
        title: this.config.form.title,
        page: this.wizard && this.wizard.page ? this.wizard.page : 0,
        navigation: this.buildProgressMenuData(),
        buttons: this.buildButtonData(),
      },
    });
    this.config.form.baseElement.dispatchEvent(event);
  }

  /**
   * @param {Object} storage the storage option
   * @param {Sting} key the key within the storage
   * @param {Object} data the new data to be stored
   */
  // eslint-disable-next-line class-methods-use-this
  _updateStorage(storage, key, data) {
    const rawData = storage.getItem(key);
    const previousStorage = rawData ? JSON.parse(rawData) : {};
    const newStorage = { ...previousStorage, ...data };
    storage.setItem(key, JSON.stringify(newStorage));
  }

  /**
   * @param {Object} storage the storage option
   * @param {String} key the key within the storage
   */
  _populateDataFromStorage(storage, key) {
    const storedData = storage.getItem(key);
    if (storedData) {
      this.wizard.data = JSON.parse(storedData);
    }
  }

  /**
   */
  _clearStorage() {
    this.config.terms.termsStorageType.clear();
    this.config.storage.type.clear();
    delete this.wizard.data;
  }

  /**
   * @returns {Array} the array of options to distribute
   */
  buildProgressMenuData() {
    const navigationArray = [];
    if (!this.wizard || !this.wizard.components) {
      return navigationArray;
    }
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
        cssClass: `${this.config.navigation.baseClass} ${activeClass} ${visitedClass}`,
        detail: {
          page: offset,
        },
        event: 'formiowrapperGoToPage',
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

    const { base } = this.config.buttons.css;

    const previousButton = {
      title: 'Back',
      event: 'formiowrapperGoToPrevious',
      cssClass: `${base} ${this.config.buttons.css.previous}`,
      disabled: false,
      displayed: true,
      visited: false,
    };

    const nextButton = {
      title: 'Next',
      event: 'formiowrapperGoToNext',
      cssClass: `${base} ${this.config.buttons.css.next}`,
      disabled: !this._checkPageValidity(page, pages, data),
      displayed: true,
      visited: false,
    };

    const cancelButton = {
      title: 'Cancel',
      event: 'formiowrapperCancel',
      cssClass: `${base} ${this.config.buttons.css.cancel}`,
      disabled: false,
      displayed: true,
      visited: false,
      confirm: this.config.buttons.confirmOnCancel,
    };

    if (page === 0) {
      previousButton.displayed = false;
      if (this.config.buttons.overwriteFirstButton) {
        cancelButton.displayed = false;
        nextButton.title = this.config.buttons.overwriteValue;
      }
    }

    if (page === this.wizard.pages.length - 1) {
      nextButton.displayed = false;
      if (!this.config.buttons.showButtonsOnLast) {
        previousButton.displayed = false;
        cancelButton.displayed = false;
      }
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
    if (!this.config.buttons.overwriteFirstButton) return false;
    return currentPageTitle.toLowerCase().includes(this.config.terms.title);
  }

  /**
   * @param {Number} page the current page number
   * @param {Array} pages the wizard pages
   * @return {Boolean}
   */
  _shouldNextPageBeSkipped(page, pages) {
    if (!this.config.terms.skipIfTermsAlreadyAccepted) return false;
    const pageTitle = pages[page + 1].component.title;
    if (!pageTitle.toLowerCase().includes(this.config.terms.title)) return false;
    return this._areTermsAccepted(page, pages);
  }

  /**
   * @param {Number} page the current page number
   * @param {Array} pages the wizard pages
   * @return {Boolean}
   */
  _shouldPreviousPageBeSkipped(page, pages) {
    if (!this.config.terms.skipIfTermsAlreadyAccepted) return false;
    const pageTitle = pages[page - 1].component.title;
    if (!pageTitle.toLowerCase().includes(this.config.terms.title)) return false;
    return this._areTermsAccepted(page, pages);
  }

  /**
   * @param {Number} page the wizard page number
   * @param {Array} pages the wizard pages
   * @return {Boolean}
   */
  _areTermsAccepted(page, pages) {
    const termsStorage = this.config.terms.termsStorageType;
    const storedValue = termsStorage.getItem(
      this.config.terms.termsStorageName,
    );
    const storageValue = JSON.parse(storedValue);
    if (storageValue === false) return false;
    if (storageValue === true) return true;

    const previousPageNumber = page;
    const previousPageTitle = pages[previousPageNumber].component.title;
    if (previousPageTitle.toLowerCase().includes(this.config.terms.title)) {
      termsStorage.setItem(this.config.terms.termsStorageName, true);
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
    if (this.wizard.page === this.wizard.pages.length - 1) return false;
    if (this._shouldNextPageBeSkipped(this.wizard.page, this.wizard.pages)) {
      const proposedPage = this.wizard.page + 2;
      const targetPage = proposedPage < this.wizard.pages.length
        ? proposedPage
        : this.wizard.page + 1;
      if (this.wizard._data) {
        this.wizard._data[this.config.terms.dataName] = true;
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
      let completed = JSON.parse(
        this.config.storage.type.getItem(this.config.storage.name),
      );
      if (!completed || !completed.length) {
        completed = [];
      }
      if (this.config.form.title) {
        completed.push(this.config.form.title);
      }
      this.config.storage.type.setItem(
        this.config.storage.name,
        JSON.stringify(completed),
      );
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
    if (
      this._shouldPreviousPageBeSkipped(this.wizard.page, this.wizard.pages)
    ) {
      const proposedPage = this.wizard.page - 2;
      const targetPage = proposedPage <= 0 ? proposedPage : this.wizard.page - 1;
      if (this.wizard._data) {
        this.wizard._data[this.config.terms.dataName] = true;
      }
      this._goToPage(targetPage);
      return true;
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
    if (!this.wizard || !this.wizard.pages) return false;

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
   * @param {HTMLElement} baseElement the base element for scrolling (window)
   * @param {HTMLElement} focusTarget the element for query selecting (document)
   */
  scrollToTop(baseElement, focusTarget) {
    if (this.config.scroll.target !== -1) {
      baseElement.scroll({
        top: this.config.scroll.target,
        behavior: this.config.scroll.type,
      });
    }
    const target = this.config.form.queryElement.querySelector(focusTarget);
    if (!target) return;
    target.focus();
  }

  /**
   * @return {void}
   */
  createPDFInstance() {
    if (!this.config.form.pdfEndpoint) return;
    Formio.createForm(
      document.createElement('div'),
      `${this.config.form.baseLocation}${this.config.form.pdfEndpoint}`,
    ).then((pdfInstance) => {
      this.pdfInstance = pdfInstance;
    });
  }

  /**
   * @return {Response}
   */
  _formSubmission() {
    this.pdfInstance.data = this.submissionData;
    return this.pdfInstance.submit();
  }

  /**
   * @return {void}
   */
  _downloadPDF() {
    if (this.requestedDownload) return;
    this.requestedDownload = true;
    // wizard event does not capture EventTarget
    const downloadButton = this.config.form.queryElement.querySelector(
      '[name="data[downloadSummary]"',
    );
    downloadButton.disabled = true;

    this._formSubmission().then((successBody) => {
      const { pdfDownloadName } = this.config.form;
      const xhr = new XMLHttpRequest();
      xhr.open(
        'GET',
        `${this.submissionEndpoint}/${successBody._id}/download`,
        true,
      );
      xhr.responseType = 'arraybuffer';
      xhr.onload = function openPdf() {
        if (this.status === 200) {
          const blob = new Blob([this.response], { type: 'application/pdf' });
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // IE 11
            window.navigator.msSaveOrOpenBlob(blob);
          } else {
            // Other browsers
            const data = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = data;
            link.download = pdfDownloadName(successBody.data);
            link.click();
            setTimeout(() => {
              // For Firefox
              window.URL.revokeObjectURL(data);
            }, 100);
          }
        }
        downloadButton.disabled = false;
        this.requestedDownload = false;
      };
      xhr.send();
    });
  }

  /**
   * @return {void}
   */
  _sendEmail() {
    if (this.requestedEmail) return;
    const emailButton = this.config.form.queryElement.querySelector(
      '[name="data[emailButton]"',
    );
    if (this.wizard.data.sendEmail === 'user') {
      emailButton.disabled = true;
      this.requestedEmail = true;
      setTimeout(() => {
        this.requestedEmail = false;
        emailButton.disabled = false;
      }, 10000);
    } else {
      this.wizard.data.adminEmail = this.config.form.adminEmail;
    }
    this.wizard.submit();
  }
}
