import {BodyParams, Controller, Get, Inject, PathParams, Post, Put, Required, Status} from "@tsed/common";
import {NotFound} from "@tsed/exceptions";
import {Returns, ReturnsArray, Summary} from "@tsed/swagger";
import {ProductIdExists} from "../decorators/ProductIdExists";
import {ProductCreationModel, ProductModel} from "../models/ProductModel";
import {ProductsService} from "../services/ProductsService";

@Controller("/products")
export class ProductsController {
  @Inject()
  productsService: ProductsService;

  @Get("/:id")
  @Summary("Get a product by is id")
  @ProductIdExists()
  @Returns(ProductModel)
  async getProduct(@PathParams("id") id: string): Promise<ProductModel> {
    const product = await this.productsService.getProduct(id);

    if (!product) {
      throw new NotFound("Product not found");
    }

    return product;
  }

  @Post("/")
  @Status(201)
  @Summary("Add a new product")
  @Returns(ProductModel)
  async addProduct(@BodyParams() @Required() product: ProductCreationModel) {
    return await this.productsService.addProduct(product);
  }

  @Put("/:id")
  @Summary("Update a product")
  @Returns(ProductModel)
  @ProductIdExists()
  async updateProduct(@BodyParams() @Required() product: ProductModel) {
    return await this.productsService.updateProduct(product);
  }

  @Get("/")
  @Summary("Get all products")
  @ReturnsArray(ProductModel)
  async getProducts(): Promise<ProductModel[]> {
    return this.productsService.getProducts();
  }
}
