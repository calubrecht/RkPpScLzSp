import { TestBed } from '@angular/core/testing';
import { StorageService} from './storage.service';

describe('StorageMsgService', () => {

  it('should be created', () => {
    const service: StorageService = TestBed.get(StorageService);
    expect(service).toBeTruthy();
  });

  it('set/getName', () => {
    const service: StorageService = TestBed.get(StorageService);

    expect(service.getName()).toBeFalsy();
    service.setName('Bob');
    expect(service.getName()).toBe('Bob');
  });
  
  it('set/getToken', () => {
    const service: StorageService = TestBed.get(StorageService);

    expect(service.getToken()).toBeFalsy();
    service.setToken('ABCD555');
    expect(service.getToken()).toBe('ABCD555');
    expect(localStorage.getItem('TOKEN')).toBe('ABCD555');
    expect(sessionStorage.getItem('TOKEN')).toBe('ABCD555');
    sessionStorage.removeItem('TOKEN');
    expect(service.getToken()).toBe('ABCD555');
    service.clearToken();
    expect(service.getToken()).toBeFalsy();
  });
});
