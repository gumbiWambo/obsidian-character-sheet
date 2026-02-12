import path from "node:path";
import { addIcon } from "obsidian";

export class IconService {
  constructor() {}

  public registerIcons() {
    addIcon('add-character-sheet', 'assets/icons/add-sheet-icon.svg')
  }
}