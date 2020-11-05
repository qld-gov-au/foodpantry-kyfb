export const configuration = {
  form: {
    baseElement: window,
    queryElement: document,
    formioConfig: {
      showCancel: false,
      showPrevious: false,
      showNext: false,
      showSubmit: false,
      adminEmail: '',
    },
    endpoint: '/submission',
    selector: '#formio',
    title: '',
    location:
      'https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd/formwizard',
  },
  scroll: {
    target: 0,
    type: 'auto',
    focusTarget: '#formio',
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
    css: {
      base: 'qg-btn',
      previous: 'btn-default',
      next: 'btn-primary',
      cancel: 'btn-link',
    },
  },
  navigation: {
    baseClass: 'qg-btn btn-link',
  },
  storage: {
    type: localStorage,
    name: 'completedTopics',
  },
  extraTriggersOnActions: {
    cancel: 'doNothing',
    next: 'doNothing',
    goto: 'doNothing',
    previous: 'doNothing',
  },
};
