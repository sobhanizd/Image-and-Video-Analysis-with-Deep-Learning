import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VideoService } from './video.service';
import { DresService } from './dres.service';
import { VideoPlayerDialogComponent } from './video-player-dialog/video-player-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frame-finder';
  videos: any[] = [];
  loading: boolean = false;

  constructor(private videoService: VideoService, private dresService: DresService, private dialog: MatDialog) {}

  onSearch(query: string) {
    this.loading = true;  // Show spinner
    this.videoService.searchVideos(query).subscribe({
      next: (data) => {
        this.videos = data;
        this.loading = false;  // Hide spinner
      },
      error: (error) => {
        console.error('Error fetching videos', error);
        this.loading = false;  // Hide spinner
      },
      complete: () => {
        console.log('Search completed');
      }
    });
  }

  openVideoDialog(event: { videoPath: string, startTime: number }) {
    this.dialog.open(VideoPlayerDialogComponent, {
      data: {
        videoPath: event.videoPath,
        startTime: event.startTime // Pass the start time
      }
    });
  }

  async handleLoginAndSubmit() {
    this.loading = true;
    try {
      await this.dresService.submit('IVADL-TEST03', '00101', 1000, 2000);
      alert('Submission successful');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      alert('Submission failed');
    } finally {
      this.loading = false;
    }
  }
}
