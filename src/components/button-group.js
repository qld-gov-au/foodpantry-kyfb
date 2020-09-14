/**
 * @param {Event} domEvent the element's event
 * @param {String} name the name of the custom event
 * @returns {void}
 */
function fireEvent(domEvent, name) {
  const customEvent = new CustomEvent(name, { bubbles: true });
  domEvent.target.dispatchEvent(customEvent);
}

/**
 * Render a button
 * @param {String} text the button's inner text
 * @param {String} eventName the custom event that button will fire
 * @param {String} cssClass the class that describes the presentation of the button
 * @param {Boolean} isDisabled if the button should be disabled
 * @returns {HTMLButtonElement}
 */
function button(text, eventName, cssClass, isDisabled = false) {
  const _button = document.createElement('button');
  _button.innerText = text;
  _button.className = `qg-btn ${cssClass}`;
  _button.disabled = isDisabled;
  _button.addEventListener('click', (e) => fireEvent(e, eventName));
  return _button;
}

/**
 * @param {Array} buttons the array of config buttons
 * @return {HTMLElement}
 */
function buttonGroup(buttons) {
  const container = document.createElement('div');
  container.className = 'panel-body';
  const p = document.createElement('p');

  if (buttons.length > 0) {
    buttons.forEach((buttonConfig) => {
      const { text, eventName, cssClass, disabled } = buttonConfig;
      const buttonElement = button(text, eventName, cssClass, disabled);
      p.appendChild(buttonElement);
    });
  }
  container.appendChild(p);
  return container;
}

/**
 * @class ButtonGroup
 */
// eslint-disable-next-line import/prefer-default-export
export class ButtonGroup {
  constructor(target) {
    this.target = target; // <div class="button-group"></div>
    this.updateTarget(this.render());

    window.addEventListener(
      'labelbusterPageChange',
      ({ detail: { page, hasAccepted } }) => {
        this.updateTarget(this.render(page, hasAccepted));
      }
    );
  }

  /**
   * @param {HTMLElement} result is the HTML returned by the render method for button group
   */
  updateTarget(result) {
    this.target.innerHTML = '';
    this.target.appendChild(result);
  }

  /**
   * @param {Number} pageNo the page number provided by the wizard instance
   */
  // eslint-disable-next-line class-methods-use-this
  render(pageNo, hasAccepted) {
    if (pageNo === 0) {
      return null;
    }
    if (pageNo === 2) {
      return buttonGroup([
        {
          text: 'Back',
          eventName: 'labelbusterGoToPrevious',
          cssClass: 'btn-default',
        },
        {
          text: 'Accept',
          eventName: 'labelbusterAccept',
          cssClass: 'btn-primary',
          disabled: !hasAccepted,
        },
        {
          text: 'Cancel',
          eventName: 'labelbusterCancel',
          cssClass: 'btn-link',
        },
      ]);
    }
    return buttonGroup([
      {
        text: 'Back',
        eventName: 'labelbusterGoToPrevious',
        cssClass: 'btn-default',
      },
      {
        text: 'Next',
        eventName: 'labelbusterGoToNext',
        cssClass: 'btn-primary',
      },
      {
        text: 'Cancel',
        eventName: 'labelbusterCancel',
        cssClass: 'btn-link',
      },
    ]);
  }
}

window.controls = new ButtonGroup(document.querySelector('.button-container'));
