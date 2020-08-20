import { http } from './config';

export default {
  list: () => {
    return http.get('photos')
  },

  save: (photo) => {
    return http.post('photos', photo)
  },

  show: (photoId) => {
    return http.get(`photos/${photoId}`)
  },

  edit: (photo) => {
    return http.patch(`photos/${photo.id}`, photo)
  },

  delete: (photoId) => {
    return http.delete(`photos/${photoId}`)
  }
}