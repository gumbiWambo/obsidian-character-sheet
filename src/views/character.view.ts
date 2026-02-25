import { CharacterModel } from "models/character.model";
import { MarkdownRenderChild, Plugin } from "obsidian";
import CharacterHeader from "./character-header/character-header.view";
import CharacterInventory from "./character-inventory/character-inventory.view";
import { CharacterScoreView } from "./character-score/character-score.view";

type RendererParameters = {
    container: HTMLElement;
    plugin: Plugin;
    context?: string;
    character?: CharacterModel;
}

export default class CharacterRenderChild extends MarkdownRenderChild {

  #plugin: Plugin
  #context: string
  #workspaceEl: HTMLElement
  #character: CharacterModel | undefined

  constructor(
    public rendererParameters: RendererParameters
  ) {
    super(rendererParameters.container)
    this.#plugin = rendererParameters.plugin
    this.#context = rendererParameters.context ?? ""
    this.#character = rendererParameters.character
    this.#workspaceEl = this.containerEl.ownerDocument.querySelector("body > div.app-container > div.horizontal-main-container > div > div.workspace-split.mod-vertical.mod-root > div > div.workspace-tab-container") as HTMLElement

  }

  onload(): void {
    this.#workspaceEl.addClass("character-sheet")
    this.containerEl.addClass('character-sheet-view')
    if (this.#character) {
      this.containerEl.empty()
      this.containerEl.addClass("character-sheet-layout")
      const header = new CharacterHeader(this.#character, this.containerEl, this.#plugin)
      const inventory = new CharacterInventory(this.#plugin, this.#character, this.containerEl, this.#context)
      const scores = new CharacterScoreView(this.#character, this.containerEl, this.#plugin)
      this.containerEl.appendChild(header.get())
      this.containerEl.appendChild(inventory.get())
      this.containerEl.appendChild(scores.get())
    }
  }

  onunload(): void {
    this.#workspaceEl.removeClass("character-sheet")
  }
}