import { generateId, getRandomColor } from './helpers.js';

class Store {
    constructor() {
        this.state = {
            shapes: [],
        };
        this.subscribers = [];
        this.loadState();
    }

    subscribe(callback) {
        this.subscribers.push(callback);
        callback(this.state);
    }

    notify() {
        this.saveState();
        this.subscribers.forEach((callback) => callback(this.state));
    }

    addSquare() {
        const shape = {
            id: generateId(),
            type: 'square',
            color: getRandomColor(),
        };
        this.state.shapes.push(shape);
        this.notify();
    }

    addCircle() {
        const shape = {
            id: generateId(),
            type: 'circle',
            color: getRandomColor(),
        };
        this.state.shapes.push(shape);
        this.notify();
    }

    removeShape(id) {
        this.state.shapes = this.state.shapes.filter(
            (shape) => shape.id !== id
        );
        this.notify();
    }

    recolorSquares() {
        this.state.shapes = this.state.shapes.map((shape) => {
            if (shape.type === 'square') {
                return { ...shape, color: getRandomColor() };
            }
            return shape;
        });
        this.notify();
    }

    recolorCircles() {
        this.state.shapes = this.state.shapes.map((shape) => {
            if (shape.type === 'circle') {
                return { ...shape, color: getRandomColor() };
            }
            return shape;
        });
        this.notify();
    }

    get squareCount() {
        return this.state.shapes.filter((shape) => shape.type === 'square')
            .length;
    }

    get circleCount() {
        return this.state.shapes.filter((shape) => shape.type === 'circle')
            .length;
    }

    saveState() {
        localStorage.setItem('shapesApp', JSON.stringify(this.state));
    }

    loadState() {
        const saved = localStorage.getItem('shapesApp');
        if (saved) {
            this.state = JSON.parse(saved);
        }
    }
}

export const store = new Store();
