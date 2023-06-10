# nodejs-be-test

Follow these steps below to make sure the application running in the correct way
Requirements
## Requirements

For building and running the application you need:
-   Node.js: You can download and install Node.js from the official website: [nodejs.org](https://nodejs.org/)
-   Yarn: Install Yarn on your system. You can download it from the official website or install it using a package manager: [yarnpkg.com](https://yarnpkg.com/getting-started/install)
-   Docker:  Install Docker on your system. You can download it from the official website: [docker.com](https://www.docker.com/)

## To get started with the project, follow these steps:

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies: 
    - `yarn install`
4. Run Docker container:
    - `docker compose up`
5. Start server:
    - `yarn start:dev`

## Routes
- The application is now running on http://localhost:2000.
- This endpoint allows based on specified filters and sorting options.

##### URL: `/api/drivers`

##### Method: `GET`

###### Query Parameters

-   `year` (optional): Filter drivers by the year they participated.
-   `nationality` (optional): Filter drivers by their nationality.
-   `searchString` (optional): Search for drivers by name or any other string.
-   `points` (optional): Filter drivers by their total points.
-   `position` (optional): Filter drivers by their finishing position.
-   `page` (optional): Specify the page number for paginated results. Default is 1.
-   `limit` (optional): Specify the number of drivers to return per page. Default is 10.
-   `sortBy` (optional): Specify the field to sort the drivers by. Allowed values: "year", "points", "position", "time".
-   `sortOrder` (optional): Specify the sort order. Allowed values: "asc", "desc".

##### URL: `/api/fastest-laps`

##### Method: `GET`

###### Query Parameters

-   `year` (optional): Filter fastest laps by the year of the race.
-   `grandPrix` (optional): Filter fastest laps by the name of the Grand Prix.
-   `driver` (optional): Filter fastest laps by the driver's name.
-   `car` (optional): Filter fastest laps by the car used.
-   `page` (optional): Specify the page number for paginated results. Default is 1.
-   `limit` (optional): Specify the number of fastest laps to return per page. Default is 10.
-   `sortBy` (optional): Specify the field to sort the fastest laps by. Allowed values: "year", "grandPrix", "driver".
-   `sortOrder` (optional): Specify the sort order. Allowed values: "asc", "desc".

##### URL: `/api/races`

##### Method: `GET`

###### Query Parameters

-   `year` (optional): Filter races by the year they took place.
-   `grandPrix` (optional): Filter races by the name of the Grand Prix.
-   `winner` (optional): Filter races by the name of the winner.
-   `car` (optional): Filter races by the car used.
-   `page` (optional): Specify the page number for paginated results. Default is 1.
-   `limit` (optional): Specify the number of races to return per page. Default is 10.
-   `sortBy` (optional): Specify the field to sort the races by. Allowed values: "year", "grandPrix", "laps", "time".
-   `sortOrder` (optional): Specify the sort order. Allowed values: "asc", "desc".

##### URL: `/api/teams`

##### Method: `GET`

###### Query Parameters

-   `year` (optional): Filter teams by the year they participated.
-   `position` (optional): Filter teams by their position.
-   `name` (optional): Filter teams by name.
-   `page` (optional): Specify the page number for paginated results. Default is 1.
-   `limit` (optional): Specify the number of teams to return per page. Default is 10.
-   `sortBy` (optional): Specify the field to sort the teams by. Allowed values: "year", "position", "points".
-   `sortOrder` (optional): Specify the sort order. Allowed values: "asc", "desc".