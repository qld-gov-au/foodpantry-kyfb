export class Environment {
  /**
   * @param {String} environment overwritten environment
   * @param {Object} base overwrite window to get location
   */
  constructor(environment = '', base = window.location.href) {
    let selectedEnvironment = 'production';
    if (!environment) {
      if (base.includes('dev')) {
        selectedEnvironment = 'development';
      }
      if (base.includes('uat')) {
        selectedEnvironment = 'uat';
      }
    } else {
      selectedEnvironment = environment;
    }

    switch (selectedEnvironment) {
      case 'development': {
        this.url = 'https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd/';
        break;
      }
      case 'uat': {
        this.url = 'https://api.forms.platforms.qld.gov.au/uatsprint5-fesrqwsyzlbtegd/';
        break;
      }
      default: {
        this.url = 'https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd/';
        break;
      }
    }
  }
}
