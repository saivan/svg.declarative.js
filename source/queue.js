
export default class Queue {

    constructor () {
        this.first = undefined
        this.last = undefined
        this.length = 0
    }

    push (value) {
        let node = {value : value}
        if (this.last) this.last = this.last.next = node
        else this.last = this.first = node
        this.length++
    }

    shift () {
        if (this.length == 0) return
        let remove = this.first
        this.first = remove.next
        this.last = --this.length ? this.last : undefined
        return remove.value
    }

    peek () {
        if (this.first)
            return this.first.value
    }
}
