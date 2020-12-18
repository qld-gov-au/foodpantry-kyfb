import { html } from 'lit-html';

export const configuration = {
  form: {
    baseElement: window,
    queryElement: document,
    formioConfig: {
      showCancel: false,
      showPrevious: false,
      showNext: false,
      showSubmit: false,
    },
    adminEmail: '',
    endpoint: 'submission',
    pdfEndpoint: 'kyfbpdf',
    pdfSubmission: 'pdfSubmission',
    selector: '#formio',
    title: '',
    location: '',
    baseLocation: '',
    clearStorageOnCancel: true,
  },
  scroll: {
    target: 0,
    type: 'auto',
    focusTarget: '#focusTarget',
  },
  terms: {
    title: 'terms of use',
    termsStorageType: sessionStorage,
    termsStorageName: 'termsAndConditions',
    skipIfTermsAlreadyAccepted: true,
    dataName: 'termsAndConditions',
  },
  buttons: {
    overwriteFirstButton: true,
    overwriteValue: 'Start',
    showButtonsOnLast: false,
    confirmOnCancel: true,
    css: {
      base: 'qg-btn',
      previous: 'btn-default',
      next: 'btn-primary',
      cancel: 'btn-link',
    },
  },
  confirmation: {
    title: 'Are you sure you want to leave?',
    closeXButton: html`<i class="fas fa-times">X</i>`,
    description: 'Your progress will not be saved',
    continueButtonText: 'No, stay',
    continueButtonCssClass: 'qg-btn btn-primary',
    leaveButtonText: 'Yes, leave',
    leaveButtonCssClass: 'qg-btn btn-link',
  },
  navigation: {
    baseClass: 'qg-btn btn-link',
  },
  storage: {
    type: localStorage,
    name: 'completedTopics',
  },
  extraTriggersOnActions: {
    cancel: 'cancelKYFBForm',
    next: 'checkForAutoEmail',
  },
};
