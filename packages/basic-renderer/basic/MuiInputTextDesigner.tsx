/**
 * Like @jsonforms/material-renderers MuiInputText, but passes `minRows` / `maxRows`
 * from uiSchema.options for multiline TextField height.
 */
import React, { useState } from 'react'
import { CellProps, WithClassname } from '@jsonforms/core'
import { IconButton, InputAdornment, InputBaseComponentProps, InputProps, useTheme } from '@mui/material'
import merge from 'lodash-es/merge'
import { Close } from '@mui/icons-material'
import {
  JsonFormsTheme,
  WithInputProps,
  useDebouncedChange,
  useInputComponent,
  useFocus,
} from '@jsonforms/material-renderers'

interface MuiTextInputProps {
  muiInputProps?: InputProps['inputProps']
  inputComponent?: InputProps['inputComponent']
}

const eventToValue = (ev: any) => (ev.target.value === '' ? undefined : ev.target.value)

export const MuiInputTextDesigner = React.memo(function MuiInputTextDesigner(
  props: CellProps & WithClassname & MuiTextInputProps & WithInputProps
) {
  const [focused, onFocus, onBlur] = useFocus()
  const [showAdornment, setShowAdornment] = useState(false)
  const {
    data,
    config,
    className,
    id,
    enabled,
    uischema,
    isValid,
    path,
    handleChange,
    schema,
    muiInputProps,
    inputComponent,
    label,
  } = props
  const InputComponent = useInputComponent()
  const maxLength = schema.maxLength
  const appliedUiSchemaOptions = merge({}, config, uischema.options)
  let inputProps: InputBaseComponentProps
  if (appliedUiSchemaOptions.restrict) {
    inputProps = { maxLength: maxLength }
  } else {
    inputProps = {}
  }

  inputProps = merge(inputProps, muiInputProps)

  if (appliedUiSchemaOptions.trim && maxLength !== undefined) {
    inputProps.size = maxLength
  }

  const [inputText, onChange, onClear] = useDebouncedChange(
    handleChange,
    '',
    data,
    path,
    eventToValue,
    undefined,
    true,
    focused
  )
  const onPointerEnter = () => setShowAdornment(true)
  const onPointerLeave = () => setShowAdornment(false)

  const theme: JsonFormsTheme = useTheme()

  const closeStyle = {
    background: theme.jsonforms?.input?.delete?.background || theme.palette.background.default,
    borderRadius: '50%',
  }

  const multiline = Boolean(appliedUiSchemaOptions.multi)
  const minRows = multiline
    ? appliedUiSchemaOptions.minRows != null && Number.isFinite(Number(appliedUiSchemaOptions.minRows))
      ? Number(appliedUiSchemaOptions.minRows)
      : 2
    : undefined
  const maxRows =
    multiline && appliedUiSchemaOptions.maxRows != null && Number.isFinite(Number(appliedUiSchemaOptions.maxRows))
      ? Number(appliedUiSchemaOptions.maxRows)
      : undefined

  return (
    <InputComponent
      label={label}
      type={appliedUiSchemaOptions.format === 'password' ? 'password' : 'text'}
      value={inputText}
      onChange={onChange}
      className={className}
      onBlur={onBlur}
      onFocus={onFocus}
      id={id}
      disabled={!enabled}
      autoFocus={appliedUiSchemaOptions.focus}
      multiline={multiline}
      minRows={minRows}
      maxRows={maxRows}
      fullWidth={!appliedUiSchemaOptions.trim || maxLength === undefined}
      inputProps={inputProps}
      error={!isValid}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      endAdornment={
        <InputAdornment
          position="end"
          style={{
            display: !showAdornment || !enabled || data === undefined ? 'none' : 'flex',
            position: 'absolute',
            right: 0,
          }}
        >
          <IconButton aria-label="Clear input field" onClick={onClear} size="large">
            <Close style={closeStyle} />
          </IconButton>
        </InputAdornment>
      }
      inputComponent={inputComponent}
    />
  )
})
