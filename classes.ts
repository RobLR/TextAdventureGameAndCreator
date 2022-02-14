"use strict"

// Game world class that will be used to store the player and all locations, so that it can be saved and provide easy reference to each location.
class World{
    worldName: string
    player: Player
    places: Record <string, Place> = {}
    items: Record <number, Item> = {}
    startText: string

    constructor(worldName:string, player: Player, startText: string){
        this.worldName = worldName
        this.player = player
        this.startText = startText
    }

    addPlace(id:number, place:Place){
        this.places[id]=place
    }

    addItem(id:number, item:Item){
        this.items[id]=item
    }
}

// Sets the player class, including all of the properties related to the player, for example where they are
class Player{ 
    inventory: Record <string, Item>
    place: Place
    // time: number = 0
    alive: boolean = true
    health: number = 20
    stamina: number = 10
    carryingWeight = 0
    maximumCarryWeight: number

    constructor(place: Place, health: number, stamina: number, maximumCarryWeight:number){
        this.inventory ={}
        this.place = place
        this.health = health
        this.stamina = stamina
        this.maximumCarryWeight = maximumCarryWeight
    }
}


// Creates a class for places including properties such as including other nearby places, what items are in this location
class Place{
    placeID: number
    name:string
    description:string = "No further information"
    nearby: Record <string, Place> = {}
    items: Record <string, Item> = {}
    exits: Record <string, Exit> = {}
    hints: string 
    
    constructor(placeID:number, name:string, description:string, hints:string){
        this.placeID = placeID
        this.name = name
        this.description = description
        this.nearby = {}
        this.hints = hints
    }

    // Links a new place to the current one and also creates a reverse link so you can go back to the previous place
    addNearbyPlace(direction:string, place:Place, exit:Exit){
        this.nearby[direction]=place
        this.exits[direction]=exit
        let previousDirection = ""
        if (direction == "north"){
            previousDirection = "south"
        }
        else if (direction == "south"){
            previousDirection = "north"
        }
        else if (direction == "east"){
            previousDirection = "west"
        }
        else if (direction == "west"){
            previousDirection = "east"
        }
        else if (direction == "up"){
            previousDirection = "down"
        }
        else if (direction == "down"){
            previousDirection = "up"
        }
        place.nearby[previousDirection] = this
        place.exits[previousDirection] = exit
    }

    addItem(name:string, item:Item){
        this.items[name]=item
    }
}

class Exit {
    locked : boolean
    blocked : boolean
    needsJump : boolean
    hidden : boolean
    durability : number

    constructor(locked:boolean, blocked:boolean, needsJump:boolean, hidden:boolean, durability:number){
        this.locked = locked
        this.blocked = blocked
        this.needsJump = needsJump
        this.hidden = hidden
        this.durability = durability
    }
}

// Defines items that exist in the world, these can be obstacles or items the player can pick up.
class Item {
    itemID: number
    itemName: string
    description: string
    weight: number
    durability: number
    parentContainerType : string
    parentContainerID : number
    contents: Record <string, Item> = {}
    alight: boolean = false
    broken: boolean = false
    locked:boolean = false
    collectable:boolean = false
    open:boolean = false
    hidden:boolean = false
    pushable: boolean = false
    edible : boolean = false
    drinkable : boolean = false
    poisonous: boolean = false
    breakable: boolean = false
    attackable: boolean = false
    flammable: boolean = false
    weapon: boolean = false


    // Constructor for new items.
    constructor(itemID:number, itemName:string, weight:number, description:string, durability:number, parentContainerType : string, parentContainerID : number) { 
        this.itemID = itemID
        this.description = description
        this.itemName = itemName
        this.weight = weight
        this.durability = durability
        this.parentContainerType = parentContainerType
        this.parentContainerID = parentContainerID
    }

    // Methods related to items
    
    addItem(name:string, item:Item){
        this.contents[name]=item
    }

}

