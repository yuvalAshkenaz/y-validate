# y-validate 4.7.1

**y-validate** is a lightweight, dependency-free form validation library built with **Vanilla JavaScript**.
It validates required fields, email, phone numbers, minimum length and password confirmation, shows the error message right under the field, and works out of the box with **Contact Form 7**.

> Files: `yvalidate.js` (the library), `demo.html` / `index.php` + `demo.css` (demo and documentation page).

---

## ✨ Key Features

- **Zero Dependencies** — pure JavaScript, no jQuery required.
- **Contact Form 7 compatible** — supports `wpcf7-validates-as-required` and clears the server-side invalid fields so only y-validate messages are shown.
- **Hebrew & English** — error messages in both languages, language picked automatically (see [Language](#-language)).
- **Israeli mobile validation** — `class="cell"`.
- **Submit button loader** — `class="y-has-loader"`, with a manual `y_hide_loader()` for AJAX.
- **Accessible** — every message is a `label` linked to its field with `for`, and focus moves to the first invalid field on submit.
- **Fast** — debounced `input` listener (300ms) to keep INP low.
- **Customizable** — error colors, sizes and the select2 / checkbox layout are controlled with CSS variables.

---

## 🆕 What's New in 4.7.1

- **Language from the page** — the language is now taken from the `lang` attribute of the `<html>` tag (for example `he-IL`) unless the `lang` parameter exists in the script URL.
- **Wider Hebrew detection** — any `lang` value that starts with `he` (`he`, `he-IL`, `he_IL`, in any letter case) loads the Hebrew messages.
- **No crash without `document.currentScript`** — when the script is injected dynamically, the library falls back to the `<html lang>` attribute instead of throwing an error.
- The `?lang=` parameter is no longer required, but it still works and always takes priority.

## 🆕 What's New in 4.7

- **Submit button loader** — `y-has-loader` class with a CSS spinner (`y-btn-loading`) and a `y_hide_loader( form )` function for AJAX forms. The loader is skipped when a Contact Form 7 spinner already exists next to the button.
- **Better INP** — the `input` handler is debounced and replaces the old `keyup` listener.
- **Validation helpers** — `y_validate_form`, `y_validate_field`, `y_add_error_msg` and `y_remove_error_msg` are available globally.
- **`y_blur_after_validate( field )`** — optional callback called after a field is validated on blur.

---

## 🚀 Installation

```html
<script src="yvalidate.js"></script>
```

Load it at the end of the `<body>` (or with `defer`), because the library attaches its listeners to `document.body` when it runs.

### WordPress

```php
wp_enqueue_script( 'y-validate', get_template_directory_uri() . '/build/js/yvalidate.js', array(), THEME_VER, true );
```

---

## 🌐 Language

The library picks the language in this order:

1. The `lang` parameter in the script URL — `yvalidate.js?lang=he` or `yvalidate.js?lang=en`.
2. The `lang` attribute of the `<html>` tag — `<html lang="he-IL">`.
3. English, when neither exists.

Any value that starts with `he` loads the Hebrew messages. Any other value loads the English messages.

---

## 📋 Classes & Attributes

| Usage | Description |
|---|---|
| `class="required"` / `required` | The field must not be empty. Works with text, textarea, select, radio and checkbox groups. |
| `class="wpcf7-validates-as-required"` | Contact Form 7 required field. |
| `type="email"` or `class="email"` | Checks for a valid email format. |
| `class="cell"` | Israeli mobile number (`05X-XXXXXXX`). A leading `972` is accepted. |
| `type="tel"` | Numbers only. |
| `minlength="N"` | Minimum number of characters (or digits for `tel`). |
| `class="password-confirm"` | Add to both password fields — they must match. |
| `class="y-has-loader"` | On the submit button — shows a loading spinner after a valid submit and prevents double submissions. |

Messages include the field placeholder when it exists (or the first option of a `select`), for example `Email: Invalid email`.

---

## 🛠 JavaScript API

```js
// Validate a whole form (returns true / false)
let isValid = y_validate_form( formElement );

// Validate a single field
y_validate_field( field );

// Add or remove an error message
y_add_error_msg( field, 'Your custom message' );
y_remove_error_msg( field );

// Called after a field is validated on blur
function y_blur_after_validate( field ) { ... }

// Stop the submit button loader (for AJAX forms)
y_hide_loader( formElement );
```

---

## 🎨 Styling with CSS variables

All variables are optional and have a default.

| Variable | Default | Description |
|---|---|---|
| `--error-text-color` | `red` | Text color of an invalid field. |
| `--error-border-color` | `red` | Border color of an invalid field. |
| `--error-bg-color` | `#fef2f2` | Background of an invalid field. |
| `--error-placeholder-opacity` | `1` | Placeholder opacity in an invalid field. |
| `--error-label-color` | `red` | Color of the error message. |
| `--error-label-font-size` | `14px` | Font size of the error message. |
| `--error-font-size` | `14px` | Font size of the Contact Form 7 tip. |
| `--error-tip-display` | `none` | Display of the duplicated Contact Form 7 tips. |
| `--label-error-width` / `--label-error-order` | `100%` / `2` | Layout of the error message. |
| `--select2-wrap-position`, `--select2-label-error-position`, `--select2-label-error-bottom`, `--select2-error-margin-bottom` | — | select2 support. |
| `--checkbox-label-display`, `--checkbox-label-wrap`, `--checkbox-label-gap`, `--checkbox-label-align`, `--checkbox-input-margin` | — | Contact Form 7 checkbox layout. |
| `--wpcf7-checkbox-label-outline-width` / `-style` / `-color` | `2px` / `solid` / `#000` | Focus outline of a checkbox label. |

The loader is styled with the `.y-btn-loading` class (spinner color: white).

---

## 📝 Changelog

- **4.7.1** — language from `<html lang>` unless the script URL has a `lang` parameter; safer language detection.
- **4.7** — submit button loader, debounced input validation, `y_blur_after_validate`, `y_hide_loader`.
