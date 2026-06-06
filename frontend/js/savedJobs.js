document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadSavedJobs();
});

async function loadSavedJobs() {
    const container = document.getElementById('savedJobsContainer');
    const token = localStorage.getItem('token');
    
    try {
        const res = await fetch('http://localhost:5000/api/saved-jobs', {
            headers: { 'x-auth-token': token }
        });
        const savedJobs = await res.json();
        
        container.innerHTML = '';
        
        if (savedJobs.length === 0) {
            container.innerHTML = '<p class="text-gray-500 col-span-3 text-center py-10">No saved jobs yet.</p>';
            return;
        }

        savedJobs.forEach(saved => {
            const opp = saved.opportunityId;
            if(!opp) return;

            const title = opp.title || opp.name;
            const company = opp.company || opp.provider;
            const initial = company.charAt(0).toUpperCase();

            let colorClass = saved.opportunityType === 'Internship' ? 'bg-indigo-600' : 'bg-purple-600';
            
            const card = document.createElement('div');
            card.className = 'glass-card rounded-xl p-6 hover-lift flex flex-col h-full';
            card.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md">
                            ${initial}
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-900 leading-tight">${title}</h3>
                            <p class="text-sm font-medium text-gray-600">${company}</p>
                        </div>
                    </div>
                    <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">${saved.opportunityType}</span>
                </div>
                
                <div class="space-y-2 mb-6 flex-1 text-sm text-gray-600">
                    ${opp.location ? `<p><i class="fas fa-map-marker-alt w-5 text-gray-400"></i> ${opp.location}</p>` : ''}
                    <p><i class="far fa-calendar-alt w-5 text-gray-400"></i> Deadline: ${new Date(opp.dueDate).toLocaleDateString()}</p>
                </div>
                
                <div class="flex space-x-3 mt-auto">
                    <button onclick="applyForOpportunity('${opp._id}', '${saved.opportunityType}')" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors">Apply Now</button>
                    <button onclick="removeSavedJob('${saved._id}')" class="w-10 flex items-center justify-center border border-red-300 rounded-lg text-red-500 hover:text-white hover:bg-red-500 transition-colors" title="Remove">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error('Error loading saved jobs', err);
        container.innerHTML = '<p class="text-red-500 col-span-3">Failed to load saved jobs.</p>';
    }
}

async function applyForOpportunity(id, type) {
    const token = localStorage.getItem('token');
    const endpoint = type === 'Internship' ? `internships/${id}/apply` : `scholarships/${id}/apply`;
    
    try {
        const res = await fetch(`http://localhost:5000/api/${endpoint}`, {
            method: 'POST',
            headers: { 'x-auth-token': token }
        });
        const data = await res.json();
        if (res.ok) {
            alert('Application submitted successfully!');
        } else {
            alert(data.msg || 'Error applying');
        }
    } catch (err) {
        console.error(err);
        alert('Server error');
    }
}

async function removeSavedJob(id) {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`http://localhost:5000/api/saved-jobs/${id}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': token }
        });
        if(res.ok) {
            loadSavedJobs();
        } else {
            alert('Error removing saved job');
        }
    } catch(err) {
        console.error(err);
        alert('Server error');
    }
}
