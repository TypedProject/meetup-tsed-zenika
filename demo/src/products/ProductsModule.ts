import {$log, AfterListen, Inject} from "@tsed/common";
import {Module} from "@tsed/di";

import * as productsResource from "../../resources/products.json";
import {ProductsController} from "./controllers/ProductsController";
import {ProductModel} from "./models/ProductModel";
import {ProductsService} from "./services/ProductsService";

@Module({
  mount: {
    "/rest": [ProductsController]
  },
  imports: [ProductsService]
})
export class ProductsModule implements AfterListen {
  @Inject()
  productsService: ProductsService;

  async $afterListen() {
    const products = await this.productsService.getProducts();

    if (!products.length) {
      const promises = productsResource.map((item) => {
        const product = new ProductModel();
        Object.assign(product, item);

        return this.productsService.addProduct(product);
      });

      await Promise.all(promises);

      $log.info("Products correctly imported");
    }
  }
}
