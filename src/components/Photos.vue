<template>
  <div class='p-3 pb-5'> 
    <nav class="navbar navbar-expand-sm py-5">
      <v-btn color="#5B1166" style="color:#7CB342" href="/">Posts</v-btn>
    </nav>
    <v-row  class="">  
      <v-col cols="3" class="ml-auto">
        <v-btn color="#42661C" @click="createItem" dark class="float-right mr-5 my-3">New Item</v-btn>
      </v-col> 
    </v-row>
    <v-row justify="space-around">
      <v-col cols="3" v-for="photo in visiblePages" :key="photo.id">
        <v-card class="d-inline-block mx-auto">
          <v-container>
            <v-row justify="space-between">
              <v-col cols="auto">
                <v-img :src="photo.url" height="200" width="200"></v-img>
              </v-col>
              <v-col cols="auto" class="text-center pl-0" >
                <v-row class="flex-column ma-0 fill-height" justify="center">
                  <v-col class="px-0">
                    <v-btn icon>
                      <v-icon @click="showItem(photo)">mdi-eye</v-icon>
                    </v-btn>
                  </v-col>

                  <v-col class="px-0">
                    <v-btn icon>
                      <v-icon @click="editItem(photo)">mdi-pencil</v-icon>
                    </v-btn>
                  </v-col>

                  <v-col class="px-0">
                    <v-btn icon>
                      <v-icon @click="deleteItem(photo)">mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
    <v-pagination
      v-model="page"
      :length="Math.ceil(photos.length/perPage)"
      :total-visible="10"
      circle
    ></v-pagination>

    <v-dialog v-model="dialog" max-width="900px">
      <v-card v-if="show">
        <v-card-title>
          <span class="headline">{{ editedItem.title }}</span>
        </v-card-title>

        <v-card-text>
          <v-container v-if="show">
            <v-row>
              <v-col cols="12">
                <v-img :src="editedItem.url"></v-img>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Close</v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container >
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="editedItem.title" label="Title"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-img :src="editedItem.url" height="200" width="200"></v-img>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>


    <v-dialog v-model="dialog2" max-width="900px">
      <v-card >
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container >
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="editedItem.title" label="Title"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-file-input accept="image/*" v-model="editedItem.url" label="File input"></v-file-input>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>  
  
</template>
<script>
import Photo from '../services/photos'

export default {
  
  data(){
    return{
      dialog: false,
      show: false,
      create: false,
      dialog2: false,
      page: 1,
      perPage:20,
        editedIndex: -1,
        lastIndex: 0,
        editedItem: {
          albumId: 0,
          id: 0,
          title: '',
          url: '',
          thumbnailUrl: ''
        },

        defaultItem: {
          albumId: 0,
          id: 0,
          title: '',
          url: '',
          thumbnailUrl: ''
        },
      photos: [],
      headers: [
            { text: 'Id ', value: 'id' },
            { text: 'User Id ', value: 'userId' },
            { text: 'Title', value: 'title' },
            { text: 'Body', value: 'body', width:'40%' },
            { text: 'Actions', value: 'actions', sortable: false },
          ]
    }
  },
  
  mounted(){
    this.initialize()
  },

  computed: {
    visiblePages () {
      return this.photos.slice((this.page - 1)* this.perPage, this.page* this.perPage)
    },
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },

    dialog2 (val) {
      val || this.close()
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      Photo.list().then(response => {
        this.photos = response.data;
        this.lastIndex = this.photos[this.photos.length-1].id
      })
    },

    editItem (item) {
      this.show = false
      this.editedIndex = this.photos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      console.log(this.editedItem)
    },

    createItem(){
      this.dialog2 = true
      this.create = true;
    },

    deleteItem (item) {
      const index = this.photos.indexOf(item)
      confirm('Are you sure you want to delete this item?') && Photo.delete(item.id).then(response => {
        console.log(JSON.stringify(response))
        this.photos.splice(index, 1)
      }).catch(e => {
          console.log(e)
      })

    },

    close () {
      this.dialog = false
      this.dialog2 = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
      this.create = false;
      this.show = false;
    },

    showItem(item){
      this.show = true
      this.editedIndex = this.photos.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      console.log(this.editedItem)
    },

    save () {
      //save edited post
      let index = this.editedIndex
      if (this.editedIndex > -1) {
        Photo.edit(this.editedItem).then(response => {
            console.log(JSON.stringify(response.data))
            Object.assign(this.photos[index], response.data)
        }).catch(e => {
            console.log(e)
        })

      } else { //create new post
        this.editedItem.id = this.lastIndex+1
        console.log(JSON.stringify(this.editedItem))
        Photo.save(this.editedItem).then( response =>{
            console.log(JSON.stringify(response))
            this.photos.push(response.data)
        }).catch(e => {
            console.log(e)
        })
      }
      this.close()
    },
  }  
}
</script>
