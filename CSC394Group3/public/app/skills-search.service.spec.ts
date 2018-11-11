import { TestBed, inject } from '@angular/core/testing';

import { SkillsSearchService } from './skills-search.service';

describe('SkillsSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkillsSearchService]
    });
  });

  it('should be created', inject([SkillsSearchService], (service: SkillsSearchService) => {
    expect(service).toBeTruthy();
  }));
});
