import {BodyParams, Controller, Get, Inject, PathParams, Post, Required, Status} from "@tsed/common";
import {BadRequest, NotFound} from "@tsed/exceptions";
import {Returns, ReturnsArray, Summary} from "@tsed/swagger";
import {ProductCreationModel, ProductModel} from "../../models/ProductModel";
import {ProductsService} from "../../services/ProductsService";

@Controller("/products")
export class ProductsController {
  @Inject()
  productsService: ProductsService;

  @Get("/:id")
  @Summary("Get a product by is id")
  @Returns(ProductModel)
  @Returns(404, {description: "Product not found"})
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

  @Get("/")
  @Summary("Get all products")
  @ReturnsArray(ProductModel)
  async getProducts(): Promise<ProductModel[]> {
    return this.productsService.getProducts();
  }
}
