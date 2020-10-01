import { html, render, nothing } from 'lit-html';

export class TopicsList {
  constructor(target, storage) {
    this.target = target;
    this.domTarget = undefined;
    this.storage = storage;
    this.storageName = 'completedTopics';
    this.allTopics = [
      {
        name: 'People',
        topics: [
          {
            title: 'Skills and knowledge',
            link: '',
            image:
              'https://www.qld.gov.au/dev/food-pantry/dev/kyfb-home-images/Skills-and-knowledge-176606698.jpg',
          },
          {
            title: 'Health and hygiene',
            link: '',
            image:
              'https://www.qld.gov.au/dev/food-pantry/dev/kyfb-home-images/Health-and-hygiene-1181710190.jpg',
          },
        ],
      },
      {
        name: 'Process',
        topics: [
          {
            title: 'Recieve food',
            link: '',
            image:
              'https://www.qld.gov.au/dev/food-pantry/dev/kyfb-home-images/Recieve-food-868730920.jpg',
          },
          {
            title: 'Store food',
            link: '',
            image:
              'https://www.qld.gov.au/dev/food-pantry/dev/kyfb-home-images/Transport-1227348008.jpg',
          },
          {
            title: 'Prepare food',
            link: '',
            image:
              'https://www.qld.gov.au/dev/food-pantry/dev/kyfb-home-images/Prepare-and-serve-186557945.jpg',
          },
          {
            title: 'Display and serve food',
            link: '',
            image:
              'https://www.qld.gov.au/dev/food-pantry/dev/kyfb-home-images/Food-display-629986120.jpg',
          },
          {
            title: 'Transport food',
            link: '',
            image:
              'https://www.qld.gov.au/dev/food-pantry/dev/kyfb-home-images/Transport-1227348008.jpg',
          },
          {
            title: 'Complaints and recall',
            link: '',
            image:
              'https://www.qld.gov.au/dev/food-pantry/dev/kyfb-home-images/Recalls-and-complaints-1165181144.jpg',
          },
        ],
      },
      {
        name: 'Premises and equipment',
        topics: [
          {
            title: 'Animals and pests',
            link: '',
            image:
              'https://www.qld.gov.au/dev/food-pantry/dev/kyfb-home-images/Animals-and-Pests-1155232061.jpg',
          },
          {
            title: 'Clean and santise',
            link: '',
            image:
              'https://www.qld.gov.au/dev/food-pantry/dev/kyfb-home-images/Cleaning-200391212-001.jpg',
          },
          {
            title: 'Maintenance',
            link: '',
            image:
              'https://www.qld.gov.au/dev/food-pantry/dev/kyfb-home-images/Maintenance-1169504170.jpg',
          },
        ],
      },
    ];

    window.addEventListener('formiowrapperPageChange', () => {
      this.updateTarget(storage);
    });

    window.addEventListener('kyfbTopicsChanged', () => {
      this.updateTarget(storage);
    });

    if (this.target) {
      this.updateTarget(storage);
    }
  }

  /**
   * @param {Object} storage the selected storage mechanism
   */
  updateTarget(storage) {
    let completedTopics = storage.getItem(this.storageName);
    completedTopics = completedTopics ? JSON.parse(completedTopics) : [];

    if (!this.domTarget) {
      this._findTarget(this.target);
    }
    if (this.domTarget) {
      render(this.updateTopics(completedTopics), this.domTarget);
    }
  }

  /**
   * @param {Array} completedTopics array of completed topics titles
   * @return {HTMLTemplateElement}
   */
  updateTopics(completedTopics) {
    return html` ${this.showTopics(completedTopics)} `;
  }

  /**
   * @param {Array} completedTopics the completed topics titles
   * @return {HTMLTemplateElement}
   */
  showTopics(completedTopics) {
    let renderFinishedTopics;

    const renderTopics = this._renderTopics(this.allTopics, completedTopics);

    const completed = this._renderCompletedTopics(
      this.allTopics,
      completedTopics,
    );

    if (completed.length) {
      renderFinishedTopics = html` <div
        class="alert alert-instructions"
        id="completed-topics"
        role="alert"
      >
        <h2>Completed topics</h2>
        <p>
          You can restart a completed topic by clicking on the topic link below.
        </p>
        <ul>
          ${completed}
        </ul>
      </div>`;
    }

    return html` <h2 class="heading-primary">Topics to Complete</h2>
      <p>Each topic takes about 5 to 10 minutes to complete</p>
      ${renderTopics} ${renderFinishedTopics}`;
  }

  /**
   * @param {Array} allTopics the full topics list
   * @param {Array} completedTopics the list of completed topics titles
   * @return {HTMLTemplateElement}
   */
  _renderTopics(allTopics, completedTopics) {
    return allTopics.map((topic) => {
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
  }

  /**
   * @param {Array} allTopics the full topics list
   * @param {Array} completedTopics the list of completed topics titles
   * @return {HTMLTemplateElement}
   */
  _renderCompletedTopics(allTopics, completedTopics) {
    const completed = [];
    allTopics.forEach((topic) => {
      topic.topics.forEach((minorTopic) => {
        if (completedTopics.indexOf(minorTopic.title) !== -1) {
          completed.push(
            this._generateCompletedTopic(minorTopic.link, minorTopic.title),
          );
        }
      });
    });
    return completed;
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

  /**
   * @param {String} identifier the ID of the dom target
   */
  _findTarget(identifier) {
    this.domTarget = document.querySelector(`#${identifier}`);
  }
}
