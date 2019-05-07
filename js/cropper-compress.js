window.onload = function(){
	'use strict';

	// global variables
  var containerImage = document.getElementById('containerImage');
	var source_image = document.getElementById('source_image');
  var result_image = document.getElementById('result_image');
  var URL = window.URL || window.webkitURL;
  var arrayImages;
	var options;
  var image_cropped;
  var middleImage; // esta tiene la imagen para ser procesada

  /** 
  * variables para interfaz
  */

  var btnSave = document.getElementById('btnSave');
  var btnReset = document.getElementById('btnReset');
  var btnCancel = document.getElementById('btnCancel');
  var btnUpload = document.getElementById('btnUpload');
  var btnDownload = document.getElementById('btnDownload');
  var inputImage = document.getElementById('inputImage');
  var docs_advanced = document.querySelector('.docs-advanced');
  var docs_buttons = document.querySelector('.docs-buttons');
  var docs_toggles = document.querySelector('.docs-toggles');

  docs_advanced.style.display = docs_buttons.style.display = docs_toggles.style.display = 'none';
  // fin variables para interfaz


  var uploadedImageName = 'cropped.jpg';
	var uploadedImageType = 'image/jpeg';


	// Initialize options
	options = {
		viewMode: 1,
		aspectRatio: NaN,
		ready: function (event) {
  			cropper.setDragMode();
  			cropper.clear();
        // console.log(getImageLive());
  		}
  	};
  	arrayImages = [source_image];

  	// cargar imagen
  	var inputImage = document.querySelector('#inputImage');
  	if (URL) {
  		inputImage.onchange = function(){
        let pesoInicial = document.getElementById('pesoInicial');
  			let files = this.files;
  			let file;
        let reader = new FileReader();

  			if (cropper && files && files.length) {
  				file = files[0];
          pesoInicial.innerHTML = (parseInt(file.size) / 1024).toFixed(3) + " Kb";
  				if (/^image\/\w+/.test(file.type)) {
  					uploadedImageType = file.type;
          			uploadedImageName = file.name;
  					if (uploadedImageURL) {
	          			URL.revokeObjectURL(uploadedImageURL);
	          		}
	          		uploadedImageURL = URL.createObjectURL(file);

                reader.onloadend = function(){
                  middleImage = reader.result;

                  /* interfaz */
                  docs_advanced.style.display = docs_toggles.style.display = docs_buttons.style.display = 'block';
                }
                if (file) {
                  reader.readAsDataURL(file);
                }else{
                  // source_image.src = "";
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

  /**
  * Funcionalidades checkbox 
  */

  var activeAdvanced = document.getElementById('activeAdvanced');
  activeAdvanced.addEventListener("click", function (){
    result_image.src = middleImage;
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
      /**
      * imagen recortada 
      */
      console.log(getImageLive());//imagen recortada
      
      // result_image.src = middleImage; // esto se da como valor inicial
      var image = imageCompress(result_image); // compresion de imagen

      pesoFinal.innerHTML = image.size + " Kb";
      quality.innerHTML = image.quality + " %";

      // Vanilla JS jic function when input range change
      inputRangeCalidad.onchange = function(){
          image = imageCompress(result_image);
          pesoFinal.innerHTML = image.size + " Kb";
          quality.innerHTML = image.quality + " %";
          setImageLive(image.src);
      }

      inputNumberCalidad.addEventListener('input', function(){
          image = imageCompress(result_image);
          pesoFinal.innerHTML = image.size + " Kb";
          quality.innerHTML = image.quality + " %";
          setImageLive(image.src);
      });
    }else{
      activeAdvancedMessage.innerHTML = 'Activar';
      for (var item of inputRadio) {
        item.disabled = false;
      }
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

	// Opciones cropper
	var actions = document.getElementById('actions');
	actions.querySelector('.docs-toggles').onchange = function(event){
		var e = event || window.event;
	  	var target = e.target || e.srcElement;
	  	var data;
      var activeAdvanced = document.querySelector('#activeAdvanced');
	  	data = {
      		method: target.getAttribute('data-method')
      	}
      	switch (data.method) {
      		case 'libre':
      			options['aspectRatio'] = NaN;
      			cen = false;
            activeAdvanced.disabled = true;
      			break;
          case 'rectangle':
            options['aspectRatio'] = 16 / 9;
            cen = false;
            activeAdvanced.disabled = true;
            break;
      		case 'cuadrado':
      			options['aspectRatio'] = 1 / 1;
      			cen = false;
            activeAdvanced.disabled = true;
      			break;
      		case 'circle':
      			options['aspectRatio'] = 1 / 1;
      			cen = true;
            activeAdvanced.disabled = true;
      			break;
      		default:
      			console.log('opcion no valida');
      			break;
      	}
      	options.ready = function(){
      		if (cen) viewCircle();

          // console.log(getImageLive());
          image_cropped = getImageLive();
      	};
      	// Restart
      	cropper.destroy();
      	return cropper = new Cropper(arrayImages[arrayImages.length-1], options);
	}

	// Methods cropper
	actions.querySelector('.docs-buttons').onclick = function (event){
		var e = event || window.event;
      	var target = e.target || e.srcElement;
      	var croppedCanvas;
      	var data;

      	data = {
      		method: target.getAttribute('data-method')
      	}

      	switch (data.method) {
      		case 'save':
      			croppedCanvas = cropper.getCroppedCanvas();
	      		if (cen) croppedCanvas = getRoundedCanvas(croppedCanvas);
	      		cropImageGenerator(croppedCanvas);
	      		resetRadio();

      			break;
      		case 'cancel':
      			cropper.clear();
            cropper.setDragMode();
      			resetRadio();
      			break;
      		case 'upload':
            // result_image.src = middleImage;
            var image = imageCompress(result_image);
            console.log(image);
            data = image.src;
      			break;

      		case 'download':
      			console.log('Imagen descargada');
            // let img = getImageLive();
            // let data = img.src;
            let btnDownload = document.getElementById('btnDownload');
            btnDownload.setAttribute("download", "descarga.jpeg");
            btnDownload.setAttribute("href", data);
      			break;
      		case 'reset':
      			console.log('pluggin reseteado');
      			break;
      		default:
      			console.log('Opción inválida');
      			break;
      	}
	}

  var btnUpload = document.querySelector('#btnUpload');
  btnUpload.addEventListener("click", function (){
    // result_image.src = middleImage;
  });
	/**
		@Funciones generales
	*/

  // funcion compresion de imagen
  function imageCompress(image) {
    let output_image = document.createElement('img');
      if (image.src == "") {
          alert("Debes subir una imagen antes");
          return false;
      }

      let quality = parseInt(inputNumberCalidad.value);
      output_image.src = jic.compress(image,quality,output_format).src;

      let src = output_image.src;
      let base64str = src.substr(23);
      let decoded = atob(base64str);

      let fileSizeCompressed = parseFloat(decoded.length.toLocaleString());

      return {
        src: src,
        size: fileSizeCompressed,
        quality: quality
      };

  };

  // mostrar imagen
  function getImageLive(){
    var imgShow = document.getElementsByClassName('cropper-hide');
    return imgShow[0];
  }

  function setImageLive(imageSrc){
    let imgShow = document.getElementsByClassName('cropper-hide');
    imgShow[0].src = imageSrc;
  }
	// mostrar visor circular
    function viewCircle(){
    	document.querySelector('.cropper-view-box').className += " cropper-circle";
    	document.querySelector('.cropper-face').className += " cropper-circle";
    }
    // recorte de imagen
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
    			cropper.setDragMode();
    			cropper.clear();
    		}
    	});
    }
    // Recorta imagen en circular
    function getRoundedCanvas(sourceCanvas) {
	  	let canvas = document.createElement('canvas');
	  	let context = canvas.getContext('2d');
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
    // resetea los radios activos
    function resetRadio(){
    	let inputRadio = document.querySelectorAll('input[type=radio]');
      var activeAdvanced = document.querySelector('#activeAdvanced');
      activeAdvanced.disabled = false;
      for (var item of inputRadio) {
        item.checked = false;
      }
    };

}

