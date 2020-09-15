import {
    homePageUpdates as completedTopicsHp, summaryPageUpdates as completedTopicsSummary,
} from './completed-topics';


export default () => {
    window.addEventListener('labelbusterPageChange', ({ detail: { page } }) => {
        if (page === 0) {
            completedTopicsHp();
        }

        if (page === 4) {
            completedTopicsSummary();
        }
    });
};
