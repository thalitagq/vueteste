<template >
  <v-app data-app>
    <nav class="navbar navbar-expand-sm py-5">
      <v-btn color="#5B1166" style="color:#7CB342" href="/photos">Photos</v-btn>
    </nav>
    <v-data-table
        :headers="headers"
        :items="posts"
        :items-per-page="5"
        class="elevation-1"
      >
      <template v-slot:top>
        <v-toolbar flat color="#7CB342">
          <v-toolbar-title class="text--#42661C">Posts</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="700px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="#42661C"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >New Item</v-btn>
            </template>
            <v-card v-if="show">
              <v-card-title>
                <span class="headline">{{ editedItem.title }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.userId" disabled label="User Id"></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        v-model="editedItem.body"
                        label="Body"
                        disabled
                      ></v-textarea>
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
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.userId" label="User Id"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="editedItem.title" label="Title"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-textarea
                          v-model="editedItem.body"
                          label="Body"
                        ></v-textarea>
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
        </v-toolbar>
      </template>
      
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          small
          color="#42661C"
          @click="showItem(item)"
        >
          mdi-eye
        </v-icon>
        <v-icon
          small
          class="mx-2"
          color="#42661C"
          @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
          small
          color="#42661C"
          @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>  
  </v-app>
</template>
<script>
import Post from '../services/posts'

export default {
  
  data(){
    return{
        show: false,
        dialog: false,
        editedIndex: -1,
        lastIndex: 0,
        editedItem: {
          id: 0,
          userId: 0,
          title: '',
          body: '',
        },
        defaultItem: {
          id: 0,
          userId: 0,
          title: '',
          body: '',
        },
      posts: [],
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
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      Post.list().then(response => {
        this.posts = response.data;
        this.lastIndex = this.posts[this.posts.length-1].id
      })
    },

    editItem (item) {
      this.show = false
      this.editedIndex = this.posts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    showItem(item) {
      this.show = true
      this.editedIndex = this.posts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.posts.indexOf(item)
      confirm('Are you sure you want to delete this item?') && Post.delete(item.id).then(response => {
        console.log(JSON.stringify(response))
        this.posts.splice(index, 1)
      }).catch(e => {
          console.log(e)
      })

    },

    close () {
      this.dialog = false
      this.show = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      //save edited post
      let index = this.editedIndex
      if (this.editedIndex > -1) {
        Post.edit(this.editedItem).then(response => {
            console.log(JSON.stringify(response.data))
            Object.assign(this.posts[index], response.data)
        }).catch(e => {
            console.log(e)
        })

      } else { //create new post
        this.editedItem.id = this.lastIndex+1
        console.log(JSON.stringify(this.editedItem))
        Post.save(this.editedItem).then( response =>{
            console.log(JSON.stringify(response))
            this.posts.push(response.data)
        }).catch(e => {
            console.log(e)
        })
      }
      this.close()
    },
  }  
}
</script>
