/**
 * Design plan for the Salsa Studio Manager.
 *
 * Three Stitch projects, one per design flow, each holding the screens listed
 * below. `scripts/generate-designs.mjs` reads this plan, creates the projects,
 * attaches DESIGN.md as the project design theme, and generates every screen.
 *
 * Screen copy is in Spanish (the product language). This document is in English.
 */

/** Shared preamble prepended to every screen prompt. */
export const BASE_PROMPT = `Aplicación web de gestión de un estudio de salsa (reservas, calendario, alumnos y facturación). Pantalla de escritorio de 1440px con densidad de producto real, no una maqueta de presentación.

Sistema de diseño: lienzo #FAF7F4, tarjetas blancas #FFFFFF con borde de 1px #E8E2DC y radio 14px. Texto principal #161311, texto secundario #6B625C. Color de acción terracota #C2410C (hover #E0561F) con relleno suave #FDE8DD. Teal #0F766E sobre #CCFBF1 para estados correctos (pagado, presente, confirmada). Ámbar #B45309 sobre #FEF3C7 para avisos (pendiente, pocas plazas, retraso). Rojo #B91C1C sobre #FEE2E2 para errores (vencida, ausente, cancelada). Tipografía Outfit para títulos y cifras grandes, Inter para el resto, con cifras tabulares en horas, precios y ocupación. Botones de 44px de alto con radio 10px; campos de formulario de 44px con radio 6px. Sin degradados, sin glassmorphism, sin sombras negras, sin esquinas exageradas.

App shell obligatorio: barra lateral izquierda de 240px con el logotipo «Estudio Salsa» y las opciones Inicio, Calendario, Clases, Alumnos, Facturación y Ajustes, cada una con icono y etiqueta, y la opción activa con fondo #FDE8DD y texto #C2410C; barra superior de 64px con el título de la página, un buscador, la campana de notificaciones y el avatar del usuario; el contenido sobre #FAF7F4 con 32px de margen y un ancho máximo de 1280px.

Usa español de España en todas las etiquetas, textos y datos, con contenido realista: nombres de personas, salas y clases, importes en euros, fechas en formato dd/mm/aaaa y horas en formato de 24 horas.`;

export const projects = [
  {
    key: "access",
    dir: "01-acceso-y-usuarios",
    title: "Salsa Studio Manager - Acceso y usuarios",
    summary: "Login, student sign-up, password recovery, and the three role-aware home screens plus profile settings.",
    screens: [
      {
        id: "01-inicio-sesion",
        title: "Inicio de sesión",
        prompt: `Pantalla de inicio de sesión SIN app shell, con diseño partido. Mitad izquierda (45%): fotografía documental de un estudio de baile con suelo de madera y luz cálida, cubierta por un velo #322C28 al 55%, y sobre ella el logotipo y el lema «Tu estudio de salsa, en orden» en Outfit blanco. Mitad derecha (55%) sobre #FAF7F4: tarjeta blanca centrada de 420px con el título «Inicia sesión», el subtítulo «Gestiona tus clases, tus alumnos y tu facturación», los campos Correo electrónico y Contraseña (este último con icono de mostrar), la fila con la casilla «Recordarme» a la izquierda y el enlace «¿Olvidaste tu contraseña?» a la derecha en #C2410C, el botón primario a ancho completo «Entrar», un separador con la palabra «o», el botón secundario «Entrar con Google» y al pie «¿Aún no eres alumno? Crea tu cuenta». Muestra un estado de error: el campo Contraseña con borde rojo, fondo #FEE2E2 y el mensaje «La contraseña no es correcta».`,
      },
      {
        id: "02-registro-alumno",
        title: "Registro de alumno",
        prompt: `Pantalla de registro de alumno SIN app shell, con el mismo diseño partido que la pantalla de inicio de sesión (panel de marca fotográfico a la izquierda, formulario a la derecha). La tarjeta blanca de 420px contiene el título «Crea tu cuenta de alumno» y el subtítulo «Empieza hoy y reserva tu primera clase», los campos Nombre, Apellidos, Correo electrónico y Teléfono con prefijo +34, el campo Contraseña con un medidor de seguridad de cuatro segmentos donde tres están rellenos y la etiqueta «Seguridad: alta», la casilla marcada «Acepto las condiciones y la política de privacidad», el botón primario a ancho completo «Crear cuenta» y al pie, separada por una línea, la frase «¿Eres profesor o administrador?» con el enlace «Solicita acceso» en #C2410C.`,
      },
      {
        id: "03-recuperar-contrasena",
        title: "Recuperar contraseña",
        prompt: `Pantalla de recuperación de contraseña SIN app shell, con el mismo panel de marca fotográfico a la izquierda. A la derecha, muestra DOS tarjetas blancas de 420px lado a lado para representar el flujo completo en una sola imagen. Tarjeta A, estado inicial: un icono circular #FDE8DD con un candado, el título «Recupera tu contraseña», el texto «Te enviaremos un enlace para crear una nueva», el campo Correo electrónico relleno con lucia.moreno@example.com y el botón primario a ancho completo «Enviar enlace». Tarjeta B, estado confirmado: un icono circular teal con una marca de verificación, el título «Revisa tu correo», el texto «Hemos enviado el enlace a lucia.moreno@example.com. Caduca en 30 minutos», el botón secundario «Reenviar en 45 s» deshabilitado y el enlace «Volver al inicio de sesión» en #C2410C.`,
      },
      {
        id: "04-inicio-alumno",
        title: "Inicio - alumno",
        prompt: `Pantalla de inicio para el rol ALUMNO con app shell y la opción Inicio activa. Cabecera de página «Hola, Lucía» con el subtítulo «Tienes 3 clases reservadas esta semana». Bloque principal: tarjeta ancha «Tu próxima clase» con la etiqueta de estilo «Salsa en línea», el nombre de la clase «Salsa Intermedio», la píldora de nivel «Intermedio», el profesor «Marcos Delgado» con su avatar, la sala «Sala 1», la fecha «martes, 13/10/2026» y el horario «19:30 - 21:00» en cifras tabulares grandes, una cuenta atrás «en 2 días», el botón primario «Ver clase» y el botón secundario «Añadir al calendario». Debajo, la sección «Tu semana» con cinco tarjetas de día de lunes a viernes, cada una con el día abreviado, la fecha y la clase reservada o el texto «Libre» en gris. A la derecha, una tarjeta con un anillo de progreso terracota que marca 6 de 10, la cifra «6 de 10» en Outfit, la etiqueta «Clases del bono» y el botón «Comprar bono». Última fila con dos tarjetas: «Siguiente pago», con «Cuota mensual» y «79,00 €» y la fecha «01/11/2026»; y «Últimas facturas», con dos filas (V-2026-0184 del 01/10/2026 por 79,00 € con píldora Pagada, y V-2026-0171 del 01/09/2026 por 79,00 € con píldora Pagada) y el enlace «Ver todas».`,
      },
      {
        id: "05-inicio-profesor",
        title: "Inicio - profesor",
        prompt: `Pantalla de inicio para el rol PROFESOR con app shell y la opción Inicio activa. Cabecera «Buenas tardes, Marcos» con el subtítulo «Hoy tienes 4 clases, 6,5 horas de clase». Columna principal: tarjeta «Agenda de hoy» con cuatro filas, cada una con la hora en cifras tabulares (11:00, 17:00, 19:30 y 21:00), el nombre de la clase, la sala, la ocupación «12/16» y una píldora de estado (Confirmada en teal, Lista de espera en azul, Falta pasar lista en ámbar). La fila de las 19:30 aparece expandida como tarjeta destacada con el nombre «Salsa Avanzado», la lista de tres avatares de alumnos, el botón primario «Pasar lista» y el botón secundario «Ver alumnos». Columna derecha: tres tarjetas de métrica apiladas, «Horas esta semana» con la cifra 18,5 y un chip de variación +2,5 en teal, «Alumnos distintos» con 42 y «Listas sin cerrar» con 2 en ámbar. Al pie de la columna derecha, tarjeta «Acciones rápidas» con los botones «Crear clase», «Ver mi semana» y «Editar disponibilidad».`,
      },
      {
        id: "06-inicio-administracion",
        title: "Inicio - administración",
        prompt: `Pantalla de inicio para el rol ADMINISTRACIÓN con app shell y la opción Inicio activa. Cabecera «Resumen del estudio» con un selector de periodo que muestra «Octubre 2026». Fila de cuatro tarjetas de métrica: «Clases este mes» con 184 y chip +12 en teal; «Reservas» con 1.247 y chip +8 % en teal; «Ingresos del mes» con 14.320 € y chip +5 % en teal; «Facturas pendientes» con 3.180 € y chip -0,4 % en rojo. Segunda fila, a la izquierda, tarjeta «Semana en curso» con un calendario compacto de siete columnas donde cada día tiene el número, el día de la semana y barras horizontales proporcionales al número de clases; a la derecha, tarjeta «Requiere atención» con tres filas, cada una con su píldora y un enlace «Resolver»: «Factura V-2026-0179 vencida hace 6 días» con píldora Vencida en rojo, «Clase del jueves 20:00 sin profesor asignado» con píldora Sin asignar en ámbar, y «Conflicto de sala el sábado de 18:00 a 19:30» con píldora Conflicto en rojo. Al pie, tarjeta «Acciones rápidas» con los botones «Crear clase», «Nueva factura» e «Invitar profesor».`,
      },
      {
        id: "07-perfil-y-ajustes",
        title: "Perfil y ajustes",
        prompt: `Pantalla de perfil y ajustes con app shell y la opción Ajustes activa. Cabecera de perfil a ancho completo: avatar de 64px con las iniciales «LM» sobre #FDE8DD, el nombre «Lucía Moreno», la píldora de rol «Alumno» en #FDE8DD, el correo lucia.moreno@example.com y el teléfono +34 612 345 678, con el botón secundario «Cambiar foto» a la derecha. Debajo, navegación por pestañas «Perfil», «Seguridad», «Notificaciones» y «Membresía», con «Perfil» activa mediante un subrayado terracota. Columna izquierda, tarjeta «Datos personales» con los campos Nombre, Apellidos, Correo electrónico, Teléfono, Fecha de nacimiento, un select Nivel con «Intermedio» seleccionado (opciones Principiante, Intermedio, Avanzado) y un select Preferencia de estilo con «Salsa en línea» seleccionado (opciones Salsa en línea, Salsa cubana, Bachata), y al pie los botones «Guardar cambios» (primario) y «Descartar» (fantasma). Columna derecha, tarjeta «Membresía» con «Plan Mensual Ilimitado», el precio «79,00 €/mes», un anillo de progreso con «6 de 10» y la etiqueta «Clases del bono», el texto «Se renueva el 01/11/2026» y los enlaces «Cambiar plan» y «Cancelar suscripción»; debajo, tarjeta «Notificaciones» con dos interruptores activados, «Recordatorio 24 h antes por correo» y «Aviso de plaza libre en lista de espera».`,
      },
    ],
  },
  {
    key: "calendar",
    dir: "02-calendario-y-clases",
    title: "Salsa Studio Manager - Calendario y clases",
    summary: "Month and week calendar, class detail and booking, student bookings, the create-class-by-hours builder, availability editor, roster and attendance, and the teacher week.",
    screens: [
      {
        id: "01-calendario-mes",
        title: "Calendario - mes",
        prompt: `Pantalla de calendario con app shell y la opción Calendario activa. Cabecera de página «Calendario» con el selector de periodo «Octubre 2026» flanqueado por botones de flecha. Barra de filtros: un segmentado Mes / Semana / Día con Mes activo, los selects Sala (todas), Profesor (todos), Nivel (todos) y un buscador de clase. Cuadrícula mensual de siete columnas con la cabecera de días de lunes a domingo: cada celda de día tiene el número y hasta tres chips compactos de clase; el día de hoy está marcado con el número en blanco sobre un círculo terracota. Chips de ejemplo: «19:30 Salsa Intermedio · Sala 1 · 12/16», «18:00 Bachata Iniciación · Sala 2 · 8/12», «20:30 Salsa Avanzado · Sala 1 · 5/10», y una línea «+2 más» en #C2410C. Los chips usan relleno suave por nivel con una barra de acento de 4px a la izquierda. A la derecha de la cuadrícula, una barra lateral de 320px con dos tarjetas: «Listas de espera» con tres alumnos y su clase, y «Sin asignar» con dos clases que no tienen profesor. El botón primario «Crear clase» está destacado en la cabecera de la página.`,
      },
      {
        id: "02-calendario-semana",
        title: "Calendario - semana",
        prompt: `Vista semanal del calendario con app shell y la opción Calendario activa. Misma barra de filtros y cabecera que el mes, con el segmentado Semana activo y el rango «12 - 18 de octubre de 2026». Cuadrícula horaria: columna de horas a la izquierda de 07:00 a 23:00 con filas de 56px y líneas finas #E8E2DC, y siete columnas de día con la cabecera pegajosa mostrando el día y la fecha. Cada clase es un bloque posicionado en su hora exacta y con altura proporcional a su duración (1 h, 1,5 h o 2 h), con relleno suave por nivel y una barra de acento de 4px a la izquierda, y dentro el horario «19:30 - 21:00», el nombre de la clase, la sala, el profesor y la ocupación «12/16». Añade una línea horizontal terracota con un punto que marca la hora actual, y un bloque seleccionado con borde terracota de 2px que muestra un asa de arrastre en el borde superior. Incluye un hueco libre visible de 12:00 a 17:00 con un botón fantasma «+ Añadir clase» que aparece en la columna del miércoles. Al pie, una leyenda con los colores de nivel: Principiante, Intermedio y Avanzado.`,
      },
      {
        id: "03-detalle-clase",
        title: "Detalle de clase y reserva",
        prompt: `Pantalla de detalle de una clase con app shell y la opción Calendario activa. El calendario semanal permanece visible al fondo, atenuado al 40%, y sobre él se abre un panel lateral derecho de 480px con sombra de modal. El panel contiene: la etiqueta «Salsa en línea», el título «Salsa Intermedio» y la píldora de nivel; una tarjeta de profesor con avatar, nombre «Marcos Delgado», la etiqueta «Profesor» y el enlace «Ver perfil»; una lista de datos con iconos para Sala «Sala 1», Fecha «martes, 13/10/2026», Horario «19:30 - 21:00» en cifras tabulares, Duración «1,5 h» y Nivel «Intermedio»; una descripción de dos líneas sobre el contenido de la clase; una tarjeta de precio que contrasta «Clase suelta 15,00 €» con «Con bono 1 crédito» y el texto «Te quedan 6 créditos»; una barra de ocupación que muestra «12 de 16 plazas» con 4 libres en ámbar y la etiqueta «Pocas plazas»; el botón primario a ancho completo «Reservar clase», el botón secundario «Entrar en lista de espera» y el botón fantasma «Añadir a mi calendario»; y al pie, la nota «Cancelación gratuita hasta 4 horas antes».`,
      },
      {
        id: "04-mis-reservas",
        title: "Mis reservas",
        prompt: `Pantalla «Mis reservas» para el rol alumno con app shell y la opción Clases activa. Cabecera «Mis reservas» con el subtítulo «6 créditos disponibles» y el botón primario «Reservar clase». Fila de tres tarjetas pequeñas de resumen: «Próximas 3», «Créditos 6 de 10» con un mini anillo de progreso y «Lista de espera 1». Columna principal: lista «Próximas clases» agrupada por semana («Esta semana» y «Próxima semana») donde cada fila tiene la fecha y el día a la izquierda, el nombre de la clase, el profesor y la sala en el centro, el horario en cifras tabulares, una píldora de estado (Confirmada en teal o Lista de espera en azul) y a la derecha los botones compactos «Reprogramar» y «Cancelar». Debajo, la lista «Clases pasadas» con tres filas atenuadas, cada una con la fecha, el nombre de la clase y una píldora de asistencia: Presente en teal, Ausente en rojo y Retraso en ámbar, más el enlace «Ver detalle». Columna derecha, tarjeta «Resumen de asistencia» con una barra apilada que muestra 18 presentes, 2 retrasos y 1 ausencia sobre 21 clases, y el texto «86 % de asistencia».`,
      },
      {
        id: "05-crear-clase",
        title: "Crear clase por horas",
        prompt: `Constructor de clases con app shell y la opción Calendario activa. Cabecera «Nueva clase» con el botón fantasma «Cancelar» y el botón primario «Crear clase» a la derecha. Diseño de dos columnas: a la izquierda, un panel de 720px con el formulario seccionado por encabezados de sección y separado por líneas finas. Sección «Qué clase»: el campo Título de la clase con «Salsa Intermedio», el select Estilo (Salsa en línea), el select Nivel (Intermedio) y el campo Descripción. Sección «Cuándo»: el campo Fecha con «martes, 13/10/2026» y un calendario desplegable compacto, el select Hora de inicio con «19:30», y el componente clave, un selector de Duración construido como un paso por bloques de hora con los segmentos «1 h», «1,5 h» (activo en terracota) y «2 h» y el enlace «Personalizado», con una barra de vista previa debajo que dibuja el bloque proporcional y muestra las etiquetas «19:30» y «21:00» en los extremos. Sección «Dónde y quién»: el select Sala (Sala 1) y el select Profesor (Marcos Delgado) con su avatar. Sección «Aforo y precio»: el campo Plazas (16), el campo Precio por clase suelta (15,00 €) y el campo Créditos de bono (1). Sección «Repetición»: un grupo de opciones con «No se repite» seleccionada y «Semanal» con los días de la semana como botones de letra. A la derecha, una columna de 380px con una tarjeta «Vista previa en el calendario» que dibuja el bloque como aparecerá, con el horario, el nombre, la sala, el profesor y «0/16 plazas»; debajo, el aviso «Sin conflictos detectados» con icono teal; y al pie de la columna, la tarjeta de resumen con las líneas «Duración 1,5 h», «Plazas 16» y «Precio 15,00 €» y un botón secundario «Guardar como plantilla».`,
      },
      {
        id: "06-editor-disponibilidad",
        title: "Editor de disponibilidad",
        prompt: `Pantalla de disponibilidad con app shell y la opción Calendario activa. Cabecera «Disponibilidad» con el subtítulo «Define cuándo pueden programarse clases» y dos selectores en la barra de herramientas: Profesor con «Marcos Delgado» (con avatar) y Sala con «Todas las salas». Contenido principal: una cuadrícula semanal de siete columnas de lunes a domingo y filas horarias de 10:00 a 23:00, donde las franjas disponibles aparecen como bloques rellenos de #FDE8DD con el borde terracota y un asa de redimensionado, las franjas cerradas están sombreadas en gris claro, y las franjas ya ocupadas por una clase aparecen en blanco con una etiqueta pequeña que nombra la clase. Muestra el total de horas disponibles de cada día en la cabecera de la columna, por ejemplo «6 h», «8 h» o «—» para el día cerrado del domingo. Columna derecha de 360px: tarjeta «Resumen» con «32 h disponibles por semana», «6,5 h ya programadas» y «25,5 h libres» en cifras tabulares grandes; tarjeta «Excepciones» con una lista de dos fechas bloqueadas, «01/11/2026 - Festivo» y «24/12/2026 - Cierre», cada una con un icono de papelera; y al pie, los botones «Copiar esta semana a todas» (secundario) y «Guardar disponibilidad» (primario).`,
      },
      {
        id: "07-lista-y-asistencia",
        title: "Lista de clase y asistencia",
        prompt: `Pantalla de lista y control de asistencia para el rol profesor con app shell y la opción Clases activa. Cabecera con el nombre de la clase «Salsa Intermedio», la píldora de nivel, y debajo la línea de datos con «martes, 13/10/2026», «19:30 - 21:00», «Sala 1» y «12 de 16 plazas», en cifras tabulares. Barra de herramientas con el contador «12 alumnos», un buscador de alumno, el botón secundario «Añadir alumno» y el botón primario «Cerrar lista». Tabla de alumnos con la cabecera ALUMNO / TIPO / PAGO / ASISTENCIA / NOTAS y doce filas: la columna ALUMNO con avatar, nombre y correo en texto pequeño; la columna TIPO con una píldora neutra que dice Bono o Suelta; la columna PAGO con la píldora Pagada en teal o Pendiente en ámbar; la columna ASISTENCIA con un grupo de tres botones compactos Presente, Retraso y Ausente donde la opción marcada está rellena de color; y la columna NOTAS con un icono para añadir nota. Dos filas muestran un estado: una con Ausente marcado en rojo y una con Retraso en ámbar. Al pie de la tabla, una barra de resumen con «Presentes 10 · Retrasos 1 · Ausencias 1», el botón secundario «Marcar todos presentes» y el botón primario «Guardar asistencia».`,
      },
      {
        id: "08-mi-semana-profesor",
        title: "Mi semana - profesor",
        prompt: `Pantalla «Mi semana» para el rol profesor con app shell y la opción Calendario activa. Cabecera «Mi semana» con el rango «12 - 18 de octubre de 2026» y el botón secundario «Editar disponibilidad». Fila de tres tarjetas de métrica: «Horas impartidas» con 18,5 h y chip +2,5 en teal; «Alumnos distintos» con 42; y «Horas libres» con 25,5 h en ámbar. Debajo, una vista semanal solo con las clases del profesor: siete columnas de día, filas horarias de 56px, los bloques de clase con su relleno por nivel y dentro el horario, el nombre de la clase y la ocupación, y los huecos libres entre clases resaltados con un fondo rallado suave y el texto «Libre» centrado. La columna del domingo aparece cerrada y sombreada con la etiqueta «No disponible». Al pie, una tarjeta «Puedo sustituir» con el texto «Acepto clases de otros profesores en mis horas libres» y un interruptor activado, junto al botón secundario «Marcar semana como completa».`,
      },
    ],
  },
  {
    key: "billing",
    dir: "03-facturacion",
    title: "Salsa Studio Manager - Facturacion",
    summary: "Public pricing, checkout, payment result, the student billing account, invoice detail, and the admin revenue dashboard, invoice list and manual payment entry.",
    screens: [
      {
        id: "01-tarifas",
        title: "Tarifas y bonos",
        prompt: `Página pública de tarifas SIN app shell, con una barra de navegación pública arriba (logotipo «Estudio Salsa», enlaces Clases, Tarifas, Profesores, Contacto y el botón primario «Reservar clase»). Cabecera centrada con el título «Elige cómo quieres bailar» y el subtítulo «Sin matrícula, cancela cuando quieras». Tres tarjetas de plan lado a lado: «Clase suelta» a 15,00 € con la unidad «por clase», una lista de tres ventajas (Acceso a cualquier nivel, Reserva online, Cancela hasta 4 h antes) y el botón secundario «Reservar suelta»; «Bono de 10 clases» a 120,00 € con la unidad «12,00 € por clase» y la píldora destacada «Más elegido» en terracota, la lista de ventajas (10 clases en 3 meses, Compartible con un acompañante, 1 clase de prueba gratis) y el botón primario «Comprar bono»; y «Mensual ilimitado» a 89,00 € con la unidad «al mes» y las ventajas (Todas las clases, Sin límite de reservas, Congela un mes al año) y el botón secundario «Suscribirme». Debajo, una tabla comparativa de cinco filas y cuatro columnas (Clase suelta, Bono 10, Mensual) con marcas de verificación y guiones. Al pie, una sección de preguntas frecuentes con tres filas desplegables, la primera abierta con la pregunta «¿Puedo cancelar mi suscripción cuando quiera?» y la respuesta «Sí, desde tu área de facturación y sin coste. Mantienes el acceso hasta el final del periodo pagado».`,
      },
      {
        id: "02-pago",
        title: "Pago",
        prompt: `Pantalla de pago SIN app shell, con un diseño de dos columnas sobre fondo #FAF7F4, una cabecera reducida con el logotipo y el enlace «Volver a tarifas», y una barra de progreso de tres pasos en la parte superior con «Carrito» y «Pago» completados y «Confirmación» como paso actual. Columna izquierda de 640px, tarjeta «Método de pago» con dos pestañas «Tarjeta» (activa) y «Domiciliación SEPA», y los campos Nombre del titular, Número de tarjeta mostrando «4242 4242 4242 4242» con los iconos de Visa y Mastercard a la derecha, una fila doble con Caducidad «12/28» y CVC «•••», la casilla marcada «Guardar esta tarjeta para futuros pagos», y debajo la sección «Datos de facturación» con el select Tipo de documento (Particular), el campo Nombre completo, NIF «12345678Z» y Dirección «Calle Bailén 14, 2º B, 28005 Madrid». Columna derecha de 400px, tarjeta «Resumen del pedido» con la línea «Bono de 10 clases» y «120,00 €», las líneas «Subtotal 120,00 €», «IVA (21 %) 25,20 €» y un total destacado «Total 145,20 €» en Outfit, un campo de código promocional con el botón «Aplicar», el botón primario a ancho completo «Pagar 145,20 €» y el aviso con candado «Pago seguro cifrado. No almacenamos los datos de tu tarjeta».`,
      },
      {
        id: "03-resultado-pago",
        title: "Resultado del pago",
        prompt: `Pantalla de resultado del pago SIN app shell, centrada sobre fondo #FAF7F4, que muestra el estado correcto y el estado de error en una sola imagen. Tarjeta principal centrada de 560px: icono circular teal de 72px con una marca de verificación, el título «¡Pago completado!» en Outfit, el texto «Ya puedes reservar tus clases con el bono», y un bloque de resumen de cuatro líneas separadas por líneas finas con Referencia «PED-2026-0184» en monoespaciada, Concepto «Bono de 10 clases», Importe «145,20 €» y Método «Visa •••• 4242», y una quinta línea con la fecha del próximo cargo «01/11/2026». Debajo, el botón primario «Reservar mi primera clase», el botón secundario «Descargar factura» y el botón fantasma «Ir a mi cuenta». A la derecha, muestra una tarjeta pequeña adicional con el estado de error para comparar: icono circular rojo con una equis, el título «No hemos podido procesar el pago», el texto «Tu tarjeta ha sido rechazada por el banco. No se ha realizado ningún cargo», y los botones «Reintentar pago» (primario) y «Usar otro método» (secundario).`,
      },
      {
        id: "04-mi-facturacion",
        title: "Mi facturación",
        prompt: `Pantalla «Mi facturación» para el rol alumno con app shell y la opción Facturación activa. Cabecera «Mi facturación» con el botón primario «Añadir método de pago». Fila superior con dos tarjetas. Tarjeta izquierda «Plan actual»: el nombre «Mensual Ilimitado», el precio «89,00 €/mes», un anillo de progreso terracota con «6 de 10» y la etiqueta «Clases del bono», las líneas «Se renueva el 01/11/2026» y «Próximo cargo 89,00 €», el interruptor activado «Renovación automática» y los enlaces «Cambiar plan» y «Cancelar suscripción». Tarjeta derecha «Método de pago»: una fila con el icono de Visa, «Visa •••• 4242» y «Caduca 12/28», con los enlaces «Editar» y «Eliminar», y debajo una fila con un icono de cuenta bancaria, «SEPA •••• 8891» marcado como «Principal», con la píldora Principal en teal. Debajo, tarjeta a ancho completo «Historial de facturas» con una barra de filtros (select Año 2026, select Estado Todas) y una tabla con las columnas NÚMERO / FECHA / CONCEPTO / IMPORTE / ESTADO / ACCIONES y seis filas: V-2026-0184 del 01/10/2026 por Mensual Ilimitado 89,00 € con píldora Pagada; V-2026-0171 del 01/09/2026 por Mensual Ilimitado 89,00 € con Pagada; V-2026-0158 del 01/08/2026 por Bono de 10 clases 120,00 € con Pagada; V-2026-0142 del 01/07/2026 por Mensual Ilimitado 89,00 € con Pagada; V-2026-0130 del 12/06/2026 por Clase suelta 15,00 € con Pendiente en ámbar; y V-2026-0118 del 01/06/2026 por Mensual Ilimitado 89,00 € con Pagada. Cada fila termina con un icono de descarga y el menú «⋯», y el número de factura va en monoespaciada.`,
      },
      {
        id: "05-detalle-factura",
        title: "Detalle de factura",
        prompt: `Pantalla de detalle de factura con app shell y la opción Facturación activa. Cabecera con el enlace «Volver a mis facturas», el título «Factura V-2026-0184» en Outfit, la píldora Pagada en teal y, a la derecha, el botón secundario «Enviar por correo» y el botón primario «Descargar PDF». Cuerpo centrado en una tarjeta blanca de 800px que reproduce el documento: cabecera superior dividida con el logotipo y los datos del emisor a la izquierda («Estudio Salsa S.L.», «CIF B-87654321», «Calle Bailén 14, 28005 Madrid», «hola@estudiosalsa.es») y a la derecha el bloque de factura con el número «V-2026-0184» en monoespaciada, la fecha de emisión «01/10/2026», la fecha de vencimiento «15/10/2026» y la referencia de pago «SEPA •••• 8891». Debajo, el bloque «Facturado a» con «Lucía Moreno», «NIF 12345678Z» y «Calle Bailén 14, 2º B, 28005 Madrid». Después, una tabla de líneas con las columnas DESCRIPCIÓN / CANTIDAD / PRECIO / IVA / TOTAL y dos filas, «Mensual Ilimitado · Octubre 2026» con 1, 73,55 €, 21 % y 89,00 €, y «Clase suelta extra» con 1, 12,40 €, 21 % y 15,00 €. Al pie del documento, alineado a la derecha, el resumen con «Subtotal 85,95 €», «IVA (21 %) 18,05 €» y el total en Outfit «Total 104,00 €». La fila de la primera línea aparece resaltada en #FDE8DD.`,
      },
      {
        id: "06-ingresos",
        title: "Panel de ingresos",
        prompt: `Panel de ingresos para el rol administración, con app shell y la opción Facturación activa. Cabecera «Ingresos» con un selector de periodo «Últimos 12 meses» y los botones secundarios «Exportar CSV» y «Nueva factura». Fila de cuatro tarjetas de métrica: «Ingresos recurrentes» con 8.340 € y chip +6,2 % en teal; «Ingresos del mes» con 14.320 € y chip +5,1 % en teal; «Pendiente de cobro» con 3.180 € y una píldora de tres facturas; y «Bajas» con 2,4 % y chip -0,3 % en teal. Segunda fila: a la izquierda, tarjeta grande «Evolución de ingresos» con un gráfico de barras de doce meses de noviembre de 2025 a octubre de 2026, las barras en terracota con el mes actual resaltado y el eje vertical con importes en miles de euros, más una leyenda que separa Suscripciones y Bonos y una línea de media. A la derecha, tarjeta «Reparto por plan» con un gráfico de anillo de tres segmentos (Mensual 58 %, Bono 27 % y Suelta 15 %) y su leyenda con los importes. Última fila: tarjeta «Deudores» con una tabla de cuatro alumnos (nombre, factura, importe y días de retraso con la píldora Vencida en rojo) y el enlace «Ver todas las facturas»; y tarjeta «Métodos de pago» con una barra apilada horizontal que reparte Tarjeta 64 %, SEPA 28 % y Efectivo 8 %, con la leyenda debajo.`,
      },
      {
        id: "07-facturas",
        title: "Facturas - administración",
        prompt: `Pantalla de gestión de facturas para el rol administración con app shell y la opción Facturación activa. Cabecera «Facturas» con el botón secundario «Exportar» y el botón primario «Nueva factura». Barra de filtros: un buscador de alumno o número, los selects Estado (Vencidas), Periodo (Últimos 3 meses) y Método (Todos), y el botón fantasma «Limpiar filtros». Una barra de acciones masivas visible con el texto «3 facturas seleccionadas» y los botones «Marcar como pagadas», «Reenviar» y «Anular». Tabla a ancho completo con las columnas con casilla de selección / NÚMERO / ALUMNO / CONCEPTO / EMITIDA / VENCIMIENTO / IMPORTE / ESTADO / ACCIONES y ocho filas con datos realistas: por ejemplo V-2026-0179 de Javier Ruiz por Clase suelta de 15,00 € emitida el 25/09/2026 con vencimiento 09/10/2026, píldora Vencida en rojo y la fila marcada con una barra roja de 3px a la izquierda; V-2026-0184 de Lucía Moreno por Mensual Ilimitado de 89,00 € con píldora Pagada en teal; V-2026-0186 de Ana Prieto por Bono de 10 clases de 120,00 € con píldora Pendiente en ámbar; y otras cinco filas combinando Pagada, Pendiente y Vencida con importes entre 15,00 € y 145,20 €. Los números van en monoespaciada, los importes alineados a la derecha con cifras tabulares y cada fila termina con un menú «⋯» cuyas opciones son Marcar como pagada, Reenviar por correo y Anular. Al pie, la paginación con «Mostrando 1 a 8 de 42 facturas» y los controles de página, más el total acumulado «Total filtrado 3.180 €» en negrita.`,
      },
      {
        id: "08-registrar-pago",
        title: "Registrar pago manual",
        prompt: `Modal «Registrar pago» abierto sobre la pantalla de facturas, que permanece visible al fondo atenuada al 45% con un velo #322C28. El modal es una tarjeta blanca de 560px centrada con radio 14px y sombra fuerte, con la cabecera «Registrar pago» y un icono de cerrar a la derecha, y una línea de contexto «Factura V-2026-0179 · Javier Ruiz · 15,00 €» en la que el importe aparece destacado. El cuerpo contiene el select Alumno con «Javier Ruiz» y su avatar, el campo Importe con «15,00 €», el selector Método de pago como un grupo de tres botones en fila con iconos (Efectivo seleccionado, Transferencia y Datafono), el campo Concepto con «Clase suelta 25/09/2026», un campo Fecha con «09/10/2026», el select Factura asociada con «V-2026-0179», la casilla marcada «Enviar recibo por correo» y la casilla sin marcar «Avisar también por WhatsApp», y un campo Notas. Al pie del modal, a la derecha, los botones «Cancelar» (fantasma) y «Registrar pago» (primario).`,
      },
    ],
  },
];

/** Flattened screen count, for logging. */
export const totalScreens = projects.reduce((n, p) => n + p.screens.length, 0);
