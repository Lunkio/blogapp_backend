!!This is the Backend -part of this app. Front End-code can be found at https://github.com/Lunkio/blogapp_frontend

## Blog App

A blog app where users can login, add blogs and see other blogs which are added by other users. Only logged in users can use the app. User can only remove those blog posts that he/she has been adding. App contains also users -section, where you can browse all registered users and their blog posts.

### `How was this achieved?`

Application utilizes MongoDB for its database, JsonWebToken for token based authentication, React Redux and Redux-Thunk for managing the state, Semantic-UI-React for the layout and design and backend is made using NodeJS and express. Testing includes Cypress