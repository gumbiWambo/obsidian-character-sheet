import DnDCharacterSheetPlugin from "main"
const de = require("../assets/dictionaries/de.json")
const en = require("../assets/dictionaries/en.json")

export class LanguageService {
  #plugin: DnDCharacterSheetPlugin

  constructor(plugin: DnDCharacterSheetPlugin) {
    this.#plugin = plugin
  }

  translate(key: string): string {
    let dictionary = en

    if (this.#plugin.settings.language === 'de') {
      dictionary = de
    }

    const parsedKeys = key.split('.')
    let dictionaryPart = dictionary
    parsedKeys.forEach(x => {
      if (dictionaryPart) {
        dictionaryPart = dictionaryPart[x]
      }
    })
    return typeof dictionaryPart === 'string' ? dictionaryPart : `---{${key}}---`
  }
  
}