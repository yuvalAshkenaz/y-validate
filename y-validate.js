/*! y-validate - v3.0 - 14/01/2026
* By Yuval Ashkenazi
* https://github.com/yuvalAshkenaz/y-validate */

// Inject Styles
const style = document.createElement('style');
style.textContent = `
    input.error,textarea.error,select.error{color:red!important;border-bottom:1px solid red!important;}
    .error::-webkit-input-placeholder{color:red!important;opacity:1;}
    .error:-moz-placeholder{color:red!important;opacity:1;}
    .select2-wrap{position:relative;}
    .select2.error+.label-error{position:absolute;bottom:0;}
    .select2.error~.select2-container{margin-bottom:24px;}
    .select2.error~.select2-container .select2-selection{border-bottom-color:red;}
    .select2.error~.select2-container .select2-selection__rendered{color:red;}
    input[type="checkbox"].error~span{color:red;}
    .label-error,.wpcf7-not-valid-tip{color:red;font-size:14px;}
    label:not(.label-error).wpcf7-not-valid-tip ~ .wpcf7-not-valid-tip,.label-error ~ .wpcf7-not-valid-tip{display:none;}
    .wpcf7-checkbox label:not(.label-error){display:flex;flex-wrap:wrap;gap:8px;align-items:flex-start;}
    .label-error{width:100%;order:2;}
    .wpcf7-checkbox input{margin:0;}
    .wpcf7-checkbox .wpcf7-list-item-label{width:-webkit-calc(100% - 30px);width:calc(100% - 30px);}
`;
document.head.appendChild(style);

// URL and Language Setup
const yValidateUrl = new URL(document.currentScript.src);
let yLang = yValidateUrl.searchParams.get("lang");
let y_translations = {
    cell: 'Invalid mobile number',
    invalid_email: 'Invalid email',
    passwords_not_match: 'Passwords not match',
    required_field: 'Required field',
    minimum: 'Minimum',
    letters: 'letters',
    numbers: 'numbers',
    numbers_only: 'Numbers only',
    is: 'is'
};

if (yLang === 'he' || yLang === 'he-IL' || yLang === 'he_IL') {
    yLang = 'he';
    y_translations = {
        cell: 'מספר טלפון נייד לא תקין',
        invalid_email: 'דוא"ל לא תקין',
        passwords_not_match: 'הסיסמאות לא תואמות',
        required_field: 'שדה חובה',
        minimum: 'מינימום',
        letters: 'אותיות',
        numbers: 'מספרים',
        numbers_only: 'מספרים בלבד',
        is: 'הינו'
    };
}

// Event Delegation Helpers
function matches(el, selector) {
    return el.matches && el.matches(selector);
}

// Event Listeners
document.body.addEventListener('keyup', function(e) {
    if (matches(e.target, '.required, .wpcf7-validates-as-required')) {
        y_check_req(e.target);
    } else if (matches(e.target, '[type="tel"]')) {
        y_check_if_number(e.target);
    } else if (matches(e.target, '.cell')) {
        isIsraeliMobileNumber(e.target);
    } else if (matches(e.target, '[minlength]')) {
        y_check_minlength(e.target);
    }
});

document.body.addEventListener('change', function(e) {
    if (matches(e.target, '.required, .wpcf7-validates-as-required')) {
        y_check_req(e.target);
    }
});

document.body.addEventListener('blur', function(e) {
    const target = e.target;
    if (matches(target, '.required, .wpcf7-validates-as-required')) {
        if (target.classList.contains('password-confirm')) {
            y_check_req(target);
        } else {
            y_validate_field(target, 'blur', function(field) {
                if (typeof y_blur_after_validate === 'function') {
                    y_blur_after_validate(field);
                }
            });
        }
    } else if (matches(target, '.password-confirm')) {
        if (target.value !== '') {
            y_password_confirm(target);
        }
    } else if (matches(target, '[type="email"]')) {
        y_check_email(target);
    } else if (matches(target, '[type="tel"]')) {
        y_check_if_number(target);
    } else if (matches(target, '.cell')) {
        isIsraeliMobileNumber(target);
    }
}, true); // useCapture for blur to work with delegation correctly if needed, though 'focusout' bubbles, 'blur' does not. Delegated 'blur' works on window/document in modern browsers, but explicit target check is safer.

document.body.addEventListener('submit', function(e) {
    if (e.target.tagName === 'FORM') {
        const valid = y_validate_form(e.target);
        if (!valid) {
            e.preventDefault();
        }
    }
});

// Validate form
function y_validate_form(form) {
    let valid = true;
    // Query selectors returns NodeList, convert to Array or use forEach
    let req = form.querySelectorAll('.required, .wpcf7-validates-as-required');
    
    if (req.length === 0) {
        return valid;
    }

    req.forEach(function(field) {
        // Filter out if it picked up something erroneously (though querySelectorAll is precise)
        const isValid = y_validate_field(field, 'submit');
        if (!isValid) {
            valid = false;
        }
    });

    if (!valid) {
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.focus();
        }
    }
    return valid;
}

function get_placeholder(field) {
    return field.getAttribute('placeholder') || field.getAttribute('data-default-placeholder');
}

// Validate field
function y_validate_field(field, function_type, callback) {
    // Ensure field is a DOM element
    if (!field) return false;

    // required
    if (!y_check_req(field)) {
        if (callback && typeof callback === 'function') callback(field);
        return false;
    }

    // digits
    if (!y_check_if_number(field)) {
        if (callback && typeof callback === 'function') callback(field);
        return false;
    }

    // cell
    if (!isIsraeliMobileNumber(field)) {
        if (callback && typeof callback === 'function') callback(field);
        return false;
    }

    // email
    if (!y_check_email(field)) {
        if (callback && typeof callback === 'function') callback(field);
        return false;
    }

    // minlength
    if (!y_check_minlength(field)) {
        if (callback && typeof callback === 'function') callback(field);
        return false;
    }

    // password-confirm
    if (!y_password_confirm(field)) {
        if (callback && typeof callback === 'function') callback(field);
        return false;
    }

    return true;
}

// Email
function y_check_email(field, callback) {
    if (field.value !== '' && (field.getAttribute('type') === 'email' || field.classList.contains('email'))) {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
            y_remove_error_msg(field);
        } else {
            let msg = y_translations.invalid_email;
            const placeholder = get_placeholder(field);
            if (placeholder) {
                msg = placeholder + ': ' + msg;
            }
            y_add_error_msg(field, msg);

            if (callback && typeof callback === 'function') callback(field);
            return false;
        }
    }
    if (callback && typeof callback === 'function') callback(field);
    return true;
}

// password-confirm
function y_password_confirm(field, callback) {
    if (field.classList.contains('password-confirm')) {
        const form = field.closest('form');
        const confirm_fields = form.querySelectorAll('.password-confirm');
        let not_empty = 0;
        
        confirm_fields.forEach(function(el) {
            if (el.value.length) {
                not_empty++;
            }
        });

        if (not_empty > 1) {
            // Find the other field to compare against
            let otherField = null;
            confirm_fields.forEach(el => {
                if(el !== field) otherField = el;
            });

            if (otherField && field.value !== otherField.value) {
                // Add error to all confirm fields
                confirm_fields.forEach(el => y_add_error_msg(el, y_translations.passwords_not_match));
                
                if (callback && typeof callback === 'function') callback(field);
                return false;
            } else {
                confirm_fields.forEach(el => y_remove_error_msg(el));
            }
        }
    }
    if (callback && typeof callback === 'function') callback(field);
    return true;
}

// Required
function y_check_req(field, callback) {
    // Check if element itself is required or is inside a required wrapper
    const isRequired = field.classList.contains('required') || 
                       field.classList.contains('wpcf7-validates-as-required') || 
                       field.closest('.required') || 
                       field.closest('.wpcf7-validates-as-required');

    if (isRequired) {
        // radio / checkbox logic
        let has_radio_or_checkbox = false;
        let radio_or_checkbox_empty = true;
        let targetField = field;

        if (!targetField.getAttribute('type')) {
            const innerInput = targetField.querySelector('[type]');
            if (innerInput) targetField = innerInput;
        }

        const type = targetField.getAttribute('type');

        if (type === 'radio' || type === 'checkbox') {
            has_radio_or_checkbox = true;
            const name = targetField.getAttribute('name');
            const inputs = document.querySelectorAll(`input[name="${name}"]`);
            
            inputs.forEach(function(input) {
                if (input.checked) {
                    radio_or_checkbox_empty = false;
                }
            });

            if (!radio_or_checkbox_empty) {
                inputs.forEach(function(input) {
                    input.classList.remove('error');
                    const labelError = input.nextElementSibling;
                    if (labelError && labelError.classList.contains('label-error')) {
                        labelError.remove();
                    }
                    
                    const wrapper = input.closest('.wpcf7-validates-as-required');
                    if (wrapper) {
                        wrapper.classList.remove('error');
                        const wrapperLabelError = wrapper.nextElementSibling;
                        if (wrapperLabelError && wrapperLabelError.classList.contains('label-error')) {
                            wrapperLabelError.remove();
                        }
                    }
                });
            }
        }

        // Check for siblings with wpcf7 error tip
        let hasSiblingError = false;
        if (targetField.parentNode) {
            const siblings = targetField.parentNode.children;
            for (let i = 0; i < siblings.length; i++) {
                if (siblings[i] !== targetField && siblings[i].classList.contains('wpcf7-not-valid-tip')) {
                    hasSiblingError = true;
                    break;
                }
            }
        }

        if (
            (has_radio_or_checkbox && radio_or_checkbox_empty) ||
            targetField.value === '' ||
            hasSiblingError
        ) {
            if (hasSiblingError) {
                y_remove_error_msg(targetField);
            } else {
                let msg = y_translations.required_field;
                const placeholder = get_placeholder(targetField);
                if (placeholder) {
                    msg = placeholder + ' ' + y_translations.is + ' ' + msg;
                }
                y_add_error_msg(targetField, msg);
            }
            if (callback && typeof callback === 'function') callback(targetField);
            return false;
        } else if (targetField.classList.contains('required') || targetField.classList.contains('wpcf7-validates-as-required')) {
            y_remove_error_msg(targetField);
        }
    }
    if (callback && typeof callback === 'function') callback(field);
    return true;
}

// Number
function y_check_if_number(field) {
    if (field.getAttribute('type') === 'tel' && /[^0-9]/.test(field.value)) {
        let msg = y_translations.numbers_only;
        const placeholder = get_placeholder(field);
        if (placeholder) {
            msg = placeholder + ': ' + msg;
        }
        y_add_error_msg(field, msg);
        return false;
    } else {
        y_remove_error_msg(field);
    }
    return true;
}

// minlength
function y_check_minlength(field) {
    if (field.hasAttribute('minlength')) {
        const min = parseInt(field.getAttribute('minlength'), 10);
        if (field.value.length > 0 && field.value.length < min) {
            let min_word = y_translations.letters;
            if (field.getAttribute('type') === 'tel') {
                min_word = y_translations.numbers;
            }
            let msg = y_translations.minimum + ' ' + min + ' ' + min_word;
            const placeholder = get_placeholder(field);
            if (placeholder) {
                msg = placeholder + ': ' + msg;
            }
            y_add_error_msg(field, msg);
            return false;
        } else {
            y_remove_error_msg(field);
        }
    }
    return true;
}

// Remove error message
function y_remove_error_msg(self) {
    let target = self;
    if (!target.classList.contains('wpcf7-validates-as-required') && target.closest('.wpcf7-validates-as-required')) {
        target = target.closest('.wpcf7-validates-as-required');
    }
    
    target.classList.remove('error');
    const nextEl = target.nextElementSibling;
    if (nextEl && nextEl.classList.contains('label-error')) {
        nextEl.remove();
    }
}

// Add error message
function y_add_error_msg(self, msg) {
    let target = self;
    // Adjust target if inside a wpcf7 wrapper
    if (!target.classList.contains('wpcf7-validates-as-required') && target.closest('.wpcf7-validates-as-required')) {
        target = target.closest('.wpcf7-validates-as-required');
    }

    const nextEl = target.nextElementSibling;
    if (nextEl && nextEl.classList.contains('label-error')) {
        target.classList.add('error');
        nextEl.textContent = msg;
        nextEl.style.display = 'block';
    } else {
        let forid = '';
        const inner_input = target.querySelector('input');
        
        let idHolder = inner_input ? inner_input : target;
        
        if (!idHolder.getAttribute('id')) {
            const newID = y_new_input_id({
                input: idHolder
            });
            idHolder.setAttribute('id', newID);
        }
        forid = 'for="' + idHolder.getAttribute('id') + '"';

        target.classList.add('error');
        
        const html = target.closest('label') 
            ? `<div ${forid} class="label-error error" style="display:block;">${msg}</div>`
            : `<label ${forid} class="label-error error" style="display:block;">${msg}</label>`;
            
        target.insertAdjacentHTML('afterend', html);
    }
}

function y_new_input_id(obj) {
    let name = obj.input.getAttribute('name');
    if (!name) name = 'input'; // Fallback if no name
    let newID = name.replace(/[^a-zA-Z\-\_]/g, '');
    let num = obj.num ? obj.num + 1 : 1;
    newID = newID + num;

    if (document.getElementById(newID)) {
        return y_new_input_id({
            input: obj.input,
            num: num
        });
    }
    return newID;
}

// is Israeli Mobile Number
function isIsraeliMobileNumber(field) {
    let phone_val = field.value.replace(/\D/g, '');

    if (phone_val.startsWith('972')) {
        phone_val = '0' + phone_val.slice(3);
    }

    if (phone_val.length && field.classList.contains('cell') && !/^05[0-9]{8}$/.test(phone_val)) {
        let msg = y_translations.cell;
        const placeholder = get_placeholder(field);
        if (placeholder) {
            msg = placeholder + ': ' + msg;
        }
        y_add_error_msg(field, msg);
        return false;
    } else {
        y_remove_error_msg(field);
    }
    return true;
}

// Disable cf7 validation
document.addEventListener('wpcf7submit', function(event) {
    if(event.detail && event.detail.apiResponse){
        event.detail.apiResponse.invalid_fields = [];
    }
});