# csc337_final_project

## Deploying the Project on Vercel

To deploy this project on Vercel, follow these steps:

1. **Fork the Repository**: Fork the repository to your own GitHub account.

2. **Clone the Repository**: Clone the forked repository to your local machine.

3. **Install Dependencies**: Navigate to the project directory and install the necessary dependencies for both the backend and frontend.

   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

4. **Create a `.env` File**: In the root of the project, create a `.env` file to store environment variables, including the MongoDB URI.

   ```bash
   touch .env
   ```

   Add the following line to the `.env` file:

   ```bash
   MONGODB_URI=your_mongodb_uri_here
   ```

5. **Update API Endpoints**: Ensure that the API endpoints in `frontend/js/main.js` are updated to use the Vercel deployment URL instead of `localhost`.

6. **Add `vercel.json` Configuration**: Ensure that the `vercel.json` file is present in the root of the project to define the build and output settings for Vercel.

7. **Deploy on Vercel**: Log in to your Vercel account and import the project from your GitHub repository. Vercel will automatically detect the `vercel.json` configuration and deploy the project.

8. **Set Environment Variables on Vercel**: In the Vercel dashboard, go to the project settings and add the environment variable for the MongoDB URI.

   ```bash
   MONGODB_URI=your_mongodb_uri_here
   ```

9. **Access the Deployed Project**: Once the deployment is complete, you can access the project using the Vercel deployment URL.

## Setting Up Environment Variables

To set up environment variables for the project, follow these steps:

1. **Create a `.env` File**: In the root of the project, create a `.env` file.

   ```bash
   touch .env
   ```

2. **Add Environment Variables**: Add the necessary environment variables to the `.env` file. For example:

   ```bash
   MONGODB_URI=your_mongodb_uri_here
   ```

3. **Load Environment Variables**: Ensure that the environment variables are loaded in the backend by using the `dotenv` package. This is already set up in `backend/app.js`.

4. **Set Environment Variables on Vercel**: In the Vercel dashboard, go to the project settings and add the environment variables.

   ```bash
   MONGODB_URI=your_mongodb_uri_here
   ```

By following these steps, you can successfully deploy the project on Vercel and set up the necessary environment variables.
