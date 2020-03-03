import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.page.html',
  styleUrls: ['./buscar.page.scss'],
})
export class BuscarPage implements OnInit {

  userEmail: String = "";
  userUID: String = "";
  isLogged: boolean;

  constructor(private router: Router,
    public afAuth: AngularFireAuth,
    private authService: AuthService,
    public loadingCtrl: LoadingController,) { }

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

  ngOnInit() {
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

  goRegisterPage(){
    this.router.navigate(["/register"]);
  }

  login(){
    this.router.navigate(["/login"]);
  }

}
