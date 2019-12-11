import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Libro } from '../libro';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  libroEditando: Libro; 
  
  arrayColeccionLibros: any = [{
    id: "",
    data: {} as Libro
   }];

  constructor(private firestoreService: FirestoreService, private router: Router) {

    this.libroEditando = {} as Libro;
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

  idLibroSelec: string;

  selecLibro(libroSelec) {
    console.log("Libro seleccionado: ");
    console.log(libroSelec);
    this.idLibroSelec = libroSelec.id;
    this.libroEditando.titulo = libroSelec.data.titulo;
    this.libroEditando.descripcion = libroSelec.data.descripcion;
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

}
