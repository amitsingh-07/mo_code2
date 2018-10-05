import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

@Injectable({ providedIn: 'root' })
export class HammerConfig extends HammerGestureConfig {
    overrides = {
        pinch: { enable: false },
        rotate: { enable: false },
        swipe: { velocity: 0.4, threshold: 20, enable: true, direction: Hammer.DIRECTION_ALL }
    };
}
