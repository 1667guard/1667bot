"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limits = exports.Limit = void 0;
class Limit {
    m = new Map();
    hit(key, windowMs, max) {
        const now = Date.now();
        const a = (this.m.get(key) ?? []).filter(t => now - t < windowMs);
        a.push(now);
        this.m.set(key, a);
        return { count: a.length, exceeded: a.length >= max };
    }
    reset(key) { this.m.delete(key); }
}
exports.Limit = Limit;
exports.limits = new Limit();
