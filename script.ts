"use strict"

let gameWorld:World
let currentGameData:any = ""

let s:string=localStorage.getItem("game")!
if(s!=null){
    gameWorld = ((<any>JSON).retrocycle)((<any>JSON).parse(s));
}

let startButton = <HTMLButtonElement> document.getElementById("startDefault")
startButton.addEventListener("click", startDefault)
let inputCustomGameButton = <HTMLButtonElement> document.getElementById("inputCustomGameButton")
inputCustomGameButton.addEventListener("click", inputCustomGame)
let startCustomButton = <HTMLButtonElement> document.getElementById("startCustomGame")
startCustomButton.addEventListener("click", startCustomGame)
let restartButton = <HTMLButtonElement> document.getElementById("restartButton")
restartButton.addEventListener("click", restartGame)

async function startDefault(){
    let defaultGameJSON = await fetchString("defaultGame.json")
    currentGameData = defaultGameJSON
    gameWorld = ((<any>JSON).retrocycle)((<any>JSON).parse(defaultGameJSON))
    document.getElementById("gameOutput")!.innerHTML = ""
    output (fullDescription(gameWorld.player.place))
}

async function fetchString(url: string) {
    const method = "GET"
    const headers = { 'Accept': 'text/html', 'Content-Type': 'application/json' }
    const response = await fetch(url, { method: method, headers: headers })
    if (response.ok) {
        return await response.text()
    }
    else {
        console.log(`unexpected response status ${response.status} + ${response.statusText}`)
    }
}

function inputCustomGame(){
    let jsonInputForm = <HTMLDivElement> document.getElementById("jsonInputForm")
    jsonInputForm.style.display = "flex"
}

function startCustomGame(){
    let customGameJSON = (<HTMLTextAreaElement>document.getElementById("jsonInput")).value
    currentGameData = customGameJSON
    gameWorld = ((<any>JSON).retrocycle)((<any>JSON).parse(customGameJSON))
    let jsonInputForm = <HTMLDivElement> document.getElementById("jsonInputForm")
    jsonInputForm.style.display = "none"
    document.getElementById("gameOutput")!.innerHTML = ""
    output (fullDescription(gameWorld.player.place))
}

let ob= <HTMLElement> document.getElementById("scroll")
function scrollToBottom(){
    ob!.scrollTop=ob!.scrollHeight
    }

// Gets the id of userInput and stores it in a variable, then adds an event handler when a key is pressed it executes a function
let userInput = <HTMLInputElement> document.getElementById("userInput")
userInput.addEventListener("keypress", keyPressed)

// Takes the key press input from the listener event (see userInput variable) and if it was an enter calls the execute function using the users input.
function keyPressed (e:KeyboardEvent){
    if (e.key == "Enter"){
        execute(userInput.value)
        userInput.value = ""
        
    }
    if (e.key == 'Enter'){
        scrollToBottom()
    }
}

// Adds the output text to the end of the game text
function output (input:string){
    document.getElementById("gameOutput")!.innerHTML += input + "<br>"
}

// When called, returns the description, nearby items and nearby places to be shown on screen
function fullDescription(place:Place):string{
    return `
    ${place.description}<br>
    You see: ${listItems(place.items)}<br>
    You can go: ${listProperties(place.nearby)}<br>
    Inventory: ${listProperties(gameWorld.player.inventory)}<br>
    `
}

// Reads the values in an object (using the parameter list) and appends them to a string so that it can be output, so long as the item is not hidden
function listItems(list:any):string{
    let output:string = ""
    for (let i in list){
        let item = list[i]
        if(item.hidden == false){
            output += i + ", "
        }
    }
    return output
}

// Reads the values in an object (using the parameter list) and appends them to a string so that it can be output.
function listProperties(list:object):string{
    
    let output:string = ""
    for (let i in list){
        output += i + ", "
    }
    return output
}



// This function contains all of the command options available in the game
function execute (command:string){
    
    let card = <HTMLDivElement> document.getElementById("card")
    card.style.display = "none"
    let words = command.toLowerCase().split(" ")


    if("north,east,south,west,up,down".includes(words[0])){
        if (gameWorld.player.place.exits[words[0]].locked == false && gameWorld.player.place.exits[words[0]].blocked == false && gameWorld.player.place.exits[words[0]].needsJump == false){
            gameWorld.player.place=gameWorld.player.place.nearby[words[0]]
        }
        else if (gameWorld.player.place.exits[words[0]].locked == true){
            output("The way is shut <br>")
        }
        else if (gameWorld.player.place.exits[words[0]].blocked == true){
            output("This exit is blocked <br>")
        }
        else if (gameWorld.player.place.exits[words[0]].needsJump = true){
            output("The gap is too big")
        }
    }
        
    else if(words[0]=="jump"){
        if("north,east,south,west".includes(words[1]) && gameWorld.player.place.exits[words[1]].locked == false){
            gameWorld.player.place=gameWorld.player.place.nearby[words[1]]
        }
        else if("north,east,south,west".includes(words[1]) && gameWorld.player.place.exits[words[1]].locked == true)
            output("This way is shut.")
    }
    
    else if (words[0] == "open"){
        let container=gameWorld.player.place.items[words[1]]
        if (container.open){
            output("It's already opened")
        }
        else if (container.locked == true){
            output ("You can't open this, it's locked")
        }
        else {
            container.open = true
            for (let k in container.contents){
                gameWorld.player.place.items[k]=container.contents[k]
                delete container.contents[k]
            }
           output("It is now open")
        }
    }

    else if (words[0] == "close"){
        if (gameWorld.player.place.items[words[1]].open) {
            gameWorld.player.place.items[words[1]].open = false    
        }
        else {
            output("It is already closed")
        }
    }
    
    else if(words[0] == "unlock"){
        if (words[1] == "door" || words[1] == "exit"){
            if (gameWorld.player.place.exits[words[2]].locked == true && gameWorld.player.inventory.hasOwnProperty("key") && gameWorld.player.inventory.key.broken == false){
                gameWorld.player.place.exits[words[2]].locked = false
                output (`You unlock the ${words[2]} door`)
            }
            else if (gameWorld.player.place.exits[words[2]].locked == true && ! gameWorld.player.inventory.hasOwnProperty("key")){
                output ("You need a key")
            }
            else if (gameWorld.player.place.exits[words[2]].locked == false){
                output ("This door is already unlocked")
            }
            else if (gameWorld.player.place.exits[words[2]].locked == true && gameWorld.player.inventory.hasOwnProperty("key") && gameWorld.player.inventory.key.broken == true){
                output("The key is broken")
            }
        }
        
        else {
            if (gameWorld.player.place.items[words[1]].locked && gameWorld.player.inventory.hasOwnProperty("key")){
                gameWorld.player.place.items[words[1]].locked = false
            }
            else if (gameWorld.player.place.items[words[1]].locked && gameWorld.player.inventory.hasOwnProperty("key") == false){
                output("You need a key")
            }
            else if (gameWorld.player.place.items[words[1]].locked == false){
                output("It's already unlocked")
            }
        }
    }
    
    else if (words[0] == "lock"){
        if (gameWorld.player.place.items[words[1]].locked){
            output("This is already locked")
        }
        else if (gameWorld.player.place.items[words[1]].locked == false){
            gameWorld.player.place.items[words[1]].locked = true
            output("You have locked this")
        }
    }

    else if (words[0] == "dig") {
        
        if (words[1] == "exit" && gameWorld.player.place.exits[words[2]].blocked == true && gameWorld.player.inventory.hasOwnProperty("shovel")){  
            gameWorld.player.place.exits[words[2]].blocked == false
            output("You've unblocked the exit")
        }
        else if(words[1] == "exit" && gameWorld.player.place.exits[words[2]].blocked == false){
            output("You don't need to dig this")
        }
        
        else if(gameWorld.player.inventory.hasOwnProperty("shovel") && gameWorld.player.inventory.shovel.broken == false){
            
            // Object.values(player.place.items).forEach(i =>{ 
            //     if (i.hidden) {
            //         i.hidden = false
            //         output(`You have dug an ${i.itemName} out!`)
            //     }
            // })
            for(let i in gameWorld.player.place.items){
                let item = gameWorld.player.place.items[i]
                if (item.hidden) {
                    item.hidden = false
                    output(`You have dug up a ${item.itemName}!`)
                }
            }
            gameWorld.player.inventory.shovel.durability -= 1
        }
        
        else if(gameWorld.player.inventory.hasOwnProperty("shovel") && gameWorld.player.place.items[words[1]].broken == true){
            output(`Your shovel is broken, you cannot dig.`)
        }
    }

    
    else if(words[0]=="climb"){
        if("up,down".includes(words[1]) && gameWorld.player.place.exits[words[1]].locked == false){
            gameWorld.player.place=gameWorld.player.place.nearby[words[1]]
        }
        else if("up,down".includes(words[1]) && (gameWorld.player.place.exits[words[1]].locked == true || gameWorld.player.place.exits[words[1]].blocked == true)){
            output("This way is shut.")
        }
    }

    else if (words[0]=="take"){
        if ((gameWorld.player.place.items.hasOwnProperty(words[1])) && (gameWorld.player.place.items[words[1]].collectable == true) && (gameWorld.player.carryingWeight < gameWorld.player.maximumCarryWeight) &&(gameWorld.player.place.items[words[1]].alight == false)) { 
            gameWorld.player.inventory[words[1]]=gameWorld.player.place.items[words[1]] 
            delete gameWorld.player.place.items[words[1]] 
        }
        else if (gameWorld.player.place.items.hasOwnProperty(words[1]) == false) {
            output("That item doesn't exist")
        }
        else if (gameWorld.player.carryingWeight >= gameWorld.player.maximumCarryWeight) {
            output ("Sorry, your bag is full, drop an item off first before trying to take something else.")
        }
        else if (gameWorld.player.place.items[words[1]].collectable == false) {
            output ("You can't pick this up come on...")
        }
        else if(gameWorld.player.place.items[words[1]].alight == true){
            output(`You can't pick the ${words[1]} up, it's burning`)
        }
    }

    else if (words[0]=="drop") {
        if (gameWorld.player.inventory.hasOwnProperty(words[1])){
            gameWorld.player.place.items[words[1]]=gameWorld.player.inventory[words[1]]
            delete gameWorld.player.inventory[words[1]]
        }
    }
    
    else if (words[0]=="push"){
        let container = gameWorld.player.place.items[words[1]]
        if(container.pushable == false){
           output("You can't move this")
        }

        else if(container.pushable == true){
            for (let k in container.contents){
                gameWorld.player.place.items[k]=container.contents[k]
                delete container.contents[k]
            }
            output (`You have pushed the ${words[1]}`)            
        }
    }

    else if (words[0]=="hint"){
        
        let para = <HTMLParagraphElement>document.getElementById("para")
        para.innerHTML = ""
        para.innerHTML=gameWorld.player.place.hints

        card.style.display = "block"

    }
        
    else if (words[0]=="eat"){                             
        if (words[1] in gameWorld.player.place.items) {
            if ((gameWorld.player.place.items[words[1]].edible == true) && (gameWorld.player.place.items[words[1]].poisonous == false)) {
                gameWorld.player.health += 5
                output ("That tasted good")
                delete gameWorld.player.place.items[words[1]]
            }
            else if ((gameWorld.player.place.items[words[1]].edible == true) && (gameWorld.player.place.items[words[1]].poisonous == true)) {
                gameWorld.player.health -= 5
                output("That was disgusting")
                delete gameWorld.player.place.items[words[1]]
            }
            else if (gameWorld.player.place.items[words[1]].edible == false) {
                output ("I don't think you want to eat this")
            }
        }

        else if (words[1] in gameWorld.player.inventory) {
            if ((gameWorld.player.inventory[words[1]].edible == true) && (gameWorld.player.inventory[words[1]].poisonous == false)) {
                gameWorld.player.health += 5
                output ("That tasted good")
                delete gameWorld.player.inventory[words[1]]
            }
            else if ((gameWorld.player.inventory[words[1]].edible == true) && (gameWorld.player.inventory[words[1]].poisonous == true)) {
                gameWorld.player.health -= 5
                output("That was disgusting")
                delete gameWorld.player.inventory[words[1]]
            }
            else if (gameWorld.player.inventory[words[1]].edible == false) {
                output ("I don't think you want to eat this")
            }
        }
    }
    
    else if (words[0]=="drink"){                             
        if (words[1] in gameWorld.player.place.items) {        
            if ((gameWorld.player.place.items[words[1]].drinkable == true) && (gameWorld.player.place.items[words[1]].poisonous == false)) {
                gameWorld.player.stamina += 5
                delete gameWorld.player.place.items[words[1]]
            }
            else if ((gameWorld.player.place.items[words[1]].drinkable == true) && (gameWorld.player.place.items[words[1]].poisonous == true)) {
                gameWorld.player.stamina -= 5
                delete gameWorld.player.place.items[words[1]]
            }
            else if ((gameWorld.player.place.items[words[1]].drinkable == false || gameWorld.player.inventory[words[1]].drinkable == false)) {
                output ("I don't think you can drink this")
            }
        }

        else if (words[1] in gameWorld.player.inventory) {
            if ((gameWorld.player.inventory[words[1]].drinkable == true) && (gameWorld.player.inventory[words[1]].poisonous == false)) {
                gameWorld.player.stamina += 5
                delete gameWorld.player.inventory[words[1]]
            }
            else if ((gameWorld.player.inventory[words[1]].drinkable == true) && (gameWorld.player.inventory[words[1]].poisonous == true)) {
                gameWorld.player.stamina -= 5
                delete gameWorld.player.inventory[words[1]]
            }
            else if ((gameWorld.player.place.items[words[1]].drinkable == false || gameWorld.player.inventory[words[1]].drinkable == false)) {
                output ("I don't think you can drink this")
            }
        }
    }
    
    else if (words[0] == "attack"){
        if (words[1] == "door" || words[1] == "exit"){
            if ((words[3] in gameWorld.player.inventory) && (gameWorld.player.inventory[words[3]].weapon == true) && (gameWorld.player.inventory[words[3]].broken == false)){
                gameWorld.player.place.exits[words[2]].durability -= 2
                gameWorld.player.inventory[words[3]].durability -=1
                output(`You hit the ${words[1]} with the ${words[3]}`)
                if (gameWorld.player.place.exits[words[2]].durability <= 0){
                    gameWorld.player.place.exits[words[2]].locked = false
                    output (`You break the ${words[1]}`)
                }
            }
            else if (gameWorld.player.inventory.hasOwnProperty(words[3]) == false) {
                output(`You do not have a ${words[3]}`)
            }
            else if (gameWorld.player.inventory[words[3]].weapon == false) {
                output(`This is not a weapon`)
            }
            else if (gameWorld.player.inventory[words[3]].broken == true) {
                output(`The ${words[3]} is broken`)
            }
        }
        else if (gameWorld.player.place.items.hasOwnProperty(words[1]) == true) {
            if ((gameWorld.player.place.items[words[1]].attackable == true) && (words[2] in gameWorld.player.inventory) && (gameWorld.player.inventory[words[2]].weapon == true) && (gameWorld.player.inventory[words[3]].broken == false)) {
                gameWorld.player.place.items[words[1]].durability -= 2
                gameWorld.player.inventory[words[2]].durability -=1
                if(gameWorld.player.place.items[words[1]].durability >= 1){
                    output (`You almost broke ${words[1]}, however it looks like it needs more hitting to break completely`)
                }
                else if (gameWorld.player.place.items[words[1]].durability <= 0){
                    gameWorld.player.place.items[words[1]].broken = true
                    output(`You broke the ${words[1]}`)
                }
            }
            else if (gameWorld.player.inventory.hasOwnProperty(words[2]) == false) {
                output(`You do not have a ${words[2]}`)
            }
            else if (gameWorld.player.inventory[words[2]].weapon == false) {
                output(`This is not a weapon`)
            }
            else if (gameWorld.player.inventory[words[2]].broken == true) {
                output(`The ${words[3]} is broken`)
            }
        }
        else if ((gameWorld.player.place.items[words[1]].attackable == false && gameWorld.player.inventory[words[2]].weapon == false)) {
            output (`You cannot hit a ${words[1]} come on...`)
        }
    }

    else if (words[0] == "burn") {
        if (words[1] in gameWorld.player.place.items) {
            if (gameWorld.player.place.items[words[1]].flammable == true) {
                gameWorld.player.place.items[words[1]].alight = true
                output(`You set the ${words[1]} on fire`)
            }
            else if (gameWorld.player.place.items[words[1]].flammable == false) {
                output("That's not flammable")
            }
        }
        
        else if (words[1] in gameWorld.player.inventory) {
            if (gameWorld.player.inventory[words[1]].flammable == true) {
                gameWorld.player.inventory[words[1]].alight = true
                gameWorld.player.place.items[words[1]]=gameWorld.player.inventory[words[1]]
                delete gameWorld.player.inventory[words[1]]
                output(`You set the ${words[1]} on fire and drop it`)
            }
            else if (gameWorld.player.inventory[words[1]].flammable == false) {
                output("That's not flammable")
            }
        }
    }

    else if (words[0] == "examine"){
        if (gameWorld.player.place.items.hasOwnProperty(words[1])){
            output(`${gameWorld.player.place.items[words[1]].description}<br>`)
        }
        else if (gameWorld.player.inventory.hasOwnProperty(words[1])){
            output(`${gameWorld.player.inventory[words[1]].description}<br>`)
        }
        else{
            output ("Sadly, you cannot examine this")
        }
    }

    else if (words[0] == "break"){
        if (gameWorld.player.place.items[words[1]].breakable == true && gameWorld.player.place.items[words[1]].broken == false){
            gameWorld.player.place.items[words[1]].broken = true;
            output (`You have broken the ${words[1]}`)
        } 
        
        else if(gameWorld.player.place.items[words[1]].breakable == false) {
            output ("You have overestimated your powers. This cannot be broken.")
        }
        else if(gameWorld.player.place.items[words[1]].broken == true){
            output("It's already broken")
        }
    
    }
    else if (words[0] =="fix"){
        if ((gameWorld.player.place.items.hasOwnProperty(words[1]) == true) && (gameWorld.player.place.items[words[1]].broken == true)){
            if (gameWorld.player.inventory.hasOwnProperty("toolbox") == true){
                gameWorld.player.place.items[words[1]].broken = false
                gameWorld.player.place.items[words[1]].durability +=5
                output(`You have fixed the ${words[1]}`)
            }
            else if (gameWorld.player.inventory.hasOwnProperty("toolbox") == false){
                output("You need the toolbox in your inventory")
            }    
        }
        else if ((gameWorld.player.inventory.hasOwnProperty(words[1]) == true) && (gameWorld.player.inventory[words[1]].broken == true)){
            if (gameWorld.player.inventory.hasOwnProperty("toolbox") == true){
                gameWorld.player.inventory[words[1]].broken = false
                gameWorld.player.inventory[words[1]].durability +=5
                output(`You have fixed the ${words[1]}`)
            }
            else if (gameWorld.player.inventory.hasOwnProperty("toolbox") == false){
                output("You need the toolbox in your inventory")
            }    
        }
        else {
            output("This isn't broken")
        }
    }
    

    output (fullDescription(gameWorld.player.place))
    
    for(let k in gameWorld.items){
        let item = gameWorld.items[k]
        if (item.alight == true) {
            item.durability -= 1
        }
        if (item.durability <= 0){
            item.broken = true
        }
        if (item.durability <= 0 && item.alight == true){
            item.alight = false
            item.flammable = false
        }
    }
    
    if (gameWorld.player.health == 0) {
        gameWorld.player.alive == false
        output ("Oh no, you are dead!")
        restartGame()
    }

    gameWorld.player.carryingWeight = 0
    for (let k in gameWorld.player.inventory){
        let item = gameWorld.player.inventory[k]
        gameWorld.player.carryingWeight += item.weight
    }
}

function restartGame(){
    gameWorld = ((<any>JSON).retrocycle)((<any>JSON).parse(currentGameData))
    document.getElementById("gameOutput")!.innerHTML = ""
    output (fullDescription(gameWorld.player.place))
}

let save = document.getElementById("save")
save!.addEventListener("click", savesaveGame)

function savesaveGame(){
    let s = JSON.stringify((<any>JSON).decycle(gameWorld))
    localStorage.setItem("game",s)
}