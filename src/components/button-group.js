import { html, render, nothing } from 'lit-html';
import { configuration } from '../config';

export class ButtonGroup {
  constructor(target, data = 'buttons') {
    this.target = target;
    this.data = data;
    this.showDialog = false;
    this.cancelEvent = {};
    this.fullData = [];
    window.addEventListener('formiowrapperPageChange', ({ detail }) => {
      this.updateTarget(detail);
    });
  }

  /**
   * @desc Updates the dom target, side effect.
   * @param {Array} data the event data
   */
  updateTarget(data) {
    this.fullData = data;
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

    let confirmation = nothing;
    if (JSON.stringify(output).indexOf('</li>') === -1) {
      confirmation = this._createConfirmation();
    }

    return html`${output}${confirmation}`;
  }

  /**
   */
  // eslint-disable-next-line class-methods-use-this
  _createConfirmation() {
    return html`
      <div id="cancelconfirmationwrapper" .hidden=${!this.showDialog}>
        <div id="cancelconfirmationdialog">
          <div class="close" @click="${() => this.this.toggleDialog()}">
            ${configuration.confirmation.closeXButton}
          </div>
          <h2>${configuration.confirmation.title}</h2>
          ${configuration.confirmation.description}
          <hr>
          <div class="buttons">
            <button
              class="${configuration.confirmation.continueButtonCssClass}"
              @click="${() => this.toggleDialog()}">
              ${configuration.confirmation.continueButtonText}
            </button>
            <button
              class="${configuration.confirmation.leaveButtonCssClass}"
              @click="${event => this.confirmCancel(event)}">
              ${configuration.confirmation.leaveButtonText}
            </button>
          </div>
        </div>
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
      @click="${e => this.processClick(e)}"
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
  processClick(event) {
    if (event.target.dataset.confirm !== 'false') {
      this.cancelEvent = {
        target: {
          dataset: {
            event: event.target.dataset.event,
            detail: event.target.dataset.detail,
          },
        },
      };
      this.toggleDialog();
      return;
    }
    this.fireEvent(event);
  }

  /**
   * @param {Object} event
   */
  // eslint-disable-next-line class-methods-use-this
  fireEvent(event) {
    const newEvent = new CustomEvent(event.target.dataset.event, {
      bubbles: true,
      detail: JSON.parse(event.target.dataset.detail),
    });
    window.dispatchEvent(newEvent);
  }

  /**
   */
  confirmCancel() {
    this.toggleDialog();
    const cancelEvent = { ...this.cancelEvent };
    this.cancelEvent = {};
    this.fireEvent(cancelEvent);
  }

  /**
   */
  toggleDialog() {
    this.showDialog = !this.showDialog;
    render(this.updateButtons(this.fullData[this.data]), this.target);
  }
}
