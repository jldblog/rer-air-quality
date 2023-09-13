import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.sass']
})

export class ProgressComponent {
  @Input() public displayProgress: boolean = false;
}
