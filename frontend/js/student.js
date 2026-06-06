document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadUserData();
});

function loadUserData() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return;
    
    const user = JSON.parse(userStr);
    
    // Update welcome message if element exists
    const welcomeMsg = document.getElementById('welcomeMsg');
    if (welcomeMsg) {
        const firstName = user.name.split(' ')[0];
        welcomeMsg.innerHTML = `Good morning, ${firstName}! 🎉`;
    }
    
    // Update initial
    const userInitial = document.getElementById('userInitial');
    if (userInitial) {
        userInitial.textContent = user.name.charAt(0).toUpperCase();
    }
}
