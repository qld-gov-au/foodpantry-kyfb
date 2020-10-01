import { html, render, nothing } from 'lit-html';

export class TopicsList {
  constructor(target, storage) {
    this.target = target;
    this.storage = storage;
    this.storageName = 'completedTopics';
    this.allTopics = [
      {
        name: 'People',
        topics: [
          { title: 'Skills and knowledge', link: '', image: '' },
          { title: 'Health and hygiene', link: '', image: '' },
        ],
      },
      {
        name: 'Process',
        topics: [
          { title: 'Recieve food', link: '', image: '' },
          { title: 'Store food', link: '', image: '' },
          { title: 'Prepare food', link: '', image: '' },
          { title: 'Display and serve food', link: '', image: '' },
          { title: 'Transport food', link: '', image: '' },
          { title: 'Complaints and recall', link: '', image: '' },
        ],
      },
      {
        name: 'Premises and equipment',
        topics: [
          { title: 'Animals and pests', link: '', image: '' },
          { title: 'Clean and santise', link: '', image: '' },
          { title: 'Maintenance', link: '', image: '' },
        ],
      },
    ];
    window.addEventListener('topicsUpdated', () => {
      this.updateTarget(storage);
    });
  }

  /**
   * @param {Object} storage the selected storage mechanism
   */
  updateTarget(storage) {
    let completedTopics = storage.getItem(this.storrage);
    completedTopics = completedTopics ? JSON.parse(completedTopics) : [];
    render(this.updateTopics(completedTopics), this.target);
  }

  /**
   * @param {Array} completedTopics array of completed topics titles
   * @return {HTMLTemplateElement}
   */
  updateTopics(completedTopics) {
    return html`
      ${this.showNewTopics(completedTopics)}
      ${this.showCompletedTopics(completedTopics)}
    `;
  }

  /**
   * @param {Array} completedTopics the completed topics titles
   * @return {HTMLTemplateElement}
   */
  showNewTopics(completedTopics) {
    const renderTopics = this.allTopics.map((topic) => {
      const articles = topic.topics.map((minorTopic) => {
        if (completedTopics.indexOf(minorTopic.title) === -1) {
          return this._generateNewArticle(
            minorTopic.image,
            minorTopic.link,
            minorTopic.title,
          );
        }
        return nothing;
      });
      return html`
        <h3>${topic.name}</h3>
        <section class="row gg-cards">${articles}</section>
      `;
    });

    this.allTopics.map((topic) => {
      let completedFlag = false;
      const completed = topic.topics.map((minorTopic) => {
        if (completedTopics.indexOf(minorTopic.title) !== -1) {
          completedFlag = true;
          return this._generateNewArticle(
            minorTopic.image,
            minorTopic.link,
            minorTopic.title,
          );
        }
        return nothing;
      });
      if (completedFlag) {
        return html` <div
          class="alert alert-instructions"
          id="completed-topics"
          role="alert"
        >
          <h2>Completed topics</h2>
          <p>
            You can restart a completed topic by clicking on the topic link
            below.
          </p>
          <ul>
            ${completed}
          </ul>
        </div>`;
      }
      return nothing;
    });

    return html` <h2 class="heading-primary">Topics to Complete</h2>
      <p>Each topic takes about 5 to 10 minutes to complete</p>
      ${renderTopics}`;
  }

  /**
   * @param {String} image url to image
   * @param {String} link url link for anchor
   * @param {String} title title of the topic
   * @return {HTMLTemplateElement}
   */
  // eslint-disable-next-line class-methods-use-this
  _generateNewArticle(image, link, title) {
    return html`<article class="qg-card col-12 col-sm-6 col-lg-4">
      <div class="content">
        <img src="${image}" alt="${title}" />
        <div class="details">
          <a href="${link}">
            <button class="gg-btn btn-link">${title}</button>
          </a>
        </div>
      </div>
    </article>`;
  }

  /**
   * @param {String} link the url for an anchor
   * @param {String} title the title of the completed topic
   * @return {HTMLTemplateElement}
   */
  // eslint-disable-next-line class-methods-use-this
  _generateCompletedTopic(link, title) {
    return html` <li>
      <a href="${link}">
        <button class="gg-btn btn-link">${title}</button>
      </a>
    </li>`;
  }
}
