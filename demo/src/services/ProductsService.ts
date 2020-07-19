import {Inject, Injectable} from "@tsed/di";
import {MongooseModel} from "@tsed/mongoose";
import {ProductLabelExists} from "../errors/ProductLabelExists";
import {ProductCreationModel, ProductModel} from "../models/ProductModel";

@Injectable()
export class ProductsService {
  @Inject(ProductModel)
  productModel: MongooseModel<ProductModel>;

  async productExists(id: string) {
    return this.productModel.exists({id});
  }

  async addProduct(productCreation: ProductCreationModel) {
    const product = new this.productModel(productCreation);

    try {
      return await product.save();
    } catch (er) {
      if (er.name === "MongoError" && er.code === 11000) {
        throw new ProductLabelExists(productCreation.label, er);
      }
    }
  }

  async getProduct(id: string) {
    return this.productModel.findById(id).exec();
  }

  async getProducts(query = {}) {
    return this.productModel.find(query).exec();
  }
}

