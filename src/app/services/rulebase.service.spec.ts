import { TestBed } from '@angular/core/testing';

import { RulebaseService } from './rulebase.service';

describe('RulebaseService', () => {
  let service: RulebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RulebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
