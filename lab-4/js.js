let cards = JSON.parse(localStorage.getItem('cards') || '[]');

document.addEventListener('DOMContentLoaded', function () {
    render();

    let addBtns = document.querySelectorAll('.add');
    for (let i = 0; i < addBtns.length; i++) {
        addBtns[i].addEventListener('click', function () {
            let column = addBtns[i].closest('.column').classList[1];
            addCard(column);
        });
    }

    let colorAllBtns = document.querySelectorAll('.color-all');
    for (let i = 0; i < colorAllBtns.length; i++) {
        colorAllBtns[i].addEventListener('click', function () {
            let columnEl = colorAllBtns[i].closest('.column');
            let columnName = columnEl.classList[1];

            for (let j = 0; j < cards.length; j++) {
                if (cards[j].column === columnName) {
                    cards[j].color = randomHsl();
                }
            }

            saveCards();
            render();
        });
    }

    let sortBtns = document.querySelectorAll('.sort');
    for (let i = 0; i < sortBtns.length; i++) {
        sortBtns[i].addEventListener('click', function () {
            let columnName = sortBtns[i].closest('.column').classList[1];
            sortColumn(columnName);
        });
    }

    let clear = document.getElementById('clearall');
    if (clear) {
        clear.addEventListener('click', function () {
            localStorage.clear();
            cards = [];
            render();
        });
    }
});

function addCard(column) {
    let card = {
        id: Date.now(),
        text: '',
        color: randomHsl(),
        column: column,
    };
    cards.push(card);
    saveCards();
    render();
}

function createNoteElement(card) {
    let note = document.createElement('div');
    note.className = 'note';
    note.dataset.id = card.id;
    note.style.backgroundColor = card.color;

    let textarea = document.createElement('textarea');
    textarea.className = 'text';
    textarea.placeholder = 'Tu wpisz treść notatki';
    textarea.value = card.text || '';

    textarea.addEventListener('blur', function () {
        card.text = textarea.value;
        saveCards();
    });

    let buttons = document.createElement('div');
    buttons.className = 'buttons';

    let left = document.createElement('button');
    left.textContent = '←';
    left.className = 'left';

    let right = document.createElement('button');
    right.textContent = '→';
    right.className = 'right';

    let colorBtn = document.createElement('button');
    colorBtn.textContent = 'Koloruj';
    colorBtn.className = 'color';

    let remove = document.createElement('button');
    remove.textContent = 'X';
    remove.className = 'remove';

    if (card.column === 'todo') {
        buttons.appendChild(colorBtn);
        buttons.appendChild(remove);
        buttons.appendChild(right);
    } else if (card.column === 'done') {
        buttons.appendChild(left);
        buttons.appendChild(colorBtn);
        buttons.appendChild(remove);
    } else {
        buttons.appendChild(left);
        buttons.appendChild(colorBtn);
        buttons.appendChild(remove);
        buttons.appendChild(right);
    }

    left.addEventListener('click', function () {
        moveCard(card.id, 'left');
    });
    right.addEventListener('click', function () {
        moveCard(card.id, 'right');
    });
    colorBtn.addEventListener('click', function () {
        card.color = randomHsl();
        note.style.backgroundColor = card.color;
        saveCards();
    });
    remove.addEventListener('click', function () {
        let newCards = [];
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].id !== card.id) newCards.push(cards[i]);
        }
        cards = newCards;
        saveCards();
        render();
    });

    note.appendChild(textarea);
    note.appendChild(buttons);

    return note;
}

function render() {
    let notesContainers = document.querySelectorAll('.notes');
    for (let i = 0; i < notesContainers.length; i++) {
        notesContainers[i].innerHTML = '';
    }

    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        let note = createNoteElement(card);
        let dest = document.querySelector('.' + card.column + ' .notes');
        if (dest) dest.appendChild(note);
    }

    updateCounters();
}

function moveCard(id, direction) {
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].id === id) {
            let order = ['todo', 'doing', 'done'];
            let pos = 0;
            for (let k = 0; k < order.length; k++) {
                if (order[k] === cards[i].column) {
                    pos = k;
                    break;
                }
            }
            if (direction === 'left' && pos > 0) {
                cards[i].column = order[pos - 1];
            } else if (direction === 'right' && pos < order.length - 1) {
                cards[i].column = order[pos + 1];
            }
            break;
        }
    }

    saveCards();
    render();
}

function sortColumn(column) {
    let same = [];
    let other = [];
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].column === column) same.push(cards[i]);
        else other.push(cards[i]);
    }

    for (let i = 0; i < same.length - 1; i++) {
        for (let j = i + 1; j < same.length; j++) {
            let ai = (same[i].text || '').toLowerCase();
            let aj = (same[j].text || '').toLowerCase();
            if (ai > aj) {
                let tmp = same[i];
                same[i] = same[j];
                same[j] = tmp;
            }
        }
    }

    cards = other.concat(same);
    saveCards();
    render();
}

function randomHsl() {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 75%)`;
}

function updateCounters() {
    let todoCount = 0,
        doingCount = 0,
        doneCount = 0;
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].column === 'todo') todoCount++;
        else if (cards[i].column === 'doing') doingCount++;
        else if (cards[i].column === 'done') doneCount++;
    }
    let elTo = document.getElementById('to-do-count');
    let elDo = document.getElementById('doing-count');
    let elDn = document.getElementById('done-count');
    if (elTo) elTo.textContent = todoCount;
    if (elDo) elDo.textContent = doingCount;
    if (elDn) elDn.textContent = doneCount;
}

function saveCards() {
    localStorage.setItem('cards', JSON.stringify(cards));
}
