import { html, render } from 'lit-html';

export class ButtonGroup {
  constructor(target, data = 'buttons') {
    this.target = target;
    this.data = data;

    window.addEventListener('formiowrapperPageChange', ({ detail }) => {
      this.updateTarget(detail);
    });
  }

  /**
   * @desc Updates the dom target, side effect.
   * @param {Array} data the event data
   */
  updateTarget(data) {
    render(this.updateButtons(data[this.data]), this.target);
  }

  /**
   * @param {Object} data the current page
   * @return {Object}
   */
  updateButtons(data) {
    const output = data.map((but) =>
      this.generateButton(
        but.title,
        but.event,
        but.cssClass,
        but.disabled,
        but.displayed,
        but.active,
        but.detail,
        but.type,
      ),
    );

    return html`${output}`;
  }

  /**
   * @param {String} text the text on the button
   * @param {String} event the event the clicking the button fires
   * @param {String} cssClass the class string for the buttons display
   * @param {Boolean} disabled is the button disabled
   * @param {Boolean} displayed do we display the button
   * @param {Boolean} active if the nav button is active
   * @param {Object} detail detail object to pass through
   * @param {String} type type of element overrites button
   * @return {Object}
   */
  generateButton(
    text,
    event,
    cssClass,
    disabled,
    displayed,
    active,
    detail = '',
    type = 'button',
  ) {
    if (!displayed) return html``;
    const extraClass = disabled ? 'disabled' : '';
    const activeClass = active ? 'active' : '';
    const button = html` <button
      class="${cssClass} ${extraClass} ${activeClass}"
      data-event=${event}
      data-detail=${JSON.stringify(detail)}
      @click=${this.fireEvent}
      ?disabled=${disabled}
    >
      ${text}
    </button>`;

    switch (type) {
      case 'li': {
        return html` <li class="${extraClass} ${activeClass}">${button}</li>`;
      }
      default: {
        return html`${button}`;
      }
    }
  }

  /**
   * @param {Object} event the event
   */
  // eslint-disable-next-line class-methods-use-this
  fireEvent(event) {
    const newEvent = new CustomEvent(event.target.dataset.event, {
      bubbles: true,
      detail: JSON.parse(event.target.dataset.detail),
    });
    window.dispatchEvent(newEvent);
  }
}
