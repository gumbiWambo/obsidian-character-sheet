import DnDCharacterSheetPlugin from "main"
import { CharacterModel } from "models/character.model"
import { IconService } from "services/icon.service"
import { LanguageService } from "services/language.service"
import { Plugin } from "obsidian"
import { numberToSignedString } from "utils/Number"
import { Ability, Score } from "models/attributes.model"
import { svgFromString } from "utils/Svg"

export class CharacterScoreView {
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
    const scores = this.containerEl.createDiv()
    scores.addClass("character-ability-scores")
    const left = this.containerEl.createDiv()
    left.addClass("character-scores-left")
    const right = this.containerEl.createDiv()
    right.addClass(".character-scores-right")
    if (this.#character) {
      [
        {
          score: this.#character.strength,
          name: 'Strength',
          color: '#ff0000'
        },
        {
          score: this.#character.dexterity,
          name: 'Dexterity',
          color: '#00ff00'
        },
        {
          score: this.#character.constitution,
          name: 'Constitution',
          color: '#d9ff00'
        }
      ].forEach(x => {
          this.#createScore(x.score, x.name, x.color).then(y => {
            left.appendChild(y)
          })
      });

      [
        {
          score: this.#character.intelligence,
          name: 'Intelligence',
          color: '#00ffff'
        },
        {
          score: this.#character.wisdom,
          name: 'Wisdom',
          color: '#0066ff'
        },
        {
          score: this.#character.charisma,
          name: 'Charisma',
          color: '#e27108'
        }].forEach(x => {
          this.#createScore(x.score, x.name, x.color).then(y => {
            right.appendChild(y)
          })
        });
    }
    scores.appendChild(left)
    scores.appendChild(right)
    return scores;
  }

  async #createScore(score: Score, abilityName: string, color: string = '#ffffff'): Promise<HTMLElement> {
    const abilityContainer = this.containerEl.createDiv()
    abilityContainer.style.gridArea = abilityName.toLocaleLowerCase()
    abilityContainer.style.color = color
    abilityContainer.addClass('character-sheet-score')

    const title = this.containerEl.createEl("span")
    title.innerText = this.#languageService.translate(`ability.${abilityName.toLocaleLowerCase()}`)
    title.addClass('character-sheet-score-title')

    abilityContainer.appendChild(title)
    abilityContainer.appendChild(await this.#createModifierAndScore(score, abilityName, color))

    abilityContainer.appendChild(this.#createHr())


    abilityContainer.appendChild(this.#createSavingThrow(score))

    abilityContainer.appendChild(this.#createHr())

    score.abilityScores.forEach(x => {
      abilityContainer.appendChild(this.#createAbility(x))
    })

    return abilityContainer
  }

  async #createModifierAndScore(score: Score, abilityName: string, color: string): Promise<HTMLElement> {
    const scoreContainer = this.containerEl.createDiv()

    const modifier = svgFromString(await this.#iconService.getShape('modifier-circle'))
    modifier.addClass(`${abilityName.toLocaleLowerCase()}`)
    modifier.addClass(`character-scores-modifier`)
    modifier.style.stroke = color
    const modifierText = modifier.querySelector<HTMLElement>('text.character-modifier-text')
    if (modifierText) {
      modifierText.style.fill = color
      modifierText.innerHTML = numberToSignedString(score.modifier);
    }

    const scoreText = modifier.querySelector<HTMLElement>('text.character-score-text')
    if (scoreText) {
      scoreText.style.fill = color
      scoreText.innerHTML = score.score.toString();
    }

    
    scoreContainer.addClass('character-scores-score-container')
    scoreContainer.appendChild(modifier)

    return scoreContainer
  }

  #createAbility(ability: Ability): HTMLElement {
      const abilityEl = this.containerEl.createDiv()
      const abilityTranslationKey = `ability.${ability.name.toLocaleLowerCase()}`
      abilityEl.innerText = `${this.#languageService.translate(abilityTranslationKey)}: ${numberToSignedString(ability.value)}`
      return abilityEl
  }

  #createSavingThrow(score: Score): HTMLElement {
    const savingThrowEl = this.containerEl.createEl('span')
    savingThrowEl.appendText(this.#languageService.translate('ability.savingThrow') + ': ')
    savingThrowEl.appendText(numberToSignedString(score.savingThorw) ?? '')
    return savingThrowEl
  }

  #createHr(): HTMLElement {
    const hr = this.containerEl.createEl('hr')
    hr.addClass('character-sheet-divider')
    return hr
  }
}