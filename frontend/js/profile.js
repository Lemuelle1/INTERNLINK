document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadProfileData();
});

async function loadProfileData() {
    const token = localStorage.getItem('token');
    
    try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
                'x-auth-token': token
            }
        });
        
        if (res.ok) {
            const user = await res.json();
            
            // Populate data if elements exist
            const profileName = document.getElementById('profileName');
            if (profileName) profileName.textContent = user.name;
            
            const profileImage = document.getElementById('profileImage');
            if (profileImage) {
                const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
                profileImage.textContent = initials;
            }
            
            // Update skills if they come from DB
            const skillsContainer = document.getElementById('skillsContainer');
            if (skillsContainer && user.skills && user.skills.length > 0) {
                skillsContainer.innerHTML = '';
                user.skills.forEach(skill => {
                    const span = document.createElement('span');
                    span.className = 'bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium';
                    span.textContent = skill;
                    skillsContainer.appendChild(span);
                });
            }
        }
    } catch (err) {
        console.error('Error loading profile:', err);
    }
}
