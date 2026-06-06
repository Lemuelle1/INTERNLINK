document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadApplications();
});

async function loadApplications() {
    const tbody = document.getElementById('applicationsTableBody');
    const token = localStorage.getItem('token');
    
    try {
        const res = await fetch('http://localhost:5000/api/applications', {
            headers: { 'x-auth-token': token }
        });
        const applications = await res.json();
        
        tbody.innerHTML = '';
        
        let total = applications.length;
        let pending = 0, review = 0, accepted = 0, rejected = 0;
        
        applications.forEach(app => {
            if (app.status === 'pending') pending++;
            else if (app.status === 'reviewed') review++;
            else if (app.status === 'accepted') accepted++;
            else if (app.status === 'rejected') rejected++;

            const date = new Date(app.appliedDate).toLocaleDateString();
            
            // Format status badge
            let statusClass = 'bg-yellow-100 text-yellow-800';
            if (app.status === 'reviewed') statusClass = 'bg-blue-100 text-blue-800';
            else if (app.status === 'accepted') statusClass = 'bg-green-100 text-green-800';
            else if (app.status === 'rejected') statusClass = 'bg-red-100 text-red-800';

            const oppTitle = app.opportunityId ? (app.opportunityId.title || app.opportunityId.name) : 'Unknown';
            const oppCompany = app.opportunityId ? (app.opportunityId.company || app.opportunityId.provider) : 'Unknown';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${oppTitle}</div>
                            <div class="text-sm text-gray-500">${oppCompany}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${app.opportunityType}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${date}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onclick="withdrawApp('${app._id}')" class="text-red-600 hover:text-red-900">Withdraw</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        // Update stats
        if(document.getElementById('totalApp')) document.getElementById('totalApp').textContent = total;
        if(document.getElementById('pendingApp')) document.getElementById('pendingApp').textContent = pending;
        if(document.getElementById('reviewApp')) document.getElementById('reviewApp').textContent = review;
        if(document.getElementById('acceptedApp')) document.getElementById('acceptedApp').textContent = accepted;
        if(document.getElementById('rejectedApp')) document.getElementById('rejectedApp').textContent = rejected;
        
    } catch (err) {
        console.error('Error loading applications', err);
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-red-500">Failed to load applications.</td></tr>';
    }
}

async function withdrawApp(id) {
    if(!confirm('Are you sure you want to withdraw this application?')) return;
    
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`http://localhost:5000/api/applications/${id}/withdraw`, {
            method: 'PUT',
            headers: { 'x-auth-token': token }
        });
        if(res.ok) {
            loadApplications();
        } else {
            alert('Error withdrawing application');
        }
    } catch(err) {
        console.error(err);
        alert('Server error');
    }
}
