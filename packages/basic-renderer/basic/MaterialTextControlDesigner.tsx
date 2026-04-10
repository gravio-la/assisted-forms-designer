import React from 'react'
import { ControlProps, isStringControl, RankedTester, rankWith } from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import { MaterialInputControl } from '@jsonforms/material-renderers'
import { MuiInputTextDesigner } from './MuiInputTextDesigner'

const MaterialTextControlDesignerInner = (props: ControlProps) => (
  <MaterialInputControl {...props} input={MuiInputTextDesigner} />
)

/** Wrapped for JsonForms; must be a named export (package entry uses `export *`, no default re-export). */
export const MaterialTextControlDesigner = withJsonFormsControlProps(MaterialTextControlDesignerInner)

/** Beats stock MaterialTextControl (rank 1) to apply minRows for multiline. */
export const materialTextControlDesignerTester: RankedTester = rankWith(2, isStringControl)
