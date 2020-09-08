/**
 * @class SectionNavigation
 */
// eslint-disable-next-line no-unused-vars
module.exports = class SectionNavigation {
  /**
   * @param {HTMLElement} target the target for the sectio navigation
   */
  constructor(target) {
    this.target = target;
    this.target.innerHTML = this.render();

    document.body.addEventListener('labelbusterPageChange', event => {
      this.render(event.data.navigation);
    });
  }

  /**
   * @param {Array} navigation the navigation data
   */
  render(navigation = []) {
    let buttons = this.target.querySelectorAll('button');
    if (buttons.length) {
      buttons.forEach(button => {
        button.removeEventListener('click', event => {
          this.sectionNavigationClicked(event);
        });
      });
    }

    if (navigation.length) {
      this.target.innerHTML = '';
      navigation.forEach(nav => {
        const element = this.renderButton(
          nav.cssClass,
          nav.label,
          nav.destination,
          nav.disabled
        );
        this.target.appendChild(element);
      });
    }

    buttons = this.target.querySelectorAll('button');
    if (buttons.length) {
      buttons.forEach(button => {
        if (!button.disabled) {
          button.addEventListener('click', event => {
            this.sectionNavigationClicked(event);
          });
        }
      });
    }
  }

  /**
   * @param {String} cssClass the selected class for the navigation element
   * @param {String} label the label of the button
   * @param {String} destination the destination (formio page) on click
   * @param {Boolean} disabled is the button disabled
   * @return {HTMLElement}
   */
  // eslint-disable-next-line class-methods-use-this
  renderButton(cssClass, label, destination, disabled) {
    const button = document.createElement('button');
    button.type = 'button';
    button.class = cssClass;
    button.setAttribute('data-destination', destination);
    button.disabled = disabled;
    button.textContent = label;
    const li = document.createElement('li');
    li.appendChild(button);
    return li;
  }

  /**
   * @param {Event} event the click event
   * @return {Event} returns the event transmitted
   */
  // eslint-disable-next-line class-methods-use-this
  sectionNavigationClicked(event) {
    const target = event.currentTarget;
    const newEvent = new CustomEvent('gotoPage', {
      bubbles: true,
      detail: {
        page: target.dataset.destination,
      },
    });
    window.dispatchEvent(newEvent);
    return newEvent;
  }
};
