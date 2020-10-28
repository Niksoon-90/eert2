import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadFileComponent } from './initialDate/upload-file/upload-file.component';
import {InputTextModule} from "primeng/inputtext"
import {ButtonModule} from 'primeng/button';
import {HttpClientModule} from "@angular/common/http";
import {ProgressBarModule} from "primeng/progressbar";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from '@angular/forms';
import {MenuModule} from 'primeng/menu';
import {Routes, RouterModule} from '@angular/router';
import {MenubarModule} from 'primeng/menubar';
import { ShipmentsComponent } from './initialDate/shipments/shipments.component';
import { DataShipmentsComponent } from './initialDate/shipments/data-shipments/data-shipments.component';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import { CargoComponent } from './initialDate/cargo/cargo.component';
import { CorrespondenceComponent } from './initialDate/correspondence/correspondence.component';
import { MacroPokComponent } from './initialDate/macro-pok/macro-pok.component';
import {registerLocaleData} from "@angular/common";
import localeRu from '@angular/common/locales/ru';
import { CalculationsComponent } from './calculations/calculations.component';
import {PanelMenuModule} from "primeng/panelmenu";
import {StepsModule} from 'primeng/steps';
import {ToastModule} from "primeng/toast";


const itemRoutesShipments: Routes = [
  {path: 'data', component: DataShipmentsComponent},
  {path: ':initialDateType', component: UploadFileComponent}
]
const itemRoutesCargo: Routes = [
  {path: 'data', component: DataShipmentsComponent},
  {path: ':initialDateType', component: UploadFileComponent}
]

const itemRoutesCorrespondence: Routes = [
  {path: 'data', component: DataShipmentsComponent},
  {path: ':initialDateType', component: UploadFileComponent}
]

const appRoutes: Routes = [
  {path: 'shipments', component: ShipmentsComponent, children: itemRoutesShipments},
  {path: 'cargo', component: CargoComponent, children: itemRoutesCargo},
  {path: 'correspondence', component: CorrespondenceComponent, children: itemRoutesCorrespondence},
  {path: 'macroPok', component: MacroPokComponent},
  {path: 'calculations', component: CalculationsComponent},

]
registerLocaleData(localeRu, 'ru');
@NgModule({
  declarations: [
    AppComponent,
    UploadFileComponent,
    ShipmentsComponent,
    DataShipmentsComponent,
    CargoComponent,
    CorrespondenceComponent,
    MacroPokComponent,
    CalculationsComponent,
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
    TooltipModule,
    PanelMenuModule,
    StepsModule,
    ToastModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'ru' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
