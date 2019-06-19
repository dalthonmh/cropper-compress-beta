/** 
 * CropperCompress v1.0.0
 */
window.onload = function(){
	'use strict';

	/** Variables globales */
	var source_image = document.getElementById('source_image');
  var result_image = document.getElementById('result_image');
  var containerImage = document.getElementById('containerImage');
  var URL = window.URL || window.webkitURL;
  var options;
  var fileImagen; // obtiene imagen para ser compresa
  var arrayImages;
  var middleImage; // esta tiene la imagen para ser procesada
  var image_cropped;
  var hasAlphaValue; // obtiene tranparencia de la imagenç
  var pesoInicialSize; // peso inicial variable para hacer calculos


  // Variables para interfaz
  var btnCancel = document.getElementById('btnCancel');
  var docs_buttons = document.querySelector('.docs-buttons');
  var docs_toggles = document.querySelector('.docs-toggles');
  var docs_advanced = document.querySelector('.docs-advanced');
  var dataHeight = document.getElementById('dataHeight');
  var dataWidth = document.getElementById('dataWidth');

  // Oculta opciones de edición de imagen solo deja seleccionar archivo
  docs_advanced.style.display = docs_buttons.style.display = docs_toggles.style.display = 'none';

  var uploadedImageName = 'cropped.jpg';
	var uploadedImageType = 'image/jpeg';


	// Initialize options de cropper
	options = {
		viewMode: 1,
		aspectRatio: NaN,
		ready: function (event) {
  			cropper.setDragMode("move");
  			cropper.clear();
        // console.log(getImageLive());
  		},
    crop: function (e){
        var data = e.detail;
        dataHeight.value = Math.round(data.height);
        dataWidth.value = Math.round(data.width);
      }
  	};
  	arrayImages = [source_image];

  	// cargar imagen
  	var inputImage = document.querySelector('#inputImage');
  	if (URL) {
  		inputImage.onchange = function(e){
        let pesoInicialShow = document.getElementById('pesoInicial');
  			let files = this.files;
  			let file;
        var input = e.target;
        var reader = new FileReader();
        var readerPng = new FileReader();
        fileImagen = files[0];

  			if (cropper && files && files.length) {
  				file = files[0];
          pesoInicialSize = (parseInt(file.size) / 1024).toFixed(3);
          pesoInicialShow.innerHTML = pesoInicialSize + " Kb";
  				if (/^image\/\w+/.test(file.type)) {
  					    uploadedImageType = file.type;
          		  uploadedImageName = file.name;
  					if (uploadedImageURL) {
	          			URL.revokeObjectURL(uploadedImageURL);
	          		}
	          		uploadedImageURL = URL.createObjectURL(file);

                // reader
                reader.onload = function(){
                  var image = new Image();

                  image.src = reader.result;
                  image.onload = function() {
                      console.log(image.width);
                      console.log(image.height);
                  };
                };

                reader.onloadend = function(){
                  middleImage = reader.result;

                  /** 
                   *  Muestra interfaz dependiendo del tipo de imagen con jpg se
                   *  muestra todo con png se muestra las opciones avanzadas pero 
                   *  no puede alterar la calidad.
                   *  formatos admitidos jpg, jpeg, png, gif, webp.
                   */

                  // detecta valor de file.type
                  docs_toggles.style.display = docs_buttons.style.display = 'block';
                  
                  if (file.type === 'image/jpg' || file.type === 'image/jpeg' || !hasAlphaValue) {
                    docs_advanced.style.display = 'block';
                  }
                  
                }

                // readerPng
                readerPng.onload = function(){
                  if(file.type === 'image/png'){
                    var arrayBuffer = readerPng.result;
                    hasAlphaValue = isTransparent(arrayBuffer).hasAlpha;
                  }
                };
                readerPng.readAsArrayBuffer(input.files[0]);
                

                if (file) {
                  reader.readAsDataURL(file);
                }

                source_image.src = uploadedImageURL; // esto muestra la imagen
	          		cropper.destroy();

	          		cropper = new Cropper(source_image, options);
	          		inputImage.value = null;
  				} else {
  					window.alert('Por favor escoje un archivo tipo imagen.');
  				}
  			}
  		}
  	} else {
  		inputImage.disabled = true;
  		inputImage.parentNode.className += ' disabled';
  	};

  // new cropper
  var cropper = new Cropper(source_image, options);
  var uploadedImageName = 'cropped.jpg';
  var uploadedImageType = 'image/jpeg';
  var uploadedImageURL;
  var cen;

  /** Funcionalidades checkbox */
  var activeAdvanced = document.getElementById('activeAdvanced');
  activeAdvanced.addEventListener("click", function (){
    resultImageMiddleImage();
  });
  // again click
  activeAdvanced.onclick = function (){

    let cen = activeAdvanced.checked; // guarda si esta checked o no
    let advanced = document.querySelector('.advanced');
    advanced.classList.toggle("d-none");
    var pesoFinal = document.querySelector('#pesoFinal');
    var quality = document.querySelector('#quality');
    var activeAdvancedMessage = document.querySelector('#activeAdvancedMessage');

    let inputRadio = document.querySelectorAll('input[type=radio]');
    

    if (cen) {
      activeAdvancedMessage.innerHTML = 'Listo'; 
      for (var item of inputRadio) {
        item.disabled = true;
      }
      /** Imagen recortada. */
      result_image.src = getImageLive().src; // esto se da como valor inicial
      var image = imageCompress(result_image); // compresion de imagen

      showResults(image);

      // Vanilla JS jic function when input range change
      inputRangeCalidad.onchange = function(){
          image = imageCompress(result_image);
          setImageLive(image.src); // esto actualiza la imagen a ser optimizada
          showResults(image);
      }

      inputNumberCalidad.addEventListener('input', function(){
          image = imageCompress(result_image);
          setImageLive(image.src); // esto actualiza la imagen a ser optimizada
          showResults(image);
      });
    }else{
      activeAdvancedMessage.innerHTML = 'Activar';
      for (var item of inputRadio) {
        item.disabled = false;
      }
    }
  }
  // muestra salida de datos
  function showResults(image){
    pesoInicialSize = parseFloat(pesoInicialSize);
    pesoFinal.innerHTML = image.size + " Kb";
    let variacionPeso = Math.abs(100 - parseInt(100 * image.size / pesoInicialSize));

    if (image.size <= pesoInicialSize) {
      quality.classList.add('text-success');
      quality.classList.remove('text-danger');
      quality.innerHTML = variacionPeso + " % " + "más pequeño";
    }else{
      quality.classList.add('text-danger');
      quality.classList.remove('text-success');
      quality.innerHTML = variacionPeso + " % " + "más grande";
    }
  }
  
  // Inicialización JIC
  var inputNumberCalidad = document.getElementById('inputNumberCalidad');
  var inputRangeCalidad = document.getElementById('inputRangeCalidad');
  var output_format = 'jpg'; // hay otros formatos

  // input range change
  inputNumberCalidad.value = inputRangeCalidad.value;
  inputRangeCalidad.addEventListener("change", function(){
      inputNumberCalidad.value = this.value;
  });

  // change value in edditing
  inputNumberCalidad.addEventListener("input", function () {
    inputRangeCalidad.value = this.value;
  });

  inputNumberCalidad.onchange = function(){
      let max = parseInt(this.getAttribute("max"));
      let min = parseInt(this.getAttribute("min"));
      if (this.value > max) {
          this.value = max;
      }
      else if (this.value < min) {
          this.value = min;
      }
  };
  btnCancel.disabled = true;
  dataHeight.disabled = dataWidth.disabled = true;
	// Opciones cropper
	var actions = document.getElementById('actions');
	actions.querySelector('.docs-toggles').onchange = function(event){
		var e = event || window.event;
	  	var target = e.target || e.srcElement;
	  	var data;
      var recorteRectangular, recorteCuadrado;
      var activeAdvanced = document.querySelector('#activeAdvanced');
	  	data = {
      		method: target.getAttribute('data-method')
      	}
      	switch (data.method) {
      		case 'libre':
      			options['aspectRatio'] = NaN;
      			cen = false;
            activeAdvanced.disabled = true;
            dataHeight.disabled = dataWidth.disabled = false;
            activaBotonCancel();
      			break;
          case 'rectangle':
            // options['aspectRatio'] = 16 / 9;
            options['aspectRatio'] = 13 / 3;
            cen = false;
            activeAdvanced.disabled = true;
            dataHeight.disabled = dataWidth.disabled = false;
            activaBotonCancel();
            recorteRectangular = true;
            break;
      		case 'cuadrado':
      			options['aspectRatio'] = 1 / 1;
      			cen = false;
            activeAdvanced.disabled = true;
            dataHeight.disabled = dataWidth.disabled = false;
            activaBotonCancel();
            recorteCuadrado = true;
      			break;
      		case 'circle':
      			options['aspectRatio'] = 1 / 1;
      			cen = true;
            activeAdvanced.disabled = true;
            dataHeight.disabled = dataWidth.disabled = false;
            activaBotonCancel();
            recorteCuadrado = true;
      			break;
      		default:
      			console.log('opcion no valida');
      			break;
      	}

        btnSaveUpload.style.color = '#1A73E8';
        btnSaveUpload.style.background = 'white';
        btnSaveUpload.style.fontWeight = 'bold';
        btnSaveUpload.innerHTML = 'Cortar';


      	options.ready = function(){
      		if (cen) viewCircle();
          image_cropped = getImageLive();
          if (recorteRectangular) {
            let datos = {"x":0,"y":0,"width":1300,"height":300,"rotate":0,"scaleX":1,"scaleY":1};
            cropper.setData(datos);
          }
          if (recorteCuadrado) {
            let datos = {"x":0,"y":0,"width":900,"height":900,"rotate":0,"scaleX":1,"scaleY":1};
            cropper.setData(datos);
          }
          console.log(cropper.crop().cropped);
      	};
      	// Restart
      	cropper.destroy();
      	return cropper = new Cropper(arrayImages[arrayImages.length-1], options);
	}

	// Methods cropper
  var recorte = false; // cuenta si se ha cortado
  /* btn saveUpload */
  var btnSaveUpload = document.getElementById('btnSaveUpload');
  btnSaveUpload.onclick = async function(){

   if (this.innerHTML === "Cortar") {
    this.innerHTML = "Subir";
    this.style.background = '#1A73E8';
    this.style.color = 'white';
    /* hacer el recorte */
    var croppedCanvas;
    croppedCanvas = cropper.getCroppedCanvas();
    if (cen) croppedCanvas = getRoundedCanvas(croppedCanvas);
    cropImageGenerator(croppedCanvas);
    resetRadio();
    btnCancel.disabled = true;
    dataHeight.disabled = dataWidth.disabled = true;
    recorte = true; // indica que ha habido almenos un recorte
   }
   else if(this.innerHTML === "Subir"  || this.innerHTML === "uno más"){
    /** Opcion subir
     *  despues de almenos un recorte
     */
    var image; // imagen a ser compresa
    var base64Output; // string de salida de imagen
    var formatoBase64; // verifica si tiene formato base 64

    // comparar si no tuvo recorte
    if (!recorte) {
      // compara si tiene tranparencia
      if (hasAlphaValue) {
      
        var options = { maxSizeMB: 1, maxWidthOrHeight: 720, useWebWorker: false }
        var output = await imageCompression(fileImagen, options);
        // blob to base64
        var reader = new FileReader();
         reader.readAsDataURL(output); 
         reader.onloadend = function() {
           base64Output = reader.result;
           isBase64(base64Output);
           formatoBase64 = base64Output.substr(0,10);
           muestraProgressBar(formatoBase64);
        }

      }else {
        // si no tiene tranparencia
        image = imageCompress(result_image);
        resultImageMiddleImage();
        base64Output = image.src;
        isBase64(base64Output);
        formatoBase64 = base64Output.substr(0,10);
        muestraProgressBar(formatoBase64);
      }
    }else{
      // si hubo recorte
      image = getImageLive();

      // si no tiene tranparencia (jpg)
      if (!hasAlphaValue) {
        image = imageCompress(image);
        isBase64(image.src);
        formatoBase64 = image.src.substr(0,10);
        muestraProgressBar(formatoBase64);
        // console.log(image.src);
        // // creacion de canvas
        // var canvas = document.createElement('canvas');
        // var ctx = canvas.getContext('2d');

        // var cw = canvas.width;
        // var ch = canvas.height;

        // var img = new Image();
        // img.onload = function(){
        //   ctx.drawImage(img, 0, 0);
        //   cw = image.img.naturalWidth;
        //   ch = image.img.naturalHeight;
        //   ctx.globalCompositeOperation='destination-in';
        //   ctx.beginPath();
        //   ctx.arc(cw/2,ch/2,ch/2,0,Math.PI*2);
        //   ctx.closePath();
        //   ctx.fill();
        // }
        // console.log(canvas.toDataURL());

      }else{
        // si tiene tranparencia
        let srcFile = await srcToFile(image.src, 'new.png', 'image/png');
        var options = { maxSizeMB: 1, maxWidthOrHeight: 720, useWebWorker: false }
        var output = await imageCompression(srcFile, options);
        // console.log(output);
        // blob to base64
        var reader = new FileReader();
         reader.readAsDataURL(output); 
         reader.onloadend = function() {
           base64Output = reader.result;
           formatoBase64 = base64Output.substr(0,10);                
           isBase64(base64Output);
           muestraProgressBar(formatoBase64);
        }
      }
      
    }
   } // fin boton subir

  }
  /*boton cancel*/
  btnCancel.onclick = function () {
  	cropper.clear();
  	this.disabled = true; 
    dataHeight.disabled = dataWidth.disabled = true;
  	resetRadio();
  	if (btnSaveUpload.innerHTML === 'Cortar') {
  		btnSaveUpload.innerHTML = "Subir";
	    btnSaveUpload.style.background = '#1A73E8';
	    btnSaveUpload.style.color = 'white';
  	}
  };


  function resultImageMiddleImage(){
    result_image.src = middleImage;
  }

  //  @Funciones generales

  /**
   * Revisa si tiene tranparencia
   * @param {ArrayBUffer} buffer - array buffer obtendo de file reader
   * @return {boolean} transparency - value true or false
   */
   function isTransparent(buffer) {
    var view = new DataView(buffer);
    // is a PNG?
    if (view.getUint32(0) === 0x89504E47 && view.getUint32(4) === 0x0D0A1A0A) {
      // We know format field exists in the IHDR chunk. The chunk exists at 
      // offset 8 +8 bytes (size, name) +8 (depth) & +9 (type)
      var depth = view.getUint8(8 + 8 + 8);
      var type  = view.getUint8(8 + 8 + 9);
      
      return {
        hasAlpha: type === 4 || type === 6 // grayscale + alpha or RGB + alpha
      }
    }
  }

  /**
   * Convierte archivo src a fileType
   * @param {image src} src - source
   * @param {string} fileName - Nombre de archivo
   * @param {mimeType} mimeType - formato de MIME
   * @returns {FileType}
   */
  function srcToFile(src, fileName, mimeType){
      return (fetch(src)
          .then(function(res){return res.arrayBuffer();})
          .then(function(buf){return new File([buf], fileName, {type:mimeType});})
      );
  }

  /** Progessbar */
  function progressMove() {
    var elem = document.getElementById("myBar");   
    var width = 1;
    var id = setInterval(frame, 10);
    function frame() {
      if (width >= 100) {
        clearInterval(id);
      } else {
        width++; 
        elem.style.width = width + '%'; 
      }
    }
  }

  /** 
   * Compresion de imagen JIC 
   * @param {image} imagen
   * @returns {src} src - source image compresed
   * @returns {number} size - size after compression
   * @returns {number} quality - quality of compression
   */
  function imageCompress(image) {
    let output_image = document.createElement('img');
      if (image.src == "") {
          alert("Debes subir una imagen antes");
          return false;
      }
      // reduce imagen con jic
      let quality = parseInt(inputNumberCalidad.value);
      output_image.src = jic.compress(image,quality,output_format).src;

      let src = output_image.src;
      let base64str = src.substr(23);
      let decoded = atob(base64str);

      let fileSizeCompressed = parseFloat(decoded.length.toLocaleString());

      return {
        img: output_image,
        src: src,
        size: fileSizeCompressed,
        quality: quality
      };

  };

  /** Get image live */
  function getImageLive(){
    var imgShow = document.getElementsByClassName('cropper-hide');
    return imgShow[0];
  }

  /** Set image live */
  function setImageLive(imageSrc){
    let imgShow = document.getElementsByClassName('cropper-hide');
    imgShow[0].src = imageSrc;
  }

	/** Show circle area before to cut*/
  function viewCircle(){
  	document.querySelector('.cropper-view-box').className += " cropper-circle";
  	document.querySelector('.cropper-face').className += " cropper-circle";
  }

  /** 
   * Recorte de imagen
   * @param {image} croppedCanvas - Image to be cropped
   * @returns {object} e - canvas recorted values
   */
  function cropImageGenerator(croppedCanvas){
  	let rectangleImage;
  	rectangleImage = document.createElement('img');
  	rectangleImage.src = croppedCanvas.toDataURL();
  	rectangleImage.id = 'image';
  	containerImage.innerHTML = '';
  	containerImage.appendChild(rectangleImage);
  	arrayImages.push(rectangleImage); // nueva imagen recibida
  	return cropper = new Cropper(arrayImages[arrayImages.length-1], {
  		viewMode: 1,
  		ready: function (event) {
        cropper.setDragMode("move");
  			cropper.clear();
  		}
  	});
  }

  /** 
   * Recorta imagen en circular
   * @param {canvas} sourceCanvas - canvas rectangular
   * @return {canvas} canvas circular shape
   */
  function getRoundedCanvas(sourceCanvas) {
  	let canvas = document.createElement('canvas');
  	let context = canvas.getContext('2d');
    // img onload para que no retorne data:,
  	let width = sourceCanvas.width;
  	let height = sourceCanvas.height;
  	canvas.width = width;
  	canvas.height = height;
  	context.imageSmoothingEnabled = true;
  	context.drawImage(sourceCanvas, 0, 0, width, height);
  	context.globalCompositeOperation = 'destination-in';
  	context.beginPath();
  	context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);
  	context.fill();
  	return canvas;
	};

  /** Reset active radius. */
  function resetRadio(){
  	let inputRadio = document.querySelectorAll('input[type=radio]');
    var activeAdvanced = document.querySelector('#activeAdvanced');
    activeAdvanced.disabled = false;
    for (var item of inputRadio) {
      item.checked = false;
    }
  };

  /** Activa boton cancelar */
  function activaBotonCancel(){
    btnCancel.disabled = false;
    
  }

  /** 
   * Muestra progressbar after crop
   * @param {base64} formatoBase64 - image string base 64 form
   */
  function muestraProgressBar(formatoBase64){
    if (formatoBase64 === 'data:image') {
      inputImage.style.display = 'none';
      actions.innerHTML = 
      // progress bar
      `<fieldset>
        <legend>subiendo</legend>
        <div id="myProgress">
          <div id="myBar"></div>
        <div>
      </fieldset>`;
      progressMove();
    } 
    else if (formatoBase64 === 'data:,') {
      btnSaveUpload.innerHTML = "uno más";
    }
  }

  /**
   * compara si es formato base64
   */
  function isBase64(dataToServer){
    let dataToServerString = dataToServer.substr(0,10);

    if (dataToServerString === 'data:image') {
      /**
       * enviar al servidor con axios
       */
      console.log(dataToServer);
      axios.post('https://jsonplaceholder.typicode.com/posts',{
        image: dataToServer,
      })
      .then((r) => console.log(r))
      .catch((e) => console.log(e));
    }
  }

  
  document.getElementById('imageInputForm').addEventListener('submit', getRequestPost);

  function getRequestPost(evt){
    evt.preventDefault();
  }
}