import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Post } from 'src/app/providers/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getPosts() {
    return this.afs.collection("posts").snapshotChanges().pipe(
      map(post => {
        return post.map(a => {
          const data = a.payload.doc.data() as Post;
          data.id = a.payload.doc.id;          
          return data;
        })
      })
    );
  }

  getConditionalPosts(field?: string, condition?: any, value?: string) {
    return this.afs.collection("posts", ref => ref.where(field, condition, value)).snapshotChanges().pipe(
      map(post => {
        return post.map(a => {
          const data = a.payload.doc.data() as Post;
          data.id = a.payload.doc.id;          
          return data;
        })
      })
    );
  }

  addPost(post: Post): void {
    this.afs.collection("posts").add(post);
  }

  deletePost(postId: string): void {
    this.afs.doc(`posts/${postId}`).delete();
  }

  updatePost(postId: string, post: Post): void {
    this.afs.doc(`posts/${postId}`).update(post);
  }
}
