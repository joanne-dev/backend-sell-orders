# Prueba Fullstack para Melonn
Hola! 👋
Me alegra llegar hasta este punto de enviar la solución para la prueba técnica, es muy gratificante para mi realizar este tipo de retos. A continuación nombraré aspectos para tener en cuenta del desarrollo:

- **Diseño**. No soy diseñadora web pero intente hacer un diseño basandome en el diseño de melonn.
- **Datos**. Este dato internal order number: this field is calculated as follows: MSE + datetime-epoch + random number between 0 and 100, no lo logré entender muy bien, así que lo hice de esta forma Date.now() + Math.floor(Math.random() * (100 + 1)); 
  también el peso de cada producto no se especificó si era para cada producto o en su totalidad por la cantidad, asi que lo hice con su totalidad.

## Development server local
install dependencies: `npm i` then
run `npm start`  Navigate to `http://localhost:9021/`.
