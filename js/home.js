const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

$(document).ready(async function(){
    await loadData()
})

function loadData(items = null){
    if(!items){
        items = JSON.parse(localStorage.getItem('daily'))
    }

    $('#dailyActivities').html('');
    items.map(data => {
        const dow = moment().isoWeekday()
        if(data.weekdays){
            if(data.weekdays[dow] == 1){
                const html = htmlDaily(data);
                $('#dailyActivities').append(html)
            }
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
    let week;
    if(data.weekdays){
        week = data.weekdays.map((day, index) => {
            if (day >= 1) {
                return weekdays[index]
            }
        }).filter(day => {
            if (day) {
                return day
            }
        }).join(', ')
    }else{
        week = 'Nenhum'
    }

    const hourClass = checkHour(data);

    const html = `
    <div class="card mt-3 ${data.made ? 'maded' : ''}" activity-id=${data.id}>
        <div class="card-body">
            <h5 class="card-title"> <i class="fas fa-${data.icon} fa-fw"></i> ${data.type == 'sports' ? 'Exercício' : 'Registrar'}: ${data.name}</h5>
            <p class="card-text">
                <strong>Dias da Semana:</strong> ${week}.<br />
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