import { EventEmitter, OnInit } from '@angular/core';
export declare class OKeyboardListenerDirective implements OnInit {
    keyboardKeys: string;
    onKeysPressed: EventEmitter<object>;
    protected keyboardNumberKeysArray: Array<number>;
    protected activeKeys: object;
    keyDown(e: KeyboardEvent): void;
    keyUp(e: KeyboardEvent): void;
    ngOnInit(): void;
    parseKeyboardKeys(): void;
    checkNeededKeys(e: KeyboardEvent): void;
}
