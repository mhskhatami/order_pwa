import { Component, OnInit } from '@angular/core';
import { MissionDTO } from 'src/app/core/models/pages/MissionListDTO';
import { MissionService } from 'src/app/core/services/pages-services/mission.service';

@Component({
  selector: 'app-mission',
  templateUrl: './mission.component.html',
  styleUrl: './mission.component.css'
})
export class MissionComponent implements OnInit {

  filteredData: MissionDTO[] = [];
  isLoading = false;

  constructor (private missionService: MissionService) { }
  
  ngOnInit(): void {
    this.isLoading = true;
    this.getFilteredData();
  }

 getFilteredData() {
    this.filteredData = this.missionService.getMissionList();    
    this.isLoading = false;   
  }
}