import { readLines } from "../utils.ts"
const isTest = Deno.args[0] === "test"
const isDebug = isTest || Deno.args[0] === "debug"
const testResult = 5905

let result = 0

// Integer-type Enum; higher value = stronger hand
enum HandType {
  FiveOfAKind = 7,
  FourOfAKind = 6,
  FullHouse = 5,
  ThreeOfAKind = 4,
  TwoPair = 3,
  OnePair = 2,
  HighCard = 1,
}

class Hand {
  static order = "J23456789TQKA"
  cards: string
  bet: number
  type: HandType

  constructor(cards: string, bet: number) {
    this.cards = cards
    this.bet = bet
    this.type = Hand.detectType(cards)
  }

  isStrongerThan(hand: Hand) {
    if (this.type > hand.type) {
      return true
    }
    if (this.type < hand.type) {
      return false
    }
    for (let i = 0; i < 5; i += 1) {
      const thisCardNumber = Hand.order.indexOf(this.cards[i])
      const otherCardNumber = Hand.order.indexOf(hand.cards[i])
      if (thisCardNumber > otherCardNumber) {
        return true
      }
      if (thisCardNumber < otherCardNumber) {
        return false
      }
    }
    return true
  }

  static detectType(cards: string): HandType {
    const distribution: any = {}
    for (const card of cards) {
      distribution[card] = (distribution[card] || 0) + 1
    }
    let numberOfDifferentCards = Object.keys(distribution).length
    const numberOfCards = Object.values(distribution).sort().reverse()
    // Deal with Joker by adding one to the strongest other card
    // Note the edge case of all Js
    if (distribution["J"] && distribution["J"] !== 5) {
      const jokers = distribution["J"]
      numberOfCards.splice(numberOfCards.findIndex(v => v === jokers), 1)
      numberOfCards[0] = numberOfCards[0] + jokers
      numberOfDifferentCards -= 1
    }
    if (numberOfDifferentCards === 1) {
      return HandType.FiveOfAKind
    }
    if (numberOfDifferentCards === 4) {
      return HandType.OnePair
    }
    if (numberOfDifferentCards === 5) {
      return HandType.HighCard
    }
    if (numberOfDifferentCards === 2) {
      if (numberOfCards[0] === 4) {
        return HandType.FourOfAKind
      } else {
        return HandType.FullHouse
      }
    }
    if (numberOfCards[0] === 3) {
      return HandType.ThreeOfAKind
    }
    return HandType.TwoPair
  }
}

const hands: Hand[] = []

for await (const line of readLines(`./${isTest ? "test" : "input"}.txt`)) {
  if (!line) {
    continue
  }
  const [, cards, bet] = line.match(/^(.*) (\d*)$/) || []
  if (cards === undefined || bet === undefined) {
    throw new Error("Something wrong in line " + line)
  }
  const hand = new Hand(cards, parseInt(bet))
  isDebug && console.log(line, hand)
  hands.push(hand)
}

// Sort hands from weakest to strongs
hands.sort((a, b) => a.isStrongerThan(b) ? 1 : -1)
isDebug && console.log(hands.filter(hand => hand.type === HandType.TwoPair))

for (let i = 0; i < hands.length; i += 1) {
  // rank is index + 1 because we sorted the array
  result += (i + 1) * hands[i].bet
}

console.log(result)

if (isTest) {
  if (result === testResult) {
    console.log("The test seems to be successful!")
  } else {
    console.error("The test didn't go quite right...")
  }
}
