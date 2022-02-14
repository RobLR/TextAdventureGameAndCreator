"use strict";
let newGame;
let placeID;
let itemID;
let placeIDInput;
let itemIDInput;
document.getElementById("submitInitialGeneration").addEventListener("click", initialWorldGen);
document.getElementById("newPlaceButton").addEventListener("click", newPlaceForm);
document.getElementById("submitPlace").addEventListener("click", addNewPlace);
document.getElementById("newItemButton").addEventListener("click", newItemForm);
document.getElementById("submitItem").addEventListener("click", addNewItem);
document.getElementById("getPlaceID").addEventListener("click", getPlaceID);
document.getElementById("editPlace").addEventListener("click", editPlace);
document.getElementById("savePlaceEdits").addEventListener("click", savePlaceEdits);
document.getElementById("getItemID").addEventListener("click", getItemID);
document.getElementById("editItem").addEventListener("click", editItem);
document.getElementById("saveItemEdits").addEventListener("click", saveItemEdits);
document.getElementById("reset").addEventListener("click", reset);
document.getElementById("loadFromInput").addEventListener("click", loadFromInput);
document.getElementById("loadJSON").addEventListener("click", loadJSON);
document.getElementById("generateJSONButton").addEventListener("click", outputJSON);
function reset() {
    placeID = 1;
    itemID = 1;
    document.getElementById("initialGenForm").reset();
    document.getElementById("placeForm").reset();
    document.getElementById("itemForm").reset();
    document.getElementById("newButtons").style.display = "none";
    document.getElementById("getPlaceIDForm").style.display = "none";
    document.getElementById("getItemIDForm").style.display = "none";
    document.getElementById("newPlace").style.display = "none";
    document.getElementById("newItem").style.display = "none";
    document.getElementById("submitPlace").style.display = "none";
    document.getElementById("savePlaceEdits").style.display = "none";
    document.getElementById("submitItem").style.display = "none";
    document.getElementById("saveItemEdits").style.display = "none";
    document.getElementById("initialGeneration").style.display = "inline";
    let placeList = document.getElementById("placeList");
    placeList.innerHTML = "";
    let itemList = document.getElementById("itemList");
    itemList.innerHTML = "";
}
function loadFromInput() {
    document.getElementById("jsonInputDiv").style.display = "flex";
}
function loadJSON() {
    let jsonData = document.getElementById("jsonInput").value;
    newGame = (JSON.retrocycle)(JSON.parse(jsonData));
    document.getElementById("initialGenForm").reset();
    document.getElementById("placeForm").reset();
    document.getElementById("itemForm").reset();
    document.getElementById("newButtons").style.display = "inline";
    document.getElementById("getPlaceIDForm").style.display = "none";
    document.getElementById("getItemIDForm").style.display = "none";
    document.getElementById("newPlace").style.display = "none";
    document.getElementById("newItem").style.display = "none";
    document.getElementById("submitPlace").style.display = "none";
    document.getElementById("savePlaceEdits").style.display = "none";
    document.getElementById("submitItem").style.display = "none";
    document.getElementById("saveItemEdits").style.display = "none";
    document.getElementById("initialGeneration").style.display = "none";
    renderList();
}
function initialWorldGen() {
    placeID = 1;
    itemID = 1;
    let worldName = document.getElementById("worldName").value;
    let introText = document.getElementById("introText").value;
    let playerHealth = parseInt(document.getElementById("playerHealth").value);
    let playerStamina = parseInt(document.getElementById("playerStamina").value);
    let maximumCarryWeight = parseInt(document.getElementById("maximumCarryWeight").value);
    let startName = document.getElementById("startLocName").value;
    let startDescription = document.getElementById("startLocDescription").value;
    let startHints = document.getElementById("startHints").value;
    let startPlace = new Place(placeID, startName, startDescription, startHints);
    newGame = new World(worldName, new Player(startPlace, playerHealth, playerStamina, maximumCarryWeight), introText);
    newGame.addPlace(placeID, startPlace);
    let nameList = document.getElementById("placeList");
    let listItem = document.createElement("li");
    listItem.innerHTML = startName;
    nameList.appendChild(listItem);
    placeID += 1;
    document.getElementById("initialGeneration").style.display = "none";
    document.getElementById("newButtons").style.display = "inline";
    renderList();
}
function newPlaceForm() {
    document.getElementById("newButtons").style.display = "none";
    document.getElementById("newPlace").style.display = "inline";
    document.getElementById("submitPlace").style.display = "inline";
}
function addNewPlace() {
    let placeName = document.getElementById("placeName").value;
    let placeDescription = document.getElementById("placeDescription").value;
    let placeHints = document.getElementById("placeHints").value;
    newGame.addPlace(placeID, new Place(placeID, placeName, placeDescription, placeHints));
    const directions = ["north", "east", "south", "west", "up", "down"];
    for (let i in directions) {
        if (document.getElementById(directions[i]).checked == true) {
            let placeDirection = directions[i];
            let placeIDInput = parseInt(document.getElementById(`${directions[i]}Place`).value);
            let locked = document.getElementById(`${directions[i]}Locked`).checked;
            let blocked = document.getElementById(`${directions[i]}Blocked`).checked;
            let needsJump = document.getElementById(`${directions[i]}NeedsJump`).checked;
            let hidden = document.getElementById(`${directions[i]}Hidden`).checked;
            let durability = parseInt(document.getElementById(`${directions[i]}Durability`).value);
            newGame.places[placeID].addNearbyPlace(placeDirection, newGame.places[placeIDInput], new Exit(locked, blocked, needsJump, hidden, durability));
        }
    }
    placeID += 1;
    document.getElementById("submitPlace").style.display = "none";
    document.getElementById("newPlace").style.display = "none";
    document.getElementById("newButtons").style.display = "inline";
    document.getElementById("placeForm").reset();
    renderList();
}
function newItemForm() {
    document.getElementById("newButtons").style.display = "none";
    document.getElementById("newItem").style.display = "inline";
    document.getElementById("submitItem").style.display = "inline";
}
function addNewItem() {
    let itemName = document.getElementById("itemName").value;
    let itemDescription = document.getElementById("itemDescription").value;
    let itemWeight = parseInt(document.getElementById("itemWeight").value);
    let parentContainerType = document.getElementById("parentContainerType").value;
    let parentContainerID = parseInt(document.getElementById("parentContainerName").value);
    let itemDurability = parseInt(document.getElementById("itemDurability").value);
    let generatedItem = new Item(itemID, itemName, itemWeight, itemDescription, itemDurability, parentContainerType, parentContainerID);
    newGame.addItem(itemID, generatedItem);
    if (parentContainerType == "place") {
        newGame.places[parentContainerID].addItem(itemName.toLowerCase(), generatedItem);
    }
    else if (parentContainerType == "item") {
        newGame.items[parentContainerID].addItem(itemName.toLowerCase(), generatedItem);
    }
    if (document.getElementById("collectible").checked == true) {
        newGame.items[itemID].collectable = true;
    }
    if (document.getElementById("edible").checked == true) {
        newGame.items[itemID].edible = true;
    }
    if (document.getElementById("drinkable").checked == true) {
        newGame.items[itemID].drinkable = true;
    }
    if (document.getElementById("poisonous").checked == true) {
        newGame.items[itemID].poisonous = true;
    }
    if (document.getElementById("flammable").checked == true) {
        newGame.items[itemID].flammable = true;
    }
    if (document.getElementById("alight").checked == true) {
        newGame.items[itemID].alight = true;
    }
    if (document.getElementById("locked").checked == true) {
        newGame.items[itemID].locked = true;
    }
    if (document.getElementById("open").checked == true) {
        newGame.items[itemID].open = true;
    }
    if (document.getElementById("hidden").checked == true) {
        newGame.items[itemID].hidden = true;
    }
    if (document.getElementById("pushable").checked == true) {
        newGame.items[itemID].pushable = true;
    }
    if (document.getElementById("weapon").checked == true) {
        newGame.items[itemID].weapon = true;
    }
    if (document.getElementById("breakable").checked == true) {
        newGame.items[itemID].breakable = true;
    }
    if (document.getElementById("broken").checked == true) {
        newGame.items[itemID].broken = true;
    }
    if (document.getElementById("attackable").checked == true) {
        newGame.items[itemID].attackable = true;
    }
    itemID += 1;
    document.getElementById("submitItem").style.display = "none";
    document.getElementById("newItem").style.display = "none";
    document.getElementById("newButtons").style.display = "inline";
    document.getElementById("itemForm").reset();
    renderList();
}
function outputJSON() {
    let jsonOutput = JSON.stringify(JSON.decycle(newGame));
    let outputArea = document.getElementById("outputField");
    outputArea.innerHTML = jsonOutput;
}
function getPlaceID() {
    document.getElementById("newButtons").style.display = "none";
    document.getElementById("getPlaceIDForm").style.display = "inline";
}
function editPlace() {
    placeIDInput = parseInt(document.getElementById("placeIDInput").value);
    document.getElementById("getPlaceIDForm").style.display = "none";
    document.getElementById("newPlace").style.display = "inline";
    document.getElementById("savePlaceEdits").style.display = "inline";
    let place = newGame.places[placeIDInput];
    document.getElementById("placeName").value = place.name;
    document.getElementById("placeDescription").value = place.description;
    document.getElementById("placeHints").value = place.hints;
    let exits = place.exits;
    for (let k in exits) {
        let direction = k;
        document.getElementById(`${direction}`).checked = true;
        document.getElementById(`${direction}Place`).value = (place.nearby[direction].placeID).toString();
        document.getElementById(`${direction}Locked`).checked = exits[k].locked;
        document.getElementById(`${direction}Blocked`).checked = exits[k].blocked;
        document.getElementById(`${direction}NeedsJump`).checked = exits[k].needsJump;
        document.getElementById(`${direction}Hidden`).checked = exits[k].hidden;
        document.getElementById(`${direction}Durability`).value = (exits[k].durability).toString();
    }
}
function savePlaceEdits() {
    let place = newGame.places[placeIDInput];
    let placeName = document.getElementById("placeName").value;
    let placeDescription = document.getElementById("placeDescription").value;
    let placeHints = document.getElementById("placeHints").value;
    place.name = placeName;
    place.description = placeDescription;
    place.hints = placeHints;
    const directions = ["north", "east", "south", "west", "up", "down"];
    for (let i in directions) {
        let placeDirection = directions[i];
        if (document.getElementById(directions[i]).checked == true) {
            let directionPlaceIDInput = parseInt(document.getElementById(`${directions[i]}Place`).value);
            let locked = document.getElementById(`${directions[i]}Locked`).checked;
            let blocked = document.getElementById(`${directions[i]}Blocked`).checked;
            let needsJump = document.getElementById(`${directions[i]}NeedsJump`).checked;
            let hidden = document.getElementById(`${directions[i]}Hidden`).checked;
            let durability = parseInt(document.getElementById(`${directions[i]}Durability`).value);
            newGame.places[place.placeID].addNearbyPlace(placeDirection, newGame.places[directionPlaceIDInput], new Exit(locked, blocked, needsJump, hidden, durability));
        }
        if (document.getElementById(placeDirection).checked == false && !(place.nearby[placeDirection] == undefined)) {
            let directionPlaceIDInput = place.nearby[placeDirection].placeID;
            delete newGame.places[place.placeID].nearby[placeDirection];
            delete newGame.places[place.placeID].exits[placeDirection];
            let oppositeDirection = "";
            if (placeDirection == "north") {
                oppositeDirection = "south";
            }
            else if (placeDirection == "south") {
                oppositeDirection = "north";
            }
            else if (placeDirection == "east") {
                oppositeDirection = "west";
            }
            else if (placeDirection == "west") {
                oppositeDirection = "east";
            }
            else if (placeDirection == "up") {
                oppositeDirection = "down";
            }
            else if (placeDirection == "down") {
                oppositeDirection = "up";
            }
            delete newGame.places[directionPlaceIDInput].nearby[oppositeDirection];
            delete newGame.places[directionPlaceIDInput].exits[oppositeDirection];
        }
    }
    document.getElementById("savePlaceEdits").style.display = "none";
    document.getElementById("newPlace").style.display = "none";
    document.getElementById("newButtons").style.display = "inline";
    document.getElementById("placeForm").reset();
    renderList();
}
function getItemID() {
    document.getElementById("newButtons").style.display = "none";
    document.getElementById("getItemIDForm").style.display = "inline";
}
function editItem() {
    itemIDInput = parseInt(document.getElementById("itemIDInput").value);
    document.getElementById("getItemIDForm").style.display = "none";
    document.getElementById("newItem").style.display = "inline";
    document.getElementById("saveItemEdits").style.display = "inline";
    let item = newGame.items[itemIDInput];
    document.getElementById("itemName").value = item.itemName;
    document.getElementById("itemDescription").value = item.description;
    document.getElementById("itemWeight").value = (item.weight).toString();
    document.getElementById("parentContainerType").value = item.parentContainerType;
    document.getElementById("parentContainerName").value = (item.parentContainerID).toString();
    document.getElementById("itemDurability").value = (item.durability).toString();
    if (item.collectable == true) {
        document.getElementById("collectible").checked = true;
    }
    if (item.edible == true) {
        document.getElementById("edible").checked = true;
    }
    if (item.drinkable == true) {
        document.getElementById("drinkable").checked = true;
    }
    if (item.poisonous == true) {
        document.getElementById("poisonous").checked = true;
    }
    if (item.flammable == true) {
        document.getElementById("flammable").checked = true;
    }
    if (item.alight == true) {
        document.getElementById("alight").checked = true;
    }
    if (item.locked == true) {
        document.getElementById("locked").checked = true;
    }
    if (item.open == true) {
        document.getElementById("open").checked = true;
    }
    if (item.hidden == true) {
        document.getElementById("hidden").checked = true;
    }
    if (item.pushable == true) {
        document.getElementById("pushable").checked = true;
    }
    if (item.weapon == true) {
        document.getElementById("weapon").checked = true;
    }
    if (item.breakable == true) {
        document.getElementById("breakable").checked = true;
    }
    if (item.broken == true) {
        document.getElementById("broken").checked = true;
    }
    if (item.attackable == true) {
        document.getElementById("attackable").checked = true;
    }
}
function saveItemEdits() {
    let item = newGame.items[itemIDInput];
    let oldParentContainerType = item.parentContainerType;
    let oldParentContainerID = item.parentContainerID;
    let itemName = document.getElementById("itemName").value;
    let itemDescription = document.getElementById("itemDescription").value;
    let itemWeight = parseInt(document.getElementById("itemWeight").value);
    let parentContainerType = document.getElementById("parentContainerType").value;
    let parentContainerID = parseInt(document.getElementById("parentContainerName").value);
    let itemDurability = parseInt(document.getElementById("itemDurability").value);
    item.itemName = itemName;
    item.description = itemDescription;
    item.weight = itemWeight;
    item.parentContainerType = parentContainerType;
    item.parentContainerID = parentContainerID;
    item.durability = itemDurability;
    if ((parentContainerType == oldParentContainerType) && (parentContainerID != oldParentContainerID)) {
        if (parentContainerType == "place") {
            newGame.places[parentContainerID].addItem(itemName.toLowerCase(), item);
            delete newGame.items[oldParentContainerID].contents[itemName.toLowerCase()];
        }
        else if (parentContainerType == "item") {
            newGame.items[parentContainerID].addItem(itemName.toLowerCase(), item);
            delete newGame.places[oldParentContainerID].items[itemName.toLowerCase()];
        }
    }
    else if ((parentContainerType != oldParentContainerType) && (parentContainerID == oldParentContainerID)) {
        if (parentContainerType == "place") {
            newGame.places[parentContainerID].addItem(itemName.toLowerCase(), item);
            delete newGame.items[oldParentContainerID].contents[itemName.toLowerCase()];
        }
        else if (parentContainerType == "item") {
            newGame.items[parentContainerID].addItem(itemName.toLowerCase(), item);
            delete newGame.places[oldParentContainerID].items[itemName.toLowerCase()];
        }
    }
    else if ((parentContainerType != oldParentContainerType) && (parentContainerID != oldParentContainerID)) {
        if (parentContainerType == "place") {
            newGame.places[parentContainerID].addItem(itemName.toLowerCase(), item);
            delete newGame.items[oldParentContainerID].contents[itemName.toLowerCase()];
        }
        else if (parentContainerType == "item") {
            newGame.items[parentContainerID].addItem(itemName.toLowerCase(), item);
            delete newGame.places[oldParentContainerID].items[itemName.toLowerCase()];
        }
    }
    // If checkboxes are ticked, sets property to true
    if (document.getElementById("collectible").checked == true) {
        item.collectable = true;
    }
    if (document.getElementById("edible").checked == true) {
        item.edible = true;
    }
    if (document.getElementById("drinkable").checked == true) {
        item.drinkable = true;
    }
    if (document.getElementById("poisonous").checked == true) {
        item.poisonous = true;
    }
    if (document.getElementById("flammable").checked == true) {
        item.flammable = true;
    }
    if (document.getElementById("alight").checked == true) {
        item.alight = true;
    }
    if (document.getElementById("locked").checked == true) {
        item.locked = true;
    }
    if (document.getElementById("open").checked == true) {
        item.open = true;
    }
    if (document.getElementById("hidden").checked == true) {
        item.hidden = true;
    }
    if (document.getElementById("pushable").checked == true) {
        item.pushable = true;
    }
    if (document.getElementById("weapon").checked == true) {
        item.weapon = true;
    }
    if (document.getElementById("breakable").checked == true) {
        item.breakable = true;
    }
    if (document.getElementById("broken").checked == true) {
        item.broken = true;
    }
    if (document.getElementById("attackable").checked == true) {
        item.attackable = true;
    }
    // If checkboxes are unticked, sets property to false
    if (document.getElementById("collectible").checked == false) {
        newGame.items[item.itemID].collectable = false;
    }
    if (document.getElementById("edible").checked == false) {
        newGame.items[item.itemID].edible = false;
    }
    if (document.getElementById("drinkable").checked == false) {
        newGame.items[item.itemID].drinkable = false;
    }
    if (document.getElementById("poisonous").checked == false) {
        newGame.items[item.itemID].poisonous = false;
    }
    if (document.getElementById("flammable").checked == false) {
        newGame.items[item.itemID].flammable = false;
    }
    if (document.getElementById("alight").checked == false) {
        newGame.items[item.itemID].alight = false;
    }
    if (document.getElementById("locked").checked == false) {
        newGame.items[item.itemID].locked = false;
    }
    if (document.getElementById("open").checked == false) {
        newGame.items[item.itemID].open = false;
    }
    if (document.getElementById("hidden").checked == false) {
        newGame.items[item.itemID].hidden = false;
    }
    if (document.getElementById("pushable").checked == false) {
        newGame.items[item.itemID].pushable = false;
    }
    if (document.getElementById("weapon").checked == false) {
        newGame.items[item.itemID].weapon = false;
    }
    if (document.getElementById("breakable").checked == false) {
        newGame.items[item.itemID].breakable = false;
    }
    if (document.getElementById("broken").checked == false) {
        newGame.items[item.itemID].broken = false;
    }
    if (document.getElementById("attackable").checked == false) {
        newGame.items[item.itemID].attackable = false;
    }
    document.getElementById("saveItemEdits").style.display = "none";
    document.getElementById("newItem").style.display = "none";
    document.getElementById("newButtons").style.display = "inline";
    document.getElementById("itemForm").reset();
    renderList();
}
function renderList() {
    let placeList = document.getElementById("placeList");
    placeList.innerHTML = "";
    let itemList = document.getElementById("itemList");
    itemList.innerHTML = "";
    for (let i in newGame.places) {
        let placeListEntry = document.createElement("li");
        placeListEntry.innerHTML = `(${newGame.places[i].placeID}) ${newGame.places[i].name}`;
        placeList = document.getElementById("placeList");
        placeList.appendChild(placeListEntry);
    }
    for (let i in newGame.items) {
        let itemListEntry = document.createElement("li");
        itemListEntry.innerHTML = `(${newGame.items[i].itemID}) ${newGame.items[i].itemName}`;
        itemList = document.getElementById("itemList");
        itemList.appendChild(itemListEntry);
    }
}
function loadFromStorage() {
}
function saveToStorage() {
}
//# sourceMappingURL=adventureCreator.js.map