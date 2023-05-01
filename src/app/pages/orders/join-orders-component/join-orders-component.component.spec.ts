import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinOrdersComponentComponent } from './join-orders-component.component';

describe('JoinOrdersComponentComponent', () => {
  let component: JoinOrdersComponentComponent;
  let fixture: ComponentFixture<JoinOrdersComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JoinOrdersComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinOrdersComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
