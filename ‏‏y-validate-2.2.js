/*! y-validate - v2.2 - 05/01/2025
* By Yuval Ashkenazi
* https://github.com/yuvalAshkenaz/y-validate */
jQuery('head').append('<style type="text/css">input.error,textarea.error,select.error{color:red!important;border-bottom:1px solid red!important;}.error::-webkit-input-placeholder{color:red!important;opacity:1;}.error:-moz-placeholder{color:red!important;opacity:1;}.select2-wrap{position:relative;}.select2.error+label.error{position:absolute;bottom:0;}.select2.error~.select2-container{margin-bottom:24px;}.select2.error~.select2-container .select2-selection{border-bottom-color:red;}.select2.error~.select2-container .select2-selection__rendered{color:red;}input[type="checkbox"].error~span{color:red;}label.error,.wpcf7-not-valid-tip{color:red;font-size:14px;}label.wpcf7-not-valid-tip ~ .wpcf7-not-valid-tip, label.error ~ .wpcf7-not-valid-tip{display:none;}</style>');

var yUrl = new URL(document.currentScript.src);
var yLang = yUrl.searchParams.get("lang");
var y_translations = {
	invalid_email		: 'Invalid email',
	passwords_not_match	: 'Passwords not match',
	required_field		: 'Required field',
	minimum				: 'Minimum',
	letters				: 'letters',
	numbers				: 'numbers',
	numbers_only		: 'Numbers only',
	is					: 'is'
};
if(yLang == 'he' || yLang == 'he-IL'){
	yLang = 'he';
	y_translations = {
		invalid_email		: 'דוא"ל לא תקין',
		passwords_not_match	: 'הסיסמאות לא תואמות',
		required_field		: 'שדה חובה',
		minimum				: 'מינימום',
		letters				: 'אותיות',
		numbers				: 'מספרים',
		numbers_only		: 'מספרים בלבד',
		is					: 'הינו'
	};
}

// Key up required
jQuery('body').on('keyup', '.required, .wpcf7-validates-as-required', function(){
	y_check_req( jQuery(this) );
});
// Key up required
jQuery('body').on('change', '.required, .wpcf7-validates-as-required', function(){
	y_check_req( jQuery(this) );
});
// Key up digits
jQuery('body').on('keyup', '[type="tel"]', function(){
	y_check_if_number( jQuery(this) );
});
// Key up minlength
jQuery('body').on('keyup','[minlength]', function(){
	y_check_minlength( jQuery(this) );
});
// Blur required
jQuery('body').on('blur', '.required, .wpcf7-validates-as-required', function(){
	y_check_req( jQuery(this) );
	if( ! jQuery(this).hasClass('password-confirm') ) {
		y_validate_field(jQuery(this), 'blur', function( field ) {
			if( typeof y_blur_after_validate === 'function' ) {
				y_blur_after_validate( field );
			}
		});
	}
});
// Blur password-confirm
jQuery('body').on('blur', '.password-confirm', function(){
	if( jQuery(this).val() !== '' ) {
		y_password_confirm( jQuery(this) );
	}
});
// Blur Email
jQuery('body').on('blur', '[type="email"]', function(){
	y_check_email( jQuery(this) );
});
// Blur digits
jQuery('body').on('blur', '[type="tel"]', function(){
	y_check_if_number( jQuery(this) );
});
// Submit form
jQuery('body').on('submit', 'form', function(e){
	var valid = y_validate_form( jQuery(this) );
	if( ! valid ) {
		e.preventDefault();
	}
});
// Validate form
function y_validate_form( form ) {
	var valid = true;
	var req = form.find('.required').length ? form.find('.required') : form.find('.wpcf7-validates-as-required');
	if( ! req.length ) {
		return valid;
	}
	req.each(function(){
		var is_valid = y_validate_field( jQuery(this), 'submit' );
		if( ! is_valid ) {
			valid = false;
		}
	});
	if( ! valid ) {
		form.find('.error').eq(0).focus();
	}
	return valid;
};
function get_placeholder( field ) {
	var placeholder = '';
	if( field.attr('placeholder') ) {
		placeholder = field.attr('placeholder');
	} // else {
		// if( field.attr('id') && jQuery('label[for="'+field.attr('id')+'"]').length ) {
			// placeholder = jQuery('label[for="'+field.attr('id')+'"]:not(.error)').text();
		// }
	// }
	return placeholder;
};
// Validate field
function y_validate_field( field, function_type, callback ) {

	// required
	if( ! y_check_req( field ) ) {
		if (callback && typeof callback === 'function') {
			callback( field );
		}
		return false;
	}
	
	// digits
	if( ! y_check_if_number( field ) ) {
		if (callback && typeof callback === 'function') {
			callback( field );
		}
		return false;
	}
	
	// email
	if( ! y_check_email( field ) ) {
		if (callback && typeof callback === 'function') {
			callback( field );
		}
		return false;
	}
	
	// minlength
	if( ! y_check_minlength( field ) ) {
		if (callback && typeof callback === 'function') {
			callback( field );
		}
		return false;
	}
	
	// password-confirm
	if( ! y_password_confirm( field ) ) {
		if (callback && typeof callback === 'function') {
			callback( field );
		}
		return false;
	}
};
// Email
function y_check_email( field, callback ){
	if( field.val() !== '' && ( field.attr('type') === 'email' || field.hasClass('email') ) ) {
		if( /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( field.val() ) ) { 
			y_remove_error_msg( field );
			// return true;
		} else {
			var msg = y_translations.invalid_email;
			var placeholder = get_placeholder( field );
			if( placeholder ) {
				msg = placeholder + ': ' + msg;
			}
			y_add_error_msg( field, msg );
			
			if (callback && typeof callback === 'function') {
				callback( field );
			}
			return false;
			// errors = true;
		};
	}
	if (callback && typeof callback === 'function') {
		callback( field );
	}
	return true;
}
// password-confirm
function y_password_confirm( field, callback ){
	if( field.hasClass('password-confirm') ) {
		var confirm_fields = field.closest('form').find('.password-confirm');
		var not_empty = 0;
		confirm_fields.each(function(i){
			if( jQuery(this).val().length ) {
				not_empty++;
			}
		});
		if( not_empty > 1 ) {
			if( field.val() !== confirm_fields.not( field ).val() ) {
				y_add_error_msg( confirm_fields, y_translations.passwords_not_match );
				if (callback && typeof callback === 'function') {
					callback( field );
				}
				return false;
				// errors = true;
			} else {
				y_remove_error_msg( confirm_fields );
				// return true;
			}
		}
	}
	if (callback && typeof callback === 'function') {
		callback( field );
	}
	return true;
};
// Required
function y_check_req( field, callback ){
	if( field.hasClass('required') || field.hasClass('wpcf7-validates-as-required') ) {
		// radio / checkbox
		var has_radio_or_checkbox = false;
		var radio_or_checkbox_empty = true;
		if( field.attr('type') == 'radio' || field.attr('type') == 'checkbox' ) {
			has_radio_or_checkbox = true;
			jQuery('input[name="'+field.attr('name')+'"]').each(function(){
				if( jQuery(this).is(':checked') ) {
					radio_or_checkbox_empty = false;
				}
			});
			if( ! radio_or_checkbox_empty )
				jQuery('input[name="'+field.attr('name')+'"]').removeClass('error').next('label.error').remove();
		}
		if(
			( has_radio_or_checkbox && radio_or_checkbox_empty ) || 
			field.val() === '' || 
			field.siblings('.wpcf7-not-valid-tip').length 
		) {
			if( field.siblings('.wpcf7-not-valid-tip').length ) {
				y_remove_error_msg( field );
			} else {
				var msg = y_translations.required_field;
				var placeholder = get_placeholder( field );
				if( placeholder ) {
					msg = placeholder + ' ' + y_translations.is + ' ' + msg;
				}
				y_add_error_msg( field, msg );
			}
			if (callback && typeof callback === 'function') {
				callback( field );
			}
			return false;
		} else if( field.hasClass('required') || field.hasClass('wpcf7-validates-as-required') ) {
			y_remove_error_msg( field );
		}
	}
	if (callback && typeof callback === 'function') {
		callback( field );
	}
	return true;
};
// Number
function y_check_if_number( field ) {
	if( field.attr('type') == 'tel' && /[^0-9]/.test( field.val() ) ) {
		var msg = y_translations.numbers_only;
		var placeholder = get_placeholder( field );
		if( placeholder ) {
			msg = placeholder + ': ' + msg;
		}
		y_add_error_msg( field, msg );
		return false;
	} else {
		y_remove_error_msg( field );
	}
	return true;
}
// minlength
function y_check_minlength( field ) {
	if( field.attr('minlength') ) {
		var min = field.attr('minlength');
		if( field.val().length > 0 && field.val().length < min ) {
			var min_word = y_translations.letters;
			if( field.attr('type') == 'tel' ) {
				min_word = y_translations.numbers;
			}
			var msg = y_translations.minimum + ' ' + min + ' ' + min_word;
			var placeholder = get_placeholder( field );
			if( placeholder ) {
				msg = placeholder + ': ' + msg;
			}
			y_add_error_msg( field, msg );
			return false;
		} else {
			y_remove_error_msg( field );
		}
	}
	return true;
}
// Remove error message
function y_remove_error_msg( self ) {
	self.removeClass('error').next('label.error').remove();
};
// Add error message
function y_add_error_msg( self, msg ) {
	// debugger;
	if( self.next('label.error').length ) {
		self.addClass('error').next('label.error').text( msg ).show();
	} else {
		var forid = '';
		if( self.attr('id') ) {
			forid = 'for="'+self.attr('id')+'"';
		}
		self.addClass('error').after('<label '+forid+' class="error" style="display:block;">'+msg+'</label>');
	}
};
//Disable cf7 validation
document.addEventListener('wpcf7submit', function(event) {
	event.detail.apiResponse.invalid_fields = [];
});
