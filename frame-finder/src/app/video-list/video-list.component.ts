import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css']
})
export class VideoListComponent {
  @Input() videos: any[] = []; // raw data
  groupedVideos: any[] = [];
  @Output() videoClick = new EventEmitter<{ videoPath: string, startTime: number }>();


  ngOnInit() {
    this.groupVideosByTitle();
  }

  groupVideosByTitle() {
    const videoMap = new Map();

    this.videos.forEach(video => {
      if (!videoMap.has(video.video)) {
        videoMap.set(video.video, {
          video: video.video,
          fps: video.fps,
          scenes: []
        });
      }
      const groupedVideo = videoMap.get(video.video);
      groupedVideo.scenes.push(...video.scenes);
    });

    this.groupedVideos = Array.from(videoMap.values());
  }

  onThumbnailClick(videoPath: string, startTime: number) {
    this.videoClick.emit({ videoPath, startTime });
  }
}
