import './style.css'
import * as hyperdom from 'hyperdom'
const h = hyperdom.html
const Hammer = require('hammerjs')

class App {
  onload() {
    this.setInitialState()
  }

  onadd() {
    this.hammer = new Hammer(document.querySelector('#app'))
    this.hammer.add(new Hammer.Pan({ direction: Hammer.DIRECTION_ALL, threshold: 0 }))
    this.hammer.on('pan', this.drag.bind(this))
  }

  setInitialState() {
    const firstcard = { background: 'red', name: 1 }
    this.cards = [firstcard, { background: 'green', name: 2 }, { background: 'blue', name: 3 }]
    this.activeCard = firstcard
    this.activeCardTransform = this.getCardPositionStyle(0, 0, 0)
    this.discardDisplay = 'hide'
    this.keepDisplay = 'hide'
  }

  drag(ev) {
    const dragX_offset = ev.deltaX
    const dragY_offset = ev.deltaY
    let rotation = 4
    if (dragX_offset < 0) rotation = -4
    if (dragX_offset < -70) {
      this.discardDisplay = 'show'
    } else {
      this.discardDisplay = 'hide'
    }
    if (dragX_offset > 70) {
      this.keepDisplay = 'show'
    } else {
      this.keepDisplay = 'hide'
    }
    this.activeCardTransform = this.getCardPositionStyle(dragX_offset, dragY_offset, rotation, 1.03)
    if (ev.isFinal) {
      this.release(ev)
    }
    this.refreshImmediately()
  }

  release(ev) {
    this.keepDisplay = 'hide'
    this.discardDisplay = 'hide'
    if (Math.abs(ev.deltaX) > 300 / 3) {
      this.nextCard()
    } else {
      this.activeCardTransform = this.getCardPositionStyle(0, 0, 0)
    }
  }

  getCardPositionStyle(xPos, yPos, rotation, scale) {
    if (!scale) scale = 1
    return `translate3d(${xPos}px, ${yPos}px, 0) scale3d(${scale},${scale},1) rotate(${rotation}deg)`
  }

  nextCard() {
    this.cards.splice(0, 1)
    if (this.cards.length < 3) {
      this.addMoreCardsToDeck()
    }
    this.activeCardTransform = this.getCardPositionStyle(0, 0, 0)
    this.activeCard = this.cards[0]
  }

  addMoreCardsToDeck() {
    this.cards.push({ name: 'someOtherCard', background: 'blue' })
    this.cards.push({ name: 'Card, yeah?', background: 'pink' })
    this.cards.push({ name: 'another card.', background: 'yellow' })
    this.cards.push({ name: 'THISISACARD!', background: 'green' })
  }

  render() {
    return h(
      'div#app',
      h(
        'ul.card',
        this.cards.map(card => {
          return h(
            'li',
            {
              class: card === this.activeCard ? 'active' : '',
              style:
                card === this.activeCard
                  ? { '-webkit-transform': this.activeCardTransform }
                  : { '-webkit-transform': this.getCardPositionStyle(0, 0, 0) }
            },
            h('h2', { style: { background: card.background } }, card.name),
            h('div', {
              class:
                card === this.activeCard ? `${this.keepDisplay} keep action` : `hide keep action`
            }),
            h('div', {
              class:
                card === this.activeCard
                  ? `${this.discardDisplay} discard action`
                  : `hide discard action`
            })
          )
        })
      )
    )
  }
}

hyperdom.append(document.body, new App())
