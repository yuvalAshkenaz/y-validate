/*! y-validate - v1.3 - 19/06/2024
* By Yuval Ashkenazi */
jQuery('head').append('<style  type="text/css">input.error,textarea.error,select.error{color:red;border:1px solid red!important;}.error::-webkit-input-placeholder{color:red!important;opacity:1;}.error:-moz-placeholder{color:red!important;opacity:1;}.select2.error+label.error{position:absolute;bottom:0;}.select2.error~.select2-container{margin-bottom:24px;}.select2.error~.select2-container .select2-selection{border-color:red;}.select2.error~.select2-container .select2-selection__rendered{color:red;}input[type="checkbox"].error~span{color:red;}label.error,.wpcf7-not-valid-tip{color:red;font-size:14px;}label.wpcf7-not-valid-tip ~ .wpcf7-not-valid-tip, label.error ~ .wpcf7-not-valid-tip{display:none;}</style>');

var yUrl = new URL(document.currentScript.src);
var yLang = yUrl.searchParams.get("lang");
var y_translations = {
	invalid_email		: 'Invalid email',
	passwords_not_match	: 'Passwords not match',
	required_field		: 'Required field',
	minimum				: 'Minimum',
	letters				: 'letters',
	numbers				: 'numbers',
	numbers_only		: 'Numbers only'
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
		numbers_only		: 'מספרים בלבד'
	};
}

// Key up required
jQuery('body').on('keyup','.required, .wpcf7-validates-as-required', function(){
	y_validate_field( jQuery(this), 'keyup' );
});
// Key up not required
jQuery('body').on('keyup','[minlength], [type="tel"]', function(){
	if( ! y_check_if_number( jQuery(this) ) ) {
		return false;
	}
	if( ! y_check_minlength( jQuery(this) ) ) {
		return false;
	}
});
// Blur required
jQuery('body').on('blur','.required, .wpcf7-validates-as-required', function(){
	if( ! jQuery(this).hasClass('password-confirm') ) {
		y_validate_field(jQuery(this), 'blur', function( field ) {
			if( typeof y_blur_after_validate === 'function' ) {
				y_blur_after_validate( field );
			}
		});
	}
});
// Blur password-confirm
jQuery('body').on('blur','.password-confirm', function(){
	if( jQuery(this).val() !== '' )
		y_validate_field( jQuery(this), 'blur' );
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
// Validate field
function y_validate_field( field, function_type, callback ) {
	if( ! y_check_if_number( field ) ) {
		return false;
	}
	if( ! y_check_minlength( field ) ) {
		return false;
	}
	
	// email
	if( field.val() !== '' && ( field.attr('type') === 'email' || field.hasClass('email') ) ) {
		if( /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( field.val() ) ) { 
			y_remove_error_msg( field );
			if( callback != undefined && callback != null ) {
				callback( field );
			}
			return true;
		} else {
			y_add_error_msg( field, y_translations.invalid_email );
			return false;
		};
	}
	// password-confirm
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
				return false;
			} else {
				y_remove_error_msg( confirm_fields );
				if( callback != undefined && callback != null ) {
					callback( field );
				}
				return true;
			}
		}
	}
	// required
	if( field.hasClass('required') || field.hasClass('wpcf7-validates-as-required') ) {
		if( field.val() === '' || field.siblings('.wpcf7-not-valid-tip').length ) {
			if( field.siblings('.wpcf7-not-valid-tip').length ) {
				y_remove_error_msg( field );
			} else {
				y_add_error_msg( field, y_translations.required_field );
			}
			return false;
		} else if( field.hasClass('required') || field.hasClass('wpcf7-validates-as-required') ) {
			y_remove_error_msg( field );
			if( callback != undefined && callback != null ) {
				callback( field );
			}
			return true;
		}
	}
	return true;
};
//check if number field
function y_check_if_number( field ) {
	if( field.attr('type') == 'tel' && /[^0-9]/.test( field.val() ) ) {
		y_add_error_msg( field, y_translations.numbers_only );
		return false;
	} else {
		y_remove_error_msg( field );
		return true;
	}
	return true;
}
//minlength
function y_check_minlength( field ) {
	if( field.attr('minlength') ) {
		var min = field.attr('minlength');
		if( field.val().length > 0 && field.val().length < min ) {
			var min_word = y_translations.letters;
			if( field.attr('type') == 'tel' ) {
				min_word = y_translations.numbers;
			}
			y_add_error_msg( field, y_translations.minimum+' '+min+' '+min_word );
			return false;
		} else {
			y_remove_error_msg( field );
			return true;
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
	if( self.next('label.error').length ) {
		self.addClass('error').next('label.error').text( msg ).show();
	} else {
		self.addClass('error').after('<label class="error" style="display:block;">'+msg+'</label>');
	}
};