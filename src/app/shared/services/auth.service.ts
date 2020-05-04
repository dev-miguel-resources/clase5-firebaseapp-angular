import { Injectable } from '@angular/core';
import { UserI } from '../models/user.interface';
import {AngularFireAuth} from '@angular/fire/auth';
import {Observable} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {FileI} from '../models/file.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //ATRIBUTOS
  public userData$: Observable<firebase.User>;
  private filePath: string;

  constructor(private afAuth: AngularFireAuth, private storage: AngularFireStorage) { 
    this.userData$ = afAuth.authState; //guardo el estado del usuario de firebase
  }

  //MÉTODOS

  loginByEmail(user:UserI){
    const {email, password} = user; //destructuring de objetos
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  preSaveUserProfile(user: UserI, image?: FileI): void {
      if(image){
        this.uploadImage(user, image); //subir la imagen para ese user
      }else{
        this.saveUserProfile(user); //guardar la info del usuario pero sin imagen
      }
  }

  private uploadImage(user: UserI, image: FileI): void {
      this.filePath = `images/${image.name}`;
      const fileRef = this.storage.ref(this.filePath); //referenciar el path de las image en mi storage de firebase
      const task = this.storage.upload(this.filePath, image); //guarda la imagen con el path de referencia
      task.snapshotChanges() //queda actualizando cualquier cambio del documento
        .pipe(
          finalize(()=> { //ejecuta cierta función cuando el observable se complete
              fileRef.getDownloadURL().subscribe(urlImage => {
                user.photoURL = urlImage; //url de la imagen y la guardo en mi usuario
                this.saveUserProfile(user);
              });
          })
        ).subscribe();
  }

  private saveUserProfile(user: UserI){
    this.afAuth.auth.currentUser.updateProfile({ //devuelve una promise
        displayName: user.displayName,
        photoURL: user.photoURL
    })
        .then(() => console.log('User updated'))
        .catch(err => console.log('Error', err));
  }


}


