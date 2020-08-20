import {http} from './config';

export default{
  list:()=>{
    return http.get('posts')
  },

  save: (post) => {
    return http.post('posts',post)
  },

  show: (postId) => {
    return http.get(`posts/${postId}`)
  },

  edit: (post) => {
    return http.patch(`posts/${post.id}`, post)
  },

  delete: (postId) => {
    return http.delete(`posts/${postId}`)
  }
}