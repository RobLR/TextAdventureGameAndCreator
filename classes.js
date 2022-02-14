"use strict";
// Game world class that will be used to store the player and all locations, so that it can be saved and provide easy reference to each location.
class World {
    worldName;
    player;
    places = {};
    items = {};
    startText;
    constructor(worldName, player, startText) {
        this.worldName = worldName;
        this.player = player;
        this.startText = startText;
    }
    addPlace(id, place) {
        this.places[id] = place;
    }
    addItem(id, item) {
        this.items[id] = item;
    }
}
// Sets the player class, including all of the properties related to the player, for example where they are
class Player {
    inventory;
    place;
    // time: number = 0
    alive = true;
    health = 20;
    stamina = 10;
    carryingWeight = 0;
    maximumCarryWeight;
    constructor(place, health, stamina, maximumCarryWeight) {
        this.inventory = {};
        this.place = place;
        this.health = health;
        this.stamina = stamina;
        this.maximumCarryWeight = maximumCarryWeight;
    }
}
// Creates a class for places including properties such as including other nearby places, what items are in this location
class Place {
    placeID;
    name;
    description = "No further information";
    nearby = {};
    items = {};
    exits = {};
    hints;
    constructor(placeID, name, description, hints) {
        this.placeID = placeID;
        this.name = name;
        this.description = description;
        this.nearby = {};
        this.hints = hints;
    }
    // Links a new place to the current one and also creates a reverse link so you can go back to the previous place
    addNearbyPlace(direction, place, exit) {
        this.nearby[direction] = place;
        this.exits[direction] = exit;
        let previousDirection = "";
        if (direction == "north") {
            previousDirection = "south";
        }
        else if (direction == "south") {
            previousDirection = "north";
        }
        else if (direction == "east") {
            previousDirection = "west";
        }
        else if (direction == "west") {
            previousDirection = "east";
        }
        else if (direction == "up") {
            previousDirection = "down";
        }
        else if (direction == "down") {
            previousDirection = "up";
        }
        place.nearby[previousDirection] = this;
        place.exits[previousDirection] = exit;
    }
    addItem(name, item) {
        this.items[name] = item;
    }
}
class Exit {
    locked;
    blocked;
    needsJump;
    hidden;
    durability;
    constructor(locked, blocked, needsJump, hidden, durability) {
        this.locked = locked;
        this.blocked = blocked;
        this.needsJump = needsJump;
        this.hidden = hidden;
        this.durability = durability;
    }
}
// Defines items that exist in the world, these can be obstacles or items the player can pick up.
class Item {
    itemID;
    itemName;
    description;
    weight;
    durability;
    parentContainerType;
    parentContainerID;
    contents = {};
    alight = false;
    broken = false;
    locked = false;
    collectable = false;
    open = false;
    hidden = false;
    pushable = false;
    edible = false;
    drinkable = false;
    poisonous = false;
    breakable = false;
    attackable = false;
    flammable = false;
    weapon = false;
    // Constructor for new items.
    constructor(itemID, itemName, weight, description, durability, parentContainerType, parentContainerID) {
        this.itemID = itemID;
        this.description = description;
        this.itemName = itemName;
        this.weight = weight;
        this.durability = durability;
        this.parentContainerType = parentContainerType;
        this.parentContainerID = parentContainerID;
    }
    // Methods related to items
    addItem(name, item) {
        this.contents[name] = item;
    }
}
//# sourceMappingURL=classes.js.map