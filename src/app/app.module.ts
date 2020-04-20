//MÓDULOS Y OTROS
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { environment } from '../environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { NewPostModule } from './components/posts/new-post/new-post.module';
import { EditPostModule } from './components/posts/edit-post/edit-post.module';

//FIREBASE
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule, StorageBucket } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';


//COMPONENTES
import { AppComponent } from './app.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { ContainerAppComponent } from './components/pages/container-app/container-app.component';
import { DetailsPostComponent } from './components/posts/details-post/details-post.component';
import { EditPostComponent } from './components/posts/edit-post/edit-post.component';
import { NewPostComponent } from './components/posts/new-post/new-post.component';




@NgModule({
  declarations: [
    AppComponent,
    NewPostComponent,
    ToolbarComponent,
    ContainerAppComponent,
    ModalComponent,
    DetailsPostComponent,
    EditPostComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AppRoutingModule,
    NewPostModule,
    MaterialModule,
    ReactiveFormsModule,
    EditPostModule
  ],
  entryComponents: [ModalComponent],
  providers: [
    { provide: StorageBucket, useValue: 'gs://post-pruebas-2020.appspot.com' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
