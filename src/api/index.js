import axios from 'axios'
import { showToast } from '../stores/toast.js'

const api = axios.create()

api.interceptors.response.use(
  (res) => {
    const { code, msg } = res.data
    if (code === 500) {
      showToast(msg || '请求失败', 'error')
      return Promise.reject(new Error(msg))
    }
    return res
  },
  (err) => {
    showToast('网络错误: ' + (err.response?.data?.msg || err.message), 'error')
    return Promise.reject(err)
  },
)

export function searchNetEase(name, pageNo = 1, pageSize = 10) {
  return api.get('/api/net/search', { params: { name, pageNo, pageSize } })
}

export function saveMusic(id) {
  return api.post('/api/music/save', { id })
}

export function getMusicList(pageNo = 1, pageSize = 10, name = '') {
  return api.get('/api/music/list', { params: { pageNo, pageSize, name } })
}

export function deleteMusic(id) {
  return api.delete('/api/music/delete', { params: { id } })
}
