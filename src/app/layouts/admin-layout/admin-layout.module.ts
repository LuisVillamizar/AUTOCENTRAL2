import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserSystemComponent } from 'src/app/pages/user-system/user-system.component';
import { UserSystemListComponent } from 'src/app/pages/user-system-list/user-system-list.component';

import { UserClientListComponent } from 'src/app/pages/client/user-client-list/user-client-list.component';
import { UserClientComponent } from 'src/app/pages/client/user-client/user-client.component';
import { ModelComponent } from 'src/app/pages/models/model/model.component';
import { ModelListComponent } from 'src/app/pages/models/model-list/model-list.component';
import { VehicleComponent } from 'src/app/pages/vehicles/vehicle/vehicle.component';
import { VehicleListComponent } from 'src/app/pages/vehicles/vehicle-list/vehicle-list.component';
import { RequestComponent } from 'src/app/pages/requests/request/request.component';
import { RequestListComponent } from 'src/app/pages/requests/request-list/request-list.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import {NgxDataTableModule} from "angular-9-datatable";

import { BrandComponent } from 'src/app/pages/brands/brand/brand.component';
import { BrandListComponent } from 'src/app/pages/brands/brand-list/brand-list.component';
import { QuestionComponent } from 'src/app/pages/questions/question/question.component';
import { QuestionListComponent } from 'src/app/pages/questions/question-list/question-list.component';
import { ServicetsComponent } from 'src/app/pages/servicests/servicets/servicets.component';
import { ServiceListComponent } from 'src/app/pages/servicests/service-list/service-list.component';
import { ProcedureComponent } from 'src/app/pages/procedures/procedure/procedure.component';
import { ProcedureListComponent } from 'src/app/pages/procedures/procedure-list/procedure-list.component';
import { InvoiceListComponent } from 'src/app/pages/invoices/invoice-list/invoice-list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    ReactiveFormsModule,
    NgxQRCodeModule,
    NgxDataTableModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    UserSystemComponent,
    UserSystemListComponent,
    UserClientListComponent,
    UserClientComponent,
    ModelComponent,
    ModelListComponent,
    VehicleComponent,
    VehicleListComponent,
    RequestComponent,
    RequestListComponent,
    BrandComponent,
    BrandListComponent,
    QuestionComponent,
    QuestionListComponent,
    ServicetsComponent,
    ServiceListComponent,
    ProcedureComponent,
    ProcedureListComponent,
    InvoiceListComponent
  ]
})

export class AdminLayoutModule {}
