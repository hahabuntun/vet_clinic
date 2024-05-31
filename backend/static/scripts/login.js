
$(document).ready(function() {
    $('#loginForm').submit(async function(event) {
    event.preventDefault();
    const login = $('#login').val();
    const password = $('#password').val();
    const type = $('#type').val();
    const loginUrl = type === 'worker' ? '/worker_login' : '/client_login';
    try {
        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: login, password })
        });
        if (response.status == 200) {
          const responseData = await response.json();
          window.location.href = responseData.redirect_url;
        } else {
          const errorData = await response.json();
          alert(errorData.error || 'Ошибка входа. Пожалуйста, попробуйте снова.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Ошибка входа. Проверьте подключение к сети.');
    }
    });
});