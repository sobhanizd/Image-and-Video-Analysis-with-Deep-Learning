import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  query: string = '';
  @Input() loading: boolean = false;
  @Output() search = new EventEmitter<string>();

  onSearch() {
    if (!this.loading) {
      this.search.emit(this.query);
    }
  }
}
