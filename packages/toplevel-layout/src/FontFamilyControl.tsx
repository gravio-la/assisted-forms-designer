import {
  and,
  type ControlProps,
  type JsonSchema,
  type RankedTester,
  rankWith,
  schemaMatches,
  uiTypeIs,
} from '@jsonforms/core'
import { withJsonFormsControlProps } from '@jsonforms/react'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material'
import { useId } from 'react'
import { useAvailableFonts } from './AvailableFontsContext'

function FontFamilyControlInner({
  data,
  handleChange,
  path,
  label,
  visible,
  enabled,
}: ControlProps) {
  const fonts = useAvailableFonts()
  const labelId = useId()

  if (!visible || fonts.length === 0) {
    return null
  }

  const currentValue = (data as string | undefined) ?? 'default'

  const onChange = (e: SelectChangeEvent<string>) => {
    const val = e.target.value
    handleChange(path, val === 'default' ? undefined : val)
  }

  return (
    <FormControl fullWidth margin="dense" size="small">
      <InputLabel id={labelId}>{label || 'Font'}</InputLabel>
      <Select
        labelId={labelId}
        value={currentValue}
        label={label || 'Font'}
        onChange={onChange}
        disabled={!enabled}
      >
        <MenuItem value="default">
          <em>Default</em>
        </MenuItem>
        {fonts.map((font) => (
          <MenuItem key={font.id} value={font.id} style={{ fontFamily: font.fontFamily }}>
            {font.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export const FontFamilyControl = withJsonFormsControlProps(FontFamilyControlInner)

export const fontFamilyControlTester: RankedTester = rankWith(
  10,
  and(
    uiTypeIs('Control'),
    schemaMatches((schema) => {
      const s = schema as JsonSchema | undefined
      return !!(s && typeof s === 'object' && (s as { format?: string }).format === 'font-family')
    })
  )
)

export const fontFamilyControlEntry = {
  tester: fontFamilyControlTester,
  renderer: FontFamilyControl,
}
