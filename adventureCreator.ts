"use strict";

let newGame: World
let placeID: number
let itemID: number

let placeIDInput:number
let itemIDInput: number


(<HTMLButtonElement>document.getElementById("submitInitialGeneration")).addEventListener("click", initialWorldGen);
(<HTMLButtonElement>document.getElementById("newPlaceButton")).addEventListener("click", newPlaceForm);
(<HTMLButtonElement>document.getElementById("submitPlace")).addEventListener("click", addNewPlace);
(<HTMLButtonElement>document.getElementById("newItemButton")).addEventListener("click", newItemForm);
(<HTMLButtonElement>document.getElementById("submitItem")).addEventListener("click", addNewItem);

(<HTMLButtonElement>document.getElementById("getPlaceID")).addEventListener("click", getPlaceID);
(<HTMLButtonElement>document.getElementById("editPlace")).addEventListener("click", editPlace);
(<HTMLButtonElement>document.getElementById("savePlaceEdits")).addEventListener("click", savePlaceEdits);

(<HTMLButtonElement>document.getElementById("getItemID")).addEventListener("click", getItemID);
(<HTMLButtonElement>document.getElementById("editItem")).addEventListener("click", editItem);
(<HTMLButtonElement>document.getElementById("saveItemEdits")).addEventListener("click", saveItemEdits);

(<HTMLButtonElement>document.getElementById("reset")).addEventListener("click", reset);
(<HTMLButtonElement>document.getElementById("loadFromInput")).addEventListener("click", loadFromInput);
(<HTMLButtonElement>document.getElementById("loadJSON")).addEventListener("click", loadJSON);


(<HTMLButtonElement>document.getElementById("generateJSONButton")).addEventListener("click", outputJSON);

function reset(){
    placeID = 1
    itemID = 1;

    (<HTMLFormElement> document.getElementById("initialGenForm")).reset();
    (<HTMLFormElement> document.getElementById("placeForm")).reset();
    (<HTMLFormElement> document.getElementById("itemForm")).reset();

    (<HTMLDivElement> document.getElementById("newButtons")).style.display = "none";
    (<HTMLDivElement> document.getElementById("getPlaceIDForm")).style.display = "none";
    (<HTMLDivElement> document.getElementById("getItemIDForm")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newPlace")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newItem")).style.display = "none";
    (<HTMLDivElement> document.getElementById("submitPlace")).style.display = "none";
    (<HTMLDivElement> document.getElementById("savePlaceEdits")).style.display = "none";
    (<HTMLDivElement> document.getElementById("submitItem")).style.display = "none";
    (<HTMLDivElement> document.getElementById("saveItemEdits")).style.display = "none";
    (<HTMLDivElement> document.getElementById("initialGeneration")).style.display = "inline";

    let placeList = <HTMLUListElement>document.getElementById("placeList")
    placeList.innerHTML = ""
    let itemList = <HTMLUListElement>document.getElementById("itemList")
    itemList.innerHTML = ""
}

function loadFromInput(){
    (<HTMLDivElement> document.getElementById("jsonInputDiv")).style.display = "flex";
}

function loadJSON(){
    let jsonData:any = (<HTMLTextAreaElement>document.getElementById("jsonInput")).value
    newGame = ((<any>JSON).retrocycle)((<any>JSON).parse(jsonData));

    (<HTMLFormElement> document.getElementById("initialGenForm")).reset();
    (<HTMLFormElement> document.getElementById("placeForm")).reset();
    (<HTMLFormElement> document.getElementById("itemForm")).reset();

    (<HTMLDivElement> document.getElementById("newButtons")).style.display = "inline";
    (<HTMLDivElement> document.getElementById("getPlaceIDForm")).style.display = "none";
    (<HTMLDivElement> document.getElementById("getItemIDForm")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newPlace")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newItem")).style.display = "none";
    (<HTMLDivElement> document.getElementById("submitPlace")).style.display = "none";
    (<HTMLDivElement> document.getElementById("savePlaceEdits")).style.display = "none";
    (<HTMLDivElement> document.getElementById("submitItem")).style.display = "none";
    (<HTMLDivElement> document.getElementById("saveItemEdits")).style.display = "none";
    (<HTMLDivElement> document.getElementById("initialGeneration")).style.display = "none";


    renderList()
}

function initialWorldGen(){
    placeID = 1
    itemID = 1
    let worldName = (<HTMLInputElement>document.getElementById("worldName")).value
    let introText = (<HTMLTextAreaElement>document.getElementById("introText")).value
    let playerHealth:number = parseInt((<HTMLInputElement>document.getElementById("playerHealth")).value)
    let playerStamina:number = parseInt((<HTMLInputElement>document.getElementById("playerStamina")).value)
    let maximumCarryWeight:number = parseInt((<HTMLInputElement>document.getElementById("maximumCarryWeight")).value)
    let startName = (<HTMLInputElement>document.getElementById("startLocName")).value
    let startDescription = (<HTMLTextAreaElement>document.getElementById("startLocDescription")).value
    let startHints = (<HTMLTextAreaElement>document.getElementById("startHints")).value

    let startPlace = new Place(placeID, startName, startDescription, startHints);

    newGame = new World(
        worldName,
        new Player(
            startPlace,
            playerHealth,
            playerStamina,
            maximumCarryWeight
        ),
        introText
    );

    newGame.addPlace(placeID, startPlace);

    let nameList = <HTMLUListElement>document.getElementById("placeList")
    let listItem = document.createElement("li")
    listItem.innerHTML = startName
    nameList.appendChild(listItem);

    placeID += 1;

    (<HTMLDivElement> document.getElementById("initialGeneration")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newButtons")).style.display = "inline"

    renderList()
}

function newPlaceForm(){
    (<HTMLDivElement> document.getElementById("newButtons")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newPlace")).style.display = "inline";
    (<HTMLButtonElement> document.getElementById("submitPlace")).style.display = "inline";
}

function addNewPlace(){
    let placeName = (<HTMLInputElement>document.getElementById("placeName")).value
    let placeDescription = (<HTMLInputElement>document.getElementById("placeDescription")).value
    let placeHints = (<HTMLInputElement>document.getElementById("placeHints")).value

    newGame.addPlace(
        placeID,
        new Place(
            placeID,
            placeName,
            placeDescription,
            placeHints
        )
    )

    const directions = ["north", "east", "south", "west", "up", "down"]
    for(let i in directions){
        if ((<HTMLInputElement> document.getElementById(directions[i])).checked == true){
            let placeDirection = directions[i]
            let placeIDInput:number = parseInt((<HTMLInputElement>document.getElementById(`${directions[i]}Place`)).value);
            let locked = (<HTMLInputElement>document.getElementById(`${directions[i]}Locked`)).checked;
            let blocked = (<HTMLInputElement>document.getElementById(`${directions[i]}Blocked`)).checked;
            let needsJump = (<HTMLInputElement>document.getElementById(`${directions[i]}NeedsJump`)).checked;
            let hidden = (<HTMLInputElement>document.getElementById(`${directions[i]}Hidden`)).checked;
            let durability = parseInt((<HTMLInputElement>document.getElementById(`${directions[i]}Durability`)).value)


            newGame.places[placeID].addNearbyPlace(
                placeDirection,
                newGame.places[placeIDInput],
                new Exit(
                    locked,
                    blocked,
                    needsJump,
                    hidden,
                    durability
                )
            )
        }
    }

    placeID += 1;

    (<HTMLButtonElement> document.getElementById("submitPlace")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newPlace")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newButtons")).style.display = "inline";
    (<HTMLFormElement> document.getElementById("placeForm")).reset();

    renderList()
}


function newItemForm(){
    (<HTMLDivElement> document.getElementById("newButtons")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newItem")).style.display = "inline";
    (<HTMLButtonElement> document.getElementById("submitItem")).style.display = "inline";
}

function addNewItem(){

    let itemName = (<HTMLInputElement>document.getElementById("itemName")).value
    let itemDescription = (<HTMLInputElement>document.getElementById("itemDescription")).value
    let itemWeight = parseInt((<HTMLInputElement>document.getElementById("itemWeight")).value)
    let parentContainerType = (<HTMLSelectElement>document.getElementById("parentContainerType")).value
    let parentContainerID = parseInt((<HTMLInputElement>document.getElementById("parentContainerName")).value)
    let itemDurability = parseInt((<HTMLInputElement>document.getElementById("itemDurability")).value)


    let generatedItem = new Item(
        itemID,
        itemName,
        itemWeight,
        itemDescription,
        itemDurability,
        parentContainerType,
        parentContainerID
    )

    newGame.addItem(itemID, generatedItem)

    if (parentContainerType == "place"){
        newGame.places[parentContainerID].addItem(
            itemName.toLowerCase(),
            generatedItem
        )
    }
    
    else if (parentContainerType == "item"){
        newGame.items[parentContainerID].addItem(
            itemName.toLowerCase(),
            generatedItem
        )
    }
    
    if ((<HTMLInputElement>document.getElementById("collectible")).checked == true){
        newGame.items[itemID].collectable = true
    }
    if ((<HTMLInputElement>document.getElementById("edible")).checked == true){
        newGame.items[itemID].edible = true
    }
    if ((<HTMLInputElement>document.getElementById("drinkable")).checked == true){
        newGame.items[itemID].drinkable = true
    }
    if ((<HTMLInputElement>document.getElementById("poisonous")).checked == true){
        newGame.items[itemID].poisonous = true
    }
    if ((<HTMLInputElement>document.getElementById("flammable")).checked == true){
        newGame.items[itemID].flammable = true
    }
    if ((<HTMLInputElement>document.getElementById("alight")).checked == true){
        newGame.items[itemID].alight = true
    }
    if ((<HTMLInputElement>document.getElementById("locked")).checked == true){
        newGame.items[itemID].locked = true
    }
    if ((<HTMLInputElement>document.getElementById("open")).checked == true){
        newGame.items[itemID].open = true
    }
    if ((<HTMLInputElement>document.getElementById("hidden")).checked == true){
        newGame.items[itemID].hidden = true
    }
    if ((<HTMLInputElement>document.getElementById("pushable")).checked == true){
        newGame.items[itemID].pushable = true
    }
    if ((<HTMLInputElement>document.getElementById("weapon")).checked == true){
        newGame.items[itemID].weapon = true
    }
    if ((<HTMLInputElement>document.getElementById("breakable")).checked == true){
        newGame.items[itemID].breakable = true
    }
    if ((<HTMLInputElement>document.getElementById("broken")).checked == true){
        newGame.items[itemID].broken = true
    }
    if ((<HTMLInputElement>document.getElementById("attackable")).checked == true){
        newGame.items[itemID].attackable = true
    }

    itemID += 1;

    (<HTMLButtonElement> document.getElementById("submitItem")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newItem")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newButtons")).style.display = "inline";
    (<HTMLFormElement> document.getElementById("itemForm")).reset();

    renderList()
}

function outputJSON(){
    let jsonOutput = JSON.stringify((<any>JSON).decycle(newGame))
    let outputArea = <HTMLTextAreaElement>document.getElementById("outputField")

    outputArea.innerHTML = jsonOutput

}

function getPlaceID(){
    (<HTMLDivElement> document.getElementById("newButtons")).style.display = "none";
    (<HTMLDivElement> document.getElementById("getPlaceIDForm")).style.display = "inline";

}

function editPlace(){
    placeIDInput = parseInt((<HTMLInputElement> document.getElementById("placeIDInput")).value);
    (<HTMLDivElement> document.getElementById("getPlaceIDForm")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newPlace")).style.display = "inline";
    (<HTMLButtonElement> document.getElementById("savePlaceEdits")).style.display = "inline";
    let place=newGame.places[placeIDInput];

    (<HTMLInputElement>document.getElementById("placeName")).value = place.name;
    (<HTMLInputElement>document.getElementById("placeDescription")).value = place.description;
    (<HTMLInputElement>document.getElementById("placeHints")).value = place.hints;

    let exits = place.exits
    for(let k in exits){
        let direction = k;
        
        (<HTMLInputElement>document.getElementById(`${direction}`)).checked = true;
        (<HTMLInputElement>document.getElementById(`${direction}Place`)).value = (place.nearby[direction].placeID).toString();
        (<HTMLInputElement>document.getElementById(`${direction}Locked`)).checked = exits[k].locked;
        (<HTMLInputElement>document.getElementById(`${direction}Blocked`)).checked = exits[k].blocked;
        (<HTMLInputElement>document.getElementById(`${direction}NeedsJump`)).checked = exits[k].needsJump;
        (<HTMLInputElement>document.getElementById(`${direction}Hidden`)).checked = exits[k].hidden;
        (<HTMLInputElement>document.getElementById(`${direction}Durability`)).value = (exits[k].durability).toString();
    }
}

function savePlaceEdits(){
    let place=newGame.places[placeIDInput];
    let placeName = (<HTMLInputElement>document.getElementById("placeName")).value
    let placeDescription = (<HTMLInputElement>document.getElementById("placeDescription")).value
    let placeHints = (<HTMLInputElement>document.getElementById("placeHints")).value

    place.name = placeName
    place.description = placeDescription
    place.hints = placeHints

    const directions = ["north", "east", "south", "west", "up", "down"]
    for(let i in directions){
        let placeDirection = directions[i]
        if ((<HTMLInputElement> document.getElementById(directions[i])).checked == true){
            let directionPlaceIDInput:number = parseInt((<HTMLInputElement>document.getElementById(`${directions[i]}Place`)).value);
            let locked = (<HTMLInputElement>document.getElementById(`${directions[i]}Locked`)).checked;
            let blocked = (<HTMLInputElement>document.getElementById(`${directions[i]}Blocked`)).checked;
            let needsJump = (<HTMLInputElement>document.getElementById(`${directions[i]}NeedsJump`)).checked;
            let hidden = (<HTMLInputElement>document.getElementById(`${directions[i]}Hidden`)).checked;
            let durability = parseInt((<HTMLInputElement>document.getElementById(`${directions[i]}Durability`)).value)
            
            newGame.places[place.placeID].addNearbyPlace(
                placeDirection,
                newGame.places[directionPlaceIDInput],
                new Exit(
                    locked,
                    blocked,
                    needsJump,
                    hidden,
                    durability
                )
            )
        }

        if ((<HTMLInputElement> document.getElementById(placeDirection)).checked == false && ! (place.nearby[placeDirection] == undefined)){
            let directionPlaceIDInput = place.nearby[placeDirection].placeID
            delete newGame.places[place.placeID].nearby[placeDirection]
            delete newGame.places[place.placeID].exits[placeDirection]
            let oppositeDirection = ""
            if (placeDirection == "north"){
                oppositeDirection = "south"
            }
            else if (placeDirection == "south"){
                oppositeDirection = "north"
            }
            else if (placeDirection == "east"){
                oppositeDirection = "west"
            }
            else if (placeDirection == "west"){
                oppositeDirection = "east"
            }
            else if (placeDirection == "up"){
                oppositeDirection = "down"
            }
            else if (placeDirection == "down"){
                oppositeDirection = "up"
            }
            delete newGame.places[directionPlaceIDInput].nearby[oppositeDirection]
            delete newGame.places[directionPlaceIDInput].exits[oppositeDirection]
        }
    }

    (<HTMLButtonElement> document.getElementById("savePlaceEdits")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newPlace")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newButtons")).style.display = "inline";
    (<HTMLFormElement> document.getElementById("placeForm")).reset();

    renderList()
}

function getItemID(){
    (<HTMLDivElement> document.getElementById("newButtons")).style.display = "none";
    (<HTMLDivElement> document.getElementById("getItemIDForm")).style.display = "inline";

}

function editItem(){
    itemIDInput = parseInt((<HTMLInputElement> document.getElementById("itemIDInput")).value);
    (<HTMLDivElement> document.getElementById("getItemIDForm")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newItem")).style.display = "inline";
    (<HTMLButtonElement> document.getElementById("saveItemEdits")).style.display = "inline";
    let item = newGame.items[itemIDInput];

    (<HTMLInputElement>document.getElementById("itemName")).value = item.itemName;
    (<HTMLInputElement>document.getElementById("itemDescription")).value = item.description;
    (<HTMLInputElement>document.getElementById("itemWeight")).value = (item.weight).toString();
    (<HTMLSelectElement>document.getElementById("parentContainerType")).value = item.parentContainerType;
    (<HTMLInputElement>document.getElementById("parentContainerName")).value = (item.parentContainerID).toString();
    (<HTMLInputElement>document.getElementById("itemDurability")).value = (item.durability).toString();

    if (item.collectable == true){
        (<HTMLInputElement>document.getElementById("collectible")).checked = true
    }
    if (item.edible == true){
        (<HTMLInputElement>document.getElementById("edible")).checked = true
    }
    if (item.drinkable == true){
        (<HTMLInputElement>document.getElementById("drinkable")).checked = true
    }    
    if (item.poisonous == true){
        (<HTMLInputElement>document.getElementById("poisonous")).checked = true
    }
    if (item.flammable == true){
        (<HTMLInputElement>document.getElementById("flammable")).checked = true
    }
    if (item.alight == true){
        (<HTMLInputElement>document.getElementById("alight")).checked = true
    }
    if (item.locked == true){
        (<HTMLInputElement>document.getElementById("locked")).checked = true
    }
    if (item.open == true){
        (<HTMLInputElement>document.getElementById("open")).checked = true
    }
    if (item.hidden == true){
        (<HTMLInputElement>document.getElementById("hidden")).checked = true
    }
    if (item.pushable == true){
        (<HTMLInputElement>document.getElementById("pushable")).checked = true
    }
    if (item.weapon == true){
        (<HTMLInputElement>document.getElementById("weapon")).checked = true
    }
    if (item.breakable == true){
        (<HTMLInputElement>document.getElementById("breakable")).checked = true
    }
    if (item.broken == true){
        (<HTMLInputElement>document.getElementById("broken")).checked = true
    }
    if (item.attackable == true){
        (<HTMLInputElement>document.getElementById("attackable")).checked = true
    }
}

function saveItemEdits(){
    let item = newGame.items[itemIDInput];

    let oldParentContainerType = item.parentContainerType
    let oldParentContainerID = item.parentContainerID

    let itemName = (<HTMLInputElement>document.getElementById("itemName")).value
    let itemDescription = (<HTMLInputElement>document.getElementById("itemDescription")).value
    let itemWeight = parseInt((<HTMLInputElement>document.getElementById("itemWeight")).value)
    let parentContainerType = (<HTMLSelectElement>document.getElementById("parentContainerType")).value
    let parentContainerID = parseInt((<HTMLInputElement>document.getElementById("parentContainerName")).value)
    let itemDurability = parseInt((<HTMLInputElement>document.getElementById("itemDurability")).value);

    item.itemName = itemName
    item.description = itemDescription
    item.weight = itemWeight
    item.parentContainerType = parentContainerType
    item.parentContainerID = parentContainerID
    item.durability = itemDurability;

    if ((parentContainerType == oldParentContainerType) && (parentContainerID != oldParentContainerID)){
        if (parentContainerType == "place"){
            newGame.places[parentContainerID].addItem(
                itemName.toLowerCase(),
                item
            )
            delete newGame.items[oldParentContainerID].contents[itemName.toLowerCase()]
        }
        else if (parentContainerType == "item"){
            newGame.items[parentContainerID].addItem(
                itemName.toLowerCase(),
                item
            )
            delete newGame.places[oldParentContainerID].items[itemName.toLowerCase()]
        }
    }
    else if ((parentContainerType != oldParentContainerType) && (parentContainerID == oldParentContainerID)){
        if (parentContainerType == "place"){
            newGame.places[parentContainerID].addItem(
                itemName.toLowerCase(),
                item
            )
            delete newGame.items[oldParentContainerID].contents[itemName.toLowerCase()]
        }
        else if (parentContainerType == "item"){
            newGame.items[parentContainerID].addItem(
                itemName.toLowerCase(),
                item
            )
            delete newGame.places[oldParentContainerID].items[itemName.toLowerCase()]
        }
    }
    else if ((parentContainerType != oldParentContainerType) && (parentContainerID != oldParentContainerID)){
        if (parentContainerType == "place"){
            newGame.places[parentContainerID].addItem(
                itemName.toLowerCase(),
                item
            )
            delete newGame.items[oldParentContainerID].contents[itemName.toLowerCase()]
        }
        else if (parentContainerType == "item"){
            newGame.items[parentContainerID].addItem(
                itemName.toLowerCase(),
                item
            )
            delete newGame.places[oldParentContainerID].items[itemName.toLowerCase()]
        }
    }

    // If checkboxes are ticked, sets property to true
    if ((<HTMLInputElement>document.getElementById("collectible")).checked == true){
        item.collectable = true
    }
    if ((<HTMLInputElement>document.getElementById("edible")).checked == true){
        item.edible = true
    }
    if ((<HTMLInputElement>document.getElementById("drinkable")).checked == true){
        item.drinkable = true
    }
    if ((<HTMLInputElement>document.getElementById("poisonous")).checked == true){
        item.poisonous = true
    }
    if ((<HTMLInputElement>document.getElementById("flammable")).checked == true){
        item.flammable = true
    }
    if ((<HTMLInputElement>document.getElementById("alight")).checked == true){
        item.alight = true
    }
    if ((<HTMLInputElement>document.getElementById("locked")).checked == true){
        item.locked = true
    }
    if ((<HTMLInputElement>document.getElementById("open")).checked == true){
        item.open = true
    }
    if ((<HTMLInputElement>document.getElementById("hidden")).checked == true){
        item.hidden = true
    }
    if ((<HTMLInputElement>document.getElementById("pushable")).checked == true){
        item.pushable = true
    }
    if ((<HTMLInputElement>document.getElementById("weapon")).checked == true){
        item.weapon = true
    }
    if ((<HTMLInputElement>document.getElementById("breakable")).checked == true){
        item.breakable = true
    }
    if ((<HTMLInputElement>document.getElementById("broken")).checked == true){
        item.broken = true
    }
    if ((<HTMLInputElement>document.getElementById("attackable")).checked == true){
        item.attackable = true
    }

    // If checkboxes are unticked, sets property to false
    if ((<HTMLInputElement>document.getElementById("collectible")).checked == false){
        newGame.items[item.itemID].collectable = false
    }
    if ((<HTMLInputElement>document.getElementById("edible")).checked == false){
        newGame.items[item.itemID].edible = false
    }
    if ((<HTMLInputElement>document.getElementById("drinkable")).checked == false){
        newGame.items[item.itemID].drinkable = false
    }
    if ((<HTMLInputElement>document.getElementById("poisonous")).checked == false){
        newGame.items[item.itemID].poisonous = false
    }
    if ((<HTMLInputElement>document.getElementById("flammable")).checked == false){
        newGame.items[item.itemID].flammable = false
    }
    if ((<HTMLInputElement>document.getElementById("alight")).checked == false){
        newGame.items[item.itemID].alight = false
    }
    if ((<HTMLInputElement>document.getElementById("locked")).checked == false){
        newGame.items[item.itemID].locked = false
    }
    if ((<HTMLInputElement>document.getElementById("open")).checked == false){
        newGame.items[item.itemID].open = false
    }
    if ((<HTMLInputElement>document.getElementById("hidden")).checked == false){
        newGame.items[item.itemID].hidden = false
    }
    if ((<HTMLInputElement>document.getElementById("pushable")).checked == false){
        newGame.items[item.itemID].pushable = false
    }
    if ((<HTMLInputElement>document.getElementById("weapon")).checked == false){
        newGame.items[item.itemID].weapon = false
    }
    if ((<HTMLInputElement>document.getElementById("breakable")).checked == false){
        newGame.items[item.itemID].breakable = false
    }
    if ((<HTMLInputElement>document.getElementById("broken")).checked == false){
        newGame.items[item.itemID].broken = false
    }
    if ((<HTMLInputElement>document.getElementById("attackable")).checked == false){
        newGame.items[item.itemID].attackable = false
    }

    (<HTMLButtonElement> document.getElementById("saveItemEdits")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newItem")).style.display = "none";
    (<HTMLDivElement> document.getElementById("newButtons")).style.display = "inline";
    (<HTMLFormElement> document.getElementById("itemForm")).reset();

    renderList()
}

function renderList(){
    let placeList = <HTMLUListElement>document.getElementById("placeList")
    placeList.innerHTML = ""
    let itemList = <HTMLUListElement>document.getElementById("itemList")
    itemList.innerHTML = ""

    for (let i in newGame.places){
        let placeListEntry = document.createElement("li")
        placeListEntry.innerHTML = `(${newGame.places[i].placeID}) ${newGame.places[i].name}`
        placeList = <HTMLUListElement>document.getElementById("placeList")
        placeList.appendChild(placeListEntry)
    }

    for (let i in newGame.items){
        let itemListEntry = document.createElement("li")
        itemListEntry.innerHTML = `(${newGame.items[i].itemID}) ${newGame.items[i].itemName}`
        itemList = <HTMLUListElement>document.getElementById("itemList")
        itemList.appendChild(itemListEntry)
    }
}



function loadFromStorage(){

}

function saveToStorage(){

}