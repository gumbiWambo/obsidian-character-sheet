export class CharacterClassModel {

  #d6Classes = ["atavist", "sorcerer", "wizard"]
  #d8Classes = ["apothecary", "artificer", "bard", "cleric", "druid", "monk", "mystic", "rogue", "tamer", "warlock"]
  #d10Classes = ["blood hunter", "fighter", "paladin", "ranger"]
  #d12Classes = ["barbarian"]

  #strengthSave = ["atavist", "barbarian", "fighter", "monk", "ranger"]
  #dexSave = ["bard", "blood hunter", "monk", "ranger", "rogue"]
  #conSave = ["artificer", "atavist", "barbarian", "fighter", "sorcerer", "tamer"]
  #intSave = ["apothecary", "artificer", "blood hunter", "druid", "mystic", "rogue", "wizard"]
  #wisSave = ["apothecary", "cleric", "druid", "mystic", "paladin", "warlock", "wizard"]
  #chaSave = ["bard", "cleric", "paladin", "sorcerer", "tamer", "warlock"]

  name: string
  level: number
  hitDie: number
  subclass: string
  savingThrows: Array<string>

  constructor(name: string, level: number, subclass: string) {
    this.name = name
    this.level = level
    this.subclass = subclass
    this.#setHitDie()
    this.#setSavingThrows()
  }

  #setHitDie() {
    const lowerClassName = this.name.toLocaleLowerCase()
    if (this.#d6Classes.includes(lowerClassName)) {
      this.hitDie = 6
    }

    if (this.#d8Classes.includes(lowerClassName)) {
      this.hitDie = 8
    }

    if (this.#d10Classes.includes(lowerClassName)) {
      this.hitDie = 10
    }

    if (this.#d12Classes.includes(lowerClassName)) {
      this.hitDie = 12
    }
  }

  #setSavingThrows() {
    this.savingThrows = []
    const lowerClassName = this.name.toLocaleLowerCase()
    if (this.#dexSave.includes(lowerClassName)) {
      this.savingThrows.push("dexteritySavingThrow")
    }

    if (this.#strengthSave.includes(lowerClassName)) {
      this.savingThrows.push("strengthSavingThrow")
    }

    if (this.#conSave.includes(lowerClassName)) {
      this.savingThrows.push("constitutionSavingThrow")
    }

    if (this.#intSave.includes(lowerClassName)) {
      this.savingThrows.push("intelligenceSavingThrow")
    }

    if (this.#wisSave.includes(lowerClassName)) {
      this.savingThrows.push("wisdomSavingThrow")
    }

    if (this.#chaSave.includes(lowerClassName)) {
      this.savingThrows.push("charismaSavingThrow")
    }
  }

  
}