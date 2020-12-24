import { h, defineComponent, computed } from 'vue'

import { hSlot } from '../../utils/render.js'

const alignValues = [ 'top', 'middle', 'bottom' ]

export default defineComponent({
  name: 'QBadge',

  props: {
    color: String,
    textColor: String,

    floating: Boolean,
    transparent: Boolean,
    multiLine: Boolean,
    outline: Boolean,

    label: [ Number, String ],

    align: {
      type: String,
      validator: v => alignValues.includes(v)
    }
  },

  setup (props, { slots }) {
    const style = computed(() => {
      return props.align !== void 0
        ? { verticalAlign: props.align }
        : null
    })

    const classes = computed(() => {
      const text = props.outline === true
        ? props.color || props.textColor
        : props.textColor

      return 'q-badge flex inline items-center no-wrap'
        + ` q-badge--${ props.multiLine === true ? 'multi' : 'single' }-line`
        + (props.outline === true
          ? ' q-badge--outline'
          : (props.color !== void 0 ? ` bg-${ props.color }` : '')
        )
        + (text !== void 0 ? ` text-${ text }` : '')
        + (props.floating === true ? ' q-badge--floating' : '')
        + (props.transparent === true ? ' q-badge--transparent' : '')
    })

    return () => h('div', {
      class: classes.value,
      style: style.value,
      role: 'alert',
      'aria-label': props.label
    }, props.label !== void 0 ? props.label : hSlot(slots.default))
  }
})
