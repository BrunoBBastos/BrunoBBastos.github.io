class Robot{
	constructor(armor, mover, mainWeapon, secWeapon){
		this.armor = armor;
		this.mover = mover;
		this.mainWeapon = mainWeapon;
		this.secWeapon = secWeapon;
		// print(this.secWeapon);
	}
}

class Weapon{
	constructor(name, cards){
		this.partName =  name;
		this.cards = cards;
	}
}

class Armor{
	constructor(name, cards){
		this.partName =  name;
		this.cards = cards;
	}
}

class Mover{
	constructor(name, cards){
		this.partName =  name;
		this.cards = cards;
	}
}

// Write an algorithm to load the cards and parts from a updatable JSON file

function loadParts(){
	// Returns an matrix with armors, movers and weapons as rows 
	let set = [];
	let armors = [];
	let movers = [];
	let weapons = [];

	let tempCards = [];
	for(let i = 0; i < 4; i++){
		tempCards.push({...cards[3]});
	}
	armors.push(new Armor("Steel Plates", tempCards));

	tempCards = [];
	for(let i = 0; i < 4; i++){
		tempCards.push({...cards[0]});
	}
	movers.push(new Mover("Wheels", tempCards));

	tempCards = [];
	for(let i = 0; i < 4; i++){
		tempCards.push({...cards[2]});
	}
	weapons.push(new Weapon("Hammer", tempCards));

	set.push(armors);
	set.push(movers);
	set.push(weapons);
	return set;
}

function loadRobot(){
	let robotSample;
	let robParts = [];

	for(let i = 0; i < 3; i++){
		robParts[i] = parts[i][0];
	}
	robotSample = new Robot(robParts[0], robParts[1], robParts[2]);
	return robotSample;
}

function testRLoaders(){
	parts = loadParts();
	let r = loadRobot();
	return r;
}