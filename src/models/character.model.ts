import { Charisma, Constitution, Dexterity, Intelligence, Strength, Wisdom } from "./attributes.model";
import { CharacterClassModel } from "./character-class.model";

interface HitDice {
  count: number
  die: number
}



export class CharacterModel {
  #classes: Array<CharacterClassModel>
  #name: string
  #background: string
  #stats: number[]
  #proficiencies: string[]
  #expertise: string[]

  get characterLevel() {
    return this.#classes.map(x => x.level).reduce((a, b) => a + b)
  }
  get proficiencyBonus() {
    return Math.floor(this.characterLevel / 4) + 1
  }

  get hitDice(): Array<HitDice>{
    return this.#classes.map(x => ({count: x.level, die: x.hitDie}))
  }
  
  get classWithSubclass() {
    return this.#classes.map(x => ({name: x.name, subclass: x.subclass, level: x.level}))
  }

  get name() {
    return this.#name
  }

  get background() {
    return this.#background
  }

  get proficiencies(): Array<string> {
    const prof = this.#proficiencies;
    prof.push(...this.#classes[0]?.savingThrows ?? '')
    return prof
  }

  get strength(): Strength {
    return new Strength(this.#stats[0] ?? 0, this.proficiencyBonus, this.proficiencies, this.#expertise)
  }

  get dexterity(): Dexterity {
    return new Dexterity(this.#stats[1] ?? 0, this.proficiencyBonus, this.proficiencies, this.#expertise)
  }

  get constitution(): Constitution {
    return new Constitution(this.#stats[2] ?? 0, this.proficiencyBonus, this.proficiencies, this.#expertise)
  }

  get intelligence(): Intelligence {
    return new Intelligence(this.#stats[3] ?? 0, this.proficiencyBonus, this.proficiencies, this.#expertise)
  }

  get wisdom(): Wisdom {
    return new Wisdom(this.#stats[4] ?? 0, this.proficiencyBonus, [], [])
  }

  get charisma(): Charisma {
    return new Charisma(this.#stats[5] ?? 0, this.proficiencyBonus, [], [])
  }

  constructor(classes: Array<CharacterClassModel>, name: string, background: string, stats: number[], proficiencies: Array<string>, expertise: Array<string>){
    this.#classes = classes
    this.#name = name
    this.#background = background
    this.#stats = stats
    this.#proficiencies = proficiencies
    this.#expertise = expertise
    // console.log(this.strength, this.dexterity, this.constitution, this.intelligence, this.wisdom, this.charisma)
  }
}