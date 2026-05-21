import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8080' })

export function searchNetEase(name, pageNo = 1, pageSize = 10) {
  return api.get('/net/search', { params: { name, pageNo, pageSize } })
}

export function saveMusic(id) {
  return api.post('/music/save', { id })
}

export function getMusicList(pageNo = 1, pageSize = 10, name = '') {
  return api.get('/music/list', { params: { pageNo, pageSize, name } })
}

export function deleteMusic(id) {
  return api.delete('/music/delete', { params: { id } })
}
