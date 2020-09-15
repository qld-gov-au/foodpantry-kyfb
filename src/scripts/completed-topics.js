function hideTile() {
    const animalAndPestsTile = document.querySelector('#animal-pests');
    animalsAndPestsTile.style.display = none;
}

function hideCompletedTopics() {
    const completedSection = document.querySelector('#completed-topics');
    completedSection.style.display = none;
}

function attachStartTopic(node) {
    node.addEventListener('click', (e) => {
        e.target.dispatchEvent(new CustomEvent('gotoPage',
            {
                bubbles: true,
                detail: {
                    page: 1
                }
            }));
    })
}

export function homePageUpdates() {
    const completedAnimalsAndPests = localStorage.getItem('animalsAndPests');
    if (completedAnimalsAndPests) {
        hideTile();
        attachStartTopic(document.querySelector('#completed-topics button'));
    } else {
        hideCompletedTopics();
        attachStartTopic(document.querySelector('#animal-pests button'));
    }
}

export function summaryPageUpdates() {
    localStorage.setItem('animalsAndPests', true);
    attachStartTopic(document.querySelector('#completed-topics button'));
}
