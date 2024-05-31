$.ajaxSetup({
    beforeSend: function(xhr) {
        // Получаем токен аутентификации из локального хранилища
        const authToken = localStorage.getItem('authToken');
        // Если токен существует, устанавливаем заголовок аутентификации
        if (authToken) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + authToken);
        }
    }
})