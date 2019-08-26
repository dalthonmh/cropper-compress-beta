# CROPPER-COMPRESS

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)]()

Cropper-compress es una herramienta web de compresión y recorte de imágenes desde el lado del cliente.

## Requerimientos o Dependencias
- [JIC](https://github.com/brunobar79/J-I-C) - brunobar79
- [cropperjs](https://github.com/fengyuanchen/cropperjs) - fengyuanchen
- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression) - Donaldcwl

## Características
- Reduce peso de imagen mediante input range o number
- Muestra tamaño actual y despues de algun recorte de la imagen en pixeles
- Recorte de imagen
- Recortes recursivos de una misma imagen

## Empezando

### Instalación
Primero instalar el paquete mediante:
```sh
$ git clone https://gitlab.com/D4ITON/cropper-compress
```
luego referenciar los archivos con los enlaces:
```sh
<link  href="/path/to/cropper-compress.css" rel="stylesheet">
<script src="/path/to/cropper-compress.js"></script>
```

### Funcionamiento
Al cargar una imagen, automaticamente tendrá su peso reducido y se podrá ajustar mediante un slider la calidad. Luego de cambiar esta se podrá enviar a un servidor mediante axios.

### Funcionalidades
- **Tipo de recorte**
 Muestra las opciones de recorte disponibles.
  - Libre
  - Rectangular
  - Cuadrado
  - Circular

- **Dimensiones** 
 Muestra el alto y ancho de la imagen, se actualiza cuando ya hay un recorte

- **Opciones**
     - Cancelar:  Se habilita cuando esta en modo recorte, cancela la previsualización del recorte
     - Subir :  Sube directamente la imagen al servidor
     - Cortar :  Hace el recorte de la imagen, esta solo se activa cuando un modo de recorte esté activo.

    
- **Información de imagen**
 Botón que se activa para mostrar la calidad de la imagen

     - Calidad: entero, valores 1 - 99
     - Peso inicial: Muestra tamaño de la imagen cuando esta se carga
     - Peso final: Valor que se actualiza cuando el se varía la calidad
     - % Peso reducido: Porcentaje (100 * pesoFinal / pesoInicial)

    > Nota: la calidad solo se podrá variar cuando la imagen no tenga partes transparentes

### Versión
1.0.4