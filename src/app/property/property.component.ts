import { Component, Input, OnInit } from '@angular/core';
import { EditorService } from '../services/editor/editor-service.service';
import { MatSelectChange } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { SchemaService } from '../services/schema/schema.service';
import { PropertyCapabilityFormControl } from '../formControls/PropertyCapabilityFormControl';
import { AbstractCapabilityFormControl } from '../formControls/AbstractCapabilityFormControl';
import { AbstractCapabilityModel } from '../models/AbstractCapabilityModel';
import { SchemaTypeEnum } from '../models/SchemaTypeEnum';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'property-definition',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {
  @Input() public formIndex!: [number, number];
  @Input() public property!: PropertyCapabilityFormControl;
  @Input() public panelOpenState!: boolean;
  private _editorService: EditorService;
  private _schemaService: SchemaService;
  public dialog: MatDialog;
  public schemaFormControl!: AbstractCapabilityFormControl<AbstractCapabilityModel> | undefined;
  public schemaDropDownControl: FormControl = new FormControl();
  public semanticTypeDropDownControl: FormControl = new FormControl();

  constructor(editorService: EditorService, schemaService: SchemaService, dialog: MatDialog) {
    this._editorService = editorService;
    this._schemaService = schemaService;
    this.dialog = dialog;
  }

  public ngOnInit(): void {
    this.property.subscribeModelToForm();
    this.syncHeaderFields();
    this.setSchemaAndSemanticTypeDropDowns();
  }

  // TODO: Importing a Property model does not allow editing the schema
  //       Because the models are deserialized directly, the factory methods are not called when importing
  //       a model and so the SchemaFormControl value isn't set for `openSchemaEditor()`.
  private setSchemaAndSemanticTypeDropDowns(): void {
    if (this.property.model?.type instanceof Array && this.property.model.type?.length > 1) {
      // Only set Semantic Type is it's an additional @type value
      let type = this.property.model.type[1];
      this.semanticTypeDropDownControl?.setValue(type);
    }

    let schema = typeof this.property.model?.schema === 'string' ? this.property.model.schema : this.property.model.schema?.type;
    if (!schema) return;
    this.schemaDropDownControl?.setValue(schema.toLocaleLowerCase());
  }

  public syncHeaderFields() {
    const id = this.property.form.get("id");
    const name = this.property.form.get("name");

    id?.valueChanges.subscribe(value => {
      id.setValue(value, { emitEvent: false })
    });

    name?.valueChanges.subscribe(value => {
      name.setValue(value, { emitEvent: false })
    });
  }

  public getSchemaTypes(): Array<string> {
    let schemaTypes = new Array<string>();

    this._schemaService.schemaFactory.formRegistry.get("Primitive")?.forEach((value, key) => {
      schemaTypes.push(key);
    });

    this._schemaService.schemaFactory.formRegistry.get("Complex")?.forEach((value, key) => {
      schemaTypes.push(key);
    });

    return schemaTypes;
  }

  public getSemanticTypes(): Array<string> {
    return this._editorService.getSemanticTypes();
  }

  public getUnits(): string[] | undefined {
    let semanticType = this.semanticTypeDropDownControl?.value;
    if(semanticType) {
      let units = this._editorService.getUnits().get(semanticType);
      return units;
    }

    return undefined;
  }

  // TODO: Passing validSchemaTypes to the FilterPipe doesn't get re-evaluated on changes
  //       Ideally, we'd use the FilterPipe in the component view to filter the array values.
  //       However, the filter function only executes once and is not ever re-evaluated if the view or form changes. 
  public validSchemaTypes = (schemaType: string): boolean => {
    if (this.semanticTypeDropDownControl?.value)
      return ["double", "float", "integer", "long"].indexOf(schemaType.toLowerCase()) > -1;
    else
      return true;
  }

  public changeSemanticType($event: MatSelectChange): void {
    let value = $event.value;
    this.changeSemanticTypeInternal(value);
  }

  private changeSemanticTypeInternal(value: string): void {
    let type = this.property.form.get("type");

    if (["", null, undefined].indexOf(value) > -1) {
      let semanticType = new Array<string>("Property");
      type?.setValue(semanticType);
      let unit = this.property.form.get("unit");
      unit?.setValue(undefined);
    } else {
      let semanticType = new Array<string>("Property", value);
      type?.setValue(semanticType);

      let schema = this.property.form.get("schema")?.value;
      if (["double", "float", "integer", "long"].indexOf(schema.toLowerCase()) === -1) {
        this.property.form.get("schema")?.setValue(undefined);
        this.schemaDropDownControl.setValue(undefined);
        this.schemaFormControl = undefined;
      }
    }
  }

  public isComplex(schema: string): boolean {
    if (typeof schema == 'string')
      return this._schemaService.getSchemaType(schema) == SchemaTypeEnum.Complex;

    return false;
  }

  public compareSchemas = (model1: AbstractCapabilityModel, model2: AbstractCapabilityModel): boolean => {
    return this._schemaService.compareSchemas(model1, model2)
  }

  public changeSchema($event: MatSelectChange): void {
    let value = $event.value;
    this.changeSchemaInternal(value);
  }

  public changeSchemaInternal(value: any): void {
    if (value instanceof AbstractCapabilityFormControl) return;
    let key = value.toLowerCase();
    let schemaType = this._schemaService.getSchemaType(key);
    this.property.form.get("schema")?.setValue(key);

    if (schemaType == SchemaTypeEnum.Complex) {
      let formControl = this._schemaService.createForm(SchemaTypeEnum[schemaType], key);
      if (formControl === undefined) return;
      this.schemaFormControl = formControl;
    }
  }

  public openSchemaEditor(): void {
    if(this.schemaFormControl)
      this._schemaService.openSchemaEditor(this.property.form, this.schemaFormControl)
  }
}
