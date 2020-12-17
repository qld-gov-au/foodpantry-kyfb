import { html, render } from 'lit-html';

export class ButtonGroup {
  constructor(target, data = 'buttons') {
    this.target = target;
    this.data = data;
    this.showDialog = false;
    this.cancelEvent = {};

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
    const output = data.map(but => this.generateButton(
      but.title,
      but.event,
      but.cssClass,
      but.disabled,
      but.displayed,
      but.active,
      but.detail,
      but.type,
      but.confirm,
    ));

    return html`${output}`;
  }

  /**
   */
  // eslint-disable-next-line class-methods-use-this
  _createConfirmation() {
    return html`
      <div id="PopupConfirm" ?hidden="${!this.showDialog}">
        <div class="close" @click=${this.closeDialog}><i class="fas fa-times"></i></div>
        <h2>Are you sure you want to leave?</h2>
        Your progress will not be saved.
        <hr>
        <button @click="${this.closeDialog}">No, stay</button>
        <button @click="${this.confirmCancel}">Yes leave</button>
      </div>
    `;
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
   * @param {Boolean} confirm if there is a confirmation for this button press
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
    confirm = false,
  ) {
    if (!displayed) return html``;
    const extraClass = disabled ? 'disabled' : '';
    const activeClass = active ? 'active' : '';
    const button = html` <button
      class="${cssClass} ${extraClass} ${activeClass}"
      data-event=${event}
      data-confirm=${confirm}
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
    if (event.target.dataset.confirm) {
      console.log(event.target.dataset.confirm);
      this.cancelEvent = {
        event: event.target.dataset.event,
        detail: event.target.dataset.detail,
      };
      this.openDialog();
      return;
    }
    const newEvent = new CustomEvent(event.target.dataset.event, {
      bubbles: true,
      detail: JSON.parse(event.target.dataset.detail),
    });
    window.dispatchEvent(newEvent);
  }

  /**
   */
  openDialog() {
    this.showDialog = true;
  }

  /**
   */
  closeDialog() {
    this.showDialog = false;
  }

  /**
   */
  confirmCancel() {
    this.fireEvent(this.cancelEvent);
    this.cancelEvent = {};
  }
}
