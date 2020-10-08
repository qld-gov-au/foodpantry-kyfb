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
            form:
              'https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd/skillsandknowledge',
            image: './kyfb-home-images/Skills-and-knowledge-176606698.jpg',
          },
          {
            title: 'Health and hygiene',
            form:
              'https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd/healthandhygiene',
            image: './kyfb-home-images/Health-and-hygiene-1181710190.jpg',
          },
        ],
      },
      {
        name: 'Process',
        topics: [
          {
            title: 'Recieve food',
            form:
              'https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd/recievefood',
            image: './kyfb-home-images/Recieve-food-868730920.jpg',
          },
          {
            title: 'Store food',
            form:
              'https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd/storefood',
            image: './kyfb-home-images/Transport-1227348008.jpg',
          },
          {
            title: 'Prepare food',
            form:
              'https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd/preparefood',
            image: './kyfb-home-images/Prepare-and-serve-186557945.jpg',
          },
          {
            title: 'Display and serve food',
            form:
              'https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd/displayandservefood',
            image: './kyfb-home-images/Food-display-629986120.jpg',
          },
          {
            title: 'Transport food',
            form:
              'https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd/transportfood',
            image: './kyfb-home-images/Transport-1227348008.jpg',
          },
          {
            title: 'Complaints and recall',
            form:
              'https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd/complaintsandrecall',
            image: './kyfb-home-images/Recalls-and-complaints-1165181144.jpg',
          },
        ],
      },
      {
        name: 'Premises and equipment',
        topics: [
          {
            title: 'Animals and pests',
            form:
              'GET https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd/animalsandpests',
            image: './kyfb-home-images/Animals-and-Pests-1155232061.jpg',
          },
          {
            title: 'Clean and santise',
            form:
              'https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd/cleanandsantise',
            image: './kyfb-home-images/Cleaning-200391212-001.jpg',
          },
          {
            title: 'Maintenance',
            form:
              'https://api.forms.platforms.qld.gov.au/fesrqwsyzlbtegd/kyfbmaintenance',
            image: './kyfb-home-images/Maintenance-1169504170.jpg',
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
            minorTopic.form,
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
    return html`<article class="qg-card col-12 col-sm-6 col-lg-4">
      <div class="content">
        <img src="${image}" alt="${title}" />
        <div class="details">
          <button @click=${this.loadNewForm} class="btn-kyfb" data-form=${form}>
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
      <button
        @click=${this.loadNewForm}
        data-form=${form}
        class="gg-btn btn-link"
      >
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
      detail: { topic: event.target.dataset.form },
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
