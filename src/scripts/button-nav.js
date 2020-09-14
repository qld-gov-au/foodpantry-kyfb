export default () => {
    window.addEventListener('labelbusterPageChange', ({ detail: { page } }) => {
        if (page === 0) {
            const buttons = document.querySelectorAll('.actionButton');
            buttons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.target.dispatchEvent(new CustomEvent('goToNextPage', { bubbles: true }))
                })
            })
        }
    })
}
