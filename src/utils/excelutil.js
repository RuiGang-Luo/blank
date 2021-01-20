/**
 * 后台文件下载
 * @param fileName
 * @param content
 */
export function downBackGroundFile (res) {
  const fileType = res.headers['content-type'].split(';')[0]
  const fileName = res.headers['content-disposition'].split('=')[1]
  const content = res.data
  const blob = new Blob([content], {
    type: fileType
  })
  if ('download' in document.createElement('a')) { // 非IE下载
    let elink = document.getElementById('download_link')
    if (!(elink)) {
      elink = document.createElement('a')
      elink.id = 'download_link'
      elink.style.display = 'none'
      document.body.appendChild(elink)
    }
    elink.download = decodeURI(fileName).replace(/\+/g, '')
    elink.href = URL.createObjectURL(blob)
    elink.click()
    // 释放URL 对象
    // URL.revokeObjectURL(elink.href)
    // document.body.removeChild(elink)
  } else { // IE10+下载
    navigator.msSaveBlob(blob, fileName)
  }
}
