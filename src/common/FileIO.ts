import Static from '@framework-decorators/Static'
import path from 'path'
import fs from 'fs'
import { CoreConfig } from '@framework-lib/CoreConfig'
import { glob } from 'glob'

@Static
export class FileIO {
  public static async importAllFromFolder (folderPath: string, pattern = '**/*') {
    const absoluteFolderPath = path.resolve(`${CoreConfig.getConfig().SOURCE_DIR}/${folderPath}`)

    const files = await glob(`${absoluteFolderPath}/${pattern}${CoreConfig.getConfig().FILE_EXTENSION}`)

    for (const file of files) {
      await import(file)
    }
  }

  public static async obtenerArchivoBuffer (url: string) {
    const urlResolved = path.resolve(`${CoreConfig.getConfig().SOURCE_DIR}/${url}`)

    return await fs.promises.readFile(urlResolved)
  }

  public static async obtenerArchivoBase64 (url: string) {
    const urlResolved = path.resolve(`${CoreConfig.getConfig().SOURCE_DIR}/${url}`)

    return await fs.promises.readFile(urlResolved, {
      encoding: 'base64'
    })
  }

  public static resolverURL (url: string) {
    return path.resolve(`${CoreConfig.getConfig().SOURCE_DIR}/${url}`)
  }
}
