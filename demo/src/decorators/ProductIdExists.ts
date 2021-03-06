import {Context, Inject, Middleware, ParamTypes, Req, UseBefore} from "@tsed/common";
import {applyDecorators, StoreSet} from "@tsed/core";
import {BadRequest} from "@tsed/exceptions";
import get from "lodash/get";
import {ProductsService} from "../services/ProductsService";

export interface ProductExistsOptions {
  type?: ParamTypes;
}

@Middleware()
export class ProductIdExistsMiddleware {
  @Inject()
  productsService: ProductsService;

  async use(@Req() req: Req, @Context() context: Context) {
    const {type = ParamTypes.PATH}: ProductExistsOptions = context.endpoint.get(ProductIdExistsMiddleware);
    const productId = this.getIdFromRequest(req, type);

    if (productId) {
      const product = await this.productsService.productExists(productId);

      if (!product) {
        throw new BadRequest("Product not found");
      }

      context.set("product", product);
    }
  }

  getIdFromRequest(req: Req, type: ParamTypes) {
    switch (type) {
      case ParamTypes.PATH:
        return get(req, "params.id");
      case ParamTypes.QUERY:
        return get(req, "query.id");
      case ParamTypes.BODY:
        return get(req, "body.id");
      default:
        return null;
    }
  }
}

export function ProductIdExists(options: ProductExistsOptions): MethodDecorator {
  return applyDecorators(
    StoreSet(ProductIdExistsMiddleware, options),
    UseBefore(ProductIdExistsMiddleware)
  );
}
