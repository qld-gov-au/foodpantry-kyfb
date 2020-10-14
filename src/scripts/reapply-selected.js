/* eslint-disable class-methods-use-this */
/**
 * @desc class to re-apply the styles to formio elements as they go missing
 */
export class ReapplySelected {
  reaply() {
    this._reaplyRadios();
  }

  /**
   * @desc reaplly radio buttons
   */
  _reaplyRadios() {
    const radioContainers = document.querySelectorAll(
      '.form-radio.radio .form-check',
    );
    radioContainers.forEach((container) => {
      const containerInput = container.querySelector('input');
      if (containerInput.checked) {
        container.classList.add('radio-selected');
      }
    });
  }
}
