function rollDice(){
	return(int(random(0, 5)) + 1);
}

class Card{
	constructor(title, type, callback, text){
		this.cardName = title;
		this.cardType = type;
		this.cardText = text;
		this.callback = callback;
	}
}

class Deck{
	constructor(robot){
		this.moveCards = robot.mover.cards;
		this.actionCards = robot.armor.cards.concat(robot.mainWeapon.cards);
		this.hand = [];
		this.discardPile = [];
	}

	shuffleActiveDeck(){
		for(let i = 0; i < 3; i++){
			shuffleDeck(this.moveCards);
			shuffleDeck(this.actionCards);
		}
	}

	shuffleDeck(deck){
		let temp, index;
		for(let i = 0; i < deck.length; i++){
			index = int(random(deck.length));
			temp = deck[i];
			deck[i] = deck[index];
			deck[index] = temp;
		}
	}

	drawHand(){
		this.hand.push(this.moveCards.pop());
		while(this.hand.length < 5){
			this.hand.push(this.actionCards.pop());
		}
	}

	discard(card){
		this,discardPile.push(card);
	}

}

function loadCards(){ // Provisory cards, do write a JSON cards file
	cards.push(new Card("Move!", "Movement", 1, "Move, dammit!"));
	cards.push(new Card("Grind!", "Attack", 1, "Attacks the enemy."));
	cards.push(new Card("Crush!", "Attack", 1, "Attacks the enemy."));
	cards.push(new Card("Magic Smoke", "Support", 1, "Heals 1."));
}

function loadDeck(){
	let tempDeck = [];
	for(let i = 0; i < 10; i++){
		tempDeck.push({...cards[0]});
	}
	for(let i = 0; i < 7; i++){
		tempDeck.push({...cards[1]});
		tempDeck.push({...cards[2]});
		tempDeck.push({...cards[3]});
	}
	shuffleDeck(tempDeck);
	return tempDeck;
}

function shuffleDeck(deck){
	let temp, index;
	for(let i = 0; i < deck.length; i++){
		index = int(random(deck.length));
		temp = deck[i];
		deck[i] = deck[index];
		deck[index] = temp;
	}
}