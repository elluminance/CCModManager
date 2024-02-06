import { Hash } from 'crypto'
import { Mod } from 'ultimate-crosscode-typedefs/modloader/mod'
import { ModDB } from './gui/moddb'

export type Mod1 = Writable<Mod> & {
    isCCModPacked: boolean
    findAllAssets?(): void /* only there for ccl2, used to set isCCL3 */
} & (
        | {
              isCCL3: true
              id: string
              findAllAssets(): void
          }
        | {
              isCCL3: false
              name: string
              filemanager: {
                  findFiles(dir: string, exts: string[]): Promise<string[]>
              }
              getAsset(path: string): string
              runtimeAssets: Record<string, string>
          }
    )

export declare global {
    namespace sc {
        enum MENU_SUBMENU {
            MODS,
        }
        interface TitleScreenButtonGui {
            modsButton: sc.ButtonGui

            _enterModsMenu(this: this): void
        }
    }
}

type NPDatabase = Record<string, NPDatabasePackage>

interface NPDatabasePackage {
    metadata: NPDatabasePackageMetadata
    installation: NPDatabasePackageInstallation[]
}

interface NPDatabasePackageMetadata {
    ccmodType?: 'base' | 'tool' /* so far only ccloader uses this */
    ccmodHumanName: string
    name: string
    version: string
    description?: string
    scripts?: Record<string, string>
    author?: string
    license?: string
    homepage?: string
}

type NPDatabasePackageInstallation = {
    url: string
    hash: { sha256: string }
} & (
    | {
          type: 'modZip'
          source: string
      }
    | {
          type: 'ccmod'
      }
)

type ModListEntry = {
    id: keyof NPDatabase
    name: string
    description?: string
    version: string
    versionString: string
}

interface ToolsDatabase {
    tools: { [id: string]: CCModDBPackage }
}