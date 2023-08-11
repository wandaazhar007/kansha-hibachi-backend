# Website Backend API using Node.js and Express

Welcome to the Website Backend API repository! This project provides the backend functionality for a dynamic website, developed using Node.js, Express, and a selection of essential libraries. It's designed to handle authentication, data management, and various API endpoints to support your frontend application.

## Features

- Secure user authentication and password hashing using bcrypt.
- Efficient handling of cookies using cookie-parser.
- Cross-origin resource sharing (CORS) management for controlled data access.
- Environment variable configuration with dotenv for better security and flexibility.
- File upload support with express-fileupload.
- Session management using express-session for user persistence.
- JSON Web Token (JWT) authentication for API security.
- MySQL database connectivity and management using sequelize and mysql2.

## Technologies Used

- [Node.js](https://nodejs.org): Runtime environment for server-side JavaScript execution.
- [Express](https://expressjs.com): Fast, unopinionated, and minimalist web framework for Node.js.
- [bcrypt](https://www.npmjs.com/package/bcrypt): Hashing passwords for secure storage and authentication.
- [cookie-parser](https://www.npmjs.com/package/cookie-parser): Parse HTTP request cookies for easy management.
- [CORS](https://www.npmjs.com/package/cors): Cross-Origin Resource Sharing for controlled data access.
- [dotenv](https://www.npmjs.com/package/dotenv): Load environment variables from a .env file.
- [express-fileupload](https://www.npmjs.com/package/express-fileupload): Handle file uploads with ease.
- [express-session](https://www.npmjs.com/package/express-session): Session management for user persistence.
- [JSON Web Token (JWT)](https://jwt.io): Secure authentication method for transmitting information between parties.
- [mysql2](https://www.npmjs.com/package/mysql2): MySQL database connectivity for Node.js applications.
- [sequelize](https://sequelize.org): Promise-based Node.js ORM for MySQL database management.

## Getting Started

1. Clone this repository to your local machine.
2. Navigate to the project directory: `cd backend-api`.
3. Install the required dependencies: `npm install`.
4. Set up your MySQL database configuration in `config/config.json`.
5. Configure environment variables in a `.env` file.
6. Implement your routes and controllers in the `routes` and `controllers` directories.
7. Run the server: `npm start`.
8. The API will be accessible at: `http://localhost:3000`.

## Contributing

Contributions are welcome! Feel free to open a pull request or an issue if you find any bugs or want to suggest improvements.

## License

This project is licensed under the [MIT License].

---

Developed by [Wanda Azhar](https://github.com/wandaazhar007)
