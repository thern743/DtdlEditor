import 'reflect-metadata';
import { ComponentType } from '@angular/cdk/portal';
import { AnyT, jsonMember, jsonObject } from "typedjson";
import { ComponentComponent } from '../component/component.component';
import { AbstractCapabilityModel } from './AbstractCapabilityModel';

@jsonObject
export class ComponentCapabilityModel extends AbstractCapabilityModel {
  @jsonMember 
  public name!: string;

  @jsonMember(AnyT) 
  public schema!: string | AbstractCapabilityModel;  

  constructor(id: string) {
    super(id, "Component");
  }

  public resolveSchemaComponentType(): ComponentType<any> {
    return ComponentComponent;
  }
}
