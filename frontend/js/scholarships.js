function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function loadScholarships() {
  requireAuth();
  const errorEl = document.getElementById('scholarship-error');
  const listEl = document.getElementById('scholarship-list');
  const countEl = document.getElementById('scholarship-count');
  errorEl.textContent = '';
  listEl.innerHTML = '';

  try {
    const response = await fetch('/api/scholarships', {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (response.status === 401) {
      return redirectToLogin();
    }
    const scholarships = await response.json();
    if (!Array.isArray(scholarships)) {
      throw new Error('Invalid data');
    }
    window.scholarshipsData = scholarships;
    countEl.textContent = `${scholarships.length} opportunities found`;
    renderScholarships(scholarships);
  } catch (error) {
    errorEl.textContent = 'Unable to load scholarships.';
  }
}

function createScholarshipCard(item) {
  const tags = item.tags.map((tag) => `<span class='tag'>${tag}</span>`).join(' ');
  return `
    <article class='card'>
      <div class='flex items-center justify-between'>
        <span class='badge'>${item.name.charAt(0)}</span>
        <span class='tag tag-secondary'>Scholarship</span>
      </div>
      <h3 class='mt-4 text-xl font-semibold text-white'>${item.name}</h3>
      <p class='mt-2 text-slate-400'>${item.shortDescription}</p>
      <div class='mt-5 space-y-2 text-sm text-slate-400'>
        <p>${item.provider}</p>
        <p>${item.amount} • Due ${formatDate(item.dueDate)}</p>
      </div>
      <div class='mt-4 flex flex-wrap gap-2'>${tags}</div>
      <div class='mt-4 flex items-center justify-between'>
        <span class='text-sm text-slate-300'>${item.matchPercentage}% match</span>
        <button onclick='alert("Application flow coming soon.")' class='btn-primary text-sm'>Apply →</button>
      </div>
    </article>
  `;
}

function renderScholarships(items) {
  const listEl = document.getElementById('scholarship-list');
  listEl.innerHTML = items.map(createScholarshipCard).join('');
}

function applyScholarshipFilter() {
  const searchValue = document.getElementById('scholarship-search').value.toLowerCase();
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'All';
  const filtered = window.scholarshipsData.filter((item) => {
    const matchesSearch = [item.name, item.provider, item.shortDescription, ...item.tags]
      .join(' ')
      .toLowerCase()
      .includes(searchValue);
    const matchesFilter = activeFilter === 'All' || item.tags.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });
  document.getElementById('scholarship-count').textContent = `${filtered.length} opportunities found`;
  renderScholarships(filtered);
}

window.addEventListener('DOMContentLoaded', () => {
  loadScholarships();
  document.getElementById('scholarship-search')?.addEventListener('input', applyScholarshipFilter);
  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      applyScholarshipFilter();
    });
  });
});
