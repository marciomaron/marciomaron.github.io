async function fetchArticleTitle(filename) {
    try {
        const response = await fetch(`texts/${filename}`);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        return doc.title || filename; // fallback to filename if no title found
    } catch (error) {
        console.error(`Error fetching ${filename}:`, error);
        return null;
    }
}

async function getArticlesList() {
    try {
        const response = await fetch('texts/index.json');
        const files = await response.json();
        
        // Sort files in reverse numerical order for each section
        for (const section in files) {
            files[section].sort((a, b) => {
                const numA = parseInt(a.match(/\d+/)[0]);
                const numB = parseInt(b.match(/\d+/)[0]);
                return numB - numA; // Reverse order (largest first)
            });
        }
        
        return files;
    } catch (error) {
        console.error('Error loading index.json:', error);
        return null;
    }
}

async function loadArticles() {
    const files = await getArticlesList();
    if (!files) return;

    for (const [section, fileList] of Object.entries(files)) {
        const listElement = document.getElementById(`list-${section.toLowerCase()}`);
        if (!listElement) continue;

        for (const file of fileList) {
            const title = await fetchArticleTitle(file);
            if (title) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = `texts/${file}`;
                a.textContent = title;
                li.appendChild(a);
                listElement.appendChild(li);
            }
        }

        // Hide empty sections
        const sectionElement = listElement.parentElement;
        if (!listElement.children.length) {
            sectionElement.style.display = 'none';
        }
    }
}

// Load articles when the DOM is ready
document.addEventListener('DOMContentLoaded', loadArticles); 