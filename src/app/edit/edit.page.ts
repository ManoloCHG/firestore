import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Libro } from '../libro';
import { FirestoreService } from '../firestore.service';
import { Router } from "@angular/router";


@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  id = null;

  documentLibro: any = {
    id: "",
    data: {} as Libro
   };

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, private router) { 
    
    this.firestoreService.consultarPorId("libros", this.activatedRoute.snapshot.paramMap.get("id")).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.documentLibro.id = resultado.payload.id
        this.documentLibro.data = resultado.payload.data();
        // Como ejemplo, mostrar el título de la tarea en consola
        console.log(this.documentLibro.data.titulo);
      } else {
        // No se ha encontrado un documentLibro con ese ID. Vaciar los datos que hubiera
        this.documentLibro.data = {} as Libro;
      } 
    });
  }
    
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
  }

  idLibroSelec: string;

  selecLibro(libroSelec) {
    console.log("Libro seleccionado: ");
    console.log(libroSelec);
    this.idLibroSelec = libroSelec.id;
    this.documentLibro.titulo = libroSelec.data.titulo;
    this.documentLibro.descripcion = libroSelec.data.descripcion;
    this.documentLibro.imagen = libroSelec.data.imagen;
    this.documentLibro.ISBN = libroSelec.data.ISBN;
    this.documentLibro.autor = libroSelec.data.autor;
    this.documentLibro.idioma = libroSelec.data.idioma;
  }

  clicBotonModificar() {
    if (this.id != "nuevo") {
      this.firestoreService.actualizar("personaje", this.id, this.documentLibro.data).then(() => {
        this.router.navigate(["/home"]);
      }, (error) => {
        console.error(error);
      });
    } else{
      this.firestoreService.insertar("personaje", this.documentLibro.data).then(() => {
        console.log('Personaje creado correctamente!');
        this.router.navigate(["/home"]);
      }, (error) => {
        console.error(error);
      });
    }
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("libros", this.idLibroSelec).then(() => {
      this.router.navigate(["/home"]);;
    })
  }

}
