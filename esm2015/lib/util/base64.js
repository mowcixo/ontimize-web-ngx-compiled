export class Base64 {
    static decode(s) {
        let pads = 0, i, b10, imax = s.length, x = [];
        s = String(s);
        if (imax === 0) {
            return s;
        }
        if (s.charAt(imax - 1) === this.PADCHAR) {
            pads = 1;
            if (s.charAt(imax - 2) === this.PADCHAR) {
                pads = 2;
            }
            imax -= 4;
        }
        for (i = 0; i < imax; i += 4) {
            b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12) | (this.getByte64(s, i + 2) << 6) | this.getByte64(s, i + 3);
            x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255, b10 & 255));
        }
        switch (pads) {
            case 1:
                b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12) | (this.getByte64(s, i + 2) << 6);
                x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 255));
                break;
            case 2:
                b10 = (this.getByte64(s, i) << 18) | (this.getByte64(s, i + 1) << 12);
                x.push(String.fromCharCode(b10 >> 16));
                break;
        }
        return x.join('');
    }
    static encode(s) {
        s = String(s);
        let i, b10, x = [], imax = s.length - s.length % 3;
        if (s.length === 0) {
            return s;
        }
        for (i = 0; i < imax; i += 3) {
            b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8) | this.getByte(s, i + 2);
            x.push(this.ALPHA.charAt(b10 >> 18));
            x.push(this.ALPHA.charAt((b10 >> 12) & 63));
            x.push(this.ALPHA.charAt((b10 >> 6) & 63));
            x.push(this.ALPHA.charAt(b10 & 63));
        }
        switch (s.length - imax) {
            case 1:
                b10 = this.getByte(s, i) << 16;
                x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 63) + this.PADCHAR + this.PADCHAR);
                break;
            case 2:
                b10 = (this.getByte(s, i) << 16) | (this.getByte(s, i + 1) << 8);
                x.push(this.ALPHA.charAt(b10 >> 18) + this.ALPHA.charAt((b10 >> 12) & 63) + this.ALPHA.charAt((b10 >> 6) & 63) + this.PADCHAR);
                break;
        }
        return x.join('');
    }
    static getByte(s, i) {
        const x = s.charCodeAt(i);
        return x;
    }
    static getByte64(s, i) {
        const idx = this.ALPHA.indexOf(s.charAt(i));
        return idx;
    }
}
Base64.PADCHAR = '=';
Base64.ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZTY0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi91dGlsL2Jhc2U2NC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxNQUFNLE9BQU8sTUFBTTtJQUlWLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBUztRQUM1QixJQUFJLElBQUksR0FBRyxDQUFDLEVBQ1YsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFDdkIsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVULENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFZCxJQUFJLElBQUksS0FBSyxDQUFDLEVBQUU7WUFDZCxPQUFPLENBQUMsQ0FBQztTQUNWO1FBRUQsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ3ZDLElBQUksR0FBRyxDQUFDLENBQUM7WUFDVCxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ3ZDLElBQUksR0FBRyxDQUFDLENBQUM7YUFDVjtZQUNELElBQUksSUFBSSxDQUFDLENBQUM7U0FDWDtRQUVELEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDNUIsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ25JLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztTQUNyRTtRQUVELFFBQVEsSUFBSSxFQUFFO1lBQ1osS0FBSyxDQUFDO2dCQUNKLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN4RyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxNQUFNO1lBQ1IsS0FBSyxDQUFDO2dCQUNKLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2dCQUN0RSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZDLE1BQU07U0FDVDtRQUVELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRU0sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFTO1FBQzVCLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFZCxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFDaEIsSUFBSSxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFFakMsSUFBSSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNsQixPQUFPLENBQUMsQ0FBQztTQUNWO1FBRUQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM1QixHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDMUYsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNyQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDNUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzNDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDckM7UUFFRCxRQUFRLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFFO1lBQ3ZCLEtBQUssQ0FBQztnQkFDSixHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUMvQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDekcsTUFBTTtZQUNSLEtBQUssQ0FBQztnQkFDSixHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDakUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMvSCxNQUFNO1NBQ1Q7UUFFRCxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVPLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDekMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFTyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQVMsRUFBRSxDQUFTO1FBQzNDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7O0FBakZjLGNBQU8sR0FBVyxHQUFHLENBQUM7QUFDdEIsWUFBSyxHQUFXLGtFQUFrRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgY2xhc3MgQmFzZTY0IHtcbiAgcHJpdmF0ZSBzdGF0aWMgUEFEQ0hBUjogc3RyaW5nID0gJz0nO1xuICBwcml2YXRlIHN0YXRpYyBBTFBIQTogc3RyaW5nID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuXG4gIHB1YmxpYyBzdGF0aWMgZGVjb2RlKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgbGV0IHBhZHMgPSAwLFxuICAgICAgaSwgYjEwLCBpbWF4ID0gcy5sZW5ndGgsXG4gICAgICB4ID0gW107XG5cbiAgICBzID0gU3RyaW5nKHMpO1xuXG4gICAgaWYgKGltYXggPT09IDApIHtcbiAgICAgIHJldHVybiBzO1xuICAgIH1cblxuICAgIGlmIChzLmNoYXJBdChpbWF4IC0gMSkgPT09IHRoaXMuUEFEQ0hBUikge1xuICAgICAgcGFkcyA9IDE7XG4gICAgICBpZiAocy5jaGFyQXQoaW1heCAtIDIpID09PSB0aGlzLlBBRENIQVIpIHtcbiAgICAgICAgcGFkcyA9IDI7XG4gICAgICB9XG4gICAgICBpbWF4IC09IDQ7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGltYXg7IGkgKz0gNCkge1xuICAgICAgYjEwID0gKHRoaXMuZ2V0Qnl0ZTY0KHMsIGkpIDw8IDE4KSB8ICh0aGlzLmdldEJ5dGU2NChzLCBpICsgMSkgPDwgMTIpIHwgKHRoaXMuZ2V0Qnl0ZTY0KHMsIGkgKyAyKSA8PCA2KSB8IHRoaXMuZ2V0Qnl0ZTY0KHMsIGkgKyAzKTtcbiAgICAgIHgucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKGIxMCA+PiAxNiwgKGIxMCA+PiA4KSAmIDI1NSwgYjEwICYgMjU1KSk7XG4gICAgfVxuXG4gICAgc3dpdGNoIChwYWRzKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGIxMCA9ICh0aGlzLmdldEJ5dGU2NChzLCBpKSA8PCAxOCkgfCAodGhpcy5nZXRCeXRlNjQocywgaSArIDEpIDw8IDEyKSB8ICh0aGlzLmdldEJ5dGU2NChzLCBpICsgMikgPDwgNik7XG4gICAgICAgIHgucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKGIxMCA+PiAxNiwgKGIxMCA+PiA4KSAmIDI1NSkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgYjEwID0gKHRoaXMuZ2V0Qnl0ZTY0KHMsIGkpIDw8IDE4KSB8ICh0aGlzLmdldEJ5dGU2NChzLCBpICsgMSkgPDwgMTIpO1xuICAgICAgICB4LnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZShiMTAgPj4gMTYpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHguam9pbignJyk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGVuY29kZShzOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHMgPSBTdHJpbmcocyk7XG5cbiAgICBsZXQgaSwgYjEwLCB4ID0gW10sXG4gICAgICBpbWF4ID0gcy5sZW5ndGggLSBzLmxlbmd0aCAlIDM7XG5cbiAgICBpZiAocy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBzO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBpbWF4OyBpICs9IDMpIHtcbiAgICAgIGIxMCA9ICh0aGlzLmdldEJ5dGUocywgaSkgPDwgMTYpIHwgKHRoaXMuZ2V0Qnl0ZShzLCBpICsgMSkgPDwgOCkgfCB0aGlzLmdldEJ5dGUocywgaSArIDIpO1xuICAgICAgeC5wdXNoKHRoaXMuQUxQSEEuY2hhckF0KGIxMCA+PiAxOCkpO1xuICAgICAgeC5wdXNoKHRoaXMuQUxQSEEuY2hhckF0KChiMTAgPj4gMTIpICYgNjMpKTtcbiAgICAgIHgucHVzaCh0aGlzLkFMUEhBLmNoYXJBdCgoYjEwID4+IDYpICYgNjMpKTtcbiAgICAgIHgucHVzaCh0aGlzLkFMUEhBLmNoYXJBdChiMTAgJiA2MykpO1xuICAgIH1cblxuICAgIHN3aXRjaCAocy5sZW5ndGggLSBpbWF4KSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGIxMCA9IHRoaXMuZ2V0Qnl0ZShzLCBpKSA8PCAxNjtcbiAgICAgICAgeC5wdXNoKHRoaXMuQUxQSEEuY2hhckF0KGIxMCA+PiAxOCkgKyB0aGlzLkFMUEhBLmNoYXJBdCgoYjEwID4+IDEyKSAmIDYzKSArIHRoaXMuUEFEQ0hBUiArIHRoaXMuUEFEQ0hBUik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBiMTAgPSAodGhpcy5nZXRCeXRlKHMsIGkpIDw8IDE2KSB8ICh0aGlzLmdldEJ5dGUocywgaSArIDEpIDw8IDgpO1xuICAgICAgICB4LnB1c2godGhpcy5BTFBIQS5jaGFyQXQoYjEwID4+IDE4KSArIHRoaXMuQUxQSEEuY2hhckF0KChiMTAgPj4gMTIpICYgNjMpICsgdGhpcy5BTFBIQS5jaGFyQXQoKGIxMCA+PiA2KSAmIDYzKSArIHRoaXMuUEFEQ0hBUik7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiB4LmpvaW4oJycpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0Qnl0ZShzOiBzdHJpbmcsIGk6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3QgeCA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4geDtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGdldEJ5dGU2NChzOiBzdHJpbmcsIGk6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5BTFBIQS5pbmRleE9mKHMuY2hhckF0KGkpKTtcbiAgICByZXR1cm4gaWR4O1xuICB9XG5cbn1cbiJdfQ==