import { FormBuilder, FormGroup } from '@angular/forms';
import { EnumSchemaCapbilityModel } from '../models/EnumSchemaCapbilityModel';
import { ValidationService } from '../services/validation/validation-service.service';
import { AbstractCapabilityFormControl } from './AbstractCapabilityFormControl';

/**
 * Form control contains the mapping between the form and the backing model 
 */
export class EnumSchemaFormControl extends AbstractCapabilityFormControl<EnumSchemaCapbilityModel>{
    private _validationService: ValidationService;

    constructor(model: EnumSchemaCapbilityModel, formBuilder: FormBuilder, validationService: ValidationService) {
        super(formBuilder);
        this._validationService = validationService;
        this.model = model; 
        this.form = this.toFormGroup();          
    }

    public toFormGroup() : FormGroup { 
        let form =  this.formBuilder.group({
            id: [this.model.id, [this._validationService.ValidDtmi()]],
            displayName: [this.model.displayName], 
            comment: [this.model.comment],
            description: [this.model.description],
            // Enum specific
            enumValues: this.formBuilder.array([...this.model.enumValues]),
            valueSchema: [this.model.valueSchema]
        });

        return form;
    }
}