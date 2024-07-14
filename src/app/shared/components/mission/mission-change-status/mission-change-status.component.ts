import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mission-change-status',
  standalone: false,
  templateUrl: './mission-change-status.component.html',
  styleUrl: './mission-change-status.component.css'
})
export class MissionChangeStatusComponent {
  
  selectedStatus: number = 1;

  constructor(public dialogRef: MatDialogRef<MissionChangeStatusComponent>) {}

  onClick(e: any) {
    console.log(e.target.value);

    this.dialogRef.close(e.target.value);
  }

}