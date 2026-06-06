document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadOpportunities();
});

// ── Toast notification helper ──────────────────────────────────────
function showToast(message, type = 'success') {
    // Remove any existing toast
    const existing = document.getElementById('toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'toast-notification';
    const bgColor = type === 'success'
        ? 'background: linear-gradient(135deg, #6366f1, #8b5cf6);'
        : type === 'error'
            ? 'background: linear-gradient(135deg, #ef4444, #dc2626);'
            : 'background: linear-gradient(135deg, #f59e0b, #d97706);';

    toast.style.cssText = `
        position: fixed; bottom: 24px; right: 24px; z-index: 9999;
        padding: 14px 24px; border-radius: 12px; color: #fff;
        font-weight: 600; font-size: 14px;
        ${bgColor}
        box-shadow: 0 8px 32px rgba(0,0,0,0.25);
        animation: slideInToast 0.4s cubic-bezier(.21,1.02,.73,1) forwards;
    `;
    toast.textContent = message;

    // Inject animation keyframes if not already present
    if (!document.getElementById('toast-keyframes')) {
        const style = document.createElement('style');
        style.id = 'toast-keyframes';
        style.textContent = `
            @keyframes slideInToast {
                from { opacity: 0; transform: translateY(20px) scale(0.95); }
                to   { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes slideOutToast {
                from { opacity: 1; transform: translateY(0) scale(1); }
                to   { opacity: 0; transform: translateY(20px) scale(0.95); }
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutToast 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ── Load opportunities (internships) ───────────────────────────────
async function loadOpportunities() {
    const container = document.getElementById('opportunitiesContainer');
    const token = localStorage.getItem('token');

    try {
        const res = await fetch('http://localhost:5000/api/internships', {
            headers: { 'x-auth-token': token }
        });

        if (!res.ok) {
            throw new Error(`Server responded with ${res.status}`);
        }

        const internships = await res.json();

        container.innerHTML = '';

        if (!internships.length) {
            container.innerHTML = `
                <div class="col-span-3 text-center py-16">
                    <i class="fas fa-briefcase text-5xl text-gray-300 mb-4"></i>
                    <p class="text-gray-500 text-lg">No internships available at the moment.</p>
                    <p class="text-gray-400 text-sm mt-1">Check back later for new opportunities!</p>
                </div>`;
            return;
        }

        internships.forEach(job => {
            const date = new Date(job.dueDate).toLocaleDateString();

            let matchColor = 'bg-green-100 text-green-700';
            if (job.matchPercentage < 80) matchColor = 'bg-yellow-100 text-yellow-700';
            if (job.matchPercentage < 60) matchColor = 'bg-gray-100 text-gray-700';

            const initial = job.company.charAt(0).toUpperCase();

            const card = document.createElement('div');
            card.className = 'glass-card rounded-xl p-6 hover-lift flex flex-col h-full';
            card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                            ${initial}
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900 leading-tight">${job.title}</h3>
                            <p class="text-sm text-indigo-600 font-medium">${job.company}</p>
                        </div>
                    </div>
                    <span class="px-2 py-1 ${matchColor} text-xs font-bold rounded-full">${job.matchPercentage}% Match</span>
                </div>

                <div class="space-y-2 mb-4 flex-1">
                    <p class="text-sm text-gray-600 flex items-center"><i class="fas fa-map-marker-alt w-5 text-gray-400"></i> ${job.location}</p>
                    <p class="text-sm text-gray-600 flex items-center"><i class="fas fa-money-bill-wave w-5 text-gray-400"></i> ${job.salary || 'Unpaid'}</p>
                    <p class="text-sm text-gray-600 flex items-center"><i class="far fa-calendar-alt w-5 text-gray-400"></i> Apply by ${date}</p>
                </div>

                <div class="flex flex-wrap gap-2 mb-6">
                    ${job.tags.map(tag => `<span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">${tag}</span>`).join('')}
                </div>

                <div class="flex space-x-3 mt-auto">
                    <button onclick="applyForInternship('${job._id}')" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors">Apply Now</button>
                    <button onclick="saveInternship('${job._id}')" class="w-10 flex items-center justify-center border border-gray-300 rounded-lg text-gray-500 hover:text-indigo-600 hover:border-indigo-600 transition-colors">
                        <i class="far fa-bookmark"></i>
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error('Error loading opportunities', err);
        container.innerHTML = `
            <div class="col-span-3 text-center py-16">
                <i class="fas fa-exclamation-triangle text-5xl text-red-300 mb-4"></i>
                <p class="text-red-500 text-lg">Failed to load opportunities.</p>
                <p class="text-gray-400 text-sm mt-1">Make sure the backend server is running on port 5000.</p>
            </div>`;
    }
}

// ── Apply for an internship ────────────────────────────────────────
async function applyForInternship(id) {
    const token = localStorage.getItem('token');

    try {
        const res = await fetch(`http://localhost:5000/api/internships/${id}/apply`, {
            method: 'POST',
            headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        if (res.ok) {
            showToast('Application submitted successfully! 🚀', 'success');
        } else {
            showToast(data.msg || 'Error applying', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Server error — please try again later', 'error');
    }
}

// ── Save an internship ────────────────────────────────────────────
async function saveInternship(id) {
    const token = localStorage.getItem('token');

    try {
        const res = await fetch('http://localhost:5000/api/saved-jobs', {
            method: 'POST',
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ opportunityId: id, opportunityType: 'Internship' })
        });
        const data = await res.json();
        if (res.ok) {
            showToast('Job saved! 🔖', 'success');
        } else {
            showToast(data.msg || 'Error saving job', 'warning');
        }
    } catch (err) {
        console.error(err);
        showToast('Server error — please try again later', 'error');
    }
}
