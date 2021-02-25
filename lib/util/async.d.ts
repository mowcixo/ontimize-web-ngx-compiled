import { EventEmitter } from '@angular/core';
export { Observable, Subject } from 'rxjs';
export declare function noop(): void;
export declare class ObservableWrapper {
    static subscribe<T>(emitter: any, onNext: (value: T) => void, onError?: (exception: any) => void, onComplete?: () => void): object;
    static isObservable(obs: any): boolean;
    static hasSubscribers(obs: EventEmitter<any>): boolean;
    static dispose(subscription: any): void;
    static callNext(emitter: EventEmitter<any>, value: any): void;
    static callEmit(emitter: EventEmitter<any>, value: any): void;
    static callError(emitter: EventEmitter<any>, error: any): void;
    static callComplete(emitter: EventEmitter<any>): void;
}
