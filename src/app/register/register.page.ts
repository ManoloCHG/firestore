import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  value: any = {
    email: "",
    password: ""
  };

  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';


  validation_messages = {
   'email': [
     { type: 'required', message: 'Email is required.' },
     { type: 'pattern', message: 'Please enter a valid email.' }
   ],
   'password': [
     { type: 'required', message: 'Password is required.' },
     { type: 'minlength', message: 'Password must be at least 5 characters long.' }
   ]
 };

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    public alertController: AlertController,

  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  tryRegister(value){
    this.authService.doRegister(value)
     .then(res => {
       console.log(res);
       this.errorMessage = "";
       this.successMessage = "Your account has been created. Please log in.";
       this.presentAlertConfirm();
     }, err => {
       console.log(err);
       this.errorMessage = err.message;
       this.successMessage = "";
     })
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Registro',
      message: '<strong>Cuenta creada correctamente</strong>',
      buttons: [
        {
          text: 'OK',
          cssClass: 'secondary',
          handler: () => {
            this.router.navigate(["/home"]);
          }
        }
      ]
    });
    await alert.present();
  }

  goLoginPage(){
    this.router.navigate(["/login"]);
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
