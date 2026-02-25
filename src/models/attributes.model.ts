export abstract class Score {
  #score: number
  #bonus: number
  #abilityProficiencies: Array<string>
  #proficiencies: Array<string>
  #expertiese: Array<string>
  #abilityName: string
  
  get score(): number {
    return this.#score
  }

  get withModifierBonus(): number {
    return this.#bonus + this.modifier
  }

  get modifier(): number {
    return Math.floor((this.#score - 10) / 2)
  }

  get savingThorw() {
    return this.#proficiencies.some(x => x.toLocaleLowerCase() === `${this.#abilityName.toLowerCase()}SavingThrow`.toLocaleLowerCase()) ? this.withModifierBonus : this.modifier;
  }

  get abilityScores(): Ability[] {
    return this.#abilityProficiencies.map(x => {
      let value = this.#proficiencies.some(y => y.toLocaleLowerCase() === x.toLocaleLowerCase()) ? this.withModifierBonus : this.modifier
      if (value === this.withModifierBonus && this.#expertiese.some(y => y.toLocaleLowerCase() === x.toLocaleLowerCase())) {
        value += this.#bonus
      }
      return new Ability(x, value)
    })
  }
  
  constructor(
    score: number,
    proficiencyBonus: number,
    proficiencies: Array<string>,
    expertiese: Array<string>,
    abilityProficiencies: Array<string>,
    abilityName: string) {
    this.#score = score;
    this.#bonus = proficiencyBonus
    this.#abilityProficiencies = abilityProficiencies
    this.#proficiencies = proficiencies
    this.#abilityName = abilityName
    this.#expertiese = expertiese
  }
}

export class Ability {
  #name: string
  #value: number

  get name(): string {
    return this.#name
  }

  get value(): number {
    return this.#value
  }

  constructor(name: string, value: number) {
    this.#name = name
    this.#value = value
  }
}

export class Strength extends Score {
    constructor(score: number, proficiencyBonus: number, proficiencies: Array<string>, expertiese: Array<string>) {
      super(score, proficiencyBonus, proficiencies, expertiese, ["Athletics"], "strength")
    }
}

export class Dexterity extends Score {
    constructor(score: number, proficiencyBonus: number, proficiencies: Array<string>, expertiese: Array<string>) {
      super(score, proficiencyBonus, proficiencies, expertiese, ["Acrobatics", "SleightOfHand", "Stealth"], "dexterity")
    }
}

export class Constitution extends Score {
    constructor(score: number, proficiencyBonus: number, proficiencies: Array<string>, expertiese: Array<string>) {
      super(score, proficiencyBonus, proficiencies, expertiese, [], "constitution")
    }
}

export class Intelligence extends Score {
    constructor(score: number, proficiencyBonus: number, proficiencies: Array<string>, expertiese: Array<string>) {
      super(score, proficiencyBonus, proficiencies, expertiese, ["Arcana", "History", "Investigation", "Nature", "Religion"], "intelligence")
    }
}

export class Wisdom extends Score {
    constructor(score: number, proficiencyBonus: number, proficiencies: Array<string>, expertiese: Array<string>) {
      super(score, proficiencyBonus, proficiencies, expertiese, ["AnimalHandling", "Insight", "Medicine", "Perception", "Survival"], "wisdom")
    }
}

export class Charisma extends Score {
    constructor(score: number, proficiencyBonus: number, proficiencies: Array<string>, expertiese: Array<string>) {
      super(score, proficiencyBonus, proficiencies, expertiese, ["Deception", "Intimidation", "Performance", "Persuasion"], "charisma")
    }
}