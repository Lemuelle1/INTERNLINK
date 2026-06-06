function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function loadOpportunities() {
  requireAuth();
  const errorEl = document.getElementById('opportunity-error');
  const listEl = document.getElementById('opportunity-list');
  const countEl = document.getElementById('opportunity-count');
  errorEl.textContent = '';
  listEl.innerHTML = '';

  try {
    const response = await fetch('/api/internships', {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (response.status === 401) {
      return redirectToLogin();
    }
    const internships = await response.json();
    if (!Array.isArray(internships)) {
      throw new Error('Invalid data');
    }
    window.opportunitiesData = internships;
    countEl.textContent = `${internships.length} opportunities found`;
    renderOpportunities(internships);
  } catch (error) {
    errorEl.textContent = 'Unable to load internships.';
  }
}

function createOpportunityCard(item) {
  const tags = item.tags.map((tag) => `<span class='tag'>${tag}</span>`).join(' ');
  return `
    <article class='card'>
      <div class='flex items-center justify-between'>
        <span class='badge'>${item.company.charAt(0)}</span>
        <span class='tag'>Internship</span>
      </div>
      <h3 class='mt-4 text-xl font-semibold text-white'>${item.title}</h3>
      <p class='mt-2 text-slate-400'>${item.shortDescription}</p>
      <div class='mt-5 space-y-2 text-sm text-slate-400'>
        <p>${item.location}</p>
        <p>${item.salary} • Due ${formatDate(item.dueDate)}</p>
      </div>
      <div class='mt-4 flex flex-wrap gap-2'>${tags}</div>
      <div class='mt-4 flex items-center justify-between'>
        <span class='text-sm text-slate-300'>${item.matchPercentage}% match</span>
        <button onclick='alert("Application flow coming soon.")' class='btn-primary text-sm'>Apply →</button>
      </div>
    </article>
  `;
}

function renderOpportunities(items) {
  const listEl = document.getElementById('opportunity-list');
  listEl.innerHTML = items.map(createOpportunityCard).join('');
}

function applyOpportunityFilter() {
  const searchValue = document.getElementById('opportunity-search').value.toLowerCase();
  const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'All';
  const filtered = window.opportunitiesData.filter((item) => {
    const matchesSearch = [item.title, item.company, item.shortDescription, item.location, ...item.tags]
      .join(' ')
      .toLowerCase()
      .includes(searchValue);
    const matchesFilter = activeFilter === 'All' || item.tags.includes(activeFilter) || item.title.includes(activeFilter) || item.company.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });
  document.getElementById('opportunity-count').textContent = `${filtered.length} opportunities found`;
  renderOpportunities(filtered);
}

window.addEventListener('DOMContentLoaded', () => {
  loadOpportunities();
  document.getElementById('opportunity-search')?.addEventListener('input', applyOpportunityFilter);
  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      applyOpportunityFilter();
    });
  });
});
