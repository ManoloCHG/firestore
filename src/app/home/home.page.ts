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

  navigateToedit() {
    this.router.navigate(["/edit"]);
  }
  
  clicBotonInsertar() {
    this.firestoreService.insertar("libros", this.libroEditando).then(() => {
      console.log('Libro creada correctamente!');
      this.libroEditando= {} as Libro;
    }, (error) => {
      console.error(error);
    });
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
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("libros", this.idLibroSelec).then(() => {
      // Actualizar la lista completa
      this.obtenerListaLibros();
      // Limpiar datos de pantalla
      this.libroEditando = {} as Libro;
    })
  }

  clicBotonModificar() {
    this.firestoreService.actualizar("libro", this.idLibroSelec, this.libroEditando).then(() => {
      // Actualizar la lista completa
      this.obtenerListaLibros();
      // Limpiar datos de pantalla
      this.libroEditando = {} as Libro;
    })
  }
}
