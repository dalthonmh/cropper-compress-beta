window.onload = function(){
	'use strict';

	// global variables
  var containerImage = document.getElementById('containerImage');
	var source_image = document.getElementById('source_image');
  var result_image = document.getElementById('result_image');
  var URL = window.URL || window.webkitURL;
  var arrayImages;
	var options;
  var image_compressed;
  var middleImage; // esta tiene la imagen para ser procesada

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
                  // console.log(middleImage);

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
  * Funcionalidades
  */

  var activeAdvanced = document.getElementById('activeAdvanced');
  activeAdvanced.onclick = function (){

    let cen = activeAdvanced.checked; // guarda si esta checked o no
    let advanced = document.querySelector('.advanced');
    advanced.classList.toggle("d-none");

    if (cen) {
      document.querySelector('#pesoFinal').innerHTML = sizeFinal + " Kb";
      document.querySelector('#quality').innerHTML = qualityFinal + " %";
    }
  }
  
  // Inicialización JIC
  var inputNumberCalidad = document.getElementById('inputNumberCalidad');
  var inputRangeCalidad = document.getElementById('inputRangeCalidad');
  var output_format = 'jpg';

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

  // Vanilla JS jic function when input range change
  inputRangeCalidad.onchange = function(){
      imageCompress(getImageLive());
      
  }

  inputNumberCalidad.addEventListener('input', function(){
      imageCompress();
  });


	// Opciones cropper
	var actions = document.getElementById('actions');
	actions.querySelector('.docs-toggles').onchange = function(event){
		var e = event || window.event;
	  	var target = e.target || e.srcElement;
	  	var data;

	  	data = {
      		method: target.getAttribute('data-method')
      	}
      	switch (data.method) {
      		case 'rectangle':
      			options['aspectRatio'] = 16 / 9;
      			cen = false;
      			break;
      		case 'cuadrado':
      			options['aspectRatio'] = 1 / 1;
      			cen = false;
      			break;
      		case 'circle':
      			options['aspectRatio'] = 1 / 1;
      			cen = true;
      			break;
      		default:
      			console.log('opcion no valida');
      			break;
      	}
      	options.ready = function(){
      		if (cen) viewCircle();
          console.log(getImageLive());
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
            result_image.src = middleImage;
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

document.querySelector('#btnUpload').addEventListener('click', function(){
  result_image.src = middleImage;
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

  function setImageLive(image){
    let imgShow = document.getElementsByClassName('cropper-hide');
    imgShow = image;
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
    	for (let i = 0; i < inputRadio.length; i++) {
    		inputRadio[i].checked = false;
    	}
    };
}