import { CharacterModel } from "models/character.model"
import { MarkdownRenderer, Plugin } from "obsidian"
import { FileUtils } from "utils/File"

export default class CharacterInventory {
  #character: CharacterModel | undefined
  #plugin: Plugin
  #fileUtils: FileUtils
  #context: string
  containerEl: HTMLElement

  constructor(plugin: Plugin, character: CharacterModel | undefined, containerEl: HTMLElement, context: string) {
    this.#plugin = plugin
    this.#character = character
    this.#fileUtils = new FileUtils(this.#plugin.app)
    this.#context = context
    this.containerEl = containerEl

    this.#plugin.app.vault
  }

  get(): HTMLElement {
    const inventory = this.containerEl.createDiv()
    inventory.addClass("character-sheet-inventory")
    const title = this.containerEl.createEl('h3')
    title.innerText = 'Inventory'
    inventory.appendChild(title)
    inventory.appendChild(this.#createHr())
    inventory.appendChild(this.#createItemList(['Item', 'item', 'Gegenstand']))
    inventory.appendChild(this.#createHr())
    inventory.appendChild(this.#createItemList(['MagicItem', 'magic item', 'Magischer Gegenstand']))
    return inventory
  }

  #createHr(): HTMLElement {
    const hr = this.containerEl.createEl('hr')
    hr.addClass('character-sheet-divider')
    return hr
  }

  #createItemList(tag: string[]): HTMLElement {
    const nomralItemList = this.containerEl.createEl('ul')
    this.#fileUtils.getAllFilesWithTag(tag)
    .map( async x => {
      const li = this.containerEl.createEl('li')
      nomralItemList.appendChild(li)
      await MarkdownRenderer.render(
        this.#plugin.app,
        this.#fileUtils.createFullPathLink(x),
        li,
        this.#context,
        this.#plugin
      )
    })
    return nomralItemList
  }
}