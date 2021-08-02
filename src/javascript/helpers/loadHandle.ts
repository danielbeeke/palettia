import { HandleStore } from '../HandleStore'
import { verifyPermission } from './verifyPermission'

export const loadHandle = async (fileName: string) => {
  const fileHandle = await HandleStore.getByName(fileName)
  const hasPermission = await verifyPermission(fileHandle)
  if (!hasPermission) throw new Error('Please give access')
  const fileData = await fileHandle.getFile()
  return URL.createObjectURL(fileData)
}
