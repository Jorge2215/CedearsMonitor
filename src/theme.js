import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    brand: {
      50:  '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
    },
    pastel: {
      green:  '#D1FAE5',
      red:    '#FEE2E2',
      purple: '#EDE9FE',
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
      focus:   '#3B82F6',
    },
  },
  fonts: {
    heading: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    body:    `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    mono:    `'JetBrains Mono', 'Fira Code', monospace`,
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
  },
  shadows: {
    card:  '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
    focus: '0 0 0 3px rgba(59, 130, 246, 0.20)',
  },
  styles: {
    global: {
      body: {
        bg:         'bg.page',
        color:      'text.primary',
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
      defaultProps: { colorScheme: 'brand' },
      baseStyle: {
        fontWeight:   600,
        borderRadius: 'sm',
      },
      sizes: {
        md: { h: '40px', px: '24px', fontSize: 'md' },
      },
    },
    Select: {
      baseStyle: {
        field: {
          borderRadius: 'sm',
          borderColor:  'border.default',
          fontSize:     'md',
          _focus: {
            borderColor: 'brand.500',
            boxShadow:   'focus',
          },
        },
      },
    },
    Table: {
      variants: {
        cedear: {
          th: {
            bg:              'bg.subtle',
            color:           'text.secondary',
            fontSize:        'sm',
            fontWeight:      600,
            textTransform:   'uppercase',
            letterSpacing:   '0.04em',
            borderBottomWidth: '2px',
            borderColor:     'border.default',
            px: '16px',
            py: '10px',
          },
          td: {
            fontSize:        'md',
            color:           'text.primary',
            borderBottomWidth: '1px',
            borderColor:     'border.default',
            px: '16px',
            py: '10px',
          },
          tr: {
            _even:  { bg: 'bg.surface' },
            _odd:   { bg: 'bg.subtle' },
            _hover: { bg: 'brand.50', cursor: 'default' },
          },
        },
      },
    },
  },
})

export default theme
