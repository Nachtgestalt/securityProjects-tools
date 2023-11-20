import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulebaseCpComponent } from './rulebase-cp.component';

describe('RulebaseCpComponent', () => {
  let component: RulebaseCpComponent;
  let fixture: ComponentFixture<RulebaseCpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulebaseCpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RulebaseCpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
