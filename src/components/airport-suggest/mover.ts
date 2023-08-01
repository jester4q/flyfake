export class Mover {
    private index: number = 0;
    private size: number = 0;

    up() {
        if (this.index === 0) {
            return;
        }
        this.index--;
    }

    down() {
        if (this.index - 1 === this.size) {
            return;
        }
        this.index++;
    }

    setSize(size: number) {
        this.size = size;
        if (this.index >= size) {
            this.index = size - 1;
        }
    }

    getIndex() {
        return this.index;
    }
}
