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
    location: '',
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
    cancel: 'cancelKYFBForm',
  },
};

// const configuration = {
//   formTitle: '',
//   storage: localStorage,
//   storageName: 'completedTopics',
//   formLocation: '',
//   baseObject: window,
//   formSettings: {
//     buttonSettings: {
//       showCancel: false,
//       showPrevious: false,
//       showNext: false,
//       showSubmit: false,
//     },
//   },
//   buttonCSS: {
//     baseClass: 'qg-btn',
//     previous: 'btn-default',
//     next: 'btn-primary',
//     cancel: 'btn-link',
//   },
//   scrollTarget: 0,
//   scrollType: 'auto',
//   buttonConfig: {
//     startOnFirst: true,
//     hideCancelOnFirst: false,
//     acceptWhenTermsFound: true,
//   },
//   termsConfig: {
//     title: 'terms of use',
//     termsStorageType: sessionStorage,
//     termsStorageName: 'termsAndConditions',
//     skipIfTermsAlreadyAccepted: true,
//     dataName: 'termsAndConditions',
//   },
//   navigationCSS: {
//     baseClass: 'qg-btn btn-link',
//   },
//   extraTriggersOnActions: {
//     cancel: 'cancelKYFBForm',
//   },
//   submissionInfo: {
//     projectID: '5f44969319d1a97a819d80a7',
//     formID: '5f8f7e6c8095d22a27f6a03a',
//   },
//   formAdminEmail: '',
// };
