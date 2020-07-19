import {ValidationError} from "@tsed/common";
import {nameOf} from "@tsed/core";
import {ProductCreationModel} from "../models/ProductModel";

export class ProductLabelExists extends ValidationError {
  constructor(label: string, origin: Error) {
    super(`Product label already exists in database (${label})`, [
      {
        dataModel: nameOf(ProductCreationModel),
        dataValue: label,
        dataPath: ".label"
      }
    ]);
    this.origin = origin;
  }
}
