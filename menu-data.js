// =====================================================================
//  MENÚ DE GIL'S RESTAURANT — edita aquí platillos y precios.
//  La página web y el menú digital leen este mismo archivo.
//  NOTA: precios y platillos son de EJEMPLO; confirmar con el restaurante.
// =====================================================================
window.GILS = {
  nombre: "Gil's",
  subtitulo: "Restaurant",
  desde: 1977,
  ciudad: "Gómez Palacio, Durango",
  direccion: "Av. Victoria 277, Zona Centro, Gómez Palacio, Dgo.",
  telefono: "871 715 1541",
  telefonoLink: "+528717151541",
  whatsapp: "528717151541",
  facebook: "https://www.facebook.com/share/1CpEditjZR/",
  horario: [
    ["Lunes a Sábado", "8:00 – 23:00"],
    ["Domingo", "8:00 – 17:00"]
  ],
  mapa: "https://www.google.com/maps/search/?api=1&query=Av.+Victoria+277+Centro+G%C3%B3mez+Palacio+Durango",

  categorias: [
    {
      id: "desayunos", nombre: "Desayunos", icono: "🍳",
      nota: "Todos los días hasta la 1:00 pm · Incluyen café de olla",
      items: [
        { n: "Huevos al Gusto", d: "Rancheros, a la mexicana o con chorizo; frijoles y tortillas", p: 85 },
        { n: "Machacado con Huevo", d: "Carne seca norteña, salsa de molcajete y tortillas de harina", p: 105, tag: "Favorito" },
        { n: "Chilaquiles Gil's", d: "Rojos o verdes, con crema, queso fresco y arrachera", p: 125, tag: "De la casa" },
        { n: "Menudo", d: "Sábado y domingo · con orégano, cebolla y chile", p: 95, tag: "Fin de semana" }
      ]
    },
    {
      id: "tacos", nombre: "Tacos", icono: "🌮",
      nota: "Tortilla de maíz hecha a mano · Orden de 5",
      items: [
        { n: "Asada al Carbón", d: "Res a las brasas, cebolla, cilantro y salsa de la casa", p: 110, tag: "Favorito" },
        { n: "Al Pastor", d: "Cerdo adobado al trompo con piña", p: 95 },
        { n: "Tripita Dorada", d: "Crujiente, con limón y salsa roja", p: 120 },
        { n: "Barbacoa Lagunera", d: "Res cocida lento, consomé incluido", p: 120 },
        { n: "Lengua", d: "Suave, bañada en salsa verde", p: 135 }
      ]
    },
    {
      id: "rancho", nombre: "Del Rancho", icono: "🥩",
      nota: "Cortes a la parrilla con frijoles charros, guacamole y tortillas",
      items: [
        { n: "Arrachera 300 g", d: "Marinada de la casa, cebollitas y chile toreado", p: 245, tag: "Favorito" },
        { n: "Rib Eye 400 g", d: "Corte grueso al carbón, término a tu gusto", p: 345 },
        { n: "Carne Asada Norteña", d: "Con queso asado, nopales y rajas", p: 215 },
        { n: "Parrillada Gil's (2 personas)", d: "Arrachera, chorizo, costilla, nopales, cebollitas y queso", p: 520, tag: "Para compartir" }
      ]
    },
    {
      id: "antojitos", nombre: "Antojitos", icono: "🌯",
      nota: "Masa recién hecha en comal",
      items: [
        { n: "Gorditas (3)", d: "Deshebrada, chicharrón, rajas con queso o frijol", p: 90 },
        { n: "Burro Percherón", d: "Tortilla grande, asada, frijol, queso y guacamole", p: 115 },
        { n: "Quesadilla de Harina", d: "Queso menonita y carne a elegir", p: 85 },
        { n: "Enchiladas Rojas", d: "Estilo Durango, con papa, zanahoria y queso", p: 110 }
      ]
    },
    {
      id: "bebidas", nombre: "Bebidas", icono: "🥤",
      nota: "",
      items: [
        { n: "Agua Fresca", d: "Horchata, jamaica o del día · 1 L", p: 40 },
        { n: "Refresco de Vidrio", d: "Coca-Cola, Fanta, Sidral y más", p: 35 },
        { n: "Café de Olla", d: "Con canela y piloncillo", p: 30 },
        { n: "Limonada / Naranjada", d: "Natural o mineral", p: 45 }
      ]
    },
    {
      id: "postres", nombre: "Postres", icono: "🍮",
      nota: "",
      items: [
        { n: "Flan Napolitano", d: "Receta de la casa desde 1977", p: 55 },
        { n: "Pay de Queso", d: "Con cajeta y nuez", p: 60 },
        { n: "Arroz con Leche", d: "Con canela y pasas", p: 45 }
      ]
    }
  ]
};
