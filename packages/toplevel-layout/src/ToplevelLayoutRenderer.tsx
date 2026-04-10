import {
  LayoutProps,
  Layout,
  OwnPropsOfLayout,
  RankedTester,
  UISchemaElement,
  rankWith,
  uiTypeIs,
} from '@jsonforms/core'
import { JsonFormsDispatch, withJsonFormsLayoutProps } from '@jsonforms/react'
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'
import type { ComponentType, MouseEvent, ReactNode } from 'react'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useJsonForms } from '@jsonforms/react'
import { i18nInstance } from '@formswizard/i18n'
import { ReactReduxContext } from 'react-redux'
import {
  selectPath,
  selectSelectedPath,
  setTopLevelShellColorTheme,
  useAppDispatch,
  useAppSelector,
} from '@formswizard/state'
import { ColorThemeId, getThemeOptionsForColorPreset, usesParentTopLevelTheme } from './colorThemes'
import { useAvailableFonts } from './AvailableFontsContext'

export type TopLevelLayoutUISchema = Layout & {
  type: 'TopLevelLayout'
  elements: UISchemaElement[]
  options?: {
    headline?: string
    description?: string
    colorTheme?: ColorThemeId
    /** Font family ID as registered in AvailableFontsProvider. When unset, the theme default is used. */
    fontFamily?: string
    /** Data URL of hero image */
    image?: string
    /** When true, card corners are square (no border radius). */
    disableRoundedBox?: boolean
    /**
     * MUI `Card` elevation 0–24. When unset, the layout uses its built-in default (6).
     */
    cardElevation?: number
    /**
     * When true, the outer `Container` uses full content width (`maxWidth={false}`).
     * Use for wide layouts (categorization, steppers). Default is a narrow column (`maxWidth="sm"`).
     */
    fullWidth?: boolean
  }
}

export function mergeLayoutOptions(
  config: Record<string, unknown> | undefined,
  uischema: TopLevelLayoutUISchema
): NonNullable<TopLevelLayoutUISchema['options']> {
  return {
    ...(config ?? {}),
    ...(uischema.options ?? {}),
  } as NonNullable<TopLevelLayoutUISchema['options']>
}

/** When `options.headline` is unset, show a localized default (same idea as former inline "My form"). */
function useDefaultTopLevelHeadline(headline: string | undefined): string {
  const ctx = useJsonForms()
  const translate = ctx?.i18n?.translate
  const [lang, setLang] = useState(() => i18nInstance.language)
  useEffect(() => {
    const onLang = () => setLang(i18nInstance.language)
    i18nInstance.on('languageChanged', onLang)
    return () => {
      i18nInstance.off('languageChanged', onLang)
    }
  }, [])

  return useMemo(() => {
    const raw = headline?.trim()
    if (raw) {
      return raw
    }
    const key = 'toplevelLayout.defaultHeadline'
    const fallback = 'My form'
    if (translate) {
      const v = translate(key, fallback)
      return (v !== undefined && v !== '' ? v : fallback) as string
    }
    const t = i18nInstance.t.bind(i18nInstance) as (k: string, o?: Record<string, unknown>) => string
    return String(t(key, { ns: 'toplevel-layout', defaultValue: fallback }))
  }, [headline, translate, lang])
}

/** Pushes a non-default TopLevel preset to Redux for the main column shell tint; clears when using parent theme. */
export function TopLevelShellThemeSync({ colorThemeId }: { colorThemeId: string }) {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(
      setTopLevelShellColorTheme(usesParentTopLevelTheme(colorThemeId) ? null : colorThemeId)
    )
  }, [dispatch, colorThemeId])
  return null
}

export type TopLevelLayoutControlProps = LayoutProps & {
  /** When set (designer shell), the card selects the layout for tool settings — same idea as MaterialEditableGroupLayout */
  onCardClick?: (event: MouseEvent) => void
  isSelected?: boolean
  /**
   * When set (e.g. edit-mode drop zone), replaces the default `elements` → `JsonFormsDispatch` stack.
   */
  renderBody?: () => ReactNode
}

/** Presentational shell: themed card, headline, optional hero image, and body area. */
export function TopLevelLayoutControl({
  uischema,
  schema,
  path,
  visible,
  renderers,
  cells,
  config,
  onCardClick,
  isSelected,
  renderBody,
}: TopLevelLayoutControlProps) {
  const layout = uischema as TopLevelLayoutUISchema
  const options = mergeLayoutOptions(config as Record<string, unknown> | undefined, layout)
  const {
    headline,
    description,
    colorTheme = 'default',
    fontFamily,
    image,
    disableRoundedBox,
    cardElevation: cardElevationOption,
    fullWidth,
  } = options
  const displayHeadline = useDefaultTopLevelHeadline(headline)

  const availableFonts = useAvailableFonts()
  const fontFamilyString = availableFonts.find((f) => f.id === fontFamily)?.fontFamily

  const resolvedElevation =
    typeof cardElevationOption === 'number' && Number.isFinite(cardElevationOption)
      ? Math.max(0, Math.min(24, Math.round(cardElevationOption)))
      : 6

  if (visible === false) {
    return null
  }

  const nestColorPresetTheme = !usesParentTopLevelTheme(colorTheme)
  const nestTheme = nestColorPresetTheme || !!fontFamilyString
  const nestedTheme = nestTheme
    ? createTheme({
        ...getThemeOptionsForColorPreset(colorTheme as ColorThemeId),
        ...(fontFamilyString ? { typography: { fontFamily: fontFamilyString } } : {}),
      })
    : null

  const elements = layout.elements ?? []

  const body = (
    <Box
      sx={{
        minHeight: '100%',
        width: '100%',
        py: { xs: 2, sm: 3 },
        px: { xs: 1, sm: 2 },
        bgcolor: 'transparent',
      }}
    >
      <Container maxWidth={fullWidth ? false : 'sm'} disableGutters>
        <Card
          elevation={resolvedElevation}
          onClick={onCardClick}
          sx={{
            overflow: 'hidden',
            borderRadius: disableRoundedBox ? 0 : 2,
            bgcolor: 'background.paper',
            cursor: onCardClick ? 'pointer' : undefined,
            transition: (t) =>
              t.transitions.create(['background-color', 'box-shadow'], {
                duration: t.transitions.duration.short,
              }),
            ...(isSelected
              ? {
                  boxShadow: (t) => t.shadows[8],
                  outline: (t) => `2px solid ${t.palette.primary.main}`,
                  outlineOffset: 2,
                }
              : {}),
            ...(onCardClick
              ? {
                  '&:hover': {
                    boxShadow: (t) => t.shadows[6],
                  },
                }
              : {}),
          }}
        >
          {image && (
            <CardMedia
              component="img"
              image={image}
              alt=""
              sx={{
                width: '100%',
                maxHeight: 220,
                objectFit: 'cover',
                pointerEvents: 'none',
              }}
            />
          )}
          <CardContent sx={{ px: { xs: 2, sm: 3 }, pt: 3, pb: 1, pointerEvents: onCardClick ? 'none' : undefined }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              {displayHeadline}
            </Typography>
            {description ? (
              <Typography variant="body1" color="text.secondary" paragraph>
                {description}
              </Typography>
            ) : null}
          </CardContent>
          <CardContent
            sx={{
              px: { xs: 2, sm: 3 },
              pt: 0,
              pb: 3,
              pointerEvents: 'auto',
            }}
          >
            {renderBody ? (
              renderBody()
            ) : (
              elements.map((el, index) => (
                <Box key={index} sx={{ mb: index < elements.length - 1 ? 2 : 0 }}>
                  <JsonFormsDispatch
                    schema={schema}
                    uischema={el}
                    path={path}
                    renderers={renderers}
                    cells={cells}
                  />
                </Box>
              ))
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  )

  if (nestedTheme) {
    return <ThemeProvider theme={nestedTheme}>{body}</ThemeProvider>
  }
  return body

}

/**
 * Designer: dispatch selection when the shell has a path (from extendUiSchemaWithPath).
 * Standalone Storybook / tests: no Redux → presentational only.
 */
export function TopLevelLayoutDesignerChrome(props: LayoutProps & { renderBody?: () => ReactNode }) {
  const dispatch = useAppDispatch()
  const selectedPath = useAppSelector(selectSelectedPath)
  const layout = props.uischema as TopLevelLayoutUISchema & { path?: string }
  const layoutPath = layout.path
  const { renderBody } = props

  const handleSelect = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation()
      if (layoutPath != null) {
        dispatch(selectPath(layoutPath))
      }
    },
    [dispatch, layoutPath]
  )

  const isSelected = layoutPath != null && selectedPath === layoutPath

  return (
    <TopLevelLayoutControl
      {...props}
      onCardClick={handleSelect}
      isSelected={isSelected}
      renderBody={renderBody}
    />
  )
}

/**
 * Shared root for default TopLevel renderer and edit-mode variants (e.g. drop zone): syncs shell
 * theme when a Redux store is present, and picks designer chrome vs plain shell so Storybook/tests
 * without a Provider do not call `useAppDispatch`.
 */
export function TopLevelLayoutRendererShell(props: LayoutProps & { renderBody?: () => ReactNode }) {
  const redux = useContext(ReactReduxContext)
  const layout = props.uischema as TopLevelLayoutUISchema & { path?: string }
  const hasDesignerPath = layout.path != null
  const merged = mergeLayoutOptions(
    props.config as Record<string, unknown> | undefined,
    layout as TopLevelLayoutUISchema
  )
  const shellThemeId = merged.colorTheme ?? 'default'

  const body =
    redux?.store && hasDesignerPath ? (
      <TopLevelLayoutDesignerChrome {...props} />
    ) : (
      <TopLevelLayoutControl {...props} />
    )

  return (
    <>
      {redux?.store ? <TopLevelShellThemeSync colorThemeId={shellThemeId} /> : null}
      {body}
    </>
  )
}

function ToplevelLayoutRendererInner(props: LayoutProps) {
  return <TopLevelLayoutRendererShell {...props} />
}

const ToplevelLayoutRendererWithProps = withJsonFormsLayoutProps(
  ToplevelLayoutRendererInner
) as ComponentType<LayoutProps & OwnPropsOfLayout>

export const ToplevelLayoutRenderer = ToplevelLayoutRendererWithProps

export const toplevelLayoutTester: RankedTester = rankWith(3, uiTypeIs('TopLevelLayout'))

export const toplevelLayoutRendererEntry = {
  tester: toplevelLayoutTester,
  renderer: ToplevelLayoutRenderer,
}
