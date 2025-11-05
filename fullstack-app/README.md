# README.md

# Fullstack Application

This is a fullstack application built with React for the frontend and FastAPI for the backend. 

## Project Structure

```
fullstack-app
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   └── App.tsx
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
└── backend
    ├── app
    │   ├── api
    │   ├── models
    │   └── main.py
    ├── requirements.txt
    └── README.md
```

## Getting Started

### Frontend

1. Navigate to the `frontend` directory.
2. Install dependencies using:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```

### Backend

1. Navigate to the `backend` directory.
2. Install dependencies using:
   ```
   pip install -r requirements.txt
   ```
3. Run the FastAPI application:
   ```
   uvicorn app.main:app --reload
   ```

## Contributing

Feel free to submit issues and pull requests. 

## License

This project is licensed under the MIT License.