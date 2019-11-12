import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Libro } from '../libro';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  libroEditando: Libro;  

  constructor(private firestoreService: FirestoreService) {
    // Crear una tarea vacía
    this.libroEditando = {} as Libro;
  }

  clicBotonInsertar() {
    this.firestoreService.insertar("libros", this.libroEditando).then(() => {
      console.log('Libro creada correctamente!');
      this.libroEditando= {} as Libro;
    }, (error) => {
      console.error(error);
    });
  }

}
