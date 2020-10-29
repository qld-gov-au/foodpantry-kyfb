export const configuration = {
  form: {
    baseElement: window,
    formioConfig: {
      showCancel: false,
      showPrevious: false,
      showNext: false,
      showSubmit: false,
    },
    selector: '#formio',
    title: '',
  },
  scroll: {
    target: 0,
    type: 'auto',
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

// storage: localStorage,
// storageName: 'completedTopics',
// formLocation: '',
// formSettings: {
//   buttonSettings: {
//     showCancel: false,
//     showPrevious: false,
//     showNext: false,
//     showSubmit: false,
//   },
// },
// buttonCSS: {
//   baseClass: 'qg-btn',
//   previous: 'btn-default',
//   next: 'btn-primary',
//   cancel: 'btn-link',
// },
// scrollTarget: 0,
// scrollType: 'auto',
// buttonConfig: {
//   startOnFirst: true,
//   acceptWhenTermsFound: true,
// },
// termsConfig: {
//   title: 'terms of use',
//   termsStorageType: sessionStorage,
//   termsStorageName: 'termsAndConditions',
//   skipIfTermsAlreadyAccepted: true,
//   dataName: 'termsAndConditions',
// },
// navigationCSS: {
//   baseClass: 'qg-btn btn-link',
// },
// extraTriggersOnActions: {
//   cancel: 'cancelKYFBForm',
// },
