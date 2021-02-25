var Base64 = (function () {
    function Base64() {
    }
    Base64.decode = function (s) {
        var pads = 0, i, b10, imax = s.length, x = [];
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
    };
    Base64.encode = function (s) {
        s = String(s);
        var i, b10, x = [], imax = s.length - s.length % 3;
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
    };
    Base64.getByte = function (s, i) {
        var x = s.charCodeAt(i);
        return x;
    };
    Base64.getByte64 = function (s, i) {
        var idx = this.ALPHA.indexOf(s.charAt(i));
        return idx;
    };
    Base64.PADCHAR = '=';
    Base64.ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    return Base64;
}());
export { Base64 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZTY0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vb250aW1pemUtd2ViLW5neC8iLCJzb3VyY2VzIjpbImxpYi91dGlsL2Jhc2U2NC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtJQUFBO0lBb0ZBLENBQUM7SUFoRmUsYUFBTSxHQUFwQixVQUFxQixDQUFTO1FBQzVCLElBQUksSUFBSSxHQUFHLENBQUMsRUFDVixDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxFQUN2QixDQUFDLEdBQUcsRUFBRSxDQUFDO1FBRVQsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVkLElBQUksSUFBSSxLQUFLLENBQUMsRUFBRTtZQUNkLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7UUFFRCxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDdkMsSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNULElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDdkMsSUFBSSxHQUFHLENBQUMsQ0FBQzthQUNWO1lBQ0QsSUFBSSxJQUFJLENBQUMsQ0FBQztTQUNYO1FBRUQsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM1QixHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ3JFO1FBRUQsUUFBUSxJQUFJLEVBQUU7WUFDWixLQUFLLENBQUM7Z0JBQ0osR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7Z0JBQ3hHLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELE1BQU07WUFDUixLQUFLLENBQUM7Z0JBQ0osR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7Z0JBQ3RFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDdkMsTUFBTTtTQUNUO1FBRUQsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFYSxhQUFNLEdBQXBCLFVBQXFCLENBQVM7UUFDNUIsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVkLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUNoQixJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUVqQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xCLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7UUFFRCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzVCLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMxRixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1QyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0MsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNyQztRQUVELFFBQVEsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUU7WUFDdkIsS0FBSyxDQUFDO2dCQUNKLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQy9CLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN6RyxNQUFNO1lBQ1IsS0FBSyxDQUFDO2dCQUNKLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQy9ILE1BQU07U0FDVDtRQUVELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRWMsY0FBTyxHQUF0QixVQUF1QixDQUFTLEVBQUUsQ0FBUztRQUN6QyxJQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLE9BQU8sQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVjLGdCQUFTLEdBQXhCLFVBQXlCLENBQVMsRUFBRSxDQUFTO1FBQzNDLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFqRmMsY0FBTyxHQUFXLEdBQUcsQ0FBQztJQUN0QixZQUFLLEdBQVcsa0VBQWtFLENBQUM7SUFrRnBHLGFBQUM7Q0FBQSxBQXBGRCxJQW9GQztTQXBGWSxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgY2xhc3MgQmFzZTY0IHtcbiAgcHJpdmF0ZSBzdGF0aWMgUEFEQ0hBUjogc3RyaW5nID0gJz0nO1xuICBwcml2YXRlIHN0YXRpYyBBTFBIQTogc3RyaW5nID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuXG4gIHB1YmxpYyBzdGF0aWMgZGVjb2RlKHM6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgbGV0IHBhZHMgPSAwLFxuICAgICAgaSwgYjEwLCBpbWF4ID0gcy5sZW5ndGgsXG4gICAgICB4ID0gW107XG5cbiAgICBzID0gU3RyaW5nKHMpO1xuXG4gICAgaWYgKGltYXggPT09IDApIHtcbiAgICAgIHJldHVybiBzO1xuICAgIH1cblxuICAgIGlmIChzLmNoYXJBdChpbWF4IC0gMSkgPT09IHRoaXMuUEFEQ0hBUikge1xuICAgICAgcGFkcyA9IDE7XG4gICAgICBpZiAocy5jaGFyQXQoaW1heCAtIDIpID09PSB0aGlzLlBBRENIQVIpIHtcbiAgICAgICAgcGFkcyA9IDI7XG4gICAgICB9XG4gICAgICBpbWF4IC09IDQ7XG4gICAgfVxuXG4gICAgZm9yIChpID0gMDsgaSA8IGltYXg7IGkgKz0gNCkge1xuICAgICAgYjEwID0gKHRoaXMuZ2V0Qnl0ZTY0KHMsIGkpIDw8IDE4KSB8ICh0aGlzLmdldEJ5dGU2NChzLCBpICsgMSkgPDwgMTIpIHwgKHRoaXMuZ2V0Qnl0ZTY0KHMsIGkgKyAyKSA8PCA2KSB8IHRoaXMuZ2V0Qnl0ZTY0KHMsIGkgKyAzKTtcbiAgICAgIHgucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKGIxMCA+PiAxNiwgKGIxMCA+PiA4KSAmIDI1NSwgYjEwICYgMjU1KSk7XG4gICAgfVxuXG4gICAgc3dpdGNoIChwYWRzKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGIxMCA9ICh0aGlzLmdldEJ5dGU2NChzLCBpKSA8PCAxOCkgfCAodGhpcy5nZXRCeXRlNjQocywgaSArIDEpIDw8IDEyKSB8ICh0aGlzLmdldEJ5dGU2NChzLCBpICsgMikgPDwgNik7XG4gICAgICAgIHgucHVzaChTdHJpbmcuZnJvbUNoYXJDb2RlKGIxMCA+PiAxNiwgKGIxMCA+PiA4KSAmIDI1NSkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgYjEwID0gKHRoaXMuZ2V0Qnl0ZTY0KHMsIGkpIDw8IDE4KSB8ICh0aGlzLmdldEJ5dGU2NChzLCBpICsgMSkgPDwgMTIpO1xuICAgICAgICB4LnB1c2goU3RyaW5nLmZyb21DaGFyQ29kZShiMTAgPj4gMTYpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHguam9pbignJyk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGVuY29kZShzOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHMgPSBTdHJpbmcocyk7XG5cbiAgICBsZXQgaSwgYjEwLCB4ID0gW10sXG4gICAgICBpbWF4ID0gcy5sZW5ndGggLSBzLmxlbmd0aCAlIDM7XG5cbiAgICBpZiAocy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBzO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDA7IGkgPCBpbWF4OyBpICs9IDMpIHtcbiAgICAgIGIxMCA9ICh0aGlzLmdldEJ5dGUocywgaSkgPDwgMTYpIHwgKHRoaXMuZ2V0Qnl0ZShzLCBpICsgMSkgPDwgOCkgfCB0aGlzLmdldEJ5dGUocywgaSArIDIpO1xuICAgICAgeC5wdXNoKHRoaXMuQUxQSEEuY2hhckF0KGIxMCA+PiAxOCkpO1xuICAgICAgeC5wdXNoKHRoaXMuQUxQSEEuY2hhckF0KChiMTAgPj4gMTIpICYgNjMpKTtcbiAgICAgIHgucHVzaCh0aGlzLkFMUEhBLmNoYXJBdCgoYjEwID4+IDYpICYgNjMpKTtcbiAgICAgIHgucHVzaCh0aGlzLkFMUEhBLmNoYXJBdChiMTAgJiA2MykpO1xuICAgIH1cblxuICAgIHN3aXRjaCAocy5sZW5ndGggLSBpbWF4KSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIGIxMCA9IHRoaXMuZ2V0Qnl0ZShzLCBpKSA8PCAxNjtcbiAgICAgICAgeC5wdXNoKHRoaXMuQUxQSEEuY2hhckF0KGIxMCA+PiAxOCkgKyB0aGlzLkFMUEhBLmNoYXJBdCgoYjEwID4+IDEyKSAmIDYzKSArIHRoaXMuUEFEQ0hBUiArIHRoaXMuUEFEQ0hBUik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBiMTAgPSAodGhpcy5nZXRCeXRlKHMsIGkpIDw8IDE2KSB8ICh0aGlzLmdldEJ5dGUocywgaSArIDEpIDw8IDgpO1xuICAgICAgICB4LnB1c2godGhpcy5BTFBIQS5jaGFyQXQoYjEwID4+IDE4KSArIHRoaXMuQUxQSEEuY2hhckF0KChiMTAgPj4gMTIpICYgNjMpICsgdGhpcy5BTFBIQS5jaGFyQXQoKGIxMCA+PiA2KSAmIDYzKSArIHRoaXMuUEFEQ0hBUik7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHJldHVybiB4LmpvaW4oJycpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0Qnl0ZShzOiBzdHJpbmcsIGk6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3QgeCA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4geDtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGdldEJ5dGU2NChzOiBzdHJpbmcsIGk6IG51bWJlcik6IG51bWJlciB7XG4gICAgY29uc3QgaWR4ID0gdGhpcy5BTFBIQS5pbmRleE9mKHMuY2hhckF0KGkpKTtcbiAgICByZXR1cm4gaWR4O1xuICB9XG5cbn1cbiJdfQ==