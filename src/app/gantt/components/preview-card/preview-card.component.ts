import { Component, input, output } from '@angular/core';

@Component({
  selector: 'nl-preview-card',
  templateUrl: './preview-card.component.html',
  styleUrls: ['./preview-card.component.scss'],
})
export class PreviewCardComponent {
  previewCardStyles = input<{
    width: number;
    left: number;
    top: number;
    display: 'block' | 'none';
  }>({
    width: 0,
    left: 0,
    top: 0,
    display: 'none',
  });

  createWorkorder = output<MouseEvent>();
}
