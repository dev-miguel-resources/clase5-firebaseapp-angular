import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

//IMPORTACIÓN DE INTERFACES
import {PostI} from '../../shared/models/post.interface';
import {FileI} from '../../shared/models/file.interface';


@Injectable({
  providedIn: 'root'
})
export class PostService {

  //ATRIBUTOS
  private postsCollection: AngularFirestoreCollection<PostI>;
  private filePath: any;
  private downloadURL: Observable<string>;

  constructor(
      private afs: AngularFirestore,
      private storage: AngularFireStorage
  ) {
      this.postsCollection = afs.collection<PostI>('posts');
      //conectar angular a firebase y esa va a ser mi collection o bdd en firebase
   }

  //MÉTODOS

  public getAllPosts(): Observable<PostI[]> {
    return this.postsCollection
      .snapshotChanges() //guardo los cambios instantaneos en mi collect
      .pipe(
        map(actions => //map me permite recorrer una copia de un arreglo y poder aplicarle una lógica
            actions.map(a => {
              const data = a.payload.doc.data() as PostI;
              const id = a.payload.doc.id;
              return {id, ...data}; //toda la data de cada post con su id
            })
        )
      );
  }

  public getOnePost(id: PostI): Observable<PostI>{
    return this.afs.doc<PostI>(`posts/${id}`).valueChanges(); //me entrega el valor actualizado de la data de ese post con ese id
  }

  public deletePostById(post: PostI){
    return this.postsCollection.doc(post.id).delete();
  }

  public editPostById(post: PostI, newImage?: FileI){
      if(newImage){
          this.uploadImage(post, newImage);
      } else {
        return this.postsCollection.doc(post.id).update(post);
      }
  }

  public preAddAndUpdatePost(post: PostI, image: FileI): void{
      this.uploadImage(post, image);
  }

  private savePost(post: PostI) {
    const postObj = {
      titlePost: post.titlePost,
      contentPost: post.contentPost,
      imagePost: this.downloadURL,
      fileRef: this.filePath,
      tagsPost: post.tagsPost
    };

    if(post.id){ //cuando guardo algún documento ya existente, ej: despues de un cambio
      return this.postsCollection.doc(post.id).update(postObj);
    } else { //cuando agrego uno nuevo
      return this.postsCollection.add(postObj);
    }
  }

  private uploadImage(post: PostI, image: FileI){
    this.filePath = `images/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(urlImage => {
            this.downloadURL = urlImage;
            this.savePost(post);
          });
        })
      ).subscribe();
  }


} //cierre clase
