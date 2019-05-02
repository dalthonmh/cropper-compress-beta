window.onload = function(){
	'use strict';

	// global variables
	var URL = window.URL || window.webkitURL;
	var source_image = document.getElementById('source_image');
	var containerImage = document.getElementById('containerImage');
	var options;
	var arrayImages;

	var uploadedImageType = 'image/jpeg';
  	var uploadedImageName = 'cropped.jpg';

	// Initialize options
	options = {
		viewMode: 1,
		aspectRatio: NaN,
		ready: function (event) {
			cropper.setDragMode();
			cropper.clear();
		}
  	};
  	arrayImages = [source_image];

  	// cargar imagen
  	var inputImage = document.querySelector('#inputImage');
  	if (URL) {
  		inputImage.onchange = function(){
  			let files = this.files;
  			let file;

  			if (cropper && files && files.length) {
  				file = files[0];
  				if (/^image\/\w+/.test(file.type)) {
  					uploadedImageType = file.type;
          			uploadedImageName = file.name;
  					if (uploadedImageURL) {
	          			URL.revokeObjectURL(uploadedImageURL);
	          		}
	          		source_image.src = uploadedImageURL = URL.createObjectURL(file);
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
	var uploadedImageType = 'image/jpeg';
  	var uploadedImageName = 'cropped.jpg';
	var uploadedImageURL;
	var cen;

	// Opciones
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
      	};
      	// Restart
      	cropper.destroy();
      	return cropper = new Cropper(arrayImages[arrayImages.length-1], options);
	}

	// Methods
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
      			resetRadio();
      			break;
      		case 'upload':
      			console.log('subido al servido');
      			break;

      		case 'download':
      			console.log('Imagen descargada');
      			break;
      		case 'reset':
      			console.log('pluggin reseteado');
      			break;
      		default:
      			console.log('Opción inválida');
      			break;
      	}
	}



	/**
		@Funciones generales
	*/

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
    	arrayImages.push(rectangleImage);
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