import {PlatformTest} from "@tsed/common";
import {TestMongooseContext} from "@tsed/testing-mongoose";
import * as SuperTest from "supertest";
import {ProductCategory} from "../models/ProductModel";
import {Server} from "../../Server";
import {ProductsController} from "./ProductsController";

describe("ProductsController", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(TestMongooseContext.bootstrap(Server, {
    mount: {
      "/": [ProductsController]
    }
  }));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterAll(TestMongooseContext.reset);

  it("should call GET /products", async () => {
    const response = await request.get("/products").expect(200);

    expect(response.body).toEqual([]);
  });

  describe("POST /products", () => {
    it("should add product", async () => {
      const response = await request
        .post("/products")
        .send({
          label: "Camera D300",
          description: "Camera HD",
          category: ProductCategory.CAMERA,
          tags: ["camera", "reflex", "apn"]
        })
        .expect(201);

      expect(response.body).toEqual({
        "category": "CAMERA",
        "description": "Camera HD",
        "id": expect.any(String),
        "label": "Camera D300",
        "qte": 0,
        "tags": [
          "camera",
          "reflex",
          "apn"
        ]
      });

      const responseList = await request.get("/products").expect(200);

      expect(responseList.body).toEqual([
        {
          "category": "CAMERA",
          "description": "Camera HD",
          "id": expect.any(String),
          "label": "Camera D300",
          "qte": 0,
          "tags": [
            "camera",
            "reflex",
            "apn"
          ]
        }
      ]);
    });
    it("should throw a bad request when there is missing field (name)", async () => {
      const response = await request
        .post("/products")
        .send({
          description: "Camera HD",
          category: ProductCategory.CAMERA,
          tags: ["camera", "reflex", "apn"]
        })
        .expect(400);

      expect(response.text).toEqual("Bad request on parameter \"request.body\".<br />ProductCreationModel should have required property 'label'. Given value: \"undefined\"");
    });
    it("should throw a bad request when there is missing field (category)", async () => {
      const response = await request
        .post("/products")
        .send({
          label: "Camera D300",
          description: "Camera HD",
          tags: ["camera", "reflex", "apn"]
        })
        .expect(400);

      expect(response.text).toEqual("Bad request on parameter \"request.body\".<br />ProductCreationModel should have required property 'category'. Given value: \"undefined\"");
    });
    it("should throw an error when label already exists", async () => {
      await request
        .post("/products")
        .send({
          label: "Camera D200",
          description: "Camera HD",
          category: ProductCategory.CAMERA,
          tags: ["camera", "reflex", "apn"]
        })
        .expect(201);

      const response = await request
        .post("/products")
        .send({
          label: "Camera D200",
          description: "Camera HD",
          category: ProductCategory.CAMERA,
          tags: ["camera", "reflex", "apn"]
        })
        .expect(400);

      expect(response.text).toEqual("Product label already exists in database (Camera D200)");
    });
  });

  describe("GET /products/:id", () => {
    it("should get product", async () => {
      const response = await request
        .post("/products")
        .send({
          label: "Camera D400",
          description: "Camera HD",
          category: ProductCategory.CAMERA,
          tags: ["camera", "reflex", "apn"]
        })
        .expect(201);

      await request.get(`/products/${response.body.id}`).expect(200);
    });

    it("should throw a 404 when product id doesn't exists", async () => {
      const response = await request.get(`/products/5f14b6fa7b695776c88dff40`).expect(404);

      expect(response.text).toEqual("Product not found");
    });
  });

  describe("PUT /products/:id", () => {
    it("should get product", async () => {
      const response = await request
        .post("/products")
        .send({
          label: "Camera D400",
          description: "Camera HD",
          category: ProductCategory.CAMERA,
          tags: ["camera", "reflex", "apn"]
        })
        .expect(201);

      response.body.description = "Camera HD update";

      const {body: product} = await request
        .put(`/products/${response.body.id}`)
        .send(response.body)
        .expect(201);

      expect(product.description).toEqual("Camera HD update");
    });

    it("should throw a 404 when product id doesn't exists", async () => {
      const response = await request
        .put(`/products/5f14b6fa7b695776c88dff40`)
        .send({
          label: "Camera D400",
          description: "Camera HD",
          category: ProductCategory.CAMERA,
          tags: ["camera", "reflex", "apn"]
        })
        .expect(404);

      expect(response.text).toEqual("Product not found");
    });
  });
});
