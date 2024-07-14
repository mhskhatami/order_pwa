import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionChangeStatusComponent } from './mission-change-status.component';

describe('MissionChangeStatusComponent', () => {
  let component: MissionChangeStatusComponent;
  let fixture: ComponentFixture<MissionChangeStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MissionChangeStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MissionChangeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});