import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule} from '@angular/core';
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
import {TooltipModule} from 'primeng/tooltip';
import { CargoComponent } from './initialDate/cargo/cargo.component';
import { CorrespondenceComponent } from './initialDate/correspondence/correspondence.component';
import { MacroPokComponent } from './initialDate/macro-pok/macro-pok.component';
import {HashLocationStrategy, LocationStrategy, registerLocaleData} from "@angular/common";
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
import {RadioButtonModule} from "primeng/radiobutton";
import { DataExportComponent } from './calculations/data-export/data-export.component';
import { MathematicalForecastTableComponent } from './calculations/forecast-correspondence/mathematical-forecast-table/mathematical-forecast-table.component';
import {SidebarModule} from 'primeng/sidebar';
import { ModalComponent } from './modal/modal.component';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import { DataCorrespondenceComponent } from './initialDate/correspondence/data-correspondence/data-correspondence.component';
import { DataCargoComponent } from './initialDate/cargo/data-cargo/data-cargo.component';
import { StepsComponent } from './calculations/steps/steps.component';
import {FieldPipe} from "./field.pipe";
import {MultiSelectModule} from "primeng/multiselect";
import { TableModule } from 'primeng/table';
import {InputSwitchModule} from "primeng/inputswitch";
import { CargoNciComponent } from './directory/cargo-nci/cargo-nci.component';
import { DirectoryComponent } from './directory/directory.component';
import { InfluenceFactorComponent } from './directory/influence-factor/influence-factor.component';
import { CargoOwnerInfluenceFactorComponent } from './directory/cargo-owner-influence-factor/cargo-owner-influence-factor.component';
import {RedirectGuard} from './auth/redirect-guard/redirect-guard.component';
import { NciComponent } from './nci/nci.component';
import { DorogyComponent } from './nci/dorogy/dorogy.component';
import { CargoGroupComponent } from './nci/cargo-group/cargo-group.component';
import { ShipmentTypeComponent } from './nci/shipment-type/shipment-type.component';
import { HistoricalComponent } from './payment-history/historical/historical.component';
import { StepComponent } from './payment-history/historical/step/step.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { StepIasComponent } from './payment-history/historical/step-ias/step-ias.component';
import { SubjectComponent } from './nci/subject/subject.component';
import { StationNsiComponent } from './station-nsi/station-nsi.component';
import {StationComponent} from "./station-nsi/station/station.component";
import { DataMacroPokComponent } from './initialDate/macro-pok/data-macro-pok/data-macro-pok.component';
import { SynonymComponent } from './directory/cargo-nci/synonym/synonym.component';
import {FileUploadModule} from "primeng/fileupload";
import {AccordionModule} from "primeng/accordion";
import { ListShipmentComponent } from './initialDate/list-shipment/list-shipment.component';
import { CreateRowShipmentComponent } from './initialDate/list-shipment/create-row-shipment/create-row-shipment.component';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TabViewModule} from "primeng/tabview";
import { SearchSynonymComponent } from './directory/search-synonym/search-synonym.component';
import {CheckboxModule} from "primeng/checkbox";
import { MonoCargoComponent } from './calculations/forecast-correspondence/mono-cargo/mono-cargo.component';
import { HistoryShipmentComponent } from './calculations/forecast-correspondence/history-shipment/history-shipment.component';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { IasRouteComponent } from './calculations/payment/ias-route/ias-route.component';
import {PaymentHistoricalIasComponent} from "./payment-history/historical/step-ias/payment-historical-ias/payment-historical-ias.component";
import {SplitButtonModule} from "primeng/splitbutton";
import {ContextMenuModule} from "primeng/contextmenu";


const itemRoutesShipments: Routes = [
  {path: 'data', component: DataShipmentsComponent},
  {path: ':initialDateType', component: UploadFileComponent}
]
const itemRoutesCargo: Routes = [
  {path: 'data', component: DataCargoComponent},
  {path: ':initialDateType', component: UploadFileComponent}
]

const itemRoutesCorrespondence: Routes = [
  {path: 'data', component: DataCorrespondenceComponent},
  {path: ':initialDateType', component: UploadFileComponent}
]
const itemRoutesMacroPok: Routes = [
  {path: 'data', component: MacroPokComponent},
  {path: ':initialDateType', component: UploadFileComponent}
]

const itemRoutesSteps: Routes = [
  {path: 'import', component: ImportStepsOneComponent},
  {path: 'mathForecast', component: MathForecastComponent},
  {path: 'forecast', component: ForecastCorrespondenceComponent},
  {path: 'payment', component: PaymentComponent},
  {path: 'export', component: DataExportComponent},
]

const itemRoutesHistoricalSteps: Routes = [
  {path: 'match/:id/:name', component: StepComponent},
  {path: 'ias/:id/:name', component: StepIasComponent},
  {path: '', component: HistoricalComponent}
]

const appRoutes: Routes = [
  {path: 'shipments', component: ShipmentsComponent, children: itemRoutesShipments},
  {path: 'cargo', component: CargoComponent, children: itemRoutesCargo},
  {path: 'correspondence', component: CorrespondenceComponent, children: itemRoutesCorrespondence},
  {path: 'macroPok', component: DataMacroPokComponent, children: itemRoutesMacroPok},
  {path: 'steps', component: StepsComponent, children: itemRoutesSteps},
  {path: 'directory', component: DirectoryComponent},
  {path: 'nci', component: NciComponent},
  {path: 'station', component: StationNsiComponent},
  {path: 'payments', component: PaymentHistoryComponent, children: itemRoutesHistoricalSteps},
  {path: '', component: CalculationsComponent},
  {path: 'logOut', canActivate: [RedirectGuard], component: RedirectGuard,  data: {  externalUrl: 'http://192.168.11.191:8080/logout' }}
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
    DataExportComponent,
    MathematicalForecastTableComponent,
    ModalComponent,
    DataCorrespondenceComponent,
    DataCargoComponent,
    StepsComponent,
    FieldPipe,
    CargoNciComponent,
    DirectoryComponent,
    InfluenceFactorComponent,
    CargoOwnerInfluenceFactorComponent,
    NciComponent,
    StationComponent,
    DorogyComponent,
    CargoGroupComponent,
    ShipmentTypeComponent,
    HistoricalComponent,
    StepComponent,
    PaymentHistoryComponent,
    StepIasComponent,
    SubjectComponent,
    StationNsiComponent,
    DataMacroPokComponent,
    SynonymComponent,
    ListShipmentComponent,
    CreateRowShipmentComponent,
    SearchSynonymComponent,
    MonoCargoComponent,
    HistoryShipmentComponent,
    IasRouteComponent,
    PaymentHistoricalIasComponent,
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
    TooltipModule,
    PanelMenuModule,
    StepsModule,
    ToastModule,
    CardModule,
    DropdownModule,
    FormsModule,
    DialogModule,
    OverlayPanelModule,
    CalendarModule,
    RadioButtonModule,
    SidebarModule,
    ProgressSpinnerModule,
    MultiSelectModule,
    TableModule,
    InputSwitchModule,
    FileUploadModule,
    AccordionModule,
    ConfirmDialogModule,
    TabViewModule,
    CheckboxModule,
    InputTextareaModule,
    SplitButtonModule,
    ContextMenuModule,
  ],

  providers: [
    ConfirmationService,
    MessageService,
    RedirectGuard,
    { provide: LOCALE_ID, useValue: 'ru' },
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
