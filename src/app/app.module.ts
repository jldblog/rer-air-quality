import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlotlyModule } from 'angular-plotly.js';
import { MarkdownModule } from 'ngx-markdown';
import * as PlotlyJS from 'plotly.js-dist-min';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MenubarModule } from 'primeng/menubar';
import { MessagesModule } from 'primeng/messages';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ProgressBarModule } from 'primeng/progressbar';
import { ScrollTopModule } from 'primeng/scrolltop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './components/about/about.component';
import { ControlComponent } from './components/control/control.component';
import { HeaderComponent } from './components/header/header.component';
import { PlotComponent } from './components/plot/plot.component';
import { ProgressComponent } from './components/progress/progress.component';
import { DataService } from './services/data.service';
import { ToggleButtonModule } from 'primeng/togglebutton';


PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    ControlComponent,
    PlotComponent,
    HeaderComponent,
    ProgressComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MarkdownModule.forRoot(),
    PlotlyModule,
    // PrimeNG
    ButtonModule,
    CalendarModule,
    DialogModule,
    DropdownModule,
    MenubarModule,
    MessagesModule,
    PanelMenuModule,
    ProgressBarModule,
    ScrollTopModule,
    ToggleButtonModule,
  ],
  providers: [
    DataService,
    ControlComponent,
    MessageService,
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
