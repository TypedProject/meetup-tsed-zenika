import {Default, Enum, Minimum, MinLength, Property, PropertyType, Required} from "@tsed/common";
import {Model, ObjectID, Unique} from "@tsed/mongoose";

export enum ProductCategory {
  CAMERA = "CAMERA",
  ACCESSORY = "ACCESSORY",
}

export class ProductCreationModel {
  @Required()
  @MinLength(3)
  @Unique()
  label: string;

  @Property()
  description: string = "";

  @Enum(ProductCategory)
  @Required()
  category: ProductCategory;

  @Default(0)
  @Minimum(0)
  qte: number = 0;

  @PropertyType(String)
  tags: string[] = [];
}

@Model({
  name: "products"
})
export class ProductModel extends ProductCreationModel {
  @ObjectID("id")
  _id: string;
}
