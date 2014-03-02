
$(function() {
	getLocalStorage();
	displayThumbs();

	setNoteActive();
	$('#add').focus(function() {
		setNoteInactive();
	});

	$('.nota-title, .nota-text').keyup(function() {
		hideEmptyfields($(this));
		setLocalStorage($(this).closest('.nota-thumb'));
	});

	addNote();
	deleteNote();

});


// ===========================================================================================
// Organizar caixas no layout
// ===========================================================================================

function displayThumbs() {
	$('.nota-thumb:not(:first)').each(function() {

		var $this = $(this);
		var prev_el = $this.prev();

		var distance = $this.offset().left - prev_el.offset().left;
		if ( distance < 0 ) {
			prev_el.css('float', 'right');
		}
	});

	$(window).resize(function(){
		$('.nota-thumb').css('float', 'left');
		displayThumbs();
	});
};




// ===========================================================================================
// Esconder Campos vazios
// ===========================================================================================

function hideEmptyfields(el) {
	if ( el.text() == '') {
		el.addClass('empty');
	}
	else {
		el.removeClass('empty');
	}
};


// ===========================================================================================
// Gravar e obter localstorage
// ===========================================================================================

function getLocalStorage() {

	var data = window.localStorage; // array os keys

	$.each(data, function(key, val) {
    	localStorage.setItem(key, val); // 
    	var note = key.substring(0,4);
    	if (note == 'note') {
    		$('.notas-list').prepend('\
    			<article class="box-skin nota-thumb" id="'+ key +'">\
    				<a href="#" class="nota-delete">X</a>\
    				<div class="nota-content">'+ val +'</div>\
    			</article>\
    		');
    	}
	});
};

function setLocalStorage(el) {
	// storage html
	var key = el.attr('id');
	var val = el.find('.nota-content').html();
    localStorage.setItem(key, val);
};


// ===========================================================================================
// Abrir nota
// ===========================================================================================

function setNoteActive() {
	$('.nota-thumb').on('click', function() {
		var $this = $(this);

		$('.nota-thumb').removeClass('current');
		$this.addClass('current');

		setTimeout(function() {
			var position = $this.position().top;
			$('.page-wrap').animate({
				scrollTop: position - 35
			}, 500);

			if ( !($this.hasClass('current')) ) {
				$this.find('.nota-text').focus();
			};
		}, 50);

	});
};


function setNoteInactive() {
	$('.nota-thumb').removeClass('current');
};



// ===========================================================================================
// Adicionar nota
// ===========================================================================================

function addNote() {
	$('#add-btn').on('click', function() {
		
		var value = $('#add').val();
		if (value != '') {

			if (localStorage.getItem('last-id') === null) {
				var new_id = 6;
				localStorage.setItem('last-id', new_id);
			}
			else {
				var last_id = localStorage.getItem('last-id');
				var new_id = parseInt(last_id)+1;
			}
			$('.notas-list').prepend('\
				<article class="box-skin nota-thumb" id="note'+ new_id +'">\
    				<a href="#" class="nota-delete">X</a>\
					<div class="nota-content">\
						<p class="nota-title empty" contenteditable></p>\
	                    <p class="nota-text" contenteditable>'+ value +'</p>\
	                </div>\
				</article>\
			');
			var $this = $('#note'+new_id);

			// fadeIn note
			setTimeout(function() {
				$this.removeClass('transparent');
			}, 200);

			// clean input and hide btn
			$('#add').val('');

			// store added note
			setLocalStorage($this);

			// store next id
			var next_id = localStorage.setItem('last-id', new_id);

			setNoteActive();
			setTimeout(function() {
				$this.click();
			}, 200);

			// reiniciar o localStorage
			$this.find('.nota-title, .nota-text').keyup(function() {
				hideEmptyfields($(this));
				setLocalStorage($this);
			});
			deleteNote();
		}
	});
	$('#add').keyup(function() {

		var value = $('#add').val();
		if (value == '') {
			$('#add-btn').addClass('transparent');
		}
		else {
			$('#add-btn').removeClass('transparent');
		}
	});
}



// ===========================================================================================
// Apagar nota
// ===========================================================================================

function deleteNote() {
	$('.nota-delete').on('click', function(e) {
		e.preventDefault();
		var $this = $(this);
		var note = $this.closest('.nota-thumb');
		note.addClass('transparent');
		setTimeout(function() {
			note.remove();
		}, 500);
		var key = note.attr('id');
		console.log(key);
		localStorage.removeItem(key);
	});
};