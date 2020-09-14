export default () => {
    window.addEventListener('labelbusterPageChange', ({ detail: { page } }) => {

        if (page === 0) {
            const buttons = document.querySelectorAll('.actionButton');
            localStorage.setItem('animalPestAccessed', true)
            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.target.dispatchEvent(new CustomEvent('labelbusterGoToNext', { bubbles: true }))
                    localStorage.setItem('animalPestAccessed', false)
                })
            })

            if ((localStorage.getItem('animalPestAccessed'))) {
                console.log("Inside false", localStorage.getItem('animalPestAccessed'));
                const completedSection = document.querySelector('.alert-instructions');
                completedSection.style.display = "none";
            }
        }

        if (page === 4) {
            const visitPage = document.querySelectorAll('.visitAgain');
            localStorage.setItem('animalPestAccessed', true);
            visitPage.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.target.dispatchEvent(new CustomEvent('gotoPage', {
                        bubbles: true, detail: {
                            page: 1
                        }
                    }))
                })
            })
        }
    });
}
