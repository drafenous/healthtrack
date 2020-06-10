$(document).ready(function () {
    const data = JSON.parse(localStorage.getItem('daily'))
    const sports = data.filter(item =>  item.type == 'sports');
    const weight = data.filter(item =>  (item.type == 'logs' && item.name == 'Peso'));
    const heart = data.filter(item =>  (item.type == 'logs' && item.name == 'Pressão arterial'));

    const types = {sports, weight, heart}

    let weekActivities = {
        sports: [0,0,0,0,0,0,0],
        weight: [0,0,0,0,0,0,0],
        heart: [0,0,0,0,0,0,0]
    }
    for(let key in types){
        types[key].forEach(item => {
            item.weekdays.forEach((day, index) => {
                if(day == 1){
                    weekActivities[key][index]++
                }
            })
        })
    }

    const datasets = [
        {
            label: 'Exercícios',
            backgroundColor: 'rgba(22, 160, 133,1.0)',
            data: weekActivities.sports
        },
        {
            label: 'Medição de Peso',
            backgroundColor: 'rgba(142, 68, 173,1.0)',
            data: weekActivities.weight
        },
        {
            label: 'Medição de Pressão Arterial',
            backgroundColor: 'rgba(192, 57, 43,1.0)',
            data: weekActivities.heart
        }
    ]

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
            datasets
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
})