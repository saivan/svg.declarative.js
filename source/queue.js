
export default class Queue {

    constructor () {
        this.first = undefined
        this.last = undefined
        this.length = 0
        this.id = 0
    }

    push (value) {
        let node = {id: this.id++, value : value}
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
        if (this.first) return this.first.value
    }

    peekLast () {
        if (this.last) return this.last.value
    }

    remove (matcher) {

        // Find the first match
        let previous = null, current = this.first
        while (current) {

            // If we have a match, we are done
            if (matcher(current.value)) break

            // Otherwise, advance both of the pointers
            previous = current
            current = current.next
        }

        // If we got the first item, adjust the first pointer
        if (current && current.id == this.first.id)
            this.first = this.first.next

        // If we got the last item, adjust the last pointer
        if (current && current.id == this.last.id)
            this.last = previous

        // If we got an item, fix the list and return the item
        if (current) {
            this.length--
            if (previous) previous.next = current.next
            return current.item
        }
    }
}
