import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { AuthGuard } from 'src/app/core/helpers/auth.guard';
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
import { BrandComponent } from 'src/app/pages/brands/brand/brand.component';
import { BrandListComponent } from 'src/app/pages/brands/brand-list/brand-list.component';
import { QuestionComponent } from 'src/app/pages/questions/question/question.component';
import { QuestionListComponent } from 'src/app/pages/questions/question-list/question-list.component';
import { ServicetsComponent } from 'src/app/pages/servicests/servicets/servicets.component';
import { ServiceListComponent } from 'src/app/pages/servicests/service-list/service-list.component';
import { ProcedureComponent } from 'src/app/pages/procedures/procedure/procedure.component';
import { ProcedureListComponent } from 'src/app/pages/procedures/procedure-list/procedure-list.component';
import { InvoiceListComponent } from 'src/app/pages/invoices/invoice-list/invoice-list.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent,   },
    { path: 'user-profile',   component: UserProfileComponent,canActivate: [AuthGuard] },
    { path: 'tables',         component: TablesComponent,canActivate: [AuthGuard] },
    { path: 'icons',          component: IconsComponent,canActivate: [AuthGuard] },
    { path: 'maps',           component: MapsComponent,canActivate: [AuthGuard] },
    { path: 'user-system',    component: UserSystemComponent,canActivate: [AuthGuard] },
    { path: 'user-system-list',    component: UserSystemListComponent,canActivate: [AuthGuard] },
    { path: 'user-client-list',    component: UserClientListComponent,canActivate: [AuthGuard] },
    { path: 'user-client',    component: UserClientComponent },
    { path: 'model',    component: ModelComponent,canActivate: [AuthGuard] },
    { path: 'model-list',    component: ModelListComponent,canActivate: [AuthGuard] },
    { path: 'vehicle',    component: VehicleComponent,canActivate: [AuthGuard] },
    { path: 'vehicle-list',    component: VehicleListComponent,canActivate: [AuthGuard] },
    { path: 'request',    component: RequestComponent,canActivate: [AuthGuard] },
    { path: 'request-list',    component: RequestListComponent },
    { path: 'brand',    component: BrandComponent,canActivate: [AuthGuard] },
    { path: 'brand-list',    component: BrandListComponent,canActivate: [AuthGuard] },
    { path: 'question', component: QuestionComponent, canActivate: [AuthGuard] },
    { path: 'question-list', component: QuestionListComponent, canActivate: [AuthGuard] },
    { path: 'service', component: ServicetsComponent, canActivate: [AuthGuard] },
    { path: 'service-list', component: ServiceListComponent, canActivate: [AuthGuard] },
    { path: 'procedure', component: ProcedureComponent, canActivate: [AuthGuard] },
    { path: 'procedure-list', component: ProcedureListComponent },
    { path: 'invoice-list', component: InvoiceListComponent }
];
