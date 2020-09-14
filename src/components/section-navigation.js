/**
 * @class SectionNavigation
 */
// eslint-disable-next-line no-unused-vars
export class SectionNavigation {
  /**
   * @param {HTMLElement} target the target for the sectio navigation
   */
  constructor(target) {
    this.target = target;
    this.render();

    window.addEventListener('labelbusterPageChange', (event) => {
      this.render(event.detail.navigation);
    });
  }

  /**
   * @param {Array} navigation the navigation data
   */
  render(navigation = []) {
    let buttons = this.target.querySelectorAll('button');
    if (buttons.length) {
      buttons.forEach((button) => {
        button.removeEventListener('click', (event) => {
          this.sectionNavigationClicked(event);
        });
      });
    }

    if (navigation.length) {
      this.target.innerHTML = '';
      navigation.forEach((nav) => {
        const element = this.renderButton(
          nav.cssClass,
          nav.label,
          nav.destination,
          nav.disabled,
          nav.visited,
          nav.active,
          nav.step
        );
        this.target.appendChild(element);
      });
    }

    buttons = this.target.querySelectorAll('button');
    if (buttons.length) {
      buttons.forEach((button) => {
        if (!button.disabled) {
          button.addEventListener('click', (event) => {
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
   * @param {Boolean} visited has this been visited
   * @param {Boolean} active if the step is active
   * @param {Number} step the step displayed -1 for no display
   * @return {HTMLElement}
   */
  // eslint-disable-next-line class-methods-use-this
  renderButton(
    cssClass,
    label,
    destination,
    disabled,
    visited,
    active,
    step = -1
  ) {
    const buttonClass = visited ? `${cssClass} visited` : cssClass;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = buttonClass;
    button.setAttribute('data-destination', destination);
    button.disabled = disabled;
    button.textContent = label;
    const li = document.createElement('li');
    if (active) {
      li.className = 'active';
    }
    if (step !== -1) {
      let className = 'number';
      if (disabled) {
        className += ' disabled';
      }
      const stepHtml = document.createElement('span');
      stepHtml.className = className;
      stepHtml.textContent = step;
      li.appendChild(stepHtml);
    }

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
}
