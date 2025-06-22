import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VideoService } from './video.service';
import { DresService } from './dres.service';
import { VideoPlayerDialogComponent } from './video-player-dialog/video-player-dialog.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frame-finder';
  videos: any[] = [];
  loading: boolean = false;

  constructor(
    private videoService: VideoService, 
    private dresService: DresService, 
    private dialog: MatDialog,
    private titleService: Title
  ) {
    // Set initial title
    this.titleService.setTitle('Group 15');
  }

  onSearch(query: string) {
    this.loading = true;  // Show spinner
    
    // Update page title with search query
    if (query && query.trim()) {
      this.titleService.setTitle(`Group 15 - "${query}"`);
    } else {
      this.titleService.setTitle('Group 15');
    }
    
    this.videoService.searchVideos(query).subscribe({
      next: (data) => {
        this.videos = data;
        this.loading = false;  // Hide spinner
      },
      error: (error) => {
        console.error('Error fetching videos', error);
        this.loading = false;  // Hide spinner
        // Reset title on error
        this.titleService.setTitle('Group 15');
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
