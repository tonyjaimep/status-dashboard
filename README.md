# Monitor de Estatus de Réplicas de Servidor

Por José Antonio Jaime Padilla `215527145`

Ésta práctica utiliza Docker para correr un servidor web con 3 réplicas que 
escuchan solicitudes en los puertos 8080, 8081 y 8082.

## Monitor de Estatus

Utilizando React, se hacen solicitudes cada segundo para determinar el estatus de cada uno de los servicios web.

El endpoint `health` responde con el estatus del servicio, incluyendo el uso de CPU y memoria.

https://github.com/user-attachments/assets/f89d093f-a3c0-4868-8ae7-c36db3d6befb

