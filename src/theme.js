import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  fonts: {
    heading: `'Poppins', sans-serif`,
    body:    `'Poppins', sans-serif`,
  },
  colors: {
    brand: {
      primary:      '#06B6D4',
      primaryDark:  '#0891B2',
      primaryLight: '#CFFAFE',
      coral:        '#F97316',
      coralDark:    '#EA580C',
      lime:         '#84CC16',
      lavender:     '#C4B5FD',
      yellow:       '#FEF08A',
      pink:         '#FBCFE8',
    },
    bg: {
      page:    '#F8FAFC',
      surface: '#FFFFFF',
      subtle:  '#F1F5F9',
    },
    text: {
      primary:   '#0F172A',
      secondary: '#64748B',
      muted:     '#94A3B8',
    },
    border: {
      default: '#E2E8F0',
    },
  },
  fontSizes: {
    xs:   '12px',
    sm:   '13px',
    md:   '14px',
    lg:   '16px',
    xl:   '18px',
    '2xl':'24px',
    '3xl':'32px',
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '20px',
    full: '9999px',
  },
  shadows: {
    card: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
    sm:   '0 1px 2px rgba(0,0,0,0.05)',
    md:   '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
    lg:   '0 10px 25px rgba(0,0,0,0.10)',
  },
  styles: {
    global: {
      body: {
        bg:         'bg.page',
        color:      'text.primary',
        fontFamily: `'Poppins', sans-serif`,
        fontSize:   '14px',
        lineHeight: '1.6',
      },
      '*': {
        boxSizing: 'border-box',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'full',
        fontWeight:   '600',
        _focus: { boxShadow: 'none' },
      },
      variants: {
        solid: {
          bg:    'brand.coral',
          color: 'white',
          _hover: {
            bg:        'brand.coralDark',
            transform: 'translateY(-1px)',
            boxShadow: 'md',
            _disabled: { bg: 'brand.coral', transform: 'none', boxShadow: 'none' },
          },
          _active:   { transform: 'translateY(0)' },
          transition: 'all 0.2s',
        },
        outline: {
          borderColor: 'brand.primary',
          color:       'brand.primary',
          _hover:      { bg: 'brand.primaryLight' },
        },
      },
      defaultProps: { variant: 'solid' },
      sizes: {
        md: { h: '40px', px: '24px', fontSize: 'md' },
      },
    },
    Select: {
      baseStyle: {
        field: {
          borderRadius: 'lg',
          borderColor:  'border.default',
          fontSize:     'md',
          _focus: {
            borderColor: 'brand.primary',
            boxShadow:   '0 0 0 3px rgba(6,182,212,0.20)',
          },
        },
      },
    },
    Table: {
      variants: {
        cedear: {
          th: {
            bg:            'brand.primary',
            color:         'white',
            fontWeight:    '600',
            fontSize:      'sm',
            letterSpacing: 'wide',
            textTransform: 'none',
            borderColor:   'brand.primaryDark',
            px: '16px',
            py: 4,
          },
          td: {
            fontSize:    'sm',
            color:       'text.primary',
            borderColor: 'border.default',
            px: '16px',
            py: 3,
          },
          tr: {
            _even:  { bg: 'bg.subtle' },
            _odd:   { bg: 'bg.surface' },
            _hover: { bg: 'brand.primaryLight', cursor: 'default', transition: 'background 0.15s' },
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow:    'sm',
          border:       '1px solid',
          borderColor:  'border.default',
          bg:           'bg.surface',
        },
      },
    },
  },
})

export default theme
