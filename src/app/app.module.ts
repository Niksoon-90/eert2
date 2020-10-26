import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadFileComponent } from './shipments/upload-file/upload-file.component';
import {InputTextModule} from "primeng/inputtext"
import {ButtonModule} from 'primeng/button';
import {HttpClientModule} from "@angular/common/http";
import {ProgressBarModule} from "primeng/progressbar";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {MenuModule} from 'primeng/menu';
import {Routes, RouterModule} from '@angular/router';
import {MenubarModule} from 'primeng/menubar';
import { ShipmentsComponent } from './shipments/shipments.component';
import { DataShipmentsComponent } from './shipments/data-shipments/data-shipments.component';
import {TableModule} from 'primeng/table';


const itemRoutesShipments: Routes = [
  {path: 'upload', component: UploadFileComponent},
  {path: 'data', component: DataShipmentsComponent}
]
const appRoutes: Routes = [
  {path: 'shipments', component: ShipmentsComponent, children: itemRoutesShipments},
]
@NgModule({
  declarations: [
    AppComponent,
    UploadFileComponent,
    ShipmentsComponent,
    DataShipmentsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    InputTextModule,
    ButtonModule,
    HttpClientModule,
    ProgressBarModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MenuModule,
    RouterModule.forRoot(appRoutes),
    MenubarModule,
    TableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
