// Dynamic copyright year
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Keyboard shortcuts [1] - [5] for social links
const shortcutLinks = new Map();
document.querySelectorAll('a[data-key]').forEach((link) => {
    shortcutLinks.set(link.dataset.key, link);
});

document.addEventListener('keydown', (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;

    const tag = event.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target?.isContentEditable) return;

    const targetLink = shortcutLinks.get(event.key);
    if (!targetLink) return;

    targetLink.classList.add('is-triggered');
    setTimeout(() => targetLink.classList.remove('is-triggered'), 250);

    window.open(targetLink.href, '_blank', 'noopener,noreferrer');
});