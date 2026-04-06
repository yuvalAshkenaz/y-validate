# y-validate v4.0

A high-performance, zero-dependency Vanilla JS form validation library. Version 4.0 introduces Smart AJAX Detection, automatically managing loading states without requiring extra code from the developer.

## Key Features

- Zero-Config AJAX Loader: Automatically detects fetch or XMLHttpRequest completion to remove the loading state.
- INP Optimized: Uses a 300ms debounce to ensure validation doesn't block the main thread.
- Auto-Injected CSS: Styles for errors and loaders are injected automatically.
- WordPress Ready: Full native support for Contact Form 7 (wpcf7) validation classes.
- English and Hebrew Support: Toggle languages easily via URL parameters.

## Installation

Add the script before your closing </body> tag:
<script src="y-validate.js?lang=en"></script>

## Validation Rules

Add these classes or attributes to your HTML elements:

- Required: class="required" (Ensures the field is not empty)
- Email: type="email" (Validates standard email formats)
- Numbers Only: type="tel" (Blocks non-numeric characters)
- Israeli Mobile: class="cell" (Validates 05X-XXXXXXX formats)
- Passwords: class="password-confirm" (Ensures two password fields match)
- Min Length: minlength="X" (Enforces a minimum character count)

## Smart AJAX Loader (New in v4.0)

In version 4.0, the library intercepts network requests. When a form is submitted and valid:
1. The submit button is automatically disabled and shows a spinner.
2. The loader is removed automatically as soon as your AJAX request (Fetch or XHR) finishes.

Manual Override:
If you need to manually stop the loading state, use: y_hide_loader(formElement);

## JavaScript API

- y_validate_form(form): Validates an entire form manually. Returns true/false.
- y_add_error_msg(el, msg): Manually attaches an error message to a field.
- y_remove_error_msg(el): Manually removes an error message.
- y_blur_after_validate: A callback function you can define to run after a field's blur event.

Developed by: Yuval Ashkenazi
