import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferAccountFormComponent } from './transfer-account-form.component';

describe('TransferAccountFormComponent', () => {
  let component: TransferAccountFormComponent;
  let fixture: ComponentFixture<TransferAccountFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferAccountFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransferAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
