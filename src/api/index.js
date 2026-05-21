import axios from 'axios'

const api = axios.create()

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
