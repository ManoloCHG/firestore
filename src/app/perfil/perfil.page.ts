import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  constructor(private router: Router,
    private callNumber: CallNumber) { }

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

  llamada(){
    this.callNumber.callNumber("682762976", true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

}



