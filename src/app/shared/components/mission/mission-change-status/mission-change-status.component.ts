import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mission-change-status',
  standalone: false,
  templateUrl: './mission-change-status.component.html',
  styleUrl: './mission-change-status.component.css'
})
export class MissionChangeStatusComponent {
  
  selectedStatus: string = "1";

  constructor(public dialogRef: MatDialogRef<MissionChangeStatusComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: {defaultStatus: number}) {
      this.selectedStatus = data.defaultStatus.toString();
    }

  onClick(e: any) {
    this.dialogRef.close(e.target.value);
  }
}