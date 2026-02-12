import { CharacterModel } from "models/character.model";
import { debounce, MarkdownRenderChild, Plugin } from "obsidian";
import CharacterHeader from "./character-header.view";
import CharacterInventory from "./character-inventory.view";

type RendererParameters = {
    container: HTMLElement;
    plugin: Plugin;
    context?: string;
    character?: CharacterModel;
}

export default class CharacterRenderChild extends MarkdownRenderChild {

  #container: HTMLElement
  #plugin: Plugin
  #context: string
  #workspaceEl: HTMLElement
  #style: HTMLElement
  #character: CharacterModel | undefined

  constructor(
    public rendererParameters: RendererParameters
  ) {
    super(rendererParameters.container)
    this.#addLinkHover()
    this.#container = rendererParameters.container
    this.#plugin = rendererParameters.plugin
    this.#context = rendererParameters.context ?? ""
    this.#character = rendererParameters.character
    this.#workspaceEl = this.containerEl.ownerDocument.querySelector("body > div.app-container > div.horizontal-main-container > div > div.workspace-split.mod-vertical.mod-root > div > div.workspace-tab-container") as HTMLElement

  }

  onload(): void {
    this.#workspaceEl.addClass("character-sheet")
    this.containerEl.addClass('character-sheet-view')
    this.#style = this.#createStyle()
    this.#workspaceEl.appendChild(this.#style)
    if (this.#character) {
      this.containerEl.empty()
      this.containerEl.appendChild(this.#createStyle())
      this.containerEl.addClass("character-sheet-layout")
      const header = new CharacterHeader(this.#character, this.containerEl)
      const inventory = new CharacterInventory(this.#plugin, this.#character, this.containerEl, this.#context)
      this.containerEl.appendChild(header.get())
      this.containerEl.appendChild(inventory.get())
    }
  }

  onunload(): void {
    this.#workspaceEl.removeClass("character-sheet")
    this.#style.remove()
  }

  #addLinkHover() {
    this.containerEl.on("mouseover", "a.internal-link", debounce((event) => {
      this.#plugin.app.workspace.trigger("hover-link", {
        event,
        source: this.#plugin.manifest.id,
        hoverParent: this.#plugin.app.workspace.getLeaf(),
        targetEl: event.target as HTMLAnchorElement,
        linktext: (event.target as HTMLAnchorElement).dataset.href
      })
    }, 10))
    this.containerEl.on("click", "a.internal-link", (ev) =>
      this.#plugin.app.workspace.openLinkText(
        (ev.target as HTMLAnchorElement).dataset.href ?? '', "character-sheet-view")
      );
  }

  #createStyle(): HTMLElement {
    const styleEl = this.containerEl.createEl("style")
    styleEl.innerText = `
    .character-sheet div.cm-preview-code-block.cm-embed-block.markdown-rendered.cm-lang-character {
      height: 100% !important;
    }
    .character-sheet .markdown-source-view.mod-cm6.is-readable-line-width .cm-sizer {
      margin: 0 4px 0 4px !important;
      max-width: 100% !important;
    }
    .character-sheet .cm-contentContainer > .cm-content.cm-lineWrapping {
      max-width: 100% !important;
    }
    .character-sheet-layout {
      height: 100% !important;
      display: grid;
      grid-template-rows: 1fr 2fr 128px;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-areas: "header header header" "features items spells" "footer footer footer";
    }
    `
    return styleEl
  }
}