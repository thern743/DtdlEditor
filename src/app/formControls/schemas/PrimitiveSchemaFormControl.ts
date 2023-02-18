import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { RegisterFormFactoryMethod } from '../../reflection/ReflectionMetadata';
import { PrimitiveSchemaCapabilityModel } from '../../models/schemas/PrimitiveSchemaCapabilityModel';
import { ValidationService } from '../../services/validation/validation-service.service';
import { AbstractCapabilityFormControl } from '../AbstractCapabilityFormControl';

export class PrimitiveSchemaFormControl extends AbstractCapabilityFormControl<PrimitiveSchemaCapabilityModel> {
  private _validationService: ValidationService;
  public dialog: MatDialog;

  constructor(model: PrimitiveSchemaCapabilityModel, formBuilder: FormBuilder, validationService: ValidationService, dialog: MatDialog) {
    super(formBuilder);
    this._validationService = validationService;
    this.dialog = dialog;
    this.model = model;
    this.form = this.toFormGroup();
  }

  public toFormGroup(): FormGroup {
    let form = this.formBuilder.group({
      id: [this.model.id, [this._validationService.validDtmi()]],
      displayName: [this.model.displayName],
      comment: [this.model.comment],
      description: [this.model.description],
      // Primitive specific
      schema: [this.model.schema]
    });

    return form;
  }
}