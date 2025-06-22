import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-video-item',
  templateUrl: './video-item.component.html',
  styleUrls: ['./video-item.component.css']
})
export class VideoItemComponent {
  @Input() scenes: any;
  @Input() video!: string;
  @Input() index!: number;

  get thumbnailUrl() {
    //console.log(this.scenes.thumbnailPath)
    if (this.scenes && this.scenes.thumbnailPath) {
      return `http://localhost:5001${this.scenes.thumbnailPath}`;
    } else {
      console.error('Thumbnail path is undefined', this.scenes.scene);
      return '';
    }
  }

  getTimeString(): string {
    if (this.scenes && this.scenes.keyframeSimilarities && this.scenes.keyframeSimilarities[0]) {
      const frameNumber = this.scenes.keyframeSimilarities[0].frameNumber;
      const fps = 30; // Assuming 30 fps, you might want to make this dynamic
      const seconds = Math.floor(frameNumber / fps);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return '';
  }
}
