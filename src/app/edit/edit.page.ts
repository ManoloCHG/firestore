import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Libro } from '../libro';
import { FirestoreService } from '../firestore.service';
import { Router } from "@angular/router";
import { AlertController } from '@ionic/angular';


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

  constructor(private activatedRoute: ActivatedRoute, private firestoreService: FirestoreService, 
              private router: Router, public alertController: AlertController) { 

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
      if(this.id == "nuevo"){
        document.getElementById("modificar").innerHTML= "Añadir";
        document.getElementById("borrar").setAttribute("class","invisible");
      } 
    });
  }
    
  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
  }

  idLibroSelec: string;

  selecLibro(libroSelec) {
    this.idLibroSelec = libroSelec.data.id;
    this.documentLibro.titulo = libroSelec.data.titulo;
    this.documentLibro.descripcion = libroSelec.data.descripcion;
    this.documentLibro.imagen = libroSelec.data.imagen;
    this.documentLibro.ISBN = libroSelec.data.ISBN;
    this.documentLibro.autor = libroSelec.data.autor;
    this.documentLibro.idioma = libroSelec.data.idioma;
  }

  clicBotonModificar() {
    if (this.id != "nuevo") {
      this.firestoreService.actualizar("libros", this.id, this.documentLibro.data).then(() => {
        this.router.navigate(["/home"]);
      }, (error) => {
        console.error(error);
      });
    } else{
      this.firestoreService.insertar("libros", this.documentLibro.data).then(() => {
        console.log('libro creado correctamente!');
        this.router.navigate(["/home"]);
      }, (error) => {
        console.error(error);
      });
    }
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("libros", this.documentLibro.id).then(() => {
      this.router.navigate(["/home"]);;
    })
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'CONFIRMAR',
      message: '<strong>¿Desea borrar este libro?</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.clicBotonBorrar();
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }
}
