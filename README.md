**Steps performed to create a Sweet 
Shop Management System**

**(1)** Created spring boot project in intellij idea and add dependencies like Spring Boot Dev Tools, Lombok, Spring Boot DevTools, Spring Data JPA, MySql Driver and Spring Web.

**(2)** Used the MVC design pattern to create project, firstly I added the model package, in this model package I added the BaseModel that have DataMembers like id of the model class that every model class is needed and other DataMembers like createdAt and updatedAt also added because this DataMembers needed to evey model class so we cane reuse this BaseModel using inheritance. 

**(3)** Added the two model class UserEntity and SweetEntity these entity have properties like username, email, password, what is the role of user means it is customer or admin for this I created enum class named as Role and in SweetEntity added properties like itemName, category, quantity and description.

**(4)** Created the repositories package and added the UserRepository and SweetRepository interface and added the code.

**(5)** Added some methods in SweetRepository like findByItemName, findByCategory and findByPrice these methods are used in controller also.

**(6)** Created the services package and added the SweetService class and all the CURD operations like add sweet, update sweet, etc. using the SweetRepository interface.

**(7)** Created the controllers pacakge and added the SweetController, in this controller added the route for adding the sweets as post method.