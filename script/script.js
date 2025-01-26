function toggleMenu() {
    let navLinks = document.getElementById('navLinks');
    let hamburger = document.querySelector('.hamburger');

    navLinks.classList.toggle('show');

    hamburger.classList.toggle('active');
}

document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById('sendMessage').addEventListener('click', function() {
        var notification = document.createElement('div');
        notification.className = 'notification';  
        notification.innerHTML = 'Your message was sent';  

        document.body.appendChild(notification);  

        
        setTimeout(function() {
            notification.remove();
        }, 3500); 
    });
});