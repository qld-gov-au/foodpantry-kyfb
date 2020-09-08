/* eslint-disable */
const SectionNavigation = require('../src/components/section-navigation.js');

describe('Section Navigation is setup correctly.', function () {
  document
    .querySelector('body')
    .insertAdjacentHTML(
      'afterend',
      '<div id="qg-section-nav"><ul aria-label="section navigation"></ul></div>'
    );
  const target = document.querySelector('#qg-section-nav > ul');
  const labelBusterChangeEvent = new CustomEvent({});
  const navigation = new SectionNavigation(target);

  it('Nav data outputs the right dom', function () {
    const navData = [
      {
        cssClass: 'qg-btn btn-link',
        destination: 1,
        label: 'Overview',
        disabled: false,
      },
      {
        cssClass: 'qg-btn btn-link',
        destination: 2,
        label: 'Terms of use',
        disabled: true,
      },
      {
        cssClass: 'qg-btn btn-link',
        destination: 3,
        label: 'Questions',
        disabled: true,
      },
    ];
    navigation.render(navData);
    expect(
      target.innerHTML.includes(
        '<li><button type="button" data-destination="1">Overview</button></li>'
      )
    ).toEqual(true);
    expect(
      target.innerHTML.includes(
        '<li><button type="button" data-destination="2" disabled="">Terms of use</button></li>'
      )
    ).toEqual(true);
    expect(
      target.innerHTML.includes(
        '<li><button type="button" data-destination="3" disabled="">Questions</button></li>'
      )
    ).toEqual(true);
  });

  it('render button should output what is antipcated', function () {
    let response = navigation.renderButton(
      'testClass',
      'testLabel',
      '1',
      false
    );
    expect(response.innerHTML.includes('button')).toEqual(true);
    expect(response.innerHTML.includes('type="button"')).toEqual(true);
    expect(response.innerHTML.includes('data-destination="1"')).toEqual(true);
    expect(response.innerHTML.includes('testLabel')).toEqual(true);
    expect(response.innerHTML.includes('/button')).toEqual(true);
  });

  it('the event fires with the expected data from clicking', function () {
    const clickEvent = {
      currentTarget: {
        dataset: {
          destination: 1,
        },
      },
    };
    const response = navigation.sectionNavigationClicked(clickEvent);
    expect(response.detail.page).toEqual(1);
  });
});
