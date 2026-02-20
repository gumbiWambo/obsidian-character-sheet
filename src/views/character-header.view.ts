import DnDCharacterSheetPlugin from "main"
import { Score } from "models/attributes.model"
import { CharacterModel } from "models/character.model"
import { Plugin } from "obsidian"
import { IconService } from "services/icon.service"
import { LanguageService } from "services/language.service"
import { numberToSignedString } from "utils/Number"

export default class CharacterHeader {
  #character: CharacterModel | undefined
  #plugin: Plugin
  #iconService: IconService
  #languageService: LanguageService
  containerEl: HTMLElement

  constructor(character: CharacterModel | undefined, containerEl: HTMLElement, plugin: Plugin) {
    this.#character = character
    this.#plugin = plugin
    this.#iconService = new IconService(this.#plugin)
    this.#languageService = new LanguageService(this.#plugin as DnDCharacterSheetPlugin)
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
      header.appendChild(this.#createScore(this.#character.strength, 'Strength', '#ff0000'))
      header.appendChild(this.#createScore(this.#character.dexterity, 'Dexterity', '#00ff00'))
      header.appendChild(this.#createScore(this.#character.constitution, 'Constitution', '#d9ff00'))
      header.appendChild(this.#createScore(this.#character.intelligence, 'Intelligence', '#00ffff'))
      header.appendChild(this.#createScore(this.#character.wisdom, 'Wisdom', '#0066ff'))
      header.appendChild(this.#createScore(this.#character.charisma, 'Charisma', '#e27108'))
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

    this.#character?.classWithSubclass.forEach(classSubclass => {
      const classes = this.containerEl.createSpan()
      const path = this.#iconService.getSourcePathForClassIcon(classSubclass.name.toLocaleLowerCase())
      const iconLevelContainer = this.containerEl.createDiv()
      iconLevelContainer.style.position = 'relative'
      
      classes.style.marginRight = '8px'
      classes.style.display = 'flex'

      if (path) {
        const img = this.containerEl.createEl('img')
        img.src = path
        img.style.height = '24px'
        img.style.width = '24px'
        img.style.marginRight = '4px'
        iconLevelContainer.appendChild(img)
      }

      const levelSpan = this.containerEl.createEl('span')
      levelSpan.innerText = classSubclass.level.toString() ?? ''
      levelSpan.style.position = 'absolute'
      levelSpan.style.bottom = '0px'
      levelSpan.style.right = '50%'
      levelSpan.style.fontSize = '12px'
      iconLevelContainer.appendChild(levelSpan)

      const name = this.#languageService.translate(`classes.${classSubclass.name.toLocaleLowerCase()}`)
      classes.appendChild(iconLevelContainer)
      classes.appendText(`${name} (${classSubclass.subclass})`)
      classEl.appendChild(classes)
    })

    classEl.style.gridArea = 'class'
    classEl.style.margin = '0px'
    classEl.style.display = 'flex'
    classEl.style.flexDirection = 'row'
    classEl.style.alignItems = 'center'
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

  #createScore(score: Score, abilityName: string, color: string = '#ffffff'): HTMLElement {
    const abilityContainer = this.containerEl.createDiv()
    abilityContainer.style.gridArea = abilityName.toLocaleLowerCase()
    abilityContainer.style.display = 'flex'
    abilityContainer.style.flexDirection = 'column'
    abilityContainer.style.alignItems = 'center'
    abilityContainer.style.border = 'solid 1px white'
    abilityContainer.style.color = color

    const title = this.containerEl.createEl("span")
    title.innerText = this.#languageService.translate(`ability.${abilityName.toLocaleLowerCase()}`)

    abilityContainer.appendChild(title)
    abilityContainer.appendChild(this.#createHr())

    const modifier = this.containerEl.createEl('strong')
    modifier.innerText = numberToSignedString(score.modifier)
    modifier.style.flexGrow = '0'
    abilityContainer.appendChild(modifier)

    abilityContainer.appendChild(this.#createHr())

    const scoreEl = this.containerEl.createEl('em')
    scoreEl.innerText = score.score.toString() ?? '-'
    scoreEl.style.flexGrow = '0'
    abilityContainer.appendChild(scoreEl)

    abilityContainer.appendChild(this.#createHr())

    const savingThrowEl = this.containerEl.createEl('span')
    savingThrowEl.appendText(this.#languageService.translate('ability.savingThrow') + ': ')
    savingThrowEl.appendText(numberToSignedString(score.savingThorw) ?? '')
    abilityContainer.appendChild(savingThrowEl)

    abilityContainer.appendChild(this.#createHr())

    score.abilityScores.forEach(x => {
      const ability = this.containerEl.createDiv()
      const abilityTranslationKey = `ability.${x.name.toLocaleLowerCase()}`
      ability.innerText = `${this.#languageService.translate(abilityTranslationKey)}: ${numberToSignedString(x.value)}`
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