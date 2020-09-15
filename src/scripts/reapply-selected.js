export default () => {
  const radioContainers = document.querySelectorAll(
    '.form-radio.radio .form-check'
  );
  radioContainers.forEach((container) => {
    const containerInput = container.querySelector('input');
    if (containerInput.checked) {
      container.classList.add('radio-selected');
    }
  });
};
