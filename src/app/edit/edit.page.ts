import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Libro } from '../libro';
import { FirestoreService } from '../firestore.service';
import { Router } from "@angular/router";
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';


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

  constructor(private activatedRoute: ActivatedRoute, 
    private firestoreService: FirestoreService,           
    private router: Router, 
    public alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker) { 

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
    this.documentLibro.idioma = libroSelec.data.date;
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
          handler: () => {
            console.log('Operacion cancelada');
          }
        }, {
          text: 'Confirmar',
          handler: () => {
            this.clicBotonBorrar();
            console.log('Operacion realizada correctamente');
          }
        }
      ]
    });
    await alert.present();
  }

  async cancelarmod() {
    const alert = await this.alertController.create({
      header: 'CONFIRMAR',
      message: '<strong>¿Desea cancelar los cambios?</strong>',
      buttons: [
        {
          text: 'Continuar',
          role: 'cancel',
          cssClass: 'secondary',
        }, {
          text: 'Descartar',
          handler: () => {
            this.router.navigate(["/home"]);
          }
        }
      ]
    });
    await alert.present();
  }

  async uploadImagePicker(){
    // Mensaje de espera mientras se sube la imagen
    const loading = await this.loadingController.create({
      message: 'Porfavor espere...'
    });
    // Mensaje de finalización de subida de la imagen
    const toast = await this.toastController.create({
      message: 'Imagen subida con exito',
      duration: 3000
    });
    // Comprobar si la aplicación tiene permisos de lectura
    this.imagePicker.hasReadPermission().then(
      (result) => {
        // Si no tiene permiso de lectura se solicita al usuario
        if(result == false){
          this.imagePicker.requestReadPermission();
        }else {
          // Abrir selector de imágenes (ImagePicker)
          this.imagePicker.getPictures({
            maximumImagesCount: 1,  // Permitir sólo 1 imagen
            outputType: 1           // 1 = Base64
          }).then(
            (results) => {  // En la variable results se tienen las imágenes seleccionadas
              // Carpeta del Storage donde se almacenará la imagen
              let nombreCarpeta = "imagenes";
              // Recorrer todas las imágenes que haya seleccionado el usuario
              //  aunque realmente sólo será 1 como se ha indicado en las opciones
              for (var i = 0; i < results.length; i++) {      
                // Mostrar el mensaje de espera
                loading.present();
                // Asignar el nombre de la imagen en función de la hora actual para
                //  evitar duplicidades de nombres        
                let nombreImagen = `${new Date().getTime()}`;
                // Llamar al método que sube la imagen al Storage
                this.firestoreService.uploadImage(nombreCarpeta, nombreImagen, results[i])
                  .then(snapshot => {
                    snapshot.ref.getDownloadURL()
                      .then(downloadURL => {
                        // En la variable downloadURL se tiene la dirección de descarga de la imagen
                        console.log("downloadURL:" + downloadURL);
                        this.documentLibro.data.url = downloadURL;
                        // Mostrar el mensaje de finalización de la subida
                        toast.present();
                        // Ocultar mensaje de espera
                        loading.dismiss();
                      })
                  })
              }
            },
            (err) => {
              console.log(err)
            }
          );
        }
      }, (err) => {
        console.log(err);
    });
  }

  async deleteFile(fileURL) {
    const toast = await this.toastController.create({
      message: 'File was deleted successfully',
      duration: 3000
    });
    this.firestoreService.deleteFileFromURL(fileURL)
      .then(() => {
        toast.present();
      }, (err) => {
        console.log(err);
      });
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
}
