import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExpenseModal } from './edit-expense-modal';

describe('EditExpenseModal', () => {
  let component: EditExpenseModal;
  let fixture: ComponentFixture<EditExpenseModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditExpenseModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditExpenseModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
