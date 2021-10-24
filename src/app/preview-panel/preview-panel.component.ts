import { Component, Input, OnInit } from '@angular/core';
import { InterfaceCapabilityFormControl } from '../formControls/InterfaceCapabilityFormControl';

@Component({
  selector: 'preview-panel',
  templateUrl: './preview-panel.component.html',
  styleUrls: ['./preview-panel.component.scss']
})
export class PreviewPanelComponent implements OnInit {
  public panelOpenState = true;
  @Input() public formIndex: number = 0;
  @Input() public interface!: InterfaceCapabilityFormControl;
  @Input('cdkCopyToClipboard') public text!: string

  constructor() { 
    
  }

  public ngOnInit(): void {
    
  }
}
