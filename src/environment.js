export class Environment {
  /**
   * @param {String} environment overwritten environment
   * @param {Object} base overwrite window to get location
   */
  constructor(environment = '', base = window.location.href) {
    let selectedEnvironment = 'production';
    if (!environment) {
      if (base.includes('localhost')) {
        selectedEnvironment = 'development';
      }
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
        this.flag = 'dev';
        this.url = 'https://api.forms.platforms.qld.gov.au/dev-phfmembiqerttho/';
        this.form.adminEmail = 'FoodPantryDefects@DSITIAQLD.onmicrosoft.com';
        break;
      }
      case 'uat': {
        this.flag = 'uat';
        this.url = 'https://api.forms.platforms.qld.gov.au/uat-phfmembiqerttho/';
        this.form.adminEmail = 'foodpantry@health.qld.gov.au';
        break;
      }
      default: {
        this.flag = 'prod';
        this.url = 'https://api.forms.platforms.qld.gov.au/phfmembiqerttho/';
        this.form.adminEmail = 'foodpantry@health.qld.gov.au';
        break;
      }
    }
  }
}
