import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicetsComponent } from './servicets.component';

describe('ServicetsComponent', () => {
  let component: ServicetsComponent;
  let fixture: ComponentFixture<ServicetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
