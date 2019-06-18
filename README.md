# CROPPER-COMPRESS

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)]()

Cropper-compress es una herramienta web de compresión y recorte de imágenes desde el lado del cliente.

## Requirements or Dependencies
- [JIC](https://github.com/brunobar79/J-I-C) - brunobar79
- [cropperjs](https://github.com/fengyuanchen/cropperjs) - fengyuanchen
- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression) - Donaldcwl
## Features
- Reduce tamaño de imagen 
- Recorte de imagen en forma:
    - libre
    - rectangular
    - cuadrado
    - circular
## Getting started

### Installation

```sh
$ git clone https://gitlab.com/D4ITON/cropper-compress
```
en navagador
```sh
<link  href="/path/to/cropper-compress.css" rel="stylesheet">
<script src="/path/to/cropper-compress.js"></script>
```
### Usage
Selecciona una imagen y puedes directamente presionar el boton enviar, la imagen ya estará reducida en peso, cabe resaltar que estará en formato base 64.

### Options
- **tipo de recorte**
 Esta muestra las opciones de recorte disponibles.
 nota: con doble click cambias la el modo de arrastre del puntero, tenemos para mover la imagen o para seleccionar área a recortar.
- **opciones** 
    - Cancelar :  Se habilita cuando esta en modo recorte, cancela la previsualización del recorte
    - Subir :  Sube directamente la imagen al servidor
    - Cortar :  Hace el recorte de la imagen, esta solo se activa cuando un modo de recorte esté activo.
- **información de imagen**
 Solo se muestra cuando una imagen esta en formato jpg, jpeg, o png pero si no tiene partes transparentes.
    - calidad: muestra la calidad de imagen en porcenteaje del 1 al 99, donde si esta 1 porciento la imagen pesará menos pero a la vez tendrá una muy baja resolución, y visceversa.
    - peso inicial: peso original de la imagen.
    - peso final: peso que se actualiza cuando se cambia la calidad de la imagen desde el parametro de entrada (input range o input text).
    - % Peso reducido: muestra el porcentaje de calidad de la imagen.

### Version
1.0.0