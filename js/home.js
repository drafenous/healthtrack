const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

$(document).ready(async function(){
    // localStorage.removeItem('daily')
    if(!localStorage.getItem('daily')){
        const data = [
            {id: 0, type: 'logs', name: 'Peso', icon: 'weight', weekdays: [1, 1, 1, 1, 1, 1, 1], hour: ['07:30'], made: false},
            {id: 1, type: 'sports', name: 'Corrida', icon: 'dumbbell', weekdays: [0,1, 1, 1, 1, 1, 0], hour: ['08:00', '10:00'], made: false},
            {id: 2, type: 'logs', name: 'Pressão arterial', icon: 'heart', weekdays: [1, 1, 1, 1, 1, 1, 1], hour: ['12:30'], made: false},
        ]
        const parsed = JSON.stringify(data)
        localStorage.setItem('daily', parsed);
    }

    await loadData()
})

function loadData(today = null){
    if(!today){
        today = JSON.parse(localStorage.getItem('daily'))
    }

    $('#dailyActivities').html('');
    today.map(data => {
        const dow = moment().isoWeekday()
        if(data.weekdays[dow] == 1){
            const html = htmlDaily(data);
            $('#dailyActivities').append(html)
        }
    })

    $('.made').unbind('click').on('click', async event => {
        const btn = event.target;
        btn.setAttribute('disabled', true)
        await setAsMade(btn);
        btn.removeAttribute('disabled')
    })

    $('.cancel').unbind('click').on('click', async event => {
        const btn = event.target;
        btn.setAttribute('disabled', true)
        await cancelActivitie(btn);
        btn.removeAttribute('disabled')
    })
}

async function setAsMade(element){
    const id = Number(element.closest('.card').getAttribute('activity-id'))
        
    let ls = JSON.parse(localStorage.getItem('daily'))
    ls.forEach(item => {
        if(item.id == id){
            item.made ? (item.made = false) : (item.made = true);
        }
    })
    const parsed = JSON.stringify(ls)
    localStorage.setItem('daily', parsed)
    await loadData(ls);
}

function htmlDaily(data){
    const week = data.weekdays.map((day, index) => {
        if(day == 1){
            return weekdays[index]
        }
    }).filter(day => {
        if(day){
            return day
        }
    })

    const hourClass = checkHour(data);

    const html = `
    <div class="card mt-3 ${data.made ? 'maded' : ''}" activity-id=${data.id}>
        <div class="card-body">
            <h5 class="card-title"> <i class="fas fa-${data.icon} fa-fw"></i> ${data.type == 'sports' ? 'Exercício' : 'Registrar'}: ${data.name}</h5>
            <p class="card-text">
                <strong>Dias da Semana:</strong> ${week.length == 7 ? 'Todos' : week.join(', ')}.<br />
                <span class="${hourClass ? 'afterHour' : ''}"><strong>Horário:</strong> ${data.hour.length == 2 ? data.hour[0] + ' até ' + data.hour[1] : data.hour[0]}</span>
            </p>
            <div class="row">
                <div class="col-6 text-left">
                    <button class="btn btn-success made" type="button"><i class="fas fa-check"></i> ${data.made ? 'Feito!' : 'Realizar Tarefa'}</button>
                </div>
                ${data.made == false ? '<div class="col-6 text-right"><button class="btn btn-danger cancel" type="button"><i class="fas fa-times"></i> Cancelar</button></div>' : ''}
            </div>
        </div>
    </div>
    `;
    return html
}

function checkHour(data){
    const hour = moment(data.hour.length == 2 ? data.hour[1] : data.hour[0], 'HH:mm');
    const isAfter = moment().isAfter(hour, 'minute')
    const validation = (isAfter == true && data.made == false)
    return validation
}

function cancelActivitie(element){
    const card = element.closest('.card');
    const id = Number(card.getAttribute('activity-id'))
    let ls = JSON.parse(localStorage.getItem('daily'))
    const filtered = ls.filter(item => {
        return item.id !== id
    })
    const parsed = JSON.stringify(filtered)
    localStorage.setItem('daily', parsed)
    card.remove()
}