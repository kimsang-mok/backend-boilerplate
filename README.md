# Riem Backend

## Installation and Setup

Before you begin, ensure that NodeJS and either PostgreSQL or MySQL are installed on your machine. Follow these steps to set up the project:

1. **Clone the Repository**: Clone this repository to your local machine.
2. **Install Dependencies**: Navigate to the project root directory and execute `npm install` or `yarn install`.
3. **Environment Configuration**: Create a `.env` file in the root directory with the following content, adjusting values as necessary:
    
    ```
    NODE_ENV=development
    ```
    
4. **Database Connection**: To connect to your database, modify the configuration in `config/"environtment".json` with the values correspond to your database information. If using MySQL, ensure the `dialect` property in `/src/config/index.ts` is set to `mysql`.

## Running the Application

To run the application, use the following command:

```bash
npm run watch
```

This command compiles the TypeScript code and runs the compiled JavaScript in watch mode, allowing for real-time updates without restarting the server. 

The application will be accessible at `http://localhost:3000`.

## Project structure

> Ensure you have executed `npm install` and can run the app using `npm run watch`. The project structure is organized as follows:
> 

| Name | Description |
| --- | --- |
| dist | Contains the output from the TypeScript build |
| node_modules | Contains all the npm dependencies |
| public | Contains the api documentation files generated using http://apidocjs.com/ |
| src | Contains all the source code that will be compiled to dist folder |
| src/config | Configuration files, including database settings. |
| src/interfaces | Contains common interfaces |
| src/locales | Language translation for messages |
| src/middlewares | Middlewares defines functions for validating input request |
| src/modules | Contains application modules |
| src/modules/groups | groups route, controller, service, model, validator, and test (unit and integration test) |
| src/utils | Utils defines the utility files |
| src/app.ts | Express app main configuration |
| src/global.d.ts | Defines the global interfaces |
| src/server.ts | Entry point express server |
| src/route.ts | Contains the application routes  |

## Using Module Aliases

To streamline our development process and make our codebase more readable, we will use module aliases. This approach allows us to replace long and complex relative paths with simple identifiers

**Instead of using relative paths like this:**

```tsx
import APIFeature from "../../../utils/APIFeature";
```

**You can now use the alias:**

```tsx
import APIFeature from "@utils/APIFeature";
```

### **Available Aliases**:

```json
"@src/*": ["src/*"],
"@modules/*": ["src/modules/*"],
"@middlewares/*": ["src/middlewares/*"],
"@utils/*": ["src/utils/*"],
"@configs/*": ["src/configs/*"]
```

## **Base Controller Class**

The `Controller`class serves as an abstract base class designed to streamline the handling of HTTP requests and responses. It encapsulates common functionalities such as sending success or error responses, and handling asynchronous operations safely.

### **Features**

- **Asynchronous Operation Handling**: Simplifies the handling of asynchronous route handlers and automatically catches and forwards errors to error handling middleware.
- **Response Helpers**: Provides methods for sending standardized HTTP responses, including success, and error.

### **Usage**

To use the `Controller` class, extend it in your specific controller classes. Here's an example 

```tsx
@AutoBind
  class GroupController extends Controller {
    getGroups = Controller.catchAsync(
      async (req: Request, res: Response): Promise<void> => {
        const result = await groupService.get(req.query);
        this.ok(res, result);
      }
    );

    // Additional methods...
  }
```

### **AutoBind Decorator**

The `AutoBind` decorator is used to automatically bind class methods to the instance of the class. This is particularly useful for ensuring that `this` within methods refers to the class instance, especially when methods are used as callbacks (express router).

## Base Service Class

The `Service` class is designed as an abstract base class to provide a standardized way to interact with the database models. It utilizes the `APIFeature` to streamline common operations such as querying, sorting, filtering, and pagination. This class abstracts away the repetitive CRUD operations into reusable methods.

### Usage

```tsx
class GroupService extends Service<TaskGroup> {
  protected model = db.TaskGroup;

  async getById(id: string): Promise<TaskGroup> {
	// Optionally override base methods for custom behavior
    const result = await this.model.findOne({
      where: { id },
      include: [
        {
          model: Task,
          as: "tasks",
          attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] }
        }
      ]
    });
    if (!result) {
      this.handleNotFound();
    }
    return result;
  }
}
```

## APIFeatures Class

The `APIFeatures` class is designed with a **fluent interface** to build and execute complex queries with Sequelize, supporting operations like search, filter, sort, limit fields, and paginate.

### Methods

- **search**: Adds search functionality to the query based on a provided strategy.
- **filter**: Filters the query based on the query parameters, excluding predefined fields.
- **sort**: Sorts the query results based on the 'sort' query parameter.
- **limitFields**: Limits the fields to be returned in the query results based on the 'fields' query parameter.
- **paginate**: Applies pagination to the query based on 'page' and 'perpage' query parameters.
- **execute**: Executes the built query and returns the result along with pagination information.

### Usage

- Create an instance of `APIFeatures` with the desired Sequelize model and query parameters.
- Chain the methods as needed and call `execute` to run the query and obtain the results.

```tsx
const apiFeatures = new APIFeatures(Task, query)
  .search("fulltext")
  .filter()
  .sort()
  .limitFields()
  .paginate();
const result = await apiFeatures.execute();

```

## SearchStrategy

The `SearchStrategy` system allows for the implementation of different search algorithms that can be applied to Sequelize models. **Strategy Pattern** is used to enable the selection of an algorithm at runtime.

**SearchStrategyType**

```tsx
export type SearchStrategyType = "default" | "fulltext"; 
```

Defines the types of search strategies available: "default" for regex-based search and "fulltext" for database-supported full-text search.

### Usage

To use the `SearchStrategy` system, 

- register models with their searchable fields using `SearchStrategyFactory.registerStrategy(model, fields)`.
- obtain a search strategy instance by calling `SearchStrategyFactory.getSearchStrategy(model, strategy)` with the desired model and strategy type.
- build query by calling `buildSearchQuery(searchQuery)`

## Morgan

This module will be used as a custom middleware for logging HTTP requests in a structured format. It differentiates between successful requests and errors, logging them as either informational messages or errors, respectively. 

**Defined Format**

```bash
[HTTP_METHOD] REQUEST_URL | Status: STATUS_CODE 
| Size: CONTENT_LENGTH - Time: RESPONSE_TIME ms
[Response]
```

**Example**

```bash
[GET] /api/v1/groups | 200
 | 13 - 4.567 ms |
[Response]
```

- **[GET]**: The HTTP method used for the request.
- **/api/v1/todos**: The URL path that was requested.
- **200**: The HTTP status code of the response, indicating a successful request.
- **13**: The content length of the response in bytes.
- **4.567 ms**: The time it took for the server to process the request and send back a response, measured in milliseconds.
- **[Response]**: A placeholder text from the custom format. In this example, it doesn't append additional information but serves as a marker (indicate the end of each request information)