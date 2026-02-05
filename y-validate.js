/*! y-validate - v3.1 - 05/02/2026
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

// Helper: Debounce function to improve INP
function y_debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Translations Setup
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

function matches(el, selector) {
    return el.matches && el.matches(selector);
}

// Optimized Event Listener for Input (Replaces keyup)
const handleInputValidation = y_debounce(function(e) {
    if (matches(e.target, '.required, .wpcf7-validates-as-required')) {
        y_check_req(e.target);
    } else if (matches(e.target, '[type="tel"]')) {
        y_check_if_number(e.target);
    } else if (matches(e.target, '.cell')) {
        isIsraeliMobileNumber(e.target);
    } else if (matches(e.target, '[minlength]')) {
        y_check_minlength(e.target);
    }
}, 300); // 300ms delay to unblock main thread

document.body.addEventListener('input', handleInputValidation);

document.body.addEventListener('change', function(e) {
    if (matches(e.target, '.required, .wpcf7-validates-as-required')) {
        y_check_req(e.target);
    }
});

// Blur uses passive: true to not block scrolling (though blur doesn't usually block scroll)
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
}, true);

document.body.addEventListener('submit', function(e) {
    if (e.target.tagName === 'FORM') {
        const valid = y_validate_form(e.target);
        if (!valid) {
            e.preventDefault();
        }
    }
});

// --- Validation Functions (Same logic, cleaner implementation) ---

function y_validate_form(form) {
    let valid = true;
    let req = form.querySelectorAll('.required, .wpcf7-validates-as-required');
    if (req.length === 0) return valid;

    req.forEach(function(field) {
        const isValid = y_validate_field(field, 'submit');
        if (!isValid) valid = false;
    });

    if (!valid) {
        const firstError = form.querySelector('.error');
        if (firstError) firstError.focus();
    }
    return valid;
}

function get_placeholder(field) {
    return field.getAttribute('placeholder') || field.getAttribute('data-default-placeholder');
}

function y_validate_field(field, function_type, callback) {
    if (!field) return false;
    // Chain validation checks
    if (!y_check_req(field)) return runCallback(field, callback, false);
    if (!y_check_if_number(field)) return runCallback(field, callback, false);
    if (!isIsraeliMobileNumber(field)) return runCallback(field, callback, false);
    if (!y_check_email(field)) return runCallback(field, callback, false);
    if (!y_check_minlength(field)) return runCallback(field, callback, false);
    if (!y_password_confirm(field)) return runCallback(field, callback, false);

    return runCallback(field, callback, true);
}

function runCallback(field, callback, result) {
    if (callback && typeof callback === 'function') callback(field);
    return result;
}

function y_check_email(field) {
    if (field.value !== '' && (field.getAttribute('type') === 'email' || field.classList.contains('email'))) {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
            y_remove_error_msg(field);
        } else {
            let msg = y_translations.invalid_email;
            const placeholder = get_placeholder(field);
            if (placeholder) msg = placeholder + ': ' + msg;
            y_add_error_msg(field, msg);
            return false;
        }
    }
    return true;
}

function y_password_confirm(field) {
    if (field.classList.contains('password-confirm')) {
        const form = field.closest('form');
        const confirm_fields = form.querySelectorAll('.password-confirm');
        let filled = 0;
        confirm_fields.forEach(el => { if(el.value.length) filled++; });

        if (filled > 1) {
            let otherField = null;
            confirm_fields.forEach(el => { if(el !== field) otherField = el; });

            if (otherField && field.value !== otherField.value) {
                confirm_fields.forEach(el => y_add_error_msg(el, y_translations.passwords_not_match));
                return false;
            } else {
                confirm_fields.forEach(el => y_remove_error_msg(el));
            }
        }
    }
    return true;
}

function y_check_req(field) {
    const isRequired = field.classList.contains('required') || 
                       field.classList.contains('wpcf7-validates-as-required') || 
                       field.closest('.required') || 
                       field.closest('.wpcf7-validates-as-required');

    if (isRequired) {
        let targetField = field;
        if (!targetField.getAttribute('type')) {
            const innerInput = targetField.querySelector('[type]');
            if (innerInput) targetField = innerInput;
        }
        
        const type = targetField.getAttribute('type');
        let radioCheckboxEmpty = false;

        if (type === 'radio' || type === 'checkbox') {
            const name = targetField.getAttribute('name');
            const inputs = document.querySelectorAll(`input[name="${name}"]`);
            radioCheckboxEmpty = !Array.from(inputs).some(i => i.checked);
            
            if (!radioCheckboxEmpty) {
                 inputs.forEach(input => {
                    input.classList.remove('error');
                    // Remove label errors safely
                    const sibling = input.nextElementSibling;
                    if(sibling && sibling.classList.contains('label-error')) sibling.remove();
                 });
            }
        }

        let hasSiblingError = false;
        if (targetField.parentNode) {
            hasSiblingError = Array.from(targetField.parentNode.children).some(
                child => child !== targetField && child.classList.contains('wpcf7-not-valid-tip')
            );
        }

        if (radioCheckboxEmpty || targetField.value.trim() === '' || hasSiblingError) {
            if (!hasSiblingError) {
                let msg = y_translations.required_field;
                const placeholder = get_placeholder(targetField);
                if (placeholder) msg = placeholder + ' ' + y_translations.is + ' ' + msg;
                y_add_error_msg(targetField, msg);
            }
            return false;
        } else {
            y_remove_error_msg(targetField);
        }
    }
    return true;
}

function y_check_if_number(field) {
    if (field.getAttribute('type') === 'tel' && /[^0-9]/.test(field.value)) {
        let msg = y_translations.numbers_only;
        const placeholder = get_placeholder(field);
        if (placeholder) msg = placeholder + ': ' + msg;
        y_add_error_msg(field, msg);
        return false;
    }
    y_remove_error_msg(field);
    return true;
}

function y_check_minlength(field) {
    if (field.hasAttribute('minlength')) {
        const min = parseInt(field.getAttribute('minlength'), 10);
        if (field.value.length > 0 && field.value.length < min) {
            let min_word = (field.getAttribute('type') === 'tel') ? y_translations.numbers : y_translations.letters;
            let msg = y_translations.minimum + ' ' + min + ' ' + min_word;
            const placeholder = get_placeholder(field);
            if (placeholder) msg = placeholder + ': ' + msg;
            y_add_error_msg(field, msg);
            return false;
        }
        y_remove_error_msg(field);
    }
    return true;
}

function y_remove_error_msg(self) {
    let target = self;
    if (!target.classList.contains('wpcf7-validates-as-required') && target.closest('.wpcf7-validates-as-required')) {
        target = target.closest('.wpcf7-validates-as-required');
    }
    target.classList.remove('error');
    const nextEl = target.nextElementSibling;
    if (nextEl && nextEl.classList.contains('label-error')) nextEl.remove();
}

function y_add_error_msg(self, msg) {
    let target = self;
    if (!target.classList.contains('wpcf7-validates-as-required') && target.closest('.wpcf7-validates-as-required')) {
        target = target.closest('.wpcf7-validates-as-required');
    }
    const nextEl = target.nextElementSibling;
    if (nextEl && nextEl.classList.contains('label-error')) {
        nextEl.textContent = msg;
        nextEl.style.display = 'block';
    } else {
        const inputForId = target.querySelector('input') || target;
        if (!inputForId.getAttribute('id')) inputForId.setAttribute('id', y_new_input_id({input: inputForId}));
        
        const forid = 'for="' + inputForId.getAttribute('id') + '"';
        target.classList.add('error');
        const html = target.closest('label') 
            ? `<div ${forid} class="label-error error" style="display:block;">${msg}</div>`
            : `<label ${forid} class="label-error error" style="display:block;">${msg}</label>`;
        target.insertAdjacentHTML('afterend', html);
    }
}

function y_new_input_id(obj) {
    let name = obj.input.getAttribute('name') || 'input';
    let newID = name.replace(/[^a-zA-Z\-\_]/g, '') + (obj.num ? obj.num + 1 : 1);
    if (document.getElementById(newID)) return y_new_input_id({ input: obj.input, num: (obj.num || 1) });
    return newID;
}

function isIsraeliMobileNumber(field) {
    let phone_val = field.value.replace(/\D/g, '');
    if (phone_val.startsWith('972')) phone_val = '0' + phone_val.slice(3);

    if (phone_val.length && field.classList.contains('cell') && !/^05[0-9]{8}$/.test(phone_val)) {
        let msg = y_translations.cell;
        const placeholder = get_placeholder(field);
        if (placeholder) msg = placeholder + ': ' + msg;
        y_add_error_msg(field, msg);
        return false;
    }
    y_remove_error_msg(field);
    return true;
}

document.addEventListener('wpcf7submit', function(event) {
    if(event.detail && event.detail.apiResponse){
        event.detail.apiResponse.invalid_fields = [];
    }
});