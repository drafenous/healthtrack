const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

$(document).ready(async function () {
    await loadData()

    $('.modal').on('hidden.bs.modal', function (e) {
        document.getElementById('modalForm').setAttribute('currentId', '');
        let checkboxes = document.querySelectorAll('.modal input[type=checkbox]')
        checkboxes.forEach(checkbox => (checkbox.checked = false))
        $('.modal input[type=text], .modal input[type=time]').val('')
    })

    $('#newItem').on('click', function (e) {
        handleNewItem();
        $('.modal').modal('show')
    })
})

function loadData(items = null) {
    if (!items) {
        items = JSON.parse(localStorage.getItem('daily'))
    }

    $('#dailyActivities').html('');
    items.map(data => {
        if (data.type == 'logs' && data.name == 'Peso') {
            const html = htmlDaily(data);
            $('#dailyActivities').append(html)
        }
    })

    $('.edit').unbind('click').on('click', async event => {
        const btn = event.target;
        btn.setAttribute('disabled', true)
        await openEditModal(btn);
        btn.removeAttribute('disabled')
    })

    $('.delete').unbind('click').on('click', async event => {
        const btn = event.target;
        btn.setAttribute('disabled', true)
        await deleteActivitie(btn);
        btn.removeAttribute('disabled')
    })
}

function htmlDaily(data) {
    let week;
    if (data.weekdays) {
        week = data.weekdays.map((day, index) => {
            if (day == 1) {
                return weekdays[index]
            }
        }).filter(day => {
            if (day) {
                return day
            }
        }).join(', ')
    } else {
        week = 'Nenhum'
    }

    const html = `
    <div class="card mt-3 ${data.made ? 'maded' : ''}" activity-id=${data.id}>
        <div class="card-body">
            <h5 class="card-title"> <i class="fas fa-${data.icon} fa-fw"></i> ${data.type == 'sports' ? 'Exercício' : 'Registrar'}: ${data.name}</h5>
            <p class="card-text">
                <strong>Dias da Semana:</strong> ${week}.<br />
                <strong>Horário:</strong> ${data.hour.length == 2 ? data.hour[0] + ' até ' + data.hour[1] : data.hour[0]}
            </p>
            <div class="row">
                <div class="col-12 text-right">
                    <button class="btn btn-info edit" type="button"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-danger delete" type="button"><i class="fas fa-trash-alt"></i> Excluir</button>
                </div>
            </div>
        </div>
    </div>
    `;
    return html
}

function openEditModal(element) {
    const card = element.closest('.card');
    const id = Number(card.getAttribute('activity-id'))
    document.getElementById('modalForm').setAttribute('currentId', id);
    let ls = JSON.parse(localStorage.getItem('daily'))
    const item = ls.filter(item => {
        return item.id === id
    })[0]

    $('#start_date').val(item.hour[0])

    let checkboxes = $('input[type=checkbox]')
    if (item.weekdays) {
        item.weekdays.forEach((day, index) => {
            if (day == 1) {
                checkboxes[index].checked = true
            } else {
                checkboxes[index].checked = false
            }
        })
    } else {
        checkboxes.checked = false
    }

    // open modal
    $('.modal').modal('show');

    $('#modalForm').unbind('submit').on('submit', async function (event) {
        event.preventDefault()
        const form = event.target.closest('form');
        const serializeArray = $(form).serializeArray()
        const mapped = objectifyForm(serializeArray, id)

        var ls = JSON.parse(localStorage.getItem('daily'))
        ls = ls.filter(item => {
            return (item.id != id)
        })
        ls = [...ls, mapped]
        localStorage.setItem('daily', JSON.stringify(ls));

        await loadData(ls)

        $('.modal').modal('hide');
    })
}

function deleteActivitie(element) {
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

function objectifyForm(formArray, id) {//serialize data function
    var returnArray = { id: id, type: 'logs', name: 'Peso', icon: 'weight', weekdays: [], hour: [], made: false };
    for (var i = 0; i < formArray.length; i++) {
        if (formArray[i]['name'] == 'weekdays' || formArray[i]['name'] == 'hour') {
            if (formArray[i]['name'] == 'weekdays') {
                formArray[i]['value'] = Number(formArray[i]['value'])
            }
            returnArray[formArray[i]['name']] = [...returnArray[formArray[i]['name']], formArray[i]['value']];
        } else {
            returnArray[formArray[i]['name']] = formArray[i]['value'];
        }
    }

    let array = [0, 0, 0, 0, 0, 0, 0]
    returnArray.weekdays = returnArray.weekdays.map((day, index, arr) => {
        if (day > 0) {
            array[day] = 1
        } else {
            array[day] = 0
        }
        return array
    })[0]
    return returnArray;
}

function handleNewItem(){
    $('#modalForm').unbind('submit').on('submit', async function (event) {
        event.preventDefault()
        const form = event.target.closest('form');
        var ls = JSON.parse(localStorage.getItem('daily'))
        const serializeArray = $(form).serializeArray()
        const mapped = objectifyForm(serializeArray, ls.length + 1)

        ls = [...ls, mapped]

        localStorage.setItem('daily', JSON.stringify(ls));

        await loadData(ls)

        $('.modal').modal('hide');
    })
}