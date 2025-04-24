import IocConfig from '../core/IocConfig'
import { type IServer, TYPES } from '../types/core/ServerTypes'
import {FileIO} from '@framework/common'

const container = IocConfig.getContainer()

export default async function startServer () {
  if (!container.isBound(TYPES.IServer)) {
    throw new Error('No server implementation registered in the container.')
  }

  await FileIO.importAllFromFolder('config')

  const server = container.get<IServer>(TYPES.IServer)

  return server.run!()
}
