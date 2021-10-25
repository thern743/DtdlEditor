import { FormBuilder, FormGroup } from "@angular/forms";
import { ComponentCapabilityModel } from '../models/ComponentCapabilityModel';
import { AbstractCapabilityFormControl } from './AbstractCapabilityFormControl';

export class ComponentCapabilityFormControl extends AbstractCapabilityFormControl<ComponentCapabilityModel>  {
  constructor(formBuilder: FormBuilder) {  
    super(formBuilder);
    this.model = new ComponentCapabilityModel();
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
      // Component specific
      schema: [this.model.schema]
    });

    return this.form;
  }

  public getValue(): ComponentCapabilityModel {
    return this.model;
  }
}
