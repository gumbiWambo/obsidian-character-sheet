import { Score } from "models/attributes.model"
import { CharacterModel } from "models/character.model"

export default class CharacterHeader {
  #character: CharacterModel | undefined
  containerEl: HTMLElement

  constructor(character: CharacterModel | undefined, containerEl: HTMLElement) {
    this.#character = character
    this.containerEl = containerEl
  }

  get(): HTMLElement {
    const header = this.containerEl.createDiv()
    header.style.display = 'grid'
    header.style.gridArea = 'header'
    header.style.gridTemplateColumns = 'repeat(6, 1fr)'
    header.style.gridTemplateRows = '32px 32px 1fr'
    header.style.rowGap = '4px'
    header.style.gridTemplateAreas = '"name name name background background background" "class class class class class class" "strength dexterity constitution intelligence wisdom charisma"'
    header.appendChild(this.#createName())
    header.appendChild(this.#createClass())
    header.appendChild(this.#createBackground())
    if (this.#character) {
      header.appendChild(this.#createScore(this.#character.strength, 'Strength'))
      header.appendChild(this.#createScore(this.#character.dexterity, 'Dexterity'))
      header.appendChild(this.#createScore(this.#character.constitution, 'Constitution'))
      header.appendChild(this.#createScore(this.#character.intelligence, 'Intelligence'))
      header.appendChild(this.#createScore(this.#character.wisdom, 'Wisdom'))
      header.appendChild(this.#createScore(this.#character.charisma, 'Charisma'))
    }
    return header
  }

  #createName(): HTMLElement {
    const nameEl = this.containerEl.createEl('p')
    const designation = this.containerEl.createSpan()
    designation.innerText = "Name:"
    designation.style.marginRight = "4px"
    const name = this.containerEl.createSpan()
    name.innerText = this.#character?.name ?? ""
    nameEl.style.gridArea = 'name'
    nameEl.style.margin = '0px'
    nameEl.appendChild(designation)
    nameEl.appendChild(name)
    return nameEl
  }

  #createClass(): HTMLElement {
    const classEl = this.containerEl.createEl('p')
    const designation = this.containerEl.createSpan()
    designation.innerText = "Class:"
    designation.style.marginRight = "4px"
    const classes = this.containerEl.createSpan()
    classes.innerText = this.#character?.classWithSubclass.map(x => `${x.name} Level: ${x.level} (${x.subclass})`).join(', ') ?? ''
    classEl.style.gridArea = 'class'
    classEl.style.margin = '0px'
    classEl.appendChild(designation)
    classEl.appendChild(classes)
    return classEl
  }

  #createBackground(): HTMLElement {
    const backgroundEl = this.containerEl.createEl('p')
    const designation = this.containerEl.createSpan()
    designation.innerText = "Background:"
    designation.style.marginRight = "4px"
    const background = this.containerEl.createSpan()
    background.innerText = this.#character?.background ?? ""
    backgroundEl.style.gridArea = 'background'
    backgroundEl.style.alignSelf = 'left'
    backgroundEl.style.margin = '0px'
    backgroundEl.appendChild(designation)
    backgroundEl.appendChild(background)
    return backgroundEl
  }

  #createScore(score: Score, abilityName: string): HTMLElement {
    const abilityContainer = this.containerEl.createDiv()
    abilityContainer.style.gridArea = abilityName.toLocaleLowerCase()
    abilityContainer.style.display = 'flex'
    abilityContainer.style.flexDirection = 'column'
    abilityContainer.style.alignItems = 'center'
    abilityContainer.style.border = 'solid 1px white'

    const title = this.containerEl.createEl("span")
    title.innerText = abilityName

    abilityContainer.appendChild(title)
    abilityContainer.appendChild(this.#createHr())

    const modifier = this.containerEl.createEl('strong')
    modifier.innerText = score.modifier.toString() ?? '-'
    modifier.style.flexGrow = '0'
    abilityContainer.appendChild(modifier)

    abilityContainer.appendChild(this.#createHr())

    const scoreEl = this.containerEl.createEl('em')
    scoreEl.innerText = score.score.toString() ?? '-'
    scoreEl.style.flexGrow = '0'
    abilityContainer.appendChild(scoreEl)

    abilityContainer.appendChild(this.#createHr())

    score.abilityScores.forEach(x => {
      const ability = this.containerEl.createDiv()
      ability.innerText = `${x.name}: ${x.value}`
      abilityContainer.appendChild(ability)
    })

    return abilityContainer
  }

  #createHr(): HTMLElement {
    const hr = this.containerEl.createEl('hr')
    hr.style.width = '100%'
    hr.style.flexGrow = '0'
    return hr
  }
}