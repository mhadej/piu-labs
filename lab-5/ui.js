export function initUI(store) {
    const addSquareBtn = document.getElementById('addSquare');
    const addCircleBtn = document.getElementById('addCircle');
    const recolorSquaresBtn = document.getElementById('recolorSquares');
    const recolorCirclesBtn = document.getElementById('recolorCircles');
    const shapesContainer = document.getElementById('shapesContainer');
    const squareCountEl = document.getElementById('squareCount');
    const circleCountEl = document.getElementById('circleCount');

    addSquareBtn.addEventListener('click', () => store.addSquare());
    addCircleBtn.addEventListener('click', () => store.addCircle());
    recolorSquaresBtn.addEventListener('click', () => store.recolorSquares());
    recolorCirclesBtn.addEventListener('click', () => store.recolorCircles());

    shapesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('shape')) {
            const id = e.target.dataset.id;
            e.target.classList.add('removing');
            setTimeout(() => {
                store.removeShape(id);
            }, 200);
        }
    });

    store.subscribe((state) => {
        squareCountEl.textContent = store.squareCount;
        circleCountEl.textContent = store.circleCount;

        shapesContainer.innerHTML = '';
        state.shapes.forEach((shape) => {
            const div = document.createElement('div');
            div.className = `shape ${shape.type}`;
            div.style.backgroundColor = shape.color;
            div.dataset.id = shape.id;
            shapesContainer.appendChild(div);
        });
    });
}
