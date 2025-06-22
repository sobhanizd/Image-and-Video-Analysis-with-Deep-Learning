import { Component, Inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DresService } from '../dres.service';

@Component({
  selector: 'app-video-player-dialog',
  templateUrl: './video-player-dialog.component.html',
  styleUrls: ['./video-player-dialog.component.css']
})
export class VideoPlayerDialogComponent implements AfterViewInit {
  videoSource: string | null = null;

  @ViewChild('videoPlayerElement') videoPlayerElement!: ElementRef<HTMLVideoElement>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dresService: DresService) {
    console.log(data);
    this.setVideoPath(data.videoPath);
  }

  setVideoPath(videoPath: string): void {
    this.videoSource = `http://localhost:5001/videos/V3C1-100/${videoPath}/${videoPath}.mp4`;
  }

  ngAfterViewInit(): void {
    if (this.videoPlayerElement && this.videoPlayerElement.nativeElement) {
      this.videoPlayerElement.nativeElement.currentTime = this.data.startTime;
      this.videoPlayerElement.nativeElement.play();
    }
  }

  extractCurrentTime(): void {
    if (this.videoPlayerElement && this.videoPlayerElement.nativeElement) {
      const currentTime = this.videoPlayerElement.nativeElement.currentTime;
      console.log(`Current time: ${currentTime} seconds`);
      this.uploadCurrentTime(currentTime);
    }
  }

  async uploadCurrentTime(currentTime: number): Promise<void> {
    if (this.data.videoPath) {
      const taskName = 'IVADL-TEST03';
      const mediaItemName = this.data.videoPath;
      const start = Math.floor(currentTime * 1000);
      const end = start;

      try {
        await this.dresService.submit(taskName, mediaItemName, start, end);
        console.log('Timestamp uploaded successfully');
      } catch (error) {
        console.error('Error uploading timestamp:', error);
      }
    } else {
      console.error('videoPath is null');
    }
  }
}
