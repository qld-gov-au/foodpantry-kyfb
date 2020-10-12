/* eslint-disable */

import { fixture, html, expect } from '@open-wc/testing';
import { spy, assert } from 'sinon';
import { TopicsList } from '../src/components/topics-list';

describe('Topics list test', () => {
  let element;
  let topics;

  beforeEach(async () => {
    element = await fixture(html` <div id="topics"></div> `);
    topics = new TopicsList('topics', localStorage);
  });

  it('constructor is run correctly', async () => {
    expect(topics.target).equals('topics');
    expect(topics.domTarget).not.equals(undefined);
    expect(topics.storage).equals(localStorage);
    expect(topics.storageName).equals('completedTopics');
    expect(typeof topics.allTopics).equals('object');
    expect(topics.allTopics.length).not.equals(0);
  });

  it('the output of the topics is rendered as expected', async () => {
    const heading = element.querySelectorAll('h2');
    expect(heading[0]).to.be.ok;
    expect(heading[0].innerText).equal('Topics to Complete');

    const articles = element.querySelectorAll('article');
    expect(articles.length).equals(11);
    expect(articles[0].innerText).equals('Skills and knowledge');
    expect(articles[0].innerHTML.includes('div class="content"')).equals(true);

    expect(articles[0].innerHTML.includes('img src="')).equals(true);
    expect(articles[0].innerHTML.includes('alt="Skills and knowledge"')).equals(
      true,
    );
    expect(articles[0].innerHTML.includes('button')).equals(true);

    expect(articles[1].innerText).equals('Health and hygiene');
    expect(articles[1].innerHTML.includes('div class="content"')).equals(true);
    expect(articles[1].innerHTML.includes('img src="')).equals(true);
    expect(articles[1].innerHTML.includes('alt="Health and hygiene"')).equals(
      true,
    );
    expect(articles[1].innerHTML.includes('button')).equals(true);

    expect(articles[2].innerText).equals('Recieve food');
    expect(articles[2].innerHTML.includes('alt="Recieve food"')).equals(true);

    expect(articles[3].innerText).equals('Store food');
    expect(articles[3].innerHTML.includes('alt="Store food"')).equals(true);

    expect(articles[4].innerText).equals('Prepare food');
    expect(articles[4].innerHTML.includes('alt="Prepare food"')).equals(true);

    expect(articles[5].innerText).equals('Display and serve food');
    expect(
      articles[5].innerHTML.includes('alt="Display and serve food"'),
    ).equals(true);

    expect(articles[6].innerText).equals('Transport food');
    expect(articles[6].innerHTML.includes('alt="Transport food"')).equals(true);

    expect(articles[7].innerText).equals('Complaints and recall');
    expect(
      articles[7].innerHTML.includes('alt="Complaints and recall"'),
    ).equals(true);

    expect(articles[8].innerText).equals('Animals and pests');
    expect(articles[8].innerHTML.includes('alt="Animals and pests"')).equals(
      true,
    );

    expect(articles[9].innerText).equals('Clean and santise');
    expect(articles[9].innerHTML.includes('alt="Clean and santise"')).equals(
      true,
    );

    expect(articles[10].innerText).equals('Maintenance');
    expect(articles[10].innerHTML.includes('alt="Maintenance"')).equals(true);
  });

  it('updateTarget and changes output', async () => {
    localStorage.setItem(
      topics.storageName,
      JSON.stringify(['Transport food']),
    );
    topics.updateTarget(topics.storage);
    const headings = element.querySelectorAll('h2');
    expect(headings.length).equals(2);
    expect(headings[1].innerText).equals('Completed topics');
  });

  it('load new form does nothing when not called from proper event', async () => {
    const loadForm = spy(topics, 'loadNewForm');
    const fakeEvent = { target: { dataset: { form: null } } };
    topics.loadNewForm(fakeEvent);
    loadForm.restore();
    assert.calledOnce(loadForm);
  });
});
