document.addEventListener('DOMContentLoaded', () => {
    const blogContainer = document.getElementById('blog-container');

    if (blogContainer && typeof blogPosts !== 'undefined') {
        blogPosts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.className = 'blog-card';

            postElement.innerHTML = `
                <div class="blog-image">
                    <img src="${post.image}" alt="${post.title}">
                </div>
                <div class="blog-content">
                    <div class="blog-date">${post.date}</div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.content}</p>
                </div>
            `;

            blogContainer.appendChild(postElement);
        });
    }
});
