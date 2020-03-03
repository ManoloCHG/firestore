import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Libro } from '../libro';
import { Router } from "@angular/router";
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  userEmail: String = "";
  userUID: String = "";
  isLogged: boolean;

  navigate : any;
  
  arrayColeccionLibros: any = [{
    id: "",
    data: {} as Libro
   }];

  constructor(private firestoreService: FirestoreService, 
    private router: Router,
    public afAuth: AngularFireAuth,
    private authService: AuthService,
    public loadingCtrl: LoadingController,) {

    this.obtenerListaLibros();
  }
 
  obtenerListaLibros(){
    this.firestoreService.consultar("libros").subscribe((resultadoConsultaLibros) => {
      this.arrayColeccionLibros = [];
      resultadoConsultaLibros.forEach((datosLibro: any) => {
        this.arrayColeccionLibros.push({
          id: datosLibro.payload.doc.id,
          data: datosLibro.payload.doc.data()
        });
      })
    });
  }

  ionViewDidEnter() {
    this.isLogged = false;
    this.afAuth.user.subscribe(user => {
      if(user){
        this.userEmail = user.email;
        this.userUID = user.uid;
        this.isLogged = true;
      }
    })
  }

  logout(){
    this.authService.doLogout()
    .then(res => {
      this.userEmail = "";
      this.userUID = "";
      this.isLogged = false;
      console.log(this.userEmail);
    }, err => console.log(err));
  }


  idLibroSelec: string;

  selecLibro(libroSelec) {
    console.log("Libro seleccionado: ");
    console.log(libroSelec);
    this.idLibroSelec = libroSelec.id;
    this.router.navigate(["/edit/"+this.idLibroSelec]);
  }

  insertar() {
    this.router.navigate(["/edit/nuevo"]);
  }

  irbuscar(){
    this.router.navigate(["/buscar"]);
  }

  irperfil(){
    this.router.navigate(["/perfil"]);
  }

  irinicio(){
    this.router.navigate(["/home"]);
  }

  login(){
    this.router.navigate(["/login"]);
  }

  goRegisterPage(){
    this.router.navigate(["/register"]);
  }

}
