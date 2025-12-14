**Steps performed to create a Sweet 
Shop Management System**

**(1)** Created spring boot project in intellij idea and add dependencies like Spring Boot Dev Tools, Lombok, Spring Boot DevTools, Spring Data JPA, MySql Driver and Spring Web.

**(2)** Used the MVC design pattern to create project, firstly I added the model package, in this model package I added the BaseModel that have DataMembers like id of the model class that every model class is needed and other DataMembers like createdAt and updatedAt also added because this DataMembers needed to evey model class so we cane reuse this BaseModel using inheritance. 

**(3)** Added the two model class UserEntity and SweetEntity these entity have properties like username, email, password, what is the role of user means it is customer or admin for this I created enum class named as Role and in SweetEntity added properties like itemName, category, quantity and description.

**(4)** Created the repositories package and added the UserRepository and SweetRepository interface and added the code.

**(5)** Added some methods in SweetRepository like findByItemName, findByCategory and findByPrice these methods are used in controller also.

**(6)** Created the services package and added the SweetService class and all the CURD operations like add sweet, update sweet, etc. using the SweetRepository interface.

**(7)** Created the controllers pacakge and added the SweetController, in this controller added the route for adding the sweets as post method.

**(8)** In the SweetController added the get route for get the all sweets, get route for search the sweet by either sweetname or category or price range and for this @requestparam used.

**(9)** Then added the jwttoken and bcrypt library in the build.gardle where the bcrypt libray used for the encryption of password and jwttoken is for authentication.

**(10)** Implemented the JwtService for jwttoken and add the code.

**(11)** After that AuthControllers are implemented and used the UserRegistartionRequestDto,UserRegistartionResponseDto, UserLoginRequestDto and UserLoignResponseDto. 

**(12)** Added the adpters also that is used for the converting object to another object

**(13)** Added the configurations package and complete the springsecurity for basic configuration for example on which request admin only allow and all the requests are authenticated.

**(14)** Added the CorsConfig for connecting the frontend and backend using addCorsMappings.

Notes:
    models represents the tabel data you are adding and pojo class,
    services contain actual business logic,
    repositories contains database access logic,
    dtos used for api data transfer.