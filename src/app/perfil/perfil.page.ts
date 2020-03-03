import { Component, OnInit } from '@angular/core';
import {Map,tileLayer,marker} from 'leaflet';
import { Router } from "@angular/router";
import { CallNumber } from '@ionic-native/call-number/ngx';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  map:Map;
  newMarker:any;
  address:string[];
  constructor(private router: Router,
    private callNumber: CallNumber) { }
  

    // The below function is added
  ionViewDidEnter(){
    this.loadMap();
  }
  // The below function is added
  loadMap(){
  this.map = new Map("mapId").setView([36.785633127081084,-5.555866062641145], 13);
  tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors,<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY- SA</a>'})
      .addTo(this.map); // This line is added to add the Tile Layer to our map

      marker([36.785633127081084,-5.555866062641145]).addTo(this.map)
      .bindPopup('La estanteria<br> Pradense.')
      .openPopup();
    }
  locatePosition(){
    
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

  llamada(){
    this.callNumber.callNumber("682762976", true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

}



