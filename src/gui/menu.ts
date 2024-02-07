import { ModMenuList } from './list'
import { ModDB } from '../moddb'

import 'nax-ccuilib/src/headers/nax/input-field.d.ts'
import 'nax-ccuilib/src/headers/nax/input-field-cursor.d.ts'
import 'nax-ccuilib/src/headers/nax/input-field-type.d.ts'

export interface ModMenu extends sc.ListInfoMenu {
    list: ModMenuList
    database: ModDB
    inputField: nax.ccuilib.InputField

    onBackButtonPress(this: this): void
}
interface ModMenuConstructor extends ImpactClass<ModMenu> {
    new (): ModMenu
}

export const ModMenu: ModMenuConstructor = sc.ListInfoMenu.extend({
    init() {
        // this.database = new ModDB('official', 'https://raw.githubusercontent.com/CCDirectLink/CCModDB/master/npDatabase.json')
        this.database = new ModDB('official', 'https://raw.githubusercontent.com/krypciak/CCModDB/ccmodjson')
        this.parent(new ModMenuList(this.database))
        this.list.setPos(9, 21)

        this.inputField = new nax.ccuilib.InputField(232, 20)
        this.inputField.setPos(124, 2)
        this.inputField.onCharacterInput = () => {
            this.list.filters.name = this.inputField.getValueAsString()
            this.list.reloadFilters()
        }
        this.addChildGui(this.inputField)

        const legacyCheckbox = new sc.CheckboxGui((this.list.filters.includeLegacy = true))
        legacyCheckbox.setPos(9, 282)
        legacyCheckbox.onButtonPress = () => {
            this.list.filters.includeLegacy = legacyCheckbox.pressed
            this.list.reloadFilters()
        }
        this.addChildGui(legacyCheckbox)
        sc.menu.buttonInteract.addGlobalButton(legacyCheckbox, () => false)
        const legacyText = new sc.TextGui('Include legacy mods')
        legacyText.setPos(35, 282)
        this.addChildGui(legacyText)

        const hasIconCheckbox = new sc.CheckboxGui((this.list.filters.hasIcon = true))
        hasIconCheckbox.setPos(9, 300)
        hasIconCheckbox.onButtonPress = () => {
            this.list.filters.hasIcon = hasIconCheckbox.pressed
            this.list.reloadFilters()
        }
        this.addChildGui(hasIconCheckbox)
        sc.menu.buttonInteract.addGlobalButton(hasIconCheckbox, () => false)
        const hasIconText = new sc.TextGui('Has icon')
        hasIconText.setPos(35, 300)
        this.addChildGui(hasIconText)

        /* i dont think this is how it's supposed to work but it works so */
        sc.menu.buttonInteract.addGlobalButton(this.inputField as any, () => false)
    },
    showMenu() {
        this.parent()
        sc.menu.pushBackCallback(() => this.onBackButtonPress())
        sc.menu.moveLeaSprite(0, 0, sc.MENU_LEA_STATE.HIDDEN)
    },
    hideMenu() {
        this.parent()
        sc.menu.moveLeaSprite(0, 0, sc.MENU_LEA_STATE.LARGE)
        this.exitMenu()
    },
    exitMenu() {
        this.parent()
    },
    onBackButtonPress() {
        sc.menu.popBackCallback()
        sc.menu.popMenu()
    },
})
