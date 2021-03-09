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
      hooks: {
        beforeSubmit: (submission, next) => {
          // eslint-disable-next-line no-param-reassign
          submission.data.formEnv = window.formEnv;
          next();
        },
      },
    },
    adminEmail: 'foodpantry@health.qld.gov.au',
    adminField: 'adminEmail',
    emailField: 'toConfirmEmail',
    emailConfirmField: 'email',
    endpoint: 'submission',
    pdfEndpoint: 'kyfbpdf',
    pdfDownloadName: data => `Know Your Food Business summary - ${data.topicName}.pdf`,
    pdfSubmission: 'pdfSubmission',
    selector: '#formio',
    clearStorageOnCancel: false,
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
    overwriteFirstButtonShowExtras: true,
    overwriteValue: 'Start',
    showButtonsOnLast: false,
    confirmOnCancel: false,
    css: {
      base: 'qg-btn',
      previous: 'btn-default',
      next: 'btn-primary',
      cancel: 'btn-link',
    },
  },
  confirmation: {
    title: 'Are you sure you want to leave?',
    closeXButton: html`<<i class="fa fa-times" aria-hidden="true"></i>`,
    description: 'Your progress will not be saved',
    continueButtonText: 'No, stay',
    continueButtonCssClass: 'qg-btn btn-primary',
    leaveButtonText: 'Yes, leave',
    leaveButtonCssClass: 'qg-btn btn-link',
  },
  navigation: {
    baseClass: 'qg-btn btn-link',
    skipFirstNavStep: false,
  },
  storage: {
    type: localStorage,
    name: 'completedTopics',
  },
  extraTriggersOnActions: {
    cancel: 'cancelKYFBForm',
    change: 'updateAnalytics',
  },
};
