import { baseUrl } from './url'

export const downLoadFile = function(fileId: string) {
  return `${baseUrl}/api/v1/file/download?fileId=${fileId}`
}
