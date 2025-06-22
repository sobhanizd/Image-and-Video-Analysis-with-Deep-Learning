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
}
