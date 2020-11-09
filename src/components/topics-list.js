import { html, render, nothing } from 'lit-html';
import { Environment } from '../environment';

export class TopicsList {
  constructor(target, storage) {
    this.target = target;
    this.domTarget = undefined;
    this.storage = storage;
    this.storageName = 'completedTopics';
    const environment = new Environment();

    this.allTopics = [
      {
        name: 'People',
        topics: [
          {
            title: 'Skills and knowledge',
            form: `${environment.url}/skillsandknowledge`,
            image: 'https://www.qld.gov.au/?a=140634',
          },
          {
            title: 'Health and hygiene',
            form: `${environment.url}/healthandhygiene`,
            image: 'https://www.qld.gov.au/?a=140674',
          },
        ],
      },
      {
        name: 'Process',
        topics: [
          {
            title: 'Receive food',
            form: `${environment.url}/fesrqwsyzlbtegd/receivefood`,
            image: 'https://www.qld.gov.au/?a=140652',
          },
          {
            title: 'Store food',
            form: `${environment.url}/storefood`,
            image: 'https://www.qld.gov.au/?a=140651',
          },
          {
            title: 'Prepare food',
            form: `${environment.url}/preparefood`,
            image: 'https://www.qld.gov.au/?a=140672',
          },
          {
            title: 'Display and serve food',
            form: `${environment.url}/displayandservefood`,
            image: 'https://www.qld.gov.au/?a=140675',
          },
          {
            title: 'Transport food',
            form: `${environment.url}/transportfood`,
            image: 'https://www.qld.gov.au/?a=140646',
          },
          {
            title: 'Complaints and recall',
            form: `${environment.url}/complaintsandrecall`,
            image: 'https://www.qld.gov.au/?a=140671',
          },
        ],
      },
      {
        name: 'Premises and equipment',
        topics: [
          {
            title: 'Animals and pests',
            form: `${environment.url}/animalsandpests`,
            image: 'https://www.qld.gov.au/?a=140677',
          },
          {
            title: 'Clean and santise',
            form: `${environment.url}/cleanandsantise`,
            image: 'https://www.qld.gov.au/?a=140676',
          },
          {
            title: 'Maintenance',
            form: `${environment.url}/kyfbmaintenance`,
            image: 'https://www.qld.gov.au/?a=140673',
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

    this._findTarget(this.target);

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

    return html`${renderTopics} ${renderFinishedTopics}`;
  }

  /**
   * @param {Array} allTopics the full topics list
   * @param {Array} completedTopics the list of completed topics titles
   * @return {HTMLTemplateElement}
   */
  _renderTopics(allTopics, completedTopics) {
    return allTopics.map((topic) => {
      const filtered = topic.topics.filter(
        minorTopic => completedTopics.indexOf(minorTopic.title) === -1,
      );

      const articles = filtered.map((minorTopic) => {
        if (completedTopics.indexOf(minorTopic.title) === -1) {
          return this._generateNewArticle(
            minorTopic.image,
            minorTopic.form,
            minorTopic.title,
          );
        }
        return nothing;
      });

      if (!articles.length) return nothing;
      return html`
        <h3>${topic.name}</h3>
        <section class="row qg-cards cards__equal-height">${articles}</section>
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
            this._generateCompletedTopic(minorTopic.form, minorTopic.title),
          );
        }
      });
    });
    return completed;
  }

  /**
   * @param {String} image url to image
   * @param {String} form url of form to load
   * @param {String} title title of the topic
   * @return {HTMLTemplateElement}
   */
  // eslint-disable-next-line class-methods-use-this
  _generateNewArticle(image, form, title) {
    return html`<article
      class="qg-card card__light-theme col-12 col-sm-6 col-lg-4"
    >
      <div class="content">
        <img src="${image}" alt="${title}" />
        <div class="qg-card__footer">
          <button
            @click=${this.loadNewForm}
            class="qg-btn btn-link"
            data-form=${form}
            data-title=${title}
          >
            ${title}
          </button>
        </div>
      </div>
    </article>`;
  }

  /**
   * @param {String} form the url for an anchor
   * @param {String} title the title of the completed topic
   * @return {HTMLTemplateElement}
   */
  // eslint-disable-next-line class-methods-use-this
  _generateCompletedTopic(form, title) {
    return html` <li>
      <button @click=${this.loadNewForm} data-form=${form} class="btn btn-link">
        ${title}
      </button>
    </li>`;
  }

  /**
   * @param {Object} event the triggered event from click
   */
  // eslint-disable-next-line class-methods-use-this
  loadNewForm(event) {
    if (!event.target.dataset.form) return;
    const newEvent = new CustomEvent('kyfb-topic-change', {
      bubbles: true,
      detail: {
        topic: event.target.dataset.form,
        title: event.target.dataset.title,
      },
    });
    window.dispatchEvent(newEvent);
  }

  /**
   * @param {String} identifier the ID of the dom target
   */
  _findTarget(identifier) {
    this.domTarget = document.querySelector(`#${identifier}`);
  }
}
