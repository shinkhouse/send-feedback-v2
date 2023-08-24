import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    constructor(private captureService: NgxCaptureService) {}
    @ViewChild('screenVideo') screenVideo!: ElementRef<HTMLVideoElement>;
    @ViewChild('screenshot') screenshot!: ElementRef<HTMLImageElement>;
    public base64Img = '';

    async startCapture() {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia();
            this.screenVideo.nativeElement.srcObject = stream;
        } catch (error) {
            console.error('Error accessing screen capture:', error);
        }
    }

    ngAfterViewInit() {
        this.screenVideo.nativeElement.addEventListener('play', () => {
            const canvas = document.createElement('canvas');
            canvas.width = this.screenVideo.nativeElement.videoWidth;
            canvas.height = this.screenVideo.nativeElement.videoHeight;
            canvas
                .getContext('2d')
                ?.drawImage(
                    this.screenVideo.nativeElement,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
            const screenshotDataUrl = canvas.toDataURL('image/png');
            this.screenshot.nativeElement.src = screenshotDataUrl;
            this.base64Img = screenshotDataUrl;
        });
    }
}
