import { FormBuilder, FormGroup } from "@angular/forms";
import { ICapabilityModel } from '../models/ICapabilityModel';
import { AbstractCapabilityFormControl } from './AbstractCapabilityFormControl';
import { TelemetryCapabilityDto } from '../models/TelemetryCapabilityModel';

export class TelemetryCapabilityFormControl extends AbstractCapabilityFormControl<TelemetryCapabilityDto> {
  
  constructor(formBuilder: FormBuilder) {  
    super(formBuilder);
    this.model = new TelemetryCapabilityDto();
    this.toFormGroup();
  }

  public toFormGroup(): FormGroup {
    this.form = this.formBuilder.group({
      index: [this.index],
      id: [this.model.id],
      type: [this.model.type],
      displayName: [this.model.displayName],
      name: [this.model.name],
      comment: [this.model.comment],
      description: [this.model.description],
      // Telemetry specific
      schema: [this.model.schema],
      semanticType: [this.model.semanticType]
    });

    return this.form;
  }

  public getValue(): ICapabilityModel {
    return this.model;
  }
}

