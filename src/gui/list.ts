import { ModEntry } from '../types'
import { ModListEntry } from './list-entry'
import { ModDB } from '../moddb'
import { Fliters, createFuzzyFilteredModList } from '../filters'

export interface ModMenuList extends sc.ListTabbedPane {
    database: ModDB
    mods: ModEntry[]
    filters: Fliters

    reloadFilters(this: this): void
    reloadEntries(this: this): void
}
interface ModMenuListConstructor extends ImpactClass<ModMenuList> {
    new (database: ModDB): ModMenuList
}

export const modMenuListWidth = 552
const modMenuListHeight = 240
export const ModMenuList: ModMenuListConstructor = sc.ListTabbedPane.extend({
    mods: [],
    transitions: {
        DEFAULT: { state: {}, time: 0.2, timeFunction: KEY_SPLINES.LINEAR },
        HIDDEN: { state: { alpha: 0, offsetX: 218 }, time: 0.2, timeFunction: KEY_SPLINES.LINEAR },
        HIDDEN_EASE: { state: { alpha: 0, offsetX: 218 }, time: 0.2, timeFunction: KEY_SPLINES.EASE },
    },

    init(database: ModDB) {
        this.database = database
        this.parent(false)

        this.filters = {}

        this.setAlign(ig.GUI_ALIGN.X_LEFT, ig.GUI_ALIGN.Y_TOP)
        this.setSize(modMenuListWidth, modMenuListHeight)
        this.setPanelSize(modMenuListWidth, modMenuListHeight - 19)
        this.setPivot(modMenuListWidth, modMenuListHeight)

        this.addTab('Search', 0, {})

        this.database.getMods().then(mods => {
            this.mods = mods
            this.reloadEntries()
        })
        //.catch(err => sc.Dialogs.showErrorDialog(err.message))
    },
    show() {
        this.parent()

        this.setTab(0, true, { skipSounds: true })
        const firstTabButton = this.tabGroup.elements[0][0] as unknown as sc.ItemTabbedBox.TabButton
        firstTabButton.setPressed(true)
        this._prevPressed = firstTabButton
        this.resetButtons(firstTabButton)
        this.rearrangeTabs()

        ig.interact.setBlockDelay(0.2)
        this.doStateTransition('DEFAULT')
    },
    hide() {
        this.parent()
        this.doStateTransition('HIDDEN')
    },
    reloadFilters() {
        this.reloadEntries()
    },
    reloadEntries() {
        this.setTab(this.currentTabIndex, true, { skipSounds: true })
    },
    onTabButtonCreation(key: string, _index: number, settings) {
        const button = new sc.ItemTabbedBox.TabButton(` ${key}`, `${key}`, 85)
        button.textChild.setPos(7, 1)
        button.setPos(0, 2)
        button.setData({ type: settings.type })
        this.addChildGui(button)
        return button
    },
    onTabPressed(_button, wasSame) {
        if (!wasSame) {
            sc.BUTTON_SOUND.submit.play()
            return true
        }
    },
    onLeftRightPress() {
        sc.BUTTON_SOUND.submit.play()
        return { skipSounds: true }
    },
    onContentCreation(index, settings) {
        this.currentList && this.currentList.clear()
        this.currentGroup && this.currentGroup.clear()
        this.parent(index, settings)
    },
    onCreateListEntries(list, buttonGroup, _type, _sort) {
        list.clear()
        buttonGroup.clear()
        const mods = createFuzzyFilteredModList(this.filters, this.mods)
        for (const mod of mods) {
            const newModEntry = new ModListEntry(mod, this)
            list.addButton(newModEntry, false)
        }
    },
    onListEntryPressed(_button) {
        sc.BUTTON_SOUND.submit.play()
    },
})
