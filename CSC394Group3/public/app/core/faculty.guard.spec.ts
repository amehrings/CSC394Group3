import { TestBed, async, inject } from '@angular/core/testing';

import { FacultyGuard } from './faculty.guard';

describe('FacultyGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacultyGuard]
    });
  });

  it('should ...', inject([FacultyGuard], (guard: FacultyGuard) => {
    expect(guard).toBeTruthy();
  }));
});
