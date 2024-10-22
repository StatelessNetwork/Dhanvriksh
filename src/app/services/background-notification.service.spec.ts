import { TestBed } from '@angular/core/testing';

import { BackgroundNotificationService } from './background-notification.service';

describe('BackgroundNotificationService', () => {
  let service: BackgroundNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackgroundNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
