# y-validate v4.4

A high-performance, zero-dependency Vanilla JS form validation library. Version 4.0 introduces Smart AJAX Detection, automatically managing loading states without requiring extra code from the developer.

## 🔗 Live Demo
Check out the library in action: [https://y-tools.dooble.us/y-validate/demo.html](https://y-tools.dooble.us/yvalidate/)

## ✨ Key Features

- Zero-Config AJAX Loader: Automatically detects fetch or XMLHttpRequest completion to remove the loading state.
- INP Optimized: Uses a 300ms debounce to ensure validation doesn't block the main thread.
- Auto-Injected CSS: Styles for errors and loaders are injected automatically.
- WordPress Ready: Full native support for Contact Form 7 (wpcf7) validation classes.

## 🚀 Installation

Add the script before your closing body tag:
<script src="y-validate.js?lang=en"></script>

## 🛠️ Validation Rules (Classes & Attributes)

| Feature | Class / Attribute | Description |
| :--- | :--- | :--- |
| Required | class="required" | Ensures the field is not empty. |
| Email | type="email" | Validates standard email formats. |
| Numbers Only | type="tel" | Blocks non-numeric characters. |
| Israeli Mobile | class="cell" | Validates 05X-XXXXXXX formats. |
| Passwords | class="password-confirm" | Ensures two password fields match. |
| Min Length | minlength="X" | Enforces a minimum character count. |
| Submit Loader | class="y-has-loader" | Enables the automatic loading animation on the submit button. |

## 🔄 Smart AJAX Loader

<p>The library intercepts network requests to prevent double-submissions and provide visual feedback.</p>
<p>To enable this feature, <b>you must add the <code>y-has-loader</code> class to your form's submit button</b>.</p>
<p>When a form is submitted and valid:</p>
<ol start="1" data-path-to-node="7"><li><p data-path-to-node="7,0,0">The submit button (with the <code data-path-to-node="7,0,0" data-index-in-node="28">y-has-loader</code> class) is automatically disabled and shows a spinner.</p></li><li><p data-path-to-node="7,1,0">The loader is removed automatically as soon as your AJAX request (Fetch or XHR) finishes.</p></li></ol>

Manual Override:
If you need to manually stop the loading state, use: y_hide_loader(formElement);

## ⚙️ JavaScript API Functions

| Function | Purpose |
| :--- | :--- |
| y_validate_form(form) | Validates an entire form manually. Returns true/false. |
| y_add_error_msg(el, msg) | Manually attaches an error message to a field. |
| y_remove_error_msg(el) | Manually removes an error message. |
| y_hide_loader(form) | Manually removes the loading state from the submit button. |
| y_blur_after_validate | A callback function you can define to run after a field's blur event. |

---
Developed by: Yuval Ashkenazi
