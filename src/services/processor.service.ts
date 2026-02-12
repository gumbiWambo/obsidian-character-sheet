import { CharacterClassModel } from "models/character-class.model";
import { CharacterModel } from "models/character.model";
import { MarkdownPostProcessorContext, parseYaml, Plugin } from "obsidian";
import CharacterRenderChild from "views/character.view";

export class ProcessorService {

  #plugin: Plugin
  constructor(plugin: Plugin) {
    this.#plugin = plugin
  }

  initialize() {
    this.#plugin.registerMarkdownCodeBlockProcessor("character", (
      source: string,
      element: HTMLElement,
      context: MarkdownPostProcessorContext) => this.#postProcessor(source, element, context))
  }
  
	#postProcessor(source: string, element: HTMLElement, context: MarkdownPostProcessorContext) {
    try {
      const x = parseYaml(source)
      const classes = x.classes?.map((y: {name: string, level: number, subclass: string}) => new CharacterClassModel(y.name, y.level, y.subclass))
      const model = new CharacterModel(classes ?? [], x.name ?? "", x.background ?? "", x.stats ?? [], x.proficiencies ?? [], x.expertise ?? [])
      const view = new CharacterRenderChild({container: element, plugin: this.#plugin, character: model, context: context.sourcePath})
      context.addChild(view);
    } catch (e) {
      
    }
	}
}