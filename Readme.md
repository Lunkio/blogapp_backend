!!This is the Backend -part of this app. Front End-code can be found at https://github.com/Lunkio/blogapp_frontend

## Blog Manager

A blog managing application, where users can login, add blogs, like and comment them. Only logged in users can use the application. Users can only remove their own blogs. Application contains also a section, where users can browse all the registered users and the amount of blogs a certain user has added.

### `How was this achieved?`

Application utilizes MongoDB for its database, JSON Web Token for token based authentication when adding and deleting blogs, React Redux and Redux-Thunk for managing the state, Semantic-UI-React for the layout and design. Backend is made using NodeJS and Express. Front End testing utilizes Enzyme and Cypress. Backend testing uses Jest and Supertest -library.

### `Challenges`

Goal of this project was to create an application that separates the application state from the React components and React only focuses on generating the views. Redux, its actions and reducers are taking care of the state. UseState -hook is used only once, for setting the 'view' -state.