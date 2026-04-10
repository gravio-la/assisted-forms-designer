import type { ToolIconComponent, ToolIconRegistry } from '@formswizard/types'
import type { ComponentType, SVGAttributes } from 'react'
import { SvgIcon, SxProps, Theme } from '@mui/material'

const defaultSvgStyles: SVGAttributes<SVGSVGElement> = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
}

const getVariantSvgStyles: (variant: 'outlined' | 'filled') => SVGAttributes<SVGSVGElement> = (
  variant
) => {
  switch (variant) {
    case 'outlined':
      return {
        fill: 'none',
        stroke: 'currentColor',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: '2',
      }
    case 'filled':
    default:
      return {
        fill: 'currentColor',
        stroke: 'none',
      }
  }
}

type SVGIconComponent = ComponentType<{
  variant?: 'outlined' | 'filled'
}>

const makeSvgIcon = (SvgComponent: SVGIconComponent): ToolIconComponent => {
  return ({ sx }) => <SvgIcon component={SvgComponent} sx={sx} />
}

/** Image frame + upload arrow — for draggable image / data-url field. */
const ImageUploadIconSvg: SVGIconComponent = ({ variant = 'outlined' }) => {
  if (variant === 'filled') {
    return (
      <svg {...defaultSvgStyles} fill="currentColor">
        <path d="M9 3h6l1 2h4a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l1-2zm3 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        <path d="M12 8v-4l3 3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    )
  }
  return (
    <svg {...defaultSvgStyles} {...getVariantSvgStyles(variant)}>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 8h.01" />
      <path d="M6 20h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.17L15 3H9L7.17 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
      <path d="M12 11v6" />
      <path d="M9 14l3 3l3-3" />
    </svg>
  )
}

const ImageUploadIcon = makeSvgIcon(ImageUploadIconSvg)

export const uploadToolsIcons: ToolIconRegistry = {
  ImageUpload: ImageUploadIcon,
}

export const icons = uploadToolsIcons
