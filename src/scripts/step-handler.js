import {
  homePageUpdates as completedTopicsHp,
  summaryPageUpdates as completedTopicsSummary,
} from './completed-topics';
import addSelectedClass from './reapply-selected';

export default () => {
  window.addEventListener('labelbusterPageChange', ({ detail: { page } }) => {
    if (page === 0) {
      completedTopicsHp();
    }

    if (page === 3) {
      addSelectedClass();
    }

    if (page === 4) {
      completedTopicsSummary();
    }
  });
};
