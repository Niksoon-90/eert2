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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
import { ImportStepsOneComponent } from './calculations/import-steps-one/import-steps-one.component';
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import { MathForecastComponent } from './calculations/math-forecast/math-forecast.component';
import {DialogModule} from "primeng/dialog";
import { ForecastCorrespondenceComponent } from './calculations/forecast-correspondence/forecast-correspondence.component';
import { PaymentComponent } from './calculations/payment/payment.component';
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {CalendarModule} from 'primeng/calendar';


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

const itemRoutesCalculations: Routes = [
  {path: 'import', component: ImportStepsOneComponent},
  {path: 'mathForecast', component: MathForecastComponent},
  {path: 'forecast', component: ForecastCorrespondenceComponent},
  {path: 'payment', component: PaymentComponent},
]

const appRoutes: Routes = [
  {path: 'shipments', component: ShipmentsComponent, children: itemRoutesShipments},
  {path: 'cargo', component: CargoComponent, children: itemRoutesCargo},
  {path: 'correspondence', component: CorrespondenceComponent, children: itemRoutesCorrespondence},
  {path: 'macroPok', component: MacroPokComponent},
  {path: 'steps', component: CalculationsComponent, children: itemRoutesCalculations},
  {path: '', component: ShipmentsComponent},

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
    ImportStepsOneComponent,
    MathForecastComponent,
    ForecastCorrespondenceComponent,
    PaymentComponent,
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
    ToastModule,
    CardModule,
    DropdownModule,
    FormsModule,
    DialogModule,
    OverlayPanelModule,
    CalendarModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'ru' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
