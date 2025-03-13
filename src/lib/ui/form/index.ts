import * as FormSnap from "formsnap";

import FieldErrors from "./form-field-errors.svelte";
import Field from "./form-field.svelte";
import Fieldset from "./form-fieldset.svelte";
import Hint from "./form-hint.svelte";
import Label from "./form-label.svelte";
import Legend from "./form-legend.svelte";
import Root from "./form.svelte";

const Control = FormSnap.Control;

export const Form = { Root, Control, Field, Fieldset, FieldErrors, Label, Legend, Hint };
