# Meetup Ts.ED - Artips

Meetup organized by Artips. See event details here: https://www.linkedin.com/events/meet-upartipstech-1/

## Supports

- [Slides](./resources/slides-2.pptx) 
- [Demo](./demo) 
- [Decorator example](demo/src/products/decorators/Log.ts)
- [Controller example](./demo/src/controllers/users/UserController.ts)

## Example

Controller example to declare a class which be used to expose routes and methods:

```typescript
import {Inject} from "@tsed/di";
import {Summary, Returns, ReturnsArray} from "@tsed/swagger";
import {Controller, Get, QueryParams, PathParams, Delete, Post, Required, BodyParams, Status, Put} from "@tsed/common";
import {BadRequest} from "@tsed/exceptions";
import {UsersService} from "../services/UsersService";
import {User} from "../models/User"; 
 
@Controller("/users")
export class UsersCtrl {
  @Inject()
  usersService: UsersService;
 
  @Get("/:id")
  @Summary("Get a user from his Id")
  @Returns(User)
  async getUser(@PathParams("id") id: string): Promise<User> {
     return this.usersService.findById(id);
  }
 
  @Post("/")
  @Status(201)
  @Summary("Create a new user")
  @Returns(User)
  async postUser(@Required() @BodyParams() user: User): Promise<User> {
    return this.usersService.save(user);
  }
 
  @Put("/:id")
  @Status(201)
  @Summary("Update the given user")
  @Returns(User)
  async putUser(@PathParams("id") id: string, @Required() @BodyParams() user: User): Promise<User> {
    if (user.id !== id) {
      throw new BadRequest("ID mismatch with the given payload")
    }
 
    return this.usersService.save(user);
  }
  
  @Delete("/:id")
  @Summary("Remove a user")
  @Status(204)
  async deleteUser(@PathParams("id") @Required() id: string ): Promise<User> {
     await this.usersService.delete(user);
  }
  
  @Get("/")
  @Summary("Get all users")
  @ReturnsArray(User)
  async findUser(@QueryParams("name") name: string){
    return this.usersService.find({name});
  }
}
```

## Contributors
Please read [contributing guidelines here](https://tsed.io/CONTRIBUTING.html)

<a href="https://github.com/TypedProject/ts-express-decorators/graphs/contributors"><img src="https://opencollective.com/tsed/contributors.svg?width=890" /></a>


## Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/tsed#backer)]

<a href="https://opencollective.com/tsed#backers" target="_blank"><img src="https://opencollective.com/tsed/tiers/backer.svg?width=890"></a>


## Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/tsed#sponsor)]

## License

The MIT License (MIT)

Copyright (c) 2016 - 2020 Romain Lenzotti

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
