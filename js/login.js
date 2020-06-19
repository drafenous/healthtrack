$(document).ready(function () {
    $('#registerForm').on('submit', function (event) {
        event.preventDefault()

        if ($('#register_password').val() !== $('#register_password_confirm').val()) {
            return alert('A senha e a confirmação de senha devem ser iguais.')
        }

        const serializeArray = $('#registerForm').serializeArray()

        var registeredUsers = [];
        const ls = JSON.parse(localStorage.getItem('users'))
        ls !== null ? registeredUsers = [...ls] : registeredUsers = [];

        let id = 0;
        if (registeredUsers) {
            id = registeredUsers.length++
        }

        const newUser = objectifyForm(serializeArray, id);
        registeredUsers = [...registeredUsers, newUser];
        localStorage.setItem('users', JSON.stringify(registeredUsers));
        alert('Cadastrado com sucesso!')
        $('#registerModal').modal('hide')
    })

    $('#login').on('submit', function (event) {
        event.preventDefault();
        const email = document.getElementById('login_email').value
        const password = document.getElementById('login_password').value
        const ls = JSON.parse(localStorage.getItem('users'))
        if (ls) {
            const found = ls.find(user => {
                if (user !== null) {
                    return (user.email == email && user.password == password)
                }
            })
            if (!found) {
                return alert('Usuário e senha não encontrados, se não tem um cadastro, efetue clicando no botão acima.')
            } else {
                localStorage.setItem('loggedUser', JSON.stringify(found))
                window.location.href = 'index.html';
            }
        }else{
            return alert('Ainda não há cadastros no app, efetue o primeiro cadastro clicando no botão acima.')
        }
    })
})

function objectifyForm(formArray, id) {//serialize data function
    var returnArray = { id };
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray
}