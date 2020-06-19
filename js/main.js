$(document).ready(function(){
    const currentUser = localStorage.getItem('loggedUser')
    if(!currentUser){
        return window.location.href = 'login.html'
    }

    const firstName = JSON.parse(currentUser).fullName.split(' ')[0]
    document.getElementById('userName').innerHTML = firstName;

    if (!localStorage.getItem('daily')) {
        const data = [
            { id: 0, type: 'logs', name: 'Peso', icon: 'weight', weekdays: [1, 1, 1, 1, 1, 1, 1], hour: ['07:30'], made: false },
            { id: 1, type: 'sports', name: 'Corrida', icon: 'dumbbell', weekdays: [0, 1, 1, 1, 1, 1, 0], hour: ['08:00', '10:00'], made: false },
            { id: 2, type: 'logs', name: 'Pressão arterial', icon: 'heart', weekdays: [1, 1, 1, 1, 1, 1, 1], hour: ['12:30'], made: false },
        ]
        const parsed = JSON.stringify(data)
        localStorage.setItem('daily', parsed);
    }
})

function exit(){
    localStorage.removeItem('loggedUser');
    window.location.href = '/login.html'
}