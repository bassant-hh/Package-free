document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-search');
  const input = document.getElementById('search-input');
  const list = document.getElementById('search-suggestions');

  if (!input || !list) return; 
  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      input.style.display = input.style.display === 'block' ? 'none' : 'block';
      input.focus();
      list.style.display = 'none'; 
    });
  }

  function handleSearch() {
    const value = input.value.trim();
    if (!value) {
      list.innerHTML = '';
      list.style.display = 'none';
      return;
    }

    fetch(`http://localhost:8000/search/${encodeURIComponent(value)}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(response => {
        const results = response.data || [];
        list.innerHTML = '';

        if (results.length === 0) {
          const li = document.createElement('li');
          li.innerHTML = `<i class="bi bi-x-circle"></i> No Search Result  `; 
          li.style.color = '#888';
          li.style.textAlign = 'center';
          li.style.padding = '10px';
          li.style.cursor = 'default'; 
          list.appendChild(li);
        } else {
          results.forEach(product => {
            const li = document.createElement('li');
            li.textContent = product.name;
            li.style.cursor = 'pointer';
            li.style.padding = '5px 10px';
            li.onclick = () => {
              window.location.href = `${document.is_home ? 'pages/':''}single-product.html?id=${product.id}`;
            };
            list.appendChild(li);
          });
        }

        list.style.display = 'block';
      })
      .catch(err => {
        console.error('Search fetch error:', err);
        list.innerHTML = '';
        list.style.display = 'none';
      });
  }

  input.addEventListener('input', debounce(handleSearch, 300));
});
