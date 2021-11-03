import { FormBuilder, FormGroup } from "@angular/forms";
import { AbstractCapabilityFormControl } from './AbstractCapabilityFormControl';
import { InterfaceCapabilityModel } from '../models/InterfaceCapabilityModel';
import { ICapabilityModel } from '../models/ICapabilityModel';
import { ICapabilityFormControl } from "./ICapabilityFormControl";
import { PropertyCapabilityFormControl } from "./PropertyCapabilityFormControl";
import { CommandCapabilityFormControl } from "./CommandCapabilityFormControl";
import { ComponentCapabilityFormControl } from "./ComponentCapabilityFormControl";
import { RelationshipCapabilityFormControl } from "./RelationshipCapabilityFormControl";
import { TelemetryCapabilityFormControl } from "./TelemetryCapabilityFormControl";
import { RelationshipCapabilityModel } from "../models/RelationshipCapabilityModel";
import { CommandCapabilityModel } from "../models/CommandCapabilityModel";
import { ComponentCapabilityModel } from "../models/ComponentCapabilityModel";
import { PropertyCapabilityModel } from "../models/PropertyCapabilityModel";
import { TelemetryCapabilityModel } from "../models/TelemetryCapabilityModel";
import { AbstractCapabilityModel } from "../models/AbstractCapabilityModel";

export class InterfaceCapabilityFormControl extends AbstractCapabilityFormControl<InterfaceCapabilityModel> {
  public contents: ICapabilityFormControl<ICapabilityModel>[];
  
  constructor(model: InterfaceCapabilityModel, formBuilder: FormBuilder) {  
    super(formBuilder);
    this.contents = new Array<ICapabilityFormControl<ICapabilityModel>>();
    this.mapModelSubProperties(model);
    this.model = model;
    this.form = this.toFormGroup();
  }

  private mapModelSubProperties(model: InterfaceCapabilityModel): void {
    model.contents.map((model: ICapabilityModel) => {
      let formControl!: ICapabilityFormControl<ICapabilityModel>;
            
      switch(model.type) {
        case "Property":          
          formControl = new PropertyCapabilityFormControl(model as PropertyCapabilityModel, this.formBuilder);
          break;
        case "Command":
          formControl = new CommandCapabilityFormControl(model as CommandCapabilityModel, this.formBuilder);
          break;
        case "Telemetry":
          formControl = new TelemetryCapabilityFormControl(model as TelemetryCapabilityModel, this.formBuilder);
          break;
        case "Component":
          formControl = new ComponentCapabilityFormControl(model as ComponentCapabilityModel, this.formBuilder);
          break;
        case "Relationship":
          formControl = new RelationshipCapabilityFormControl(model as RelationshipCapabilityModel, this.formBuilder);
          break;
        default:
          throw new Error("Invalid capability type '" + model.type + "'");          
      }

      this.contents.push(formControl);
    });
  }
  
  get commands(): ICapabilityModel[] {        
    return this.capabilityByType("Command");
  }

  get properties(): ICapabilityModel[] {
    return this.capabilityByType("Property");
  }

  get telemetries(): ICapabilityModel[] {
    return this.capabilityByType("Telemetry");
  }

  get components(): ICapabilityModel[] {
    return this.capabilityByType("Component");
  }

  get relationships(): ICapabilityModel[] {
    return this.capabilityByType("Relationship");
  }

  private capabilityByType(type: string): ICapabilityModel[] {    
    let capabilities = this.model.contents.filter(x => x.type === type);
    return capabilities;
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
      // Interface specific
      context: [this.model.context],
      extends: [this.model.extends],
      contents: this.formBuilder.array([...this.model.contents])
    });

    return this.form;
  }
}