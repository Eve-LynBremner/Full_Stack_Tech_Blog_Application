# Full Stack Tech Blog Application

This application offers user-authenticated access to a Tech Blog. Once logged in, users can create, update, and delete their blogs. They can also browse and filter blog posts by category.

## Installation

Follow these steps to run the application locally:

### Clone the Repository
Clone the repository and navigate to project folder
```sh
git clone https://github.com/Eve-LynBremner/Full_Stack_Tech_Blog_Application.git
cd <project-folder>
```

### Set up Environment Variables
copy .env.example file and rename it .env. Update the environment variables within the .env file.


### Create the Database
Open MySQL by running this in the terminal:
```sh
mysql -u root -p
```

Enter your MySQL password when prompted, then create the database by running:
```sh
source db/schema.sql;
quit;
```

### Install Dependencies
Run the following command in the root directory to install dependencies:
```sh
npm install
```

### Seed the Database
Populate the database with sample data. Run the following command in the server directory:
```sh
npm run seed
```

### Start the Application
To run the application locally, run the following command in the root directory:
```sh
npm run start
```
Then view application at this browser link
```sh
http://localhost:3001
```

## Features

- Register
- Login
- View all posts or view posts by category
- Create your own post
- Update your own post
- Delete your own post
- Logout

## License

This project is licensed under the **MIT License**.

## Authors

Eve-Lyn Bremner

## Contact

https://github.com/Eve-LynBremner