import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniReportComponent } from './mini-report.component';

describe('MiniReportComponent', () => {
  let component: MiniReportComponent;
  let fixture: ComponentFixture<MiniReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MiniReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
