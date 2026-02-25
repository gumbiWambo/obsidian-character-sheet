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
    header.addClass('character-sheet-header')
    header.appendChild(this.#createName())
    header.appendChild(this.#createClass())
    header.appendChild(this.#createBackground())
    return header
  }

  #createName(): HTMLElement {
    const nameEl = this.containerEl.createEl('p')
    const designation = this.containerEl.createSpan()
    designation.innerText = "Name:"
    designation.addClass("character-sheet-header-designation")
    const name = this.containerEl.createSpan()
    name.innerText = this.#character?.name ?? ""
    nameEl.addClass("character-sheet-header-name")
    nameEl.appendChild(designation)
    nameEl.appendChild(name)
    return nameEl
  }

  #createClass(): HTMLElement {
    const classEl = this.containerEl.createEl('p')
    classEl.addClass('character-sheet-header-class')

    this.#character?.classWithSubclass.forEach(classSubclass => {
      const classes = this.containerEl.createSpan()
      classes.addClass("character-sheet-header-class")
      const path = this.#iconService.getSourcePathForClassIcon(classSubclass.name.toLocaleLowerCase())
      const iconLevelContainer = this.containerEl.createDiv()
      iconLevelContainer.addClass("character-sheet-level")
      
      if (path) {
        const img = this.containerEl.createEl('img')
        img.src = path
        img.addClass("character-sheet-class-icon")
        iconLevelContainer.appendChild(img)
      }

      const levelSpan = this.containerEl.createEl('span')
      levelSpan.innerText = classSubclass.level.toString() ?? ''
      levelSpan.addClass('character-sheet-level-number')
      if (classSubclass.level >= 10) {
        levelSpan.addClass('double-digit')
      }
      iconLevelContainer.appendChild(levelSpan)

      const name = this.#languageService.translate(`classes.${classSubclass.name.toLocaleLowerCase()}`)
      const nameEl = this.containerEl.createEl('span', {
        text: `${name} (${classSubclass.subclass})`,
        cls: 'character-sheet-class-name'
      })
      classes.appendChild(iconLevelContainer)
      classes.appendChild(nameEl)
      classEl.appendChild(classes)
    })

    return classEl
  }

  #createBackground(): HTMLElement {
    const backgroundEl = this.containerEl.createEl('p')
    const designation = this.containerEl.createSpan()
    designation.innerText = "Background:"
    designation.addClass("character-sheet-header-designation")
    const background = this.containerEl.createSpan()
    background.innerText = this.#character?.background ?? ""
    backgroundEl.addClass('character-sheet-background')
    backgroundEl.appendChild(designation)
    backgroundEl.appendChild(background)
    return backgroundEl
  }
}